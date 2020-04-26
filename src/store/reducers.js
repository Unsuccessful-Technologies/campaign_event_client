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
        view_event: null,
        update_event: {
            loading: false,
            error: null,
            success: null
        }
    },
    TokenValidation: {
        loading: true,
        error: null,
        data: {}
    }
}

const Reducers = {
    User: (state = InitialState.User, action) => {
        const {LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, GET_PROFILE_START, GET_PROFILE_SUCCESS, GET_PROFILE_FAIL} = ActionTypes
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
                window.sessionStorage.clear()
                return InitialState.User
            }
            case GET_PROFILE_START: {
                return {
                    ...state,
                    loading: true
                }
            }
            case GET_PROFILE_SUCCESS: {
                return {
                    ...state,
                    loading: false,
                    error: null
                }
            }
            case GET_PROFILE_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
            default: return state
        }
    },
    Organizations: (state = InitialState.Organizations, action) => {
        const {SET_MY_ORGS} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case SET_MY_ORGS: {
                return {
                    ...state,
                    loading: false,
                    data: payload,
                    error: null
                }
            }
            default: return state
        }
    },
    Join: (state = InitialState.Join, action) => {
        const {JOIN_START, JOIN_SUCCESS, JOIN_FAIL, JOIN_CLEAR} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case JOIN_CLEAR: {
                return InitialState.Join
            }
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
        const {
            EVENT_START,
            NEW_EVENT_SUCCESS,
            EVENT_FAIL,
            SET_MY_EVENTS,
            GET_EVENT_SUCCESS,
            NEW_EVENT_CLEAR,
            LEAVE_VIEW_EVENT,
            UPDATE_EVENT_START,
            UPDATE_EVENT_SUCCESS,
            UPDATE_EVENT_FAIL} = ActionTypes
        const {payload} = action
        switch (action.type) {
            case LEAVE_VIEW_EVENT: {
                return {
                    ...state,
                    error: null,
                    view_event: InitialState.Events.view_event,
                    update_event: InitialState.Events.update_event
                }
            }
            case EVENT_START: {
                return {
                    ...state,
                    loading: true,
                    error: null,
                    view_event: InitialState.Events.view_event,
                    update_event: InitialState.Events.update_event
                }
            }
            case SET_MY_EVENTS: {
                return {
                    ...state,
                    my_events: payload
                }
            }
            case NEW_EVENT_CLEAR: {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    new_event: InitialState.Events.new_event
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
                    error: null,
                    update_event: InitialState.Events.update_event
                }
            }
            case EVENT_FAIL: {
                return {
                    ...state,
                    loading: false,
                    error: payload
                }
            }
            case UPDATE_EVENT_START: {
                return {
                    ...state,
                    update_event: {
                        loading: true,
                        error: null,
                        success: null
                    }
                }
            }
            case UPDATE_EVENT_SUCCESS: {
                return {
                    ...state,
                    update_event: {
                        loading: false,
                        success: true
                    }
                }
            }
            case UPDATE_EVENT_FAIL: {
                return {
                    ...state,
                    update_event: {
                        loading: false,
                        error: payload,
                        success: false
                    }
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