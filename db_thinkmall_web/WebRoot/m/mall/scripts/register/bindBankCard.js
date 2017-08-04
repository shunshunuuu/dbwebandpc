 /**
  * 添加银行卡
  * 
  */
define(function(require, exports, module){ 
	require("mobiscroll.core");
	require("mall/scripts/common/plugins/mobiscroll/css/mobiscroll.core-2.5.2.css");
	require("mall/scripts/common/plugins/mobiscroll/css/mobiscroll.animation-2.5.2.css");
	require("mall/scripts/common/plugins/mobiscroll/css/mobiscroll.android-ics-2.5.2.css");
	var _pageId = "#register_bindBankCard "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var constants = require("constants"); // 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var nativePluginService = require("nativePluginService");
	var KeyPanel = require('keyPanel'); // 键盘插件 
	var myKeyPanel = new KeyPanel(); 
	var gconfig = require("gconfig"); // 全局对象
	var	platform = gconfig.platform;
	var global = gconfig.global;
	var URL=global.url;
	
	var timer = null;//计时器
	var i = 60;//倒计时长
	var req_rerial = "";
	var curInputId = null;
	var pwdTimer = null; // 密码输入框计时器
	var external=require("external");

	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"user_id" : "", // 用户编号
		"bank_no" : "", // 银行编号
		"client_no" : "", // 理财账户
		"bankCard" : "" // 银行卡号
	};
	
	/*
	 * 初始化
	 */
	function init(){
		initView(); // 初始化页面
		supportBank(); // 查询支持的银行
/*		var user_id = appUtils.getSStorageInfo("user_id");
		queryUserInfo(user_id); // 查询用户信息
*/	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		pageGlobal.user_id = JSON.parse(userInfo).user_id;
		pageGlobal.trade_pwd = appUtils.getSStorageInfo("storage_trade_pwd"); 
		pageGlobal.trade_pwd_twice = appUtils.getSStorageInfo("storage_trade_pwd_twice");
		pageGlobal.client_no = JSON.parse(userInfo).client_no; // 理财账户
		var userName = appUtils.getSStorageInfo("user_name"); // 用户名
		var identity_num = $.trim(appUtils.getSStorageInfo("identity_num")); // 身份证号
		if(identity_num &&　identity_num　!= ""){
			var idCard = identity_num.substring(0,6) + "**** ****" + identity_num.substring(14,identity_num.length); // 隐藏身份证号
		}
		if (pageGlobal.client_no && pageGlobal.client_no != "") {
			$(_pageId + " #userName").val(userName).attr("disabled","disabled");
			$(_pageId + " #idCard").val(idCard).attr("disabled","disabled");

		}else{
			$(_pageId + " #userName").val(userName).remove("disabled");
			$(_pageId + " #idCard").val(idCard).remove("disabled");
		}
		$(_pageId + " #bankCard").val("");
		$(_pageId + " #mobilePhone").val("");
		$(_pageId + " #smsCode").val("");
	}
	
	/*
	 * 获取交易密码
	 */
	function tradePwd(type){
		var trade_pwd = appUtils.getSStorageInfo("storage_trade_pwd"); 
		var trade_pwd_twice = appUtils.getSStorageInfo("storage_trade_pwd_twice");
		var param = {
				"trade_pwd" : trade_pwd,
				"trade_pwd_twice" : trade_pwd_twice
			};
		if (type) {
			common.rsaEncrypt(param, openAccount); // 调用开户方法
		}else{
			var bankNo = $(_pageId + " #bankCard").val();
			$(_pageId + " #bankNo").html(bankNo);
			$(_pageId + " #Pwd_box").show();
			//common.rsaEncrypt(param, addBankCard);  // 调用绑卡方法
		}
	}
	
	/**
	 * 用户信息查询
	 * login_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * login_value 输入值
	 * login_pwd 密码
	 */
	function queryUserInfo(input_value){
		var param = {
				"user_id" : input_value
		};
		service.userInfo(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var results = data.results[0];
				var identity_num = results.identity_num;
				var user_name = results.user_name;
				if(identity_num != "" && identity_num != null && identity_num.length == 18){
					$(_pageId + " #IDCard").val(identity_num);
				}
				if(user_name != ""){
					$(_pageId + " #trueName").val(userName);
				}
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});
	}
	
	/*
	 * 理财功能开通    (1000190)
	 */
	function openClient(){
		// 判断是否开通理财账户
		if(pageGlobal.client_no && pageGlobal.client_no != ""){
			signSend(); // 501发送签名
		}else{
			var param = {
					"user_id" : pageGlobal.user_id
			};
			service.openClient(param,function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0"){
					var results = data.results[0];
					signSend(); // 501发送签名
				} else {
					layerUtils.iMsg(-1,error_info);
					return false;
				}
			}, {});
		}


	}
	
	/**
	 * 查询所支持的银行(1000188)
	 */
	function supportBank(mobilePhone){
		service.supportBank({},function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				var bankListStr = "";
				for( var i=0; i < result.length; i++){
					var bank_no = result[i].bank_no; // 银行编号
					var bank_name = result[i].bank_name; // 银行名称
					bankListStr += '<option value="'+bank_no+'">'+bank_name+'</option>';
				}
				$(_pageId + "#treelist").html(bankListStr);// 填充银行列表
				
				/*点击银行卡*/
				appUtils.bindEvent($(_pageId + " #show"),function(){
			        $('#treelist').mobiscroll('show'); 
			        return false;
		        });
		        
		        $(_pageId + '#treelist').mobiscroll().select({
		            theme: 'android-ics light',
		            Mode: 'mixed',
		            display: 'bottom',
		            headerText: false,
		            showLabel: false,
		            width: 280,
		            setText: '确定',
		            cancelText: '取消'
		        });
		        $(_pageId + " #show").val($("#treelist_dummy").val());
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		}, {});
	}
	
	/**
	 *  保存用户信息  （1000195）
	 */
	function saveInfo(){
		var IDCard = $.trim($(_pageId + " #idCard").val());
		pageGlobal.bankAccount = $.trim($(_pageId + " #bankCard").val());
		pageGlobal.bank_no = $("#treelist").val();
		var trueName = $(_pageId + " #userName").val();
		var mobilePhone = $.trim($(_pageId + " #mobilePhone").val());
		var param = {
			"id_kind" : "0",
			"user_id" : pageGlobal.user_id,
			"bank_no" : pageGlobal.bank_no,
			"bank_account" : pageGlobal.bankAccount,
			"id_no" : IDCard,
			"user_name" : trueName
		};
		service.saveInfo(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
					tradePwd(true); // 获取交易密码
			} else {
				layerUtils.iLoading(false);
				layerUtils.iMsg(-1,error_info);
			}
		}, {"isLastReq":false});
	}
	
	/**
	 *  签名发送  （1000501）
	 */
	function signSend(){
		pageGlobal.bankAccount = $.trim($(_pageId + " #bankCard").val());
		pageGlobal.bank_no = $("#treelist").val();
		var mobilePhone = $.trim($(_pageId + " #mobilePhone").val());
		var param = {
			"type" : "2",//0pc 1移动 2短信
			"user_id" : pageGlobal.user_id,
			"mobile_phone" : mobilePhone,
			"bank_no" : pageGlobal.bank_no,
			"bank_account" : pageGlobal.bankAccount,
			"capital_mode" : global.capitalMode // 具体类型在全局对象中配置
		};
		service.signSend(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				req_rerial = data.results[0].fundSeqId;
				var status = data.results[0].status;
				var returnMsg = data.results[0].returnMsg;
				if(status == "1"){
					timer = setInterval(function(){
						shows();
					},800);
					$(_pageId + " #smsBtn").removeClass("disabled");
				}else{
					layerUtils.iMsg(-1,returnMsg);
				}
				
			} else {
				clearMsgCodeTimer(); // 清除短信验证码计时器
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	/**
	 *  签名验证(1000502)
	 */
	function signValidate(msgCode){
		pageGlobal.bankCard = $.trim($(_pageId + " #bankCard").val());
		var mobilePhone = $.trim($(_pageId + " #mobilePhone").val());
		var param = {
			"type" : "2",//0pc 1移动 2短信
			"user_id" : pageGlobal.user_id,
			"mobile_phone" : mobilePhone,
			"bank_no" : pageGlobal.bank_no,
			"bank_account" : pageGlobal.bankCard,
			"req_rerial" : req_rerial,
			"verify_code" : msgCode,
			"capital_mode" : global.capitalMode // 具体类型在全局对象中配置
		};
		service.signValidate(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var tl_state = data.results[0].tl_state;
				var returnMsg = data.results[0].returnMsg;
				var yinlian_cd_card = data.results[0].yinlian_cd_card;
				if(tl_state == "1"){
					tradePwd(false); // 绑卡
//					appUtils.pageInit("register/bindBankCard","register/riskAssessment",param);
				}else{
					layerUtils.iMsg(-1,returnMsg);
				}
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	
	/**
	 * 显示读秒
	 */
	function shows(){
		var $code = $(_pageId + " #smsBtn");
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
	 * 校验身份证是否被使用(1000192)
	 * type 检测类型：0：检测手机 1：检测身份证 2：检测银行卡
	 */
	function isBeUsed(idCard,user_Name){
		var param = {
			"type" : 1,//0 校验手机 1 校验身份证 2 校验银行卡
			"id_kind" : 0,
			"user_name" : user_Name,
			"id_no" : idCard
		};
		service.isBeUsed(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				var is_exist = result[0].is_exist; // 是否存在0未使用 1已使用
				if(is_exist == "1"){
					layerUtils.iMsg(-1,"身份证已被使用，请核对您的身份证");
					$(_pageId + " #idCard").focus();
				}
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	/*
	 * 校验银行卡是否被使用(1000192)
	 * type 检测类型：0：检测手机 1：检测身份证 2：检测银行卡
	 */
	function checkBandCard(bankCard,bank_no){
		var param = {
			"type" : 2,//0 校验手机 1 校验身份证 2 校验银行卡
			"bank_no" : bank_no,
			"bank_account" : bankCard,
			"capital_mode" : global.capitalMode // 具体类型在全局对象中配置
		};
		service.isBeUsed(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				var is_exist = result[0].is_exist; // 是否存在0未使用 1已使用
				if(is_exist == "1"){
					layerUtils.iMsg(-1,"银行卡已被使用，请核对您的银行卡");
					$(_pageId + " #bankCard").focus();
				}
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	/*
	 * 开户  (1000503)
	 */
	function openAccount(backParam){
		var param = {
			"user_id" : pageGlobal.user_id,
			"trade_pwd" : backParam[0],
			"trade_pwd_twice" : backParam[1]
		};
		service.openAccount(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				pageGlobal.client_no = result[0].client_no; // 理财帐号
				updateUserInfoForSession(result);
				signSend(); // 签名发送
			} else {
				layerUtils.iMsg(-1,error_info);
			}
		}, {});
	}
	
	/*
	 * 更新session中的数据
	 */
	function updateUserInfoForSession(result){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		userInfo = JSON.parse(userInfo);
		userInfo.fund_account = result[0].fund_account;
		userInfo.client_no = result[0].client_no;
		userInfo.account_type = "8";
		appUtils.setSStorageInfo("userInfo", JSON.stringify(userInfo));
	}
	
	/*
	 * 绑卡   （1000504）
	 */
	function addBankCard(backParam){
		var param = {
			"user_id" : pageGlobal.user_id,
			"trade_pwd" : backParam[0],
			"bank_no" : pageGlobal.bank_no,
			"bank_account" : pageGlobal.bankCard
		}
		service.addBankCard(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				$(_pageId + " #submitBtn").attr("id","submitBtn");
				closePwdBox(); // 清空关闭密码框
				appUtils.pageInit("register/bindBankCard","register/bankCardSuccess");
			} else {
				var param = {
					"error_info" : error_info	
				};
				closePwdBox(); // 清空关闭密码框
				appUtils.pageInit("register/bindBankCard","register/bankCardError",param);
			}
		}, {});
	}
	
	/*
	 * 清空关闭密码框
	 */
	function closePwdBox(){
		$(_pageId + "#Pwd_box").hide();
		$(_pageId + " #trade_pwd_box em").html("");
		$(_pageId+" #trade_pwd").val("");
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		/**
		 * 点击输入框
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var keyPanelConfig = {skinName: "white"};
		    var isPwd = $(_pageId + " #trade_pwd").index(this) == 4 ? false : true; // 除股票键盘外其余都是密码输入
		    myKeyPanel.init(this, $(_pageId + " #trade_pwd").index($(this)) + 1, isPwd, keyPanelConfig); // 执行初始化
		    e.stopPropagation();
		});
		
		/**
		 * 键盘输入事件
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var $input = $(_pageId+" #trade_pwd_box");
			var value = e.originalEvent.detail["optType"];
	    	var text = $(_pageId+" #trade_pwd").attr("value");
	    	if(value == "del"){
	    		var len = text.length;
	    		$(_pageId+"#trade_pwd_box em:eq("+(len)+")").html("");
	    		$input.val(text.slice(0, -1));
	    	}else{
	    		if(text.length <= 6){
		    		$input.val(text);
		    		var len = text.length;
		    		$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    		if(text.length == 6){
		    			//$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    			//$(_pageId+" .pop_pay").hide();
		    			var trade_pwd = $(_pageId+" #trade_pwd").val();
		    			myKeyPanel.close();//隐藏h5键盘
						var _trade_pwd=$(_pageId+" #trade_pwd").val();
			        	if(_trade_pwd.length!=6){
			        		$(_pageId + " #trade_pwd_box em").html("");
			        		layerUtils.iMsg(-1,"请输入6位数交易密码！");
			        		return;
			        	}
			        	var param = {
			        			"pwd1" :_trade_pwd
			        		};
			        	common.rsaEncrypt(param,addBankCard);
		    		}
	    		}else{
	    			layerUtils.iMsg(-1, "交易密码最多 6位!");
	    		}
	    	}
			e.stopPropagation();
		}, "input");
		
		/*点击页面*/
        appUtils.bindEvent($(_pageId),function(e){
			$(_pageId + " #bankList").slideUp("slow");
   			e.stopPropagation();
        });
        
		/*关闭密码框*/
        appUtils.bindEvent($(_pageId + "#close_btn"),function(e){
        	closePwdBox(); // 清空关闭密码框
			myKeyPanel.close();//隐藏h5键盘
   			e.stopPropagation();
        });
        
		/*返回*/
		appUtils.bindEvent($(_pageId + " #backBtn"),function(){
        	appUtils.pageBack();
        });
		
        /*身份信息验证*/
		appUtils.bindEvent($(_pageId + " #idCard"),function(e){
			var idCard = $.trim($(this).val());
			var userName = $(_pageId + "#userName").val();
			isBeUsed(idCard,userName); // 验证身份信息
        },"blur");
		
        /*银行卡验证*/
		appUtils.bindEvent($(_pageId + " #bankCard"),function(e){
			var bankCard = $.trim($(this).val());
			var bank_no = $("#treelist").val();
			checkBandCard(bankCard,bank_no); // 验证身份信息
        },"blur");
        
		/*发送验证码*/
		appUtils.bindEvent($(_pageId + " #smsBtn"),function(){
			var $code = $(_pageId + " #smsBtn");
			if($code.attr("data-state")=="false"){
				return ;
			}
			var trueName = $(_pageId + " #userName").val();
			var IDCard = $(_pageId + " #idCard").val();
			var bankCard = $(_pageId + " #bankCard").val();
			var bank_no = $("#treelist").val();
			var mobilePhone = $(_pageId + " #mobilePhone").val();
			var param = {
				"user_name" : trueName,
				"id_kind" : IDCard,
				"mobilePhone" : mobilePhone,
				"bank_no" : bank_no,
				"bank_account" : bankCard
			};
			if(checkInput(param)){
				if(pageGlobal.client_no == null || pageGlobal.client_no == ""){
					saveInfo(); // 保存用户信息1000195
				}else{
					openClient(); // 开通理财账户
				}
        	}
			
        });
        
        /*下一步*/
        appUtils.bindEvent($(_pageId + " #submitBtn"),function(){
        	$(this).attr("id","");
        	var msgCode = $(_pageId + " #smsCode").val();
        	var trueName = $(_pageId + " #userName").val();
			var IDCard = $.trim($(_pageId + " #idCard").val());
			var bankCard = $.trim($(_pageId + " #bankCard").val());
			var mobilePhone = $.trim($(_pageId + " #mobilePhone").val());
			var param = {
				"trueName" : trueName,
				"id_kind" : IDCard,
				"mobilePhone" : mobilePhone,
				"bank_account" : bankCard
			};
			if($(this).hasClass("disabled")){
				layerUtils.iMsg(-1,"请先发送验证码！");
				return false;
			}
			if (validatorUtil.isEmpty(msgCode)){
				layerUtils.iMsg(-1,"验证码不能为空！");
				return false;
		    }
			if(checkInput(param)){
        		signValidate(msgCode);
        	}
        });
	}
	
	/**
	 * 检验输入框是否符合规范
	 * 长度，格式等
	 */
	function checkInput(param){
		if (validatorUtil.isEmpty(param.mobilePhone)){
			layerUtils.iMsg(-1,"手机号码不能为空！");
			return false;
		}else{
			if (!validatorUtil.isMobile(param.mobilePhone)){
				layerUtils.iMsg(-1,"请输入正确的电话号码！");
				$(_pageId+" #mobilePhone").val("");
				return false;
			}
		}
		if (validatorUtil.isEmpty(param.bank_account)){
			layerUtils.iMsg(-1,"银行卡号不能为空！");
			return false;
		}else{
			if (!validatorUtil.isBankCode(param.bank_account)){
				layerUtils.iMsg(-1,"请输入正确的银行卡号！");
				$(_pageId+" #bankAccount").val("");
				return false;
			}
		}
		if (pageGlobal.client_no == "") {
			if (validatorUtil.isEmpty(param.id_kind)){
				layerUtils.iMsg(-1,"身份证号不能为空！");
				return false;
			}else{
				if (!validatorUtil.isCardID(param.id_kind)){
					layerUtils.iMsg(-1,"请输入正确的身份证号！");
					$(_pageId+" #IDCard").val("");
					return false;
				}
			}
		}
		return true;
	}
	
	/**
	 * 清除短信验证码计时器
	 */
	function clearMsgCodeTimer()
	{
		var $code = $(_pageId + " .get_code");
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
		
	}
	
	var suppleInfo = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = suppleInfo;
});