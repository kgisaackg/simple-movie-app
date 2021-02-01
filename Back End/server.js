const express = require('express');
const connectionDB = require('./connection');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Creating a movie 
app.post('/', (req, res) => {
    const sql = "INSERT INTO movie (title, description, releaseYear, genre,"
            + "dateCreated) VALUES (?, ?, ?, ?, ?)";
    
    const theDate = new Date();

    const movieValues = [req.body.title, req.body.description, req.body.releaseYear,
                 req.body.genre, theDate];
                 
    connectionDB.connection.query(sql, movieValues, (error, results, fields) => {
        console.log(results);
    });
});

//Reading all movies
app.get('/', (req, res) => {
    const sql = "SELECT * FROM movie";

    connectionDB.connection.query(sql, (error, results, fields) => {
        res.json(results);
    });
});

//Reading information of a movie using id
app.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM movie WHERE id = ?";

    connectionDB.connection.query(sql, [id], (error, results, fields) => {
        res.json(results);
    });
});

//Updating information of a movie 
app.put('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE movie SET title = ? , description = ?, "
                + "releaseYear = ?, genre = ? , dateUpdated =?  WHERE id = ?";

    const dateUpdated = new Date();
    const movieValues = [req.body.title, req.body.description,
                         req.body.releaseYear, req.body.genre, dateUpdated, id];

    connectionDB.connection.query(sql, movieValues, (error, results, fields) => {
        res.json(results);
        console.log(results)
    });
});

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM movie WHERE id = ?";

    connectionDB.connection.query(sql, [id], (error, results, fields) => {
        res.json(results);
    });
});

app.listen(port, ()=>{
 console.log("Server is running now");
});