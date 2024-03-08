const express = require('express');
    bodyParser = require('body-parser');
    uuid = require('uuid');
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');

    const app = express();

    app.use(bodyParser.json());

//Requires mongoose in project
const mongoose = require('mongoose');

// Imports models created in models.js
const Models = require('.js/models.js');

const { check, validationResult } = require('express-validator');

// Refers to specific model names created in models.js
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// Allows mongoose to connect to the cfDB local database
// mongoose.connect('mongodb://localhost:27017/cfDB', 
// { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect(process.env.CONNECTION_URI, 
{ useNewUrlParser: true, useUnifiedTopology: true});

// Logging
app.use(morgan('common'));

// Imports mongoose data models from models.js
// let Movie = mongoose.model('Movie', movieSchema);
// let User = mongoose.model('User', userSchema);

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];

const cors = require('cors');
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) 
            return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1) { //If a specific origin isn't found on the list of allowed origins
    let message = 'The CORS policy for this app does not allow access from origin ' + origin;
    return callback(new Error(message ), false);
    }
    return callback(null, true);
    }
}));

let auth = require('./js/auth.js')(app);
const passport = require('passport');
require('./js/passport.js');

// Route to home
app.get('/', (req, res) => {
    res.send('Where are all the movies about sand? Our finest material.');
});

// Gets data of all movies
app.get('/movies', async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Gets data of one movie
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const movie = tenMovies.find((movie) => movie.title === req.params.title);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
    });

// Return data about a genre by name/description
app.get('/movies/genre/:genre', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const filteredMovies = tenMovies.filter((movie) => movie.genre === req.params.genre);
    if (filteredMovies.length > 0) {
        res.json(filteredMovies);
    } else {
        res.status(404).send('Genre not found')
    }
});

// Return data about a director by name
app.get('/movies/directors/:director', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const filteredMovies = tenMovies.filter((movie) => movie.director === req.params.director);
    if (filteredMovies.length > 0) {
        res.json(filteredMovies);
    } else {
        res.status(404).send('Director not found')
    }
});

// Add a user
/* We'll expect the JSON in this format:
{
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
}
*/
app.post('/users', 
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Please only enter letters or numbers').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    async (req, res) => {    
    // Check the validation object for errors
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // Hashes password entered by user when registering
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/* Allow users to update their username
We'll expect JSON in this format
{
    Username: String,
    (required)
    Password: Stinrg,
    (required)
    Email: String,
    (required)
    Birthday: Date
}
*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Condition to check added here
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    //Condition ends
    await Users.findOneAndUpdate({ Username: req.params.Username }, 
       { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }) // The makes sure the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndUpdate(
     { Username: req.params.Username }, 
     { $push: { FavoriteMovies: req.params.MovieID } },
     { new: true }
     ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err);
    });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
   await Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true }
   )
.then(updatedUser => {
    if (updatedUser) {
        res.json({
            message: 'Movie removed from favorites',
            FavoriteMovies: updatedUser.FavoriteMoviesavoriteMovies
        });
    } else {
        res.status(404).send('Not found');
    }
})
    .catch(err => {
        console.error(err);
        res.status(500).send('Error' + err);
    });
});

// Allow user to delete their account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.use('/documentation', express.static('public'));

// Error handling
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Oh no!'); 
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port' + port);
});