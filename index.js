var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path=require('path');

app.use(express.static(path.join(__dirname, '/cssFiles')))
app.use(express.static(path.join(__dirname, '/actions')))

userActive = {}

var con = mysql.createConnection({
    host: 'localhost',
    password: 'password',
    user: 'user',
    database: 'mydb'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
})

app.set('view engine', 'ejs');

// app.get('/',function(req, res){
//     res.sendFile(__dirname + '/index.html');
//     console.log(__dirname);
// });

app.get('/home', function(req, res){
    // TODO :: build authentication check here
  res.sendFile(__dirname + '/htmlFiles/index.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/htmlFiles/login.html');
});

app.get('/threads/:tname', function(req, res){
    var thread_name = req.params['tname'];
    var msg_list = [];
    con.query('SELECT msg FROM '+thread_name, function(err, result, fields){
        if(err) throw err;
        for(var i in result){
            msg_list.push(result[i].msg);
        };
        console.log('first'+msg_list);
        res.render('layout',{
            table: msg_list,
            t_name: thread_name
        });
    });
    //res.sendFile(__dirname+ '/index.html');
});

io.on('connection', function(socket){
    console.log('user connected');
    con.query('SELECT * FROM threads', function(err, result, fields){
        if(err) throw err;
        console.log(result);
        socket.emit('update thread', result);
    });

    socket.on('send msg', function(data){
        console.log('message: '+ data.msg);
        con.query('INSERT INTO '+data.t_name+' (msg) VALUES ("'+ data.msg+'")', function(err, result){
            if(err) throw err;
            io.emit('send msg',data.msg);
        });
        //io.emit('send msg', msg);
    });

    socket.on('create_thread',function(msg){
        console.log('thread: '+msg);
        var insert_thr = "INSERT INTO threads (name) VALUES ('" +msg +"')";
        console.log(insert_thr);
        con.query(insert_thr, function(err, result){
            if(err) throw err;
            con.query("CREATE TABLE "+ msg+ " (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(255))", function(err, result){
                if(err) throw err;
                io.emit('create_thread', msg);
            });
        });
    });

});


http.listen(3000, function(){
   console.log('listening on *:3000');
});
