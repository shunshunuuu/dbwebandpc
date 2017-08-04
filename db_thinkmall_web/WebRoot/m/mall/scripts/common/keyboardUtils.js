/**
 * 密码键盘插件
 */
define(function(require, exports, module) {
	var nativePluginService = require("nativePluginService"); // 原生插件服务类
	var appUtils = require("appUtils"); // 框架核心工具类
	var gconfig = require("gconfig"); // 全局配置项
	var constants = require("constants"); // 常量类
//	var commonExt = require("commonExt"); // 常用公共方法
	var keyPanel = require('keyPanel'); // 键盘插件 
	var myKeyPanel = new keyPanel(); // H5密码键盘
	
	var option = {
		"pageId" : "", // 页面ID 必传
		"pwdWindowId" : "", // 密码窗口ID 必传
		"pwdInputId" : "", // 密码文本框ID 必传
		"clickObj" : "", // 点击对象，点击该对象呼出密码框，默认密码文本框父节点
		"callBack" : null // 密码输入完成后需要调用的函数 
	}
	/**
	 * 初始化密码控件
	 * 适用于弹出密码窗口
	 * @param pageId ：页面ID
	 * @param  pwdInputId： 密码文本框ID
	 * @param callBack:密码支付完成后执行的回调函数
	 * 
	 */ 
	function initPwdWindow(opt){
		
		// 合并外部入参
		$.extend(option, opt);
		
		var pwdInputEle = option.pageId + " " + option.pwdInputId;
		var clickObj = option.clickObj || $(pwdInputEle).parent(); 
		
		// 点击密码弹出键盘    PC：调用H5键盘，Android & ios 调用原生键盘
		appUtils.bindEvent(clickObj, function(e){
			if (gconfig.platform == constants.platform.PLATFORM_PC) {
				myKeyPanel.init(pwdInputEle, 1, true, {skinName: "white"}); // 执行初始化
			} else {
				callKeyboard(option.pageId, $(pwdInputEle), constants.keyPanelType.NUMBER);
			}
			e.stopPropagation();
		});
		
		// PC：绑定文本框input事件 ，Android & Ios 绑定原生键盘监听事件
		if (gconfig.platform == constants.platform.PLATFORM_PC) {
			// H5键盘监控文本框输入事件
			appUtils.bindEvent(pwdInputEle, function(e){
				var curKeyCode = e.originalEvent.detail["optType"]; // 按键值
				inputKeyEvent(pwdInputEle, curKeyCode, option.callBack);
				e.stopPropagation();
			}, "input");
		} else {
			// 原生键盘监听文本框输入事件
			window.customKeyboardEvent = {
				keyBoardInputFunction: function(curKeyCode){
					inputKeyEvent(pwdInputEle, curKeyCode, option.callBack);
				}
			};
		}
		
		// 点击页面关闭键盘
		appUtils.bindEvent(option.pageId, function(){
			hidePwdWindow();
		});
	}
	
	/**
	 * 调用原生键盘
	 * @param $input 显示在页面的输入框
	 * @param pageId 页面ID 
	 * @param keyType 键盘类型 1：英文键盘，2：股票键盘，3：数字键盘，4：随机数字键盘，9：系统键盘
	 */
	function callKeyboard(pageId, $input, keyType){
		var curInputId = $input.attr("id");
		var invokeParam = {
			moduleName: "mall", // String	目标模块名	N
			funcNo: "50210", // String	功能号	Y
			pageId: pageId.substring(1), // String	页面Id	Y
			eleId: curInputId, // String	元素Id	Y
			doneLable: "done", // String	完成按钮显示字符
			keyboardType: keyType // 1：英文键盘，2：股票键盘，3：数字键盘，4：随机数字键盘，9：系统键盘
		};
		nativePluginService.function50210(invokeParam);
	}
	
	/**
	 * 隐藏原生键盘
	 */
	function hideNativeKeyboard(){
		var invokeParam = {
			funcNo: "50211", // String	功能号	Y
			moduleName: "common"
		};
		nativePluginService.function50211(invokeParam);
	}
	
	/**
	 * 描述：原生和H5键盘的输入事件
	 * @author 汪卫中
	 * @param curKeyCode 当前输入值
	 */
	function inputKeyEvent(pwdInput, curKeyCode, callBack){
		var $input = $(pwdInput); // 密码input控件
		var curTradePwd = $input.val(); 
		var len = curTradePwd.length;
		
		curKeyCode = curKeyCode + "";
		switch(curKeyCode){
		case "-2": // 清空按钮
			$input.parent().find("em").html("");
    		$input.val("");
			break;
		case "-3": // 完成按钮
			
			break;
		case "-5": // 原生键盘删除键
			if (len >= 0) {
				$input.parent().find("em").eq(len).html("");
			}
			break;
		case "del": // H5键盘删除键
			if (len >= 0) {
				$input.parent().find("em").eq(len).html("");
			}
			break;
		default:
			if(len <= 6){
				$input.parent().find("em").eq(len - 1).html("●")
	    		if(curTradePwd.length == 6){
		        	var pwdParam = {
	        			"tradePwd" : curTradePwd
	        		};
//		        	commonExt.rsaEncrypt(pwdParam, callBack);
	    		}
    		}
			break;
		}
	} 
	
	/**
	 * 弹出支付窗口 注：此方法依赖于initPwdWindow
	 */
	function showPwdWindow(){
		var inputId = option.pageId + " " + option.pwdInputId;
		$(option.pageId + " " + option.pwdWindowId).show();
		$(inputId).siblings("em").html("");
		$(inputId).val("");
		
		if (gconfig.platform == constants.platform.PLATFORM_PC) {
			myKeyPanel.init(inputId, 1, true, {skinName: "white"}); // 执行初始化
		} else {
			callKeyboard(option.pageId, $(inputId), constants.keyPanelType.NUMBER);
		}
	}
	
	/**
	 * 隐藏支付窗口 注：此方法依赖于initPwdWindow
	 */
	function hidePwdWindow(){
		$(option.pageId + " " + option.pwdWindowId).hide();
		hideKeyBoard();
	}
	
	/**
	 *  初始化密码文本框
	 */
	function initPwdInput(pageId, pwdId, callBack){
		// 点击密码弹出键盘 PC：调用H5键盘，Android & ios 调用原生键盘
		appUtils.bindEvent(pageId + " #" + pwdId, function(e){
			if (gconfig.platform == constants.platform.PLATFORM_PC) {
			    myKeyPanel.init(pageId + " #" + pwdId, 1, true, {skinName: "white"}); // 执行初始化
			} else {
				callKeyboard(pageId, $(obj), constants.keyPanelType.NUMBER);
			}
			e.stopPropagation();
		}, "click");
		
		// PC：绑定文本框input事件 ，Android & Ios 绑定原生键盘监听事件
		if (gconfig.platform == constants.platform.PLATFORM_PC) {
			// H5键盘监控文本框输入事件
			appUtils.bindEvent(pageId + " #" + pwdId, function(e){
				callBack();
				e.stopPropagation();
			}, "input");
		} else {
			// 原生键盘监听文本框输入事件
			window.customKeyboardEvent = {
				keyBoardInputFunction: callBack
			};
		}
		
		// 点击页面关闭键盘
		appUtils.bindEvent(pageId, function(){
			hideKeyBoard();
		});
	}
	
	/**
	 * 隐藏键盘
	 */
	function hideKeyBoard(){
		if (gconfig.platform == constants.platform.PLATFORM_PC) {
			myKeyPanel.close(); // 隐藏h5键盘
		} else {
			hideNativeKeyboard();
		}
	}
	
	var keyboardUtils = {
		"initPwdWindow" : initPwdWindow, // 初始化密码输入窗口，弹出窗
		"showPwdWindow" : showPwdWindow, // 显示密码窗口
		"hidePwdWindow" : hidePwdWindow, // 隐藏密码窗口
		"initPwdInput" : initPwdInput, // 初始化密码文本框
		"hideKeyBoard" : hideKeyBoard // 隐藏键盘
	};

	// 暴露对外的接口
	module.exports = keyboardUtils;
	
});