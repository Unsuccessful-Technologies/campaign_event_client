import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Loading from "./common/Loading";
import FeedBackModal from "../components/FeedBackModal";

function MemberProfile(props) {
    const User = useSelector(state => state.User)
    const Events = useSelector(state => state.Events)
    const Organizations = useSelector(state => state.Organizations)
    const history = useHistory()
    const { fName, lName, email, phone } = User.data

    if(User.error){
        console.log(User)
    }

    if(User.loading){
        return (
            <Loading><h1>Loading profile...</h1></Loading>
        )
    }

    return (
        <div {...props} className="home-container container-fluid">
            {
                (User.error) ?
                    <FeedBackModal title={'An Error Occurred'} message={User.error.message} addTitleClass={["text-danger"]}/> : ""
            }
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
                        Events.my_events.map(event => {
                            return (
                                <div className={"card dark-bg m-2"} key={event._id} style={{flex:1}}>
                                    <div className={"card-header"}>
                                        <h3 style={{textTransform: "capitalize"}}>{event.name}</h3>
                                    </div>
                                    <div className={"card-body"}>
                                        <p>Description:</p>
                                        <p>{event.description}</p>
                                    </div>
                                    <div className={"card-footer"}>
                                        <button className={"btn btn-warning p-1 m-1"} onClick={() => history.push(`/events/${event._id}/dashboard`)}>Dashboard</button>
                                        <button className={"btn btn-info p-1 m-1"} onClick={() => history.push(`/events/${event._id}`)}>View Page</button>
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
                                <div className={"card dark-bg m-2"} key={org._id} style={{flex:1}}>
                                    <div className={"card-header"}>
                                        <h3 style={{textTransform: "capitalize"}}>{org.name}</h3>
                                    </div>
                                    <div className={"card-body"}>
                                        <p className={"text-danger"}>Maybe show events this org owns or the admins</p>
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
