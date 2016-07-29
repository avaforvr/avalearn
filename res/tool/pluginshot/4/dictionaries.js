var dialog = mainJS.dialog;

var o = {
    "dicList": $('#dic-list'),
    "dicListBody": $('#dic-list-body'),
    "dicForm": $('#dic-form'),
    "addDicBtn": $('#btn-add-dic'),
    "dialogId": 'dicFromDialog',
};

var setForm = function (setting) {
    var data = $.extend({
        "id": 0,
        "title": ''
    }, setting);

    for (var key in data) {
        o.dicForm.find('input[name="' + key + '"]').val(data[key]);
    }
    o.dicForm.find('input[name="file"]').val(''); //附件清空

    dialog.open({modId: o.dialogId, width: 400, html: o.dicForm});
};

//添加字典
o.addDicBtn.on('click', function () {
    setForm({});
});

//编辑词典
o.dicList.on('click', '.btn-edit-dic', function () {
    var wrap = $(this).closest('tr');
    setForm({
        "id": wrap.attr('data-id'),
        "title": $.trim(wrap.children('td').eq(0).html())
    });
});

//删除词典
o.dicList.on('click', '.btn-del-pic', function () {
    var pwd = prompt('请输入暗号', '');
    if (pwd && pwd == 'passw0rd') {
        var wrap = $(this).closest('tr');
        var id = wrap.attr('data-id');
        $.ajax({
            "type": "GET",
            "url": pageData.res_path + "index.php?act=delDic&id=" + id,
            "dataType": "json",
            "beforeSend": function (r) {
            },
            "success": function (r) {
                if (r.code == 0) {
                    wrap.hide('normal', function () {
                        wrap.remove();
                    });
                } else {
                    alert(r.msg);
                }
            },
            "error": function (r) {
                alert('操作失败');
            }
        });
    }
});

//提交表单
o.dicForm.submit(function () {
    if ($.trim($(this).find('input[name="title"]').val()).length == 0) {
        alert('请填写标题');
        return false;
    }
    var btn = o.dicForm.children('.btn');
    var opt = {
        "dataType": "json",
        "beforeSend": function () {
            btn.prop('disabled', true);
        },
        "success": function (r) {
            btn.prop('disabled', false);
            if (r.code == 0) {
                dialog.close('#' + o.dialogId, true);
                if (r.isNew) {
                    o.dicListBody.append(r.dicHtml);
                } else {
                    var oldTr = o.dicListBody.children('#dic-' + r.dicId);
                    oldTr.after(r.dicHtml);
                    oldTr.remove();
                }
            } else {
                alert(r.msg);
            }
        },
        "error": function (r) {
            alert('表单提交失败')
            btn.prop('disabled', false);
        }
    }
    o.dicForm.ajaxSubmit(opt);
    return false;
});