import React, {useEffect, useState} from 'react';
import {Button, Col, Form, FormGroup, FormInput, FormSelect, Row, Tooltip,} from "shards-react";
import {Input, Modal, ModalBody, ModalHeader,} from "reactstrap"
import moment from 'moment';
import axios from "axios";
import {NotificationManager,} from "react-notifications";
import editIcon from "../images/newUI/icons/edit.png";
import {collection, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import DataTable from "react-data-table-component";
import MainNavbar from "../components/layout/MainNavbar/MainNavbar";

const Users = () => {
    const [loader, setLoader] = useState(true);
    const [ids, setIds] = useState("");
    const [buttonLoader, setButtonLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false)
    const [minDate, setMinDate] = useState('');
    const [data, setData] = useState([]);
    const [openTooltip, setOpenTooltip] = useState(null);
    const [typeSelect, setTypeSelect] = useState("all");
    const [filterValue, setFilterValue] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(data);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
        status: "active",
        timestamp: "",
        expiryStatus: "",
        role: "admin"
    });
    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 10);
        setMinDate(currentDate);
        getUsers().then((result) => {
            
            setData(result);
            setFilteredUsers(result);
            setLoader(false);
        });
    }, []);

    // useEffect(()=>{
    //     
    //     // if(typeSelect === "active")
    //     if(typeSelect === "all") {
    //         
    //         setFilteredUsers(data);
    //     }
    //     else {
    //         
    //         setFilteredUsers(data.filter(item => item.status === typeSelect));
    //     }
    //     
    // },[typeSelect])

    useEffect(() => {
        if (typeSelect || filterValue) {
            let _users = data;
            
            if (typeSelect === "active") {
                _users = _users.filter((item) => {
                    if (item.status === typeSelect && item.timestamp > Date.now() || !item.expiryStatus) {
                        return item;
                    }
                });
                
            }
            if (typeSelect === "inactive") {
                _users = _users.filter((item) => {
                    if (item.status === typeSelect) {
                        return item;
                    }
                });
                
            }
            if (typeSelect === "expired") {
                
                _users = _users.filter((item) => {
                    if (item.timestamp < Date.now() && item.expiryStatus) {
                        return item;
                    }
                });
                
            }
            if (filterValue) {
                _users = _users.filter((item) => {
                    if (
                        item.email.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
                        item.name.toString().toLowerCase().includes(filterValue.toLowerCase())
                    ) {
                        return item;
                    }
                });
            }
            setFilteredUsers(_users);
            // setUsers(data);
        } else {
            setFilteredUsers(filteredUsers);
        }
    }, [typeSelect, data, filterValue]);


    const getUsers = async () => {
        const _themes = await getDocs(collection(db, "admins"))
        let dataarr = [];
        _themes.forEach((doc) => {
            let obj = doc.data();
            obj = {...obj, id: doc.id};
            dataarr.push(obj);
        });
        return dataarr;
    }
    const handleChange = (event) => {
        
        const {name, value} = event.target;
        setUserData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }
    const addUser = async (e) => {
        e.preventDefault();
        const valueExists = data.some((item) => item.email === userData.email);
        if (valueExists) {
            
            NotificationManager.error("User Already Exists");

            // setOpen(false);
        } else {
            
            setButtonLoader("pending")
            const url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDSfQEDKQl1uIQlgvu7qJ3LGzW6W2ZArto"
            axios.post(url, {
                "email": userData.email,
                "password": userData.password,
                "returnSecureToken": "true"
            }).then(async (response) => {
                
                try {
                    const docRef = await setDoc(doc(db, "admins", response.data.localId), {
                        name: userData.name,
                        email: userData.email,
                        role: "admin",
                        company: userData.company,
                        status: "active",
                        expiryStatus: userData.expiryStatus == "false" ? false : Boolean(userData.expiryStatus),
                        password: userData.password,
                        timestamp: moment(userData.date).valueOf(),

                    });
                    setData([...data, {
                        name: userData.name,
                        email: userData.email,
                        role: "admin",
                        status: "active",
                        expiryStatus: userData.expiryStatus == "false" ? false : Boolean(userData.expiryStatus),
                        company: userData.company,
                        password: userData.password,
                        timestamp: moment(userData.date).valueOf(),
                    }])
                    setOpen(false);
                    setButtonLoader(false)
                    setUserData({});
                    NotificationManager.success("User Added Successfully");

                    // setLoader(null);
                    // 
                } catch (e) {
                    console.error("Error adding document: ", e);
                    setButtonLoader(false)
                }
            }, (error) => {
                NotificationManager.error(error.response.data.error.message);
                
                setButtonLoader(false)
            });
        }

    }
    const updateData = async (e) => {
        e.preventDefault();
        
        try {
            setButtonLoader("pending")
            const Ref = doc(db, "admins", ids)
            await updateDoc(Ref, {
                name: userData.name,
                company: userData.company,
                status: userData.status,
                expiryStatus: userData.expiryStatus == "false" ? false : Boolean(userData.expiryStatus),
                role: "admin",
                timestamp: userData.expiryStatus == "false" ? "" : moment(userData.timestamp).valueOf()
            });

            const updatedData = data.map(e => {
                if (e.id === ids) {
                    
                    return {
                        ...e,
                        company: userData.company,
                        status: userData.status,
                        name: userData.name,
                        expiryStatus: userData.expiryStatus == "false" ? false : Boolean(userData.expiryStatus),
                        timestamp: userData.expiryStatus == "false" ? "" : moment(userData.timestamp).valueOf(),
                        role: "admin",
                    };
                }
                return e;
            });

            setData(updatedData);
            setUserData({});
            setButtonLoader(false);
            setEditOpen(false);
            NotificationManager.success("User Updated Successfully");
        } catch (e) {
            
            setEditOpen(false);
            NotificationManager.error("Something Went Wrong");
        }

    }
    const ConfirmationDelete = () => {
        let r = window.confirm("Do you want to delete this User?");
        return r === true;
    };
    const deleteUser = async (id) => {
        let confirm = ConfirmationDelete();
        if (!confirm) {
            return;
        }
        // await deleteDoc(doc(db, "admins", id));
        const users = data.filter((e) => e.id !== id);
        setData(users);
    }
    const toggle = () => {
        setUserData({
            name: "",
            email: "",
            password: "",
            status: "active",
            company: "",
            expiryStatus: "",
            timestamp: "",
            role: "admin"
        });
        setOpen(!open);
    };
    const editToggle = (row) => {
        setEditOpen(!editOpen);
        if (editOpen === false) {
            setUserData({...row, expiryStatus: row.expiryStatus.toString()})
            setIds(row.id)
        }
    }
    const handleStatus = async (row, i) => {
        tooltipToggle(i);
        setButtonLoader(row.id);
        const docRef = doc(db, "admins", row.id);
        await updateDoc(docRef, {
            status: row.status === "active" ? "inactive" : "active"
        });
        const updatedData = data.map(e => {
            if (e.id === row.id) {
                return {
                    ...e,
                    status: row.status === "active" ? "inactive" : "active"
                };
            }
            return e;
        });
        setData(updatedData);
        NotificationManager.success(`User ${row.status === "active" ? "Blocked" : "Unblocked"}`);
        setButtonLoader(false);
    }
    const tooltipToggle = (i) => {
        if (openTooltip !== null)
            setOpenTooltip(null);
        else
            setOpenTooltip(`block${i}`);
    }
    const columns = [
        {
            name: (
                <div>
                    <label className="textColor">Name</label>
                </div>
            ),
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.name}</div>,
            minWidth: '10%',
            // sortable: true,
        },
        {
            name: <label className="textColor">Email</label>,
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.email}</div>,
            // sortable: true,
            minWidth: '20%',
        },
        {
            name: <label className="textColor">Role</label>,
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.role}</div>,
            // sortable: true,
            minWidth: '5%'
        },

        {
            name: <label className="textColor">Company Name</label>,
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.company}</div>,
            // sortable: true,
            minWidth: '10%',
        },
        // {
        //     name: <b>Password</b>,
        //     selector: (row) => row.password,
        //     sortable: true,
        // },
        {
            name: <label className="textColor">Status</label>,
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.status}</div>,
            maxWidth: "6%"
        },
        {
            name: <label className="textColor">Events Count</label>,
            selector: (row) => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}> {row.eventsCount ? row.eventsCount : 0}</div>,
            minWidth: "4%",
            center: true
        },
        {
            name: <label className="textColor">Expiry</label>,
            selector: row => <div
                className={row.status === "inactive" || row.expiryStatus === true && moment(row.timestamp) < moment(Date.now()) ? 'text-danger' : ""}>{row.expiryStatus === false ? "No Expiry" : moment(row.timestamp).format("DD-MMM-YYYY")}</div>,
            // sortable: true,
            minWidth: "5%",
        },
        {
            id: 8,
            // maxWidth: "1%",
            cell: (row, i) => (
                <>
                    <Button
                        className={`m-1 text-center btn btn-sm ${row.status === "active" ? "deleteBtn" : "warningBtn"}`}
                        disabled={row.name === "Master Admin" || buttonLoader === row.id}
                        onClick={() => handleStatus(row, i)}
                        id={`block${i}`}
                    >
                        {buttonLoader === row.id ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> :
                            <>
                                {row.status === "active" ?
                                    <i className="fa fa-ban" aria-hidden="true"/> :
                                    <i className="fa fa-check" aria-hidden="true"/>
                                }
                            </>
                        }
                    </Button>
                    <Tooltip
                        placement="left"
                        open={openTooltip === `block${i}`}
                        target={`#block${i}`}
                        toggle={() => tooltipToggle(i)}
                        className="text-dark fw-bold  mx-1"
                    >
                        {row.status === "active" ? "Unblocked user, click to Block." : " Blocked user, click to Unblock."}
                    </Tooltip>
                    <Button className="btn editBtn btn-sm" disabled={row.name === "Master Admin"}
                            onClick={() => {
                                editToggle(row)
                            }}>
                        <img src={editIcon} alt="" height={15}/>
                    </Button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "rgb(246, 249, 252)",
            },
        },
    };
    return (
        <div>
            <MainNavbar/>
            <div style={{marginTop: "3%", marginLeft: "4%", marginRight: "4%"}}>
                <Row>
                    <Col>
                        <div>
                            <h4>Users</h4>
                            <div className="d-flex justify-content-end mb-3">
                                <div className="d-flex align-items-center">
                                    <FormInput
                                        min="1"
                                        maxLength={25}
                                        type="text"
                                        name="nameSearch"
                                        className="mx-2 plainInput w-100"
                                        value={filterValue}
                                        onChange={(e) => {
                                            setFilterValue(e.target.value);
                                        }}
                                        placeholder="Search by Name or Email"
                                    />
                                    <label className="" style={{width: "300px"}}>
                                        <Input
                                            id="teamSize"
                                            className="selectInput"
                                            type="select"
                                            name="teamSize"
                                            value={typeSelect}
                                            onChange={(e) => setTypeSelect(e.target.value)}
                                        >
                                            <option value="all">All</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Blocked</option>
                                            <option value="expired">Expired</option>
                                        </Input>
                                    </label>
                                    <Button onClick={() => {
                                        setTypeSelect("all");
                                        setFilterValue("");
                                    }} className="deleteBtn text-nowrap mx-3">Clear Filters</Button>
                                    <Button onClick={toggle} className="editBtn">Add User </Button>
                                </div>
                            </div>
                            <div className="p-0 pb-3">
                                <DataTable
                                    columns={columns}
                                    data={filteredUsers}
                                    pagination
                                    // customStyles={""}
                                    progressPending={loader}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
                <Modal isOpen={open} toggle={toggle} backdrop={false}>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={addUser}>
                            <FormGroup>
                                <label>Name</label>
                                <FormInput
                                    min="1"
                                    maxLength={25}
                                    type="text"
                                    name="name"
                                    required
                                    className="plainInput w-100 "
                                    value={userData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Email</label>
                                <FormInput
                                    min="1"
                                    maxLength={40}
                                    type="text"
                                    required
                                    className="plainInput w-100 "
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Company</label>
                                <FormInput
                                    min="1"
                                    maxLength={30}
                                    type="text"
                                    required
                                    className="plainInput w-100 "
                                    name="company"
                                    value={userData.company}
                                    onChange={handleChange}
                                    placeholder="Company"
                                />
                            </FormGroup>
                            {/*<FormGroup>*/}
                            {/*    <label>Role</label>*/}
                            {/*    <FormSelect required onChange={handleChange} className="plainInput w-100  mb-3"*/}
                            {/*                name="role" value={userData.role}>*/}
                            {/*        <option value="admin">Admin</option>*/}
                            {/*        <option value="superAdmin">Super Admin</option>*/}
                            {/*    </FormSelect>*/}
                            {/*</FormGroup>*/}
                            <FormGroup>
                                <label>Password</label>
                                <FormInput
                                    min="1"
                                    maxLength={15}
                                    type="text"
                                    required
                                    name="password"
                                    className="plainInput w-100 "
                                    value={userData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Enable Expiry</label>
                                <FormSelect required onChange={handleChange} className="plainInput w-100  mb-3"
                                            name="expiryStatus" value={userData.expiryStatus}>
                                    <option value="false">Disable</option>
                                    <option value="true">Enable</option>
                                </FormSelect>
                            </FormGroup>
                            {userData.expiryStatus == "true" &&
                            <FormGroup>
                                <label>Expiry</label>
                                <FormInput
                                    // min="1"
                                    // max="50"
                                    type="date"
                                    name="timestamp"
                                    required
                                    className="plainInput w-100 "
                                    min={minDate}
                                    value={userData.timestamp}
                                    onChange={handleChange}
                                    placeholder="Expiry"
                                />
                            </FormGroup>}
                            <div className="my-3 text-center">
                                <Button disabled={buttonLoader === "pending"} className="editBtn w-25 mx-2"
                                        type="submit">
                                    {buttonLoader === "pending" ?
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : "Save"}
                                </Button>
                                <Button className="deleteBtn w-25" onClick={() => {
                                    setOpen(false);
                                }}>Cancel</Button>
                            </div>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={editOpen} toggle={editToggle} backdrop={false}>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={updateData}>
                            <FormGroup>
                                <label>Name</label>
                                <FormInput
                                    min="1"
                                    maxLength={25}
                                    type="text"
                                    name="name"
                                    required
                                    className="plainInput w-100 "
                                    value={userData.name ?? ""}
                                    onChange={handleChange}
                                    placeholder="Name"
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Company</label>
                                <FormInput
                                    min="1"
                                    maxLength={30}
                                    type="text"
                                    required
                                    className="plainInput w-100 "
                                    name="company"
                                    value={userData.company}
                                    onChange={handleChange}
                                    placeholder="Company"
                                />
                            </FormGroup>
                            {/*<FormGroup>*/}
                            {/*    <label>Role</label>*/}
                            {/*    <FormSelect required onChange={handleChange} className="plainInput w-100  mb-3"*/}
                            {/*                name="role" value={userData.role}>*/}
                            {/*        <option value="admin">Admin</option>*/}
                            {/*        <option value="superAdmin">Super Admin</option>*/}
                            {/*    </FormSelect>*/}
                            {/*</FormGroup>*/}
                            {/*<FormGroup>*/}
                            {/*    <label>Status</label>*/}
                            {/*    <FormSelect required onChange={handleChange} className="plainInput w-100  mb-3"*/}
                            {/*                name="status" value={userData.status}>*/}
                            {/*        <option value="active">Active</option>*/}
                            {/*        <option value="inactive">In Active</option>*/}
                            {/*    </FormSelect>*/}
                            {/*</FormGroup>*/}
                            <FormGroup>
                                <label>Enable Expiry</label>
                                <FormSelect required onChange={handleChange} className="plainInput w-100  mb-3"
                                            name="expiryStatus" value={userData.expiryStatus}>
                                    <option value="false">Disable</option>
                                    <option value="true">Enable</option>
                                </FormSelect>
                            </FormGroup>
                            {userData.expiryStatus == "true" &&
                            <FormGroup>
                                <label>Expiry</label>
                                <FormInput
                                    // min="1"
                                    // max="50"
                                    type="date"
                                    name="timestamp"
                                    required
                                    className="plainInput w-100 "
                                    min={minDate}
                                    value={moment(userData.timestamp).format("yyyy-MM-DD")}
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                            </FormGroup>}

                            <div className="my-3 text-center">
                                <Button disabled={buttonLoader === "pending"} className="editBtn w-25 mx-2"
                                        type="submit">
                                    {buttonLoader === "pending" ?
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> : "Save"}
                                </Button>
                                <Button className="deleteBtn w-25" onClick={() => {
                                    setEditOpen(false);
                                }}>Cancel</Button>
                            </div>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    );
};

export default Users;