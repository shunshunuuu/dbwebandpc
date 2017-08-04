/**
 * 风险测评
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var gconfig = require("gconfig");
	var global = gconfig.global; // 全局对象
	var service = require("mobileService");// 业务层接口，请求数据
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var _pageId = "#register_riskAssSuccess "; // 页面ID
	var putils = require("putils");

	/* 初始化 */
	function init() {
		initSuccessResult();
		
		initView();
	}
	
	/*初始化页面*/
	function initView(){
		var pageParam = appUtils.getPageParam();
		var backPage = pageParam.backPage;
		if(backPage == "account/userCenter"){
			$(_pageId + "#continueBuy").html("返回个人中心");
		}else{
			$(_pageId + "#continueBuy").html("继续购买");
		}
	}

	function initSuccessResult(){
		var riskScore = appUtils.getPageParam("riskScore"); // 分数
		var riskName = appUtils.getPageParam("riskName"); // 等级
		var risk_level = appUtils.getSStorageInfo("risk_level"); // 风险等级
		switch (risk_level) {
		case "1":
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det round_det2");
			break;
			
		case "2":
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det");
			break;
			
		case "3":
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det round_det3");
			break;

		default:
			break;
		}
		$(_pageId + "#riskScore").html(parseFloat(riskScore).toFixed(1));
		$(_pageId + "#riskLevel").html(riskName);
		$(_pageId + "#riskDesc").html("您的当前风险等级为" + riskName);
	}
	
	function bindPageEvent() {
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId + ".back_btn"), function() {
			// 参数中携带返回页面时，需要返回到指定页面 ，否则返回到上一级页面
			var pageParam = appUtils.getPageParam();
			if (pageParam) {
				var backPage = pageParam.backPage;
				if (backPage) {
					appUtils.pageInit("register/riskAssSuccess", backPage, pageParam);
					return false;
				}
			}
			
			appUtils.pageBack();
		});
		
		/* 继续购买事件 */
		appUtils.bindEvent($(_pageId + "#continueBuy"), function() {
			// 参数中携带返回页面时，需要返回到指定页面 ，否则返回到上一级页面
			var pageParam = appUtils.getPageParam();
			if (pageParam) {
				var backPage = pageParam.backPage;
				if (backPage) {
					appUtils.pageInit("register/riskAssSuccess", backPage, pageParam);
					return false;
				}
			}
			
			appUtils.pageBack();
		});
		
		// 重新测评
		appUtils.bindEvent(_pageId + "#reEvaluation", function(){
			appUtils.pageInit("register/riskAssSuccess", "register/riskAssessment", appUtils.getPageParam());
		});

	}

	function destroy() {
		service.destroy();
	}

	var riskAssSuccess = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = riskAssSuccess;

});