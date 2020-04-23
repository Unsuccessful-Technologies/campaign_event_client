import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Redirect, useParams} from "react-router-dom";
import {Provider, useDispatch, useSelector} from "react-redux"
import store from "../../store"
import Loading from "../../pages/common/Loading";
import {ActionTypes, GetProfile, ValidateToken} from "../../store/actions";


function CustomProvider({children}) {


    return (
        <Provider store={store}>
            <Router>
                {children}
            </Router>
        </Provider>
    );
}

export default CustomProvider;

export function PrivateRoute({children, ...props}) {
    const User = useSelector(state => state.User)
    const sessionUser = JSON.parse(window.sessionStorage.getItem('user'))
    let token
    if(sessionUser){
        token = sessionUser.token
    }
    return (
        <Route
            {...props}
            render={({location}) => {
                const isAuthorized = User.token || token
                const visitorToken = getSearchParam('visitorToken', location)
                if(isAuthorized){
                    return children
                }
                if(visitorToken){
                    return (
                        <LoadToken token={visitorToken}>
                            {children}
                        </LoadToken>
                    )
                }
                return (<Redirect to={{pathname: "/login", state: { from: location }}} />)
            }}
        />
    )
}

const LoadToken = (props) => {
    const { children, token } = props
    const {event_id} = useParams()
    const TokenValidation = useSelector(state => state.TokenValidation)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(ValidateToken({token,event_id}))
    },[])

    if(TokenValidation.data.allowed === false){
        return (<Redirect to={{pathname: "/login"}} />)
    }

    return TokenValidation.loading ?
        (
            <Loading/>
        ) : (children)

}

function getSearchParam(variable, location) {
    const query = location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}
