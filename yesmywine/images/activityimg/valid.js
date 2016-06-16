// ******************************
// 表单验证方法集合
// ******************************
(function($) {
	//--------------------
	YM.namespace('YM.valid');
	//--------------------
	// 判断是否有效的密码
	YM.valid.isLogPass = function(str) {
		return (str.length>=6 && str.length<=16 && YM.valid.isAlphanumeric(str));
	};
	//--------------------
	YM.namespace('YM.ui');
	//--------------------
	// 增加表单验证项
	YM.ui.validFormElement = function(elm, params) {
		elm.data('validParam', params);
		switch(elm.tagName()) {
			case 'textarea':
			case 'input':
				elm.blur(function() {
					var element = $(this);
					var params = $(this).data('validParam');
					var val = element.val().trim();
					if (params.premise) {
						// 判断前提
						if (!params.premise()) return;
					}
					var emptyChar = params.emptyChar || '';
					if (params.validEmpty && (val==emptyChar || val=='')) {
						element.bindYMUI('ShowErrorString', params.emptyError);
						element.data('error', true);
					} else if (val==emptyChar || val=='') {
						element.bindYMUI('ShowErrorString');
						element.data('error', false);
					} else if (params.validMethod && !YM.valid[('is-'+params.validMethod).toCamelCase()](val, params.methodParam)) {
						element.bindYMUI('ShowErrorString', params.methodError);
						element.data('error', true);
						if (params.methodCallback) params.methodCallback();
					} else if (params.validRegex && !params.validRegex.test(val)) {
						element.bindYMUI('ShowErrorString', params.regexError);
						element.data('error', true);
						if (params.regexCallback) params.regexCallback();
					} else if (params.validCompare && val!=params.validCompare.val().trim()) {
						element.bindYMUI('ShowErrorString', params.compareError);
						element.data('error', true);
						if (params.compareCallback) params.compareCallback();
					} else if (params.validAjax) {
						var url = element.attr('data-validAjaxAPI') + encodeURIComponent(val);
						$.getJSON(url, function(d) {
							var msg = params.validAjax(element, d);
							if (msg) {
								element.bindYMUI('ShowErrorString', msg);
								element.data('error', true);
							}
						});
						element.bindYMUI('ShowErrorString');
						element.data('error', false);
					} else {
						element.bindYMUI('ShowErrorString');
						element.data('error', false);
					}
					element.data('valid', true);
				});
				break;
			case 'select':
				elm.change(function() {
					$(this).bindYMUI('validSelection');
				});
				break;
		}
	};
	YM.ui.ShowErrorString = function(elm, str) {
		elm.each(function() {
			var errSibling = ($(this).attr('errorScope')=='parent')?$(this).parent():$(this);
			var errElm = errSibling.siblings('span.error');
			if (errElm.size()==0) {
				errElm = $('<span class="error"></span>');
				errSibling.after(errElm);
			}
			errElm.html(str||'').addClass('hidden');
			if (str) {
				errElm.removeClass('hidden');
				$(this).data('error', true);
			} else {
			//	errElm.removeClass('hidden');
				$(this).data('error', false);
			}
		});
	};
	YM.ui.validSelection = function(element) {
		var params = element.data('validParam');
		var val = element.val().trim();
		var emptyChar = params.emptyChar || '';
		if (params.validEmpty && val==emptyChar) {
			element.bindYMUI('ShowErrorString', params.emptyError);
			element.data('error', true);
		} else if (params.validItems && params.validItems.indexOf(val)>=0) {
			element.bindYMUI('ShowErrorString', params.itemsError);
			element.data('error', true);
		} else {
			element.bindYMUI('ShowErrorString');
			element.data('error', false);
		}
		element.data('valid', true);
	};
	//--------------------
	YM.namespace('YM.data');
	//--------------------
	YM.data.checkElementsInvalid = function(element) {
		var elements = $(element);
		if (elements.size()>0) {
			for (var j=0; j<elements.size(); j++) {
				var elm = elements.eq(j);
				if (!elm.data('valid')) {
					if (elm.tagName()=='select') {
						elm.bindYMUI('validSelection');
					} else {
						elm.blur();
					}
				}
				if (elm.data('error')) {
					if (elm.tagName()=='input' || elm.tagName()=='textarea') elm.focus();
					return true;
				}
			}
		}
		return false;
	};
	YM.data.checkElementIsEmpty = function(element, errorText, isParent) {
		var elm = $(element);
		if (elm.size()==0) return false;
		if (elm.val().trim()=='') {
			if (isParent) {
				elm.parent().bindYMUI('ShowErrorString', errorText);
			} else {
				elm.bindYMUI('ShowErrorString', errorText);
			}
			if (elm.tagName()=='input') elm.focus();
			return true;
		}
		return false;
	};
	//--------------------
})(jQuery);