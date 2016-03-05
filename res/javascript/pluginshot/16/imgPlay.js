$.fn.imgPlay=function(obj){
	
	var speed=300;    //图片详情展开速度
	
	var $a=$(this);    //图片列表
	var $ali=$a.find("li");
	var $tit=$a.find(".tit");
	var $cont=$a.find(".cont");
	
	var titw=obj.titw;	//标题宽度
	var contw=obj.contw;	//内容宽度
	
	$ali.each(function(i){
		$(this).css("left",titw*i+"px");
	});
	
	var toPic=function(i){
		var icur=i;
		$ali.each(function(i){
			if(i<=icur){ 
				var dist=$(this).index()*titw;
				$(this).stop().animate({"left":dist+"px"},speed);
			}else{
				var dist=$(this).index()*titw+contw;
				$(this).stop().animate({"left":dist+"px"},speed);
			}
		});
	};
	
	$tit.click(function(){
		toPic($(this).parent().index());
	});
	
	toPic(0);//初始化
	
};