define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
    var pageCode = "account/userCenter";
    var _pageId = "#account_userCenter "; // 页面id
    var gconfig = require("gconfig");
    var app = navigator.appVersion,
    appversion = app.toLocaleLowerCase();
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"accountType" : "" // 判断资金账户、理财账户
	};
	
	var totalMoney = "";
	
	var user_id = "";
	
	var phoneNo = null;
	
    /*
	 * 初始化
	 */
	function init() {
		initHidden();
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		user_id = common.getUserId();
		if(user_id){
			var mobile = JSON.parse(userInfo).mobile_phone; //登录时的手机号
			var pay_account = JSON.parse(userInfo).fund_account;//登录时的资金账号
			if(mobile){
				phoneNo=mobile;
			}else{
				phoneNo=pay_account;
			}
			$(_pageId + "#loginafter").attr("style","display:block;");
			$(_pageId + "#loginfirst").attr("style","display:none;");
			pageGlobal.accountType = JSON.parse(userInfo).account_type; // 判断资金账户、理财账户
			userAsset();
			initView(); // 初始化页面
		}else{
			$(_pageId + "#loginfirst").attr("style","display:block;");
			$(_pageId + "#loginafter").attr("style","display:none;");
		}
		
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".login_page"));
		// 底部导航
		common.footerTab(_pageId);
	}
	

	/*
	 * 初始化页面
	 */
	function initView(){
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var userName = JSON.parse(userInfo).user_name; // 用户名
		var mobilePhone =  JSON.parse(userInfo).mobile_phone; // 手机号
		var userimg = JSON.parse(userInfo).img_url; //用户头像
       
		if(userimg && userimg != ""){
			$(_pageId + ".userimg01").html('<img src="'+gconfig.global.domain+userimg+'" alt="" />');
		}else{
			$(_pageId + ".userimg01").html('<img src="images/user_mr_tx.png">');
		}
		if (userName) {
			$(_pageId + ".username").html(mobilePhone+'<span>'+userName+'</span>'); //用户名
		}else if(mobilePhone){
			var itemHtml = '<span>'+mobilePhone.substring(0,3)+"****"+mobilePhone.substring(7,11)+'</span>';
			$(_pageId + ".username").html(itemHtml); //用户名
		}
	}
	
	function initHidden(){
		// 判断链接来源是否来自APP, 如果来自APP,头部隐藏 首先去cookie里面是否有值，再去页面参数中是否有值
		var isFromApp = appUtils.getSStorageInfo("isFromApp");
		if (isFromApp && isFromApp == "zzapp") { 
			$(_pageId + "header").hide();
			$(_pageId + ".dropout").text("");
			$(_pageId + ".dropout").removeClass();
		} else {
			var  srcType = appUtils.getPageParam("src_type");
			if (srcType && srcType == "zzapp") {
				appUtils.setSStorageInfo("isFromApp", "zzapp");
				$(_pageId + "header").hide();
				$(_pageId + ".dropout").text("");
				$(_pageId + ".dropout").removeClass();
			} else {
				$(_pageId + "header").show();
				$(_pageId + ".dropout").text("退出");
				$(_pageId + ".dropout").addClass("dropout");
			}
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
			$(_pageId + "#zzc span").html("--");
			$(_pageId + "#kyje").html("--");
			$(_pageId + "#cpsz").html("--");
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
						var withdrawCash = common.fmoney(results[i].useable_money, 2) || "----"; // 可用金额
						var fundMoney = common.fmoney(results[i].stock_money, 2) || "----"; // 证券市值
						totalMoney = common.fmoney(results[i].total_money, 2) || "----"; // 总金额
						$(_pageId + "#zzc span").html(totalMoney);
						$(_pageId + "#kyje").html(withdrawCash);
						$(_pageId + "#cpsz").html(fundMoney);
					}
				}
				
				// 绑定详情事件
				appUtils.bindEvent(_pageId + "#zzc a", function(){
					var mon = "";
					var kymon = "";
					var cpmon = "";
					var reg = /\d+/g;
					var iszk = $(this).attr("iszk");
					if(iszk == "1"){
						var money = totalMoney.replace(/[^0-9]/ig, "");
						for (var int = 0; int < money.length; int++) {
							mon +='*';
						}
						
						var kymoney = withdrawCash.replace(/[^0-9]/ig, "");
						for (var i = 0; i < kymoney.length; i++) {
							kymon +='*';
						}
						
						var cpmoney = fundMoney.replace(/[^0-9]/ig, "");
						for (var j = 0; j < cpmoney.length; j++) {
							cpmon +='*';
						}
						$(_pageId + "#zzc span").html(mon);
						$(_pageId + "#kyje").html(kymon);
						$(_pageId + "#cpsz").html(cpmon);
						$(this).attr("iszk","0");
						$(this).attr("class","close");
					}else if(iszk == "0"){
						$(_pageId + "#zzc span").html(totalMoney);
						$(_pageId + "#kyje").html(withdrawCash);
						$(_pageId + "#cpsz").html(fundMoney);
						iszk == "1";
						$(this).attr("iszk","1");
						$(this).removeClass();
					}
					
				});
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}

	/**
	 * 调用中焯的统一登录方法
	 */
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
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		
		// 登录
		appUtils.bindEvent(_pageId + ".loginbot", function() {
			var isFromApp = appUtils.getSStorageInfo("isFromApp")
			var clientlogin = appUtils.getSStorageInfo("clientlogin");
			if(clientlogin == "1"){
				common.getLoginClientInfo(true);
//				var ispd = true;
//				common.firstLoadFunc(ispd);
			}else{
				appUtils.pageInit(pageCode,"login/userLogin");
			}
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		//退出
		appUtils.bindEvent(_pageId + ".dropout", function(){
			layerUtils.iConfirm("确定退出吗？",function(){
				// 调用接入层退出功能号，清空浏览器sessioin
				service.loginOut({}, function(data){
					var error_no = data.error_no;
	    			var error_info = data.error_info;
	    			if (error_no == "0"){
	    				// 清空本地cookie 用户信息
	    				common.clearSessionUserInfo();
	    				appUtils.pageInit(pageCode,"account/userCenter");
	    			} else {
	    				layerUtils.iMsg(-1,error_info);
	    				return false;
	    			}
				});
			}, function(){});
		
		});
		
		appUtils.bindEvent(_pageId + ".myapp a", function(){
			var val = $(this).attr("class");
			switch (val) {
			case "a01": 
				// 我的现金管家
				if (common.checkUserIsLogin(true, false,null,null,true)) {
					appUtils.pageInit(pageCode, "account/cashbutler/detail", {"backPage" : "account/userCenter"});
				}
				break;
			case "a02": // 我的理财
				if (common.checkUserIsLogin(true, false,null,null,true)) {
					appUtils.pageInit(pageCode, "account/myFinancial", {});
				}
				break;
			case "a03": // 理财订单
				if (common.checkUserIsLogin(true, false,null,null,true)) {
					appUtils.pageInit(pageCode, "account/myOrder", {});
				}
				break;
			case "a04": // 银证转账
				if (common.checkUserIsLogin(true, false,null,null,true)) {
					appUtils.pageInit(pageCode, "account/stockBank", {});
				}
				break;
			default:
				break;
			}

		});
		
		appUtils.bindEvent(_pageId + ".myapp01 a", function(){
			var val = $(this).attr("class");
			switch (val) {
			case "a01": // 中奖查询
				appUtils.pageInit(pageCode, "activity/winList", {});
				break;
			case "a02": // 我的米袋子
				appUtils.pageInit(pageCode, "account/myIntegral", {});
				break;

			case "a03": //米仓订单
				if (common.checkUserIsLogin(false, false)) {
					appUtils.pageInit(pageCode, "active/myOrder", {});
				}
				break;
			case "a04": //我的资讯
				if (common.checkUserIsLogin(false, false)) {
					appUtils.pageInit(pageCode, "infoproduct/myInfo", {});
				}
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待！!","确定");
				break;
			default:
				break;
			}
		});
		
		
		appUtils.bindEvent(_pageId + ".myapp02 a", function(){
			var val = $(this).attr("class");
			switch (val) {
			case "a01": // 我的软件
				if (common.checkUserIsLogin(false, false)) {
					appUtils.pageInit(pageCode, "software/myOrder");
				}
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待！!","确定");
				break;
			case "a02": //我的活动
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待！!","确定");
				break;
			case "a03": // 风险测评
				if (common.checkUserIsLogin(true, false,null,null,true)) {
					queryRiskLevel();
				}
				break;
			case "a04":  //我要开户
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待！!","确定");
				appUtils.sendDirect("https://mkh.nesc.cn/indexnew");
				break;
			default:
				break;
			}
		});
		
		appUtils.bindEvent(_pageId + "#zhyh a", function(){
			var index = $(_pageId + "#zhyh a").index(this);
			switch (index) {
			case 0: // 推荐好友
				if (common.checkUserIsLogin(false, false)) {
				   appUtils.sendDirect("http://222.168.95.186:8090/m/yxtg/index.html#!/promotion/makeCode.html?sourceNo=0003&phoneNo="+phoneNo);
//				   appUtils.sendDirect("http://218.62.40.21:8081/m/yxtg/index.html#!/promotion/makeCode.html?sourceNo=0003&phoneNo="+phoneNo);
//				   appUtils.sendDirect("http://222.168.95.186:8090/m/yxtg/index.html#!/survey/questionnaire.html?recordAppNo=00181");
				}
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待！!","确定");
				break;
			case 1: // 我的资料
				appUtils.pageInit(pageCode, "account/myProfile", {});
				break;
			case 2: // 我要吐槽
				appUtils.pageInit(pageCode, "account/does", {});
				break;
			default:
				break;
			}
		});
   }
	
	/*
	 * 查询风险测评等级
	 */
	function queryRiskLevel(){
		var reqParam = {
			"user_id" : common.getUserId()
		}
		
		service.queryRiskLevel(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					var pageParam = appUtils.getPageParam(); // 测评成功后需要返回的页面
					if (!pageParam) {
						pageParam = {};
					}
					pageParam.riskScore = item.risk_fraction || "0.0";
					pageParam.riskName = item.risk_name;
					pageParam.backPage = "account/userCenter";
					appUtils.pageInit(pageCode, "register/riskAssDetail", pageParam);
				} else {
					appUtils.pageInit(pageCode, "register/riskAssessment", {"backPage" : "account/userCenter1"});
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}

	/*
	 * 页面销毁
	 */
	function destroy() {};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});