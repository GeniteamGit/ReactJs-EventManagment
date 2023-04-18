import React, {useEffect, useState} from "react";
import classNames from "classnames";
import {Col} from "shards-react";
import {Store} from "../../flux"
import SidebarMainNavbar from "../layout/MainSidebar/SidebarMainNavbar";
import homeLogo from "../../images/newUI/icons/home.png";
import homeLogoWhite from "../../images/newUI/icons/homeWhite.png";
import userIcon from "../../images/newUI/icons/user.png";
import userIconWhite from "../../images/newUI/icons/userWhite.png";
import mainLogo from "../../images/newUI/login&signup/mainLogo.png";
import {Link} from "react-router-dom";
import moment from "moment";

const CustomSidebar = ({user, hideLogoText, setEventData, setMainEventId, setAvatarData}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [sidebarNavItems, setSidebarNavItems] = useState(Store.getSidebarItems());

    useEffect(() => {
        const onChange = () => {
            setMenuVisible(Store.getMenuState());
            setSidebarNavItems(Store.getSidebarItems());
        };
        Store.addChangeListener(onChange);
        return () => {
            Store.removeChangeListener(onChange);
        };
    }, []);

    const classes = classNames(
        "main-sidebar",
        "px-0",
        "col-12",
        menuVisible && "open"
    );

    return (
        <Col tag="aside" className={classes} lg={{size: 2}} md={{size: 3}}>
            <SidebarMainNavbar setEventData={setEventData} setMainEventId={setMainEventId}
                               setAvatarData={setAvatarData}/>
            <Link to="/eventSelect" className="text-decoration-none">
                <div
                    className={`d-flex align-items-center customNavItem ${localStorage.getItem("users") !== "active" ? "sidebarItem" : 'inactiveDashboard'}`}
                    role="button"
                    onClick={() => {
                        localStorage.setItem("users", "inactive");
                        localStorage.setItem("activeLink", "Select an Event");
                    }}
                >
                    <img src={localStorage.getItem("users") !== "active" ? homeLogoWhite : homeLogo} alt=""
                         className="mx-3"/>
                    <span className={`${localStorage.getItem("users") === "inactive" && "text-white"}`}>Dashboard</span>
                </div>
            </Link>
            {user.role === "superAdmin" | localStorage.getItem("role") === "superAdmin" ?
                <Link to="/users" className="text-decoration-none">
                    <div
                        className={`d-flex align-items-center customNavItem  ${localStorage.getItem("users") === "active" ? "sidebarItem" : "inactiveDashboard"}`}
                        role="button"
                        onClick={() => {
                            localStorage.setItem("users", "active");
                            localStorage.setItem("activeLink", "Users");
                        }}
                    >
                        <img src={localStorage.getItem("users") === "active" ? userIconWhite : userIcon} alt=""
                             className="mx-3"/>
                        <span className={`${localStorage.getItem("users") === "active" && "text-white"}`}>Users</span>
                    </div>
                </Link> : ""
            }
            <div
                style={{
                    fontSize: "12px",
                    textAlign: "center",
                    // marginBottom: "15px",
                }}
                className="fixed-bottom"
            >
                Copyright@{moment(Date.now()).format("YYYY")} gage.
                <img src={mainLogo} alt="" width="90%" className="mt-3"/>
            </div>
        </Col>
    );
}

export default CustomSidebar;
