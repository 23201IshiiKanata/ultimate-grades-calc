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
  /** えんどろーる */
  const endrollMusic = new Audio('./sound/end.mp3');
  /** えんどろーる2 */
  const endrollMusic2 = new Audio('./sound/oioifadeout.mp3');

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

  /**
   * 前提条件の入力を完了し、計算画面へ遷移する。
   */
  function gonum() {
    $('.calcwindow input, .calcwindow button, .calcwindow select').prop('disabled', true);
    $('.calcwindow').addClass('hidewin');
    $('.numwindow').addClass('viwwwnum');
    clickTitleSound.currentTime = 0;
    clickTitleSound.play();
  }

  /**
   * ?
   */
  function gogo() {
    clickTitleSound.currentTime = 0;
    clickTitleSound.play();
    ryunen();
  }

  /**
   * 計算画面から結果画面まで遷移する。
   */
  function ryunen() {
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

  /**
   * エンドロール表示の準備と、実際の表示を行う。
   */
  function end() {
    retentionMusic.pause();
    $('.resu').addClass('hiwwwnum');
    $('.calcwindow').addClass('hiwwwnum');
    $('.end').removeClass('dis');
    $('body').removeClass('hyper');
    endrollMusic.play();
    setTimeout(() => {
      endrolltxt();
    }, 500);
    setTimeout(() => {
      endrollMusic2.play();
    }, 281000);
  }

  /**
   * エンドロールのテキストを順に表示する。
   */
  function endrolltxt() {
    setTimeout(() => {
      $('#end1').addClass('upper');
    }, 0);
    setTimeout(() => {
      $('#end2').addClass('upper');
    }, 15000);
    setTimeout(() => {
      $('#end3').addClass('upper');
    }, 30000);
    setTimeout(() => {
      $('#end4').addClass('upper');
    }, 45000);
    setTimeout(() => {
      $('#end5').addClass('upper');
    }, 60000);
    setTimeout(() => {
      $('#end6').addClass('upper');
    }, 75000);
    setTimeout(() => {
      $('#end7').addClass('upper');
    }, 90000);
    setTimeout(() => {
      $('#end8').addClass('upper');
    }, 105000);
    setTimeout(() => {
      $('#end9').addClass('upper');
    }, 120000);
    setTimeout(() => {
      $('#end10').addClass('upper');
    }, 135000);
    setTimeout(() => {
      $('#end11').addClass('upper');
    }, 150000);
    setTimeout(() => {
      $('#end12').addClass('upper');
    }, 165000);
    setTimeout(() => {
      $('#end13').addClass('upper');
    }, 180000);
    setTimeout(() => {
      $('#end14').addClass('upper');
    }, 195000);
    setTimeout(() => {
      $('#end15').addClass('upper');
    }, 210000);
    setTimeout(() => {
      $('#end16').addClass('upper');
    }, 225000);
    setTimeout(() => {
      $('#end17').addClass('upper');
    }, 240000);
    setTimeout(() => {
      $('#end18').addClass('upper');
    }, 255000);
    setTimeout(() => {
      $('#end19').addClass('upper');
    }, 270000);
    setTimeout(() => {
      $('#end20').addClass('upper');
    }, 285000);
  }

  // イベントハンドラの登録
  $('.pinp').on('click', popupStream);
  $('.title').on('click', showMain);
  $('.next').on('click', gonum);
  $('.gogo').on('click', gogo);

  // debug
  // popupStream();
  // showMain();
  // gonum();
  // gogo();
  // end();
});
