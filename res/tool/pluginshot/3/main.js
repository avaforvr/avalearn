var o = {
    "dicCheck": $('#dic-check'),
    "dicSuc": $('#dic-suc'),
    "dicFail": $('#dic-fail'),
    "dicTotal": $('#dic-total'),
    "dataCheck": 0,
    "dataSuc": 0,
    "dataTotal": 0,
    "record": [],//保存待检查单词，用于计算待检查单词数
    "sucKeys": [],//记录已成功的单词
    "lastFoucs": false//记录最后一个焦点所在的输入框
};

//更新进度和单词总数
var setProgress = function () {
    o.dicCheck.html(o.dataCheck);
    o.dicSuc.html(o.dataSuc);
    o.dicFail.html(o.dataTotal - o.dataSuc);
    o.dicTotal.html(o.dataTotal);
};

//初始化默写单词列表
var initDictationList = function (dicList, list) {
    var arr = [];
    for(var key in list) {
        arr.push('<tr><td class="td-chs">' + list[key]['chs'] + '</td><td class="td-input"><input id="' + key + '" type="text" data-value="' + list[key]['en'] + '" autocomplete="off"></td><td class="td-tip"></td></tr>');
    }
    o.dataTotal = arr.length;
    setProgress();
    dicList.html(arr.join(''));

    //输入框填满td
    //dicList.find('input').each(function () {
    //    var input = $(this);
    //    input.height(input.parent().height());
    //});
};

//默写
var handleDictation = function () {
    var form = $('#dictation-form'),
        dicList = $('#dic-list'),
        dicSucList = $('#dic-suc-list');

    //初始化默写单词列表
    initDictationList(dicList, wordsList);

    //输入框获取焦点时记录id
    dicList.on('focus', 'input', function () {
        o.lastFoucs = $(this).attr('id');
    });

    //输入框的值发生改变时计算进度
    dicList.on('blur', 'input', function () {
        var id = $(this).attr('id');
        var val = $.trim($(this).val());
        if(o.record[id]) {
            if(! val.length) {
                delete o.record[id];
                o.dataCheck --;
            }
        } else if(val.length) {
            o.record[id] = 1;
            o.dataCheck ++;
        }
        setProgress();
    });

    //提示
    dicList.on('keydown', 'input', function (e) {
        var e = e ? e : window.event;
        var keyCode = e.keyCode;
        var input = $(this),
            tip = $(this).parent().next('.td-tip');
        if(event.ctrlKey && keyCode == 37) {
            tip.html(input.attr('data-value'));
        } else if(event.ctrlKey && keyCode == 39) {
            tip.html('');
        } else if(keyCode == 38) {
            input.parent().parent().prev().find('input').focus();
        } else if(keyCode == 40) {
            input.parent().parent().next().find('input').focus();
        }
    });

    $('#btnBatchHint').on('click', function () {
        dicList.children('tr').each(function () {
            var wrap = $(this);
            wrap.children('.td-tip').html(wrap.find('input:eq(0)').attr('data-value'));
        });
    });

    //检查拼写
    form.on('submit', function () {
        var sucCount = 0;
        dicList.find('input').each(function () {
            var input = $(this);
            input.removeClass('error');
            var v = $.trim(input.val());
            if(v.length) {
                if(v == input.attr('data-value')) {
                    sucCount ++;
                    var id = input.attr('id');
                    o.sucKeys.push(id);
                    var wrap = input.parent().parent();
                    if(o.lastFoucs == id) {
                        wrap.next().find('input').focus();
                    }
                    input.prop('disabled', true);
                    wrap.children('.td-tip').remove();
                    wrap.appendTo(dicSucList);
                } else {
                    input.addClass('error');
                }
            }
        });

        o.dataCheck = o.dataCheck - sucCount;
        o.dataSuc = o.dataSuc + sucCount;
        setProgress();
        return false;
    });

    //移除拼写正确的单词
    var removeSucCallback = function () {
        if(! o.sucKeys.length) {
            return;
        }
        var btn = $(this);
        $.ajax({
            "type": "POST",
            "url": pageData.res_path + "ajax.php",
            "data": "act=removeSuc&keys=" + o.sucKeys,
            "dataType": "text",
            "beforeSend": function () {
                btn.prop('disabled', true);
            },
            "complete": function () {
                btn.prop('disabled', false);
            },
            "success": function (r) {
                if (r === '0') {
                    o.dataSuc = 0;
                    o.dataTotal = o.dataTotal - o.sucKeys.length;
                    setProgress();
                    o.sucKeys = [];
                    dicSucList.html('');

                } else if (r === '1') {
                    alert('移除失败，再来一次~');
                }
            }
        });
    };
    $('#btnRemoveSuc').on('click', removeSucCallback);

    //清空列表
    $('#btnRemoveAll').on('click', function () {
        if(! dicList.children().length) {
            return;
        }
        if (confirm("确定要清空列表吗？")) {
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
                        o.sucKeys = [];
                        o.dataCheck = 0;
                        o.dataSuc = 0;
                        o.dataTotal = 0;
                        setProgress();
                        dicList.html('');
                        dicSucList.html('');

                    } else if (r === '1') {
                        alert('操作失败，再来一次~');
                    }
                }
            });
        }

    });

    //第一个单词自动获取焦点
    dicList.find('input:eq(0)').focus();
};

