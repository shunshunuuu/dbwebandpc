 /**
  * 超值兑换
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_valueExchange "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var gconfig = require("gconfig"); // 全局配置对象
	var global = require("gconfig").global; // 全局配置对象
	var putils = require("putils");
	var productId = "";
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"surplusAmount" : "", // 产品在活动期剩余库存
		"now_time" : "", // 服务器时间
		"totalMoney" : "" // 总资产
	};
	
	/*
	 * 初始化
	 */
	function init(){
		getServerTime(); // 获取服务器时间
		
		// 处理ios滚动问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + "#pageContent"));
		
		productId  = appUtils.getPageParam("product_id"); // 活动编号
		
		if (!productId) {
			appUtils.pageInit("active/valueExchange", "active/index", {});
			return false;
		}
		initView();
		userAsset();
		queryProductDetails(productId); // 查询活动详情
	}
	
	/**
	 * 获取服务器时间
	 */
	function getServerTime(callBack){
		service.getServerTime({}, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					pageGlobal.now_time = item.now_time; // 服务器时间
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/**
	 * 初始化页面
	 */
	function initView(){
		
		$(_pageId + "#productImg").attr("src", "");
		$(_pageId + "#actPdtName").html("");
		$(_pageId + "#productIntegral").html("");
		$(_pageId + "#productDetail").html("");
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
					var productId = item.product_id; // 产品编号
					var imgUrl = item.logo_url; // 图片地址
					imgUrl = global.url + '/mall' + imgUrl;
					var actPdtName = item.product_name; // 产品名称
					var actIntegral = item.act_integral; // 活动积分【优先用活动积分】
					var productIntegral = item.product_integral; // 活动所需积分
					
					var perProductTotAmount = item.per_product_tot_amount; // 产品在活动期最多能卖多少个
					if (validatorUtil.isNotEmpty(perProductTotAmount)) {
						// 如果产品活动期限制购买数不为空时，目标份额取该字段值
						productAmount = perProductTotAmount;
					}
					
					var soldAmount = item.sold_amount || "0"; // 已售数量
					
					pageGlobal.surplusAmount = parseInt(productAmount) - parseInt(soldAmount); // 剩余数量
					
					if (validatorUtil.isEmpty(actIntegral)) {
						actIntegral = productIntegral;
					}
					var intergralShow = actIntegral + '东北米'; // 所需积分展示
					
					var discountIntegral = ""; // 折扣价
					if (discountIntegral) {
						intergralShow = discountIntegral + '东北米<span>' + actIntegral + '东北米</span>'
					}
					
					var productDetail = item.product_detail; // 产品简介
					
					$(_pageId + "#productImg").attr("src", imgUrl);
					$(_pageId + "#actPdtName").html(actPdtName);
					var bill = queryBill(pageGlobal.totalMoney); // 获取话费信息
					if(productId && productId == constants.active_product.product_gh){
						$(_pageId + "#productIntegral").hide();
					}else{
						$(_pageId + "#productIntegral").html(intergralShow).show();
					}
					$(_pageId + "#productDetail").html(productDetail);
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/* @time 2016年4月29日 15:22:47
	 * 获取话费金额
	 */
	function queryBill(totalMoney){
		var bill = "";
		if(totalMoney){
			if(parseFloat(totalMoney) > 10000 && parseFloat(totalMoney) < 100000){
				bill = "10";
				return bill;
			}else if(parseFloat(totalMoney) > 100000 && parseFloat(totalMoney) < 200000){
				bill = "20";
				return bill;
			}else if(parseFloat(totalMoney) > 200000 && parseFloat(totalMoney) < 500000){
				bill = "50";
				return bill;
			}else if(parseFloat(totalMoney) > 500000){
				bill = "100";
				return bill;
			}
		}else{
			bill = "0";
			return bill;
		}
	}
	
	/*
	 * 用户资产(1000181)
	 */
	function userAsset(){
		// 检验是否为理财用户
		if (pageGlobal.accountType && pageGlobal.accountType == "8") {
			return false;
		}
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		if(userInfo){
			var fundAccount = JSON.parse(userInfo).fund_account; // 资金账号
		}
		if (validatorUtil.isEmpty(fundAccount)) {
			return false;
		}
		var param = {
			"fund_account" : fundAccount
		};
		service.queryAsset(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				for (var i = 0; i < results.length; i++) {
					//0 是人民币，1 是港币，2 是美元
					if (results[i].money_type == "0") {
						pageGlobal.totalMoney = results[i].total_money; // 总金额
						var productId  = appUtils.getPageParam("product_id"); // 活动编号
						//queryProductDetails(productId); // 查询活动详情
						break;
					}
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}
	
	/*
	 * 判断用户是否可以兑换
	 */
	function isExchange(){
		
	}
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
//			appUtils.pageInit("active/valueExchange", "active/index", {});
			appUtils.pageBack();
		});
		
		// 立即兑换
		appUtils.bindEvent(_pageId + ".sub_btn", function(){
			if(productId && productId == constants.active_product.product_gh){
				// 是否资金账户登录
				if(common.checkUserIsLogin(true,false,"active/index")){
					// 判断是否是光华路营业部
					var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
					if(userInfo){
						var branch_no = JSON.parse(userInfo).branch_no; // 营业部编号
						var fundAccount = JSON.parse(userInfo).fund_account; // 判断资金账户、理财账户
						var create_time = JSON.parse(userInfo).create_time; // 用户创建时间
						create_time = putils.calSurplusTime(pageGlobal.now_time,create_time);
						if(branch_no == constants.active_product.branch_no_gh){
							if (parseFloat(fundAccount) > constants.active_product.fundAccount_gh) {
								if (parseFloat(create_time.day) < constants.active_product.time_gh) {
									appUtils.pageInit("active/valueExchange", "active/orderSure", {"product_id" : appUtils.getPageParam("product_id"),"activeType" : constants.activeType.ACTIVE_TYPE_OVERBALANCE,"surplusAmount" : pageGlobal.surplusAmount,"totalMoney" : pageGlobal.totalMoney});
								}else{
									layerUtils.iMsg(-1, "非新注册用户不能领取");
								}
							}else{
								layerUtils.iMsg(-1, "此活动仅限新开户客户");
							}
						}else{
							layerUtils.iMsg(-1, "此活动仅限光华路营业部参与");
						}
					}
				}
			}else{
				appUtils.pageInit("active/valueExchange", "active/orderSure", {"product_id" : appUtils.getPageParam("product_id"),"activeType" : constants.activeType.ACTIVE_TYPE_OVERBALANCE,"surplusAmount" : pageGlobal.surplusAmount,"totalMoney" : pageGlobal.totalMoney});
			}
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var valueExchange = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = valueExchange;
});