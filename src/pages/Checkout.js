import React from 'react';
import MyModal from "../components/MyModal";
import {useSelector} from "react-redux";

function Checkout(props) {
    const Event = useSelector(state => state.Events.view_event)
    const { show, close } = props
    const {type} = Event
    return (
        <MyModal show={show} close={close}>
            <div className={"card w-50 dark-bg"} onClick={e => e.stopPropagation()}>
                <div className={"card-header"}>
                    <h3>{type === 'campaign' ? "Donate" : "Buy Ticket"} <span className={"text-danger"}>TBD</span></h3>
                </div>
                <div className={"card-body"}>
                    <h3 className={"text-danger"}>TBD</h3>
                    <ul>
                        <li>Add Cancel Button</li>
                        <li>Donate or Buy Ticket, depending on event type</li>
                        <li>Two different forms depending on event type</li>
                        <li>Handle Payment data</li>
                        <li>Send Button</li>
                        <li>Feedback page for processing order</li>
                    </ul>
                </div>
            </div>
        </MyModal>
    );
}

export default Checkout;
