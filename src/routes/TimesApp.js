import React, { Component } from 'react'


import TimesSectionOpeningOptions from '../components/TimesSectionOpeningOptions'
import TimesSectionWeek from '../components/TimesSectionWeek';
import AccountHeader from '../components/AccountHeader'
import MainMenu from '../components/MainMenu'
import AppStatus from '../components/AppStatus'
import MenuSubmit from '../components/MenuSubmit'
import api from '../lib/SwitchboardAPI';

    export default class TimesApp extends Component
{
    constructor (props){
    super(props)
    this.id = "7021a27d04454b5fa817a2c391bff69e" //temp 
    this.state = {localChanges: false, status: "loading" }
    this.handleOpeningOptionsChange=this.handleOpeningOptionsChange.bind(this)
    this.handleTimeChange=this.handleTimeChange.bind(this)
    this.handlerApi=this.handlerApi.bind(this)     
    this.handlerRevertChanges=this.handlerRevertChanges.bind(this) 
    this.handlerApplyChanges=this.handlerApplyChanges.bind(this) 
    }

    componentDidMount() {
        this.setState( {status: "loading"} )
        api.readTimes(this.id, this.handlerApi)
    }

    handlerApi(response) {
        this.setState( state => response )
      }
    

    handleOpeningOptionsChange(newOption) {
        this.setState( {routeOption: newOption})      
        this.flagLocalChange()
    }

    handleTimeChange(groupId, day, field, newValue) {
        if (field === "active") { //handle 'activate' checkbox's
            if (groupId==='openHours' && newValue===false) {
                this.flagLocalChange()
                this.setState( state => { //de-activate lunchHours if openHours marked inactive 
                    state.schedule['openHours'][day]['active'] = false 
                    state.schedule['lunchHours'][day]['active'] = false 
                    return state} )
            } else if (groupId==='lunchHours' && newValue===true) { //only allow activation of lunchHours if openHours is active 
                this.flagLocalChange()
                this.setState( state => { 
                    if(state.schedule['openHours'][day]['active'] === true ){
                        if(state.schedule['lunchHours'][day]['begin'] < state.schedule['openHours'][day]['begin'] ){
                            state.schedule['lunchHours'][day]['begin'] = state.schedule['openHours'][day]['begin'] //reset lunchHours if overlap
                            if (state.schedule['lunchHours'][day]['end'] < state.schedule['openHours'][day]['begin']) {
                                state.schedule['lunchHours'][day]['end'] = state.schedule['openHours'][day]['begin']
                            }
                        }
                        if(state.schedule['lunchHours'][day]['end'] > state.schedule['openHours'][day]['end']   ){
                            state.schedule['lunchHours'][day]['end'] = state.schedule['openHours'][day]['end'] //reset lunchHours if overlap
                            if (state.schedule['lunchHours'][day]['begin'] > state.schedule['openHours'][day]['end']) {
                                state.schedule['lunchHours'][day]['begin'] = state.schedule['openHours'][day]['end']
                            }
                        }                        
                        state.schedule[groupId][day][field] = newValue ;  
                        return state
                    }
                })        
            } else {
                this.flagLocalChange()
                this.setState( state => state.schedule[groupId][day][field] = newValue )        
            }
        } else { //handle change of begin/end time 
            if (groupId === "openHours") { 
                if (field === "begin") {   //handle time change for opening Hours begin 
                    this.flagLocalChange()
                    this.setState( state => { 
                        if ( newValue < state.schedule['openHours'][day]['end']){ //open time must be less than closing time
                             if ( newValue < state.schedule['lunchHours'][day]['begin'] && state.schedule['lunchHours'][day]['active'] ) { //and less than lunch begin time if active
                                state.schedule[groupId][day][field] = newValue   
                                return state
                            } else if (!state.schedule['lunchHours'][day]['active']) {
                                state.schedule[groupId][day][field] = newValue   
                                return state
                            }
                        }
                    })        
                } else {  //handle time change for opening Hours end
                    this.flagLocalChange()
                    this.setState( state => { 
                        if ( newValue > state.schedule['openHours'][day]['begin']){ //closing must be more than opening 
                            if ( newValue > state.schedule['lunchHours'][day]['end'] && state.schedule['lunchHours'][day]['active'] ) { //and more than lunch begin time if active
                                state.schedule[groupId][day][field] = newValue   
                                return state
                            } else if (!state.schedule['lunchHours'][day]['active']) {
                                state.schedule[groupId][day][field] = newValue   
                                return state
                            }
                        }
                    })        
                }
            } else { //lunch Hours 
                if (field === "begin") {   //handle time change for lunch Hours begin 
                    this.flagLocalChange()
                    this.setState( state => { 
                        if ( newValue > state.schedule['openHours'][day]['begin'] && newValue < state.schedule['lunchHours'][day]['end'] ){
                            state.schedule[groupId][day][field] = newValue ;  return state
                        }
                    })        
                } else {   //handle time change for lunch Hours end
                    this.flagLocalChange()
                    this.setState( state => { 
                        if ( newValue > state.schedule['lunchHours'][day]['begin'] && newValue < state.schedule['openHours'][day]['end'] ){
                            state.schedule[groupId][day][field] = newValue ;  return state
                        }
                    })        
                }
            }
        }
    }

    flagLocalChange(){
        this.setState( {localChanges:true, status: "modified" } )
    }
  
    handlerRevertChanges(){
        this.setState( {localChanges: false, status: "loading"} )
        api.readTimes(this.id, this.handlerApi)
    }

    handlerApplyChanges(){
        this.setState( {localChanges: false, status: "uploading" } )
        const timesData = {number: this.state.number, schedule: this.state.schedule, routeOption: this.state.routeOption}
        api.updateTimes(this.id, timesData,this.handlerApi)
    }

  
    render() {
        return(
            <div>
            <AccountHeader switchboardNumber={this.state.number}/>
            <MainMenu/>
            <AppStatus status={this.state.status} />            
            { this.state.localChanges && <MenuSubmit onRevert={this.handlerRevertChanges} onApply={this.handlerApplyChanges}/>}
            { this.state.status !== 'loading' && <TimesSectionOpeningOptions selected={this.state.routeOption} onChange={this.handleOpeningOptionsChange} />}
            {this.state.routeOption==="scheduled" && <TimesSectionWeek schedule={this.state.schedule} onChange={this.handleTimeChange} />}
            </div>
        )
    }
    
}