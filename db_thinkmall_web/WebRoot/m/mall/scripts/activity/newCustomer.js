/**
 * 模块名：新客专享活动
 * 作者： 詹新蕾
 * 时间：2016年04月05日15:59:01
 * 简述：
 */
define(function(require,exports,module){
	/*引用模块*/
	var appUtils = require("appUtils"),
		layerUtils = require("layerUtils"),
		service = require("mobileService"), //业务层接口，请求数据
		common = require("common"); //公共类
	var constants = require("constants");// 常量类
	var global = require("gconfig").global; // 全局配置对象
	/*常量*/
	var pageCode = "activity/newCustomer",
	 	_pageId = "#activity_newCustomer ";
	
	/*变量*/
	 
	/**
	 * 初始化
	 * */
	function init(){
		newCustomerActivity();
	}
	
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){	
		
		//返回
		appUtils.bindEvent($(_pageId+" .back_btn"),function(){
			appUtils.pageBack();
		});
	
		
	}
	
	/*
	 * 新客专享活动
	 */
	function newCustomerActivity() {
		var adAreaEle = $(_pageId + ".leaflet_banner").empty();
		var newCustomerActivity = function(result){
			if (result.length > 0) {
				var item = result[0];
				var imgPath = item.picture ;// 图片地址
				if(imgPath!=""){
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
					
					var itemHtml = 	'<img src="' + imgPath + '"  width="100%" /><a href="'+linkUrl+'" class="to_buy_btn">立即购买</a>';
					
					adAreaEle.append(itemHtml);
				}
			}
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_NEWCUSTOMER;
		queryAdvert(groupId, newCustomerActivity);
	}
	
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
	}
		
	/**
	 * 销毁
	 * */
	function destroy(){
		service.destroy();//销毁服务
	}

	var newCustomer = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy		
	};
	
	module.exports = newCustomer;
});