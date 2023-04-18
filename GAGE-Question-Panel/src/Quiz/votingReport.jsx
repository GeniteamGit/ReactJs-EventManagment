import React, {useEffect, useState} from 'react';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {useParams} from "react-router-dom";
import {Card, CardBody, CardHeader, Col, Container, Progress, Row} from "reactstrap";
import Navbar from "./Navbar";

const VotingReport = ({theme}) => {
    const [ideas, setIdeas] = useState({});
    const [usersCount, setUsersCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [title, setTile] = useState("");
    const {eid} = useParams();

    useEffect(() => {
        loadIdeasDocument().then(result => {
           
            setIdeas(result);
        });
        loadUsers().then(result => {
           
            setUsersCount(result.length);
            setLoading(false);
        });
        loadDetails().then(result => {
           
            setTile(result.titleName);
        })
    }, []);
    useEffect(() => {
       
    }, [ideas]);

    const loadUsers = async () => {
        const docRef = collection(db, "users");
        const usersQuery = query(docRef, where("eventID", "==", eid));
        const userResponse = await getDocs(usersQuery);
        return userResponse.docs.map((doc) => ({...doc.data()}));
    }

    const loadIdeasDocument = async () => {
        const docRef = doc(db, "ideas", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().ideas;
        }
    }
    const loadDetails = async () => {
       
        const docRef = doc(db, "details", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().surveyScreen;
        }
    }
    return (
        <>
            {loading ? (
                    <div
                        style={{height: "100vh"}}
                        className="d-flex align-items-center justify-content-center "
                    >
                        <h2 style={{color: "white"}}>Loading...</h2>
                    </div>
                ) :
                <>
                    <Navbar eid={eid}/>
                    <div style={{marginRight: "100px", marginLeft: "100px", marginTop: "5%"}}>
                        <Row>
                            <Col>
                                {theme === "1" ?
                                    (<Card small="true" className="mb-4">
                                        <CardHeader className="border-bottom d-flex justify-content-between">
                                            <h4 className="m-0">{title} Report</h4>
                                        </CardHeader>
                                        <CardBody className="p-0 pb-3">
                                            <Container>
                                                {ideas ? Object.keys(ideas).sort((a, b) => ideas[b].voteCount - ideas[a].voteCount).map(idea => (
                                                    <div className="p-2 px-5" key={idea}>
                                                        <div>{ideas[idea].description}</div>
                                                        <Progress value={ideas[idea].voteCount}
                                                                  max={usersCount <= 50 ? 50 : usersCount <= 100 ? 100 : usersCount <= 150 ? 150 : usersCount <= 200 && 200}
                                                                  className="bg-secondary">{ideas[idea].voteCount}</Progress>
                                                    </div>
                                                )) : <h4 className="text-center my-5">No records to display</h4>}
                                            </Container>
                                        </CardBody>
                                    </Card>) :
                                    (
                                        <>
                                            <Container>
                                                <h4 className="text-white">{title} Report</h4>
                                                {ideas ? Object.keys(ideas).sort((a, b) => ideas[b].voteCount - ideas[a].voteCount).map(idea => (
                                                    <div className="p-2" key={idea}>
                                                        <div className="text-white">{ideas[idea].description}</div>
                                                        <Progress value={ideas[idea].voteCount}
                                                                  max={usersCount <= 50 ? 50 : usersCount <= 100 ? 100 : usersCount <= 150 ? 150 : usersCount <= 200 && 200}
                                                                  className="bg-transparent">{ideas[idea].voteCount}</Progress>
                                                    </div>
                                                )) : <h4 className="text-center text-white my-5">No records to
                                                    display</h4>}
                                            </Container>
                                        </>
                                    )
                                }
                            </Col>
                        </Row>
                    </div>
                </>
            }
        </>
    );
};

export default VotingReport;