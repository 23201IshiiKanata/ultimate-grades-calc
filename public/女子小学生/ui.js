import {calc} from './script.js';

// 読み込み完了時に一度だけ実行される。
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
  // onemore
  const oneMore = new Audio('./sound/onemore.mp3');

  // BGMをループ再生する
  titleMusic.loop = true;
  mainMusic.loop = true;
  retentionMusic.loop = true;
  goukakuMusic.loop = true;
  oneMore.loop = true;

  // 配信画面をポップアップ(PinP)に切り替え、タイトル画面を表示する。
  $('.host').on('click', () => {
    // 連打防止
    start();
  });

  /**
   * Missing JSDoc comment.
   */
  function start() {
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

    setTimeout(() => {
      $('.pinp').css('transition', '.1s');
    }, 100);
  }

  // "傍観者"として、配信画面を視聴する。
  $('.viewer').on('click', () => {
    $('.pinp').addClass('small');
    $('.client').removeClass('none');
  });

  // タイトル画面から計算画面へ遷移する。
  $('.title').on('click', () => {
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
  });

  // 前提条件の入力を完了し、計算画面へ遷移する。
  $('.next').on('click', () => {
    $('.calcwindow input, .calcwindow button, .calcwindow select').prop('disabled', true);
    $('.calcwindow').addClass('hidewin');
    $('.numwindow').addClass('viwwwnum');
    clickTitleSound.currentTime = 0;
    clickTitleSound.play();
  });

  // フォームの入力をチェックし、計算結果を結果画面に遷移して表示する。
  $('.gogo').on('click', () => {
    console.log('gogoButton clicked');

    /** 成績 @type {number} */
    let score;
    /** 学期 @type {"first" | "second" | "last"}*/
    let semester;
    /** 試験種別 @type {'mid'|'final'|'supplemental'|'reexam'|''} */
    let examType;

    // 値の取得 + 入力チェック
    try {
      ({score, semester, examType} = calc());
    } catch (e) {
      if (e instanceof RangeError && e.message === 'Invalid form input') {
        console.log(e.message);
        alert('点数を正しく入力しやがれください');
      }
      return;
    }
    console.log('Input is vaild');

    // 要素をアニメーション
    $('.numwindow').addClass('hiwwwnum');

    setTimeout(() => {
      $('.numwindow').css('display', 'none');
    }, 700);

    // 入力を無効化する
    $('.next').prop('disabled', true);
    $('.gogo').prop('disabled', true);
    $('#numwindow').find('input').prop('disabled', true);

    // BGMを止めSEを再生
    mainMusic.pause();
    preResultSound.play();

    // 指定時間後に結果画面を表示
    setTimeout(() => {
      if (score < 60) {
        ryunen();
        // 魔法の計算を行う
        const rate = (semester === 'last' ? '0.00' : Number.parseFloat(
            // score * 1.666666666666666666666 * 0.75,
            // 50 + 50 * Math.cos((score - 60) * ((2 * Math.PI) / (60 * 2))),
            ((score**2) / 45 ) || -50.0,
        ).toFixed(1));
        $('.resus').html(`総合成績${score}により、貴方が留年を回避できる確率は${rate}%です。`);
      } else if (score >= 60) {
        goukaku();
        $('.resugs').html(`総合成績${score}`);
      }
    }, 4500);
  });

  /**
   * 計算画面から結果画面まで遷移する。
   */
  const ryunen = () => {
    // 留年祝いのBGM+SEを再生
    retentionMusic.play();
    setTimeout(() => {
      retentionSound.play;
    }, 100);

    // アニメーション
    $('.resu').addClass('viewin');
    $('body').addClass('hyper');

    // エンドロールボタンを有効化
    // TODO: 真の留年の際にのみエンドロールを有効化する
    $('.goend').removeAttr('disabled');
  };

  /**
   * 計算画面から結果画面まで遷移する。
   */
  const goukaku = () => {
    // 合格祝いのBGM+SEを再生
    goukakuMusic.play();
    setTimeout(() => {
      goukakuSound.play;
    }, 100);

    // アニメーション
    $('.resug').addClass('viewin');
  };

  // エンドロールの表示を行う。
  $('.goend').on('click', () => {
    // 音楽をエンドロール用に切り替え
    retentionMusic.pause();
    endrollMusic.play();

    // アニメーション
    $('.resu').addClass('hiwwwnum');
    $('.calcwindow').addClass('hiwwwnum');
    $('.end').removeClass('dis');
    $('body').removeClass('hyper');

    // エンドロールの表示処理
    setTimeout(() => {
      endrolltxt();
    }, 500);
    setTimeout(() => {
      endrollMusic2.play();
    }, 281000);
    setTimeout(() => {
      oneMore.play();
      moregrade();
    }, 539000);
  });

  /**
   * もう1回遊べるドン
   */
  const moregrade = () => {
    oneMore.play();
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
      $('.chrx').html('<button class="nextyear" onclick="location.reload();" style="background-color: rgb(210, 210, 210);">1年後</button>');
    }, 17500);
  };

  /**
   * エンドロールのテキストを順に表示する。
   * @param {number} index 表示するエンドロールの位置
   */
  const endrolltxt = (index = 1) => {
    // 対象となる要素を取得し、存在しなければ終了
    const element = $('#endroll').children(`:nth-child(${index})`);
    if (!!!element.length) return;

    // .chrxにのみupperxを、それ以外にはupperを付与
    if (element.hasClass('chrx')) {
      element.addClass('upperx');
    } else {
      element.addClass('upper');
    }

    // 次の要素を指定時間後に表示
    setTimeout(() => {
      endrolltxt(index + 1);
    }, 524000/44);
  };

  console.log('ui.js ready');

  // イベントハンドラの登録

  // debug
  // popupStream();
  // showMain();
  // gonum();
  // gogo();
  // end();
});
