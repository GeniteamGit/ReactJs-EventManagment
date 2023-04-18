import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Container, Form, FormGroup, InputGroup, Row,} from "reactstrap";

import {useParams} from "react-router-dom";
import {collection, doc, getDoc, getDocs, query, where,} from "firebase/firestore";
import {db} from "../firebase";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {Doughnut} from "react-chartjs-2";
import Navbar from "./Navbar";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ReportCharts = ({theme}) => {
    const {id} = useParams();
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [userSelections, setUserSelections] = useState({});
    const [armor, setArmor] = useState("");
    const [weapons, setWeapons] = useState("");
    const [sheild, setShield] = useState("");
    const [modal, setModal] = useState("");
    const [industry, setIndustry] = useState("");
    const [inventary, setInventary] = useState("");
    const [jsonLoad, setJsonLoad] = useState(false);
    const [avatarData, setAvatarData] = useState({});
    const [filters, setFilters] = useState([]);

    const calcPercentage = (value) => {
        if (value) return (value / userData?.length) * 100;
        else return 0;
    };
    const calcIn = (value) => {
        if (value) return ((value / userData?.length) * 100) / 4;
        else return 0;
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                fontColor: "#fff",
                display: true,
                position: "right",
                labels: {
                    color: "white",
                    anchor: "center",
                },
            },
        },
    };
    const baseModels = {
        labels:
            jsonLoad === true && userData.length > 0 && avatarData.hasOwnProperty("avatarScreen")
                ? avatarData["avatarScreen"].avatar.map((_avatar) => _avatar.name)
                : "",
        datasets: [
            {
                data:
                    userSelections.avatars && jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("avatarScreen")
                        ? avatarData["avatarScreen"].avatar.map((_avatar) =>
                            calcPercentage(
                                userSelections.avatars[_avatar.name.trim()] ?? 0
                            ).toFixed(1)
                        )
                        : [0],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(87,192,75,0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgb(75,192,77)",
                ],
                datalabels: {
                    color: "white",
                },
            },
        ],
    };
    const armors = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("armorScreen")
                ? avatarData["armorScreen"].armor.map(
                    (_armor) => `${_armor.name.trim()} - ${_armor.desc}`
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.armors && jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("armorScreen")
                        ? avatarData["armorScreen"].armor.map((_armor) =>
                            calcPercentage(
                                userSelections.armors[_armor.name.trim()] ?? 0
                            ).toFixed(1)
                        )
                        : [0],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(87,192,75,0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgb(75,192,77)",
                ],
                datalabels: {
                    color: "white",
                },
            },
        ],
    };
    const shield = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("shieldScreen")
                ? avatarData["shieldScreen"].shield.map(
                    (_shield) => `${_shield.name.trim()} - ${_shield.desc}`
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.shields && jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("shieldScreen")
                        ? avatarData["shieldScreen"].shield.map((_shield) =>
                            calcPercentage(
                                userSelections.shields[_shield.name.trim()] ?? 0
                            ).toFixed(1)
                        )
                        : [0],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(87,192,75,0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgb(75,192,77)",
                ],
                borderWidth: 1.5,
                datalabels: {
                    color: "white",
                },
            },
        ],
    };
    const weapon = {
        labels:
            jsonLoad &&
            userData.length > 0 && avatarData.hasOwnProperty("weaponScreen") &&
            avatarData["weaponScreen"].weapon.map(
                (_weapon) => `${_weapon.name.trim()} - ${_weapon.desc}`
            ),
        datasets: [
            {
                data:
                    userSelections.weapons && jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("weaponScreen")
                        ? avatarData["weaponScreen"].weapon.map((_weapon) =>
                            calcPercentage(
                                userSelections.weapons[_weapon.name.trim()] ?? 0
                            ).toFixed(1)
                        )
                        : [0],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(87,192,75,0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgb(75,192,77)",
                ],
                borderWidth: 1.5,
                datalabels: {
                    color: "white",
                },
            },
        ],
    };
    const inventory = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("competencyScreen")
                ? avatarData.competencyScreen.competencies.map((_inventory) =>
                    _inventory.name.trim()
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.inventory && jsonLoad && userData.length > 0 && avatarData.hasOwnProperty("competencyScreen")
                        ? avatarData.competencyScreen.competencies.map((_inventory) =>
                            calcIn(
                                userSelections.inventory[_inventory.name.trim()] ?? 0
                            ).toFixed(1)
                        )
                        : [0],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(1, 206, 86, 0.2)",
                    "rgba(87,192,75,0.2)",
                    "rgba(99,118,222,0.2)",
                    "rgba(56,219,177,0.2)",
                    "rgba(89,255,175,0.2)",
                    "rgba(24,112,236,0.2)",
                    "rgba(23,217,65,0.2)",
                    "rgba(159,217,23,0.2)",
                    "rgba(212,41,18,0.2)",
                    "rgba(238, 130, 238,0.2)",
                    "rgba(255, 165, 0,1)",
                    "rgba(255, 165, 0)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(87,192,75,0.2)",
                    "rgba(99,118,222,0.2)",
                    "rgba(60,219,177,0.2)",
                    "rgba(0,255,175,0.63)",
                    "rgba(24,112,236,0.72)",
                    "rgba(23,217,65,0.64)",
                    "rgba(159,217,23,0.71)",
                    "rgba(212,41,18,0.63)",
                ],
                datalabels: {
                    color: "white",
                },
            },
        ],
    };

    useEffect(() => {
        loadUsers().then((result) => {
            setUsers(result);
            setUserData(result);
            loadAvatarData().then(data => {
                setAvatarData(data);
                loadFilters().then(filters => {
                    const enabledScreens = filters.filter(screen => screen.enabled && screen.type === "dropDown");
                    setFilters(enabledScreens);
                    setLoader(false);
                    setJsonLoad(true);
                })
            })
        });
    }, []);
    useEffect(() => {
        tempFunc();
    }, [users]);
    useEffect(() => {
        setUsers(userData);
        console.log(filters);
        let tempArray = [];
        filters.forEach((screen) => {
            if (screen.value === "All") {
                setUsers(userData);
            } else if (screen.value) {
                tempArray.push({[screen.title]: screen.value});
            }
        });
        console.log(tempArray, "Temp Array");
        if (tempArray.length > 0) {
            const filteredUsers = userData.filter(user => {
                // Check if the user matches all of the filter conditions
                return tempArray.every(filter => {
                    return Object.keys(filter).every(key => {
                        return user[key] === filter[key];
                    });
                });
            });

            console.log(filteredUsers, "filteredUsers");
            setUsers(filteredUsers);
        }
    }, [filters]);
    useEffect(() => {
        if (armor || sheild || weapons || industry || modal || inventary) {
            let data = userData;
            console.log("test", data);
            if (armor) {
                if (armor === "All") {
                    setArmor("");
                } else {
                    data = data.filter((item) => {
                        if (
                            item.attributes.armor
                                .toString()
                                .toLowerCase()
                                .includes(armor.toLowerCase())
                        ) {
                            return item;
                        }
                    });
                }

                // console.log(serachName, data);
            }
            if (industry) {
                if (industry === "All") {
                    setIndustry("");
                } else {
                    data = data.filter((item) => {
                        console.log(item);
                        if (
                            item.industry
                                .toString()
                                .toLowerCase()
                                .includes(industry.toLowerCase())
                        ) {
                            return item;
                        }
                    });
                }
            }
            if (sheild) {
                if (sheild === "All") {
                    setShield("");
                } else {
                    data = data.filter((item) => {
                        if (
                            item.attributes.shield
                                .toString()
                                .toLowerCase()
                                .includes(sheild.toLowerCase())
                        ) {
                            return item;
                        }
                    });
                }
            }
            if (weapons) {
                if (weapons === "All") {
                    setWeapons("");
                } else {
                    data = data.filter((item) => {
                        if (item.attributes.weapon.toString().includes(weapons)) {
                            return item;
                        }
                    });
                }
            }
            if (modal) {
                if (modal === "All") {
                    setModal("");
                } else {
                    data = data.filter((item) => {
                        if (item.attributes.baseCharacter.toString().includes(modal)) {
                            return item;
                        }
                    });
                }
            }

            if (inventary) {
                if (inventary === "All") {
                    setInventary("");
                } else {
                    data = data.filter((item) => {
                        console.log(item);
                        if (
                            item.attributes.inventory[0].includes(inventary) ||
                            item.attributes.inventory[1].includes(inventary) ||
                            item.attributes.inventory[2].includes(inventary) ||
                            item.attributes.inventory[3].includes(inventary)
                        ) {
                            return item;
                        }
                    });
                }
            }

            // setUserData(data);
            setUsers(data);
        } else {
            setUsers(userData);
        }
    }, [inventary, armor, weapons, sheild, modal, industry]);

    const loadFilters = async () => {
        const docRef = doc(db, "sign-upScreens", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data().screens;
    }
    const loadAvatarData = async () => {
        const docRef = doc(db, "details", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
            // setAvatarData(docSnap.data());
        } else {
            console.log("No such document!");
        }
    }
    const loadUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("eventID", "==", id));
        const usersData = await getDocs(q);
        const w = usersData.docs.map((doc) => ({...doc.data()}));
        console.log(w);
        console.log("setting users");
        return w;
    };
    const tempFunc = () => {
        console.log(users);
        const _userSelections = {
            avatars: {},
            shields: {},
            weapons: {},
            armors: {},
            inventory: {},
        };

        users.forEach((_user) => {
            _userSelections.avatars[_user.attributes.baseCharacter.trim()] =
                _userSelections.avatars[_user.attributes.baseCharacter.trim()]
                    ? _userSelections.avatars[_user.attributes.baseCharacter.trim()] + 1
                    : 1;
            if (_user.attributes.shield) {
                _userSelections.shields[_user.attributes.shield.trim()] = _userSelections
                    .shields[_user.attributes.shield.trim()]
                    ? _userSelections.shields[_user.attributes.shield.trim()] + 1
                    : 1;
            }
            if (_user.attributes.weapon) {
                _userSelections.weapons[_user.attributes.weapon.trim()] = _userSelections
                    .weapons[_user.attributes.weapon.trim()]
                    ? _userSelections.weapons[_user.attributes.weapon.trim()] + 1
                    : 1;
            }
            if (_user.attributes.armor) {
                _userSelections.armors[_user.attributes.armor.trim()] = _userSelections
                    .armors[_user.attributes.armor.trim()]
                    ? _userSelections.armors[_user.attributes.armor.trim()] + 1
                    : 1;
            }
            for (const _key in _user.attributes.inventory) {
                const _inventory = _user.attributes.inventory[_key];
                _userSelections.inventory[_inventory.trim()] = _userSelections
                    .inventory[_inventory.trim()]
                    ? _userSelections.inventory[_inventory.trim()] + 1
                    : 1;
            }
        });

        console.log(_userSelections);
        setUserSelections(_userSelections);
    };

    return (
        <>
            {loader ? (
                <div
                    style={{height: "100vh"}}
                    className="d-flex align-items-center justify-content-center "
                >
                    <h2 style={{color: "white"}}>Loading...</h2>
                </div>
            ) : (
                <>
                    <Container className="my-3">
                        <Navbar eid={id}/>
                        <Row>
                            <Col className="my-3">
                                <Card>
                                    <CardHeader>
                                        <h4 className="mb-0">Avatar-Profile</h4>
                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            <Row>
                                                <Col>
                                                    {avatarData.hasOwnProperty("avatarScreen") &&
                                                        <FormGroup>
                                                            <label className="text-filters">Avatar</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => {
                                                                        setModal(e.target.value);
                                                                    }}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        width: "150px",
                                                                    }}
                                                                    type="select"
                                                                >
                                                                    <option>All</option>
                                                                    {jsonLoad && userData.length > 0
                                                                        ? avatarData["avatarScreen"].avatar.map((e) => (
                                                                            <option>{e.name}</option>
                                                                        ))
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    }
                                                </Col>
                                                <Col>
                                                    {avatarData.hasOwnProperty("weaponScreen") &&
                                                        <FormGroup>
                                                            <label className="text-filters">Weapon</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => setWeapons(e.target.value)}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        width: "150px",
                                                                    }}
                                                                    type="select"
                                                                >
                                                                    <option>All</option>
                                                                    {jsonLoad && userData.length > 0
                                                                        ? avatarData["weaponScreen"].weapon.map((e) => (
                                                                            <option>{e.name}</option>
                                                                        ))
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    }
                                                </Col>
                                                <Col>
                                                    {avatarData.hasOwnProperty("shieldScreen") &&
                                                        <FormGroup>
                                                            <label className="text-filters">Shield</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => {
                                                                        setShield(e.target.value);
                                                                    }}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        width: "150px",
                                                                    }}
                                                                    type="select"
                                                                >
                                                                    <option>All</option>
                                                                    {jsonLoad && userData.length > 0
                                                                        ? avatarData["shieldScreen"].shield.map((e) => (
                                                                            <option>{e.name}</option>
                                                                        ))
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    }
                                                </Col>
                                                <Col>
                                                    {avatarData.hasOwnProperty("armorScreen") &&
                                                        <FormGroup>
                                                            <label className="text-filters">Armor</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => {
                                                                        setArmor(e.target.value);
                                                                    }}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        width: "150px",
                                                                    }}
                                                                    type="select"
                                                                >
                                                                    <option>All</option>
                                                                    {jsonLoad && userData.length > 0
                                                                        ? avatarData["armorScreen"].armor.map((e) => (
                                                                            <option>{e.name}</option>
                                                                        ))
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    }
                                                </Col>
                                                <Col>
                                                    {avatarData.hasOwnProperty("competencyScreen") &&
                                                        <FormGroup>
                                                            <label className="text-filters">Inventory</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => {
                                                                        setInventary(e.target.value);
                                                                    }}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        maxWidth: "150px",
                                                                    }}
                                                                    type="select"
                                                                >
                                                                    <option>All</option>
                                                                    {jsonLoad && userData.length > 0
                                                                        ? avatarData["competencyScreen"].competencies.map(
                                                                            (e) => <option>{e.name}</option>
                                                                        )
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row>
                                                {filters.map((screen, index) => (
                                                    <Col lg={2} style={{width: "20%"}}>
                                                        <FormGroup>
                                                            <label>{screen.title}</label>
                                                            <InputGroup className="input-group-alternative">
                                                                <select
                                                                    onChange={(e) => {
                                                                        console.log(e.target.value);
                                                                        let tempArray = filters;
                                                                        tempArray[index].value = e.target.value;
                                                                        setFilters([...tempArray]);
                                                                    }}
                                                                    style={{
                                                                        padding: "6px 12px",
                                                                        maxWidth: "150px",
                                                                    }}
                                                                >
                                                                    <option>All</option>
                                                                    {userData.length > 0
                                                                        ? screen.options.map((e) => (
                                                                            <option>{e}</option>
                                                                        ))
                                                                        : ""}
                                                                </select>
                                                            </InputGroup>
                                                        </FormGroup>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            {jsonLoad && avatarData.hasOwnProperty("avatarScreen") &&
                                <Col className="mt-2" md={12}>
                                    <h3 className="text-white">
                                        {jsonLoad && avatarData["avatarScreen"].titleDesc}
                                    </h3>
                                    <hr className="text-white"/>
                                    <div className="myChart">
                                        <Doughnut data={baseModels} options={options} type=""/>
                                    </div>
                                </Col>
                            }
                            {jsonLoad && avatarData.hasOwnProperty("shieldScreen") &&
                                <Col className="mt-2" md={12}>
                                    <h3 className="character_ava">
                                        {jsonLoad && avatarData["shieldScreen"].titleName}
                                    </h3>
                                    <p className="text-white">
                                        {jsonLoad && avatarData["shieldScreen"].titleDesc}
                                    </p>
                                    <hr className="text-white"/>
                                    <div className="myChart">
                                        <Doughnut data={shield} options={options} type=""/>
                                    </div>
                                </Col>
                            }
                            {jsonLoad && avatarData.hasOwnProperty("weaponScreen") &&
                                <Col className="mt-2" md={12}>
                                    <h3 className="character_ava">
                                        {jsonLoad && avatarData["weaponScreen"].titleName}
                                    </h3>
                                    <p className="text-white">
                                        {jsonLoad && avatarData["weaponScreen"].titleDesc}
                                    </p>
                                    <hr className="text-white"/>
                                    <div className="myChart">
                                        <Doughnut data={weapon} options={options} type=""/>
                                    </div>
                                </Col>
                            }
                            {jsonLoad && avatarData.hasOwnProperty("armorScreen") &&
                                <Col className="mt-2" md={12}>
                                    <h3 className="character_ava">
                                        {jsonLoad && avatarData["armorScreen"].titleName}
                                    </h3>
                                    <p className="text-white">
                                        {jsonLoad && avatarData["armorScreen"].titleDesc}
                                    </p>
                                    <hr className="text-white"/>
                                    <div className="myChart">
                                        <Doughnut data={armors} options={options} type=""/>
                                    </div>
                                </Col>
                            }
                            {jsonLoad && avatarData.hasOwnProperty("competencyScreen") &&
                                <Col className="mt-2" md={12}>
                                    <h3 className="character_ava">
                                        {jsonLoad && avatarData["competencyScreen"].titleName}
                                    </h3>
                                    <p className="text-white">
                                        {jsonLoad && avatarData["competencyScreen"].titleDesc}
                                    </p>
                                    <hr className="text-white"/>
                                    <div className="myChart">
                                        <Doughnut data={inventory} options={options} type=""/>
                                    </div>
                                </Col>
                            }
                        </Row>
                    </Container>
                </>
            )}
        </>
    );
};

export default ReportCharts;
