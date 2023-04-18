import React, {useEffect, useState} from "react";
import "./QuizForm.css";
import {useNavigate} from "react-router-dom";
import {Col, Container, Row} from "reactstrap";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";

let timer;
export default function QuizForm({theme}) {
    const [id, setId] = useState("");
    const [question, setQuestion] = useState({});
    const [countTimer, setCountTimer] = useState(60);
    const [questionId, setQuestionId] = useState();
    const [loading, setLoading] = useState(null);
    let navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading("pending");
                const quesId = await getEvent();
                await getQuestion(quesId);
                setLoading(null);
            } catch (e) {
                setLoading(null);
            }
        };
        fetch();

        timer = setInterval(() => {
            setCountTimer((countTimer) => countTimer - 1);
        }, 1000);
    }, []);

    useEffect(() => {
        if (countTimer < 1) {
            clearInterval(timer);
        }
    }, [countTimer]);

    const getQuestion = async (quesId) => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get("gamecode");
        setId(c);
        const docRef = doc(db, "questions", quesId);
        console.log(c);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setQuestion(docSnap.data());
            setCountTimer(docSnap.data().timer);
            return docSnap.data();
        } else {
            console.log("No such document!");
        }
    };

    const getEvent = async () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get("gamecode");
        const docRef = doc(db, "eventObserver", c);
        console.log(c);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().currentQuestion);
            setQuestionId(docSnap.data().currentQuestion);
            return docSnap.data().currentQuestion;
        } else {
            console.log("No such document!");
        }
    };

    const viewId = async () => {
        const washingtonRef = doc(db, "eventObserver", id);
        await updateDoc(washingtonRef, {
            currentQuestion: "",
        });

        navigate(`/report/${questionId}/${id}/?id=${id}`);
    };

    return (
        <>
            {loading === "pending" ? (
                <div style={{height: "100vh"}}
                     className={`${theme === "1"
                         ? " d-flex align-items-center justify-content-center"
                         : " d-flex align-items-center justify-content-center"
                     }`}
                >
                    <h2 style={{color: "white"}}>Loading...</h2>
                </div>
            ) : (
                <div className={theme === "1" ? "backGround" : "backGround1"}>
                    <Row className="img-bg height">
                        <Col
                            className={"d-flex  align-items-center padding1"}
                            md={2}
                            sm={8}
                        >
                            <div>
                                <img
                                    className="timer_img"
                                    width={"60%"}
                                    src="/images/timer.png"
                                    alt=""
                                />
                            </div>
                            <div>
                                <span className="font-timer">{countTimer}</span>
                            </div>
                        </Col>
                        <Col
                            className={"d-flex justify-content-center  align-items-center"}
                            md={8}
                            sm={12}
                        >
                            <div>
                                {question !== "undefined" &&
                                question["imgURL"] == null &&
                                question["videoURL"] == null ? (
                                    ""
                                ) : (
                                    <span className="question ">
                    {typeof question !== "undefined" ? question.question : ""}
                  </span>
                                )}
                            </div>
                        </Col>
                        <Col
                            style={{height: "70px"}}
                            className={
                                "d-flex justify-content-end  align-items-center padding2"
                            }
                            md={2}
                            sm={12}
                        >
                            <div>
                                <button onClick={viewId} className="btn-skip">
                                    Results
                                </button>
                            </div>
                        </Col>
                    </Row>
                    <Container>
                        <Row className="d-flex justify-content-center align-items-center">
                            {/* <Col md={3}></Col> */}
                            <Col
                                className="mt-2 d-flex justify-content-center align-items-center"
                                style={{
                                    height: "400px",
                                }}
                                md={7}
                            >
                                <div c>
                                    {question["imgURL"] !== null ? (
                                        <div>
                                            <img
                                                height="400"
                                                src={question["imgURL"]}
                                                alt="img-ques"
                                            />
                                        </div>
                                    ) : question["videoURL"] !== null ? (
                                        <>
                                            <video
                                                src={question["videoURL"]}
                                                width="450"
                                                height="250"
                                                type="video/mp4"
                                                controls
                                            />
                                        </>
                                    ) : (
                                        <p className="question-1">{question.question}</p>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Row>
                        <Col md={12}>
                            {/* <div className="pos-res-par">
                <img height={"2px"} src="/images/lines.png" /> */}
                            <span className="answers_text"/>
                            {/* </div> */}
                        </Col>
                    </Row>
                    <Container className="mt-3">
                        <Row>
                            <Col md={8} className="mx-auto">
                                <Row>
                                    <Col
                                        className="options-pos d-flex align-items-center justify-content-center"
                                        md={6}
                                    >
                                        <div className="center">
                                            <p className="text text-center">
                                                {typeof question["options"] !== "undefined" &&
                                                question["options"]["1"]}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col
                                        md={6}
                                        className="options-pos1 d-flex align-items-center justify-content-center"
                                    >
                                        <div className="center">
                                            <p className="text text-center">
                                                {typeof question["options"] !== "undefined" &&
                                                question["options"]["2"]}
                                            </p>
                                        </div>
                                    </Col>

                                    <Col
                                        className="options-pos2 d-flex align-items-center justify-content-center"
                                        md={6}
                                    >
                                        <div className="center">
                                            <p className="text text-center">
                                                {typeof question["options"] !== "undefined" &&
                                                question["options"]["3"]}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col
                                        md={6}
                                        className=" options-pos3 d-flex align-items-center justify-content-center"
                                    >
                                        <div className="center">
                                            <p className="text text-center">
                                                {typeof question["options"] !== "undefined" &&
                                                question["options"]["4"]}
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
        </>
    );
}
