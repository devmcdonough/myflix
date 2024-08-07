const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Represents a movie.
 * @typedef {Object} Movie
 * @property {string} Title - The title of the movie.
 * @property {string} Description - The description of the movie.
 * @property {Object} Genre - The genre of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - The description of the genre.
 * @property {Object} Director - The director of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - The biography of the director.
 * @property {string[]} Actors - The list of actors in the movie.
 * @property {string} ImagePath - The path to the movie's image.
 * @property {boolean} Featured - Whether the movie is featured.
 */
let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

/**
 * Represents a user.
 * @typedef {Object} User
 * @property {string} Username - The username of the user.
 * @property {string} Password - The password of the user.
 * @property {string} Email - The email of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {ObjectId[]} FavoriteMovies - The list of favorite movies of the user.
 */
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Hashes a password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Validates a password.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

/**
 * Exports the Movie model.
 * @type {Model}
 */
module.exports.Movie = Movie;

/**
 * Exports the User model.
 * @type {Model}
 */
module.exports.User = User;
