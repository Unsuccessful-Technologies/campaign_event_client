import API from './api'

export const ActionTypes = {
    LOGIN_START: "LOGIN_START",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",
    LOGOUT: "LOGOUT",
    JOIN_START: "JOIN_START",
    JOIN_SUCCESS: "JOIN_SUCCESS",
    JOIN_FAIL: "JOIN_FAIL",
    JOIN_CLEAR: "JOIN_CLEAR",
    GET_PROFILE_START: "GET_PROFILE_START",
    GET_PROFILE_SUCCESS: "GET_PROFILE_SUCCESS",
    GET_PROFILE_FAIL: "GET_PROFILE_FAIL",
    TOKEN_VALID_START: "TOKEN_VALID_START",
    TOKEN_VALID_SUCCESS: "TOKEN_VALID_SUCCESS",
    TOKEN_VALID_FAIL: "TOKEN_VALID_FAIL",
    EVENT_START: "EVENT_START",
    EVENT_FAIL: "EVENT_FAIL",
    SET_MY_EVENTS: "SET_MY_EVENTS",
    NEW_EVENT_SUCCESS: "NEW_EVENT_SUCCESS",
    NEW_EVENT_CLEAR: "NEW_EVENT_CLEAR",
    GET_EVENT_SUCCESS: "GET_EVENT_SUCCESS",
    SET_MY_ORGS: "SET_MY_ORGS",
    UPDATE_EVENT_START: "UPDATE_EVENT_START",
    UPDATE_EVENT_SUCCESS: "UPDATE_EVENT_SUCCESS",
    UPDATE_EVENT_FAIL: "UPDATE_EVENT_FAIL",
    LEAVE_VIEW_EVENT: "LEAVE_VIEW_EVENT",
    PUBLIC_EVENTS_START: "PUBLIC_EVENTS_START",
    PUBLIC_EVENTS_SUCCESS: "PUBLIC_EVENTS_SUCCESS",
    PUBLIC_EVENTS_FAIL: "PUBLIC_EVENTS_FAIL"

}

export const SubmitLogin = (payload) => {
    return async (dispatch) => {
        dispatch({type: ActionTypes.LOGIN_START})
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload)
        }
        try {
            const response = await fetch(API.LoginURL, options)
            const result = await response.json()
            if(response.status !== 200) {
                const error = new Error(result.message)
                error.status = response.status
                throw error
            }
            const {user, events, organizations, token} = result
            dispatch({type: ActionTypes.SET_MY_EVENTS, payload: events})
            dispatch({type: ActionTypes.SET_MY_ORGS, payload: organizations})
            window.sessionStorage.setItem('user', JSON.stringify({user,token}))
            return dispatch({type: ActionTypes.LOGIN_SUCCESS, payload: {user, token}})
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.LOGIN_FAIL, payload: e})
        }
    }
}

export const SubmitJoin = (payload) => {
    return async (dispatch) => {
        dispatch({type: ActionTypes.JOIN_START})
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload)
        }
        try {
            const response = await fetch(API.JoinURL, options)
            if(response.status !== 200) {
                throw new Error('Join response status is ' + response.status)
            }
            const result = await response.json()
            const {success} = result
            if(success){
                return dispatch({type: ActionTypes.JOIN_SUCCESS, payload: result})
            } else {
                return dispatch({type: ActionTypes.JOIN_FAIL, payload: result.message})
            }
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.JOIN_FAIL, payload: e.message})
        }
    }
}

export const SubmitEvent = (payload) => {
    return async (dispatch, getState) => {
        dispatch({type: ActionTypes.EVENT_START})
        const token = getState().User.token
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "token": token
            },
            body: JSON.stringify(payload)
        }
        try {
            const response = await fetch(API.EventsURL, options)
            if(response.status !== 200) {
                throw new Error('Create Event response status is ' + response.status)
            }
            const result = await response.json()
            const {success} = result
            if(success){
                return dispatch({type: ActionTypes.NEW_EVENT_SUCCESS, payload: result})
            } else {
                return dispatch({type: ActionTypes.EVENT_FAIL, payload: result.message})
            }
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.EVENT_FAIL, payload: e.message})
        }
    }
}

