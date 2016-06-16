$(function(){
	$.ajax({
		type:"get",
		url:"common/shoppingheader.html",
		async:false,
		success:function(msg){
			$("#header").html(msg);
		}
	});
	$.ajax({
		type:"get",
		url:"common/footershort.html",
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
	s="";
	if($.cookie("onetip")){
		s=s+$.cookie("onetip");
		var img=$.cookie("onetip").split(";")[1].split("=")[1];
		var winename=$.cookie("onetip").split(";")[2].split("=")[1];
		var _price=$.cookie("onetip").split(";")[3].split("=")[1];
		
		var htm="<div class=\'onekindwine\'>"+"<input type=\"checkbox\" />"
		+"<div class=\'kindpic\'><img src=\'"+img+"\'/></div>"
		+"<div class=\'gname\'>"+winename+"</div>"
		+"<div class=\'singleprice\'>"+"￥"+_price+"</div>"
		+"<div class=\'bigbox\'><div class=\'left_btn\'></div><div class=\'center_box\'>"
		+1+"</div><div class=\'right_btn\'></div></div>"
		+"<div class=\'siglesum\'>"+"￥"+_price+"</div>"
		+"<div class=\'remove_btn\' onclick=\'del(this)\'>"+"删除"+"</div>"+"</div>";
		$(".goodcon").html(htm);
	}
});
$(function(){
	$(".onekindwine").find("input").click(function(){
		
		if($(this).prop("checked")){
			$(".sump").find("span").html($(".siglesum").html());
			console.log($(".sump").find("span").html())
			$(".sumcont").find("span").html($(".center_box").html());
			//$(".sendmethod").find("input").attr("checked",true);
			$("input").prop("checked",true);
		} else{
			$(".sump").find("span").html("￥0.0");
			$(".sumcont").find("span").html("0");
			$("input").prop("checked",false);
		}
	});
	var count;
	var oneprice;
	$(".left_btn").click(function(){
		count=parseInt($(".center_box").html());
		oneprice=parseInt($(".singleprice").html().split("￥")[1]);
		if(count>1){
			$(".bigbox").css("background-position","0 -107px");
			count--;
			$(".center_box").html(count);
			$(".siglesum").html("￥"+count*oneprice+".0");
			if($(".onekindwine").find("input").prop("checked")){
				$(".sump").find("span").html("￥"+count*oneprice+".0");
				$(".sumcont").find("span").html(count);
			}
			
		} else{
			$(".bigbox").css("background-position","0 -134px");
		}
	})
	$(".right_btn").click(function(){
		count=parseInt($(".center_box").html());
		oneprice=parseInt($(".singleprice").html().split("￥")[1]);
		if(count>0&&count<=14){
			count++;
			$(".bigbox").css("background-position","0 -107px");
			$(".center_box").html(count);
			$(".siglesum").html("￥"+count*oneprice+".0");
			/*$(".sump").find("span").html("￥"+count*oneprice+".0");
			$(".sumcont").find("span").html(count);*/
			if($(".onekindwine").find("input").prop("checked")){
				$(".sump").find("span").html("￥"+count*oneprice+".0");
				$(".sumcont").find("span").html(count);
			}
			console.log(count);
		} else{
			$(".bigbox").css("background-position","0 -161px");
		}
	})
	
})
function del(t){
	$(t).parent().parent().html("");
}
