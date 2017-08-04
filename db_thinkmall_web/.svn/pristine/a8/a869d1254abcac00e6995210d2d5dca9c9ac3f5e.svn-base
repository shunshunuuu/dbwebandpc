 /**
  * @author 杜海丽
  * 
  * 收益明细
  */
define('mall/scripts/index/earningsDetail', function(require, exports, module){ 
	var _pageId = "#index_earningsDetail ";
	var appUtils = require("appUtils"); // 核心工具类
	var assetService = require("assetService"); // 产品服务接口类
	var orderService = require("orderService"); // 订单服务接口类
	var commonExt = require("commonExt"); // 常用公共方法
	var stringUtils = require("stringUtils"); // 字符串工具类
	var dateUtils = require("dateUtils"); // 日期工具类
	var project = require("project"); // 字符串工具类
	var layer = require("layer"); // 自定义提示信息
	var constants = require("constants"); // 常量类
	var VIscroll = require("cusVIscroll"); // 自定义滑动组件
	var gconfig = require("gconfig"); // 全局配置
	var entrust_state_res={
			0:"买",
			1:"买",
			2:"卖"
	};
	var price_des={
			0:"+",
			1:"+",
			2:"-"
	};
	var pageGlobal = {
		"vIscroll" : {"scroll" : null, "_init" : false}, // 理财列表分页 -> 上下滑动对象
		"curPage" : 1, // 理财列表分页 -> 当前页码
		"maxPage" : 0, // 理财列表分页 -> 总页数
		"queryType" : 0, // 查询类型，0：查持仓，1：查订单
		"orderId" : "", // 订单ID
		"pdtSubType": ""
	}

	/**
	 * 初始化
	 */
	function init(){
		// 初始化页面元素
		initView(); 
		
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
			/*$(_pageId + "#finan_order_box").hide();
			$(_pageId + "#my_finan_box").show();*/
		
		/*$(_pageId + "#finan_order_box").html("");
		$(_pageId + "#my_finan_box").html("");*/
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 begin**********/
	
	/**
	 * 初始化页面元素
	 */
	function initView(){
		// 页面参数中指定是订单时，初始化查订单列表，否则查持仓
		var isOrder = appUtils.getPageParam("isOrder");
		if (isOrder) {
			pageGlobal.queryType = 1;
			$(_pageId + ".tab_inner a").eq(1).addClass("active").siblings("a").removeClass("active");
			$(_pageId + "#finan_order_box").show();
			$(_pageId + "#my_finan_box").hide();
		} else {
			pageGlobal.queryType = 0;
			$(_pageId + ".tab_inner a").eq(0).addClass("active").siblings("a").removeClass("active");
		}
		
		
		// 初始化滚动到最上方
		if (pageGlobal.vIscroll.scroll) {
			pageGlobal.vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}
		
		$(_pageId + ".visc_pullUp_new").hide();
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 end**********/
	
	var myShare = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = myShare;
});