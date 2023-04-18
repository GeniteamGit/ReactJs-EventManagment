import React, {useCallback} from "react";
import {Navbar} from "shards-react";
import {Constants, Dispatcher} from "../../../flux";
import logo from "../../../images/newUI/login&signup/logo.png"
import {Link} from "react-router-dom";

const SidebarMainNavbar = (props) => {
    const handleToggleSidebar = useCallback(() => {
        Dispatcher.dispatch({
            actionType: Constants.TOGGLE_SIDEBAR,
        });
    }, []);


    return (
        <div className="main-navbar">
            <Navbar
                className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
                type="light"
            >
                <div
                    className="w-100 mr-0"
                    // href="#"
                    style={{lineHeight: "25px"}}
                >
                    <div className="d-table m-auto">
                        <Link to="/eventSelect">
                            <img alt="" src={logo} height={40} width={150} onClick={() => {
                                localStorage.setItem("eventName", "");
                                localStorage.setItem("eventId", "");
                                localStorage.setItem("activeLink", "Select an Event");
                                localStorage.setItem("users", "inactive");
                                Dispatcher.dispatch({
                                    actionType: "resetValue"
                                });
                                props.setEventData({});
                                props.setMainEventId("");
                            }}/>
                        </Link>
                    </div>
                </div>
                <a
                    className="toggle-sidebar d-sm-inline d-md-none d-lg-none"
                    onClick={handleToggleSidebar}
                >
                    <i className="material-icons">&#xE5C4;</i>
                </a>
            </Navbar>
        </div>
    );
};

export default SidebarMainNavbar;