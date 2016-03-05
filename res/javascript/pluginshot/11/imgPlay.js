$.fn.imgPlay=function(obj){
	var $o=$(this);
	var $a=$(this).find(".imgList");    //可见区域
	var $ali=$a.find("li");
	var $btn1=$(this).find(".btnLeft");    //上一张按钮
	var $btn2=$(this).find(".btnRight");    //下一张按钮
	
	var len=$ali.length;    //li的个数
	if(len<=1){ return false; }//li的个数过少时，停止执行该函数

	var icur=0;    //索引
	$ali.not(":eq(0)").hide();    //初始化
	var autoSpeed=3000;    //自动播放速度，根据实际情况自行设置
	var autoTimer;    //自动播放变量
	
	var preStep=function(){
		icur=(icur<=0)?len-1:icur-1;
		$ali.hide().eq(icur).fadeIn("fast");
	};
	var nextStep=function(){
		icur=(icur>=len-1)?0:icur+1;
		$ali.hide().eq(icur).fadeIn("fast");
	};
	var auto=function(){ autoTimer=setInterval(nextStep,autoSpeed); };
	
	$btn1.click(function(){ preStep(); });    //点击向左按钮
	$btn2.click(function(){ nextStep(); });    //点击向右按钮	
	$o.mouseenter(function(){clearInterval(autoTimer);}).mouseleave(function(){auto();});//鼠标悬浮时停止播放
	auto();    //自动播放
};