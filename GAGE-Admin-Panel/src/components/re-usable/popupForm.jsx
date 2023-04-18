import React, {useEffect, useState} from 'react';
import {Button, Col, Input, Row} from "reactstrap";
import {Form, FormGroup, FormInput} from "shards-react";
import {Toggle} from "react-toggle-component";
import imageIcon from "../../images/newUI/icons/image1.png";
import CropImage from "./cropImage";
import {storage} from "../../firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {NotificationManager} from "react-notifications";

const PopupForm = ({eventData, setIsEditForm, setMainData, mainEventId, editConfig}) => {
    const [rightLogoLocal, setRightLogoLocal] = useState(null);
    const [rightLogo, setRightLogo] = useState(null);
    const [localImage, setLocalImage] = useState(null);
    const [logo, setLogo] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [localEventData, setLocalEventData] = useState({});
    const [loading, setLoading] = useState(true);
    const [teamType, setTeamType] = useState("individual");
    const [minDate, setMinDate] = useState('');

    useEffect(() => {
        
        
        const currentDate = new Date().toISOString().slice(0, 10);
        setMinDate(currentDate);
        setRightLogo(eventData.rightLogo);
        setLogo(eventData.Logo);
        setLocalEventData(eventData);
        if (eventData.teamType)
            setTeamType(eventData.teamType);
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, []);

    useEffect(() => {
        
        if (localEventData.hasOwnProperty("eventName"))
            setLocalEventData({...localEventData, rightLogo: rightLogo, Logo: logo});
    }, [rightLogo, logo]);

    const saveInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            if (!localEventData.eventStatus) {
                NotificationManager.error("Please Select event status");
                setLoading(false);
                return;
            }
            const img = await addUrl();
            const img2 = await addUrl2();
            
            setLocalEventData({
                ...localEventData,
                Logo: img,
                rightLogo: img2,
                teamType: teamType
            });
            await setMainData({
                ...localEventData,
                Logo: img,
                rightLogo: img2,
                teamType: teamType
            });
            // setLoading(false);
        } catch (e) {
            
            setLoading(false);
        }
    }

    const addUrl = async () => {
        
        
        if (typeof logo === "string" && !logo.includes("firebase")) {
            
            const _file = await urltoFile(logo, `${mainEventId}logo.png`, 'image/png');
            
            const imageRef = ref(storage, `${mainEventId}logo`);
            const data = await uploadBytes(imageRef, _file);
            
            const downloadUrl = await getDownloadURL(data.ref);
            
            return downloadUrl;
        } else {
            return logo;
        }
    };
    const addUrl2 = async () => {
        
        
        if (typeof rightLogo === "string" && !rightLogo.includes("firebase")) {
            
            const file = await urltoFile(rightLogo, `${mainEventId}rightLogo.png`, 'image/png');
            
            const imageRef = ref(storage, `${mainEventId}rightLogo`);
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


    return (
        <>
            {loading ? (
                <div className="text-center w-100 py-5 my-5">
                    <div className="spinner-border spinner-border-lg" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            ) : <Form className="overflow-hidden" onSubmit={saveInfo}>
                <Row>
                    <Col>
                        <FormGroup className="d-flex align-items-center justify-content-between">
                            <label htmlFor="eventName" className=" textColor ">Event
                                Name</label>
                            <FormInput
                                className="plainInput  w-50"
                                type="text"
                                required
                                maxLength={40}
                                value={localEventData.eventName}
                                onChange={(e) => {
                                    setLocalEventData({...localEventData, eventName: e.target.value})
                                }}
                                id="eventName"
                                placeholder="Enter name of Event"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex justify-content-between align-items-center">
                            <label className="textColor  ">Date</label>
                            <FormInput
                                className="dateInput  w-50"
                                // required
                                // disabled={loading === "pending"}
                                min={minDate}
                                type="date"
                                value={localEventData.date}
                                onChange={(e) => {
                                    setLocalEventData({...localEventData, date: e.target.value})
                                }}
                                id="date"
                                placeholder="Date"
                            />
                        </FormGroup>
                        <FormGroup className="d-flex justify-content-between align-items-center">
                            <label className="textColor  my-1 text-start"> Team Type</label>
                            <label className="w-50">
                                <Input
                                    id="teamType"
                                    className="selectInput rounded-0 "
                                    type="select"
                                    value={teamType}
                                    onChange={(e) => {
                                        setTeamType(e.target.value)
                                        // setLocalEventData({...localEventData, teamType: e.target.value})
                                    }}
                                    name="teamType"
                                >
                                    <option value="individual">Individual</option>
                                    <option value="grouped">Grouped</option>
                                </Input>
                            </label>
                        </FormGroup>
                        <FormGroup className="d-flex justify-content-between align-items-center">
                            <label className="textColor  my-1 text-start"> Team Label</label>
                            <FormInput
                                className="plainInput w-50  rounded-0"
                                // disabled={loading === "pending"}
                                type="text"
                                id="teamLabel"
                                name="teamLabel"
                                required
                                value={localEventData.teamLabel}
                                onChange={(e) => {
                                    setLocalEventData({...localEventData, teamLabel: e.target.value})
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="textColor  ">Enabled</label>
                                <div className="text-start w-50">
                                    <Toggle
                                        name="enable1"
                                        onChange={() => {
                                            setLocalEventData({
                                                ...localEventData,
                                                eventEnable: !localEventData.eventEnable
                                            })
                                        }
                                        }
                                        className="mx-0"
                                        checked={localEventData.eventEnable}
                                        controlled={localEventData.eventEnable}
                                        rightKnobColor="#2b900e"
                                        rightBorderColor="#2b900e"
                                        knobHeight="12px"
                                        knobWidth="12px"
                                        height="20px"
                                        width="40px"
                                        // disabled={loading === "pending"}
                                    />
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <div className="d-flex justify-content-between">
                                <label className="textColor  ">Event Status</label>
                                <div className="d-flex justify-content-between" style={{width: "45%"}}>
                                    <div className="d-flex align-items-center">
                                        <Input type="radio" bsSize="sm" className="infoCheckBox"
                                               role="button" name="status"
                                               value={localEventData.eventStatus}
                                               checked={localEventData.eventStatus === "open"}
                                               onChange={() => {
                                                   setLocalEventData({...localEventData, eventStatus: "open"})
                                               }}
                                        />
                                        <span className=" mx-2">Open</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Input type="radio" bsSize="sm" className="infoCheckBox"
                                               role="button" name="status"
                                               value={localEventData.eventStatus}
                                               checked={localEventData.eventStatus === "completed"}
                                               onChange={() => {
                                                   
                                                   setLocalEventData({...localEventData, eventStatus: "completed"})
                                               }}
                                        />
                                        <span className=" mx-2">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <div className="  d-flex align-items-start justify-content-between">
                                <div>
                                    <label className="textColor">Top Right Logo</label>
                                    <div className="w-75">
                                        {imageError === "right" &&
                                        <p className="text-danger mb-0">Please Select image less than
                                            1mb</p>}
                                        <span
                                            className="text-secondary">(Image should be 200px x 200px or 1 : 1)</span>
                                    </div>
                                </div>
                                <div style={{width: "58%"}} className="imageBg py-1 d-flex justify-content-center">
                                    <label className="imageInput rightLogoDiv" role="button">
                                        <img
                                            src={rightLogoLocal ? rightLogoLocal : rightLogo ? rightLogo : imageIcon}
                                            alt="" height={rightLogoLocal ? 100 : rightLogo ? 100 : 80}
                                            width={rightLogoLocal ? 100 : rightLogo ? 100 : 80}
                                            className={rightLogoLocal ? '' : rightLogo ? "" : "ms-2"}/>
                                        <br/>
                                        {!rightLogo &&
                                        <span
                                            className={`ms-4 ${!rightLogo && 'text-muted'}`}>{!rightLogo && "Upload"}</span>
                                        }
                                        <CropImage aspectRatio={1} setLocal={setRightLogoLocal} setError={setImageError}
                                                   imageLocation="right"
                                                   stateSetImage={setRightLogo}/>
                                    </label>
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <div
                                className="  d-flex align-items-start justify-content-between">
                                <div>
                                    <label className="textColor"> Bottom Left Logo</label>
                                    <div className="w-75 ">
                                        {imageError === "left" &&
                                        <p className="text-danger mb-0">Please Select image less than
                                            1mb</p>}
                                        <span
                                            className="text-secondary">(Image should be 340px x 60px or 17 : 3)</span>
                                    </div>
                                </div>
                                <div style={{width: "59%", minHeight: "auto"}}
                                     className="imageBg py-1 d-flex justify-content-center">
                                    <label className="imageInput leftLogo"
                                           role="button">
                                        <img src={localImage ? localImage : logo ? logo : imageIcon}
                                             alt=""
                                             height={localImage ? 30 : logo ? 30 : 30}
                                             width={localImage ? 170 : logo ? 170 : 30}
                                             className=""/>
                                        {!logo &&
                                        <span
                                            className={`ms-4 ${!logo && 'text-muted'}`}>{!logo && "Upload"}</span>
                                        }
                                        <CropImage aspectRatio={5.6666} stateSetImage={setLogo} setError={setImageError}
                                                   imageLocation="left"
                                                   setLocal={setLocalImage}/>
                                    </label>
                                </div>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>
                <div className={`mb-2 mx-2 ${editConfig ? 'd-flex justify-content-between' : 'text-end'}`}>
                    {editConfig &&
                    <Button className="warningBtn " type="button" onClick={() => editConfig(localEventData)}>Edit
                        Configuration</Button>}
                    <div>
                        <Button className="editBtn mx-1 " type="submit">Save</Button>
                        <Button className="deleteBtn " type="button" onClick={() => {
                            setIsEditForm(false)
                        }}>Cancel</Button>
                    </div>
                </div>
            </Form>}
        </>
    );
};

export default PopupForm;
