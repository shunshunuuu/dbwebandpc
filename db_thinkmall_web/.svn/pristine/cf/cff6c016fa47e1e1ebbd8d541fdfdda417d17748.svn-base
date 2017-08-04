/**
 * 删除银行
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 提示工具类
	var _pageId = "#register_delBankCard ";

	/* 初始化 */
	function init() {

	}

	function bindPageEvent() {

		/* 绑定返回事件 */
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});backBank
		
		/* 返回银行卡 */
		appUtils.bindEvent(_pageId + "#backBank", function() {
			appUtils.pageInit("register/bankCardSuccess","account/myBankCard",param);
		});
		
		/* 前往投资 */
		appUtils.bindEvent(_pageId + "#toInvest", function() {
			appUtils.pageInit("register/bindBankCard","finan/index",param);
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

	var delBankCard = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = delBankCard;

});