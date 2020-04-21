import React, {useReducer} from 'react';
import {useSelector} from "react-redux";
import {Switch, Route, Link, useRouteMatch, useParams} from "react-router-dom";

function NewEvent(props) {
    const routeMatch = useRouteMatch()
    const User = useSelector(state => state.User)
    return (
        <div {...props} className="home-container container-fluid">
            <h1 className={'text-center'}>Create an Event!</h1>
            {
                (User.token) ? <LoggedIn routeMatch={routeMatch} token={User.token}/> : <NoLogIn routeMatch={routeMatch}/>
            }
        </div>
    );
}

function LoggedIn(props){
    const {routeMatch, token} = props
    const {url, path} = routeMatch
    const [NewEventForm, NewEventDispatch] = useReducer(FormReducer, initialFormState)

    const HandleSubmit = () => {
        const result = {
            token,
            event:{}
        }
        Object.keys(NewEventForm.event).map(key => {
            result.event[key] = NewEventForm.event[key].value
        })
        if(NewEventForm.organization_id){
            result.organization_id = NewEventForm.organization_id
        } else {
            result.organization = {}
            Object.keys(NewEventForm.organization).map(key => {
                result.organization[key] = NewEventForm.organization[key].value
            })
        }
        console.log(result)
    }

    return (
        <div>
            <div>
                <ul className={'nav'}>
                    <li className={"nav-item"}><Link to={`${url}`}>Organization</Link></li>
                    <li className={"nav-item"}><Link to={`${url}/eventDetails`}>Event Details</Link></li>
                </ul>
            </div>
            <div>
                <Switch>
                    <Route exact path={`${path}`}><ChoseOrg NewEventForm={NewEventForm} NewEventDispatch={NewEventDispatch} url={url}/></Route>
                    <Route exact path={`${path}/eventDetails`} exact><EventDetails NewEventForm={NewEventForm} NewEventDispatch={NewEventDispatch} submit={HandleSubmit}/></Route>
                </Switch>
            </div>
        </div>
    )
}

