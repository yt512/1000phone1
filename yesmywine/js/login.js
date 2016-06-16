$(function(){
	$.ajax({
		type:"get",
		url:"common/headershort.html",
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
	$(".eop").val("");
	$(".pwd").val("");
	var reg=false;
	function checkUsername(str){
		if(/^1[3|5|7|8]\d{9}$/.test(str)||/\w+@\w+(\.\w+)+/.test(str)){
			return true;
		} else{
			return false;
		}
	};
	function checkPassword(str){
		if(str.length<6||str.length>20){
			return false;
		} else{
			if(str=="123456"){
				return true;
			}
		}
	};
	$(".eop").focus(function(){
		$(this).css("background","none");
		$(".error").css("display","none");
	});
	$(".eop").blur(function(){
		if($(this).val()==""){
			$(this).css("background","url(../images/loginimg/hint_logname.gif) no-repeat 5px center");
		} else{
			
			if(!checkUsername($(this).val())){
				$(".error").css("display","inline-block").html("请输入正确的E-mail或手机号");
			} else{
				$(".error").css("display","none");
			}
		}
		
	});
	$(".pwd").focus(function(){
		$(this).css("background","none");
		$(".error").css("display","none");
	});
	$(".pwd").blur(function(){
		if($(this).val()==""){
			$(this).css("background","url(../images/loginimg/hint-password.gif) no-repeat 5px center");
		} else{
			if(checkPassword($(this).val())){
				reg=="true";
			} else{
				$(".error").css("display","inline-block").html("请输入正确的账号和密码");
			}
		}
		
	})
	$(".submitdiv").hover(function(){
		$(this).css("background","url(../images/loginimg/btn_login_hover.gif)");
	},function(){
		$(this).css("background","url(../images/loginimg/btn_login.gif)");
	});
	$(".btn-login").click(function(e){
		if(!reg){
			e.stopPropagation();
			
		} else{
			
			
		}
	})
})
