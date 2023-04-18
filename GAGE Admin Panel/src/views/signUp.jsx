import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {NotificationContainer, NotificationManager,} from "react-notifications";
import {Button, Container, Form, FormGroup,} from "shards-react";
import {auth, db} from "../firebase";
import {createUserWithEmailAndPassword} from "firebase/auth";
import logo from "../images/newUI/login&signup/logo.png";
import {doc, setDoc} from "firebase/firestore";
import mainLogo from "../images/newUI/login&signup/mainLogo.png";
import {Card, CardBody, Col, Input, Row} from "reactstrap";

const SignUp = ({user, setUser}) => {
    const [loader, setLoader] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [newUser, setNewUser] = useState({
        userName: "",
        email: "",
        userCompany: "",
    });
    const history = useHistory();

    useEffect(() => {
        
    }, [])

    const signUp = async (e) => {
        e.preventDefault();
        try {
            setLoader("pending");
            if (password === confirmPassword) {
                const createUser = await createUserWithEmailAndPassword(auth, newUser.email, confirmPassword);
                // setUser(createUser.user);
                
                const docRef = doc(db, "admins", createUser.user.uid);
                await setDoc(docRef, {
                    name: newUser.userName,
                    company: newUser.userCompany,
                    role: "admin",
                    expiryStatus: true,
                    email: newUser.email,
                    eventsCount: 0,
                    status: "active",
                    password: password,
                    timestamp: Date.now() + 2592000000
                });
                setUser({
                    name: newUser.userName,
                    company: newUser.userCompany,
                    role: "admin",
                    expiryStatus: true,
                    email: newUser.email,
                    eventsCount: 0,
                    status: "active",
                    password: password,
                    timestamp: Date.now() + 2592000000
                });
                NotificationManager.success("Sign Up successfully");
                history.push("/login-user");
            } else {
                setLoader(null);
                NotificationManager.error("Incorrect Password");
            }

        } catch (error) {
            
            if (error.code === "auth/email-already-in-use")
                NotificationManager.error("User already exists");
            else if (error.code === "auth/weak-password")
                NotificationManager.error("Weak Password");
            else
                NotificationManager.error("Password/Email Incorrect");
            setLoader(null);
        }
    };
    return (
        <div style={{backgroundColor: "lightgray", height: "100vh"}}>
            <Container
                style={{paddingTop: "7%"}}
                className={"px-4 pb-4 d-flex align-items-center justify-content-center"}
            >
                <Card style={{borderRadius: "30px", width: "50%"}}>
                    <CardBody style={{borderRadius: "20px"}}>

                        <div className="text-center mb-5">
                            <div>
                                <img src={logo} alt="" width="40%"/>
                            </div>
                        </div>
                        <Form onSubmit={signUp}>
                            <h5 className="textColor text-center">Sign-up Your Account</h5>
                            <FormGroup>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Name</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input type="text"
                                               className="customInput"
                                               value={newUser.userName}
                                               maxLength={25}
                                               onChange={(event) => {
                                                   setNewUser({...newUser, userName: event.target.value});
                                               }}
                                            // id="userName"
                                               placeholder="User Name"/>
                                    </Col>
                                </Row>
                                {/*<CustomInput type="text" icon={userIcon}*/}
                                {/*             value={newUser.userName}*/}
                                {/*             maxLength={25}*/}
                                {/*             onChange={(event) => {*/}
                                {/*                 setNewUser({...newUser, userName: event.target.value});*/}
                                {/*             }}*/}
                                {/*             id="userName"*/}
                                {/*             placeholder="User Name"/>*/}
                            </FormGroup>
                            <FormGroup>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Company</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input type="text"
                                               className="customInput"
                                               value={newUser.userCompany}
                                               maxLength={30}
                                               onChange={(event) => {
                                                   setNewUser({...newUser, userCompany: event.target.value})
                                               }}
                                               placeholder="Company"/>
                                    </Col>
                                </Row>
                                {/*<CustomInput type="text" icon={companyIcon}*/}
                                {/*             value={newUser.userCompany}*/}
                                {/*             maxLength={30}*/}
                                {/*             onChange={(event) => {*/}
                                {/*                 setNewUser({...newUser, userCompany: event.target.value})*/}
                                {/*             }}*/}
                                {/*             id="userCompany"*/}
                                {/*             placeholder="Company"/>*/}
                            </FormGroup>
                            <FormGroup>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Email</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input type="text"
                                               className="customInput"
                                               value={newUser.email}
                                               maxLength={40}
                                               onChange={(event) => {
                                                   setNewUser({...newUser, email: event.target.value})
                                               }}
                                               placeholder="Email"/>
                                    </Col>
                                </Row>
                                {/*<CustomInput type="text" icon={emailIcon}*/}
                                {/*             value={newUser.email}*/}
                                {/*             maxLength={40}*/}
                                {/*             onChange={(event) => {*/}
                                {/*                 setNewUser({...newUser, email: event.target.value})*/}
                                {/*             }}*/}
                                {/*             id="email"*/}
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
                                               value={password}
                                               maxLength={15}
                                               onChange={(event) => {
                                                   setPassword(event.target.value);
                                               }}
                                               placeholder="Password"/>
                                    </Col>
                                </Row>
                                {/*<CustomInput*/}
                                {/*    disabled={loader === "pending"}*/}
                                {/*    type="password"*/}
                                {/*    icon={lock}*/}
                                {/*    value={password}*/}
                                {/*    maxLength={15}*/}
                                {/*    onChange={(event) => {*/}
                                {/*        setPassword(event.target.value);*/}
                                {/*    }}*/}
                                {/*    id="#question"*/}
                                {/*    placeholder="Password"*/}
                                {/*/>*/}
                            </FormGroup>
                            <FormGroup>
                                <Row className="align-items-center">
                                    <Col lg={3} className="text-end pe-0">
                                        <label className="textColor me-2">Confirm Password</label>
                                    </Col>
                                    <Col lg={7} className="ps-0">
                                        <Input disabled={loader === "pending"}
                                               type="password"
                                               className="customInput"
                                               value={confirmPassword}
                                               maxLength={15}
                                               onChange={(event) => {
                                                   setConfirmPassword(event.target.value);
                                               }}
                                               invalid={password !== confirmPassword && confirmPassword !== ""}
                                               valid={password === confirmPassword && confirmPassword !== ""}
                                               placeholder="Confirm Password"/>
                                    </Col>
                                </Row>
                                {/*<CustomInput*/}
                                {/*    disabled={loader === "pending"}*/}
                                {/*    type="password"*/}
                                {/*    icon={lock}*/}
                                {/*    value={confirmPassword}*/}
                                {/*    maxLength={15}*/}
                                {/*    onChange={(event) => {*/}
                                {/*        setConfirmPassword(event.target.value);*/}
                                {/*    }}*/}
                                {/*    isInvalid={password !== confirmPassword && confirmPassword !== ""}*/}
                                {/*    isValid={password === confirmPassword && confirmPassword !== ""}*/}
                                {/*    id="#question"*/}
                                {/*    placeholder="Confirm Password"*/}
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
                                        <div className="spinner-border spinner-border-lg" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) : (
                                        <span className="fs-6">Sign Up</span>
                                    )}
                                </Button>
                                <div>
                                    <Link to="/login-user">
                                    <span className='signUpLink'>Already have an
                                        account ? Sign In</span>
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

export default SignUp;