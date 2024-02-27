export {assert, calcMid, calcFinal, calcSupplemental, calcReexam, calcLast, calc};

/**
 * 条件を検証し、条件が false の場合は例外をスローします。
 * @param {boolean} condition 検証する条件
 * @param {Error|string} assertion 条件が false の場合にスローされるエラーメッセージまたはエラーオブジェクト
 * @throws {Error} 条件が false の場合にスローされるエラーオブジェクト
 */
const assert = (condition, assertion) => {
  if (!condition) throw assertion instanceof Error ? assertion : new Error(assertion);
};

/**
 * 中間試験終了時点での成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ
 * @return {number} 成績点(0-100)
 */
const calcMid = (mid, rate, portfolio) =>
  Math.ceil(mid * (rate / 100) + portfolio);

/**
 * 期末試験終了時点での成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ
 * @return {number} 成績点(0-100)
 */
const calcFinal = (mid, final, rate, portfolio) =>
  Math.ceil((mid + final) / 2 * (rate / 100) + portfolio);

/**
 * 補講後の成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ(補講後)
 * @return {number} 成績点(0-100)
 */
const calcSupplemental = (mid, final, rate, portfolio) =>
  Math.ceil((mid + final) / 2 * (rate / 100) + portfolio);

/**
 * 再試験終了時点での成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ(補講後)
 * @param {number} reexam 再試験の点数
 * @return {number} 成績点(0-100)
 */
const calcReexam = (mid, final, rate, portfolio, reexam) =>
  Math.max(Math.min(60, Math.ceil(reexam * (rate / 100) + portfolio)), calcFinal(mid, final, rate, portfolio));

/**
 * 単位認定試験終了時点での成績点を計算する。
 * @param {number} last 単位認定試験の点数
 * @return {number} 成績点(0-100) *単位認定試験後の成績が60点を超えることはない
 */
const calcLast = (last) =>
  Math.min(60, last);

/**
 * `data`から`type`の成績点を計算する。
 * @param {'first'|'mid'|'final'|'supplemental'|'reexam'|'last'} type 計算する種類
 * @param {{mid: number?, final: number?, rate: number?, portfolio: number?, reexam: number?, last: number?}} data 計算に必要なデータ
 * @return {number} 成績点(0-100)
 */
const calcFrom = (type, data) => {
  switch (type) {
    case 'mid':
      return calcMid(data.mid, data.rate, data.portfolio);
    case 'final':
      return calcFinal(data.mid, data.final, data.rate, data.portfolio);
    case 'supplemental':
      return calcSupplemental(data.mid, data.final, data.rate, data.portfolio);
    case 'reexam':
      return calcReexam(data.mid, data.final, data.rate, data.portfolio, data.reexam);
    case 'first':
    case 'last':
      return calcLast(data.last);
  }
};

/**
 * フォームに入力された情報から自動で成績点を計算し、その他の情報とともに返す。
 * @return {{score: number, semester: ('first'|'second'|'last'), examType: ('mid'|'final'|'supplemental'|'reexam'|''), nextExam: ('前期中間'|'前期期末'|'前期補講'|'前期再試'|'後期中間'|'後期期末'|'後期補講'|'後期再試'|'単位認定'|'合格'|'留年'), remainingType: ('exam'|'portfolio'|'score'), remainingValue: number}} 成績点, 学期, 試験種別, 次の試験, 残っている値の種類, 残っている値
 * @throws {RangeError} Invalid form input
 */
