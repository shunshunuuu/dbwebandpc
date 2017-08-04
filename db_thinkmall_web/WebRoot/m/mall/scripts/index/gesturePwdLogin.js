 /**
  * @author 黄忠敏
  * 
  * 描述：登录
  */
define('mall/scripts/index/gesturePwdLogin', function(require, exports, module){ 
	var _pageId = "#index_gesturePwdLogin ";
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
	require("muiMin");
	var muiLock = require("muiLock");
	/**
	 * 初始化
	 */
	function init(){
		$(_pageId + "#pwdWindow").hide();
		$(_pageId + "#loginPwd").val("");
		
		var headimgurl = appUtils.getSStorageInfo("headimgurl"); // 用户头像
		if (headimgurl) {
			$(".avatar_box").html('<img src="' + headimgurl + '" alt="">');
		}
		var nickname = appUtils.getSStorageInfo("nickname"); // 用户昵称
		if (nickname) {
			$("#nickName").html('欢迎' + nickname + '回来！').attr("style","color:#333333;");
		}else{
			$("#nickName").html("--");
		}
		
		mui.init();
		var holder = document.querySelector(_pageId + '#holder');
		var alert = document.querySelector(_pageId + '#nickName');
		$("#nickName").attr("style","color:#333333;")
		alert.innerText = '欢迎' + nickname + '回来！';
		var record = [];
		
		// 初始化
		mui(_pageId + '#holder').locker();
		
		// 清除上一次记录，重新绘制
		var locker = holder.locker;
		locker.cxt.clearRect(0, 0, locker.CW, locker.CH);
		locker.draw(locker.cxt, locker.pointLocationArr, [], {X: 0, Y: 0 });
		
		//处理事件
		holder.addEventListener('done', function(event) {
			var rs = event.detail;
			if (rs.points.length < 4) {
				$("#nickName").attr("style","color: #e84c3d;");
				alert.innerText = '手势密码错误';
				record = [];
				rs.sender.clear();
				return;
			}
			console.log(rs.points.join(''));
			record.push(rs.points.join(''));
			var password =  rs.points.join('');
			var param = {
    			"loginPwd" :password
    		};
			ssoLogin(param , rs);
		});
	}
	
	/**
	 * 统一登录 
	 */
	function ssoLogin(pwdBackParam ,rs){
		var transLog = appUtils.getPageParam("transLog");
		var loginPwd =  pwdBackParam.loginPwd;
		var checkPwdMode = "";
		var ssoTicket = $("#sso_ticket").val();//验证码
		var ssoLoginType = "";
		var openid = appUtils.getSStorageInfo("openid");
		ssoLoginType = "301";  //微信登录 
		var alert = document.querySelector(_pageId + '#nickName');
		
		//统一登录完成后回调函数
		var callback = function(data){				
			if (data){
				if (data.error_no == 0){		               
					var objArr = data.temp_token_info;
					if(objArr && objArr.length>0){
	               	 	var obj = objArr[0];
	               	 	var token = obj["temp_token_"+global.sysFlag];
	               	 	if(token){
	               	 		var param = {};
	               	 		param['temp_token'] = token;
	               	 		//模拟登录当前应用接口	(自己模块去实现自己独立的登录)
	               	 		var curCallback = function(data){
	               	 			// 获取登录结果
	               	 			if (data.error_no == 0){
	               	 				var userInfoCallback = function(data){
	               	 					if (data.error_no == 0){
	               	 						// 存储用户信息
	               	 						common.saveSessionUserInfo(data.results[0]);
	               	 						
	               	 						// 登录成功后跳转到源页面
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
//					       							checkFundAct(fundAccount);
						       						if (transLog == "jiaoyi") {
						       							window.location.href="https://hqjy.swsc.com.cn/xnzq_webapp/account/account-about_new.html?hasFundAccount=true&openid=" + openid + "&redirect=https://hqjy.swsc.com.cn/xnzq_webapp/account/account-blank.html?check=true&account= ";
						       						}else if (transLog == "xingu"){
														window.location.href="https://hqjy.swsc.com.cn/xnzq_webapp/account/account-about_new.html?hasFundAccount=true&openid=" + openid + "&redirect=https://hqjy.swsc.com.cn/xnzq_webapp/view/new-check-buy.html?check=true&account= ";
													}
					       						}
											}else{
												commonExt.jumpSrcPage("main/unifyMain");
											}
	               	 					} else {
		               	 					rs.sender.clear();
			               	 				errorMsg(data.error_info);
	               	 					}
	               	 				}
	               	 				mobileService.getSessionInfo({},userInfoCallback)
	               	 			} else if(data.error_no == "-999991"){
	               	 				rs.sender.clear();
	               	 				var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
									errorMsg("您的交易密码发生变更，请使用资金账户登录！");
									appUtils.pageInit(prePageCode,"index/ssoLogin");
								} else {
		               	 			rs.sender.clear();
		               	 			$("#nickName").attr("style","color: #e84c3d;");
			               			alert.innerText = '手势密码错误';
	               	 				errorMsg(data.error_info);
	               	 			}
	               	 		}
	               	 		mobileService.createSession(param,curCallback);
	               	 	}
					}
	            } else if(data.error_no == "-100101"){//账户未绑定，进入绑定页面
	            	appUtils.setSStorageInfo("huannansan_sso_userid", "10000");
	            	appUtils.pageInit("index/ssoLogin","index/ssoBind");
	            } else if(data.error_no == "-100100"){//账号密码错误
	            	rs.sender.clear();
	            	errorMsg("账号或密码有误，请重新输入!");
	            	$("#nickName").attr("style","color: #e84c3d;");
	            	alert.innerText = '手势密码错误';
					return;
	            } else {
					if(data.error_info.indexOf("客户交易密码错误") != -1){
						rs.sender.clear();
						errorMsg("交易密码输入有误");
						return;
					} else {
						rs.sender.clear();
						errorMsg(data.error_info);
						return;
					}
	            }
	        }			
		}
		//业务参数
		var param = {};			
		param['login_account'] =  openid;
		param['password'] = loginPwd;
		param['ticket'] = ssoTicket;
		param['bizcode'] = 'uums_login';//业务编码		
//	    param['login_mode'] = "0";
	   	param['login_type'] = ssoLoginType;//
	    param['device_number'] = "123456789"; 
		param['login_source_merid'] = global.sysFlag;
//		param['checkPwdMode'] =checkPwdMode;
		param['openid'] =  openid;
		//统一登录URL地址
		var url = global.ssoLoginUrl;
		
		//调用统一登录
		ssoUtils.ssoRemoteLogin(url, param, callback);	
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
					},
					"cancelCallBack" : function(){
						// 取消按钮
						appUtils.pageInit("index/gesturePwdLogin","main/unifyMain");
					}
				}
			project.iConfirmWindow(opt);
			return false;
		}
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		/**
		 * 验证登录密码
		 */
		appUtils.bindEvent(_pageId + "#checkLoginPwd", function(e){
			e.stopPropagation();
			$(_pageId + "#pwdWindow").show();
		});
		
		/**
		 * 取消关闭验证登录密码窗口
		 */
		appUtils.bindEvent(_pageId + "#cancelBtn", function(){
			$(_pageId + "#pwdWindow").hide();
			$(_pageId + "#loginPwd").val("");
		});
		
		/**
		 * 验证登录密码
		 */
		appUtils.bindEvent(_pageId + "#okBtn", function(){
			$(_pageId + "#pwdWindow").hide();
			
			var loginValue = appUtils.getPageParam("mobilePhone"); 
			var loginPwd =  $.trim($(_pageId + "#loginPwd").val());
			var ssoLoginType = "b";
			var openid = appUtils.getSStorageInfo("openid");

			// 统一登录完成后回调函数
			var callback = function(data) {
				if (data) {
					if (data.error_no == 0) {
						var objArr = data.temp_token_info;
						if (objArr && objArr.length > 0) {
							var obj = objArr[0];
							var token = obj["temp_token_" + global.sysFlag];
							if (token) {
								var param = {};
								param['temp_token'] = token;
								// 模拟登录当前应用接口 (自己模块去实现自己独立的登录)
								var curCallback = function(data) {
									// 获取登录结果
									var results = commonExt.getReqResultList(data,true,false,function() {
										errorMsg(data.error_info);
									});
									if (data.error_no == 0) {
										var userInfoCallback = function(data) {
											if (data.error_no == 0) {
												// 存储用户信息
												common.saveSessionUserInfo(data.results[0]);
												
												// 登录成功后跳转到源页面
												commonExt.jumpSrcPage("main/unifyMain");
											}
										};
										mobileService.getSessionInfo({}, userInfoCallback);
									}else if(data.error_no == "-999991"){
										var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
										errorMsg("您的交易密码发生变更，请使用资金账户登录！");
										appUtils.pageInit(prePageCode,"index/ssoLogin");
									}
								}
								mobileService.createSession(param, curCallback);
							}
						}
					} else if (data.error_no == "-100101") {// 账户未绑定，进入绑定页面
						appUtils.setSStorageInfo("huannansan_sso_userid", "10000");
						appUtils.pageInit("index/ssoLogin", "index/ssoBind");
					} else if (data.error_no == "-100100") {// 账号密码错误
						errorMsg("账号或密码有误，请重新输入!");
						return;
					} else {
						if (data.error_info.indexOf("客户交易密码错误") != -1) {
							errorMsg("交易密码输入有误");
							return;
						} else {
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
			param['bizcode'] = 'uums_login'; //业务编码		
		    param['device_number'] = "123456789"; 
			param['login_source_merid'] = global.sysFlag;
			param['openid'] =  openid;
			//统一登录URL地址
			var url = global.ssoLoginUrl;
			
			//调用统一登录
			ssoUtils.ssoRemoteLogin(url,param,callback);	
			
		});
		
		/**
		 * 关闭
		 */
		appUtils.bindEvent(_pageId + "#backBtn", function(){
			var curPage = appUtils.getPageParam("curPage");
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
			var srcPage = appUtils.getSStorageInfo("_srcPageCode"); // 源页面【非前一个页面】
			if (prePageCode && prePageCode == "mall/elegantList") {
				appUtils.pageInit("index/gesturePwdLogin","main/index");
			}else if(prePageCode && prePageCode == "main/unifyMain" || prePageCode == "index/gesturePwdLogin") {
				appUtils.pageInit("index/gesturePwdLogin","main/unifyMain");
			}else if(prePageCode && prePageCode == "main/index" || prePageCode == "account/userCenter") {
				appUtils.pageInit("index/gesturePwdLogin","main/index");
			}else if(prePageCode && prePageCode == "mall/index"){
				appUtils.pageInit("index/gesturePwdLogin","mall/index");
			}else {
				commonExt.jumpSrcPage(prePageCode);
			}
		});
		
		appUtils.bindEvent(_pageId + "#otherAccountLogin", function(){
			appUtils.setSStorageInfo("sso_login_ssmm_or_account", "1");
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); // 上一个页面
			appUtils.pageInit(prePageCode,"index/ssoLogin");
		});
		
	}
	
	/**
	 * 错误提示，先禁用登录按钮，错误提示结束后还原按钮状态
	 */
	function errorMsg(msg){
		// 设置【下一步】按钮不可用
		layer.errorTip(msg, 2, function(){
			mui.init();
		});
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	/**************提示：所有自定义方法全部写到框架公共方法后面 begin**************************/
	
	/**************提示：所有自定义方法全部写到框架公共方法后面 end**************************/
	
	var gesturePwdLogin = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = gesturePwdLogin;
});