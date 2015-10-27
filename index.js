var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});
 
var online_users = []; 
var sockets = [];

io.on('connection', function(socket){
  //console.log('a user connected');
  sockets.push(socket);
  
  socket.on('new_username', function(new_username){
    console.log(new_username); 
	online_users.push(new_username);
	io.emit('online users', online_users);
  });
  
  socket.on('chat message', function(msg_packet){
    //console.log('message: ' + msg);
	io.emit('chat message', msg_packet);
  });
  
  socket.on('disconnect', function(){
	var socket_index = sockets.indexOf(socket);
	online_users.splice(socket_index, 1);
	sockets.splice(socket_index, 1);
	console.log('user disconnected at '+socket_index);
	io.emit('online users', online_users);
  });
  
});

/*http.listen(4000, function(){
  console.log('listening on :4000');
});*/

http.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
