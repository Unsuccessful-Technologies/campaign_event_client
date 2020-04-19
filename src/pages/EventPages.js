import React from 'react';
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom'
import {PrivateRoute} from "../components/hoc/CustomProvider";

function EventPages(props) {
    const { path, url } = useRouteMatch()
    return (
        <div {...props} className="home-container container-fluid">
            <Switch>
                <Route exact path={path}>
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
                    <Link to={`${url}/123`}>
                        <button className={"btn btn-primary"}>Test Event ID 123</button>
                    </Link>
                </Route>
                <PrivateRoute path={`${path}/:event_id`}>
                    <h1>SHOW Event.js Page</h1>
                </PrivateRoute>
            </Switch>


        </div>
    );
}

export default EventPages;
