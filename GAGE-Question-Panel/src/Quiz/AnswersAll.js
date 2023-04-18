import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "reactstrap";
import {db} from "../firebase";
import {Link, useParams} from "react-router-dom";
import {collection, doc, getDoc, getDocs, orderBy, query, where,} from "firebase/firestore";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js";
import {Bar} from "react-chartjs-2";
import Navbar from "./Navbar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnswersAll = () => {
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState("");
    const {eid} = useParams();
    useEffect(() => {
        console.log("useEffect");
        const fetch = async () => {
            try {
                setLoading("pending");
                const data = await tempFunc();
                setQuestions(data);
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
            //   console.log("Document data:", docSnap.data());
            let obj = docSnap.data();
            //   console.log(obj);
            //   console.log(eid);
            //   console.log(id);
            // console.log(obj["asnwersData"][eid]);
            //   for (const objKey in obj["asnwersData"][eid]) {
            //     // console.log(obj["asnwersData"][eid][objKey]);
            //     const _newObject = obj["asnwersData"][eid][objKey];
            //     console.log(_newObject);
            //     // const _key = obj[objKey];
            //     // console.log(_key);
            //     // console.log("Keys only",Object.keys(inventories));
            //     // if (Object.keys(inventories).includes(obj[objKey])) {
            //     //   inventories[_key] = inventories[_key] + 1;
            //     // } else {
            //     //   inventories[_key] = 1;
            //     // }
            //   }
            setAnswers(obj["asnwersData"]);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    };

    async function tempFunc() {
        const questionsRef = collection(db, "questions");
        const q = query(
            questionsRef,
            where("eventID", "==", eid),
            orderBy("sequence", "asc")
        );
        const screens = await getDocs(q);
        let dataarr = [];
        screens.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        console.log(dataarr);
        return dataarr;
    }

    //   const getQuestions = async () => {
    //     const question1 = doc(db, "questions", id);
    //     const questionSnap = await getDoc(question1);
    //     if (questionSnap.exists()) {
    //       console.log("Document data:", questionSnap.data());
    //       let obj = questionSnap.data();
    //       console.log(obj);
    //       setQuestion(obj);
    //     } else {
    //       console.log("No such document!");
    //     }
    //   };

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
                    borderColor: "white"
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
                    borderColor: "white"
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
        }
    };
    let data = {};
    //   const data = {
    //     datasets: [
    //       {
    //         label: "# of Results",
    //         data: typeof answers !== "undefined" && [
    //           answers[1],
    //           answers[2],
    //           answers[3],
    //           answers[4],
    //         ],
    //         backgroundColor: [
    //           "#4F9F30",
    //           "#3977CB",
    //           "#C07E2F",
    //           "#A82929",
    //           "rgba(153, 102, 255, 1)",
    //           "rgba(255, 159, 64, 1)",
    //         ],
    //         borderColor: ["#4F9F30", "#3977CB", "#C07E2F", "#A82929"],
    //         borderWidth: 3,
    //       },
    //     ],
    //   };

    return (
        <>
            {loading === "pending" ? (
                <div style={{height: "100vh"}} className=" d-flex align-items-center justify-content-center">
                    <h2
                        className="text-center"
                        style={{color: "white", marginTop: "20px"}}
                    >
                        Loading...
                    </h2>
                </div>
            ) : (
                <>
                    <Container className={"mt-3"}>
                        <Navbar eid={eid}/>
                    </Container>
                    {questions.map((question) => (
                        <>
                            <div style={{}} className="">
                                <Row style={{marginTop: "55px"}} className="img-bg height">
                                    <Col className={"d-flex  align-items-center padding1"} md={2} sm={12}/>
                                    <Col className={"d-flex justify-content-center  align-items-center"} md={8} sm={12}>
                                        <p className="question">{question.question}</p>
                                    </Col>
                                    <Col style={{height: "70px"}}
                                         className={"d-flex justify-content-end  align-items-center padding2"} md={2}
                                         sm={12}>
                                        <div>
                                            <Link to={`/waiting/?id=${eid}`} className="text-decoration-none">
                                                {/*<button className="btn-skip">Next</button>*/}
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
                                    <Col md={5}>
                                        <Bar
                                            data={
                                                (data = {
                                                    labels: typeof question.options !== "undefined" && [
                                                        question.options[1],
                                                        question.options[2],
                                                        question.options[3],
                                                        question.options[4],
                                                    ],
                                                    datasets: [
                                                        {
                                                            label: "# of Results",
                                                            data: typeof answers !== "undefined" ? typeof answers[question.id] !== "undefined" && [
                                                                answers[question.id][1],
                                                                answers[question.id][2],
                                                                answers[question.id][3],
                                                                answers[question.id][4],
                                                            ] : "",
                                                            backgroundColor: [
                                                                "#4F9F30",
                                                                "#3977CB",
                                                                "#C07E2F",
                                                                "#A82929",
                                                                "rgba(153, 102, 255, 1)",
                                                                "rgba(255, 159, 64, 1)",
                                                            ],
                                                            borderColor: [
                                                                "#4F9F30",
                                                                "#3977CB",
                                                                "#C07E2F",
                                                                "#A82929",
                                                            ],
                                                            datalabels: {
                                                                color: "white",
                                                            },
                                                            borderWidth: 3,
                                                        },

                                                    ],
                                                })
                                            }
                                            options={options}
                                        />
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
                        </>
                    ))}
                </>
            )}
        </>
    );
};

export default AnswersAll;
