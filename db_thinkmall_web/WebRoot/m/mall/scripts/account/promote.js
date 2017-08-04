 /**
  * 我要推广(用户中心)
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_promote "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
			"userId" : "", // 用户编号
			"curPage" : 1, 	// 当前页
			"maxPage" : 0  // 最大页数
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".login_page"));
		
		// 底部导航
		common.footerTab(_pageId);
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		// 返回用户中心
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var myIntegral = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myIntegral;
});