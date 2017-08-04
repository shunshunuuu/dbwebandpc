/**
 * 组件清单
 */
define('mall/scripts/index/index', function(require, exports, module) {
	var appUtils = require("appUtils");
	var _pageId = "#index_index ";
	
	function init()
	{	

	}
	
	function bindPageEvent()
	{
		appUtils.bindEvent($(_pageId + " #gotomall"), function(e){
			appUtils.pageInit('index/index','index/menu');
			e.preventDefault();
		});
		
		
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