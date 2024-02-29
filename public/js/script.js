export {assert, calcMid, calcFinal, calcSupplemental, calcReexam, calcLast, calcFrom, calc, calcMidRemaining, calcFinalRemaining, calcSupplementalRemaining, calcReexamRemaining};

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
 * @typedef {Object} Remaining
 * @prop {'前期中間'|'前期期末'|'前期補講'|'前期再試'|'後期'|'後期中間'|'後期期末'|'後期補講'|'後期再試'|'単位認定'|'合格'|'留年'} nextExam 次の試験/学期
 * @prop {'exam'|'portfolio'|'score'} remainingType 追加で取る必要がある点数の種類
 * @prop {number} remainingValue 追加で取る必要がある点数(次の試験/学期で0点でも合格できる場合は0、取っても合格にはならない場合はInfinity)
 * @prop {string} message メッセージ
 * @prop {boolean} isDanger 留年の危機にある場合はtrue
 */

/**
 * 中間試験終了時点での残りの成績点を計算する。
 * @param {number?} first 前期の成績点(0-100)、nullishの場合は前期として、数値の場合は後期として計算を行う
 * @param {number} mid 中間試験の点数
 * @param {number} examRate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ点
 * @return {Remaining}
 */
const calcMidRemaining = (first, mid, examRate, portfolio) => {
  const score = calcMid(mid, examRate, portfolio);
  const isFirstSemeseter = ((first ??= null) === null);
  const threshold = isFirstSemeseter ? 60 : 120 - first;

  // すでに合格している場合
  if (calcFinal(mid, 0, examRate, 0) >= threshold) {
    if (isFirstSemeseter) {
      return {
        nextExam: '後期',
        remainingType: 'score',
        remainingValue: 120 - score,
        message: `後期で$REMAININGVALUE$点以上の成績点を取ると合格です。`,
        isDanger: false,
      };
    } else {
      return {
        nextExam: '合格',
        remainingType: 'score',
        remainingValue: 0,
        message: `合格`,
        isDanger: false,
      };
    }
  }

  // 期末試験で合格する可能性がある場合
  if (calcFinal(mid, 100, examRate, 100 - examRate) >= threshold) {
    const remainingExamScore = [...Array(100 + 1).keys()].find((value) => {
      return calcFinal(mid, value, examRate, 100 - examRate) >= threshold;
    });
    return {
      nextExam: `${isFirstSemeseter ? '前期' : '後期'}期末`,
      remainingType: 'score',
      remainingValue: threshold,
      message: (score < threshold ?
        `このままでは$RATE$%の確率で留年です！\n$NEXTEXAM$試験で成績点$REMAININGVALUE$点を取ってください！\n` + (remainingExamScore > 0 ?
          `これは、ポートフォリオが${100 - examRate}点満点になると仮定した場合、${remainingExamScore}点以上の試験点となります。` :
          `期末試験で0点を取っても、ポートフォリオ点が${
            [...Array(100 - examRate + 1).keys()].find((value) => calcFinal(mid, 0, examRate, value) >= threshold)
          }以上であれば合格です。`
        ) : (`$NEXTEXAM$試験で$REMAININGVALUE$点以上の成績点を取ると合格です。\n` + (remainingExamScore > 0 ?
          `これは、ポートフォリオが${100 - examRate}点満点になると仮定した場合、${remainingExamScore}点以上の試験点となります。` :
          `期末試験で0点を取っても、ポートフォリオ点が${
            [...Array(100 - examRate + 1).keys()].find((value) => calcFinal(mid, 0, examRate, value) >= threshold)
          }以上であれば合格です。`
        ))
      ),
      isDanger: score < threshold,
    };
  }

  // 期末試験を受けても点数が足りない場合
  return {
    nextExam: `${isFirstSemeseter ? '前期' : '後期'}期末`,
    remainingType: 'score',
    remainingValue: Infinity,
    message: `このままでは$RATE$%の確率で留年です！\n${isFirstSemeseter ? '前期' : '後期'}を受けても合格には点数が足りません！`,
    isDanger: true,
  };
};

