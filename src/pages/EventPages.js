import React from 'react';

function EventPages(props) {
    return (
        <div {...props} className="home-container container-fluid">
            <h1>Event Pages</h1>
            <ul>
                <li>If route param for event_id show Event.js otherwise show NewEvent.js</li>
                <li>
                    <p>NewEvent.js</p>
                    <ul>
                        <li>Different form based on logged in or not</li>
                        <li>Prompt already user login</li>
                    </ul>
                </li>
                <li>
                    <p>Event.js</p>
                    <ul>
                        <li>3 different views, Manager/Organizer, EventMember, Public</li>
                    </ul>
                </li>
            </ul>

        </div>
    );
}

export default EventPages;
