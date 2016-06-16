(function($) {
	YM.namespace('YM.page.subject');
	YM.page.subject.init = function() {
		this.initCustomInfo();
		this.foramtProdInfo();
		this.fastbuyfly();
		this.countdown();
		if (typeof(updateYMWSubjectData)!='undefined') {
			updateYMWSubjectData();
		}
	};
	YM.page.subject.initCustomInfo = function() {
		$('#customGoodIntro div.prod-intro').each(function() {
			var goodsId = $(this).attr('goodsId');
			$('#good'+goodsId).addClass('keypro-big').append($(this));
		});
		$('#customSectionMoreLink a').each(function() {
			var sectionId = $(this).attr('sectionId');
			$('#section'+sectionId+' h3').append($(this));
		});
		$('#customGoodIcons label').each(function() {
			var goodsId = $(this).attr('goodsId');
			$('#good'+goodsId+' a.prod-img label').remove();
			$('#good'+goodsId+' a.prod-img').append($(this));
		});
		$('#customGoodIcons ins').each(function() {
			var goodsId = $(this).attr('goodsId');
			$('#good'+goodsId+' a.prod-img span.promo-icon').append($(this));
		});
		var cssData = { '减':'jian', '赠':'zeng', '折':'zhe', '清':'qing', '免':'mian', '抢':'qiang', '聚':'ju', '秒':'miao', '新':'xin', '特':'te', '拍':'pai', '返':'fan', '换':'huan', '神':'shen' };
		$('span.promo-icon').each(function() {
			var prodElm = $(this).parent().parent();
			var icons = ($(this).attr('icons')||'').split(',');
			icons.pop();
			for (var i=0; i<icons.length; i++) 	{
				if (icons[i]!='' && cssData[icons[i]]) {
					var c = cssData[icons[i]];
					if ($(this).find('ins.'+c).size()==0) {
						if (c == 'zhe') {
							var minprice = prodElm.find('.minprice strong').text().replace('¥', '').replace('￥',''), maxprice = prodElm.find('.maxprice del').text().replace('¥', '').replace('￥','');
							if (minprice>0 && maxprice>0) {
								var discount = (minprice * 10 / maxprice).toFixed(1);
								$(this).append('<ins><em>'+ discount +'</em>折</ins>');
							}
						} else {
							$(this).append('<ins class="'+ c +'"></ins>');
						}
					}
				}
			}
		});
	};
	YM.page.subject.foramtProdInfo = function() {
		$('.section .prod-note').each(function() {
			$(this).attr('title', $(this).text());
		});
		$('.section li .minprice strong').each(function() {
			$(this).html($(this).text().sliceBefore('.'));
		});
	};
	YM.page.subject.initClickStat = function() {
		if (typeof(m_dataId)=='undefined') return;
		$.getJSON('/topic/click.jspa', { dataId:m_dataId, _:new Date().getTime() }, function(d) {});
	};
	YM.page.subject.fastbuyfly=function(){
		$('.btn-buy').click(function(){
        var img = $(this).parents('li').find('img').eq(0);    
        var flyElm = img.clone().css('opacity', 0.75);
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
		//倒计时
		YM.page.subject.countdown = function() {
			$('.prod-countdown').bindYMUI('CountDown');	
		}
	YM.page.subject.init();
})(jQuery);