/**************************************************************
 @author liaohl
 @date: 2013-10-08
 @description 左右滑动组件，带自动滑动
 @param config 配置参数
 	config.wrapper wrapper元素，必传
	config.scroller scroller元素，必传
	config.perCount 每个可视区域显示的子元素，必传
	config.showTab 是否有导航点，必传
	config.tabDiv 导航点集合对象，config.showTab为true时必传
	config.auto 是否自动播放，必传
	config.interval 自动播放的定时器，config.auto为true时必传
	config.wrapperObj 滑动对象的引用，必传
 @returns {HIscroll}
   
//使用案例
var hIscroll = {"scroll":null,"_init":false},
	config = {
		wrapper: $('#wrapper_index_head'), //wrapper对象
		scroller: $('#scroller_index_head'), //scroller对象
		perCount: 1,  //每个可视区域显示的子元素
		showTab: true, //是否有导航点
		tabDiv: $x("mallIndex","tag_index_head"), //导航点集合对象
		auto: true, //是否自动播放
		interval: null, //自动播放定时器
		wrapperObj: null
	};
hIscroll.scroll = new HIscroll(config); //初始化
hIscroll._init = true; //尽量只初始化一次，保持性能（如果是项目开发，这句和下一句可以忽略）
//hIscroll.scroll.destroy(); //销毁
**************************************************************/
define(function (require, exports, module) {
	
	function HIscroll(config)
	{
		var This = this, tempIdx = 1,
			autoFlag = false;
		
		/**
		 * 设置相关css和相关宽高
		 */
		this.setCssHW = function() //一定要显示内容之后才能设置！！
		{
			config.scroller.css({"width":"100%","overflow":"hidden"});
			config.scroller.children().css({"float":"left"});
			
			var perCount = config.perCount,
				tabsLen = config.scroller.children().length,
				perTabWidth = config.wrapper.parent().width() / perCount,
				perTabHeight = config.scroller.children(":eq(0)").height();
	
			config.scroller.children().width(perTabWidth);
			config.scroller.width(perTabWidth * tabsLen);
			config.scroller.height(perTabHeight);
		};
		
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
			
			if(config.showTab)
			{
				config.tabDiv.children(":eq(0)").addClass("current").siblings().removeClass("current");
			}
			//初始化滑动对象
			var iScroll = require("iscroll");
			config.wrapperObj = new iScroll(config.wrapper[0], {
				snap: true, 
				vScroll: false, // 是否垂直滚动
				momentum: false, // 是否启动滑动惯性
				hScrollbar: false, // 是否显示水平滚动条
				vScrollbar: false, // 是否显示垂直滚动条
				onBeforeScrollStart: function(e) {/*
					var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase():(e.target ? e.target.nodeName.toLowerCase():'');
				    if(nodeType !='select'&& nodeType !='option'&& nodeType !='input'&& nodeType!='textarea') 
				               e.preventDefault();
				*/},
				onScrollStart: function () {
		            //停止自动播放
					autoFlag = false;
		            clearInterval(config.interval);
		            config.interval = null;
		        },
		        onScrollMove: function(e) {
				},
				onScrollEnd: function() {
					if(config.showTab)
					{
						var tabDiv = config.tabDiv;
						tabDiv.children(":eq("+this.currPageX+")").addClass("current").siblings().removeClass("current");
					}
					
					//再次启动自动模式
					if(!autoFlag && config.auto)
					{
						This.autoScroll();
					}
					
					//分页模块针对左右滑动自定义字段，其他模块无影响
					if(config.customSomeThing)
					{
						config.customSomeThing();
					}
				}
			});
			
			
			//启动自动播放
			if(config.auto)
			{
				This.autoScroll();
			}
			
			//屏幕大小改变重新设置相关css和相关宽高
			/*window.orientationchange 
				? window.orientationchange = function() {This.setCssHW();} 
				: window.onresize  = function() {This.setCssHW();};*/
				
			/*
			//鼠标移上去时停止自动播放，移入移出有问题
			config.scroller.children().hover(
				function () {
					clearInterval(config.interval);
				},
				function () {
					//再次启动自动模式
					This.autoScroll();
			});
			*/
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
			config.interval = null;
			clearInterval(config.interval);
			config.tabDiv.children(":eq(0)").addClass("current").siblings().removeClass("current");
		};
		
		/**
		 * 自动播放
		 */
		this.autoScroll = function() //这里要用this，prototype是类公用一个方法，this的话对每个实例都有一份
		{
			config.interval = setInterval(function () {
				if(config.wrapperObj != null && config.wrapper.is(":visible"))
				{
					autoFlag = true;
					//记录当前scroll滚动到第最后page时，回到最开始
					if (config.wrapperObj.currPageX >= config.wrapperObj.pagesX.length - 1) 
					{
	//					tempIdx = -config.wrapperObj.pagesX.length+1;
						tempIdx = -1;
					} 
					else if(config.wrapperObj.currPageX <= 0)
					{
						tempIdx = 1;
					}
					config.wrapperObj.currPageX += tempIdx;
					config.wrapperObj.scrollToPage(config.wrapperObj.currPageX, 0, 800);
				}
			}, 4000);
		};
		
		/**
		 * 返回滑动的当前页
		 */
		this.getActivePage = function() {
			return config.wrapperObj.currPageX;
		};
		
		/**
		 * 滑动到指定页
		 * @param 页数索引
		 * @param 花费的时间 ms
		 */
		this.scrollToPage = function(pageNo, time) {
			config.wrapperObj.scrollToPage(pageNo, 0, time);
		};
		
		This.init();
	};
	//暴露对外的接口
	module.exports = HIscroll;
});