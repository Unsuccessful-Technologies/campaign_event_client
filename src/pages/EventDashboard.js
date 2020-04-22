import React from 'react';
import {Link} from "react-router-dom";

function EventDashboard(props) {
    // TODO: Admins and Members
    return (
        <div {...props} className="home-container container-fluid">
            <h2>EventDashboard.js</h2>
            <ul>
                <li>Handle Both Public and Private Events</li>
                <li>3 different views, Manager/Organizer, EventMember, Public</li>
            </ul>
        </div>
    );
}

export default EventDashboard;
