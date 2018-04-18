var mysql = require('mysql');
var con = mysql.createConnection({
    user: 'user',
    password: 'password',
    host: 'localhost',
    database: 'mydb'
});

con.connect(function(err){
    if(err) throw err;
});


con.query('CREATE TABLE logincred(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(15), pass VARCHAR(255));', function(err, result){
    if(err) throw err;
});

con.query('CREATE TABLE persAttr (username VARCHAR(15) PRIMARY KEY, karma INT DEFAULT 0, gender VARCHAR(10) DEFAULT "", age INT DEFAULT 25);', function(err, result){
    if(err) throw err;
});

con.query('CREATE TABLE threads (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), upvotes INT DEFAULT 0, timestamp DATETIME DEFAULT NOW(), creator VARCHAR(255));', function(err, result){
    if(err) throw err;
});


