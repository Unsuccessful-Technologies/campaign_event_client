import API from './api'

export const ActionTypes = {
    LOGIN_START: "LOGIN_START",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",
    LOGOUT: "LOGOUT",
    JOIN_START: "JOIN_START",
    JOIN_SUCCESS: "JOIN_SUCCESS",
    JOIN_FAIL: "JOIN_FAIL",
    TOKEN_VALID_START: "TOKEN_VALID_START",
    TOKEN_VALID_SUCCESS: "TOKEN_VALID_SUCCESS",
    TOKEN_VALID_FAIL: "TOKEN_VALID_FAIL",
    NEW_EVENT_START: "NEW_EVENT_START",
    NEW_EVENT_SUCCESS: "NEW_EVENT_SUCCESS",
    NEW_EVENT_FAIL: "NEW_EVENT_FAIL"
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
            if(response.status !== 200) {
                throw new Error('Login response status is ' + response.status)
            }
            const result = await response.json()
            return dispatch({type: ActionTypes.LOGIN_SUCCESS, payload: result})
        } catch (e) {
            console.log(e)
            return dispatch({type: ActionTypes.LOGIN_FAIL, payload: e.message})
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
            console.log(e)
            return dispatch({type: ActionTypes.JOIN_FAIL, payload: e.message})
        }
    }
}

export const SubmitEvent = (payload) => {
    return async (dispatch) => {
        dispatch({type: ActionTypes.NEW_EVENT_START})
        const options = {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
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
                return dispatch({type: ActionTypes.NEW_EVENT_FAIL, payload: result.message})
            }
        } catch (e) {
            console.log(e)
            return dispatch({type: ActionTypes.NEW_EVENT_FAIL, payload: e.message})
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
            console.log(e)
            return dispatch({type: ActionTypes.TOKEN_VALID_FAIL, payload: e.message})
        }
    }
}