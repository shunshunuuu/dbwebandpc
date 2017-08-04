 /**
  * 登录
  * @author wangwz
  */
define(function(require, exports, module){ 
	var _pageId = "#login_userLogin "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var service = require("mobileService"); //服务类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var common = require("common"); //公共类
	var validatorUtil = require("validatorUtil"); //校验工具类
	var gconfig = require("gconfig"); //全局配置对象
	var global = gconfig.global;//全局对象里面的global
	var constants = require("constants");// 常量类
	var ssoUtils = require("ssoUtils"); // 统一登录工具类
	var	platform = gconfig.platform;
	var timer = null;//计时器
	var i = 60;//倒计时长

	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"verify_id" : "", // 验证编号
		"app_unique_code" : "", // 活动唯一码
		"src_type" : "" //登录入口来源
	};
	
	/*
	 * 初始化
	 */
	function init(){
		pageGlobal.app_unique_code = appUtils.getPageParam("app_unique_code"); // 获取活动唯一码
//		pageGlobal.src_type = appUtils.getPageParam("src_type"); // 获取登录入口来源
		getCode();
		
		$(_pageId + " #get_code").val();
		
		// 开户链接处理
		regFundAcct();
		
		initView();
	}
	
	// 初始化界面
	function initView(){
		$(_pageId + "#tra_tab_list").find("a").removeClass("act").eq(0).addClass("act");
		$(_pageId + "#tra_tab_0").show();
		$(_pageId + "#tra_tab_1").hide();
	}
	
	/*
	 * 开户链接处理
	 */ 
	function regFundAcct(){
		// 判断链接来源是否来自APP, 如果来自APP,头部隐藏 首先去cookie里面是否有值，再去页面参数中是否有值
		var isFromApp = appUtils.getSStorageInfo("isFromApp");
		if (isFromApp && isFromApp == "zzapp") { 
			$(_pageId + ".banner_box img").attr("data-pro_url", constants.regFundAcctAddress.REG_ADDRESS_APP);
		} else {
			var  srcType = appUtils.getPageParam("src_type");
			if (srcType && srcType == "zzapp") {
				appUtils.setSStorageInfo("isFromApp", "zzapp");
				$(_pageId + ".banner_box img").attr("data-pro_url", constants.regFundAcctAddress.REG_ADDRESS_APP);
			} else {
				$(_pageId + ".banner_box img").attr("data-pro_url", constants.regFundAcctAddress.REG_ADDRESS_NORMAL);
			}
		}
		
		// 点击开户图片
		common.clickImg(_pageId + ".banner_box");
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
				sendPhoneCode(verify_id,mobile);
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	
	/**
	 * 发送验证码(*调用券商接口发送验证码)   1000500
	 * mobile : 手机号码
	 */
	function sendPhoneCode(verify_id,mobilePhone){
		
		var param = {
				"verify_id" : verify_id,
				"mobile" : mobilePhone,
				"type" : constants.sms_type.msg_login //短信内容类型(0更换手机验证码，1委托成功，2注册手机验证码，3忘记手机验证码)
		};
		service.sendMsg(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				pageGlobal.verify_id = result.verify_id;//验证码id
				
//				isSendPhone = true;
//				verify_id=data.results[0].verify_id;//验证编号将用户的验证码进行校验
				timer = setInterval(function(){
					shows();
				},1000);
			} else {
				clearMsgCodeTimer(); // 清除短信验证码计时器
				layerUtils.iMsg(-1,error_info);
			}
		},{});
	}
	
	/**
	 * 验证验证码
	 * mobile : 手机号码
	 * code ： 验证码
	 */
	function checkMsgCode(msgCode,mobilePhone){
		var param = {
				"mobile_phone" : mobilePhone,
				"code" : msgCode ,
				"verify_id" : pageGlobal.verify_id
		};
		service.checkMsgCode(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				var is_success = result.is_success;
				if(is_success == "1"){
					var loginPwd = $(_pageId + " #loginPwd").val();
					var loginPwd_tw = $(_pageId + " #loginPwd1").val();
					var param = {
		    			"pwd1" :loginPwd,
		    			"pwd2":loginPwd_tw
		    		};
					common.rsaEncrypt(param,restloginPwd);
				}else{
					layerUtils.iMsg(-1,"验证码校验失败！");
				}
			} else {
				layerUtils.iLoading(false);
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {"isLastReq":false});
	}
	
	/**
	 * 登录(手机、邮箱、身份证等登录)     1000010
	 * login_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * login_value 输入值
	 * login_pwd 密码
	 */
	function accoLogin(backParam){
        var login_value = $.trim($(_pageId + " #loginAccount").val());
        var get_code = $.trim($(_pageId + " #get_code").val());
        var recomCode = $.trim($(_pageId + " #recomCode").val()); // 推荐码
        // 将唯一码存到cookie
        if(pageGlobal.app_unique_code){
        	appUtils.setSStorageInfo("app_unique_code",pageGlobal.app_unique_code);
        }
        // 将推荐存到cookie
        if(recomCode){
//			var recomStr = /^00\d{4}$/;
//			if (recomStr.test(recomCode)){
//				appUtils.setSStorageInfo("recomCode",recomCode);
//			}
        	if (recomCode) {
        		appUtils.setSStorageInfo("recomCode",recomCode);
			}
        }
        
		var param = {
				"login_type" : "2",
				"login_value" : login_value,
				"login_pwd" : backParam[0],
				"recom_code" : recomCode,
				"code" : get_code,
				"login_channel" : "2"
		};
		
		service.accoLogin(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				common.saveSessionUserInfo(results);
				var user_id = results.user_id;
				common.userInfo(user_id);
			} else {
				layerUtils.iMsg(-1,error_info);
				$(_pageId + " #get_code").val("");
				getCode();
				return false;
			}
		}, {});

	}
	
	/**
	 * 资金账户登录(手机、邮箱、身份证等登录)     1000007
	 * fund_account //资金账号
	 * trade_pwd 交易密码
	 * ip IP
	 */
	function fundLogin(backParam){
        var login_value = $.trim($(_pageId + " #loginAccount").val());
        var get_code = $.trim($(_pageId + " #get_code").val());
        var recomCode = $.trim($(_pageId + " #recomCode").val()); // 推荐码
        // 将唯一码存到cookie
        if(pageGlobal.app_unique_code){
        	appUtils.setSStorageInfo("app_unique_code",pageGlobal.app_unique_code);
        }
        // 将推荐存到cookie
        if(recomCode){
//			var recomStr = /^00\d{4}$/;
//			if (recomStr.test(recomCode)){
//				appUtils.setSStorageInfo("recomCode",recomCode);
//			}
        	if (recomCode) {
        		appUtils.setSStorageInfo("recomCode",recomCode);
			}
        }
		var param = {
				"fund_account" : login_value,
				"login_type" : "2",
				"trade_pwd" : backParam[0],
				"recom_code" : recomCode,
				"code" : get_code,
				"login_channel" : "2"
		};
		
		service.fundLogin(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				common.saveSessionUserInfo(results);
				var user_id = results.user_id;
				common.userInfo(user_id);
				//添加统计  跨屏跟踪 20161229
				countsEvent(null,login_value);
			} else {
				layerUtils.iMsg(-1,error_info);
				$(_pageId + " #get_code").val("");
				getCode();
				return false;
			}
		}, {});

	}
	
	//添加统计公共方法 20161229
	function countsEvent(id, name){
		TDAPP.onEvent("_td_account",name)
	}

	function ssoLogin(pwdBackParam){

		var loginValue = $.trim($(_pageId + "#loginAccount").val()); 
		var loginPwd =  pwdBackParam[0];
		
		var ssoTicket = $("#sso_ticket").val();//验证码
		var ssoLoginType = "";
		
		if(loginValue.length == 11){//理财账号登录 
			ssoLoginType = "104";
//			checkPwdMode = "0";
		}else{
			ssoLoginType = "201";
//			checkPwdMode = "1";
		}
		
		//统一登录完成后回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{		 
	               var objArr = data.temp_token_info;
	               var user_info = data.user_info;
	               if(objArr && objArr.length>0 && user_info && user_info.length>0)
	               {
	               	 var obj = objArr[0];
	               	 var user = user_info[0];
	               	 var client_ids=user_info[0].client_id;
	               	 var corp_ids=user_info[0].corp_id;
	               	 var app_ids=user_info[0].app_id;
	               	 var old_passwords=$("#loginPwd").val();
	               	 appUtils.setSStorageInfo("client_id",client_ids);
	               	 appUtils.setSStorageInfo("app_id",app_ids);
	               	 appUtils.setSStorageInfo("corp_id",corp_ids);
	               	 var token = obj["temp_token_"+global.sysFlag];
	               	 var access_token = obj["access_token"];
	               	 if(token)
	               	 {
	               	 	var param = {};
	               	 	param['temp_token'] = token;
	               	 	param['access_token'] = obj["access_token"];
	               	 	 //模拟登录当前应用接口	(自己模块去实现自己独立的登录)
		               var curCallback = function(data){
		            		// 获取登录结果
		       			var results = common.getResultList(data, true, false, function(){
		       				layerUtils.iMsg(-1,data.error_info);
		       			});
			               if (data.error_no == 0) 
						    {
			            	   var userInfoCallback = function(data){
			            		   if (data.error_no == 0) 
								    {
		            					var loginParam = {
		            						"client_id" : user_info[0].client_id
		            					};
		            					service.userInfo(loginParam,function(data){
		            						var error_no = data.error_no;
		            						var error_info = data.error_info;
		            						if (error_no == "0" ){
		            							var results = data.results[0];
		            							common.saveSessionUserInfo(results);
		            							var user_id = results.user_id;
		            							common.userInfo(user_id);
		            						} else {
		            							layerUtils.iMsg(-1,error_info);
		            							return false;
		            						}
		            					}, {});
			       					}
			            	   }
			            	   service.getSessionInfo({},userInfoCallback)
							}
		               }
		               service.createSession(param,curCallback);
	               	 }
	               }
	            } 
	            else if(data.error_no=="-100101"){//账户未绑定，进入绑定页面
	            	appUtils.setSStorageInfo("huannansan_sso_userid","10000");
//	            	appUtils.pageInit("index/ssoLogin","index/ssoBind",{"tradePwd":loginPwd});
	            }
	           /* else if(data.error_no=="-100100"){//账号密码错误
	            	errorMsg("账号或密码有误，请重新输入!");
					return;
	            }*/
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
		param['login_account'] =  loginValue;
		param['password'] = pwdBackParam;
		param['check_pwd_mode'] = "0";
		param['ticket'] = ssoTicket;
		param['bizcode'] = 'uums_login';//业务编码
