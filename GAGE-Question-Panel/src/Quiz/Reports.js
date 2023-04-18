import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Col, Container, Row} from "reactstrap";
import {db} from "../firebase";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js";
// import { getDoc, doc,updateDoc } from "firebase/firestore";
import {doc, getDoc} from "firebase/firestore";
import {Bar} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Reports = ({questions, theme}) => {
    const {id} = useParams();
    const {eid} = useParams();
    const [answers, setAnswers] = useState({});
    const [question, setQuestion] = useState({});
    const [loading, setLoading] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading("pending");
                await getQuestion();
                await getAnswers();
                setLoading(null);
            } catch (e) {
                setLoading(null);
            }
        };
        fetch();
        getAnswers();
    }, []);

    const getAnswers = async () => {
        const docRef = doc(db, "answers", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           
            let obj = docSnap.data();
           
           
           
           
            setAnswers(obj["asnwersData"][id]);
        } else {
           
        }
    };

    const getQuestion = async () => {
        const question1 = doc(db, "questions", id);
        const questionSnap = await getDoc(question1);
        if (questionSnap.exists()) {
           
            let obj = questionSnap.data();
           
            setQuestion(obj);
        } else {
           
        }
    };
    useEffect(() => {
       
    }, []);
    const data = {
        labels: typeof question.options !== "undefined" && [
            question.options["1"],
            question.options[2],
            question.options[3],
            question.options[4],
        ],
        datasets: [
            {
                label: "# of Results",
                data: typeof answers !== "undefined" && [
                    answers[1],
                    answers[2],
                    answers[3],
                    answers[4],
                ],
                backgroundColor: [
                    "#4F9F30",
                    "#3977CB",
                    "#C07E2F",
                    "#A82929",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderColor: ["#4F9F30", "#3977CB", "#C07E2F", "#A82929"],
                borderWidth: 3,
                datalabels: {
                    color: "white",
                },
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    color: "white",
                    borderColor: "white",
                },
                beginAtZero: true,
                ticks: {
                    color: "white",
                    font: {
                        size: 0,
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                    color: "white",
                    borderColor: "white",
                },
                beginAtZero: true,
                ticks: {
                    color: "white",
                    font: {
                        size: 20,
                    },

                    stepSize: 1,
                },
            },
        },
    };

    return (
        <>
            {loading === "pending" ? (
                <div
                    style={{height: "100vh"}}
                    className="d-flex justify-content-center align-items-center"
                >
                    <h2 style={{color: "white", marginTop: "20px"}}>Loading...</h2>
                </div>
            ) : (
                <div>
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
                        >
                            <p className="question">{question.question}</p>
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
                                <Link
                                    to={`/waiting/?gamecode=${eid}`}
                                    className="text-decoration-none"
                                >
                                    <button className="btn-skip">Next</button>
                                </Link>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={12} className="d-flex justify-content-center ">
                            <div>
                                {/*<img height={"2px"} src="/images/lines.png"/>*/}
                                <p className="results_text">Results</p>
                            </div>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center align-items-center mt-1">
                        <Col md={6}>
                            <Bar data={data} options={options}/>
                            {/* <Link to={`/checkReports/${eid}`}>
                                <Button className="float-end mt-5"> Reports </Button>
                            </Link> */}
                        </Col>
                    </Row>

                    <Container>
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
};

export default Reports;
