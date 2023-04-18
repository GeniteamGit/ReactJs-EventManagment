import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {Button, Col, Row,} from "shards-react";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Link} from "react-router-dom";
import {collection, getDocs, query,} from "firebase/firestore";
import {db} from "../firebase";
import deletIcon from "../images/newUI/icons/delete.png";
import editIcon from "../images/newUI/icons/edit.png";

const Avatar = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
`;

const CardHeader = styled.div`
  font-weight: 500;
  text-align: start;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;

const CardFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DragItem = styled.div`
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background: white;
  margin: 0 0 8px 0;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
`;

// const lorem = new LoremIpsum();
const updateSequence = async () => {
    const q = query(collection(db, "questions"));
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((element) => 
};

const ListItem = ({item, provided, snapshot, index, deleteQuestion}) => {
    const randomHeader = useMemo(() => "1212", []);
    const [deleteModal, setDeleteModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewItem, setViewItem] = useState(null);
    const [loader, setLoader] = useState(null);
    useEffect(() => {
        
    }, [viewItem]);

    const deleted = async (id) => {
        setLoader(null);
        deleteQuestion(id);
        setLoader("pending");
    };

    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal);
    };

    const toggleViewModal = () => {
        setViewModal(!viewModal);
    }

    return (
        <>
            <DragItem
                ref={provided.innerRef}
                snapshot={snapshot}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                <Row>
                    <Col lg={7}>
                        <div>
                            <span className="textColor fw-bold">{index + 1 + "-"}</span> <span
                            className="mb-0 textColor fw-bold" style={{wordBreak: "break-all"}}>{item.question}</span>
                        </div>
                        <div className="mt-2">
                            <p className="mb-0">{"A" + "- " + item.options[1]}</p>
                            <p className="mb-0"> {"B" + "- " + item.options[2]}</p>
                            <p className="mb-0">{"C" + "- " + item.options[3]}</p>
                            <p className="mb-0">{"D" + "- " + item.options[4]}</p>
                        </div>
                    </Col>
                    <Col lg={3} className="text-center">
                        <div>
                            <label className="textColor">Timer:</label><span> {item.timer}s</span>
                        </div>
                        <div style={{height: "100px"}} className="pt-2" onClick={() => {
                            
                            setViewItem(item.imgURL !== null ? item.imgURL : item.videoURL !== null ? item.videoURL : "");
                            setTimeout(() => {
                                setLoader("ready");
                            }, 2000)
                            toggleViewModal();
                        }}>
                            {item.imgURL !== null ?
                                <img src={item.imgURL} alt="" width="100"/> : item.videoURL !== null ?
                                    <video src={item.videoURL} width="100"/> : ""}
                        </div>
                    </Col>
                    <Col lg={2} className="d-flex align-items-center justify-content-end">
                        {/*<div className="text-end">*/}
                        {/*    <span style={{color: "green"}}>*/}
                        {/*        {item.imgURL !== null*/}
                        {/*            ? "Image"*/}
                        {/*            : item.videoURL !== null*/}
                        {/*                ? "Video"*/}
                        {/*                : "Text"}*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                        <div>
                            <Button
                                style={{}}
                                className="deleteBtn me-1"
                                onClick={toggleDeleteModal}
                            >
                                <img src={deletIcon} alt="" height={15}/>
                                {/*<i className="fas fa-trash"/>*/}
                            </Button>
                            <Link to={`/editQuestions/${item.id}`}>
                                <Button className="editBtn" type="submit">
                                    <img src={editIcon} alt="" height={15}/>
                                    {/*<i className="fas fa-pencil-alt"/>*/}
                                </Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </DragItem>

            <Modal isOpen={viewModal} toggle={toggleViewModal}>
                <ModalBody className="pb-3">
                    {/*{loader === null ? (*/}
                    {/*        <div className="text-center w-100 py-5 my-5">*/}
                    {/*            <div className="spinner-border spinner-border-lg" role="status">*/}
                    {/*                <span className="sr-only">Loading...</span>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    ) :*/}
                    <div>
                        {item.imgURL !== null ?
                            <img src={item.imgURL} alt="" width="440"/> : item.videoURL !== null ?
                                <video src={item.videoURL} width="440" type="video/mp4"
                                       controls/> : ""}
                    </div>
                    {/*}*/}
                    <div className="text-end my-2">
                        <Button className="deleteBtn" onClick={toggleViewModal}>
                            Cancel
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader>
                    <h5 className=" textColor">Delete</h5>
                </ModalHeader>
                <ModalBody>
                    <div className="info text-center">
                        Are You Sure You Want To Delete?
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div>
                        <Button className="warningBtn" onClick={toggleDeleteModal}>
                            Cancel
                        </Button>
                    </div>
                    <Button
                        disabled={loader === "pending"}
                        className="deleteBtn "
                        onClick={() => deleted(item.id)}
                    >
                        {loader === "pending" ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default ListItem;
