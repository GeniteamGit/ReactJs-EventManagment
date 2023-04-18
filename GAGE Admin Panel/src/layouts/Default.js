import React from "react";
import PropTypes from "prop-types";
import {Col, Container, Row} from "shards-react";

import MainNavbar from "../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../components/layout/MainFooter";

const DefaultLayout = ({children, noNavbar, noFooter, eventData, avatarData, setEventData, setMainEventId, setOpenModal, mainEventId, setAvatarData, user}) => (
    <Container fluid>
        <Row>
            <MainSidebar eventData={eventData} avatarData={avatarData} setEventData={setEventData}
                         setMainEventId={setMainEventId}/>
            <Col
                className="main-content p-0"
                lg={{size: 10, offset: 2}}
                md={{size: 9, offset: 3}}
                sm="12"
                tag="main"
            >
                {!noNavbar &&
                <MainNavbar eventData={eventData} setEventData={setEventData} setOpenModal={setOpenModal} user={user}
                            mainEventId={mainEventId} setMainEventId={setMainEventId} setAvatarData={setAvatarData}/>}
                {children}
                {!noFooter && <MainFooter/>}
            </Col>
        </Row>
    </Container>
);

DefaultLayout.propTypes = {
    /**
     * Whether to display the navbar, or not.
     */
    noNavbar: PropTypes.bool,
    /**
     * Whether to display the footer, or not.
     */
    noFooter: PropTypes.bool
};

DefaultLayout.defaultProps = {
    noNavbar: false,
    noFooter: false
};

export default DefaultLayout;
