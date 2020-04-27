import React from 'react';

function Footer(props) {
    return (
        <footer id={"site-footer"} className="w-100 p-3 mt-5" style={{backgroundColor:"#333333"}} {...props}>
            <p style={{fontSize:"12px"}}>2020 &copy; Unsuccessful Technologies LLC. All Rights Reserved.</p>
        </footer>
    );
}

export default Footer;
