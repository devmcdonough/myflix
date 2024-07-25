const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Models = require('./js/models.js');
const { check, validationResult } = require('express-validator');
const passport = require('passport');

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'https://myflixcinematheque.netlify.app',
  'https://devmcdonough.github.io',
  'https://devmcdonough.github.io/myFlix-Angular-client2',
  'http://localhost:4200'
];

/**
 * Middleware to handle CORS.
 */
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this app does not allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

require('./js/auth.js')(app);
require('./js/passport.js');

/**
 * GET: Returns a welcome message.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/', (req, res) => {
  res.send('Where are all the movies about sand? Our finest material.');
});

/**
 * POST: Registers a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET: Returns a list of all movies.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET: Returns data about a single movie by title.
 * @param {string} title - The title of the movie.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/movies/title/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET: Returns data about a genre by name.
 * @param {string} name - The name of the genre.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Genres.findOne({ Name: req.params.name })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET: Returns data about a director by name.
 * @param {string} name - The name of the director.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Directors.findOne({ Name: req.params.name })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * GET: Returns a list of all users.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
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

/**
 * GET: Returns data about a user by username.
 * @param {string} username - The username of the user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.get('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOne({ Username: req.params.username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * PUT: Updates a user's information.
 * @param {string} username - The username of the user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.put('/users/:username', [
  check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  if (req.user.Username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOneAndUpdate({ Username: req.params.username }, {
    $set: {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  }, { new: true })
    .then((updatedUser) => {
      res.status(201).json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * POST: Adds a movie to a user's list of favorites.
 * @param {string} username - The username of the user.
 * @param {string} movieId - The ID of the movie.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.post('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.username }, {
    $push: { FavoriteMovies: req.params.movieId }
  }, { new: true })
    .then((updatedUser) => {
      res.status(201).json(updatedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/**
 * DELETE: Removes a movie from a user's list of favorites.
 * @param {string} username - The username of the user.
 * @param {string} movieId - The ID of the movie.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Username: req.params.username }, {
    $pull: { FavoriteMovies: req.params.movieId }
  }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.status(201).json(updatedUser);
      } else {
        res.status(404).send('Not found');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * DELETE: Deletes a user by username.
 * @param {string} username - The username of the user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Serve static documentation
app.use('/documentation', express.static('public'));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh no!');
});

/**
 * Starts the server on the specified port.
 * @param {number} port - The port number.
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
