import React, {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {Button, Card, CardBody, CardHeader, Col, Row,} from "shards-react";
import DataTable from "react-data-table-component";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {Doughnut} from "react-chartjs-2";
import {useParams} from "react-router-dom";
import {Input} from "reactstrap";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function AvatarTables({avatarData}) {
    const [users, setUsers] = useState([]);
    const [userSelections, setUserSelections] = useState({});
    const [userData, setUserData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [tableRowsData, setTableRowsData] = useState([]);
    const [tableRowsDataTemp, setTableRowsDataTemp] = useState([]);
    const [serachName, setSearchname] = useState("");
    const [serachEmail, setSearchemail] = useState("");
    const [serachCharacter, setSearchcharacter] = useState("");
    const [serachArmor, setSearcharmor] = useState("");
    const [serachIndustry, setSearchIndustry] = useState("");
    const [armor, setArmor] = useState("");
    const [weapons, setWeapons] = useState("");
    const [sheild, setShield] = useState("");
    const [modal, setModal] = useState("");
    const [industry, setIndustry] = useState("");
    const [inventary, setInventary] = useState("");
    const [CsvDownload, setCsvDownload] = useState([]);
    const [jsonLoad, setJsonLoad] = useState(false);
    const {eid} = useParams();

    useEffect(() => {
        loadUsers().then((result) => {
            
            setUsers(result);
            setUserData(result);
            setLoader(false);
            setTimeout(() => {
                setJsonLoad(true);
            }, 1000);

            
            
        });
    }, []);

    useEffect(() => {
        tempFunc();
    }, [users]);

    const calcPercentage = (value) => {
        if (value) {
            //  return value
            return (value / userData?.length) * 100;
        } else return 0;
    };
    const calcIn = (value) => {
        if (value) {
            return ((value / userData?.length) * 100) / avatarData.competencyScreen.selectionLimit;
        } else return 0;
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                // fontColor: "#fff",
                display: true,
                position: "right",
                labels: {
                    // color: "white",
                    anchor: "center",
                },
            },
        },
    };
    const baseModels = {
        labels:
            jsonLoad === true && userData.length > 0 && avatarData.avatarScreen
                ? avatarData["avatarScreen"].avatar.map((_avatar) => _avatar.name)
                : "",
        datasets: [
            {
                data:
                    userSelections.avatars && jsonLoad && userData.length > 0 && avatarData.avatarScreen
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
                // datalabels: {
                //   color: "white",
                // },
            },
        ],
    };
    const armors = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.armorScreen
                ? avatarData["armorScreen"].armor.map(
                (_armor) => `${_armor.name.trim()} - ${_armor.desc}`
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.armors && jsonLoad && userData.length > 0 && avatarData.armorScreen
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
                // datalabels: {
                //   color: "white",
                // },
            },
        ],
    };
    const shield = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.shieldScreen
                ? avatarData["shieldScreen"].shield.map(
                (_shield) => `${_shield.name.trim()} - ${_shield.desc}`
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.shields && jsonLoad && userData.length > 0 && avatarData.shieldScreen
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
                // datalabels: {
                //   color: "white",
                // },
            },
        ],
    };
    const weapon = {
        labels:
            jsonLoad &&
            userData.length > 0 && avatarData.weaponScreen &&
            avatarData["weaponScreen"].weapon.map(
                (_weapon) =>
                    `${_weapon.name.trim()} - ${_weapon.desc ? _weapon.desc : ""}`
            ),
        datasets: [
            {
                data:
                    jsonLoad && userData.length > 0 && userSelections.weapons && avatarData.weaponScreen
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
                // datalabels: {
                //   color: "white",
                // },
            },
        ],
    };
    const inventory = {
        labels:
            jsonLoad && userData.length > 0 && avatarData.competencyScreen
                ? avatarData.competencyScreen.competencies.map((_inventory) =>
                    _inventory.name.trim()
                )
                : "",
        datasets: [
            {
                data:
                    userSelections.inventory && jsonLoad && userData.length > 0 && avatarData.competencyScreen
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
                // datalabels: {
                //   color: "white",
                // },
            },
        ],
    };

    const loadUsers = async () => {
        const usersRef = collection(db, "users");
        const q = query(
            usersRef,
            where("eventID", "==", localStorage.getItem("eventId"))
        );
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
        
        setUserSelections(_userSelections);
    };

    useEffect(() => {
        if (armor || sheild || weapons || industry || modal || inventary) {
            let data = userData;
            
            if (armor) {
                if (armor === "Select All") {
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
            }
            if (industry) {
                if (industry === "Select All") {
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
                if (sheild === "Select All") {
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
                if (weapons === "Select All") {
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
                if (modal === "Select All") {
                    setModal("");
                } else {
                    data = data.filter((item) => {
                        if (item.attributes.baseCharacter.toString().toLowerCase().includes(modal.toLowerCase())) {
                            return item;
                        }
                    });
                }
            }

            if (inventary) {
                if (inventary === "Select All") {
                    setInventary("");
                } else {
                    data = data.filter((item) => {
                        if (
                            item.attributes.inventory[0] === inventary ||
                            item.attributes.inventory[1] === inventary ||
                            item.attributes.inventory[2] === inventary ||
                            item.attributes.inventory[3] === inventary
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

    function clear() {
        
        
        setSearcharmor("");
        setSearchcharacter("");
        setSearchname("");
        setSearchemail("");
        setSearchIndustry("");
        // setUsers(tableRowsDataTemp);
        // setTableRowsData(tableRowsDataTemp);
        
    }

    const columns = [
        {
            name: (
                <div>
                    <label className="textColor">Name</label>
                </div>
            ),
            selector: (row) => row.Name,
            sortable: true,
        },
        {
            name: <label className="textColor">Email</label>,
            selector: (row) => row.Email,
            sortable: true,
        },
        (avatarData.hasOwnProperty("avatarScreen") && {
            name: <label className="textColor">Base Model</label>,
            selector: (row) => row.attributes["baseCharacter"],
            sortable: true,
        }),
        (avatarData.hasOwnProperty("weaponScreen") && {
            name: <label className="textColor">Weapon</label>,
            selector: (row) => row.attributes["weapon"],
            sortable: true,
        }),
        (avatarData.hasOwnProperty("shieldScreen") && {
            name: <label className="textColor">Shield</label>,
            selector: (row) => row.attributes["shield"],
            sortable: true,
        }),
        (avatarData.hasOwnProperty("armorScreen") && {
            name: <label className="textColor">Armor</label>,
            selector: (row) => row.attributes["armor"],
            sortable: true,
        }),
        (avatarData.hasOwnProperty("competencyScreen") && {
            name: <label className="textColor" width="50%">Inventory</label>,
            selector: (row) =>
                row.attributes.hasOwnProperty("inventory")
                    ? String(row["attributes"]["inventory"])
                    : "",
            sortable: true,
        }),
    ];
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "rgb(246, 249, 252)",
            },
        },
    };
    useEffect(() => {
        if (
            serachName ||
            serachEmail ||
            serachCharacter ||
            serachArmor ||
            serachIndustry
        ) {
            let data = userData;
            
            
            if (serachName) {
                data = data.filter((item) => {
                    if (item.Name) {
                        if (
                            item.Name
                                .toString()
                                .toLowerCase()
                                .includes(serachName.toLowerCase())
                        ) {
                            return item;
                        }
                    }
                });
                
            }
            if (serachIndustry) {
                data = data.filter((item) => {
                    if (
                        item.industry
                            .toString()
                            .toLowerCase()
                            .includes(serachIndustry.toLowerCase())
                    ) {
                        return item;
                    }
                });
                
            }
            if (serachEmail) {
                data = data.filter((item) => {
                    if (
                        item.Email
                            .toString()
                            .toLowerCase()
                            .includes(serachEmail.toLowerCase())
                    ) {
                        return item;
                    }
                });
            }
            if (serachCharacter) {
                data = data.filter((item) => {
                    if (
                        item.attributes.baseCharacter
                            .toString()
                            .toLowerCase()
                            .includes(serachCharacter.toLowerCase())
                    ) {
                        return item;
                    }
                });
            }
            if (serachArmor) {
                data = data.filter((item) => {
                    if (
                        item.attributes.armor
                            .toString()
                            .toLowerCase()
                            .includes(serachArmor.toLowerCase())
                    ) {
                        return item;
                    }
                });
            }
            setTableRowsData(data);
            setUsers(data);
            
                serachName,
                serachEmail,
                serachCharacter,
                serachArmor,
                serachIndustry
            );
        } else {
            setUsers(userData);
        }
    }, [serachName, serachEmail, serachCharacter, serachArmor, serachIndustry]);

    return (
        <>
            <div style={{marginRight: "2%", marginLeft: "2.5%", marginTop: "2%"}}>
                <h4>Reports</h4>
                <div className="d-flex justify-content-end my-3">
                    <Input
                        type="text"
                        onChange={(e) => {
                            setSearchname(e.target.value);
                        }}
                        value={serachName}
                        placeholder="Search User By Name"
                        className="plainInput w-25 me-1"
                    />
                    <Button onClick={clear} className="deleteBtn">Clear All</Button>
                </div>
                <Card>
                    <CardBody>
                        <Row>
                            {avatarData.avatarScreen &&
                            <Col md={8}>
                                <h6>
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData["avatarScreen"] !== "undefined"
                                        ? avatarData["avatarScreen"].titleName
                                        : ""}
                                </h6>
                                <div style={{height: "300px"}}>
                                    <Doughnut data={baseModels} options={options} type=""/>
                                </div>
                            </Col>
                            }
                            {avatarData.shieldScreen &&
                            <Col md={8}>
                                <h6 className="mb-0">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData &&
                                    avatarData["shieldScreen"].titleName}
                                </h6>
                                <p className="text-mute">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData &&
                                    avatarData["shieldScreen"].titleDesc}
                                </p>
                                <div style={{height: "300px"}}>
                                    <Doughnut data={shield} options={options} type=""/>
                                </div>
                            </Col>
                            }
                            {avatarData.armorScreen &&
                            <Col md={8}>
                                <h6 className="mb-0">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData["armorScreen"].titleName}
                                </h6>
                                <p className="text-mute">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData["armorScreen"].titleDesc}
                                </p>
                                <div style={{height: "300px"}}>
                                    <Doughnut data={armors} options={options} type=""/>
                                </div>
                            </Col>
                            }
                            {avatarData.weaponScreen &&
                            <Col md={8} className={"mb-5"}>
                                <h6 className="mb-0">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData["weaponScreen"].titleName}
                                </h6>
                                <div style={{height: "300px"}}>
                                    <p className="text-mute">
                                        {jsonLoad &&
                                        avatarData &&
                                        userData.length > 0 &&
                                        avatarData["weaponScreen"].titleDesc}
                                    </p>
                                    <Doughnut data={weapon} options={options} type=""/>
                                </div>
                            </Col>
                            }
                            {avatarData.competencyScreen &&
                            <Col md={8}>
                                <h6 className="mb-0">
                                    {jsonLoad &&
                                    avatarData &&
                                    userData.length > 0 &&
                                    avatarData["competencyScreen"].titleName}
                                </h6>
                                <p className="text-mute">
                                    {jsonLoad &&
                                    userData.length > 0 &&
                                    avatarData["competencyScreen"].titleDesc}
                                </p>
                                <div style={{height: "300px"}}>
                                    <Doughnut data={inventory} options={options} type=""/>
                                </div>
                            </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </div>
            <div style={{marginLeft: "45px", marginRight: "45px"}}>
                {/* Page Header */}

                {/* Default Light Table */}
                <Row>
                    <Col>
                        <Card small style={{marginTop: "5%"}}>
                            <CardHeader className={"d-flex justify-content-between"}>
                                <h4
                                    style={{
                                        fontWeight: "500",
                                    }}
                                >
                                    Profile Details
                                </h4>
                                {/*<CSVLink className="text-end" data={CsvDownload}>*/}
                                {/*    <Button className="editBtn">Download CSV</Button>*/}
                                {/*</CSVLink>*/}
                            </CardHeader>
                            <CardBody className="p-0 pb-3">
                                <DataTable
                                    columns={columns}
                                    data={users}
                                    pagination
                                    customStyles={customStyles}
                                    progressPending={loader}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}
