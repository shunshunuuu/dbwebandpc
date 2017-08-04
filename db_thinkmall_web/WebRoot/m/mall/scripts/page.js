/**
 * 广告页面
 * @Author: wanliang
 * 
 */
define(function(require, exports, module) {
	var _pageId = "#page "; // 页面id
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类

	/*
	 * 初始化
	 */
	
	function init() {
		
		// 初始化页面
		initView();
		
		// 底部导航
//		common.footerTab(_pageId);
		
		// 现金管家
		Advert();
		
	}
	
	function initView(){
		
	}

	/*
	 * 广告
	 */
	function Advert() {
		var adverBackFun = function(result){
			
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + ".info_box").empty();
			if (result.length > 0) {
				var item = result[0];
				var imgPath = item.picture ? item.picture : item.small_picture; // 图片地址
				var file_state = item.file_state; // 文件状态是否有效
				if (file_state != "1") {
					return;
					
				}
		
				imgPath = global.url + '/mall' + imgPath;
				var linkUrl = ""; // 链接地址
				var state = item.state; // 链接是否有效
				if (state == "1") {
					linkUrl = item.url;
				} else {
					linkUrl = "javascript:void(0)";
				}
				var itemHtml = '<div class="pic_box">' + 
								'	<a href="' + linkUrl + '">' + 
								'		<img src="' + imgPath + '" width="100%" />' +
								'	</a>' +
								'</div>';
				adAreaEle.append(itemHtml);
			}
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_PAGE;
		queryAdvert(groupId, adverBackFun);
	};
	
	/*
	 * 根据广告组ID查询广告信息
	 * @param groupId 广告组ID
	 * @param callBackFun 处理结果集的回调函数
	 */
	function queryAdvert(groupId, callBackFun) {
		var param = {
			"group_id" : groupId, // 广告组编号
			"ad_id" : "" // 广告编号
		};
		
		service.queryAd(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if (error_no == "0") {
				var result = data.results;
				
				// 返回结果集处理
				callBackFun(result);
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	};
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 关闭
		appUtils.bindEvent(_pageId + "#close", function() {
			/*停止0.8秒执行*/ 
			  setTimeout(function(){
				  
			   },5000);
		});
		
	};

	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var page = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = page;
});