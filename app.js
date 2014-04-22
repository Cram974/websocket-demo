var http = require('http');
var fs = require('fs');

// Send index.html to the client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Loading socket.io
var io = require('socket.io').listen(server, {log: false});

io.sockets.on('connection', function (socket, pseudo) {
    //Send message to client on connect
    socket.emit('message', 'Connection successfully established!');
    //Notify others that another client connected.
    socket.broadcast.emit('message', 'Another client arrived! ');
    
    //Save the username to a session variable
    socket.on('new', function(username) {
        socket.set('username', username);
    });

    //Log revceived messages into the terminal
    socket.on('message', function (message) {
        socket.get('username', function (error, username) {
            console.log(username + ' say: ' + message);
        });
    }); 
});


server.listen(8080);
