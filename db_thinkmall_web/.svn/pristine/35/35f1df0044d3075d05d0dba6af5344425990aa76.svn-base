 /**
  * 支付成功
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_buySuccess "; // 页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类

	/*
	 * 初始化
	 */
	function init(){
		
		fillOrderInfo();
	}
	
	/*
	 * 填充订单信息
	 */
	function fillOrderInfo(){
		var product_name=appUtils.getPageParam("product_name");
		var order_id=appUtils.getPageParam("order_id");
		var tot_price = appUtils.getPageParam("tot_price");
		
		$(_pageId + "#productName").html(product_name);
		$(_pageId + "#orderId").html(order_id);
		$(_pageId + "#totPrice").html(common.fmoney(tot_price,2));
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("finan/buySuccess", "finan/market", {});
		});
		
		//返回首页
		appUtils.bindEvent(_pageId + "#returnIndex",function(){
			appUtils.pageInit("finan/buySuccess", "main", {});
		});
		
		//查看订单
		appUtils.bindEvent(_pageId + "#viewOrder",function(){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "finan/realBuy") {
				appUtils.pageInit("finan/buySuccess", "account/myOrder", {});
			} else {
				appUtils.pageInit("finan/buySuccess", "account/realOrder", {});
			}
			
		});
		
	}
		
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var buySuccess = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = buySuccess;
});