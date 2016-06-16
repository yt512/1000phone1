(function($) {
	// 快速登录弹窗时的ajax接口
	var popLoginAPI = '/portal/loginjs.jspa';
	// ----------------------------
	YM.namespace('YM.page.login');
	// ----------------------------
	YM.page.login.init = function() {
		this.initElemEvents();
		this.initFormEvents();
		if ($('.hd-crossdomain').val()=='true') {
			YM.page.setDomain();
		}
	};
	YM.page.login.initElemEvents = function() {
		$('input.txt-user').bindYMUI('InputBGHint', 'hint-user');
		$('input.txt-pass').bindYMUI('InputBGHint', 'hint-password');
		$('input.txt-rand').bindYMUI('InputBGHint', 'hint-rand');
		$('input.txt-user').bindYMUI('validFormElement', {
			validEmpty:false, emptyError:'请输入E-mail地址或手机号',
			validMethod:'log-name', methodError:'请输入正确的E-mail或手机号'
		});
		$('input.txt-pass').bindYMUI('validFormElement', {
			validEmpty:false, emptyError:'请输入密码'
		});
		if($("#login_code").is(":visible")){
			$('input.txt-rand').bindYMUI('validFormElement', {
			validEmpty:false, emptyError:'请输入验证码'
		    });
		};
		$('input.txt-user').attr('autocomplete','off');
		$('button.btn-login').attr('disabled', false);
		$('button.btn-login').bind('disableStatus', function() {
			$(this).attr('disabled', true);
			$(this).addClass('disabled');
			$(this).data('oldvalue', $(this).html());
			$(this).html('正在登录中');
		});
		$('button.btn-login').bind('enableStatus', function() {
			$(this).attr('disabled', false);
			$(this).removeClass('disabled');
			$(this).html($(this).data('oldvalue'));
		});
		if ($('#alipaysubmit').size()>0) {
			if ($('.hd-pagetype').val()=='pop') {
				$('#alipaysubmit, a.btn-login-weibo').attr('target', '_blank');
			}
			$('a.btn-login-alipay').click(function() {
				$('#alipaysubmit').submit();
				return false;
			});
		} else {
			$('a.btn-login-alipay').hide();
		}
		$('img.rand-img').click(function() {
			this.src = '/random/rand.jspa?_'+ new Date().getTime();
		});
		$('img.rand-img').click();
		$('a.btn-refreshrand').click(function() {
			$('img.rand-img').click();
			return false;
		});
	};
	YM.page.login.initFormEvents = function() {
		$(".mod-login2").css({"opacity":"1"},function(){
			$(".mod-login").addClass('mod-login-bg');
		}).show();

		$('form.frm-login').bind('submitAjaxLogin', function() {
			$.ajax({ url:popLoginAPI, data:$(this).serialize(), dataType:'json', type:'post', success:function(data) {
				if (data.flag == 1) {
					YM.page.login.ajaxLoginSuccess();
				} else {
					if(data.msg=="账号或密码错误"){
						$('input.txt-user').bindYMUI('ShowErrorString', data.msg);
					}else{
						$('input.txt-rand').val('');
						$('input.txt-rand').bindYMUI('ShowErrorString', data.msg);
					}
					if(data.flag==-2){						
						$("#login_code").show();
						$('input.txt-rand').bindYMUI('validFormElement', {
						validEmpty:false, emptyError:'请输入验证码'
						});
					}
					$('button.txt-user').data('error', false);
					$('button.btn-login').trigger('enableStatus');
					$('img.rand-img').click();
				}
			}});
		});
		$('form.frm-login').submit(function() {
			if (YM.data.checkElementsInvalid('input.txt-user, input.txt-pass, input.txt-rand')) return false;
			if ($('.hd-pagetype').val()=='pop') {
				$('button.btn-login').trigger('disableStatus');
				$(this).trigger('submitAjaxLogin');
				return false;
			}
			$('button.btn-login').trigger('disableStatus');
			return true;
		});
	};
	YM.page.login.ajaxLoginSuccess = function() {
		var to = $('input.hd-to').val();
		if (to != '' && to.indexOf("jsessionid") == -1) {
			document.location.href = to;
		} else if (parent.YM && parent.YM.login && parent.YM.login.status) {
			parent.YM.login.success();
		}else{
			parent.YM.login.getUserInfo();
			parent.YM.page.header.hide();
		}
	};

	$(document).ready(function(){ 
		 // 左侧广告位始终居中
		 var $height = $('.box-main').height();
	     var $imgHeight = $('.mod-login-ads img').height();
		 var $mTop = $height - $imgHeight ;
	     $('.mod-login-ads img').css('margin-top',$mTop/2);
	});
	
	$(document).ready(function() {

		YM.page.login.init();
	});
	
	window.onload = function(){
		// 更换qq快捷登陆图片
		 $('#qqLoginBtn img').fadeIn(0);
	 	 $('#qqLoginBtn img').attr('src','http://img10.yesmywine.com/newWeb/css/member/images/btn_qq.gif');
	     
		 //输入框失去焦点，变红
		 $('.txt-input').blur(function(){
				var vl = $(this).val();
				if(vl == ''){
					$(this).removeClass('bd-default').addClass('bd-red');
					return false;
				}else{
					$(this).removeClass('bd-red').addClass('bd-default');
					return true;
				}
				
		 });
		 setTimeout(function(){
		 	$('.txt-input').each(function(){
		     	var vl = $(this).val();
		     	if(vl != ""){
		     		$(this).removeClass('hint-user hint-password');
		     	}
		     });
		 },1500)
		 /*
		 //判断输入邮箱是否合法
		 $('.txt-user').blur(function(){
				if(!$(".txt-user").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)){
					$(this).removeClass('bd-default').addClass('bd-red');
					return false;
				}
		 });
		 
		 $('.txt-user').blur(function(){
				if(!$(".txt-user").val().match(/^(((13[0-9]{1})|159|153)+\d{8})$/)) {
					$(this).removeClass('bd-default').addClass('bd-red');
					return false;
				}
		 });
		 */
	};
})(jQuery);