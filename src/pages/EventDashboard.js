import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ViewEvent} from "../store/actions";
import Loading from "./common/Loading";

function EventDashboard(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const UserID = useSelector(state => state.User.data._id)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch(ViewEvent({event_id}))
    }, [])

    useEffect(() => {
        if(Events.view_event && Events.view_event.admin_ids){
            const event = Events.view_event
            const {admin_ids} = event
            if(!admin_ids.includes(UserID)){
                history.push("/profile")
            }
        }
    }, [Events])

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
            <h2>EventDashboard.js</h2>
            <div className={"card dark-bg"}>
                <div className={"card-header"}>
                    <h3>{event.name}</h3>
                </div>
                <div className={"card-body"}>
                    <div className={"card dark-bg"}>
                        <h4>Privacy</h4>
                        <p>Open to public: {event.is_private ? "NO" : "YES"}</p>
                        <div>Admins: { event.admin_ids.map(x => <p key={x}>{x}</p>) }</div>
                        {
                            (event.member_ids.length > 0) ? (<div>Members: { event.member_ids.map(x => <p key={x}>{x}</p>) }</div>) : ""
                        }
                    </div>
                    <div className={"card dark-bg"}>
                        <h4>Event Information</h4>
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
    );
}

export default EventDashboard;
