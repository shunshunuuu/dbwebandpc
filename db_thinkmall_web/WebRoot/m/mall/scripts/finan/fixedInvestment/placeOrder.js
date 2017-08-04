 /**
  * 定投下单
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_fixedInvestment_placeOrder "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils");
	var dateUtils = require("dateUtils"); // 日历控件
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var global = require("gconfig").global; // 全局配置对象
	var pageGlobal = {
			"product_id" : "", // 产品编号
			"productCode" : "", // 产品代码
			"fina_belongs" : "", // 产品子类别
			"productRisk" : "", // 产品风险等级
			"register_corp_code" : "", // 基金公司代码
			"min_time_balance":"",//每期最小基金定投金额
			"manager_name":"",//基金公司名称
			"isOrder" : "", // 是否检查
			"pageInitParam" : "", // 参数集合
			"sub_type" : "" // 产品类型
		};
	
	/*
	 * 初始化
	 */
	function init(){
		initTime();
		var productCode = appUtils.getPageParam("product_code"); // 产品代码
		if(productCode){
			getFundList(productCode);
		}
		initView();
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		var pageParam = appUtils.getPageParam();
		if(pageParam){
			$(_pageId + " #castSureMoney").val(pageParam.trade_money);
			$(_pageId + " #startDate").html(pageParam.first_trade_y_m_mall);
			$(_pageId + " #endDate").html(pageParam.endDate);
			$(_pageId + " #moneyDate").val(pageParam.trade_date);
		}
		
	}
	
	/**
	 * 2、初始化页面时间
	 */
	function initTime(){
		var date = new Date(),
		year = date.getFullYear(),
		_month = date.getMonth() + 1,
		month = _month.toString().length > 1 ? _month : "0" + _month,
		_day = date.getDate(),
		day = _day.toString().length > 1 ? _day : "0" + _day;
		newDate = year + "-" + month + "-" + day;//当前时间
		$(_pageId + " #startDate").html(newDate);
		$(_pageId + " #endDate").html(newDate);
		$(_pageId + " #startInput").val(newDate);
		$(_pageId + " #endInput").val(newDate);
		//初始化时间控件
		var param = {
				"mode": "scroller",
				"theme": "android-ics light"
		};
		dateUtils.initDateUI("finan_fixedInvestment_placeOrder", param);
	}
	
	
	/**
	 * 3、重置日期控件样式
	 */
	function resetTimeCSS(){
		$(" .dwo").css("background", "rgba(0,0,0,0.4)");
		$(" .dwbg").css({
			"background": "rgba(255,255,255,0.9)",
			"border-radius": "0.05rem",
			"height":"3rem"
		});
		$(" .dwb-s").css({
			"float": "right",
			"width": "48%"
		});
		$(" .dwb-c").css("width", "48%");
		$(" .dwv").css({
			"background": "-webkit-linear-gradient(top,#0081E2,#00AEF4)",
			/*"background": "#80d7ff",*/
			"color": "#FFFFFF",
			"border-bottom": "2px solid #80d7ff",
			"font-weight": "normal",
			"font-size": "0.14rem",
			"height": "0.36rem",
			"line-height": "0.36rem",
			"border-top-left-radius": "0.05rem",
			"border-top-right-radius": "0.05rem"
		});
		$(" .dwwol").css({
			"border-top": "2px solid #80d7ff",
			"border-bottom": "2px solid #80d7ff"
		});
		$(" .dwbc").css({
			"border-top": "none",
			"height": "0.44rem",
			"line-height": "0.44rem",
			"padding": "0.1rem"
		});
		$(" .dwb-c .dwb").css({
			"background": "#DDDDDD",
			"color": "#666666",
			"font-size": "0.18rem",
			"border-radius": "0.05rem",
			"height": "0.44rem",
			"line-height": "0.44rem"
		});
		$(" .dwb-s .dwb").css({
			/*"background": "#80d7ff",*/
			"background": "#5eb2f8",
			/*"color": "#FFFFFF !important",*/
			"color": "#FFFFFF",
			"font-size": "0.18rem",
			"border-radius": "0.05rem",
			"height": "0.44rem",
			"line-height": "0.44rem"
		});
	}
	
	/**
	 * 4、日期格式转换
	 * 将yyyy-MM-dd 格式 转换为 毫秒格式
	 */
	function timeFormat(timeStr){
		var reg = /^20\d{2}-\d{2}-\d{2}$/,
		isTime = reg.test(timeStr);
		if (isTime){
			
		}
	}
	
	/**
	 * 5、时间比较
	 */
	function compareTime(small_time, big_time){
		var mark = false,
		reg = /^20\d{2}-\d{2}-\d{2}$/,
		isTime = reg.test(small_time) && reg.test(big_time);
		if (isTime){
			var small_arr = small_time.split("-"),
			big_arr = big_time.split("-");
			var small = +new Date(small_arr[0], small_arr[1], small_arr[2]),
			big = +new Date(big_arr[0], big_arr[1], big_arr[2]);
			mark = (big - small) >= 0 ? true : false;
		}
		return mark;
	}
	
	/**
	 * 下单验证
	 * */
	function vailSubmitOrder(){
		//验证基金代码输入是否正确
		var mark = false,
		reg = /^\d{4}-\d{2}-\d{2}$/,
		_stockCode = $(_pageId + " #fundCode").val(),
		stockCode = _stockCode.length > 7 ? _stockCode.substr(0, 6) : _stockCode,
		castSureMoney = $(_pageId + " #castSureMoney").val(),
		startDate = $(_pageId + " #startDate").html(),
		endDate = $(_pageId + " #endDate").html(),
		moneyDate = $(_pageId + " #moneyDate").val();
		if (!(/^\d{6}$/.test(stockCode))){
			layerUtils.iMsg(-1, "基金代码错误");
			mark = false;
		} else if ($.trim(castSureMoney).length <= 0){
			layerUtils.iMsg(-1, "请输入定投金额");
			mark = false;
		} else if(+castSureMoney === 0){
			layerUtils.iMsg(-1, "定投金额不能为0");
			mark = false;
		} else if(!validatorUtil.isNumberFloat(castSureMoney) || parseFloat(castSureMoney) < 0){
			layerUtils.iMsg(-1,"定投金额错误");
			mark = false;
		}  else if(parseFloat(castSureMoney)<parseFloat(min_time_balance)){
			layerUtils.iMsg(-1, "定投金额不能低于每期最小定投金额");
			mark = false;
		}else if (!reg.test(startDate)){
			layerUtils.iMsg(-1, "开始时间不合法");
			mark = false;
		} else if (!reg.test(endDate)){
			layerUtils.iMsg(-1, "截止时间不合法");
			mark = false;
		}else if (!compareTime(newDate, startDate)){
			layerUtils.iMsg(-1, "开始时间不能小于当前时间");
			mark = false;
		} else if (!compareTime(newDate, endDate)){
			layerUtils.iMsg(-1, "截止时间不能小于当前时间");
			mark = false;
		}  else if (!compareTime(startDate, endDate)){
			layerUtils.iMsg(-1, "截止时间不能小于开始时间");
			mark = false;
		} else if (!((1 <= (+moneyDate)) && (28 >= (+moneyDate)))){
			layerUtils.iMsg(-1, "请选择1-28的日期");
			mark = false;
		} else {
			mark = true;
		}
		return mark;
	}
	
	/*
	 * 基金定投
	 */
	function fundPlace(){
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 获取资金账号
		castSureMoney = $(_pageId + " #castSureMoney").val(),
		startDate = $(_pageId + " #startDate").html().replaceAll("-",""),
		endDate = $(_pageId + " #endDate").html().replaceAll("-",""),
		moneyDate = $(_pageId + " #moneyDate").val();
		var param = {
				"user_id" : common.getUserId(),
				"is_order" : pageGlobal.isOrder,
				"product_code" : pageGlobal.productCode,
				"trade_account" : external_account,
				"trade_date" : moneyDate, // 交易日期
				"trade_money" : castSureMoney, // 定投金额
				"first_trade_y_m_mall" : startDate, // 首次交易月份
				"expiry_date" : endDate, // 终止日期
		};
		service.fundPlaceBuy(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
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
					start_date = $(_pageId + " #startDate").html();
					end_date = $(_pageId + " #endDate").html();
					pageGlobal.pageInitParam = appUtils.getPageParam();
					pageGlobal.pageInitParam.backPage = "finan/fixedInvestment/placeOrder";
					pageGlobal.pageInitParam.trade_money = castSureMoney;
					pageGlobal.pageInitParam.trade_date = moneyDate;
					pageGlobal.pageInitParam.first_trade_y_m_mall = start_date;
					pageGlobal.pageInitParam.endDate = end_date;
					
					switch(Number(is_risk)){
					
						case 0:
							layerUtils.iMsg(-1,"您还未进行风险测评！");
							appUtils.pageInit("finan/fixedInvestment/placeOrder", "register/riskAssessment", pageGlobal.pageInitParam);
							break;
						
						case 2:
							var productsRisk = "";
							var userRisk = JSON.parse(userInfo).risk_level_txt; // 用户风险等级
							if(pageGlobal.fina_belongs == 2 || pageGlobal.fina_belongs == 5){
								productsRisk = putils.bankRiskLevel(pageGlobal.productRisk);
							}else{
								productsRisk = putils.riskLevel(pageGlobal.productRisk);
							}
							$(_pageId + "#riskTip").html('产品有风险，投资须谨慎。尊敬的客户，您拟投资的金融产品风险等级为<em>'+ productsRisk +'</em>高于您风险评估所显示的承受能力等级<em>'+ userRisk +'</em>。投资该项产品可能导致高出您自身承受能力的损失。建议您审慎考察产品的特征及风险，自行做出充分风险评估。');
							$(_pageId + "#window_one").show();
						break;
						
						case 3:
							layerUtils.iMsg(-1,"您的风险测评已过期！");
							appUtils.pageInit("finan/fixedInvestment/placeOrder", "register/riskAssessment", pageGlobal.pageInitParam);
							break;
					}
					
				}else{
					var param = {
							"product_name" : item.product_name,
							"trade_money" : item.trade_money,
							"trade_date" : item.trade_date,
							"first_trade_y_m_mall" : item.first_trade_y_m_mall.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"),
							"product_code" : item.product_code,
							"expiry_date" : item.expiry_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
					}
					// 订单生产成功
					appUtils.pageInit("finan/fixedInvestment/placeOrder", "finan/fixedInvestment/placeSuccess", param);

				}
				
				
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/**
	 * 获取基金列表
	 * */
	function getFundList(fundStr){
		if(fundStr!= "" && fundStr.length === 6){
			var entrust_way= global.entrust_way; // 委托方式  在configuration配置
			var fund_code = fundStr;
			var fund_company = "";
			var param = {
					"user_id" : common.getUserId(),
					"product_code": fund_code
			};
			service.fundInfo(param, function(data){
				if (data){
					var errorNo = data.error_no,
					errorInfo = data.error_info;
					if (errorNo === "0"){
						var results = data.results;
						if (results && results.length > 0){
							var item = results[0],
							nav = item.current_price !== "" ? item.current_price : "0";
							pageGlobal.fina_belongs = item.fina_belongs;
							pageGlobal.productRisk = item.risk_level; // 产品风险等级
							pageGlobal.product_id = item.product_id;
							pageGlobal.productCode = item.product_code;
							pageGlobal.manager_name = item.manager_name;
							pageGlobal.sub_type = item.product_sub_type;
							pageGlobal.register_corp_code = item.register_corp_code;
							pageGlobal.min_time_balance = item.min_time_balance;
							min_time_balance = pageGlobal.min_time_balance !== "" ? parseFloat(item.min_time_balance).toFixed(2) : "0.00";
							$(_pageId + " #fundCode").val(item.product_code + "   " + item.product_name).blur();
							$(_pageId + " #castSureMoney").attr("placeholder","最小定投金额为  "+min_time_balance);
							$(_pageId + " #fundNav").val(parseFloat(nav).toFixed(4));
							$(_pageId + " #fundNav").data("fund_company", item.fund_company);
						}
					} else {
						layerUtils.iAlert(errorInfo);
					}
				}
			}, {});
		}	
	}
	
	/**
	 * 查询判断是否开通基金户
	 */
	function isOpenCashButler(){
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 获取资金账号
		var param = {
				"type" : 0,
				"product_id" : pageGlobal.product_id,
				"product_sub_type" : pageGlobal.sub_type,
				"fund_account" : external_account
			}; 
			
			service.openCashButler(param,function(data){
				var result = common.getResultList(data);
				if(result.length > 0){
					var isOpen = false;
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						// 基金产品
						if(pageGlobal.sub_type && pageGlobal.sub_type == "0"){
							if(item.is_open && item.is_open == "1"){
								// 开通了基金
								if (item.fund_company == pageGlobal.register_corp_code) {
									// 开通了进行定投
									fundPlace();
								}else{
									// 未开通当前基金公司的基金户 
									showWindowTwo(false);
								}
							}else{
								// 没有开通过任何基金公司的基金户
								showWindowTwo(true);
							}
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
		var manager_name = pageGlobal.manager_name; // 基金公司名称; // 基金公司
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
		$(_pageId + "#exchangeName").html(manager_name);
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
	 * 判断风险等级是否匹配
	 */
	function checkRisk(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var user_id = JSON.parse(userInfo).user_id;
		var param = {
			"user_id" : user_id
		}
		service.queryRiskLevel(param, function(data){

			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0];
				var risk_level = results.risk_level; // 用户风险等级
				var risk_name = results.risk_name; // 用户风险等级描述
				var update_time = results.update_time; // 修改时间
				update_time = putils.dateFormat(update_time, "yyyy-MM-dd");
				var isRisk = false;
				var productsRisk = pageGlobal.productRisk;
				productsRisktxt = putils.riskLevel(productsRisk);
				
				var today = putils.dateFormat(new Date(), "yyyy-MM-dd"); // 今天
				if (update_time < today) {
					layerUtils.iMsg(-1,"您的风险测评已过期！");
					appUtils.pageInit("finan/fixedInvestment/placeOrder", "register/riskAssessment", pageGlobal.pageInitParam);
				}else if (!risk_level) {
					layerUtils.iMsg(-1,"您还未进行风险测评！");
					appUtils.pageInit("finan/fixedInvestment/placeOrder", "register/riskAssessment", pageGlobal.pageInitParam);
				}else if(risk_level == 1 && productsRisk > 2){
					isRisk = true;
				}else if(risk_level == 2 && productsRisk > 4){
					isRisk = true;
				}else if(risk_level == 3 && productsRisk > 6){
					isRisk = true;
				}
				if (isRisk) {
					$(_pageId + "#riskTip").html('产品有风险，投资须谨慎。尊敬的客户，您拟投资的金融产品风险等级为<em>'+ productsRisktxt +'</em>高于您风险评估所显示的承受能力等级<em>'+ risk_name +'</em>。投资该项产品可能导致高出您自身承受能力的损失。建议您审慎考察产品的特征及风险，自行做出充分风险评估。');
					$(_pageId + "#window_one").show();
				}else{
					isOpenCashButler(); // 判断是否开通基金户
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
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/riskAssSuccess") {
				appUtils.pageBack();
			}else{
				// 基金产品详情
				appUtils.pageInit("finan/buy", "finan/detail", appUtils.getPageParam());
			}
		});
		
		//股票代码输入框监听
		appUtils.bindEvent($(_pageId + " #fundCode"), function(e){
			var $this = $(this),
			fundCode = $this.val(),
			codeLength = fundCode.length;
			if (codeLength === 6){
				getFundList(fundCode);
			} else if(codeLength > 6){
				$this.val(fundCode.substring(0,6));
			} else if(codeLength < 6){
				clearBuyMsg();
			}
			e.stopPropagation();
		}, "input");
		
		// 选择银行卡定投
		appUtils.bindEvent($(_pageId + " #bankCardBuy"), function(e){
			layerUtils.iMsg(-1,"银行卡支付功能正在开发中...");
		}, "click");
		
		// 基金代码
		appUtils.bindEvent($(_pageId + " #fundCode"), function(e){
			var $this = $(this),
			thisVal = $this.val();
			if (thisVal.length > 7){
				$this.val(thisVal.substr(0,6));
			}
			e.stopPropagation();
		}, "focus");
		
		// 提交
		appUtils.bindEvent(_pageId + "#submit", function(){
			if (vailSubmitOrder()){
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
					// 判断用户风险等级是否和产品风险等级匹配
					checkRisk();
				}
			}
		});
		
		// 
		appUtils.bindEvent($(_pageId + " #openFund"), function(e){
			// 开通了进行定投
			$(_pageId + "#window_two").hide();
			fundPlace();
			e.stopPropagation();
		}, "click");
		
		//设置开始日期
		appUtils.bindEvent($(_pageId + " #setStart"), function(e){
			  setTimeout(function(){
				    $(_pageId + " #startInput").focus();
				  //3、重现设置日期控件样式
					resetTimeCSS();
					$(" .dw-persp").show();
					e.stopPropagation();
				   },300);
		}, "click");
		appUtils.bindEvent($(_pageId + " #startInput"), function(e){
			var reg = /^\d{4}-\d{2}-\d{2}$/,
			thisVal = $(this).val();
			if (reg.test(thisVal)){
				$(_pageId + " #startDate").html(thisVal);
			}
			e.stopPropagation();
		}, "change");
		
		//设置截止日期
		appUtils.bindEvent($(_pageId + " #setEnd"), function(e){
			setTimeout(function(){
				timeFormat();
				$(_pageId + " #endInput").focus();
				//3
				resetTimeCSS();
				$(" .dw-persp").show();
				e.stopPropagation();
				 },300);
		}, "click");
		
		// 开通
		appUtils.bindEvent($(_pageId + " #openFund"), function(e){
			// 开通了进行定投
			$(_pageId + "#window_two").hide();
			fundPlace();
			e.stopPropagation();
		}, "click");
		
		// 重新风险测评
		appUtils.bindEvent(_pageId + "#risk", function(){
			$(_pageId + "#window_one").hide();
			appUtils.pageInit("finan/fixedInvestment/placeOrder", "register/riskAssessment", pageGlobal.pageInitParam);
			
		});
		
		// 已审慎考虑
		appUtils.bindEvent(_pageId + "#buyContinue", function(){
			$(_pageId + "#window_one").hide();
			$(_pageId + "#entrustTip").html('本人/本机构愿意承担该项投资可能引起的损失和其他后果。投资行为系本人/本机构独立、自主、真实的意思表示，与贵公司及相关从业人员无关。');
			$(_pageId + "#window_one1").show();
		});
		
		// 确定委托
		appUtils.bindEvent(_pageId + "#submit_btn", function(){
			$(_pageId + "#window_one1").hide();
			pageGlobal.isOrder = "1"; // 不检查匹配情况
			//fundPlace();
			isOpenCashButler();
		});
		
		// 放弃委托
		appUtils.bindEvent(_pageId + "#cencal", function(){
			$(_pageId + "#window_one1").hide();
		});
		
		//基金户取消按钮
		appUtils.bindEvent(_pageId + "#cancelFund", function(){
			$(_pageId + "#window_two").hide();
		});
		appUtils.bindEvent($(_pageId + " #endInput"), function(e){
			var reg = /^\d{4}-\d{2}-\d{2}$/,
			thisVal = $(this).val();
			if (reg.test(thisVal)){
				$(_pageId + " #endDate").html(thisVal);
			}
			e.stopPropagation();
		}, "change");
		
		// 分享二维码
		appUtils.bindEvent(_pageId + "#shareEwm", function(){
			
		});
	}
	
	
	/**
	 * 重置页面数据  
	 */
	function clearBuyMsg(){
		pageGlobal.isOrder = "";
		fund_data = {};
		$(_pageId + " #fundNav").data("fund_company", null);
		$(_pageId + " #castSureMoney").val("");
		$(_pageId + " #moneyDate").val("");
		$(_pageId + " #fundNav").val("--");
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		clearBuyMsg();
		$(" .dw-persp").hide();
		
	}
	
	var finanDetail = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = finanDetail;
});