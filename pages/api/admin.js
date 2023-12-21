/*  Temporary Obsolete

const express = require('express');
const MySQL = require('./models/MySQL');
const mysql = require('mysql');
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors())


const db = mysql.createConnection({
    host:'localhost',
    database:'DEV_CDKEYS',
    user:'root',
    password:'css222',
});


db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.get('/', (req, res) => {
  const {name, email} = req.body;
  db.query('SELECT * FROM administrator', (err, results) => {
    if (err) throw err;
    console.log(results);
  });
});

// Your API routes go here

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

*/