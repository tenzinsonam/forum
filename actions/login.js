  $(function () {
    var socket = io();

    $('#loginForm').submit(function(){
      socket.emit('login_credentials', $('#usernameInput1').val(),$('#passwordInput1').val());
      console.log("iO emitted");
      return false;
    });
    $('#registerForm').submit(function(){
      if($('#passwordInput2').val() == $('#passwordInput3').val())
        socket.emit('register_credentials', $('#usernameInput2').val(),$('#passwordInput2').val());
      else{
        console.log("Passwords do not match.");
      }
      return false;
    });

    socket.on('accessAllowed', function(site){
      window.location.href = site;
    });
    socket.on('accessDenied', function(site){
      window.location.href = site;
    });
  });



  let lf = $("#loginForm");
  let rf = $("#registerForm");

  function changeView(indicator){
    $("#formDiv").fadeOut(function(){
      if(indicator == 0)
      {rf.hide();lf.show();}
      else
      {lf.hide();rf.show();}
    });
    $("#formDiv").fadeIn();
  }
