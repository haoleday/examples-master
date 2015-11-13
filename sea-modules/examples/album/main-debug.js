define(function (require, exports, moudles) {	
	var $  = require('jquery/jquery/1.10.1/jquery');
    $.fn.Album = function(options){
		var defaultOpt = {		
		getPicUrl: '',		//获取图片路径
        imgCount: 0,		//图片总数
        vis: 6,			//小图显示个数
        scroll: 0,		//每次滚动个数
        getDataCount: 0,		//远程获取数据是，获取的数量
        bigBoxE: '.bd ul',		//大图box
		prev:'.prev',
		next:'.next',
		imgIndexE: '.pageState',		//图片导航
        introE: '.intro',		//图片描述
        thumbBoxE: '.hd ul',		//小图box
        thumbPrev: '.hPrev',		//前一个
        thumbNext: '.hNext',		//后一个		
        s_index: 0,			//默认选中的图片
        delayTime: 500,		//运行时间        
        playEven: function (index, id) { }		//回调函数		
		};
		var conf = $.extend({}, defaultOpt, options);
		return this.each(function(){				
			//第一步获取对象			
			var mainObj = $(this);//主元素对象
			var vis = conf.vis;//缩略图可视数量
			var thumbPage = 1;//缩略图滚动页
			var s_index = conf.s_index;//默认选中Index
			var getDataCount = conf.getDataCount;//远程获取数据的时候每次获取的数据量
			var startIndex = 0;//已获取的图片的开始编号
			var endIndex = 0;//已获取的图片的结束编号            
			var scroll = conf.scroll;//每次滚动的数量
			var delayTime = conf.delayTime;//动画延时
			var thumbW = 0, thumbOW = 0, thumbH = 0, thumbOH = 0;
			var thumbBoxObj = $(conf.thumbBoxE, mainObj);
			var bigObj = $(conf.bigBoxE, mainObj);
			var prevObj = $(conf.prev,mainObj);
			var nextObj = $(conf.next,mainObj);
			var imgCount = conf.imgCount;//图片总数
			var maxW = bigObj.width(), maxH = bigObj.height();//大图的最大宽和最大高
			var thumbPrevObj = $(conf.thumbPrev, mainObj);//前按钮
			var thumbNextObj = $(conf.thumbNext, mainObj);//后按钮
			var imgIndexObj = $(conf.imgIndexE, mainObj);//图片导航对象
			var introObj = $(conf.introE, mainObj);//图片描述
			var loadObj = $("#imgloadwrap");//图片显示正在加载			
			var countPage = 0;
			var scale, scale2,bigObjW,bigObjH;
			
			//初始化方法
			var imgInit = function (){	
				if (imgCount == 0)
					imgCount =  bigObj.children().length;
				countPage = Math.ceil(imgCount/scroll);
				if (scroll == 0)
					scroll = vis - 1;
				if (getDataCount == 0)
					getDataCount = scroll;
				//获取开始startIndex /endIndex
				startIndex = s_index; // 
				endIndex = bigObj.children().length -1;	
				//略缩图初始化			
				bigObj.find('img').each(function(i,item){
					thumbBoxObj.append('<li><img src="'+item.src+'" /></li>');	
				});			
				//获取缩略图的宽高			
				thumbBoxObj.children().each(function () { //取最大值
					var cobj = $(this);				
					if (cobj.width() > thumbW) { thumbW = cobj.width(); thumbOW = cobj.outerWidth(true); }
					if (cobj.height() > thumbH) { thumbH = cobj.height(); thumbOH = cobj.outerHeight(true); }
				});
				thumbBoxObj.css('width',thumbOW * bigObj.children().length).children().eq(s_index).addClass('on');
				
				//大图初始化
				bigObj.children().eq(s_index).addClass('on').siblings().removeClass('on');
				bigObjW = bigObj.width();
				bigObjH = $(window).height() - 270;
				bigObj.stop(true,true).animate({'height':bigObjH},'slow');				
				
				//判断大图是不是比浏览器可视宽度还宽				
				if(bigObj.children('.on').find('img').width()> bigObj.parent().width()){
					bigObj.find('img').stop(true,true).animate({'width':bigObj.parent().width()});					
				}
				
				//略缩图图分页				
				vis = Math.floor(thumbBoxObj.parent().width()/thumbOW);
				scroll = vis - 1;
				countPage = Math.ceil(imgCount/scroll);							
				thumbPage = Math.ceil((s_index+1)/scroll);				
				
				//判断是否有包裹层wrap
				if(!thumbBoxObj.parent().hasClass('thumbWrap'))
					thumbBoxObj.wrap('<div class="thumbWrap" style=" position:relative; overflow:hidden; width:'+(thumbBoxObj.parent().width() - 60)+'px;"></div>').css({ "left": -((thumbPage-1) * scroll) * thumbOW, "position": "relative", "padding": "0", "margin": "0" });
				else
					thumbBoxObj.parent().css('width',(thumbBoxObj.parents('.hd').width() - 60));
				
				introObj.text(bigObj.children().eq(s_index).find('img').attr('title'));
				imgIndexObj.html('<span>'+parseInt(s_index+1)+'</span>/'+(parseInt(imgCount)));
					
			}
			imgInit();
			
			window.onresize = function(){
				imgInit();								
				play();
			}
						
			//略缩图滚动
			function thumbPlay(){								
				thumbBoxObj.children().eq(s_index).addClass('on').siblings().removeClass('on');
				var nLeft = -(thumbPage-1) * thumbOW * scroll;				
				nLeft = nLeft < -(thumbBoxObj.width()-thumbBoxObj.parent().width()) ? -(thumbBoxObj.width()-thumbBoxObj.parent().width()) : nLeft;
				nLeft = nLeft > 0 ? 0 : nLeft;					
				thumbBoxObj.stop(true,true).animate({'left':nLeft},delayTime);
			}			
			
			//大图滚动
			var play = function(){	
				bigObj.find('.on').removeClass('on');					
				if(bigObj.parent().find('.loading').length > 0){
					var loading = bigObj.parent().find('.loading');
					loading.css({'top':(bigObjH - loading.height())/2}).show();
				}else{
					$("<div class='loading'><img src='../sea-modules/examples/album/imgs/loading.jpg'></div>").css({'top':(bigObjH - $(this).height())/2}).appendTo(bigObj.parent()).show();
				}
				scale2 = bigObjW/bigObjH;
				var img = new Image();
				img.src = bigObj.find('img').eq(s_index).attr('src');
				img.onload= function(){
					scale = img.width/img.height;
					if(scale >= scale2){
						if(img.width > bigObjW){
							img.width = bigObjW;
							img.height = bigObjW/scale;
						}
					}
					else{
						if(img.height > bigObjH){
							img.height = bigObjH;
							img.width = scale * img.height;
						}
					}
					bigObj.find('img').eq(s_index).css({'width':img.width,'height':img.height,'paddingTop':(bigObjH - img.height)/2});
					bigObj.parent().find('.loading').hide();
					bigObj.children().eq(s_index).addClass('on');
				}
							
				var _this = bigObj.children().eq(s_index);								
				introObj.text(_this.find('img').attr('title'));
				imgIndexObj.html('<span>'+parseInt(s_index+1)+'</span>/'+(parseInt(imgCount)));
				thumbPage = Math.ceil((s_index+1)/scroll);				
				thumbPlay();
			}						
			play();
			
			//鼠标滚轮事件
			if(bigObj.parent().mousewheel){
				bigObj.parent().mousewheel(function (event, delta) {
				if (delta > 0)
					bigPrevTrigger();
				else
					bigNextTrigger();
				});
			}
			
			//大图滚动事件
			var bigPrevTrigger = function(){ s_index = s_index-1 >= 0 ? s_index-1:imgCount-1; play();}
			var bigNextTrigger = function(){ s_index = s_index+1 >= imgCount ? 0:s_index+1; play();}
			
			//大图鼠标经过事件
			prevObj.hover(function(){
				$(this).children().show();
			},function(){
				$(this).children().hide();
			})
			nextObj.hover(function(){
				$(this).children().show();
			},function(){
				$(this).children().hide();
			})
			
			//大图滚动事件绑定
			prevObj.unbind("click").click(bigPrevTrigger);
			nextObj.unbind("click").click(bigNextTrigger);
			
			//略缩图按钮事件
			var thumbPrevTrigger = function(){thumbPage = thumbPage <= 1 ? thumbPage = countPage : --thumbPage; thumbPlay();}
			var thumbNextTrigger = function(){thumbPage = thumbPage >= countPage ? 1 : ++thumbPage; thumbPlay();}
			
			//略缩图点击事件绑定
			thumbBoxObj.children().unbind('click').click(function(){
				s_index = thumbBoxObj.children().index($(this));				
				play();
			});
			thumbPrevObj.unbind('click').click(thumbPrevTrigger);
			thumbNextObj.unbind('click').click(thumbNextTrigger);			
			});		
		}
   })