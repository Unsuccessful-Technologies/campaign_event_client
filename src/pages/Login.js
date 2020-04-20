import React, {useEffect, useReducer} from 'react';
import {Link, useHistory, useLocation} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {SubmitLogin} from "../store/actions";
import Loading from "./common/Loading";

function Login(props) {
    const User = useSelector(state => state.User)
    const dispatch = useDispatch()
    const [FormState, FormDispatch] = useReducer(FormReducer, initialFormState)
    const location = useLocation()
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
            if(location.state && location.state.returnTo){
                history.push(location.state.returnTo)
            } else {
                history.push("/profile")
            }
        }
    }, [User, history, location])

    return (User.loading) ? (<Loading><h1>Loading...</h1></Loading>) : (
        <div {...props} className="home-container container-fluid">
            <div id={"login-card"} className={"card p-4 shadow w-50 m-auto"}>
                <h1>Login</h1>
                <div className={"d-flex flex-column justify-content-center align-items-center p-2"}>
                    <input id={"email"} className={"form-control m-2"} placeholder={"email"} onChange={InputChangeHandler} value={FormState.email.value}/>
                    <input id={"password"} type={"password"} className={"form-control m-2"} placeholder={"password"} onChange={InputChangeHandler} value={FormState.password.value}/>
                </div>
                <button className={"btn btn-success w-50 m-auto"} onClick={HandleLoginButton}>
                    Login
                </button>
                {
                    (User.error) ? <p>{User.error}</p> : null
                }
            </div>
            <h4 className={"text-center m-3 font-italic"}>OR</h4>
            <div className={"w-50 m-auto p-4"}>
                <Link to={"/join"}>
                    <button className={'btn btn-warning w-100'}>Join</button>
                </Link>
            </div>
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
