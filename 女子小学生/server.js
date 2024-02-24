// 読み込み完了時に一度だけ実行される。
$(() => {
  const videoElem = $('#video')[0];
  const startElem = $('#start')[0];
  const stopElem = $('#stop')[0];

  /** getDisplayMedia()のオプション */
  const displayMediaOptions = {
    video: {
      cursor: 'always',
    },
    audio: false,
  };

  // スタートボタンとストップボタンのイベントリスナーを設定する
  startElem.addEventListener('click', (event) => {
    startCapture();
  }, false);

  stopElem.addEventListener('click', (event) => {
    stopCapture();
  }, false);

  /**
   * 画面共有を開始する。
   */
  const startCapture = async () => {
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
      console.error('Error: ' + err);
    }
  };

  /**
   * 画面共有を停止する。
   * @param {Event} event イベント
   */
  const stopCapture = (event) => {
    /** @type {MediaStreamTrack[]} */
    const tracks = videoElem.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
  };
});
