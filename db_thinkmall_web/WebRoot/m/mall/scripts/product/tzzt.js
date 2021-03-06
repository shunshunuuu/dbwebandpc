define(function(require, exports, module) {
	var _pageId = "#product_tzzt "; // 页面id
	var pageCode = "product/tzzt";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var tool = require("tool");
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
	require("mall/scripts/common/plugins/swiperEvent");
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}
	
	function init() {
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		
		// 底部导航
		common.footerTab(_pageId);
		
		
		//闲钱理财
		xqlcProduct();
		
		//查询数据字典
		queryMotifType();
		
	}
	/*
	 * 获取产品类型所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "product_catogory" 
		}
		
		service.queryEnum(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						var result = data.results[i];
						var item_id = result.item_id; // 值编号 
						var item_name = result.item_name; // 项目名
						var item_value = result.item_value; // 项目值
						var enumTemp = {
								"itemValue" : item_value,
								"itemName" : item_name,
								"itemId" : item_id
							}
						pageGlobal.enumData.push(enumTemp);
					}
					//闲钱理财
					xqlcProduct();
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 查询数据字典
	 */
	function queryenum(key){
		var enumData = pageGlobal.enumData;
		for (var i = 0; i < enumData.length; i++) {
			var item = enumData[i];
			if (item.itemValue == key) {
				return item.itemName;
			}
		}
	}
	
	function xqlcProduct(){
		var xqlcProductFun = function(result){
			var xqlcEle = $(_pageId+"#xqlc").empty();
			
			if(result.length > 0){
				for(var i = 0; i < result.length; i++){
					var item = result[i];
					var productName = item.product_name; // 产品名称
					var productSubType = item.product_sub_type; // 产品类型
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
					var yield1 = parseFloat(yieldrate1m).toFixed(2);
					var currentPrice = item.current_price || "0"; // 单位净值
					var dwjz = parseFloat(currentPrice).toFixed(4);
					productName = putils.delProSpecialStr(productName);
					var qgjg = item.per_buy_limit;
					var cplb = item.fund_type;
					cplb = queryenum(cplb);
					var reason = item.recommend_reason;
					var str = new Array();
					str = reason.split(" ");
					var zhutione = str[0];
					var zhutitwo = str[1];
					
					
		           var  itemHtml='<div class="pl_two" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">'+
					   '<div class="plin">'+
				         '<div class="plin_l"><s></s>'+
					       '<p class="sp01">'+zhutione+'</p>'+
					       '<p class="sp02">'+zhutitwo+'</p>'+
					       '<p class="sp03"><span class="san01">'+cplb+'</span>'+
					       '<span class="san02">'+qgjg+'</span></p>'+
				         '</div>'+
				         '<div class="plin_r">'+
					         '<p class="sp01">'+yield1+'<span>%</span></p>'+
					         '<p class="sp02">近一个月收益率</p>'+
				         '</div>'+
			          '</div>'+
			        '</div>';
					
					xqlcEle.append(itemHtml);
				}
			}
		
			// 绑定详情事件
			appUtils.bindEvent(_pageId + ".pl_two", function(){
				var curEle = $(this);
				productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
			});
		}
		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_INDEX_TZZT;
		queryRecomProductByType(recommendType, xqlcProductFun);
	}
	
	
	
	/*
	 * 根据推荐类型查询推荐产品
	 * @param recommendType 推荐类型。
	 * @param callBackFun 查询成功后回调函数。
	 * @param 查询失败或结果为空时回调函数。
	 */ 
	function queryRecomProductByType(recommendType, callBackFun) {
		var param = {
			"recommend_type" : recommendType
		};

		service.queryRecomProduct(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == "0") {
				var result = data.results;
				
				if (result && result.length > 0) {
					// 数据处理函数
					callBackFun(result);
				}
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	};
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		if (productCode == global.product_code) {
			// 现金管家
			appUtils.pageInit(pageCode, "account/cashbutler/detail", {});
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};
	

	

	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});