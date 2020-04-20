import React from 'react';
import {useSelector} from "react-redux";

function NewEvent(props) {
    const User = useSelector(state => state.User)
    return (
        <div {...props} className="home-container container-fluid">
                <h2>NewEvent.js</h2>
                <ul>
                    <li>Different form based on logged in or not</li>
                    <li>Prompt already user login</li>
                </ul>
        </div>
    );
}

export default NewEvent;
