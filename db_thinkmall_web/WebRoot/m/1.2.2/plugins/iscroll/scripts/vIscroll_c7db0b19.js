/*创建时间hSea 2015-10-30 13:54:14 PM */
define(function(require,exports,module){function a(a){var b=this,c=null;this.getWrapperObj=function(){return c},this.setCssHW=function(){var b=0;b=a.isPagingType?a.rowNum*a.perRowHeight+(a.isHasHead?a.headRowHeight:0):a.visibleHeight,a.container.css({position:"relative",height:b+"px"})},this.refresh=function(b){if(a.isPagingType&&b){var d=(b?b:a.rowNum)*a.perRowHeight+(a.isHasHead?a.headRowHeight:0);a.container.css({position:"relative",height:d+"px"})}1==a.isPagingType&&a.wrapper.find(".visc_pullUp").hide(),a.wrapper.children("div").eq(1).show(),c.refresh(),a.wrapper.children("div").eq(1).hide()},this.init=function(){function d(b){"up"==b?a.upHandle&&a.upHandle():a.downHandle&&a.downHandle()}if(!a.wrapper[0])return!1;b.setCssHW(),a.wrapper.find(".visc_pullDown .visc_pullDownTime").html((new Date).format("HH:mm:ss")),a.wrapper.find(".visc_pullUp .visc_pullUpTime").html((new Date).format("HH:mm:ss")),a.wrapper.find(".visc_pullUp").show(),a.wrapper.find(".visc_pullDown").show(),0==a.hasPullDown&&a.wrapper.find(".visc_pullDown").hide(),null!=c&&(c.destroy(),c=null);var e,f,g,h;e=a.wrapper[0].querySelector(".visc_pullDown"),f=e.offsetHeight,g=a.wrapper[0].querySelector(".visc_pullUp"),h=g.offsetHeight;var i=require("iscroll");setTimeout(function(){c=new i(a.wrapper[0],{hScroll:!1,hScrollbar:!1,vScrollbar:!a.isPagingType,topOffset:f,onBeforeScrollStart:function(a){var b=a.explicitOriginalTarget?a.explicitOriginalTarget.nodeName.toLowerCase():a.target?a.target.nodeName.toLowerCase():"";"select"!=b&&"option"!=b&&"input"!=b&&"textarea"!=b&&a.preventDefault()},onRefresh:function(){e.className.match("visc_pullDown visc_loading")?(e.className="visc_pullDown",e.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页",e.querySelector(".visc_pullDownTime").innerHTML=(new Date).format("HH:mm:ss")):g.className.match("visc_pullUp visc_loading")&&(g.className="visc_pullUp",g.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页",g.querySelector(".visc_pullUpTime").innerHTML=(new Date).format("HH:mm:ss"))},onScrollMove:function(){a.isPagingType||!a.isPagingType&&a.visibleHeight>a.wrapper.find(".visc_scroller").height()?(this.distY>50&&this.absDistY>this.absDistX+5?(e.className="visc_pullDown visc_flip",e.querySelector(".visc_pullDownLabel").innerHTML="释放可以更新"):this.distY>0&&this.distY<50&&this.absDistY>this.absDistX+5?(e.className="visc_pullDown",e.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页"):this.distY<-50&&this.absDistY>this.absDistX+5?(g.className="visc_pullUp visc_flip",g.querySelector(".visc_pullUpLabel").innerHTML="释放可以更新"):this.distY<0&&this.distY>-50&&this.absDistY>this.absDistX+5&&(g.className="visc_pullUp",g.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页"),1==a.isPagingType&&a.wrapper.find(".visc_pullUp").show()):this.y>10&&!e.className.match("visc_pullDown visc_flip")?(e.className="visc_pullDown visc_flip",e.querySelector(".visc_pullDownLabel").innerHTML="释放可以更新"):this.y<10&&e.className.match("visc_pullDown visc_flip")?(e.className="visc_pullDown",e.querySelector(".visc_pullDownLabel").innerHTML="下拉加载上一页"):this.y<this.maxScrollY-10&&!g.className.match("visc_pullUp visc_flip")?(g.className="visc_pullUp visc_flip",g.querySelector(".visc_pullUpLabel").innerHTML="释放可以更新"):this.y>this.maxScrollY+10&&g.className.match("visc_pullUp visc_flip")&&(g.className="visc_pullUp",g.querySelector(".visc_pullUpLabel").innerHTML="上拉加载下一页"),a.wrapper.children("div").eq(1).show()},onScrollEnd:function(){e.className.match("visc_pullDown visc_flip")?(e.className="visc_pullDown visc_loading",e.querySelector(".visc_pullDownLabel").innerHTML="加载数据中...",d("down",a.wrapper)):g.className.match("visc_pullUp visc_flip")&&(g.className="visc_pullUp visc_loading",g.querySelector(".visc_pullUpLabel").innerHTML="加载数据中...",d("up",a.wrapper)),a.wrapper.children("div").eq(1).hide()}})},0),setTimeout(function(){a.wrapper[0].style.left="0"},200)},this.destroy=function(){null!=c&&(c.destroy(),c=null)},b.init()}module.exports=a});
/*创建时间 2015-10-30 13:54:14 PM */