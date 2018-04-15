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

con.query('DROP TABLE threads', function(err, result){
    if(err) throw err;
});

var tables = ['heck','nibba','bleh'];
for(var v in tables){
con.query('DROP TABLE '+tables[v], function(err, result){
    if(err) throw err;
});
};


con.query('CREATE TABLE threads (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))', function(err, result){
    if(err) throw err;
});

var values = [[,'heck'],[,'nibba'],[,'bleh']];
con.query('INSERT INTO threads (id, name) VALUES ?', [values], function(err, result){
    if(err) throw err;
});

for(var v in tables){
    con.query('CREATE TABLE '+tables[v]+' (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(255))', function(err, result){
        if(err) throw err;
    });
};

for(var v in tables){
    console.log(tables[v]);
    var messags = [['cyka'],['blyat'],['ruski']];
    con.query('INSERT INTO '+tables[v] + ' (msg) VALUES ?', [messags], function(err, result){
        if(err) throw err;
    });
};

con.query('SELECT * FROM heck', function(err, result){
    console.log(result);
});
