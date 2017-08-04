 /**
  * 图文详情
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_pictureDetails "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类

	/*
	 * 初始化
	 */
	function init(){
		var productId = appUtils.getPageParam("product_id");
		queryProductDetails(productId)
	}
	
	/*
	 * 查询活动产品详情
	 */
	function queryProductDetails(productId){
		var reqParam = {
			"product_id" : productId
		};
		service.activePdtDetail(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					$(_pageId + ".pro_graphic_det").html(item.product_detail);
				}
				
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
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var pictureDetails = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = pictureDetails;
});