 /**
  * 理财产品详情
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_orderDetail "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	
	/*
	 * 初始化
	 */
	function init(){
		
		//初始化页面
		initView();
		
		var orderId = appUtils.getPageParam("order_id");
		
		// 防止直接跳到详情页面
		if(orderId == null){
			layerUtils.iMsg(1, "数据加载错误！");
			appUtils.pageInit("account/orderDetail", "main", {});
			return false;
		}
		
		// 理财详情
		orderInfo(orderId);
		
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
	
		/*
		 * 清理页面显示的属性值 
		 */
		
		$(_pageId + "#productName").html("");
		$(_pageId + "#orderId").html("");
		$(_pageId + "#productCode").html("");
		$(_pageId + "#businessType").html("");
		$(_pageId + "#totPrice").html("");
		$(_pageId + "#updateTime").html("");
	
	}
	
	/*
	 * 订单详情
	 */
	function orderInfo(orderId){
		var param = {
				"order_id" : orderId,
				"user_id" : common.getUserId()
		};
		service.queryFinancialOrderDetail(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var orderId = result.order_id; // 订单编号
				var productName = result.product_name; // 产品名称
				var productCode = result.product_code; // 产品代码
				var businessType = result.business_type; // 业务类型，0认购;1申购;2赎回;3买入;4卖出;5产品登记
				var totPrice = common.fmoney(result.tot_price,2); // 订单价格
				var updateTime = result.update_time; // 更新时间
				var orderState = result.order_state; // 订单状态
				var error_msg = result.error_msg; // 错误信息
				
				$(_pageId + "#productName").html(productName);
				$(_pageId + "#orderId").html(orderId);
				$(_pageId + "#productCode").html(productCode);
				$(_pageId + "#businessType").html(common.getBusinessTypeName(businessType));
				$(_pageId + "#totPrice").html(totPrice+"元");
				$(_pageId + "#updateTime").html(updateTime);
				if(orderState == "3"){
					$(_pageId + "#orderState").html(common.getOrderStateName(orderState)+"(" + error_msg + ")");
				}else{
					$(_pageId + "#orderState").html(common.getOrderStateName(orderState));
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
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
				//appUtils.pageInit("account/orderDetail", "account/myOrder", {});
			appUtils.pageBack();
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
	}
	
	var orderDetail = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = orderDetail;
});