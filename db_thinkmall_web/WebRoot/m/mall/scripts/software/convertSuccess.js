define(function(require, exports, module) {
	var _pageId = "#software_convertSuccess "; // 页面id
	var pageCode = "software/convertSuccess";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var isqdly = null;
	var fund_account = null;
	/*
	 * 初始化
	 */
	function init() {
		var product_name = appUtils.getPageParam("product_name");
		var rules_price_cash = appUtils.getPageParam("rules_price_cash");
		var rules_unit = appUtils.getPageParam("rules_unit");
		var rules_long = appUtils.getPageParam("rules_long");
		var order_no = appUtils.getPageParam("order_no");
		var pay_type = appUtils.getPageParam("pay_way");
		isqdly = appUtils.getPageParam("isqdly");
		var initpwd = appUtils.getPageParam("initpwd");
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var mobile = JSON.parse(userInfo).mobile_phone; //登录时的手机号
		var pay_account = JSON.parse(userInfo).fund_account;//登录时的资金账号
		
		if(pay_account){
			fund_account = pay_account; 
		}else if(mobile){
			fund_account = mobile;
		}
		//兑换成功的产品
		sellProduct(product_name,rules_price_cash,rules_unit,rules_long,order_no,pay_type,initpwd);
	}
	
	function sellProduct(product_name,rules_price_cash,rules_unit,rules_long,order_no,pay_type,initpwd){
			var orderEle = $(_pageId + "#dhxx").empty();
			var cpxxEle = $(_pageId + "#cpxx").empty();
			  if(pay_type == "7"){
				  pay_type = "银联支付";
			  }else if(pay_type == "6"){
				  pay_type = "东北米支付";
			  }
			  var rules_time = null;
			  if(rules_unit == "0"){
				  rules_time = rules_long+"天";
			  }else if(rules_unit == "1"){
				  rules_time = rules_long+"个月";
			  }else if(rules_unit == "2"){
				  rules_long = rules_long*3;
				  rules_time = rules_long+"个月";
			  }else if(rules_unit == "4"){
				  rules_time = rules_long+"年";
			  }
			  var download = global.download;
			  var price_time = rules_price_cash+"元/"+rules_time;
			  var itemHtml = '<p><span>付款金额</span>'+rules_price_cash+'元</p>' +
			  '<p><span>订单编号</span>'+order_no+'</p>' +
			  '<p><span>支付方式</span>'+pay_type+'</p>' +
			  '<p><span>付款账号</span>'+fund_account+'</p>';
			  var productHtml = '<p class="sp2">'+product_name+'</p>'+
					'<p class="sp3">'+price_time+'</p>'+
					'<p class="sp1"><span>下载链接</span>'+download+'</p>'+
					'<p><span>登录账号</span>'+fund_account+'</p>'+
					'<p><span>初始密码</span>'+initpwd+'</p>';
			orderEle.append(itemHtml);
			cpxxEle.append(productHtml);
	};
	
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			 if(isqdly == 01){
				  appUtils.pageInit(pageCode, "software/myOrder");
			  }else{
				  appUtils.pageBack();
			  }
		});
		
		//继续逛逛
		appUtils.bindEvent(_pageId + "#jxgg", function() {
			appUtils.pageInit(pageCode, "active/index");
		});
		
		//查看详情
		appUtils.bindEvent(_pageId + "#ckxq", function() {
			appUtils.pageInit(pageCode, "software/myOrder");
		});
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});