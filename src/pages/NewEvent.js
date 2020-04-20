import React from 'react';
import {useSelector} from "react-redux";
import {Link, useRouteMatch} from "react-router-dom";

function NewEvent(props) {
    const {url} = useRouteMatch()
    const User = useSelector(state => state.User)
    return (
        <div {...props} className="home-container container-fluid">
            <h1 className={'text-center'}>Create an Event!</h1>
            {
                (User.token) ? <LoggedIn/> : <NoLogIn url={url}/>
            }
        </div>
    );
}

function LoggedIn(props){
    return (
        <h1>I'm Logged in and ready for the next stage</h1>
    )
}

function NoLogIn(props){
    const {url} = props
    return (
        <div className={"card shadow-lg d-flex flex-row justify-content-center align-items-center p-4 m-1 dark-bg"}>
            <div className={"card shadow m-1 p-2 flex-grow-1 d-flex flex-column align-items-center"}>
                <h3 className={'text-dark'}>Already a User?</h3>
                <Link to={{pathname:"/login", state:{returnTo:url}}}>
                    <button className={"btn btn-primary"}>Login</button>
                </Link>
            </div>
            <div className={"card shadow m-1 p-2 flex-grow-1 d-flex flex-column align-items-center"}>
                <h3 className={'text-dark'}>New Here?</h3>
                <Link to={{pathname:"/join", state:{returnTo:url}}}>
                    <button className={"btn btn-success"}>Join</button>
                </Link>
            </div>
        </div>
    )
}

export default NewEvent;
