import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "reactstrap";

import {Link, useNavigate} from "react-router-dom";

export const Waiting = ({questions, indexing, theme}) => {
    let navigate = useNavigate();
    const [eventId, setEventId] = useState("");
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        getEventId();
    }, []);

    const getEventId = () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get("gamecode");
        setEventId(c);
    };

    // const data = () => {

    // };

    return (
        <>
            <div className={theme === "1" ? "backGround" : "backGround1"}>
                <Row className="img-bg height">
                    <Col
                        className={"d-flex  align-items-center padding1"}
                        md={2}
                        sm={12}
                    />
                    <Col
                        className={"d-flex justify-content-center  align-items-center"}
                        md={8}
                        sm={12}
                    />
                    <Col
                        style={{height: "70px"}}
                        className={
                            "d-flex justify-content-end  align-items-center padding2"
                        }
                        md={2}
                        sm={12}
                    >
                        <div>
                            <Link to={`/?gamecode=${eventId}`}>
                                <button className="btn-skip">Next</button>
                            </Link>
                        </div>
                    </Col>
                </Row>
                <div>
                    <div
                        style={{height: "80vh"}}
                        className="d-flex justify-content-center align-items-center"
                    >
                        {theme === "1" ? <img width="400" src="/finallogo.png" alt=""/> :
                            <img width="400" src="/images/gage.png" alt=""/>}
                    </div>
                </div>
                <div className="pos-report float-end">
                    <Link to={`/checkReports/${eventId}`}>
                        <Button>Chart</Button>
                    </Link>
                </div>
                <div className="pos-card float-end">
                    <Link to={`/reportcard/${eventId}`}>
                        <Button color="danger">Percentage</Button>
                    </Link>
                </div>
                <div className="pos-questions float-end">
                    <Link to={`/answers/${eventId}`}>
                        <Button color="success">Questions</Button>
                    </Link>
                </div>
            </div>
        </>
    );
};
