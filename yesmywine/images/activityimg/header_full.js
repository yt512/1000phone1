/* ====================================
* header_full 通用头处理
* 修改人员：arron
* 最后修改：2015-10-13
====================================*/ 
var cookieUrl;
cookieUrl = $.cookie('cookieUrl');
$.cookie('cookieUrl', window.location, {
    expires: 2,
    path: '/'
});
if (document.referrer != "") {
    cookieUrl = document.referrer
}
$.cookie('preCookieUrl', cookieUrl, {
    expires: 2,
    path: '/'
});

var easyBuy = {
    errors:{//错误提示信息
        out:function(){return "随心购数量不能超过" + (easyBuy.math()+1) + "个哦";},
        noRepeat:"不可添加相同的随心购商品"
    },
    math:function(){//随心购总共数量
        return $(".easyBuy .easyComb dd.p").length;
    },
    frontMath:function(){
        return $(".easyBuy .easyComb").find('.t').length;
    },
    price:function(){//随心购总价
        return $('.easyBuy .easyComb .amount span').html();
    },
    addCar:function(_this){
        if(easyBuy.frontMath() > easyBuy.math()-1){ //数量超限，提示错误信息
            YM.page.alert(easyBuy.errors.out());
            return false;
        };
        if(easyBuy.frontMath() == easyBuy.math()-1){
            $(".easyBuy .easyComb dd.addCar a").addClass('amountAddCar');
        };
        if(_this.parents('li').find('.selected').length == 1){
            YM.page.alert(easyBuy.errors.noRepeat);
            return false;
        }
        //也买价累加
        var YMprice = parseInt(_this.siblings('b').html());;

        _this.parents('dl').find('dt').append('<span class="selected"></span>'); //增加标记

        //将内容赋值给上面
        var img = _this.parents('dl').find('dt a').html();
        var index = easyBuy.frontMath();
        var target = $(".easyBuy .easyComb dd.p").not('.t').eq(0).find('.pics');
        var target2 = $(".easyBuy .easyComb dd.p").not('.t').eq(0);
        var id = _this.parents('dl').attr('id');
        target2.addClass('t ym'+id);
        target.html('<div class="addGood">'+img+'<a href="javascript:;" class="close" onclick="easyBuy.removeGood($(this));"></a></div>');
        
        //价格赋值上面，并隐藏
        target.append("<span>"+YMprice+"</span>");
    },
    removeGood:function(_this){
        if(easyBuy.frontMath() != easyBuy.math()-1){
            $(".easyBuy .easyComb dd.addCar a").removeClass('amountAddCar');
        };
        var className = _this.parents('dd').attr('class').replace('p t ym','');
        $('.easyBuy .easyList dl').each(function(){
            var id = $(this).attr('id');
            if(className == id){
                $(this).find('.selected').remove();
            }
        });
        var leftPrice = parseInt(_this.parent().siblings().html());
        _this.parents('dd').attr('class','p');
        _this.parents('.pics').html('<div class="noGood">请添加随<br>心购商品</div>');
        
    },
    flyElm: function() {
        var a = $(".easyBuy .easyComb dl dt").find("img");
        var b = a.clone().css("opacity", 0.75);
        $("body").append(b);
        b.css({
            "z-index": 9000,
            display: "block",
            position: "absolute",
            top: a.offset().top + "px",
            left: a.offset().left + "px",
            width: a.width() + "px",
            height: a.height() + "px"
        });
        b.animate({
            top: $(".ym-nBar-cart-num").offset().top,
            left: $(".ym-nBar-cart-num").offset().left,
            width: 20,
            height: 32
        }, "slow", function() {
            b.remove()
        })
    },
    repeatSelect:function(){
        $('.easyBuy .easyComb dl dd.p').each(function(){
            var goodsId = Number(/\d+/gim.exec($(this).attr('class')));
            for(var i=0,len = $('.easyBuy .easyList dl').length;i<len;i++){
                var ids =   Number(/\d+/gim.exec($('.easyBuy .easyList dl:eq('+i+')').attr('id')));
                if(goodsId == ids){
                    $('.easyBuy .easyList dl:eq('+i+')').find('dt').append('<span class="selected"></span>');   
                }
            }
        }); 
    },
    ajaxCallback:function(data, func) {
        if (!data.error) {
            if(data.messageList!='' || data.messageList.length > 0){ // 警告信息或提示信息
                var message = '';
                for (var i = 0; i < data.messageList.length; i++) {
                    message += data.messageList[i] + '<br />';
                }
                YM.load('util.dialog', function() {
                    YM.util.dialog.alert(message, function(){
                        window.location.reload();
                    });
                });
            }else{
                func.call(this);
            }
        } else {
            var message = '';
            for (var i = 0; i < data.messageList.length; i++) {
                message += data.messageList[i] + '<br />';
            }
            YM.page.alert(message,func("error"));   // 积分兑换不成功,阻止添加购物车动画
        }
    },
    addGoodsGroupToCart:function(_this, goodsIds) {
        //tracking,no recommend with get event by mozilla
        try {
            if (!_this.attr("data-dts")) {
                _this.attr("data-dts","{dts:'addCart',goodsId:'" + goodsIds + "'}");
            }
        } catch (e){}
        if (!(goodsIds)) {
            YM.page.alert('您提交的商品Id或商品数量不是有效的数字!');
            return;
        }
        YM.dataproxy.ajax({
            url: YM.login.servicePath + 'cart/addGoodsGroup.jspa?' + 'goodsIds=' + goodsIds,
            type: 'POST',
            cache: false,
            data: {},
            success: function(data) {
                easyBuy.ajaxCallback(data, function(){
                        YM.page.header.cart.update();
                        productCart(_this);
                });
            },
            error: function() {
                YM.page.alert('系统发生错误，请联系网站管理员！');
            }
        });
    }
}
//随心购加入购物车
$('.easyBuy .easyComb dd.addCar a').live('click',function(){
    //加入购物车
    var className = $(this).attr('class');
    if(className.length == 0){
        YM.page.alert('请添加足够随心购产品');    
        return false;
    }else{
        var gIdList = [];
        var m = $(this).parents('dl');
        var defaultId = Number(/\d+/gim.exec($('.easyBuy .easyComb dt').attr('class')));
        gIdList.push(defaultId);
        for (var i=0; i<easyBuy.math(); i++){
            var goodsId = Number(/\d+/gim.exec(m.find('.p:eq(' + i + ')').attr('class')));
            gIdList.push(goodsId); 
        }
        easyBuy.addGoodsGroupToCart(this, gIdList.join(','));
        easyBuy.flyElm();   
    }
});


