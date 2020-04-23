import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loading from "./common/Loading";
import {ActionTypes, ViewEvent} from "../store/actions";

function Event(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const token = useSelector(state => state.User.token)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(ViewEvent({event_id}))
        return function () {
            dispatch({type: ActionTypes.LEAVE_VIEW_EVENT})
        }
    }, [])
    console.log(Events)
    if(Events.error){
        // TODO: Add a login to redirect back here if 403 and no token
        return (
            <div>
                <h1 className={"text-danger"}>{Events.error.message}</h1>
                {
                    (Events.error.status === 403) ? (token) ? "" : <p>Please log in</p>: ""
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
            <h2>{event.name}</h2>
            <ul>
                {
                    Object.keys(event).map(key => {
                        if(typeof event[key] === "string"){
                            return (
                                <li>{key}: {event[key]}</li>
                            )
                        }
                    })
                }
            </ul>
        </div>
    );
}

export default Event;
