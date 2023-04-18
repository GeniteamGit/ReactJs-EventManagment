import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Container, Form, FormInput, Row} from "shards-react";
import {CardHeader, Input, Modal, ModalBody, ModalHeader,} from "reactstrap";
import {useHistory, useParams} from "react-router-dom";
import {db, storage} from "../firebase";
import {NotificationManager} from "react-notifications";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import imageIcon from "../images/newUI/icons/image1.png";
import deletIcon from "../images/newUI/icons/delete.png";
import editIcon from "../images/newUI/icons/edit.png";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import theme1voting from "../images/newUI/screen-images/theme1voting.png";
import theme2voting from "../images/newUI/screen-images/theme2voting.png";
import CropImage from "../components/re-usable/cropImage";

const Voting = ({eventData, setEventData, avatarData, setAvatarData}) => {
    const [loading, setLoading] = useState(null);
    const [open, setOpen] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [ideas, setIdeas] = useState({});
    const [options, setOptions] = useState([]);
    const [action, setAction] = useState("true");
    const [surveyStatus, setSurveyStatus] = useState("true");
    const [surveyScreen, setSurveyScreen] = useState({description: "", surveySelectionLimit: "", titleName: ""});
    const [addIdea, setAddIdea] = useState({});
    const [editIdeaObject, setEditIdeaObject] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);
    const history = useHistory();
    const {eid} = useParams();

    useEffect(() => {
        
        if (avatarData.surveyScreen)
            setSurveyScreen(avatarData.surveyScreen);
        if (eventData.surveyStatus !== undefined)
            setSurveyStatus(eventData.surveyStatus.toString());
        getIdeas().then(result => {
            
            setIdeas(result);
        });
        getAction().then(result => {
            
            setAction(result);
            setLoading("ready");
        });
    }, []);
    useEffect(() => {
        if (imageFile) {
            urltoFile(imageFile, addIdea.description + Date.now(), 'image/png').then((result) => {
                if (open) {
                    
                    setEditIdeaObject(
                        {
                            ...editIdeaObject,
                            counterImageURl: imageUrl,
                            image: result
                        })
                } else if (openAddModal) {
                    
                    
                    setAddIdea(
                        {
                            ...addIdea,
                            counterImageURl: imageUrl,
                            image: result
                        })
                }
            })
        }
    }, [imageUrl, imageFile]);

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
    const getIdeas = async () => {
        const docRef = doc(db, "ideas", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            
            return docSnap.data().ideas;
        } else {
            
        }
    }
    const getAction = async () => {
        const docRef = doc(db, "eventObserver", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().surveyFlag !== undefined) {
            return docSnap.data().surveyFlag
        } else {
            
            return false;
        }
    }
    let removeFormFields = (_item) => {
        
        const _obj = ideas;
        delete _obj[_item];
        setIdeas({..._obj});
    };
    const editIdea = (_item) => {
        
        setEditIndex(_item);
        setEditIdeaObject(ideas[_item]);
        toggle();
    }
    let handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading("pending");
            
            //Setting survey status in event data
            if (surveyStatus === "false") {
                // setLoading(null);
                await updateDoc(doc(db, "event", eid), {
                    surveyStatus: false
                });
                setEventData({...eventData, surveyStatus: false});
                setLoading("ready");
                localStorage.setItem("prevLink", "Voting");
                localStorage.setItem("activeLink", "Questions");
                history.push(`/dragablequestions/${eid}`);
                NotificationManager.success("Voting Status Updated");
            } else {
                if (surveyScreen.surveySelectionLimit >= Object.keys(ideas).length || surveyScreen.surveySelectionLimit <= 0) {
                    
                    NotificationManager.error("Invalid Counter Value");
                    
                    setLoading("ready");
                    return
                }
                if (ideas === undefined) {
                    
                    NotificationManager.error("Enter Ideas");
                    setLoading("ready");
                    return
                }
                let customObj = {...ideas};
                for (let _key in customObj) {
                    
                    if (customObj[_key].counterImageURl !== undefined &&
                        customObj[_key].counterImageURl !== "" &&
                        !customObj[_key].counterImageURl.includes("firebase")) {
                        const imageRef = ref(storage, `${_key}`);
                        const data = await uploadBytes(imageRef, customObj[_key].image);
                        
                        const imageUrl = await getDownloadURL(data.ref);
                        
                        customObj[_key].counterImageURl = imageUrl;
                        delete customObj[_key].image;
                        if (!customObj[_key].hasOwnProperty("voteCount"))
                            customObj[_key].voteCount = 0;
                        
                    } else if (customObj[_key].counterImageURl === undefined) {
                        NotificationManager.error("Enter Images for all entities");
                        setLoading("ready");
                        return;
                    }
                    // customObj[_key].voteCount = 0;
                }
                
                setIdeas({...customObj});
                //Setting ideas data
                const ideasDocRef = doc(db, "ideas", eid);
                const ideaDocSnap = await getDoc(ideasDocRef);
                if (ideaDocSnap.exists()) {
                    
                    await updateDoc(ideasDocRef, {
                        ideas: customObj
                    })
                } else {
                    await setDoc(ideasDocRef, {ideas: customObj});
                }
                //Setting observer Data
                
                const observerDocRef = doc(db, "eventObserver", eid);
                const observerDocSnap = await getDoc(observerDocRef);
                if (observerDocSnap.exists()) {
                    await updateDoc(observerDocRef, {
                        surveyFlag: action == "false" ? false : Boolean(action)
                    })
                } else {
                    await setDoc(doc(observerDocRef), {surveyFlag: action == "false" ? false : Boolean(action)})
                }
                //Setting screen data
                if (Object.keys(avatarData).includes("surveyScreen")) {
                    await updateDoc(doc(db, "details", eid), {
                        surveyScreen: surveyScreen
                    });
                } else {
                    
                        ...avatarData,
                        surveyScreen: surveyScreen
                    })
                    await setDoc(doc(db, "details", eid), {
                        ...avatarData,
                        surveyScreen: surveyScreen
                    });
                }
                setAvatarData({
                    ...avatarData,
                    surveyScreen: surveyScreen
                });
                await updateDoc(doc(db, "event", eid), {
                    surveyStatus: true
                });
                setEventData({...eventData, surveyStatus: true});
                setLoading("ready");
                localStorage.setItem("prevLink", "Voting");
                localStorage.setItem("activeLink", "Questions");
                history.push(`/dragablequestions/${eid}`);
                NotificationManager.success("Voting Ideas Updated");
            }
        } catch (e) {
            
            setLoading("ready");
        }
    };
    const toggle = () => {
        setOpen(!open);
        setImageError(null);
    };
    const toggleAddModal = () => {
        if (openAddModal) {
            
            setAddIdea({});
        }
        setOpenAddModal(!openAddModal);
        setImageError(null);
    }
    const saveEdit = (e) => {
        e.preventDefault();
        
        
        
        setIdeas({...ideas, [editIndex]: editIdeaObject})
        
        toggle();
        setEditIdeaObject({});
    }
    const saveAdd = (e) => {
        e.preventDefault();
        
        
        if (!addIdea.counterImageURl) {
            NotificationManager.error("Please Select Image");
            return;
        }
        const _key = Date.now();
        setIdeas({...ideas, [_key]: addIdea});
        toggleAddModal();
        setAddIdea({});
    }
    let optionValues;
    return <>
        {loading === null ? <div className="text-center w-100 py-5 my-5">
                <div className="spinner-border spinner-border-lg" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div> :
            <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Row className="">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Add Voting Entities</h4>
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
                                            {loading === "pending" ?
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div> : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Col lg={3}>
                                <div>
                                    <label className="textColor  ">Status</label>
                                </div>
                                <div>
                                    <Input
                                        className="selectInput w-75 rounded-0 "
                                        type="select"
                                        value={surveyStatus}
                                        onChange={(e) => {
                                            setSurveyStatus(e.target.value);
                                        }}
                                    >
                                        <option value={true}>Enable</option>
                                        <option value={false}>Disable</option>
                                    </Input>
                                </div>
                            </Col>
                            {surveyStatus === "true" &&
                                <>
                                    <Col lg={3}>
                                        <div>
                                            <label className="textColor  ">Title</label>
                                        </div>
                                        <div>
                                            <FormInput
                                                type="text"
                                                maxLength="50"
                                                value={surveyScreen?.titleName}
                                                onChange={(e) => {
                                                    setSurveyScreen({...surveyScreen, titleName: e.target.value})
                                                }}
                                                required
                                                placeholder="Title"
                                                className="plainInput w-75 rounded-0 "
                                                disabled={loading === "pending"}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <div>
                                            <label className="textColor  ">Select Top</label>
                                        </div>
                                        <div>
                                            <Input
                                                className="selectInput w-75 rounded-0 "
                                                type="select"
                                                value={surveyScreen?.surveySelectionLimit}
                                                onChange={(e) => {
                                                    setSurveyScreen({
                                                        ...surveyScreen,
                                                        surveySelectionLimit: e.target.value
                                                    });
                                                }}
                                                required
                                            >
                                                {Object.keys(ideas).slice(0, -1).map((item, i) => <option
                                                    value={i + 1}>{i + 1}</option>)}
                                                {/*<option value={1}>1</option>*/}
                                                {/*<option value={2}>2</option>*/}
                                                {/*<option value={3}>3</option>*/}
                                                {/*<option value={4}>4</option>*/}
                                            </Input>
                                            {/*<FormInput*/}
                                            {/*    type="number"*/}
                                            {/*    maxLength="50"*/}
                                            {/*    value={surveyScreen?.surveySelectionLimit}*/}
                                            {/*    onChange={(e) => {*/}
                                            {/*        setSurveyScreen({*/}
                                            {/*            ...surveyScreen,*/}
                                            {/*            surveySelectionLimit: e.target.value*/}
                                            {/*        });*/}
                                            {/*    }}*/}
                                            {/*    required*/}
                                            {/*    placeholder="Counter"*/}
                                            {/*    className="plainInput w-75 rounded-0 "*/}
                                            {/*    disabled={loading === "pending"}*/}
                                            {/*/>*/}
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <div>
                                            <label className="textColor  ">Visibility</label>
                                        </div>
                                        <div>
                                            <Input
                                                className="selectInput w-75 rounded-0 "
                                                type="select"
                                                value={action}
                                                onChange={(e) => {
                                                    setAction(e.target.value);
                                                    
                                                }}
                                            >
                                                <option value={true}>Show</option>
                                                <option value={false}>Hide</option>
                                            </Input>
                                        </div>
                                    </Col>
                                </>
                            }
                        </Row>
                        {surveyStatus === "true" &&
                            <>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <label className="textColor  ">Description</label>
                                        </div>
                                        <div>
                                            <FormInput
                                                type="text"
                                                maxLength="50"
                                                value={surveyScreen?.description}
                                                onChange={(e) => {
                                                    setSurveyScreen({...surveyScreen, description: e.target.value});
                                                }}
                                                required
                                                placeholder="Description"
                                                className="plainInput w-75 rounded-0 "
                                                disabled={loading === "pending"}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Card className="mt-3">
                                    <CardHeader className="pb-0">
                                        <label className="textColor">Choose Entities</label>
                                    </CardHeader>
                                    <CardBody className="pt-2">
                                        <hr className="mt-0" style={{border: "1px solid"}}/>
                                        <Row>
                                            <Col lg={8} className="powerContainer">
                                                <div>
                                                    <div>
                                                        <Button className="addSuperPower"
                                                                type="button"
                                                                onClick={toggleAddModal}
                                                        >+ Add Entity
                                                        </Button>
                                                        {ideas && Object.keys(ideas).map((_item, i) => <div
                                                            className="d-flex w-100 my-2" key={i}>
                                                            <div className="imageIconBg">
                                                                <img
                                                                    src={ideas[_item].counterImageURl ? ideas[_item].counterImageURl : imageIcon}
                                                                    alt=""
                                                                    height={27} width={27}/>
                                                            </div>
                                                            <div
                                                                className="superPower mx-2"> {ideas[_item].description}</div>
                                                            <div className="mx-2">
                                                                <Button
                                                                        className="me-1 deleteBtn"
                                                                        onClick={() => {
                                                                            removeFormFields(_item)
                                                                        }}
                                                                >
                                                                    <img src={deletIcon} alt="" height={15}/>
                                                                </Button>
                                                                <Button className="editBtn"
                                                                        onClick={() => {
                                                                            editIdea(_item)
                                                                        }}>
                                                                    <img src={editIcon} alt="" height={15}/>
                                                                </Button>
                                                            </div>
                                                        </div>)}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col lg={4} className="pt-0 text-center">
                                                <img alt="" height={450} style={{borderRadius: "20px"}}
                                                     src={eventData.themeSelected === "1" ? theme1voting :
                                                         eventData.themeSelected === "2" && theme2voting}/>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </>
                        }
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
                                    {loading === "pending" ?
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : "Save"}
                                </Button>
                            </div>
                        </div>
                    </Form>
                    <div>
                        <Modal isOpen={open} toggle={toggle}>
                            <ModalHeader>Edit Idea</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={saveEdit}>
                                    <label
                                        className="d-flex flex-column justify-content-center align-items-center my-2">
                                        <img
                                            src={editIdeaObject.counterImageURl ? editIdeaObject.counterImageURl : imageIcon}
                                            alt=""
                                            height={100} width={100} className="imageInput modalBg"/>
                                        <CropImage aspectRatio={1} setLocal={setImageUrl}
                                                   setError={setImageError}
                                                   imageLocation="right"
                                                   stateSetImage={setImageFile}/>
                                        {imageError ?
                                            <p className="mb-0 text-danger fw-light">Please Select Image less than 1
                                                mb</p> : <>
                                                <p className="mb-0">Upload New Image</p>
                                                <p className="">(Image should be 200px x 200px or 1 : 1)</p></>}
                                    </label>
                                    <Input
                                        min="1"
                                        max="50"
                                        type="text"
                                        required
                                        className="plainInput w-100 "
                                        value={editIdeaObject.description}
                                        onChange={(e) => {
                                            setEditIdeaObject({...editIdeaObject, description: e.target.value});
                                        }}
                                        placeholder="Edit Voting Entity"
                                    />
                                    <div className="my-3 text-center">
                                        <Button className="editBtn w-25  " type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </Modal>
                        <Modal isOpen={openAddModal} toggle={toggleAddModal}>
                            <ModalHeader>Add New Entity</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={saveAdd}>
                                    <label
                                        className="d-flex flex-column justify-content-center align-items-center my-2">
                                        <img
                                            src={addIdea.counterImageURl ? addIdea.counterImageURl : imageIcon}
                                            alt=""
                                            height={100} width={100} className="imageInput modalBg"/>
                                        <CropImage aspectRatio={1} setLocal={setImageUrl} setError={setImageError}
                                                   imageLocation="right"
                                                   stateSetImage={setImageFile}/>
                                        {imageError ?
                                            <p className="mb-0 text-danger fw-light">Please Select Image less than 1
                                                mb</p> : <>
                                                <p className="mb-0">Upload New Image</p>
                                                <p className="">(Image should be 200px x 200px or 1 : 1)</p></>}
                                    </label>
                                    <Input
                                        min="1"
                                        max="50"
                                        type="text"
                                        required
                                        className="plainInput w-100 "
                                        value={addIdea.description}
                                        onChange={(e) => {
                                            setAddIdea({...addIdea, description: e.target.value});
                                        }}
                                        placeholder="Entity Description"
                                    />
                                    <div className="my-3 text-center">
                                        <Button className="editBtn w-25  " type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </Modal>
                    </div>
                </Container>
            </div>
        }
    </>;
};

export default Voting;