//原先common/common2.js 中方法
function checkNum(str) {
    return str.match(/\D/) == null
}
function getValueOfSelect(id) {
    var objs = document.getElementById(id);
    if (objs == null) {
        return
    }
    if (objs.selectedIndex >= 0) {
        return objs.options[objs.selectedIndex].value
    }
    return ""
}
function setValueOfSelect(id, value) {
    var objs = document.getElementById(id);
    for (var i = 0; i < objs.options.length; i++) {
        if (objs.options[i].value == value) {
            objs.options[i].selected = "selected"
        }
    }
}
function getRadioCheckedValue(radioName) {
    var value = "";
    var objs = document.getElementsByName(radioName);
    for (var i = 0; i < objs.length; i++) {
        if (objs[i].checked) {
            value = objs[i].value
        }
    }
    return value
}
function radioDoNotChecked(radioName) {
    var value = "";
    var objs = document.getElementsByName(radioName);
    for (var i = 0; i < objs.length; i++) {
        objs[i].checked = false
    }
}
function divContentRoll(topDiv, contentDiv, tempDiv) {
    var speed = 60;
    var demo = document.getElementById(topDiv);
    var demo1 = document.getElementById(contentDiv);
    var demo2 = document.getElementById(tempDiv);
    demo2.innerHTML = demo1.innerHTML;
    function Marquee() {
        if ((demo2.offsetTop - demo.scrollTop) <= 0) {
            demo.scrollTop = 0
        } else {
            demo.scrollTop++
        }
    }
    var MyMar = setInterval(Marquee, speed);
    demo.onmouseover = function() {
        clearInterval(MyMar)
    };
    demo.onmouseout = function() {
        MyMar = setInterval(Marquee, speed)
    }
}
function countCharacters(str, size) {
    var totalCount = 0;
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 1 && c <= 126) || (65376 <= c && c <= 65439)) {
            totalCount++
        } else {
            totalCount += 2
        }
        if (totalCount < size) {
            newStr = str.substring(0, i + 1)
        } else {
            return newStr + "..."
        }
    }
    return newStr
}
function validateLength(str, size) {
    return (str.getByteLength() <= size) ? true: false
}
function autoNewLine(str, size) {
    beginPos = 0;
    var totalCount = 0;
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 1 && c <= 126) || (65376 <= c && c <= 65439)) {
            totalCount++
        } else {
            totalCount += 2
        }
        if (totalCount >= size) {
            newStr += str.substring(beginPos, i + 1) + "<br/>";
            totalCount = 0;
            beginPos = i + 1
        }
    }
    if (beginPos != str.length) {
        newStr += str.substr(beginPos)
    }
    return newStr
}
function isMobile(_str) {
    return YM.valid.isMobile(_str)
}
function verifyAddress(email) {
    return YM.valid.isEmail(email)
}
function validateEmail(email) {
    return YM.valid.isEmail(email)
}
function validateMobile(mobile) {
    return YM.valid.isMobile(_str)
}
function lenReg(str) {
    return str.getByteLength()
}
function formatDoubleValue(value, symbols) {
    return parseFloat(value).toFixed(symbols)
}
// old function
function setTab(name, cursel, n) {
    for (var i = 1; i <= n; i++) {
        var tab = document.getElementById(name + i);
        var con = document.getElementById("con_" + name + "_" + i);
        tab.className = i == cursel ? "hover": "";
        con.style.display = i == cursel ? "block": "none"
    }
}
function showLoginDiv(callback) {
    YM.login.pop(function(member) {
        if ($.isFunction(callback)) {
            callback(member)
        } else if (typeof(callback) == 'string') {
            eval(callback)
        }
    })
}
function needLogin(toUrl) {
    YM.login.pop(toUrl);
}
function isLogin() {
    var html = $.ajax({
        url: YM.login.servicePath + 'portal/loginState.jspa',
        cache: false,
        async: false
    }).responseText;
    if (html == "0") {
        return false;
    } else if (html == "1") {
        return true;
    }
}
//---------------------------------
// header处理
(function($) {
    // ----------------------------
    YM.namespace('YM.page.header');
    // ----------------------------
    // 跨域处理
    YM.page.header.isSubDomain = function() {
        var darr = document.domain.split('.');
        return (darr.length == 3 && darr[0] != 'www' && isNaN(darr[0]));
    } ();
    if (YM.page.header.isSubDomain) {
        YM.login.setServicePath('http://www.yesmywine.com/');
    }
    //-----------------------------
    YM.page.header.serviceAPI = {
        //'accountLink': YM.login.servicePath + 'personalCenter/showIndex.jspa?page=1',
        'accountLink': 'http://space.yesmywine.com/',
        'logoutLink': YM.login.servicePath + 'user/userExit.jspa',
        'messageLink': YM.login.servicePath + 'memberMessage/index.jspa',
        'couponLink': YM.login.servicePath + 'personalCenter/getMyCoupon.jspa?type=1',
        'giftCardLink': YM.login.servicePath + 'personalCenter/bindCard.jspa',
        'giftLink': YM.login.servicePath + 'personalCenter/showMyGifts.jspa?pageDTO.curPageNum=1&tabType=2',
        'keySuggest': YM.login.servicePath + 'search/suggest.jspa?q={q}&callback=?',
        'sellerKeySuggest': YM.login.servicePath + 'search/suggest.jspa?q={q}&callback=?&suggestType=1'
    };
    //-----------------------------
    YM.page.header.init = function() {
        this.container = $('#header');
        this.initHeadBar();
        this.initHeadSearch();
        this.initHeadShopCart();
        this.initHeadCategory();
        this.initHeadNavLinks();
        this.loadHeadData();
        this.initFooter();
        this.initSign();
        this.initPopContent();
        //this.cut();
    };
    //-----------------------------
    YM.page.header.initHeadBar = function() {
        var headbarElm = this.container.find('.head-bar');
        if (headbarElm.size() == 0) return;
        headbarElm.find('.dropdown').bindYMUI('ElementHover', {
            hoverClass: 'dropdown-hover'
        });
        if (this.container.find('.head-logo .logo-channel').size() > 0) {
            headbarElm.find('.myaccount').addClass('bldr').before('<li class="bold"><a href="http://www.yesmywine.com/" target="_blank">也买酒首页</a></li>');
        }
        headbarElm.find('a.txt-login, a.txt-register').each(function() {
            this.href = this.href + '?to=' + encodeURIComponent(location.href);
        });
    };
    // 搜索框初始化
    YM.page.header.initHeadSearch = function() {
        var headsrhElm = this.container.find('.head-search');
        if (headsrhElm.size() == 0) return;
        //
        if ($('#headSuggestArea').size() == 0) {
            $('body').append('<ul id="headSuggestArea" class="searchsuggest"></ul>');
        }
        //
        var searchElm = this.container.find('.head-search .txt-keyword');
        //顶部搜索框去掉浏览器记忆功能
        searchElm.attr("autocomplete", "off"); 
        var pathname = document.location.pathname;
        var hostname = document.location.hostname;
        if (hostname=='list.yesmywine.com'|| pathname.startWith('/list3')){
            $("#headSearch").attr("target","_self");
        }
        var pathName = document.location.pathname; 
        var suggestUrl= this.serviceAPI.keySuggest; 
        if(hostname=='mall.yesmywine.com'&&!!pathName&&pathName.startWith('/shop')){ 
            suggestUrl= this.serviceAPI.sellerKeySuggest; 
        }
        searchElm.bind('submitKeyword', 
            function() { 
                if($('#headSuggestArea li.selected a').length > 0){ 
                window.location.href = $('#headSuggestArea li.selected a').attr('href'); 
            }else{ 
                $(this).next().click(); 
            }
        });
        searchElm.bind('keypress', 
            function(e) { 
                try { 
                    e.stopPropagation(); 
                    var code = e.which || e.keyCode || 0; 
                    if (code == 13) { 
                    if($('#headSuggestArea').css('display') == 'none'){ 
                    $(this).next().click(); 
                } 
            }
            } catch(err) {} 
        });
        searchElm.bindYMUI('InputHint', {
            hint: '输入您要查找的商品名称',
            hintColor: '#cccccc',
            hintKeep: false,
            required: true
        });
        searchElm.bindYMUIExtend('suggest', 'suggest', {
            url: suggestUrl,
            listElm: $('#headSuggestArea'),
            itemTmpl: '<li key="{key}"><i>约{num}件</i><span class="mr70">{txt}</span></li>',
            itemTmp2: '<li key="{key}"><a href="{url}" target="_blank">{txt}</a></li>',
            //itemTmpl: '<li key="{key}"><span class="mr70">{txt}</span></li>',
            itemExec: function(key, data) {
                return {
                    'key': data[0],
                    'txt': data[0].replace(key, '<em>' + key + '</em>'),
                    'num': data[1],
                    'url': data[2]
                };

            }
        });
    };
    // 购物车初始化
    YM.page.header.initHeadShopCart = function() {
        var headcartElm = $('.head-shopcart');
        if (headcartElm.size() == 0) return;
        headcartElm.hover(function() {
            $(this).addClass('head-shopcart-hover');
            YM.page.header.cart.slideStop();
        },
        function() {
            $(this).removeClass('head-shopcart-hover');
        });
       $(window).scroll(function(){
            if($('.head-right').find('.head-shopcart').size() > 0){
                 headcartElm.find('.shopcart-list').removeAttr('style')
            }
           
        })
        var pathname = document.location.pathname,
        hostname = document.location.hostname;
        //全站浮动购物车
        //if (hostname=='list.yesmywine.com' || pathname.startWith('/goods') || pathname.startWith('/list') || pathname.startWith('/marketing/sales') || pathname.startWith('/marketing/seckill') ||$('.e-addtopopcart').size()>0) {
        //搜索列表页测试右侧导航，不需要浮动购物车
        if ($('.ym-nBar').size() > 0) return;
        YM.page.header.cart.float();
        //}
    };
    YM.page.header.initHeadCategory = function() {
        var headcateElm = this.container.find('.head-nav .categorys');
        if (headcateElm.size() == 0) return;
        //针对IE6下不支持:hover伪类的处理
        if ($.browser.isIE6) {
            if ($('body').hasClass('s950') || $('body').hasClass('s960')) {
                headcateElm.bindYMUI('ElementHover', {
                    hoverClass: 'categorys-hover'
                });
            }
            headcateElm.find('dl').bindYMUI('ElementHover', {
                hoverClass: 'hover'
            });
            headcateElm.find('.subcates, .relcates').each(function() {
                $(this).find('li:first').addClass('first');
            });
        }
    };
    YM.page.header.initHeadNavLinks = function() {
        var headlinkElm = this.container.find('.head-nav .navlinks');
        if (headlinkElm.size() == 0) return;
        var pathname = window._ymw_pathname || document.location.pathname;
        if (pathname == '/' || pathname == '') pathname = '/index.html';
        headlinkElm.find('li').each(function() {
            if ($(this).attr('folder')) {
                if (pathname.startWith($(this).attr('folder'), true)) {
                    $(this).addClass('on').siblings('.on').removeClass('on');
                }
            }
        });
    };
    //-----------------------------
    YM.page.header.loadHeadData = function() {
        var headbarElm = this.container.find('.head-bar');
        if (headbarElm.size() == 0) return;
        YM.login.getUserInfo(function(userData, headData) {
            if (userData.isLogin) {
                YM.page.header.showUserInfo(userData, headData.loginInfo);
                YM.page.header.userLoginLoad(userData);
            } else {
                headbarElm.find('em.member-count').html(headData.miscInfo.memberCount).parent().show();
                YM.page.header.userNologinLoad();
            }
            YM.page.header.cart.show(headData.cartInfo);
            YM.page.header.loadCartMsg(headData.cartInfo);
        });
    };
    // 加载用户信息
    YM.page.header.showUserInfo = function(d, d2) {
        var headbarElm = this.container.find('.head-bar');
        var userElm = headbarElm.find('.userinfos');
        // 截取用户信息
        var userName = this.showUserName(d.nickName);   
        // 显示用户信息
        var tmpl = ['<li style="height:16px;overflow:hidden;">您好，<a href="{accountLink}' + d.memberId + '" title="{nickName}">' + userName + '<img align="absmiddle" width="16" height="16" src="http://img11.yesmyimg.com/newWeb/images/global/member/s/{memberTinyIcon}.png" /></a></li>', '<li class="bldr message"><a href="javascript:;">新消息<em></em></a></li>', '<li class="bldr"><a href="{logoutLink}" class="txt-logout" onclick="YM.cookie.del(\'login_username\');YM.cookie.del(\'mc_uuid\');return true;">退出</a></li>'].join('');
        d.memberTinyIcon = (d.title && d.title != "MEMBER_TITLE_LEVEL_00") ? d.title: d.classType;
        d.accountLink = YM.page.header.serviceAPI.accountLink;
        d.logoutLink = YM.page.header.serviceAPI.logoutLink;
        d.messageLink = YM.page.header.serviceAPI.messageLink;
        userElm.html(tmpl.substitute(d));
        if (d2.wlt) {
            userElm.addClass('co-pingan');
        }
        // 消息数显示
        if (d.messageCount && d.messageCount.all) {
            this.showMessageInfo(d.messageCount);
        }
        // 存酒库提醒显示
        if (d.cellarTakeAlarmCount) {
            this.showCellarTakeAlarm(d.cellarTakeAlarmCount);
        }
        // QQ用户登录，头部增加一个说明条
        if (d.showMsg) {
            var cb = $('<div class="head-qqcb"></div>');
            headbarElm.before(cb);
            cb.html('<div class="wcontent">' + d.showMsg + '<span class="cb_showmsg">' + d.nickName + '</span></div>');
        }
    };
    YM.page.header.showUserName = function(name){
        if($('body').hasClass('s960') || $('body').hasClass('s950')){
             return this.showNameLength(name,10);
        }
        return name;
    };
    //截取字符串
    YM.page.header.showNameLength = function(name,len){
        var singleNum = 0;
        var neWstr = '',singleChar = '';
        for(var i = 0;i < name.length;i++){
            singleChar = name.charAt(i).toString();
            if(name.charCodeAt(i) < 0 || name.charCodeAt(i) > 255){
                 singleNum += 2;
            }else{
                singleNum++;
            };
            if(singleNum > len){
                neWstr += "...";
                break;
            };
             neWstr +=singleChar;
        };
        return neWstr;
    };
    YM.page.header.showMessageInfo = function(d) {
        var userElm = this.container.find('.userinfos');
        userElm.find('li.message em').html('(' + d.all + ')');
        userElm.find('li.message').show();
        if (d.gift > 0 || d.sys > 0 || d.card > 0 || d.coupon > 0) {
            d.messageLink = this.serviceAPI.messageLink;
            d.giftLink = this.serviceAPI.giftLink;
            d.giftCardLink = this.serviceAPI.giftCardLink;
            d.couponLink = this.serviceAPI.couponLink;
            userElm.find('li.message').addClass('dropdown');
            userElm.find('li.message a').addClass('txt-down');
            userElm.find('li.message').append('<ul class="msg-box"></ul><b class="arrow-top"></b>');
            if (d.sys > 0) userElm.find('li.message ul').append('<li><a href="{messageLink}" target="_blank"><h4>我的消息</h4><em>{sys}</em>条</a></li>'.substitute(d));
            if (d.gift > 0) userElm.find('li.message ul').append('<li><a href="{giftLink}" target="_blank"><h4>礼品消息</h4><em>{gift}</em>条</a></dd>'.substitute(d));
            if (d.card > 0) userElm.find('li.message ul').append('<li><a href="{giftCardLink}" target="_blank"><h4>可使用礼品卡</h4><em>{card}</em>条</a></dd>'.substitute(d));
            if (d.coupon > 0) userElm.find('li.message ul').append('<li><a href="{couponLink}" target="_blank"><h4>可使用优惠券</h4><em>{coupon}</em>条</a></dd>'.substitute(d));
            userElm.find('li.message').bindYMUI('ElementHover', {
                hoverClass: 'dropdown-hover'
            });
        }
    };
    YM.page.header.showCellarTakeAlarm = function(count) {
        // 存酒库到期提醒
        if (YM.cookie.get('cellarTakeAlarmFlag') == 1) return;
        YM.page.msgtip('#header ul.sitelinks li.myaccount', '<a href="http://www.yesmywine.com/personalCenter/showMyCellar.jspa?viewFlag=1" target="_blank">您的存酒库内有<strong style="color:#f00;margin:0 5px;">' + count + '</strong>瓶酒即将到期！</a>', {
            position: 'yellow',
            width: 250
        });
        YM.load('util-msgtip',
        function() {
            $('.util-msgtip .msgtip-close').click(function() {
                YM.cookie.set('cellarTakeAlarmFlag', 1, 0);
            });
            $('.util-msgtip .msgtip-content a').click(function() {
                YM.cookie.set('cellarTakeAlarmFlag', 1, 0);
                return true;
            });
        });
    };
    //-----------------------------
    // 加载购物车信息 YM.page.header.cart
    YM.namespace('YM.page.header.cart');
    YM.page.header.cart.addGood = function(goodsId, amountId, goodsYearId) {
        // 此方法会在http://www.yesmywine.com/cart3/js/cart_api.js中重新定义
    };
    YM.page.header.cart.delGood = function(goodsId, cartType) {
        // 此方法会在http://www.yesmywine.com/cart3/js/cart_api.js中重新定义
    };
    YM.page.header.cart.float = function() {
        $('.head-shopcart').bindYMUI('floatTopNav');
    };
    YM.page.header.cart.show = function(d) {
        var headcartElm = $('.head-shopcart');
        if (headcartElm.size() == 0) return;
        if (d.totalGoodsAmount) {
            d.totalGoodsAmount >= 100 ? headcartElm.find('.txt-cartcount').html("<em>99+</em>").show() : headcartElm.find('.txt-cartcount').html(d.totalGoodsAmount).show();
            headcartElm.find('.shopcart-list').html('<ul data-dts = "C3"></ul>');
            var tmpl = {
                'li': ['<li data-goodsId="{goodsId}">', '<a href="http://www.yesmywine.com/goods/{goodsId}.html" target="_blank" class="prod-info">', '<img src="{goodsPicUrl}" width="60" height="98" alt="{goodsName}" />', '<span class="name">{goodsName}</span>', '<span class="nameEn">{engName}</span>', '<span class="price"><strong>&yen; {privilegePrice}</strong> × <em>{goodsAmount}</em></span>', '</a>', '{statusHTML}', '<a href="#" class="btn-remove" data-goodsId="{goodsId}" data-cartKey="{cartKey}" data-cartType="{cartType}" title="从购物车移除{goodsName}">删除</a>', '</li>'].join(''),
                'sum': ['<div class="shopcart-sum">', '<a data-dts = "C2" href="http://www.yesmywine.com/cart2/showCart.jspa" class="btn-viewcart">查看购物车</a>', '<p>{sumHTML}<br/>总计： &yen;<strong>{totalPrice}</strong></p>', '</div>'].join('')
            };
            var li_html = '',
            amount = 0;
            //for (var i = 0; i < d.goodsList.length && i < 5; i++) {
            for (var i = 0; i < d.goodsList.length; i++) {
                // d.goodsList[i].statusHTML = ()?'<label class="soldout">售罄</label>':'';
                d.goodsList[i].privilegePrice = d.goodsList[i].privilegePrice.toFixed(1);
                li_html += tmpl.li.substitute(d.goodsList[i]);
                amount += d.goodsList[i].goodsAmount;
            }
            var ul = headcartElm.find('.shopcart-list ul');
            ul.html(li_html);
            if(amount > 4 && d.goodsList.length > 4){
                ul.css('height','436px');
            }
            var dsum = {
                totalPrice: d.totalPrice.toFixed(1)
            };
            dsum.sumHTML = '共<em>' + d.totalGoodsAmount + '</em>件商品';
            /*if (d.totalGoodsAmount > amount) {
                dsum.sumHTML = '购物车还有<em>' + (d.totalGoodsAmount - amount) + '</em>件商品，共<em>' + d.totalGoodsAmount + '</em>件';
            } else {
                dsum.sumHTML = '共<em>' + d.totalGoodsAmount + '</em>件商品';
            }*/
            headcartElm.find('.shopcart-list').append(tmpl.sum.substitute(dsum));
            headcartElm.find('.shopcart-list .btn-remove').click(function() {
                var goodsId = $(this).attr('data-goodsId');
                var cartKey = $(this).attr('data-cartKey');
                var cartType = $(this).attr('data-cartType');
                YM.page.header.cart.delGood(cartKey || goodsId, cartType);
                return false;
            });
        } else {
            headcartElm.find('.txt-cartcount').html('0').hide();
            headcartElm.find('.shopcart-list').html('<div class="empty">您的购物车内暂时没有商品，去<a href="http://www.yesmywine.com/">首页</a>挑选</div>');
        }
    };
    YM.page.header.cart.update = function() {
        var headcartElm = $('.head-shopcart');
        if (headcartElm.size() == 0) return;
        if (this.isLoading) return;
        this.isLoading = true;
        YM.login.loadUserInfo(function(userData, headData) {
            YM.page.header.cart.isLoading = false;
            YM.page.header.cart.show(headData.cartInfo);
            YM.page.header.loadCartMsg(headData.cartInfo);
            YM.page.header.cart.slideDown();
            YM.page.header.cart.setTop();
        });
    };
    YM.page.header.cart.setTop = function(){
        var elmTop =  $('#util-floattop').find('.shopcart-list').outerHeight(true);
        if(elmTop < 166){
            $('#util-floattop').find('.shopcart-list').css('top','-52px'); 
        }else if(elmTop == 166){
            $('#util-floattop').find('.shopcart-list').css('top',-elmTop); 
        }else{
            $('#util-floattop').find('.shopcart-list').css('top',-elmTop - 109); 
        };
    }
    YM.page.header.cart.slideDown = function() {
        if (this.isShow) {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
        } else {
            this.isShow = true;
            //$('.head-shopcart .shopcart-list').stop().removeAttr('style').slideDown();
        }
        this.timer = setTimeout(YM.page.header.cart.slideUp, 3000);
    };
    YM.page.header.cart.slideUp = function() {
        YM.page.header.cart.timer = null;
        YM.page.header.cart.isShow = false;
        var listElm = $('.head-shopcart .shopcart-list');
        listElm.slideUp(function() {
            listElm.removeAttr('style');
        });
    };
    YM.page.header.cart.slideStop = function() {
        if (YM.page.header.cart.timer) {
            window.clearTimeout(YM.page.header.cart.timer);
        }
        YM.page.header.cart.timer = false;
        YM.page.header.cart.isShow = false;
        $('.head-shopcart .shopcart-list').stop().show().removeAttr('style');

    };
   //--------- 初始化签到 --------
    YM.page.header.initSign = function(){
        $('.sign_up').click(function() {
            YM.login.pop(function() {
                YM.dataproxy.getJSON('http://www.yesmywine.com/marketing/getIntegralByOrderAmount.jspa', function(d) {
                    YM.page.dialog({ title:'已经签到', content:d.html, width:400, height:430 });
                });
            }); 
        });
    }
    //-----------------------------
    YM.page.header.initFooter = function() {
        if(document.location.hostname == 'mall.yesmywine.com'){
            $('.foot-adv').hide();
        }
        if ($('#footer .foot-links p a').size() == 0) {
            $('#footer .foot-links').hide();
        }
        if ($.browser.isIE6) {
            $('p.sns span.ico-weixin').bindYMUI('ElementHover', {
                hoverClass: 'ico-weixin-hover'
            });
        }
    };
    //-----------------------------
    // 页面内容初始化
    YM.page.header.initContent = function() {
        this.initDelayLoad();
        this.initFloatTool();
        this.initTopline();
        this.initPopCart();
        this.initGoodsInfo();
        this.initCode();
        this.menuBar();
    };
    //-----------------------------
    // 内容(包括页面图片)延迟加载
    YM.page.header.initDelayLoad = function() {
        var ImageDelayLoad = function() {
            if ($('.e-imageload').size() == 0) {
                $(window).unbind('scroll', ImageDelayLoad);
                $(window).unbind('resize', ImageDelayLoad);
            } else {
                $('.e-imageload').bindYMUI('DelayLoadImage', {
                    preloadHeight: 100
                });
            }
        };
        $(window).bind('scroll', ImageDelayLoad);
        $(window).bind('resize', ImageDelayLoad);
        ImageDelayLoad();
        $("img").scrollLoading();
    };
    // 右侧浮动广告
    YM.page.header.initFloatTool = function() {
        $('#floatTool li[rel]').click(function() {
            window.scrollTo(0, $($(this).attr('rel')).offset().top);
            return false;
        });
        $('#floatTool').bindYMUI('FloatTool');
    };
   // 头部通栏处理
    YM.page.header.initTopline = function() {
        $('.e-topline').each(function() {
            var canShow = true;
            var d = new Date();
            var btime = ($(this).attr('btime') || '2000-01-01').parseDate();
            var etime = ($(this).attr('etime') || '2099-01-01').parseDate();
            var topic = $(this).attr('topic') || '';
            var way = '',
            time = 0,
            iNum = 0,
            iNow = 0;
            var $this = $(this);
            //var flag = 1;
            //var Imgurl1="url(http://img14.yesmyimg.com/images/event/2015/10/019855/tl01.jpg) 50% 0 no-repeat";
            //var Imgurl2="url(http://img14.yesmyimg.com/images/event/2015/10/019855/tl02.jpg) 50% 0 no-repeat";
            $this.removeAttr('btime').removeAttr('etime').removeAttr('topic').removeClass('e-topline');
            if (topic != '') {
                if (typeof(m_topicId) == 'undefined') {
                    m_topicId = 'subject';
                    if (location.pathname == '/marketing/sales/sales.html') m_topicId = 'grabbuy';
                }
                canShow = (topic.split(',').indexOf(m_topicId) >= 0) ? true: false;
            }
            if (canShow && d > btime && d < etime) {
                $this.slideDown(1000,
                function() {
                    iNum = $(this).height();
                    if ($.browser.IEMode == 7 || $.browser.isIE6) {
                        $(this).siblings('.head-main').css('top', iNum + 30);
                        $(this).css('visibility', 'visible');
                    };
                });
                $this.find('.topline-main').each(function() {
                    if ($(this).hasClass('e-slide')) {
                        iNow = $(this).height();
                        way = $(this).data('way');
                        time = $(this).data('time') || 3;
                        $(this).bindYMUI('HideByTimer', {
                            animate: way,
                            timer: time
                        });
                        setTimeout(function() {
                            if ($.browser.IEMode == 7 || $.browser.isIE6) {
                                //alert(iNum)
                                $this.siblings('.head-main').animate({
                                    'top': iNum - iNow + 30
                                });
                            };
                            var dh = $this.find('.down').height();
                            $this.find('.down').css({
                               'top' : iNum - iNow - dh,
                                'transform':'rotate(180deg)'
                            }).fadeIn();
                            //$('#h1').css('background',Imgurl2)
                        },
                        (time || 3) * 1000);
                        $this.find('.down').toggle(function() {
                            $(this).animate({
                                'top': iNum - $(this).height()
                            },function(){
                                $(this).css('webkitTranisition','1s');
                                $(this).css('webkitTransform','rotate(0deg)');
                                $(this).css('tranisition','1s');
                                $(this).css('transform','rotate(0deg)');
                            });
                            $this.find('.e-slide').slideDown();
                            if ($.browser.IEMode == 7 || $.browser.isIE6) {
                                $this.siblings('.head-main').animate({
                                    'top': iNum + 30
                                },function(){
                                    $(this).css('backgroundPosition','0 0');
                                });
                            };
                            //if(flag==1){
//                              $('#h1').css('background',Imgurl1)
//                          }
                        },
                        function() {
                            $(this).animate({
                                'top': iNum - iNow - $(this).height()
                            },function(){
                                $(this).css('WebkitTranisition','1s');
                                $(this).css('WebkitTransform','rotate(180deg)');
                                $(this).css('tranisition','1s');
                                $(this).css('transform','rotate(180deg)');
                            });
                            $this.find('.e-slide').slideUp();
                            if ($.browser.IEMode == 7 || $.browser.isIE6) {
                                $this.siblings('.head-main').animate({
                                  'top': iNum - iNow + 30
                                },function(){
                                    $(this).css('backgroundPosition','0 bottom');
                                });
                            };
                            //$('#h1').css('background',Imgurl2)
                        });
                    };
                });
                $(this).find('.countdown').bindYMUI('CountDown');
                $(this).find('img[original]').bindYMUI('LoadRealImage', {
                    srcAttr: 'original'
                });
            }
        });
    };
    // 加入购物车弹窗处理
    YM.page.header.initPopCart = function() {
        var elements = $('.e-addtopopcart');
        if (elements.size() > 0) {
            YM.load('popcart');
        }
        elements.click(function() {
            YM.page.AddToPopCart($(this).attr('data-goodsId'));
            return false;
        });
    };
    YM.page.AddToPopCart = function(goodsId) {
        YM.load('popcart',
        function() {
            YM.page.popcart.show(goodsId);
        });
    };
    // 商品信息处理
    YM.page.header.initGoodsInfo = function() {
        // 折扣率计算
        $('.promo-icon ins.zhe').each(function() {
            var itemElm = $(this).closest('li');
            var minprice = itemElm.find('.minprice strong').text(),
            maxprice = itemElm.find('.maxprice del').text().replace('¥', '').replace('￥', '');
            if (minprice > 0 && maxprice > 0) {
                var discount = (minprice * 10 / maxprice).toFixed(1);
                if (discount != '10.0') {
                    $(this).html('<em>' + discount + '<\/em>折').removeClass('zhe');
                }
            }
        });
    };
    // 浮动二维码
    YM.page.header.initCode = function() {
        if ($('.ym-nBar').size() > 0) {
            $('.td-Code').hide();
        };
        if($('.td-Code').size()>0){
            var sWidth = 1200;
            if($('.head-topline').size()>0){
                $('.td-Code').css('top',365);
            };
            if($('body').hasClass('s960')){
                sWidth = 960;
            };
             if($('body').hasClass('s950')){
                sWidth = 950;
            };
            var _width = parseInt(($(window).width()- sWidth)/2)-$('.td-Code').width()-5;
            $('.td-Code').css('right',_width);
            $(window).resize(function(){
                var _width = parseInt(($(window).width()-sWidth)/2)-$('.td-Code').width()-5;
                $('.td-Code').css('right',_width);
            });
            $('.td-Code').hover(function(){
                $(this).css('top',150).addClass('b-code');
            },function(){
                $(this).css('top',365).removeClass('b-code');
            });
            $('.td-Code .close-btn').click(function(){
                $(this).parents('.td-Code').fadeOut();
            });
        }; 
    };
    YM.page.header.menuBar =  function() {
        // 初始化右侧导航条的按钮位置
        var _h = $(window).height()*0.3;
        $('.ym-nBar-tab-user').css('top', _h);
        $('.ym-nBar-tab-cart').css('top',_h + 40);
        $('.ym-nBar-tab-asset').css('top',_h + 160);
        $('.ym-nBar-tab-charge').css('top',_h + 195);
        //$('.ym-nBar-tab-feedback').css('top',_h + 230);
        $('.ym-nBar-tab-chat').css('top',_h + 230);
        $('.ym-nBar-tab-valid').css('top',_h + 265);
        $(window).resize(function(){
            var _h = $(window).height()*0.3;
            $('.ym-nBar-tab-user').css('top', _h);
            $('.ym-nBar-tab-cart').css('top',_h + 40);
            $('.ym-nBar-tab-asset').css('top',_h + 160);
            $('.ym-nBar-tab-charge').css('top',_h + 195);
            //$('.ym-nBar-tab-feedback').css('top',_h + 230);
            $('.ym-nBar-tab-chat').css('top',_h + 230);
            $('.ym-nBar-tab-valid').css('top',_h + 265);
            if( ($(window).height() - 124) < (_h + 270)){
                $('.ym-nBar-tab-qrcode,.ym-nBar-tab-backtop').addClass('hidden');
            }else{
                $('.ym-nBar-tab-qrcode,.ym-nBar-tab-backtop').removeClass('hidden');
            }
        });

        //　侧边导航条出现
        $('.ym-nBar').delay(500).animate({'right':'0'});

        YM.load.add('mousewheel', { js:'js/lib/jscrollpane/jquery.mousewheel.js' });
        YM.load.add('jscrollpane', {js:'js/lib/jscrollpane/jquery.jscrollpane.min.js', css:'js/lib/jscrollpane/jquery.jscrollpane.css', requires:'mousewheel' });
        
        YM.load('jscrollpane', function() {
            $('.ym-nBar-chat-cont').jScrollPane();
        });
     

        // 验证码图片添加点击事件
        $("#randPic").click(
            function() {
                $(this).attr("src",YM.login.servicePath + "random/rand.jspa?"+ new Date());
            }
        );
        // 客服聊天添加点击事件
        $('.ym-nBar-chat-logo').click(function(){
            resize();
        });
        $(window).resize(function(){
            resize()
        })
        function resize(){
             var This = $('.ym-nBar-chat-logo').parents('.ym-nBar-tab');
             var ymHeight = parseInt($('.ym-nBar').outerHeight());
             var ymTop = parseInt(This.css('top'));
             var value = ymHeight - ymTop;
             if(value < 200){
                 This.find('.ym-nBar-pop').css('top',-385 + value + 'px');
                 This.find('.ym-nBar-pop-icon').css('bottom', 207 - value + 'px');
             }else{
                 This.find('.ym-nBar-pop').css('top','-185px')
             }
        } 
        // 反馈意见重置按钮点击事件
        $(".ym-nBar-feedback-table .btn-primary").click(function() {
            $(".ym-nBar-feedback-vaild").val("");
            $("#adviceContent").val("");
        });
        // 反馈意见提交按钮点击事件
        $("#submitAdvice").click(
                function() {
                    var validCode = $(".ym-nBar-feedback-vaild").val();
                    var adviceContent = $.trim($("#adviceContent").val());
                    if (!validCode) {
                        YM.page.alert("请输入验证码！");
                        return;
                    }
                    if (!adviceContent) {
                        YM.page.alert("意见内容不能为空！");
                        return;
                    }
                    if (adviceContent.length > 500) {
                        YM.page.alert("亲爱的你写的太多了,我只能放下500个字哦!");
                        return;
                    }
                    var param = {
                        "validCode" : validCode,
                        "adviceContent" : adviceContent
                    };
                    YM.dataproxy.getJSON("http://www.yesmywine.com/advice/sendAdvice.jspa",param,
                            function(data) {
                                if (data.flag == 1) {
                                    YM.page.alert("感谢您提出的宝贵意见，我们将尽快处理！");
                                    $(".ym-nBar-feedback-table .btn-primary").click();
                                    $("#randPic").click();
                                } else {
                                    YM.page.alert(data.msg);
                                    $("#randPic").click();
                                }
                            });
                });
        // 返回到最顶层添加scroll事件，设置图标是否显示
        $(window).scroll(function() {
            var height = $(this).scrollTop(); // 获得滚动条距窗口顶部的高度
            if (height > 700) {
                $(".ym-nBar-tab-backtop").show();
            } else {
                $(".ym-nBar-tab-backtop").hide();
            }
        });
        if ($(window).scrollTop() > 700) {
            $(".ym-nBar-tab-backtop").show();
        }
        // 返回顶部图标添加事件
        $(".ym-nBar-backtop-logo").click(function() {
            $(window).scrollTop(0);
        });
        // 登陆框添加事件
        $(".ym-nBar-pop-login").hover(function(){
            $(this).show();
        },function(){
            $(this).hide();
        });
        $(".ym-nBar-tab-cart").mouseover(function() {
            var _h = $(this).find('.shopcart-list').outerHeight()/2 - 30;
            $(this).find('.ym-nBar-pop').css('marginTop',-_h);
        });
    };
    YM.page.header.loadCartMsg = function(d) {
        // 购物车信息
        if (d.totalGoodsCount > 0) {
            if (d.totalGoodsAmount > 9) {
                $(".ym-nBar-cart-num").html("<em>9+</em>");
            } else {
                $(".ym-nBar-cart-num").html("<em>" + d.totalGoodsAmount + "</em>");
            }
            var cartHtml = '<h2>最近加入</h2><ul data-dts="S3">';
            var totalNum = 0;
            for (var i = 0; i < 4 && i < d.goodsList.length; i++) {
                var goods = d.goodsList[i];
                cartHtml += '<li data-goodsid="' + goods.goodsId + '">';
                cartHtml += '<a class="prod-info" target="_blank" href="http://www.yesmywine.com/goods/'
                        + goods.goodsId + '.html">';
                cartHtml += '<img width="60" height="98" alt="' + goods.goodsName
                        + '"  src="' + goods.goodsPicUrl + '">';
                cartHtml += '<span class="name">' + goods.goodsName + '</span>';
                cartHtml += '<span class="nameEn">' + goods.engName + '</span> ';
                //cartHtml += '<span class="price"><strong>￥' + goods.memberPrice
                cartHtml += '<span class="price"><strong>￥' + goods.privilegePrice
                        + '</strong> × <em>' + goods.goodsAmount + '</em></span>';
                cartHtml += '</a> ';
                cartHtml += '<a title="从购物车移除'+ goods.goodsName+'" data-carttype="'+ goods.cartType+ '" data-cartkey="'
                        + goods.cartKey
                        + '" data-goodsid="'
                        + goods.goodsId
                        + '" class="btn-remove" href="javascript:void(0);">删除</a></li>';
                totalNum += goods.goodsAmount;
            }
            cartHtml += '</ul>';
            cartHtml += '<div class="shopcart-sum">';
            cartHtml += '<a class="btn btn-default" data-dts="S4" href="http://www.yesmywine.com/cart4/showCart.jspa" target="_blank" data-dts="C2">查看购物车</a>';
            if (d.goodsList.length > 4) {
                cartHtml += '<p>购物车内还有<em>' + (d.totalGoodsAmount - totalNum)
                        + '</em>件商品</p>';
            } else {
                cartHtml += '<p>共计<em>' + d.totalGoodsAmount + '</em>件商品</p>';
            }
            cartHtml += '</div>';
            $(".ym-nBar-pop .shopcart-list").html(cartHtml);
            $('.ym-nBar-pop .shopcart-list .btn-remove').click(function() {
                var goodsId = $(this).attr('data-goodsId');
                var cartKey = $(this).attr('data-cartKey');
                var cartType = $(this).attr('data-cartType');
                YM.page.header.cart.delGood(cartKey || goodsId, cartType);
                return false;
            });
        } else {
            var cartHtml = '<div class="empty">您的购物车里没有任何商品，赶快去挑选商品吧！</div>';
            $(".ym-nBar-cart-num").html("<em>0</em>");
            $(".ym-nBar-pop .shopcart-list").html(cartHtml);
        }
    }
    YM.page.header.hide = function(){
        $('.ym-nBar-pop-login').fadeOut();
    };
    YM.page.header.userNologinLoad = function() {
        $('.ym-nBar-user-header').hide();
        $('.ym-nBar-tab-user .ym-nBar-pop').hide();
        // 没有登录显示登录框
        $(".ym-nBar-user-default").mouseover(
        function() {
            var _h = $(window).height()*0.3 ;
            var url = window.location.hostname == "www.yesmywine.com" ? "/portal/toLogin.jspa?pagetype=pop&dataDts=S1" : "http://www.yesmywine.com/portal/toLogin.jspa?pagetype=pop&crossdomain=true&dataDts=S1";
            $(".ym-nBar-pop-login").css('top',_h).show();
            //if (!$('.ym-nBar-pop-login .ym-nBar-pop-content').html()) {
                $('.ym-nBar-pop-login .ym-nBar-pop-content')
                .html(
                        '<iframe width="100%" height="320px" frameborder="0" marginwidth="0"'
                                + ' marginheight="0" scrolling="auto"'
                                + ' src="'+ url +'"'
                                + ' name="iframe" id="iframe"> </iframe>');
            //}
            $(".ym-nBar-tab-user").find(".ym-nBar-pop").hide();
        });
        $(".ym-nBar-user-default").mouseout(function() {
            $(".ym-nBar-pop-login").hide();
        });
        $(".ym-nBar-pop-login").mouseover(function(){
            $(this).show();
        });
        $(".ym-nBar-pop-login").mouseout(function(){
            $(this).hide();
        });
    }
    //商品真伪查询
    YM.page.header.initPopContent = function() {
        $("#cnnCode").focus(function(){
            $(this).css('background','none');
        });
        $("#validateCode").focus(function(){
            $(this).css('background','none');
        });
        //失焦后做初步判断
        $("#cnnCode").blur(function(){
            var cnnCode = $("#cnnCode").val();
            if(!cnnCode){
                $(this).css('background','url(http://img10.yesmyimg.com/20140808/newWeb/css/v4/images/hp_v4/cnnCode.gif) no-repeat 10px center;');
            }else{
                $(this).css('background','none');
            }
            if(cnnCode.length !=16){
                if(isNaN(cnnCode)){
                    $(this).parent().find(".error").css("background-position","-211px -52px").html("商品防伪码格式错误");
                    return false;
                }else{
                    $(this).parent().find(".error").css("background-position","-211px -52px").html("请输入16位商品防伪码");
                    return false;
                }
            }else{
                $(this).parent().find(".error").css("background-position","-500px -500px").html("");
            }   
            
        });
        $("#validateCode").blur(function(){
            var validateCode = $("#validateCode").val();
            if(!validateCode){
                $(this).css('background','url(http://img10.yesmyimg.com/20140808/newWeb/css/v4/images/hp_v4/validateCode.gif) no-repeat 10px center;');
                $(this).parent().parent().find(".error").css("background-position","-211px -52px").html("请输入验证码");
            }else{
                $(this).parent().parent().find(".error").css("background-position","-500px -500px").html("");
                $(this).css('background','none');
            }       
        });
        //默认不加载验证码，鼠标悬停在对应内容上后才显示
        $(".form-group-code img,.feedback-table-vaild img").attr('scr','http://img11.yesmyimg.com/newWeb/images/global/1px.gif');
        $(".ym-nBar-feedback-logo,.ym-nBar-valid-logo").mouseover(function(){
            $('#randPic,#randPicCnn').attr("src",YM.login.servicePath + "random/rand.jspa?"+ new Date());                                                              
        });
        // 切换验证码
        $("#randPicCnn").click(
            function() {
                $(this).attr("src",YM.login.servicePath + "random/rand.jspa?"+ new Date());
            }
        );
        // 验证输入内容
        $("#validateCnn").click(
            function(){
                var cnnCode = $("#cnnCode").val();
                var validateCode = $("#validateCode").val();
                if(!cnnCode){
                    $("#cnnCode").parent().find(".error").css("background-position","-211px -52px").html("请输入16位商品防伪码");
                    return false;
                }
                if(!validateCode){
                    $("#validateCode").parent().parent().find(".error").css("background-position","-211px -52px").html("请输入验证码");
                    return false;
                }
                if(cnnCode.length !=16){
                    $(this).parent().find(".error").css("background-position","-211px -52px").html("请输入16位商品防伪码");
                    return false;
                }   
                if(isNaN(cnnCode)){
                    $(this).parent().find(".error").css("background-position","-211px -52px").html("商品防伪码格式错误");
                    return false;
                }
                var param = {
                        "cnnCode" : cnnCode,
                        "validateCode" : validateCode
                };
                YM.dataproxy.getJSON("http://www.yesmywine.com/goods/validateCnnCode.jspa",
                    param,
                    function(json) {
                        var state = json.other;
                        if(state!="" && state.length>0){
                            if(state=="001" || state=="002"){
                                $("#initCnn").hide();
                                $("#failCnn").hide();
                                $("#doCnn").hide();
                                $("#waitCnn").hide();
                                $(".form-group").hide();
                                $("#successCnn").show();
                            }else if(state=="000" || state=="003" || state=="004" || state=="005"){
                                $("#initCnn").hide();
                                $("#successCnn").hide();
                                $("#waitCnn").hide();
                                $(".form-group").hide();
                                $("#failCnn").show();
                                $("#doCnn").show();
                            }else{
                                $("#initCnn").hide();
                                $("#successCnn").hide();
                                $("#failCnn").hide();
                                $("#doCnn").hide();
                                $(".form-group").hide();
                                $("#waitCnn").show();
                            }
                            }else{
                                $("#validateCode").parent().parent().find(".error").css("background-position","-211px -52px").html("验证码错误");
                                $("#initCnn").show();
                                $(".form-group").show();
                                $("#doCnn").hide();
                                $("#waitCnn").hide();
                                $("#failCnn").hide();
                                $("#successCnn").hide();
                                $("#initCnn").show();
                            }
                        }
                );
                
            }
            
        );
        //错误信息返回
        $(".validateBack").click(function(){
            $("#randPicCnn").attr("src",YM.login.servicePath + "random/rand.jspa?"+ new Date()); 
            $("#validateCode").val("");
            $("#initCnn").show();
            $(".form-group").show();
            $("#doCnn").hide();
            $("#waitCnn").hide();
            $("#failCnn").hide();
            $("#successCnn").hide();
            $("#initCnn").show();
            $("#cnnCode").html('');
            $("#validateCode").html('');
        })
        
    }
    $.fn.scrollLoading = function(options) {
        var defaults = {
            attr: "original",
            container: $(window),
            callback: $.noop
        };
        var params = $.extend({}, defaults, options || {});
        params.cache = [];
        $(this).each(function() {
            var node = this.nodeName.toLowerCase(), url = $(this).attr(params["attr"]);
            //重组
            var data = {
                obj: $(this),
                tag: node,
                url: url
            };
            params.cache.push(data);
        });
        
        var callback = function(call) {
            if ($.isFunction(params.callback)) {
                params.callback.call(call.get(0));
            }
        };
        //动态显示数据
        var loading = function() {
            var contHeight = params.container.height();
            if (params.container.get(0) === window) {
                contop = $(window).scrollTop();
            } else {
                contop = params.container.offset().top;
            }       
            
            $.each(params.cache, function(i, data) {
                var o = data.obj, tag = data.tag, url = data.url, post, posb;
                if (o && !o.is(':hidden')) {
                    post = o.offset().top - contop, posb = post + o.height();
                    if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                        if (url) {
                            //在浏览器窗口内
                            if (tag === "img") {
                                //图片，改变src
                                callback(o.attr("src", url).css('opacity','0').animate({"opacity":'1'},500));       
                            } else {
                                o.load(url, {}, function() {
                                    callback(o);
                                });
                            }       
                        } else {
                            // 无地址，直接触发回调
                            callback(o);
                        }
                        data.obj = null;
                        o.removeAttr(params["attr"]);
                    }
                }
            }); 
        };
        //事件触发
        //加载完毕即执行
        loading();
        //滚动执行
        params.container.bind("scroll", loading);
    };
    YM.page.header.userLoginLoad = function(userData) {
        $('.ym-nBar-user-header').show();
        // 设置头像
        var imgHead = userData.imgUrl || 'http://imgblog.yesmyimg.com/microblog/images/headerDefault.jpg';
        var imgLink = 'http://space.yesmywine.com/' + userData.memberId;
        $(".ym-nBar-user-header img").attr('src',imgHead);
        $(".ym-nBar-tab-user .ym-nBar-pop-content dt").html("<a href='" + imgLink + "' target='_blank'><img width='100%' src='" + imgHead + "' /></a>");
        // 当前用户登录，给显示的是个人信息框，隐掉登录框
        $(".ym-nBar-user-header").mouseover(function() {
            $(".ym-nBar-tab-user").find(".ym-nBar-pop").show();
            $(".ym-nBar-pop-login").hide();
        });
        // 加载个人特权信息
        if (userData.classType != "MEMBER_LEVEL_NORMAL") {
            $('.ym-nBar-privs-vip').attr("class",
                    "ym-nBar-privs-vip-on");
            $('.ym-nBar-privs-save').attr("class",
                    "ym-nBar-privs-save-on");
        }
        if (userData.classType != "MEMBER_LEVEL_NORMAL"
                && userData.classType != "MEMBER_LEVEL_COPPER") {
            $('.ym-nBar-privs-maza').attr("class",
                    "ym-nBar-privs-maza-on");
            $('.ym-nBar-privs-paper').attr("class",
                    "ym-nBar-privs-paper-on");
        }
        if (userData.title != "MEMBER_TITLE_LEVEL_00") {
            $('.ym-nBar-privs-ship').attr("class",
                    "ym-nBar-privs-ship-on");
            $('.ym-nBar-privs-point').attr("class",
                    "ym-nBar-privs-point-on");
            $('.ym-nBar-privs-taste').attr("class",
                    "ym-nBar-privs-taste-on");
        }
        if (userData.title == "MEMBER_TITLE_LEVEL_02") {
            $('.ym-nBar-privs-first').attr("class",
                    "ym-nBar-privs-first-on");
            $('.ym-nBar-privs-adv').attr("class",
                    "ym-nBar-privs-adv-on");
            $('.ym-nBar-privs-refund').attr("class",
                    "ym-nBar-privs-refund-on");
        }
        if (userData.title != "MEMBER_TITLE_LEVEL_02"
                && userData.classType == "MEMBER_LEVEL_BLACKDIAMOND") {
            $('.ym-nBar-privs-refund').attr("class",
                    "ym-nBar-privs-refund-on");
        }
                
        // 显示个人昵称
        $("#ym-nBar-nickName").html(userData.nickName);
        // 账户余额
        $(".ym-nBar-pop-bd .txt-red").html(userData.memberBlance);
        // 用户消息
        var msg = userData.messageCount;
        $('.ym-nBar-pop-box').html('') ;
        if(msg.sys != 0){
            $('.ym-nBar-pop-box').append('<li>您有<a class="txt-blue" target="_blank" href="http://www.yesmywine.com/memberMessage/index.jspa">' + msg.sys + '</a>条未读消息</li>');
        };
        if(msg.overDueCoupon != 0){
            $('.ym-nBar-pop-box').append('<li>您有<a class="txt-blue" target="_blank" href="http://www.yesmywine.com/personalCenter/getMyCoupon.jspa">' + msg.overDueCoupon + '</a> 张 优惠券 即将过期</li>');
        };
        if(msg.overDueCard != 0){
            $('.ym-nBar-pop-box').append('<li>您有<a class="txt-blue" target="_blank" href="http://www.yesmywine.com/personalCenter/bindCard.jspa">' + msg.overDueCard + '</a> 张 礼品卡 即将过期</li>'); 
        };
        $('.ym-nBar-pop-box li:eq(0)').prepend('<em></em>');
    };
    
    //关闭签到后，弹去新的页面
    YM.page.header.direct =function(){
        window.open(sign_url,'_blank')  ;
        YM.util.dialog.close();
    };
    //-----------------------------
    YM.load.add('suggest', {
        js: 'js/ym/ui/suggest.js'
    });
    YM.load.add('popcart', {
        js: 'js/app/module/mod_popcart.js?vt=1',
        css: 'css/module/mod_popcart.css'
    });
    //-----------------------------
    $(document).ready(function() {
        YM.page.header.init();
        YM.page.header.initContent();
        //倒计时       
        $('.time').bindYMUI('CountDown', {
                callback: function(elm) {}
        }); 



        //选酒中心子列表图片直接显示
        $('.categorys .subcates li,.categorys .relcates li,#bigFocusSlider .slide-items li a,.madeIn .madeIn_imglist li, .wrap_xin_pin ul li').each(function(){
            var srcs = $(this).find('img').attr("src");
            var original = $(this).find('img').attr("original");
            srcs = original;
            $(this).find('img').attr("src",srcs)
            $(this).find('img').attr("original","")
        })
    });
    /*通栏倒计时*/
    /*  YM.page.header.cut =function(){
            var dd=new Date().format('mmddhh')
            if(dd>='111316'){ $('.head-topline').css('background','url(http://img13.yesmyimg.com/images/event/2015/11/cuthour.jpg) center top')}
            var hour=111324-dd
            $('.hour').append(hour)
      };  */      
})(jQuery);