 /**
  * 我的资料
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_updatePwdzz "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var constants = require("constants"); // 常量类
	var gconfig = require("gconfig"); //全局配置对象
	var global = gconfig.global;//全局对象里面的global
	var ssoUtils = require("ssoUtils"); // 统一登录工具类
	var client_id = appUtils.getSStorageInfo("client_id");
	var corp_id = appUtils.getSStorageInfo("corp_id");
	var app_id = appUtils.getSStorageInfo("app_id");
	var app = navigator.appVersion,
    appversion = app.toLocaleLowerCase();
	
	// 全局变量统一管理
	var pageGlobal = {
			"verify_id" : "", 	// 验证码
			"timer" : null,  // 计时器
			"mobile_phone" : "", // 手机号码
			"updateType" : "", // 修改类型
			"i" : 60	// 倒计时长
	}

	/*
	 * 初始化
	 */
	function init(){
		// 手机号码默认取用户信息中的手机号码
		var userInfo = appUtils.getSStorageInfo("userInfo");
		if (userInfo) {
			pageGlobal.mobile_phone = JSON.parse(userInfo).mobile_phone;
			if (validatorUtil.isMobile(pageGlobal.mobile_phone)){
				$(_pageId + "#mobilePhone").val(pageGlobal.mobile_phone);
				user_id = JSON.parse(userInfo).user_id;
			}else {
				$(_pageId + "#mobilePhone").val("");
			}
		}
		initView(); // 初始化页面
	}
	
	/*
	 * 判断页面显示
	 */
	function checkUpdateType(){
		/* 当用户是忘记密码时隐藏原密码框 */
//		pageGlobal.updateType = appUtils.getPageParam("update_type");
		pageGlobal.updateType = "3";
		if (pageGlobal.updateType == "3") {
			$(_pageId + ".register_list .text_item").eq(2).hide();
			$(_pageId + "#mobilePhone").next("a").hide();
//			$(_pageId + "#mobilePhone").attr("readonly","readonly");
			
		}else if(pageGlobal.updateType == "0"){
			$(_pageId + ".register_list .text_item").eq(3).hide();
			$(_pageId + ".register_list .text_item").eq(4).hide();
		}else{
			$(_pageId + "#mobilePhone").next("a").show();
			$(_pageId + "#mobilePhone").removeAttr("readonly");
		}
	}
	
	/**
	 * 初始化页面
	 */
	function initView(){
		$(_pageId + ".register_list .text_item").eq(3).show();
		$(_pageId + ".register_list .text_item").eq(4).show();
		$(_pageId + ".register_list .text_item").eq(0).show();
		$(_pageId + "#oldPwd").val("");
		$(_pageId + "#newPwd").val("");
		$(_pageId + "#surePwd").val("");
		$(_pageId + "#mobileCode").val("");
		$(_pageId + "#msgTips").html("");
		checkUpdateType();
		clearMsgCodeTimer(); // 清除短信验证码计时器
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".close_btn2", function(){
			appUtils.pageBack();
		});
		
		appUtils.bindEvent(_pageId + ".del_btn", function(){
			$(this).prev().val("");
		});
		
		/*
		 * 发送手机验证码
		 */
		appUtils.bindEvent(_pageId + ".yzm_btn", function(){
			if($(this).attr("data-state") == "false"){
				return ;
			}
			var mobile = $.trim($(_pageId + "#mobilePhone").val());
//			queryMsgCodeId(mobile);
			pageGlobal.mobile_phone = mobile;
			sso_query(mobile);
		});
		
		// 下一步
		appUtils.bindEvent(_pageId + "#nextBtn", function(){
			// 校验密码基本格式
			if (!checkInput()) {
				return false;
			}
			
			if (pageGlobal.updateType == "0") {
				updatePassword();
			}else{
				// 校验手机验证码是否正确
				var msgCode = $(_pageId + "#mobileCode").val();
				var mobilePhone = $(_pageId + "#mobilePhone").val();
//				checkMsgCode(msgCode, mobilePhone);
				sso_checkMsgCode(msgCode, mobilePhone);
			}
		});
	}
	
	//校验验证码--统一登入
	function sso_checkMsgCode(msgCode, mobilePhone){
		
		//统一登录完成后回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{	
	            	updatePassword();
	            } 
	            
				else 
				{
					layerUtils.iMsg(-1,data.error_info);
					return;
				}
	        }			
			
		}
		
		//业务参数
		var param = {};	
		param['bizcode'] = 'uums_check_sms';//业务编码
		param['corp_id'] = corp_id;//公司编号
		param['app_id'] = app_id;//應用编号
		param['auth_code'] = msgCode;//验证码
		param['mobile'] = mobilePhone;//电话号码
		param['sms_type'] = "2";//短信类型:0、用户注册1、用户登录 2、用手机找回密码
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
	
		
	}
	
	//发送验证码--统一登录
	function  sso_query(mobilePhone){
		
		//统一登录完成后回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{	
	            	$(_pageId + "#msgTips").html('已将短信校验码发送至：<a href="javascript:void(0)">' + $(_pageId + "#mobilePhone").val() + '</a>').show();
					pageGlobal.timer = setInterval(function(){
						shows(); // 倒计时读秒
					}, 1000);
					
	            } 
				else 
				{	
					clearMsgCodeTimer(); // 清除短信验证码计时器
					$(_pageId + "#msgTips").hide();
					layerUtils.iMsg(-1,data.error_info);
					return;
				}
	        }			
			
		}
		
		//业务参数
		var param = {};	
		param['bizcode'] = 'uums_send_sms';//业务编码
		param['corp_id'] = corp_id;//公司编号
		param['app_id'] = app_id;//應用编号
		param['mobile'] = mobilePhone;//电话号码
		param['sms_type'] = "2";//0	用户注册发送短信验证码1用户登录发送短信验证码2用手机找回密码发送短信验证码
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
	
		
	
	}
	
	/**
	 * 功能： 手机验证码验证编号获取
	 * @param mobilePhone: 手机号
	 * @returns result 获取手机验证编号结果集
	 */
	function queryMsgCodeId(mobilePhone){

		var param = {
				"mobile_phone" : mobilePhone
		};
		var result = {};
		service.queryMsgCodeId(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				var verify_id = results.verify_id;
				var mobile = results.mobile;
				var param = {
						"verify_id" : verify_id,
						"mobile" : mobile,
						"type" : constants.sms_type.forget_mobilePhone // 短信内容类型(0更换手机验证码，1委托成功，2注册手机验证码，3忘记手机验证码)
					};
				service.sendMsg(param,function(data){
					var error_no = data.error_no;
					var error_info = data.error_info;
					if (error_no == "0"){
						var result = data.results[0];
						
						pageGlobal.verify_id = result.verify_id; // 验证码值
						$(_pageId + "#msgTips").html('已将短信校验码发送至：<a href="javascript:void(0)">' + $(_pageId + "#mobilePhone").val() + '</a>').show();
						pageGlobal.timer = setInterval(function(){
							shows(); // 倒计时读秒
						}, 1000);
					} else {
						clearMsgCodeTimer(); // 清除短信验证码计时器
						$(_pageId + "#msgTips").hide();
						layerUtils.iMsg(-1,error_info);
					}
				}, {});
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	/**
	 * 验证验证码
	 * mobile : 手机号码
	 * code ： 验证码
	 */
	function checkMsgCode(msgCode, mobilePhone){
		var param = {
				"mobile_phone" : $.trim(mobilePhone),
				"code" : $.trim(msgCode),
				"verify_id" : pageGlobal.verify_id
		};
		
		service.checkMsgCode(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				var is_success = result.is_success;
				if(is_success == "1"){
					updatePassword();
				}else{
					layerUtils.iMsg(-1, "验证码校验失败！");
					layerUtils.iLoading(false);
				}
			} else {
				layerUtils.iMsg(-1, error_info);
				layerUtils.iLoading(false);
				return false;
			}
		}, {"isLastReq" : false});
	}
	
	/*
	 * 修改密码
	 */
	function updatePassword(){
		var oldPwd = $(_pageId + "#oldPwd").val();
		var newPwd = $(_pageId + "#newPwd").val();
		var surePwd = $(_pageId + "#surePwd").val();
		
		var param = {
			"pwd1" : $.trim(oldPwd),
			"pwd2" : $.trim(newPwd),
			"pwd3" : $.trim(surePwd)
		};
		
		if (pageGlobal.updateType == "0") {
			// 修改交易密码
			common.rsaEncryptTwo(param, updateTradePwd);
		}
		if (pageGlobal.updateType == "2") {
			// 修改登录密码
//			common.rsaEncryptTwo(param, updateQueryPwd);
			common.rsaEncryptTwo(param,ssoLog);
		}
		if (pageGlobal.updateType == "3") {
			// 忘记密码
//			common.rsaEncryptTwo(param, forgetLoginPwd);ssoLogs();//调统一登入
			common.rsaEncryptTwo(param, ssoLogs);
		}
		
	}
	
	/*
	 * 忘记密码【登录密码】
	 */
	function forgetLoginPwd(backParam){
		
		var param = {
			"user_id" : common.getUserId(),
			"pwd_new" : backParam.pwd2,
			"mobile_phone" : pageGlobal.mobile_phone,
			"verify_id" : pageGlobal.verify_id,
			"pwd_twice" : backParam.pwd3
		}
		
		service.forgetLoginPwd(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;		
			if (error_no == "0"){
				ssoLogs();//调统一登入
            	var forgetpassword = appUtils.getSStorageInfo("zjforgetpassword");
            	var mobilePhone = $.trim($(_pageId + "#mobilePhone").val());
            	layerUtils.iAlert("登录密码修改成功!",-1,function(){
            		if(forgetpassword == "1"){
	            		 var str = "http://action:3413/?register=sidi&&mobilephone="+mobilePhone;
						 onJsOverrideUrlLoading(str);
	            	}
				},"确定");
//				appUtils.pageInit("account/updatePwd", "account/myProfile", {});
				clear();
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	//忘记密码--統一登录
	function ssoLogs(){
		var loginValue = $.trim($(_pageId + "#mobilePhone").val());
		var pwdBackParam =$.trim($(_pageId + "#newPwd").val())
		//统一登录完成后回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{
	            	var forgetpassword = appUtils.getSStorageInfo("zjforgetpassword");
	            	var mobilePhone = $.trim($(_pageId + "#mobilePhone").val());
	            	layerUtils.iAlert("登录密码修改成功!",-1,function(){
	            		if(forgetpassword == "1"){
		            		 var str = "http://action:3413/?register=sidi&&mobilephone="+mobilePhone;
							 onJsOverrideUrlLoading(str);
		            	}
					},"确定");
	            	
//					appUtils.pageInit("account/updatePwd", "account/myProfile", {});
					clear();
				} 
	            else if(data.error_no=="-100101"){//账户未绑定，进入绑定页面
	            	appUtils.setSStorageInfo("huannansan_sso_userid","10000");
	            }
				else 
				{
					if(data.error_info.indexOf("客户交易密码错误")!=-1){
						errorMsg("交易密码输入有误");
						return;
					}
					else if(data.error_no=="-100100"){
						errorMsg("请输入资金账号/手机号对应的交易密码/登录密码");
					}
					else{
						layerUtils.iMsg(-1,data.error_info);
						return;
						}
	            }
	        }			
			
		}
		
		//业务参数
		var param = {};	
		param['mobile'] =  loginValue;//电话号码
		param['new_password'] = pwdBackParam;//修改后的密码
		param['bizcode'] = 'uums_reset_password';//业务编码
		param['corp_id'] = corp_id;//公司编号
		param['app_id'] = app_id;//應用编号
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
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
	
	
	//查询密码--統一登录
	function ssoLog(){

		var loginValue = $.trim($(_pageId + "#mobilePhone").val());
		var old_password= $.trim($(_pageId + "#oldPwd").val());
		var pwdBackParam =$.trim($(_pageId + "#newPwd").val())
		
		//统一登录完成后回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{
	            	layerUtils.iMsg(0, "查询密码修改成功");
					appUtils.pageInit("account/updatePwd", "account/myProfile", {});
					clear();
	            	
				} 
	            else if(data.error_no=="-100101"){//账户未绑定，进入绑定页面
	            	appUtils.setSStorageInfo("huannansan_sso_userid","10000");

	            }
				else 
				{
					if(data.error_info.indexOf("客户交易密码错误")!=-1){
						errorMsg("交易密码输入有误");
						return;
					}
					else if(data.error_no=="-100100"){
						errorMsg("请输入资金账号/手机号对应的交易密码/登录密码");
					}
					else{
						layerUtils.iMsg(-1,data.error_info);
						return;
						}
	            }
	        }			
			
		}
		
		//业务参数
		var param = {};	
