import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom"
import Loading from "./common/Loading";
import {GetPublicEvents} from "../store/actions";


function Home(props) {
    const PublicEvents = useSelector(state => state.PublicEvents)
    const dispatch = useDispatch()

    const history = useHistory()

    useEffect(() => {
        dispatch(GetPublicEvents())
    }, [dispatch])

    if(PublicEvents.error){
        return (
            <div>
                <h1 className={"text-danger text-center"}>{PublicEvents.error.message}</h1>
            </div>
        )
    }

    if(PublicEvents.loading || !Array.isArray(PublicEvents.data)){
        return (
            <Loading><h1>Loading Events...</h1></Loading>
        )
    }

    const fundraise = PublicEvents.data.filter(x => x.type === "campaign")
    const events = PublicEvents.data.filter(x => x.type === "ticketed")

    return (
        <div {...props} className="home-container container-fluid">
            <div className={"card dark-bg m-3"}>
                <div className={"card-header"}>
                    <h1>Fundraising Campaigns</h1>
                </div>
                <div className={"card-body"}>
                    <div id="fundraise_indicator" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {
                                fundraise.map((item, i) => {
                                    return item.type === "campaign" ? (
                                        <MyItem key={`item_${item._id}`} name={item.name} id={item._id} history={history} first={i === 0}/>
                                    ) : null
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#fundraise_indicator" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#fundraise_indicator" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className={"card dark-bg m-3"}>
                <div className={"card-header"}>
                    <h1>Events</h1>
                </div>
                <div className={"card-body"}>
                    <div id="events_indicator" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                            {
                                events.map((item, i) => {
                                    return item.type === "ticketed" ? (
                                        <MyItem key={`item_${item._id}`} name={item.name} id={item._id} history={history} first={i === 0}/>
                                    ) : null
                                })
                            }
                        </div>
                        <a className="carousel-control-prev" href="#events_indicator" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#events_indicator" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

const MyItem = props => {
    const { name, id, history, first} = props
    const SelectRandom = () => {
        const pics_arr = ["/assets/photo_1.jpeg","/assets/photo_2.jpg","/assets/photo_3.jpeg"]
        const number = pics_arr.length
        const index = Math.floor(Math.random() * number)
        return pics_arr[index]
    }
    const photoURL = SelectRandom()
    const goToEvent = () => {
        history.push("/events/" + id)
    }
    return (
        <div className={first ? "carousel-item active" : "carousel-item"} onClick={goToEvent}>
            <div className={"card dark-bg"} style={{margin: "auto",width: "50%", height: "300px", overflow: "hidden"}}>
                <div className={"card-header"}>
                    <h3>{name}</h3>
                </div>
                <img src={photoURL} alt={photoURL} style={{width:"100%", height: "auto"}}/>
            </div>
        </div>
    )
}
