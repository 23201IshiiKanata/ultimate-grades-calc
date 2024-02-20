/**
 * 読み込み完了時に一度だけ実行される。
 */
$(() => {
  /** タイトルクリック時のコインの効果音 */
  const clickTitleSound = new Audio('./sound/clicktitle.mp3');
  /** 結果表示前のドラムロールの効果音 */
  const preResultSound = new Audio('./sound/click2.mp3');
  /** 留年祝いの拍手の効果音 */
  const retentionSound = new Audio('./sound/pachi.mp3');

  /** タイトル画面のBGM */
  const titleMusic = new Audio('./sound/title.mp3');
  /** 計算画面のBGM */
  const mainMusic = new Audio('./sound/bgm.mp3');
  /** 留年祝いのBGM */
  const retentionMusic = new Audio('./sound/oioi.mp3');
  // えんどろーる
  const endroll = new Audio('./sound/end.mp3');

  // BGMをループ再生する
  titleMusic.loop = true;
  mainMusic.loop = true;
  retentionMusic.loop = true;

  // ?
  const play = document.getElementById('play');

  /**
   * 配信画面をポップアップ(PinP)に切り替え、タイトル画面を表示。
   */
  function popupStream() {
    // 連打防止
    if ($('pinp').hasClass('popup')) return;

    // 要素をアニメーション
    $('.pinp').addClass('popup');

    // タイトル画面のBGMを再生
    titleMusic.play();
  }

  /**
   * タイトル画面から計算画面へ遷移する。
   */
  function showMain() {
    // 要素をアニメーション
    $('.title').addClass('title-a');
    $('.calcwindow').addClass('viewin');

    // 入力を有効化する
    $('.calcwindow input, .calcwindow button, .calcwindow select').prop('disabled', false);

    // BGMを変更
    titleMusic.pause();
    mainMusic.play();

    // SEを連打可能な方法で再生
    clickTitleSound.currentTime = 0;
    clickTitleSound.play();
  }

  function gonum() {
    $('.calcwindow input, .calcwindow button, .calcwindow select').prop('disabled', true);
    $('.calcwindow').addClass('hidewin');
    $('.numwindow').addClass('viwwwnum');
  }

  /**
   * 計算画面から結果画面まで遷移する。
   */
  function gogo() {
    // 要素をアニメーション
    $('.numwindow').addClass('hiwwwnum');

    // 入力を無効化する
    $('.next').prop('disabled', true);

    // 仮で留年祝いのBGMに変更
    mainMusic.pause();

    // SEを再生
    preResultSound.play();

    // 指定時間後に結果画面を表示
    setTimeout(() => {
      $('.resu').addClass('viewin');
      $('body').addClass('hyper');
      retentionMusic.play();
    }, 4500);

    // 指定時間後に仮で留年SEを再生
    setTimeout(() => {
      retentionSound.play();
    }, 4800);

    setTimeout(() => {
      end();
    }, 10000);
  }

  function end() {
    retentionMusic.pause();
    $('.end').removeClass('dis');
    endroll.play();
    setTimeout(() => {
      $('.end').addClass('upper');
    }, 500);
  }

  // イベントハンドラの登録
  $('.pinp').on('click', popupStream);
  $('.title').on('click', showMain);
  $('.gogo').on('click', gogo);
  $('.next').on('click', gonum);

  //debug
  // popupStream();
  // showMain();
  // gonum();
  // gogo();
  // end();
});
