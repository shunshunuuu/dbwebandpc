/**
 * 东北吉视通投票规则
 * @Author: wanliang
 * 
 */
define(function(require, exports, module) {
	var _pageId = "#vote_voteRule "; // 页面id
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"user_no" : "", // 唯一码
		"playerId" : "", // 所选选手编号
		"voteNum" : "" // 选手数
	};

	/*
	 * 初始化
	 */
	function init() {
		pageGlobal.user_no = appUtils.getPageParam("user_no");
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 吉视通选手查询
		queryJstEmpInfo();
		
	}
	
	/*
	 * 吉视通选手查询
	 */
	function queryJstEmpInfo() {
		var param = {
			"user_no" : "35334407903514"// pageGlobal.user_no
		}
		service.queryJstEmpInfo(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0].data;
				var player_list = $(_pageId + "#player_list").empty();
				if(result && result.length > 0){
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						var player_id = item.player_id; // 选手编号
						var emp_name = item.player_name; // 选手名称
						var branch_no = item.branch_no; // 所属营业部
						var logo_url = item.logo_url; // 头像
						var video_url = item.video_url; // 视频地址
						var description = item.description; // 简介
						var player_poll = item.player_poll; // 总选票
						
						var str = '<li>'+
								  '		<a href="javascript:void(0)" class="video_int">视频介绍 &gt; </a>'+
								  '		<div class="ui layout li_con">'+
								  '			<div class="li_pic">'+
								  '				<img src="http://localhost:8082/m/mall/images/contest_pic.png">'+
								  '			</div>'+
								  '			<div class="row-1 li_txt">'+
								  '				<h4>员工姓名：'+ emp_name +'</h4>'+
								  '				<p>'+ branch_no +'</p>'+
								  '				<a href="javascript:void(0)" player_id="'+ player_id +'" class="choose_btn">选我</a>'+
								  '			</div>'+
								  '		</div>'+
								  '</li>';
						
						player_list.append(str);
					}
					
					// 选我
					appUtils.bindEvent(_pageId + ".choose_btn", function() {
						var cur = $(this);
						var choose = cur.attr("class");
						if(choose == "choose_btn"){
							cur.removeClass().addClass("choose_btn choose_act").html("<i></i>已选中");
						}else{
							cur.removeClass().addClass("choose_btn").html("选我");
							var player_id = cur.attr("player_id");
							if(pageGlobal.playerId){
								pageGlobal.playerId = pageGlobal.playerId +","+player_id;
							}else{
								pageGlobal.playerId = player_id;
							}
						}
					});
				}
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
		// 关闭
		appUtils.bindEvent(_pageId + ".rules_close", function() {
			appUtils.pageInit("vote/voteRule", "vote/index", {});
		});
		
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