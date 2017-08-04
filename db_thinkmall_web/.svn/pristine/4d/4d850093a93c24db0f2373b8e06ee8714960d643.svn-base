/**
 * 统一注册
 */
define('mall/scripts/index/ssoBind', function(require, exports, module) {
	var appUtils = require("appUtils");
	var gconfig = require("gconfig");
	var global = gconfig.global;
	var _pageId = "#index_ssoBind ";
	var layerUtils = require("layerUtils");
	var layer = require("layer"); // 自定义提示信息
	var validatorUtils = require("validatorUtil");
	var common = require("common");
	var ssoUtils = require("ssoUtils");
	var cookieUtils = require("cookieUtils"); 
	var project = require("project"); // 项目相关
	var inputFault = require("inputFault"); // 文本框断层显示
	var stringUtils = require("stringUtils"); // 字符串工具类
	var inputCtl = require("inputCtl"); // 为文本框后面添加清除和查看密码按钮
	var merid = "";
	var time = validatorUtils.isNotEmpty(gconfig.send_sms_time)?parseInt(gconfig.send_sms_time):120;//倒计时的总时间
	var ex_time = time;//倒计时的剩余时间
	var ts;//计时器的对象
	function init()
	{   
		
		//未登录，直接跳转登录页面
		var huannansan_sso_userid=appUtils.getSStorageInfo("huannansan_sso_userid");
		if(validatorUtils.isEmpty(huannansan_sso_userid)){
			appUtils.pageInit("index/ssoBind","index/ssoLogin");
			return;
		}
		merid = appUtils.getPageParam('merid');
		ssoUtils.checkCookieValidity(merid);		
		$(_pageId+"#sendMobelCodeResult").hide();
		$(_pageId+"#sendMobelCode").show();
		$(_pageId+"#mobile").val("");
		$(_pageId+"#mobile_code").val("");
		$(_pageId+"#password").val("");
		$(_pageId+"#password2").val("");
		
		
		initView();
	}
	
	function bindPageEvent()
	{
		//发送短信验证码
		appUtils.bindEvent($(_pageId+"#sendMobelCode"),function(){
			var mobile= stringUtils.trimAll($(_pageId+"#mobile").val());
			if(validatorUtils.isEmpty(mobile)){
				layer.errorTip("手机号码不能为空");
				return;
			}
			if(!validatorUtils.isPhone(mobile)){
				layer.errorTip("手机号码格式不正确");
				return;
			}
			//回调函数
			var callback = function(data){				
			    if (data) 
				{
		            if (data.error_no == 0) 
					{
		            	timeCount();
		            } 
					else 
					{
		                layerUtils.iAlert(data.error_info);
		            }
		        }			
			}
			//业务参数
			var param = {};			
			param['mobile'] =  mobile;
			param['sms_type'] =  "0";
			param['bizcode'] = 'uums_send_sms';//业务编码		
			param['login_source_merid'] = global.sysFlag;
			var url = global.ssoLoginUrl;
			ssoUtils.ssoRemoteLogin(url,param,callback);
		});
		
		
	/*	//绑定
		appUtils.bindEvent($(_pageId+"#submit"),function(e){
			if(checkInput(true)){
				bindPhone();
			}
		});*/
		
		//返回
		appUtils.bindEvent($(_pageId+"#back"),function(){
			appUtils.pageBack();
		});
		
	}
	
	function destroy()
	{
		$(_pageId+"#sendMobelCodeResult").hide();
		$(_pageId+"#sendMobelCode").show();
		$(_pageId+"#mobile").val("");
		$(_pageId+"#mobile_code").val("");
		$(_pageId+"#password").val("");
		$(_pageId+"#password2").val("");
		appUtils.clearSStorage("huannansan_sso_userid");
	}
	
	function initView(){
		var myInputCtl = new inputCtl({"pageId" : _pageId});
		myInputCtl.appendClearBtn("#mobile", setBtnStatus); // 账号文本框添加【清空】按钮
		myInputCtl.appendClearBtn("#mobile_code", setBtnStatus, {"marginRight" : "0.1rem"}); // 账号文本框添加【清空】按钮
		myInputCtl.appendBothBtn("#password", setBtnStatus, {"isPwdInput" : true}); // 登录密码文本框添加【清空】和【查看密码】按钮
		myInputCtl.appendBothBtn("#password2", setBtnStatus, {"isPwdInput" : true}); // 登录密码文本框添加【清空】和【查看密码】按钮
	
		//手机号码断层
		$(_pageId + "#mobile").mobileInput();
		$(_pageId + "#mobile_code").numberInput(); // 只允许输入数字
		setBtnStatus();
	}
	
	/**
	 * 设置按钮状态
	 */
	function setBtnStatus(){
			if (checkInput(false)) {
        		// 设置按钮状态可用
        		project.setBtnUsable(_pageId + "#submit", bindPhone);
			} else {
				// 设置按钮状态不可用
				project.setBtnDisable(_pageId + "#submit");
			}
	}
	
	//校验文本框
	function checkInput(isShow){
		var mobile= stringUtils.trimAll($(_pageId+"#mobile").val());
		var mobile_code=$.trim($(_pageId+"#mobile_code").val());
		var password=$.trim($(_pageId+"#password").val());
		var password2=$.trim($(_pageId+"#password2").val());
		if(validatorUtils.isEmpty(mobile)){
			if(isShow){
				layer.errorTip("手机号码不能为空");
			}
			return;
		}
		if(!validatorUtils.isPhone(mobile)){
			if(isShow){
			layer.errorTip("手机号码格式不正确");
			}
			return;
		}
		//未发送验证码
		var sendMobelCode_val = $(_pageId + "#sendMobelCode").is(':hidden');
		if($(_pageId + "#sendMobelCode").is(':hidden')==false){
			if (isShow) {
				layer.errorTip("请获取验证码");
			}
			return false;
		}
		if(validatorUtils.isEmpty(mobile_code)){
			if(isShow){
			layer.errorTip("手机验证码不能为空");
			}
			return;
		}
		if(validatorUtils.isEmpty(password)){
			if(isShow){
			layer.errorTip("密码不能为空");
			}
			return;
		}
		if(validatorUtils.isEmpty(password2)){
			if(isShow){
			layer.errorTip("确认密码不能为空");
			}
			return;
		}
		
		// 6-20  字母数字
		/*var regPhone = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
			if (regPhone.test(password)!=true||regPhone.test(password2)!=true) {
				if(isShow){
				layer.errorTip("请输入6-20位字母加数字混合密码");
				}
			return;
			}*/
		
		if(password!=password2){
			if(isShow){
			layer.errorTip("密码和确认密码不同");
			}
			return;
		}
		return true;
	}
	
	//绑定手机号
	function bindPhone(){
		var mobile= stringUtils.trimAll($(_pageId+"#mobile").val());
		var mobile_code=$.trim($(_pageId+"#mobile_code").val());
		var password=$.trim($(_pageId+"#password").val());
		var url = global.ssoLoginUrl;
		//回调函数
		var callback = function(data){				
		    if (data) 
			{
	            if (data.error_no == 0) 
				{
	            	layer.iMsg("绑定成功！");
	            	// 清空本地cookie 用户信息
					common.clearSessionUserInfo();
					var phone = mobile;
	            	appUtils.pageInit("index/ssoBind","index/ssoLogin", {"userName":phone});
	            }else if(data.error_no == "-110401"){
	            	appUtils.pageInit("index/ssoBind","index/ssoLogin");
	            }
				else 
				{
					layer.errorTip(data.error_info);
	            }
	        }			
		}
		//业务参数
		var param = {};			
		param['mobile'] =  mobile;
		param['mobile_code'] =  mobile_code;
		param['password'] =  password;
		param['trade_pwd'] =  appUtils.getPageParam('tradePwd');
		param['bizcode'] = 'uums_add_account';//业务编码		
		param['login_source_merid'] = global.sysFlag;
		ssoUtils.ssoRemoteLogin(url,param,callback);
	}
	
	//定时
	function timeCount(){
		$(_pageId+"#sendMobelCode").hide();
		$(_pageId+"#sendMobelCodeResult").show();
		$(_pageId+"#sendMobelCodeResultTime").html(ex_time);
		ex_time -= 1;
		ts = setInterval(function(){
			if(ex_time==0){
//				$("#"+id).html("获取验证码");
//				$("#"+id).attr("class","qz_yzmbtn fr");
//				$("#"+id).bindEvent(sendSms);
//				$(page_id+" #ifSendSms").val("0");
				$(_pageId+"#sendMobelCode").show();
				$(_pageId+"#sendMobelCodeResult").hide();
				clearInterval(ts);
				ex_time = time;
			}else{
				if(ex_time>0){
					$(_pageId+"#sendMobelCodeResultTime").html(ex_time);
					ex_time -= 1;
				}
			}
		},1000);
	}
	

	var menu = {
		init: init,
		bindPageEvent: bindPageEvent,
		destroy: destroy
	};
	
	module.exports = menu;
});