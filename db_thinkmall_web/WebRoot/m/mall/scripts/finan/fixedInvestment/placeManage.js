 /**
  * 定投下单
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_fixedInvestment_placeManage "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils");
	var dateUtils = require("dateUtils"); // 日历控件
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var global = require("gconfig").global; // 全局配置对象
	
	
	/*
	 * 初始化
	 */
	function init(){
		var config={
				"mode":"clickpick",
				"theme":"default"
		};
		dateUtils.initDateUI("finan_fixedInvestment_placeOrder",config);
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		
	}
	
	/*
	 * 基金详情
	 */
	function fundInfo(){
		var param = {
				"product_id" : productId,
				"user_id" : common.getUserId()
		};
		service.queryFundPlaceList(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var productAbbr = result.product_abbr; // 产品简称
				var productName = result.product_name; // 产品名称
				productStatus = result.product_status; // 产品状态
				var currentPrice = result.current_price; // 最新净值
				var cumulativeNet = result.cumulative_net; // 累计净值
				productCode = result.product_code; // 产品代码
				var riskLevel = result.risk_level;// 风险等级
				var fundTypeName = result.fund_type_name; // 产品类型
				var perBuyLimit = putils.setAmount(result.per_buy_limit); // 认购起点
//				var share_type = result.share_type; // 分红方式
				followNum = result.follow_num; // 产品关注数
				var productType = result.product_type; // 产品类型
				var productId = result.product_id; // 产品ID
				var followId = result.follow_id; // 关注编号
//				var recommendDegree = result.recommend_degree; // 推荐度
				
				yieldrate1m = result.yieldrate1m; // 1个月收益率
				yieldrate3m = result.yieldrate3m; // 3个月收益率
				yieldrate6m = result.yieldrate6m; // 6个月收益率
				yieldrate1y = result.yieldrate1y; // 1年收益率
				
				var foundTime = result.found_time; // 成立时间
				if (foundTime.indexOf(".") != -1) {
					foundTime = foundTime.substring(0, foundTime.indexOf("."));
				}
//				var purchase_rates = result.purchase_rates;// 申购费率
				productName = putils.delProSpecialStr(productName);
				if(productName.length > 18){
					productName = productName.substring(0, 17) + "...";
				}
				
				if(currentPrice == "" || currentPrice == "0"){
					currentPrice = "--";
				} else {
					currentPrice = parseFloat(currentPrice).toFixed(4);
				}
				
				
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	
	/*
	 * 校验产品是否能够购买
	 */
	function checkProductStatus(){
		if (productStatus != "0" && productStatus != "1" && productStatus != "2") {
			layerUtils.iMsg(-1, "该产品非购买时期");
			return false;
		}
		return true;
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
//				appUtils.pageInit("finan/detail", "finan/market", {});
		});
		
		// 分享二维码
		appUtils.bindEvent(_pageId + "#shareEwm", function(){
			
		});
	}
	
	/*
	 * 清理页面显示的属性值 
	 */
	function clearPage(){
		$(_pageId + "#followNumHead").html('<i class="heart_icon"></i>0');
		$(_pageId + "#productName").html("");
		$(_pageId + "#current_price").html("");
		$(_pageId + "#status").html("");
		$(_pageId + "#risk_level").html("");
		$(_pageId + "#product_code").html("");
		$(_pageId + "#followNum").html("");
		$(_pageId + "#risk_level_tz").html("");
		$(_pageId + "#status_detail").html("");
		$(_pageId + "#per_buy_limit").html("");
		$(_pageId + "#perBuyLimit").html("");
		$(_pageId + "#fund_type").html("");
		$(_pageId + "#found_time").html("");
		$(_pageId + "#yieldrateForDate").html('月涨跌幅(%):0');
		$(_pageId + "#incomeunit").html("");
		$(_pageId + "#container").html(""); 
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){

	}
	
	var finanDetail = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = finanDetail;
});