**Initial Project Setup**

   [x] Set up Git repository with proper .gitignore

   [x] Connect GitHub repository to Github

   [X] Set up NestJS backend project in /backend folder without any functionality and with Vitest testing

   [X] Test that the service is running

   [x] Deploy the server and retest

   [x] Set up Vitest for unit testing

**Setup Frontend**

   [x] Create Angular frontend project with Angular CLI

   [x] Configure Tailwind CSS

   [x] Test Tailwinds configuration by simplifying the app component and styling it with Tailwind.

**Connect frontend to backend**

   [x] Test connection between the frontend and the backend by getting the message "Hello World!" from the backend and display it in the middle of the frontend main app component and style it with Tailwind.

**Frontend Login Basic Structure**

   [x] Create the following folders for the frontend: components, pages and services

   [x] Create a home page component and a chat page component

   [x] Add routing to the two new pages

   [x] Move the display of message coming from the backend from app to home component

**Websocket basic implementation**

   [x] Implement websocket in the backend folder using its node_modules only

   [x] Create a simple .ts file to test it mimicking the client

**Connect database to the backend**

   [x] Create a new Database and in it a Chat Collection 

   [x] Connect Mongo DB Atlas database from the backend

   [x] Place the db connection string into an env file, use it instead of directly using the api key and .gitignore the env file.

**Create Login**

   [x] Copy the php backend with auth endpoints

   [x] Create new mysql users_chat table 
   
   [x] Modify php validator for the new table 

   [x] Copy all relevant angular components and service into the project

   [x] Connect the frontend to the new php backend

**Create what happens after login, make a basic UI**

[x] Create basic dashboard structure 
[x] Create connection indicator as in earlier version - Use Behaviorsubject
[x] Add logout button
[x] Add logout to backend
[x] Integrate websocket connection into server startup
[x] Use 22.08.0 permanently
[x] Use indicator for websocket connection indicator

**Build up versatile websocket connection**

[x] Copy the existing logic so more than one client can connect
[x] Send the To clients email to the backend
[x] Store them in the backend

[x] On delete remove the client's email from the array
[x] Connect to the server only after login, not when opening the website in the browser
[x] Fix new connection opening after logout.