export const ViewEvent = (payload) => {
    const {event_id} = payload

    const EventIsLocal = (state, event_id) => {
        if(state.my_events.length === 0) return false
        for(let i = 0; i < state.my_events.length; i++){
            const event = state.my_events[i]
            if(event._id === event_id){
                return true
            }
        }
    }

    return async (dispatch, getState) => {
        dispatch({type: ActionTypes.EVENT_START})
        const state = getState()
        if(EventIsLocal(state.Events,event_id) && false){
            const event = state.Events.my_events.filter(x => x._id === event_id)[0]
            dispatch({type:ActionTypes.GET_EVENT_SUCCESS, payload: event})
        } else {
            /** Get Event from server **/
            const token = state.User.token
            const options = {
                method: "GET",
                headers: {
                    "Content-Type":"application/json"
                }
            }
            if(token){
                options.headers['token'] = token
            }
            try {
                const response = await fetch(`${API.EventsURL}/${event_id}`, options)
                const {status} = response
                const result = await response.json()
                if(status !== 200) {
                    let error = new Error(result.message)
                    error.status = status
                    throw error
                }
                return dispatch({type: ActionTypes.GET_EVENT_SUCCESS, payload: result})
            } catch (e) {
                console.error(e)
                return dispatch({type: ActionTypes.EVENT_FAIL, payload: {status: e.status, message: e.message}})
            }
        }
    }

}

export const UpdateEvent = (payload) => {
    return async (dispatch, getState) => {
        dispatch({type: ActionTypes.UPDATE_EVENT_START})
        const token = getState().User.token
        const event_id = getState().Events.view_event._id
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "token": token
            },
            body: JSON.stringify(payload)
        }
        try {
            const response = await fetch(`${API.EventsURL}/${event_id}`, options)
            const result = await response.json()
            if(response.status !== 200) {
                const error = new Error(result.message)
                error.status = response.status
                throw error
            }
            const {success} = result
            if(success){
                dispatch({type:ActionTypes.UPDATE_EVENT_SUCCESS})
                return dispatch(ViewEvent({event_id}))
            } else {
                const error = new Error(result.message)
                throw error
            }
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.UPDATE_EVENT_FAIL, payload: e})
        }
    }
}

export const UserToEvent = (action) => {
    const {type, payload} = action
    return async (dispatch, getState) => {
        dispatch({type: ActionTypes.UPDATE_EVENT_START})
        const token = getState().User.token
        const event_id = getState().Events.view_event._id
        const options = {
            method: type === 'add' ? "POST" : type === 'delete' ? "DELETE" : "",
            headers: {
                "Content-Type":"application/json",
                "token": token
            },
            body: JSON.stringify(payload)
        }
        try {
            const response = await fetch(`${API.EventsURL}/user/${event_id}`, options)
            const result = await response.json()
            if(response.status !== 200) {
                const error = new Error(result.message)
                error.status = response.status
                throw error
            }
            const {success} = result
            if(success){
                dispatch({type:ActionTypes.UPDATE_EVENT_SUCCESS})
                return dispatch(ViewEvent({event_id}))
            } else {
                const error = new Error(`Something went wrong with ids ${JSON.stringify(result.ids)}`)
                throw error
            }
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.UPDATE_EVENT_FAIL, payload: e})
        }
    }
}

export const GetProfile = () => {
    return async (dispatch, getState) => {
        dispatch({type: ActionTypes.GET_PROFILE_START})
        const token = getState().User.token
        const options = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "token": token
            }
        }
        try {
            const response = await fetch(API.ProfileURL, options)
            const result = await response.json()
            if(response.status !== 200) {
                const error = new Error(result.message)
                error.status = response.status
                throw error
            }
            const {events, organizations} = result
            dispatch({type: ActionTypes.SET_MY_EVENTS, payload: events})
            dispatch({type: ActionTypes.SET_MY_ORGS, payload: organizations})
            return dispatch({type: ActionTypes.GET_PROFILE_SUCCESS})
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.GET_PROFILE_FAIL, payload: e})
        }
    }
}

export const GetPublicEvents = () => {
    return async (dispatch) => {
        dispatch({type: ActionTypes.PUBLIC_EVENTS_START})
        const options = {
            method: "GET",
            headers: {
                "Content-Type":"application/json"
            }
        }
        try {
            const response = await fetch(API.EventsURL, options)
            const result = await response.json()
            if(response.status !== 200) {
                const error = {
                    message: result.message || "Something Went Wrong getting Public Events.",
                    status: response.status
                }
                throw error
            }
            if(Array.isArray(result)){
                dispatch({type: ActionTypes.PUBLIC_EVENTS_SUCCESS, payload: result})
            } else {
                dispatch({type: ActionTypes.PUBLIC_EVENTS_SUCCESS, payload: []})
            }
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.PUBLIC_EVENTS_FAIL, payload: e})
        }
    }
}


export const ValidateToken = (payload) => {
    console.debug('ValidateToken',payload)
    const { token, event_id } = payload
    return async (dispatch) => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "token": token
            }
        }
        try {
            const response = await fetch(API.TokenValidateURL(event_id), options)
            if(response.status !== 200) {
                throw new Error('ValidateToken response status is ' + response.status)
            }
            const result = await response.json()
            return dispatch({type: ActionTypes.TOKEN_VALID_SUCCESS, payload: result})
        } catch (e) {
            console.error(e)
            return dispatch({type: ActionTypes.TOKEN_VALID_FAIL, payload: e.message})
        }
    }
}