import React, {useEffect, useState} from "react";
import "./Start.css";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import {db} from "../firebase";
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";

export default function Start({questions, eid, index, theme}) {
    const [questionData, setQuestionData] = useState([]);
    const [ic, setIc] = useState();
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading("pending");
                const index = await getIndex();
                const question = await getQuestion(index);
                setQuestionData(question);
                setLoading(null);
            } catch (e) {
                setLoading(null);
            }
        };
        fetch();
    }, []);
    useEffect(() => {
        console.log(questionData);
    }, [questionData]);

    const getQuestion = async (index) => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get("gamecode");
        console.log(c);
        const questionsRef = collection(db, "questions");
        const q = query(
            questionsRef,
            where("eventID", "==", c),
            where("sequence", "==", parseInt(index))
        );

        const screens = await getDocs(q);
        let dataarr = [];
        screens.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        console.log(questionData);
        console.log(dataarr);
        return dataarr;
    };

    const updateCurrent = async () => {
        setLoading("pending");
        const Ref = doc(db, "increment", eid);
        const washingtonRef = doc(db, "eventObserver", eid);
        if (typeof questionData[0] === "undefined") {
            console.log("else");
            await updateDoc(Ref, {
                i: 1,
            });
            navigate(`/waiting/?gamecode=${eid}`);
            setChange(!change);
        }

        await updateDoc(washingtonRef, {
            currentQuestion: questionData[0].id,
            didEventExpire: false,
            timer: parseInt(questionData[0].timer),
            timestamp: serverTimestamp(),
        });

        navigate(`/quiz/?gamecode=${eid}`);
        if (typeof questionData[0].id !== "undefined") {
            console.log("in if()");
            // console.log(ic, questions.length);
            await updateDoc(Ref, {
                i: increment(1),
            });
        }
    };

    const getIndex = async () => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var c = url.searchParams.get("gamecode");
        const docRef = doc(db, "increment", c);
        console.log(c);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Sequence:", docSnap.data().i);
            setIc(docSnap.data().i);
            // setCountTimer(questions[docSnap.data().i]["timer"])
            return docSnap.data().i;
        } else {
            console.log("No such document!");
        }
    };

    return (
        <>
            <div>
                {loading === "pending" ? (
                    <div
                        style={{height: "100vh"}}
                        className={"d-flex align-items-center justify-content-center"}
                    >
                        <h2 style={{color: "white"}}>Loading...</h2>
                    </div>
                ) : (
                    <div style={{height: "100vh"}}>
                        <Navbar eid={eid}/>
                        <div
                            style={{height: "63%"}}
                            className="col-sm-12 d-flex align-items-center justify-content-center"
                        >
                            <img className="img_set" src="/images/get-ready.png"/>
                        </div>
                        <div>
                            <div
                                style={{height: "180px"}}
                                className=" col d-flex align-items-center justify-content-center"
                            >
                                {theme === "1" && (
                                    <img
                                        onClick={updateCurrent}
                                        className="img_set1"
                                        src="/images/start.png"
                                    />
                                )}
                                {theme === "2" && (
                                    <img
                                        onClick={updateCurrent}
                                        className="img_set2"
                                        src="/images/start2.png"
                                    />
                                )}
                            </div>
                            <div style={{marginTop: "200px"}}>
                                {ic}:{questionData[0] && questionData[0].question}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
