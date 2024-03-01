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
  const goukakuSound = new Audio('./sound/gokaku.mp3');
  /** タイトル画面ボイス */
  const titleSound = new Audio('./sound/ugctitle.mp3');
  /** 留年ボイス */
  const ryuSound = new Audio('./sound/ryu.mp3');
  /** 合格ボイス */
  const gouSound = new Audio('./sound/gou.mp3');
  /** goukaku祝いの拍手の効果音 */
  const overSound = new Audio('./sound/over.mp3');
  /** mouikkaiasobesuyo */
  const moreSound = new Audio('./sound/one.mp3');

  /** タイトル画面のBGM */
  const titleMusic = new Audio('./sound/title.mp3');
  /** 計算画面のBGM */
  const mainMusic = new Audio('./sound/bgm.mp3');
  /** 留年祝いのBGM */
  const retentionMusic = new Audio('./sound/oioi.mp3');
  /** goukakuのBGM */
  const goukakuMusic = new Audio('./sound/goukaku.mp3');
  /** えんどろーる */
  const endrollMusic = document.querySelector('#audio');

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
    titleSound.play();
    setTimeout(() => {
      if (mainMusic.paused) titleMusic.play();
    }, 1200);

    const script = document.createElement('script'); // 変数名は適当なものにでも
    script.src = 'js/pinp.js'; // ファイルパス
    document.head.appendChild(script); // <head>に生成
    // document.body.appendChild(script); /*<body>に生成する場合はこちら*/

    setTimeout(() => {
      $('.pinp').css('transition', '0s');
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

  // 前提条件の入力を完了し、計算画面へ遷移する。
  $('.back').on('click', () => {
    $('.calcwindow input, .calcwindow button, .calcwindow select').prop('disabled', false);
    $('.calcwindow').removeClass('hidewin');
    $('.numwindow').removeClass('viwwwnum');
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
    /** 学期名 @type {"前期" | "後期" | "単位認定"} */
    let semesterName;
    /** 試験種別 @type {'mid'|'final'|'supplemental'|'reexam'|''} */
    let examType;
    /** 試験種別名 @type {'中間'|'期末'|'補講'|'再試'|''} */
    let examTypeName;
    /** 次の試験/学期 @type {import('./script.js').Remaining['nextExam']} */
    let nextExam;
    /** 残っている値の種類 @type {import('./script.js').Remaining['remainingType']} */
    let remainingType;
    /** 残っている値 @type {import('./script.js').Remaining['remainingValue']} */
    let remainingValue;
    /** メッセージ @type {string} */
    let message;
    /** 留年の危機にある場合はtrue @type {boolean} */
    let isDanger;

    const semesterNames = {
      'first': '前期',
      'second': '後期',
      'last': '単位認定',
    };
    const examTypeNames = {
      'mid': '中間',
      'final': '期末',
      'supplemental': '補講',
      'reexam': '再試',
      '': '',
    };

    const portfolio = $('#num-portfolio').val();

    // 値の取得 + 入力チェック
    try {
      ({score, semester, examType, nextExam, remainingType, remainingValue, message, isDanger} = calc());
      semesterName = semesterNames[semester];
      examTypeName = examTypeNames[examType];
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
      const rate = (semester === 'last' ? '-50.0' : Number.parseFloat(
          // score * 1.666666666666666666666 * 0.75,
          // 50 + 50 * Math.cos((score - 60) * ((2 * Math.PI) / (60 * 2))),
          (((remainingValue * (remainingType === 'portfolio' ? 2 : 1)) ** 2) / 45) || -50.0,
      ).toFixed(1));

      $('.resus, .resugs').append(`<p>${semesterName}${examTypeName}の成績計算結果: ${score}点</p><p>`);
      message = message.replace('\n', '</p><p>').replace('$RATE$', rate).replace('$REMAININGVALUE$', remainingValue).replace('$NEXTEXAM$', nextExam);
      if (isDanger) {
        ryunen();
        $('.resus').append(message);
      } else {
        gameOVER();
        $('.resugs').append(message);
      }
      $('.resus, .resugs').append(`</p>`);
    }, 4500);
  });

  /**
   * 計算画面から結果画面まで遷移する。
   */
  const ryunen = () => {
    // 留年祝いのBGM+SEを再生
    retentionMusic.play();
    setTimeout(() => {
      retentionSound.play();
      ryuSound.play();
    }, 100);

    // アニメーション
    $('.resu').addClass('viewin');
    $('body').addClass('hyper');

    // エンドロールボタンを有効化
    $('.goend').removeAttr('disabled');
  };

  const howlong = 217000;

  // エンドロールの表示を行う。
  $('.goend').on('click', () => {
    // 音楽をエンドロール用に切り替え
    openFullscreen();
    $('.visualizer').css('opacity', '0%');
    $('.visualizer').css('opacity', '100%');
    retentionMusic.pause();
    $('.visualizer')[0].dispatchEvent(new Event('initSound'));
    $('#canvas').show();
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
      moregrade();
    }, howlong + 2000);
  });

  /**
   * もう1回遊べるドン
   */
  const moregrade = () => {
    oneMore.play();
    $('.visualizer').css('opacity', '0%');
    $('.end').css('transition', '1s');
    $('.end').css('background-color', 'white');
    setTimeout(() => {
      $('.visualizer').addClass('none');
      repoView();
      $('.chrx').css('transition', '.5s');
      $('.chrx').css('color', 'black');
      $('.chrx').html('もう1回遊べるドン');
    }, 1000);
    setTimeout(() => {
      repoView();
      moreSound.play();
    }, 1500);
    setTimeout(() => {
      $('.chrx').html('<button class="nextyear" onclick="location.reload();" style="background-color: rgb(210, 210, 210);">1年後</button>');
    }, 11000);
  };

  const repoView = () => {
    $('.repo').removeClass('none');
    $('.repo').css('opacity', '0%');
    setTimeout(() => {
      $('.repo').css('opacity', '100%');
    }, 1000);
  };

  /**
   * 計算画面から結果画面まで遷移する。
   */
  const gameOVER = () => {
    openFullscreen();
    $('body').addClass('dark');
    $('.calcwindow').addClass('none');
    $('.pinp').addClass('none');
    // 合格祝いのBGM+SEを再生
    goukakuMusic.play();
    setTimeout(() => {
      gouSound.play();
      goukakuSound.play();
    }, 100);
    // アニメーション
    $('.resug').addClass('viewin');
    setTimeout(() => {
      goukakuED();
    }, 3000);
  };

  /**
   * gouakuED
   */
  const goukakuED = () => {
    $('.resug').addClass('viewin');
    $('.over').removeClass('none');
    $('.over').css('opacity', '0%');
    $('.x').addClass('upperx');
    $('.overh1').css('color', 'black');
    setTimeout(() => {
      $('.over').css('opacity', '100%');
    }, 3000);
    setTimeout(() => {
      $('.overh1').css('color', '#808080');
    }, 10000);
    setTimeout(() => {
      overSound.play();
    }, 11000);
    setTimeout(() => {
      $('.txt').css('color', '#808080');
      repoView();
    }, 17000);
    setTimeout(() => {
      $('.chrx').html('<button class="nextyear" onclick="location.reload();" style="background-color: rgb(210, 210, 210);">1年後</button>');
    }, 27000);
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
    }, (howlong - 5000) / $('#endroll').children().length); // (MUSIC TIME - 7.5s) / ELEMENT
  };

  /**
   * 全画面表示をリクエストするメソッドを取得
   * @param {*} elem;
   */
  function requestFullscreen(elem) {
    // 全画面表示をリクエストするメソッドを取得
    const method = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
    if (method) {
      method.call(elem); // 全画面表示をリクエスト
    }
  }

  /**
   * 全画面表示をリクエストするメソッドを取得
   */
  function openFullscreen() {
    const elem = document.documentElement;
    requestFullscreen(elem);
  }

  console.log('ui.js ready');


  /**
  * なんか書け
  */
  const randomAnimationDuration = () => {
    $('.flick').css('animation-duration', `${Math.random()}s`);
    // console.log(Math.random());
    setTimeout(randomAnimationDuration, 100);
  };
  randomAnimationDuration();

  // イベントハンドラの登録

  // debug
  // popupStream();
  // showMain();
  // gonum();
  // gogo();
  // end();
});