//		param['login_account'] =  loginValue;//电话号码
		param['new_password'] = pwdBackParam;//修改后的密码
		param['old_password'] = old_password;
		param['bizcode'] = 'uums_modify_password';//业务编码
		param['client_id'] = client_id;//用戶编号
		param['corp_id'] = corp_id;//公司编号
		param['app_id'] = app_id;//應用编号
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
	
		
		
	}
	
	
	
	/*
	 * 修改查询密码【登录密码】
	 */
	function updateQueryPwd(backParam){
		var param = {
			"user_id" : common.getUserId(),
			"pwd_src" : backParam.pwd1,
			"pwd_new" : backParam.pwd2,
			"pwd_twice" : backParam.pwd3
		}
		
		service.updateLoginPwd(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;		
			if (error_no == "0"){
				ssoLog();
				layerUtils.iMsg(0, "查询密码修改成功");
				appUtils.pageInit("account/updatePwd", "account/myProfile", {});
				clear();
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 修改交易密码
	 */
	function updateTradePwd(backParam){
		var param = {
			"user_id" : common.getUserId(), // 用户编号
 			"trade_pwd_old" : backParam.pwd1, // 旧密码
			"trade_pwd_new" : backParam.pwd2, // 新密码
			"trade_pwd_twice" : backParam.pwd3, // 确认密码
			"type" : "0" // 修改交易密码
		}
		
		service.updateTradePwd(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				layerUtils.iMsg(0, "交易密码修改成功");
				appUtils.pageInit("account/updatePwd", "account/myProfile", {});
				clear();
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/**
	 * 清空文本框内容
	 */	
	function clear(){
		$(_pageId + "#oldPwd").empty();
		$(_pageId + "#newPwd").empty();
		$(_pageId + "#surePwd").empty();
		$(_pageId + "#mobileCode").empty();
		$(_pageId + "#msgTips").empty();
		
	}
	

	
	
	/**
	 * 显示读秒
	 */
	function shows(){
		var $code = $(_pageId + ".yzm_btn");
		$code.attr("data-state", "false");//点击不能发送
		if(pageGlobal.i >= 1){
			$code.html("" + pageGlobal.i + "s后重发");
			pageGlobal.i--;
		}else{
			window.clearInterval(pageGlobal.timer);
			pageGlobal.i=60;
			$code.attr("data-state","true");
			$code.html("重新发送");
		}
	}
	
	/**
	 * 清除短信验证码计时器
	 */
	function clearMsgCodeTimer()
	{
		var $code = $(_pageId + " .yzm_btn");
		window.clearInterval(pageGlobal.timer);
		pageGlobal.timer = null;
		$code.attr("data-state", "true");
		pageGlobal.i = 60;
		$code.html("发送验证码");
	}
	
	/*
	 * 校验密码基本格式
	 */
	function checkInput(){
		var oldPwd = $(_pageId + "#oldPwd").val();
		var newPwd = $(_pageId + "#newPwd").val();
		var surePwd = $(_pageId + "#surePwd").val();
		var msgCode = $(_pageId + "#mobileCode").val();
		
		if(pageGlobal.updateType != "3"){
			if (validatorUtil.isEmpty(oldPwd)) {
				layerUtils.iMsg(-1, "旧密码不能为空");
				return false;
			}
		}
		
		if (validatorUtil.isEmpty(newPwd)) {
			layerUtils.iMsg(-1, "新密码不能为空");
			return false;
		}
		if (validatorUtil.isEmpty(surePwd)) {
			layerUtils.iMsg(-1, "确认密码不能为空");
			return false;
		}
		if(newPwd != surePwd){
			layerUtils.iMsg(-1, "新密码与确认密码不一致");
			return false;
			
		}
		if(pageGlobal.updateType != "0"){
			if (validatorUtil.isEmpty(msgCode)) {
				layerUtils.iMsg(-1, "验证码不能为空");
				return false;
			}
			
			if($(_pageId + ".yzm_btn").attr("data-state") == "true"){
				layerUtils.iMsg(-1, "请获取验证码");
				return false;
			}
		}
		
		return true;
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var updatePwd = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = updatePwd;
});