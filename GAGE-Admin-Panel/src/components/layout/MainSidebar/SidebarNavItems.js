import React, {useEffect, useState} from "react";
import {Nav} from "shards-react";
import SidebarNavItem from "./SidebarNavItem";
import {Store} from "../../../flux";
import mainLogo from "../../../images/newUI/login&signup/mainLogo.png";
import moment from "moment";

const SidebarNavItems = (props) => {
    const [navItems, setNavItems] = useState(Store.getSidebarItems());

    useEffect(() => {
        
        Store.addChangeListener(() =>
            setNavItems(Store.getSidebarItems())
        );
        return () => Store.removeChangeListener(() =>
            setNavItems(Store.getSidebarItems())
        );
    }, []);

    return (
        <>
            <div className="nav-wrapper">
                <Nav className="nav--no-borders flex-column">
                    {navItems &&
                    navItems.map((item, idx) => (
                        <SidebarNavItem
                            key={idx}
                            item={item}
                            disabledData={props.eventData}
                            avatarData={props.avatarData}
                        />
                    ))}
                </Nav>
                <div
                    style={{
                        fontSize: "12px",
                        textAlign: "center",
                    }}
                    className="fixed-bottom"
                >
                    Copyright@{moment(Date.now()).format("YYYY")} gage.
                    <img src={mainLogo} alt="" width="90%" className="mt-3"/>
                </div>
            </div>
        </>
    );
};

export default SidebarNavItems;
