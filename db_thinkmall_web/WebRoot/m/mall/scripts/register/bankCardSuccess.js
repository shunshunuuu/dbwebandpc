/**
 * 绑卡成功
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 提示工具类
	var _pageId = "#register_bankCardSuccess ";

	/* 初始化 */
	function init() {
		initView(); // 初始化页面
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var risk_level = JSON.parse(userInfo).risk_level;
		if(risk_level && risk_level.length > 0){
			var riskName = appUtils.getPageParam("riskName") || "保守型"; // 等级
			$(_pageId + "#riskDesc").html("您的当前风险承受能力等级为" + riskName);
		}else{
			$(_pageId + "#riskDesc").html("您的风险承受能力默认为保守型");
		}
	}

	function bindPageEvent() {

		/* 绑定返回事件 */
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});backBank
		
		/* 返回银行卡 */
		appUtils.bindEvent(_pageId + "#backBank", function() {
			appUtils.pageInit("register/bankCardSuccess","account/myBankCard");
		});
		
		/* 前往投资 */
		appUtils.bindEvent(_pageId + "#toInvest", function() {
			appUtils.pageInit("register/bindBankCard","finan/index");
		});
		
		/* 重新风险测评 */
		appUtils.bindEvent(_pageId + ".again_btn", function() {
			appUtils.pageInit("register/bindBankCard","register/riskAssessment");
		});

	}

	function destroy() {
		
	}

	var bankCardSuccess = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = bankCardSuccess;

});