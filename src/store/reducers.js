import {combineReducers} from "redux";
import {ActionTypes} from "./actions";

const InitialState = {
    User: {
        loading: false,
        error: null,
        data: {},
        token: null
    },
    Join: {
        loading: false,
        error: null,
        data: {}
    },
    Organizations: {
        loading: false,
        error: null,
        data: []
    },
    Events: {
        loading: false,
        error: null,
        my_events: [],
        new_event: null,
        view_event: null
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
                    const { user, token } = payload
                    if(!user || !token){
                        throw new Error('Login Failed: No Data or Token')
                    } else {
                        return {
                            ...state,
                            loading: false,
                            error: null,
                            data: user,
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
        const {ORGS_START, ORGS_SUCCESS, ORGS_FAIL} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case ORGS_START: {
                return {
                    ...state,
                    loading: true,
                    error: null
                }
            }
            case ORGS_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    data: payload,
                    error: null
                }
            }
            case ORGS_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
            default: return state
        }
    },
    Join: (state = InitialState.Join, action) => {
        const {JOIN_START, JOIN_SUCCESS, JOIN_FAIL} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case JOIN_START: {
                return {
                    ...state,
                    loading: true,
                    error: null
                }
            }
            case JOIN_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    data: payload,
                    error: null
                }
            }
            case JOIN_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
            default: return state
        }
    },
    Events: (state = InitialState.Events, action) => {
        const {EVENT_START, NEW_EVENT_SUCCESS, EVENT_FAIL, SET_MY_EVENTS, GET_EVENT_SUCCESS} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case EVENT_START: {
                return {
                    ...state,
                    loading: true,
                    error: null
                }
            }
            case SET_MY_EVENTS: {
                return {
                    ...state,
                    loading: false,
                    my_events: payload,
                    error: null
                }
            }
            case NEW_EVENT_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    new_event: payload,
                    error: null
                }
            }
            case GET_EVENT_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    view_event: payload,
                    error: null
                }
            }
            case EVENT_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
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