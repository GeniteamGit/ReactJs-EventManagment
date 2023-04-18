import ThemeSelection from "../images/newUI/icons/theme-selction.png";
import Profile from "../images/newUI/icons/avatar-flow-screen.png";
import SuperPowers from "../images/newUI/icons/super-power.png";
import Questions from "../images/newUI/icons/questions.png";
import Voting from "../images/newUI/icons/voting.png";
import reports from "../images/newUI/icons/reports.png";
import SignupOptions from "../images/newUI/icons/sign-up.png";

export default function (a, b, c) {
  
// if(c == "true"){
//   return [
//     {
//       title: "Dashboard",
//       htmlBefore: '<i class="fas fa-home text-dark"/>',
//     }
//   ]
// }
//   if(c == "true"){
//     return [
//       {
//         title: "Dashboard",
//         htmlBefore: '<i class="fas fa-home text-dark"/>',
//       }
//     ]
//   }
 if (b ==  "true") {
    return [
      {
        title: "Users",
        htmlBefore: '<i class="fas fa-users text-dark"></i>',
        to: `/usersInfo/${localStorage.getItem("eventId")}`,

      },
      {
        title: "User Profile Details",
        htmlBefore: '<i  class="fas fa-info-circle  text-success "  > </i>',
        to: `/avatarInfo/${localStorage.getItem("eventId")}`,

      },
      {
        title: "Voting Reports",
        htmlBefore: `<img alt="" src=${reports} width="30" class="sidebarImage"/>`,
        to: `/votingReports/${localStorage.getItem("eventId")}`,

      },
    ];
  } else if(b == "false"){
    return [
      // {
      //   title: "Event Info",
      //   htmlBefore: `<img alt="" src=${eventInfo} width="30" class="sidebarImage"/>`,
      //   // htmlBefore: '<i class="material-icons">report</i>',
      //   to: `/eventInfo/${a}`,
      // },
      {
        title: "Theme Selection",
        htmlBefore: `<img alt="" src=${ThemeSelection}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/themeselection/${a}`,
      },
      {
        title: "Profile",
        htmlBefore: `<img alt="" src=${Profile}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/avatar/${a}`,
      },
      {
        title: "Super Powers",
        htmlBefore: `<img alt="" src=${SuperPowers}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/competencies/${a}`,
      },
      {
        title: "Voting",
        htmlBefore: `<img alt="" src=${Voting}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/voting/${a}`,
      },
      {
        title: "Questions",
        htmlBefore: `<img alt="" src=${Questions}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/dragablequestions/${a}`,
      },
      {
        title: "Sign up Options",
        htmlBefore: `<img alt="" src=${SignupOptions}  class="sidebarImage"/>`,
        // htmlBefore: '<i class="material-icons">report</i>',
        to: `/signUpFlow/${a}`,
      }
    ];
  }
  // return [
  // {
  //   title: "View Questions",
  //   htmlBefore: '<i class="fas fa-eye text-primary" ></i>',
  //   to: "/viewquestions",
  // },
  // {
  //   title: "Blog Dashboard",
  //   to: "/blog-overview",
  //   htmlBefore: '<i class="material-icons">edit</i>',
  //   htmlAfter: "",
  // },
  // {
  //   title: "Blog Posts",
  //   htmlBefore: '<i class="material-icons">vertical_split</i>',
  //   to: "/blog-posts",
  // },

  // {
  //   title: "Add New Post",
  //   htmlBefore: '<i class="material-icons">note_add</i>',
  //   to: "/add-new-post",
  // },
  // {
  //   title: "Forms & Components",
  //   htmlBefore: '<i class="material-icons">view_module</i>',
  //   to: "/components-overview",
  // },
  ////required
  // {
  //   title: "User Avatar Details",
  //   htmlBefore: '<i  class="fas fa-info-circle  text-success "  > </i>',
  //   to: "/avatarInfo",

  // },
  ////required
  // {
  //   title: "Users",
  //   htmlBefore: '<i class="fas fa-users text-dark"></i>',
  //   to: "/usersInfo",
  // },
  // {
  //   title: "User Profile",
  //   htmlBefore: '<i class="material-icons">person</i>',
  //   to: "/user-profile-lite",
  // },
  // {
  //   title: "Errors",
  //   htmlBefore: '<i class="material-icons">error</i>',
  //   to: "/errors",
  // },

  // {
  //   title: "Edit Questions",
  //   htmlBefore: '<i class="material-icons">view_module</i>',
  //   to: "/editQuestions",
  // },

  // {
  //   title: "Add Questions",
  //   htmlBefore: '<i class="material-icons">edit</i>',
  //   to: "/AddQuestions",
  // },
  ////required

  // {
  //   title:"Question Report",
  //   htmlBefore: '<i class="material-icons">report</i>',
  //   to: "/viewquestions",
  // }

  // ];
}
