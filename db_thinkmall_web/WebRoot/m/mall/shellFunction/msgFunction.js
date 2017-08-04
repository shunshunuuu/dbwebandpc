/**
 * 这里写模块内部的消息处理函数，供原生回调H5
 */
define(function(require, exports, module){
	var	gconfig = require("gconfig");
	var	global = gconfig.global;
	var appUtils = require("appUtils");
	var	layerUtils = require("layerUtils");
	var oMyMsgFunction = {}; // 暴露给外部的对象
	var msgFunction = require("msgFunction"); // 加载 plugins 目录里面公用的 msgFunction
	
	/*将本文件里面的函数和 plugins 目录里面公用的 msgFunction 中的函数进行合并操作*/
	msgFunction.conbine(oMyMsgFunction);
	/*将本文件里面的函数和 plugins 目录里面公用的 msgFunction 中的函数进行合并操作，请务必将这句代码放在模块最前面*/
	
	/**
	 * 公用		
	 * 弹出通讯录，用于选择联系人的信息，选择完毕后回调H5
	 * 说明：通讯录插件的调用必须要写在页面UI的事件处理函数中，否则多模块开发原生无法获取到当前激活的模块从而导致无法回调H5
	 * @param funcNo 50223
	 * @param name String 名称 Y
	 * @param phone String 手机号码 Y
	 */
	oMyMsgFunction.function50223 = function(paramMap) 
	{
//		var selPhoneCallback = window.selPhoneCallback; // 选择电话联系人的回调函数
//		if(selPhoneCallback)
//		{
//			selPhoneCallback(paramMap);
//		}
//		
		var common = require("common");
		var pageCode = appUtils.getSStorageInfo("_curPageCode").replace(/_/g, "/");
		if(common.checkPermission())
		{
			require.async(gconfig.scriptsPath + pageCode, function(module){
				module.init();
			});
		}
	}
	
	/**
	 * 公用		
	 * 日期控件回调H5
	 * 说明：日期控件的调用必须要写在页面UI的事件处理函数中，否则多模块开发原生无法获取到当前激活的模块从而导致无法回调H5
	 * @param funcNo 50251
	 * @param date String 日期 Y
	 * @param selector String H5的元素选择器 N
	 */
	oMyMsgFunction.function50251 = function(paramMap) 
	{
		paramMap = paramMap || {};
		var selDateCallback = window.selDateCallback; // 选择日期的回调函数
		if(selDateCallback)
		{
			selDateCallback(paramMap);
		}
	}
	
	/**
	 * 公用		
	 * 设置系统软件的主题风格
	 * @param funcNo 50104
	 * @param theme String 主题颜色(见数据字典) Y 0：红色，1：蓝色，2：黑色，3：黄色，9：绿色
	 */
	oMyMsgFunction.function50104 = function(paramMap) 
	{
		if(paramMap)
		{
			var $appCss = $("head>link[href*='" + gconfig.firstLoadCss[0] + "']");
			var skinMap = {0: "red", 1: "blue", 2: "black", 3: "yellow", 9: "green"};
			var href = gconfig.cssPath + "style_" + skinMap[paramMap.theme] + ".css";
			gconfig.firstLoadCss[0] = href; // 修改当前皮肤对应的 css
			$appCss.attr("href", href);
			var originalOverflow = $("body").css("overflow");
			$("body").css("overflow", "auto"); // 强制浏览器重绘
			$("body").css("overflow", originalOverflow);
		}
	}

	/**
	 * 公用		
	 * 原生的信息提示框回调H5
	 * @param funcNo 50111
	 * @param flag	String	业务标志	N
	 */
	oMyMsgFunction.function50111 = function(paramMap) 
	{
		if(paramMap)
		{
			layerUtils.iAlert(paramMap.flag);
		}
	}

	/**
	 * 公用		
	 * 通知H5分享后的状态
	 * @param funcNo 50232
	 * @param shareType	String	分享平台（数据字典）	Y
	 * @param flag	String	分享状态（0：失败，1：成功)	Y
	 * @param info	String	备注信息	N
	 */
	oMyMsgFunction.function50232 = function(paramMap) 
	{
		if(paramMap)
		{
			layerUtils.iAlert("通知H5分享后的状态50232" + JSON.stringify(paramMap));
		}
	}
	
	/**
	 * 公用		
	 * 验证手势密码中忘记密码，修改账号回调H5
	 * @param funcNo 50262
	 * @param type	String	类型(0：忘记密码，1：修改账号）	N
	 */
	oMyMsgFunction.function50262 = function(paramMap) 
	{
		if(paramMap)
		{
			layerUtils.iAlert("验证手势密码中忘记密码，修改账号回调H550262" + JSON.stringify(paramMap));
		}
	}

	/**
	 * 公用		
	 * 扫描图片二维码的内容回调给H5页面	
	 * @param funcNo 50272
	 * @param content	String	内容	Y
	 */
	oMyMsgFunction.function50272 = function(paramMap) 
	{
		if(paramMap)
		{
			layerUtils.iAlert("扫描图片二维码的内容回调给H5页面	50272" + JSON.stringify(paramMap));
		}
	}
	
	/**
    *模块切换初始化
    */
	oMyMsgFunction.function50113 = function(param){
	   var toPage = param ? param["toPage"] : null;
	   require.async("sso",function(module){
		   if(toPage && toPage.length > 0){
		      var index = toPage.indexOf(".");
		      if(index > 0){
		         toPage = toPage.substring(0,index);
		      }
			  var pageId = toPage.split("/").join("_");
			  $("#"+pageId).hide();
			  appUtils.pageInit("",toPage);
		   }
		   else{
			   module.reloadPageInit();
		   }
	   });
    }
       
   /**
    *统一退出回调
    */
   oMyMsgFunction.function60401 = function(param){
	   if(param.error_no == 0){
		   require.async("sso",function(module){
			   if(module.checkLoginRight()){
				   module.goTologin();
			   }
		   });
	   }
	   else{
		   layerUtils.iAlert(param.error_info);
	   }
   	}
	
	module.exports = oMyMsgFunction;
});