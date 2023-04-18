import React from "react";
import {Nav} from "shards-react";
import UserActions from "./UserActions";

export default ({eventData, setEventData, setOpenModal, mainEventId, setAvatarData, setMainEventId, user}) => (
    <Nav navbar className="border-left flex-row">
        {/*<Notifications />*/}
        <UserActions eventData={eventData} setEventData={setEventData} setOpenModal={setOpenModal}
                     setAvatarData={setAvatarData} setMainEventId={setMainEventId} user={user}
                     mainEventId={mainEventId}/>
    </Nav>
);
