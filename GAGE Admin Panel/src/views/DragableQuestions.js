// import "./styles.css";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, FormGroup, Row,} from "shards-react";
import {NotificationManager} from "react-notifications";
import {Link, useHistory, useParams} from "react-router-dom";
import {collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where} from "firebase/firestore";
import {db} from "../firebase";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import ListItem from "./listItem";
import {Card, CardBody, CardHeader, Input} from "reactstrap";
import theme1question from "../images/newUI/screen-images/theme1question.png";
import theme2question from "../images/newUI/screen-images/theme2question.png";


function DragableQuestions({eventData, setEventData}) {
    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState("pushed");
    const [questionStatus, setQuestionStatus] = useState("false");
    const [questionFlag, setQuestionFlag] = useState("false");
    const [loading, setLoading] = useState(null);
    const {eid} = useParams();
    const history = useHistory();
    useEffect(() => {
        
        if (eventData.hasOwnProperty("questionStatus")) {
            setQuestionStatus(eventData.questionStatus.toString());
            
            setQuestionType(eventData.questionType);
        }
        setLoading("fetching");
        loadObserverFlag().then(result => {
            
            setQuestionFlag(result);
        });
        loadQuestions().then(result => {
            setQuestions(result);
            setLoading("ready");
        });
    }, []);

    const loadObserverFlag = async () => {
        const docRef = doc(db, "eventObserver", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().questionFlag;
        }
        
    }
    const loadQuestions = async () => {
        const questionsRef = collection(db, "questions");
        const q = query(questionsRef, where("eventID", "==", eid), orderBy("sequence", "asc"));
        const screens = await getDocs(q);
        let dataarr = [];
        screens.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        
        return dataarr;
    }

    const onDragEnd = async (result) => {
        
        const newItems = Array.from(questions);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);

        
        setQuestions(newItems);
        
    };
    const updateSequence = async () => {
        let increment = 0;
        try {
            // setLoader("pending");
            for (const prop of questions) {
                let q = query(doc(db, "questions", prop.id));
                await updateDoc(q, {
                    sequence: increment + 1,
                });
                increment++;
            }
            // setLoader(null);
            // NotificationManager.info("Questions sequence is updated");
        } catch (e) {
            NotificationManager.error("Something went wrong");
        }
    };

    const deleteQuestion = async (id) => {
        try {
            
            await deleteDoc(doc(db, "questions", id));
            const deleteQuestion = questions.filter((e) => {
                return e.id !== id;
            });
            setQuestions(deleteQuestion);
            NotificationManager.success("Question Deleted Successfully");
        } catch (error) {
            
            NotificationManager.error("Something Went Wrong");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // setLoad("pending");
            setLoading("pending");
            await updateSequence();
            await updateDoc(doc(db, "event", eid), {
                questionStatus: questionStatus == "false" ? false : Boolean(questionStatus), questionType: questionType,
            });
            setEventData({
                ...eventData,
                questionStatus: questionStatus == "false" ? false : Boolean(questionStatus),
                questionType: questionType
            });
            await updateDoc(doc(db, "eventObserver", eid), {
                questionFlag: questionFlag == "false" ? false : Boolean(questionFlag)
            })
            // setLoad(null);
            NotificationManager.success("Questions Saved");
            setLoading(null);
        } catch (e) {
            
            NotificationManager.error("Something went wrong");
            setLoading(null);
        }
    };

    return (<>
        {loading === "fetching" ? (<div className="text-center w-100 py-5 my-5">
            <div className="spinner-border spinner-border-lg" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>) : <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
            <Container className={""}>
                <Form className="" onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-between align-items-center me-2">
                        <h4>Add Event Questions</h4>
                        <div className="d-flex w-25 justify-content-end">
                            <div className="mx-2">
                                <Button className="warningBtn   my-2" onClick={() => {
                                    history.goBack();
                                    const activeLink = localStorage.getItem("activeLink");
                                    const prevLink = localStorage.getItem("prevLink");
                                    localStorage.setItem("activeLink", prevLink);
                                    localStorage.setItem("prevLink", activeLink);
                                }}>
                                    Back
                                </Button>
                            </div>
                            <div className="">
                                <Button className="editBtn   my-2" type="submit"
                                        disabled={loading === "pending"}>
                                    {loading === "pending" ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>) : ("Save")}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col lg={3}>
                            <FormGroup>
                                <div>
                                    <label className="textColor  my-1">Question</label>
                                </div>
                                <label className="w-75">
                                    <Input
                                        className="selectInput rounded-0"
                                        type="select"
                                        value={questionStatus}
                                        onChange={(e) => {
                                            
                                            setQuestionStatus(e.target.value);
                                        }}
                                    >
                                        <option value={"true"}>Enable</option>
                                        <option value={"false"}>Disable</option>
                                    </Input>
                                </label>
                            </FormGroup>
                        </Col>
                        {questionStatus == "true" && (<Col lg={3}>
                            <FormGroup>
                                <div>
                                    <label className="textColor  my-1">Follow Type</label>
                                </div>
                                <label className="w-75">
                                    <Input
                                        className="selectInput rounded-0"
                                        type="select"
                                        value={questionType}
                                        onChange={(e) => {
                                            setQuestionType(e.target.value);
                                        }}
                                    >
                                        <option value={"pushed"}>pushed</option>
                                        <option value={"auto"}>Auto</option>
                                    </Input>
                                </label>
                            </FormGroup>
                        </Col>)}
                        {questionType === "auto" && questionStatus == "true" && (<Col lg={3}>
                            <FormGroup>
                                <div>
                                    <label className="textColor  my-1">Visibility</label>
                                </div>
                                <label className="w-75">
                                    <Input
                                        className="selectInput rounded-0"
                                        type="select"
                                        value={questionFlag}
                                        onChange={(e) => {
                                            
                                            setQuestionFlag(e.target.value);
                                        }}
                                    >
                                        <option value={"true"}>Show</option>
                                        <option value={"false"}>hide</option>
                                    </Input>
                                </label>
                            </FormGroup>
                        </Col>)}
                    </Row>
                    {questionStatus == "true" && (<>
                        <Card>
                            <CardHeader className="pb-0">
                                <div className="d-flex justify-content-between align-items-end">
                                    <label className="textColor">Questions:</label>
                                </div>
                            </CardHeader>
                            <CardBody className="pt-2">
                                <hr className="mt-0" style={{border: "1px solid"}}/>
                                <div className="ps-2">
                                    <Link to={`/AddQuestions/${eid}`}>
                                        <Button className="addQuestionButton">
                                            Add Question
                                        </Button>
                                    </Link>
                                </div>
                                <Row>
                                    <Col lg={8}>
                                        <div className="me-2">
                                            <Container className="mt-4" style={{width: "100%"}}>
                                                <DragDropContext onDragEnd={onDragEnd}>
                                                    <Droppable droppableId="droppable">
                                                        {(provided) => (<div {...provided.droppableProps}
                                                                             ref={provided.innerRef}>
                                                            {questions.map((item, index) => (<Draggable
                                                                key={item.id}
                                                                draggableId={item.id}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (<ListItem
                                                                    provided={provided}
                                                                    snapshot={snapshot}
                                                                    item={item}
                                                                    index={index}
                                                                    deleteQuestion={deleteQuestion}
                                                                />)}
                                                            </Draggable>))}
                                                        </div>)}
                                                    </Droppable>
                                                </DragDropContext>
                                            </Container>
                                        </div>
                                    </Col>
                                    <Col lg={4} className="text-center">
                                        <img alt="" height={450} style={{borderRadius: "20px"}}
                                             src={eventData.themeSelected === "1" ? theme1question : eventData.themeSelected === "2" && theme2question}/>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <div className="d-flex justify-content-end mt-2 me-2">
                            <div className="mx-2">
                                <Button className="warningBtn   my-2" onClick={() => {
                                    history.goBack();
                                    const activeLink = localStorage.getItem("activeLink");
                                    const prevLink = localStorage.getItem("prevLink");
                                    localStorage.setItem("activeLink", prevLink);
                                    localStorage.setItem("prevLink", activeLink);
                                }}>
                                    Back
                                </Button>
                            </div>
                            <div className="">
                                <Button className="editBtn   my-2" type="submit"
                                        disabled={loading === "pending"}>
                                    {loading === "pending" ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>) : ("Save")}
                                </Button>
                            </div>
                        </div>
                    </>)}
                </Form>
            </Container>
        </div>}
    </>);
}

export default DragableQuestions;
