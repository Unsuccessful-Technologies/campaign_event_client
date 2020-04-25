import React from 'react';

function MyModal(props) {
    const {children, show, close} = props
    return (
        <div
            id={'my-modal'}
            className={"position-fixed vw-100 vh-100 justify-content-center align-items-center"}
            style={{top: 0, left: 0, backgroundColor:"rgba(0,0,0,0.5)", zIndex: 1000, display: show ? "flex" : "none"}}
            onClick={close}
        >
            {children}
        </div>
    );
}

export default MyModal;
