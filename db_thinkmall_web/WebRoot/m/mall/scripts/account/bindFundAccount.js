 /**
  * 我的资料
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_bindFundAccount "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var constants = require("constants"); // 常量类
	var global = require("gconfig").global; // 全局对象
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var toBindPrePage = "";//前置跳转页

	/*
	 * 初始化
	 */
	function init(){
		// 初始化验证码
		refreshCode();
		
		// 清空文本框值
		cleanInput();
	}
	
	/*
	 * 清空文本框
	 */
	function cleanInput(){
		$(_pageId + "#fundAccount").val("");
		$(_pageId + "#tradePwd").val("");
		$(_pageId + "#ticket").val("");
	}
	
	/*
	 * 刷新验证码
	 */
	function refreshCode(){
		$(_pageId + '#code_pic').attr('src', global.validateimg + "?v=" + Math.random()); 
		$(_pageId + "#ticket").val("");
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			toBindPrePage = appUtils.getSStorageInfo("toBindPrePage");//存储返回页面
			appUtils.clearSStorage("toBindPrePage");
			if(toBindPrePage){
				if(toBindPrePage=="finan/detail"||toBindPrePage=="finan/finanDetail"){
					var product_id = appUtils.getSStorageInfo("productId");
					appUtils.pageInit("account/bindFundAccount", toBindPrePage, {"product_id":product_id});
				}else{				
					appUtils.pageInit("account/bindFundAccount", toBindPrePage, {});
				}
			}else{
				appUtils.pageInit("account/bindFundAccount", "account/userCenter", {});			
			}
		});
		
		// 点击重新获取验证码
		appUtils.bindEvent(_pageId + "#code_pic", function(){
			refreshCode();
		});
		
		/*
		 * 清空文本框
		 */
		appUtils.bindEvent(_pageId + ".del_btn", function(){
			$(this).prev().val("");
		});
		
		// 激活资金账号
		appUtils.bindEvent(_pageId + "#activeBtn", function(){
			// 输入框基本校验
			if (!checkInput()) {
				return false;
			}
			
			// 密码加密
			var tradePwd = $(_pageId + "#tradePwd").val(); // 交易密码
    		var param = {
    			"pwd1" :tradePwd
    		};
    		common.rsaEncrypt(param, bindAccount);
		});
		
		// 开户
		appUtils.bindEvent(_pageId + "#regFundAcct", function(){
			// 判断链接来源是否来自APP, 如果来自APP,头部隐藏 首先去cookie里面是否有值，再去页面参数中是否有值
			var isFromApp = appUtils.getSStorageInfo("isFromApp");
			var regAddress = constants.regFundAcctAddress.REG_ADDRESS_NORMAL;
			if (isFromApp && isFromApp == "zzapp") { 
				regAddress = constants.regFundAcctAddress.REG_ADDRESS_APP;
			} else {
				var  srcType = appUtils.getPageParam("src_type");
				if (srcType && srcType == "zzapp") {
					appUtils.setSStorageInfo("isFromApp", "zzapp");
					regAddress = constants.regFundAcctAddress.REG_ADDRESS_APP;
				} else {
					regAddress = constants.regFundAcctAddress.REG_ADDRESS_NORMAL;
				}
			}
			
			// 点击开户
			appUtils.sendDirect(regAddress, true, "account/bindFundAccount");
		});
	}
	
	/*
	 * 绑定资金账号
	 */
	function bindAccount(backParam){
		var fundAccount = $.trim($(_pageId + "#fundAccount").val()); // 资金账号
		var ticket = $(_pageId + "#ticket").val(); // 图片验证码
		var param = {
			"user_id" : common.getUserId(),
			"fund_account" : fundAccount,
			"trade_pwd" : backParam.pwd1,
			"ticket" : ticket
		}
		
		service.bindAccount(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				layerUtils.iMsg(-1, "绑定成功！");
				var result = data.results[0];
				updateUserInfoForSession(result);
				toBindPrePage = appUtils.getSStorageInfo("toBindPrePage");//存储返回页面
				appUtils.clearSStorage("toBindPrePage");
				if(toBindPrePage){
					appUtils.pageInit("account/bindFundAccount", toBindPrePage, {});
				} else {
					appUtils.pageInit("account/bindFundAccount", "account/userCenter", {});
				}
			} else {
				layerUtils.iMsg(-1, error_info);
				refreshCode();
				return false;
			}
		});
	}
	
	/*
	 * 更新session中的数据
	 */
	function updateUserInfoForSession(result){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		userInfo = JSON.parse(userInfo);
		userInfo.fund_account = result.fund_account;
		appUtils.setSStorageInfo("userInfo", JSON.stringify(userInfo));
	}
	
	/*
	 * 校验资金账号、密码基本格式
	 */
	function checkInput(){
		var fundAccount = $.trim($(_pageId + "#fundAccount").val()); // 资金账号
		if (validatorUtil.isEmpty(fundAccount)) {
			layerUtils.iMsg(-1, "资金账号不能为空");
			return false;
		}
		
		if (fundAccount.length < 8) {
			layerUtils.iMsg(-1, "资金账号不能小于8位");
			return false;
		}
		
		var tradePwd = $(_pageId + "#tradePwd").val(); // 交易密码
		if (validatorUtil.isEmpty(tradePwd)) {
			layerUtils.iMsg(-1, "交易密码不能为空");
			return false;
		}
		
		if (!validatorUtil.isNumeric(tradePwd)) {
			layerUtils.iMsg(-1, "交易密码只能为数字");
			$(_pageId + "#tradePwd").val("");
			return false;
		}
		
		var ticket = $(_pageId + "#ticket").val(); // 图片验证码
		if (validatorUtil.isEmpty(ticket)) {
			layerUtils.iMsg(-1, "验证码不能为空");
			return false;
		}
		
		return true;
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var bindFundAccount = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = bindFundAccount;
});