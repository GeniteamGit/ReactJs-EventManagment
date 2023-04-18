import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {NavItem, NavLink} from "shards-react";
import {Dispatcher} from "../../../flux";
import ThemeSelection from "../../../images/newUI/icons/theme-selction.png";
import ThemeSelectionWhite from "../../../images/newUI/icons/theme-selctionWhite.png";
import Profile from "../../../images/newUI/icons/avatar-flow-screen.png";
import ProfileWhite from "../../../images/newUI/icons/avatar-flow-screenWhite.png";
import SuperPowers from "../../../images/newUI/icons/super-power.png";
import SuperPowersWhite from "../../../images/newUI/icons/super-powerWhite.png";
import Questions from "../../../images/newUI/icons/questions.png";
import QuestionsWhite from "../../../images/newUI/icons/questionsWhite.png";
import Voting from "../../../images/newUI/icons/voting.png";
import VotingWhite from "../../../images/newUI/icons/votingWhite.png";
import SignupOptions from "../../../images/newUI/icons/sign-up.png";
import SignupOptionsWhite from "../../../images/newUI/icons/sign-upWhite.png";
import users from "../../../images/newUI/icons/team-icon.png"
import usersWhite from "../../../images/newUI/icons/team-icon-w.png";

const SidebarNavItem = ({item, disabledData, avatarData}) => {

    const imageSources = {
        "Theme Selection": ThemeSelection,
        "Theme SelectionWhite": ThemeSelectionWhite,
        "Profile": Profile,
        "ProfileWhite": ProfileWhite,
        "Super Powers": SuperPowers,
        "Super PowersWhite": SuperPowersWhite,
        "Voting": Voting,
        "VotingWhite": VotingWhite,
        "Questions": Questions,
        "QuestionsWhite": QuestionsWhite,
        "Sign up Options": SignupOptions,
        "Sign up OptionsWhite": SignupOptionsWhite,
        "Users": users,
        "UsersWhite": usersWhite,
        "User Profile Details": Profile,
        "User Profile DetailsWhite": ProfileWhite,
        "Voting Reports": Voting,
        "Voting ReportsWhite": VotingWhite
    }

    useEffect(() => {
        // 
        // 
    }, [])
    const disable = () => {
        if (
            item.title === "Theme Selection" &&
            disabledData.hasOwnProperty("eventName")
        ) {
            return false;
        }
    };
    const handleClick = (_item) => {
        const activeLink = localStorage.getItem("activeLink");
        
        // localStorage.setItem("activeLink", prevLink);
        // localStorage.setItem("prevLink", activeLink);
        localStorage.setItem("prevLink", localStorage.getItem("activeLink"));
        localStorage.setItem("activeLink", _item.title);
        
        Dispatcher.dispatch({
            actionType: "activeLinkCurrent",
            payload: _item.title
        });
        Dispatcher.dispatch({
            actionType: "activeLinkPrev",
            payload: activeLink
        });
    }


    return (
        <NavItem>
            <NavLink
                className={localStorage.getItem("activeLink") === item.title ? "sidebarItem" : "inactiveDashboard"}
                disabled={
                    item.title === "Users"
                        ? false
                        : item.title === "User Profile Details"
                        ? false
                        : item.title === "Voting Reports"
                            ? false
                            : item.title === "Sign-up Options" && disabledData.hasOwnProperty("eventName")
                                ? false
                                : item.title === "Theme Selection" &&
                                disabledData.hasOwnProperty("eventName")
                                    ? false
                                    : item.title === "Profile" &&
                                    disabledData.hasOwnProperty("themeSelected")
                                        ? false
                                        : item.title === "Event Info"
                                            ? false
                                            : item.title === "Super Powers" &&
                                            // avatarData.hasOwnProperty("avatarScreen") ||
                                            disabledData?.profileStatus === false || avatarData.hasOwnProperty("avatarScreen")
                                                ? false
                                                : item.title === "Voting" &&
                                                avatarData.hasOwnProperty("competencyScreen")
                                                    ? false
                                                    : !(item.title === "Questions" &&
                                                        avatarData.hasOwnProperty("surveyScreen"))

                }
                tag={Link}
                to={item.to}
                onClick={() => handleClick(item)}
            >
                <div className="d-inline-block item-icon-wrapper">
                    <img
                        src={localStorage.getItem("activeLink") === item.title ? imageSources[item.title + "White"] : imageSources[item.title]}
                        alt="" width={20}/>
                </div>
                {item.title && <span className="ms-4">{item.title}</span>}
                {item.htmlAfter && (
                    <div
                        className="d-inline-block item-icon-wrapper"
                        dangerouslySetInnerHTML={{__html: item.htmlAfter}}
                    />
                )}
            </NavLink>
        </NavItem>
    );
};
export default SidebarNavItem;
