# MyFlix API

## Objective
To build the server-side component of a "movies" web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

## Context
In the modern JavaScript development landscape, proficiency in both frontend and backend development is crucial. This project involves creating a REST API for an application called "myFlix" that interacts with a database storing movie data. The next phase will involve building the client-side using React, culminating in a full-stack MERN (MongoDB, Express, React, Node.js) application. The project showcases mastery in full-stack JavaScript development, including APIs, web server frameworks, databases, business logic, authentication, and data security.

## User Stories
- **As a user**, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
- **As a user**, I want to be able to create a profile so I can save data about my favorite movies.

## Key Features
- Return a list of all movies to the user.
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title.
- Return data about a genre (description) by name/title (e.g., "Thriller").
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

## Technical Requirements
- The API must be a Node.js and Express application.
- The API must use REST architecture with URL endpoints corresponding to data operations listed above.
- The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
- The API must use a "package.json" file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

## Project Deliverables
###  Exercise 1
- Set up your project directory.
### Exercise 2: Node.js Modules
- Practice writing Node.js syntax.
### Exercise 3: Packages & Package Managers
- Create a "package.json" file.
- Import all necessary packages into project directory.
- Define your project dependencies.
### Exercise 4: Web Server Frameworks & Express
- Route HTTP requests for your project using Express.
### Exercise 5: REST & API Endpoints
- Define the endpoints for your REST API.
### Exercise 6: Relational Databases & SQL
- Create a relational (SQL) database for storing movie data using PostgreSQL.
### Exercise 7: Non-Relational Databases & MongoDB
- Recreate your relational (SQL) database as a non-relational (NoSQL) database using MongoDB.
### Exercise 8: The Business Logic Layer
- Model your business logic using Mongoose.
### Exercise 9: Authentication & Authorization
- Implement authentication and authorization into your API using basic HTTP authentication and JWT (token-based) authentication.
### Exercise 10: Data Security, Validation, & Ethics
- Incorporate data validation logic into your API.
- Implement data security and storage controls.
- Host your project on the web using Heroku.

## Installation
1. **Clone the repository**: git clone https://github.com/devmcdonough/my-first-package.git
2. **Install dependencies**: npm install
3. **Install required dependencies**:
- "bcrypt": "^5.1.1",
- "body-parser": "^1.20.2",
- "cors": "^2.8.5",
- "express": "^4.18.2",
- "express-validator": "^7.0.1",
- "jsonwebtoken": "^9.0.2",
- "lodash": "^4.17.21",
- "mongoose": "^8.1.3",
- "morgan": "^1.10.0",
- "passport": "^0.7.0",
- "passport-jwt": "^4.0.1",
- "passport-local": "^1.0.0",
- "uuid": "^9.0.1"
- "nodemon": "^3.0.3"
  
## Contributing
1. **Fork the repository**
2. **Create a new branch**:
git checkout -b feature/new-feature
3. **Make your changes and commit them**:
git commit -m "Add new feature"
4. **Push to the branch**:
git push origin feature/new-feature
5. **Create a pull request**

## License
This project is licensed under the ISC License

## Acknowledgements
Node.js
Express
MongoDB
Mongoose
Passport
Heroku# 