/**
 * 期末試験終了時点での残りの成績点を計算する。
 * @param {number?} first 前期の成績点(0-100)、nullishの場合は前期として、数値の場合は後期として計算を行う
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} examRate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ点
 * @return {Remaining}
 */
const calcFinalRemaining = (first, mid, final, examRate, portfolio) => {
  const score = calcFinal(mid, final, examRate, portfolio);
  const isFirstSemeseter = ((first ??= null) === null);
  const threshold = isFirstSemeseter ? 60 : 120 - first;

  // すでに合格している場合
  if (score >= threshold) {
    if (isFirstSemeseter) {
      return {
        nextExam: '後期',
        remainingType: 'score',
        remainingValue: 120 - score,
        message: `後期で$REMAININGVALUE$点以上の成績点を取ると合格です。`,
        isDanger: false,
      };
    } else {
      return {
        nextExam: '合格',
        remainingType: 'score',
        remainingValue: 0,
        message: `合格`,
        isDanger: false,
      };
    }
  }

  // 補講により補填可能な場合
  if (calcSupplemental(mid, final, examRate, 100 - examRate) >= threshold) {
    return {
      nextExam: `${isFirstSemeseter ? '前期' : '後期'}補講`,
      remainingType: 'portfolio',
      remainingValue: [...Array(100 - examRate + 1).keys()].find((value) =>
        calcSupplemental(mid, final, examRate, value) >= threshold,
      ) - portfolio,
      message: `このままでは$RATE$%の確率で留年です！\n$NEXTEXAM$で$REMAININGVALUE$点以上のポートフォリオ点を取ると合格です！`,
      isDanger: true,
    };
  }

  // 補講でも補填できず再試を受ける必要がある場合
  return {
    nextExam: `${isFirstSemeseter ? '前期' : '後期'}補講`,
    remainingType: 'score',
    remainingValue: Infinity,
    message: `このままでは$RATE$%の確率で留年です！\n$NEXTEXAM$を受けても合格には点数が足りません！`,
    isDanger: true,
  };
};


/**
 * 補講後の残りの成績点を計算する。
 * @param {number?} first 前期の成績点(0-100)、nullishの場合は前期として、数値の場合は後期として計算を行う
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} examRate 試験点の割合(百分率)
 * @param {number} portfolio ポートフォリオ点
 * @return {Remaining}
 */
const calcSupplementalRemaining = (first, mid, final, examRate, portfolio) => {
  const score = calcSupplemental(mid, final, examRate, portfolio);
  const isFirstSemeseter = ((first ??= null) === null);
  const threshold = isFirstSemeseter ? 60 : 120 - first;

  // すでに合格している場合
  if (score >= threshold) {
    if (isFirstSemeseter) {
      return {
        nextExam: '後期',
        remainingType: 'score',
        remainingValue: 120 - score,
        message: `後期で$REMAININGVALUE$点以上の成績点を取ると合格です。`,
        isDanger: false,
      };
    } else {
      return {
        nextExam: '合格',
        remainingType: 'score',
        remainingValue: 0,
        message: `合格`,
        isDanger: false,
      };
    }
  }

  // 再試を受ければ合格する可能性がある場合
  if (calcReexam(mid, final, examRate, portfolio, 100) >= threshold) {
    return {
      nextExam: `${isFirstSemeseter ? '前期' : '後期'}再試`,
      remainingType: 'exam',
      remainingValue: [...Array(100 + 1).keys()].find((value) =>
        calcReexam(mid, final, examRate, portfolio, value) >= threshold,
      ),
      message: `このままでは$RATE$%の確率で留年です！\n$NEXTEXAM$験で$REMAININGVALUE$点以上の試験点を取ると合格です！`,
      isDanger: true,
    };
  }

  // 再試を受けても点数が足りない場合
  return {
    nextExam: `${isFirstSemeseter ? '前期' : '後期'}再試`,
    remainingType: 'score',
    remainingValue: Infinity,
    message: (isFirstSemeseter ? `このままでは$RATE$%の確率で留年です！\n$NEXTEXAM$験を受けても合格には点数が足りないため、後期でさらに高い点数を取る必要があります！` : `このままでは$RATE$%の確率で留年です！\n単位認定試験が確定しています！`),
    isDanger: true,
  };
};

