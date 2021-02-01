const mysql      = require('mysql');

const connection = mysql.createConnection({

  host: 'localhost',
  user:'isaacadmin', 
  password: '12345', 
  database: 'movie_db'
});

connection.connect((err) => {
    if(err) 
        console.log(err);
    else
        console.log('Connection establised');
});

module.exports = {connection};
