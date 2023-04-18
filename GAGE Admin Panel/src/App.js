import React, {useEffect, useState} from "react";
import "./App.css";
import {Redirect, Route} from "react-router-dom";
import {Switch} from "react-router";
import routes from "./routes";
import withTracker from "./withTracker";
import {doc, getDoc} from "firebase/firestore";
import {db} from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import {NotificationContainer} from "react-notifications";
import "react-notifications/lib/notifications.css";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {Dispatcher} from "../src/flux";

export default () => {
    const [eventData, setEventData] = useState({});
    const [userStatus, setUserStatus] = useState(null);
    const [avatarData, setAvatarData] = useState({});
    const [user, setUser] = useState({});
    const [mainEventID, setMainEventId] = useState(null);
    const [action, setAction] = useState(null);
    const [load, setLoad] = useState(true);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        getUser().then(result => {
            setUser(result);
        })
        const auth = getAuth();
        setUserStatus(auth.currentUser)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            

            if (user) {
                setLoad(true);
                
                setUserData(user)
                if (mainEventID !== null) {
                    
                    Dispatcher.dispatch({
                        actionType: "setNavItems",
                        payload: {eventId: mainEventID, report: action}
                    });

                    async function fetch() {
                        await eventInfo();
                        await AvatarData();
                    }

                    fetch();
                } else {
                    
                    Dispatcher.dispatch({
                        actionType: "setNavItems",
                        payload: {eventId: localStorage.getItem("eventId"), report: localStorage.getItem("report")}
                    });
                    setMainEventId(localStorage.getItem("eventId"));
                    setAction(localStorage.getItem("report"));
                }
                setLoad(false)
            } else {
                // history.push("/login-user");
                setLoad(false)
            }
        });
        return () => {
            unsubscribe();
        }

    }, [mainEventID, action]);
    const getUser = async () => {
        const _userId = localStorage.getItem("userId");
        
        if (_userId) {
            const userRef = doc(db, "admins", _userId);
            const userSnap = await getDoc(userRef);
            return {...userSnap.data(), id: _userId};
        }
    }
    async function eventInfo() {
        const docRef = doc(db, "event", mainEventID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setEventData(docSnap.data());
            
        } else {
            setEventData({});
            
        }
    }
    async function AvatarData() {
        const docRef = doc(db, "details", mainEventID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAvatarData(docSnap.data());
        } else {
            setAvatarData({});
            
        }
    }

    return (

        // <Router>
        <div>
            {load === false && routes.map((route, index) => {
                return (
                    <>
                        <Switch>
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                eventData={eventData}
                                component={withTracker((props) => {
                                    return (
                                        <route.layout
                                            eventData={eventData}
                                            avatarData={avatarData}
                                            setEventData={setEventData}
                                            setAvatarData={setAvatarData}
                                            user={user}
                                            setUser={setUser}
                                            setMainEventId={setMainEventId}
                                            mainEventId={mainEventID}
                                            // setOpenModal={setOpenModal}
                                            {...props}
                                        >
                                            <route.component
                                                {...props}
                                                eventData={eventData}
                                                avatarData={avatarData}
                                                setEventData={setEventData}
                                                setAvatarData={setAvatarData}
                                                setMainEventId={setMainEventId}
                                                setAction={setAction}
                                                user={user}
                                                setUser={setUser}
                                                // setOpenModal={setOpenModal}
                                                mainEventId={mainEventID}
                                            />
                                            {userData == null &&
                                            <>
                                                <Redirect to="/login-user"/>
                                            </>
                                            }
                                        </route.layout>
                                    );
                                })}
                            />
                        </Switch>
                    </>
                );
            })}
            <NotificationContainer/>
        </div>
        // </Router>
    );
};
