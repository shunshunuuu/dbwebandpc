define(function(require, exports, module) {
	var _pageId = "#tucao_queryTc "; // 页面id
	var pageCode = "tucao/queryTc";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var tool = require("tool");
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
    
    
	var pageGlobal = {
						
	};
    
    
    
    
	
	/*
	 * 初始化
	 */
	
	function init() {
		
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		//alert(parseDate("2017-04-21 21:57:27"))
		// 初始化页面
		 queryTocaoContent()
		
	}
	
	function parseDate(date){
		//
		var dates = date.split(" ");
var tt = dates[0].split("-");

		
		
		return tt[0]+"年"+tt[1]+"月"+tt[2]+"日";
		
		
	}

function queryTocaoContent()
	
	{
	
/*	<div class="indea_tit"><i></i>我的意见</div>
	<div class="ideabox">
		<div class="ideatime clearfix">
			<p class="p1">2017年2月15日</p>
			<p class="p2">未查看</p>
		</div>
		<div class="ideaword">
			<p><span>APP问题1:</span>希望贵公司能在用户体验方面多下功夫！希望贵公司能在用户体验方面多下功夫...</p>
			<p><span>APP问题1:</span>希望贵公司能在用户体验方面多下功夫！</p>
		</div>
	</div>
	<div class="ideabox">
		<div class="ideatime clearfix">
			<p class="p1">2017年2月15日</p>
			<p class="p2 on">已查看</p>
		</div>
		<div class="ideaword">
			<p><span>APP问题1:</span>希望贵公司能在用户体验方面多下功夫！希望贵公司能在用户体验方面多下功夫...</p>
			<p><span>APP问题1:</span>希望贵公司能在用户体验方面多下功夫！</p>
		</div>
		<p class="adoption">您的问题我们已经采纳！</p>
		<i class="adoption_pic"></i>
	</div>*/
		/***解析数据根据，根据公司框架进行接口调用，然后解析数据**/
		var querySyComplate = function(resultVo){
			var page = $(_pageId+" .myidea").empty();
			var error_no =  resultVo.error_no
			if(error_no== 0){
				var str="<div class='indea_tit'><i></i>我的意见</div>";
				
				
				var result = resultVo.results
				for(var i=0;i<result.length;i++){
					str+="<div class='ideabox'><div class='ideatime clearfix'>";
					str+="<p class='p1'>"+parseDate(result[i].createdata)+"</p>";
					if(result[i].processstate==0){
						str+="<p class='p2'>未处理</p></div>";
					}else{
						str+="<p class='p2 on'>已处理</p></div>";
					}
					
					str+="<div class='ideaword'>";
					if(result[i].whetheradopt == 0){
						str+="<p>"+result[i].tucaocontent+"</p>";
					}else{
						str+="<p>"+result[i].tucaocontent+"</p><i class='adoption_pic'></i>";
					}
					
					 str+="</div>"
					if(result[i].whetheradopt == 0){
					    str+="<div class='ideawords'>"
						str+="<p class='adoptions'>"+result[i].processreply+"</p></div><div>";
					}else{
					    str+="<div class='ideawords'>"
						str+="<p class='adoptions'>"+result[i].processreply+"</p></div></div>"
					}
				}
				page.append(str);
				}
			else{
				layerUtils.iAlert(resultVo.error_info,-1);
			}
			
			
			}
			
		
			//获取
			
			
			
			
			
	
		var paraMap = {};
		var mobile= appUtils.getPageParam("mobile")
		paraMap["mobile"] =mobile;
		service.queryTocaoContent(paraMap,querySyComplate,{});
	
	
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		
		//返回上一页
		appUtils.bindEvent(_pageId + " a.back_btn",  function() {
			appUtils.pageBack();

			
		});
	
		
		
		
	};
	 

	

	/*
	 * 页面销毁
	 */
	function destroy() {
	
		
	};

	var tucaoQueryTc = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports =  tucaoQueryTc;
});