import {combineReducers} from "redux";
import {ActionTypes} from "./actions";

const InitialState = {
    User: {
        loading: false,
        error: null,
        data: {},
        token: null
    },
    Organizations: {
        loading: false,
        error: null,
        data: {}
    },
    Events: {
        loading: false,
        error: null,
        data: {}
    },
    TokenValidation: {
        loading: true,
        error: null,
        data: {}
    }
}

const Reducers = {
    User: (state = InitialState.User, action) => {
        const {LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case LOGIN_START: {
                return {
                    ...state,
                    loading: true,
                    error: null
                }
            }
            case LOGIN_SUCCESS: {
                try {
                    const { data, token } = payload
                    if(!data || !token){
                        throw new Error('Login Failed: No Data or Token')
                    } else {
                        return {
                            ...state,
                            loading: false,
                            error: null,
                            data,
                            token
                        }
                    }
                } catch(e) {
                    return {
                        ...state,
                        loading: false,
                        error: e.message
                    }
                }
            }
            case LOGIN_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
            case LOGOUT: {
                return InitialState.User
            }
            default: return state
        }
    },
    Organizations: (state = InitialState.Organizations, action) => {
        switch (action.type) {
            default: return state
        }
    },
    Events: (state = InitialState.Events, action) => {
        switch (action.type) {
            default: return state
        }
    },
    TokenValidation: (state = InitialState.TokenValidation, action) => {
        const { payload } = action
        switch (action.type) {
            case ActionTypes.TOKEN_VALID_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    data: payload
                }
            }
            case ActionTypes.TOKEN_VALID_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload,
                    data: {allowed: false}
                }
            }
            default: return state
        }
    }
}



export default combineReducers(Reducers)