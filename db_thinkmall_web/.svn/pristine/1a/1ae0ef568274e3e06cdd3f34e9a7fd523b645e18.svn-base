 /**
  * @author 汪卫中
  * 
  * 资金视图
  */
define('mall/scripts/index/accountView', function(require, exports, module){ 
	var _pageId = "#index_accountView ";
	var appUtils = require("appUtils"); // 核心工具类
	var assetService = require("assetService"); // 资产服务接口类
	var constants = require("constants"); // 常量类
	var commonExt = require("commonExt"); // 常用公共方法
	var project = require("project"); // 项目相关常用方法
	var stringUtils = require("stringUtils"); // 字符串工具类
	var pdtCode="";
	var pdtId="";
	var pdtSubType="";
	var product_sub_type="";
	
	/**
	 * 初始化
	 */
	function init(){
		initView();
		user_id=appUtils.getSStorageInfo("user_id");
		if(user_id){
			$(_pageId + "#login_box").hide();
			// 用户资产
			getUserAsset();
			$(_pageId + "#account_box").show();
		}
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		//返回首页
		appUtils.bindEvent($(_pageId + ".btn_home"), function(){
			appUtils.pageInit("index/accountView", "main/unifyMain");
		});
		
		//四个横排菜单
		appUtils.bindEvent(_pageId + " .nav_box2 a", function(){
			var this_index = $(this).index();
			switch(this_index){
			case 0:
				if(appUtils.getSStorageInfo("fund_account")){
					appUtils.pageInit("index/accountView", "account/bankTrans", {});
				}
				else{
					 goBindFundAcc();
				}
				
				//appUtils.pageInit("index/accountView", "index/transferToBank", {});
				break;
			case 1:
				appUtils.pageInit("index/accountView", "index/assetAllocation", {});
				break;
			case 2:
				appUtils.pageInit("index/accountView", "index/tradeDetail", {});
				break;
			case 3:
				appUtils.pageInit("index/accountView", "index/earningsDetail", {});
				break;
			};
		});
		//三个竖排菜单
		appUtils.bindEvent(_pageId + " .assets_category .category_box", function(){
			var this_index = $(this).index();
			switch(this_index){
			case 0:
				//股票
				if($(this).html().indexOf("暂无持仓") != -1){
					return false;
				}
				appUtils.pageInit("index/accountView", "index/stockShare", {});
				break;
			case 1:
				//理财
				if($(this).html().indexOf("灵活的优选理财") != -1){
					appUtils.pageInit("index/accountView", "main/index", {});
					return false;
				}
				appUtils.pageInit("index/accountView", "account/myShare", {});
				break;
			case 2:
				break;
			};
		});
		
		
		
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#windowContainer").html("");
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 begin**********/
	
	function initView(){
		$(_pageId + "#pdtName").html("");
		$(_pageId + "#bankList").empty();
		
		$(_pageId + ".nav_box2 a").attr("style","width:33.3%");
	}
	
	//用户资产
	function getUserAsset(){
		var assetParam={
				"user_id":user_id
		};
		assetService.queryAsset(assetParam,function(data){
			var results = commonExt.getReqResultList(data);
			if (results && results.length > 0) {
				var item = results[0];
				total_money=item.total_money;//总资产
				var finaAsset = 0;
				var fina_money = item.fina_money;
				var fund_money = item.fund_money;
				var stock_money = item.stock_money;//证券市值
				stock_money = stringUtils.moneyFormat(stringUtils.parseFloat(stock_money),2)
				fina_money = stringUtils.parseFloat(fina_money);
				fund_money = stringUtils.parseFloat(fund_money);
				finaAsset = fina_money+fund_money;
				finaAsset = stringUtils.moneyFormat(finaAsset,2);//理财资产
				//total_money = Number(total_money/10000).toFixed(2);
				//total_money = stringUtils.dealBigNumber(total_money);
				total_money = stringUtils.parseFloat(total_money);
				total_money = stringUtils.moneyFormat(total_money,2);
				var current_balance = item.fund_balance;//可用余额
				current_balance = stringUtils.moneyFormat(current_balance,2);
				if(finaAsset!=0){
					$(_pageId + "#finaMoney").html(finaAsset+"元");
				}else{
					$(_pageId + "#finaMoney").html("灵活的优选理财");
				}
				if(stock_money!=0){
					$(_pageId + "#stock_money").html(stock_money+"元");
				}else{
					$(_pageId + "#stock_money").html("暂无持仓");
				}
				
				$(_pageId + ".my_assets ul li:eq(0) strong").html(total_money);
				$(_pageId + "#useableMoney").html(current_balance+"元");
				
			}
			else{
				$(_pageId + ".my_assets ul li:eq(0) strong").html("0.00");
				$(_pageId + "#useableMoney").html("0.00元");
				$(_pageId + "#finaMoney").html("灵活的优选理财");
				$(_pageId + "#stock_money").html("暂无持仓");
			}
		});
	}
	
	
	function goBindFundAcc(){
		var opt = {
				"pSelector" : _pageId + "#windowContainer", //父元素选择器
				"msg" : "", // 提示信息
				"type" : "1",
				"subMsg" : "你还未绑定资金账号，是否去绑定？", 
				"okText" : "去绑定", // 确定按钮文本
				"okCallBack" : function(){
					//去绑定
					appUtils.setSStorageInfo("_srcPageCode", "index/accountView");
					appUtils.setSStorageInfo("_srcPageParam", appUtils.getPageParam());
					appUtils.pageInit("index/accountView", "account/assetAccountBind", {});
				}
			}
		project.iConfirmWindow(opt);
		return false;
}

	
	/**********提示：所有自定义方法全部写到框架公共方法后面 end**********/
	
	var shareDetail = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = shareDetail;
});