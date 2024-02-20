/**
 * ページの読み込みが完了した時に一度だけ実行されるコールバック関数。
 */
$(() => {
  // const examRate = $('#exam-rate');
  // const otherRate = $('#other-rate');

  // /**
  //  * examRate の値が変更された時に実行され、
  //  * otherRate の値を計算して設定するコールバック関数。
  //  */
  // examRate.on('change', () => {
  //   otherRate.val(100 - examRate.val());
  // });

  // /**
  //  * otherRate の値が変更された時に実行され、
  //  * examRate の値を計算して設定するコールバック関数。
  //  */
  // otherRate.on('change', () => {
  //   examRate.val(100 - otherRate.val());
  // });

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
  const template = $('#num-template');
  const templateSelect = $('#num-template-select');
  const templateCalc = $('#num-template-calc');
  const templateExam = $('#num-template-exam');
  const templateRate = $('#num-template-rate');
  const templatePortfolio = $('#num-template-portfolio');
  const templateDirect = $('#num-template-direct');
  const templateGrade = $('#num-template-grade');
  const dynamic = $('#num-dynamic');

  nextButton.on('click', () => {
    console.log('nextButton clicked');
    /*
    前期中間:              前期中間
    前期期末:             (前期中間 + 前期期末)
    前期補講:             (前期中間 + 前期期末) + 前期補講
    前期再試:            ((前期中間 + 前期期末) + 前期補講) + 前期再試
    後期中間: 後期成績 +   後期中間
    後期期末: 後期成績 +  (後期中間 + 後期期末)
    後期補講: 後期成績 +  (後期中間 + 後期期末) + 後期補講
    後期再試: 後期成績 + ((後期中間 + 後期期末) + 後期補講) + 後期再試
    単位認定: 単位認定
    */

    /** @type {string[]} */
    const parts = calcBaseSelect.val().split('-');
    /** @type {'first'|'second'|'last'|''} 学期 */
    const semester = parts[0] || '';
    /** @type {'mid'|'final'|'supplemental'|'re'|'exam'|''} 試験種別 */
    const examType = parts[1] || '';

    if (semester === 'last') {
      dynamic.text('Not implemented yet.');
    } else if (semester === 'second') {
      dynamic.text('Not implemented yet.');
    } else if (semester === 'first') {
      if (examType === 'mid') {
        dynamic.append(template.html().replace(/template/g, 'mid'));
        $('#num-mid').show();
        $('#num-mid-select[value="direct"]').attr('disabled', true);
        $('#num-mid-calc').show();
      } else {
        dynamic.text('Not implemented yet.');
      }
    }

    // TODO: 入力値が正常な場合のみボタンをrainbowに
  });

  console.log('script.js ready');
});
