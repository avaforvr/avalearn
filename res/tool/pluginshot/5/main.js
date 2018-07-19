(function () {
    var o = {
        original: $('#original'),
        command: $('#command'),
        result: $('#result'),
        btnSubmit: $('#btn-submit'),
        btnReset: $('#btn-reset')
    };

    var check = function (obj, str) {
        if (str.length === 0) {
            obj.addClass('error');
            return false;
        } else {
            obj.removeClass('error');
            return true;
        }
    };

    o.btnSubmit.on('click.submit', function () {
        var paths = $.trim(o.original.val());
        var command = $.trim(o.command.val());

        var isChecked = check(o.original, paths);
        if (!(check(o.command, command) && isChecked)) {
            return false;
        }

        var dirs = paths.split('\n').map(function (path) {
            return path.replace(/\\(\w|-|\.)*\.\w+/, '');
        });
        $.unique(dirs);
        var arr = [];
        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];
            arr.push('cd ' + dir);
            arr.push(command);
        }
        o.result.html(arr.join('\n')).get(0).select();
    });

    o.btnReset.on('click.reset', function () {
        o.original.val('');
        o.command.val('');
        o.result.val('');
    });
})();