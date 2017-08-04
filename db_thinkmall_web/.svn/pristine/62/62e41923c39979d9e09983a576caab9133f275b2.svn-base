/**************************************************************
 @author liaohl
 @date: 2014-01-2
 @description 对日期组件方法的封装
**************************************************************/
define(function (require, exports, module) {
	
	var $ = jQuery = require('jquery');
	require('mobiscroll');
	
	/**
	 * 初始化页面所有日期控件
	 * 要求日期字段都必须添加自定义属性data-dateplugin为mobiScroll
	 * @parm containerId 初始化哪一个父元素下的所有时间输入域，一般为页面pageId
	 * @parm preset date/time/datetime 日期/时间，默认“date”
	 * @parm dateFormat 日期输出格式，默认“yyyy-mm-dd”
	 * @parm mode 日期选择模式scroller,clickpick,mixed，默认“scroller”
	 * @parm display 显示方式 modal,inline,bubble,top,bottom，默认“modal”
	 */
	function initDateUI(containerId, preset, dateFormat, mode, display) 
	{
	    var opt = {
	        "preset": preset || 'date', 				//日期,datetime,date,time
	        "dateFormat": dateFormat || 'yyyy-mm-dd', 	//日期输出格式
	        "mode": mode || 'mixed', 				//日期选择模式scroller,clickpick,mixed
	        "display": display || 'modal', 				//显示方式 modal,inline,bubble,top,bottom
	        "dateOrder": 'yymmdd', 						//面板中日期排列格式
	        "theme": iBrowser.ios ? 'ios' : 'android-ics light', //皮肤样式//jqm,default
	        "setText": '确定', 		//确认按钮名称
	        "cancelText": '取消',	//取消按钮名籍我
	        "dayText": '日',	 		//面板中日文字
	        "monthText": '月', 		//面板中月文字
	        "yearText": '年', 		//面板中年文字
	        "endYear": 2099, 		//结束年份
	        "hourText": '时',
	        "minuteText": '分',
	        "secText": '秒',
	        "lang": 'zh' 	//语言,默认空为英文
	    };
	    $("#"+containerId+" input[data-dateplugin='mobiScroll']").mobiscroll(opt);
	}
	
	var dateUtils = {
		"initDateUI": initDateUI
	};
	//暴露对外的接口
	module.exports = dateUtils;
});