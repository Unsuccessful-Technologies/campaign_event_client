import {combineReducers} from "redux";
import {ActionTypes} from "./actions";

const InitialState = {
    User: {
        loading: false,
        error: null,
        data: {},
        token: null
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
                    loading: true
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
    }
}



export default combineReducers(Reducers)