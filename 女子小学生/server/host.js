
; (async () => {
  const socket = io();
  const connections = {};

  /*   チャット機能 -------------  */
  init_chat(socket, $('form'), $('#messages'), $('#m'));

  socket.emit('pub_enter');

  /*   画面共有(配信)機能 -------------- */
  // 緩めの排他制御
  socket.on('shimedashi', function() {
    alert('他の人が入室中なので受信室に移動します');
    start();
    return null;
  });

  /*
      ＜このアプリでのシグナリングの考え方＞
      共有ボタン押下>  【now_on_air】→  >
              【request】←  >  配信手続き~【(offer)】→  >
                  【(answer)】← > setRemoteDescription:コネクション成立　> 
                      受信側の「ontrack」〜受信開始 > 以上
  */
  const startbutton = document.querySelector('#startbutton');
  startbutton.addEventListener('click', async evt => {
    // 画面共有起動
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 1280, height: 720,
        frameRate: 1,
      },
      audio: false,
    });

    // 受信側(依頼元のIDはcidで規定）からの配信依頼があれば、配信手続きを始める
    //    受信側が配信先全てを覚える実装モデルなので、それぞれのcidを管理する方式になっている
    socket.on('request', async ({cid}) => {
      const pcConfig = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
      // const pcConfig = { iceServers: [] } //LAN内の端末間どおしならこれでも動作するらしい
      const peer = new RTCPeerConnection(pcConfig);
      connections[cid] = peer;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
      // Vanilla ICE 〜オファー発行
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      peer.onicecandidate = async (evt) => {
        if (evt.candidate) { //Vanilla ICEスタイルなので追加のcandidateを取得できていても今回は我慢する（何もしない）
          return false;
        }
        // 集められるものは全て収集した（打ち止めになった）ので、offerを伝達する
        // また、シグナリングサーバ側でofferをoffer元にのみ伝達できるように「cid」を送り返す
        socket.emit('offer', {offer: peer.localDescription, cid});
      };
    });

    socket.on('answer', async ({cid, answer}) => {
      if (cid in connections) {
        await connections[cid].setRemoteDescription(answer);
      }
    }); // P2Pの接続確立の事後手続き(setRemoteDescription呼び出し)
    // ここまででコールバックの設定がひととおり完了 ---

    // LIVE開始を伝達する
    //   ※あくまで開始連絡のみとなる。これをキッカケにシグナリング開始
    document.getElementById('startbutton').setAttribute('disabled', true);
    alert('LIVEを開始しました。\n配信者のブラウザには配信内容のキャプチャを表示しない仕様なので注意してください。\n また、配信するウィンドウや画面を変更する場合は、ページをリロードしてください。');
    socket.emit('now_on_air');
  });
})();
