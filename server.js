/**
 * シグナリングサーバー（WebSocketサーバー） + Webサーバー
 */
// Express
console.log('main', 'start');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// public\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u3092\u516c\u958b
app.use(express.static(__dirname + '/public'));

const http = require('http');
const server = http.createServer(app);

// WebSocketサーバーにはsocket.ioを採用
const io = require('socket.io')(server);

// 接続要求
io.on('connect', socket => {
  console.log('io', 'connect');
  console.log('io', 'socket: ', socket.id);

  // 受信側からの配信要求を配信側へ渡す
  socket.on('request', () =>
    socket.broadcast.emit('request', {cid: socket.id}),
  );

  // 配信側からのオファーを受信側へ渡す
  socket.on('offer', ({offer}) => {
    socket.broadcast.emit('offer', {offer});
    // 配信側の接続が切れた場合にそれを受信側へ通知する
    socket.on('disconnect', () => socket.broadcast.emit('close'));
  });

  // 受信側からのアンサーを配信側へ渡す
  socket.on('answer', ({answer}) =>
    socket.broadcast.emit('answer', {cid: socket.id, answer}),
  );
});

server.listen(55555);
