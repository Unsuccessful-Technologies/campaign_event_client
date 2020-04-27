import React, {useEffect, useState, useRef} from 'react';
import {useParams, useHistory, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ActionTypes, UpdateEvent, UserToEvent, ViewEvent} from "../store/actions";
import Loading from "./common/Loading";
import {Keywords} from "./NewEvent";

function EventDashboard(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const {view_event, update_event} = Events
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

    const GetValuesThatChanged = () => {
        const update = {}
        Object.keys(event).forEach(key => {
            if(typeof event[key] === 'string' && view_event[key] !== event[key]){
                update[key] = event[key]
            }
            if(Array.isArray(event[key])){
                let org_length = view_event[key] ? view_event[key].length : 0
                let new_length = event[key].length
                let same = true
                event[key].forEach(item => {
                    if(view_event[key]){
                        same = same && view_event[key].includes(item)
                    }
                })
                if(org_length !== new_length){
                    same = false
                }
                if(!same){
                    update[key] = event[key]
                }
            }
        })
        return update
    }

    const UpdateEventReducer = (action) => {
        const {payload} = action
        switch (action.type) {
            case "array_add": {
                const {key,value} = payload
                const newArr = event[key] ? [...event[key]] : []
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
            case "update": {
                const {key, value} = payload
                setLocalEvent({
                    ...event,
                    [key]: value
                })
                break;
            }
            case "submit": {
                dispatch(UpdateEvent(payload))
                break;
            }
            default: return
        }
    }

    const HandleUpdate = e => {
        const { id, value } = e.target
        const action = {
            type: "update",
            payload: {
                key: id,
                value
            }
        }
        UpdateEventReducer(action)
    }

    const HandleSubmit = () => {
        const payload = GetValuesThatChanged()
        if(Object.keys(payload).length > 0){
            SetEditMode('submit')
            UpdateEventReducer({type:"submit", payload})
        } else {
            SetEditMode("")
        }
    }

    const HandleCancel = () => {
        if(event.isAdmin){
            setLocalEvent({...view_event, isAdmin:true})
        } else {
            setLocalEvent(view_event)
        }
        SetEditMode('')
    }

    useEffect(() => {
        dispatch(ViewEvent({event_id}))
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return function () {
            dispatch({type: ActionTypes.LEAVE_VIEW_EVENT})
        }
    }, [dispatch,event_id])

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
    }, [view_event,UserID,history])

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
            <div className={"d-flex justify-content-end mb-3"}>
                <Link to={`/events/${event._id}`}><button className={"btn btn-info"}>View Event Page</button></Link>
            </div>
            <div className={"card dark-bg"}>
                <div className={"card-header"}>
                    <h6 className={"badge badge-info"}>{event.type === "campaign" ? "Fundraiser" : "Event"}</h6><h3>{event.name}</h3>
                </div>
                <div className={"card-body"}>

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

                    {
                        event.isAdmin ? <div className={"card dark-bg shadow-lg m-3"}>
                            <div className={"card-header"}>
                                <h4 className={"d-inline-block"}>Privacy</h4>
                                <div className={"float-right"}>
                                    {
                                        EditMode === 'privacy' ?
                                            <div>
                                                <button className={"btn btn-sm btn-success m-2"} onClick={HandleSubmit}>Save</button>
                                                <button className={"btn btn-sm btn-danger m-2"} onClick={HandleCancel}>Cancel</button>
                                            </div>
                                            :
                                            <div>
                                                <button className={"btn btn-sm btn-primary"} onClick={() => SetEditMode('privacy')}>Edit</button>
                                            </div>
                                    }
                                </div>
                            </div>
                            {
                                update_event.loading ?
                                <Loading>
                                    <h2>Updating...</h2>
                                </Loading>
                                    :
                                <div className={"card-body"}>
                                    <div className={"d-flex"}>

                                        <MyInput editType={"privacy"} name={"Public"} id={"is_private"} type={"boolean"} options={{true:"Close",false:"Open"}} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>

                                        <MyInput editType={"privacy"} name={"Seachable"} id={"is_searchable"} type={"boolean"} options={{true:"Yes",false:"No"}} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>

                                    </div>

                                    <div className={"d-flex"}>
                                        {
                                            ((event.is_searchable === true || event.is_searchable === "true")) ?
                                                <Keywords values={event.keywords} dispatch={UpdateEventReducer} hideEdit={EditMode !== 'privacy'}/> : null
                                        }
                                    </div>
                                </div>
                            }
                        </div> : null
                    }

                    {
                        event.isAdmin ? <div className={"card dark-bg shadow-lg m-3"}>
                            <div className={"card-header"}>
                                <h4>Event Information</h4>
                                <div className={"float-right"}>
                                    {
                                        EditMode === 'event_info' ?
                                            <div>
                                                <button className={"btn btn-sm btn-success m-2"} onClick={HandleSubmit}>Save</button>
                                                <button className={"btn btn-sm btn-danger m-2"} onClick={HandleCancel}>Cancel</button>
                                            </div>
                                            :
                                            <div>
                                                <button className={"btn btn-sm btn-primary"} onClick={() => SetEditMode('event_info')}>Edit</button>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className={"card-body"}>
                                <MyInput editType={"event_info"} name={"Name"} id={"name"} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                <MyInput editType={"event_info"} name={"Description"} id={"description"} type={"textarea"} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                <MyInput editType={"event_info"} name={event.type === "campaign" ? "Start" : "Date"} id={"start_date"} type={"date"} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                {
                                    event.type === "campaign" ?
                                        <MyInput editType={"event_info"} name={"End"} id={"end_date"} type={"date"} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                        : null
                                }
                                {
                                    event.type === "campaign" ?
                                        <MyInput editType={"event_info"} name={"Set Goal Amount"} id={"has_goal"} type={"boolean"} options={{true:"Yes",false:"No"}} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                        : null
                                }
                                {
                                    ( event.type === "campaign" && (event.has_goal === "true" || event.has_goal === true) ) ?
                                        <MyInput editType={"event_info"} name={"Goal"} id={"goal_amount"} type={"number"} event={event} EditMode={EditMode} HandleUpdate={HandleUpdate}/>
                                        : null
                                }
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        </div>
    );
}

export default EventDashboard;

const MyInput = (props) => {
    const { name, id, event, EditMode, HandleUpdate, type, options, editType } = props

    return (
        <div className="m-3 d-flex">
            <div className="input-group-prepend" style={{flex:1}}>
                <span className="input-group-text bg-dark text-light w-100">{name}</span>
            </div>
            <div style={{flex:3}}>
                {
                    EditMode === editType ?
                        type === "boolean" ?
                            <select type="text" className="form-control" id={id} value={event[id]} onChange={HandleUpdate}>
                                <option value="true">{options.true}</option>
                                <option value="false">{options.false}</option>
                            </select>
                            :
                            type === "textarea" ?
                                <textarea rows={5} className="form-control" id={id} value={event[id]} onChange={HandleUpdate}/>
                                :
                                <input type={type||"text"} className="form-control" id={id} value={event[id]} onChange={HandleUpdate}/>
                        :
                        type === "boolean" ?
                            <input className={"form-control"} readOnly={true} value={ (event[id] === "true" || event[id] === true)  ? options.true:options.false}/>
                            :
                            type === "textarea" ?
                                <textarea rows={5} className="form-control" id={id} value={event[id]} readOnly={true}/>
                                :
                                <input className={"form-control"} readOnly={true} value={event[id]}/>
                }
            </div>
        </div>
    )
}
