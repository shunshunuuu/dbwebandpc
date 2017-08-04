 /**
  * 现金管家开通页（现金管家详情的开通页面）
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_balance_openDetail "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var gconfig = require("gconfig");
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var global = gconfig.global; // 全局对象
	var	platform = gconfig.platform; // 渠道
	var constants = require("constants");// 常量类
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"open_type" : "" // 开通类型 1-现金管家 0-快取开通
	};

	/*
	 * 初始化
	 */
	function init(){
		var productId = appUtils.getPageParam("product_id");
		if(productId){
			pageGlobal.open_type = 1;
			queryContract(productId);
			userAsset();
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
		var fundAccount = JSON.parse(userInfo).fund_account; // 资金账号
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
						var withdrawCash = common.fmoney(results[i].useable_money, 2); // 可用金额
						var fundMoney = common.fmoney(results[i].stock_money, 2); // 证券市值
						totalMoney = common.fmoney(results[i].total_money, 2); // 总金额
						$(_pageId + "#kyje").html(withdrawCash);
					}
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}
	
	/**
	 * 协议查询
	 * contract_type : 协议类型
	 */
	function queryContract(product_id){
		var param = {
				"product_id" : product_id,
				"agreement_id" : "",
				"contract_type" : ""
		};
		service.queryContract(param,function(data){
			if(data.error_no == "0"){
				var results = data.results;
				var agreementUlEle = $(_pageId + "#agreementUl").empty();
				// 判断是否开通W权限
/*				var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
				var client_rights = JSON.parse(userInfo).client_rights; // 获取资金账号
				if(client_rights.indexOf("W") == -1){
					$(_pageId + "#agreementUl").append('<li><a href="http://www.nesc.cn/risktext4.jsp" data-id=""  data-title=""  data-url="">《证券投资基金投资人权益须知》</a></li>');
					layerUtils.iAlert("您还未开通基金代销权限请阅读《证券投资基金投资人权益须知》并同意开通");
				}*/
				for (var i  =0; i < results.length; i++){
					var item = results[i];
					var agreementId = item.agreement_id;
					var agreementTitle = item.agreement_title;
					var url = item.url;
					var itemHtml = '<li>' + 
									'	<a href="'+url+'" data-id="'+agreementId+'" data-title="'+agreementTitle+'"  data-url="'+url+'">《'+agreementTitle+'》</a>' + 
									'</li>';
					agreementUlEle.append(itemHtml);
					
//					if (item.contract_type == constants.contractType.CONTRACT) {
//						// 产品协议书
//						var productContractEle = $(_pageId + "#productContract");
//						productContractEle.attr("data-id", item.agreement_id);
//						productContractEle.attr("data-title", item.agreement_title);
//						//productContractEle.attr("data-url", item.url);
//						productContractEle.attr("href", item.url);
//						
//					} else if (item.contract_type == constants.contractType.RISK_BOOK){
//						// 风险揭示书
//						var riskDisclosureEle = $(_pageId + "#riskDisclosure");
//						riskDisclosureEle.attr("data-id", item.agreement_id);
//						riskDisclosureEle.attr("data-title", item.agreement_title);
//						//riskDisclosureEle.attr("data-url", item.url);
//						riskDisclosureEle.attr("href", item.url);
//						
//					} else {
//						continue;
//					}
				}
				
			}else{
				layerUtils.iMsg(-1,data.error_info);
	    		return false;
			}
		});
	}
	
	/*
	 * 开通现金管家
	 */
	function productRegister(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var fundAccount = JSON.parse(userInfo).fund_account;
		var recomCode = appUtils.getSStorageInfo("recomCode");
		var param = {
			"type" : "0", // 产品登记
			"fund_account" : fundAccount,
			"product_code" : global.product_code_balance,
			"tot_price" : 10, // 登记金额
			"order_channel" : platform,
			"money_type" : "0", // 币种 0 人民币
			"recom_code" : recomCode // 首次开通现金宝产品登记需要存产品推荐人
		}
		
		service.productRegister(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					var is_risk = item.is_risk; // 风险测评等级返回结果
					if (is_risk == "1" || is_risk == "") { // 开通成功， 跳转到成功页面
						appUtils.pageInit("account/balance/openDetail", "account/balance/detail", {"isOpen" : true});
						return false;
					} else { // 开通失败，风险测评等级不符合
						var pageInitParam = appUtils.getPageParam();
						pageInitParam.backPage = "account/balance/openDetail";
						switch(Number(is_risk)){
							case 0:
								layerUtils.iMsg(-1,"您还未进行风险测评！");
								appUtils.pageInit("account/balance/openDetail", "register/riskAssessment", pageInitParam);
								break;
							case 2:
								layerUtils.iMsg(-1,"您的风险等级低于产品风险等级！");
								appUtils.pageInit("account/balance/openDetail", "register/riskAssessment", pageInitParam);
								break;
							case 3:
								layerUtils.iMsg(-1,"您的风险测评已过期！");
								appUtils.pageInit("account/balance/openDetail", "register/riskAssessment", pageInitParam);
								break;
							default:
								break;
						}
					}
				}
				
			}else{
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/**
	 * 现金管家开通W权限
	 */
	function openCashTakingW(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var fundAccount = JSON.parse(userInfo).fund_account;
		var user_id = JSON.parse(userInfo).user_id;
		var param = {
				"user_id" : user_id,
				"agreement_id" : constants.contractType.FUND_DISTRIBUTION
			}
			
			service.openCashTakingW(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				
				if(error_no == "0"){
					var results = data.results[0];
					productRegister();
				}else{
					layerUtils.iMsg(-1, error_info);
					return false;
				}
			});
	}
	
	/**
	 * 现金管家快速取现
	 */
	function queryCashTaking(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var fundAccount = JSON.parse(userInfo).fund_account;
		var param = {
				"type" : "1", // 操作类型 0查询 1开通
				"fund_account" : fundAccount
			}
			
			service.queryCashTaking(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				
				if(error_no == "0"){
					var results = data.results[0];
					layerUtils.iAlert("快速取现开通成功！");
					appUtils.pageInit("account/balance/openDetail", "account/balance/detail", {});
				}else{
					layerUtils.iMsg(-1, error_info);
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
			appUtils.pageInit("account/balance/openDetail", "account/balance/detail", {});
		});
		
		// 取现页面
		appUtils.bindEvent(_pageId + "#take", function(){
			appUtils.pageInit("account/balance/openDetail", "finan/cashTaking", {});
		});
		
		// 勾选协议按钮
		appUtils.bindEvent(_pageId + "#checkbox_agreement", function(){
			if($(this).attr("class") != "on"){
				$(this).addClass("on");
			}else{
				$(this).removeClass("on");
			}
		});

		// 继续按钮
		appUtils.bindEvent(_pageId + "#next", function(){
			if(pageGlobal.open_type && pageGlobal.open_type == "1"){
				if($(_pageId + "#checkbox_agreement").attr("class") != "on"){
					layerUtils.iAlert("请阅读相关协议书！");
					return false;
				}
//				openCashTakingW(); // 开通W权限
				productRegister();
			}else{
				var userInfo = appUtils.getSStorageInfo("userInfo");
				var client_rights = JSON.parse(userInfo).client_rights;
				if(client_rights == "" || client_rights == null){
					layerUtils.iAlert("您尚未签署电子签名约定书，请先至我司官网网上营业厅或营业部柜台签署");
					return false;
				}
				queryCashTaking();
			}
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var balanceOpenDetail = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = balanceOpenDetail;
});