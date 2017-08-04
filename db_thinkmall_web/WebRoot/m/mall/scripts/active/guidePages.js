 /**
  * 活动引导页
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_guidePages "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"activeId" : "", // 活动编号
		"targetTime" : "2015/11/12 11:30:00" // 目标时间格式2015/11/06 18:00:00
	};

	/*
	 * 初始化
	 */
	function init(){
		
	}
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 马上注册
		appUtils.bindEvent(_pageId + ".rig_btn", function(){
			appUtils.pageInit("active/guidePages", "register/register", {});
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var guidePages = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = guidePages;
});