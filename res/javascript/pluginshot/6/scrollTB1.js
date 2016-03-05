//纵向滚动1
$.fn.scrollTB1=function(obj){
	var $a=$(this).find(".scrollWrap");    //可见区域
	var $b=$(this).find(".scrollIn");    //滚动区域
	var $c=$(this).find(".ulCont");    //原始图片区域
	var $d=$(this).find(".ulCopy");    //复制图片区域
	var $btn1=$(this).find(".btnTop");    //向上按钮
	var $btn2=$(this).find(".btnBot");    //向下按钮
	
	var aw=$a.height();    //可见区域高度
	var len=$c.find("li").length;    //li的个数
	var liw=140;    //每个li所占的高度，根据实际情况自行设置
	if(len<(aw/liw)){
		return false;
	}//li的个数过少时，停止执行该函数
	
	$c.find("li").clone().prependTo($d);    //将li复制到copy标签中

	var cw=liw*len;    //原始图片区域高度
	var bw=liw*len*2;    //滚动区域的高度
	$b.height(bw);    //滚动区域的高度

	var autoTimer;    //重复执行变量
	var dist=0;    //当前滚动的距离
	var speed=10;    //滚动速度，根据实际情况自行设置
	var udist=1;    //滚动一次的距离，根据实际情况自行设置
	
	var dire=0;//默认向左滚动
		
	var stepL=function(){
		dist=(dist>=bw-aw)?cw-aw:dist+udist;
		$a.scrollTop(dist);
	};//向左执行一步
	
	var stepR=function(){
		dist=(dist<=0)?cw:dist-udist;
		$a.scrollTop(dist);
	};//向右执行一步
	
	var auto=function(){
		autoTimer=(dire==0)?setInterval(stepL,speed):setInterval(stepR,speed);
	};//重复执行
	
	$a.hover(
		function(){clearInterval(autoTimer);},
		function(){auto();}
	);//鼠标悬浮时停止滚动
	
	$btn1.click(function(){
		dire=0;
		clearInterval(autoTimer);
		auto();
	});//点击向左按钮
	
	$btn2.click(function(){
		dire=1;
		clearInterval(autoTimer);
		auto();
	});//点击向右按钮
	
	auto();	//页面加载完成后开始滚动
};