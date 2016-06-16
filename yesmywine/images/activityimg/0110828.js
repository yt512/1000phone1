YM.namespace('YM.page.special'); 
	YM.page.special.init = function() {			
		this.inittocart();
		this.init_tt();
		this.drag();
		this.bottomSlide();
		this.tab();
		this.drag2();
		this.rank();
	};  //函数调用

	//快速购物车
YM.page.special.inittocart=function(){
		//购物车
    $('.btn-buy,.btn_buy').live('click',function() {
    	$(this).attr({title:'立即购买',rel:'nofollow'});
		var goodsId = this.href.getFileName().replace('.html','');
		YM.page.cart.addGoodsToCart(goodsId, 1);
		return false;
	});
	$('.btn-buy').bind('click',function(){
		var img = $(this).parent().find('img');
		var flyElm = img.clone().css('opacity', 0.75);
		var goodsId = this.href.getFileName().replace('.html','');
		$('body').append(flyElm);
		flyElm.css({
			'z-index': 9000,
			'display': 'block',
			'position': 'absolute',
			'top': img.offset().top +'px',
			'left': img.offset().left +'px',
			'width': img.width() +'px',
			'height': img.height() +'px'
		});
		flyElm.animate({
			top: $('.head-shopcart').offset().top,
			left: $('.head-shopcart').offset().left+10,
			width: 20,
			height: 32
		}, 'slow', function() {
			flyElm.remove();
		});
	}); 
	$('.btn_buy').bind('click',function(){
		var img = $(this).parent().parent().find('img');
		var flyElm = img.clone().css('opacity', 0.75);
		var goodsId = this.href.getFileName().replace('.html','');
		$('body').append(flyElm);
		flyElm.css({
			'z-index': 9000,
			'display': 'block',
			'position': 'absolute',
			'top': img.offset().top +'px',
			'left': img.offset().left +'px',
			'width': img.width() +'px',
			'height': img.height() +'px'
		});
		flyElm.animate({
			top: $('.head-shopcart').offset().top,
			left: $('.head-shopcart').offset().left+10,
			width: 20,
			height: 32
		}, 'slow', function() {
			flyElm.remove();
		});
	}); 

};

//悬浮
YM.page.special.drag=function(){
	var floatTool = {};
		floatTool._move = false;
		floatTool.ismove = false;
		floatTool._x;
		floatTool._y;
		floatTool.moveBox = $('#floatTool2'); //整体悬浮框
		floatTool.drag = $('#floatTool2 .move'); //可拖动部分
		floatTool.defaultTop = (window.screen.height - floatTool.moveBox.height())/2-100; //默认顶部保持上下居中，再往上去200像素
	$(window).scroll(function(){
		var offsetTop = floatTool.defaultTop + $(window).scrollTop()+'px';
		floatTool.moveBox.animate({top:offsetTop},{
			duration: 600,
   			queue: false
   		});						  
	});
	//拖动
	floatTool.drag.mousedown(function (e) {
        floatTool._move = true;
        floatTool._x = e.pageX - parseInt(floatTool.moveBox.css("left"));
        floatTool._y = e.pageY - parseInt(floatTool.moveBox.css("top"));
    });
    $(document).mousemove(function (e) {
        if (floatTool._move) {
        	var x = e.pageX - floatTool._x;
            var y = e.pageY - floatTool._y;
            var wx = $(window).width() - floatTool.moveBox.width();
            var dy = $(document).height() - floatTool.moveBox.height();
            if(x >= 0 && x <= wx && y > 0 && y <= dy) {
                floatTool.moveBox.css({
                    top: y,
                    left: x
                });
            	floatTool.ismove = true;
            }
        }
    }).mouseup(function () {
        floatTool._move = false;
    });
}

