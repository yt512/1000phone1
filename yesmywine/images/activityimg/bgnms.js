window.beheCheckIsRefresh = 0;
function beheGuidClass() {
    var _this = this;
    this.t = 0;
    this.data = {};
    this.expires;
    this.cm = -1;
    this.sid = [];
    this.isScrolling = 0;
}
beheGuidClass.prototype.setCookie = function() {
    if (this.getCookie("bh_mnid") == null) {
        var d = new Date();
        d.setTime(d.getTime() + (1 * 60 * 60 * 1000));
        this.expires = "expires=" + d.toGMTString();
        var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c) {
            var r = Math.random() * 16 | 0,
            v = c == 'x' ? r: (r & 0x3 | 0x8);

            return v.toString(16);
        });
        newstr = "bh_mnid=" + str + "_" + this.t + ";" + this.expires + ";path=/";
        document.cookie = newstr;
    } else {
        var val = this.getCookie("bh_mnid");
        var d = new Date();
        d.setTime(d.getTime() + (1 * 60 * 60 * 1000));
        var strarr = val.split("_");
        this.t = window.beheCheckIsRefresh == 1 ? strarr[1] : ++strarr[1];
        var str = "bh_mnid=" + strarr[0] + "_" + this.t + ";expires=" + d.toGMTString() + ";path=/";
        document.cookie = str;
    }
    return str;
}
beheGuidClass.prototype.getCookie = function(bh_mnid) {
    var arr = document.cookie.match(new RegExp("(^| )" + bh_mnid + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}
beheGuidClass.prototype.delCookie = function() {
    var _this = this;
    var d = new Date();
    d.setTime(d.getTime() - 100);
    var val = _this.getCookie("bh_mnid");
    document.cookie = "bh_mnid=" + val + ";expires=" + d.toGMTString() + "path=/";
}
// 鼠标滚动到一屏以下
beheGuidClass.prototype.scrollEvent = function(data) {
    var _this = this;
    var clientHeight = document.body.clientHeight;
    var oldMethod = window.onscroll;
    window.onscroll = function() {
        if (typeof oldMethod == 'function') {
            oldMethod.call(this);
        }
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop >= clientHeight) {
            if (_this.isScrolling == 1) {
                return;
            }
            _this.isScrolling = 1;
            data.at = 'scrolling';
            data.si = data.si.substr(0, data.si.indexOf('_')) + '_100';
            _this.sendUrl(data);
        }
    }
}
beheGuidClass.prototype.init = function(win) {
    this.setCookie();
    this.initCommen(win);
}
beheGuidClass.prototype.initActive = function(win) {
    if (this.getCookie("bh_mnid") == null) {
        this.setCookie();
    }
    this.initCommen(win);
}
beheGuidClass.prototype.initCommen = function(win) {
    var _this = this;
    var si = _this.getCookie("bh_mnid");
    var at = win["at"];
    var src = win["src"];
    var strarr = si.split("_");
    var i = strarr[1];
    if (i == 0) {
        if (document.referrer == "") {
            var ref = "";
            document.cookie = "ref=yes";
        } else {
            var ref = document.referrer;
            document.cookie = "refurl=" + ref;
        }
    } else {
        var ref = _this.getCookie("ref") == "yes" ? "": _this.getCookie("refurl");
    }
    var ext = null;
    var data = {
        si: si,
        at: at,
        src: src,
        ref: ref,
        ext: ext,
        cid: win["cid"],
        sid: win["sid"],
        orderid: win["orderid"] == undefined ? "": win["orderid"],
        cost: win["cost"] == undefined ? "": win["cost"]
    };
    this.sendUrl(data);
    _this.scrollEvent(data);
    if (win.sid && win.sid.indexOf('.') < 0) {
        _this.timeOut(data);
    }
}
beheGuidClass.prototype.createImg = function(src) {
    var img = new Image(1, 1);
    img.src = src;
    img.onload = function() {
        img.onload = null;
    }
}
beheGuidClass.prototype.sendUrl = function(data) {
    var _this = this;
    var si_str = "";
    if (data.sid.indexOf(".") > -1) {
        var sid = data.sid.replace(".", "-");
        si_str = sid + "-" + data.si;
    } else {
        si_str = data.sid + "-" + data.si;
    }
    var a = si_str + "&at=" + data.at + "&src=" + data.src + "_" + data.sid + "&orderid=" + data.orderid + "&cost=" + data.cost + "&ref=" + data.ref + "&ext=" + data.ext + "&random=" + Math.random();
    var c = "https://rtb.behe.com/gnm?si=";
    c = c + a;
    var newstr = String(window.location.href);
    str = newstr.replace(/\s+/g, "");
    if (data.at == "arrive") {
        // if(data.si.split("_")[1]==0){
        var str_two = data.sid + "&se=" + si_str + "&at=" + data.at + "&src=" + data.src + "_" + data.sid + "&ref=" + data.ref + "&random=" + Math.random();
        var str_one = "https://rtb.behe.com/tracker/t.gif?si=";
        str_one = str_one + str_two;
        _this.createImg(str_one);
        //_this.beheActiveLog(data, str_one, 'https://rtb.behe.com/tracker/t.gif');
        // }
    } else if (data.at != 'stay_time_5' && data.at != 'stay_time_10' && data.at != 'stay_time_300' && data.at != 'scrolling') {
        var str_two = data.sid + "&se=" + si_str + "&at=" + data.at + "&src=" + data.src + "_" + data.sid + "&orderid=" + data.orderid + "&cost=" + data.cost + "&ref=" + data.ref + "&random=" + Math.random();
        var str_one = "https://rtb.behe.com/tracker/t.gif?si=";
        str_one = str_one + str_two;
        _this.createImg(str_one);
        //_this.beheActiveLog(data, str_one, 'https://rtb.behe.com/tracker/t.gif');
    }
    _this.createImg(c);
    //_this.beheActiveLog(data, c, 'https://rtb.behe.com/gnm');
}
// 检测停留时间//5s/10s/300s
beheGuidClass.prototype.timeOut = function(data) {
    var that = this;
    setTimeout(function() {
        data.at = 'stay_time_5';
        data.si = data.si.substr(0, data.si.indexOf('_')) + '_100';
        that.sendUrl(data);
    },
    5000);
    setTimeout(function() {
        data.at = 'stay_time_10';
        data.si = data.si.substr(0, data.si.indexOf('_')) + '_100';
        that.sendUrl(data);
    },
    10000);
    setTimeout(function() {
        data.at = 'stay_time_300';
        data.si = data.si.substr(0, data.si.indexOf('_')) + '_100';
        that.sendUrl(data);
    },
    300000);
}
beheGuidClass.prototype.beheActiveLog = function(data, url, refrance) {
    var logObj = document.getElementById('divLog');
    var log = '',
    br = '<br/>';
    var cookie = this.getCookie("bh_mnid");
    var count = cookie.substring(cookie.indexOf('_') + 1)
    //if(window.beheCheckIsRefresh==0){
    log += '第' + count + '次刷新<br/>';
    //}
    log += '&nbsp;&nbsp;&nbsp;&nbsp;bhmnin => ' + data.si + br;
    log += '&nbsp;&nbsp;&nbsp;&nbsp;at => ' + data.at + br;
    log += '&nbsp;&nbsp;&nbsp;&nbsp;sid => ' + data.sid + br;
    log += '&nbsp;&nbsp;&nbsp;&nbsp;接口 => ' + refrance + br;
    log += '&nbsp;&nbsp;&nbsp;&nbsp;url => ' + url + br + br + br;
    logObj.innerHTML += log;
}
function beheActiveView(params) {
    var obj = new beheGuidClass();
    obj.init(params);
    window.beheCheckIsRefresh = 1;
}
function beheActiveEvent(params) {
    var obj = new beheGuidClass();
    obj.initActive(params);
    window.beheCheckIsRefresh = 1;
}