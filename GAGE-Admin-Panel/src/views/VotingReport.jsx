import React, {useEffect, useState} from 'react';
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {useParams} from "react-router-dom";
import {Card, CardBody, Col, Container, Progress, Row} from "shards-react";

const VotingReport = () => {
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
            setLoading(false)
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
        <div>
            {loading ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                    <h4 className="m-0">{title} Report</h4>
                    <Row>
                        <Col>
                            <Card small className="mt-3">
                                <CardBody className="p-0 pb-3">
                                    <Container>
                                        {ideas ? Object.keys(ideas).sort((a, b) => ideas[b].voteCount - ideas[a].voteCount).map(idea => (
                                            <div className="p-2 px-5">
                                                <div>{ideas[idea].description}</div>
                                                <Progress value={ideas[idea].voteCount} striped={true}
                                                          max={usersCount <= 50 ? 50 : usersCount <= 100 ? 100 : usersCount <= 150 ? 150 : usersCount <= 200 && 200}
                                                          className="bg-secondary">{ideas[idea].voteCount}</Progress>
                                            </div>
                                        )) : <h4 className="text-center my-3">No records to display</h4>}
                                    </Container>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    );
};

export default VotingReport;