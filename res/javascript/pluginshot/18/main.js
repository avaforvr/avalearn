//激活
(function () {
    var board = $('#board'),
        box = $('#box'),
        unit = 5,//每次移动的距离，数值越大，移动越快
        interval = 10,//每次计算距离的时间间隔，数值越小，移动越快
        keybuf = {},//记录当前按键
        timer = false,
        boardWidth = board.width(),
        boardHeight = board.height(),
        boxWidth = box.width(),
        boxHeight = box.height(),
        disX = box.position().left,//box初始位置
        disY = box.position().top;//box初始位置

    function keydown(e) {
        var keyCode = (e ? e : window.event).keyCode;
        if (!timer) {
            timer = setInterval(move, interval);
        }
        if (keyCode >= 37 && keyCode <= 40) {
            keybuf[keyCode] = true;
            e.preventDefault();
        }
    }

    function keyup(e) {
        var keyCode = (e ? e : window.event).keyCode;
        if (keyCode >= 37 && keyCode <= 40) {
            keybuf[keyCode] = false;
            e.preventDefault();
        }
    }

    function move() {
        var hasPressedKey = false;

        for (var keyCode in keybuf) {
            if (keybuf[keyCode] === true) {
                hasPressedKey = true;
                switch (parseInt(keyCode)) {
                    case 38://Up
                        disY -= unit;
                        break;
                    case 40://Down
                        disY += unit;
                        break;
                    case 37://Left
                        disX -= unit;
                        break;
                    case 39://Right
                        disX += unit;
                        break;
                    default:
                        break;
                }
            }
        }
        disX = Math.min(Math.max(disX, 0), (boardWidth - boxWidth));
        disY = Math.min(Math.max(disY, 0), (boardHeight - boxHeight));
        box.css('left', disX);
        box.css('top', disY);

        if (!hasPressedKey) {
            clearInterval(timer);
            timer = false;
        }
    }

    $(document).on('keydown', keydown).on('keyup', keyup);
})();