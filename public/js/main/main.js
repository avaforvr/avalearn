var init = function () {
    require('./mod/collapse').init(); // Collapse Panel
    require('./mod/tab').init();      // tab
};

module.exports = {
    "init": init
};