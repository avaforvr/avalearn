//非自动 非无缝 滑动
$.fn.slide1=function(obj){
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
	$a.scrollLeft(dist);//初始化
	var speed=500;    //滚动速度，根据实际情况自行设置
	
	$btn1.click(function(){
		if (!$a.is(':animated')){
			dist=(dist<=0)?bw-aw:dist-aw;
			$a.animate({scrollLeft:dist},speed);
		}
	});//点击向左按钮，滚动中点击无反应
	
	$btn2.click(function(){
		if (!$a.is(':animated')){
			dist=(dist>=bw-aw)?0:dist+aw;
			$a.animate({scrollLeft:dist},speed);
		}
	});//点击向右按钮，滚动中点击无反应
	
};