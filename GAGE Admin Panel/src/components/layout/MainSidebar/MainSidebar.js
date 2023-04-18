import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {Col} from "shards-react";

import SidebarMainNavbar from "./SidebarMainNavbar";
import SidebarNavItems from "./SidebarNavItems";

import {Store} from "../../../flux";

const MainSidebar = ({hideLogoText, eventData, avatarData, setEventData, setMainEventId}) => {
    const [menuVisible, setMenuVisible] = useState(Store.getMenuState());
    const [sidebarNavItems, setSidebarNavItems] = useState(Store.getSidebarItems());

    useEffect(() => {
        
        Store.addChangeListener(() => {
            setMenuVisible(Store.getMenuState());
            setSidebarNavItems(Store.getSidebarItems());
        });
        return () => {
            Store.removeChangeListener(() => {
                setMenuVisible(Store.getMenuState());
                setSidebarNavItems(Store.getSidebarItems());
            });
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
            <SidebarMainNavbar hideLogoText={hideLogoText} setEventData={setEventData} setMainEventId={setMainEventId}/>
            <SidebarNavItems eventData={eventData} avatarData={avatarData}/>
        </Col>
    );
};

MainSidebar.propTypes = {
    hideLogoText: PropTypes.bool,
    eventData: PropTypes.array,
    avatarData: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
    })
};

export default MainSidebar;
