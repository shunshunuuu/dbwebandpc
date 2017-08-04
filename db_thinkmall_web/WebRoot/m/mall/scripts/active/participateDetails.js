 /**
  * 参与详情
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_participateDetails "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");
	var gconfig = require("gconfig"); // 全局配置对象
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	
	// 页面全局变量
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"productId" : "" // 产品编号
	};
	
	/*
	 * 初始化
	 */
	function init(){
		pageGlobal.productId = appUtils.getPageParam("product_id");
		
		if (!pageGlobal.productId) {
			appUtils.pageInit("active/participateDetails", "active/index", {});
			return false;
		}
		cleanPageParam(); // 清空查询参数
		
		queryActiveOrder(false);
	}
	
	/*
	 * 清空查询参数
	 */
	function cleanPageParam()
	{
		pageGlobal.curPage = 1;
		pageGlobal.maxPage = 0;
	}
	
	/*
	 * 查询当前产品订单流水
	 */
	function queryActiveOrder(isAppend){
		var reqParam = {
			"product_id" : pageGlobal.productId,
			"page" : pageGlobal.curPage,
			"numPerPage" : 10
		}
		
		service.queryOrderList(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results[0].data;
				if (results && results.length > 0) {
					var resultsLen = results.length; // 记录结果集长度
					if (resultsLen == 0) {
						// 显示无记录
						$(_pageId + ".no_data_box").show();
						$(_pageId + "#v_container_dataList").hide();
					} else {
						// 隐藏无记录
						$(_pageId + ".no_data_box").hide();
						$(_pageId + "#v_container_dataList").show();
					}
					pageGlobal.maxPage = data.results[0].totalPages; // 总页数
					var dataListEle = $(_pageId + "#dataList");
					var itemHtml = "";
					for (var i = 0; i < resultsLen; i++) {
						var item = results[i];
						var updateTime = item.update_time; // 修改时间
						var mobilePhone = item.order_phone; // 手机号码
						mobilePhone = putils.encryptMobilePhone(mobilePhone);
						var joinNum = item.order_amount; // 参与人次
						itemHtml += '<li class="ui layout">' + 
									'	<div class="tx_box">' + 
									'		<img src="images/tx_pic3.png" class="circle" />' + 
									'	</div>' + 
									'	<div class="row-1">' + 
									'		<h4>' + mobilePhone + '</h4>' + 
									'		<p>参与<em class="ared">' + joinNum + '</em>人次  ' + updateTime + '</p>' + 
									'	</div>' + 
									'</li>';
					}
					
					if (isAppend) {
						dataListEle.append(itemHtml);
					} else {
						dataListEle.html(itemHtml);
					}
					
					pageScrollInit(resultsLen);
				}
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_dataList").offset().top;
		var height2 = $(window).height() - height;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_dataList"), 
				"wrapper" : $(_pageId + "#v_wrapper_dataList"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					
					queryActiveOrder(false);
				}, 
				"upHandle": function() {
					// 当前页等于最大页数时，提示用户
					if(pageGlobal.curPage == pageGlobal.maxPage){
						return false;
					}
					
					// 加载下一页数据
					if(pageGlobal.curPage < pageGlobal.maxPage){
						$(_pageId + ".visc_pullUp").show();
						
						pageGlobal.curPage += 1;
						queryActiveOrder(true);
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 10 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
//			appUtils.pageBack();
			appUtils.pageInit("active/participateDetails", "active/oneMberserk", {"product_id" : pageGlobal.productId});
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var participateDetails = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = participateDetails;
});