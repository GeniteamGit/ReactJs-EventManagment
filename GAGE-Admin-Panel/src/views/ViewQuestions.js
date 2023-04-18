import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  NotificationManager,
} from "react-notifications";
import {
  collection,
  getDocs,
  increment,
  getDoc,
  updateDoc,
  orderBy,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { db } from "../firebase";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  CardHeader,
  CardBody,
  Button,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
export default function ViewQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(null);
  const [timer, setTimer] = useState(null);
  const [id,setId]=useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading("pending");
      
      const data = await tempFunc();
      setQuestions(data);
      setLoading(null);
      
      // await getTimer()
    };
    fetch();
  }, []);

  async function tempFunc() {
    const questionsRef = collection(db, "questions");
    const q = query(
      questionsRef,
      where("eventId", "==", localStorage.getItem("eventID"))
    );
    const screens = await getDocs(q);
    let dataarr = [];
    screens.forEach((doc) => {
      let obj = doc.data();
      obj = { ...obj, id: doc.id };
      dataarr.push(obj);
    });
    return dataarr;
  }
  
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

  const ActiveQuestion = async (id, timer) => {
    const docRef = doc(db, "events", "LQbiKLiCjov1ysvyelse");
    await updateDoc(docRef, {
      timer: timer,
      currentQuestion: id,
      didEventExpire: false,
    });
    setId(id);
    const docSnap = await getDoc(docRef);

    for (let i = 0; i < docSnap.data().timer; i++) {
      setTimeout(() => {
        updateDoc(docRef, {
          timer: increment(-1),
        });
      }, 1000 * i + 1);
    }
  };

  const updatedata = async (docRef, id, timer) => {};

//   const renderTime = ({ remainingTime }) => {
//     if (remainingTime === 0) {
//       return <div className="timer">Too lale...</div>;
//     }return (
//     <div className="timer">
//       <div className="text">Remaining</div>
//       <div className="value">{timer}</div>
//       <div className="text">seconds</div>
//     </div>
//   );
// };




  return (
    <div>
      <Container className={"px-4 pb-4"}>
        <h3
          style={{
            fontWeight: "400",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          Questions
        </h3>
        {loading === "pending" ? (
          <div style={{textAlign:"center"}}>
              <div
            className="spinner-border"
            // style="width: 3rem; height: 3rem;"
            style={{textAlign:"center"}}
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
          </div>
          
        
        ) : (
          <Card>
            <CardHeader>All Questions  </CardHeader>

            {/* <div>{timer}</div> */}
            {/* <CountdownCircleTimer
          isPlaying
          duration={26}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => ({ shouldRepeat: false, delay: 1 })}
        >
          {renderTime}
        </CountdownCircleTimer> */}
            <CardBody>
              {questions.map((e, i) => (
                <>
                  <div key={i} className="d-flex justify-content-end  margin-bottom: 25px">
                    <Link to={`/editQuestions/${e.id}`}>
                      <Button className="m-2 btn btn-warning" type="submit">
                        <i
                          style={{ color: "white" }}
                          size={"lg"}
                          class="material-icons"
                        >
                          edit
                        </i>
                      </Button>
                    </Link>

                    <Button
                      className=" m-2 btn btn-danger"
                      onClick={() => deleteQuestion(e.id)}
                    >
                      <i class="material-icons">delete</i>
                    </Button>

                    <Button
                      className="m-2 btn btn-success" disabled={timer!==0}
                      onClick={() => ActiveQuestion(e.id, e.timer)}
                    >
                      {id===e.id&&timer!==0?"Actived":"Active"}
                    </Button>
                    <Link to={`/viewreport/${e.eventId}/${e.id}`}>
                      <Button className="m-2 btn btn-primary">Report</Button>
                    </Link>
                  </div>
                  <div className="accordion" id="accordionExample">
                    <div class="accordion-item">
                      <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={"#collapse1" + i}
                          aria-expanded="false"
                          aria-controls={"collapse1" + i}
                        >
                          {e.question}
                        </button>
                      </h2>
                      <div
                        id={"collapse1" + i}
                        class="accordion-collapse collapse "
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          <Row>
                            <Col>{"A" + "-" + e.options[1] + " "}</Col>
                            <Col>{"B" + "-" + e.options[2] + " "}</Col>
                            <Col>{"C" + "-" + e.options[3] + " "}</Col>
                            <Col>{"D" + "-" + e.options[4] + " "}</Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
}

// #panelsStayOpen-
