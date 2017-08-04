 /**
  * 注册
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#register_register "; // 页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var gconfig = require("gconfig"); // 全局对象
	var	platform = gconfig.platform;
	var global = gconfig.global;
	var i = 60; // 倒计时长
	var isUsed = false; //是否使用
	
	// 全局变量统一管理
	var pageGlobal = {
			"verify_id" : "", // 验证码
			"app_unique_code" : "", // 唯一码
			"timer": null // 计时器
	}

	/*
	 * 初始化
	 */
	function init(){
//		queryContract(); // 查询注册协议
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
				var is_exist = result.is_exist; // 是否已存在
				if(is_exist == "0"){
					queryMsgCodeId(mobilePhone);
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
						"type" : constants.sms_type.register_mobilePhone // 短信内容类型(0更换手机验证码，1委托成功，2注册手机验证码，3忘记手机验证码)
					};
				service.sendMsg(param,function(data){
					var error_no = data.error_no;
					var error_info = data.error_info;
					if (error_no == "0"){
						var result = data.results[0];
						pageGlobal.verify_id = result.verify_id; // 验证码值
						pageGlobal.timer = setInterval(function(){
							shows(); // 倒计时读秒
						}, 1000);
					} else {
						clearMsgCodeTimer(); // 清除短信验证码计时器
						layerUtils.iMsg(-1,error_info);
					}
				}, {});
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
/*	*//**
	 * 发送验证码
	 * mobile : 手机号码
	 *//*
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
				timer = setInterval(function(){
					shows(); // 倒计时读秒
				}, 1000);
			} else {
				clearMsgCodeTimer(); // 清除短信验证码计时器
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}*/
	
	/**
	 * 协议查询
	 * contract_type : 协议类型
	 */
/*	function queryContract(){
		var param = {
				"agreement_id" : "",
				"contract_type" : constants.contractType.REGISTER_AGREEMENT
		};
		service.queryContract(param,function(data){
			if(data.error_no == "0"){
				var results= data.results;
				if (results.length > 0) {
					$(_pageId + ".check_box").show(); // 显示协议页面
					var allProtocolStr = "同意"; // 所有协议字符串
					var result = results[0];
					if(result.agreement_title != null && result.agreement_title != ""){
						allProtocolStr += '<a href="javacript:void(0)" data-id="'+result.agreement_id+'" data-title="'+result.agreement_title+'" data-url="'+result.url+'">《'+result.agreement_title+'》</a>';
					}
					$(_pageId+" #agreement").html(allProtocolStr);
					
					appUtils.bindEvent(_pageId + "#agreement a", function(){
						var pageParam = {
							"results" : result
						}
						appUtils.pageInit("register/register", "register/agreement", pageParam);
						return false;
					}, "click");
				} else {
					$(_pageId + ".check_box").hide();
				}
			}else{
				layerUtils.iMsg(-1,data.error_info);
	    		return false;
			}
		});
	}*/
	
	/**
	 * 验证验证码
	 * mobile : 手机号码
	 * code ： 验证码
	 */
	function checkMsgCode(msgCode, mobilePhone){
		var param = {
				"mobile_phone" : mobilePhone,
				"code" : msgCode,
				"verify_id" : pageGlobal.verify_id
		};
		
		service.checkMsgCode(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results[0];
				var is_success = result.is_success;
				if(is_success == "1"){
					// 验证码校验成功后，跳转到设置登录密码页面
					var pageParam = {
						"mobilePhone" : mobilePhone,
						"verify_id" : pageGlobal.verify_id
					}
					appUtils.pageInit("register/register", "register/setLoginPwd", pageParam);
				}else{
					layerUtils.iMsg(-1,"验证码校验失败！");
				}
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
			window.clearInterval(pageGlobal.timer);
			i=60;
			$code.attr("data-state","true");
			$code.html("重新发送");
		}
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		/*返回*/
		appUtils.bindEvent($(_pageId + "#close_btn2"),function(){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode == "active/guidePages" || prePageCode == "active/guidePagesTwo") {
				appUtils.pageInit("register/register", "active/index", {});
				return false;
			}
			
        	appUtils.pageBack();
        });
        
		/*发送验证码*/
		appUtils.bindEvent($(_pageId + ".yzm_btn"),function(){
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
        	var msgCode = $.trim($(_pageId + "#msgCode").val());
        	var mobilePhone = $.trim($(_pageId + " #mobilePhone").val());
            var recomCode = $.trim($(_pageId + " #recomCode").val()); // 推荐码
            // 将推荐存到cookie
            if(recomCode){
            	appUtils.setSStorageInfo("recomCode",recomCode);
            }
        	
        	// 手机号是否已注册
        	if(pageGlobal.verify_id == ""){
        		layerUtils.iMsg(-1, "请先发送手机验证码");
        		return false;
        	}
        	// 校验手机号码和验证码格式
        	if(checkInput(mobilePhone, msgCode)){
        		// 后台校验验证码是否正确
        		checkMsgCode(msgCode, mobilePhone);
        	}
        });
        
        /*
         * 老客户登录按钮
         */
        appUtils.bindEvent(_pageId + "#loginBtn", function(){
        	appUtils.pageInit("register/register", "login/userLogin", {});
        });
        
        /*
         * 清空手机号码
         */
        appUtils.bindEvent(_pageId + ".del_btn", function(){
        	$(this).prev().val("");
        });
        
        /*
         * 点击查看注册协议
         */
        appUtils.bindEvent(_pageId + "#agreement", function(){
        	appUtils.pageInit("register/register", "register/registerAgreement", {});
        });
	}
	
	/**
	 * 检验输入框是否符合规范
	 * 长度，格式等
	 */
	function checkInput(mobilePhone, msgCode){
		if (validatorUtil.isEmpty(mobilePhone)){
			layerUtils.iMsg(-1, "手机号码不能为空");
			return false;
		}
		
		if (!validatorUtil.isMobile(mobilePhone)){
			layerUtils.iMsg(-1, "请输入正确的电话号码！");
			$(_pageId + "#mobilePhone").val("");
			return false;
		}
		
		if (validatorUtil.isEmpty(msgCode)){
			layerUtils.iMsg(-1, "验证码不能为空");
			return false;
		}
		
		return true;
	}
	
	/**
	 * 清除短信验证码计时器
	 */
	function clearMsgCodeTimer()
	{
		var $code = $(_pageId + ".yzm_btn");
		window.clearInterval(pageGlobal.timer);
		pageGlobal.timer = null;
		$code.attr("data-state", "true");
		i = 60;
		$code.html("发送验证码");
	}
		
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#mobilePhone").val("");
		$(_pageId + "#msgCode").val("");
		$(_pageId + ".yzm_btn").html("发送验证码");
	}
	
	var register = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = register;
});