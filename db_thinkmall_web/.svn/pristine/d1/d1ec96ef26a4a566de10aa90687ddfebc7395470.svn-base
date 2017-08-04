 /**
  * 理财首页
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_category "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类

	/*
	 * 初始化
	 */
	function init(){
		common.footerTab(_pageId);
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		appUtils.bindEvent(_pageId + ".user_nav ul li", function(){
			var index = $(_pageId + ".user_nav ul li").index(this);
/*			if (index == 4) {
				// 行业动态
				appUtils.pageInit("finan/category", "finan/consult", {});
			} else {
				
				return false;
			}*/
			appUtils.pageInit("finan/category", "finan/categoryResult", {"categoryType" : index});
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var category = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = category;
});