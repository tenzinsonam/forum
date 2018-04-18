	

$(function(){
	var socket = io();
	socket.on('update thread',function(){
		console.log('wtf');
		
	});
	
	socket.on('thread_statist', function(list){
		var myWindow = window.open("", "StatWindow", "width=400,height=800");
        var str = '';
        console.log(list)
        for (var i in list){
        	str = str + list[i].name + "<br>";
        }
        myWindow.document.write("<p>"+str+"</p>");
		
	});
	
	$('#stat_thread').submit(function(){
		socket.emit('stat_thread',$('#thr_start').val(),$('#thr_stop').val());
		//:Wconsole.log($('#thread_name').val());
		//$('#thread_name').val('');
		return false;
			
	});
	
})
