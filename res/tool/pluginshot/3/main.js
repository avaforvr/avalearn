//初始化默写单词列表
var initDictationList = function (dicList, list) {
    var arr = [];
    for(var key in list) {
        arr.push('<tr><td class="td-chs">' + list[key]['chs'] + '</td><td class="td-input"><input id="' + key + '" type="text" data-value="' + list[key]['en'] + '"></td><td></td></tr>');
    }
    $('#dic-total').html(arr.length);
    dicList.html(arr.join(''));
};

//默写
var handleDictation = function () {
    var dictation = $('#dictation'),
        dicList = $('#dic-list'),
        sucKeys = [];

    //初始化默写单词列表
    initDictationList(dicList, wordsList);

    //检查拼写
    dictation.on('submit', function () {
        dicList.find('input').each(function () {
            var input = $(this);
            input.removeClass('error');
            var v = $.trim(input.val());
            if(v.length) {
                if(v == input.attr('data-value')) {
                    sucKeys.push(input.attr('id'));
                    input.parent().parent().remove();
                } else {
                    input.addClass('error');
                }
            }
        });

        return false;
    });

    //移除拼写正确的单词
    $('#btnRemoveSuc').on('click', function () {
        if(! sucKeys.length) {
            return;
        }
        var btnRemoveSuc = $(this);
        $.ajax({
            "type": "POST",
            "url": pageData.res_path + "ajax.php",
            "data": "act=removeSuc&keys=" + sucKeys,
            "dataType": "text",
            "beforeSend": function () {
                btnRemoveSuc.prop('disabled', true);
            },
            "complete": function () {
                btnRemoveSuc.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    alert('移除成功');
                    sucKeys = [];

                } else if (r === '1') {
                    alert('移除失败，再来一次~');
                }
            }
        });
    });

    //清空列表
    $('#btnRemoveAll').on('click', function () {
        if(! dicList.children().length) {
            return;
        }
        var btnRemoveAll = $(this);
        $.ajax({
            "type": "POST",
            "url": pageData.res_path + "ajax.php",
            "data": "act=removeAll",
            "dataType": "text",
            "beforeSend": function () {
                btnRemoveAll.prop('disabled', true);
            },
            "complete": function () {
                btnRemoveAll.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    //alert('列表已清空');
                    sucKeys = [];
                    dicList.html('');

                } else if (r === '1') {
                    alert('操作失败，再来一次~');
                }
            }
        });
    });
};

//备份列表 + 恢复备份
var handleBackup = function () {
    //备份列表
    $('#btnBackups').on('click', function () {
        var btn = $(this);
        $.ajax({
            "type": "GET",
            "url": pageData.res_path + "ajax.php",
            "data": "act=setBackups",
            "dataType": "text",
            "beforeSend": function () {
                btn.prop('disabled', true);
            },
            "complete": function () {
                btn.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    alert('备份成功');
                } else if (r === '1') {
                    alert('备份失败，再来一次~');
                }
            }
        });
    });

    //恢复备份
    $('#btnRestore').on('click', function () {
        var btn = $(this);
        $.ajax({
            "type": "GET",
            "url": pageData.res_path + "ajax.php",
            "data": "act=restore",
            "dataType": "text",
            "beforeSend": function () {
                btn.prop('disabled', true);
            },
            "complete": function () {
                btn.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    alert('列表已恢复');
                    window.location.reload();
                } else if (r === '1') {
                    alert('恢复失败，再来一次~');
                }
            }
        });
    });
};

//更新单词列表
var handleUpdate = function () {
    var baicizhanList = $('#baicizhanList'),
        btnUpdate = $('#btnUpdate'),
        btnClear = $('#btnClear');

    //更新列表
    btnUpdate.on('click', function () {
        var str = $.trim(baicizhanList.val());
        if(! str.length) {
            return;
        }

        var items = $(str).find('.list_line_odd, .list_line_even');
        if(! items.length) {
            alert('数据格式不对，请检查粘贴的代码是否正确。');
            return;
        }

        var list = {};
        for (var i = 0; i < items.length; i++) {
            var item = items.eq(i);
            var en = $.trim(item.children('div:eq(0)').html());
            var key = en.toLowerCase().replace(' ', '_');
            if(! wordsList[key] || typeof(wordsList[key]) == 'function') {
                var chs = $.trim(item.children('div:eq(1)').html()).replace(/\n\s+/g, '<br>');
                list[key] = {
                    "en": en,
                    "chs": chs
                };
            }
        }
        if($.isEmptyObject(list)) {
            alert('这些单词已经包含在列表中，不需要更新。');
            return;
        }
        $.ajax({
            "type": "POST",
            "url": pageData.res_path + "ajax.php",
            "data": "act=updateList&list=" + JSON.stringify(list),
            "dataType": "text",
            "beforeSend": function () {
                btnUpdate.prop('disabled', true);
            },
            "complete": function () {
                btnUpdate.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    alert('更新成功');
                    window.location.reload();

                } else if (r === '1') {
                    alert('更新失败，再来一次~');
                }
            }
        });
    });

    //清空
    btnClear.on('click', function () {
        baicizhanList.val('');
    });
};

window.onload = function () {
    if(typeof wordsList == 'undefined') {
        return;
    }
    handleDictation();
    handleBackup();
    handleUpdate();
};