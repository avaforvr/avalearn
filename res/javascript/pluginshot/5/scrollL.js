//向左滚动
$.fn.scrollL=function(obj){
	var $a=$(this);    //可见区域
	var $b=$(this).find(".scrollIn");    //滚动区域
	var $c=$(this).find(".ulCont");    //原始图片区域
	var $d=$(this).find(".ulCopy");    //复制图片区域
	
	var aw=$a.width();    //可见区域宽度
	var len=$c.find("li").length;    //li的个数
	var liw=obj.unitS;    //每个li所占的宽度(参数)
	if(len<(aw/liw)){
		return false;
	}//li的个数过少时，停止执行该函数
	
	$c.find("li").clone().prependTo($d);    //将li复制到copy标签中

	var cw=liw*len;    //原始图片区域宽度
	var bw=liw*len*2;    //滚动区域的宽度
	$b.width(bw);    //滚动区域的宽度

	var speed=obj.speed;    //滚动速度(参数)
	var autoTimer;    //重复执行变量
	var dist=0;    //当前滚动的距离
		
	var step=function(){
		dist=(dist>=bw-aw)?cw-aw:dist+1;
		$a.scrollLeft(dist);
	};//执行一步
	
	var auto=function(){
		autoTimer=setInterval(step,speed);
	};//重复执行
	
	$b.hover(
		function(){clearInterval(autoTimer);},
		function(){auto();}
	);//鼠标悬浮时停止滚动
	
	auto();	
};