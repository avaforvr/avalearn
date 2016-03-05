/*
 选项卡
 参数：
 toggleEvent — 切换选项卡的鼠标事件
 groupElem — 选项卡组选择器
 tagElem — 选项卡标签选择器
 contsElem — 内容外层容器
 contElem — 选项卡内容选择器
 activeClass — 选项卡激活时添加的class
 */

function Tabs(setting) {
    var options = $.extend({
        "toggleEvent": "click",
        "groupElem": ".tabs",
        "tagElem": ".tabs-tags>li",
        "contsElem": ".tabs-conts",
        "contElem": ".tabs-cont",
        "activeClass": "active"
    }, setting);

    $(document).on(options.toggleEvent, options.tagElem, function () {
        var idx = $(this).index();
        $(this).addClass(options.activeClass).siblings().removeClass(options.activeClass);
        $(this).closest(options.groupElem).children(options.contsElem).children(options.contElem).eq(idx).show().siblings().hide();
    });
}