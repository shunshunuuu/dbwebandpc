/**
 * 组件清单
 */
define('mall/scripts/index/menu', function(require, exports, module) {
	var appUtils = require("appUtils");
	var sidePanelTouchEvent = require("sidePanelTouchEvent");
	var _pageId = "#index_menu ";
	var cacheUtils = require("cacheUtils");
	var ssoUtils = require("ssoUtils");
	var cookieUtils = require("cookieUtils"); 
	var layerUtils = require("layerUtils");
	var mobileService = require("mobileService");
	function init()
	{	
		//需要登录之后才能返回正确的书
		getSessionValue();
	}
	
	function bindPageEvent()
	{
	   	//用户退出
		appUtils.bindEvent($(_pageId + " .icon_back"), function(e){
			layerUtils.dialog(2, "你确定要退出吗？", -1, function(){
				window.location.href = 'http://192.168.1.135:9090/m/sso/index.html#!/index/ssoLogout.html';
				}, function(){
					
			}, "确认", "取消");
			e.preventDefault();
		});
	   
		appUtils.bindEvent($(_pageId + " #gotoXdt"), function(e){
			window.location.href = 'http://192.168.1.135:9091/m/xdt/index.html#!/index/menu.html'
			e.preventDefault();
		});
		
		
	}
	
	
	function getSessionValue(){
        var curCallback = function(data){
	        if (data.error_no == 0) 
		    {
		    	var userInfo = data.results;
		    	$(_pageId+"#userName").html(userInfo[0].name)
                $(_pageId + " .icon_back").show();
			}else
			{
				alert(data.error_info);
			}
       	
       }
       mobileService.getSessionInfo({},curCallback);	
		
	}
	
	
	function destroy()
	{
		
	}

	
	var menu = {
		init: init,
		bindPageEvent: bindPageEvent,
		destroy: destroy
	};
	
	module.exports = menu;
});