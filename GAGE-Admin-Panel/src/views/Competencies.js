import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, Col, Container, Form, FormInput, Row,} from "shards-react";
import {useHistory, useParams} from "react-router-dom";
import {db, storage} from "../firebase";
import {NotificationManager} from "react-notifications";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {CardHeader, Input, Modal, ModalBody, ModalHeader,} from "reactstrap";
import imageIcon from "../images/newUI/icons/image1.png";
import deletIcon from "../images/newUI/icons/delete.png";
import editIcon from "../images/newUI/icons/edit.png";
import theme1competencies from "../images/newUI/screen-images/theme1competencies.png";
import theme2competencies from "../images/newUI/screen-images/theme2competencies.png";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import CropImage from "../components/re-usable/cropImage";

const Competencies = ({eventData, setEventData, avatarData, setAvatarData}) => {
    const [competencies, setCompetencies] = useState([]);
    const [compentencyFlag, setCompetencyFlag] = useState("true");
    const [loading, setLoading] = useState(null);
    const [competenciesTitle, setCompetenciesTitle] = useState("");
    const [competenciesDescription, setCompetenciesDescription] = useState("");
    const [counter, setCounter] = useState(null);
    const [open, setOpen] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newPower, setNewPower] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [editPowerObject, setEditPowerObject] = useState({});
    const [images, setImages] = useState({});
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);
    const history = useHistory();
    const {eid} = useParams();

    useEffect(() => {
        async function fetch() {
            if (eventData.competenciesFlag !== undefined) {
                setCompetencyFlag(eventData.competenciesFlag.toString());
                
            }
            await getCompetencies();
        }

        fetch();

        getImages().then(result => {
            setImages(result);
        });

    }, []);
    useEffect(() => {
        if (imageFile) {
            urltoFile(imageFile, newPower.name + Date.now(), 'image/png').then((result) => {
                if (open) {
                    setEditPowerObject(
                        {
                            ...editPowerObject,
                            imageUrl: imageUrl,
                            image: result
                        })
                } else if (openAddModal) {
                    setNewPower(
                        {
                            ...newPower,
                            imageUrl: imageUrl,
                            image: result
                        })
                }
            })
        }
    }, [imageUrl, imageFile])

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
    const getImages = async () => {
        const docRef = doc(db, "themeCharacter", "config");
        const docSnap = await getDoc(docRef);
        return docSnap.data().competencies;
    }
    const getCompetencies = async () => {
        const docRef = doc(db, "details", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            if (docSnap.data().hasOwnProperty("competencies")) {
                
            }
            if (docSnap.data().competencyScreen !== undefined) {
                setCompetencies(docSnap.data().competencyScreen.competencies);
                setCompetenciesTitle(docSnap.data().competencyScreen.titleName);
                setCompetenciesDescription(docSnap.data().competencyScreen.titleDesc);
                setCounter(docSnap.data().competencyScreen.selectionLimit);
            }
        } else {
            
        }
        setLoading("ready");
    };
    let removeFormFieldsCompetencies = (i) => {
        let newFormValues = [...competencies];
        newFormValues.splice(i, 1);
        setCompetencies(newFormValues);
    };
    let handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (compentencyFlag === "false") {
                
                setLoading("pending");
                await updateDoc(doc(db, "event", eid), {
                    competenciesFlag:
                        compentencyFlag == "false" ? false : Boolean(compentencyFlag),
                });
                setEventData({
                    ...eventData,
                    competenciesFlag:
                        compentencyFlag == "false" ? false : Boolean(compentencyFlag),
                });
                localStorage.setItem("prevLink", "Super Powers");
                localStorage.setItem("activeLink", "Voting");
                history.push(`/voting/${eid}`);
                NotificationManager.success("Super Powers Updated");
                setLoading("ready");
                return;
            } else if (compentencyFlag === "true" && counter >= competencies.length || counter <= 0) {
                
                
                NotificationManager.error("Invalid Counter Value");
                setLoading("ready");
                return
            }
            if (compentencyFlag === "true" && counter > 4) {
                NotificationManager.error("Max counter value should be 4");
                return;
            }
            setLoading("pending");
            let newArray = [...competencies];
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i].imageUrl !== undefined && !newArray[i].imageUrl.includes("firebase") && newArray[i].imageUrl !== "") {
                    const imageRef = ref(storage, `${eid + 'superPower' + i}`);
                    const data = await uploadBytes(imageRef, newArray[i].image);
                    newArray[i].imageUrl = await getDownloadURL(data.ref);
                    
                }
            }
            
            setCompetencies(newArray);
            await updateDoc(doc(db, "details", eid), {
                competencyScreen: {
                    competencies: newArray.map((e) => {
                        if (e.imageUrl !== undefined)
                            return {name: e.name, imageUrl: e.imageUrl};
                        else return {name: e.name}
                    }),
                    titleName: competenciesTitle,
                    titleDesc: competenciesDescription,
                    selectionLimit: Number(counter)
                },
            });
            setLoading(null);
            
            setAvatarData({
                ...avatarData,
                competencyScreen: {
                    competencies: newArray.map((e) => {
                        if (e.imageUrl !== undefined) {
                            
                            return {name: e.name, imageUrl: e.imageUrl};
                        } else {
                            
                            return {name: e.name}
                        }
                    }),
                    titleName: competenciesTitle,
                    titleDesc: competenciesDescription,
                    selectionLimit: Number(counter)
                },
            });
            
            await updateDoc(doc(db, "event", eid), {
                competenciesFlag:
                    compentencyFlag == "false" ? false : Boolean(compentencyFlag),
            });
            setEventData({
                ...eventData,
                competenciesFlag:
                    compentencyFlag == "false" ? false : Boolean(compentencyFlag),
            });
            // setLoad(null);
            localStorage.setItem("prevLink", "Super Powers");
            localStorage.setItem("activeLink", "Voting");
            history.push(`/voting/${eid}`);
            NotificationManager.success("Super Powers Updated");
        } catch (e) {
            
            setLoading(null);
        }
    };
    const toggle = () => {
        setOpen(!open);
        setImageError(null);
        
    };
    const toggleAddModal = () => {
        if (openAddModal) {
            
            setNewPower({});
        } else {
            // 
            setNewPower({...newPower, imageUrl: images[competencies.length + 1]});
            
        }
        setOpenAddModal(!openAddModal);
        setImageError(null);
    }
    const editPower = (_item) => {
        
        setEditIndex(competencies.findIndex((e) => e.name === _item.name));
        setEditPowerObject(_item);
        toggle();
    }
    const saveEdit = (e) => {
        e.preventDefault();
        let newPowers = [...competencies];
        
        newPowers[editIndex] = editPowerObject;
        setCompetencies(newPowers);
        toggle();
        setEditPowerObject({});
    }
    const saveAdd = (e) => {
        e.preventDefault();
        
        setCompetencies([...competencies, newPower]);
        toggleAddModal();
        setNewPower({});
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
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <Row className="">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Add Super Power Options</h4>
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
                                <Col lg={3}>
                                    <div>
                                        <label className="textColor  ">Status</label>
                                    </div>
                                    <div>
                                        <Input
                                            className="selectInput w-75 rounded-0 "
                                            type="select"
                                            value={compentencyFlag}
                                            onChange={(e) => {
                                                setCompetencyFlag(e.target.value);
                                            }}
                                        >
                                            <option value={"true"}>Enable</option>
                                            <option value={"false"}>Disable</option>
                                        </Input>
                                    </div>
                                </Col>
                                {compentencyFlag === "true" && <>
                                    <Col lg={3}>
                                        <div>
                                            <label className="textColor  ">Title</label>
                                        </div>
                                        <div>
                                            <FormInput
                                                type="text"
                                                maxLength="50"
                                                value={competenciesTitle || ""}
                                                onChange={(e) => setCompetenciesTitle(e.target.value)}
                                                required
                                                placeholder="Title"
                                                className="plainInput w-75 rounded-0 "
                                                // size="sm"
                                                // value={superPower}
                                                // onChange={(e) => {
                                                //     setSuperPower(e.target.value);
                                                // }}
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
                                                value={counter}
                                                onChange={(e) => setCounter(e.target.value)}
                                            >
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                            </Input>
                                            {/*<FormInput*/}
                                            {/*    type="number"*/}
                                            {/*    // maxLength="50"*/}
                                            {/*    value={counter}*/}
                                            {/*    onChange={(e) => setCounter(e.target.value)}*/}
                                            {/*    required*/}
                                            {/*    placeholder="Counter"*/}
                                            {/*    className="plainInput w-75 rounded-0 "*/}
                                            {/*    disabled={loading === "pending"}*/}
                                            {/*/>*/}
                                        </div>
                                    </Col>
                                </>}
                            </Row>
                            {compentencyFlag === "true" && <>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <label className="textColor  ">Description</label>
                                        </div>
                                        <div>
                                            <FormInput
                                                type="text"
                                                maxLength="50"
                                                value={competenciesDescription || ""}
                                                onChange={(e) => setCompetenciesDescription(e.target.value)}
                                                required
                                                placeholder="Description"
                                                className="plainInput w-75 rounded-0 "
                                                disabled={loading === "pending"}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </>}
                            {compentencyFlag == "true" &&
                            <Card className="mt-3">
                                <CardHeader className="pb-0">
                                    <label className="textColor">Your Super Powers</label>
                                </CardHeader>
                                <CardBody className="pt-2">
                                    <hr className="mt-0" style={{border: "1px solid"}}/>
                                    <Row>
                                        <Col lg={8} className="powerContainer">
                                            <div>
                                                <div>
                                                    <Button
                                                        className={`addSuperPower ${competencies.length >= 11 && "d-none"}`}
                                                        onClick={toggleAddModal}
                                                        disabled={competencies.length >= 11}> + Super Power
                                                    </Button>
                                                    {competencies.length > 0 && competencies.map((item, i) => (
                                                        <div className="d-flex w-100 my-2" key={i}>
                                                            <div className="imageIconBg">
                                                                <img src={item.imageUrl ? item.imageUrl : imageIcon}
                                                                     alt=""
                                                                     height={27} width={27}/>
                                                            </div>
                                                            <div className="superPower mx-2"> {item.name}</div>
                                                            <div className="mx-2">
                                                                <Button
                                                                    className="deleteBtn me-1"
                                                                    onClick={() => removeFormFieldsCompetencies(i)}
                                                                >
                                                                    <img src={deletIcon} alt="" height={15}/>
                                                                </Button>
                                                                <Button className="editBtn"
                                                                        onClick={() => editPower(item)}>
                                                                    <img src={editIcon} alt="" height={15}/>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={4} className="pt-0 text-center">
                                            <img alt="" height={450} style={{borderRadius: "20px"}}
                                                 src={eventData.themeSelected === "1" ? theme1competencies :
                                                     eventData.themeSelected === "2" && theme2competencies}/>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>}
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
                        </Form>
                        <div>
                            <Modal isOpen={open} toggle={toggle}>
                                <ModalHeader>Edit Super Power</ModalHeader>
                                <ModalBody>
                                    <Form onSubmit={saveEdit}>
                                        {/*<label className=" ">Edit Super Power</label>*/}
                                        <div>
                                            <label
                                                className="d-flex flex-column justify-content-center align-items-center my-2">
                                                <img src={editPowerObject.imageUrl && editPowerObject.imageUrl}
                                                     alt=""
                                                     height={100} width={100} className="imageInput modalBg"/>
                                                <CropImage aspectRatio={1} setLocal={setImageUrl}
                                                           setError={setImageError}
                                                           imageLocation="right"
                                                           stateSetImage={setImageFile}/>
                                                {imageError ?
                                                    <p className="mb-0 text-danger fw-light">Please Select Image less
                                                        than 1 mb</p> : <>
                                                        <p className="mb-0">Upload New Image</p>
                                                        <p className="">(Image should be 200px x 200px or 1 : 1)</p></>}
                                            </label>
                                            <Input
                                                min="1"
                                                max="9999"
                                                type="text"
                                                required
                                                className="plainInput w-100 "
                                                value={editPowerObject.name}
                                                onChange={(e) => {
                                                    
                                                    setEditPowerObject({...editPowerObject, name: e.target.value});
                                                }}
                                                placeholder="Super Power Title"
                                            />
                                        </div>

                                        <div className="my-3 text-center">
                                            <Button className="editBtn w-25  " type="submit">
                                                Save
                                            </Button>
                                        </div>
                                    </Form>
                                </ModalBody>
                            </Modal>
                            <Modal isOpen={openAddModal} toggle={toggleAddModal}>
                                <ModalHeader>Super Power</ModalHeader>
                                <ModalBody>
                                    <Form onSubmit={saveAdd}>
                                        <label
                                            className="d-flex flex-column justify-content-center align-items-center my-2">
                                            <img src={newPower.imageUrl && newPower.imageUrl}
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
                                            max="9999"
                                            type="text"
                                            required
                                            className="plainInput w-100 "
                                            value={newPower.name}
                                            onChange={(e) => {
                                                setNewPower({...newPower, name: e.target.value})
                                            }}
                                            placeholder="Super Power Title"
                                        />
                                        <div className="my-3 text-center">
                                            <Button className="editBtn   w-25" type="submit">
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
        </>
    );
};

export default Competencies;
