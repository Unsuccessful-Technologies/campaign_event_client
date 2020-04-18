import React from 'react';
import {Link} from "react-router-dom";

function Login(props) {
    return (
        <div {...props} className="home-container container-fluid">
            <h1>Login</h1>
            <div className={"d-flex flex-column justify-content-center"}>
                <input className={"form-control"} placeholder={"email"}/>
                <input type={"password"} className={"form-control"} placeholder={"password"}/>
            </div>
            <Link to="/profile">
                <button className={"btn btn-success"}>
                    Login
                </button>
            </Link>
        </div>
    );
}

export default Login;
