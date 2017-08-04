 /**
  * 注册
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#register_setLoginPwd "; // 页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var common = require("common"); // 公共类
	var gconfig = require("gconfig"); // 全局对象
	var	platform = gconfig.platform;
	var global = gconfig.global;
	var app = navigator.appVersion,
    appversion = app.toLocaleLowerCase();
	
	// 全局变量统一管理
	var pageGlobal = {
			"app_unique_code" : "" // 唯一码
	}

	 var zjregister = null;
	/*
	 * 初始化
	 */
	function init(){
		pageGlobal.app_unique_code = appUtils.getSStorageInfo("app_unique_code");
		   //是否从中焯到手机号注册界面
        zjregister = appUtils.getSStorageInfo("zjregister");
        if(zjregister){
        	$(_pageId+ "#loginBtn").html("确定");
        }
	}
	
	/**
	 * 注册
	 * input_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * input_value 输入值
	 * login_pwd 密码
	 * channel_code 操作渠道(0 PC 1 IOS 2 ANDROID)
	 * user_type //用户类型 (0 个人 1  机构)
	 */
	function userRegister(backParam){
        var mobilePhone = appUtils.getPageParam("mobilePhone");
        var verifyId = appUtils.getPageParam("verify_id");
		var param = {
				"input_type" : "2",
				"input_value" : mobilePhone,
				"login_pwd" : backParam[0],
				"channel_code" : platform,
				"verify_id" : verifyId,
				"user_type" : "0"
		};
		
		service.register(param,function(data){
			var results = common.getResultList(data);
			if (results.length > 0) {
				common.saveSessionUserInfo(results[0]);
				// 登录成功跳转到主页面
				/*layerUtils.iConfirm("恭喜您已经注册成功，是否进行绑卡操作？",function(){
					appUtils.pageInit("register/setLoginPwd", "main", {"showLoginSuccess" : "1"});
				}, function(){
					appUtils.pageInit("register/setLoginPwd", "register/setTradePwd");
				},"先去逛逛","我要绑卡");*/
				//appUtils.pageInit("register/setLoginPwd", "register/setTradePwd");
				var fund_account = appUtils.getSStorageInfo("fund_account");
				var mobile_phone = appUtils.getSStorageInfo("mobile_phone");
				var account_id = null;
				if(fund_account){
					account_id = fund_account;
				}else if(mobile_phone){
					account_id = mobile_phone;
				}
				countsEvent(null,account_id);
				if(pageGlobal.app_unique_code){
					appUtils.pageInit("register/setLoginPwd", "activity/activity",{"app_unique_code" : pageGlobal.app_unique_code});
				}else if(zjregister&&zjregister==1){
					 var str = "http://action:3413/?register=sidi&&mobilephone="+mobilePhone;
//					 alert(str);
					 onJsOverrideUrlLoading(str);
				}else{
					appUtils.pageInit("register/setLoginPwd", "main", {"showLoginSuccess" : "1"});
				}
			}
		});
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
	
	//添加统计公共方法 20161229
	function countsEvent(id, name){
		TDAPP.onEvent("_td_account",name)
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		/*返回*/
		appUtils.bindEvent($(_pageId + ".close_btn2"),function(){
        	appUtils.pageBack();
        });
        
        /*
         * 登录
         */
        appUtils.bindEvent($(_pageId + "#loginBtn"),function(){
        	var pwd = $.trim($(_pageId + "#password").val());
        	var confirmPwd = $.trim($(_pageId + "#confirmPwd").val());
        	
        	// 校验密码格式和确认密码是否相等
        	if(checkInput(pwd, confirmPwd)){
				var param = {
	    			"pwd1" :pwd
	    		};
				common.rsaEncrypt(param, userRegister);
        	}
        });
        
        /*
         * 清空密码
         */
        appUtils.bindEvent(_pageId + ".del_btn", function(){
        	$(this).prev().val("");
        });
	}
	
	/**
	 * 检验输入框是否符合规范
	 * 长度，格式等
	 */
	function checkInput(pwd, confirmPwd){
		if (validatorUtil.isEmpty(pwd)){
			layerUtils.iMsg(-1, "登录密码不能为空");
			return false;
		}
		
		if (pwd.length < 6 || pwd.length > 16) {
			layerUtils.iMsg(-1, "登录密码必须在6-16位之间");
			return false;
		}
		
		if (validatorUtil.isEmpty(confirmPwd)){
			layerUtils.iMsg(-1, "确认密码不能为空");
			return false;
		}
		
		if (validatorUtil.isCnAndEn(pwd)){
			layerUtils.iMsg(-1, "登录密码不能为中文");
			$(_pageId + "#password").val("");
			return false;
		}
		
		if (validatorUtil.isCnAndEn(confirmPwd)){
			layerUtils.iMsg(-1, "确认密码不能为中文");
			$(_pageId + "#password").val("");
			return false;
		}
		
		if (pwd != confirmPwd){
			layerUtils.iMsg(-1, "确认密码与登录密码不相等");
			return false;
		}
		
		return true;
	}
		
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#password").val("");
		$(_pageId + "#confirmPwd").val("");
		$("#loginBtn").html("")
	}
	
	var setLoginPwd = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = setLoginPwd;
});