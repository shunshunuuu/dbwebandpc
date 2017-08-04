/**
 * 调用壳子插件的业务 JS，封装与壳子之间的交互，包含接口文档中所有公用插件的调用方法
 * 接口说明：
 * 入参：{Key:Value,Key:Value,…}
 * 出参：{error_no:0,error_info:,results:[{Key:Value,Key:Value,...},{Key:Value,Key:Value,...},…]}
 * 功能号：funcNo
 */
define(function(require, exports, module){
	var	gconfig = require("gconfig");
	var	global = gconfig.global;
	var appUtils = require("appUtils");
	var external = require("external");
	var	layerUtils = require("layerUtils");
	var nativePluginService = {
		"getInstance": getInstance,
		"destroy": destroy
	};
	
	/**
	 * 销毁当前 service，一般不需要调用
	 */
	function destroy()
	{
		nativePluginService = {};
	}
	
	/**
	 * 获取 service 实例
	 */
	function getInstance()
	{
		return nativePluginService;
	}
	
	/**
	 * 请求参数的构造器，方便添加公用参数
	 */
	function InvokeParam()
	{
		
	}

	/**
	 * 公用		
	 * 弹出扫描图片二维码组件
	 * 说明：弹出扫描图片二维码组件获取数据后调用50272接口回调H5
	 * @param funcNo 50271
	 * @param title	String	标题	N
	 * @return content	String	内容
	 * @param moduleName String H5对应的模块名称
	 */
	nativePluginService.function50271 = function(paramMap) {
		var result = null;
		var param = new InvokeParam();
		param["funcNo"] = "50271";
		param["moduleName"] = paramMap.moduleName;
		param["title"] = paramMap.title;
		result = external.callMessage(param);
		return result;
	}
	
	/**
	 * 公用		
	 * 分享
	 * @param funcNo 50230
	 * @param title	String	标题	N
	 * @return content	String	内容
	 * @param moduleName String H5对应的模块名称
	 */
	nativePluginService.function50230 = function(paramMap) {
		var result = null;
		var param = new InvokeParam();
		param["funcNo"] = "50271";
		param["moduleName"] = paramMap.moduleName;
		param["title"] = paramMap.title;
		param["link"] = paramMap.link;
		param["content"] = paramMap.content;
		param["shareTypeList"] = paramMap.shareTypeList;
		param["imgUrl"] = paramMap.imgUrl;
		
		result = external.callMessage(param);
		return result;
	}

	module.exports = nativePluginService;
});