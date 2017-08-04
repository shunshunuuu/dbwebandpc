 /**
  * 资讯详情
  * @author shiaf
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_educationDetails "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var common = require("common"); // 公共类
	var global = require("gconfig").global; // 全局配置对象
	var validatorUtil = require("validatorUtil"); //校验工具类
	/*
	 * 初始化
	 */
	function init(){
		
		// 初始化页面
		initView();
		
		var article_id = appUtils.getPageParam("article_id"); // 资讯编号
		queryConsultDetails(article_id); // 查询资讯详情
		
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
	function queryConsultDetails(article_id){
		param={
			"article_id" : article_id
		}
		
		service.getEducationDetail(param, function(data){
			var dataList = common.getResultList(data);
			if (dataList.length > 0) {
				var result = data.results[0];
				var title = result.article_title;
				var summary = result.article_brief; // 简介
				var docUrl = result.article_content; // 内容
				
				var releaseTime = result.release_time; // 文章创建时间
				// 界面显示形如：11-12 11:12 格式的时间
				if(validatorUtil.isEmpty(releaseTime)){
					releaseTime = ""; //如果没有时间则不显示
				}
/*				if (releaseTime && releaseTime.length >= 10) { 
					var indexStart = releaseTime.indexOf("-") + 1; // 字符串截取开始位置为 第一个“-”加 1
					var indexEnd = releaseTime.lastIndexOf(":"); // 字符串截取结束位置为 最后一个“:”
					if (indexEnd > indexStart) { 
						releaseTime = releaseTime.substring(indexStart, indexEnd);
					}
				}*/
				var contentHtml = '<h3 align="center">'+ title + '</h3>'+'<p style="font-size: 0.12rem !important;  margin: 0.2rem 0 0.09rem;">发布时间：'+releaseTime+'</p><p>'+docUrl+'</p>';
				$(_pageId + "#contents").html(contentHtml);
				
/*				appUtils.bindEvent($(_pageId + "#docPdf"), function(e){
					var $this = $(this),
					pro_url = $this.attr("data-pro_url");
					if (pro_url){
						appUtils.sendDirect(pro_url, true, "index");
					}
					e.stopPropagation();
				}, "click");*/
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