# Table of contents

- [Table of contents](#table-of-contents)
- [About our project](#about-our-project)
  - [The application](#the-application)
    - [Versions](#versions)
    - [Installation guides](#installation-guides)
    - [Testing](#testing)
    - [Guide to running component tests](#guide-to-running-component-tests)
    - [Guide to running snapshot tests](#guide-to-running-snapshot-tests)
    - [Guide to running end to end tests](#guide-to-running-end-to-end-tests)
    - [Guide to running backend tests](#guide-to-running-backend-tests)
    - [Information about client and server](#information-about-client-and-server)
    - [Folder structure](#folder-structure)
    - [Resolver structure](#resolver-structure)
    - [Schema structure](#schema-structure)
    - [Release info](#release-info)
  - [Our team](#our-team)
  - [Use of AI](#use-of-ai)

# About our project
Link to the project:

[it2810-02.idi.ntnu.no/project2/](http://it2810-02.idi.ntnu.no/project2/)

*(remember to use a VPN when you are not connected to eduroam)*

## The application

In our application the user can find food recipes. The user can select categories and the page will filter the displayed recipes based on this. Additionaly, the user can sort recipes alphabetically ascending or descending. It also has a randomizer button that takes the user to a random recipe, to give the user some inspiration as to what to cook.

The application also has a search function, that searches based on the user's input in the search field. The search function has its own page, to separate it from other filters and sorting to make it look cleaner and easier to use. Sorting search results alphabetically or filtering based on category would not lead to the best results for the user, as they already get the most relevant data at the top from their search input. This would not be the case anymore after sorting or filtering.

### Versions

- npm 11.06
- node v22.19.0
- Vite 7.1.7
- React 19.1.1
- MongoDB 6.20.0
- GraphQL 16.11.0

### Installation guides
To load the page with the complete dataset locally, the user needs to have two terminals open.

In one of the terminals run:
```cd server``` to change directory to the server folder
```npm install``` to download necessary dependencies
```npm run start``` start the server normally and is used in production (with changes this need to be restarted manually to take effect)

Thereafter, open a new terminal and run:
```cd client``` to change directory to client
```npm install``` to download necessary dependencies
```npm run dev``` to run the app

Running ```npm install``` before running the application will install all Redux dependencies, but if they won't install you can run the following commands to install them:

```cd client```

```npm install @reduxjs/toolkit react-redux```

If the user wants to create an instance of the app, run ```npm run build```

### Testing
It is written end to end tests, component tests, snapshot tests and backend tests for the project. More information about all of these types of tests can be found in the [release](./docs/release4.md#code-quality) file.

### Guide to running component tests
```cd client``` (if not in client directory already)

```npm run test``` to run component tests

### Guide to running snapshot tests

- ```npm run test``` to run snapshot tests (in /client directory)

If you have intentionally changed the html of your component you will need to update the snapshots or the test will fail

- ```npm run test -- -u``` to run tests and update snapshots

### Guide to running end to end tests

To run the e2e tests the user have to run ```npm run start``` in the server folder, and ```npm run dev``` in the client folder.

The tests can be run in a new terminal (you should now have three terminals open in total) using the following commands:

```cd client``` (if not in client directory already)

```npx playwright install``` (installing browser binary as this cannot automatically be installed using npm i)

```npm install @axe-core/playwright``` (installing tool for automated accessibility testing)

```npm run test:e2e``` (running e2e test normally)

```npm run test:e2e-ui``` (getting interface for better debugging of tests)

For the tests to run, the user must be connected to the eduroam network or VPN.

This same guide can be found in the [release](./docs/final_release.md) file, as well as additional information about the testing implementation.

### Guide to running backend tests
```cd server```(if not in server directory already)
```npm run test``` (running backend tests)

This and additional information about backend tests can be found in the [release](./docs/release4.md#backend-tests) file.

### Information about client and server

For more information about the client and server, and guide to running tests and lint (only client) see:

- [Client info](/docs/info_client.md)
- [Server info](/docs/info_server.md)

### Folder structure
```
T02-PROJECT-2/
├── client/               
│   ├── src/
│   │   ├── assets/        
│   │   ├── components/   
│   │   │   ├── CategoryCard/
│   │   │   ├── CommentForm/
│   │   │   ├── CommentSection/
│   │   │   ├── EmblaCarousel/
│   │   │   ├── Footer/
│   │   │   ├── Navbar/
│   │   │   ├── RecipeCard/
│   │   │   ├── RecipeGrid/
│   │   │   └── GridInteractions/
│   │   ├── data/
│   │   ├── hooks/           
│   │   ├── pages/      
│   │   │   ├── RecipeOverview/
│   │   │   ├── SearchPage/
│   │   │   ├── SingleRecipe/
│   │   ├── store/
│   │   ├── types/      
│   │   ├── utils/         
│   │   ├── App.tsx     
│   │   ├── main.tsx            
│   │   └── index.html        
│
├── server/                
│   ├── src/
│   │   ├── cache/ 
│   │   ├── config/      
│   │   │   └── db.js
│   │   └── graphql/    
│   │       ├── schema.js
│   │       ├── resolvers.js
│   │       └── index.js
│   │   └── types/ 
│
├── docs/              
```

### Resolver structure
The resolver is divided into "meal related" and "comment related" functions.
Meal related resolver functions decide how to fetch the meals from the database. When the page is loaded, the dataset is sorted alphabetically. The same resolver function is written to support pagination in backend, but this is not implemented yet.

It also handles search functionality using regular expression in the fetching.

Comment related functions handle getting all comments related to a recipe, sorting the comments based on date and adding comments.

### Schema structure
The schema is divided into three types: Meal, Comment and CommentSection.
The Meal type defines how a Meal object looks in the API. The Comment type is a comment connected to a recipe, and the CommentSection type collects single comments for a recipe.

There is also a Query type. This defines all the functions that can fetch data.

The last type is Mutation. This defines methods that can alter data.

### Release info

We have placed information about changes implemented with each release in separate files. Link to these below.

- [Release 1](./docs/release1.md)
- [Release 2](./docs/release2.md)
- [Release 3](./docs/release3.md)
- [Release 4](./docs/release4.md)

## Our team

Our team consist of informatics students. Gina is a second year student and have previous experience with HTML, CSS and JS. Ida, Arild and Ingvild are third year students and have some experience using React/next.js and fetching info from databases.

## Use of AI

AI tools were used mainly as learning and debugging assistants. We intentionally limited the use of AI in this project to ensure we learned React and TypeScript properly, as this is our first project using these technologies. The core application logic, structure, and features were written by us to gain hands-on experience and a full understanding of the tools and concepts involved. As we progressed in the project we started using AI generated code when we felt we could understand what was written. 

AI was used to:
- help explain errors
- resolve TypeScript issues
- support our testing process especially with helping writing mock tests, and debugging failing tests. 
- build the code for the image carousel.

Any AI-generated code included in the project is clearly marked with "AI GEN" comments for transparency.

The tools used were mainly Chat GPT and Copilot.