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
  const title = $('#num-title');
  const template = $('#num-template');
  const dynamic = $('#num-dynamic');
  const goButton = $('.gogo');

  nextButton.on('click', () => {
    console.log('nextButton clicked');

    /**
     * 入力フォームの値が変更された時に実行されるコールバック関数。
     * @param {'calc'|'direct'|''} name
     * @param {JQuery.Event} event
     */
    const formChange = (name, event) => {
      console.log('form changed');
      /** @type {'calc'|'direct'|''} */
      const value = $(event.target).find('option:selected').val();
      $(`#num-${name}-calc`).hide();
      $(`#num-${name}-direct`).hide();
      $(`#num-${name}-${value}`).show();
    };

    /**
     * テンプレートから点数入力フォームを複製する。
     * @param {string} name 複製後のテンプレートのidに使用される名前。
     * @param {'calc'|'direct'|''} defaultSelect 初期で選択される選択肢。
     * @param {boolean} force trueの場合、defaultSelectを強制し変更できないようにする。
     */
    const summonForm = (name, defaultSelect = '', force = false) => {
      dynamic.append(template.html().replace(/template/g, name));

      if (defaultSelect) {
        $(`#num-${name}-select option[value="${defaultSelect}"]`).attr('selected', true);
      }

      if (defaultSelect && force) {
        $(`#num-${name}-select option`).attr('disabled', true);
        $(`#num-${name}-select option[value="${defaultSelect}"]`).attr('disabled', false);
        // $(`#num-${name}-select`).attr('disabled', true);
        $(`#num-${name}-select`).hide();
      } else {
        $(`#num-${name}-select`).on('change', (event) => {
          formChange(name, event);
        });
        $(`#num-${name}-select`).show();
      }

      // サブタイトルを設定
      $(`#num-${name}-subtitle`).text(calcBaseSelect.find(`option[value="${name}"]`).text());
      $(`#num-${name}`).show();
      $(`#num-${name}-${defaultSelect || 'calc'}`).show();
    };

    /*
    前期中間:              前期中間
    前期期末:             (前期中間 + 前期期末)
    前期補講:             (前期中間 + 前期期末) + 前期補講
    前期再試:            ((前期中間 + 前期期末) + 前期補講) + 前期再試
    後期中間: 前期成績 +   後期中間
    後期期末: 前期成績 +  (後期中間 + 後期期末)
    後期補講: 前期成績 +  (後期中間 + 後期期末) + 後期補講
    後期再試: 前期成績 + ((後期中間 + 後期期末) + 後期補講) + 後期再試
    単位認定: 単位認定
    */

    /*
    前期中間: round(中間試験点*試験点割合 + 中間ポートフォリオ点)
    前期期末: round((中間試験点+期末試験点)*試験点割合/2) + ポートフォリオ点
    前期補講: round((中間試験点+期末試験点)*試験点割合/2) + 補講後のポートフォリオ点
    前期再試: round(再試験点数*試験点割合) + 補講後のポートフォリオ点
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
    title.text(calcTargetName.text());

    // 入力フォームを表示
    switch (semester) {
      case 'last':
        dynamic.text('Not implemented yet.');
        break;
      case 'second':
        summonForm('first', 'direct', true);
        // breakは必要なし
      case 'first':
        switch (examType) {
          case 'mid':
            summonForm(`${semester}-mid`, 'calc', true);
            break;
          case 'final':
            summonForm(`${semester}-mid`, 'calc', true);
            summonForm(`${semester}-final`, 'calc', true);
            break;
          case 'supplemental':
          case 'reexam':
            summonForm(`${semester}-mid`, 'calc', true);
            summonForm(`${semester}-final`, 'calc', true);
            summonForm(`${semester}-supplemental`, 'direct', true);
            $(`#num-${semester}-supplemental-direct`).html(
                $(`#num-${semester}-supplemental-direct`)
                    .html()
                    .replace(/成績/, '補講後のポートフォリオ'),
            );

            if (examType === 'supplemental') break;

            summonForm(`${semester}-reexam`, 'direct', true);
            $(`#num-${semester}-reexam-direct`).html(
                $(`#num-${semester}-reexam-direct`)
                    .html()
                    .replace(/成績/, '再試験の点数'),
            );
            break;
        }
    }

    // TODO: 入力値が正常な場合のみボタンをrainbowに
  });

  console.log('script.js ready');
});
