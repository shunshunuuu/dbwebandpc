/**
 * 项目的全局配置，定义项目的全局配置信息，应用于所有模块
 */
define(function(require, exports, module) {
	var globalConfig = {
		/**
		 * 平台，不传默认为0：
		 * 0：pc或者手机浏览器、1：android手机壳子嵌phonegap、2：ios手机壳子嵌phonegap
		 * 默认为：0
		 */
		"platform": 0,
		/**
		 * hSea根路径，项目中的文件uri最终会在项目访问的web路径后添加/thinkive_mall_app/WebRoot
		 */
		"seaBaseUrl": "/m/"
	};
	
	module.exports = globalConfig;
});