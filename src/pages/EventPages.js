import React from 'react';
import {Switch, Route, useRouteMatch} from 'react-router-dom'
import {PrivateRoute} from "../components/hoc/CustomProvider";
import Event from "./Event";
import NewEvent from "./NewEvent";
import EventDashboard from "./EventDashboard";

function EventPages(props) {
    const { path } = useRouteMatch()
    return (
        <div {...props} className="home-container container-fluid">
            <Switch>
                <Route path={`${path}/newevent`}>
                    <NewEvent/>
                </Route>
                <Route exact path={`${path}/:event_id`}>
                    <Event/>
                </Route>
                <PrivateRoute path={`${path}/:event_id/dashboard`}>
                    <EventDashboard/>
                </PrivateRoute>
            </Switch>


        </div>
    );
}

export default EventPages;
