import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, FormInput, FormRadio, Row,} from "shards-react";
import {db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuidv4} from "uuid";
import {NotificationManager} from "react-notifications";

import {collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc, where,} from "firebase/firestore";
import {useHistory, useParams} from "react-router-dom";
import imageIcon from "../images/newUI/icons/image1.png";
import CropImage from "../components/re-usable/cropImage";
import theme2question from "../images/newUI/screen-images/theme2question.png";

export default function EditQuestions() {
    const {id} = useParams();
    const [imageUrls, setImageUrls] = useState("");
    const [videoUrls, setVideoUrls] = useState("");
    const [type, setType] = useState("text");
    const [question, setQuestion] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [timer, setTimer] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(null);
    const [viewImage, setViewImage] = useState("");
    const [viewVideo, setViewVideo] = useState("");
    const [imageError, setImageError] = useState(null);
    const history = useHistory();
    const {eid} = useParams();

    useEffect(() => {
        const fetch = async () => {
            const data = await getScreens();
            
            const quesdata = data.find((e) => {
                return e.id === id;
            });
            setQuestion(quesdata.question);
            setOption1(quesdata.options["1"]);
            setOption2(quesdata.options["2"]);
            setOption3(quesdata.options["3"]);
            setOption4(quesdata.options["4"]);
            setTimer(quesdata.timer);

            // setViewImage(quesdata.imgURL);

            if (quesdata.imgURL !== null) {
                setType("image");
                // setImage(quesdata.imgURL);
                setViewImage(quesdata.imgURL);
            } else if (quesdata.videoURL !== null) {
                setType("video");
                setVideo(quesdata.videoURL);
            }
            setLoading("ready");
        };
        fetch();
    }, []);

    const getScreens = async () => {
        const questionsRef = collection(db, "questions");
        const q = query(
            questionsRef,
            where("eventID", "==", localStorage.getItem("eventId")),
            orderBy("sequence", "asc")
        );
        
        const screens = await getDocs(q);
        let dataarr = [];
        screens.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        return dataarr;
    };
    const addQuestion = async (e) => {
        e.preventDefault();
        try {
            setLoading("pending");
            const data = await addUrls();
            
            const docREf = doc(db, "questions", id);
            // if (
            //     (typeof image !== "object" &&
            //         video === null &&
            //         typeof image == "string") ||
            //     (typeof video !== "object" &&
            //         image === null &&
            //         typeof video == "string")
            // ) {
            //     
            //     
            //     await updateDoc(docREf, {
            //         imgURL: null,
            //         options: {
            //             ["1"]: option1,
            //             ["2"]: option2,
            //             ["3"]: option3,
            //             ["4"]: option4,
            //         },
            //         question: question,
            //         timer: timer,
            //         videoURL: null,
            //         timestamp: serverTimestamp(),
            //     });
            // } else
            if (type === "text") {
                
                await updateDoc(docREf, {
                    imgURL: null,
                    options: {
                        ["1"]: option1,
                        ["2"]: option2,
                        ["3"]: option3,
                        ["4"]: option4,
                    },
                    videoURL: null,
                    question: question,
                    timer: timer,
                    timestamp: serverTimestamp(),
                });
            } else {
                
                await updateDoc(docREf, {
                    imgURL: type === "image" ? data : null,
                    options: {
                        ["1"]: option1,
                        ["2"]: option2,
                        ["3"]: option3,
                        ["4"]: option4,
                    },
                    question: question,
                    timer: timer,
                    timestamp: serverTimestamp(),
                    videoURL: type === "video" ? data : null,
                });
            }
            
            
            
            NotificationManager.success("Question Updated Successfully");
            history.push(`/dragablequestions/${localStorage.getItem("eventId")}`);
            setLoading(null);
        } catch (e) {
            
            NotificationManager.error("Question Not Updated");
        }
    };

    const addUrls = async () => {
        if (image !== null) {
            const file = await urltoFile(image, `${uuidv4()}.png`, 'image/png');
            
            setImage(file);
            const imageRef = ref(storage, `${uuidv4()}`);
            const data = await uploadBytes(imageRef, file);
            const downloadUrl = await getDownloadURL(data.ref);
            return downloadUrl;
        } else if (video !== null) {
            const videoRef = ref(storage, `${video.name + uuidv4()}`);
            const videoUpload = await uploadBytes(videoRef, video);
            const videoDownload = await getDownloadURL(videoUpload.ref);
            return videoDownload;
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
            {loading === null ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                    <Container>
                        <Form onSubmit={addQuestion}>
                            <Row className="">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4>Edit Questions</h4>
                                    <div className="d-flex w-25 justify-content-end">
                                        <div className="mx-2">
                                            <Button className="warningBtn   my-2" onClick={() => {
                                                history.goBack();
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
                            </Row>
                            <Card>
                                <CardBody>
                                    <Row className="my-2">
                                        <Col>
                                            <label className="textColor  ">Type</label>
                                        </Col>
                                        <Col>
                                            <FormRadio
                                                name="type"
                                                disabled={loading === "pending"}
                                                value={type}
                                                checked={type === "text"}
                                                onChange={() => {
                                                    setType("text");
                                                }}
                                            >
                                                <span className="mx-2">Text</span>
                                            </FormRadio>
                                        </Col>
                                        <Col>
                                            <FormRadio
                                                name="type"
                                                value={type}
                                                disabled={loading === "pending"}
                                                checked={type === "image"}
                                                onChange={() => {
                                                    setType("image");
                                                }}
                                            >
                                                <span className="mx-2">Image</span>
                                            </FormRadio>
                                        </Col>
                                        <Col>
                                            <FormRadio
                                                name="type"
                                                checked={type === "video"}
                                                disabled={loading === "pending"}
                                                value={type}
                                                onChange={() => {
                                                    setType("video");
                                                }}
                                            >
                                                <span className="mx-2">Video</span>
                                            </FormRadio>
                                        </Col>
                                    </Row>
                                    <hr className="mt-0" style={{border: "1px solid"}}/>
                                    <Row>
                                        <Col lg={8}>
                                            <Row>
                                                {type === "image" && (
                                                    <Col lg={12}>
                                                        <FormGroup>
                                                            <label htmlFor="#options"
                                                                   className="textColor mb-1">Image:</label>
                                                            <div>
                                                                <label className="imageInput">
                                                                    <img
                                                                        src={viewImage ? viewImage : imageIcon}
                                                                        alt="" height={60}
                                                                        width={100} className=""/>
                                                                    <CropImage aspectRatio={1.666667}
                                                                               setLocal={setViewImage}
                                                                               setError={setImageError}
                                                                               imageLocation="right"
                                                                               stateSetImage={setImage}/>
                                                                </label>
                                                                {imageError ?
                                                                    <p className="mb-0 text-danger fw-light">Please
                                                                        Select Image
                                                                        less
                                                                        than 1 mb</p> :
                                                                    <p className="mt-1">(Image should be 10 : 6)</p>}
                                                            </div>
                                                        </FormGroup>
                                                    </Col>
                                                )}
                                                {type === "video" && (
                                                    <Col lg={12}>
                                                        <div className="d-flex">
                                                            <div className="me-5">
                                                                <label htmlFor="formFile"
                                                                       className="form-label textColor  ">
                                                                    Video
                                                                    <div className=" border-file">Choose a video</div>
                                                                </label>
                                                                <input
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    className="form-control"
                                                                    type="file"
                                                                    id="formFile"
                                                                    onChange={(e) => {
                                                                        setVideo(e.target.files[0]);
                                                                        setViewVideo(URL.createObjectURL(e.target.files[0]));
                                                                        setViewImage(null);
                                                                        setImage(null);
                                                                    }}
                                                                    name="upload file"
                                                                />
                                                                <p className="mt-1">(Video should be 1000px x 500px or
                                                                    10 : 6)</p>
                                                                <span id="videoName"/>
                                                            </div>
                                                            <div>
                                                                {typeof video !== "object" ? (
                                                                    <video
                                                                        src={video}
                                                                        width="100"
                                                                        type="video/mp4"
                                                                        height="100"
                                                                    />
                                                                ) : (
                                                                    viewVideo &&
                                                                    <video
                                                                        src={viewVideo}
                                                                        width="100"
                                                                        type="video/mp4"
                                                                        height="100"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )}
                                                <Col lg={10}>
                                                    <FormGroup>
                                                        <label htmlFor="#question"
                                                               className="textColor  ">Question</label>
                                                        <FormInput
                                                            className=""
                                                            //size="lg"
                                                            maxlength="130"
                                                            disabled={loading === "pending"}
                                                            type="text"
                                                            value={question}
                                                            onChange={(e) => {
                                                                setQuestion(e.target.value);
                                                            }}
                                                            id="#question"
                                                            placeholder="Question"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={2}>
                                                    <FormGroup>
                                                        <label htmlFor="#options" className="textColor  ">Timer</label>
                                                        <FormInput
                                                            //size="lg"
                                                            // style={{width: "290px"}}
                                                            min="1"
                                                            max="3600"
                                                            required
                                                            disabled={loading === "pending"}
                                                            type="number"
                                                            value={timer}
                                                            onChange={(e) => {
                                                                setTimer(e.target.value);
                                                            }}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6}>
                                                    <FormGroup>
                                                        <label htmlFor="#options" className="textColor  ">Option
                                                            A</label>
                                                        <FormInput
                                                            //size="lg"
                                                            disabled={loading === "pending"}
                                                            required
                                                            maxlength="38"
                                                            onChange={(e) => {
                                                                setOption1(e.target.value);
                                                            }}
                                                            value={option1}
                                                            type="text"
                                                            placeholder="Option A"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={6}>
                                                    <FormGroup>
                                                        <label htmlFor="#options" className="textColor  ">Option
                                                            B</label>
                                                        <FormInput
                                                            //size="lg"
                                                            required
                                                            disabled={loading === "pending"}
                                                            maxlength="38"
                                                            onChange={(e) => {
                                                                setOption2(e.target.value);
                                                            }}
                                                            value={option2}
                                                            type="text"
                                                            placeholder="Option B"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={6}>
                                                    <FormGroup>
                                                        <label htmlFor="#options" className="textColor  ">Option
                                                            C</label>
                                                        <FormInput
                                                            //size="lg"
                                                            maxlength="38"
                                                            disabled={loading === "pending"}
                                                            required
                                                            onChange={(e) => {
                                                                setOption3(e.target.value);
                                                            }}
                                                            value={option3}
                                                            type="text"
                                                            placeholder="Option C"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg={6}>
                                                    <FormGroup>
                                                        <label htmlFor="#options" className="textColor  ">Option
                                                            D</label>
                                                        <FormInput
                                                            //size="lg"
                                                            maxlength="38"
                                                            disabled={loading === "pending"}
                                                            required
                                                            onChange={(e) => {
                                                                setOption4(e.target.value);
                                                            }}
                                                            value={option4}
                                                            type="text"
                                                            placeholder="Option D"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4} className="text-center">
                                            <img alt="" height={450} style={{borderRadius: "20px"}}
                                                 src={theme2question}/>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <div className="d-flex justify-content-end mt-2">
                                <div className="mx-2">
                                    <Button className="warningBtn   my-2" onClick={() => {
                                        history.goBack();
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
                    </Container>
                </div>}
        </>
    );
}
