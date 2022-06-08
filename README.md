# myCinemovieApp - "Cinemovie Database (myCMDb)
This app is created to build and use the server side functions of an internet application

Start: 31.05.21
<br>version: 0.4 / last modification: 08.06.21

## Objective
The documentation explains the individual functions and modules as well as their functionality with which the app is built.<br>
The app will give the user the possibility to access information about different movies, directors and actors.<br>
The user will also be able to log in to the app and enter personal information, change it and create a list of their favourite films.<br>

## Project Dependencies
This Project uses:
- HTML/CSS
- JavaScript
- Node.js
- Express

## Documentation - Link: [https://mycinemoviedatabase.herokuapp.com/documentation.html](https://mycinemoviedatabase.herokuapp.com/documentation.html)


## Feature Requirements
### Essential Features
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister
### Optional Features
- Allow users to see which actors star in which movies
- Allow users to view information about different actors
- Allow users to view more information about different movies, such as the release date and the movie rating
- Allow users to create a “To Watch” list in addition to their “Favorite Movies” list
## Technical Requirements
- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data operations listed above
- The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
- The API must use a “package.json” file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose./li>
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic./li>
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

