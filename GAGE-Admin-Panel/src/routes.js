import React from "react";
import {Redirect} from "react-router-dom";
// Layout Types
import {DefaultLayout, EventSelectLayout} from "./layouts";
// Route Views
import AddNewPost from "./views/AddNewPost";
import AddQuestions from "./views/AddQuestions";
import EditQuestions from "./views/EditQuestions";
import ActivateQuestion from "./views/ActivateQuestion";
import Report2 from "./views/Report2"
import Login from "./views/Login"
import DragableQuestions from "./views/DragableQuestions";
import UserDetail from "./views/UserDetail";
import AvatarTables from "./views/AvatarTables";
import EventSelect from "./views/EventSelect";
import EventInfo from "./views/EventInfo";
import ThemeSelection from "./views/ThemeSelection";
import Competencies from "./views/Competencies";
import AvatarSelection from "./views/AvatarSelection";
import Voting from "./views/Voting";
import VotingReport from "./views/VotingReport";
import SignUpFlow from "./views/sign-upFlow";
import SignUp from "./views/signUp";
import Users from "./views/users";

export default [
    {
        path: "/",
        exact: true,
        layout: DefaultLayout,
        component: () => <Redirect to="/login-user"/>
    },
    {
        path: "/eventselect",
        exact: true,
        layout: EventSelectLayout,
        component: EventSelect,

    },
    {
        path: "/users",
        exact: true,
        layout: EventSelectLayout,
        component: Users,

    },
    {
        path: "/usersInfo/:eid",
        layout: DefaultLayout,
        component: UserDetail
    },
    {
        path: "/login-user",
        layout: Login,
        component: Login
    },
    {
        path: "/signUp",
        layout: SignUp,
        component: SignUp
    },
    {
        path: "/dragablequestions/:eid",
        layout: DefaultLayout,
        component: DragableQuestions
    },

    {
        path: "/add-new-post",
        layout: DefaultLayout,
        component: AddNewPost
    },
    {
        path: "/editQuestions/:id",
        layout: DefaultLayout,
        component: EditQuestions
    },

    {
        path: "/AddQuestions/:eid",
        layout: DefaultLayout,
        component: AddQuestions
    },

    {
        path: "/avatarInfo/:eid",
        layout: DefaultLayout,
        component: AvatarTables
    },

    {
        path: "/activequestion",
        layout: DefaultLayout,
        component: ActivateQuestion,
    },

    {
        path: "/copyQuestions",
        layout: DefaultLayout,
        component: Report2,
    },

    {
        path: "/eventInfo/:eid",
        layout: DefaultLayout,
        component: EventInfo,
    },
    {
        path: "/themeselection/:eid",
        layout: DefaultLayout,
        exact: true,
        component: ThemeSelection,
    },
    {
        path: "/competencies/:eid",
        layout: DefaultLayout,
        component: Competencies,
    },
    {
        path: "/avatar/:eid",
        layout: DefaultLayout,
        component: AvatarSelection,
    },
    {
        path: "/voting/:eid",
        layout: DefaultLayout,
        component: Voting
    },
    {
        path: "/votingReports/:eid",
        layout: DefaultLayout,
        component: VotingReport
    },
    {
        path: "/signUpFlow/:eid",
        layout: DefaultLayout,
        component: SignUpFlow
    }
];
