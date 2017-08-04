/**
 * 程序入口配置读取
 * 项目开发时需要的自定义配置
 * 另外：configuration为系统配置模块或者配置模板
 * 这里可以扩展，支持多个系统共用一个项目：
 * 思路：在最开始的地方做一个sysCode的获取，然后在这个模块初始化时赋不同系统的configuration配置模块的引用，
 * 当然还要做修改的地方，比如地址栏hash处理，需要增加sysCode（涉及到的模块main和appUtils）
 */
define(function(require, exports, module) {
	
	var configuration = {
//			"firstLoadCss": "/mall/css/style.css", //项目中的需要先加载的css样式文件
			//"layerTheme": "a", //各种弹出层样式主题样式，默认为系统自带
			"pageTitle" : "金融商城-东北证券",//页面标题
			"projPath" : "/mall/", //工程目录
			"filters": { 
				//未登录
				"-999": function(resultVo){
					
				}
			},
			//登录检测
			"loginCheck" : {				
				"pageFilters" : ["login/login","lcMall/login/loginPage","index","include/header","include/footer","login/include/header","login/include/footer"], //过滤的pageCode,可以绕过登录
				"checkFunc" : function(pageCode,param){  //检测处理函数
					var isLogin = false ;
					var toLogin = function(){
						$.removeStorage("isAuthenticated");
						$.removeStorage(serviceConstants.session.USER);
						var loginPageCode = "lcMall/login/loginPage";
						var pageCode = window.top.location.pathname ;
						if($.string.isNotEmpty(pageCode))
						{
							tmp = pageCode.split("?");// 把参数和文件名分割开
							pageCode = $.string.replaceAll(tmp[0],".html","") ;
							pageCode = $.string.replaceAll(pageCode,"/mall/views/","") ;
							pageCode = $.crypto.des.encrypt("thinkive_mall", pageCode) ;
						}
						var param = {};
						param.order_id = $.net.getDesUrlParamValue("order_id");
						param.amount = $.net.getDesUrlParamValue("tot_price");
						param.pay_way = $.net.getDesUrlParamValue("pay_way");
						param.product_id = $.net.getDesUrlParamValue("product_id");
						param.product_code = $.net.getDesUrlParamValue("product_code");
						param.product_sub_type = $.net.getDesUrlParamValue("product_sub_type");
						if(param){
							$.session.presistObj("url_param", param);
						}
						var jsonParam = {"pageCode":pageCode};
						$.redirect(loginPageCode,jsonParam);
						isLogin = false ;
					};
					
					$.ajaxAuthenticated(function(){isLogin = true ;},toLogin) ;//第一个参数为登录成功的回调，第二个为未登录的回调
					/*
					var isAuthenticated = $.getStorage("isAuthenticated");
					var userInfo = isAuthenticated.split("@|@|@") ;
					if($.string.isEmpty(userInfo[0])){
						$.ajax({ 
				            type: "post", //以post方式与后台沟通
				            url : "/servlet/TokenAction?function=AjaxAuthenticated&t="+Math.random(), //判断是否登录
				            dataType:'json', 
				            async:false,
				            success: function(resultVo){
				            	if($.string.isEmpty(resultVo.data.user_id)){
				            		toLogin();
				            	}else{
				            		$.setSessionStorage("isAuthenticated", resultVo.data.user_id + "@|@|@" + new Date().getTime()) ; //登录标识
				            		$.session.presistObj("user", resultVo.data);
				            		isLogin=true;
				            	}
				            }
						});
					}else{
						isLogin=true;
					}
					*/
					return isLogin ;
				}
			},
			/**
			 * 项目中模块的别名配置 
			 */
			"pAlias": { 
				"helpCenterService" : "mall/scripts/service/helpCenter/helpCenterService", // 帮助中心服务类
				"userServicesLc" : "/mall/scripts/service/userServices/userServicesLc", // 用户服务类
				"registerLcService" : "/mall/scripts/service/kh/registerLcService", // 注册服务类
				"riskService" : "/mall/scripts/service/kh/riskService", // 风险测评服务类
				"orderService" : "/mall/scripts/service/trade/orderService", // 订单服务服务类
				"paymentService" : "/mall/scripts/service/trade/paymentService", // 购买服务类
				"bindBankService" : "/mall/scripts/service/kh/bindBankService", // 绑卡服务类
				"page" : "mall/scripts/utils/page", // 分页工具类
				"layerWeb" : "/mall/scripts/utils/layer/layerWeb", // 弹出框 Web端工具类
				"resultVoUtil" : "/mall/scripts/utils/resultVoUtil", // 处理返回数据集工具类
				"bannerUtil" : "mall/scripts/utils/bannerUtil", // 广告工具类
				"load" : "/mall/scripts/utils/load", // 模块化加载列表类
				"password" : "/mall/scripts/utils/password", // 加解密工具类
				"common" : "/mall/scripts/utils/common", // 公用方法类
				"loginUtil" : "/mall/scripts/utils/loginUtil", // 登录工具类
				"serviceConstants" : "/mall/scripts/constants/serviceConstants" // 业务常量类
			},
			/** 
			 * 项目中需要调用到的常量、变量这里配置
			 * 调用方式，通过require("gconfig").global.*来调用
			 */
			"global": { 
				"session_time":30, //session过期时间
				"home": "index", //商城首页pageCode
				"webIco" : "/mall/images/logo.ico",//地址栏
				"server": "/servlet/json", //网上商城Web接入应用程序
				"vfImg":  "/servlet/Image", //验证码地址
				"mobile": "/servlet/SmsAction",//向手机发送验证码及验证码正确与否
				"perPageNum" : "10",//每页显示的数量
			    "nowPageNum" : "1"//当前页码
			},
			//全局初始化函数
			initFunc:function(callBackFunc){
				//初始化js和css
				var jsAndCss = [];
				jsAndCss.push("loginUtil");
				
/*				jsAndCss.push("/mall/css/animate.css");
				jsAndCss.push("/mall/css/style.css");
				jsAndCss.push("/mall/css/common.css");
				jsAndCss.push("/mall/css/ui-font.css");
				jsAndCss.push("/mall/scripts/utils/commonUtil");
				jsAndCss.push("/mall/scripts/utils/layer/layerWeb");
				jsAndCss.push("/mall/scripts/utils/HChartUtil");
				jsAndCss.push("/mall/scripts/utils/transUtil");
				jsAndCss.push("/mall/scripts/service/product/otcService");*/
				require.async(jsAndCss,function(){
					if(callBackFunc){
						callBackFunc();
					}
				});
				
				//ADD BY HUANGRONALDO TIME:2014.5.28
				$("a[data-page^='/mall/views/']").live("click", function(){ //绑定 点击事件
					var pageCode = $(this).attr("data-page") ;
					var isAuthenticated = $(this).attr("data-isAuthenticated") ;
					if($.string.isNotEmpty(pageCode) && $.string.startWith (pageCode,"/mall/views/")){
						pageCode = $.string.replaceAll(pageCode,"/mall/views/","") ; //替换字符串
					}
					if("1"==isAuthenticated){ //需要校验登录
						$.isLoginAndShow(pageCode) ; //调用登录校验方法，并且
					}else{
						$.redirect(pageCode,{});//
					}
				});
				//Add by HUANGRONALDO 密码框禁止复制
				$("input[type='password']").attr("oncopy","return false").attr("onpaste","return false").attr("oncut","return false") ; 
				//$("input[type='password']").attr("oncopy","return false").attr("onpaste","return false")  ; 
				$("input:password").live("copy cut paste",function(e){return false;}) ;
			}
		};
		//暴露对外的接口
		module.exports = window.configuration = configuration;
});