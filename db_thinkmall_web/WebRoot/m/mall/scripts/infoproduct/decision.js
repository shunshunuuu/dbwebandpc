define(function(require, exports, module) {
	var _pageId = "#infoproduct_decision "; // 页面id
	var pageCode = "infoproduct/decision";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
	require("mall/scripts/common/plugins/swiperEvent");
	
	var themeid = null;
	/*
	 * 初始化
	 */
	function init() {
		themeid = appUtils.getPageParam("themeid");
		queryInfoDetail();
	}
	
	function queryInfoDetail(){
		var param = {
			"themeid" : themeid
		};
		service.queryInfoDimension(param,function(resultVo){
			if(0 == resultVo.error_no){
				var detailEle = $(_pageId + "#InfoDetail").empty();
				var results = resultVo.results;
				if(results.length > 0){
					for (var i = 0; i < results.length; i++) {
						var id = results[i].id;
						var title = results[i].title;
						var articleid = results[i].articleid;
						var contentmark = results[i].contentmark;
						var summary = results[i].summary;
						var theme_name = results[i].theme_name;
						var title = results[i].title;
						var gathertime = results[i].gathertime;
						gathertime = gathertime.substr(0,10);
						$(_pageId + "#title").text(theme_name);
						var itemHtml = '<li id = '+id+' themeid = '+themeid+'>' +
						' <a href="javascript:void(0);">' +
						' <s></s>' +
						' <p class="p012">'+title+'</p>' +
						' <p class="p013">'+gathertime+'</p>' +
						' </a>' +
						' </li>';
						detailEle.append(itemHtml);
						
						appUtils.bindEvent(_pageId + "#InfoDetail li", function() {
							var themeid = $(this).attr("themeid");
							var id = $(this).attr("id");
							var param = {
								 "themeid" : themeid,
								 "id" : id
							};
							appUtils.pageInit(pageCode, "infoproduct/decisionDetails",param);
						});
					}
				}
			}
		});
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
		//取消
		appUtils.bindEvent(_pageId + "#away", function() {
			appUtils.pageInit(pageCode, "infoproduct/myInfo");
		});
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId + "#InfoDetail").empty();
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});