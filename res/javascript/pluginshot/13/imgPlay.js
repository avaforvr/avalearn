$.fn.imgPlay=function(obj){
	var $o=$(this);
	var $a=$(this).find(".imgList");
	var $b=$(this).find(".tags");
	var $ali=$a.find("li");
	var len=$ali.length;	//图片个数
	if(len<=1){ return false; }
	
	for(i=1;i<=len;i++){
		$("<span>"+i+"</span>").appendTo($b);
	}
	var $bli=$b.find("span");

	var icur=0;	//图片索引
	var fadeSpeed=300;/*图片淡入速度*/
	var autoTimer;
	var autoSpeed=5000;

	var toPic=function(){
		$ali.hide().eq(icur).fadeIn(fadeSpeed);
		$bli.removeClass("cur").eq(icur).addClass("cur");
	};
	
	var nextPic=function(){
		if(icur>=len-1){
			icur=0;
			clearInterval(autoTimer);
		}else{
			icur++;
		}
		//icur=(icur==len-1)?0:icur+1;
		toPic();
	};
	
	var auto=function(){
		autoTimer=setInterval(nextPic,autoSpeed);
	};
	
	$bli.hover(
		function(){
			clearInterval(autoTimer);
			if($(this).index()!=icur){
				icur=$(this).index();
				toPic();
			}
		},
		function(){auto();}
	);
	
	toPic();
	auto();
	
};