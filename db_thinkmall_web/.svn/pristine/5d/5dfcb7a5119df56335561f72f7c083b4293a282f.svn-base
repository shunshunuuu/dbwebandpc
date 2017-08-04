 /**
  * 推荐查询(用户中心)
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_promoteQuery "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
			"userId" : "", // 用户编号
			"curPage" : 1, 	// 当前页
			"maxPage" : 0  // 最大页数
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".login_page"));
		
		// 底部导航
		common.footerTab(_pageId);
		
//		queryUserIntergral(); // 查询东北米
//		
//		queryIntergralList(); // 查询积分流水
		
		queryRecomStatistics(); // 推荐查询
	}
	
	/**
	 * 推荐统计信息
	 */
	function queryRecomStatistics(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var recomcode = JSON.parse(userInfo).recommon_code; // 推荐码
/*		var recomcode = appUtils.getSStorageInfo("recomCode"); // 获取登录时输入的推荐码
		if(recomcode){
			recomcode=recomcode.substring(2,recomcode.length);
		}*/
		var param = {
			"recomcode" : recomcode
		};
		service.queryVote(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results;
				var item = result[0];
				var user_id = item.user_id ; // 用户编号
				var user_name = item.user_name ; // 用户名称
				var phone = item.phone ; // 手机号
				var recomcode = item.recomcode ; // 推荐码
				var recomnum = item.recomnum || "0"; // 推荐总人数
				var update_time = item.update_time ; // 充值时间
				var surplus_telcharge = item.surplus_telcharge || "0"; // 待充值话费
				var already_recharge = item.already_recharge || "0";//已充值话费
				var already_get = "";
				if(surplus_telcharge && already_recharge){
					already_get = parseInt(surplus_telcharge) + parseInt(already_recharge);//已获得话费
				}else{
					already_get = "0";
				}
				
				$(_pageId + "#recomNum").html(recomnum + "<em>人</em>");	
				$(_pageId + "#already_get").html(already_get + "<em>.00</em></span>");
				$(_pageId + "#already_recharge").html(already_recharge + "<em>.00</em></span>");
				$(_pageId + "#surplus_telcharge").html(surplus_telcharge + "<em>.00</em></span>");
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		// 返回用户中心
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		// 领
		appUtils.bindEvent(_pageId + ".icon1", function(){
			appUtils.pageInit("account/myIntegral", "active/signIn", {});
		});
		
		// 花
		appUtils.bindEvent(_pageId + ".icon2", function(){
			appUtils.pageInit("account/myIntegral", "active/index", {});
		});
		
		// 更多收支明细
		appUtils.bindEvent(_pageId + ".more_btn", function(){
			appUtils.pageInit("account/myIntegral", "account/historyIntegral", {});
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var myIntegral = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myIntegral;
});