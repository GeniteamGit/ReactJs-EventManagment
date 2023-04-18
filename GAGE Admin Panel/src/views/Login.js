import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {NotificationContainer, NotificationManager,} from "react-notifications";
import {Button, Container, Form, FormGroup,} from "shards-react";
import {auth, db} from "../firebase";
import {getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth";
import logo from "../images/newUI/login&signup/logo.png";
import mainLogo from "../images/newUI/login&signup/mainLogo.png";
import {doc, getDoc} from "firebase/firestore";
import {Card, CardBody, Col, Input, Row} from "reactstrap";
// import EmailIcon from '@mui/icons-material/Email';

const Login = ({user, setUser, setEventData, setMainEventId}) => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loader, setLoader] = useState(null);
    const [registerPassword, setRegisterPassword] = useState("");
    const [eventId, setEventId] = useState("");
    const history = useHistory();
    useEffect(() => {
        const auth = getAuth();
        
    }, [])
    const loginS = async (e) => {
        e.preventDefault();
        try {
            localStorage.setItem("activeLink", "Select an Event");
            localStorage.setItem("prevLink", "");
            localStorage.setItem("eventName", "");
            localStorage.setItem("users", "inactive");
            setLoader("pending");
            const isLoggedIn = await signInWithEmailAndPassword(auth, loginEmail, registerPassword);
            
            const docRef = doc(db, "admins", isLoggedIn.user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists() && docSnap.data().status === "active") {
                if (docSnap.data().expiryStatus && docSnap.data().timestamp < Date.now() && docSnap.data().role !== "superAdmin") {
                    await signOut(auth);
                    NotificationManager.error("User Expired");
                    setLoader(null);

                } else {
                    setUser({...docSnap.data(), id: docSnap.id});
                    localStorage.setItem("role", docSnap.data().role);
                    localStorage.setItem("userId", docSnap.id);
                    localStorage.setItem("eventId", "");
                    setEventData({});
                    setMainEventId("");
                    
                    NotificationManager.success("Log in Successfully");
                    setLoader(null);
                    history.push("/eventselect");
                }
            } else {
                await signOut(auth);
                NotificationManager.error("User Does not Exist/Blocked");
                setLoader(null);
            }
        } catch (error) {
            
            NotificationManager.error("Password/Email Incorrect");
            setLoader(null);
        }
    };

    return (
        <div style={{backgroundColor: "lightgray", height: "100vh"}}>
            <Container
                style={{paddingTop: "10%"}}
                className="px-4 pb-4 d-flex align-items-center  justify-content-center"
            >
                <Card style={{borderRadius: "30px", width: "50%"}}>
                    <CardBody style={{borderRadius: "20px"}}>
                        <div className="text-center mb-5">
                            <div>
                                <img src={logo} alt="" width="40%"/>
                            </div>
                        </div>
                        <Form onSubmit={loginS}>
                            <FormGroup>
                                <h5 className="textColor text-center">Sign-in with Email!</h5>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Email</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input type="text" className="customInput"
                                               value={loginEmail}
                                               onChange={(event) => {
                                                   setLoginEmail(event.target.value);
                                               }}
                                               id="#question"
                                               placeholder="Email"/>
                                    </Col>
                                    <Col lg={2}/>
                                </Row>
                                {/*<CustomInput icon={email} type="text"*/}
                                {/*             value={loginEmail}*/}
                                {/*             onChange={(event) => {*/}
                                {/*                 setLoginEmail(event.target.value);*/}
                                {/*             }}*/}
                                {/*             id="#question"*/}
                                {/*             placeholder="Email"/>*/}
                            </FormGroup>
                            <FormGroup>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Password</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input disabled={loader === "pending"}
                                               type="password"
                                               className="customInput"
                                               value={registerPassword}
                                               onChange={(event) => {
                                                   setRegisterPassword(event.target.value);
                                               }}
                                               id="#question"
                                               placeholder="Password"/>
                                    </Col>
                                    <Col lg={2}/>
                                </Row>
                                {/*<CustomInput*/}
                                {/*    icon={lock}*/}
                                {/*    disabled={loader === "pending"}*/}
                                {/*    type="password"*/}
                                {/*    value={registerPassword}*/}
                                {/*    onChange={(event) => {*/}
                                {/*        setRegisterPassword(event.target.value);*/}
                                {/*    }}*/}
                                {/*    id="#question"*/}
                                {/*    placeholder="Password"*/}
                                {/*/>*/}
                            </FormGroup>
                            <div className="text-center">
                                <Button
                                    className="editBtn px-5 my-2"
                                    disabled={loader === "pending"}
                                    color="success"
                                    type="submit"
                                >
                                    {loader === "pending" ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        <span className="fs-6">Login</span>
                                    )}
                                </Button>
                                <div>
                                    <Link to="/signUp">
                                        <span className='signUpLink'>No Account? Sign Up</span>
                                    </Link>
                                </div>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
                <NotificationContainer/>
            </Container>
            <footer className="p-2 px-3 position-absolute bottom-0 end-0">
                <img src={mainLogo} alt=""/>
            </footer>
        </div>
    );
};

export default Login;
