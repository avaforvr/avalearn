$.fn.imgPlay=function(obj){
	
	var moveSpeed=300;    //复制图片移动速度
	var openSpeed=300;    //图片详情展开速度
	
	var $a=$(this).find(".imgList");    //图片列表
	var $b=$(this).find(".imgDt");    //弹出层
	var $c=$(this).find(".imgCopy");    //复制图片
	var $d=$(this).find(".imgDec");    //图片详情
	var $ali=$a.find("li");
	
	var aliw=$ali.eq(0).width();
	var alih=$ali.eq(0).height();
	var dw=$d.width();
	var dh=$d.height();
	var uw=$a.width()/aliw;	//每行图片数量
	
	var isOver=0;	//图片详情是否展开完毕
	var init=function(){
		$c.empty();
		$d.stop().width(0).height(0);
		$b.hide();
		isOver=0;
	};	//初始化
	init();
	
	$ali.each(function(i){
		$(this).click(function(){
			$b.show();
			var l=(i%uw)*aliw;
			var t=Math.floor(i/uw)*alih;
			$c.append($(this).find("img").clone()).css({"left":l+"px","top":t+"px"}).animate({"left":"0","top":"0"},moveSpeed,function(){
				$d.animate({"width":dw+"px","height":dh+"px"},openSpeed,function(){ isOver=1; });
			});
		});
	});
	
	$d.mouseleave(function(){
		if(isOver){ init(); }
	});	//鼠标移出图片详情区域时，恢复初始状态
		
};