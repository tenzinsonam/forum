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

con.query('CREATE TABLE logincred(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(15), pass VARCHAR(255));', function(err, result){
    if(err) throw err;
});

con.query('CREATE TABLE persAttr (username VARCHAR(15) PRIMARY KEY, karma INT DEFAULT 0, gender VARCHAR(10) DEFAULT '', age INT DEFAULT 25);', function(err, result){
    if(err) throw err;
});

con.query('CREATE TABLE threads (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), upvotes INT DEFAULT 0, timestamp DATETIME DEFAULT NOW(), creator VARCHAR(255));', function(err, result){
    if(err) throw err;
});

var values = [[,'heck'],[,'nibba'],[,'bleh']];
con.query('INSERT INTO threads (id, name) VALUES ?', [values], function(err, result){
    if(err) throw err;
});

var tables_mid = ['1_mid','2_mid','3_mid']
for(var v in tables_mid){
    con.query('CREATE TABLE '+tables_mid[v]+' (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(255))', function(err, result){
        if(err) throw err;
    });
};

var tables_uid = [1,2,3]
for(var v in tables_uid){
    con.query('CREATE TABLE '+tables_uid[v].toString()+'_uid (uid INT KEY)',function(err, result){
        if(err) throw err;
    });
};

for(var v in tables_mid){
    //console.log(tables[v]);
    var messags = [['cyka'],['blyat'],['ruski']];
    con.query('INSERT INTO '+tables_mid[v] + ' (msg) VALUES ?', [messags], function(err, result){
        if(err) throw err;
    });
};
