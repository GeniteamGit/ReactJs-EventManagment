import React, {useEffect, useState} from "react";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, FormInput, FormRadio, Row,} from "shards-react";
import {NotificationManager,} from "react-notifications";
import {db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {v4 as uuidv4} from "uuid";
import {addDoc, collection, getDocs, orderBy, query, serverTimestamp, where,} from "firebase/firestore";
import {useHistory, useParams} from "react-router-dom";
import CropImage from "../components/re-usable/cropImage";
import imageIcon from "../images/newUI/icons/image1.png";
import theme2question from "../images/newUI/screen-images/theme2question.png";

export default function AddQuestions() {
    const [questions, setQuestions] = useState([]);
    const [imageUrls, setImageUrls] = useState(null);
    const [videoUrls, setVideoUrls] = useState(null);
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
    const [imageError, setImageError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const history = useHistory();
    const {eid} = useParams();
    useEffect(() => {
        const fetch = async () => {
            try {
                const a = await tempFunc();
                setQuestions(a);
                
            } catch (err) {
                
            }
        };
        fetch();
    }, []);

    async function tempFunc() {
        const questionsRef = collection(db, "questions");
        const q = query(
            questionsRef,
            where("eventID", "==", eid),
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
    }

    const addQuestion = async (e) => {
        e.preventDefault();
        try {
            setLoading("pending");
            const data = await addUrls();
            
            

            await addDoc(collection(db, "questions"), {
                imgURL: type === "image" ? data : null,
                eventID: eid,
                options: {
                    ["1"]: option1,
                    ["2"]: option2,
                    ["3"]: option3,
                    ["4"]: option4,
                },
                question: question,
                timer: parseInt(timer),
                sequence: questions.length + 1,
                timestamp: serverTimestamp(),
                videoURL: type === "video" ? data : null,
            });
            
            
            
            history.push(`/dragablequestions/${eid}`);
            setLoading(null);
            NotificationManager.success("Question Added Successfully");
        } catch (e) {
            
            NotificationManager.error("Question Not Added");
        }
    };
    const addUrls = async () => {
        if (image !== null) {
            const file = await urltoFile(image, `${uuidv4()}.png`, 'image/png');
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
        <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
            <Container>
                <Form onSubmit={addQuestion}>
                    <Row className="">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4>Add New Questions</h4>
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
                        {/*<CardHeader>Add Questions</CardHeader>*/}
                        <CardBody className="pt-3">
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
                                                    <label htmlFor="#options" className="textColor mb-1">Image</label>
                                                    <div>
                                                        <label className="imageInput" role="button">
                                                            <img
                                                                src={imageUrl ? imageUrl : imageIcon}
                                                                alt="" height={60}
                                                                width={100} className=""/>
                                                            <CropImage aspectRatio={1.666667} setLocal={setImageUrl}
                                                                       setError={setImageError}
                                                                       imageLocation="right"
                                                                       stateSetImage={setImage}/>
                                                        </label>
                                                        {imageError ?
                                                            <p className="mb-0 text-danger fw-light">Please Select Image
                                                                less
                                                                than 1 mb</p> :
                                                            <p className="mt-1">(Image should be 10 : 6)</p>}
                                                    </div>
                                                </FormGroup>
                                            </Col>
                                        )}
                                        {type === "video" && (
                                            <Col lg={12}>
                                                <FormGroup>
                                                    <label htmlFor="#options" className="textColor  ">Video</label>
                                                    <FormInput
                                                        //size="lg"
                                                        className="w-25"
                                                        disabled={loading === "pending"}
                                                        type="file"
                                                        required={type === "video"}
                                                        accept="video/mp4,video/x-m4v,video/*"
                                                        onChange={(e) => {
                                                            setVideo(e.target.files[0]);
                                                        }}
                                                    />
                                                    <p className="mt-1">(Video should be 1000px x 500px or 10 : 6)</p>
                                                </FormGroup>
                                            </Col>
                                        )}
                                        <Col lg={10}>
                                            <FormGroup>
                                                <label htmlFor="#question" className="textColor  ">Question</label>
                                                <FormInput
                                                    className=""
                                                    //size="lg"
                                                    maxlength="200"
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
                                                    disabled={loading === "pending"}
                                                    //size="lg"
                                                    min="1"
                                                    max="3600"
                                                    required
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
                                                <label htmlFor="#options" className="textColor  ">Option A</label>
                                                <FormInput
                                                    //size="lg"
                                                    maxlength="38"
                                                    disabled={loading === "pending"}
                                                    required
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
                                                <label htmlFor="#options" className="textColor  ">Option B</label>
                                                <FormInput
                                                    //size="lg"
                                                    maxlength="38"
                                                    disabled={loading === "pending"}
                                                    required
                                                    onChange={(e) => {
                                                        setOption2(e.target.value);
                                                    }}
                                                    value={option2}
                                                    type="text"
                                                    placeholder="Option B"
                                                />
                                            </FormGroup>
                                        </Col>

                                        {/*<Col lg={4}>*/}
                                        {/*</Col>*/}
                                    </Row>
                                    <Row>
                                        <Col lg={6}>
                                            <FormGroup>
                                                <label htmlFor="#options" className="textColor  ">Option C</label>
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
                                                <label htmlFor="#options" className="textColor  ">Option D</label>
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
                                    {/*<div className="d-flex justify-content-end">*/}
                                    {/*    <div>*/}
                                    {/*        <Button*/}
                                    {/*            className="editBtn fw-bold "*/}
                                    {/*            disabled={loading === "pending"}*/}
                                    {/*            type="submit"*/}
                                    {/*            style={{width: "150px"}}*/}
                                    {/*        >*/}
                                    {/*            {loading === "pending" ? (*/}
                                    {/*                <div className="spinner-border spinner-border-sm" role="status">*/}
                                    {/*                    <span className="sr-only">Loading...</span>*/}
                                    {/*                </div>*/}
                                    {/*            ) : (*/}
                                    {/*                "Add"*/}
                                    {/*            )}*/}
                                    {/*        </Button>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </Col>
                                <Col lg={4} className="text-center">
                                    <img alt="" height={450} style={{borderRadius: "20px"}}
                                         src={theme2question}/>
                                </Col>
                            </Row>
                            {/*<p>Options:</p>*/}
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
        </div>
    );
}
