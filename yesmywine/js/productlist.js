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
})
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