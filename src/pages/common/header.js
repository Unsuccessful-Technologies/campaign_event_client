import React from 'react';
import {Link} from "react-router-dom";
import TopMenuItems from "../../components/TopMenuItems";

function Header(props, ref) {
    return (
            <header id={'site-header'} ref={ref} className="fixed-top d-flex flex-row justify-content-around align-items-center" style={{padding:" 16px 64px", backgroundColor:"#111111"}} {...props} >
                <Link style={{textDecoration: "none", color:"inherit"}} to="/"><h1>Campaign Event Platform</h1></Link>
                <TopMenuItems/>
            </header>
    );
}

export default Header;