function ChoseOrg(props){
    const {NewEventForm, NewEventDispatch, url} = props
    const {organization, organization_id} = NewEventForm
    const Organizations = useSelector(state => state.Organizations)
    const org_data = Organizations.data

    const HandleChange = (e) => {
        const {id, value} = e.target
        const action = {
            type: "organization",
            payload: {
                key: id,
                value,
                validation: organization[id].validation
            }
        }
        NewEventDispatch(action)
    }

    const ChoseExistingOrg = (id) => {
        const action = {
            type: "organization_id",
            payload: id
        }
        NewEventDispatch(action)
    }

    const ClearOrgId = () => {
        NewEventDispatch({type:"clear_org_id"})
    }

    return (
        <div>
            <div>
                {
                    (org_data.length > 0) ?
                        <ul>
                            {
                                org_data.map(x => {
                                    return (
                                        <div onClick={() => ChoseExistingOrg(x._id)}>
                                            <h1>Orga with id {x._id}</h1>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    :
                        <div></div>
                }
            </div>
            <div>
                {
                    (NewEventForm.organization_id) ?
                        <div>
                            <h1>You've selected Org with ID {NewEventForm.organization_id}</h1>
                            <button className={"btn btn-info"} onClick={ClearOrgId}>Make New Organization</button>
                        </div>
                        :
                        <div className={'card d-flex flex-column p-4 dark-bg'}>
                            <div className={'card-header'}>
                                <h3>Create New Organization</h3>
                            </div>
                            {/* TODO Add website and photo inputs*/}
                            <div className={"w-100 d-flex flex-row justify-content-center align-items-center"}>
                                <div className={"p-3 flex-grow-1"}>
                                    <h3>Organization Info</h3>
                                    <input id={"name"} placeholder={"Name"} value={organization.name.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                    <input id={"address"} placeholder={"Address"} value={organization.address.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                    <input id={"phone"} placeholder={"Phone"} value={organization.phone.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                </div>
                                <div className={"p-3 flex-grow-1"}>
                                    <h3>Bank Info</h3>
                                    <input id={"bank_name"} placeholder={"Name of Bank"} value={organization.bank_name.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                    <input id={"bank_account"} placeholder={"Account Number"} value={organization.bank_account.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                    <input id={"bank_routing"} placeholder={"Routing Number"} value={organization.bank_routing.value} onChange={HandleChange} className={"form-control mb-1"}/>
                                </div>
                            </div>
                            <div className={"w-100 p-3"}>
                                <textarea rows={"5"} id={"description"} placeholder={"Description of the organization..."} value={organization.description.value} onChange={HandleChange} className={"form-control mb-1"}/>
                            </div>

                        </div>
                }
            </div>
            <div>
                <Link to={`${url}/eventDetails`}>
                    <button className={"btn btn-success"}>Continue</button>
                </Link>
            </div>
        </div>
    )
}

function EventDetails(props){
    const {NewEventForm, NewEventDispatch, submit} = props
    const {event} = NewEventForm

    const HandleChange = (e) => {
        const {id, value} = e.target
        const action = {
            type: `event`,
            payload: {
                key: id,
                value,
                validation: event[id].validation
            }
        }
        NewEventDispatch(action)
    }

    return (
        <div>
            <div className={"p-3"}>
                <div className={"d-flex flex-row p-3 m-1"}>
                    <div className={"card dark-bg w-50 p-4 m-1"}>
                        <h3>Event Details</h3>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Event Type</span>
                            </div>
                            <select id={"type"} value={event.type.value} onChange={HandleChange} className={"custom-select"}>
                                <option value={""}>Select an option</option>
                                <option value={"ticketed"}>Ticketed</option>
                                <option value={"campaign"}>Campaign</option>
                            </select>
                        </div>
                        <input id={"name"} placeholder={"Event's Name"} value={event.name.value} onChange={HandleChange} className={"form-control mb-2"}/>
                        <input id={"description"} placeholder={"Description"} value={event.description.value} onChange={HandleChange} className={"form-control mb-2"}/>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Start Date</span>
                            </div>
                            <input id={"start_date"} type={"date"} placeholder={"Start Date"} value={event.start_date.value} onChange={HandleChange} className={"form-control"}/>

                        </div>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>End Date</span>
                            </div>
                            <input id={"end_date"} type={"date"} placeholder={"End Date"} value={event.end_date.value} onChange={HandleChange} className={"form-control"}/>
                        </div>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Private</span>
                            </div>
                            <select id={"is_private"} value={event.is_private.value} onChange={HandleChange} className={"custom-select"}>
                                <option value={""}>Select an option</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        <input id={"goal_amount"} placeholder={"$ Goal to raise"} value={event.goal_amount.value} onChange={HandleChange} className={"form-control mb-2"}/>
                    </div>
                    <div className={"card dark-bg w-50 p-4 m-1"}>
                        {
                            (event.type.value === 'ticketed') ?
                                <div>
                                    <h3>Ticketed Inputs</h3>
                                    <h1 className={'text-danger'}>TBD</h1>
                                </div>
                                :
                                (event.type.value === 'campaign') ?
                                    <div>
                                        <h3>Campaign Inputs</h3>
                                        <h1 className={'text-danger'}>TBD</h1>
                                    </div>
                                    :
                                    <div><h2>Select an event type</h2></div>
                        }
                    </div>
                    {/* TODO Add keywords pictures and contacts*/}
                </div>
                <div className={"d-flex flex-row p-3"}>
                    <div className={"card dark-bg flex-grow-1 p-4 m-1"}>
                        <h3>Contacts</h3>
                        <h1 className={'text-danger'}>TBD</h1>
                    </div>
                    <div className={"card dark-bg flex-grow-1 p-4 m-1"}>
                        <h3>Pictures</h3>
                        <h1 className={'text-danger'}>TBD</h1>
                    </div>
                </div>
            </div>
            <div>
                <button className={"btn btn-success"} onClick={submit}>Submit</button>
            </div>
        </div>
    )
}

function NoLogIn(props){
    const {routeMatch} = props
    const {url} = routeMatch
    return (
        <div className={"card shadow-lg d-flex flex-row justify-content-center align-items-center p-4 m-1 dark-bg"}>
            <div className={"card shadow m-1 p-2 flex-grow-1 d-flex flex-column align-items-center"}>
                <h3 className={'text-dark'}>Already a User?</h3>
                <Link to={{pathname:"/login", state:{returnTo:url}}}>
                    <button className={"btn btn-primary"}>Login</button>
                </Link>
            </div>
            <div className={"card shadow m-1 p-2 flex-grow-1 d-flex flex-column align-items-center"}>
                <h3 className={'text-dark'}>New Here?</h3>
                <Link to={{pathname:"/join", state:{returnTo:url}}}>
                    <button className={"btn btn-success"}>Join</button>
                </Link>
            </div>
        </div>
    )
}

export default NewEvent;

const BasicValidation = (value) => {
    let result = true
    result = result && value.length > 0
    return result
}

const initialFormState = {
    "event":{
        type: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        name: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        description: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        start_date: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        end_date: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        is_private: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        goal_amount: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        }
    },
    "organization":{
        name: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        description: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        address: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        phone: {
            value: "",
            isValie: false,
            isTouched: false,
            validation: BasicValidation
        },
        bank_name: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        bank_account: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        bank_routing: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        }
    },
    "organization_id": null
}

const FormReducer = (state, action) => {
    const {payload} = action
    switch(action.type){
        case 'organization': {
            const { key, value, validation } = payload
            return {
                ...state,
                organization: {
                    ...state.organization,
                    [key]: {
                        value,
                        isValid: validation(value),
                        isTouched: true,
                        validation
                    }
                }
            }
        }
        case 'organization_id': {
            const { organization_id } = payload
            return {
                ...state,
                organization_id
            }
        }
        case `clear_org_id`: {
            return {
                ...state,
                organization_id: null
            }
        }
        case 'event': {
            const { key, value, validation } = payload
            return {
                ...state,
                event: {
                    ...state.event,
                    [key]: {
                        value,
                        isValid: validation(value),
                        validation,
                        isTouched: true
                    }
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
