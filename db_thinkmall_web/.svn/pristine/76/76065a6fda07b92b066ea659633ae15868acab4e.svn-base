/**
 * 东北吉视通投票首页
 * @Author: wanliang
 * 
 */
define(function(require, exports, module) {
	var _pageId = "#vote_voteResult "; // 页面id
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"app_unique_code" : "", // 唯一码
		"playerId" : "", // 所选选手编号
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"voteNum" : "" // 选手数
	};

	/*
	 * 初始化
	 */
	function init() {
		pageGlobal.app_unique_code = appUtils.getPageParam("app_unique_code");
        // 将唯一码存到cookie
        if(pageGlobal.app_unique_code){
        	appUtils.setSStorageInfo("app_unique_code",pageGlobal.app_unique_code);
        }
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 吉视通选手查询
		queryJstEmpInfo(false);
		
		cleanPageParam(); // 清空查询参数
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
	 * 吉视通选手查询
	 */
	function queryJstEmpInfo(isAppendFlag) {
		var app_unique_code = appUtils.getSStorageInfo("app_unique_code"); // 用户信息
		var param = {
			"user_no" : app_unique_code,
			"page" : pageGlobal.curPage,
			"numPerPage" : 20
		}
		service.queryJstEmpInfo(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0].data;
				var player_list = $(_pageId + "#player_list").empty();
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				if(result && result.length > 0){
					var resultsLen = result.length; // 记录结果集长度
					var str = "";
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						var player_id = item.player_id; // 选手编号
						var emp_name = item.player_name; // 选手名称
						var branch_no = item.branch_no; // 所属营业部
						var logo_url = "/mall" + item.logo_url; // 头像
						var video_url = item.video_url; // 视频地址
						var description = item.description; // 简介
						var player_poll = item.player_poll || "0"; // 总选票
						var is_voted = item.is_voted; // 0未投 1已投

						var choose = ""; 
						if(is_voted && is_voted == "1"){// 是否投过票
							choose = 'choose_btn choose_act" lockout="lockout"><i></i>已选中';
						}else{
							choose = 'choose_btn" lockout="">选我';
						}
						
						str += '<li>'+
								  '		<a href="javascript:void(0)" player_id="'+ player_id +'" class="video_int">视频介绍 &gt; </a>'+
								  '		<div class="ui layout li_con">'+
								  '			<div class="li_pic">'+
								  '				<img src="http://localhost:8082/m/mall/images/contest_pic.png">'+
								  '			</div>'+
								  '			<div class="row-1 li_txt">'+
								  '				<h4>员工姓名：'+ emp_name +'</h4>'+
								  '				<p>'+ branch_no +'</p>'+
								  '				<div class="jg_box">'+ player_poll +'<i>票</i></div>'+
								  '			</div>'+
								  '		</div>'+
								  '</li>';
						
					}
					if(isAppendFlag){
						player_list.append(str);
					}else{
						player_list.html(str);
					}
					pageScrollInit(resultsLen);
					// 选我
//					appUtils.preBindEvent($(_pageId+" #player_list"), ".choose_btn", function() {
					appUtils.bindEvent(_pageId + ".choose_btn", function() {
						var cur = $(this);
						var choose = cur.attr("class");
						var lockout = cur.attr("lockout"); // 判断是否锁定
						if(lockout != "lockout"){
							if(choose == "choose_btn"){
								cur.removeClass().addClass("choose_btn choose_act").html("<i></i>已选中");
							}else{
								cur.removeClass().addClass("choose_btn").html("选我");
							}
						}else{
							layerUtils.iMsg(-1, "该选手已投票不能取消投票");
						}
					},"click");
					
					// 视频介绍
					appUtils.bindEvent(_pageId + ".video_int", function() {
						var player_id = $(this).attr("player_id"); // 获取选手编号
						appUtils.pageInit("vote/index", "vote/detail", {"player_id": player_id});
					},"click");
				}
			}else{
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 吉视通选手投票
	 */
	function playerIdsVoteJst(player_ids){
		var app_unique_code = appUtils.getSStorageInfo("app_unique_code"); // 用户信息
		var param = {
			"user_no" : app_unique_code,
			"player_ids" : player_ids
		}
		service.playerIdsVoteJst(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results;
				$(_pageId +"#success").show(); // 投票成功
			}else{
				// 错误信息提示
				pageGlobal.playerId = ""; // 清空选票信息
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_productList").offset().top;
		var footer = $(_pageId + ".vote_btn_box").height();
		var height2 = $(window).height() - height - footer;
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
					
					queryJstEmpInfo(false); // 查询选手列表
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
						
						queryJstEmpInfo(true); // 查询选手列表
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 2 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 投票规则
		appUtils.bindEvent(_pageId + ".rule_btn", function() {
			appUtils.pageInit("vote/index", "vote/voteRule", {});
		});
		
		// 投票
		appUtils.bindEvent(_pageId + "#voteSubmit", function() {
			var cur = $(_pageId + ".choose_btn");
			for (var i = 0; i < cur.length; i++) {
				var choose = cur.eq(i).attr("class");
				var lockout = cur.eq(i).attr("lockout"); // 判断是否锁定
				if(lockout != "lockout"){
					if(choose != "choose_btn"){
						pageGlobal.voteNum ++;
						var player_id = cur.eq(i).attr("player_id"); // 获取选手编号
						// 拼接多个选手编号
						if(pageGlobal.playerId){
							pageGlobal.playerId = pageGlobal.playerId +","+player_id;
						}else{
							pageGlobal.playerId = player_id;
						}
					}
				}
			}
			playerIdsVoteJst(pageGlobal.playerId); // 投票哦
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