//横向滚动2
$.fn.scrollLR2=function(obj){
	var $a=$(this).find(".scrollWrap");    //可见区域
	var $b=$(this).find(".scrollIn");    //滚动区域
	var $btn1=$(this).find(".btnLeft");    //复制图片区域
	var $btn2=$(this).find(".btnRight");    //复制图片区域
	
	var aw=$a.width();    //可见区域宽度
	var len=$b.find("li").length;    //li的个数
	var liw=184;    //每个li所占的宽度，根据实际情况自行设置
	if(len<(aw/liw)){
		return false;
	}//li的个数过少时，停止执行该函数
	
	var bw=liw*len;    //滚动区域的宽度
	$b.width(bw);

	var autoTimer;    //重复执行变量
	var dist=0;    //当前滚动的距离
	var speed=10;    //滚动速度，根据实际情况自行设置
	var udist=2;    //滚动一次的距离，根据实际情况自行设置
	
	$a.scrollLeft(0);
	$btn1.addClass("noAvail");
		
	var stepL=function(){
		if(dist<=0){
			dist=0;
			$btn1.addClass("noAvail");
		}else{
			dist-=udist;
		}
		$a.scrollLeft(dist);
	};//向左执行一步
	
	var stepR=function(){
		if(dist>=bw-aw){
			dist=bw-aw;
			$btn2.addClass("noAvail");
		}else{
			dist+=udist;
		}
		$a.scrollLeft(dist);
	};//向右执行一步
	
	$btn1.hover(
		function(){
			$btn2.removeClass("noAvail"); 
			autoTimer=setInterval(stepL,speed);
		},
		function(){clearInterval(autoTimer);}
	);//向左滚动
	
	$btn2.hover(
		function(){
			$btn1.removeClass("noAvail"); 
			autoTimer=setInterval(stepR,speed);
		},
		function(){clearInterval(autoTimer);}
	);//向右滚动
};