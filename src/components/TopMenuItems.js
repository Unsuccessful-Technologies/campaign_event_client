import React from 'react';
import {Link, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {ActionTypes} from "../store/actions";

function TopMenuItems(props) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.User.token)
    const location = useLocation()

    const logout = () => {
        dispatch({type:ActionTypes.LOGOUT})
    }

    return (
        <div id={'search-container'} className={'flex-1 d-flex flex-row'} {...props}>
            <Link to="/events/newevent"><button className={"btn btn-warning m-2 text-nowrap"} >Make Event</button></Link>
            <input className={'p-1  m-2 flex-grow-1 form-control'} id={'search-input'} placeholder={'Search Event...'}/>
            <Link to="/search"><button className={"btn btn-success m-2"} >Search</button></Link>
            {
                (token) ?
                    (
                        <div className={"d-flex flex-row"}>
                            <Link to="/profile"><button className={"btn btn-primary m-2"} >Profile</button></Link>
                            <button className={"btn btn-dark m-2"} onClick={logout} >Logout</button>
                        </div>
                    )
                    :
                    (<Link to={{pathname:"/login", state:{returnTo:(location.pathname !=="/")? location.pathname: "/profile"}}}><button className={"btn btn-primary m-2"} >Login</button></Link>)
            }
        </div>
    );
}

export default TopMenuItems;
