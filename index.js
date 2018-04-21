var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var path=require('path');

app.use(express.static(path.join(__dirname, '/cssFiles')))
app.use(express.static(path.join(__dirname, '/actions')))

var usersActive = new Set();

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

app.get('/home', function(req, res){
    // TODO :: build authentication check here
  res.sendFile(__dirname + '/htmlFiles/index.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/htmlFiles/login.html');
});

app.get('/stats', function(req, res){
  res.sendFile(__dirname + '/htmlFiles/stats.html');
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
        //console.log(result);
        socket.emit('update thread', result);
    });

    socket.on('send msg', function(data){
        //console.log('message: '+ data.msg);
        con.query('INSERT INTO '+data.t_name+' (msg) VALUES ("'+ data.msg+'")', function(err, result){
            if(err) throw err;
            io.emit('send msg',data.msg);
        });
        //io.emit('send msg', msg);
    });

    socket.on('create_thread',function(msg, username){
        //console.log('thread: '+msg);
        var logged = usersActive.has(username);
        if(logged == true){
            var sql_query5 = "UPDATE persAttr SET karma = karma + 7 WHERE username = '"+username+"';";
            con.query(sql_query5, function (err5, res5) {
                if (err5) throw err5;
            });
            var insert_thr = "INSERT INTO threads (name, timestamp, creator) VALUES ('" +msg +"',NOW(), '"+username+"')";
            //console.log(insert_thr);
            con.query(insert_thr, function(err, result){
                if(err) throw err;
                con.query("SELECT * FROM threads WHERE name = '"+msg+"'",function(err, result, fields){
                    //console.log(result[0].id);
                    if(err) throw err;
                    io.emit('make_thread', result);
                    con.query("CREATE TABLE "+result[0].id.toString()+"_mid (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(255))",function(err, result){
                        //console.log('created mid');
                        if(err) throw err;
                    });
                    con.query("CREATE TABLE "+result[0].id.toString()+"_uid (uid INT PRIMARY KEY)", function(err, result){
                        //console.log('created uid');
                        if(err) throw err;
                    });
                });
            });
        }
        else {
            io.emit('accessDenied', '/');
        }
    });

    socket.on('login_credentials', function(username, pass){
        var sql_query = "SELECT * FROM logincred WHERE username='" +
                        username+"' AND pass='"+pass + "';";
        con.query(sql_query, function (err, result) {
          if (err) throw err;
          if(result.length > 0){
            io.emit('accessAllowed', '/home');
            usersActive.add(username);
            console.log(usersActive);
          }
          else
            io.emit('accessDenied', '/');
        });
    });

    socket.on('register_credentials', function(username, pass, gender, age){
        // TODO :: Check whether the username is distinct
        var sql2 = "SELECT * FROM logincred WHERE username ='"+username+"';";
        con.query(sql2, function (err00, result00) {
            if (err00) throw err00;
            var flag = 0;
            for (var i in result00){
              flag = 1;
            }
            if(flag==0){
                var sql_query = "INSERT INTO logincred (username, pass) VALUES ('" +
                                  username+"','" + pass + "')";
                var sql_query2 = "INSERT INTO persAttr (username, gender, age) VALUES ('" + username+"','" + gender+"'," + age+");";
                con.query(sql_query2, function (err, result) {
                    if (err) throw err;
                    //console.log("New member added: " + username);
                    con.query(sql_query, function (err2, result2) {
                        if (err2) throw err2;
                        //console.log("New member added: " + username);
                        io.emit('accessAllowed', '/home');
                        usersActive.add(username);
                        console.log(usersActive);
                    });
                });
            }
            else {
              io.emit('accessDenied', '/');
            }
        });
    });

    socket.on('log out', function(username){
      //console.log("cameeeeeeeeeeeee")
      console.log(usersActive);
      usersActive.delete(username);
      console.log(usersActive);
      io.emit('accessDenied', '/');
    });

    socket.on('click upvote', function(thrId, username, creator){
        console.log("Creator is here: "+creator);
        var logged = usersActive.has(username);
        if(logged == true){
          var sql_query = "SELECT id FROM logincred WHERE username='"+username+"';";
          con.query(sql_query, function (err, result) {
              if (err) throw err;
              //console.log(result[0].id.toString());
              var userid = result[0].id;
              var sql_query2 = "SELECT * FROM "+ thrId +"_uid WHERE uid="+userid+";";
              con.query(sql_query2, function (err2, res2){
                  if (err2) throw err2;
                  console.log(res2);
                  var flag = 0;
                  for (var i in res2){
                    flag = 1;
                  }
                  if (flag==1){
                    //console.log("aaaaaa");
                  }
                  else {
                    //console.log("llllllll");
                    //console.log(thrId);
                    //console.log(userid);
                    var sql_query3 = "INSERT INTO "+ thrId +"_uid (uid) VALUES ("+userid+");";
                    con.query(sql_query3, function (err3, res3) {
                        if (err3) throw err3;
                        //console.log(res3);
                        var sql_query4 = "UPDATE threads SET upvotes = upvotes + 1 WHERE id = "+thrId;
                        con.query(sql_query4, function (err4, res4) {
                            if (err4) throw err4;
                            var sql_query5 = "UPDATE persAttr SET karma = karma + 2 WHERE username = '"+username+"';";
                            con.query(sql_query5, function (err5, res5) {
                                if (err5) throw err5;
                                var sql_query8 = "UPDATE persAttr SET karma = karma + 3 WHERE username = '"+creator+"';";
                                con.query(sql_query8, function (err8, res8) {
                                    if (err8) throw err8;
                                });
                            });
                        });
                        //console.log(res4);
                    });
                  }
              });
          });
        }
        else {
          io.emit('accessDenied', '/');
        }
    });

    socket.on('view upvoters', function(thrId){
      console.log("I reached");
        var sql_query = "SELECT username FROM logincred WHERE id IN (SELECT uid FROM "+ thrId +"_uid)";
        con.query(sql_query, function (err, result) {
            if (err) throw err;
            //console.log("New member added: " + username);
            io.emit('send upvoters', result);
            console.log(result);
        });
    });

    socket.on('stat_thread', function(start, stop){
        con.query('SELECT * FROM threads WHERE timestamp > CAST("'+start+'" AS DATETIME) AND timestamp < CAST("'+stop+'" AS DATETIME);', function(err, result, fields){
            //console.log('SELECT * FROM threads WHERE timestamp > CAST("'+start+'" AS DATETIME) AND timestamp < CAST("'+stop+'" AS DATETIME);');
            //console.log(result);
            io.emit('thread_statist', result); 
        }); 
    });

    socket.on('stat_user', function(user, quest, valu){
        if(user!='' && valu==''){
            con.query('SELECT '+quest+' FROM persAttr WHERE username = "'+user+'";',function(err, result, fields){
                console.log(result);
                //console.log('SELECT '+quest+' FROM persAttr WHERE username = "'+user+'";');
                //var tmp = result[0]+'.'+quest;
                //console.log(tmp);
                socket.emit('user_statist_u', result, quest);    
            });
        }
        else if(user=='' && valu!=''){
            
            con.query('SELECT * FROM persAttr WHERE '+quest+' = "'+valu+'";', function(err, result, fields){
                console.log(result);
                socket.emit('user_statist_v', result);
                      
            });
        }
        else{
            socket.emit('error_state');
        }
    });

    socket.on('top_thread', function(){
        con.query('SELECT * FROM threads ORDER BY upvotes DESC LIMIT 3;',function(err, result, fields){
            if(err) throw err;
            
            socket.emit('top_thr',result);
        });
    });

    socket.on('top_karma', function(){
        con.query('SELECT * FROM persAttr ORDER BY karma DESC LIMIT 3;', function(err, result, fields){
            if(err) throw err;
            socket.emit('top_kar', result);
        });
    });

    function* gener(list){
        for(var x in list){
            yield list[x];
        }
    }

    socket.on('usr_thr', function(username){
        con.query('SELECT * FROM logincred WHERE username = "'+username+'";', function(err, result0, fields){
            if(err) throw err;
            //console.log('SELECT * FROM logincred WHERE username = "'+username+'";');
            //console.log(result0[0].id);
            var userid = result0[0].id;
            con.query('SELECT * FROM threads;', function(err, result, fields){
                //console.log(result);
                //generator thing
                var gen = gener(result);
                var tmp = gen.next();
                var thr_list = [];
                function cback(tmp, userid){
                    con.query('SELECT * FROM '+tmp.value.id+'_uid WHERE uid = '+userid+';', function(err, result1, fields){
                        //console.log(tmp.value);
                        //console.log('SELECT * FROM '+tmp.value.id+'_uid WHERE uid = '+userid+';');
                        //console.log(result1);
                        if(result1[0]!= null){
                            thr_list.push(tmp.value.name);
                        }
                        tmp= gen.next();
                        if(!tmp.done){
                            return cback(tmp, userid);
                        }
                        else{
                            //console.log('am i here?');
                            //console.log(thr_list);
                            socket.emit('usr_thrd', thr_list);
                        }
                        
                    });
                    
                };
                cback(tmp, userid);
                
            });
            
        });
    });
    
    socket.on('bad_usr', function(){
        //console.log('here?');
        con.query('SELECT P.username FROM persAttr P, logincred C WHERE P.karma < 40 AND LENGTH(C.pass) < 5 AND P.username = C.username;', function(err, result, fields){
            if(err) throw err;
            //console.log(result);
            socket.emit('ba_user', result);
        });
    });

    socket.on('dele_user', function(username){
        console.log(username);
        con.query('DELETE FROM persAttr WHERE username="'+username+'";',function(err, result){
            if(err) throw err;
            socket.emit('user_deleted', username);
        });
    });
    
});


http.listen(3000, function(){
   console.log('listening on *:3000');
});
