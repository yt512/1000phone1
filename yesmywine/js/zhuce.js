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
	$("input").focus(function(){		
		$(this).css("border","1px solid blue");
	})	
	$("input").blur(function(){//失去焦点；
		$(this).css("border","1px solid #dfdfdf");//边框变色；
	});	
	$("#phone").change(function(){//文本框的值改变调用函数而不是失去焦点；若用blur，只有文本框激活，无论   				 									是否操作，只有失去焦点，就会调用函数；
		//用户名
		var $phone=$("#phone").val();
		var reg=/^1\d{10}$/;
		if(reg.test($phone)){
			return;
		}
		else{
			//alert("手机号格式不正确!");
			var toast0=new Toast();
			toast0.show("手机号格式不正确",2000);
			$(this).val("");
		}
	});	
	//短信验证码；
	$("#message_check").change(function(){
		var $message_check=$("#message_check").val();
		var reg=/^\d\d{3}$/;
		if(reg.test($message_check)){
			return;	
		}
		else{
			//alert("验证码格式不正确！");
			var toast0=new Toast();
			toast0.show("验证码不正确",2000);
			$(this).val("");
		}
	});	
	
	//获取验证码；
	var str;
	$("#check_id").click(function(){
		//alert("sd");
		//显示图片；
		var arr = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z");
		str="";
		for(var i=0;i<4;i++){
			//alert("for");
			var index=Math.floor(Math.random()*arr.length);//把random出来的数，当作arr的下标
			str=str+arr[index]	
		
			//随机出$arr中任意四位并把和其下标对应的图片显示到<span></span>中；
			//index=0~9;对应图片0~9.png；index=10~52;对应图片1_2~1_53.jpg;
			if(index<=9){//alert(index);
				$("#img0"+(i+1))[0].src='../images/zhuceimg/'+index+'.png';
			}//<img id="img01" src="img/0.png"/>
			else{//alert(index);
				//alert($("#img0"+(i+1))[0]);//注意Jquery与DOM对象的转换；
				$("#img0"+(i+1))[0].src='../images/zhuceimg/1_'+(index-8)+'.jpg';
			}	
		}
		
	}).trigger("click");//验证码需要一加载/刷新随机显示；故需要用事件模拟trigger("click")；
		
	$("#check_num").change(function(){
		var newstr=str.toLowerCase();
		var $check_num=$("#check_num").val().toLowerCase();	
		if(newstr==$check_num){
			//alert("验证成功！");	
			var toast=new Toast();
			toast.show("验证成功");
		}
		else {
			//alert("验证码错误！")	
			var toast=new Toast();
			toast.show("验证码错误");
		}
	});
	
		//密码；
	$("#password").change(function(){
		var $password=$("#password").val();
		var reg=/^\w\w{5,15}$/;
		if(reg.test($password)){
			return;	
		}
		else{
			//alert("密码格式不正确！");	
			var toast=new Toast();
			toast.show("密码格式不正确",2000);
			$(this).val("");
		}
	});	
	$("#password1").change(function(){
		var $password=$("#password").val();
		var $password1=$("#password1").val();
		if($password1!=$password){
			//alert("密码不一致！");
			var toast0=new Toast();
			toast0.show("密码不一致",2000);
			$(this).val("");
		}
	});
	$("#submit").click(function(){
		var phonenum=$("#phone").val();
		var pwd=$("#password").val();
		$.cookie("zhuce","phonenum="+phonenum+";password="+pwd+"",{path:'/'});
		console.log($.cookie("zhuce"));
		$(this).prop("href","login.html");
	})
})
