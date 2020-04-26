import React, {useEffect, useState, useRef} from 'react';
import {useParams, useHistory, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ActionTypes, UserToEvent, ViewEvent} from "../store/actions";
import Loading from "./common/Loading";
import {Keywords} from "./NewEvent";

function EventDashboard(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const {view_event} = Events
    const UserID = useSelector(state => state.User.data._id)
    const dispatch = useDispatch()
    const history = useHistory()
    const [EditMode, SetEditMode] = useState('')
    const [event, setLocalEvent] = useState(null)
    const [addUser, setAddUser] = useState({type:null})
    const EmailInputs = {
        admin: useRef(),
        member: useRef()
    }
    const KeywordInput = useRef()

    const RemoveUser = (action) => {
        const {type, index} = action
        const user = event[`${type}s`][index]
        const payload = {
            type,
            email: user.email
        }
        dispatch(UserToEvent({type: "delete", payload}))
    }

    const AddUser = () => {
        const {type} = addUser
        const email = EmailInputs[type].current.value
        EmailInputs[type].current.value = ""
        const payload = {
            type,
            email
        }
        setAddUser({type: null})
        dispatch(UserToEvent({type: "add", payload}))
    }

    const UpdateEvent = (action) => {
        const {payload} = action
        switch (action.type) {
            case "array_add": {
                const {key,value} = payload
                const newArr = [...event[key]]
                newArr.push(value)
                setLocalEvent({
                    ...event,
                    [key]:newArr
                })
                break;
            }
            case "array_remove": {
                const { key, value } = payload
                const newArr = event[key].filter(x => x !== value)
                setLocalEvent({
                    ...event,
                    [key]:newArr
                })
                break;
            }
            default: return
        }
    }

    useEffect(() => {
        dispatch(ViewEvent({event_id}))
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return function () {
            dispatch({type: ActionTypes.LEAVE_VIEW_EVENT})
        }
    }, [])

    useEffect(() => {
        if(view_event && UserID){
            const {admins, members} = view_event
            const admin_ids = admins.map(x => x._id)
            const member_ids = members.map(x => x._id)
            const isAdmin = admin_ids.includes(UserID)
            const isMember = member_ids.includes(UserID)

            if(isAdmin) {
                setLocalEvent({...view_event, isAdmin})

            } else if(isMember) {
                setLocalEvent({...view_event})
            } else {
                history.push("/profile")
            }
        }
    }, [view_event,UserID])

    if(Events.error){
        // TODO: Add a login to redirect back here if 403 and no token
        return (
            <div>
                <h1 className={"text-danger"}>{Events.error.message}</h1>
                {
                    (Events.error.status === 403) ? <p>Please log in</p>: null
                }
            </div>
        )
    }

    if(Events.loading || !event){
        return (
            <Loading><h1>Loading Event...</h1></Loading>
        )
    }

    return (
        <div {...props} className="home-container container-fluid">
            <div className={"d-flex justify-content-between"}>
                <h2>EventDashboard.js</h2>
                <Link to={`/events/${event._id}`}><button className={"btn btn-info"}>View Event Page</button></Link>
            </div>
            <div className={"card dark-bg"}>
                <div className={"card-header"}>
                    <h3>{event.name}</h3>
                </div>
                <div className={"card-body"}>

                    <div className={"card dark-bg shadow-lg m-3"}>
                        <div className={"card-header"}>
                            <h4 className={"d-inline-block"}>Privacy</h4>
                            <div className={"float-right"}>
                                {
                                    EditMode === 'privacy' ?
                                        <div>
                                            <button className={"btn btn-sm btn-success m-2"} onClick={() => SetEditMode('submit')}>Save</button>
                                            <button className={"btn btn-sm btn-danger m-2"} onClick={() => SetEditMode('')}>Cancel</button>
                                        </div>
                                        :
                                        <div>
                                            <button className={"btn btn-sm btn-primary"} onClick={() => SetEditMode('privacy')}>Edit</button>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className={"card-body"}>
                            <div className={"d-flex"}>

                                <div className="input-group m-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark text-light">Public</span>
                                    </div>
                                    {
                                        EditMode === 'privacy' ?
                                            <select type="text" className="form-control" id="is_private" value={event.is_private}>
                                                <option value="false">Open</option>
                                                <option value="true">Closed</option>
                                            </select>
                                            :
                                            <input className={"form-control"} readOnly={true} value={event.is_private ? "Closed":"Open"}/>
                                    }
                                </div>

                                <div className="input-group m-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-dark text-light">Searchable</span>
                                    </div>
                                    {
                                        EditMode === 'privacy' ?
                                            <select type="text" className="form-control" id="is_searchable" value={event.is_searchable}>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                            :
                                            <input className={"form-control"} readOnly={true} value={event.is_searchable ? "Yes":"No"}/>
                                    }
                                </div>

                            </div>


                            <div className={"d-flex"}>
                                {
                                    (event.is_searchable && event.keywords && event.keywords.length > 0) ?
                                        <Keywords values={event.keywords} dispatch={UpdateEvent} hideEdit={EditMode !== 'privacy'}/> : null
                                }
                            </div>
                        </div>
                    </div>

                    <div className={"card dark-bg shadow-lg m-3"}>
                        <div className={"card-header"}>
                            <h4 className={"d-inline-block"}>Users</h4>
                        </div>
                        <div className={"card-body"}>
                            <div className={"d-flex"}>

                                {
                                    event.isAdmin ? <div className="m-3" style={{flex:1, maxHeight: "400px"}}>
                                        <div className={"d-flex justify-content-between"}>
                                            <h5>Admins</h5>
                                        </div>
                                        <table className={"table table-dark w-100"}>
                                            <thead>
                                            <tr>
                                                <th scope="col">Email</th>
                                                <th scope="col" className={"text-center"}><button className={"btn btn-sm btn-success"} onClick={() => setAddUser({type:"admin"})}>Add</button></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                event.admins.map((x,i) => {
                                                    return (
                                                        <tr key={`admin_${i}`}>
                                                            <td>{x.email}</td>
                                                            {
                                                                i === 0 ? <td></td>:<td
                                                                    className={"text-danger text-center"}
                                                                    style={{cursor:"pointer"}}
                                                                    onClick={() => RemoveUser({type:"admin",index: i} )}>&times;</td>
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {
                                                addUser.type === 'admin' ?
                                                    <tr>
                                                        <td><input ref={EmailInputs.admin} className={'form-control'} placeholder={"Email"}/></td>
                                                        <td><button onClick={AddUser} className={"btn btn-sm btn-primary"}>Submit</button></td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        </table>
                                    </div> : null
                                }

                                <div className="m-3" style={{flex:1, maxHeight: "400px"}}>
                                    <div className={"d-flex justify-content-between"}>
                                        <h5>Members</h5>
                                    </div>
                                    <table className={"table table-dark w-100"}>
                                        <thead>
                                        <tr>
                                            <th scope="col">Email</th>
                                            <th scope="col" className={"text-center"}><button className={"btn btn-sm btn-success"} onClick={() => setAddUser({type:"member"})}>Add</button></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            event.members.map((x,i) => {
                                                return (
                                                    <tr key={`member_${i}`}>
                                                        <td>{x.email}</td>
                                                        {
                                                            event.isAdmin ? <td
                                                                className={"text-danger text-center"}
                                                                style={{cursor:"pointer"}}
                                                                onClick={() => RemoveUser({type:"member",index: i} )}>&times;</td> : null
                                                        }
                                                    </tr>
                                                )
                                            })
                                        }
                                        {
                                            addUser.type === 'member' ?
                                                <tr>
                                                    <td><input ref={EmailInputs.member} className={'form-control'} placeholder={"Email"}/></td>
                                                    <td><button onClick={AddUser} className={"btn btn-sm btn-primary"}>Submit</button></td>
                                                </tr>
                                                : null
                                        }
                                        </tbody>
                                    </table>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div className={"card dark-bg shadow-lg m-3"}>
                        <div className={"card-header"}>
                            <h4>Event Information</h4>
                        </div>
                        <div className={"card-body"}>
                            <p>Name: {event.name}</p>
                            <p>Type: {event.type}</p>
                            <p>Description: {event.description}</p>
                            <p>Start: {event.start_date}</p>
                            <p>End: {event.start_date}</p>
                            <p>Goal: $ {event.goal_amount}.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDashboard;
