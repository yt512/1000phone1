$(function(){
	$.ajax({
		type:"get",
		url:"common/header.html",
		async:false,
		success:function(msg){
			$("#header").html(msg);
		}
	});
	$.ajax({
		type:"get",
		url:"common/footer.html",
		async:false,
		success:function(msg){
			$("#footer").html(msg);
		}
	});
});
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
	var et=$.cookie("onetip").split(";")[0].split("=")[1];
	img=$.cookie("onetip").split(";")[1].split("=")[1];
	var winename=$.cookie("onetip").split(";")[2].split("=")[1];
	var _price=$.cookie("onetip").split(";")[3].split("=")[1];
	//console.log(_price);
	$(".tipslist a").html(winename);
	$(".deadlineright").find(".timer").attr("endtime",et);
	$(".midpics img").attr("src",img);
	$(".prodetailright dl dt").html(winename.split("(")[0]);
	$(".onsaleprice").find("span").html("￥"+_price);
})
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
                var CHour= hours-days*24;
                var CMinute= minutes % 60;
                var CSecond= Math.floor(seconds%60);
                if(endtime<=nowtime){
                        $(this).html("已过期")
                        }else{
							$(this).html("剩余"+"<span>"+CDay+"</span>"+"天"+"<span>"+CHour+"</span>"+":"+"<span>"+CMinute+"</span>"+":"+"<span>"+CSecond+"</span>");  
                              
                        }
       	});
   setTimeout(lxfEndtime,1000);
  };
$(function(){
      lxfEndtime();
   });
   $(function(){
   		var index=1;
   		$(".lefticon").click(function(){
   			if(index>1&&index<5){
   				index--;
   				$(".midpics").find("img").attr("src","../images/productdetailimg/mid"+index+".JPG");
   				$(".bigview").find("img").attr("src","../images/productdetailimg/big"+index+".JPG")
   				$(".litpic").eq(index-1).find("img").css("opacity",1);
   				$(".litpic").eq(index-1).siblings().find("img").css("opacity",0.6);
   			}
   		});
   		$(".righticon").click(function(){
   			if(index<4&&index>0){
   				index++;
   				$(".midpics").find("img").attr("src","../images/productdetailimg/mid"+index+".JPG");
   				$(".bigview").find("img").attr("src","../images/productdetailimg/big"+index+".JPG");
   				$(".litpic").eq(index-1).find("img").css("opacity",1);
   				$(".litpic").eq(index-1).siblings().find("img").css("opacity",0.6);
   			}
   		});
   		$(".litpic").hover(function(){
   			$(this).find("img").css("opacity",1);
   			$(this).siblings().find("img").css("opacity",0.6);
   			index=$(this).index();
   			if(index==1){
   				$(".midpics").find("img").attr("src",img);
   				$(".bigview").find("img").attr("src",img);
   			} else{
   				$(".midpics").find("img").attr("src","../images/productdetailimg/mid"+index+".JPG");
   				$(".bigview").find("img").attr("src","../images/productdetailimg/big"+index+".JPG");
   			}
   			
   			
   		},function(){
   			
   		});
   		$(".pics").mouseenter(function(){
   			$(".bigview").css("display","block");
   			$(".pics").mousemove(function(e){
   				var e=e||event;
   				var disX=e.clientX-$(".pics img").offset().left;
   				var disY=e.clientY-$(".pics img").offset().top;
   				$(".bigview img").css("left",-disX/10).css("top",-disY/2-50);
   			})
   		});
   		$(".pics").mouseleave(function(){
   			$(".bigview").css("display","none");
   		});
   });
   $(function(){
   	$(".dis").hover(function(){
   		$(this).css("background-position","-31px -232px");
   	},function(){
   		$(this).css("background-position","0 -232px");
   	});
   	$(".plus").hover(function(){
   		$(this).css("background-position","-47px -232px");
   	},function(){
   		$(this).css("background-position","-15px -232px");
   	});
   	$(".dis").click(function(){
   		var num=parseInt($(".winecount").html());
   		if(parseInt(num)>1){
   			$(".winecount").html(num-1);
   		}
   	});
   	$(".plus").click(function(){
   		var num=parseInt($(".winecount").html());
   		console.log(num);
   		if(num<18){
   			$(".winecount").html(num+1);
   		}
   	});
   });
 $(function(){
 	var _scrolltop=0;
 	$(document).scroll(function(){
 		_scrolltop=$(document).scrollTop();
 		if(_scrolltop>=891){
 			$(".mainchoose").css("position","fixed").css("top",0);
 		} else{
 			$(".mainchoose").css("position","relative");
 		}
 	});
 	$(".mainchoose ul li").click(function(){
 		$(this).addClass("activea").siblings().removeClass("activea");
 	})
 });
 //加入购物车
 $(function(){
 	$(".sale_btn").click(function(){
 		var str=$.cookie("onetip");
 		location.href="shoppingcart.html";
 	})
 })
