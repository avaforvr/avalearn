//初始化默写单词列表
var initDictationList = function (dicList, list) {
    var arr = [];
    arr.push('<table class="table1" width="100%"><thead><tr><th>中文</th><th>英文</th><th>操作</th></tr></thead><tbody>')
    for(var key in list) {
        arr.push('<tr><td class="td-chs">' + list[key]['chs'] + '</td><td class="td-input"><input id="' + key + '" type="text" data-value="' + list[key]['en'] + '"></td><td></td></tr>');
    }
    arr.push('</tbody></table>')
    dicList.html(arr.join(''));
};

//默写
var handleDictation = function () {
    var dictation = $('#dictation'),
        dicList = $('#dic-list'),
        sucKeys = [],
        btnRemove = $('#btnRemove');;

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
        if(sucKeys.length) {
            btnRemove.prop('disabled', false);
        }
        return false;
    });

    //移除拼写正确的单词
    btnRemove.on('click', function () {
        if(! sucKeys.length) {
            return;
        }
        $.ajax({
            "type": "POST",
            "url": pageData.res_path + "ajax.php",
            "data": "act=remove&keys=" + sucKeys,
            "dataType": "text",
            "beforeSend": function () {
                btnRemove.prop('disabled', true);
            },
            "success": function (r) {
                if (r === '0') {
                    alert('移除成功');
                    sucKeys = [];

                } else if (r === '1') {
                    btnRemove.prop('disabled', false);
                    alert('移除失败，再来一次~');
                }
            },
            "error": function (r) {
            }
        })
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
            if(! wordsList[key]) {
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
            },
            "error": function (r) {
            }
        })
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
    handleUpdate();
};