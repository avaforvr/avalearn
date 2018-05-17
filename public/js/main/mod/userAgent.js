function UserAgent() {}
module.exports = new UserAgent();

UserAgent.prototype.isIpad = function () {
    if (navigator.userAgent.match(/iPad/i)) {
        return true;
    } else {
        return false;
    }
};

UserAgent.prototype.isMobile = function () {
    if (navigator.userAgent.match(/(iPad|iPhone|iPod|Android|ios|Windows Phone)/i)) {
        return true;
    } else {
        return false;
    }
};

UserAgent.prototype.isiOS = function () {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

UserAgent.prototype.isAndroid = function () {
    if (/(Android)/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};

UserAgent.prototype.isPhone = function () {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry|SymbianOS|Windows Phone|ZuneWP7|webOS)/i)) {
        return true;
    } else {
        return false;
    }
};

UserAgent.prototype.isIE = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var isIE = (/msie/.test(userAgent) && !/opera/.test(userAgent)) ? true : false;
    return isIE;
};

UserAgent.prototype.isIEVersion = function (version) {
    var userAgent = navigator.userAgent.toLowerCase();
    var isIE = (/msie/.test(userAgent) && !/opera/.test(userAgent)) ? true : false;
    var uaVersion = (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1];
    if(isIE && uaVersion == version) {
        return true;
    } else {
        return false;
    }
};