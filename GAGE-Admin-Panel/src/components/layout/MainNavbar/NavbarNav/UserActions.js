import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import logout from "../../../../images/newUI/icons/logout.png";
import {Dropdown, NavItem} from "shards-react";
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row, Tooltip} from 'reactstrap';
import arrow from "../../../../images/newUI/icons/arrow.png";
import {Dispatcher, Store} from "../../../../flux";
import PopupForm from "../../../re-usable/popupForm";
import {collection, deleteDoc, doc, getDocs, increment, query, updateDoc, where} from "firebase/firestore";
import {db} from "../../../../firebase";
import Swal from "sweetalert2";

export default function UserActions(props) {
    const [open, setOpen] = useState(false);
    const [eventInfo, setEventInfo] = useState(Store.getShowEventInfo());
    const [rightLogo, setRightLogo] = useState(false);
    const [logo, setLogo] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [loading, setLoading] = useState(null);
    const history = useHistory();

    useEffect(() => {
        
        setLoading("ready");
        
        const unsubscribe = () => Store.unlisten(listener);
        const listener = () => setEventInfo(Store.getShowEventInfo());
        Store.listen(listener);
        return unsubscribe;
    }, []);

    const toggleRightLogo = () => {
        setRightLogo(!rightLogo);
    }
    const toggleLeftLogo = () => {
        setLogo(!logo);
    }
    const toggle = () => {
        setOpen(!open);
    }
    const toggleInfo = () => {
        // setEventInfo(!eventInfo);
        Dispatcher.dispatch({
            actionType: "toggleShowEventInfo"
        });
    }
    const signOutUser = () => {
        
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                
                Dispatcher.dispatch({
                    actionType: "resetValue"
                });
                props.setEventData && props.setEventData({});
                props.setMainEventId && props.setMainEventId("");
                history.push("/");
            })
            .catch((error) => {
                
            });
    }
    const toggleUserActions = () => {
        setVisible(!visible);
    }
    const toggleEditModal = () => {
        setEditModal(!editModal);
    };
    const saveEventInfo = async (_eventData) => {
        try {
            
            
            await updateDoc(doc(db, "event", props.mainEventId), {
                ..._eventData
            })
            toggleEditModal();
            props.setEventData(_eventData);
        } catch (e) {
            
        }
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
                    const eid = props.mainEventId;
                    
                    const adminRef = doc(db, "admins", props.eventData.createdBy);
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
                    await Swal.fire(
                        'Deleted!',
                        'Your event has been deleted.',
                        'success'
                    );
                    props.setEventData({});
                    props.setMainEventId(null);
                    props.setAvatarData({});
                    localStorage.setItem("activeLink", "Select Event");
                    localStorage.setItem("eventName", "");
                    localStorage.setItem("eventId", "");
                    toggleInfo();
                    setLoading("ready");
                    history.push(`/eventSelect`);
                }
            } catch (e) {
                
                setLoading("error");
            }
        })
    }

    return (
        <>
            <NavItem tag={Dropdown} caret toggle={toggleUserActions} className="my-auto">
                <div className="d-flex align-items-center">
                    {props.mainEventId &&
                    <div className="d-flex align-items-center" onClick={toggleInfo} role="button">
                        <h4 className="mx-2 ms-5 my-auto fw-bold text-nowrap">Event ({props.mainEventId})</h4>
                        <img src={arrow} width={15} alt=""/>
                    </div>}
                    <div>
                        <img alt="" src={logout} className="mx-4 my-1" onClick={signOutUser} role="button"
                             height={28}
                             id="logout"/>
                        <Tooltip
                            isOpen={open}
                            target="#logout"
                            toggle={toggle}
                            className="fs-6"
                        >
                            Logout
                        </Tooltip>
                    </div>
                </div>
                {eventInfo && props.eventData && <>
                    <div className="eventInfo">
                        {/*<img src={upIcon} className="upIcon"/>*/}
                        <Card className="rounded-0">
                            {loading === null ? <div className="text-center w-100 py-5 my-5">
                                    <div className="spinner-border spinner-border-lg" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div> :
                                <CardBody className="pt-0 pe-2">
                                    <div className="text-end">
                                        <i className="fa fa-times-circle text-danger my-1" aria-hidden="true"
                                           onClick={toggleInfo}/>
                                    </div>
                                    <div>
                                        {/*<Row>*/}
                                        <div className="px-1 me-3">
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Title</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.eventName}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Date:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.date}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Type:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.teamType}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Group Label:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.teamLabel}</span>
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <Col lg={12} className="noPadding">
                                                    <label className="textColor">Top Right Logo:</label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12}
                                                     className="d-flex justify-content-center align-items-center imageBg">
                                                    <div className="imageInput">
                                                        <img src={props.eventData.rightLogo} alt="" width={100}
                                                             id="rightLogo1"/>
                                                    </div>
                                                    <Tooltip placement="left" isOpen={rightLogo} target="#rightLogo1"
                                                             toggle={toggleRightLogo}
                                                             style={{
                                                                 background: "#f2f2f2",
                                                                 border: 0,
                                                                 maxWidth: "400px"
                                                             }}>
                                                        <img src={props.eventData.rightLogo}
                                                             alt="" height={200} width={200}/>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                            <Row className="mt-2">
                                                <Col lg={12} className="noPadding">
                                                    <label className="textColor">Bottom Left Logo:</label>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={12}
                                                     className="d-flex justify-content-center align-items-center imageBg">
                                                    <div className="imageInput">
                                                        <img src={props.eventData.Logo} alt="" width={140}
                                                             className="my-1"
                                                             id="leftLogo1"/>
                                                    </div>
                                                    <Tooltip placement="left" isOpen={logo} target="#leftLogo1"
                                                             toggle={toggleLeftLogo}
                                                             style={{
                                                                 background: "#f2f2f2",
                                                                 border: 0,
                                                                 maxWidth: "400px"
                                                             }}>
                                                        <img src={props.eventData.Logo}
                                                             alt="" height={60} width={340}/>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Availability:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.eventEnable ? "Enabled" : "Disabled"}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Status:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.eventStatus}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Game Code:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.mainEventId}</span>
                                                </Col>
                                            </Row>
                                            <Row className=" my-2">
                                                <Col lg={6} className="noPadding">
                                                    <label className="textColor">Owner:</label>
                                                </Col>
                                                <Col lg={6}>
                                                    <span> {props.eventData.creatorName}</span>
                                                </Col>
                                            </Row>
                                            {/*<Row className="w-100">*/}
                                            {/*    <Col lg={6}>*/}
                                            {/*        <label className="textColor">Game link:</label>*/}
                                            {/*    </Col>*/}
                                            {/*    <Col lg={6}>*/}
                                            {/*        <a href={`https://gagerelease5.web.app`}*/}
                                            {/*           className="text-decoration-underline"*/}
                                            {/*           target="_blank">https://gagerelease5.web.app</a>*/}
                                            {/*    </Col>*/}
                                            {/*</Row>*/}
                                            {/*<Row className="w-100">*/}
                                            {/*    <Col lg={6}>*/}
                                            {/*        <label className="textColor">Backend Link:</label>*/}
                                            {/*    </Col>*/}
                                            {/*    <Col lg={6}>*/}
                                            {/*        <a href={`https://gage-question.web.app?gamecode=${localStorage.getItem("eventId")}`}*/}
                                            {/*           className="text-decoration-underline"*/}
                                            {/*           target="_blank">https://gage-question.web.app/</a>*/}
                                            {/*    </Col>*/}
                                            {/*</Row>*/}
                                        </div>
                                        {/*</Row>*/}
                                        <div className="d-flex justify-content-end align-items-center mt-2">
                                            {/*<Button className="warningBtn">Publish</Button>*/}
                                            <Button className="deleteBtn  text-nowrap" type="button"
                                                    onClick={deleteEvent}>Delete</Button>
                                            <Button className="editBtn mx-2 "
                                                    onClick={toggleEditModal}>Edit</Button>
                                        </div>
                                    </div>
                                </CardBody>
                            }
                        </Card>
                    </div>
                </>}
            </NavItem>
            <Modal isOpen={editModal} toggle={toggleEditModal} backdrop={false}>
                <ModalHeader>Edit Event</ModalHeader>
                <ModalBody style={{overflowY: "auto"}}>
                    <PopupForm eventData={props.eventData} setIsEditForm={setEditModal} setMainData={saveEventInfo}
                               mainEventId={props.mainEventId}/>
                </ModalBody>
            </Modal>
        </>
    )
}
