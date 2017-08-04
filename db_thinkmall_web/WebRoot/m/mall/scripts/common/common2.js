/**
 * 公共类
 * @author wangwz
 * @returns
 * @date 2015年9月23日 下午4:38:33
 */
define(function(require, exports, module){ 
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var gconfig = require("gconfig"); // 全局配置
	var global = gconfig.global; // 全局配置对象
	var endecryptUtils = require("endecryptUtils"); // 加密工具类
	var validatorUtil = require("validatorUtil"); // 校验工具类
//	var ssoUtils = require("ssoUtils");
	var app = navigator.appVersion,
    appversion = app.toLocaleLowerCase();
	var constants = require("constants");// 常量类
	var pageGlobal = {
			"trade_pwd" : "",
			"fund_account" : "",
			"login_type" : "2",
			"login_channel" : "2"
	};
	
	
	/**
	 * 模块初始化方法
	 */
	function firstLoadFunc(){
		$("body > a").hide();
		$("#loading").fadeOut(); //隐藏载入效果
	}
	
	
	/**
	 * 用户信息查询
	 * login_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * login_value 输入值
	 * login_pwd 密码
	 */
	function userInfo(user_id){
//		var isFromApp = appUtils.getSStorageInfo("isFromApp",isFromApp)
		var loginParam = {
				"user_id" : user_id
		};
		service.userInfo(loginParam,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0" ){
				var results = data.results[0];
				var fund_account = results.fund_account;
					appUtils.setSStorageInfo("_isLoginIn", "true"); 
//					if(!isFromApp){
						if(appUtils.getSStorageInfo("_loginInPageCode") ){
							var _loginInPageCode = appUtils.getSStorageInfo("_loginInPageCode");
							var _loginInPageParam = JSON.parse(appUtils.getSStorageInfo("_loginInPageParam"));
							// 如果是产品详情页面购买产品时，还需要校验用户是否是用资金账号登录的。
							if (_loginInPageCode == "finan/buy" && !checkUserIsLogin(true, true, _loginInPageCode, _loginInPageParam, true)) {
								return false;
							}
							appUtils.pageInit("login/userLogin", _loginInPageCode, _loginInPageParam);
							appUtils.clearSStorage("_loginInPageCode");
							appUtils.clearSStorage("_loginInPageParam");
						}else{
							var isSignIn = appUtils.getPageParam("is_sign");
							if (isSignIn && isSignIn == "qd") {
								// 综合首页点击签到
								appUtils.pageInit("login/userLogin", "account/signIn", {});
							} else {
								appUtils.pageInit("login/userLogin", "account/userCenter", {});
							}
						}
//					} else if( appUtils.getSStorageInfo("_mobileloginPage") == "login/usermobileLogin"){
//						appUtils.pageInit("login/usermobileLogin","main");
//						appUtils.clearSStorage("_mobileloginPage");
//					}
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});
	}
		
	
	
    /**
	 * 获取url参数
	 */
	function getUrlParam(name){
		var reg = new RegExp(name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.href.substr(1).match(reg);  //匹配目标参数
		if (r!=null) return decodeURIComponent(r[1]); return null; //返回参数值
	}
	

	window.onJsOverrideUrlLoading = function(str){
        if(appversion.indexOf("windows phone")>0){
            window.external.notify(str);
        }else if(appversion.indexOf("iphone")>0){
            window.location.href=str;
        }else if(appversion.indexOf("android")>0){
            window.MyWebView.onJsOverrideUrlLoading(str);
        }else{
            window.location.href = str;
        }
    };
	
	
	/**
	 * 登录超时,未登录处理函数
	 */
	function filterLoginOut(){
		var _curPageCode = appUtils.getSStorageInfo("_curPageCode");// 当前页 pageCode
		clearSessionUserInfo();
		appUtils.pageInit(_curPageCode, "login/login", {});
	}
	

	/**
	 * 每个页面校验
	 */
	function checkPermission(checkInParam){
		var pageCode = checkInParam.pageCode;
		//获取需要登陆判断的页面编码
        var checkLoginPage = gconfig.global.checkLoginPageCode;
        //获取不需要登陆判断的页面编码
        var notCheckLoginPage = gconfig.global.notCheckLoginPageCode;
        
		// 判断当前页面是否需要登录才能进入
		if((checkLoginPage && checkLoginPage.indexOf(pageCode) > -1) || (notCheckLoginPage && notCheckLoginPage.indexOf(pageCode) < 0) ){
			
			/****根据服务器端返回用户信息判断用户是否登录*****/
			var user_id = getUserId();
			if(!user_id){
				appUtils.setSStorageInfo("_loginInPageCode", pageCode); // 设置登录成功后跳转的页面
				checkInParam.param.pageSrc = checkInParam.prePageCode; // 把页面源路径保存起来，方便后续页面返回
				appUtils.setSStorageInfo("_loginInPageParam", JSON.stringify(checkInParam.param)); // 设置登录成功后跳转页面需要传的参数
				appUtils.pageInit(pageCode, "login/userLogin", checkInParam.param);
				return false;
			}
			var loginParam = {
					"user_id" : user_id
			};
			
			var login_flag = appUtils.getSStorageInfo("login_flag");
			if(login_flag=="1"){
				appUtils.setSStorageInfo("login_flag", "0");
				baiduTJ(pageCode); // 百度统计
				return true;
			}
			
			// 去服务器上面校验 session是否失效
			service.userInfo(loginParam,function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "-999"){
					appUtils.setSStorageInfo("_loginInPageCode", pageCode); // 设置登录成功后跳转的页面
					checkInParam.param.pageSrc = checkInParam.prePageCode; // 把页面源路径保存起来，方便后续页面返回
					appUtils.setSStorageInfo("_loginInPageParam", JSON.stringify(checkInParam.param)); // 设置登录成功后跳转页面需要传的参数
					appUtils.pageInit(pageCode, "login/userLogin", checkInParam.param);
//					return false;
				}
				
				appUtils.pageInit(checkInParam.prePageCode, pageCode, checkInParam.param);
				appUtils.setSStorageInfo("login_flag", "1");
//				return true;
			});
			/****根据服务器端返回用户信息判断用户是否登录 end *****/
			/*
			var isLoginIn = appUtils.getSStorageInfo("_isLoginIn");
			if(!isLoginIn){
				appUtils.setSStorageInfo("_loginInPageCode", checkInParam.pageCode); // 设置登录成功后跳转的页面
				checkInParam.param.pageSrc = checkInParam.prePageCode; // 把页面源路径保存起来，方便后续页面返回
				appUtils.setSStorageInfo("_loginInPageParam", JSON.stringify(checkInParam.param)); // 设置登录成功后跳转页面需要传的参数
				appUtils.pageInit(checkInParam.pageCode, "login/userLogin", checkInParam.param);
				return false;
            }else{
                return true;
            }
            */
			return false;
		} else {
			baiduTJ(pageCode); // 百度统计
		}
      	return true;
    }
	
	
	/*
	 * 百度统计
	 * 新增百度统计相关代码【首页index中需要新增一段代码】
	 */
	function baiduTJ(pageCode){
		_hmt.push(['_setAutoPageview', false]); // 不自动发送 pv 统计请求 
    	
		// 调用百度统计代码
		var pageUrl = gconfig.seaBaseUrl.substring(gconfig.seaBaseUrl.indexOf("/", 7));
		pageUrl += gconfig.projName + '/index.html#!/' + pageCode + ".html";
		_hmt.push(['_trackPageview', pageUrl]);
	}
	
	/*
	 * 禁止头部和底部滑动
	 */
	function stopHeadAndFooterEvent(_pageId){
		//禁掉头部的滑动事件
		if ($(_pageId + "header").length > 0) {
			appUtils.bindEvent($(_pageId + "header"), function(e){
				e.preventDefault();
				e.stopPropagation();
			}, "touchmove");
		}
		
		//禁掉底部的滑动事件
		if ($(_pageId + "footer").length > 0) {
			appUtils.bindEvent($(_pageId + "footer"), function(e){
				e.preventDefault();
				e.stopPropagation();
			}, "touchmove");
		}
	}
	
	/**
	 * 处理 IOS 滚动的问题
	 * @param $container 滚动的容器
	 * @param $content 滚动内容
	 */
	function dealIOSScrollBug($container, $content)
	{
		if(window.iBrowser.ios)
		{
			$container[0].scrollTop = 1;
			appUtils.bindEvent($container, function(e){
				var isBottom = $container[0].scrollTop + $container.height() == $content.height();
				var isTop = $container[0].scrollTop == 0;
				if(isBottom)
				{
					$container[0].scrollTop -= 1;
				}
				else if(isTop)
				{
					$container[0].scrollTop += 1;
				}
			}, "scroll");
		}
	}

	
	/**
     * 保存用户信息
     */
    function saveSessionUserInfo(userInfo)
    {
    	saveDataToSession(userInfo);
    }
    
    /**
     * 保存数据到session中
     */
    function saveDataToSession(result){
    	appUtils.setSStorageInfo("_isLoginIn","true");
    	appUtils.setSStorageInfo("userInfo",JSON.stringify(result));
    	/*把用户编号存到session*/
		if(result.user_id){
			appUtils.setSStorageInfo("user_id",result.user_id);
		}
		/*把用户名存到session*/
		if(result.user_name){
			appUtils.setSStorageInfo("user_name",result.user_name);
		}
		/*把账户名存到session*/
		if(result.account_name){
			appUtils.setSStorageInfo("account_name",result.account_name);
		}
		/*把资金账号存到session*/
		if(result.fund_account){
			appUtils.setSStorageInfo("fund_account",result.fund_account);
		}
		/*把风险承受能力等级存到session*/
		if(result.risk_level){
			appUtils.setSStorageInfo("risk_level",result.risk_level);
		}
		/*把风险承受能力存到session*/
		if(result.lc_risk_level){
			appUtils.setSStorageInfo("lc_risk_level",result.lc_risk_level);
		}
		/*把理财风险承受能力存到session*/
		if(result.risk_level_txt){
			appUtils.setSStorageInfo("lc_risk_level_txt",result.risk_level_txt);
		}
		/*把手机号码存到session*/
		if(result.mobile_phone){
			appUtils.setSStorageInfo("mobile_phone",result.mobile_phone);
		}
		/*把身份证号存到session*/
		if(result.identity_num){
			appUtils.setSStorageInfo("identity_num",result.identity_num);
		}
		/*存login_by_mail到session*/
		if(result.login_by_mail){
			appUtils.setSStorageInfo("login_by_mail",result.login_by_mail);
		}
		/*存lc_branch_no到session*/
		if(result.lc_branch_no){
			appUtils.setSStorageInfo("lc_branch_no",result.lc_branch_no);
		}
		/*存lc_client_no到session*/
		if(result.lc_client_no){
			appUtils.setSStorageInfo("lc_client_no",result.lc_client_no);
		}
		/*存lc_fund_account到session*/
		if(result.lc_fund_account){
			appUtils.setSStorageInfo("lc_fund_account",result.lc_fund_account);
		}
    }
    
    /**
     * 清空cookie中的用户信息
     */
    function clearSessionUserInfo(){
    	appUtils.clearSStorage("_isLoginIn");
    	appUtils.clearSStorage("userInfo");
    	appUtils.clearSStorage("user_id");
    	appUtils.clearSStorage("user_name");
    	appUtils.clearSStorage("account_name");
    	appUtils.clearSStorage("fund_account");
    	appUtils.clearSStorage("risk_level");
    	appUtils.clearSStorage("lc_risk_level");
    	appUtils.clearSStorage("lc_risk_level_txt");
    	appUtils.clearSStorage("mobile_phone");
    	appUtils.clearSStorage("identity_num");
    	appUtils.clearSStorage("login_by_mail");
    	appUtils.clearSStorage("lc_branch_no");
    	appUtils.clearSStorage("lc_client_no");
    	appUtils.clearSStorage("lc_fund_account");
    	appUtils.clearSStorage("recomCode");
    	appUtils.clearSStorage("app_unique_code");
    }
 
	
	/**
	 * 给定一个文本内容进行加密
	 */
	function rsaEncryptTradePwd(param){
		var pwd = "";
		service.getRSAKey({},function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo!=="0"){
				layerUtils.iLoading(false);
				layerUtils.iAlert(errorInfo);
			}else{
				var results = data.results[0];
			    var modulus = results.modulus;
			    var publicExponent = results.publicExponent;
			    pwd = endecryptUtils.rsaEncrypt(modulus, publicExponent, param);
			    if(pwd){
					pageGlobal.trade_pwd = pwd;
//					mallLogin();
				}
			}
		},{"isLastReq":false});
	}
	/**
	 * 密码加密
	 */
	function rsaEncrypt(param, backCall, reqParam){
		if (reqParam) {
			reqParam.isLastReq = false;
		}else{
			reqParam = {"isLastReq" : false};
		}
		if (reqParam && reqParam.isShowWait == "false") {
			reqParam.isShowWait = false;
		}
		service.getRSAKey({},function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo!=="0"){
				layerUtils.iLoading(false);
				layerUtils.iAlert(errorInfo);
			}else{
				var results = data.results[0];
				var modulus = results.modulus;
				var nowTime = results.nowTime;
				var publicExponent = results.publicExponent;
				var pwdParam=[];
				for (items in param){
					var sourcePwd = param[items];
					if (nowTime) {
						sourcePwd += "|" + nowTime;
					}
					var pwd = endecryptUtils.rsaEncrypt(modulus, publicExponent, sourcePwd);
					pwdParam.push(pwd);
				}
				if(backCall){
					backCall(pwdParam);
				}
			}
		},{"isLastReq":false});
	}
	
	/*
	 * 密码加密 返回多个，，入参中有几个，返回几个。 入参是什么，出参就是什么
	 */
	function rsaEncryptTwo(param,backCall){
		service.getRSAKey({},function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo!=="0"){
				layerUtils.iLoading(false);
				layerUtils.iAlert(errorInfo);
			}else{
				var results = data.results[0];
			    var modulus = results.modulus;
			    var publicExponent = results.publicExponent;
			    var pwdParam=[];
			    for (items in param){
				    var pwd = endecryptUtils.rsaEncrypt(modulus, publicExponent, param[items]);
//			    	pwdParam.push(pwd);
				    pwdParam[items] = pwd;
				}
				if(backCall){
					backCall(pwdParam);
				}
			}
		},{"isLastReq":false});
	}
	
	/**
	 * 
	 * 金额 用逗号 隔开,可以控制小数位数，自动四舍五入
	 * 排除数字、.-之外字符，保留给定小数位，默认两位  如：1234567 -> 1,234,567.00
	 * @param s 金额
	 * @param p 保留小数位数
	 */
	function fmoney(s, p){ 
	   var n =(typeof (p) == 'number') && p > 0 && p <= 20 ? p : 2;   
	   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
	   var l = s.split(".")[0].split("").reverse();
	   var r = s.split(".")[1];   
	   var t = "";   
	   for(var i = 0; i < l.length; i ++ ){   
	      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
	   }   
	   return t.split("").reverse().join("") + "." + r;   
	}
	
	/**
	 * 金额，还原函数 如：1,234,567 -> 1234567
	 * @param s 字符串入参
	 */
	function rmoney(s){   
	   return parseFloat(s.replace(/[^\d\.-]/g, ""));   
	} 
	
	/**
	 * 保留小数点后的两位
	 * @param n 数字格式的字符串
	 * @returns 处理后的数字字符串
	 */
	function keepTwoNumber(n){
		if (/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
			var slength = 0;
			var p = n.indexOf('.');
			if (p >= 0) {
				var s_ = n.split("."),
				   slength_ = s_[1].length;
				if(slength_>2){
					slength = 2;
				}else{
					slength = slength_;
				}
				n = n.substring(0, p+slength+1);
			}
		}
		return n;
	}
	
	/**
	 * 设置页面主体部分的高度， (屏幕的高度-头部高度-页脚高度)
	 * @param _pageId 当前页面Id
	 * @returns
	 */
	function setMainHeight(_pageId){
		var winHeight = $(window).height();
		var headerHeight = $("#header").height();
		var footerHeight = $("#footer").height();
		$(_pageId + " .main").css("height", (winHeight-headerHeight-footerHeight)+"px").css("overflow", "auto");
	}
	
	/**
	 * 根据订单状态码，返回状态描述
	 * @param {Object} order_state
	 */
	function getOrderStateName(order_state){
		var stateKey = "order_state_" + order_state;
		var  orderState = {
			 "order_state_0":"暂未支付",
			 "order_state_1":"待提交",
			 "order_state_2":"提交成功",
			 "order_state_3":"失败",
			 "order_state_4":"成交",
			 "order_state_5":"已取消",
			 "order_state_6":"已撤单",
			 "order_state_7":"已退款",
			 "order_state_8":"正在处理中",
			 "order_state_9":"成交失败",
			 "order_state_10":"委托失败"
		};
		return orderState[stateKey];
	}
	
	/**
	 * 根据交易状态码，返回状态描述
	 * @param {Object} order_state
	 */
	function getEntrustStateName(order_state){
		var stateKey = "order_state_" + order_state;
		var  orderState = {
			 "order_state_0":"未报",
			 "order_state_1":"待报",
			 "order_state_2":"已报",
			 "order_state_3":"已报待撤",
			 "order_state_4":"部成待撤",
			 "order_state_5":"部撤",
			 "order_state_6":"已撤",
			 "order_state_7":"部成",
			 "order_state_8":"已成",
			 "order_state_9":"废单"
		};
		return orderState[stateKey];
	}
	
	/**
	 * 根据定投状态码，返回状态描述
	 * @param {Object} agreement_status  // 定投协议状态（0：终止，1：启用，2：暂停）
	 */
	function getAgreementStatusName(agreement_status){
		var stateKey = "agreement_status_" + agreement_status;
		var  orderState = {
			 "agreement_status_0":"终止",
			 "agreement_status_1":"启用",
			 "agreement_status_2":"暂停",
			 "agreement_status_4":"失败"
		};
		return agreement_status[stateKey];
	}
	
	/**
	 * 根据业务类型，返回业务描述
	 * @param {Object} order_state
	 */
	function getBusinessTypeName(business_type){
		var stateKey = "business_type_" + business_type;
		var  orderState = {
			 "business_type_0":"认购",
			 "business_type_1":"申购",
			 "business_type_2":"赎回",
			 "business_type_3":"买入",
			 "business_type_4":"卖出"
		};
		return orderState[stateKey];
	}
	
	/**
	 * 底部导航栏切换
	 * @author wangwz
	 * @param _pageId 当前页面ID
	 */
	function footerTab(_pageId){
		appUtils.bindEvent($(_pageId + ".footer_nav .row-1"),function(){
			var index = $(_pageId + ".footer_nav .row-1").index(this);
			var _curPageCode = appUtils.getSStorageInfo("_curPageCode");// 当前页pageCode
			
			if(index == "0" && _curPageCode != "main"){
				appUtils.pageInit(_curPageCode,"main",{});
			}else if(index == "1" && _curPageCode != "finan/market"){
				appUtils.pageInit(_curPageCode,"finan/market",{});
			}else if(index == "2" && _curPageCode != "active/index"){
				appUtils.pageInit(_curPageCode,"active/index",{});
			}else if(index == "3" && _curPageCode != "account/userCenter"){
				appUtils.pageInit(_curPageCode,"account/userCenter",{});
			}
		});
	}
	
	/**
	 * 从Storage中获取用户ID
	 * @author wangwz
	 */
	function getUserId(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		if (userInfo) {
			var user_id = JSON.parse(userInfo).user_id; //可以将json字符串转换成json对象
			if (user_id) {
				return user_id;
			}
		}
		return "";
	}
	
	/**
	 * 根据年份和月份计算出有多少天
	 * @returns 天数
	 */
	function getDaysByYearAndMonth(year, month){
		var month30Day = [4, 6, 9, 11]; // 30 天的月份数组
		
		// 判断是否为润年
		var isRN = false;
		if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
			isRN = true;
		}
		
		if (month30Day.indexOf(month) != -1) {
			// 4，6，9，11月份返回30天
			return 30;
		} else if (month == 2) {
			if (isRN) {
				// 非润年的2月份返回29天
				return 29;
			} else {
				// 润年的2月份返回28天
				return 28;
			}
			
		} else {
			// 其他返回31天
			return 31;
		}
	}
	
	/**
	 * 根据年份和月份计算出有多少天
	 * @param year: 年份
	 * @param month: 月份【注：此处的月份为待计算的月份减一，如：计算2015年2月有多少天时，year = 2015, month = 1 以此类推】
	 * @returns 天数
	 */
	function getMonthDays(year, month){     
        var monthStartDate = new Date(year, month, 1);      
        var monthEndDate = new Date(year, month + 1, 1);      
        var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);      
        return days;      
    }
	
	/*
	 * 判断用户是否已经登录
	 * @param isCheckFundAccount : 是否需要校验是否绑定资金账号
	 * @param isPageBack : 当isCheckFundAccount = true 时，点击取消按钮是否需要返回到上一个页面
	 * @param isBuy: 是否是购买页面 购买页面时直接提示其用资金账号登录
	 */
	function checkUserIsLogin(isCheckFundAccount, isPageBack, loginInPageCode, loginInPageParam, isBuy){
		var isFromApp = appUtils.getSStorageInfo("isFromApp")

		var _curPageCode = appUtils.getSStorageInfo("_curPageCode");// 当前页 pageCode
		
		var tips = "请使用资金账号登录"; // 提示信息
		
		if (isBuy) {
			tips = "请使用资金账号登录进行购买";
		}
		
		//判断用户是否登录
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		if(userInfo == null || userInfo == ""){
			// 产品购买页面 提示用户使用资金账号登录
			
				if (isBuy) {
					layerUtils.iMsg(-1, tips);
				}
				if (loginInPageCode) {
					appUtils.setSStorageInfo("_loginInPageCode", loginInPageCode); // 设置登录成功后跳转的页面
					if (!loginInPageParam) {
						loginInPageParam = {};
					}
					appUtils.setSStorageInfo("_loginInPageParam", JSON.stringify(loginInPageParam)); // 设置登录成功后跳转页面需要传的参数
				}
		}
			appUtils.pageInit(_curPageCode, "login/userLogin", {});
			return false;
		var fundAccount = JSON.parse(userInfo).fund_account; // 资金账号
		// 是否需要校验资金账号
		if (isCheckFundAccount) {
			var fundAccount = JSON.parse(userInfo).fund_account; // 资金账号
			if (validatorUtil.isEmpty(fundAccount)) {
				// 确认框 点击确定按钮回调函数
				var sureBackFun = function(){
					appUtils.setSStorageInfo("_loginInPageCode", loginInPageCode); // 设置登录成功后跳转的页面
					if (!loginInPageParam) {
						loginInPageParam = {};
					}
					appUtils.setSStorageInfo("_loginInPageParam", JSON.stringify(loginInPageParam)); // 设置登录成功后跳转页面需要传的参数
					appUtils.pageInit(_curPageCode, "login/userLogin", {});
					return false;
				}
				
				// 确认框 点击取消按钮回调函数
				var cancelBackFun = function(){
					if (isPageBack) {
						appUtils.pageBack();
					}
					return false;
				}
				if (isBuy) {
					layerUtils.iMsg(-1, tips);
					sureBackFun();
				} else {
					// 使用资金账号登录时 进行确认提示
					layerUtils.iConfirm(tips, sureBackFun, cancelBackFun);
				}
				return false;
			}
		}
		return true;
	}

	/*
	 * 点击图片 跳转链接地址
	 */
	function clickImg(_pageId){
		appUtils.bindEvent($(_pageId + " img"), function(e){
			var $this = $(this),
			pro_url = $this.attr("data-pro_url");
			// 判断是否是外部地址
			if (pro_url.indexOf("#!") != -1) {
				if(pro_url && pro_url != "javascript:void(0)"){
					var urlpath = (pro_url.split("#!/")[1]).split(".html?");
					// 判断是否带有参数
					if(urlpath[1]){
						var urlparam = (urlpath[1]).split("=");
						var params = {};
						params[urlparam[0]] = urlparam[1];
						appUtils.pageInit("main",urlpath[0],params);
					}else{
						var urlpath = (pro_url.split("#!/")[1]).split(".html");
						appUtils.pageInit("main",urlpath[0],{});
					}
				}
			}else {
				appUtils.sendDirect(pro_url, true, "main");
			}
			e.stopPropagation();
		}, "click");
	}

	
	/**
	 * 描述：把yyyy-MM-dd hh:mm:ss (.S)日期字符串转化为指定格式的日期字符串
	 * 
	 * @author 万亮
	 * @param srcDate: 1、源日期为日期格式的字符串 如：2015-11-12 11:34:45
	 * 				   2、源日期为Date类型 如：new Date();
	 * @param fmt: 格式，如：yyyy-MM-dd
	 */
	function dateFormat(srcDate, fmt){
		if (!srcDate || !fmt) {
			return srcDate;
		}
		
		// 把字符串转换成日期对象
		var date = (typeof(srcDate) == "object") ? srcDate : getDateByStr(srcDate);
		
		// 非date类型时返回原字符串
		if (isNaN(date.getDay())) {
			return srcDate;
		}
		
		var o = {
			"M+" : date.getMonth() + 1, // 月份
			"d+" : date.getDate(), // 日
			"h+" : date.getHours(), // 小时
			"m+" : date.getMinutes(), // 分
			"s+" : date.getSeconds(), // 秒
			"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
			"S" : date.getMilliseconds() // 毫秒
		};
		
		// 年份比较特殊，单独处理
		if (/(y+)/.test(fmt)){
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
			
		for ( var k in o){
			if (new RegExp("(" + k + ")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
			
		return fmt;
	}
	
	/**
	 * 描述： 把日期格式字符串转换成js Date类型
	 * 
	 * @author 万亮
	 * @param dateStr: 日期字符串 格式必须为 yyyy-MM-dd hh:mm:ss 或 yyyy-MM-dd hh:mm:ss.S
	 * @returns 返回JS日期对象
	 */
	function getDateByStr(dateStr){
		if (!dateStr) {
			return;
		}
    	//去掉后面毫秒数
    	if (dateStr.indexOf(".") != -1) {
    		dateStr = dateStr.substring(0, dateStr.indexOf("."));
		}
    	
    	// 形如20160101120101转换成2016-01-01 12:01:01
    	if ($.trim(dateStr).length == 14 && dateStr.indexOf("-") == -1) {
    		dateStr = dateStr.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
		}
    	
    	// 形如20160101转换成2016-01-01
    	if ($.trim(dateStr).length == 8 && dateStr.indexOf("-") == -1) {
    		dateStr = dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3 00:00:00');
		}
    	dateStr = dateStr.replace(new RegExp("-", "gm"), "/");
    	return new Date(dateStr);
	}
	
	/**
	 * 作者：汪卫中
	 * 功能： 根据data返回数据集list，查询出错则提示
	 * @param data: 后台返回数据集
	 * @param notShowError 是否显示错误信息，默认显示
	 * @param closeLoad 是否需要手动关闭加载层 默认不需要 false
	 * @returns result: 1、如果是分页请求时返回的结果里面包含数据集【dataList】和总页数【totalPages】
	 * 					2、非分页请求直接返回结果集
	 */
	function getResultList(data, notShowError, closeLoad, errorCallBack) { 
		var result = {};
		if(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0){
				var results = data.results;
				if (results && results.length > 0) {
					var resultsOne = results[0];
					if (resultsOne.data) { 
						// 分页数据需要返回结果列表和总页数
						result.dataList = resultsOne.data; // 数据结果列表
						result.totalPages = resultsOne.totalPages; // 总页数
					} else { 
						// 非分页数据直接返回结果列表
						result = results;
					}
				}
			}else{
				// 执行错误回调
				if (errorCallBack) {
					errorCallBack();
				}
				// 显示错误信息
				if (!notShowError) {
					layerUtils.iMsg(-1, error_info);
				}
				// 是否需要手动关闭加载层
				if (closeLoad) {
					layerUtils.iLoading(false);
				}
			}
		}else{
			if(showErrorInfo){
				layerUtils.iMsg(-1, "网络异常， 请重新尝试");
			}
		}
		
		return result;
	}
	
	/**
	 * 作者：万亮
	 * @param strValue：处理数据
	 * @param 默认数据
	 */
	function toFixed(strValue,length,defaultValue){
		if(!strValue && strValue!='0'){
			return defaultValue?defaultValue:"--";
		}
		if(isNaN(strValue)){
			return defaultValue?defaultValue:strValue;
		}
		var value = parseFloat(strValue,"10");
//		return Math.round(strValue*Math.pow(10, length))/Math.pow(10, length);   
		var returnValue = Math.round(value*Math.pow(10, length))/Math.pow(10, length);
		var returnStr = returnValue.toString();
		var returnPoint = returnStr.indexOf(".");
		if(returnPoint < 0){
			returnPoint = returnStr.length;
			returnStr += ".";
		}
		var lengthValue = returnPoint + length;
		while(returnStr.length <= lengthValue ){
			returnStr += "0";
		}
		return returnStr;
	}
	
	
	var main = {
		"fmoney": fmoney,
		"rmoney": rmoney,
		"keepTwoNumber": keepTwoNumber,
		"setMainHeight": setMainHeight,
		"firstLoadFunc": firstLoadFunc,
		"filterLoginOut": filterLoginOut,
		"saveSessionUserInfo" : saveSessionUserInfo, // 保存用户信息到Cookie中
		"clearSessionUserInfo" : clearSessionUserInfo, // 清空Cookie中用户信息
		"rsaEncrypt": rsaEncrypt,
		"dateFormat": dateFormat,
		"getDateByStr": getDateByStr,
		"rsaEncryptTwo": rsaEncryptTwo,
		"getResultList": getResultList, // 处理请求结果集
		"dealIOSScrollBug": dealIOSScrollBug, //处理ios滚动问题
		"stopHeadAndFooterEvent": stopHeadAndFooterEvent, // 禁止头部和底部滑动
		"footerTab" : footerTab, // 底部导航栏切换
		"getOrderStateName" : getOrderStateName,
		"getEntrustStateName" : getEntrustStateName,
		"getBusinessTypeName" : getBusinessTypeName,
		"getUserId" : getUserId, // 获取用户编号
		"getDaysByYearAndMonth" : getDaysByYearAndMonth, // 根据年份和月份计算出有多少天
		"checkUserIsLogin" : checkUserIsLogin, // 校验用户是否登录
		"checkPermission" : checkPermission, // 页面校验拦截器
		"clickImg" : clickImg, // 点击图片
		"userInfo" : userInfo,
		"toFixed" : toFixed,
		"getUrlParam" : getUrlParam
		
	};

	// 暴露对外的接口
	module.exports = main;
});