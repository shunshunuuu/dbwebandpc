/**
 * 绑卡失败
 */
define(function(require, exports, module) {
	var _pageId = "#register_bankCardError "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 提示工具类

	/* 初始化 */
	function init() {
		var pageInParam  = appUtils.getPageParam();
		var error_info = pageInParam.error_info; 
		$(_pageId + " #error_info").html("失败原因:" + error_info);
	}

	function bindPageEvent() {

		/* 绑定返回事件 */
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
		/* 返回银行卡 */
		appUtils.bindEvent(_pageId + "#backBank", function() {
			appUtils.pageInit("register/bankCardError","account/myBankCard");
		});
		
		/* 前往投资 */
		appUtils.bindEvent(_pageId + "#toInvest", function() {
			appUtils.pageInit("register/bankCardError","finan/index");
		});

		// 继续
		appUtils.bindEvent(_pageId + ".sub_btn", function() {
			if(!$(_pageId + "#checkbox_1").prop("checked")){
				layerUtils.iAlert("请仔细阅读以上协议内容");
				return false;
			}
			
			appUtils.pageBack();
		});

	}

	function destroy() {
		
	}

	var bankCardError = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = bankCardError;

});