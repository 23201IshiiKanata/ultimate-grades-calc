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
  const endrollMusic2 = new Audio('./sound/end2.mp3');

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
    $('.first').addClass('none');
    $('.second').removeClass('none');
    $('.host .viewer').prop('disabled', false);

    // タイトル画面のBGMを再生
    titleMusic.play();
  }

  /**
   * 見る人用
   */
  function displayScreen() {
    $('.pinp').addClass('small');
    $('.client').removeClass('none');
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
   * @param {number} index 表示するエンドロールの位置
   */
  function endrolltxt(index = 1) {
    // 対象となる要素を取得
    const element = $('#endroll').children(`:nth-child(${index})`);

    // 要素が存在しない場合は終了
    if ((element?.length ?? 0) == 0) return;

    // 要素をアニメーション表示
    element.addClass('upper');

    // 次の要素を指定時間後に表示
    setTimeout(() => endrolltxt(index + 1), 15);
  }

  // イベントハンドラの登録
  $('.host').on('click', popupStream);
  $('.viewer').on('click', displayScreen);
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
