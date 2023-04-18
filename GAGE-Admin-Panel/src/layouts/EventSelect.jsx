import React from "react";
import PropTypes from "prop-types";
import {Col, Container, Row} from "shards-react";
import CustomSidebar from "../components/re-usable/customSidebar";

const EventSelectLayout = ({children, noNavbar, noFooter, eventData, avatarData, user, setEventData, setMainEventId, setAvatarData}) => (
    <Container fluid>
        <Row>
            <CustomSidebar eventData={eventData} avatarData={avatarData} user={user} setEventData={setEventData}
                           setMainEventId={setMainEventId} setAvatarData={setAvatarData}/>
            {/*<MainSidebar eventData={eventData} avatarData={avatarData}/>*/}
            <Col
                className="main-content p-0"
                lg={{size: 10, offset: 2}}
                md={{size: 9, offset: 3}}
                sm="12"
                tag="main"
            >
                {/*{!noNavbar && <MainNavbar />}*/}
                {children}
                {/*{!noFooter && <MainFooter />}*/}
            </Col>
        </Row>
    </Container>
);

EventSelectLayout.propTypes = {
    /**
     * Whether to display the navbar, or not.
     */
    noNavbar: PropTypes.bool,
    /**
     * Whether to display the footer, or not.
     */
    noFooter: PropTypes.bool
};

EventSelectLayout.defaultProps = {
    noNavbar: false,
    noFooter: false
};

export default EventSelectLayout;
