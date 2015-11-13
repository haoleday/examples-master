window.onload =function () {
	var oWrap = document.getElementById("wrap");
	var aHd = oWrap.getElementsByTagName("span");
	var oPrav = oWrap.getElementsByTagName("a")[0];
	var oNext = oWrap.getElementsByTagName("a")[1];
	var aLi = oWrap.getElementsByTagName('li');
	var timer = null;
	var Time = null;
	var iNum = 0;
	//选中时的方法
	function tag(){
		var isIE = !document.addEventListener;		
		if(isIE){
			for (var i = 0; i < aHd.length; i++) {
				aHd[i].className = '';				
				aLi[i].style.display = 'none';
			}
			aHd[iNum].className = 'on';
			aLi[iNum].style.display = 'block';			
		}else{
			for (var i = 0; i < aHd.length; i++) {
				aHd[i].className = '';
				aLi[i].className = '';			
			}
			aHd[iNum].className = 'on';
			aLi[iNum].className = 'active';		
		}		
	}
	//hd鼠标经过的方法		
	for (var i = 0; i < aHd.length; i++) {	
		(function(index){
			aHd[i].onmouseover = function(){								
				clearTimeout(Time);						
				Time = setTimeout(function(){
					iNum = index;							
					tag()
				},500)
			}
		})(i)
	}

	//下一个
	function oTo(){
		iNum++;				
		if(iNum == aLi.length){
			iNum =0;
		}	
		tag();
	}
	//自动事件
	timer = setInterval(oTo,2500);

	//上一个点击
	oPrav.onclick =function(){	
		iNum--;			
		if(iNum < 0){
			iNum=aLi.length -1;					
		}				
		tag();
	}
	//下一个
	oNext.onclick = oTo;

	//鼠标经过事件
	oWrap.onmouseover = function(){
		oPrav.style.display = 'block';
		oNext.style.display = 'block';
		clearInterval(timer);
	}
	//鼠标离开事件
	oWrap.onmouseout = function(){
		oPrav.style.display = 'none';
		oNext.style.display = 'none';
		timer = setInterval(oTo,2500);
	}
}