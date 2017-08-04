/**
 * 中秋活动分享页面3
 */
define(function(require,exports,module){
	/*引用模块*/
	var appUtils = require("appUtils"),
		gconfig = require("gconfig"),
		layerUtils = require("layerUtils"),
		service = require("mobileService"), //服务类 //业务层接口，请求数据service_wxactivity
		common = require("common"); //公共类
	var validatorUtil = require("validatorUtil"); //校验工具类
	/*常量*/
	var pageCode = "midAutumn/index",
	 	_pageId = "#midAutumn_index ";
	
	/**
	 * 初始化
	 * */
	function init(){
//		var phone = common.getUrlParam("phone");
		var phone = appUtils.getPageParam("phone");
		if(phone){
			appUtils.setSStorageInfo("phone", phone); 
		}else{
			layerUtils.iMsg(-1, "未获取到推荐人的手机号码");
		}
		
	}
	
	/**
	 * 将参数传递给第三方
	 */
	function loadApp(telenumber){
		
		var param ={
				"phone" : appUtils.getSStorageInfo("phone"),
				"phone_reco" : telenumber
		};
		service.midAutumnActivity(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				 //window.location="http://wx.nesc.cn/weixin-fund/pages/download-app.html?befromFlag=sidi";
				 window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.dbscgeneral";
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){
		/*
		 * 下载app
		 */
		appUtils.bindEvent(_pageId + " #load_app", function(){
			 var telenumber = $(_pageId + " #telenumber ").val();
			 if (validatorUtil.isMobile(telenumber)){
				 loadApp(telenumber);
			 }else {
				 layerUtils.iMsg(-1,"请输入正确的电话号码！！！");
				 $(_pageId+" #telenumber").val("");
			 }
		});
		
		/*
		 * 我也参加
		 */
		appUtils.bindEvent(_pageId + " #join", function(){
			window.location="http://mp.weixin.qq.com/s?__biz=MzA3MDkzMzUxOA==&mid=503617876&idx=1&sn=7098277acdadeaab7e6d67ecb9a63db7&scene=0#wechat_redirect";
			 
		});
	}

	/**
	 * 销毁
	 * */
	function destroy(){
		service.destroy();//销毁服务
	}

	var activity = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
		
	};
	
	module.exports = activity;
});