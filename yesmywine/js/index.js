$(function(){
	//替换用户名
	if($.cookie("zhuce")){
		var phonenum=$.cookie("zhuce").split(";")[0].split("=")[1];
		$(".headerbarleft").find("p").html("您好，"+phonenum);
		$(".headerbarleft").find(".denglu").html("消息");
		$(".headerbarleft").find(".zhuce").html("退出");
		
	}
	$(".zhuce").click(function(e){
		var e=e||event;
		if($(".headerbarleft").find(".zhuce").html()=="退出"){
		e.defaultPrevented;
		
		$.cookie("zhuce","");
		$(".headerbarleft").find("p").html("<span>9310901</span>位会员的选择");
		$(".headerbarleft").find(".denglu").html("登录");
		$(".headerbarleft").find(".zhuce").html("注册");
		}
		
	})
	
});
$(function(){
	//尾部标签收起
	$(".hiddenlink").click(function(e){
		var e=e||event;
		e.preventDefault();
		if($(".visiblewhite").css("height")=="40px"){
			$(".visiblewhite").css("height","20px").css("overflow","hidden");
			$(".whitealter").css("border","0");
			$(".hiddenlink").css("background-position","-160px -175px");
		}
		else if($(".visiblewhite").css("height")=="20px"){
			$(".visiblewhite").css("height","40px");
			$(".whitealter").css("border-bottom","1px dashed #dcdcdc");
			$(".hiddenlink").css("background-position","-160px -184px");
		}
	})
});
$(function(){
	$(".bigul li").hover(function(){
		$(this).find("div,ul").css("display","block");
		$(this).find("em").css("display","block");
	},function(){
		$(this).find("div,ul").css("display","none");
		$(this).find("em").css("display","none");
	})
});
$(function(){
	$(".searchdiv").children("input").focus(function(){
		$(this).css("border-color","#e0b466");
		$(this).attr("value","");
	});
	$(".searchdiv").children("input").blur(function(){
		$(this).css("border-color","#dcd3cf");
		$(this).attr("value","输入您要查找的商品名称");
	})
});
//二级菜单
$(function(){
	$(".secondnav").mouseenter(function(e){
		$(".secondnav .subnav").css("display","block");
	});
	$(".secondnav").mouseleave(function(e){
		$(".secondnav .subnav").css("display","none");
	});
	$(".grape").mouseenter(function(e){
		$(this).css("background","#624b40");
		$(this).children(".thirdnav").stop(true,true).animate({left:200,opacity:1},500);
		
	});
	$(".grape").mouseleave(function(e){
		
		$(this).css("background","#73584a");
		$(this).children(".thirdnav").css("left","170px").stop(true,true).css("opacity",0);
	});
});
//大轮播图
$(function(){
	var index=0;
	function move(){
		$(".navimg").attr("src","images/indeximg/nav"+(index%10+1)+".jpg");
		$(".picsindex li").eq(index%10).addClass("picsactive").siblings().removeClass("picsactive");
		index++;
	}
	var timer=setInterval(move,2000);
	$(".navimg").mouseenter(function(){
		clearInterval(timer);
		$(this).stop().animate({"width":"1000px","height":"430px","left":-15,"top":-15},2000);
	});
	$(".navimg").mouseleave(function(){
		timer=setInterval(move,2000);
		$(this).stop().animate({"width":"950px","height":"400px","left":0,"top":0},2000);
	});
	$(".picsindex li").hover(function(e){
		var e=e||event;
		e.stopPropagation();
		clearInterval(timer);
		$(this).addClass("picsactive").siblings().removeClass("picsactive");
		index=$(this).html();
		$(".navimg").attr("src","images/indeximg/nav"+index+".jpg");
	},function(e){
		var e=e||event;
		e.stopPropagation();
		timer=setInterval(move,2000);
	})
});
//选项卡
$(function(){
	$(".minlistnav>li").mouseover(function(){
		$(this).addClass("minactive").siblings().removeClass("minactive");
		$(".minlistnav li ul").css("display","none");
		$(this).find("ul").css("display","block");
	});
	
});
//倒计时
	function lxfEndtime(){
		$(".timer").each(function(){
                var lxfday=$(this).attr("lxfday");//用来判断是否显示天数的变量
                var endtime = new Date($(this).attr("endtime")).getTime();//取结束日期(毫秒值)
                var nowtime = new Date().getTime();        //今天的日期(毫秒值)
                var youtime = endtime-nowtime;//还有多久(毫秒值)
                var seconds = youtime/1000;
                var minutes = Math.floor(seconds/60);
                var hours = Math.floor(minutes/60);
                var days = Math.floor(hours/24);
                var CDay= days;
                var CHour= hours;
                var CMinute= minutes % 60;
                var CSecond= Math.floor(seconds%60);
                if(endtime<=nowtime){
                        $(this).html("已过期")
                        }else{
							$(this).html("还剩"+"<span>"+CHour+"</span>"+"小时"+"<span>"+CMinute+"</span>"+"分"+"<span>"+CSecond+"</span>"+"秒");  
                              
                        }
       	});
   setTimeout(lxfEndtime,1000);
  };
