//自动 非无缝 滑动
$.fn.slide2=function(obj){
	var $a=$(this).find(".slideWrap");    //可见区域
	var $b=$(this).find(".ulCont");    //图片区域
	var $btn1=$(this).find(".btnLeft");    //复制图片区域
	var $btn2=$(this).find(".btnRight");    //复制图片区域
	
	var aw=$a.width();    //可见区域宽度
	var len=$b.find("li").length;    //li的个数
	var liw=184;    //每个li所占的宽度，根据实际情况自行设置
	if(len<=(aw/liw)){
		return false;
	}//li的个数过少时，停止执行该函数

	var bw=liw*len;    //图片区域的宽度
	$b.width(bw);
	var dist=0;
	$a.scrollLeft(dist);    //初始化
	var speed=500;    //滚动速度，根据实际情况自行设置
	var autoTimer;    //重复执行变量
	var autoSpeed=3000;    //重复执行时间
	
	var preStep=function(){
		if (!$a.is(':animated')){
			dist=(dist<=0)?bw-aw:dist-aw;
			$a.animate({scrollLeft:dist},speed);
		}
	};
	
	var nextStep=function(){
		if (!$a.is(':animated')){
			dist=(dist>=bw-aw)?0:dist+aw;
			$a.animate({scrollLeft:dist},speed);
		}
	};
	
	var auto=function(){
		autoTimer=setInterval(nextStep,autoSpeed);
	};
	
	$btn1.click(function(){ preStep(); });//点击向左按钮
	$btn2.click(function(){ nextStep(); });//点击向右按钮
	
	$a.hover(
		function(){clearInterval(autoTimer);},
		function(){auto();}
	);//鼠标悬浮时停止滚动
	
	auto();
	
};