; (async () => {
  console.log('host.js', 'ready');
  // シグナリングサーバーであるWebSocketサーバーに接続
  // 今回はsocket.ioを採用
  const socket = require('socket.io-client')('http://localhost:55555');

  /**
   * RTCPeerConnectionをクライアントごとに格納する変数
   * keyをクライアントID（ソケットID）として保存する
   */
  const connections = {};
  console.log(connections);

  /**
   * PC映像streamを取得
   * @type {MediaStream}
   */

  // ソケットサーバー疎通確認
  socket.on('connect', () => console.log('socket', 'connected'));

  // 配信要求を受ける
  // Client ID （cid）を受け取りコネクションを作成する
  socket.on('request', ({cid}) => sendOffer(cid));

  // アンサーを受ける
  socket.on('answer', async ({cid, answer}) => {
    if (cid in connections) connections[cid].setRemoteDescription(answer);
  });

  /**
   * オファーを送信する
   *
   * @param {string} cid Client ID
   * @return {void}
   */
  async function sendOffer(cid) {
    // コネクションの設定
    const pcConfig = {
      // STUNサーバーはGoogle様のものを利用させていただく
      iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
    };

    // コネクションの作成
    const peer = new RTCPeerConnection(pcConfig);

    // cidをキーとしてコネクションを保存
    connections[cid] = peer;

    // コネクションにストリームを設定
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    // ICE candidateを取得イベントハンドラ
    peer.onicecandidate = evt => {
      // evt.candidateがnullならICE Candidateを全て取得したとみなしてオファーを送信
      if (!evt.candidate)
        socket.emit('offer', { offer: peer.localDescription, cid });
    };

    // オファーを作成
    const offer = await peer.createOffer();

    // オファーを自身に設定
    // STUNサーバーへアクセスが始まり、onicecandidateが呼ばれるようになる
    await peer.setLocalDescription(offer);
  }
})();
