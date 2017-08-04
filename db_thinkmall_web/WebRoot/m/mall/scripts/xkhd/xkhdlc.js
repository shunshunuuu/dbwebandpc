define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var _pageId = "#xkhd_xkhdlc "; // 页面id
	var pageCode = "xkhd/xkhdlc";
	
	
	/*
	 * 初始化
	 */
	
	function init() {
		//统计页面打开的次数
		openPage(this);
	}

	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		//下载融e通
		appUtils.bindEvent(_pageId+"#xzryt", function(e){
			customEvent(this);
			appUtils.sendDirect("https://xsjkh.nesc.cn/p/99930595");
		});
	};
	 
	/* 埋点 */
    //事件统计
    var customEvent = function (ob) { 
        Countly.q.push(['customEvent', {
            eventId: ob.id, duration: "1000"
        }]);
    };
    
	//页面统计打开页面
	var openPage = function (ob) { 
        Countly.q.push(['openPage', {
             pageId: "xkhdlc"
        }]);
    };
    
    
	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});