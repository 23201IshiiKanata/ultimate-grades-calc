/**
 * 読み込み完了時に一度だけ実行される。
 */
$(() => {
  //\u8981\u7d20\u306e\u53d6\u5f97
  var elements = document.getElementsByClassName("drag-and-drop");

  //\u8981\u7d20\u5185\u306e\u30af\u30ea\u30c3\u30af\u3055\u308c\u305f\u4f4d\u7f6e\u3092\u53d6\u5f97\u3059\u308b\u30b0\u30ed\u30fc\u30d0\u30eb\uff08\u306e\u3088\u3046\u306a\uff09\u5909\u6570
  var x;
  var y;

  //\u30de\u30a6\u30b9\u304c\u8981\u7d20\u5185\u3067\u62bc\u3055\u308c\u305f\u3068\u304d\u3001\u53c8\u306f\u30bf\u30c3\u30c1\u3055\u308c\u305f\u3068\u304d\u767a\u706b
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("mousedown", mdown, false);
    elements[i].addEventListener("touchstart", mdown, false);
  }

  //\u30de\u30a6\u30b9\u304c\u62bc\u3055\u308c\u305f\u969b\u306e\u95a2\u6570
  function mdown(e) {

    //\u30af\u30e9\u30b9\u540d\u306b .drag \u3092\u8ffd\u52a0
    this.classList.add("drag");

    //\u30bf\u30c3\u30c1\u30c7\u30a4\u30d9\u30f3\u30c8\u3068\u30de\u30a6\u30b9\u306e\u30a4\u30d9\u30f3\u30c8\u306e\u5dee\u7570\u3092\u5438\u53ce
    if (e.type === "mousedown") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //\u8981\u7d20\u5185\u306e\u76f8\u5bfe\u5ea7\u6a19\u3092\u53d6\u5f97
    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    //\u30e0\u30fc\u30d6\u30a4\u30d9\u30f3\u30c8\u306b\u30b3\u30fc\u30eb\u30d0\u30c3\u30af
    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);
  }

  //\u30de\u30a6\u30b9\u30ab\u30fc\u30bd\u30eb\u304c\u52d5\u3044\u305f\u3068\u304d\u306b\u767a\u706b
  function mmove(e) {

    //\u30c9\u30e9\u30c3\u30b0\u3057\u3066\u3044\u308b\u8981\u7d20\u3092\u53d6\u5f97
    var drag = document.getElementsByClassName("drag")[0];

    //\u540c\u69d8\u306b\u30de\u30a6\u30b9\u3068\u30bf\u30c3\u30c1\u306e\u5dee\u7570\u3092\u5438\u53ce
    if (e.type === "mousemove") {
      var event = e;
    } else {
      var event = e.changedTouches[0];
    }

    //\u30d5\u30ea\u30c3\u30af\u3057\u305f\u3068\u304d\u306b\u753b\u9762\u3092\u52d5\u304b\u3055\u306a\u3044\u3088\u3046\u306b\u30c7\u30d5\u30a9\u30eb\u30c8\u52d5\u4f5c\u3092\u6291\u5236
    e.preventDefault();

    //\u30de\u30a6\u30b9\u304c\u52d5\u3044\u305f\u5834\u6240\u306b\u8981\u7d20\u3092\u52d5\u304b\u3059
    drag.style.top = event.pageY - y + "px";
    drag.style.left = event.pageX - x + "px";

    //\u30de\u30a6\u30b9\u30dc\u30bf\u30f3\u304c\u96e2\u3055\u308c\u305f\u3068\u304d\u3001\u307e\u305f\u306f\u30ab\u30fc\u30bd\u30eb\u304c\u5916\u308c\u305f\u3068\u304d\u767a\u706b
    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);

  }

  //\u30de\u30a6\u30b9\u30dc\u30bf\u30f3\u304c\u4e0a\u304c\u3063\u305f\u3089\u767a\u706b
  function mup(e) {
    var drag = document.getElementsByClassName("drag")[0];

    //\u30e0\u30fc\u30d6\u30d9\u30f3\u30c8\u30cf\u30f3\u30c9\u30e9\u306e\u6d88\u53bb
    document.body.removeEventListener("mousemove", mmove, false);
    drag.removeEventListener("mouseup", mup, false);
    document.body.removeEventListener("touchmove", mmove, false);
    drag.removeEventListener("touchend", mup, false);

    //\u30af\u30e9\u30b9\u540d .drag \u3082\u6d88\u3059
    drag.classList.remove("drag");
  }
});