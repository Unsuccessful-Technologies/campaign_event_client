import React, {useState} from 'react';
import MyModal from "../components/MyModal";

function Invite(props) {
    const { show, close } = props
    return (
        <MyModal show={show} close={close}>
            <div className={"card w-50 dark-bg"} onClick={e => e.stopPropagation()}>
                <div className={"card-header"}>
                    <h3>Invite <span className={"text-danger"}>TBD</span></h3>
                </div>
                <div className={"card-body"}>
                    <h3 className={"text-danger"}>TBD</h3>
                    <ul>
                        <li>Only Show Invite for allowed user if necessary</li>
                        <li>Input multiple emails</li>
                        <li>Custom Message</li>
                        <li>Send Button</li>
                    </ul>
                </div>
            </div>
        </MyModal>
    );
}

export default Invite;
