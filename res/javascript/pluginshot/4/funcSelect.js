/*下拉框
maxNum：超出这个数目时出现滚动条
liH：下拉菜单中每个li占的高度（包含边框）
plusW：外层标签比输入框多出的宽度
*/
$.fn.funcSelect=function(obj){
	var $sele=$(this);
	var $text=$(this).find("input[type=text]");
	var $menu=$(this).find("ul");
	var maxNum=(obj&&obj.maxNum)?obj.maxNum:10;
	var liH=(obj&&obj.liH)?obj.liH:25;
	var plusW=(obj&&obj.plusW)?obj.plusW:0;
	
	if($menu.find("li").length>maxNum){
		$menu.height(maxNum*liH);
	}
	$text.width($menu.width()-plusW);
	$menu.width($menu.width());
	
	var showMenu=function(){
		$sele.css("z-index","1");
		$menu.show();
		$text.addClass("open").blur();
	};	
	var hideMenu=function(e){
		$menu.hide();
		$text.removeClass("open").blur();
		$sele.css("z-index","0");
	};
	
	$text.click(function(){
		showMenu();
	});
	
	$sele.mouseleave(function(){
		hideMenu()
	});
	
	if($text.get(0).tagName=="input"||$text.get(0).tagName=="INPUT"){
		$menu.find("li").click(function(){
			var str=$(this).html();
			$text.val(str);
			hideMenu();
		});		
	}
	
};