//备份列表 + 恢复备份 + 导入
var handleBackup = function () {
    //备份列表
    $('#btnBackups').on('click', function () {
        if (confirm("确定要备份列表吗？")) {
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
        }
    });

    //恢复备份
    $('#btnRestore').on('click', function () {
        if (confirm("确定要恢复备份吗？")) {
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
        }
    });

    //导入
    $('#import-form').on('submit', function () {
        var form = $(this),
            btn = form.children('.btn');
        var filePath = form.children('input[name="file"]').val();
        if(filePath.length > 0) {
            if(filePath.substring(filePath.length - 4) == '.zip') {
                var opt = {
                    "dataType": "text",
                    "beforeSend": function () {
                        btn.prop('disabled', true);
                    },
                    "success": function (r) {
                        if (r === '0') {
                            alert('导入成功')
                            window.location.reload();
                        } else {
                            alert(r);
                            btn.prop('disabled', false);
                        }
                    },
                    "error": function () {
                        alert('上传失败')
                        btn.prop('disabled', false);
                    }
                }
                form.ajaxSubmit(opt);
            } else {
                alert('只支持zip文件');
            }
        }
        return false;
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

        function loadJS(src, id, loadCallback, errorCallback) {
            if(document.getElementById(id)) {
                loadCallback();

            } else {
                var script = document.createElement('script'),
                    head = document.getElementsByTagName('head').item(0);
                script.onload = script.onreadystatechange = function () {
                    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                        loadCallback();
                    }
                };
                if(errorCallback) {
                    script.onerror = function () {
                        errorCallback();
                    };
                }
                script.id = id;
                script.src = src;
                head.appendChild(script);
            }
        }

        btnUpdate.prop('disabled', true);

        loadJS(pageData.res_path + 'wordsListAll.js', 'wordsListAll', function () {
            var list = [];
            for (var i = 0; i < items.length; i++) {
                var item = items.eq(i);
                var en = $.trim(item.children('div:eq(0)').html());
                var key = en.toLowerCase().replace(' ', '_').replace('-', '_');
                if(! wordsListAll[key] || typeof(wordsListAll[key]) == 'function') {
                    var chs = $.trim(item.children('div:eq(1)').html()).replace(/\s*\n\s*/g, '<br>');
                    list.push(en + '#' + chs);
                } else {
                    //console.log(wordsListAll[key]['en'] + ' - ' + en);
                }
            }

            if(list.length == 0) {
                alert('这些单词已经包含在列表中，不需要更新。');
                btnUpdate.prop('disabled', true);
                return;
            }

            $.ajax({
                "type": "POST",
                "url": pageData.res_path + "ajax.php",
                "data": "act=updateList&list=" + encodeURIComponent(list.join('|')),
                "dataType": "text",
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
    });

    //清空
    btnClear.on('click', function () {
        baicizhanList.val('');
    });
};

//固定进度模块
var fixProgress = function () {
    var dicTotalWrap = $('.dic-total-wrap:eq(0)');
    var top = dicTotalWrap.offset().top;
    var left = dicTotalWrap.offset().left;
    $(window).on('scroll.fixed', function () {
        if($(window).scrollTop() > top) {
            dicTotalWrap.addClass('fixed');
            dicTotalWrap.css({left:left, right:'auto'});
        } else {
            dicTotalWrap.removeClass('fixed');
            dicTotalWrap.css({left:'auto', right:0});
        }
    });
};

var init = function () {
    if(typeof wordsList == 'undefined') {
        return;
    }
    handleDictation();
    handleBackup();
    handleUpdate();
    fixProgress();
};

window.onload = function () {
    var cookie = mainJS.cookie;
    if (cookie.getCookie('dictation')) {
        init();
    } else {
        var pwd = prompt('请输入密码');
        if (pwd === 'passw0rd') {
            cookie.setCookie('dictation', '1', 7);
            init();
        } else {
            window.location.href = '/';
        }
    }
};