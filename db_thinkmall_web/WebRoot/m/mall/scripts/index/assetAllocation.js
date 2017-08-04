 /**
  * @author 杜海丽
  * 
  * 资产配置
  */
define('mall/scripts/index/assetAllocation', function(require, exports, module){ 
	var _pageId = "#index_assetAllocation ";
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
		
		//返回首页
		appUtils.bindEvent($(_pageId + ".btn_home"), function(){
			appUtils.pageInit("account/bankTrans", "main/unifyMain");
		});
		
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 begin**********/
	
	/**
	 * 初始化页面元素
	 */
	function initView(){
		getUserAsset();
	}
	
	
	//用户资产
	function getUserAsset(){
		var assetParam={
				"user_id":appUtils.getSStorageInfo("user_id")
		};
		assetService.queryAsset(assetParam,function(data){
			var results = commonExt.getReqResultList(data);
			if (results && results.length > 0) {
				var item = results[0];
				var finaAsset = 0;
				var fina_money = item.fina_money;
				var fund_money = item.fund_money;
				fina_money = stringUtils.parseFloat(fina_money);
				fund_money = stringUtils.parseFloat(fund_money);
				finaAsset = fina_money+fund_money;//理财市值
				var stock_money = item.stock_money;//证券市值
				stock_money = stringUtils.parseFloat(stock_money);
				var current_balance = item.useable_money;//可用余额
				current_balance = stringUtils.parseFloat(current_balance);
				var allMoney = stock_money + finaAsset + current_balance;//占比
				var stock_money_val = stock_money / allMoney;
				var finaAsset_val = finaAsset / allMoney;
				var current_balance_val = current_balance / allMoney;
				$(_pageId + ".ratio_right tr:eq(0) td").html(Number(stock_money_val*100).toFixed(2) + "%");
				$(_pageId + ".ratio_right tr:eq(1) td").html(Number(finaAsset_val*100).toFixed(2) + "%");
				$(_pageId + ".ratio_right tr:eq(2) td").html(Number(current_balance_val*100).toFixed(2) + "%");
			}
			else{
				$(_pageId + ".ratio_right tr:eq(0) td").html(0.00);
				$(_pageId + ".ratio_right tr:eq(1) td").html(0.00);
				$(_pageId + ".ratio_right tr:eq(2) td").html(0.00);
			}
		});
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