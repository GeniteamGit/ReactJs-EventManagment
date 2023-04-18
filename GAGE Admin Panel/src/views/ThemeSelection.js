import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row,} from "shards-react";
import {db} from "../firebase";
import {useHistory, useParams} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import {collection, doc, getDoc, getDocs, updateDoc,} from "firebase/firestore";

const ThemeSelection = ({setEventData, eventData}) => {
    const [themes, setThemes] = useState([]);
    const [selectedFeild, setSelectedFeild] = useState("");
    const [loading, setLoading] = useState(null);
    const {eid} = useParams();
    const history = useHistory();

    useEffect(() => {
        
        const fetch = async () => {
            const data = await themeGet();
            await selectedThemeValue();
            setThemes(data);
            setLoading(false);
        };
        fetch();
    }, []);

    useEffect(() => {
        
    }, [themes]);

    const selectedTheme = async (e) => {
        e.preventDefault();
        
        try {
            if (selectedFeild == "") {
                
                NotificationManager.info("Please Select a Theme");
            } else {
                setLoading(null);
                
                
                await updateDoc(doc(db, "event", eid), {
                    themeSelected: selectedFeild,
                });
                setEventData({...eventData, themeSelected: selectedFeild});
                NotificationManager.success("Theme Selected");
                localStorage.setItem("activeLink", "Profile");
                localStorage.setItem("prevLink", "Theme Selection");
                history.push(`/avatar/${eid}`);
                setLoading("ready");
            }
        } catch (e) {
            setLoading("ready");
            NotificationManager.error("Something went wrong!");
            
        }
    };

    async function selectedThemeValue() {
        const docRef = doc(db, "event", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().hasOwnProperty("themeSelected")) {
                setSelectedFeild(docSnap.data().themeSelected);
            }

        } else {
            
        }
    }

    async function themeGet() {
        const _themes = await getDocs(collection(db, "theme"));
        let dataarr = [];
        _themes.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        
        return dataarr;
    }

    return (
        <>
            {loading === null ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                    <Container className="">
                        {!loading &&
                        <Form onSubmit={selectedTheme}>
                            <Row>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Select your Game Theme</h4>
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
                                                    </div>
                                                ) : (
                                                    "Save"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {themes.map((e) => (
                                    <Col md={12} xs={12} sm={12} lg={3}>
                                <span
                                    className="textColor fs-5 fw-bold mb-3 d-flex justify-content-center">{e.name}</span>
                                        <label className="card">
                                            <input
                                                name="selectedFeild"
                                                className="radio d-none"
                                                checked={selectedFeild === e.theme}
                                                type="radio"
                                                value={selectedFeild}
                                                onChange={() => {
                                                    setSelectedFeild(e.theme);
                                                }}
                                            />
                                            <span className="plan-details">
                                        <Row>
                                          <Col md="12" className="d-flex justify-content-center">
                                            <img className="cardImage" src={e.image} alt=""/>
                                          </Col>
                                        </Row>
                                    </span>
                                        </label>
                                    </Col>
                                ))}
                                <div className="d-flex justify-content-end my-5">
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
                                                </div>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Row>
                        </Form>
                        }
                    </Container>
                </div>
            }

        </>
    );
};

export default ThemeSelection;
