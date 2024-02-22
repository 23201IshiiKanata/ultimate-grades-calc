/**
 * 読み込み完了時に一度だけ実行される。
 */
$(() => {
  const videoElem = document.getElementById('video');
  const startElem = document.getElementById('start');
  const stopElem = document.getElementById('stop');

  // Options for getDisplayMedia()
  const displayMediaOptions = {
    video: {
      cursor: 'always',
    },
    audio: false,
  };

  // Set event listeners for the start and stop buttons
  startElem.addEventListener('click', function(evt) {
    startCapture();
  }, false);

  stopElem.addEventListener('click', function(evt) {
    stopCapture();
  }, false);

  /**
 * 読み込み完了時に一度だけ実行される。
 */
  async function startCapture() {
    try {
      videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
      console.error('Error: ' + err);
    }
  }

  /**
 * 読み込み完了時に一度だけ実行される。
 */
  function stopCapture(evt) {
    const tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
  }
});