import "./App.css";
import Start from "./Quiz/Start";
import QuizForm from "./Quiz/QuizForm";
import ReportCharts from "./Quiz/ReportCharts";
// import { Waiting } from "./Quiz/Waiting";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Reports from "./Quiz/Reports";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReportsCard from "./Quiz/ReportsCard";
import AnswersAll from "./Quiz/AnswersAll";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./firebase";
import {Waiting} from "./Quiz/Waiting";
import VotingReport from "./Quiz/votingReport";
import Swal from 'sweetalert2';

function App() {
    const [id, setId] = useState("");
    const [eventTheme, setEventTheme] = useState("");
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        if (eventTheme === "1") {
            document.body.style.background = "url(/images/common.png)";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPostion = "50%";
            document.body.style.overflowX = "hidden";

        } else if (eventTheme === "2") {
            document.body.style.background = "url(/common1.png)";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPostion = "50%";
            document.body.style.overflowX = "hidden";

        } else {
            document.body.style.background = "black";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPostion = "50%";
            document.body.style.overflowX = "hidden";
        }
    }, [eventTheme]);

    useEffect(() => {
        getScreens().then(result => {
            setId(result);
            getEventData(result).then();
        })
        // const fetch = async () => {
        //     const data = await getScreens();
        //     await getEventData();
        // };
        // fetch();
    }, []);

    const getEventId = async () => {
        const {value: eventID} = await Swal.fire({
            title: 'Your Game Code',
            input: 'number',
            inputLabel: 'Enter valid Game Code to proceed',
            // inputValue: id,
            showCancelButton: false,
            backdrop: false,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!'
                }
            }
        })

        if (eventID) {
            // Swal.fire(`Your IP address is ${eventID}`);
            window.open(`/?gamecode=${eventID}`, "_self");
        }
    }
    const getScreens = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        const code = url.searchParams.get("gamecode");
       
        if (code)
            return code
        else {
            await getEventId();
           
        }
    };

    const getEventData = async (_id) => {
        const docRef = doc(db, "event", _id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           
            setEventTheme(docSnap.data().themeSelected);
            setLoader(true)
        } else {
            await Swal.fire({
                icon: 'error',
                title: 'Event not found',
                text: 'Try another Event Id',
                backdrop: false,
                // footer: '<a href="">Why do I have this issue?</a>'
            }).then(result => {
               
                getEventId();
            });
           
        }
    };

    useEffect(() => {
       
    }, [eventTheme]);

    return (
        <div>
            <BrowserRouter>
                {loader === true ? <Routes>
                    <Route path="/" element={<Start eid={id} theme={eventTheme}/>}/>
                    <Route path={`/quiz`} element={<QuizForm theme={eventTheme} urlId={id}/>}/>
                    <Route path="/report/:id/:eid" element={<Reports urlId={id}/>}/>
                    <Route path="/waiting" element={<Waiting theme={eventTheme} id={id}/>}/>
                    <Route path="/checkReports/:id" element={<ReportCharts theme={eventTheme}/>}/>
                    <Route path="/reportcard/:id" element={<ReportsCard theme={eventTheme}/>}/>
                    <Route path="/answers/:eid" element={<AnswersAll theme={eventTheme}/>}/>
                    <Route path="/votingReports/:eid" element={<VotingReport theme={eventTheme}/>}/>
                </Routes> : ("")}
            </BrowserRouter>
        </div>
    );
}

export default App;
