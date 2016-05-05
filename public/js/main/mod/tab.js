module.exports = {
    "init": function () {
        if($('.tab').length < 1) {
            return;
        }

        $('body').on('click', '.tab-tag', function () {
            var idx = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).closest('.tab').children('.tab-conts').children('.tab-cont').eq(idx).show().siblings().hide();
        });
    }
};




