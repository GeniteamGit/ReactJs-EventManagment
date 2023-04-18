import React, {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {CSVLink} from "react-csv";

import {Button, Card, CardBody, Col, Row,} from "shards-react";
import DataTable from "react-data-table-component";
import {useParams} from "react-router-dom";
import {Input} from "reactstrap";

export default function UserDetail(props) {
    const [users, setUsers] = useState([]);
    const [tableRowsData, setTableRowsData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchName, setSearchname] = useState("");
    const [serachIndustry, setSearchIndustry] = useState("");
    const [searchEmail, setSearchemail] = useState("");
    const [searchTable, setSearchTable] = useState("");
    const [searchCompany, setSearchCompany] = useState("");
    const [randomData, setRandomData] = useState([]);
    const [CsvDownload, setCsvDownload] = useState([]);
    const [signUpFields, setSignUpFields] = useState([]);
    const [tableNumber, setTableNumber] = useState(props.eventData.teamType === "grouped" ? props.eventData.teamLabel : "");
    const {eid} = useParams();

    useEffect(() => {
        
    }, [tableNumber])
    useEffect(() => {
        
        
        loadSignUpFields().then(fields => {
            let _fields = fields.map(_item => _item.enabled && _item.title)
            
            if (props.eventData.teamType === "grouped") {
                
                const teamLabel = props.eventData.teamLabel;
                setTableNumber(teamLabel);
                _fields = [..._fields, teamLabel];
            }
            
            setSignUpFields(_fields);
            loadUsers().then(users => {
                
                setUsers(users);
                setTableRowsData(users);
                setRandomData(users);
                const csv = users.map((e) => {
                    
                    let localCsv = {};
                    _fields.forEach((_field) => {
                        
                        
                        
                        if (_field === tableNumber) {
                            
                            localCsv = {...localCsv, [_field]: e['tblNumber']}
                            
                        } else {
                            localCsv = {...localCsv, [_field]: e[_field]}
                        }
                    })
                    
                    return localCsv;
                });
                
                setCsvDownload(csv);
                setLoader(false);
            });
        })
    }, []);

    const loadUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(
            usersRef,
            where("eventID", "==", eid)
        );
        const usersData = await getDocs(q);
        const w = usersData.docs.map((doc) => ({...doc.data()}));
        
        return w
    }
    const loadSignUpFields = async () => {
        const docRef = doc(db, "sign-upScreens", eid);
        const docSnap = await getDoc(docRef);
        return docSnap.data().screens
    }

    const fields = signUpFields.map((_field) => {
        // 
        return {
            name: (
                <div>
                    <label className="textColor">{_field}</label>
                </div>
            ),
            selector: (row) => props.eventData.teamType === "grouped" && _field === tableNumber ? row['tblNumber'] : row[_field],
        }
    });

    useEffect(() => {
        if (
            searchName ||
            searchEmail ||
            searchTable ||
            searchCompany ||
            serachIndustry
        ) {
            let data = randomData;
            
            if (searchName) {
                data = data.filter((item) => {
                    if (item.Name) {
                        if (
                            item.Name
                                .toString()
                                .toLowerCase()
                                .includes(searchName.toLowerCase())
                        ) {
                            return item;
                        }
                    }
                });
                
            }
            if (searchEmail) {
                data = data.filter((item) => {
                    if (
                        item.email
                            .toString()
                            .toLowerCase()
                            .includes(searchEmail.toLowerCase())
                    ) {
                        return item;
                    }
                });
            }
            if (searchTable) {
                
                data = data.filter((item) => {
                    if (item.tblNumber) {
                        if (
                            item.tblNumber
                                .toString()
                                .toLowerCase()
                                .includes(searchTable.toLowerCase())
                        ) {
                            return item;
                        }
                    }
                });
            }
            if (serachIndustry && serachIndustry !== "Select") {
                data = data.filter((item) => {
                    if (item.industry) {
                        if (
                            item.industry
                                .toString()
                                .toLowerCase()
                                .includes(serachIndustry.toLowerCase())
                        ) {
                            return item;
                        }
                    }
                });
                
            }
            if (searchCompany) {
                data = data.filter((item) => {
                    if (item.company) {
                        if (
                            item.company
                                .toString()
                                .toLowerCase()
                                .includes(searchCompany.toLowerCase())
                        ) {
                            return item;
                        }
                    }
                });
                
            }
            setTableRowsData(data);
            setUsers(data);
            
                searchName,
                searchEmail,
                searchTable,
                searchCompany,
                serachIndustry
            );
        } else {
            setUsers(randomData);
        }
    }, [searchName, searchEmail, searchTable, searchCompany, serachIndustry]);

    function clear() {
        setSearchname("");
        setSearchemail("");
        setSearchTable("");
        setSearchCompany("");
        setSearchIndustry("");
        
    }

    return (
        <>
            {loader ? (
                    <div className="text-center w-100 py-5 my-5">
                        <div className="spinner-border spinner-border-lg" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) :
                <>
                    <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                        <h4 className="m-0">Users</h4>
                        <Row>
                            <Col>
                                <div className="d-flex justify-content-end my-3">
                                    <Input
                                        type="text"
                                        onChange={(e) => {
                                            setSearchname(e.target.value);
                                        }}
                                        value={searchName}
                                        placeholder="Search User By Name"
                                        className="plainInput w-25 me-1"
                                    />
                                    <Button onClick={clear} className="deleteBtn">Clear All</Button>
                                </div>
                                <Card small className="mb-4">
                                    <div className="d-flex justify-content-end">
                                        <CSVLink filename="User CSV" className="text-end" data={CsvDownload}>
                                            <Button className="editBtn mt-3 me-3">Download CSV</Button>
                                        </CSVLink>
                                    </div>
                                    <CardBody className="p-0 pb-3">
                                        <DataTable
                                            columns={fields}
                                            data={users}
                                            pagination
                                            progressPending={loader}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </>
            }
        </>
    );
}
