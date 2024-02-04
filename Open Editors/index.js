const express = require('express');
const morgan = require('morgan');
const app = express();

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

// Route to json
app.get('/movies', (req, res) => {
    res.json(tenMovies);
});

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