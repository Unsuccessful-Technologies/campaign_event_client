import React from 'react';

function Home(props) {
    return (
        <div {...props} className="home-container container-fluid">
            <h1>Landing Page</h1>
            <ul>
                <li>Scroll bar of logged in users events</li>
                <li>Post top events/campaigns</li>
                <li>Active, coming up soon</li>
                <li>Successful Campaigns</li>
                <li>Top Orgs</li>
            </ul>
        </div>
    );
}

export default Home;
