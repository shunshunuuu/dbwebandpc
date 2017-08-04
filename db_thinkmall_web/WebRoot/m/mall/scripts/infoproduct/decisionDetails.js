define(function(require, exports, module) {
	var _pageId = "#infoproduct_decisionDetails "; // 页面id
	var pageCode = "infoproduct/decisionDetails";
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
	
	var id = null;
	var themeid = null;
	
	/*
	 * 初始化
	 */
	
	function init() {
		id = appUtils.getPageParam("id");
		themeid = appUtils.getPageParam("themeid");
		//查看资讯内容详情
		queryDecision();
	}
	
	function queryDecision(){
		var param = {
				"themeid" : themeid,
				"id" : id
		};
		service.queryInfoDimension(param,function(resultVo){
			if(0 == resultVo.error_no){
				var results = resultVo.results;
				var decisionEle = $(_pageId + "#decision").empty();
				if(results.length　> 0){
					for (var i = 0; i < results.length; i++) {
						var articleid = results[i].articleid;
						var contentmark = results[i].contentmark;
						var summary = results[i].summary;
						var theme_name = results[i].theme_name;
						var title = results[i].title;
						$(_pageId + "#title").text(theme_name);
						var itemHtml = '<div class="bt_tits">' +
							'<p class="p014">'+summary+'</p>' +
//							'<p class="p015">2016-10-19<span>08:25</span></p>' +
						'</div>' +
						'<div class="coretext">' +
                            contentmark+
                         '<p><strong style="white-sapce:normal; font-family:宋体，SimSun;">'+
                             '<span style="font-size:20px;color:rgb(192,0,0);">【风险提示】</span>'+   
                         '</strong></p>'+
                         '<p>本文涉及的各种信息、资讯，仅供投资者进行投资参考和借鉴，不构成投资建议。投资者据此投资，自行承担由此产生的风险及后果。</p>';
						'</div>';
						
						decisionEle.append(itemHtml);
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
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId + "#decision").empty();
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});