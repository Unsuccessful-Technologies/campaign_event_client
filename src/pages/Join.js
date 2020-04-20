import React, {useEffect, useReducer} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {SubmitLogin} from "../store/actions";
import Loading from "./common/Loading";

function Join(props) {
    const User = useSelector(state => state.User)
    const dispatch = useDispatch()
    const [FormState, FormDispatch] = useReducer(FormReducer, initialFormState)
    const history = useHistory()

    const InputChangeHandler = (e) => {
        console.debug("InputChangeHandler", e.target)
        const {id, value} = e.target
        const payload = {
            key: id,
            value,
            validation: FormState[id].validation
        }
        const action = {
            type: "change",
            payload
        }
        FormDispatch(action)
    }

    const HandleJoinButton = () => {
        console.debug("HandleLoginButton", FormState)
        const payload = {}
        Object.keys(FormState).forEach(key => {
            payload[key] = FormState[key].value
        })
        console.log(payload)
    }

    useEffect(() => {
        if(User.token){
            history.push("/profile")
        }
    }, [User, history])

    return (User.loading) ? (<Loading><h1>Loading...</h1></Loading>) : (
        <div {...props} className="home-container container-fluid">
            <div id={"login-card"} className={"card p-4 shadow w-50 m-auto"}>
                <h1>Join</h1>
                <div className={"d-flex flex-column justify-content-center align-items-center p-2"}>
                    <input id={"fName"} className={"form-control m-2"} placeholder={"First name"} onChange={InputChangeHandler} value={FormState.fName.value}/>
                    <input id={"lName"} className={"form-control m-2"} placeholder={"Last name"} onChange={InputChangeHandler} value={FormState.lName.value}/>
                    <input id={"email"} className={"form-control m-2"} placeholder={"Email"} onChange={InputChangeHandler} value={FormState.email.value}/>
                    <input id={"phone"} className={"form-control m-2"} placeholder={"Phone"} onChange={InputChangeHandler} value={FormState.phone.value}/>
                    <input id={"password"} type={"password"} className={"form-control m-2"} placeholder={"Password"} onChange={InputChangeHandler} value={FormState.password.value}/>
                </div>
                <button className={"btn btn-success w-50 m-auto"} onClick={HandleJoinButton}>
                    Join
                </button>
                {
                    (User.error) ? <p>{User.error}</p> : null
                }
            </div>
            <h4 className={"text-center m-3 font-italic"}>OR</h4>
            <div className={"w-50 m-auto p-4"}>
                <Link to={"/login"}>
                    <button className={'btn btn-warning w-100'}>Login</button>
                </Link>
            </div>
        </div>
    );
}

const BasicValidation = (value) => {
    let result = true
    result = result && value.length > 0
    return result
}

const initialFormState = {
    fName: {
        value: "",
        isTouched: false,
        validation: BasicValidation
    },
    lName: {
        value: "",
        isTouched: false,
        validation: BasicValidation
    },
    email: {
        value: "",
        isValid: false,
        isTouched: false,
        validation: BasicValidation
    },
    phone: {
        value: "",
        isTouched: false,
        validation: BasicValidation
    },
    password: {
        value: "",
        isTouched: false,
        validation: BasicValidation
    }
}

const FormReducer = (state, action) => {
    const {payload} = action
    switch(action.type){
        case 'change': {
            const { key, value, validation } = payload
            return {
                ...state,
                [key]: {
                    value,
                    isValid: validation(value),
                    isTouched: true,
                    validation
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

export default Join;