//悬浮
YM.page.special.drag2=function(){
	var floatTool = {};
		floatTool._move = false;
		floatTool.ismove = false;
		floatTool._x;
		floatTool._y;
		floatTool.moveBox = $('#floatTool1'); //整体悬浮框
		floatTool.drag = $('#floatTool1 .move'); //可拖动部分
		floatTool.defaultTop = (window.screen.height - floatTool.moveBox.height())/2-100; //默认顶部保持上下居中，再往上去200像素
	$(window).scroll(function(){
		var offsetTop = floatTool.defaultTop + $(window).scrollTop()+'px';
		floatTool.moveBox.animate({top:offsetTop},{
			duration: 600,
   			queue: false
   		});						  
	});
	//拖动
	floatTool.drag.mousedown(function (e) {
        floatTool._move = true;
        floatTool._x = e.pageX - parseInt(floatTool.moveBox.css("left"));
        floatTool._y = e.pageY - parseInt(floatTool.moveBox.css("top"));
    });
    $(document).mousemove(function (e) {
        if (floatTool._move) {
        	var x = e.pageX - floatTool._x;
            var y = e.pageY - floatTool._y;
            var wx = $(window).width() - floatTool.moveBox.width();
            var dy = $(document).height() - floatTool.moveBox.height();
            if(x >= 0 && x <= wx && y > 0 && y <= dy) {
                floatTool.moveBox.css({
                    top: y,
                    left: x
                });
            	floatTool.ismove = true;
            }
        }
    }).mouseup(function () {
        floatTool._move = false;
    });
}

YM.page.special.init_tt=function(){

	
	
	$("img").scrollLoading();
	$('.subject-title').prepend('<h1></h1><h3></h3><h4></h4>')
	$('.subject-title h2').prepend('<a class="ruler" href="javascript:void(0)"></a>')
	$('.ruler').click( function(){
		YM.page.dialog.ajax({title:'活动规则', url:'http://www.yesmywine.com/inc2/section/content.jsp?key=RULE_0110828', width:800, height:300});
		return false;
	});	

	$('#section1').insertAfter('#area2 #focus')
	$('#section2').insertAfter('#area7 .prod')
	$('#section3').insertAfter('#area7')
	$('#section4').insertAfter('#section3')
	$('#section5').insertAfter('#section4')
	$('#section6').appendTo('.showCon')
	$('#section7').insertAfter('#section6')

	$('#section8').insertAfter('#area5 .prod2')
	$('#section9').insertAfter('#area5 .prod3')
	$('#section10').insertAfter('#area5 .prod4')
	// var a = new Array(1, 2, 3, 4, 5);

	// var arr = new Array('http://list.yesmywine.com/z2-e9/?dts=IL1.7.0','http://list.yesmywine.com/z2-e6/?dts=ILP1.7','http://list.yesmywine.com/z2-e12/?dts=ILP1.20','http://list.yesmywine.com/z2-e10/?dts=ILP1.18','http://list.yesmywine.com/z2-c6/?dts=ILP1.23','http://list.yesmywine.com/z1-h1?q=6支')
	// var i = 0;
	// $('#section2,#section3,#section4,#section5,#section6,#section7').each(function(){
	// 	$(this).prepend('<a class="more" href="'+arr[i]+'" target="_blank"></a>')
	// 	i++;
	// })

}


YM.page.special.bottomSlide = function(){
  	$('.slide').addClass('e-imageload').bindYMUI('SlideByPage',{ pagesize:1, items:'ul', unitwidth:960, autoslide:true, delay:10, callback:function(elms) { elms.bindYMUI('LoadChildImage'); }}); 
  	};



YM.page.special.tab=function(){
	$(".tab li .a_w").addClass('active');
	$('.tab li').mouseover( function(){
		var index=$(this).index()
		$('.showCon .section').hide().eq(index).show()
		$('.tab li a').removeClass('active').eq(index).addClass('active')
		})

}

	//排行榜
