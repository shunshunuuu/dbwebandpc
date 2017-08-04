 /**
  * 理财首页
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_finanMore "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var service = require("mobileService"); //服务类
	var VIscroll = require("vIscroll");
	var common = require("common"); // 公共类
	var putils = require("putils");
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象

	var pageGlobal = {
			"productId" : "", // 产品编号
			"productCode" : "", // 产品代码
			"productStatus" : "", // 产品状态
			"followNum" : "0", // 关注数量
			"fina_belongs" : "" // 理财归属
		};
	
	/*
	 * 初始化
	 */
	function init(){
		pageGlobal.productId = appUtils.getPageParam("product_id");
		
		//防止直接跳到详情页面
		if(pageGlobal.productId==null)
		{
			layerUtils.iMsg(1, "数据加载错误！");
			appUtils.pageInit("finan/finanMore", "main", {});
			return false;
		}
		
		finanInfo(pageGlobal.productId);
	}
	
	/*
	 * 理财详情
	 */
	function finanInfo(productId){
		var param = {
				"product_id" : productId,
				"user_id" : common.getUserId()
		};
		service.finanInfo(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var product_detail = result.product_detail; // 产品详情
				
				$(_pageId + "#product_detail").html(product_detail);
				
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var historyPrice = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = historyPrice;
});