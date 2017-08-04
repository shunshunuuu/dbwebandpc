
/**
  * @author 汪卫中
  * 
  * 描述：登录
  */
define('mall/scripts/index/ssoLogin', function(require, exports, module){ 
	var _pageId = "#index_ssoLogin ";
	var appUtils = require("appUtils"); // 核心工具类
	var userService = require("userService"); // 登录服务接口类
	var commonExt = require("commonExt"); // 常用公共方法
	var common = require("common"); // 公共方法
	var constants = require("constants"); // 常量类
	var appValidatorUtil = require("validatorUtil"); // 框架校验工具类
	var inputCtl = require("inputCtl"); // 为文本框后面添加清除和查看密码按钮
	var layer = require("layer"); 
	var gconfig = require("gconfig");
	var global = gconfig.global;
	require("inputFault"); // 文本框jquery扩展类
	var project = require("project"); // 项目相关
	var nativePluginService = require("nativePluginService");
	var external = require("external");
	var mobileService = require("mobileService");
	var ssoUtils = require("ssoUtils");
	var cookieUtils = require("cookieUtils"); 
	var layerUtils = require("layerUtils");

	/**
	 * 初始化
	 */
	function init(){
		// 初始化页面元素
//		isSetGesturePwdLogin();
		initView(); 
	}
	
	
	//查询当前用户是否设置了手势密码 
	function isSetGesturePwdLogin(){
		var openId = appUtils.getSStorageInfo("openid");
		var transLog = appUtils.getPageParam("transLog");
		// 如果openid存在，查询统一账户是否设置手势密码
		if(openId){
			var param = {"openid":openId};
			var callback = function(data){
				var results = commonExt.getReqResultList(data, true, false, function(){
       				errorMsg(data.error_info);
       			});
				var accountInfo = results[0];
				if(accountInfo){
					var pwd = accountInfo.acct_pwd;
					if (pwd && pwd !="") {
						var sso_login_ssmm_or_account = appUtils.getSStorageInfo("sso_login_ssmm_or_account");
						if(sso_login_ssmm_or_account!="1"){
							var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
/*							if (prePageCode && prePageCode == "mall/elegantList") {
								prePageCode = "main/index";
							}*/
							appUtils.pageInit(prePageCode, "index/gesturePwdLogin", {"mobilePhone" : accountInfo.mobile,"transLog" : transLog});
						}
					}
				}
			}
			userService.isSetGesturePwd(param,callback);
		}
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 登录
		appUtils.bindEvent(_pageId + "#login_btn", function(){
			var loginAccount = $(_pageId + " #loginAccount").val();
        	var loginPwd = $(_pageId + " #loginPwd").val();
        	if(checkInput(true)){
        		if(loginPwd.length<6||loginPwd.length>20){
    				errorMsg("密码输入有误");
    				return false;
        		}
        		else{
	        		var param = {
            			"loginPwd" :loginPwd
            		};
	            	ssoLogin(param);
        		}
        	}
			/*if(loginAccount.length == 11){//理财账号登录 
	        	if(checkInput(loginAccount,loginPwd)){
	        		var param = {
	        			"pwd1" :loginPwd
	        		};
	        		common.rsaEncrypt(param,accoLogin);
	        	}
        	}
        	else{//资金账号登录
        		if(checkInput(loginAccount,loginPwd)){
	        		var param = {
	        			"pwd1" :loginPwd
	        		};
	        		common.rsaEncrypt(param,fundLogin);
	        	}
        	}*/
        });
		
		// 登录
		appUtils.bindEvent(_pageId + "#register", function(){
			appUtils.pageInit("index/ssoLogin", "register/register",{});
        });
        
        // 返回
		appUtils.bindEvent(_pageId + "#backBtn", function(){
			
/*			var prePageCode = appUtils.getSStorageInfo("_prePageCode");
			if (prePageCode == "mall/elegantList" ) {
				appUtils.pageInit("index/ssoLogin", "main/index",{});
				return false;
			} 
			
			if (prePageCode == "account/userCenter" ) {
				appUtils.pageInit("index/ssoLogin", "main/index",{});
				return false;
			} */
			/**
			if (prePageCode == "register/register" ) {
				history.back();
			} 
			
			appUtils.pageBack();
			**/
			//appUtils.pageBack();
//			history.back();
			var curPage = appUtils.getPageParam("curPage");
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
			var srcPage = appUtils.getSStorageInfo("_srcPageCode"); // 源页面【非前一个页面】
			if(prePageCode && prePageCode == "main/unifyMain" || prePageCode == "index/ssoLogin") {
				appUtils.pageInit("index/ssoLogin","main/unifyMain");
			}else if(prePageCode && prePageCode == "main/index" || prePageCode == "account/userCenter") {
				appUtils.pageInit("index/ssoLogin","main/index");
			}else if(prePageCode && prePageCode == "mall/index"){
				appUtils.pageInit("index/ssoLogin","mall/index");
			}else{
				commonExt.jumpSrcPage(prePageCode);
			}
        });
        
        // 忘记密码
		appUtils.bindEvent(_pageId + "#forgetPwd", function(){
        	appUtils.pageInit("index/ssoLogin", "register/forgetPwd", {});
        });
		
		// QQ登录
		appUtils.bindEvent(_pageId + "#qqLoginBtn", function(){
			layer.iMsg("开发中,敬请期待...");
        });
		
		// 微信登录
		appUtils.bindEvent(_pageId + "#wxLoginBtn", function(){
			layer.iMsg("开发中,敬请期待...");
        });
		
		// 微博登录
		appUtils.bindEvent(_pageId + "#wbLoginBtn", function(){
			layer.iMsg("开发中,敬请期待...");
        });
		
		//注册
		appUtils.bindEvent(_pageId + "#register_btn", function(){
			appUtils.pageInit("index/ssoLogin", "register/register",{});
        });
		
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	/**************提示：所有自定义方法全部写到框架公共方法后面 begin**************************/
	
	/**
	 * 初始化页面元素
	 */
	function initView(){
		
		var account = appUtils.getLStorageInfo("loginAccount",loginAccount);
		if(account){
			$(_pageId + " #loginAccount").val(account);
		}
		
		//$(_pageId + "input").val("");
		$(_pageId + ".remove").hide();
		//如果上一个页面是修改交易密码或者登录密码||注册页面  密码框清空
		var prePageCode = appUtils.getSStorageInfo("_prePageCode");
		var userName = appUtils.getPageParam("userName");
		if(prePageCode=="account/userinfo/updateTradePwd"||prePageCode=="account/userinfo/updateLoginPwd"||
				prePageCode=="register/register"){
			$(_pageId + "#loginAccount").val(userName);
			$(_pageId + "#loginPwd").val("");	
		}
		$(_pageId + ".third_box").css("top", $(window).height() - $(_pageId + ".third_box").height() - 50);
		
		var myInputCtl = new inputCtl({"pageId" : _pageId});
		myInputCtl.appendClearBtn("#loginAccount", setBtnStatus); // 账号文本框添加【清空】按钮
		myInputCtl.appendBothBtn("#loginPwd", setBtnStatus, {"isPwdInput" : true}); // 登录密码文本框添加【清空】和【查看密码】按钮
		
		$(_pageId + "#loginAccount").numberInput(); // 登录账号只允许输入数字
//		$(_pageId + "#loginPwd").pwdInput(); // 登录密码只允许输入数字、字母和-_
		
		// 初始化按钮状态
		setBtnStatus();
		
		
	}
	
	/**
	 * 根据文本框输入的值按钮是否可用
	 */
	function setBtnStatus(){
		if (checkInput(false)) {
    		// 设置按钮状态可用
    		project.setBtnUsable(_pageId + "#loginBtn");
		} else {
			// 设置按钮状态不可用
			project.setBtnDisable(_pageId + "#loginBtn");
		}
	}
	
	/**
	 * 点击登录按钮
	 */
	function submitLogin(){
		if (checkInput(true)) {
			accountLogin();
		}
	}
	
	/**
	 * 用户登录
	 */
	function accountLogin(){
		var loginValue = $.trim($(_pageId + "#loginAccount").val());
    	var loginPwd =$(_pageId + "#loginPwd").val(); //$.trim();
    	
    	// 校验账号和密码输入是否合法
    	if (!checkInput(true)) {
			return false;
		}
    	
    	/*// 根据文本框输入的值判断是理财账号(手机号码)登录还是资金账号登录
    	var checkResult = isMobileOrFund(loginValue);
    	if (checkResult == "0") {
			// 手机号码登录
    		var pwdParam = {
    			"loginPwd" : loginPwd
    		}
    		commonExt.rsaEncrypt(pwdParam, accoLogin);
		} else if(checkResult == "1"){
			// 资金账号登录
			var pwdParam = {
    			"tradPwd" : loginPwd
    		}
			commonExt.rsaEncrypt(pwdParam, fundLogin);
		}
		else {
			errorMsg(checkResult);
		}*/
	}
	
	/**
	 * 功能： 判断文本框输入的是手机号码还是资金账号
	 * @author 汪卫中
	 * @param loginValue 文本框值
	 * @returns 返回0：手机号码，1：资金账号，其他：错误提示
	 */
	function isMobileOrFund(loginValue){
		loginValue = $.trim(loginValue); // 去除前后空格
		
		if (appValidatorUtil.isEmpty(loginValue)) {
			return $.i18n.prop("login.account.empty");
		}
		
		var loginValueLen = loginValue.length;
		if (loginValueLen == 11) { // 判断是否是手机号码 
			if (appValidatorUtil.isMobile(loginValue)) {
				return "0";
			} else {
				return $.i18n.prop("common.mobile.invalid");
			}
		} else if(loginValueLen >= 8 && loginValueLen <= 10){ // 判断是否是资金账号
			return "1";
		} else { // 输入值长度在 8-11位以外时 认为不合法
			return $.i18n.prop("login.account.invalid");
		}
	}
	
	/**
	 * 理财账号登录 (1000010)
	 * login_type 输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * login_value 输入值
	 * login_pwd 密码
	 */
	function accoLogin(pwdBackParam){
		var loginValue = $.trim($(_pageId + "#loginAccount").val()); 
		var reqParam = {
			"login_value" : loginValue,
			"login_type" : constants.loginType.MOBILEPHONE,
			"login_pwd" : pwdBackParam.loginPwd
		}
		
		userService.accoLogin(reqParam, function(data){
			// 获取登录结果
			var results = commonExt.getReqResultList(data, true, false, function(){
				errorMsg(data.error_info);
			});
			if (results && results.length > 0) {
				var userInfo = results[0];
				var isFirstLogin = userInfo.first_login_flag; // 是否是第一次登陆
				var lcClientNo = userInfo.lc_client_no; // 理财客户号
				
				// 存储用户信息
				common.saveSessionUserInfo(userInfo);
				
				// 存储用户账号和密码到壳子中 供手势密码使用
		    	var loginPwd = $.trim($(_pageId + "#loginPwd").val());
		    	var imgUrl = appUtils.getSStorageInfo("img_url");
		    	if (imgUrl) {
		    		imgUrl = gconfig.global.serverUrl + imgUrl;
				}
		    	
		    	if (gconfig.platform != constants.platform.PLATFORM_PC) {
		    		nativePluginService.function50042({"key" : "account", "value" : loginValue});
					nativePluginService.function50042({"key" : "password", "value" : loginPwd});
					nativePluginService.function50042({"key" : "userimgurl", "value" : imgUrl});
			    	
			    	//设置手势密码
					commonExt.setGesturePass("1"); 
				}
				
		    	// 登录成功后跳转到源页面
		    	var prePageCode = appUtils.getSStorageInfo("_prePageCode");
				// 第一次登录 并且没有开户时跳到 开户页面
				if (appValidatorUtil.isEmpty(lcClientNo) && isFirstLogin == "1") {
					commonExt.jumpSrcPage("register/setTradePwd");
				}
				if(prePageCode=="main/unifyMain"){
					appUtils.pageInit("index/ssoLogin", "main/unifyMain");
				}
				else{
					//var param_val=appUtils.getPageParam();
					//appUtils.pageInit("index/ssoLogin", "mall/buy", param_val);
					commonExt.jumpSrcPage("main/unifyMain");
				}
			}
		});
	}
	
	/**
	 * 资金账号登录 (1000007)
	 * fund_account 资金账号
	 * trade_pwd 交易密码
	 */
	function fundLogin(pwdBackParam){
		var loginValue = $.trim($(_pageId + "#loginAccount").val()); 
		var reqParam = {
				"fund_account" : loginValue,
				"trade_pwd" : pwdBackParam[0]
		};
		
		userService.fundLogin(reqParam, function(data){
			var results = commonExt.getReqResultList(data, true, false, function(){
				errorMsg(data.error_info);
			});
			if (results && results.length > 0) {
				var userInfo = results[0];
				var isBindPhone = userInfo.is_bindPhone; // 是否绑定了手机号码
				if (isBindPhone == "0") {
					// 跳转到绑定手机号码页面
					var pageParam = {
						"fund_account" : loginValue,
						"trade_pwd" : pwdBackParam.tradPwd
					}
					appUtils.pageInit("index/ssoLogin", "register/bindPhone", pageParam);
				} else {
					// 存储用户信息
					common.saveSessionUserInfo(userInfo);
					var fundAccount_val= appUtils.getSStorageInfo("fund_account");
					console.log(fundAccount_val);
					// 登录成功后跳转到源页面
					commonExt.jumpSrcPage("account/userCenter");
				}
			}
		});
	}
	
	function ssoLogin(pwdBackParam){

		var transLog = appUtils.getPageParam("transLog");
		console.log(transLog);
		var loginValue = $.trim($(_pageId + "#loginAccount").val()); 
		var loginPwd =  pwdBackParam.loginPwd;
		var checkPwdMode = "";
		var ssoTicket = $("#sso_ticket").val();//验证码
		var ssoLoginType = "";
		var openid = appUtils.getSStorageInfo("openid");
		if(loginValue.length == 11){//理财账号登录 
			ssoLoginType = "b";
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
	               appUtils.setLStorageInfo("loginValue",loginValue);
	               var objArr = data.temp_token_info;
	               if(objArr && objArr.length>0)
	               {
	               	 var obj = objArr[0];
	               	 var token = obj["temp_token_"+global.sysFlag];
	               	 if(token)
	               	 {
	               	 	var param = {};
	               	 	param['temp_token'] = token;
	               	 	 //模拟登录当前应用接口	(自己模块去实现自己独立的登录)
		               var curCallback = function(data){
		            		// 获取登录结果
		       			var results = commonExt.getReqResultList(data, true, false, function(){
		       				errorMsg(data.error_info);
		       			});
			               if (data.error_no == 0) 
						    {
			            	   var userInfoCallback = function(data){
			            		   if (data.error_no == 0) 
								    {
				       					// 存储用户信息
				       					common.saveSessionUserInfo(data.results[0]);
				       					var first_login = data.results[0].is_first_login;
				       					// 判断用户是否首次登录
				       					if (first_login == "1") {
				       						appUtils.setSStorageInfo("isFirstLogin", true);
				       						if (appUtils.getSStorageInfo("openid")) {
				       							appUtils.pageInit("index/ssoLogin", "login/setLocker", {});
				       							return false;
											}
										}
				       					// 登录成功后跳转到源页面判断是否新股，交易，行情进入的
				       					if (transLog) {
											// 新股，交易，行情进入的
				       						var fundAccount = appUtils.getSStorageInfo("fund_account");
				       						var openid = appUtils.getSStorageInfo("openid");
				       						
				       						if(fundAccount){
					       						if (transLog == "jiaoyi") {
					       							window.location.href="https://hqjy.swsc.com.cn/xnzq_webapp/account/account-about_new.html?hasFundAccount=true&openid=" + openid + "&redirect=https://hqjy.swsc.com.cn/xnzq_webapp/account/account-blank.html?check=true&account="+fundAccount;
					       						}else if (transLog == "hangqing"){
													window.location.href="https://hqjy.swsc.com.cn/xnzq_webapp/account/account-about_new.html?hasFundAccount=true&openid=" + openid + "&redirect=https://hqjy.swsc.com.cn/xnzq_webapp/account/account-blank.html?check=true&account="+fundAccount;
												}else if (transLog == "xingu"){
													window.location.href="https://hqjy.swsc.com.cn/xnzq_webapp/account/account-about_new.html?hasFundAccount=true&openid=" + openid + "&redirect=https://hqjy.swsc.com.cn/xnzq_webapp/view/new-check-buy.html?check=true&account="+fundAccount;
												}
				       						}else{
				       							checkFundAct(fundAccount);
				       						}
										}else{
											var prePageCode = appUtils.getSStorageInfo("_prePageCode");
											commonExt.jumpSrcPage("main/unifyMain");
											//			       					if(prePageCode == "register/register" || prePageCode == "index/ssoBind" || prePageCode == "account/assetAccountBind"||
											//			       							 prePageCode== "account/userinfo/updateLoginPwd" || prePageCode =="account/userinfo/updateTradePwd"){
											//			       						//commonExt.jumpSrcPage("account/userCenter");
											//			       						commonExt.jumpSrcPage("main/unifyMain");
											//			       					}else{
//			       							commonExt.jumpSrcPage(prePageCode);
//			       						}
										}
			       					}
			            	   }
			            	   mobileService.getSessionInfo({},userInfoCallback)
							}
		               }
		               mobileService.createSession(param,curCallback);
	               	 }
	               }
	            } 
	            else if(data.error_no=="-100101"){//账户未绑定，进入绑定页面
	            	appUtils.setSStorageInfo("huannansan_sso_userid","10000");
	            	appUtils.pageInit("index/ssoLogin","index/ssoBind",{"tradePwd":loginPwd});
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
						errorMsg(data.error_info);
						return;
						}
	            }
	        }			
			
		}
		
		//业务参数
		var param = {};			
		param['login_account'] =  loginValue;
		param['password'] = loginPwd;
		param['ticket'] = ssoTicket;
		param['bizcode'] = 'uums_login';//业务编码		
//	    param['login_mode'] = "0";
//	   	param['login_type'] = ssoLoginType;//如果传递的是手机号码则是104
	    param['device_number'] = "123456789"; 
		param['login_source_merid'] = global.sysFlag;
//		param['checkPwdMode'] =checkPwdMode;
		param['openid'] =  openid;
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url,param,callback);	
	}
	
	/**
	 * 资金账号支付方式校验
	 */
	function checkFundAct(isFundAccount){
		// 是否绑定了资金账号
//		var isFundAccount = checkInfo.is_fundAccount; // 是否开通了资金账号
		if (isFundAccount != "1") {
			var opt = {
					"pSelector" : _pageId + "#windowContainer", //父元素选择器
					"msg" : "", // 提示信息
					"type" : "1",
					"subMsg" : "你还未绑定资金账号，是否去绑定？", 
					"okText" : "去绑定", // 确定按钮文本
					"okCallBack" : function(){
						//去绑定
						appUtils.setSStorageInfo("_srcPageCode", "mall/fundDetail");
						appUtils.setSStorageInfo("_srcPageParam", appUtils.getPageParam());
						appUtils.pageInit("mall/fundDetail", "account/assetAccountBind", {});
					}
				}
			project.iConfirmWindow(opt);
			return false;
		}
	}
	
	/**
	 * 检验输入框是否符合规范
	 * @param isShowErrMsg : 是否展示错误提示
	 */
	function checkInput(isShowErrMsg){
		var loginAccount = $.trim($(_pageId + "#loginAccount").val());
		
		// 登录账号不能为空
		if (appValidatorUtil.isEmpty(loginAccount)) {
			if (isShowErrMsg) {
				errorMsg($.i18n.prop("login.account.empty"));
			}
			return false;
		}
		
		// 账号长度不能小于8位
		if (loginAccount.length < 8) {
			if (isShowErrMsg) {
				errorMsg($.i18n.prop("login.account.invalid"));
			}
			return false;
		}
		
		// 登录密码不能为空
		var loginPwd = $.trim($(_pageId + "#loginPwd").val());
		if (appValidatorUtil.isEmpty(loginPwd)) {
			if (isShowErrMsg) {
				errorMsg($.i18n.prop("login.password.empty"));
			}
			return false;
		}
		else{
			return true;
		}
		
		return true;
	}
	
	/**
	 * 错误提示，先禁用登录按钮，错误提示结束后还原按钮状态
	 */
	function errorMsg(msg){
		// 设置【下一步】按钮不可用
		project.setBtnDisable(_pageId + "#loginBtn");
		layer.errorTip(msg, 2, function(){
			project.setBtnUsable(_pageId + "#loginBtn", submitLogin);
		});
	}
	
	/**************提示：所有自定义方法全部写到框架公共方法后面 end**************************/
	
	var userLogin = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy,
		"isSetGesturePwdLogin" : isSetGesturePwdLogin
	};
	// 暴露对外的接口
	module.exports = userLogin;
});