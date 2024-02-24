/**
 * 読み込み完了時に一度だけ実行される。
 */
$(() => {
  const element = $('.drag-and-drop')[0];
  element.onpointerdown = (event) => {
    element.onpointermove = (event) => {
      const x = event.clientX - Number(element.offsetWidth) / 2;
      const y = event.clientY - Number(element.offsetHeight) / 2;
      const play = 10; // PinPの遊び
      const maxX = window.innerWidth - Number(element.offsetWidth) - play;
      const maxY = window.innerHeight - Number(element.offsetHeight) - play;
      element.style.transform = `translate(
        ${Math.max(Math.min(x, maxX), play)}px,
        ${Math.max(Math.min(y, maxY), play)}px
      )`;
    };
    element.setPointerCapture(event.pointerId);
  };
  element.onpointerup = (event) => {
    element.onpointermove = null;
    element.releasePointerCapture(event.pointerId);
  };
});
