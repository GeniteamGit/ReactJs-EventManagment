import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    FormGroup,
    FormInput,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
} from "shards-react";
import {useHistory, useParams} from "react-router-dom";
import {NotificationManager} from "react-notifications";
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import imageIcon from "../images/newUI/icons/image-icon.png";
import theme1avatar from "../images/newUI/screen-images/theme1avatar.png";
import theme1weapon from "../images/newUI/screen-images/theme1weapon.png";
import theme1shield from "../images/newUI/screen-images/theme1shield.png";
import theme1armor from "../images/newUI/screen-images/theme1armor.png";
import theme2avatar from "../images/newUI/screen-images/theme2avatar.png";
import theme2weapon from "../images/newUI/screen-images/theme2weapon.png";
import theme2shield from "../images/newUI/screen-images/theme2shield.png";
import theme2armor from "../images/newUI/screen-images/theme2armor.png";
import {Input} from "reactstrap";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import ItemScreen from "./ItemScreen";

const AvatarSelection = ({avatarData, setAvatarData, eventData, setEventData}) => {
    const [screenData, setScreenData] = useState({});
    const [loading, setLoading] = useState(null);
    const [open, setOpen] = useState(false);
    const [editScreen, setEditScreen] = useState({});
    const [editScreenName, setEditScreenName] = useState("");
    const [selectedTheme, setSelectedTeme] = useState("");
    const [profileStatus, setProfileStatus] = useState("true");
    const [screens, setScreens] = useState([]);
    const [images, setImages] = useState({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const {eid} = useParams();
    const history = useHistory();

    const colors = ["linear-gradient(to bottom right, #e7ad69, #f6e194)", "linear-gradient(to bottom right, #ac5596, #e6b0ec)",
        "linear-gradient(to bottom right, #4d89af, #6ac1ec)", "linear-gradient(to bottom right, #679475, #9cecb4)"];
    // const borders = ["#134d91", "#4e1494", "#ad6519", "#7f192a"];
    const profileScreens = ["avatarScreen", "weaponScreen", "shieldScreen", "armorScreen"];
    useEffect(() => {
        if (eventData.hasOwnProperty("profileStatus")) {
            
            setProfileStatus(eventData.profileStatus.toString());
        }
        setSelectedTeme(eventData.themeSelected);
        setScreenData(avatarData);
        loadImages(eventData.themeSelected).then(result => {
            setImages(result);
            setImagesLoaded(true);
        })
        
        setTimeout(() => {
            setLoading("ready");
        }, 1000)
    }, [avatarData]);
    useEffect(() => {
        if (imagesLoaded) {
            
            
            let arranged = [];
            
            for (const screen in screenData) {
                if (screenData[screen].hasOwnProperty("sequence")) {
                    
                    
                    
                    const imagesObject = images[screen].reduce((obj, image, index) => {
                        obj[index] = image;
                        return obj;
                    }, {});
                    
                    arranged[screenData[screen].sequence - 1] = {...screenData[screen], images: imagesObject};
                }
            }
            
            setScreens(arranged);
        }
    }, [screenData, imagesLoaded]);

    const loadImages = async (theme) => {
        
        const docRef = doc(db, "themeCharacter", theme);
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    }
    const formSubmit = async (e) => {
        e.preventDefault();
        
        setLoading("pending");
        if (profileStatus === "true" && !screenData.hasOwnProperty("avatarScreen")) {
            NotificationManager.error("Must add 1 screen");
            setLoading("ready");
            return;
        }
        deleteImages();
        await updateDoc(doc(db, "event", eid), {
            ...eventData, profileStatus: profileStatus === "true" ? true : false
        });
        setEventData({...eventData, profileStatus: profileStatus === "true" ? true : false});
        try {
            await setDoc(doc(db, "details", eid), {...screenData});
            
            
            setAvatarData(screenData);
            setLoading(null);
            NotificationManager.success("Profile Saved");
            localStorage.setItem("activeLink", "Super Powers");
            localStorage.setItem("prevLink", "Profile");
            history.push(`/competencies/${eid}`);
        } catch (e) {
            
            setLoading("error");
            NotificationManager.error("Profile not saved");
        }
    }
    const deleteImages = () => {
        
        let screensObj = {...screenData};
        for (let _screen in screensObj) {
            if (screensObj[_screen].hasOwnProperty("images")) {
                delete screensObj[_screen].images;
            }
        }
        
        setScreenData({...screensObj});
    }
    const toggle = () => {
        
        setOpen(!open);
    };
    const edit = (_screen) => {
        
        setEditScreenName(_screen);
        setEditScreen(screenData[_screen + 'Screen']);
        toggle();
    }
    const saveEdit = (e) => {
        e.preventDefault();
        
        
        setScreenData({...screenData, [editScreenName + 'Screen']: editScreen});
        setEditScreen({});
        toggle();
    }
    const addScreen = (_screenName) => {
        
        setEditScreenName(_screenName);
        const dummyObj = {
            ...(_screenName !== "avatar" ? {
                    titleName: "",
                    titleDesc: "",
                    sequence: screens.length + 1,
                    [_screenName]: [{name: "", desc: ""}, {name: "", desc: ""}, {name: "", desc: ""}]
                } :
                {
                    titleName: "",
                    titleDesc: "",
                    [_screenName]: [{name: "", desc: ""}, {name: "", desc: ""}, {name: "", desc: ""}]
                }),
        }
        setEditScreen(dummyObj);
        
        toggle();
    }
    const deleteScreen = (_screen, index) => {
        
        const obj = screenData;
        delete obj[_screen + "Screen"];
        let _index = 0;
        Object.keys(obj).forEach((_object) => {
            if (obj[_object].hasOwnProperty("sequence")) {
                _index = _index + 1;
                obj[_object].sequence = _index;
                
            }
        })
        
        setScreenData({...obj});
    }
    const onDragEnd = async (result) => {
        
        const newItems = Array.from(screens);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        let customObject = screenData;
        let screenName = "";
        newItems.forEach((_item, index) => {
            Object.keys(_item).forEach((_field) => {
                if (Array.isArray(_item[_field]))
                    screenName = _field + "Screen"
            })
            customObject = {...customObject, [screenName]: {..._item, sequence: index + 1}}
        });
        
        setScreens(newItems);
        setScreenData(customObject);
    };

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
                        <Form onSubmit={formSubmit}>
                            <Row>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Enter Avatar Flow Screens Information </h4>
                                    <div className="d-flex w-25 justify-content-end">
                                        <div className="mx-2">
                                            <Button className="warningBtn my-2" onClick={() => {
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
                                            <Button className="editBtn my-2" type="submit"
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
                                <Row className="mb-4">
                                    <Col lg={3}>
                                        <div>
                                            <label className="textColor  ">Status</label>
                                        </div>
                                        <div>
                                            <Input
                                                className="selectInput w-75 rounded-0 "
                                                type="select"
                                                value={profileStatus}
                                                onChange={(e) => {
                                                    
                                                    setProfileStatus(e.target.value);
                                                }}
                                            >
                                                <option value={"true"}>Enable</option>
                                                <option value={"false"}>Disable</option>
                                            </Input>
                                        </div>
                                    </Col>
                                </Row>
                                {profileStatus === "true" &&
                                <>
                                    <div className="d-flex">
                                        <Button type="button"
                                                className={Object.keys(screenData).includes("avatarScreen") ? 'disabledButton' : 'avatarButton'}
                                                disabled={Object.keys(screenData).includes("avatarScreen")}
                                                onClick={() => addScreen("avatar")}>
                                            + Character Screen
                                        </Button>
                                        <Button type="button"
                                                className={`mx-2 ${Object.keys(screenData).includes("weaponScreen") ||
                                                !Object.keys(screenData).includes("avatarScreen") ? 'disabledButton' : 'weaponButton'}`}
                                                disabled={Object.keys(screenData).includes("weaponScreen") || !Object.keys(screenData).includes("avatarScreen")}
                                                onClick={() => addScreen("weapon")}>+
                                            Weapon Screen</Button>
                                        <Button type="button"
                                                className={Object.keys(screenData).includes("shieldScreen") ||
                                                !Object.keys(screenData).includes("avatarScreen") ? 'disabledButton' : 'shieldButton'}
                                                disabled={Object.keys(screenData).includes("shieldScreen") || !Object.keys(screenData).includes("avatarScreen")}
                                                onClick={() => addScreen("shield")}>+ Shield Screen</Button>
                                        <Button type="button"
                                                className={`mx-2 ${Object.keys(screenData).includes("armorScreen") ||
                                                !Object.keys(screenData).includes("avatarScreen") ? 'disabledButton' : 'armorButton'} `}
                                                disabled={Object.keys(screenData).includes("armorScreen") || !Object.keys(screenData).includes("avatarScreen")}
                                                onClick={() => addScreen("armor")}>+
                                            Armor Screen</Button>
                                    </div>
                                    {Object.keys(screenData).includes("avatarScreen") &&
                                    <div>
                                        <Card className="text-white my-2 px-0" style={{
                                            backgroundImage: colors[0],
                                        }}>
                                            <CardBody className="pt-3 pb-0">
                                                <Row>
                                                    <Col lg={3} className="px-0">
                                                        <div>
                                                            <h5 className="text-white fw-bold mb-0">Avatars</h5>
                                                        </div>
                                                        <div className="">
                                                            <p className="mb-0 text-white-50">Title: <label
                                                                className=" text-white fw-light">{screenData?.avatarScreen?.titleName}</label>
                                                            </p>
                                                        </div>
                                                        <div className="">
                                                            <p className="mb-3 text-white  fw-light">{screenData?.avatarScreen?.titleDesc}</p>
                                                        </div>
                                                    </Col>
                                                    <Col lg={2} className="px-0">
                                                        <div
                                                            className="d-flex justify-content-end mb-3 mt-1">
                                                            <img src={images.avatarScreen && images.avatarScreen[0]}
                                                                 alt="" height={60}
                                                                 width={60} className="avatarImages"/>
                                                            <img src={images.avatarScreen && images.avatarScreen[1]}
                                                                 alt="" height={60}
                                                                 width={60} className="avatarImages mx-1"/>
                                                            <img src={images.avatarScreen && images.avatarScreen[2]}
                                                                 alt="" height={60}
                                                                 width={60} className="avatarImages"/>
                                                        </div>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <div className="mt-1">
                                                            {screenData?.avatarScreen?.avatar?.map((_avatar, _index) => (
                                                                <div className="d-flex align-items-center" key={_index}>
                                                                    <p className="mb-0 text-white-50">{_index === 0 ? "Male:" : _index === 1 ? "Robot:" : _index === 2 && "Female:"}</p>
                                                                    <p className="mb-0 ms-1 text-white fw-light ">{_avatar.name} {_avatar.desc}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Col>
                                                    <Col lg={1}>
                                                        <div
                                                            className="d-flex justify-content-end align-items-center h-100">
                                                            <Button className="deleteBtn  me-2"
                                                                    disabled={true} type="button">
                                                                Delete
                                                            </Button>
                                                            <Button className="editBtn "
                                                                    onClick={() => edit("avatar")}>
                                                                Edit
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    }
                                    {screens.length > 0 &&
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="droppable">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {screens && screens.map((_screen, i) => (
                                                        <Draggable
                                                            key={_screen.titleName + i}
                                                            draggableId={_screen.titleName + i}
                                                            index={i}
                                                        >
                                                            {(provided, snapshot) => (
                                                                <ItemScreen
                                                                    provided={provided}
                                                                    snapshot={snapshot}
                                                                    _screen={_screen}
                                                                    i={i}
                                                                    deleteScreen={deleteScreen}
                                                                    edit={edit}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                    }
                                </>}
                            </Row>
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
                        <Modal open={open} toggle={toggle} className="customModal">
                            <ModalHeader><label className="textColor fs-3 fw-bold">
                                {editScreenName === "avatar" ? "Character Screen Details" :
                                    selectedTheme === "3" && editScreenName === "weapon" ? "Screen 1" :
                                        editScreenName === "weapon" ? "Weapon Screen Details" :
                                            selectedTheme === "3" && editScreenName === "shield" ? "Screen 2" :
                                                editScreenName === "shield" ? "Shield Screen Details" :
                                                    selectedTheme === "3" && editScreenName === "armor" ? "Screen 3" :
                                                        editScreenName === "armor" && "Armor Screen Details"
                                }
                            </label></ModalHeader>
                            <ModalBody>
                                <Form onSubmit={saveEdit}>
                                    <Row>
                                        <Col lg={4} className="position-relative">
                                            <img src={
                                                editScreenName === "avatar" && selectedTheme === "1" ? theme1avatar :
                                                    editScreenName === "avatar" && selectedTheme === "2" ? theme2avatar :
                                                        editScreenName === "weapon" && selectedTheme === "1" ? theme1weapon :
                                                            editScreenName === "weapon" && selectedTheme === "2" ? theme2weapon :
                                                                editScreenName === "shield" && selectedTheme === "1" ? theme1shield :
                                                                    editScreenName === "shield" && selectedTheme === "2" ? theme2shield :
                                                                        editScreenName === "armor" && selectedTheme === "1" ? theme1armor :
                                                                            editScreenName === "armor" && selectedTheme === "2" && theme2armor
                                            } alt="" width="100%" height="450px" className="rounded-4"/>
                                        </Col>
                                        <Col lg={8}>
                                            <div>
                                                <FormGroup className="d-flex align-items-center">
                                                    <Row className="w-100">
                                                        <Col lg={3}
                                                             className="d-flex align-items-center justify-content-lg-end">
                                                            <label htmlFor="title"
                                                                   className=" textColor ">Title</label>
                                                        </Col>
                                                        <Col lg={7}>
                                                            <FormInput
                                                                className="plainInput  w-100 "
                                                                disabled={loading === "pending"}
                                                                type="text"
                                                                maxLength={15}
                                                                value={editScreen.titleName}
                                                                required
                                                                onChange={(e) => {
                                                                    setEditScreen({
                                                                        ...editScreen,
                                                                        titleName: e.target.value
                                                                    })
                                                                }}
                                                                id="title"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                <FormGroup className="d-flex align-items-center">
                                                    <Row className="w-100">
                                                        <Col lg={3}
                                                             className="d-flex align-items-center justify-content-lg-end">
                                                            <label htmlFor="titleDesc"
                                                                   className=" textColor ">Description</label>
                                                        </Col>
                                                        <Col lg={7}>
                                                            <FormInput
                                                                className="plainInput  w-100 "
                                                                disabled={loading === "pending"}
                                                                maxLength={30}
                                                                type="text"
                                                                required
                                                                value={editScreen.titleDesc}
                                                                onChange={(e) => {
                                                                    setEditScreen({
                                                                        ...editScreen,
                                                                        titleDesc: e.target.value
                                                                    })
                                                                }}
                                                                id="titleDesc"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </FormGroup>
                                                {editScreen[editScreenName] && editScreen[editScreenName].map((option, i) => (
                                                    <>
                                                        <FormGroup className="d-flex align-items-center">
                                                            <Row className="w-100">
                                                                <Col lg={3}
                                                                     className="d-flex align-items-center justify-content-lg-end">
                                                                    <label htmlFor="title"
                                                                           className=" textColor ">
                                                                        {
                                                                            editScreenName === "avatar" && i === 0 ? "Male" :
                                                                                editScreenName === "avatar" && i === 1 ? "Robot" :
                                                                                    editScreenName === "avatar" && i === 2 ? "Female" :
                                                                                        `Option ${i + 1} Title`
                                                                        }
                                                                    </label>
                                                                </Col>
                                                                <Col lg={7}>
                                                                    <FormInput
                                                                        className="plainInput  w-100 "
                                                                        disabled={loading === "pending"}
                                                                        maxLength={15}
                                                                        type="text"
                                                                        required
                                                                        value={option.name}
                                                                        onChange={(e) => {
                                                                            let newFormValues = editScreen[editScreenName];
                                                                            newFormValues[i].name = e.target.value;
                                                                            
                                                                            setEditScreen({
                                                                                ...editScreen,
                                                                                [editScreenName]: newFormValues
                                                                            });
                                                                        }}
                                                                        // id="title"
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                        {editScreenName !== "avatar" &&
                                                        <FormGroup className="d-flex align-items-center">
                                                            <Row className="w-100">
                                                                <Col lg={3}
                                                                     className="d-flex align-items-center justify-content-lg-end">
                                                                    <label
                                                                        className=" textColor ">Option {i + 1} Desc</label>
                                                                </Col>
                                                                <Col lg={7}>
                                                                    <FormInput
                                                                        className="plainInput  w-100 "
                                                                        disabled={loading === "pending"}
                                                                        maxLength={30}
                                                                        type="text"
                                                                        value={option.desc}
                                                                        required
                                                                        onChange={(e) => {
                                                                            let newFormValues = editScreen[editScreenName];
                                                                            newFormValues[i].desc = e.target.value;
                                                                            
                                                                            setEditScreen({
                                                                                ...editScreen,
                                                                                [editScreenName]: newFormValues
                                                                            });
                                                                        }}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </FormGroup>
                                                        }
                                                        {selectedTheme === "3" && editScreenName !== "avatar" && (
                                                            <FormGroup className="d-flex align-items-center">
                                                                <Row className="w-100">
                                                                    <Col lg={4}
                                                                         className="d-flex align-items-center justify-content-lg-end">
                                                                        <label
                                                                            className=" textColor ">Option {i + 1} Image</label>
                                                                    </Col>
                                                                    <Col lg={8}>
                                                                        <label
                                                                            className="logoInput d-flex justify-content-between w-100"
                                                                            role="button">
                                                                                    <span
                                                                                        className={`m-2  ${!editScreen[editScreenName][i].imageUrl && 'text-muted'}`}>
                                                                                    {editScreen[editScreenName][i].imageUrl ? "" : "Upload"}
                                                                                    </span>
                                                                            <img
                                                                                src={editScreen[editScreenName][i].imageUrl ? editScreen[editScreenName][i].imageUrl : imageIcon}
                                                                                alt="" height={20}
                                                                                className="m-2"/>
                                                                            <input
                                                                                disabled={loading === "pending"}
                                                                                accept="image/png,  image/jpeg"
                                                                                className="imageInput  "
                                                                                type="file"
                                                                                id="formFile"
                                                                                onChange={(e) => {
                                                                                    let newFormValues = editScreen[editScreenName];
                                                                                    
                                                                                    
                                                                                    
                                                                                    newFormValues[i].image = e.target.files[0];
                                                                                    newFormValues[i].imageUrl = URL.createObjectURL(e.target.files[0]);
                                                                                    setEditScreen({
                                                                                        ...editScreen,
                                                                                        [editScreenName]: newFormValues
                                                                                    });
                                                                                }}
                                                                                name="uploadFile"
                                                                            />
                                                                        </label>
                                                                    </Col>
                                                                </Row>
                                                            </FormGroup>
                                                        )}
                                                    </>
                                                ))}
                                            </div>
                                            <div
                                                className="d-flex justify-content-end position-absolute bottom-0 end-0 me-4 mb-2">
                                                <div className="mx-2">
                                                    <Button className="deleteBtn   my-2"
                                                            onClick={toggle}>
                                                        Cancel
                                                    </Button>
                                                </div>
                                                <div className="">
                                                    <Button className="editBtn   my-2" type="submit"
                                                            disabled={loading === "pending"}>
                                                        {loading === "pending" ? (
                                                            <div className="spinner-border spinner-border-sm"
                                                                 role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                        ) : (
                                                            "Save"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </ModalBody>
                        </Modal>
                    </Container>
                </div>
            }
        </>
    );
};

export default AvatarSelection;
