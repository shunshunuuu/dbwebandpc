(function($) { 
  $.fn.swipeEvents = function() {
    return this.each(function() {
      
      var startX,
          startY,
          $this = $(this);
      
      $this.bind('touchstart', touchstart);
      
      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
          $this.bind('touchend', touchend);
        }
        event.preventDefault();
      }
      
      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;
          
          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind('touchmove', touchmove);
            $this.unbind('touchend', touchend);
          }
        }
        event.preventDefault();
      }
      
      function touchend(event) {
        $this.unbind('touchmove', touchmove);
        event.preventDefault();
      }
      
    });
  };
})(jQuery);

$(document).ready(function(){
	
	/*滑动图片收放动画*/
	
    
    /* 数字滚动 */
	var moveNum = function (g,h){
		var a=[];
		var b= 0;
		var c = [];
		var d = g;
		var e = (g+"").split("");
		var f = 0;
		for(var i=e.length-1;i>=0;i--){
			if(e[i]>='0' && e[i]<='9'){
				a.push(e[i]);	
				c.push(i);
				$(h).prepend("<span id=a"+i+">0</span>");
			}else{
				$(h).prepend("<span>"+e[i]+"</span>");
			}
		}
		move(h,d);
		function move(g,d){
			var k=0;
			var p=window.setInterval(function(){
			$(g+" #a"+c[f]).html(k);
			if(k==a[b]){
			    window.clearInterval(p);
			    b++;
			    if(a[b]){
			    	move(h,d);
			    	f++;
			    }else{
			    	$(h).html(d);
			    }
			}
			k++;
			},30);
		}
	};
	moveNum(856.34,".info_det .round_det h2");
	
	$(".registration_box .close_btn").bind("click",function(){
		$(".registration_box").fadeOut(500);
	})
	
	/*滑动左右切换*/
	
	var rewrap2 = $("article .recommend_box").children(".inner_02"),
		renum2 = rewrap2.find(".re_box_02").length;
		rewidth2 = rewrap2.width(),
		recurrent2 = 0;
	
	function reanimate2(n) {
		if (n < renum2 && n >= 0) {
			rewrap2.css("transform","translate3d("+(- n * rewidth2)+"px, 0px, 0px)");
			$(".recommend_box .dots_box").find("em").eq(n).addClass("act").siblings("em").removeClass("act");
		} else {
			return false;
		}
	}
	
	reanimate2(recurrent2);
	$('article .re_box_02').swipeEvents()
		.bind("swipeLeft", function(){
			reanimate2(recurrent2+=1);
		})
		.bind("swipeRight", function(){
			reanimate2(recurrent2-=1);
		});
	
	/*我的银行卡滑动删除*/
	$(".my_cards_list .li_con").swipeEvents().bind("swipeLeft", function(){
    	$(this).css("transform","translate3d(-55px, 0px, 0px)")
    })
    $(".my_cards_list .li_con").swipeEvents().bind("swipeRight", function(){
    	$(this).css("transform","translate3d(0px, 0px, 0px)")
    })  
	
		
});
