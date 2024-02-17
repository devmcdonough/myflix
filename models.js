const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    // These are subdocuments because they have attributes
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    // Array for Actors
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
    });

    let userSchema = mongoose.Schema({
        Username: {type: String, required: true},
        Password: {type: String, required: true},
        Email: {type: String, required: true},
        Birthday: Date,
        // ref: 'Movie' is asking for a reference number. [] allows for an entire array of documents
        FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
    });

    let Movie = mongoose.model('Movie', movieSchema);
    let User = mongoose.model('User', userSchema);

    // Export the modules so they can be used in index.js
    module.exports.Movie = Movie;
    module.exports.User = User;