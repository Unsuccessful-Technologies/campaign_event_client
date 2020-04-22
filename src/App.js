import React, {forwardRef, createRef, useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Provider, useDispatch} from "react-redux"
import store from "./store"

import Header from "./pages/common/header";
import Footer from "./pages/common/footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventPages from "./pages/EventPages";
import SearchResults from "./pages/SearchResults";
import MemberProfile from "./pages/MemberProfile";
import CustomProvider, {PrivateRoute} from "./components/hoc/CustomProvider";
import Join from "./pages/Join";
import {ActionTypes, GetProfile} from "./store/actions";

function App() {
    const HeaderRef = forwardRef(Header)
    const HeaderElement = createRef()
    const [HeaderHeight, SetHeaderHeight] = useState(0)

    useEffect(() => {
        SetHeaderHeight(HeaderElement.current.offsetHeight)
    }, [HeaderElement])

    return (
        <CustomProvider>
                <div id={'app'} className="site container d-flex flex-column align-items-center" style={{marginTop: `${HeaderHeight}px`,paddingTop: `${HeaderHeight/2}px`, minHeight:"100%"}}>
                    <HeaderRef ref={HeaderElement}/>
                        <div className={"flex-grow-1 w-100"}>
                            <Switch>
                                <Route path="/" exact><Home/></Route>
                                <Route path="/login" exact><Login/></Route>
                                <Route path="/join" exact><Join/></Route>
                                <Route path="/events"><EventPages/></Route>
                                <Route path="/search"><SearchResults/></Route>
                                <PrivateRoute path="/profile"><MemberProfile/></PrivateRoute>
                            </Switch>
                        </div>
                    <Footer/>
                </div>
        </CustomProvider>
    );
}

export default App;
