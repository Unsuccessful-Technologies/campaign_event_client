import React from 'react';

function Loading(props) {
    const {children} = props
    return (
        <div className={"d-flex flex-column justify-content-center align-items-center h-100 d-inline-block"}>
            <div className={"loader"}></div>
            {children}
        </div>
    )
}

export default Loading;
