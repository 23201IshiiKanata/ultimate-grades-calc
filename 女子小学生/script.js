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

  console.log('script.js ready');
});
