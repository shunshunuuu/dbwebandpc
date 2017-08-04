/**
 * 东北吉视通投票视频详情
 * @Author: wanliang
 * 
 */
define(function(require, exports, module) {
	var _pageId = "#vote_detail "; // 页面id
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"player_id" : "" // 选手编号
	};

	/*
	 * 初始化
	 */
	function init() {
		pageGlobal.player_id = appUtils.getPageParam("player_id"); // 选手编号
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 选手详情
		queryJstEmpDetail();
		
	}
	
	/*
	 * 选手详情
	 */
	function queryJstEmpDetail() {
		var param = {
			"player_id" : pageGlobal.player_id
		}
		service.queryJstEmpDetail(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results;
				var player_name = result[0].player_name; // 选手名称
				var branch_no = result[0].branch_no; // 营业厅
				var logo_url = "/mall" + result[0].logo_url; // 头像
				var video_url = "/mall" + result[0].video_url; // 介绍视频地址
				var description = result[0].description; // 简介
				var detail_info = result[0].detail_info; // 详情介绍
				
				$(_pageId + ".video").html('<img style="width:3.50rem;height:2.14rem;" src="' + video_url + '" alt="">');
				
				var str = '	<div class="text">'+
						  '		<h3 id="player_name">员工姓名：'+ player_name +'</h3>'+
						  '		<p id="description"><i>参赛宣言：</i>'+ description +'</p>'+
						  '	</div>';
				$(_pageId + ".content-top").html(str);
				$(_pageId + "#detail_info").html("<i>个人介绍：</i> "+ detail_info);
				
				// 返回
				appUtils.bindEvent(_pageId + ".close-pic", function(e) {
					e.stopPropagation();
					appUtils.pageInit("vote/detail", "vote/index", {});
					return false;
				});
				
			}else{
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};

	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var index = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = index;
});