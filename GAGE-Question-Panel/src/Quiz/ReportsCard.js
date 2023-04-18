import React, {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Col, Container, Form, FormGroup, InputGroup, Row,} from "reactstrap";
import {useParams} from "react-router-dom";
import {collection, doc, getDoc, getDocs, query, where,} from "firebase/firestore";
import {db} from "../firebase";
import Navbar from "./Navbar";

const ReportsCard = ({theme}) => {
    const {id} = useParams();
    const [armor, setArmor] = useState("");
    const [weapons, setWeapons] = useState("");
    const [sheild, setShield] = useState("");
    const [modal, setModal] = useState("");
    const [industry, setIndustry] = useState("");
    const [inventary, setInventary] = useState("");
    const [avatarData, setAvatarData] = useState(null);
    const [loader, setLoader] = useState(true);
    const [jsonLoad, setJsonLoad] = useState({});
    const [themeAvatar, setThemeAvatar] = useState({});
    const [userSelections, setUserSelections] = useState({});
    const [filters, setFilters] = useState([]);

    // arrays
    const [users, setUsers] = useState([]);
    const [avatar, setAvatar] = useState([]);
    const [weapon, setWeapon] = useState([]);
    const [armors, setArmors] = useState([]);
    const [shield, setSheild] = useState([]);
    const [userData, setUserData] = useState([]);
    const [competency, setCompetency] = useState([]);
    const [competencies, setCompetencies] = useState([]);

    useEffect(() => {
        loadComeptencies().then(result => {
            setCompetencies(result);
            loadFilters().then(filters => {
                const enabledScreens = filters.filter(screen => screen.enabled && screen.type === "dropDown");
               
                setFilters(enabledScreens);
                loadData().then(_data => {
                    setJsonLoad(true);
                    setLoader(false);
                })
            })
        })
    }, []);
    useEffect(() => {
        setUsers(userData);
       
        let tempArray = [];
        filters.forEach((screen) => {
            if (screen.value === "All") {
                setUsers(userData);
            } else if (screen.value) {
                tempArray.push({[screen.title]: screen.value});
            }
        });
       
        if (tempArray.length > 0) {
            const filteredUsers = userData.filter(user => {
                // Check if the user matches all of the filter conditions
                return tempArray.every(filter => {
                    return Object.keys(filter).every(key => {
                        return user[key] === filter[key];
                    });
                });
            });

           
            setUsers(filteredUsers);
        }
    }, [filters]);
    useEffect(() => {
        if (Object.keys(themeAvatar).length > 0) {
            data121();
        }
    }, [themeAvatar]);
    useEffect(() => {
        tempFunc();
    }, [users]);
    useEffect(() => {
        if (armor || sheild || weapons || industry || modal || inventary) {
            let data = userData;
           
           
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

                //
            }
            if (industry) {
                if (industry === "All") {
                    setIndustry("");
                } else {
                    data = data.filter((item) => {
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
                        if (item.attributes.hasOwnProperty("inventory")) {
                            if (item.attributes.inventory[0] == inventary ||
                                item.attributes.inventory[1] == inventary ||
                                item.attributes.inventory[2] == inventary ||
                                item.attributes.inventory[3] == inventary
                            ) {
                               

                                return item;
                            }
                        }
                    });
                }
            }
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
    const loadData = async () => {
       
        const data = await AvatarData();
       
        const data2 = await loadUsers();
       
       
        const themeData = await themeAvatar1();
        setAvatarData(data);
        setThemeAvatar(themeData);
        setUsers(data2);
        setUserData(data2);
    }
    const loadComeptencies = async () => {
        const docRef = doc(db, "themeCharacter", "config");
        const docSnap = await getDoc(docRef);
       
        let competenciesObject = docSnap.data().competencies;
        let competenciesArray = [];
        for (const _competency in competenciesObject) {
           
            competenciesArray.push(competenciesObject[_competency]);
        }
        return competenciesArray
    }
    const AvatarData = async () => {
       
        const docRef = doc(db, "details", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
           
            return docSnap.data();
        } else {
           
        }
    }
    const themeAvatar1 = async () => {
        if (theme === "1") {
            const docRef = doc(db, "themeCharacter", "1");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
               
               
                return docSnap.data();
            } else {
               
            }
        } else if (theme === "2") {
            const docRef = doc(db, "themeCharacter", "2");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
               
               
                return docSnap.data();
            } else {
               
            }
        }
    }
    const data121 = () => {
       
        const theme1 = themeAvatar["avatarScreen"];
        const theme2 = themeAvatar["armorScreen"];
        const theme3 = themeAvatar["shieldScreen"];
        const theme4 = themeAvatar["weaponScreen"];
        const theme5 = competencies;

        const avatarArray = avatarData.hasOwnProperty("avatarScreen") && avatarData["avatarScreen"].avatar;
        const armorArray = avatarData.hasOwnProperty("armorScreen") && avatarData["armorScreen"].armor;
        const shieldArray = avatarData.hasOwnProperty("shieldScreen") && avatarData["shieldScreen"].shield;
        const weaponArray = avatarData.hasOwnProperty("weaponScreen") && avatarData["weaponScreen"].weapon;
        const competencyArray = avatarData.hasOwnProperty("competencyScreen") && avatarData["competencyScreen"].competencies;

        if (avatarData.hasOwnProperty("avatarScreen")) {
            const data1 = avatarArray.map((e, i) => {
               
                return {...e, img: theme1[i]};
            });
            setAvatar(data1);
        }
        if (avatarData.hasOwnProperty("armorScreen")) {
            const data2 = armorArray.map((e, i) => {
               
                return {...e, img: theme2[i]};
            });
            setArmors(data2);
        }
        if (avatarData.hasOwnProperty("shieldScreen")) {
            const data3 = shieldArray.map((e, i) => {
               
                return {...e, img: theme3[i]};
            });
            setSheild(data3);
        }
        if (avatarData.hasOwnProperty("weaponScreen")) {
            const data4 = weaponArray.map((e, i) => {
               
                return {...e, img: theme4[i]};
            });
            setWeapon(data4);
        }
        if (avatarData.hasOwnProperty("competencyScreen")) {
            const data5 = competencyArray.map((e, i) => {
               
                if (e.imageUrl !== undefined)
                    return {...e, img: e.imageUrl};
                else
                    return {...e, img: theme5[i]};
            });
            setCompetency(data5);
        }
    }
    const loadUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("eventID", "==", id));
        const usersData = await getDocs(q);
        const w = usersData.docs.map((doc) => ({...doc.data()}));
       
       
       
        return w;
    };
    const tempFunc = () => {
       
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
            _userSelections.shields[_user.attributes.shield.trim()] = _userSelections
                .shields[_user.attributes.shield.trim()]
                ? _userSelections.shields[_user.attributes.shield.trim()] + 1
                : 1;
            _userSelections.weapons[_user.attributes.weapon.trim()] = _userSelections
                .weapons[_user.attributes.weapon.trim()]
                ? _userSelections.weapons[_user.attributes.weapon.trim()] + 1
                : 1;
            _userSelections.armors[_user.attributes.armor.trim()] = _userSelections
                .armors[_user.attributes.armor.trim()]
                ? _userSelections.armors[_user.attributes.armor.trim()] + 1
                : 1;

            for (const _key in _user.attributes.inventory) {
                const _inventory = _user.attributes.inventory[_key];
                _userSelections.inventory[_inventory.trim()] = _userSelections
                    .inventory[_inventory.trim()]
                    ? _userSelections.inventory[_inventory.trim()] + 1
                    : 1;
            }
        });
        setUserSelections(_userSelections);
    };
    const calcPercentage = (value) => {
        if (value) return (value / userData?.length) * 100;
        else return 0;
    };
    const calcPerIn = (value) => {
        if (value) return ((value / userData?.length) * 100) / avatarData.competencyScreen.selectionLimit;
        else return 0;
    };

    return (
        <div>
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
                        {" "}
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
                                                                <p className="text-filters">Avatar</p>
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
                                                                        {userData.length > 0
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
                                                                <p className="text-filters">Weapon</p>
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
                                                                        {userData.length > 0
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
                                                                <p className="text-filters">Shield</p>
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
                                                                        {userData.length > 0
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
                                                                <p className="text-filters">Armor</p>
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
                                                                        {userData.length > 0
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
                                                                <p className="text-filters">Inventory</p>
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
                                                                        {userData.length > 0
                                                                            ? avatarData[
                                                                                "competencyScreen"
                                                                                ].competencies.map((e) => (
                                                                                <option>{e.name}</option>
                                                                            ))
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
                                                            <div>
                                                                <label>{screen.title}</label>
                                                                <InputGroup className="input-group-alternative">
                                                                    <select
                                                                        onChange={(e) => {
                                                                           
                                                                            let tempArray = filters;
                                                                            tempArray[index].value = e.target.value;
                                                                            setFilters([...tempArray]);
                                                                        }}
                                                                        style={{
                                                                            padding: "6px 12px",
                                                                            maxWidth: "150px",
                                                                        }}
                                                                        type="select"
                                                                    >
                                                                        <option>All</option>
                                                                        {userData.length > 0
                                                                            ? screen.options.map((e) => (
                                                                                <option>{e}</option>
                                                                            ))
                                                                            : ""}
                                                                    </select>
                                                                </InputGroup>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                {jsonLoad && avatarData.hasOwnProperty("avatarScreen") &&
                                    <Col sm={12} className="mb-3">
                                        <Card>
                                            <CardHeader>
                                                <h4 className="mb-0">
                                                    {jsonLoad && avatarData["avatarScreen"].titleName}
                                                </h4>
                                                <p className="small mb-0">
                                                    {jsonLoad && avatarData["avatarScreen"].titleDesc}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {avatar.map((_avatar) => (
                                                        <Col md={4}>
                                                            <div
                                                                className="d-flex justify-content-start align-items-start">
                                                                <img
                                                                    src={_avatar.img}
                                                                    alt=""
                                                                    style={{maxWidth: "100px"}}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1">
                                                                        {calcPercentage(
                                                                            userSelections.avatars[
                                                                                _avatar.name.trim()
                                                                                ] ?? 0
                                                                        ).toFixed(1)}
                                                                        %
                                                                    </h4>
                                                                    <h6 className="mb-0">{_avatar.name}</h6>
                                                                    <p className="small text-muted mb-1">
                                                                        {_avatar.desc}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                                {jsonLoad && avatarData.hasOwnProperty("weaponScreen") &&
                                    <Col sm={12} className="mb-3">
                                        <Card>
                                            <CardHeader>
                                                <h4 className="mb-0">
                                                    {jsonLoad && avatarData["weaponScreen"].titleName}
                                                </h4>
                                                <p className="small mb-0">
                                                    {jsonLoad && avatarData["weaponScreen"].titleDesc}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {weapon.map((_weapon) => (
                                                        <Col md={4}>
                                                            <div
                                                                className="d-flex justify-content-start align-items-start">
                                                                <img
                                                                    src={_weapon.img}
                                                                    alt=""
                                                                    style={{maxWidth: "100px"}}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1">
                                                                        {calcPercentage(
                                                                            userSelections.weapons[
                                                                                _weapon.name.trim()
                                                                                ] ?? 0
                                                                        ).toFixed(1)}
                                                                        %
                                                                    </h4>
                                                                    <h5 className="mb-0">{_weapon.name}</h5>
                                                                    <p className="small text-muted mb-1">
                                                                        {_weapon.desc}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                                {jsonLoad && avatarData.hasOwnProperty("shieldScreen") &&
                                    <Col sm={12} className="mb-3">
                                        <Card>
                                            <CardHeader>
                                                <h4 className="mb-0">
                                                    {jsonLoad && avatarData["shieldScreen"].titleName}
                                                </h4>
                                                <p className="small mb-0">
                                                    {jsonLoad && avatarData["shieldScreen"].titleDesc}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {shield.map((_shield) => (
                                                        <Col md={4}>
                                                            <div
                                                                className="d-flex justify-content-start align-items-start">
                                                                <img
                                                                    src={_shield.img}
                                                                    alt=""
                                                                    style={{maxWidth: "100px"}}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1">
                                                                        {calcPercentage(
                                                                            userSelections.shields[
                                                                                _shield.name.trim()
                                                                                ] ?? 0
                                                                        ).toFixed(1)}
                                                                        %
                                                                    </h4>
                                                                    <h6 className="mb-0">{_shield.name}</h6>
                                                                    <p className="small text-muted mb-1">
                                                                        {_shield.desc}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                                {jsonLoad && avatarData.hasOwnProperty("armorScreen") &&
                                    <Col sm={12} className="mb-3">
                                        <Card>
                                            <CardHeader>
                                                <h4 className="mb-0">
                                                    {jsonLoad && avatarData["armorScreen"].titleName}
                                                </h4>
                                                <p className="small mb-0">
                                                    {jsonLoad && avatarData["armorScreen"].titleDesc}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {armors.map((_armor) => (
                                                        <Col md={4}>
                                                            <div
                                                                className="d-flex justify-content-start align-items-start">
                                                                <img
                                                                    src={_armor.img}
                                                                    alt=""
                                                                    style={{maxWidth: "100px"}}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1">
                                                                        {calcPercentage(
                                                                            userSelections.armors[_armor.name.trim()] ??
                                                                            0
                                                                        ).toFixed(1)}
                                                                        %
                                                                    </h4>
                                                                    <h6 className="mb-0">{_armor.name}</h6>
                                                                    <p className="small text-muted mb-1">
                                                                        {_armor.desc}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                                {jsonLoad && avatarData.hasOwnProperty("competencyScreen") &&
                                    <Col sm={12} className="mb-3">
                                        <Card>
                                            <CardHeader>
                                                <h4 className="mb-0">
                                                    {jsonLoad && avatarData["competencyScreen"].titleName}
                                                </h4>
                                                <p className="small mb-0">
                                                    {jsonLoad && avatarData["competencyScreen"].titleDesc}
                                                </p>
                                            </CardHeader>
                                            <CardBody>
                                                <Row>
                                                    {competency.map((_inventory) => (
                                                        <Col md={3} className="mb-3">
                                                            <div
                                                                className="d-flex justify-content-start align-items-start">
                                                                <img
                                                                    src={_inventory.img}
                                                                    alt=""
                                                                    style={{maxWidth: "100px"}}
                                                                />
                                                                <div className="ms-3">
                                                                    <h4 className="mb-1">
                                                                        {calcPerIn(
                                                                            userSelections.inventory[
                                                                                _inventory.name.trim()
                                                                                ] ?? 0
                                                                        ).toFixed(1)}
                                                                        %
                                                                    </h4>
                                                                    <h6 className="mb-0">{_inventory.name}</h6>
                                                                    {/*<p className="small text-muted mb-1">{_inventory.desc}</p>*/}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                }
                            </Row>
                        </Container>
                    </>
                )}
            </>
        </div>
    );
};

export default ReportsCard;
