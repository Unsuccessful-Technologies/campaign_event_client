import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";

function MemberProfile(props) {
    const User = useSelector(state => state.User)
    const Events = useSelector(state => state.Events)
    const Organizations = useSelector(state => state.Organizations)
    const dispatch = useDispatch()
    const { fName, lName, email, phone } = User.data

    console.log(Events, Organizations)

    useEffect(() => {
        const { token } = User
    }, [])

    return (
        <div {...props} className="home-container container-fluid">
            <div className={"card dark-bg mb-3"}>
                <div className={"card-header"}>
                    <h3 style={{textTransform: "capitalize"}}>{fName} {lName}</h3>
                </div>
                <div className={"card-body"}>
                    <h4>{email}</h4>
                    <h4>{phone}</h4>
                </div>

            </div>
            <div className={"card dark-bg mb-3"}>
                <div className={"card-header"}>
                    <h3 style={{textTransform: "capitalize"}}>Events</h3>
                </div>
                <div className={"card-body d-flex flex-row"}>
                    {
                        Events.data.map(event => {
                            return (
                                <div className={"card dark-bg m-2"}>
                                    <div className={"card-header"}>
                                        <h3 style={{textTransform: "capitalize"}}>{event.name}</h3>
                                    </div>
                                    <div className={"card-body"}>
                                        <p>Description:</p>
                                        <p>{event.description}</p>
                                    </div>
                                    <div className={"card-footer"}>
                                        <button className={"btn btn-warning p-1 m-1"}>Edit</button>
                                        <button className={"btn btn-info p-1 m-1"}>View Page</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={"card dark-bg mb-3"}>
                <div className={"card-header"}>
                    <h3 style={{textTransform: "capitalize"}}>Organizations</h3>
                </div>
                <div className={"card-body d-flex flex-row"}>
                    {
                        Organizations.data.map(org => {
                            return (
                                <div className={"card dark-bg m-2"}>
                                    <div className={"card-header"}>
                                        <h3 style={{textTransform: "capitalize"}}>{org.name}</h3>
                                    </div>
                                    <div className={"card-body"}>
                                        <p>Description:</p>
                                        <p>{org.description}</p>
                                    </div>
                                    <div className={"card-footer"}>
                                        <button className={"btn btn-warning p-1 m-1"}>Edit</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    );
}

export default MemberProfile;
