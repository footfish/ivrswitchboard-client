import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { faMinusSquare, faSquare } from '@fortawesome/free-regular-svg-icons'

export default class MenuActionSelect extends React.Component {
constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)    
}

handleChange(e){
    this.props.onChange(e.target.name, this.props.index, e.target.value )
}

handleDeleteClick(){
    this.props.onDeleteClick(this.props.index)
}

render(){
    const selectOptions=[{ value: "playRecording", label: "Play Recording"},
                        { value: "forwardToNumber", label: "Forward to number"},
                        { value: "forwardToNumberWhisper", label: "Forward to number + whisper"},
                        { value: "forwardToNumberConfirm", label: "Forward to number + confirm"}, 
                        { value: "voicemailToEmail", label: "Voicemail then email to"},
                        { value: "notifyEmail", label:  "Send email Notification"}, 
                        { value: "analytics", label: "Graph analytics"}, 
                        { value: "backToMenu", label: "Go back to Greeting"}]
    
    

    return (
        <div class="form-row align-items-center">
           <Bullet onClick={this.handleDeleteClick} index={this.props.index}/>
        <div class="col col-auto py-1">
                <select name="action" class="form-control" onChange={this.handleChange}>
                {selectOptions.map( (option) => <option  selected={this.props.settings.action===option.value && true} value={option.value}>{option.label}</option>)}
                </select>
        </div>
        <Action action={this.props.settings.action} settings={this.props.settings} recordingOptions={this.props.recordingOptions} onChange={this.handleChange}/>
        </div>
    )
}
}

const Action = ({action, settings, recordingOptions, onChange}) => {
    switch(action){
        case "playRecording": 
            return(<PlayRecording settings={settings} recordingOptions={recordingOptions} onChange={onChange}/>)
        case "forwardToNumber" :
            return(<ForwardToNumber settings={settings} onChange={onChange}/>)
        case "forwardToNumberConfirm" :
            return(<ForwardToNumberConfirm settings={settings} onChange={onChange}/>)
        case "forwardToNumberWhisper" :
            return(<ForwardToNumberWhisper settings={settings} onChange={onChange}/>)
        case "voicemailToEmail" :
            return(<VoicemailToEmail settings={settings} onChange={onChange}/>)
        case "notifyEmail" :
            return(<NotifyEmail settings={settings} onChange={onChange}/>)
        case "analytics" :
            return(<Analytics settings={settings} onChange={onChange}/>)
        default:
            return(<div class="col col-auto"></div>)
    }

}

const Bullet = ({index, onClick}) => {
    const bulletFont = [faSquare, faMinusSquare]
    let bulletState = 1
    if (index === 0) {
        bulletState = 0
        }
            return(
                <div class="col col-auto">
                <button onClick={onClick} type="button" class="btn btn-light btn-sm" disabled={bulletState===0 ? true : false}><span class="text-primary">
                <FontAwesomeIcon icon={bulletFont[bulletState]} size="lg"/> 
                </span></button> 
                </div>
            )
}


const PlayRecording = ({settings, recordingOptions, onChange}) => { 
    let audioTag = React.createRef();
    const playSound = () => (audioTag.current.currentTime > 0 && !audioTag.current.paused) ? audioTag.current.pause() : audioTag.current.play()  
    return(
    <>
    <div class="col col-auto" >
        <select name="recordingId" class="form-control" onChange={onChange}>
         {recordingOptions.map( (recording, idx) => <option value={idx} selected={settings.recordingId===idx && true}>{recording.label}</option>)}
        </select>
    </div>

    <div class="col col-auto">

    <audio ref={audioTag} id="PlaybackPlayer" src={recordingOptions[settings.recordingId].src} type="audio/mpeg"></audio>
        <div>
        <button  type="button" class="btn btn-light btn-sm rounded-circle" onClick={playSound}>
        <span class="text-primary"><FontAwesomeIcon icon={faVolumeUp} size="lg"/></span>
        </button>
        </div>
    </div>
    </>
    
    )}

const ForwardToNumber = ({settings, onChange}) => {
    const secondsOptions = [5,10,15,20,25,30,40,50,60,80,100,120]
    return (
    
    <><div class="col col-auto">
    <input type="text" class={validatePhonenumber(settings.number) ? "form-control" : "form-control is-invalid"} value={settings.number} name="number" autocomplete="number" placeholder="Enter a phone number" onChange={onChange}/>
    </div>
    <div class="col col-auto">
        <select name="ringTimer" class="form-control" onChange={onChange}>
        {secondsOptions.map( (option) => <option  selected={settings.ringTimer===option?true:false} value={option}>{option+' sec'}</option>)}
        </select>
    </div></>
    
)}

const ForwardToNumberWhisper = ({settings, onChange}) => {
    const secondsOptions = [5,10,15,20,25,30,40,50,60,80,100,120]
    return (
    
    <><div class="col col-auto">
    <input type="text" class={validatePhonenumber(settings.number) ? "form-control" : "form-control is-invalid"} value={settings.number} name="number"  autocomplete="number" placeholder="Enter a phone number" onChange={onChange}/>
    </div>
    <div class="col col-auto">
        <select name="ringTimer" class="form-control" onChange={onChange}>
        {secondsOptions.map( (option) => <option  selected={settings.ringTimer===option?true:false} value={option}>{option+' sec'}</option>)}
        </select>
    </div></>
    
)}

const ForwardToNumberConfirm = ({settings, onChange}) => {
    const secondsOptions = [5,10,15,20,25,30,40,50,60,80,100,120]
    return (
    
    <><div class="col col-auto">
    <input type="text" class={validatePhonenumber(settings.number) ? "form-control" : "form-control is-invalid"} value={settings.number} name="number"  autocomplete="number" placeholder="Enter a phone number" onChange={onChange}/>
    </div>
    <div class="col col-auto">
        <select name="ringTimer" class="form-control" onChange={onChange}>
        {secondsOptions.map( (option) => <option  selected={settings.ringTimer===option?true:false} value={option}>{option+' sec'}</option>)}
        </select>
    </div></>
    
)}

const VoicemailToEmail = ({settings, onChange}) => (
    <div class="col col-auto">
    <input type="text" class={validateEmail(settings.email) ? "form-control" : "form-control is-invalid"} value={settings.email} name="email" placeholder="Enter an email address" onChange={onChange}/>
    </div>
)

const NotifyEmail = ({settings, onChange}) => (
    <>
    <div class="col col-auto">
    <input type="text" class={validateEmail(settings.email) ? "form-control" : "form-control is-invalid"} value={settings.email} name="email" placeholder="Enter an email address" onChange={onChange}/>
    </div>
    <div class="col col-auto">
    <input type="text" class={validateLabel(settings.label) ? "form-control" : "form-control is-invalid"} value={settings.label} name="label" placeholder="Enter a text label" onChange={onChange}/>
    </div>
    </>
)

const Analytics = ({settings, onChange}) => (
    <div class="col col-auto">
    <input type="text" class={validateLabel(settings.label) ? "form-control" : "form-control is-invalid"} value={settings.label} name="label" placeholder="Enter a text label" onChange={onChange}/>
    </div>
)

const validateLabel = label => {
    const labelPattern = RegExp('^[a-zA-Z0-9_-]{1,50}$');
        return (labelPattern.test(label))
}

const validatePhonenumber = number=> {
    const numberPattern = RegExp('^0[1-9][0-9]{7,15}');
        return (numberPattern.test(number))
}

const validateEmail = email => {
    const emailPattern = RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');
        return (emailPattern.test(email))
}


