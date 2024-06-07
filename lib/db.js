const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ninjaarm2003",
  database: 'shopDB'
});



con.connect(function (err) {
  if (err) throw err
  else {
    console.log('connected database!!')
  }

});


con.query("SELECT * FROM empdata ", function (err, result, fields) {
  if(err) throw err;
  
});

module.exports = con