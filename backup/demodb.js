var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'mydb'
});

con.connect(function(err){
    if(err) throw err;
    con.query("DROP TABLE customers", function(err, result){
        if(err) throw err;
        console.log('Table Dropped');
    });
});
