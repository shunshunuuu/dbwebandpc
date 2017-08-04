/**
 * 奥运活动分享页面3
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
	var pageCode = "aoyun/aoyunThree",
	 	_pageId = "#aoyun_aoyunThree ";
	var param = "";
	/**
	 * 初始化
	 * */
	function init(){
		var phone = appUtils.getPageParam("phone");
		param = {
				"phone" : phone
		}
	}
	
	/**
	 * 将参数传递给第三方
	 */
	function loadApp(telenumber){
		param.phone_reco =  telenumber;
		service.deliverParamtoThree(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				 window.location="http://wx.nesc.cn/weixin-fund/pages/download-app.html?befromFlag=sidi";
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
			window.location="http://mp.weixin.qq.com/s?__biz=MzI5MDAwNTY0Mg==&mid=502728363&idx=1&sn=11701a75b286cb293ca28fd8ebcbbd25&scene=1&srcid=0804SAXvGhMJkXLBttUiYG53#rd";
			 
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