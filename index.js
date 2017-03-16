var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //Add a 'new message' event handler to this instance of socket
  socket.on('new message', function(msg) {
    console.log('DATA ' + socket.remoteAddress + ': ' + msg);
    // Write the data back to the socket, the client will receive it as data from the server
    io.emit("data", msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