const calc = () => {
  const validForm = $('.numwindow').find('input:visible').toArray().every((element) => element.checkValidity());
  if (!validForm) {
    throw new RangeError('Invalid form input');
  }

  /** @type {string[]} */
  const parts = $('#calc-base-select').val().split('-');
  /** 学期 @type {'first'|'second'|'last'|''} */
  const semester = parts[0] || '';
  /** 試験種別 @type {'mid'|'final'|'supplemental'|'reexam'|''} */
  const examType = parts[1] || '';

  const examRate = Number($('#exam-rate-select').val());
  const portfolioRate = 100 - examRate;

  const first = Number($('#num-first-input').val());
  const mid = Number($('#num-mid-exam-input').val());
  const final = Number($('#num-final-exam-input').val());
  const portfolio = Number($('#num-portfolio-input').val());
  const reexam = Number($('#num-reexam-input').val());
  const last = Number($('#num-last-input').val());

  let score = 0;

  if (semester === 'last') {
    score = calcLast(last);
  } else {
    switch (examType) {
      case 'mid':
        score = calcMid(mid, examRate, portfolio);
        break;
      case 'final':
        score = calcFinal(mid, final, examRate, portfolio);
        break;
      case 'supplemental':
        score = calcSupplemental(mid, final, examRate, portfolio);
        break;
      case 'reexam':
        score = calcReexam(mid, final, examRate, portfolio, reexam);
        break;
    }
    if (semester === 'second') {
      score = Math.round((first + score) / 2);
    }
  }

  let nextExam = (semester === 'first' ? '前期' : '後期');
  let remainingType = '';
  let remainingValue = 0;

  if (semester === 'last') {
    if (score < 60) {
      nextExam = '留年';
      remainingType = 'score';
      remainingValue = Infinity;
    } else {
      nextExam = '合格';
      remainingType = 'score';
      remainingValue = 0;
    }
  } else if (semester === 'second' && first < 60) {
    nextExam = '単位認定';
    remainingType = 'exam';
    remainingValue = 60;
  } else {
    switch (examType) {
      case 'mid':
        nextExam += '期末';
        remainingType = 'exam';
        remainingValue = [...Array(100 + 1).keys()].find((value) =>
          calcFinal(mid, value, examRate, portfolio) >= 60,
        );
        break;
      case 'final':
        if (score < 60) {
          nextExam += '補講';
          remainingType = 'portfolio';
          remainingValue = ([...Array(portfolioRate + 1).keys()].find((value) =>
            calcSupplemental(mid, final, examRate, value) >= 60,
          ) - portfolio);
          if (Number.isNaN(remainingValue)) {
            nextExam = '再試';
            remainingType = 'exam';
            remainingValue = [...Array(100 + 1).keys()].find((value) =>
              calcReexam(mid, final, examRate, portfolio, value) >= 60,
            );
          }
        } else if (semester === 'first') {
          nextExam = '後期';
          remainingType = 'score';
          remainingValue = 120 - score;
        } else {
          nextExam = '合格';
          remainingType = 'score';
          remainingValue = 0;
        }
        break;
      case 'supplemental':
        if (score < 60) {
          nextExam += '再試';
          remainingType = 'exam';
          remainingValue = [...Array(100 + 1).keys()].find((value) =>
            calcReexam(mid, final, examRate, portfolio, value) >= 60,
          );
        } else if (semester === 'first') {
          nextExam = '後期';
          remainingType = 'score';
          remainingValue = 60;
        } else {
          nextExam = '合格';
          remainingType = 'score';
          remainingValue = 0;
        }
        break;
      case 'reexam':
        if (score < 60) {
          if (semester === 'first') {
            nextExam = '後期';
            remainingType = 'score';
            remainingValue = 120 - score;
          } else {
            nextExam = '単位認定';
            remainingType = 'exam';
            remainingValue = 60;
          }
        } else if (semester === 'first') {
          nextExam = '後期';
          remainingType = 'score';
          remainingValue = 60;
        } else {
          nextExam = '合格';
          remainingType = 'score';
          remainingValue = 0;
        }
        break;
    }
  }

  return {score, semester, examType, nextExam, remainingType, remainingValue};
};

