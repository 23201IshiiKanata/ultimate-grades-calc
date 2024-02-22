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
      console.log(elements);
      const isValid = elements.every((element) => {
        console.log(element);
        console.log(element.checkValidity());
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

  console.log('script.js ready');
});
