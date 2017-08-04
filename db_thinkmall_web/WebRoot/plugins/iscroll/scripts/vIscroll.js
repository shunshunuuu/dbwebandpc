/**************************************************************
 @author liaohl
 @date: 2014-01-13
 @description  上下滑动
 @param config 配置参数
	config.isPagingType: false表示是微博那种累加形式，true表示分页形式
 	config.isHasHead: 是否有包含头部，有时需要嵌套固定列滑动组件，这个时候需要包含头部
 	config.headRowHeight: 头部的行高，isHasHead为false时可不传
 	config.perRowHeight: 每条数据的高度
	config.rowNum:  显示的每页数据条数
	config.visibleHeight: 当isPaingType为false时传显示内容区域的高度
	container: 包wrapper元素的父元素
	wrapper: wrapper元素
	config.downHandle: 下拉获取上一页数据方法
	config.upHandle: 上拉获取下一页数据方法
 @returns {VIscroll}
   
//使用案例，注意需要在完成数据处理和显示组件之后初始化
var vIscroll = {"scroll":null,"_init":false},
	config = {
		"isPagingType": true,
		"isHasHead": true,
		"headRowHeight": 30,
		"perRowHeight": 30,
		"rowNum": 10,
		"container": $("#v_container_funds_jj"),
		"wrapper": $("#v_wrapper_funds_jj"),
		"downHandle": function() {
			ItemsJj.handlePreNextPage(-1);
		},
		"upHandle": function() {
			ItemsJj.handlePreNextPage(1);
		},
		"wrapperObj": null
	};
vIscroll.scroll = new VIscroll(config); //初始化
vIscroll._init = true; //尽量只初始化一次，保持性能（如果是项目开发，这句和下一句可以忽略）
//vIscroll.scroll.destroy(); //销毁

另外：
//1、下拉动，数据不足分页条数时隐藏下面拉动刷新提示
len 为获取的数据条数， 10为每页显示的条数
if(len < 1) {
	$y("v_wrapper_funds_jj", "visc_pullDown").hide();
} else {
	$y("v_wrapper_funds_jj", "visc_pullDown").show();
}
//2、上拉动，没有数据时隐藏上面拉动刷新提示
if(len < 10) {
	$y("v_wrapper_funds_jj", "visc_pullUp").hide();
} else {
	$y("v_wrapper_funds_jj", "visc_pullUp").show();
}
**************************************************************/
define(function (require, exports, module) {

	function VIscroll(config)
	{
		var This = this; //mark 防止数据少的时候粗线下拉一次立即执行上拉bug
		
		/**
		 * 设置相关css和相关宽高
		 */
		this.setCssHW = function()
		{
			if(config.isPagingType)
			{
				var containerHeight = config.rowNum*config.perRowHeight + (config.isHasHead ? config.headRowHeight : 0);
				config.container.css({"position": "relative","height":containerHeight+"px"});
			}
			else
			{
				config.container.css({"position": "relative","height":config.visibleHeight+"px"});
			}
		};

		/**
		 * 重新加载数据，刷新iscroll组件，调用以还原上下拉动的显示组件
		 */
		this.refresh = function(len) {
			if(config.isPagingType)
			{
				var containerHeight = (len?len:config.rowNum)*config.perRowHeight + (config.isHasHead ? config.headRowHeight : 0);
				config.container.css({"position": "relative","height":containerHeight+"px"});
			}
			config.wrapperObj.refresh();
		};
		
		/**
		 * 初始化
		 */
		this.init = function() //一定要显示内容之后才能初始化！！ 
		{
			This.setCssHW();
			
			config.wrapper.find('.visc_pullDown .visc_pullDownTime').html(new Date().format("HH:mm:ss"));
			config.wrapper.find('.visc_pullUp .visc_pullUpTime').html(new Date().format("HH:mm:ss"));
			config.wrapper.find('.visc_pullDown').show();
			config.wrapper.find('.visc_pullUp').show();
			
			var pullDownEl, pullDownOffset,
				pullUpEl, pullUpOffset;
	
			function pullAction (opt) {
				if(opt == "up") {
					if(config.upHandle) { config.upHandle(); };
				} else {
					if(config.downHandle) { config.downHandle(); }
				}
			}
	
			if(!config.wrapper[0]) return false; //防止页面跳转出现bug
			pullDownEl = config.wrapper[0].querySelector('.visc_pullDown');
			pullDownOffset = 40;//pullDownEl.offsetHeight; //暂时 设置为40px，mark！！
			pullUpEl = config.wrapper[0].querySelector('.visc_pullUp');
			pullUpOffset = 40;//pullUpEl.offsetHeight; //暂时 设置为40px，mark！！

			if(config.wrapperObj != null)
			{
				config.wrapperObj.destroy();
				config.wrapperObj = null;
			}
			setTimeout(function () {
				var iScroll = require("iscroll");
				config.wrapperObj = new iScroll(config.wrapper[0], {
					hScroll: false, //是否水平滚动
					hScrollbar: false, //是否显示水平滚动条
					vScrollbar: !config.isPagingType, //是否显示垂直滚动条
					topOffset: pullDownOffset,
					onBeforeScrollStart:function (e) {/*
						var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
				    	if(nodeType !='select'&& nodeType !='option'&& nodeType !='input'&& nodeType!='textarea') 
				    		e.preventDefault();
				    		
				    		if(iBrowser.pc || iBrowser.uc || iBrowser.qq){e.preventDefault();}
					*/},
					onRefresh: function() {
						if (pullDownEl.className.match('visc_pullDown visc_loading')) {
							pullDownEl.className = 'visc_pullDown';
							pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '下拉加载上一页';
							pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
						} else if (pullUpEl.className.match('visc_pullUp visc_loading')) {
							pullUpEl.className = 'visc_pullUp';
							pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '上拉加载下一页';
							pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
						}
					},
					onScrollMove: function() {
						if(config.isPagingType || (!config.isPagingType && config.visibleHeight > config.wrapper.find('.visc_scroller').height()))
						{
							if(this.distY > 50 && this.absDistY > (this.absDistX + 5 ) ) {
								pullDownEl.className = 'visc_pullDown visc_flip';
								pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '释放可以更新';
								pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
								this.minScrollY = 0;
						    }
							else if(this.distY > 0 && this.distY < 50 && this.absDistY > (this.absDistX + 5 ) )
							{
								pullDownEl.className = 'visc_pullDown';
								pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '下拉加载上一页';
								pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
								this.minScrollY = -pullDownOffset;
							}
							else if(this.distY < -50 &&  this.absDistY > (this.absDistX + 5 ) ) {
								pullUpEl.className = 'visc_pullUp visc_flip';
								pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '释放可以更新';
								pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
								this.maxScrollY = this.maxScrollY;
						    }
							else if(this.distY < 0 && this.distY > -50 &&  this.absDistY > (this.absDistX + 5 ) )
							{
								pullUpEl.className = 'visc_pullUp';
								pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '上拉加载下一页';
								pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
								this.maxScrollY = pullUpOffset;
							}
						}
						else
						{
							if (this.y > 5 && !pullDownEl.className.match('visc_pullDown visc_flip')) {
								pullDownEl.className = 'visc_pullDown visc_flip';
								pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '释放可以更新';
								pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
								this.minScrollY = 0;
							} else if (this.y < 5 && pullDownEl.className.match('visc_pullDown visc_flip')) {
								pullDownEl.className = 'visc_pullDown';
								pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '下拉加载上一页';
								pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
								this.minScrollY = -pullDownOffset;
							} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('visc_pullUp visc_flip')) {
								pullUpEl.className = 'visc_pullUp visc_flip';
								pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '释放可以更新';
								pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
								this.maxScrollY = this.maxScrollY;
							} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('visc_pullUp visc_flip')) {
								pullUpEl.className = 'visc_pullUp';
								pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '上拉加载下一页';
								pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
								this.maxScrollY = pullUpOffset;
							}
						}
					},
					onScrollEnd: function() {
						if (pullDownEl.className.match('visc_pullDown visc_flip')) {
							pullDownEl.className = 'visc_pullDown visc_loading';
							pullDownEl.querySelector('.visc_pullDownLabel').innerHTML = '加载数据中...';	
							pullDownEl.querySelector('.visc_pullDownTime').innerHTML = new Date().format("HH:mm:ss");
							pullAction("down",config.wrapper);
						} else if (pullUpEl.className.match('visc_pullUp visc_flip')) {
							pullUpEl.className = 'visc_pullUp visc_loading';
							pullUpEl.querySelector('.visc_pullUpLabel').innerHTML = '加载数据中...';	
							pullUpEl.querySelector('.visc_pullUpTime').innerHTML = new Date().format("HH:mm:ss");
							pullAction("up",config.wrapper);
						}
					}
				});
			}, 0);
			
			setTimeout(function () {config.wrapper[0].style.left = '0';}, 200);
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
	module.exports = VIscroll;
});