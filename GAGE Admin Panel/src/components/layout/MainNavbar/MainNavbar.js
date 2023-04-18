import React, {useState} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {Navbar, Tooltip} from "shards-react";
import NavbarNav from "./NavbarNav/NavbarNav";
import {Col, Row} from "reactstrap";
import copyLink from "../../../images/newUI/icons/copy-link.png";
import openLink from "../../../images/newUI/icons/open-link.png";

const MainNavbar = ({layout, stickyTop, eventData, setEventData, mainEventId, setAvatarData, setMainEventId, user}) => {
    const [linkTooltip, setLinkTooltip] = useState(null);
    const [copyTooltip, setCopyTooltip] = useState(null);
    const [tooltipText, setTooltipText] = useState('Copy Link');
    const classes = classNames(
        "main-navbar",
        "bg-white",
        stickyTop && "sticky-top"
    );

    const linkTooltipToggle = (_value) => {
        
        if (linkTooltip !== null)
            setLinkTooltip(null);
        else
            setLinkTooltip(_value);
    }
    const handleCopy = (link, ref) => {
        
        navigator.clipboard.writeText(link);
        setCopyTooltip(ref);
        setTooltipText('Copied!');
        setTimeout(() => {
            setCopyTooltip(null);
            setTooltipText('Copy Link');
        }, 1000);
    };
    const copyTooltipToggle = (_value) => {
        
        if (copyTooltip !== null)
            setCopyTooltip(null);
        else
            setCopyTooltip(_value);
    }

    return (
        <div className={classes}>
            <div className="p-0">
                <Navbar type="light" className="p-0 d-flex">
                    {/* <NavbarSearch /> */}
                    {mainEventId ?
                        <Row style={{width: "70%", alignItems: "center"}}>
                            <Col lg={4} md={4}>
                                <h4 className="mb-0 ms-5 fw-bold text-nowrap">
                                    {eventData.eventName}
                                </h4>
                            </Col>
                            <Col lg={8} md={8}>
                                <Row>
                                    <Col className="px-0">
                                        <div className="d-flex align-items-center justify-content-end">
                                            <span className="textColor text-nowrap">Game Link:</span>
                                            <img src={copyLink} className="mx-3" height={20} role="button"
                                                 id="copyGameLink"
                                                 onClick={() => handleCopy("https://gagerelease5.web.app", "copyGameLink")}/>
                                            <Tooltip
                                                // placement="left"
                                                open={copyTooltip === "copyGameLink"}
                                                // open={linkTooltip === "gameCopy"}
                                                target="#copyGameLink"
                                                toggle={() => copyTooltipToggle("copyGameLink")}
                                                className=""
                                            >
                                                {tooltipText}
                                            </Tooltip>
                                            <a href={`https://gagerelease5.web.app`} target="_blank">
                                                <img src={openLink} height={20} role="button" id="openGameLink" alt=""/>
                                                <Tooltip
                                                    // placement="left"
                                                    open={linkTooltip === "openGameLink"}
                                                    // open={linkTooltip === "gameCopy"}
                                                    target="#openGameLink"
                                                    toggle={() => linkTooltipToggle("openGameLink")}
                                                    className=""
                                                >
                                                    Open link in new Tab
                                                </Tooltip>
                                            </a>
                                        </div>
                                    </Col>
                                    <Col className="px-0">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="textColor text-nowrap">Backend Link:</span>
                                            <img src={copyLink} className="mx-3" height={20} role="button"
                                                 id="copyBackendLink"
                                                 onClick={() => handleCopy(`https://gage-question.web.app?gamecode=${mainEventId}`, "copyBackendLink")}/>
                                            <Tooltip
                                                // placement="left"
                                                open={copyTooltip === "copyBackendLink"}
                                                // open={linkTooltip === "gameCopy"}
                                                target="#copyBackendLink"
                                                toggle={() => copyTooltipToggle("copyBackendLink")}
                                                className=""
                                            >
                                                {tooltipText}
                                            </Tooltip>
                                            <a href={`https://gage-question.web.app?gamecode=${mainEventId}`}
                                               target="_blank">
                                                <img src={openLink} height={20} role="button" id="openBackendLink"/>
                                                <Tooltip
                                                    // placement="left"
                                                    open={linkTooltip === "openBackendLink"}
                                                    // open={linkTooltip === "gameCopy"}
                                                    target="#openBackendLink"
                                                    toggle={() => linkTooltipToggle("openBackendLink")}
                                                    className=""
                                                >
                                                    Open link in new Tab
                                                </Tooltip>
                                            </a>
                                        </div>
                                    </Col>
                                    <Col className="px-0">
                                        <div className="d-flex align-items-center justify-content-start">
                                            <span className="textColor text-nowrap">Reports:</span>
                                            <img src={copyLink} className="mx-3" height={20} role="button"
                                                 id="copyReportLink"
                                                 onClick={() => handleCopy(`https://gage-admin.web.app/usersInfo/${mainEventId}`, "copyReportLink")}
                                                 alt=""/>
                                            <Tooltip
                                                open={copyTooltip === "copyReportLink"}
                                                target="#copyReportLink"
                                                toggle={() => copyTooltipToggle("copyReportLink")}
                                                className=""
                                            >
                                                {tooltipText}
                                            </Tooltip>
                                            <a href={`/usersInfo/${mainEventId}`} onClick={() => {
                                                localStorage.setItem("activeLink", "Users");
                                                localStorage.setItem("prevLink", "Select an Event");
                                                localStorage.setItem("eventId", mainEventId);
                                                localStorage.getItem("eventId");
                                                localStorage.setItem("report", true);
                                                localStorage.setItem("dashboard", false);
                                            }}
                                               target="_blank">
                                                <img src={openLink} height={20} role="button" id="openReportLink"/>
                                                <Tooltip
                                                    // placement="left"
                                                    open={linkTooltip === "openReportLink"}
                                                    // open={linkTooltip === "gameCopy"}
                                                    target="#openReportLink"
                                                    toggle={() => linkTooltipToggle("openReportLink")}
                                                    className=""
                                                >
                                                    Open link in new Tab
                                                </Tooltip>
                                            </a>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> :
                        <div style={{width: "70%"}}>
                            <h4 className="mb-0 ms-5 fw-bold text-nowrap">{localStorage.getItem("activeLink")}</h4>
                        </div>
                    }
                    {/*<div>*/}
                    <NavbarNav eventData={eventData} setEventData={setEventData}
                               user={user}
                               setMainEventId={setMainEventId} setAvatarData={setAvatarData}
                               mainEventId={mainEventId}/>
                    {/*<NavbarToggle/>*/}
                    {/*</div>*/}
                </Navbar>
            </div>
        </div>
    );
};

MainNavbar.propTypes = {
    /**
     * The layout type where the MainNavbar is used.
     */
    layout: PropTypes.string,
    /**
     * Whether the main navbar is sticky to the top, or not.
     */
    stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
    stickyTop: true
};

export default MainNavbar;
