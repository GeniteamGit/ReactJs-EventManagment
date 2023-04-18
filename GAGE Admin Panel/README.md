## Admin Dashboard React.js | GAGE Admin Panel

### Installation


### Introduction

<h3 align="center">Gage Admin Panel!</h3>
Gage is an employee and group engagement tool designed to deliver insights while creating a shared experience.
Gage transforms team gatherings, surveys and poll taking into an interactive shared experience, while providing valuable
insights and analytics so you can learn more about your people.The product is owned by Activ8 Games & developed by Geniteam as sole development partner. This product was used in
Local & international conferences online at various levels. <br>
Admin Panel is used to set up the events and its settings including questions and voting.

### Features

<ol>
<li>Login/Signup</li>
<li>Event creation</li>
<li>Event Details</li>
<li>Event Avatar Flow</li>
<li>Event Questions</li>
<li>Event Voting</li>
<li>Event Reports</li>
<li>Event Analysis for Audience & Surveys etc</li>
</ol>

### Main Technologies/Libraries Used

<ul>
<li>React.js</li>
<li>Firebase</li>
<li>Flux</li>
<li>Bootstrap</li>
<li>cross-env</li>
<li>lodash</li>
<li>moment</li>
<li>reactstrap</li>
<li>react-chartjs-2</li>
<li>react-data-table-component</li>
<li>react-csv</li>
<li>react-datetime</li>
<li>react-image-crop</li>
<li>react-notifications</li>
<li>react-quill</li>
<li>react-switch</li>
<li>shards-react</li>
<li>shortid</li>
<li>styled-components</li>
<li>sweetalert2</li>
</ul>

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### 🗄️ Project Structure
Most of the code lives in the `src` folder and looks like this:
````
GAGE Admin/ 
├─ assets/ 
├─ public/ 
├─ src/ 
│ ├─ App.js 
│ ├─ index.js 
│ ├─ routes.js 
│ ├─ components/ 
│ │ ├─ layout/ 
│ │ │ ├─ MainNavbar/ 
│ │ │ │ ├─ NavbarNav/ 
│ │ │ │ │ ├─ UserActions.js 
│ │ │ │ │ ├─ NavbarNav.js 
│ │ │ │ ├─ MainNavbar.js 
│ │ │ │ ├─ NavbarSearch.js 
│ │ │ │ ├─ NavbarToggle.js 
│ │ │ ├─ MainSidebar/ 
│ │ │ │ ├─ MainSidebar.js 
│ │ │ │ ├─ SidebarMainNavbar.js 
│ │ │ │ ├─ SidebarNavItem.js 
│ │ │ │ ├─ SidebarNavItems.js 
│ │ │ ├─ MainFooter.js 
│ │ ├─ reuseable/ 
│ │ │ ├─ cropImage.jsx 
│ │ │ ├─ customInput.jsx 
│ │ │ ├─ customSidebar.jsx 
│ │ │ ├─ popupForm.jsx 
│ ├─ data/ 
│ │ ├─ sidebar-nav-items.js 
│ ├─ flux/ 
│ │ ├─ constants.js 
│ │ ├─ dispatcher.js 
│ │ ├─ index.js 
│ │ ├─ store.js 
│ ├─ images/ 
│ ├─ layouts/ 
│ │ ├─ Default.js 
│ │ ├─ EventSelect.jsx 
│ │ ├─ index.js 
│ ├─ shards-dashboard/ 
│ ├─ utils/ 
│ │ ├─ chart.js 
│ │ ├─ constants.json 
│ ├─ views/ 
│ │ ├─ AddQuestions.js 
│ │ ├─ AvatarSelection.js 
│ │ ├─ AvatarTables.js 
│ │ ├─ Competencies.js 
│ │ ├─ DragableQuestions.js 
│ │ ├─ EditQuestions.js 
│ │ ├─ EventSelect.js 
│ │ ├─ ItemScreen.js 
│ │ ├─ ItemSignupFlow.js 
│ │ ├─ listItem.js 
│ │ ├─ Login.js 
│ │ ├─ Report.js 
│ │ ├─ signUp.jsx 
│ │ ├─ sign-upFlow.jsx 
│ │ ├─ ThemeSelection.js 
│ │ ├─ UserDetail.js 
│ │ ├─ users.jsx 
│ │ ├─ Voting.js 
│ │ ├─ VotingReport.jsx 
│ ├─ App.css 
├─ .gitignore 
├─ package.json 
````