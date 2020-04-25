import React, {useEffect, useState, useCallback} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loading from "./common/Loading";
import {ActionTypes, ViewEvent} from "../store/actions";
import Invite from "./Invite";
import Checkout from "./Checkout";

function Event(props) {
    const {event_id} = useParams()
    const Events = useSelector(state => state.Events)
    const token = useSelector(state => state.User.token)
    const dispatch = useDispatch()

    const [ShowInvite, setShowInvite] = useState(false)
    const [ShowCheckout, setShowCheckout] = useState(false)


    const toggleShowInvite = useCallback(() => {
        setShowInvite(!ShowInvite)
    }, [ShowInvite, setShowInvite])

    const toggleShowCheckout = useCallback(() => {
        setShowCheckout(!ShowCheckout)
    }, [ShowCheckout, setShowCheckout])

    useEffect(() => {
        dispatch(ViewEvent({event_id}))
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        return function () {
            dispatch({type: ActionTypes.LEAVE_VIEW_EVENT})
        }
    }, [])


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
    console.log(event)
    const { name, type, description, start_date, end_date, goal_amount, organization } = event
    const isCampaign = type === 'campaign'
    return (
        <div {...props} className="home-container container-fluid">
            <div className={"card dark-bg"}>
                <div className={"card-header d-flex justify-content-between align-items-center"}>
                    <h2>{name}</h2>
                    <div className={"flex-grow-1 text-center"}>
                        <button className={"btn btn-info w-25 m-2"} onClick={toggleShowCheckout}>{ isCampaign ? "Donate" : "Buy Tickets"}</button>
                        <Checkout show={ShowCheckout} close={toggleShowCheckout}></Checkout>
                        <button className={"btn btn-success w-25 m-2"} onClick={toggleShowInvite}>Invite</button>
                        <Invite show={ShowInvite} close={toggleShowInvite}/>
                    </div>
                    <div className={"d-flex flex-column text-right"}>
                        <div>{isCampaign ? "Campaign Start" : "Event Date"}: {start_date}</div>
                        { isCampaign ? <div>Campaign End: {end_date}</div>: ""}
                        <div>Goal: ${goal_amount}.00</div>
                    </div>
                </div>
                <div className={"card-body d-flex"}>
                    <div className={"card dark-bg m-3 w-50"}>
                        <div className={"card-header"}>
                            <h3>Description</h3>
                        </div>
                        <div className={"card-body"}>
                            <p>{description}</p>
                        </div>
                    </div>
                    <div className={"d-flex flex-column m-3 w-50"}>
                        <div className={"card dark-bg"}>
                            <div className={"card-header"}>
                                <h3>Organization: {organization.name}</h3>
                            </div>
                            <div className={"card-body"}>
                                <p>{organization.description}</p>
                            </div>
                        </div>
                        <div className={"card dark-bg"}>
                            <div className={"card-header"}>
                                <h3>Fundraising Status</h3>
                            </div>
                            <div className={"card-body"}>
                                <p>FUNDS PROGRESS HERE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Event;
