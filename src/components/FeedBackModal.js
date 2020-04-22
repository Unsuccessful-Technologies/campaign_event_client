import React, {useState} from 'react';

function FeedBackModal(props) {
    const {title, message, addTitleClass} = props
    const [Show, setShow] = useState(true)
    return (
        <div className="modal fade show" style={{display: Show ? "block": "none", backgroundColor:"rgba(0,0,0,0.3)"}} id="feedBackModal" tabIndex="-1" role="dialog" aria-labelledby="feedBackModal" aria-hidden="true">
            <div className="modal-dialog modal-dialog-center" role="document" >
                <div className="modal-content dark-bg">
                    <div className="modal-header">
                        <h5 className={["modal-title",...addTitleClass].join(" ")} id="exampleModalLabel">{title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {message}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShow(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeedBackModal;
