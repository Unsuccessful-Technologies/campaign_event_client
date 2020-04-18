import React from 'react';
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";

function MemberProfile(props) {
    const User = useSelector(state => state.User)
    const { fName, lName, email, phone } = User.data
    return (
        <div {...props} className="home-container container-fluid">
            <h1>Member Profile</h1>
            <ul>
                <li>{fName}</li>
                <li>{lName}</li>
                <li>{email}</li>
                <li>{phone}</li>
            </ul>
            <ol>
                <li>Login Button Should Be Replace with "Profile" Button when logged in</li>
                <li>This page should fetch all Organizations and Events associated with user. Server should determine their role for each</li>
                <li>Each Org and Event should go to respective "Dashboard/Edit"</li>
            </ol>
        </div>
    );
}

export default MemberProfile;
