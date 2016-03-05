/*
 三级下拉导航
 参数：
 groupSelector — 带有子菜单的父容器选择器
 menuSelector — 子菜单选择器
 activeClass — 子菜单显示时父容器添加的className
 delayTime — 菜单显示延迟时间
 openTime — 子菜单高度变化过渡时间
 */
$.fn.dropMenu = function (setting) {
    var options = $.extend({
        "groupSelector": ".multi",
        "menuSelector": "ul",
        "activeClass": "over",
        "delayTime": 0,
        "openTime": 50
    }, setting);

    var obj = $(this),
        delayTimer,
        activeGroup = false;

    //判断是不是PC
    var IsPC = (function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    })();

    //显示子菜单
    function showMenu(group) {
        var group = $(group);
        var menu = group.children(options.menuSelector);
        if (menu.is(":visible")) {
            return;
        }

        var groupWidth = group.innerWidth();
        var menuWidth = menu.innerWidth();
        var menuHeight = menu.attr("data-height");
        var objRight = obj.offset().left + obj.innerWidth();//导航右侧到屏幕左上角的距离

        //子菜单宽度必须大于或等于总的容器宽度
        if (menuWidth < groupWidth) {
            menu.width(groupWidth - (menu.outerWidth() - menu.width()));
            menuWidth = menu.innerWidth();
        }

        var groupLeft = group.offset().left;
        if (objRight - groupLeft < menuWidth) {
            menu.css("right", "0px");
        } else {
            menu.css("left", "0px");
        }

        var setActive = function () {
            group.addClass(options.activeClass);
            menu.show().stop().animate({height: menuHeight}, options.openTime);
        };

        if (IsPC) {
            delayTimer = setTimeout(function () {
                setActive();
            }, options.delayTime);
        } else {
            setActive();
        }
        activeGroup = group;
    }

    //隐藏子菜单
    function hideMenu(group) {
        clearTimeout(delayTimer);
        group.removeClass(options.activeClass).children(options.menuSelector).stop().animate({height: 0}, options.openTime, function () {
            $(this).hide();
        });
        activeGroup = false;
    }

    function hideMobileMenu(e) {
        if (!activeGroup) {
            return false;
        }
        var src = e ? e.target : e.srcElement;
        do {
            if (src == activeGroup.get(0)) {
                return;
            }
            ;
            src = src.parentNode;
        } while (src.parentNode)

        hideMenu(activeGroup);
        $(document).off("touchstart", hideMobileMenu);
    }

    //绑定事件
    if (IsPC) {
        obj.on("mouseenter", options.groupSelector, function () {
            showMenu($(this));

        }).on("mouseleave", options.groupSelector, function () {
            hideMenu($(this));
        });
    } else {
        obj.on("click", options.groupSelector, function () {
            if ($(this).children(options.menuSelector).is(":hidden")) {
                showMenu($(this));
                $(document).on("touchstart", hideMobileMenu);
                return false;//阻止页面跳转
            }
        });
    }

    //初始化高度属性
    $(options.groupSelector).each(function () {
        var menu = $(this).children(options.menuSelector);
        menu.attr("data-height", menu.outerHeight());
        menu.height(0).hide();
    });
    obj.css("overflow", "visible");

};