// ページの読み込みが完了した時に一度だけ実行される。
$(() => {
  const calcBaseSelect = $('#calc-base-select');
  const calcTargetName = $('#calc-target-name');
  const calcTargetMessageDefault = $('#calc-target-message-default');
  const calcTargetMessageRetention = $('#calc-target-message-retention');

  /**
   * #calc-base-select の値が変更された時に実行され、
   * #calc-target-name の文字列を変更し、
   * それに応じたメッセージの表示を切り替えるコールバック関数。
   */
  calcBaseSelect.on('change', () => {
    const selected = calcBaseSelect.find(':selected');
    calcTargetName.text(selected.next().text());

    // 単位認定試験専用メッセージ
    if (selected.val() === 'last') {
      calcTargetMessageDefault.hide();
      calcTargetMessageRetention.show();
    } else {
      calcTargetMessageDefault.show();
      calcTargetMessageRetention.hide();
    }
  });

  const nextButton = $('.next');
  const goButton = $('.gogo');
  const title = $('#num-title');

  const numWindow = $('.numwindow');
  const numFirst = $('#num-first');
  const numMidExam = $('#num-mid-exam');
  const numMidExamPrefix = $('#num-mid-exam-prefix');
  const numFinalExam = $('#num-final-exam');
  const numFinalExamPrefix = $('#num-final-exam-prefix');
  const numPortfolio = $('#num-portfolio');
  const numPortfolioPrefix = $('#num-portfolio-prefix');
  const numReexam = $('#num-reexam');
  const numLast = $('#num-last');

  nextButton.on('click', () => {
    console.log('nextButton clicked');

    /*
    前期中間: round(中間試験点*試験点割合 + 中間ポートフォリオ点)
    前期期末: round((中間試験点+期末試験点)*試験点割合/2) + ポートフォリオ点
    前期補講: round((中間試験点+期末試験点)*試験点割合/2) + 補講後のポートフォリオ点
    前期再試: round(再試験点数*試験点割合)||中間期末試験点 + 補講後のポートフォリオ点
    後期: 前期 + ↑
    単位認定: 単位認定点数(直接入力)
    */

    /** @type {string[]} */
    const parts = calcBaseSelect.val().split('-');
    /** @type {'first'|'second'|'last'|''} 学期 */
    const semester = parts[0] || '';
    /** @type {'mid'|'final'|'supplemental'|'reexam'|''} 試験種別 */
    const examType = parts[1] || '';

    // タイトルを設定
    if (semester === 'last') {
      title.text('留年するかどうかを計算');
    } else {
      title.text(`${calcTargetName.text()}で必要な点数を計算`);
    }

    // 試験点割合とポートフォリオ点を設定
    const examRate = Number($('#exam-rate-select').val());
    const portfolioRate = 100 - examRate;

    $('.num-exam-rate').text(examRate);
    numWindow.find('div input').each((index, element) =>
      element.setAttribute('placeholder', [...Array(100 + 1).keys()].find((value) =>
        calcFrom(element.id.replace(/num-([^-]+)(-.+)/, '$1'), {mid: value, final: value, rate: examRate, portfolio: portfolioRate, reexam: value, last: value}) >= 60,
      )));

    $('.num-portfolio-rate').text(portfolioRate);
    $('#num-portfolio-input').attr('placeholder', portfolioRate);
    $('#num-portfolio-input').attr('max', portfolioRate);
    if (portfolioRate === 0) {
      $('#num-portfolio-input').val(0);
    }

    numFirst.hide();
    numMidExam.hide();
    numFinalExam.hide();
    numPortfolio.hide();
    numReexam.hide();
    numLast.hide();

    numFirst.val('');
    numMidExam.val('');
    numFinalExam.val('');
    numPortfolio.val('');
    numReexam.val('');
    numLast.val('');

    numMidExamPrefix.text('前期中間試験');
    numFinalExamPrefix.text('前期期末試験');
    numPortfolioPrefix.text('ポートフォリオ');

    // 入力フォームを表示
    switch (semester) {
      case 'last':
        numFirst.show();
        numMidExam.show();
        numMidExamPrefix.text('後期中間試験');
        numFinalExam.show();
        numFinalExamPrefix.text('後期期末試験');
        numPortfolioPrefix.text('補講後のポートフォリオ');
        numReexam.show();
        numLast.show();
        break;
      case 'second':
        numFirst.show();
        numMidExamPrefix.text('後期中間試験');
        numFinalExamPrefix.text('後期期末試験');
      case 'first':
        switch (examType) {
          case 'reexam':
            numReexam.show();
          case 'supplemental':
            numPortfolioPrefix.text('補講後のポートフォリオ');
          case 'final':
            numFinalExam.show();
          case 'mid':
            numMidExam.show();
            if (portfolioRate > 0) {
              numPortfolio.show();
            }
            break;
        }
    }

    goButton.removeAttr('disabled');
  });

  console.log('script.js ready');
});
