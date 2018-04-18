	

$(function(){
	var socket = io();
	socket.on('update thread',function(){
		console.log('wtf');
		
	});
	
	socket.on('thread_statist', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        //console.log('here');
        for (var i in list){
        	str = str + list[i].name + "<br>";
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	socket.on('user_statist_u', function(list, quest){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        console.log(list);
        //console.log(eval(list[0]+'.'+quest));
        for (var i in list){
        	if(quest=='gender'){
        		str = str + list[i].gender + "<br>";	
        	}
        	else if(quest=='age'){
        		str = str + list[i].age + "<br>";	
        	}
        	//str = str + 'bleh' + "<br>";
        }
        myWindow.document.write("<p>"+str+"</p>");
	});
	//eval(list[i]+'.'+quest)
	
	socket.on('user_statist_v', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        //console.log(list)
        for (var i in list){
        	str = str + list[i].username + "<br>";
        	
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	socket.on('top_thr', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        //console.log(list)
        for (var i in list){
        	str = str + list[i].name + "<br>";
        	
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	socket.on('top_kar', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        //console.log(list)
        for (var i in list){
        	str = str + list[i].username + "<br>";
        	
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	socket.on('error_state',function(){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = 'nonononono';
        //console.log(val);
		myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	socket.on('usr_thrd', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        //console.log(list)
        for (var i in list){
        	str = str + list[i] + "<br>";
        	
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	$('#stat_thread').submit(function(){
		socket.emit('stat_thread',$('#thr_start').val(),$('#thr_stop').val());
		//:Wconsole.log($('#thread_name').val());
		//$('#thread_name').val('');
		return false;
			
	});
	
	$('#stat_user').submit(function(){
		//console.log($('select#user_name option:checked').val())
		console.log('user submit');
		socket.emit('stat_user',$('#user_name').val(), $('select#question option:checked').val(), $('#valu').val());
		return false;		
	});
	
	$('#top_th').click(function(){
		socket.emit('top_thread');
		
	});
	
	$('#top_ka').click(function(){
		socket.emit('top_karma');
		
	});
	
	$('#comm_user').submit(function(){
		socket.emit('usr_thr', $('#usr').val());
		return false;		
	});
	//SELECT * FROM threads ORDER BY upvotes DESC LIMIT 3;
	
});
