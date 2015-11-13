define(function (require, exports, moudles) {	
	var $  = require('jquery/jquery/1.10.1/jquery');
    $.fn.introM = function(options){			
		var defaultVal ={};
		var opts = $.extend(defaultVal, options);				
		return this.each(function(){
			var container = $(this);
			var imgCont = container.children();				
			var delay = 500;
			imgCont.hover(function(ev){	//鼠标移入		
				var e = ev ||event;
				var _this = $(this);
				var tip = _this.find('.tip');								
				var dir = hoverDir(_this,e);				
				switch(dir){
					case 0: tip.css({'left':_this.width(),'top':0});
					break;
					case 1:tip.css({'left':0,'top':_this.height()});
					break;
					case 2:tip.css({'left':- _this.width(),'top':0});
					break;
					case 3:tip.css({'left':0,'top':-_this.height()});
					break;
				}
				tip.stop().animate({'left':0,'top':0},delay);			
			},function(ev){	//鼠标移出
				var e = ev ||event;
				var _this = $(this);
				var tip = _this.find('.tip');			
				var dir = hoverDir(_this,e);				
				switch(dir){
					case 0: tip.stop().animate({'left':_this.width(),'top':0},delay);
					break;
					case 1:tip.stop().animate({'left':0,'top':_this.height()},delay);
					break;
					case 2:tip.stop().animate({'left':-_this.width(),'top':0},delay);
					break;
					case 3:tip.stop().animate({'left':0,'top':-_this.height()},delay);
					break;
				}
			});
			function hoverDir(obj,oEvent){
				var offset =  obj.offset();
				var w = obj.width()/2 +offset.left; 
				var h = obj.height()/2 + offset.top - $(window).scrollTop();				
				var x = w - oEvent.clientX;
				var y = h - oEvent.clientY;
				return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;
			}
			
		});	
	};
})