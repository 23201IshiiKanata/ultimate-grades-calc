import {calc} from './script.js';

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
  /** goukaku祝いの拍手の効果音 */
  const goukakuSound = new Audio('./sound/gome.mp3');

  /** タイトル画面のBGM */
  const titleMusic = new Audio('./sound/title.mp3');
  /** 計算画面のBGM */
  const mainMusic = new Audio('./sound/bgm.mp3');
  /** 留年祝いのBGM */
  const retentionMusic = new Audio('./sound/oioi.mp3');
  /** goukakuのBGM */
  const goukakuMusic = new Audio('./sound/goukaku.mp3');
  /** えんどろーる */
  const endrollMusic = new Audio('./sound/end.mp3');
  /** えんどろーる2 */
  const endrollMusic2 = new Audio('./sound/end2.mp3');

  // BGMをループ再生する
  titleMusic.loop = true;
  mainMusic.loop = true;
  retentionMusic.loop = true;
  goukakuMusic.loop = true;

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
    $('.pinp').addClass('drag-and-drop');
    $('.first').addClass('none');
    $('.second').removeClass('none');
    $('.host .viewer').prop('disabled', false);

    // タイトル画面のBGMを再生
    titleMusic.play();

    const script = document.createElement('script'); // 変数名は適当なものにでも
    script.src = '女子小学生/pinp.js'; // ファイルパス
    document.head.appendChild(script); // <head>に生成
    // document.body.appendChild(script); /*<body>に生成する場合はこちら*/
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
    // 要素をアニメーション
    $('.numwindow').addClass('hiwwwnum');

    // 入力を無効化する
    $('.next').prop('disabled', true);

    mainMusic.pause();

    // SEを再生
    preResultSound.play();

    // 指定時間後に結果画面を表示
    setTimeout(() => {
      try {
        const {score, semester, examType} = calc();
        // alert(score);

        clickTitleSound.currentTime = 0;
        // clickTitleSound.play();

        if (score < 60) {
          ryunen();
          $('.resus').html('総合成績' + score + 'により、貴方が留年を回避できる確率は' + '%です');
        }
        if (score >= 60) {
          goukaku();
          $('.resugs').html('総合成績' + score);
        }

        // TODO: 結果によって処理を分岐
      } catch (e) {
        console.log(e);
        return;
      }
    }, 4500);
  }

  /**
   * 計算画面から結果画面まで遷移する。
   */
  function ryunen() {
    // 仮で留年祝いのBGMに変更
    retentionMusic.play();
    $('.resu').addClass('viewin');
    $('body').addClass('hyper');
    // 指定時間後に仮で留年SEを再生
    setTimeout(() => {
      retentionSound.play();
    }, 100);
  }

  /**
   * 計算画面から結果画面まで遷移する。
   */
  function goukaku() {
    goukakuMusic.play();
    $('.resug').addClass('viewin');
    setTimeout(() => {
      goukakuSound.play();
    }, 100);
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
    setTimeout(() => {
      moregrade();
    }, 539000);
  }

  function moregrade() {
    $('.chrx').addClass('upperx');
    setTimeout(() => {
      $('.end').css('transition', '5s');
      $('.end').css('background-color', 'white');
    }, 7500);
    setTimeout(() => {
      $('.chrx').css('transition', '.5s');
      $('.chrx').css('color', 'black');
      $('.chrx').html('もう1回遊べるドン');
    }, 12500);
    setTimeout(() => {
      $('.chrx').html('<button class="nextyear" style="background-color: rgb(210, 210, 210);">1年後</button>');
    }, 17500);
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
    setTimeout(() => endrolltxt(index + 1), 14000);
  }

  // イベントハンドラの登録
  $('.host').on('click', popupStream);
  $('.viewer').on('click', displayScreen);
  $('.title').on('click', showMain);
  $('.next').on('click', gonum);
  $('.gogo').on('click', gogo);
  $('.goend').on('click', end);
  $('.nextyear').on('click', showMain);

  // debug
  // popupStream();
  // showMain();
  // gonum();
  // gogo();
  // end();
});
