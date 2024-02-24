let server = require('ws').Server;
let s = new server({port: 5001});

s.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('Received: ' + message);

    s.clients.forEach(function(client) {
      client.send(message + ' : ' + new Date());
    });
  });

  ws.on('close', function() {
    console.log('I lost a client');
  });
});
