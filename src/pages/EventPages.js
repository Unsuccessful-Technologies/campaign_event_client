import React from 'react';
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom'
import {PrivateRoute} from "../components/hoc/CustomProvider";
import Event from "./Event";
import NewEvent from "./NewEvent";

function EventPages(props) {
    const { path, url } = useRouteMatch()
    return (
        <div {...props} className="home-container container-fluid">
            <Switch>
                <Route exact path={path}>
                    <NewEvent/>
                </Route>
                <Route exact path={`${path}/public/:event_id`}>
                    <Event/>
                </Route>
                <PrivateRoute path={`${path}/:event_id`}>
                    <Event/>
                </PrivateRoute>
            </Switch>


        </div>
    );
}

export default EventPages;
