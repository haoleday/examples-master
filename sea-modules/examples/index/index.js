window.onload = function(){
  //导航
  var oNav = document.getElementById('nav');
  var aLi = oNav.getElementsByTagName('li');
  var oTip = document.getElementById('tip'); 
  for(var i=0;i<aLi.length-1;i++){
      aLi[i].onmouseover = function(){        
        move(oTip,this.offsetLeft);
      }
    }
    var speed = 0;
    var left = 0;
    function move(obj,nTarget){
      clearInterval(obj.time);
      obj.time = setInterval(function(){
        speed+=(nTarget - left)/5;
        speed*=.7;
        left+=speed;
        obj.style.left = Math.round(left)+'px';        
        if(nTarget == Math.round(left) && Math.abs(speed)<1 ){
          clearInterval(obj.time);
        }
      },30);
    }

   

    //slider
    var slider = document.getElementById('slider');
    var aLi = slider.getElementsByTagName('li');
    var oPrev = document.getElementById('prev');
    var oNext = document.getElementById('next');
    var arr =[];
    for(var i = 0; i<aLi.length;i++){
      arr[i] = aLi[i].className;
      (function(index){
          aLi[index].onclick = function(){
            window.open('http://www.kanyn.com');
          }
      })(i);
    }

    function tab(){
      for(var i=0; i<aLi.length;i++){
        aLi[i].className = arr[i];
      }
    }

    oPrev.onclick = function(){      
      arr.unshift(arr.pop()); 
      tab();   
    }
    oNext.onclick = function(){
      arr.push(arr.shift());   
      tab();   
    }    

}

seajs.config({
  base: "./sea-modules/",    
});

seajs.use([ "examples/intromove/main-debug" ], function(require) {
    var s = new require("Effect");   
    s.init();
});


function setTop(nTarget){
      if(document.documentElement.scrollTop){
          document.documentElement.scrollTop =nTarget;
        }else{
          document.body.scrollTop=nTarget
        }
    }
 //nav跳转
    // var speed = 0;
    // var top2=0;
    // function scrollNav(nTarget){       
    //   clearInterval(timer);
    //   var timer = setInterval(function(){  
    //     speed =nTarget/20;
    //     top2=Math.round(top2+speed) ;
    //     console.log('top:'+top2);
    //     setTop(top2);
    //      if(top2>=nTarget){
    //       setTop(nTarget);
    //       clearInterval(timer);   
    //     }     
    //   },30);
    // }

    