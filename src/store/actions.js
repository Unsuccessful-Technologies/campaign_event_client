import API from './api'

export const ActionTypes = {
    LOGIN_START: "LOGIN_START",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAIL: "LOGIN_FAIL",
    LOGOUT: "LOGOUT"
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

export const GetOrganizations = (payload) => {
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