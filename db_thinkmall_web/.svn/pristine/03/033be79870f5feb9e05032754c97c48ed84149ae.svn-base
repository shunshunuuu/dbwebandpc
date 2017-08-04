 /**
  * 我的资料
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_bindMobilePhone "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var timer = null; // 计时器
	var i = 60; // 倒计时长
	var isUsed = false; //是否使用
	var verify_id = ""; // 验证码

	/*
	 * 初始化
	 */
	function init(){
		
		// 清空文本框值
		initView();
	}
	
	/*
	 * 清空文本框
	 */
	function initView(){
		$(_pageId + ".tips_txt").hide();
		$(_pageId + "#mobilePhone").val("");
		$(_pageId + "#msgCode").val("");
		clearMsgCodeTimer(); // 清除短信验证码计时器
	}
	
	/**
	 * 检查身份证号，手机号，银行卡号是否已被使用(1000192)
	 * type //0  手机 1 身份证 2 银行卡
	 * mobile_phone 输入值
	 */
	function isBeUsed(mobilePhone){
		var param = {
				"mobile" : mobilePhone,
				"type" : "0" //0  手机 1 身份证 2 银行卡
		};
		
		service.isBeUsed(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				var is_exist = result.phoneOrAccountIsExists; // 是否已存在
				if(is_exist == "0"){
					sendPhoneCode(mobilePhone);
					isUsed = false; // 标示为未使用
				}else{
					isUsed = true; // 标示为已使用
					layerUtils.iLoading(false); // 关闭加载图片
					layerUtils.iAlert("该账号已经被注册！");
				}
				
			} else {
				layerUtils.iLoading(false); // 关闭加载图片
				layerUtils.iMsg(-1,error_info);
				isUsed = true; // 标示为已使用
				return false;
			}
		}, {"isLastReq":false});
	}
	
	/**
	 * 发送验证码
	 * mobile : 手机号码
	 */
	function sendPhoneCode(mobilePhone){
		var param = {
				"mobile" : mobilePhone,
				"type" : "2" // 短信内容类型(0更换手机验证码，1委托成功，2注册手机验证码，3忘记手机验证码)
		};
		service.sendMsg(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				verify_id = result.verify_id; // 验证码值
				var mpStr = mobilePhone.substring(0, 3) + "****" + mobilePhone.substring(mobilePhone.length - 4, mobilePhone.length);
				$(_pageId + ".tips_txt").show().find("a").text(mpStr); // 显示发送成功后提示
				timer = setInterval(function(){
					shows(); // 倒计时读秒
				}, 1000);
			} else {
				clearMsgCodeTimer(); // 清除短信验证码计时器
				$(_pageId + ".tips_txt").hide(); // 隐藏提示
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
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
	
	/**
	 * 验证验证码
	 * mobile : 手机号码
	 * code ： 验证码
	 */
	function checkMsgCode(msgCode, mobilePhone){
		var param = {
				"mobile_phone" : mobilePhone,
				"code" : msgCode,
				"verify_id" : verify_id
		};
		
		service.checkMsgCode(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				var is_success = result.is_success;
				if(is_success == "1"){
					bindPhone(mobilePhone);
				}else{
					layerUtils.iMsg(-1,"验证码校验失败！");
					layerUtils.iLoading(false); // 关闭加载图片
				}
			} else {
				layerUtils.iMsg(-1, error_info);
				layerUtils.iLoading(false); // 关闭加载图片
				return false;
			}
		}, {"isLastReq":false});
	}
	
	/*
	 * 绑定手机
	 */
	function bindPhone(mobilePhone){
		var param = {
			"user_id" : common.getUserId(),
			"mobile_phone" : mobilePhone,
			"verify_id" : verify_id
		}
		
		service.bindMobilePhone(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				layerUtils.iMsg(-1, "绑定成功！");
				updateUserInfoForSession(mobilePhone);
				appUtils.pageInit("account/bindMobilePhone", "account/myProfile", {});
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/**
	 * 显示读秒
	 */
	function shows(){
		var $code = $(_pageId + ".yzm_btn");
		$code.attr("data-state", "false");//点击不能发送
		if(i >= 1){
			$code.html("" + i + "s后重发");
			i--;
		}else{
			window.clearInterval(timer);
			i=60;
			$code.attr("data-state","true");
			$code.html("重新发送");
		}
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".close_btn2", function(){
			appUtils.pageBack();
		});
		
		/*
		 * 清空文本框
		 */
		appUtils.bindEvent(_pageId + ".del_btn", function(){
			$(this).prev().val("");
		});
		
		/*
		 * 发送验证码
		 */
		appUtils.bindEvent(_pageId + ".yzm_btn", function(){
			if($(this).attr("data-state") == "false"){
				return ;
			}
			
			var mobilePhone = $(_pageId + "#mobilePhone").val();
			if (validatorUtil.isMobile(mobilePhone)){
				// 校验手机号码是否已被使用
				isBeUsed(mobilePhone);
			}else {
				layerUtils.iMsg(-1,"请输入正确的电话号码！！！");
				$(_pageId + "#mobilePhone").val("");
			}
		});
		
		/*
         * 下一步设置登录密码
         */
        appUtils.bindEvent($(_pageId + "#nextBtn"),function(){
        	var msgCode = $(_pageId + "#msgCode").val();
        	var mobilePhone = $(_pageId + " #mobilePhone").val();
        	
        	// 校验手机号码和验证码格式
        	if(checkInput()){
        		// 后台校验验证码是否正确
        		checkMsgCode(msgCode, mobilePhone);
        	}
        	
        });
	}
	
	/*
	 * 更新session中的数据
	 */
	function updateUserInfoForSession(mobilePhone){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		userInfo = JSON.parse(userInfo);
		userInfo.mobile_phone = mobilePhone;
		appUtils.setSStorageInfo("userInfo", JSON.stringify(userInfo));
	}
	
	/*
	 * 校验资金账号、密码基本格式
	 */
	function checkInput(){
    	
    	var msgCode = $(_pageId + "#msgCode").val();
    	var mobilePhone = $(_pageId + " #mobilePhone").val();
    	
    	if (validatorUtil.isEmpty(mobilePhone)) {
    		layerUtils.iMsg(-1, "手机号码不能为空");
    		return false;
		}
    	
    	if (validatorUtil.isEmpty(msgCode)) {
    		layerUtils.iMsg(-1, "手机验证码不能为空");
    		return false;
		}
    	
    	if (verify_id == "") {
    		layerUtils.iMsg(-1, "请先发送手机验证码");
    		return false;
		}
    	
    	return true;
    	
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var bindMobilePhone = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = bindMobilePhone;
});