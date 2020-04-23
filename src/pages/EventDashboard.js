import React, {useEffect, useState} from 'react';
import {useParams, useHistory, Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ActionTypes, ViewEvent} from "../store/actions";
import Loading from "./common/Loading";

function EventDashboard(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const UserID = useSelector(state => state.User.data._id)
    const dispatch = useDispatch()
    const history = useHistory()
    const [EditMode, SetEditMode] = useState('')
    const UpdateEvent = (payload) => {

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
        if(Events.view_event && Events.view_event.admin_ids && UserID){
            const event = Events.view_event
            const {admin_ids} = event
            if(!admin_ids.includes(UserID)){
                history.push("/profile")
            }
        }
    }, [Events,UserID])

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

    if(Events.loading || !Events.view_event){
        return (
            <Loading><h1>Loading Event...</h1></Loading>
        )
    }

    const event = Events.view_event
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
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text bg-dark text-light">Public</span>
                                </div>
                                {
                                    EditMode === 'privacy' ?
                                        <select type="text" className="form-control" id="is_private" value={event.is_private}>
                                            <option value="false">Yes</option>
                                            <option value="true">No</option>
                                        </select>
                                        :
                                        <input className={"form-control"} readOnly={true} value={event.is_private ? "No":"Yes"}/>
                                }
                            </div>
                            <div className="mb-3">
                                <div>
                                    <h5>Admins</h5>
                                </div>
                                <div className={"d-flex flex-row flex-wrap"}>
                                {
                                    event.admins.map(x => {
                                        return (
                                            <div className={"card bg-dark m-3 p-3 pt-4 position-relative"}>
                                                <p style={{textTransform:"capitalize"}}>{x.fName} {x.lName}</p>
                                                <p>{x.email}</p>
                                                {
                                                    (EditMode === 'privacy') ?
                                                        <div className={"position-absolute p-1 text-danger"} style={{top:0, right: "5%", cursor:"pointer"}}>&times;</div>
                                                    : ""
                                                }
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                            {
                                (event.members.length > 0) ? (<div>Members: { event.member_ids.map(x => <p key={x}>{x}</p>) }</div>) : ""
                            }
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
