var o = (function () {
    var pannel = $("#recite-pannel"),
        words = pannel.children();
    return {
        "pannel": pannel,
        "words": words,
        "len": words.length,
        "progress": $("#recite-progress"),
        "btnPre": $("#btn-pre"),
        "btnNext": $("#btn-next"),
        "btnReset": $("#btn-reset"),
        "btnSave": $("#btn-save"),
        "cur": 0
    };
})();

var showWord = function (idx) {
    o.words.eq(o.cur).hide().end().eq(idx).show();
    o.cur = idx;
    o.btnPre.prop('disabled', (idx == 0));
    o.btnNext.prop('disabled', (idx == o.len - 1));
};
o.btnPre.on('click', function () {
    showWord(o.cur - 1);
});
o.btnNext.on('click', function () {
    showWord(o.cur + 1);
});
o.btnReset.on('click', function () {

});
o.btnSave.on('click', function () {

});