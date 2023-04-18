import React, {useEffect, useState} from 'react';
import {Button, Container, Form, FormGroup, FormInput} from "shards-react";
import {useHistory, useParams} from "react-router-dom";
import {Input, Modal, ModalBody, ModalHeader} from "reactstrap";
import deletIcon from "../images/newUI/icons/delete.png";
import plusIcon from "../images/newUI/icons/plus.png";
import {db} from "../firebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {ItemSignupFlow} from './ItemSignupFlow';
import {NotificationManager} from "react-notifications";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";


const SignUpFlow = () => {
    const [loading, setLoading] = useState(null);
    const [newField, setNewField] = useState({name: "", type: "text", enabled: true});
    const [editField, setEditField] = useState({});
    const [fields, setFields] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [option, setOption] = useState("");
    const [editItem, setEditItem] = useState("");
    const [editItemName, setEditItemName] = useState("");
    const [fieldNames, setFieldNames] = useState([]);
    const history = useHistory();
    const {eid} = useParams();

    useEffect(() => {
        
        loadScreens().then(result => {
            if (result && result.length > 0) {
                const _defaultFields = result.map((item) => {
                    return item.title.replace(/ /g, '');
                })
                
                setFieldNames(_defaultFields);
                setFields(result);
            }
            setLoading("ready");
        })
    }, []);

    const loadScreens = async () => {
        const docRef = doc(db, "sign-upScreens", eid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists())
            return docSnap.data().screens;
    }

    const toggleUser = (userIndex) => {
        const users = fields.map((user, i) => {
            if (userIndex === i) {
                
                
                return {...user, enabled: !user.enabled};
            }
            return user;
        });
        setFields(users)
    }
    const toggle = () => {
        setNewField({name: "", type: "text", enabled: true});
        setOpen(!open);
    }
    const toggleEdit = (e) => {
        setOpenEdit(!openEdit);
        
        setEditItemName(fieldNames[e]);
        setEditItem(e)
        
    }
    const openModal = () => {
        setOpen(true);
    }
    const addField = (e) => {
        e.preventDefault();
        
        if (newField.type !== "dropDown") {
            setFields([...fields, {title: newField.title, type: newField.type, enabled: true}])
        } else {
            setFields([...fields, {
                title: newField.title,
                type: newField.type,
                options: newField.options,
                enabled: true
            }])
        }
        setFieldNames([...fieldNames, newField.title.replace(/ /g, '')]);
        setNewField({name: "", type: "text", enabled: true});
        toggle();
    }
    const editFieldSubmit = (e, index) => {
        e.preventDefault();
        
        
        const users = fields.map((data, i) => {
            if (i === editItem) {

                if (editField.type === "dropDown") {
                    
                    return {...data, title: editField.title, type: editField.type, options: editField.options};
                } else {
                    
                    return {title: editField.title, type: editField.type, enabled: editField.enabled};
                }

            }
            
            return data;

        });
        
        setFields(users)
        setEditField({});
        toggleEdit();
    }
    const formSubmit = async (e) => {
        e.preventDefault();
        setLoading("pending");
        try {
            const _fields = fields.map((item, i) => {
                return {
                    ...item, sequence: i + 1
                }
            });
            
            const docRef = doc(db, "sign-upScreens", eid);
            await setDoc(docRef, {
                screens: _fields
            })
            NotificationManager.success("Fields Updated");
            setLoading("ready");
        } catch (e) {
            
            setLoading("error");
            NotificationManager.error("Error in updating");
        }
    };
    const editIdea = (_field, e) => {
        
        
        setEditField(e);
        toggleEdit(_field);
    }
    const removeFormField = (_field) => {
        const _fieldNames = fieldNames.filter((item, i) => i !== _field);
        setFieldNames(_fieldNames);
        const data = fields.filter((e, i) => _field !== i)
        setFields(data)
    }


    const onDragEnd = async (result) => {
        
        const newItems = Array.from(fields);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);

        
        setFields(newItems);
        
            newItems,
            result.destination.index + 1,
            result.source.index + 1, "data"
        );
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
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Add Sign-Up Flow </h4>
                                <div className="d-flex w-25 justify-content-end">
                                    <div className="mx-2">
                                        <Button className="warningBtn   my-2" onClick={() => {
                                            history.goBack()
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
                            {fields.length > 0 ? <>
                                <div className='p-3'>
                                    <div className='row'>
                                        <div className='col-2'><label
                                            className='textColor  mb-0 '>Sequence</label>
                                        </div>
                                        <div className='col-2'><label className='textColor  mb-0 '>Title</label>
                                        </div>
                                        <div className='col-2'><label className='textColor  mb-0 '>Type</label>
                                        </div>
                                        <div className='col-2'><label
                                            className='textColor  mb-0 '>Enable</label></div>
                                        <div className='col-2'><label
                                            className='textColor  mb-0 '>Options</label></div>
                                    </div>
                                </div>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="droppable">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {fields && fields.map((_field, i) => (
                                                    <Draggable
                                                        key={_field.title}
                                                        draggableId={_field.title}
                                                        index={i}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <ItemSignupFlow
                                                                provided={provided}
                                                                snapshot={snapshot}
                                                                _field={_field}
                                                                i={i}
                                                                toggleUser={toggleUser}
                                                                removeFormField={removeFormField}
                                                                editIdea={editIdea}/>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </> : <h4 className="text-center my-4">No fields Yet</h4>}
                        </Form>
                        {fields.length < 5 &&
                        <div>
                            <Button className="editBtn   my-2" onClick={openModal}>Add Field</Button>
                        </div>
                        }
                        <Modal toggle={toggle} isOpen={open} backdrop={false}>
                            <ModalHeader>Add Field</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={addField}>
                                    <FormGroup>
                                        <label>Field Name</label>
                                        <FormInput
                                            className="dateInput   w-100"
                                            required
                                            type="text"
                                            maxLength={40}
                                            value={newField.title}
                                            onChange={(e) => {
                                                setNewField({...newField, title: e.target.value});
                                            }}
                                            id="Fieldname"
                                            placeholder="Field Name"
                                        />
                                        {fieldNames.includes(newField.title && newField.title.replace(/ /g, '')) &&
                                        <span className="text-danger">Field Already exists</span>}
                                    </FormGroup>
                                    <FormGroup>
                                        <label className=" my-1">Field Type :</label>
                                        <label className="w-100">
                                            <Input
                                                id="fieldType"
                                                className="modalSelect rounded-0 "
                                                type="select"
                                                value={newField.type}
                                                onChange={(e) => {
                                                    if (e.target.value === "dropDown")
                                                        setNewField({...newField, type: e.target.value, options: []});
                                                    else
                                                        setNewField({...newField, type: e.target.value});
                                                }}
                                                name="fieldType"
                                            >
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="dropDown">Dropdown</option>
                                                <option value="number">Number</option>
                                            </Input>
                                        </label>
                                    </FormGroup>
                                    {newField.options && newField.options.length > 0 &&
                                    <div style={{height: "200px", overflowY: "auto"}}>
                                        {newField.options.map((_option, i) => (
                                            <div className="d-flex align-items-center justify-content-between"
                                                 style={{borderBottom: "1px solid"}}>
                                                <h6 className="mb-0">{_option}</h6>
                                                <Button
                                                    className=" m-1 text-center btn questionDeleteBtn btn-sm px-2 py-1 mx-3"
                                                    type="button"
                                                    onClick={() => {
                                                        // removeFormFields(_item)
                                                        let _options = newField.options;
                                                        _options.splice(i, 1);
                                                        setNewField({...newField, options: _options});
                                                    }}
                                                >
                                                    <img src={deletIcon} alt="" height={15}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                    {newField.type === "dropDown" && newField.options && newField.options.length < 15 &&
                                    <div className="d-flex align-items-center my-2">
                                        <FormInput
                                            className="dateInput   w-75"
                                            // required
                                            type="text"
                                            maxLength={30}
                                            value={option}
                                            onChange={(e) => {
                                                setOption(e.target.value);
                                            }}
                                            id="option"
                                            placeholder="Option"
                                        />
                                        <div className="mx-2">
                                            <Button className=" btn questionEditBtn btn-sm " type="button"
                                                    disabled={option === ""}
                                                    onClick={() => {
                                                        // editIdea(_item)
                                                        
                                                        if (newField.options === undefined) {
                                                            setNewField({...newField, options: [option]});
                                                        } else {
                                                            let _options = newField.options;
                                                            _options.push(option);
                                                            setNewField({...newField, options: _options});
                                                        }
                                                        setOption("");
                                                    }}>
                                                <img src={plusIcon} alt="" height={15}/>
                                            </Button>
                                        </div>
                                    </div>
                                    }
                                    <Button className="editBtn my-2 mx-2"
                                            disabled={fieldNames.includes(newField.title && newField.title.replace(/ /g, ''))}
                                            type="submit">Save</Button>
                                    <Button className="deleteBtn  " onClick={() => {
                                        toggle();
                                        // setOpen(false);
                                        // setNewField({});
                                    }}>Cancel</Button>
                                </Form>
                            </ModalBody>
                        </Modal>
                        <Modal toggle={toggleEdit} isOpen={openEdit} backdrop={false}>
                            <ModalHeader>Edit Field</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={editFieldSubmit}>
                                    <FormGroup>
                                        <label>Field Name</label>
                                        <FormInput
                                            className="dateInput w-100"
                                            required
                                            maxLength={40}
                                            type="text"
                                            value={editField.title}
                                            onChange={(e) => {
                                                setEditField({...editField, title: e.target.value});
                                            }}
                                            id="editname"
                                            // disabled={true}
                                            placeholder="Field Name"
                                        />
                                        {fieldNames.includes(editField.title && editField.title.replace(/ /g, '')) && editField.title !== editItemName &&
                                        <span className="text-danger">Field Already exists</span>}
                                    </FormGroup>
                                    <FormGroup>
                                        <label className=" my-1">Field Type</label>
                                        <label className="w-100">
                                            <Input
                                                id="fieldType"
                                                className="modalSelect rounded-0 "
                                                type="select"
                                                required
                                                value={editField.type}
                                                onChange={(e) => {
                                                    setEditField({...editField, type: e.target.value});
                                                }}
                                                name="editfieldType"
                                            >
                                                <option value="text">Text</option>
                                                <option value="email">Email</option>
                                                <option value="dropDown">Dropdown</option>
                                                <option value="number">Number</option>
                                            </Input>
                                        </label>
                                    </FormGroup>
                                    {editField.options && editField.options.length > 0 && editField.type === "dropDown" &&
                                    <div style={{height: "200px", overflowY: "auto"}}>
                                        {editField.options.map((_option, i) => (
                                            <div className="d-flex align-items-center justify-content-between"
                                                 style={{borderBottom: "1px solid"}}>
                                                <h6 className="mb-0">{_option}</h6>
                                                <Button
                                                    className=" m-1 text-center btn questionDeleteBtn btn-sm px-2 py-1 mx-3"
                                                    type="button"
                                                    onClick={() => {
                                                        // removeFormFields(_item)
                                                        let _options = editField.options;
                                                        _options.splice(i, 1);
                                                        setEditField({...editField, options: _options});
                                                    }}
                                                >
                                                    <img src={deletIcon} alt="" height={15}/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                    {editField.type === "dropDown" && editField.options.length < 15 &&
                                    <div className="d-flex align-items-center my-2">
                                        <FormInput
                                            className="dateInput   w-75"
                                            // required
                                            type="text"
                                            maxLength={30}
                                            value={option}
                                            onChange={(e) => {
                                                setOption(e.target.value);
                                            }}
                                            id="option"
                                            placeholder="Option"
                                        />
                                        <div className="mx-2">
                                            <Button className="editBtn" type="button"
                                                    disabled={option === ""}
                                                    onClick={() => {
                                                        
                                                        if (editField.options === undefined) {
                                                            setEditField({...editField, options: [option]});
                                                        } else {
                                                            let _options = editField.options;
                                                            _options.push(option);
                                                            setEditField({...editField, options: _options});
                                                        }
                                                        setOption("");
                                                    }}>
                                                <img src={plusIcon} alt="" height={15}/>
                                            </Button>
                                        </div>
                                    </div>
                                    }
                                    <div className="mt-2">
                                        <Button className="editBtn mx-2" type="submit">Save</Button>
                                        <Button className="deleteBtn  " onClick={() => {
                                            toggleEdit();
                                        }}>Cancel</Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </Modal>
                    </Container>
                </div>
            }
        </>
    );
};

export default SignUpFlow;
