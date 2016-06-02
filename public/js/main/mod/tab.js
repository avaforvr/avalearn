module.exports = {
    "init": function () {
        if($('.tab').length < 1) {
            return;
        }

        $('body').on('click', '.tab-tag', function () {
            var tag = $(this);
                if(tag.attr('data-cont')) {
                    var idx = parseInt(tag.attr('data-cont')) - 1;
                    if(idx < 0) {
                        return;
                    } else {
                        tag.addClass('active').siblings().removeClass('active');
                        tag.closest('.tab').children('.tab-conts').children('.tab-cont').eq(idx).show().siblings().hide();
                    }
                } else {
                    var idx = tag.index();
                    tag.addClass('active').siblings().removeClass('active');
                    tag.closest('.tab').children('.tab-conts').children('.tab-cont').eq(idx).show().siblings().hide();
            }
        });
    }
};




