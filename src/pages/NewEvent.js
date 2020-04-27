import React, {useEffect, useReducer,} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Switch, Route, Link, useRouteMatch, useHistory, Redirect} from "react-router-dom";
import {ActionTypes, GetProfile, SubmitEvent} from "../store/actions";
import Loading from "./common/Loading";

function NewEvent(props) {
    const routeMatch = useRouteMatch()
    const history = useHistory()
    const User = useSelector(state => state.User)
    return (
        <div {...props} className="home-container container-fluid">
            <h1 className={'text-center'}>Create an Event!</h1>
            {
                (User.token) ? <LoggedIn routeMatch={routeMatch} token={User.token} history={history}/> : <NoLogIn routeMatch={routeMatch}/>
            }
        </div>
    );
}

function LoggedIn(props){
    const {routeMatch, token, history} = props
    const {url, path} = routeMatch
    const [NewEventForm, NewEventDispatch] = useReducer(FormReducer, initialFormState)
    const Events = useSelector(state => state.Events)
    const dispatch = useDispatch()

    const HandleSubmit = () => {
        const result = {
            token,
            event:{},
            organization:{},
            organization_id: NewEventForm.organization_id
        }
        Object.keys(NewEventForm.event).forEach(key => {
            result.event[key] = NewEventForm.event[key].value
        })
        Object.keys(NewEventForm.organization).forEach(key => {
            result.organization[key] = NewEventForm.organization[key].value
        })
        console.log(result)
        dispatch(SubmitEvent(result))
    }

    useEffect(() => {
        if(Events.new_event && Events.new_event.success){
            dispatch(GetProfile())
            history.push("/profile")
        }
    }, [Events.new_event, dispatch, history])

    useEffect(() => {
        console.log('Clearing NEW EVENT')
        dispatch({type: ActionTypes.NEW_EVENT_CLEAR})
    }, [dispatch])

    if(Events.loading){
        return (<Loading><h1>Creating New Event...</h1></Loading>)
    }

    return (
        <div>
            <div>
                <ul className={'nav justify-content-center'}>
                    <li className={"nav-item m-4 p-2"}><Link to={`${url}`}>Organization Details</Link></li>
                    {/*// TODO Disable link if org is new and not filled out*/}
                    <li className={"nav-item m-4 p-2"}>{NewEventForm.organization_id === null ? <p>Event Details</p>: <Link to={`${url}/eventDetails`}>Event Details</Link>}</li>
                </ul>
            </div>
            <div>
                <Switch>
                    <Route exact path={`${path}`}><ChoseOrg NewEventForm={NewEventForm} NewEventDispatch={NewEventDispatch} url={url}/></Route>
                    <Route exact path={`${path}/eventDetails`}><EventDetails url={url} NewEventForm={NewEventForm} NewEventDispatch={NewEventDispatch} submit={HandleSubmit}/></Route>
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

    const SelectOrg = (id) => {
        const action = {
            type: "select_org",
            payload: id
        }
        NewEventDispatch(action)
    }

    return (
        <div>
            <div>
                <div className={'card d-flex flex-column dark-bg m-3'}>
                    <div className={'card-header'}>
                        <h3>Select An Organization</h3>
                    </div>
                    <div className={"card-body d-flex flex-row flex-wrap justify-content-center"}>
                        <div
                            style={{cursor:"pointer",overflow:"hidden",whiteSpace: "nowrap",textOverflow:"ellipsis"}}
                            className={`card d-flex flex-column p-4 m-1 shadow-lg w-25 h-100 ${(organization_id === 'new') ? "text-dark": "dark-bg"}`}
                            onClick={() => SelectOrg("new")}
                        >
                            <h6
                                className={"text-center"}>Add New</h6>
                        </div>
                        {
                            org_data.map(x => {
                                return (
                                    <div
                                        style={{cursor:"pointer"}}
                                        className={`card d-flex flex-column p-4 ${(organization_id === x._id) ? "text-dark": "dark-bg"} shadow-lg w-25 h-100 m-1`}
                                        onClick={() => SelectOrg(x._id)}>
                                        <h6 style={{cursor:"pointer",overflow:"hidden",whiteSpace: "nowrap",textOverflow:"ellipsis"}} className={"text-center"}>{x.name}</h6>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div>
                {
                    (organization_id === 'new') ?
                        <div className={'card d-flex flex-column p-4 dark-bg m-3'}>
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

                        </div> : <div></div>
                }
            </div>
            {
                (NewEventForm.organization_id === null) ?
                    <div></div>
                    :
                    <div className={"m-3"}>
                        <Link to={`${url}/eventDetails`}>
                            <button className={"btn btn-success"}>Continue</button>
                        </Link>
                    </div>
            }
        </div>
    )
}

function EventDetails(props){
    const {NewEventForm, NewEventDispatch, submit, url} = props
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

    if(NewEventForm.organization_id === null){
        return (<Redirect to={url}/>)
    }

    return (
        <div>
            <div className={"p-3"}>
                <div className={"d-flex flex-row p-3 m-1"}>
                    <div className={"card dark-bg w-50 p-4 m-1"}>
                        <h3>{(event.type.value === 'campaign')? "Fundraising Details" : "Event Details"}</h3>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Event Type</span>
                            </div>
                            <select id={"type"} value={event.type.value} onChange={HandleChange} className={"custom-select"}>
                                <option value={""}>Select an option</option>
                                <option value={"ticketed"}>Ticketed Event</option>
                                <option value={"campaign"}>Fundraising Campaign</option>
                            </select>
                        </div>
                        <input id={"name"} placeholder={(event.type.value === 'campaign')? "Campaign Name" : "Event's Name"} value={event.name.value} onChange={HandleChange} className={"form-control mb-2"}/>
                        <textarea rows={6} id={"description"} placeholder={"Description"} value={event.description.value} onChange={HandleChange} className={"form-control mb-2"}/>

                        {
                            (event.type.value === 'ticketed') ?
                                <div>
                                    <div className={"input-group mb-2"}>
                                        <div className={"input-group-prepend"}>
                                            <span className={'input-group-text'}>Event Date</span>
                                        </div>
                                        <input id={"start_date"} type={"date"} value={event.start_date.value} onChange={HandleChange} className={"form-control"}/>
                                    </div>
                                </div>
                                :
                                (event.type.value === 'campaign') ?
                                    <div>
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
                                                <span className={'input-group-text'}>Set Goal Amount</span>
                                            </div>
                                            <select id={"has_goal"} value={event.has_goal.value} onChange={HandleChange} className={"custom-select"}>
                                                <option value={""}>Select an option</option>
                                                <option value={"true"}>Yes</option>
                                                <option value={"false"}>No</option>
                                            </select>
                                        </div>
                                        {
                                            event.has_goal.value === "true" ? <div className={"input-group mb-2"}>
                                                <div className={"input-group-prepend"}>
                                                    <span className={'input-group-text'}>$</span>
                                                </div>
                                                <input id={"goal_amount"} type={"number"} placeholder={"Amount to raise"} value={event.goal_amount.value} onChange={HandleChange} className={"form-control"}/>
                                                <div className={"input-group-append"}>
                                                    <span className={'input-group-text'}>.00</span>
                                                </div>
                                            </div> : null
                                        }
                                    </div>
                                    : null
                        }


                    </div>
                    <div className={"card dark-bg w-50 p-4 m-1"}>
                        <h3>Privacy</h3>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Open To Public</span>
                            </div>
                            <select id={"is_private"} value={event.is_private.value} onChange={HandleChange} className={"custom-select"}>
                                <option value={""}>Select an option</option>
                                <option value={false}>Yes</option>
                                <option value={true}>No</option>
                            </select>
                        </div>
                        <div className={"input-group mb-2"}>
                            <div className={"input-group-prepend"}>
                                <span className={'input-group-text'}>Searchable</span>
                            </div>
                            <select id={"is_searchable"} value={event.is_searchable.value} onChange={HandleChange} className={"custom-select"}>
                                <option value={""}>Select an option</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </select>
                        </div>
                        {
                            (event.is_searchable.value === "true") ? <Keywords values={event.keywords.value} dispatch={NewEventDispatch}/> : ""
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
            <div className={"m-3"}>
                <button className={"btn btn-success"} onClick={submit}>Submit</button>
            </div>
        </div>
    )
}

export function Keywords(props){
    const {values, dispatch, hideEdit} = props
    const submitNewWord = (e) => {
        e.preventDefault()
        const value = e.target.keyword_new.value
        e.target.keyword_new.value = ""
        const action = {
            type: "array_add",
            payload: {
                key: "keywords",
                value: value
            },
        }
        dispatch(action)
    }

    const removeWord = value => {
        const action = {
            type: "array_remove",
            payload: {
                key: "keywords",
                value: value
            },
        }
        dispatch(action)
    }

    return (
        <div style={{flex:1}}>
            <h4>Keywords</h4>
            {
                hideEdit ? null : <form onSubmit={submitNewWord} className={"d-flex m-1 w-100"}>
                    <input id={"keyword_new"} placeholder={"Search Tag"} className={"form-control m-1"}/>
                    <button type={"submit"} className={"btn btn-sm btn-success m-1"}>Add</button>
                </form>
            }
            <div className={"w-100 d-flex flex-wrap"}>
            {
                values ? values.map((value, i) => {
                    return (
                        <div key={`keyword_${i}`} className={"m-1"}>
                            <h5>
                                <span className={"badge badge-info"}>
                                    {value}
                                    {
                                        hideEdit ? null:<span className={"badge badge-danger"} onClick={() => removeWord(value)}>X</span>
                                    }
                                </span>
                            </h5>
                        </div>
                    )
                }) : null
            }
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
        is_searchable: {
            value: "",
            isValid: false,
            isTouched: false,
            validation: BasicValidation
        },
        has_goal: {
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
        },
        keywords: {
            value: [],
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
        case 'select_org': {
            return {
                ...state,
                organization_id: payload
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
        case 'array_add': {
            const { key, value } = payload
            const newArr = [...state.event[key].value]
            newArr.push(value)
            return {
                ...state,
                event: {
                    ...state.event,
                    [key]: {
                        value: newArr
                    }
                }
            }
        }
        case 'array_remove': {
            const { key, value } = payload
            const newArr = state.event[key].value.filter(x => x !== value)
            return {
                ...state,
                event: {
                    ...state.event,
                    [key]: {
                        value: newArr
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
