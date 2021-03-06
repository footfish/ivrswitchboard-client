import {API_URI, API_AUTHURI , API_HEADERS, API_UPLOAD_HEADERS, API_UPLOADURI} from "../config"
import decode from "jwt-decode";

class SwitchboardAPI {
    
    constructor() {
        this.apiSwitchboardURL = API_URI + "/switchboard"
    }
    
//readE164() gets a random list of 20 available numbers 
    readE164(cc, ndc) {
        const e164URL = API_URI + "/e164?cc="+cc+"&ndc="+ndc
        return fetch(e164URL, {
            headers:  API_HEADERS,          
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "loadError"}
            if (typeof data.e164 !== 'undefined' && data.e164 !== "") {
                apiResp = {status: "e164Loaded", e164: data.e164}
            } 
            return (apiResp)
        })
        .catch (() => {
            return ({status: "loadError"})
        })
    }
    
    register(first_name, last_name, email, password, mobile_number, switchboard_number)
    { 
        const registerURL = API_URI + "/account?action=register"
        return fetch(registerURL, { //Register account 
          method: "POST",
          headers:  API_HEADERS,          
          body: JSON.stringify({
            first_name,
            last_name,  
            email,
            password,
            mobile_number,
            switchboard_number
          })
        })
        .then(res => res.text())
        .then(data => {
            if ( data === 'Created new account' ) {
                return true
            } else {
                return false
            }
        })
        .catch( () => false )
    }
    

    //Logs into api with email/password. Returns a Promise of true/false on success. JWT access token and uid kept in sessionStorage. 
    login(email, password) { 
        return fetch(API_AUTHURI, { //Get a JWT
          method: "POST",
          headers:  API_HEADERS,          
          body: JSON.stringify({
            email,
            password
          })
        })
        .then(res => res.json())
        .then(data => {
            if (typeof data.access_token !== 'undefined' )
                {
                sessionStorage.setItem("access_token", data.access_token) //save JWT for authentication 
                return true
            } else {
                return false
            }
        }).catch( () => false )
      }

    logout(){
        sessionStorage.removeItem("access_token"); //clear JWT
    }

    addAuthQueryString(url){
        const access_token = sessionStorage.getItem("access_token")
        if( access_token !== null){
            return url+"?auth_token="+access_token.slice(7)
        } else 
        return url
    }

    loggedIn(){
        const access_token = sessionStorage.getItem("access_token")
        if( access_token !== null){
            try {
                const decoded = decode(access_token);
                if (decoded.exp > Date.now() / 1000) { // Check if token is expired.
                    return true
                } else {
                    return false
                }
              } catch (err) {
                return false
              }

        } else {
            return false
        }
    }

    readRecordings(){
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, {
            headers:  API_HEADERS,          
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "loadError"}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp.recordings = data.recordings
                apiResp.status = "recordings"          
                apiResp.number = data.number
            }
            return (apiResp)
        })
        .catch (() => {
            return ({status: "loadError"})
        })
    }

    uploadRecording(payload) {
        API_UPLOAD_HEADERS.Authorization = sessionStorage.getItem("access_token")
        const data = new FormData()
        data.append('recording', payload.newFile )
        data.append('recordinglabel', payload.newLabel)
        return fetch(API_UPLOADURI+"/"+payload.idx, {
            headers:  API_UPLOAD_HEADERS,  
            method: 'POST', 
            body: data        
        }).then(resp => {
            if (!resp.ok) throw Error()
            let apiResp = {status: "success"}
            return (apiResp)
        }).catch (() => {
            return ({status: "error"})
        })
}


    readTimes() {
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, {
            headers:  API_HEADERS,          
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "loadError"}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = {status: "times", localChanges: false, number: data.number, schedule: data.schedule, routeOption: data.routeOption}
            } 
            return (apiResp)
        })
        .catch (() => {
            return ({status: "loadError"})
        })
    }

    updateTimes(payload) {
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, { 
            method: 'PATCH', 
            body: JSON.stringify(payload),
            headers:  API_HEADERS
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "uploadError", localChanges: true}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = {status: "times", localChanges: false, number: data.number, schedule: data.schedule, routeOption: data.routeOption}
            }
            return (apiResp)
        })
        .catch (() => {
            return ({status: "uploadError", localChanges: true})
        })
    }


    readOpenMenu(){
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, {
            headers:  API_HEADERS,          
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "loadError"}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = data.openMenu
                apiResp.status = "open"
                apiResp.localChanges = false
                apiResp.recordings = data.recordings
                apiResp.number = data.number
            }
            return (apiResp)
        })
        .catch (() => {
            return ({status: "loadError"})
        })
    }

    updateOpenMenu(payload){
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, { 
            method: 'PATCH', 
            body: JSON.stringify(payload),
            headers:  API_HEADERS
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "uploadError", localChanges: true}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = data.openMenu
                apiResp.status = "open"            
                apiResp.localChanges = false
                apiResp.recordings = data.recordings
                apiResp.number = data.number
            }
            return(apiResp)
        })
        .catch (() => {
            return ({status: "uploadError", localChanges: true})
        })
    }


    readClosedMenu(){
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL,{
            headers:  API_HEADERS,          
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "loadError"}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = data.closedMenu
                apiResp.status = "closed"            
                apiResp.localChanges = false
                apiResp.recordings = data.recordings
                apiResp.number = data.number
            }
            return(apiResp)
        })
        .catch (() => {
            return ({status: "loadError"})
        })
    }

    updateClosedMenu(payload){
        API_HEADERS.Authorization = sessionStorage.getItem("access_token")
        return fetch(this.apiSwitchboardURL, { 
            method: 'PATCH', 
            body: JSON.stringify(payload),
            headers:  API_HEADERS
        })
        .then(resp => resp.json())
        .then(data => {
            let apiResp = {status: "uploadError", localChanges: true}
            if (typeof data.number !== 'undefined' && data.number !== "") {
                apiResp = data.closedMenu
                apiResp.status = "closed"            
                apiResp.localChanges = false
                apiResp.recordings = data.recordings
                apiResp.number = data.number
            }
            return (apiResp)
        })
        .catch (() => {
            return ({status: "uploadError", localChanges: true})
        })
    }

  
}

export default (new SwitchboardAPI() )