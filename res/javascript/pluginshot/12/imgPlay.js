$.fn.imgPlay=function(obj){
	var $o=$(this);
	var $a=$(this).find(".imgList");    //可见区域
	var $ali=$a.find("li");
	var $btn1=$(this).find(".btnLeft");    //上一张按钮
	var $btn2=$(this).find(".btnRight");    //下一张按钮
	
	var len=$ali.length;    //li的个数
	if(len<=1){ return false; }//li的个数过少时，停止执行该函数
		
	var icur=0;    //索引
	var inext;
	var aw=$a.width();
	$ali.css("z-index","0").eq(icur).css("z-index",len);

	var slideSpeed=300;	//图片滑动速度
	var autoSpeed=3000;    //自动播放速度
	var autoTimer;    //自动播放变量
	
	var toPic=function(i){
		var dire=parseInt(i);
		if(dire==1){inext=(icur>=len-1)?0:icur+1;} else{inext=(icur>=len-1)?0:icur+1;}
		
		$ali.eq(inext).css({"left":dire*aw+"px","z-index":len+1}).animate({left:0},slideSpeed,function(){
			$ali.css("z-index","0").eq(inext).css("z-index",len);
			icur=inext;
		});
	};//dire为方向
	
	var preStep=function(){toPic(-1)};
	var nextStep=function(){toPic(1)};
	var auto=function(){ autoTimer=setInterval(nextStep,autoSpeed); };
	
	$btn1.click(function(){ if (!$ali.eq(inext).is(':animated')){ preStep(); } });    //点击向左按钮
	$btn2.click(function(){ if (!$ali.eq(inext).is(':animated')){ nextStep(); } });    //点击向右按钮
	
	$o.mouseenter(function(){clearInterval(autoTimer);}).mouseleave(function(){auto();});//鼠标悬浮时停止播放	
	auto();    //自动播放
};