/**
 * 再試験終了時点での残りの成績点を計算する。
 * @param {number?} first 前期の成績点(0-100)、nullishの場合は前期として、数値の場合は後期として計算を行う
 * @param {number} mid 中間試験の点数
 * @param {number} final 期末試験の点数
 * @param {number} examRate 試験点の割合(百分率)
 * @param {number} portfolioRate ポートフォリオ点
 * @param {number} reexam 再試験の点数
 * @return {Remaining}
 */
const calcReexamRemaining = (first, mid, final, examRate, portfolioRate, reexam) => {
  const score = calcReexam(mid, final, examRate, portfolioRate, reexam);
  const isFirstSemeseter = ((first ??= null) === null);
  const threshold = isFirstSemeseter ? 60 : 120 - first;

  // すでに合格している場合
  if (score >= threshold) {
    return {
      nextExam: '合格',
      remainingType: 'score',
      remainingValue: 0,
      message: `合格`,
      isDanger: false,
    };
  }

  // 現在は前期かつ後期で巻き返せる可能性がある場合
  if (isFirstSemeseter && score >= 20) {
    return {
      nextExam: '後期',
      remainingType: 'score',
      remainingValue: 120 - score,
      message: `このままでは$RATE$の確率で留年です！\n後期で$REMAININGVALUE$点以上の成績点を取ると合格です！`,
      isDanger: true,
    };
  }

  // 単位認定試験確定
  return {
    nextExam: '後期',
    remainingType: 'score',
    remainingValue: Infinity,
    message: `このままでは$RATE$%の確率で留年です！\n単位認定試験が確定しています！`,
    isDanger: true,
  };
};

/**
 * 単位認定試験終了時点での残りの成績点を計算する。
 * @param {number} last 単位認定試験の点数
 * @return {Remaining}
 */
const calcLastRemaining = (last) => {
  if (last >= 60) {
    return {
      nextExam: '合格',
      remainingType: 'score',
      remainingValue: 0,
      message: `合格`,
      isDanger: false,
    };
  } else {
    return {
      nextExam: '留年',
      remainingType: 'score',
      remainingValue: Infinity,
      message: `留年確定！！！おめでとう！！！！`,
      isDanger: true,
    };
  }
};


/**
 * フォームに入力された情報から自動で成績点を計算し、その他の情報とともに返す。
 * @return {{
 *   score: number, semester: ('first'|'second'|'last'),
 *   examType: ('mid'|'final'|'supplemental'|'reexam'|''),
 *   nextExam: ('前期中間'|'前期期末'|'前期補講'|'前期再試'|'後期'|'後期中間'|'後期期末'|'後期補講'|'後期再試'|'単位認定'|'合格'|'留年'),
 *   remainingType: ('exam'|'portfolio'|'score'),
 *   remainingValue: number
 * }} 成績点, 学期, 試験種別, 次の試験, 残っている点数の種類, 残っている点数
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

  const first = (semester === 'first' ? null : Number($('#num-first-input').val()));
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
    // if (semester === 'second') {
    //   score = Math.round((first + score) / 2);
    // }
  }

  const remaining = (() => {
    switch (examType) {
      case 'mid':
        return calcMidRemaining(first, mid, examRate, portfolio);
      case 'final':
        return calcFinalRemaining(first, mid, final, examRate, portfolio);
      case 'supplemental':
        return calcSupplementalRemaining(first, mid, final, examRate, portfolio);
      case 'reexam':
        return calcReexamRemaining(first, mid, final, examRate, portfolio, reexam);
      default:
        if (semester === 'last') {
          return calcLastRemaining(last);
        }
        throw new Error('examType is invalid');
    }
  })();

  const nextExam = remaining.nextExam;
  const remainingType = remaining.remainingType;
  const remainingValue = remaining.remainingValue;
  const message = remaining.message;
  const isDanger = remaining.isDanger;

  return {score, semester, examType, nextExam, remainingType, remainingValue, message, isDanger};
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
        numPortfolio.show();
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
