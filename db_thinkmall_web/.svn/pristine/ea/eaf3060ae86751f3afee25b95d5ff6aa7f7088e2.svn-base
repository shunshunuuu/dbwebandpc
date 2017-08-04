 /**
  * 东北币(用户中心)
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_myIntegral "; // 当前页面ID
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
		
		queryUserIntergral(); // 查询东北米
		
		queryIntergralList(); // 查询积分流水
	}
	
	/*
	 * 查询东北米
	 */
	function queryUserIntergral(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId()
		};
		service.queryUserIntergral(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var Item = data.results[0];
				//var enableIntegral = Item.enable_integral; // 可用积分
				var enableIntegral = Item.enable_integral || "0"; // 可用积分
				$(_pageId + "#myIntegral").html(enableIntegral+"<em>米</em>");
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}
	
	/**
	 * 查询积分流水
	 */
	function queryIntergralList(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId(),
			"page" : pageGlobal.curPage,
			"numPerPage" : "5"
		};
		service.queryIntergralList(param, function(data){

			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				var allIntergralStr = "";
				
				if(recordLen != "0"){
					$(_pageId + ".no_data_box").hide();
					for(var i = 0;i < results.length;i++){
						
						var createTime = results[i].create_time; // 创建时间
						var actionDesc = results[i].act_remark || "--"; // 积分来源描述
						var integralNum = results[i].integral_num; // 积分值
						var accumulateDirection = results[i].integral_accumulate_direction; // 累计方向
						var myIntegral_style = "";
						switch (accumulateDirection) {
						case "0":
							myIntegral_style = "agreen";
							break;
							
						case "1":
							myIntegral_style = "ared";
							break;

						default:
							break;
						}
						
						allIntergralStr += '<li class="ui layout">' +
											'	<div class="row-1">' +
											'		<h4>' + actionDesc + '</h4>' +
											'			<span>' + createTime + '</span>' +
											'		</div>' +
											'		<div class="rt_txt">' +
											'			<p class="' + myIntegral_style + '">' + putils.directionStatus(accumulateDirection) + '' + integralNum + '</p>' +
											'		</div>' +
											'</li>' ;
					}
				}
				
				$(_pageId + ".dbm_list ul").html(allIntergralStr);
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
		appUtils.bindEvent(_pageId + ".back_btn2", function(){
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