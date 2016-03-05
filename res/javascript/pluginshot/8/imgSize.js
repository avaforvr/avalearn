//按最大宽度和最大高度等比缩放，图片完整显示在该区域内
$.fn.imgSize1=function(obj){
	var $o=$(this);
	var t=new Image();
	t.src=$(this).attr("src");
	var maxw=obj.maxw;//最大宽度(传参)
	var maxh=obj.maxh;//最大高度(传参)
	var ow,oh;
	
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
	
	if(t.complete){ autoSize(); }// 从缓存中读取	
	$(t).load(function(){ autoSize(); });
};

//按最大宽度和最大高度等比缩放，图片不一定完整显示在该区域内，取中间部分显示
$.fn.imgSize2=function(obj){
	var $o=$(this);
	var t=new Image();
	t.src=$(this).attr("src");
	var maxw=obj.maxw;//最大宽度(传参)
	var maxh=obj.maxh;//最大高度(传参)
	var ow,oh;
	
	var autoSize=function(){
		if(t.width<=maxw&&t.height<=maxh){
			ow=t.width;
			oh=t.height;
		}else{
			if(t.width/t.height>=maxw/maxh){
				oh=(t.height<=maxh)?t.height:maxh;
				ow=Math.floor((oh*t.width)/t.height);
			}else{
				ow=(t.width<=maxw)?t.width:maxw;
				oh=Math.floor((ow*t.height)/t.width);	
			}
		}
		$o.width(ow).height(oh).css("margin-top",(Math.floor((maxh-oh)/2))+"px").css("margin-left",(Math.floor((maxw-ow)/2))+"px");
	};	//等比缩放
	
	if(t.complete){ autoSize(); }// 从缓存中读取	
	$(t).load(function(){ autoSize(); });
};

//按最大宽度等比缩放，高度不限
$.fn.imgSize3=function(obj){
	var $o=$(this);
	var t=new Image();
	t.src=$(this).attr("src");
	var maxw=obj.maxw;//最大宽度(传参)
	var ow,oh;
	
	var autoSize=function(){
		ow=(t.width<=maxw)?t.width:maxw;
		oh=Math.floor((ow*t.height)/t.width);
		$o.width(ow).height(oh);
	};	//等比缩放
	
	if(t.complete){ autoSize(); }// 从缓存中读取	
	$(t).load(function(){ autoSize(); });
};