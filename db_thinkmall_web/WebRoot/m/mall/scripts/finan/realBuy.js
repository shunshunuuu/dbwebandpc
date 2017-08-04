 /**
  * 实时货币基金产品购买
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var gconfig = require("gconfig"); // 全局对象
	var global = gconfig.global; // 全局配置对象
//	var	platform = gconfig.platform; 
	var common = require("common"); // 公共类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils"); 
	var KeyPanel = require('keyPanel'); // 键盘插件 
	var myKeyPanel = new KeyPanel(); 
	var constants = require("constants");// 常量类
	var _pageId = "#finan_realBuy "; // 页面ID
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"order_id" : "", // 订单编号
		"pay_mode" : "", // 支付方式
		"external_account" : "", // 资金帐号
		"perBuyLimit" : "", // 认购起点
		"buy_add_pace" : "", // 布长
		"person_pace" : "", // 再次购买起点
		"fina_belongs" : "", // fina_belongs为5时为OTC产品
		"productCode" : "", // 产品代码
		"is_bought" : "", // 是否购买过
		"isOrder" : "", // 是否检查
		"product_sub_type" : "", //产品子类别
		"withdrawCash" : "", // 现金资产
		"register_corp_code" : "", // 基金公司code
		"exchange_name" : "", // 基金公司名称
		"product_id" : "", // 产品编号
		"client_no" : "", // 理财账户
		"sub_type" : "", // 产品类型
		"accountType" : "", // 判断资金账户、理财账户
		"bankNo" : "", // 银行编号
		"userRisk" : "", // 用户风险等级
		"productRisk" : "", // 用户风险等级
		"bankCard" : "", // 银行卡号
		"flag" : true, // 判断是否可以购买
		"buy_value" : "" // 购买金额
	};

	/*
	 * 初始化
	 */
	function init(){
		clearPage();
		pageGlobal.product_id = appUtils.getPageParam("product_id");
		pageGlobal.productCode = appUtils.getPageParam("product_code"); //获取订单编号
		pageGlobal.sub_type = appUtils.getPageParam("sub_type");
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		pageGlobal.userRisk = JSON.parse(userInfo).risk_level_txt; // 用户风险等级
		pageGlobal.external_account = JSON.parse(userInfo).fund_account; // 获取资金账号
		pageGlobal.client_no = JSON.parse(userInfo).client_no; // 理财账户
		pageGlobal.accountType = JSON.parse(userInfo).account_type; // 判断资金账户、理财账户
		
		// 校验用户是否登录
		var _loginInPageCode = "finan/buy";
		if (!common.checkUserIsLogin(true, true, _loginInPageCode, appUtils.getPageParam(), true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var client_rights = JSON.parse(userInfo).client_rights; // 获取资金账号
		if(client_rights.indexOf("e") == -1){
			layerUtils.iAlert("您尚未签署电子签名约定书，请先至我司官网网上营业厅或营业部柜台签署！");
			pageGlobal.flag = false;
		}
		var sub_type = appUtils.getPageParam("sub_type");
		var product_id = appUtils.getPageParam("product_id");
		getRealFinaById(); // 实时货币基金详情
		
		userAsset(); // 用户资产
		userBank(); // 查询用户持有的银行卡
		
		initView();// 初始化页面
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		$(_pageId + "#fundClient a").removeClass("act")
		if (pageGlobal.accountType && pageGlobal.accountType == "8") {
			pageGlobal.pay_mode = "2"; // 银行卡登录方式
			$(_pageId + "#fundClient a").eq(0).addClass("act");
			$(_pageId + ".amount_text").hide(); // 可用余额
			$(_pageId + "#bank_list").show(); // 银行卡
			return false;
		}else{
			$(_pageId + "#fundClient a").eq(1).addClass("act");
			$(_pageId + ".amount_text").show(); // 可用余额
			$(_pageId + "#bank_list").hide(); // 银行卡
		}
		$(_pageId + "#buyValue").css("line-height", "0.2rem");
	}
	
	/*
	 * 用户资产（1000181）
	 */
	function userAsset(){
		// 检验是否为理财用户
		if (pageGlobal.accountType && pageGlobal.accountType == "8") {
			return false;
		}
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var fundAccount = JSON.parse(userInfo).fund_account; // 资金账号
		if (validatorUtil.isEmpty(fundAccount)) {
			appUtils.pageInit("account/userCenter", "account/bindFundAccount", {});
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
						pageGlobal.withdrawCash = results[i].useable_money;// 现金资产
						var _withdrawCash = common.fmoney(results[i].useable_money,2) || "0"; // 现金资产
						$(_pageId + "#cash_assets").html(_withdrawCash);
						break;
					}
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}
	
	/*
	 * 产品是否购买过
	 */
	function isBuy(productId,sub_type){
		// 检验是否为理财用户
		if (pageGlobal.accountType && pageGlobal.accountType == "8") {
			return false;
		}
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId(),
			"product_id" : productId
/*			"product_code" : pageGlobal.productCode*/
		};
		service.isBuy(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				pageGlobal.is_bought = result.is_bought;// 0 未买过  1 买过
				if (sub_type == "0") {
					// 基金详情
					fundInfo(productId);
				} else if (sub_type == "1") {
					// 理财详情
					finanInfo(productId);
				}

			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
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
				var results= data.results;
				if (results.length > 0) {
					$(_pageId + ".check_box").show(); // 显示协议页面
					var allProtocolStr = "同意"; // 所有协议字符串
					for (var i  =0; i < results.length; i++){
						if(results[i].agreement_title != null && results[i].agreement_title != ""){
							allProtocolStr += '<a href="' + results[i].url + '" data-id="'+results[i].agreement_id+'" data-title="'+results[i].agreement_title+'" data-url="'+results[i].url+'">《'+results[i].agreement_title+'》</a>';
						}
					}
					$(_pageId+" #contact").html(allProtocolStr);
				} else {
					$(_pageId + ".check_box").hide();
				}
			}else{
				layerUtils.iMsg(-1,data.error_info);
	    		return false;
			}
		});
	}

	
	/*
	 * 实时货币基金详情(1000053)
	 */
	function getRealFinaById(productId){
		var param = {
				"type" : 0, // 0查询 1购买 2赎回
				/*"product_id" : product_id,*/
				"product_code" : pageGlobal.productCode
		};
		service.getRealFinaById(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var productName = result.product_name; // 产品名称
				var productCode = result.product_code; // 产品代码
				pageGlobal.perBuyLimit = result.per_buy_limit; // 认购起点
				pageGlobal.productRisk = result.risk_level; // 产品风险等级
				var currentPrice = result.current_price; // 净值
				pageGlobal.buy_add_pace = result.buy_add_pace; // 布长
				pageGlobal.person_pace = result.person_pace; // 再次购买起点
				pageGlobal.product_sub_type = result.product_sub_type; // 产品子类别
				pageGlobal.fina_belongs = result.fina_belongs; // fina_belongs为5时为OTC产品 
				pageGlobal.register_corp_code = result.register_corp_code; // 基金公司code
				pageGlobal.exchange_name = result.manager_name || result.ta_code_txt; // 基金公司名称
				
//				if(pageGlobal.is_bought == "0"){ // 判断是否首次购买
//					var placeFirst = "起购金额 :" + putils.setAmount(pageGlobal.perBuyLimit) + "  追加金额:" + putils.setAmount(pageGlobal.buy_add_pace);
//					$(_pageId + "#buyValue").attr("placeholder",placeFirst);
//				}else{
//					var placeNext = "起购金额 :" + putils.setAmount(pageGlobal.person_pace) + "  追加金额:" + putils.setAmount(pageGlobal.buy_add_pace);
//					$(_pageId + "#buyValue").attr("placeholder",placeNext);
//				}
				
				if(pageGlobal.fina_belongs && pageGlobal.fina_belongs != "2" || pageGlobal.fina_belongs != "5"){
					// 判断是否开通W权限
					var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
					var client_rights = JSON.parse(userInfo).client_rights; // 获取资金账号
					if(client_rights.indexOf("W") == -1){
						$(_pageId + "#contact").append('<a href="http://www.nesc.cn/risktext4.jsp" id="riskBook">《证券投资基金投资人权益须知》</a>');
						$(_pageId + ".check_box").show();
						layerUtils.iAlert("您还未开通基金代销权限请阅读《证券投资基金投资人权益须知》并同意开通");
					}else{
						$(_pageId + ".check_box").hide();
					}
				}
				
				// 如果净值为空显示为0
				if(validatorUtil.isEmpty(currentPrice)){
					currentPrice = "0";
				}
				productName = putils.delProSpecialStr(productName);
				$(_pageId + "#product_name").html(productName + "" + productCode + "");
				$(_pageId + "#earnings").html(parseFloat(currentPrice).toFixed(3));
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 基金详情
	 */
	function fundInfo(product_id){
		var param = {
				"product_id" : product_id
		};
		service.fundInfo(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var productName = result.product_name; // 产品名称
				var currentPrice = result.current_price; // 最新净值
				var productCode = result.product_code; // 产品代码
				pageGlobal.perBuyLimit = result.per_buy_limit; // 认购起点
				pageGlobal.productRisk = result.risk_level; // 产品风险等级
				pageGlobal.buy_add_pace = result.buy_add_pace; // 布长
				pageGlobal.person_pace = result.person_pace; // 再次购买起点
				pageGlobal.register_corp_code = result.register_corp_code; // 基金公司code
				pageGlobal.exchange_name = result.manager_name || result.ta_code_txt; // 基金公司名称
				
				if(pageGlobal.is_bought == "0"){ // 判断是否首次购买
					var placeFirst = "起购金额 :" + putils.setAmount(pageGlobal.perBuyLimit) + "  追加金额:" + putils.setAmount(pageGlobal.buy_add_pace);
					$(_pageId + "#buyValue").attr("placeholder",placeFirst);
				}else{
					var placeNext = "起购金额 :" + putils.setAmount(pageGlobal.person_pace) + "  追加金额:" + putils.setAmount(pageGlobal.buy_add_pace);
					$(_pageId + "#buyValue").attr("placeholder",placeNext);
				}
				
				// 判断是否开通W权限
				var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
				var client_rights = JSON.parse(userInfo).client_rights; // 获取资金账号
				if(client_rights.indexOf("W") == -1){
					$(_pageId + "#contact").append('<a href="http://www.nesc.cn/risktext4.jsp" id="riskBook">《证券投资基金投资人权益须知》</a>');
					$(_pageId + ".check_box").show();
					layerUtils.iAlert("您还未开通基金代销权限请阅读《证券投资基金投资人权益须知》并同意开通","",function(){
						openCashTakingW();
					},"同意");
				}else{
					$(_pageId + ".check_box").hide();
				}
				
				// 如果净值为空显示为0
				if(validatorUtil.isEmpty(currentPrice)){
					currentPrice = "0";
				}
				productName = putils.delProSpecialStr(productName);
				$(_pageId + "#product_name").html(productName + "" + productCode);
				$(_pageId + "#earnings").html(parseFloat(currentPrice).toFixed(3));
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	// 显示客户信息确认框
	function showUserInfoWindow(){
		$(_pageId + "#window_three").show();
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var address = ""; // 详细地址
		var telephone = ""; // 联系电话
		var userName = ""; // 电子邮箱
		var idNO = ""; // 邮政编码
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			userName = userInfo.user_name; // 详细地址
			address = userInfo.address; // 详细地址
			telephone = userInfo.telephone; // 联系电话
			idNO = userInfo.identity_num; // 身份证号码
		}
		$(_pageId + "#windowUserName").html(userName);
		$(_pageId + "#windowIDNo").html(idNO);
		$(_pageId + "#windowPhone").html(telephone);
		$(_pageId + "#windowAddress").html(address);
	}
	
	/*
	 * 理财购买  
	 * @param showUserInfoWindow 是否需要弹出客户确认提示信息 继续购买的时候不需要再次提示了。
	 */
	function finanBuy(showWindow){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		// 购买理财产品时 展示用户信息给客户
		if (showWindow) {
			showUserInfoWindow();
		} else {
			finanBuyBackFun();
		}
	}
	
	/*
	 * 理财购买回调函数
	 */
	function finanBuyBackFun(){
		var productId = appUtils.getPageParam("product_id");
		var recommendPersonId = appUtils.getPageParam("recommend_person_id");
		var totPrice = $(_pageId+"#buyValue").val();
		var param = {
			"product_id" : productId,
			"user_id" : common.getUserId(),
			"tot_price" : totPrice,
			"business_type" : "",
			"order_channel" : global.order_channel,
			"money_type" : "0",
			"is_order" : pageGlobal.isOrder,
			"recommend_person_id" : recommendPersonId
		}; 
		
		service.finanBuy(param,function(data){
			// 订单生成成功后关闭客户信息提示框
			$(_pageId + "#window_three").hide(); 
			
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				pageGlobal.order_id = item.order_id;
				var tot_price_order = item.tot_price;
				var is_order = item.is_order;
				var is_fundAccount = item.is_fundAccount;
				var is_risk = item.is_risk; // 風險等級是否符合
				if(is_order == constants.is_order.NO){//是否生产订单成功
					if(is_fundAccount == constants.is_fundaccount.NO){
						layerUtils.iMsg(-1,"您还未绑定资金帐号！");
						return;
					}
					var pageInitParam = appUtils.getPageParam();
					pageInitParam.backPage = "finan/buy";
					
					switch(Number(is_risk)){
					
						case 0:
							layerUtils.iMsg(-1,"您还未进行风险测评！");
							appUtils.pageInit("finan/buy", "register/riskAssessment", pageInitParam);
							break;
						
						case 2:
							var productsRisk = "";
							if(pageGlobal.fina_belongs == 2 || pageGlobal.fina_belongs == 5){
								productsRisk = putils.bankRiskLevel(pageGlobal.productRisk);
							}else{
								productsRisk = putils.riskLevel(pageGlobal.productRisk);
							}
							$(_pageId + "#riskTip").html('产品有风险，投资须谨慎。尊敬的客户，您拟投资的金融产品风险等级为<em>'+ productsRisk +'</em>高于您风险评估所显示的承受能力等级<em>'+ pageGlobal.userRisk +'</em>。投资该项产品可能导致高出您自身承受能力的损失。建议您审慎考察产品的特征及风险，自行做出充分风险评估。');
							$(_pageId + "#window_one").show();
						break;
						
						case 3:
							layerUtils.iMsg(-1,"您的风险测评已过期！");
							appUtils.pageInit("finan/buy", "register/riskAssessment", pageInitParam);
							break;
					}
					
				}else{
					//理财支付
					//finanOrderPayment();
					$(_pageId + "#top_price_value").html("¥"+tot_price_order);
					
					// 资金账号登录 不需要输入密码
					if (isFundAccountLogin()) {
						finanOrderPayment(false);
						return false;
					} else {
						$(_pageId + "#order_buy").show();
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 理财支付
	 */
	function finanOrderPayment(backParam){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var trade_pwd = "";
		if (backParam) {
			trade_pwd = backParam[0]; // 交易密码
		}
		
		var param = {
			"order_id" : pageGlobal.order_id,
			"user_id" : common.getUserId(),
			"fund_account" : pageGlobal.external_account,
			"trade_pwd" : trade_pwd,
			"pay_type" : pageGlobal.pay_mode,
			"bankNo" : pageGlobal.bankNo,
			"bankCard" : pageGlobal.bankCard
		}; 
		service.finanOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 基金购买  （1000101）
	 */
	function fundBuy(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var user_id = JSON.parse(userInfo).user_id;
		var product_id = appUtils.getPageParam("product_id");
		var tot_price = $(_pageId+" #buyValue").val();
		var recommendPersonId = appUtils.getPageParam("recommend_person_id");
		var param = {
			"product_id" : product_id,
			"user_id" : user_id,
			"tot_price" : tot_price,
			"business_type" : "",
			"order_channel" : global.order_channel,
			"money_type" : "0",
			"is_order" : pageGlobal.isOrder,
			"recommend_person_id" : recommendPersonId
		}; 
		service.fundBuy(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				pageGlobal.order_id = item.order_id;
				var tot_price_order = item.tot_price;
				var is_order = item.is_order;
				var is_fundAccount = item.is_fundAccount; // 是否綁定資金賬號
				var is_risk = item.is_risk; // 風險等級是否符合
				if(is_order == constants.is_order.NO){//是否生产订单成功

					if(is_fundAccount == constants.is_fundaccount.NO){
						layerUtils.iMsg(-1,"您还未绑定资金帐号！");
						return;
					}
					// 把上一页面的参数带到下一个页面，返回的时候需要用到
					var pageInitParam = appUtils.getPageParam();
					pageInitParam.backPage = "finan/buy";
					
					switch(Number(is_risk)){
					
						case 0:
							layerUtils.iMsg(-1,"您还未进行风险测评！");
							appUtils.pageInit("finan/buy","register/riskAssessment",pageInitParam);
							break;
						
						case 2:
							var productsRisk = "";
							if(pageGlobal.fina_belongs == 2 || pageGlobal.fina_belongs == 5){
								productsRisk = putils.bankRiskLevel(pageGlobal.productRisk);
							}else{
								productsRisk = putils.riskLevel(pageGlobal.productRisk);
							}
							$(_pageId + "#riskTip").html('产品有风险，投资须谨慎。尊敬的客户，您拟投资的金融产品风险等级为<em>'+ productsRisk +'</em>高于您风险评估所显示的承受能力等级<em>'+ pageGlobal.userRisk +'</em>。投资该项产品可能导致高出您自身承受能力的损失。建议您审慎考察产品的特征及风险，自行做出充分风险评估。');
							$(_pageId + "#window_one").show();
						break;
						
						case 3:
							layerUtils.iMsg(-1,"您的风险测评已过期！");
							appUtils.pageInit("finan/buy","register/riskAssessment",pageInitParam);
							break;
						
					}
					
				
				}else{
					//基金支付
					//fundOrderPayment();
					$(_pageId + "#top_price_value").html("¥"+tot_price_order);
					
					// 资金账号登录 不需要输入密码
					if (isFundAccountLogin()) {
						fundOrderPayment(false);
						return false;
					} else {
						$(_pageId + "#order_buy").show();
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 基金支付（1000114）
	 */
	function fundOrderPayment(backParam){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var trade_pwd = "";
		if (backParam) {
			trade_pwd = backParam[0]; // 交易密码
		}
		
		var param = {
			"order_id" : pageGlobal.order_id,
			"user_id" : common.getUserId(),
			"fund_account" : pageGlobal.external_account,
			"trade_pwd" : trade_pwd,
			"pay_type" : pageGlobal.pay_mode,
			"bank_no" : pageGlobal.bankNo,
			"bank_card" : pageGlobal.bankCard
		}; 
		service.fundOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id; // 订单ID
				var productName = item.product_name; // 产品名称
				var productCode = item.product_code; // 产品编号
				var totPrice = item.tot_price; // 订单价格
				
				productName = putils.delProSpecialStr(productName);
				var param = {
					"order_id" : order_id,
					"product_name" : productName + "(" + productCode + ")",
					"tot_price" : totPrice
				}
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * OTC 购买
	 */
	function otcBuy(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var productId = appUtils.getPageParam("product_id");
		var totPrice = $(_pageId+"#buyValue").val();
		var recommendPersonId = appUtils.getPageParam("recommend_person_id");
		var param = {
			"product_id" : productId,
			"user_id" : common.getUserId(),
			"tot_price" : totPrice,
			"business_type" : "",
			"order_channel" : global.order_channel,
			"money_type" : "0",
			"is_order" : pageGlobal.isOrder,
			"recommend_person_id" : recommendPersonId
		}; 
		
		service.otcBuy(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				pageGlobal.order_id = item.order_id;
				var tot_price_order = item.tot_price;
				var is_order = item.is_order;
				var is_fundAccount = item.is_fundAccount;
				var is_risk = item.is_risk; // 風險等級是否符合
				if(is_order == constants.is_order.NO){//是否生产订单成功
					if(is_fundAccount == constants.is_fundaccount.NO){
						layerUtils.iMsg(-1,"您还未绑定资金帐号！");
						return;
					}
					var pageInitParam = appUtils.getPageParam();
					pageInitParam.backPage = "finan/buy";
					
					switch(Number(is_risk)){
					
						case 0:
							layerUtils.iMsg(-1,"您还未进行风险测评！");
							appUtils.pageInit("finan/buy", "register/riskAssessment", pageInitParam);
							break;
						
						case 2:
							var productsRisk = "";
							if(pageGlobal.fina_belongs == 2 || pageGlobal.fina_belongs == 5){
								productsRisk = putils.bankRiskLevel(pageGlobal.productRisk);
							}else{
								productsRisk = putils.riskLevel(pageGlobal.productRisk);
							}
							$(_pageId + "#riskTip").html('产品有风险，投资须谨慎。尊敬的客户，您拟投资的金融产品风险等级为<em>'+ productsRisk +'</em>高于您风险评估所显示的承受能力等级<em>'+ pageGlobal.userRisk +'</em>。投资该项产品可能导致高出您自身承受能力的损失。建议您审慎考察产品的特征及风险，自行做出充分风险评估。');
							$(_pageId + "#window_one").show();
						break;
						
						case 3:
							layerUtils.iMsg(-1,"您的风险测评已过期！");
							appUtils.pageInit("finan/buy", "register/riskAssessment", pageInitParam);
							break;
					}
					
				}else{
					//otc支付
					//otcOrderPayment();
					$(_pageId + "#top_price_value").html("¥"+tot_price_order);
					
					
					// 资金账号登录 不需要输入密码
					if (isFundAccountLogin()) {
						otcOrderPayment(false);
						return false;
					} else {
						$(_pageId + "#order_buy").show();
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * OTC 支付
	 */
	function otcOrderPayment(backParam){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var trade_pwd = "";
		if (backParam) {
			trade_pwd = backParam[0]; // 交易密码
		}
		
		var param = {
			"order_id" : pageGlobal.order_id,
			"user_id" : common.getUserId(),
			"fund_account" : pageGlobal.external_account,
			"trade_pwd" : trade_pwd,
			"pay_type" : pageGlobal.pay_mode,
			"bankNo" : pageGlobal.bankNo,
			"bankCard" : pageGlobal.bankCard
		}; 
		service.otcOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	// 判断是否是资金账号登录
	function isFundAccountLogin(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		if (userInfo) {
			var isFundAccountLogin = JSON.parse(userInfo).is_fund_account_login;
			if (isFundAccountLogin == "1") {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 查询判断是否开通基金户
	 */
	function isOpenCashButler(){
		var param = {
				"type" : 0,
				"fina_belongs" : pageGlobal.fina_belongs,
				"product_id" : pageGlobal.product_id,
				"product_sub_type" : pageGlobal.sub_type,
				"fund_account" : pageGlobal.external_account
			}; 
			
			service.openCashButler(param,function(data){
				var result = common.getResultList(data);
				if(result.length > 0){
					var isOpen = false;
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						// 基金产品
						if(item.is_open && item.is_open == "1"){
							// 开通了基金
							if (item.fund_company == pageGlobal.register_corp_code) {
								// 开通了直接购买
								productBuy(false);
							}else{
								// 未开通当前基金公司的基金户 
								showWindowTwo(false);
							}
						}else{
							// 没有开通过任何基金公司的基金户
							showWindowTwo(true);
						}
					}
				}else{
					// 没有开通过任何基金公司的基金户
					showWindowTwo(true);
				}
		});
	}
	
	/*
	 * 弹出开基金户提示
	 */
	function showWindowTwo(showAgreement){
		var fundCompany = pageGlobal.register_corp_code; // 基金公司代码
		var exchangeName = pageGlobal.exchange_name; // 基金公司名称; // 基金公司
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var holderName = ""; // 用户姓名
		var idNo = ""; // 证件号码
		var address = ""; // 详细地址
		var telephone = ""; // 联系电话
		var userMail = ""; // 电子邮箱
		var postCode = ""; // 邮政编码
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			address = userInfo.address; // 详细地址
			telephone = userInfo.telephone; // 联系电话
			userMail = userInfo.user_mail; // 电子邮箱
			postCode = userInfo.post_code; // 邮政编码
			idNo = userInfo.identity_num; // 证件号码
			holderName = userInfo.user_name; // 用户姓名
		}
		
		$(_pageId + "#fundCompany").html(fundCompany);
		$(_pageId + "#exchangeName").html(exchangeName);
		$(_pageId + "#holderName").html(holderName);
		$(_pageId + "#idNo").html(idNo);
		$(_pageId + "#address").html(address);
		$(_pageId + "#telephone").html(telephone);
		$(_pageId + "#userMail").html(userMail);
		$(_pageId + "#postCode").html(postCode);
		
		$(_pageId + "#window_two").show();
		if (showAgreement) {
			$(_pageId + ".agreemet_box").show();
		} else {
			$(_pageId + ".agreemet_box").hide();
		}
	}
	
	/**
	 * 购买金额是否正确
	 */
	function buyValueCheck(){
		//获取输入的购买金额
		var buy_Value = $(_pageId + "#buyValue").val();
		if(pageGlobal.is_bought == "0"){//判断是否首次购买
			if(parseFloat(buy_Value)<parseFloat(pageGlobal.perBuyLimit)){
				layerUtils.iMsg(-1,"购买的金额不能低于"+pageGlobal.perBuyLimit);
				return false;
			}else{
				return true;
			}
/*			else{
				if(pageGlobal.buy_add_pace == "0" || pageGlobal.buy_add_pace == ""){
					return true;
				}
				var zuijia = parseFloat(buy_Value)-parseFloat(pageGlobal.perBuyLimit);
				if(zuijia % pageGlobal.buy_add_pace == "0"){
					return true;
				}else{
					layerUtils.iMsg(-1,"每次追加金额为"+pageGlobal.buy_add_pace);
					return false;
				}
			}*/
		}else{
			if(parseFloat(buy_Value)<parseFloat(pageGlobal.person_pace)){
				layerUtils.iMsg(-1,"购买的金额不能低于"+pageGlobal.person_pace);
				return false;
			}else{
				return true;
			}
/*			else{
				if(pageGlobal.buy_add_pace == "0" || pageGlobal.buy_add_pace == "" ){
					return true;
				}
				var zuijia = parseFloat(buy_Value)-parseFloat(pageGlobal.perBuyLimit);
				if(zuijia % pageGlobal.buy_add_pace == "0"){
					return true;
				}else{
					layerUtils.iMsg(-1,"每次追加金额为"+pageGlobal.buy_add_pace);
					return false;
				}
			}*/

		}
	}
	
	/**
	 * 实时货币基金产品购买
	 */
	function productBuy(showWindow){
		var totPrice = $(_pageId+"#buyValue").val();
		var param = {
				"type" : 1, // 0查询 1购买 2赎回
				"fund_account" : pageGlobal.external_account,
				"tot_price" : totPrice,
				"product_code" : pageGlobal.productCode
		}
		service.getRealFinaById(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_sn;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				appUtils.pageInit("finan/realBuy", "finan/buySuccess", param);
				
			}else{
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 查询用户绑定的银行卡(1000197)
	 */
	function userBank(){
		var param = {
				"user_id" : common.getUserId()
			}
		service.userBank(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				var bankCardList = $(_pageId + "#bank_list ul").empty();
				var addFirst = $("#addFirst").hide(); // 首次添加银行卡
				var add = $("#add").show(); // 添加银行卡
				if(result.length && result.length > 0){
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						var checked = "";
						var bankCardNo = $.trim(item.bank_card_no); // 银行卡号
						var bankImgs = item.bank_img_s || "images/bank_p1.png"; // 银行小图标
						var bankAccount = bankCardNo.substring(0,4) + "**** ****" + bankCardNo.substring(12,bankCardNo.length);
						var bankName = item.bank_name + "招商银行"; // 银行名称
						var bankNo = item.bank_no; // 银行编号
						// 默认选中第一个
						if(i == 0){
							var checked = 'checked="checked"';
						}
						
						var myBankCard = '<li>'	+
										 '	<div class="ui radio">' +
										 '		<input type="radio" bankNo = "' + bankNo + '" bankCardNo = "' + bankCardNo + '" id="radio_' + i + '" name="bankCard" ' + checked + ' />' +
										 '		<label for="radio_' + i + '"><i class="bank_icon"></i>中国银行(' + bankAccount + ')</label>' +
										 '	</div>' +
										 '</li>';
					
						bankCardList.append(myBankCard);
					}
					// 选中银行卡
					appUtils.bindEvent(_pageId + "#bankCardList ul li", function(){
						$(this).addClass("active").siblings().removeClass();
					},"touchstart");
				}else{
					addFirst.show(); // 显示首次添加银行卡
					add.hide(); // 添加银行卡
				}
				
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 获取用户选择银行卡支付/保证金支付(用户选择的银行卡编号&银行卡号)
	 */
	function checkfundClient(){
		if(pageGlobal.pay_mode == "2"){
			$(_pageId+"#bank_list ul").each(function(index){
				pageGlobal.bankNo = $(this).children("li").children("div").children("input:radio[name='bankCard']:checked").attr("bankNo"); // 获取选中的银行编号
				pageGlobal.bankCard = $(this).children("li").children("div").children("input:radio[name='bankCard']:checked").attr("bankCardNo"); // 获取选中的银行卡号
				/*alert("银行编号是："+pageGlobal.bankNo+"银行卡号是："+pageGlobal.bankCard);*/
			});
		}
		
	}
	
	/**
	 * 现金管家开通W权限
	 */
	function openCashTakingW(){
		// 开通W权限
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var user_id = JSON.parse(userInfo).user_id;
		var param = {
				"user_id" : user_id,
				"contract_type" : constants.contractType.FUND_DISTRIBUTION
			}
		service.queryContract(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0];
				var agreement_id = results.agreement_id;
				
				var param = {
						"user_id" : user_id,
						"agreement_id" : agreement_id
					}
				service.openCashTakingW(param, function(data){
					var error_no = data.error_no;
					var error_info = data.error_info;
					
					if(error_no == "0"){
						var results = data.results[0];
						
					}else{
						layerUtils.iMsg(-1, error_info);
						return false;
					}
				});
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
		
		// 添加银行卡
		appUtils.bindEvent(_pageId + ".add_bank",function(){
			if (pageGlobal.client_no && pageGlobal.client_no != "") {
				appUtils.pageInit("account/myBankCard", "register/bindBankCard", {});
			}else{
				appUtils.pageInit("account/myBankCard", "register/setTradePwd", {});
			}
		});
		
		// 保证金支付/理财账户支付 tab切换
		appUtils.bindEvent(_pageId + "#fundClient a", function(){
			var index = $(_pageId + "#fundClient a").removeClass("act").index(this);
			$(this).addClass("act");
			if (index == 0) {
				layerUtils.iMsg(-1,"银行卡支付功能正在开发中...");
				// 银行卡
/*				pageGlobal.pay_mode = "2";
				$(_pageId + ".amount_text").hide(); // 可用余额
				$(_pageId + "#bank_list").show(); // 银行卡
*/			} else if (index == 1) {
				 // 保证金
				pageGlobal.pay_mode = "";
				$(_pageId + ".amount_text").show(); // 可用余额
				$(_pageId + "#bank_list").hide(); // 银行卡
			}
		});
		
		/**
		 * 点击输入框
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var keyPanelConfig = {skinName: "white"};
		    var isPwd = $(_pageId + " #trade_pwd").index(this) == 4 ? false : true; // 除股票键盘外其余都是密码输入
		    myKeyPanel.init(this, $(_pageId + " #trade_pwd").index($(this)) + 1, isPwd, keyPanelConfig); // 执行初始化
		    e.stopPropagation();
		});
		
		/**
		 * 键盘输入事件
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var $input = $(_pageId+" #trade_pwd_box");
			//$(_pageId+" #trade_pwd_box em").html("");
			var value = e.originalEvent.detail["optType"];
	    	var text = $(_pageId+" #trade_pwd").attr("value");
	    	if(value == "del"){
	    		var len = text.length;
	    		$(_pageId+"#trade_pwd_box em:eq("+(len)+")").html("");
	    		$input.val(text.slice(0, -1));
	    	}else{
	    		if(text.length <= 6){
		    		$input.val(text);
		    		var len = text.length;
		    		$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    		if(text.length == 6){
		    			//$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    			//$(_pageId+" .pop_pay").hide();
		    			var trade_pwd = $(_pageId+" #trade_pwd").val();
		    			myKeyPanel.close();//隐藏h5键盘
						var _trade_pwd=$(_pageId+" #trade_pwd").val();
			        	if(_trade_pwd.length!=6){
			        		$(_pageId + " #trade_pwd_box em").html("");
			        		layerUtils.iMsg(-1,"请输入6位数交易密码！");
			        		return;
			        	}
			        	var param = {
			        			"pwd1" :_trade_pwd
			        		};
						var sub_type = appUtils.getPageParam("sub_type");
						if (sub_type == 0) {
							// 基金支付
							common.rsaEncrypt(param,fundOrderPayment);
						} else if (sub_type == 1) {
							if(pageGlobal.fina_belongs == "5"){//OTC订单
								// OTC 购买
								common.rsaEncrypt(param,otcOrderPayment);
							}else{
								// 理财支付
								common.rsaEncrypt(param,finanOrderPayment);
							}

						}
		    		}
	    		}else{
	    			layerUtils.iMsg(-1, "交易密码最多 6位!");
	    		}
	    	}
			e.stopPropagation();
		}, "input");
		
		/*点击页面*/
        appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
			myKeyPanel.close();
   			e.stopPropagation();
        });
        
		/*点击其他位置关闭风险等级不匹配提示*/
        appUtils.bindEvent($(_pageId + "#window_one"),function(){
        	$(_pageId + "#window_one").hide();
        });
        
		/*点击风险等级不匹配提示框不关闭*/
        appUtils.bindEvent($(_pageId + ".dialog_cet"),function(e){
        	e.stopPropagation();
        });
        
		// 提交订单
		appUtils.bindEvent($(_pageId + ".sub_btn"), function(){
			if (pageGlobal.flag) {
				var buy_value = $(_pageId + "#buyValue");
				putils.numberLimit(buy_value);
				if ($(_pageId + ".check_box").css("display") != "none") {
					if(!$(_pageId + "#checkbox_1").prop("checked")){
						layerUtils.iAlert("请同意用户购买协议！");
						return false;
					}
				}
				var buyValue = buy_value.val();
				if(validatorUtil.isEmpty(buyValue)){
					layerUtils.iMsg(-1, "您的购买金额不能为空！");
					return false;
				}
				
				if(parseFloat(buyValue) == "0"){
					layerUtils.iMsg(-1, "您的购买金额不能为0！");
					return false;
				}
				
				if (pageGlobal.accountType && pageGlobal.accountType == "8") {

				}else{
					if(parseFloat(pageGlobal.withdrawCash) < parseFloat(buyValue)){
						layerUtils.iMsg(-1, "您的可用资产不足！");
						return false;
					}
				}
				if(buyValueCheck()){
					
					// 判断是否是现金管家产品
					if (pageGlobal.productCode == global.product_code) {
						appUtils.pageInit("finan/buy", "account/cashbutler/detail", param);
						return false;
					}
					pageGlobal.buy_value = buy_value;
					//isOpenCashButler(); // 判断是否开通了基金户
					productBuy(false); // 实时货币基金购买
					
				}

				checkfundClient();  // 获取银行卡号、银行编号
			}
		});
		
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/riskAssSuccess") {
				appUtils.pageBack();
			} else {

				if(pageGlobal.sub_type == constants.product_sub_type.FUND){
					// 基金产品详情
					appUtils.pageInit("finan/buy", "finan/detail", appUtils.getPageParam());
				}else if(pageGlobal.sub_type == constants.product_sub_type.FINANCIAL){
					// 理财产品详情
					appUtils.pageInit("finan/buy", "finan/finanDetail", appUtils.getPageParam());
				}
			
			}
		});
		
		// 重新风险测评
		appUtils.bindEvent(_pageId + "#risk", function(){
			var pageInitParam = appUtils.getPageParam();
			pageInitParam.backPage = "finan/buy";
			$(_pageId + "#window_one").hide();
			appUtils.pageInit("finan/buy", "register/riskAssessment", pageInitParam);
			
		});
		
		// 已审慎考虑
		appUtils.bindEvent(_pageId + "#buyContinue", function(){
			$(_pageId + "#window_one").hide();
			$(_pageId + "#entrustTip").html('本人/本机构愿意承担该项投资可能引起的损失和其他后果。投资行为系本人/本机构独立、自主、真实的意思表示，与贵公司及相关从业人员无关。');
			$(_pageId + "#window_one1").show();
		});
		
		// 确定委托
		appUtils.bindEvent(_pageId + "#submit", function(){
			$(_pageId + "#window_one1").hide();
			pageGlobal.isOrder = "1"; // 不检查匹配情况
			productBuy(false);
		});
		
		// 放弃委托
		appUtils.bindEvent(_pageId + "#cencal", function(){
			$(_pageId + "#window_one1").hide();
		});
		
		//开通按钮（继续购买）
		appUtils.bindEvent(_pageId + "#openFund", function(){
			if ($(_pageId + ".agreemet_box").css("display") != "none") {
				if(!$(_pageId + "#checkbox_2").prop("checked")){
					layerUtils.iAlert("请阅读基金户开通协议！");
					return false;
				}
			}
			$(_pageId + "#window_two").hide();
			// 点击开通 ，进行下一步
			productBuy(true);
		});
		
		//基金户取消按钮
		appUtils.bindEvent(_pageId + "#cancelFund", function(){
			$(_pageId + "#window_two").hide();
		});
		
		//用户信息框 取消按钮
		appUtils.bindEvent(_pageId + "#userInfoCancel", function(){
			$(_pageId + "#window_three").hide();
		});
		
		//用户信息框 确认按钮
		appUtils.bindEvent(_pageId + "#userInfoSure", function(){
			finanBuyBackFun();
		});
		
		// 关闭输入交易密码弹框
		appUtils.bindEvent(_pageId + "#close_btn_buy", function(){
			$(_pageId + "#order_buy").hide();
			$(_pageId + " #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
			myKeyPanel.close();//隐藏h5键盘
		});
		
/*		//点击页面关闭软键盘
		appUtils.bindEvent($(_pageId),function(e){
			if(platform != "0"){
				hideKeyboard(); // 隐藏原生键盘
				e.stopPropagation();
			}
		});*/
		
		
		// 测试支付按钮
		appUtils.bindEvent(_pageId + "#cc", function(){
			var _trade_pwd=$(_pageId+" #trade_pwd").val();
        	var param = {
        			"pwd1" :_trade_pwd
        		};
			var sub_type = appUtils.getPageParam("sub_type");
			if (sub_type == 0) {
				// 基金支付
				common.rsaEncrypt(param,fundOrderPayment);
			} else if (sub_type == 1) {
				if(pageGlobal.fina_belongs == "5"){//OTC订单
					// OTC 购买
					common.rsaEncrypt(param,otcOrderPayment);
				}else{
					// 理财支付
					common.rsaEncrypt(param,finanOrderPayment);
				}

			}
		});
		
		// 点击文本框获取焦点事件
		appUtils.bindEvent(_pageId + "#buyValue", function(){
			var buyvalue = $(_pageId + "#buyValue").val();
			if(parseFloat(buyvalue) == '0'){
				$(_pageId + "#buyValue").val("");
			}
		}, "focus");
		
		// 点击文本框获取焦点事件
		appUtils.bindEvent(_pageId + "#buyValue", function(){
			putils.numberLimit(_pageId + "#buyValue");
		}, "blur");
		
		// 点击协议跳转到协议页面
		appUtils.bindEvent(_pageId + "#agreement", function(){
			appUtils.pageInit("finan/buy", "finan/agreementOpen", {});
		});
		
		// 取消按钮
		appUtils.bindEvent(_pageId + "#cancel", function(){
			$(_pageId + "#window_two").hide();
		});
	}
	
	/*清除页面显示值*/
	function clearPage(){
		
		// 输入密码框清除
		$(_pageId + "#order_buy").hide();
		$(_pageId + " #trade_pwd_box em").html("");
		$(_pageId+" #trade_pwd").val("");
		
		$(_pageId + "#cash_assets").html("0");
		$(_pageId+" #contact").html("");
		$(_pageId + "#buyValue").val("");
		$(_pageId + "#product_name").html("");
		$(_pageId + "#earnings").html("");
		$(_pageId + "#top_price_value").html("");
		
		$(_pageId + "#windowUserName").html("");
		$(_pageId + "#windowIDNo").html("");
		$(_pageId + "#windowPhone").html("");
		$(_pageId + "#windowAddress").html("");
	}
		
	/*
	 * 页面销毁
	 */
	function destroy(){
		pageGlobal.isOrder = "";
		pageGlobal.flag = true;
	}
	
	var buy = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = buy;
});