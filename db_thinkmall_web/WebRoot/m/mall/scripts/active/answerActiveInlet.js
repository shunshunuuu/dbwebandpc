 /**
  * 答题活动 入口
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_answerActiveInlet "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"OpenID" : "" // 答题分数
	};

	/*
	 * 初始化
	 */
	function init(){
//		pageGlobal.OpenID = $.trim(appUtils.getPageParam("OpenID")); // 可以参加活动的用户OpenID
//		if(pageGlobal.OpenID == ""){
//			location.href = "http://mp.weixin.qq.com/s?__biz=MzI5MDAwNTY0Mg==&mid=401837648&idx=1&sn=d02eec29a79a9fff082368d396e88271&from=singlemessage&isappinstalled=0#wechat_redirect";
//		}
		initView(); // 初始化页面
	}
	
	function initView(){
		 $(_pageId + "#overlay").hide();
		 $(_pageId + "#ruleValue").hide();
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 速去挑战
		appUtils.bindEvent(_pageId + "#dekaron", function(){
			appUtils.pageInit("active/answerActiveInlet", "active/answerActive", {"OpenID":pageGlobal.OpenID});
		});
		
		// 活动规则
		appUtils.bindEvent(_pageId + "#rule", function(){
			 $(_pageId + "#overlay").show();
			 $(_pageId + "#ruleValue").show();
		});
		
		// 关闭活动规则
		appUtils.bindEvent(_pageId + ".close_btn", function(){
			 $(_pageId + "#overlay").hide();
			 $(_pageId + "#ruleValue").hide();
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		// 离开页面时销毁定时任务
		if (pageGlobal.intervalTimer) {
			clearInterval(pageGlobal.intervalTimer);
		}
		pageGlobal = {};
	}
	
	var answerActiveInlet = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = answerActiveInlet;
});