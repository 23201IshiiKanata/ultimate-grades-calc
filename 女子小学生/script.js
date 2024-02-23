export {calcMid, calcFinal, calcSupplemental, calcReexam, calc};

/**
 * 中間試験終了時点での成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ
 * @return {number} 成績点(0-100)
 */
const calcMid = (mid, rate, portfolio) =>
  Math.round(mid * (rate / 100) + portfolio);

/**
 * 期末試験終了時点での成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ
 * @return {number} 成績点(0-100)
 */
const calcFinal = (mid, final, rate, portfolio) =>
  Math.round((mid + final) / 2 * (rate / 100) + portfolio);

/**
 * 補講後の成績点を計算する。
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} rate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ(補講後)
 * @return {number} 成績点(0-100)
 */
const calcSupplemental = (mid, final, rate, portfolio) =>
  Math.round((mid + final) / 2 * (rate / 100) + portfolio);

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
  Math.max(Math.round(reexam * (rate / 100) + portfolio), calcFinal(mid, final, rate, portfolio));

/**
 * フォームに入力された情報から自動で成績点を計算し、その他の情報とともに返す。
 * @return {{score: number, semester: ('first'|'second'|'last'), examType: ('mid'|'final'|'supplemental'|'reexam'|'')}} 成績点と学期と試験種別
 * @throws {RangeError} Invalid form input
 */
const calc = () => {
  const validForm = $('.numwindow').find('input:visible').toArray().every((element) => element.checkValidity());
  if (!validForm) {
    throw new RangeError('Invalid form input');
  }

  /** @type {string[]} */
  const parts = $('#calc-base-select').val().split('-');
  /** @type {'first'|'second'|'last'|''} 学期 */
  const semester = parts[0] || '';
  /** @type {'mid'|'final'|'supplemental'|'reexam'|''} 試験種別 */
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
    score = last;
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

  return {score, semester, examType};
};

/**
 * ページの読み込みが完了した時に一度だけ実行されるコールバック関数。
 */
$(() => {
  const examRateSelect = $('#exam-rate-select');

  examRateSelect.on('change', () => {
    console.log('examRateSelect changed');
  });

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
    if (selected.val() === 'last-exam') {
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

    /**
     * 入力フォームの値が変更された時に実行されるコールバック関数。
     * @param {JQuery.Event} event
     */
    const inputFormChange = (event) => {
      const elements = numWindow.find('input:visible').toArray();
      const isValid = elements.every((element) => {
        return element.checkValidity();
      });
      if (isValid) {
        goButton.attr('disabled', false);
        goButton.addClass('rainbow');
      } else {
        goButton.attr('disabled', true);
        goButton.removeClass('rainbow');
      }
    };

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
        numPortfolio.show();
        switch (examType) {
          case 'mid':
            numMidExam.show();
            break;
          case 'final':
            numMidExam.show();
            numFinalExam.show();
            break;
          case 'supplemental':
            numMidExam.show();
            numFinalExam.show();
            numPortfolioPrefix.text('補講後のポートフォリオ');
            break;
          case 'reexam':
            numMidExam.show();
            numFinalExam.show();
            numPortfolioPrefix.text('補講後のポートフォリオ');
            numReexam.show();
            break;
        }
    }

    numWindow.find('input').on('change', inputFormChange);
  });

  goButton.on('click', () => {
    console.log('goButton clicked');
  });

  console.log('script.js ready');
});
