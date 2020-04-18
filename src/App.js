import React, {forwardRef, createRef, useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Header from "./pages/common/header";
import Footer from "./pages/common/footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EventPages from "./pages/EventPages";
import SearchResults from "./pages/SearchResults";
import MemberProfile from "./pages/MemberProfile";

function App() {
    const HeaderRef = forwardRef(Header)
    const HeaderElement = createRef()
    const [HeaderHeight, SetHeaderHeight] = useState(0)

    useEffect(() => {
        console.log(HeaderElement.current.offsetHeight)
        SetHeaderHeight(HeaderElement.current.offsetHeight)
    }, [HeaderElement])

    return (
        <Router>
            <div id={'app'} className="site container d-flex flex-column align-items-center" style={{marginTop: `${HeaderHeight}px`,paddingTop: `${HeaderHeight/2}px`, backgroundColor:"#222222", minHeight:"100%"}}>
                <HeaderRef ref={HeaderElement}/>
                    <div className={"flex-grow-1 w-100"}>
                        <Switch>
                            <Route path="/" exact><Home/></Route>
                            <Route path="/login" exact><Login/></Route>
                            <Route path="/events" exact><EventPages/></Route>
                            <Route path="/search" exact><SearchResults/></Route>
                            <Route path="/profile" exact><MemberProfile/></Route>
                        </Switch>
                    </div>
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