YM.page.special.rank=function(){
					YM.dataproxy.getJSON('http://www.yesmywine.com/marketing/getOrderTopV2.jspa?code=201606068zhounin&type=0&_='+new Date().getTime(), function(d){
						$('#rank ul').html('');
					//var $str = "<li><span class='no'>第1名</span><span class='name'>tes63.com</span><span class='sale'>4354元</span></li><li><span class='no'>第2名</span><span class='name'>tes.com</span><span class='sale'>434元</span></li><li><span class='no'>第3名</span><span class='name'>test@</span><span class='sale'>43254元</span></li><li><span class='no'>第4名</span><span class='name'>tes.com</span><span class='sale'>434元</span></li><li><span class='no'>第5名</span><span class='name'>tes.com</span><span class='sale'>434元</span></li>";
//					$('#rank ul').append($str);
					var s = 0;
/*					var arr = new Array();
					for (var i=0; i<d.result.length; i++) { 
					
						arr.push(new Line(d.result[i].NAME,d.result[i].AMOUNT));					
					}
					arr.push(new Line(' 残照大叔 ',106890)); 
					arr.push(new Line('以梦为马',148912)); 
					arr.push(new Line('Sunshine℃',131580)); 
					
					arr.sort(function(a,b){return a.amount<b.amount?1:-1});//从大到小排序*/
					//alert(d.length);
					
					if (d.result && d.result.length>0) {
						var tmpl ='';
						//$('#rank ul').prepend('<li style="border:none"><span class"no">排名</span><span class="name">会员</span><span class="sale">总消费</span></li>')

						for (var i=0; i<d.result.length; i++) {
							s++
							if(i>=3){return};
							//$('#rank ul').append('<li><span class="no">'+s+'</span><span class="name" title="'+arr[i].name+'">'+arr[i].name+'</span><span class="sale">'+arr[i].amount+'元</span></li>');
							$('#rank ul').append('<li>最新战报:<span class="name" title="'+d.result[i].NAME+'">'+d.result[i].NAME+'</span> <span class="sale">'+d.result[i].AMOUNT+'元</span></li>');
						  };

					}else {
						    $('#rank ul').html('暂无记录');
							 }
					
				});
};



//领券
$('#lq1').click(function() {					
	YM.login.pop(function() {
		showRandWin('我要领券', function(rand) {
			YM.dataproxy.getJSON(YM.login.servicePath +'marketing/lottery-lottery.jspa?code=8zhounianqin10&rand='+ rand, function(d) {
					YM.page.closeDialog();
					if (d.op=='succ') {
						YM.page.alert(d.msg);
					} else {							
						YM.page.alert(d.msg);
					}						
				});
			});
		});
		return false;
	});
	var showRandWin = function(title, callback) {
	YM.page.dialog({ title:title, content:randTmpl.format(new Date().getTime(), title), width:500, height:180, callback:function() {
	var randElm = YM.util.dialog.container.find('input.txt-rand');
	YM.util.dialog.container.find('.btn-refreshrand').click(function() {
		$(this).prev().attr('src', 'http://www.yesmywine.com/random/rand.jspa?'+ new Date().getTime());
		return false;
	});
	YM.util.dialog.container.find('.btn-postrand').click(function() {
		if (randElm.val().trim()=='') {
			randElm.focus();
			return false;
		}
		callback(randElm.val().trim());
			return false;
		});
	}});
};