$(function(){
      lxfEndtime();
   });
//酒图轮播
$(function(){
	var currentindex=1;
	$(".mlrnav>li").hover(function(){
		$(this).addClass("liactive").siblings().removeClass("liactive");
		currentindex=$(this).attr("index");
		$(".wineslist").stop().animate({"top":-355*(currentindex-1)},500);
	},function(){

	});
	$(".onewine").hover(function(){
		$(this).css("border","1px solid #e6e7e2").css("box-shadow","3px 3px 3px #ccc");
	},function(){
		$(this).css("border","0").css("box-shadow","")
	})
});
//品牌馆
$(function(){
	$(".brandpics ul li").hover(function(){
		$(":animated").stop();
		$(this).animate({width:360},500).siblings().animate({width:118},500);
	},function(){
		//$(this).css("width","360px");
	})
})

//品牌馆小图
$(function(){
	$(".brandbottom").find("img").hover(function(){
		$(this).stop().animate({left:-77},300).siblings().stop();
	},function(){
		$(this).stop().animate({left:0},300).siblings().stop();
	})
});
//酒友品鉴
$(function(){
	var nowleft=0;
	var changenum=0;
	var index=1;
	$(".changespan b").click(function(){
		changenum=parseInt($(".changespan .one").html());
		if(changenum<=11&&changenum>1){
			index--;
			nowleft=parseInt($(".sumul").css("left"));
		    $(".changespan .one").html(index);
			$(".sumul").animate({left:nowleft+950});
			
		} else{
			return false;
		}
		
	});
	$(".changespan b").hover(function(){
		$(this).css("background-position","-193 -66");
	},function(){
		$(this).css("background-position","-130 -75");
	});
	$(".changespan em").click(function(){
		changenum=parseInt($(".changespan .one").html());
		console.log(changenum);
		if(changenum<11&&changenum>=1){
			index++;
			nowleft=parseInt($(".sumul").css("left"));
			$(".changespan .one").html(index);
			$(".sumul").animate({left:nowleft-950});
		}
		
	})
	$(".changespan em").hover(function(){
		$(this).css("background-position","-193 -48");
	},function(){
		$(this).css("background-position","-158 -75");
	})
});
//轮播图
$(function(){
	var index=0;
	function changepic(){
		index++;
		if(index==5){
			$(".bigpics").css("left",0);
			index=0;
		} else{
			$(".bigpics").animate({left:(index%5)*(-760)});
			$(".piclabel li").eq(index).addClass("activeli").siblings().removeClass("activeli");
		}
		
	}
	var timer=setInterval(changepic,1500);
});
$(function(){
	$(".onewine").click(function(){
		var etime=$(this).find(".timer").attr("endtime");
		
		var img="../"+$(this).find(".onepic img").attr("src");
		var winename=$(this).find(".tips h3 a").html();
		var _price=$(this).find(".tips span").html().split("￥")[1];
		//console.log(etime);
		$.cookie("onetip","endtime="+etime+";img="+img+";winename="+winename+";price="+_price,{path:'/'})
		location.href="html/productdetail.html";
	})
});
