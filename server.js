
/**
 * シグナリングサーバー（socket.ioによるWebSocketサーバー） + ランデブー用のページを配信するWebサーバー
 */

const port = 5000;
const http = require('http');
// const https = require('https');
// const fs = require('fs');

const express = require('express');
const app = express();

/*
const options = {
  key: fs.readFileSync('pem/orekey.pem'),
  cert: fs.readFileSync('pem/orecert.pem'),
};
*/

/*  Webサーバー  */
const docroot = '/public';
app.use(express.static(__dirname + docroot));

app.get('/', function(req, res) {
  res.sendFile(__dirname + docroot + '/index.html');
});

const server = http.createServer(app);
// const server = https.createServer(options, app);

/*  シグナリングサーバー(WebSocketサーバー(socket.ioを利用))  */
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
  },
  cors: {
    origin: 'https://23201ishiikanata.github.io',
    methods: ['GET', 'POST'],
  },
  cors: {
    origin: 'https://cs-1.hawk-betta.ts.net',
    methods: ['GET', 'POST'],
  },
});

console.log('server', 'start');

let pubid = null;
const connections = {};

io.on('connect', (socket) => {
  console.log('io', '%%%%% connect %%%%%:', socket.id);
  connections[socket.id] = true;

  // チャットサーバー用の待ち受け--------
  socket.on('chat message up', (msg) => {
    io.emit('chat message2', socket.id + ' : ' + msg);
  });

  // シグナリングサーバー用の待ち受けロジック --------

  // 配信者入室
  socket.on('pub_enter', () => {
    if (pubid !== null) { // 排他制御する
      console.log(socket.id);
      socket.emit('shimedashi');
      return null;
    }
    pubid = socket.id;
    io.emit('chat message2', '配信者 : ' + pubid);
  });

  // 視聴者入室
  socket.on('sub_enter', () => {
    io.emit('chat message2', '入室 : ' + socket.id);
  });

  // 配信側の準備OKを受信
  socket.on('now_on_air', () => {
    pubid = socket.id;
    io.emit('chat message2', '配信中 : ' + pubid);
    socket.broadcast.emit('now_on_air');
  });

  // 受信側からの配信要求を配信側へ渡す
  socket.on('request', () => {
    console.log('request', socket.id, '->', pubid);
    socket.to(pubid).emit('request', {cid: socket.id});
    io.emit('chat message2', socket.id + ' から配信元 ' + pubid + 'に接続要求');
  });

  // 配信側からのオファーをもともと要求をかけてきた特定の受信へ渡す
  socket.on('offer', ({offer, cid}) => {
    console.log('offer', pubid, '->', cid);
    if (socket.id == pubid) {
      socket.to(cid).emit('offer', {offer});
    }
  });

  // 受信側からのアンサーを配信側へ渡す
  socket.on('answer', ({answer}) => {
    console.log('answer', socket.id);
    socket.to(pubid).emit('answer', {cid: socket.id, answer});
  });

  // 接続が切れた場合に通知する
  socket.on('disconnect', () => {
    console.log('io', '%%%%% disconnect %%%%%:', socket.id);
    let msgprfx = '';
    delete connections[socket.id];
    if (socket.id == pubid) { // 配信者の退室の場合は、全ての受信者にそれを伝達する（videoを停止してもらう）
      pubid = null;
      socket.broadcast.emit('pub_exit');
      msgprfx = '配信者の'; // 誤記ではないです。アドホックな方法...
    }
    io.emit('chat message2', '退室 : ' + msgprfx + socket.id);
  });
});

server.listen(port); // https前提でwelknown port ※ httpsの場合もそうでない場合も実際のportに合わせて変更してください。
