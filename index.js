var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const LOG_FORMAT = 'date time PID TID priority tag: message'; //time contains ':' also (e.g. 20:53:19.028)

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
    //parse the log message and emit the data to the sockets, the clients will receive it as data from the server
    io.emit("data", JSON.stringify(parseLog(msg)));
  });
});

function parseLog(logMessage) {
  var logObject = {date: "", time: "", pid: "", tid: "", priority: "", tag: "", message: ""};

  var allparts = logMessage.split(" ", 6);
  logObject.date = allparts[0];
  logObject.time = allparts[1];
  logObject.pid = allparts[2];
  logObject.tid = allparts[3];
  logObject.priority = allparts[4];

  var tag = allparts[5];
  //remove ':' from tag
  logObject.tag = tag.replace(/\:$/, '');

  //there are two colons in time part of the string and one colon after tag. So taking everything after tag
  logObject.message = logMessage.split(":", 4)[3];

  return logObject;
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
