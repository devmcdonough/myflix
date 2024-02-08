const express = require('express');
    bodyParser = require('body-parser');
    uuid = require('uuid');
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');

    const app = express();

    app.use(bodyParser.json());

// Logging
app.use(morgan('common'));

// Movie Json
let tenMovies = [
    {
        title: "Under_the_Silver_Lake",
        genre: "Mystery"
    },
    {
        title: "Hellraiser",
        genre: "Horror"
    },
    {
        title: "Rear_Window",
        genre: "Mystery"
    },
    {
        title: "Memories_of_Murder",
        genre: "Mystery"
    },
    {
        title: "Baraka",
        genre: "Documentary"
    },
    {
        title: "Zodiac",
        genre: "Mystery"
    },
    {
        title: "Total_Recall",
        genre: "Action"
    },
    {
        title: "Thief",
        genre: "Thriller"
    },
    {
        title: "Mulholland_Drive",
        genre: "Mystery"
    },
    {
        title: "Goodfellas",
        genre: "Crime"
    }
]

// Route to home
app.get('/', (req, res) => {
    res.send('Where are all the movies about sand? Our finest material.');
});

// Gets data of all movies
app.get('/movies', (req, res) => {
    res.json(tenMovies);
});

// Gets data of one movie
app.get('/movies/:title', (req, res) => {
    const title = req.params.title;
    const movie = tenMovies.find( movie => movie.title === title );

    if (movie) {
        res.json(movie);
    } else {
        res.status(404).send('Movie not found');
    }
});

// Return data about a genre by name/description
app.get('/movies/genre/:genre', (req, res) => {
    res.json(movies.filter((movie) =>
    { return movie.genre === req.params.genre }));
});

// Return data about a director by name
app.get('/movies/directors/:director', (req, res) => {
    res.json(movies.filter((movie) => 
    { return movie.director === req.params.director}));
});

// Allow new users to register
app.post('/users', (req, res) =>{
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'You have no name';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// Allow users to update their username
app.put('/users/:id/username', (req, res) => {
    let user = users.find((user) => {
        return user.username === req.params.name 
    });
});

// Allow users to add a movie to their list of favorites
app.post('/users/:id/:title', (req, res) => {
    const id = req.params.id;
    const title = req.params.title;
    
    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(title);
        res.status(200).send(title + ' has been added to list');
    } else {
        res.status(400).send('User not found');
    }
});

// Allow users to remove a movie from their list of favorites
app.delete('users/:id/:title', (req, res) => {
    const id = req.params.id;
    const title = req.params.title;

    let user = users.find( user => user.id == id );

    if(user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title);
        res.status(200).send(title + ' has been removed from the list');
    } else {
        res.status(400).send('User not found')
    }
})

// Allow user to delete their account
app.delete('users/:id', (req, res) => {
    const id = req.params.id;

    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send('User has been deleted');
    } else {
        res.status(400).send('User not found')
    }
})


app.use('/documentation', express.static('public'));

// Error handling
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).send('Oh no!'); 
});

// puts it on 8080
app.listen(8080, () => {
    console.log('My node test in on 8080');
});