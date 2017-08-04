/**************************************************************
 @author liaohl
 @date: 2013-10-08
 @description 固定列滑动组件，固定列+滑动列
 @param config 配置参数
	config.container 最外层容器元素，必传
	config.wrapper wrapper元素，必传
	config.wrapperObj 滑动对象的引用，必传
	config.noBorder 是否无边框，非必传，不传默认有边框
	config.wPerColumn 每列宽度数组，非必传，不传默认每列80(px)
 @returns {FIscroll}
 
//使用案例
var fIscroll = {"scroll":null,"_init":false},
	config = {
		container: $("#myProd_lc"), //container元素
		wrapper: $("#wrapper_myProd_lc"), //wrapper元素
		wPerColumn: [100,80,80,80,130,80], //自定每列的宽度
		wrapperObj: null
	};
fIscroll.scroll = new FIscroll(config); //初始化
fIscroll._init = true; //尽量只初始化一次，保持性能（如果是项目开发，这句和下一句可以忽略）
//fIscroll.scroll.destroy(); //销毁
**************************************************************/
define(function (require, exports, module) {
	
	function FIscroll(config)
	{
		var This = this;
		
		/**
		 * 初始化
		 */
		this.init = function() 
		{
			//先设置相关css和相关宽高
			This.setCssHW();
			
			//销毁对象，优化内存
			if(config.wrapperObj != null)
			{
				config.wrapperObj.destroy();
				config.wrapperObj = null;
			}
			
			//初始化滑动对象
			var iScroll = require("iscroll");
			config.wrapperObj = new iScroll(config.wrapper[0], {
				snap: true,
				vScroll: false, // 是否垂直滚动
				hScrollbar: false, // 是否显示水平滚动条
				vScrollbar: false, // 是否显示垂直滚动条
				onBeforeScrollStart: function(e) {/*
					var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase():(e.target ? e.target.nodeName.toLowerCase():'');
				    if(nodeType !='select'&& nodeType !='option'&& nodeType !='input'&& nodeType!='textarea') 
				               e.preventDefault();
				*/},
				onScrollEnd: function() {
					//处理左右滑动图标
					var x = config.wrapperObj.x, 
						wrapperX = config.wrapper.width(), 
						scrollerX = config.wrapper.children(":eq(0)").width();
					if(x == wrapperX - scrollerX)
					{
						config.wrapper.addClass("over");
					}
					else
					{
						config.wrapper.removeClass("over");
					}
				}
			});
			
			//屏幕大小改变重新设置相关css和相关宽高
			/*window.orientationchange 
				? window.orientationchange = function() {This.setCssHW();} 
				: window.onresize  = function() {This.setCssHW();};*/
		};
		
		/**
		 * 设置相关css和相关宽高，更新了htlm内容时需要调用该方法
		 */
		this.setCssHW = function()  //一定要显示内容之后才能设置！！
		{
			//config.noBorder = true; //如果不需要边框，传参是多加一个config.noBorder参数，设置为true
			var	wPerColumn = config.wPerColumn, //每列自定义的宽度，undefined表示为固定宽度，数组表示自定义宽度
				fixedColLen = config.container.children(":eq(0)").children(":eq(0)").children().length, //滑动的列数
				slideColLen = config.wrapper.children(":eq(0)").children(":eq(0)").children().length; //滑动的列数
			
			if(config.wPerColumn) //每列自定义宽度
			{
				var $ = jQuery = require('jquery');
				//每列
				config.container.children(":eq(0)").children().each(function () {
					$(this).children().each(function (idx, item) {
						item.style.width = wPerColumn[idx] + "px";
						if(config.noBorder)
						{
							$(this).css("border-right-width","0");
						}
					});
				});
				config.wrapper.children(":eq(0)").children().each(function () {
					$(this).children().each(function (idx, item) {
						item.style.width = wPerColumn[idx+fixedColLen] + "px";
						if(config.noBorder)
						{
							$(this).css("border-right-width","0");
						}
					});
				});
				//wrapper
				var fixedWidth = 0;
				for(var i=0;i<fixedColLen; i++)
				{
					fixedWidth += (wPerColumn[i]);
				}
				config.wrapper.css("left", fixedWidth+"px");
				config.wrapper.width(config.container.width()-fixedWidth); //wrapper的宽度要设定正确，否则不会有效果，先显示页面，再取实际宽度，否则定大概宽度
				//scroller
				var totalWidth = 0;
				for(var i=0; i<slideColLen;i++) {
					totalWidth += (wPerColumn[i+fixedColLen]);
				}
				config.wrapper.children(":eq(0)").width(totalWidth);
			}
			else //每列固定宽度
			{
				wPerColumn = 80; //每列的宽度，默认为80(px)
				
				config.container.children(":eq(0)").children().children().width(wPerColumn);
				config.wrapper.children(":eq(0)").children().children().width(wPerColumn);
				config.wrapper.css("left", wPerColumn+"px");
				config.wrapper.width(config.container.width()-wPerColumn); //wrapper的宽度要设定正确，否则不会有效果，先显示页面，再取实际宽度，否则定大概宽度
				config.wrapper.children(":eq(0)").width(slideColLen*wPerColumn);
			}
		};
		
		/**
		 * 销毁引用，待释放内存
		 */
		this.destroy = function() {
			if(config.wrapperObj != null)
			{
				config.wrapperObj.destroy();
				config.wrapperObj = null;
			}
		};
		
		This.init();
	};
	//暴露对外的接口
	module.exports = FIscroll;
});