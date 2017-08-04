 /**
  * 理财首页
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_historyPrice "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var service = require("mobileService"); //服务类
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象

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
		pageGlobal.product_id = appUtils.getPageParam("product_id");
		
		//防止直接跳到详情页面
		if(pageGlobal.product_id==null)
		{
			layerUtils.iMsg(1, "数据加载错误！");
			appUtils.pageInit("finan/historyPrice", "main", {});
			return false;
		}
		cleanPageParam(); // 清空查询参数
		
		productPrice(false);
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
	 * 产品净值流水信息
	 */
	function productPrice(isAppend) {
		var param = {
			"product_id" : pageGlobal.product_id,
			"page" : pageGlobal.curPage,
			"numPerPage" : 20
		}
		
		service.productPrice(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results[0].data;
				if (results && results.length > 0) {
					var resultsLen = results.length; // 记录结果集长度
					if (resultsLen == 0) {
						// 显示无记录
						$(_pageId + ".no_data_box").show();
						$(_pageId + "#v_container_productList").hide();
					} else {
						// 隐藏无记录
						$(_pageId + ".no_data_box").hide();
						$(_pageId + "#v_container_productList").show();
					}
					pageGlobal.maxPage = data.results[0].totalPages; // 总页数
					var priceListEle = $(_pageId + ".table_list");
					var itemHtml = "";
					for (var i = 0; i < resultsLen; i++) {
						var item = results[i];
						
						//当前净值
						var relate_price = item.relate_price || "0";
						
						//累计净值
						var cumulative_net = item.cumulative_net || "0"; 
						var marginTopStr = "";
						if (pageGlobal.curPage == "1" && i == 0) {
							marginTopStr = 'style="margin-top: 0.1rem;"';
						}
						itemHtml += '<div class="list_item" ' + marginTopStr + '>' + 
										'	<div class="ui layout">' + 
										'		<div class="row-1">' + 
										'			<span>' + item.nav_date + '</span>' + 
										'		</div>' + 
										'		<div class="row-1">' + 
										'			<span class="ared">' + parseFloat(relate_price).toFixed(4) + '</span>' + 
										'		</div>' + 
										'		<div class="row-1">' + 
										'			<span>' + parseFloat(cumulative_net).toFixed(4) + '</span>' + 
										'		</div>' + 
										'	</div>' + 
										'</div>';
						
					}
					
					
					if (isAppend) {
						priceListEle.append(itemHtml);
					} else {
						priceListEle.html(itemHtml);
					}
					
				}
				pageScrollInit(resultsLen);
			}
		});
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_productList").offset().top;
		var footerHeight = $(_pageId + ".footer_nav").height();
		var height2 = $(window).height() - height;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_productList"), 
				"wrapper" : $(_pageId + "#v_wrapper_productList"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					
					productPrice(false);
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
						productPrice(true);
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
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var historyPrice = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = historyPrice;
});