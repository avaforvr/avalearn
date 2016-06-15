var setCookie = function (NameOfCookie, value, expiredays) {
    if (expiredays == null || expiredays == undefined || expiredays == '' || isNaN(expiredays)) {
        expiredays = 365;
    }
    var ExpireDate = new Date();
    ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
    document.cookie = NameOfCookie + "=" + escape(value) + ((expiredays == null) ? "" : ";path=/; expires=" + ExpireDate.toGMTString()) + ";domain=." + document.domain;
};

var getCookie = function (NameOfCookie) {
    if (document.cookie.length > 0) {
        begin = document.cookie.indexOf(NameOfCookie + "=");
        if (begin != -1) {
            begin += NameOfCookie.length + 1;
            end = document.cookie.indexOf(";", begin);
            if (end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(begin, end));
        }
    }
    return null;
};

module.exports = {
    "setCookie": setCookie,
    "getCookie": getCookie
};