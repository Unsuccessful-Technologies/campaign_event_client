import React, {useEffect, useReducer} from 'react';
import { useHistory } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {SubmitLogin} from "../store/actions";

function Login(props) {
    const User = useSelector(state => state.User)
    const dispatch = useDispatch()
    const [FormState, FormDispatch] = useReducer(FormReducer, initialFormState)
    const history = useHistory()

    const InputChangeHandler = (e) => {
        console.debug("InputChangeHandler", e.target)
        const {id, value} = e.target
        const action = {
            type: id,
            payload: value
        }
        FormDispatch(action)
    }

    const HandleLoginButton = () => {
        console.debug("HandleLoginButton", FormState)
        const payload = {
            email: FormState.email.value,
            password: FormState.password.value
        }
        dispatch(SubmitLogin(payload))
    }

    useEffect(() => {
        if(User.token){
            history.push("/profile")
        }
    }, [User, history])

    return (User.loading) ? (<div className={"loader"}>Loading...</div>) : (
        <div {...props} className="home-container container-fluid">
            <h1>Login</h1>
            <div className={"d-flex flex-column justify-content-center"}>
                <input id={"email"} className={"form-control"} placeholder={"email"} onChange={InputChangeHandler} value={FormState.email.value}/>
                <input id={"password"} type={"password"} className={"form-control"} placeholder={"password"} onChange={InputChangeHandler} value={FormState.password.value}/>
            </div>
            <button className={"btn btn-success"} onClick={HandleLoginButton}>
                Login
            </button>
            {
                (User.error) ? <p>{User.error}</p> : null
            }
        </div>
    );
}

const initialFormState = {
    email: {
        value: "",
        isValid: false,
        isTouched: false
    },
    password: {
        value: "",
        isTouched: false
    }
}

const FormReducer = (state, action) => {
    const {payload} = action
    switch(action.type){
        case 'email': {
            return {
                ...state,
                email: {
                    value: payload,
                    isValid: isEmailValid(payload),
                    isTouched: true
                }
            }
        }
        case 'password': {
            return {
                ...state,
                password: {
                    value: payload,
                    isTouched: true
                }
            }
        }
        case 'reset': {
            return initialFormState
        }
        default:
            throw new Error("Unknown Action Type in Login FormReducer")
    }
}

const isEmailValid = (email) => {
    // TODO Check Email Validity
    return true
}

export default Login;
