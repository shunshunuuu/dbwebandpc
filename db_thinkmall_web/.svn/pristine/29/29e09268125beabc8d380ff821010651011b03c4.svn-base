 /**
  * 资讯详情
  * @author shiaf
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_consultDetails "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var common = require("common"); // 公共类
	var global = require("gconfig").global; // 全局配置对象
	
	/*
	 * 初始化
	 */
	function init(){
		
		// 初始化页面
		initView();
		
		var doc_id = appUtils.getPageParam("doc_id"); // 资讯编号
//		var doc_type_name = appUtils.getPageParam("doc_type_name"); // 资讯类别名称
//		$(_pageId + "#docTypeName").html(doc_type_name);
		
		queryConsultDetails(doc_id); // 查询资讯详情
		
	}
	
	
	/*
	 * 初始化页面
	 */
	function initView(){
		$(_pageId + "#contents").html("");
	}
	
	/*
	 * 资讯详情
	 */
	function queryConsultDetails(doc_id){
		param={
			"doc_id" : doc_id
		}
		
		service.getConsultDetail(param, function(data){
			var dataList = common.getResultList(data);
			if (dataList.length > 0) {
				var result = data.results[0];
				var title = result.title;
				var summary = result.summary; // 简介
				var docUrl = result.doc_url; // 内容
				var docName = result.name; // 附件名称
				if (docName) {
					docName = "《" + docName + "》"
				}
				docUrl = global.url + '/mall/' + docUrl;
				var contentHtml = '<h3 align="center">'+ title + '</h3>' + summary + 
								 '<br/><a style="margin-bootom" id="docPdf" href="javascript:void(0)" data-pro_url="' + docUrl + '">' + docName + '</a><br/>&nbsp;'
				$(_pageId + "#contents").html(contentHtml);
				
				appUtils.bindEvent($(_pageId + "#docPdf"), function(e){
					var $this = $(this),
					pro_url = $this.attr("data-pro_url");
					if (pro_url){
						appUtils.sendDirect(pro_url, true, "main");
					}
					e.stopPropagation();
				}, "click");
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var consultDetails = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = consultDetails;
});