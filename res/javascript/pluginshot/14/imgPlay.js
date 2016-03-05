//按最大宽度和最大高度等比缩放，图片完整显示在该区域内
$.fn.imgSize1=function(obj){
	var $o=$(this);
	var t=new Image();
	t.src=$(this).attr("src");
	var maxw=obj.maxw;//最大宽度(传参)
	var maxh=obj.maxh;//最大高度(传参)
	var ow,oh;
	var loading="../../../images/loading.gif";//加载中图片
	
	var autoSize=function(){
		if(t.width<=maxw&&t.height<=maxh){
			ow=t.width;
			oh=t.height;
		}else{
			if(t.width/t.height>=maxw/maxh){
				ow=maxw;
				oh=Math.floor((ow*t.height)/t.width);	
			}else{
				oh=maxh;
				ow=Math.floor((oh*t.width)/t.height);
			}
		}
		$o.width(ow).height(oh).css("margin-top",(Math.floor((maxh-oh)/2))+"px");
	};	//等比缩放
	
	if(t.complete){ autoSize(); return false; }// 从缓存中读取
	$o.attr("src",loading);
	$(t).load(function(){ 
		$o.attr("src",t.src);
		autoSize();
	});
};

//图片播放
$.fn.imgPlay=function(obj){
	var u=4;    //每次可见缩略图的个数
	var liw=134;    //缩略图li的宽度
	var slideSpeed=300;    //缩略图滚动速度
	var autoSpeed=3000;    //自动播放速度
	
	var $a=$(this).find(".bigImg");    //大图
	var $b=$(this).find(".smallImg");    //缩略图
	var $btn1=$(this).find(".btnLeft");    //左按钮
	var $btn2=$(this).find(".btnRight");    //右按钮
	var $bli=$b.find("li");
	var $ali=$a.find("li");
	
	$a.find("img").each(function(){ $(this).imgSize1({maxw:600,maxh:450}); });    //设置大图尺寸
	$b.find("img").each(function(){ $(this).imgSize1({maxw:128,maxh:96}); });    //设置缩略图尺寸
	
	var len=$bli.length;    //li的个数
	if(len<=1){ return false; }//li的个数过少时，停止执行该函数
	
	var tlen=Math.ceil(len/u);   //缩略图屏数
	var bw=$b.width();  //缩略图可见区域的宽度
	$b.find("ul").width(liw*len);   //缩略图ul宽度

	var icur=0;    //图片索引
	var tcur=0;    //屏索引
	var autoTimer;    //自动播放变量
	
	var toPic=function(){
		$bli.removeClass("cur").eq(icur).addClass("cur");
		$ali.hide().eq(icur).show();
	};
	
	var nextPic=function(){
		icur=(icur==len-1)?0:icur+1;
		toPic();
		if(tcur!=Math.floor(icur/u)){ 
			tcur=Math.floor(icur/u);
			toTeam();
		}
	};
	
	var toTeam=function(){ $b.animate({scrollLeft:bw*tcur},slideSpeed); };
	
	var auto=function(){ autoTimer=setInterval(nextPic,autoSpeed); };
	
	$bli.hover(
		function(){
			clearInterval(autoTimer);
			icur=$(this).index();
			toPic();
		},
		function(){auto();}
	);    //鼠标悬浮在缩略图上时显示相应大图
	
	$ali.click(function(){ nextPic(); });
	
	$btn1.click(function(){ 
		if (!$b.is(':animated')){
			tcur=(tcur==0)?tlen-1:tcur-1;
			toTeam();
		}
	});    //点击向左按钮
	$btn2.click(function(){
		if (!$b.is(':animated')){
			tcur=(tcur==tlen-1)?0:tcur+1;
			toTeam();
		}
	});    //点击向右按钮
	
	$ali.hide();    //初始化
	toPic();
	toTeam();
	auto();
};