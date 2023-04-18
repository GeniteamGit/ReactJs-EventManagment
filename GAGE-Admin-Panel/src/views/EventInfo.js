import React, {useEffect, useState} from "react";
import "react-datetime/css/react-datetime.css";
import imageIcon from "../images/newUI/icons/image1.png";
import {Button, Col, Container, Form, FormGroup, FormInput, Row} from "shards-react";
import config from "../utils/constants.json";
import {useHistory, useParams} from "react-router-dom";
import 'react-image-crop/dist/ReactCrop.css';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {NotificationManager} from "react-notifications";
import {Toggle} from "react-toggle-component";
import {Input, Tooltip} from "reactstrap";
import Swal from 'sweetalert2';
import CropImage from "../components/re-usable/cropImage";

export default function EventInfo({eventData, setEventData, avatarData, setAvatarData, mainEventID, setMainEventId, user}) {
    const [eventName, setEventName] = useState("");
    const [logo, setLogo] = useState(null);
    const [rightLogo, setRightLogo] = useState(null);
    const [date, setDate] = useState("");
    const [localImage, setLocalImage] = useState(null);
    const [rightLogoLocal, setRightLogoLocal] = useState(null);
    const [discussionBoard, setDiscussionBoard] = useState(false);
    const [team, setTeam] = useState({teamType: "individual", teamLabel: ""});
    const [eventStatus, setEventStatus] = useState(false);
    const [photoBooth, setPhotoBooth] = useState(false);
    const [loading, setLoading] = useState(null);
    const [enable, setEnable] = useState(false);
    const [rightLogoTooltip, setRightLogoTooltip] = useState(false);
    const [leftLogoTooltip, setLeftLogoTooltip] = useState(false);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [modalImage, setModalImage] = useState(null);
    const [modalRightToggle, setModalRightToggle] = useState(false);
    const [modalLeftToggle, setModalLeftToggle] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [minDate, setMinDate] = useState('');
    const history = useHistory();
    const {eid} = useParams();

    useEffect(() => {
        
        
        const currentDate = new Date().toISOString().slice(0, 10);
        setMinDate(currentDate);

        function fetch() {
            if (eventData.hasOwnProperty("eventName")) {
                setEnable(eventData.eventEnable);
                setEventName(eventData.eventName);
                setDate(eventData.date);
                setPhotoBooth(eventData.photoBooth);
                setDiscussionBoard(eventData.discussionBoard);
                // if(eventData.surveyStatus)
                // setSurveyStatus(eventData.surveyStatus);
                // setQuestionType(eventData.questionType);
                setEventStatus(eventData.eventStatus);
                // setQuestionFlag(eventData.questionFlag);
                setRightLogo(eventData.rightLogo);
                setLogo(eventData.Logo);
                setTeam({
                    teamType: eventData.teamType,
                    teamLabel: eventData.teamLabel,
                });
            }
            // setLoading("ready");
        }

        setTimeout(() => {
            setLoading("ready");
        }, 1000)
        fetch();
    }, []);
    const handleChange = (event) => {
        const {name, value} = event.target;
        setTeam((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const createEvent = async () => {
        
        
        const id = localStorage.getItem("eventId");
        const docREf = doc(db, "event", id);
        const docEventObserver = doc(db, "eventObserver", id);
        const docIncrement = doc(db, "increment", id);

        await setDoc(docREf, {createdBy: user.id, creatorName: user.name, creatorCompany: user.company});
        // setEventData({...eventData,createdBy: user.id, creatorName: user.name});
        await setDoc(docEventObserver, {
            currentQuestion: "",
        });
        await setDoc(docIncrement, {i: 1});
        const adminRef = doc(db, "admins", user.id);
        await updateDoc(adminRef, {
            eventsCount: increment(1)
        });
        const signUpRef = doc(db, "sign-upScreens", id);
        await setDoc(signUpRef, {
            screens: config.signUpScreens
        });
    }
    const addEventInfo = async (e) => {
        e.preventDefault();
        const today = new Date();
        try {
            setLoading("pending");
            const docREf = doc(db, "event", eid);
            const docSnap = await getDoc(docREf);
            if (!docSnap.exists()) {
                await createEvent();
                
            }
            
            const img = await addUrl();
            const img2 = await addUrl2();
            
            await updateDoc(doc(db, "event", eid), {
                Logo: img,
                rightLogo: img2,
                date: date,
                eventName: eventName,
                eventEnable: enable,
                discussionBoard: discussionBoard,
                eventStatus: eventStatus,
                photoBooth: photoBooth,
                teamType: team.teamType,
                teamLabel: team.teamLabel,
                timestamp: today,
            });
            setEventData({
                ...eventData,
                Logo: img,
                rightLogo: img2,
                date: date,
                eventName: eventName,
                eventEnable: enable,
                discussionBoard: discussionBoard,
                eventStatus: eventStatus,
                photoBooth: photoBooth,
                teamType: team.teamType,
                teamLabel: team.teamLabel,
                timestamp: today,
            });
            setLoading(null);
            NotificationManager.success("Event Info Saved");
            localStorage.setItem("eventName", eventName);
            setTimeout(() => {
                localStorage.setItem("activeLink", "Theme Selection");
                localStorage.setItem("prevLink", "Event Info");
                history.push(`/themeselection/${eid}`);
            }, 1000);
        } catch (e) {
            
            NotificationManager.error("Event Info not Added");
        }
    };
    const addUrl = async () => {
        if (typeof logo === "string" && !logo.includes("firebase")) {
            
            const _file = await urltoFile(logo, `${eid}leftLogo.png`, 'image/png');
            
            const imageRef = ref(storage, `${eid}leftLogo`);
            const data = await uploadBytes(imageRef, _file);
            
            const downloadUrl = await getDownloadURL(data.ref);
            
            return downloadUrl;
        } else {
            return logo;
        }
    };
    const addUrl2 = async () => {
        if (typeof rightLogo === "string" && !rightLogo.includes("firebase")) {
            
            const file = await urltoFile(rightLogo, `${eid}rightLogo.png`, 'image/png');
            
            const imageRef = ref(storage, `${eid}rightLogo`);
            const data = await uploadBytes(imageRef, file);
            
            const downloadUrl = await getDownloadURL(data.ref);
            
            return downloadUrl;
        } else {
            return rightLogo;
        }
    };
    const urltoFile = (url, filename, mimeType) => {
        return (fetch(url)
                .then(function (res) {
                    return res.arrayBuffer();
                })
                .then(function (buf) {
                    return new File([buf], filename, {type: mimeType});
                })
        );
    }
    const deleteEvent = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            try {
                if (result.isConfirmed) {
                    
                    setLoading(null);
                    await deleteDoc(doc(db, "answers", eid));
                    await deleteDoc(doc(db, "details", eid));
                    await deleteDoc(doc(db, "event", eid));
                    await deleteDoc(doc(db, "eventObserver", eid));
                    await deleteDoc(doc(db, "ideas", eid));
                    await deleteDoc(doc(db, "increment", eid));
                    await deleteDoc(doc(db, "sign-upScreens", eid));
                    const adminRef = doc(db, "admins", eventData.createdBy);
                    await updateDoc(adminRef, {
                        eventsCount: increment(-1)
                    });
                    const questionsDocRef = collection(db, "questions");
                    const questionsQuery = query(questionsDocRef, where("eventID", "==", eid));
                    const questionsSnapshot = await getDocs(questionsQuery);
                    for (let i = 0; i < questionsSnapshot.docs.length; i++) {
                        await deleteDoc(questionsSnapshot.docs[i].ref);
                    }
                    const tablesDocRef = collection(db, "tables");
                    const tablesQuery = query(tablesDocRef, where("eventID", "==", eid));
                    const tablesSnapshot = await getDocs(tablesQuery);
                    for (let i = 0; i < tablesSnapshot.docs.length; i++) {
                        await deleteDoc(tablesSnapshot.docs[i].ref);
                    }
                    const usersDocRef = collection(db, "users");
                    const usersQuery = query(usersDocRef, where("eventID", "==", eid));
                    const usersSnapshot = await getDocs(usersQuery);
                    for (let i = 0; i < usersSnapshot.docs.length; i++) {
                        await deleteDoc(usersSnapshot.docs[i].ref);
                    }
                    await Swal.fire(
                        'Deleted!',
                        'Your event has been deleted.',
                        'success'
                    );
                    setEventData({});
                    setMainEventId(null);
                    setAvatarData({});
                    localStorage.setItem("activeLink", "Select Event");
                    localStorage.setItem("eventName", "");
                    localStorage.setItem("eventId", "");
                    await history.push(`/eventSelect`);
                }
            } catch (e) {
                
                setLoading("error");
            }
        })
    }
    const rightToggle = () => setRightLogoTooltip(!rightLogoTooltip);
    const leftToggle = () => setLeftLogoTooltip(!leftLogoTooltip);
    return (
        <>
            {loading === null ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <div style={{marginTop: "4%", marginLeft: "4%", marginRight: "4%"}}>
                    <Container className="">
                        <Form onSubmit={addEventInfo}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Your Event Basic Information</h4>
                                <div className="d-flex w-25 justify-content-end">
                                    <div className="d-flex justify-content-end">
                                        <Button className="my-2 deleteBtn   text-nowrap" type="button"
                                                onClick={deleteEvent}>Delete
                                            Event</Button>
                                    </div>
                                    <div className="mx-2">
                                        <Button className="warningBtn   my-2" onClick={() => {
                                            history.goBack()
                                            const activeLink = localStorage.getItem("activeLink");
                                            const prevLink = localStorage.getItem("prevLink");
                                            localStorage.setItem("activeLink", prevLink);
                                            localStorage.setItem("prevLink", activeLink);
                                            localStorage.setItem("eventId", "");
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
                                                </div>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Row className="mt-4">
                                <Col lg={6}>
                                    <div>
                                        <FormGroup className="d-flex align-items-center justify-content-between">
                                            <label htmlFor="eventName" className=" textColor ">Event
                                                Name</label>
                                            <FormInput
                                                className="plainInput  "
                                                // size="sm"
                                                disabled={loading === "pending"}
                                                type="text"
                                                required
                                                maxLength={40}
                                                value={eventName}
                                                onChange={(e) => {
                                                    setEventName(e.target.value);
                                                }}
                                                id="eventName"
                                                placeholder="Enter name of Event"
                                            />
                                        </FormGroup>
                                        <FormGroup className="d-flex justify-content-between align-items-center">
                                            <label className="textColor  ">Date</label>
                                            <FormInput
                                                className="dateInput  "
                                                required
                                                disabled={loading === "pending"}
                                                type="date"
                                                min={minDate}
                                                value={date}
                                                onChange={(e) => {
                                                    setDate(e.target.value);
                                                }}
                                                id="date"
                                                placeholder="Date"
                                            />
                                        </FormGroup>
                                        <FormGroup className="d-flex justify-content-between align-items-center">
                                            <label className="textColor  my-1"> Team Type</label>
                                            <label className="" style={{width: "60%"}}>
                                                <Input
                                                    id="teamType"
                                                    className="selectInput rounded-0 "
                                                    type="select"
                                                    value={team.teamType}
                                                    onChange={handleChange}
                                                    name="teamType"
                                                >
                                                    <option value="individual">Individual</option>
                                                    <option value="grouped">Grouped</option>
                                                </Input>
                                            </label>
                                        </FormGroup>
                                        <FormGroup className="d-flex justify-content-between align-items-center">
                                            <label className="textColor  my-1"> Team Label</label>
                                            <FormInput
                                                style={{width: "60%"}}
                                                className="plainInput  rounded-0"
                                                disabled={loading === "pending"}
                                                type="text"
                                                id="teamLabel"
                                                name="teamLabel"
                                                required
                                                value={team.teamLabel}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <label className="textColor  ">Enabled</label>
                                                <div style={{width: "60%"}}>
                                                    <Toggle
                                                        name="enable"
                                                        onChange={() => {
                                                            setEnable(!enable)
                                                        }
                                                        }
                                                        className="mx-0"
                                                        checked={enable}
                                                        controlled={enable}
                                                        rightKnobColor="#2b900e"
                                                        rightBorderColor="#2b900e"
                                                        knobHeight="15px"
                                                        knobWidth="15px"
                                                        height="25px"
                                                        width="50px"
                                                        disabled={loading === "pending"}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <Row>
                                                <Col className="">
                                                    <label className="textColor  ">Event Status</label>
                                                </Col>
                                                <Col lg={1}/>
                                                <Col className="mx-5">
                                                    <div className=" d-flex align-items-center">
                                                        <Input type="checkbox" bsSize="sm" className="infoCheckBox"
                                                               role="button"
                                                               disabled={loading === "pending"}
                                                               value={eventStatus}
                                                               checked={eventStatus === "open"}
                                                               onChange={() => {
                                                                   setEventStatus("open");
                                                               }}
                                                        />
                                                        <span className=" mx-2 ">Open</span>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div className=" d-flex align-items-center w-100">
                                                        <Input type="checkbox" bsSize="sm" className="infoCheckBox"
                                                               role="button"
                                                               value={eventStatus}
                                                               disabled={loading === "pending"}
                                                               checked={eventStatus === "completed"}
                                                               onChange={() => {
                                                                   setEventStatus("completed");
                                                               }}
                                                        />
                                                        <span className=" mx-2 ">Completed</span>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </FormGroup>
                                        <FormGroup>
                                            <div
                                                className="  d-flex align-items-center justify-content-between">
                                                <span className="textColor">Top Right Logo
                                                <i id="rightLogo" onClick={rightToggle} role="button"
                                                   className="mx-2 fa fa-info-circle text-secondary"
                                                   aria-hidden="true"/>
                                                <Tooltip placement="right" isOpen={rightLogoTooltip} target="rightLogo"
                                                         toggle={rightToggle}
                                                         style={{
                                                             backgroundColor: "#f2f2f2",
                                                             border: 0,
                                                             maxWidth: "600px",
                                                             maxHeight: "230px"
                                                         }}
                                                >
                                                    <img
                                                        src={rightLogoLocal ? rightLogoLocal : rightLogo ? rightLogo : imageIcon}
                                                        alt="" height={200}
                                                        width={200}/>
                                                    {/*</div>*/}
                                                </Tooltip>
                                                </span>
                                                <div style={{width: "60%"}}>
                                                    <label className="imageInput"
                                                           role="button">
                                                        {!rightLogo &&
                                                        <span
                                                            className={`m-2  ${!rightLogo && 'text-muted'}`}>
                                                            {!rightLogo && "Upload"}
                                                        </span>
                                                        }
                                                        <img
                                                            src={rightLogoLocal ? rightLogoLocal : rightLogo ? rightLogo : imageIcon}
                                                            alt="" height={100}
                                                            width={100} className="m-2"/>
                                                        <CropImage aspectRatio={1} setLocal={setRightLogoLocal}
                                                                   stateSetImage={setRightLogo}/>
                                                    </label>
                                                    <div className="" style={{fontSize: "13px"}}>
                                                        {imageError === "right" &&
                                                        <p className="text-danger mb-0">Please Select image less than
                                                            1mb</p>}
                                                        <span className="text-secondary">(Image size should be 200px x 200px or 1 : 1)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <div
                                                className="  d-flex align-items-center justify-content-between">
                                                <span className="textColor"> Bottom Left Logo
                                                    <i id="leftLogo" onClick={leftToggle} role="button"
                                                       className="mx-2 fa fa-info-circle text-secondary"
                                                       aria-hidden="true"/>
                                                <Tooltip placement="right" isOpen={leftLogoTooltip} target="leftLogo"
                                                         toggle={leftToggle}
                                                         style={{background: "#f2f2f2", border: 0, maxWidth: "400px"}}>
                                                    <img src={localImage ? localImage : logo ? logo : imageIcon}
                                                         alt="" height={60} width={340}/>
                                                </Tooltip>
                                                </span>
                                                <div style={{width: "60%"}}>
                                                    <label className="imageInput"
                                                           role="button">
                                                        {!logo &&
                                                        <span
                                                            className={`m-2  ${!logo && 'text-muted'}`}>{!logo && "Upload"}</span>
                                                        }
                                                        <img src={localImage ? localImage : logo ? logo : imageIcon}
                                                             alt=""
                                                             height={localImage ? 30 : logo ? 30 : 50}
                                                             width={localImage ? 170 : logo ? 170 : 80}
                                                             className="m-2"/>
                                                        <CropImage aspectRatio={5.6666} stateSetImage={setLogo}
                                                                   setLocal={setLocalImage}/>
                                                    </label>
                                                    <div className="" style={{fontSize: "13px"}}>
                                                        {imageError === "left" &&
                                                        <p className="text-danger mb-0">Please Select image less than
                                                            1mb</p>}
                                                        <span className="text-secondary">(Image size should be 340px x 60px or 17 : 3)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormGroup>
                                        <div className="mt-5">
                                            <div className="my-2">
                                                <label className="textColor  ">Game Code</label>
                                                <span className=" fw-bold mx-3">{eid}</span>
                                            </div>
                                            <div className="my-2">
                                                <label className="textColor  ">User Name </label>
                                                <span
                                                    className=" fw-bold mx-3">{eventData.creatorName || user.name}</span>
                                            </div>
                                            <div className="my-2">
                                                <label className="textColor  ">Game Link</label>
                                                <a href={`https://gagerelease5.web.app`}
                                                   className="mx-3  text-decoration-underline"
                                                   target="_blank">https://gagerelease5.web.app</a>
                                            </div>
                                            <div>
                                                <label className="textColor  ">Backend Link</label>
                                                <a href={`https://gage-question.web.app?gamecode=${eid}`}
                                                   className="mx-3  text-decoration-underline"
                                                   target="_blank">https://gage-play.activ8games.com/</a>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end my-5">
                                <div className="d-flex justify-content-end">
                                    <Button className="my-2 deleteBtn  " type="button"
                                            onClick={deleteEvent}>Delete
                                        Event</Button>
                                </div>
                                <div className="mx-2">
                                    <Button className="warningBtn   my-2" onClick={() => {
                                        history.goBack();
                                        const activeLink = localStorage.getItem("activeLink");
                                        const prevLink = localStorage.getItem("prevLink");
                                        localStorage.setItem("activeLink", prevLink);
                                        localStorage.setItem("prevLink", activeLink);
                                        localStorage.setItem("eventId", "");
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
                                            </div>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </Container>
                </div>
            }
        </>
    );
}
