
// define("examples/intromove/main-debug", [ "./intro_move-debug" ], function(require) {
//     var IntroMove = require("./intro_move-debug");
//     var s = new IntroMove("descHover");
//     s.init();
// });

define("examples/intromove/main-debug",[], function(require, exports, module) {
	var IntroMover = function(container){
		this.container = document.getElementById(container);
		this.icon = this.container.getElementsByTagName('li');
	}
	//修改过得地方
	module.exports = IntroMover;
	
	IntroMover.prototype.init = function(){
		for(var i = 0;i<this.icon.length;i++){				
			var oTip = document.createElement('span');
			oTip.className = 'tip';
			oTip.innerHTML = '图片说明';		
			this.icon[i].appendChild(oTip);
			movein(this.icon[i]);
		}
	}


function movein(oBox){
	var oTip = oBox.children[1];
	oBox.onmouseover = function(ev){
		var oEvent = ev || event;		
		var dir = hoverDir(oBox,oEvent);		
		var oFrom = oEvent.fromElement||oEvent.relatedTarget; //IE 获得光标的相关元素：Event.fromElement  失去光标的相关元素 :Event.toElement（） W3C标准的相关元素是：Event.relatedTarget		
		if(oBox.contains(oFrom))return;
		switch(dir){
			case 0 : oTip.style.left='200px';
					 oTip.style.top=0;
			break;
			case 1 : oTip.style.top='200px';
					 oTip.style.left=0;
			break;
			case 2 : oTip.style.left='-200px';
					 oTip.style.top=0;
			break;
			case 3 : oTip.style.top='-200px';
					 oTip.style.left=0;
			break;
		}		
		startMove(oTip,{left:0,top:0});
	}
	
	oBox.onmouseout = function(ev){
		var oEvent =ev || event;		
		var dir = hoverDir(oBox,oEvent);
		var oTo = oEvent.toElement||oEvent.relatedTarget;
		if(oBox.contains(oTo))return;				
		switch(dir){
			case 0 : startMove(oTip,{left:200,top:0});
			break;
			case 1 : startMove(oTip,{left:0,top:200});
			break;
			case 2 : startMove(oTip,{left:-200,top:0});
			break;
			case 3 : startMove(oTip,{left:0,top:-200});
			break;
		}
	}
}

//计算从那边移入鼠标（正方形才能准确计算）
function hoverDir(obj,oEvent){
	var oSc=document.documentElement.scrollTop||document.body.scrollTop;
	var w = obj.offsetWidth/2 +obj.offsetLeft; 
	var h = obj.offsetHeight/2 +obj.offsetTop -oSc;
	var x = w - oEvent.clientX;
	var y = h - oEvent.clientY;
	return Math.round((Math.atan2(y,x)*180/Math.PI+180)/90)%4;
	}
	
//以下是animate方法
function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}
function startMove(obj,json,options){
	options=options||{};
	options.type=options.type||'ease-out';
	options.time=options.time||700;
	var start = {};
	var dis = {};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'width':
					start[name]=obj.offsetWidth;
				break;
				case 'height':
					start[name]=obj.offsetHeight;
				break;
				case 'top':
					start[name]=obj.offsetTop;
				break;
				case 'left':
					start[name]=obj.offsetLeft;
				break;
				case 'opacity':
					start[name]=1;
				break;
				case 'borderWidth':
					start[name]=0;
				break;
			}
		}
		dis[name]=json[name]-start[name];
	}
	var count = Math.floor(options.time/30);
	var n =0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			switch(options.type){
				case 'linear':
					var cur = start[name]+dis[name]*n/count;
				break;
				case 'ease-in':
					var a = n/count;
					var cur = start[name]+dis[name]*(Math.pow(a,3));
				break;
				case 'ease-out':
					var a = 1-n/count;
					var cur = start[name]+dis[name]*(1-Math.pow(a,3));
				break;
			}
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.end&&options.end();
		}
	},30);
}

});