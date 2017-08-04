 /**
  * 积分流水
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_historyIntegral "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var service = require("mobileService"); //服务类
	var common = require("common"); //公共类
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	var putils = require("putils");

	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"product_id" : "" // 产品编号
	};
	
	/*
	 * 初始化
	 */
	function init(){
		
		initView();
		
		cleanPageParam(); // 清空查询参数
		
		queryIntergralList(false);
		
	}
	
	/*初始化界面*/
	function initView(){
		$(_pageId + ".no_data_box").hide();
		$(_pageId + "#v_container_IntergraList").hide();
	}
	
	/*
	 * 清空查询参数
	 */
	function cleanPageParam()
	{
		pageGlobal.curPage = 1;
		pageGlobal.maxPage = 0;
	}
	
	/**
	 * 积分流水信息
	 */
	function queryIntergralList(isAppend) {
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, true)) {
			return false;
		}
		var param = {
				"user_id" : common.getUserId(),
				"page" : pageGlobal.curPage,
				"numPerPage" : "20"
			};
		
		service.queryIntergralList(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results[0].data;
				//if (results && results.length > 0) {
					var resultsLen = results.length; // 记录结果集长度
					if (resultsLen == 0) {
						// 显示无记录
						$(_pageId + ".no_data_box").show();
						$(_pageId + "#v_container_IntergraList").hide();
					} else {
						// 隐藏无记录
						$(_pageId + ".no_data_box").hide();
						$(_pageId + "#v_container_IntergraList").show();
					}
					pageGlobal.maxPage = data.results[0].totalPages; // 总页数
					var priceListEle = $(_pageId + ".dbm_list ul");
					var itemHtml = "";
					for (var i = 0; i < resultsLen; i++) {
						
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
						
						itemHtml += '<li class="ui layout">' +
											'		<div class="row-1">' +
											'		<h4>' + actionDesc + '</h4>' +
											'			<span>' + createTime + '</span>' +
											'		</div>' +
											'		<div class="rt_txt">' +
											'			<p class="' + myIntegral_style + '">' + putils.directionStatus(accumulateDirection) + '' + integralNum + '</p>' +
											'		</div>' +
											'</li>' ;
					}
					
					
					if (isAppend) {
						priceListEle.append(itemHtml);
					} else {
						priceListEle.html(itemHtml);
					}
					
				//}
				pageScrollInit(resultsLen);
			}
		});
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_IntergraList").offset().top;
		var height2 = $(window).height() - height;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_IntergraList"), 
				"wrapper" : $(_pageId + "#v_wrapper_IntergraList"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					
					queryIntergralList(false);
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
						queryIntergralList(true);
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 20 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var historyIntegral = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = historyIntegral;
});