//	    param['login_mode'] = "0";
	   	param['login_type'] = ssoLoginType;//如果传递的是手机号码则是104
	    param['device_number'] = "123456789"; 
		param['login_source_merid'] = global.sysFlag;
//		param['checkPwdMode'] =checkPwdMode;
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
	}
	
	/**
	 * 手机、邮箱或身份证登录，对应旧版功能号【1000207】(1000024)
	 * mobile_phone 手机号
	 * verify_id 验证编号
	 * code 验证码
	 */
	function codeLogin(mobile_value){
        var mobile_phone = $.trim($(_pageId + " #mobilePhone").val());
        var get_code = $.trim($(_pageId + " #get_code_value").val());
        
		var param = {
				"mobile_phone" : $.trim(mobile_phone),
				"login_type" : "2",
				"verify_id" : pageGlobal.verify_id,
				"code" : $.trim(get_code),
				"login_channel" : "2"
		};
		
		service.codeLogin(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				common.saveSessionUserInfo(results);
				var user_id = results.user_id;
				common.userInfo(user_id);
				countsEvent(null,$.trim(mobile_phone));
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});

	}
	
	/**
	 * 统一帐号判断是否注册【1001972】
	 * mobile 手机号
	 * login_pwd 登录密码
	 */
	function isUumsLogin(pwdBackParam){
		var mobile_phone = $.trim($(_pageId + " #mobilePhone").val());
		
		var param = {
			"mobile" : mobile_phone,
			"login_pwd" : pwdBackParam.loginPwd
		};
		
		service.isUumsLogin(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				var isbool = results.is_bool;
				if (isbool) {
					ssoLogin(); // 统一登录
				}
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});
		
	}
	
	/**
	 * 该方法已经放入公共common.js里
	 * 用户信息查询
	 * login_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * login_value 输入值
	 * login_pwd 密码
	 */
	/*function userInfo(user_id){
		var loginParam = {
				"user_id" : user_id
		};
		service.userInfo(loginParam,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				var fund_account = results.fund_account;
					appUtils.setSStorageInfo("_isLoginIn", "true"); 
					if(appUtils.getSStorageInfo("_loginInPageCode")){
						var _loginInPageCode = appUtils.getSStorageInfo("_loginInPageCode");
						var _loginInPageParam = JSON.parse(appUtils.getSStorageInfo("_loginInPageParam"));
						// 如果是产品详情页面购买产品时，还需要校验用户是否是用资金账号登录的。
						if (_loginInPageCode == "finan/buy" && !common.checkUserIsLogin(true, true, _loginInPageCode, _loginInPageParam, true)) {
							return false;
						}
						appUtils.pageInit("login/userLogin", _loginInPageCode, _loginInPageParam);
						appUtils.clearSStorage("_loginInPageCode");
						appUtils.clearSStorage("_loginInPageParam");
					}
					else
					{
						var isSignIn = appUtils.getPageParam("is_sign");
						if (isSignIn && isSignIn == "qd") {
							// 综合首页点击签到
							appUtils.pageInit("login/userLogin", "account/signIn", {});
						} else {
							appUtils.pageInit("login/userLogin", "account/userCenter", {});
						}
					}
					
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});
	}*/
	
	/**
	 * 检验输入框是否符合规范
	 * 长度，格式等
	 */
	function checkInput(loginAccount,loginPwd){
		if (validatorUtil.isEmpty(loginAccount)){
			layerUtils.iMsg(-1,"用户名不能为空");
			return false;
		}
		
		if (validatorUtil.isEmpty(loginPwd)){
			layerUtils.iMsg(-1,"确认密码不能为空");
			return false;
		}
		return true;
	}
	
	/*重新 获取验证码*/
	function getCode(){	 
		var url=global.validateimg +"?v="+Math.random();
		$(_pageId+' #code_pic').click( 
			function(){ 
				$(_pageId+' #code_pic').attr('src',url); 
			}); 
		$(_pageId+' #code_pic').attr('src',url);//验证码错误，刷新获得验证码
	}
	
	/**
	 * 显示读秒
	 */
	function shows(){
		var $code = $(_pageId + " #get_code_by");
		$code.addClass("disable");
		$code.attr("data-state","false");//点击不能发送
		if(i >= 1){
			$code.html("" + i + "s后重发");
			i--;
		}else{
			window.clearInterval(timer);
			i=60;
			$code.attr("data-state","true");
			$code.removeClass("disable");
			$code.html("发送验证码");
		}
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		/*发送验证码*/
		appUtils.bindEvent($(_pageId + " #get_code_by"),function(){
			if($(this).attr("data-state")=="false"){
				return ;
			}
			mobilePhone = $(_pageId + " #mobilePhone").val();
			if (validatorUtil.isMobile(mobilePhone)){
				queryMsgCodeId(mobilePhone);
			}else {
				layerUtils.iMsg(-1,"请输入正确的电话号码！！！");
				$(_pageId+" #mobilePhone").val("");
			}
			
        });
		
		/*注册*/
		appUtils.bindEvent($(_pageId + " #register"),function(){
			appUtils.pageInit("login/userLogin","register/register",{});
        });
        
		/*忘记密码*/
		appUtils.bindEvent($(_pageId + " .forget_tips"),function(){
			$(_pageId + "#tra_tab_list").find("a:eq(0)").removeClass("act");
			$(_pageId + "#tra_tab_list").find("a:eq(1)").addClass("act");
			$(_pageId + "#tra_tab_0").hide();
			$(_pageId + "#tra_tab_1").show();
			var loginAccount = $.trim($(_pageId + "#loginAccount").val());
			if(!validatorUtil.isEmpty(loginAccount)){
				if(validatorUtil.isMobile(loginAccount)){
					$(_pageId + "#mobilePhone").val(loginAccount);
				}
			}
        });
        
        /*清空账号*/
		appUtils.bindEvent($(_pageId + " .icon_close"),function(){
			$(_pageId + " #loginAccount").val("");
        });
        
        /*返回*/
		appUtils.bindEvent($(_pageId + " .back_btn"),function(){
//			appUtils.pageInit("login/userLogin", "main", {});
			appUtils.pageBack();
        });
        
        /*登录*/
        appUtils.bindEvent($(_pageId + " #login"),function(){
        	
        	// 注销之前用户信息
    		common.clearSessionUserInfo();
        	
        	var loginAccount = $.trim($(_pageId + " #loginAccount").val());
        	
        	// 账号长度必须在8 - 11位之间
        	if (loginAccount.length < 8 || loginAccount.length > 11) {
        		layerUtils.iMsg(-1, "账号格式不正确!");
        		return false;
			}
        	
        	// 用户输入11位时，说明是手机号码登录，此时校验手机号是否符合格式
        	if(loginAccount.length == "11"){
        		if(!validatorUtil.isMobile(loginAccount)){
    				layerUtils.iMsg(-1, "请输入正确的电话号码！！！");
    				$(_pageId + " #loginAccount").val("");
    				return false;
        		}else{
                	var loginPwd = $.trim($(_pageId + " #loginPwd").val());
                	if(checkInput(loginAccount,loginPwd)){
                		var param = {
                			"pwd1" :loginPwd
                		};
//                		common.rsaEncrypt(param, accoLogin);
//                		common.rsaEncrypt(param, ssoLogin);
                		ssoLogin(loginPwd);
                	}
        		}

        	}else{
            	var loginPwd = $.trim($(_pageId + " #loginPwd").val());
            	if(checkInput(loginAccount,loginPwd)){
            		var param = {
            			"pwd1" :loginPwd
            		};
            		common.rsaEncrypt(param, fundLogin);
//            		common.rsaEncrypt(param, ssoLogin);
//            		ssoLogin(loginPwd);
            	}
        	}

        });
        
        /*验证码登录*/
        appUtils.bindEvent($(_pageId + " #code_login"),function(){
        	var get_code_value = $.trim($(_pageId + " #get_code_value").val());
        	
			if($(_pageId + "#get_code_by").attr("data-state") == "true"){
				layerUtils.iMsg(-1, "请获取验证码");
				return false;
			}
    		if (validatorUtil.isEmpty(get_code_value)){
    			layerUtils.iMsg(-1,"验证码不能为空");
    			return false;
    		}else{
    			codeLogin();
    		}

        });
		
		//初始化登录密码键盘
		appUtils.bindEvent($(_pageId+" input[keyboard-plugin='true']"),function(e){
			if(platform != "0"){
				callKeyboard($(this)); // 调用键盘
		    	e.stopPropagation();
			}
		});
		
		//点击页面关闭软键盘
		appUtils.bindEvent($(_pageId),function(e){
			if(platform != "0"){
				hideKeyboard(); // 隐藏原生键盘
				e.stopPropagation();
			}
		});
		
		//点击文本框后面的X按钮清空文本框文本
		appUtils.bindEvent($(_pageId+".del_btn"),function(){
			$(this).siblings("input").val("");//siblings获取当前同级的input框
		});
		
		// 普通用户和手机短信密码用户tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("act")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("act");
			// 设置当前tab act样式
			$(this).find("a").addClass("act");
			// 隐藏所有tab页
			$(_pageId + ".login_list").hide();
			// 显示当前tab页
			$(_pageId + "#tra_tab_" + index).show();
			
			if (index == 0) {
				// 普通用户
			} else if (index == 1) {
				// 手机短信密码用户
			}
		});
	}
	
	/**
	 * 清除短信验证码计时器
	 */
	function clearMsgCodeTimer()
	{
		var $code = $(_pageId + " #get_code_by");
		window.clearInterval(timer);
		timer = null;
		$code.attr("data-state", "true");
		i = 60;
		$code.html("发送验证码");
	}
		
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + " #loginPwd").val("");
		$(_pageId + " #get_code").val("");
		$(_pageId + " #mobilePhone").val("");
		$(_pageId + " #get_code_value").val("");
	}
	
	var userLogin = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = userLogin;
});