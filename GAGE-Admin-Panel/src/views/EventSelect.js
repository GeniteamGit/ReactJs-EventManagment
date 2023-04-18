import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, Col, Container, FormInput, Row,} from "shards-react";
import {db} from "../firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {useHistory} from "react-router-dom";
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import {Toggle} from "react-toggle-component";
import plus from "../images/newUI/icons/plus.png"
import {Dispatcher, Store} from "../flux";
import {NotificationManager} from "react-notifications";
import moment from "moment";
import Swal from "sweetalert2";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import PopupForm from "../components/re-usable/popupForm";
import config from "../utils/constants.json";

const EventSelect = (props) => {
    const [changeEvents, setChangeEvents] = useState(false);
    const [id, setId] = useState("");
    const [eventIds, setEventIds] = useState([]);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [eventsByName, setEventsByName] = useState({});
    const [loading, setLoading] = useState(null);
    const [search, setSearch] = useState("");
    const [createModal, setCreateModal] = useState(false);
    const [eventId, setEventId] = useState("");
    const [editModal, setEditModal] = useState(false);
    const [eventData, setEventData] = useState({});
    const history = useHistory();

    useEffect(() => {
        
        if (props.user.hasOwnProperty("email")) {
            const fetch = async () => {
                setLoading(null);
                const data = await getEvents();
                const sorted = data.sort((x, y) => {
                    return moment(x.date).valueOf() - moment(y.date).valueOf();
                });
                

                setEvents(sorted);
                setFilteredEvents(sorted);
                setEventIds(
                    data.map((e) => {
                        return e.id;
                    })
                );
                setTimeout(() => {
                    setLoading("ready");
                }, 500)
            };
            fetch();
        }
    }, [changeEvents]);
    useEffect(() => {
        // 
        if (search) {
            let data = events.filter((item) => {
                if (
                    item.id.includes(search) || item.eventName
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())
                ) {
                    return item;
                }
            })
            
            // setEvents(data);
            setFilteredEvents(data);
        } else {
            // setEvents(_events);
            setFilteredEvents(events);
        }
    }, [search]);
    useEffect(() => {
        window.addEventListener("popstate", function () {
            const activeLink = localStorage.getItem("activeLink");
            const prevLink = localStorage.getItem("prevLink");
            
            localStorage.setItem("activeLink", prevLink);
            localStorage.setItem("prevLink", activeLink);
            localStorage.setItem("eventId", "");
            if (Swal.isVisible()) {
                Swal.close();
            }
        });
    }, []);

    const toggleEditModal = (_event) => {
        
        if (_event) {
            setEventData(_event);
        }
        setEditModal(!editModal);
    };
    const saveEventInfo = async (_eventData) => {
        try {
            
            
            await updateDoc(doc(db, "event", _eventData.id), {
                ..._eventData
            })
            toggleEditModal();
            props.setEventData(_eventData);
        } catch (e) {
            
        }
    }
    const eventOtherAdmins = () => {
        setChangeEvents(true);
        setSearch("");
    }
    const eventSuperAdmins = () => {
        setChangeEvents(false);
        setSearch("");
    }

    async function getEvents() {
        let _themes
        if (props.user.role) {
            // 
            if (props.user.role === "superAdmin") {
                if (changeEvents === false) {
                    const docRef = collection(db, "event");
                    const _query = query(docRef, where("createdBy", "==", props.user.id));
                    _themes = await getDocs(_query);
                } else {
                    const docRef = collection(db, "event");
                    const _query = query(docRef, where("createdBy", "!=", props.user.id));
                    _themes = await getDocs(_query);
                }
            } else {
                // 
                const docRef = collection(db, "event");
                const _query = query(docRef, where("createdBy", "==", props.user.id));
                _themes = await getDocs(_query);
            }
        }
        let dataarr = [];
        _themes.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        const parentArray = dataarr.reduce((acc, curr) => {
            if (acc[curr.creatorName + "-" + curr.creatorCompany]) {
                acc[curr.creatorName + "-" + curr.creatorCompany].push(curr);
            } else {
                acc[curr.creatorName + "-" + curr.creatorCompany] = [curr];
            }
            return acc;
        }, {});
        if (changeEvents) {
            setEventsByName(parentArray);
        }
        
        
        return dataarr;
    }

    const duplicate = async (_id, e) => {
        e.preventDefault();
        
        // setLoading(null);
        Swal.fire({
            title: 'Duplicating Event...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const _eventId = await generateEventId();
        const docRef = doc(db, "event", _id);
        const docSnap = await getDoc(docRef);
        const eventData = docSnap.data();
        
        
        await setDoc(doc(db, "event", _eventId), {
            Logo: eventData.Logo,
            date: eventData.date,
            // discussionBoard: eventData.discussionBoard,
            eventEnable: eventData.eventEnable,
            eventStatus: eventData.eventStatus,
            eventName: eventData.eventName,
            // photoBooth: eventData.photoBooth,
            teamLabel: eventData.teamLabel,
            // teamType:eventData.teamType,
            surveyStatus: eventData.hasOwnProperty("surveyStatus") ? eventData.surveyStatus : false,
            profileStatus: eventData.hasOwnProperty("profileStatus") ? eventData.profileStatus : false,
            themeSelected: eventData.hasOwnProperty("themeSelected") ? eventData.themeSelected : false,
            competenciesFlag: eventData.hasOwnProperty("competenciesFlag") ? eventData.competenciesFlag : false,
            questionStatus: eventData.hasOwnProperty("questionStatus") ? eventData.questionStatus : false,
            questionType: eventData.hasOwnProperty("questionType") ? eventData.questionType : "",
            teamType: eventData.teamType,
            rightLogo: eventData.rightLogo,
            createdBy: props.user.id,
            creatorName: props.user.name,
            creatorCompany: props.user.company,
            timestamp: serverTimestamp()
        });
        // avatar collection
        const avatar = doc(db, "details", _id)
        const avatarSnap = await getDoc(avatar);
        if (avatarSnap.exists()) {
            const avatarData = avatarSnap.data();
            
            await setDoc(doc(db, "details", _eventId), {
                ...(avatarData.armorScreen ? {
                    armorScreen: {
                        armor: avatarData.armorScreen.armor,
                        titleDesc: avatarData.armorScreen.titleDesc,
                        titleName: avatarData.armorScreen.titleName,
                        sequence: avatarData.armorScreen.sequence,
                    }
                } : {}),
                ...(avatarData.avatarScreen ? {
                    avatarScreen: {
                        avatar: avatarData.avatarScreen.avatar,
                        titleDesc: avatarData.avatarScreen.titleDesc,
                        titleName: avatarData.avatarScreen.titleName,
                    },
                } : {}),
                ...(avatarData.weaponScreen ? {
                    weaponScreen: {
                        weapon: avatarData.weaponScreen.weapon,
                        titleDesc: avatarData.weaponScreen.titleDesc,
                        titleName: avatarData.weaponScreen.titleName,
                        sequence: avatarData.weaponScreen.sequence,
                    },
                } : {}),
                ...(avatarData.shieldScreen ? {
                    shieldScreen: {
                        shield: avatarData.shieldScreen.shield,
                        titleDesc: avatarData.shieldScreen.titleDesc,
                        titleName: avatarData.shieldScreen.titleName,
                        sequence: avatarData.shieldScreen.sequence,
                    },
                } : {}),
                ...(avatarData.competencyScreen ? {
                    competencyScreen: {
                        competencies: avatarData.competencyScreen.competencies.map((e) => {
                            if (e.imageUrl !== undefined) {
                                
                                return {name: e.name, imageUrl: e.imageUrl};
                            } else {
                                
                                return {name: e.name}
                            }
                        }),
                        titleDesc: avatarData.competencyScreen.titleDesc,
                        titleName: avatarData.competencyScreen.titleName,
                        selectionLimit: avatarData.competencyScreen.selectionLimit,
                    },
                } : {}),
                ...(avatarData.surveyScreen ? {
                    surveyScreen: {
                        titleName: avatarData.surveyScreen.titleName,
                        description: avatarData.surveyScreen.description,
                        surveySelectionLimit: avatarData.surveyScreen.surveySelectionLimit,
                    }
                } : {}),
            });
        }
        
        const oldIdeasDocRef = doc(db, "ideas", _id);
        const oldIdeasDocSnap = await getDoc(oldIdeasDocRef);
        if (oldIdeasDocSnap.exists()) {
            const oldIdeas = oldIdeasDocSnap.data().ideas;
            const newIdeas = {};
            for (const key of Object.keys(oldIdeas)) {
                newIdeas[key] = {
                    ...oldIdeas[key],
                    timestamp: {},
                    voteCount: 0,
                };
            }
            
            const newIdeasDocRef = doc(db, "ideas", _eventId);
            await setDoc(newIdeasDocRef, {
                ideas: newIdeas
            })
        }
        const questionsRef = collection(db, "questions");
        const q = query(
            questionsRef,
            where("eventID", "==", _id),
            orderBy("sequence", "asc")
        );
        const screens = await getDocs(q);
        if (screens.docs.length > 0) {
            for (let i = 0; i < screens.docs.length; i++) {
                let doc = screens.docs[i];
                let obj = doc.data();
                
                await addDoc(collection(db, "questions"), {
                    ...obj,
                    eventID: _eventId,
                });
            }
        }
        const docEventObserver = doc(db, "eventObserver", _id);
        const docSnapEO = await getDoc(docEventObserver);
        const observerData = docSnapEO.data();
        const newObserver = doc(db, "eventObserver", _eventId);
        await setDoc(newObserver, {
            ...observerData,
            currentQuestion: "",
            timer: null,
            timestamp: null
        });
        const docIncrement = doc(db, "increment", _eventId);
        await setDoc(docIncrement, {i: 1});
        const signUpFieldsRef = doc(db, "sign-upScreens", _id);
        const signUpFieldsSnap = await getDoc(signUpFieldsRef);
        
        const newSignUpFieldsRef = doc(db, "sign-upScreens", _eventId);
        await setDoc(newSignUpFieldsRef, {
            ...signUpFieldsSnap.data()
        })
        const adminRef = doc(db, "admins", props.user.id);
        await updateDoc(adminRef, {
            eventsCount: increment(1)
        });
        NotificationManager.success("Event is Duplicated");
        setFilteredEvents([...filteredEvents, {...eventData, id: _eventId}]);
        Swal.fire({
                title: `Event Id ${_eventId}`,
                text: 'Your event has been duplicated',
                icon: 'success',
                allowOutsideClick: false,
                showCancelButton: true,
                cancelButtonText: 'Close',
                confirmButtonText: 'Edit',
                // showConfirmButton: false
            }
        ).then((result) => {
            if (result.isConfirmed) {
                toggleEditModal({...eventData, id: _eventId});
            }
        });
    };
    const deleteEvent = async (_event) => {
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
                    // setLoading(null);
                    Swal.fire({
                        title: 'Deleting Event...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    const eid = _event.id;
                    
                    const adminRef = doc(db, "admins", _event.createdBy);
                    await updateDoc(adminRef, {
                        eventsCount: increment(-1)
                    });
                    await deleteDoc(doc(db, "answers", eid));
                    await deleteDoc(doc(db, "details", eid));
                    await deleteDoc(doc(db, "event", eid));
                    await deleteDoc(doc(db, "eventObserver", eid));
                    await deleteDoc(doc(db, "ideas", eid));
                    await deleteDoc(doc(db, "increment", eid));
                    await deleteDoc(doc(db, "sign-upScreens", eid));
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
                    
                    if (changeEvents) {
                        
                        let _obj = eventsByName;
                        _obj[_event.creatorName + "-" + _event.creatorCompany] = _obj[_event.creatorName + "-" + _event.creatorCompany].filter((_e) => _e.id !== _event.id);
                        
                        setEventsByName({..._obj});
                    } else {
                        setFilteredEvents(filteredEvents.filter(obj => obj.id !== eid));
                    }
                    await Swal.fire(
                        'Deleted!',
                        'Your event has been deleted.',
                        'success'
                    );
                }
            } catch (e) {
                
                setLoading("error");
            }
        })
    }
    const editValues = (_event) => {
        props.setEventData(_event);
        props.setMainEventId(_event.id);
        props.setAction("false");
        Dispatcher.dispatch({
            actionType: "activeLinkCurrent",
            payload: "Event Info"
        });
        Dispatcher.dispatch({
            actionType: "activeLinkPrev",
            payload: Store.getActiveLink().prev
        });
        localStorage.setItem("activeLink", "Theme Selection");
        localStorage.setItem("prevLink", "Select an Event");
        localStorage.setItem("eventId", _event.id);
        if (localStorage.getItem("eventName") !== undefined)
            localStorage.setItem("eventName", _event.eventName);
        // localStorage.getItem("eventId");
        localStorage.setItem("report", false);
        // localStorage.getItem("report");
        
        history.push(`/themeselection/${_event.id}`);
        // window.location.reload();
    };
    const report = (id) => {
        props.setMainEventId(id);
        props.setAction("true");
        Dispatcher.dispatch({
            actionType: "activeLinkCurrent",
            payload: "Users"
        });
        Dispatcher.dispatch({
            actionType: "activeLinkPrev",
            payload: Store.getActiveLink().prev
        });
        localStorage.setItem("activeLink", "Users");
        localStorage.setItem("prevLink", "Select an Event");
        localStorage.setItem("eventId", id);
        localStorage.getItem("eventId");
        localStorage.setItem("report", true);
        localStorage.setItem("dashboard", false);
        localStorage.getItem("report");
        history.push(`/usersInfo/${id}`);
        // window.location.reload();
    };
    const toggleCreateModal = () => {
        setCreateModal(!createModal);
    }
    const createEvent = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Gage Event Setup!",
            html:
                '<div class="swal2-text">' +
                '<p> Welcome to gage Event setup admin portal. You will be required some information to fill in order ' +
                'to setup a gage event. Please follow go through all screens 1 by 1 and fill in required ' +
                'information.</p>' +
                '<p>Each gage event consists of following options, enable what suits your needs:</p>' +
                '<ol class="text-start">' +
                '<li>Event formation groups or individuals</li>' +
                '<li>Basic entry field selection</li>' +
                '<li>Avatar flow as per your topic with 1 to 4 screens</li>' +
                '<li>Super powers or special competencies selection</li>' +
                '<li>Individual voting option on any topic</li>' +
                '<li>Group or individual Questions & surveys</li>' +
                '</ol>' +
                '</div>',
            width: 700,
            confirmButtonText: "Let’s go",
            confirmButtonColor: "#2b900e"
        }).then(async (result) => {
            if (result.isConfirmed) {
                toggleCreateModal();
                generateEventId().then(result => {
                    setEventId(result);
                });
            }
        })
    };
    const handleSearch = (e) => {
        
        setSearch(e.target.value);
    }
    const generateEventId = async () => {
        
        const _eventId = Math.floor(1000 + Math.random() * 9000).toString();
        const docRef = doc(db, "event", _eventId);
        
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            
            await generateEventId();
        } else {
            return _eventId;
        }
    }
    const createNewEvent = async () => {
        const docREf = doc(db, "event", eventId);
        const docEventObserver = doc(db, "eventObserver", eventId);
        const docIncrement = doc(db, "increment", eventId);
        const user = props.user;
        await setDoc(docREf, {createdBy: user.id, creatorName: user.name, creatorCompany: user.company});
        await setDoc(docEventObserver, {
            currentQuestion: "",
        });
        await setDoc(docIncrement, {i: 1});
        const adminRef = doc(db, "admins", user.id);
        await updateDoc(adminRef, {
            eventsCount: increment(1)
        });
        const signUpRef = doc(db, "sign-upScreens", eventId);
        await setDoc(signUpRef, {
            screens: config.signUpScreens
        });
    }
    const saveInfo = async (_eventData) => {
        try {
            
            createNewEvent().then(async (result) => {
                await updateDoc(doc(db, "event", eventId), {
                    ..._eventData
                })
                Dispatcher.dispatch({
                    actionType: "activeLinkCurrent",
                    payload: "Theme Selection"
                });
                Dispatcher.dispatch({
                    actionType: "activeLinkPrev",
                    payload: Store.getActiveLink().prev
                });
                
                localStorage.setItem("activeLink", "Theme Selection");
                localStorage.setItem("prevLink", "Select Event");
                localStorage.setItem("eventId", eventId);
                localStorage.setItem("eventName", _eventData.eventName);
                localStorage.setItem("report", "false");
                localStorage.getItem("report");
                props.setMainEventId(eventId);
                props.setEventData(_eventData);
                props.setAction("false");
                history.push(`/themeselection/${eventId}`);
                toggleCreateModal();
            });
        } catch (e) {
            
        }
    }

    const colors = ["linear-gradient(to bottom right, #8980D2, #BB99E6)", "linear-gradient(to bottom right, #E7AD69, #F3D78C)",
        "linear-gradient(to bottom right, #AC5596, #CC87C6)", "linear-gradient(to bottom right, #4D89AF, #60ADD7)",
        "linear-gradient(to bottom right, #679475, #86C79A)"];
    return (
        <>
            {loading === null ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <div>
                    <MainNavbar {...props}/>
                    <Container style={{maxWidth: "95%", marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                        {localStorage.getItem("role") === "superAdmin" &&
                        <div>
                            <div className="rounded py-1 my-3">
                                <label className={`eventTabs mx-1 rounded ${!changeEvents && "activeEventTab"}`}
                                       role="button" onClick={eventSuperAdmins}>My Events</label>
                                <label className={`eventTabs mx-1 rounded ${changeEvents && "activeEventTab"}`}
                                       role="button" onClick={eventOtherAdmins}>Admin's Events</label>
                            </div>
                        </div>}
                        {!changeEvents ? <h4 className="">Select an Event or create a new event!</h4> :
                            <h4 className="">Select an Event</h4>
                        }
                        <div className="d-flex w-100 justify-content-end align-items-center">
                            <div className="w-50">
                                <FormInput type="text" className="plainInput float-end"
                                           placeholder="Search by Event Name or Id"
                                           onChange={handleSearch} value={search}/>
                            </div>
                            <div>
                                {!changeEvents && <Button className="editBtn ms-2" onClick={createEvent}>
                                    + Create Event
                                </Button>}
                            </div>
                        </div>
                        <Row className="mt-3">
                            {changeEvents && search === "" ? Object.keys(eventsByName).map((user) => (
                                    <div>
                                        <span className="fs-5 ">{user}</span>
                                        <Row>
                                            {eventsByName[user].map((event, i) => (
                                                <Col md={6} className="mb-3" key={event.id}>
                                                    <Card style={{
                                                        backgroundImage: colors[(i % colors.length + colors.length) % colors.length],
                                                    }} className="text-white pb-3">
                                                        <CardBody className="py-0">
                                                            <div className="d-flex justify-content-between mt-3">
                                                                <h5 className="fw-bold text-white">
                                                                    {event.eventName}
                                                                </h5>
                                                                <p className="mb-0">{moment(event.date).format('dddd, MMMM Do, YYYY')}</p>
                                                            </div>
                                                            <Row>
                                                                <Col md={3} className="py-0">
                                                                    <div>
                                                                        <img
                                                                            alt=""
                                                                            className="rounded "
                                                                            width={140}
                                                                            height={140}
                                                                            src={event.rightLogo}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <img
                                                                            alt=""
                                                                            className="rounded"
                                                                            width={140}
                                                                            height={25}
                                                                            src={event.Logo}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col md={1}/>
                                                                <Col md={8}>
                                                                    <div
                                                                        className="w-100 d-flex justify-content-between">
                                                                        <span className="text-white">Event Id</span>
                                                                        <span
                                                                            className="text-white mx-2">{event.id}</span>
                                                                    </div>
                                                                    <div
                                                                        className="w-100 d-flex justify-content-between  rounded mt-1">
                                                                        <span className="text-white">Enable</span>
                                                                        <span className="text-white">
                                                            <Toggle
                                                                // onChange={handleChange}
                                                                checked={event.eventEnable === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="w-100 d-flex justify-content-between mt-1">
                                                                        <span
                                                                            className="text-white">Question Status</span>
                                                                        <span className="text-white">
                                                            <Toggle
                                                                // onChange={handleChange}
                                                                checked={event.questionStatus === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="w-100 d-flex justify-content-between mt-1">
                                                                        <span
                                                                            className="text-white">Survey Status</span>
                                                                        <span className="text-white">
                                                            <Toggle
                                                                // onChange={handleChange}
                                                                checked={event.surveyStatus === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        className="w-100 d-flex justify-content-between  rounded mt-1">
                                                                        <span className="text-white">Status</span>
                                                                        <span
                                                                            className="text-white mx-2">{event.eventStatus}</span>
                                                                    </div>
                                                                    <div className="d-flex justify-content-end">
                                                                        <Button onClick={() => report(event.id)}
                                                                                className="my-2 warningBtn">
                                                                            Reports
                                                                        </Button>
                                                                        <Button className="editBtn  my-2 mx-2"
                                                                                onClick={() => toggleEditModal(event)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button className="deleteBtn my-2"
                                                                                onClick={() => deleteEvent(event)}>
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )) :
                                <>
                                    {filteredEvents.map((event, i) => (
                                        <Col md={6} className="mb-3" key={event.id}>
                                            <Card style={{
                                                backgroundImage: colors[(i % colors.length + colors.length) % colors.length],
                                            }} className="text-white pb-3">
                                                <CardBody className="py-0">
                                                    <div className="d-flex justify-content-between mt-3">
                                                        <h5 className="fw-bold text-white">
                                                            {event.eventName}
                                                        </h5>
                                                        <p className="mb-0">{moment(event.date).format('dddd, MMMM Do, YYYY')}</p>
                                                    </div>
                                                    <Row>
                                                        <Col md={3} className="py-0">
                                                            <div>
                                                                <img
                                                                    alt=""
                                                                    className="rounded "
                                                                    width={140}
                                                                    height={140}
                                                                    src={event.rightLogo}
                                                                />
                                                            </div>
                                                            <div className="mt-3">
                                                                <img
                                                                    alt=""
                                                                    className="rounded"
                                                                    width={140}
                                                                    height={25}
                                                                    src={event.Logo}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={1}/>
                                                        <Col md={8}>
                                                            <div className="w-100 d-flex justify-content-between">
                                                                <span className="text-white">Event Id</span>
                                                                <span className="text-white mx-2">{event.id}</span>
                                                            </div>
                                                            <div
                                                                className="w-100 d-flex justify-content-between  rounded mt-1">
                                                                <span className="text-white">Enable</span>
                                                                <span className="text-white">
                                                            <Toggle
                                                                // onChange={handleChange}
                                                                checked={event.eventEnable === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                            </div>
                                                            <div className="w-100 d-flex justify-content-between mt-1">
                                                                <span className="text-white">Question Status</span>
                                                                <span className="text-white">
                                                            <Toggle
                                                                // onChange={handleChange}
                                                                checked={event.questionStatus === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                            </div>
                                                            <div className="w-100 d-flex justify-content-between mt-1">
                                                                <span className="text-white">Survey Status</span>
                                                                <span className="text-white">
                                                            <Toggle
                                                                checked={event.surveyStatus === true}
                                                                rightKnobColor="#2b900e"
                                                                rightBorderColor="#2b900e"
                                                                height="25px"
                                                                width="50px"
                                                                knobHeight="18px"
                                                                knobWidth="18px"
                                                            />
                                                        </span>
                                                            </div>
                                                            <div
                                                                className="w-100 d-flex justify-content-between  rounded mt-1">
                                                                <span className="text-white">Status</span>
                                                                <span
                                                                    className="text-white mx-2">{event.eventStatus}</span>
                                                            </div>
                                                            <div className="d-flex justify-content-end">
                                                                <Button onClick={() => report(event.id)}
                                                                        className="my-2 warningBtn ">
                                                                    Reports
                                                                </Button>
                                                                <Button className="editBtn my-2 mx-2"
                                                                        onClick={() => toggleEditModal(event)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button className="my-2 duplicateBtn"
                                                                        onClick={(e) => duplicate(event.id, e)}>
                                                                    Duplicate
                                                                </Button>
                                                                <Button className="deleteBtn my-2 ms-2"
                                                                        onClick={() => deleteEvent(event)}>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    ))}
                                </>
                            }
                            {!changeEvents &&
                            <Col md={6} className="mb-3">
                                <Card style={{
                                    height: "260px",
                                    backgroundImage: colors[4],
                                }}
                                      className="text-white">
                                    <CardBody className="py-0">
                                        <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                                             role="button" onClick={createEvent}>
                                            <img src={plus} alt="" height='25%'/>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            }
                        </Row>
                    </Container>
                    <Modal isOpen={createModal} toggle={toggleCreateModal} backdrop={false}>
                        <ModalHeader className="textColor">Create Event</ModalHeader>
                        <ModalBody style={{overflowY: "auto"}}>
                            <PopupForm eventData={{}} setIsEditForm={setCreateModal} setMainData={saveInfo}
                                       mainEventId={eventId}/>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={editModal} toggle={toggleEditModal} backdrop={false}>
                        <ModalHeader className="textColor">Edit Event</ModalHeader>
                        <ModalBody style={{overflowY: "auto"}}>
                            <PopupForm eventData={eventData} setIsEditForm={setEditModal} setMainData={saveEventInfo}
                                       editConfig={editValues}
                                       mainEventId={eventData.id}/>
                        </ModalBody>
                    </Modal>
                </div>
            }
        </>
    );
};

export default EventSelect;
