 /**
  * 签到
  * @author wangwz
  */
define(function(require, exports, module){ 
	var _pageId = "#active_active "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var tool = require("tool");
	/*
	 * 初始化
	 */
	function init(){
		
	}
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		$('#scroll_vertical_news').scrolldirection({
		    scrollLine:1, //每次滚动一行，默认滚动一行
		    scrollDirection:'up',//滚动方向，默认是up(向上),也可以传left（向左）
		    scrollSpeed:500,//滚动速度，默认是500毫秒
		    scorllTimer:3000 //滚动时间间隔，默认3000毫秒
		});//调用方法
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var activeSignIn = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = activeSignIn;
});