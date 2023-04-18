import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, Col, Row} from 'shards-react';


const ItemScreen = ({provided, snapshot, _field, i, deleteScreen, edit, _screen}) => {
    const [options, setOptions] = useState([]);
    const [screenTitle, setScreenTitle] = useState("");
    const [colorIndex, setColorIndex] = useState(null);

    useEffect(() => {
        
        for (const screenKey in _screen) {
            
            if (Array.isArray(_screen[screenKey])) {
                setOptions(_screen[screenKey]);
                setScreenTitle(screenKey);
                switch (screenKey) {
                    case "weapon" :
                        setColorIndex(1);
                        break;
                    case "shield" :
                        setColorIndex(2);
                        break;
                    case "armor" :
                        setColorIndex(3);
                        break;
                }
            }
        }
    }, [])

    const colors = ["linear-gradient(to bottom right, #e7ad69, #f6e194)", "linear-gradient(to bottom right, #ac5596, #e6b0ec)",
        "linear-gradient(to bottom right, #4d89af, #6ac1ec)", "linear-gradient(to bottom right, #679475, #9cecb4)"];
    // const borders = ["#134d91", "#4e1494", "#ad6519", "#7f192a"];

    return (
        // <></>
        <div
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
        >
            <Card className="text-white my-2 px-0" style={{
                backgroundImage: colors[colorIndex],
                // borderTop: `1px solid ${borders[(colorIndex % borders.length + borders.length) % borders.length]}`,
                // borderLeft: `1px solid ${borders[(colorIndex % borders.length + borders.length) % borders.length]}`,
                // borderRight: `1px solid ${borders[(colorIndex % borders.length + borders.length) % borders.length]}`,
                // borderBottom: `5px solid ${borders[(colorIndex % borders.length + borders.length) % borders.length]}`,
            }}>
                <CardBody className="pt-3 pb-0">
                    <Row>
                        <Col lg={3} className="px-0">
                            <div>
                                <h5 className="text-white fw-bold mb-0">{screenTitle.charAt(0).toUpperCase() + screenTitle.slice(1)}s</h5>
                            </div>
                            <div className="">
                                <p className="mb-0 text-white-50">Title: <label
                                    className=" text-white fw-light">{_screen.titleName}</label>
                                </p>
                            </div>
                            <div className="">
                                <p className="mb-3 text-white  fw-light">{_screen.titleDesc}</p>
                            </div>
                        </Col>
                        <Col lg={2} className="px-0">
                            <div className="d-flex justify-content-end mb-3 mt-1">
                                <img src={_screen.images && _screen.images[0]} alt="" height={60} width={60}
                                     className="avatarImages"/>
                                <img src={_screen.images && _screen.images[1]} alt="" height={60} width={60}
                                     className="avatarImages mx-1"/>
                                <img src={_screen.images && _screen.images[2]} alt="" height={60} width={60}
                                     className="avatarImages"/>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className='mt-1'>
                                {options.map((option, _index) => (
                                    <div className="d-flex align-items-center" key={_index}>
                                        <p className="mb-0 text-white-50 text-nowrap">{`Option ${_index + 1}:`}</p>
                                        <p className="mb-0 ms-1 text-white fw-light ">
                                            <span className="">{option.name}</span>, {option.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col lg={1}>
                            <div className="d-flex justify-content-end align-items-center h-100">
                                <Button className="deleteBtn  me-2"
                                        onClick={() => deleteScreen(screenTitle, i)}>
                                    Delete
                                </Button>
                                <Button className="editBtn "
                                        onClick={() => edit(screenTitle)}>
                                    Edit
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </div>
    );
};

export default ItemScreen;