var $ = require('jquery');

var init = function () {
    if($('.collapse').length < 1) {
        return;
    }
    $('body').on('click', '.collapse-btn', function () {
        var btn = $(this);
        var content = $(this).closest('.collapse').find('.collapse-cont');
        var group = btn.closest('.collapse-group');

        var data = btn.attr('data-collapse') ? eval('(' + btn.attr('data-collapse') + ')') : {};

        var setActive = function (isActive) {
            if (isActive) {
                btn.addClass('active');
                content.show();
                if (data.btnText) {
                    btn.html(data['btnText'][1]);
                }
            } else {
                btn.removeClass('active');
                content.hide();
                if (data.btnText) {
                    btn.html(data['btnText'][0]);
                }
            }
        };

        if (content.is(':hidden')) {
            if (group.length > 0) {
                group.find('.active').trigger('click');
            }
            setActive(true);
        } else {
            setActive(false);
        }
    });
};

module.exports = {
    "init": init
};




