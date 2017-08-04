 /**
  * 理财首页
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_fundMore "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var service = require("mobileService"); //服务类
	var VIscroll = require("vIscroll");
	var common = require("common"); // 公共类
	var putils = require("putils");
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象

	var product_id = ""; // 产品编号
	var productCode = ""; //  产品代码
	var yieldrate1m = ""; // 1个月收益率
	var yieldrate3m = ""; // 3个月收益率
	var yieldrate6m = ""; // 6个月收益率
	var yieldrate1y = ""; // 1年收益率
	var productStatus = ""; // 产品状态
	var followNum = "0"; // 关注数量
	
	/*
	 * 初始化
	 */
	function init(){
		product_id = appUtils.getPageParam("product_id");
		
		//防止直接跳到详情页面
		if(product_id==null)
		{
			layerUtils.iMsg(1, "数据加载错误！");
			appUtils.pageInit("finan/historyPrice", "main", {});
			return false;
		}
		
		fundInfo();
	}
	
	/*
	 * 基金详情
	 */
	function fundInfo(){
		var param = {
				"product_id" : product_id,
				"user_id" : common.getUserId()
		};
		service.fundInfo(param, function(data){
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
				var invest_objective = result.invest_objective; 
				var invest_scope = result.invest_scope; 
				var benchmark = result.benchmark; 
				var custodian = result.custodian; 
				
				$(_pageId + "#invest_objective").html(invest_objective);
				$(_pageId + "#invest_scope").html(invest_scope);
				$(_pageId + "#benchmark").html(benchmark);
				$(_pageId + "#custodian").html(custodian);
				$(_pageId + "#productAbbr").html(productAbbr);
				
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
				
				if (validatorUtil.isNotEmpty(followId)) {
					$(_pageId + "#followNumHead").html('<i class="heart_icon att_icon"></i>' + followNum);
				} else {
					$(_pageId + "#followNumHead").html('<i class="heart_icon"></i>' + followNum);
				}
				
				$(_pageId + "#productName").html(productName);
				$(_pageId + "#current_price").html(currentPrice);
				$(_pageId + "#status").html(putils.productStatus(productStatus));
				// 推荐等级
//				switch (recommendDegree) {
//				case "1":
//					$(_pageId + "#recommendDegree").addClass("level1");
//					break;
//				case "2":
//					$(_pageId + "#recommendDegree").addClass("level2");
//					break;
//				case "3":
//					$(_pageId + "#recommendDegree").addClass("level3");
//						break;
//				case "4":
//					$(_pageId + "#recommendDegree").addClass("level4");
//					break;
//				case "5":
//					$(_pageId + "#recommendDegree").addClass("level5");
//					break;
//				default:
//					$(_pageId + "#recommendDegree").addClass("level1");
//					break;
//				}
				switch (riskLevel) {
				
				case "1":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("agreen");
					break;
					
				case "2":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("agreen");
					break;
					
				case "3":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("aorange");
					break;
					
				case "4":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("aorange");
					break;
					
				case "5":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("ared");
					break;
					
				case "6":
					$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel)).removeClass().addClass("ared");
					break;

				default:
					break;
				}
				$(_pageId + "#risk_level").html(putils.riskLevel(riskLevel));
				$(_pageId + "#product_code").html(productCode);
				$(_pageId + "#followNum").html(followNum);
				$(_pageId + "#risk_level_tz").html(putils.riskLevel(riskLevel));
				$(_pageId + "#status_detail").html(putils.productStatus(productStatus));
				$(_pageId + "#per_buy_limit").html(perBuyLimit + "元起购");
				$(_pageId + "#perBuyLimit").html(perBuyLimit);
//				$(_pageId + "#purchase_rates").html(purchase_rates).parent().parent().show();
				$(_pageId + "#fund_type").html(fundTypeName);
//				$(_pageId + "#share_type").html(share_type).parent().parent().show();
				$(_pageId + "#found_time").html(foundTime.substring(0,11));
				
				yieldrate1m = parseFloat(yieldrate1m).toFixed(2);
				$(_pageId + "#yieldrateForDate").html('月涨跌幅(%):' + yieldrate1m);
				$(_pageId + "#incomeunit").html(yieldrate1m);
				$(_pageId + "#incomeunitDesc").html("近一个月涨跌幅(%)");
				
				// 关注/取消关注
				appUtils.bindEvent(_pageId + "#followNumHead", function(){
					var childEle = $(this).find("i");
					if (childEle.hasClass("att_icon")) {
						// 取消关注
						attentionProduct(0, productId, 0);
					} else {
						// 关注
						attentionProduct(1, productId, 0);
					}
				}, 'click');
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