$('#lq2').click(function() {					
						YM.login.pop(function() {
							showRandWin('我要领券', function(rand) {
								YM.dataproxy.getJSON(YM.login.servicePath +'marketing/lottery-lottery.jspa?code=8zhounianqin300&rand='+ rand, function(d) {
									YM.page.closeDialog();
									if (d.op=='succ') {
										YM.page.alert(d.msg);
									} else {							
										YM.page.alert(d.msg);
									}						
								});
							});
						});
						return false;
		});
	var showRandWin = function(title, callback) {
	YM.page.dialog({ title:title, content:randTmpl.format(new Date().getTime(), title), width:500, height:180, callback:function() {
	var randElm = YM.util.dialog.container.find('input.txt-rand');
	YM.util.dialog.container.find('.btn-refreshrand').click(function() {
		$(this).prev().attr('src', 'http://www.yesmywine.com/random/rand.jspa?'+ new Date().getTime());
		return false;
	});
	YM.util.dialog.container.find('.btn-postrand').click(function() {
		if (randElm.val().trim()=='') {
			randElm.focus();
			return false;
		}
		callback(randElm.val().trim());
			return false;
		});
	}});
};

$('#lq3').click(function() {					
						YM.login.pop(function() {
							showRandWin('我要领券', function(rand) {
								YM.dataproxy.getJSON(YM.login.servicePath +'marketing/lottery-lottery.jspa?code=8zhounianqin50&rand='+ rand, function(d) {
									YM.page.closeDialog();
									if (d.op=='succ') {
										YM.page.alert(d.msg);
									} else {							
										YM.page.alert(d.msg);
									}						
								});
							});
						});
						return false;
		});
	var showRandWin = function(title, callback) {
	YM.page.dialog({ title:title, content:randTmpl.format(new Date().getTime(), title), width:500, height:180, callback:function() {
	var randElm = YM.util.dialog.container.find('input.txt-rand');
	YM.util.dialog.container.find('.btn-refreshrand').click(function() {
		$(this).prev().attr('src', 'http://www.yesmywine.com/random/rand.jspa?'+ new Date().getTime());
		return false;
	});
	YM.util.dialog.container.find('.btn-postrand').click(function() {
		if (randElm.val().trim()=='') {
			randElm.focus();
			return false;
		}
		callback(randElm.val().trim());
			return false;
		});
	}});
};


$('#lq4').click(function() {					
						YM.login.pop(function() {
							showRandWin('我要领券', function(rand) {
								YM.dataproxy.getJSON(YM.login.servicePath +'marketing/lottery-lottery.jspa?code=8zhounianqin100&rand='+ rand, function(d) {
									YM.page.closeDialog();
									if (d.op=='succ') {
										YM.page.alert(d.msg);
									} else {							
										YM.page.alert(d.msg);
									}						
								});
							});
						});
						return false;
		});
	var showRandWin = function(title, callback) {
	YM.page.dialog({ title:title, content:randTmpl.format(new Date().getTime(), title), width:500, height:180, callback:function() {
	var randElm = YM.util.dialog.container.find('input.txt-rand');
	YM.util.dialog.container.find('.btn-refreshrand').click(function() {
		$(this).prev().attr('src', 'http://www.yesmywine.com/random/rand.jspa?'+ new Date().getTime());
		return false;
	});
	YM.util.dialog.container.find('.btn-postrand').click(function() {
		if (randElm.val().trim()=='') {
			randElm.focus();
			return false;
		}
		callback(randElm.val().trim());
			return false;
		});
	}});
};


var randTmpl = [
	'<div class="p20"><div style="padding:10px 30px;font-size:14px;line-height:20px;">',
	'<p class="mb10" style="color:#333;">为了维护您的会员权益，防止恶意作弊，<br/>请先输入验证码</p>',
	'<p class="mb10">',
	'<input type="text" class="txt-rand" style="height:20px;line-height:20px;border:solid 1px #ccc;width:120px;" />',
	'<img src="http://www.yesmywine.com/random/rand.jspa?{0}" width="85" height="20" align="absmiddle" style="margin:0 10px;" alt="验证码" />',
	'<a href="#" class="btn-refreshrand" style="color:#06c;font-size:12px;">看不清，换一张</a>',
	'</p>',
	'<p><a href="#" class="btn btn-action btn-postrand"><em>{1}</em></a></p>',
	'</div></div>'
].join(''); 



YM.page.special.init();