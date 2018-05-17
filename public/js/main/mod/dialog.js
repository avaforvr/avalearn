var userAgent = require('./userAgent');
var isFirstMove;
window.closeDialogCalls = window.closeDialogCalls || {}; //将closeCallBack保存下来，方便关闭所有弹层时触发

var open = function (setting) {
    //关闭其他dialog
    closeAll(false);

    var params = $.extend({
        modId: 'dialog',
        overlayOpacity: 0.3,
        overlayBgColor: '#111',
        width: Math.min(900, $(window).width() - 100),
        html: '',
        closeWhenClickingBg: true,
        isUpdateHtml: false,
        layerId: 'dialogOverlay',
        waitImagesLoad: false,
        closeCallBack: false
    }, setting);

    //show layer
    var layer = $(document.getElementById(params.layerId));
    if(layer.length == 0) {
        layer = $('<div id="' + params.layerId + '"><div style="background:' + params.overlayBgColor + ';"></div></div>').prependTo('body');
    }
    layer.show().children('div').stop().fadeTo("fast", params.overlayOpacity);

    //show dialog box
    var isFirstOpen = (! document.getElementById(params.modId));
    if (isFirstOpen) {
        var html = ['<div class="dialog" id="' + params.modId + '" data-layer="' + params.layerId + '">',
                '<div class="dialog-wrapper">',
                    '<div class="dialog-content"></div>',
                    '<a href="javascript:void(0)" class="close dialog-close"><i class="fa fa-times"></i></a>',
                    '</div>',
                '</div>'
            ];
        layer.after(html.join(''));
    }
    var winbox = $(document.getElementById(params.modId));
    var wrapper = winbox.children('.dialog-wrapper');
    var content = winbox.find('.dialog-content');

    //根据参数设置dialog-wrapper最大宽度
    wrapper.css('max-width', params.width);

    //dialog-content 插入内容
    if ((params.html != "" && content.html() == '') || (params.html != "" && params.isUpdateHtml)) {
        content.html(params.html);
    }

    //dialog显示并居中定位
    function position() {
        if(userAgent.isMobile()) {
            content.css('height', 'auto'); //content高度限制取消，便于判断内容高度
        }

        var windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
        var wrapperHeight = wrapper.height();
        if(windowHeight - wrapperHeight > 20) {
            wrapper.css({
                "margin-top": Math.floor((windowHeight - wrapperHeight - 20) / 2)
            });

        } else {
            wrapper.css({
                "margin-top": 0
            });
            if(userAgent.isMobile()) {
                content.height(windowHeight - 20);
            }
        }

        content.scrollLeft(0).scrollTop(0); //content滚动条位置初始化
    }

    if(params.waitImagesLoad) {
        var imgs = content.find('img')
            imgsTotal = imgs.length,
            imgsCount = 0;

        var imageLoaded = function () {
            imgsCount ++;
            if (imgsCount == imgsTotal) {
                winbox.show();
                position();
            }
        };

        imgs.each(function () {
            var image = new Image();
            image.src = $(this).attr('src');
            if (image.complete) {
                imageLoaded();
            } else {
                image.onload = imageLoaded;
            }
        });

    } else {
        winbox.show();
        position();
    }

    $(window).on('resize.dialog', function () {
        position();
    });

    //禁止页面滚动
    var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    var documentWidth = document.body.clientWidth;
    $('html, body').css({overflow: 'hidden', height: '100%'});
    $('body').css('padding-right', (windowWidth - documentWidth));
    if(userAgent.isiOS()) {
        $(window).on('touchstart.dialog', function (e) {
            isFirstMove = true;
        }).on('touchmove.dialog', function (e) {
            if (isFirstMove) {
                e.preventDefault();
                isFirstMove = false;
            }
        });
    }

    //隐藏livechat
    $('#livechat-compact-container').hide();

    //click Esc key to hide all dialogs
    $(document).bind('keydown', enableEsc);

    //click overlayer
    if(params.closeWhenClickingBg) {
        $(document).bind('click.layer', handleLayerClick);
    }

    //第一次打开，添加close事件代理
    if (isFirstOpen) {
        winbox.on('click.close', '.close', function () {
            close(winbox, true);
        });
    }

    //关闭dialog时执行的回调函数
    if(params.closeCallBack) {
        window['closeDialogCalls'][params.modId] = params.closeCallBack;
    }

    return winbox;
};

var close = function (winbox, isHideOverlay) {
    winbox = $(winbox);
    if(winbox.length == 0) {
        return;
    }
    winbox.hide();
    if (isHideOverlay) {
        var layer = $(document.getElementById(winbox.attr('data-layer')));
        layer.children('div').stop().fadeTo("fast", 0.1, function () {
            layer.hide();
            layer.unbind();
        });
    }

    unbindGlobal();

    var modId = winbox.attr('id');
    if(window['closeDialogCalls'][modId]) {
        window['closeDialogCalls'][modId].call();
        delete window['closeDialogCalls'][modId];
    }
};

//取消全局样式和事件绑定
var unbindGlobal = function () {
    $('html, body').css({overflow: 'auto', height: 'auto'});
    $('body').css('padding-right', 0);
    $('#livechat-compact-container').show();
    if(userAgent.isiOS()) {
        $(window).off('touchstart.dialog').off('touchmove.dialog');
    }
    $(window).off('resize.dialog');
    $(document).unbind('keydown', enableEsc);
    $(document).unbind('click.layer', handleLayerClick);
};

//close所有dialog和layer
var closeAll = function (isHideOverlay) {
    var visibleDialog = $('.dialog:visible');
    for(var i = 0; i < visibleDialog.length; i ++) {
        close(visibleDialog.eq(i), ((i == visibleDialog.length - 1) && isHideOverlay));
    }
};

//点击layer，close所有dialog
var handleLayerClick = function (e) {
    var target = e.target || e.scrElement;
    if(target.className  == 'dialog') {
        closeAll(true);
    }
};

//Esc键，close所有dialog
var enableEsc = function (e) {
    var unicode = e.keyCode ? e.keyCode : e.charCode;
    if (unicode == 27) {
        closeAll(true);
    }
};

module.exports = {
    "open": open,
    "close": close
};