 /**
  * 设置(用户中心)
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_setUp "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类

	/*
	 * 初始化
	 */
	function init(){
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 返回用户中心
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("account/setUp", "account/userCenter", {});
		});
		
		// 退出登录
		appUtils.bindEvent(_pageId + ".out_login", function(){
			layerUtils.iConfirm("确定退出吗？",function(){
				// 调用接入层退出功能号，清空浏览器sessioin
				service.loginOut({}, function(data){
					var error_no = data.error_no;
	    			var error_info = data.error_info;
	    			if (error_no == "0"){
	    				// 清空本地cookie
	    				common.clearSessionUserInfo();
	    				appUtils.pageInit("account/setUp", "main", {});
	    			} else {
	    				layerUtils.iMsg(-1,error_info);
	    				return false;
	    			}
				});
				
			}, function(){});
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var setUp = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = setUp;
});