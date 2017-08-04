 /**
  * 我的资料
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_myProfile "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");

	/*
	 * 初始化
	 */
	function init(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		
		// 初始化界面
		initView();
		
		initUserInfo();
		//从中焯app过来隐藏修改密码
		initHidden();
	}
	
	/*
	 * 页面样式
	 */
	function pageStyle(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var isLoginType = JSON.parse(userInfo).is_login_type; // 资金账号
		if (isLoginType && isLoginType == "0") {
			$(_pageId + "#forgetPwdLi").hide(); // 隐藏忘记密码
		}
	}
	
	/*
	 * 初始化界面
	 */
	function initView(){

		$(_pageId + "#tradePwdLi").show(); // 显示修改交易密码
		$(_pageId + "#loginPwdLi").show(); // 显示修改查询密码
		$(_pageId + "#forgetPwdLi").show(); // 显示修改查询密码
		$(_pageId + "#userName").empty();
		$(_pageId + "#IDCard").empty();
		$(_pageId + "#fundAccount").empty();
		$(_pageId + "#mobilePhone").empty();
		$(_pageId + "#bankCard").empty();
		pageStyle();
	}
	
	function initHidden(){
		// 判断链接来源是否来自APP, 如果来自APP,头部隐藏 首先去cookie里面是否有值，再去页面参数中是否有值
		//隐藏修改密码
//		var isFromApp = appUtils.getSStorageInfo("isFromApp");
		var clientlogin = appUtils.getSStorageInfo("clientlogin");
		if (clientlogin && clientlogin == "1") { 
	        $(_pageId + "#accountSafe").hide();
		}else{
			$(_pageId + "#accountSafe").show();
		}
	}
	
	/*
	 * 初始化用户信息，从session中获取
	 */
	function initUserInfo(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			var userId = userInfo.user_id; // 用户编号
			var userName = userInfo.user_name || ""; // 客户名称
			var IDCard = userInfo.identity_num || ""; // 证件号码
			var mobilePhone = putils.phoneNoShow(userInfo.mobile_phone);// 商城注册手机号码
			var telephone = putils.phoneNoShow(userInfo.telephone); // 资金账号注册时的手机号码
			var fundAccount = userInfo.fund_account; // 资金账号
			var email = userInfo.user_mail; // 邮箱 
			
			// 资金账号处理
			var fundAccountHtml = ""; // 资金账号Html
			if (validatorUtil.isEmpty(fundAccount)) {
				$(_pageId + "#tradePwdLi").hide(); // 隐藏修改交易密码
				fundAccountHtml = '	<div class="ui layout">' + 
									'		<span class="lt_txt">资金账号：</span>' + 
									'		<div class="row-1">' + 
									'			<p class="text-right ablue"></p>' + 
									'		</div>' + 
									'	</div>';
				
				$(_pageId + "#mobilePhone").html(mobilePhone); // 取商城注册的手机号码
			} else {
				// 有资金账号时查询银行卡信息；
				$(_pageId + "#loginPwdLi").hide(); // 隐藏修改查询密码
				$(_pageId + "#forgetPwdLi").hide(); // 隐藏修改忘记密码
				$(_pageId + "#mobilePhone").html(telephone); // 取资金账号注册时的手机号码
				queryBankInfo(userId, fundAccount);
				fundAccount = fundAccount.substring(0, 2) + "****" + fundAccount.substring(fundAccount.length - 2, fundAccount.length);
				fundAccountHtml = '<div class="ui layout">' + 
									'	<span class="lt_txt">资金账号：</span>' + 
									'	<div class="row-1">' + 
									'		<p class="text-right">' + fundAccount + '</p>' + 
									'	</div>' + 
									'</div>';
			}
			$(_pageId + "#fundAccountLi").html(fundAccountHtml);
			
			// 手机号码处理 没有手机号码时，显示绑定手机号码。
//			var mobilePhoneHtml = ""; // 手机号码Html
//			if (validatorUtil.isEmpty(mobilePhone)) {
//				$(_pageId + "#loginPwdLi").hide(); // 隐藏修改查询密码
//				mobilePhoneHtml = '	<div class="ui layout">' + 
//									'		<span class="lt_txt">手机号码：</span>' + 
//									'		<div class="row-1">' + 
//									'			<p class="text-right ablue"></p>' + 
//									'		</div>' + 
//									'	</div>';
//			} else {
//				
//				$(_pageId + "#mobilePhone").html(mobilePhone);
//				mobilePhoneHtml = '<div class="ui layout">' + 
//							'	<span class="lt_txt">手机号码：</span>' + 
//							'	<div class="row-1">' + 
//							'		<p class="text-right">' + mobilePhone + '</p>' + 
//							'	</div>' + 
//							'</div>';
//			}
//			$(_pageId + "#mobilePhoneLi").html(mobilePhoneHtml);
			
//			var emailHtml = ""; // 邮箱html
//			if (validatorUtil.isEmpty(email)) {
//				emailHtml = '<a href="javascript:void(0)">' + 
//							'	<div class="ui layout">' + 
//							'		<span class="lt_txt">邮&nbsp;&nbsp;&nbsp;箱：</span>' + 
//							'		<div class="row-1">' + 
//							'			<p class="text-right ablue">立即绑定</p>' + 
//							'		</div>' + 
//							'	</div>' + 
//							'</a>';
//			} else {
//				emailHtml = '<div class="ui layout">' + 
//							'	<span class="lt_txt">邮&nbsp;&nbsp;&nbsp;箱：</span>' + 
//							'	<div class="row-1">' + 
//							'		<p class="text-right">' + email + '</p>' + 
//							'	</div>' + 
//							'</div>';
//			}
//			$(_pageId + "#userMailLi").html(emailHtml);
			if (validatorUtil.isNotEmpty(IDCard)) {
				IDCard = IDCard.substring(0, 3) + "****" + IDCard.substring(IDCard.length - 4, IDCard.length);
			}
			$(_pageId + "#IDCard").html(IDCard);
			$(_pageId + "#userName").html(userName);
			
			// 绑定资金账号
			appUtils.bindEvent(_pageId + "#fundAccountLi a", function(){
				appUtils.pageInit("account/myProfile", "account/bindFundAccount", {});
			});
			
			// 绑定邮箱
			appUtils.bindEvent(_pageId + "#userMailLi a", function(){
				
			});
			
			// 绑定手机号码
			appUtils.bindEvent(_pageId + "#mobilePhoneLi a", function(){
				appUtils.pageInit("account/myProfile", "account/bindMobilePhone", {});
			});
		}
	}
	
	/*
	 * 加载用户存管银行信息
	 */
	function queryBankInfo(userId, fundAccount){
		var param = {
			"user_id" : userId,
			"fund_account" : fundAccount
		}
		
		service.accountBank(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					var bankCardNo = $.trim(item.bank_card_no); // 银行卡号
					if (bankCardNo) {
						bankCardNo = bankCardNo.substring(0, 4) + " **** **** " + bankCardNo.substring(bankCardNo.length - 4, bankCardNo.length);
					} else {
						bankCardNo = "";
					}
					
					$(_pageId + "#bankCard").html(bankCardNo);
				}
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
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("account/myProfile", "account/userCenter", {});
		});
		
		// 修改交易密码
		appUtils.bindEvent(_pageId + "#tradePwdLi a", function(){
			appUtils.pageInit("account/myProfile", "account/updatePwd", {"update_type" : "0"});
		});
		
		// 修改资金密码
		appUtils.bindEvent(_pageId + "#moneyPwdLi a", function(){
			
		});
		
		// 修改查询密码
		appUtils.bindEvent(_pageId + "#loginPwdLi a", function(){
			appUtils.pageInit("account/myProfile", "account/updatePwd", {"update_type" : "2"});
		});
		
		// 忘记密码
		appUtils.bindEvent(_pageId + "#forgetPwdLi a", function(){
			appUtils.pageInit("account/myProfile", "account/updatePwd", {"update_type" : "3"});
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var myProfile = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myProfile;
});