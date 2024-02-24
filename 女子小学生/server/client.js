; (async () => {
  const socket = io();
  /*   チャット機能 -------------  */
  init_chat(socket, $('form'), $('#messages'), $('#m'));

  socket.emit('sub_enter');

  /*   画面共有(受信)機能 -------------- */

  /* ポイント                                                              */
  /* 受信側は受信専任で、配信側がLIVEを開始するのを待つスタンスの設計である */

  const video = document.querySelector('video');
  let connection = null;

  // 配信側がLIVEを始めるのを待つ。開始連絡があれば、接続要求のrequestを投げる
  socket.on('now_on_air', () => socket.emit('request'));

  // 配信側から'offer'を受け取ったら、answerを送り返すとともに、LIVEの受信のための関数setVideoを起動する
  socket.on('offer', setVideo);

  /**
   * Missing JSDoc comment.
   */
  async function setVideo({offer}) {
    const pcConfig = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
    // const pcConfig = { iceServers: [] } //LAN内の端末間どおしならこれでも動作するらしい
    const peer = new RTCPeerConnection(pcConfig);
    connection = peer;
    // Vanilla ICE 〜アンサー発行
    peer.setRemoteDescription(offer);
    peer.onicecandidate = evt => {
      if (evt.candidate) { // Vanilla ICEスタイルなので追加のcandidateを取得できていても今回は我慢する（何もしない）
        return false;
      }
      // 集められるものは全て収集した（打ち止めになった）ので、answerを返す
      socket.emit('answer', {answer: peer.localDescription});
    };
    peer.ontrack = evt => {
      console.log('%%%%% ontrack %%%%%');
      video.srcObject = evt.streams[0];
    };
    peer.setLocalDescription(await peer.createAnswer());
  };

  // 配信側が退出したら、ビデオを停止して、受信を終了する
  socket.on('pub_exit', () => {
    console.log('***** pub_exit *****');
    stopVideo();
  });

  /**
   * Missing JSDoc comment.
   */
  function stopVideo() {
    if (connection) {
      video.pause();
      video.srcObject = null;
      connection.close();
      connection = null;
    };
  };

  // ここまででコールバックの設定がひととおり完了 ---

  // ひとまず起動時にはダメ元でrequestを投げる(配信側がすでに配信を始めていれば、受信手続きにつながっていく）
  socket.emit('request');
})();
