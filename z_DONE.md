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
[x] Integrate websocket connection into server startu
**Create messaging between the clients and the backend**

[x] Küldhessen a cliens üzenetet a szerverre
[x] If I refresh it disconnects connection
[x] Resend emailt after refresh
[x] When sending the message, always append the sender's email to it on the frontend and console.log it on the backend.
[x] Store from which client-email the message came from and console.log it with the message receivedp
[x] Use 22.08.0 permanently
[x] Use indicator for websocket connection indicator

**Build up versatile websocket connection**

[x] Copy the existing logic so more than one client can connect
[x] Send the To clients email to the backend
[x] Store them in the backend

[x] On delete remove the client's email from the array
[x] Connect to the server only after login, not when opening the website in the browser
[x] Fix new connection opening after logout.

**Update message sending logic with name**

[x] Change user db to include name!!!
[x] After login get the name as well
[x] Save name to session storage
[x] Send name with the initial login data to the server
[x] Save the name as well in the users array

**List all clients on the left side**

[x] After login send down the usersStore to all clients
[x] Save the users data into a local variable upon receipt
[x] When the userStore data changes on the server, send down the updated userStore  to the client as well and update its local variable
[x] Subscribe to this data flow
[x] Display all but own user name

**Move Node backend from Railway to dotRoll**

[x] Register domain at dotroll
[x] Wait for domain approval
[x] Make sure SSL is live
[x] Set up Node test
[x] Set up nest.js test
[x] Set up Node backend and make it operational

**Initiating a chat with another client**

[x] Click option to open chat - change style + create activeChat variable and put the users email in it
[x] Create Message types
[x] Extract activePartner to a service
[x] When sending the message, include the recipient's email in the messageData
[x] Standardize message type across the application

**FIX**

[x] Fix not getting username from login problem
[x] Fix chat not working as when deployed
[x] Chat input field is only visible when a partner is selected

