//自动 无缝 滑动
$.fn.slide4=function(obj){
	var $a=$(this).find(".slideWrap");    //可见区域
	var $b=$(this).find(".slideIn");    //滚动区域
	var $c=$(this).find(".ulCont");    //原始图片区域
	var $d=$(this).find(".ulCopy");    //复制图片区域
	var $btn1=$(this).find(".btnLeft");    //复制图片区域
	var $btn2=$(this).find(".btnRight");    //复制图片区域
	
	var aw=$a.width();    //可见区域宽度
	var len=$c.find("li").length;    //li的个数
	var liw=184;    //每个li所占的宽度，根据实际情况自行设置
	var u=4;    //每次可见的li的个数，根据实际情况自行设置
	if(len<=u){
		return false;
	}//li的个数过少时，停止执行该函数
	
	
	$c.find("li").clone().prependTo($d);    //将li复制到copy标签中

	var cw=aw*Math.ceil(len/u);    //每个ul的宽度
	var bw=cw*2;    //滚动区域的宽度
	$b.width(bw);
	$c.width(cw);
	$d.width(cw);   //设置css宽度
	
	var dist=cw;    //当前滚动的距离
	$a.scrollLeft(dist);    //初始化
	var speed=500;    //滚动速度，根据实际情况自行设置
	var autoTimer;    //重复执行变量
	var autoSpeed=3000;    //重复执行时间
	
	var preStep=function(){
		if (!$a.is(':animated')){
			dist-=aw;
			$a.animate({scrollLeft:dist},speed,function(){
					if(dist<=0){dist=cw; $a.scrollLeft(dist);}
				});
		}
	};
	
	var nextStep=function(){
		if (!$a.is(':animated')){
			dist+=aw;
			$a.animate({scrollLeft:dist},speed,function(){
					if(dist>=bw-aw){dist=cw-aw; $a.scrollLeft(dist);}
				});
		}
	};
	
	var auto=function(){
		autoTimer=setInterval(nextStep,autoSpeed);
	};
	
	$btn1.click(function(){preStep();});//点击向左按钮	
	$btn2.click(function(){nextStep();});//点击向右按钮
	
	$a.hover(
		function(){clearInterval(autoTimer);},
		function(){auto();}
	);//鼠标悬浮时停止滚动
	
	auto();	
};