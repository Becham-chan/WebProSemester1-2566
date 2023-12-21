const mysql = require('mysql')


const MySQL = mysql.createConnection({
    host:'localhost',
    database:'DEV_CDKEYS',
    user:'root',
    password:'css222',
});

module.exports = MySQL;