/**
 * 基金风险揭示书
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils");
	var common = require("common");
	var layerUtils = require("layerUtils");
	var _pageId = "#register_agreement ";

	/* 初始化 */
	function init() {
		
		var pageParam = appUtils.getPageParam();
		var result = pageParam.results;
		if (result) {
//			result = JSON.parse(result);
			var title = result.agreement_title || "协议书";
			var content = result.agreement_content || "";
			$(_pageId + "#agreementTitle").html(title);
			$(_pageId + ".tips_book_txt").html(content);
		}
	}

	function bindPageEvent() {

		/* 绑定返回事件 */
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
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

	var agreement = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = agreement;

});