define(function(require, exports, module) {
	var _pageId = "#infoproduct_orderPay "; // 页面id
	var pageCode = "infoproduct/orderPay";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
    
    var user_id = null;
    var productId = null;
    var rules_id = null;
    var mobile_phone = null;
    var user_mail = null;
    var imgPath = null; //产品图片
    var product_name = null;
    var product_description = null; //产品简介
    var rules_price_dbm = null; //东北米
    var rules_price_cash = null; //金额
	var user_name = null; //用户名
	var dhrs = null;
	var price_dbm = null;
	var userDBM = null;
	var order_no = null;
	var pay_account = null;
	var trade_pwd = null;
	var fund_account = null;
	var mobile = null;
	/*
	 * 初始化
	 */
	function init() {
		productId = appUtils.getPageParam("productid");
		rules_id = appUtils.getPageParam("rules_id");
		var userInfo = appUtils.getSStorageInfo("userInfo");
		user_id = JSON.parse(userInfo).user_id;
		mobile = JSON.parse(userInfo).mobile_phone; //登录时的手机号
		pay_account = JSON.parse(userInfo).fund_account;//登录时的资金账号
		mobile_phone = JSON.parse(userInfo).telephone;
		user_mail = JSON.parse(userInfo).user_mail;
		user_name = JSON.parse(userInfo).user_name;
		$(_pageId + "#dbmdh").attr("class","on");
		
		if(pay_account){
			fund_account = pay_account;
		}else if(mobile){
			fund_account = mobile;
			mobile_phone = mobile;
		}
		
		//查询兑换此产品的用户
		queryConvertInfo();
		
		//查询资讯产品信息
		queryProductInfo();
		
		//查询用户的东北米
		queryUserDBM();
	}
	
	function queryProductInfo(){
		
	    var param = {
			"productId" : productId // 产品编号
		};
		service.queryInfoDetail(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var InfoEle = $(_pageId+"#infoproduct").empty();
				var dhhtml = "";
			    if(results.length > 0){
				   for(var i = 0; i < results.length; i++){
					   imgPath = results[i].img_info_pro_url;
					   imgPath = global.url + imgPath;
					   product_description = results[i].product_description;
					   rules_price_dbm = results[i].rules_price_dbm;
					   rules_price_cash = results[i].rules_price_cash;
					   product_name = results[i].product_name;
					   price_dbm = results[i].rules_price_dbm;
					   $(_pageId + "#hj").attr("val",price_dbm);
					   $(_pageId + "#hj").text(""+price_dbm+"东北米");
					   var itemHtml ='<div class="main_001">' +
					  '<div class="proamsg">' +
						'<div class="pro_tits pro_tit_ah">' +
							'<a href="javascript:;">' +
								'<p class="sp01"><i></i>订单信息</p>' +
							'</a>' +
						'</div>'+
						'<div class="everyday">' +
							'<div class="p001">' +
								'<p>'+product_name+'</p>' +
								'<span>已有'+dhrs+'人兑换</span>' +
							'</div>' +
						'</div>' +
						'<div class="bbretail">' +
							'<div class="bbtail_in">' +
								'<img src="'+imgPath+'" alt="" />' +
								'<p class="aap01">简介：'+product_description+'</p>' +
								'<p class="aap02"><s></s>'+price_dbm+'东北米/'+rules_price_cash+'元</p>' +
								'<p class="aap03" id="duihuanfs">兑换份数 x1</p>' +
							'</div>' +
						'</div>' +
						'<div class="setabox">' +
							'<div class="setatop">' +
								'<p class="p002">订阅数量</p>' +
								'<div class="free">' +
									'<a class="minus" href="javascript:;"></a>' +
									'<input type="text" id = "nr" value="1" />' +
									'<a class="plus" href="javascript:;"></a>' +
								'</div>' +
							'</div>'+
						'</div>' +
					  '</div>' +
				    '</div>';
					  
					  InfoEle.append(itemHtml);
					  bindEvent();
					}
			    }
			}else{
				layerUtils.iAlert("查询资讯产品信息失败:"+resultVo.error_info,-1);
			}
		})
};
	
	function addInfoProduct(sum,zffs,hjdbm){
		    var param = {
				"user_id" : user_id, //用户id
				"product_id" : productId, //产品id
				"order_quantity" : sum,  //兑换数量
				"rules_id" : rules_id,   //规则编号
				"mobile_phone" : mobile_phone,
				"user_mail" : user_mail,
				"pay_account" : fund_account
			};
			service.addInfoProduct(param,function(resultVo){
				
				if(0==resultVo.error_no){
					var results = resultVo.results;
					var dhhtml = "";
				    if(results.length > 0){
				       var order_id = null;
					   for(var i = 0; i < results.length; i++){
						  var service_begin_time = results[i].service_begin_time;
						  var n_time = service_begin_time.substr(0,4);
						  var y_time = service_begin_time.substr(4,2);
						  var r_time = service_begin_time.substr(5,2);
						  var begin_time = n_time+"年"+y_time+"月"+r_time;
						  var service_end_time = results[i].service_end_time;
						  var nb_time = service_end_time.substr(0,4);
						  var yb_time = service_end_time.substr(4,2);
						  var rb_time = service_end_time.substr(6,2);
						  var end_time = nb_time+"年"+yb_time+"月"+rb_time;
						  var create_time = results[i].create_time;
						  order_no = results[i].order_no;
						  order_id = results[i].order_id;
						  appUtils.setSStorageInfo("order_no",order_no);
						  appUtils.setSStorageInfo("create_time",create_time);
						  appUtils.setSStorageInfo("order_id",order_id);
						}
					   
					   if(zffs == 6){
						   orderPay(order_id,hjdbm);
					   }else if(zffs == 7){
						   var tot_price = $(_pageId + "#hj").attr("val");
						   var param = "order_no=" + order_no + "&tot_price=" + tot_price;
						   var url = global.unionpay + "?" + param;
						   appUtils.sendDirect(url);
						   
						   //document.write('<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/></head><body><form id = "pay_form" action="https://101.231.204.80:5000/gateway/api/frontTransReq.do" method="post"><input type="hidden" name="txnType" id="txnType" value="01"/><input type="hidden" name="frontUrl" id="frontUrl" value="http://127.0.0.1:80/servlet/pay/action/PageJumpAction?function=jumpFront"/><input type="hidden" name="channelType" id="channelType" value="07"/><input type="hidden" name="currencyCode" id="currencyCode" value="156"/><input type="hidden" name="merId" id="merId" value="777290058136696"/><input type="hidden" name="txnSubType" id="txnSubType" value="01"/><input type="hidden" name="version" id="version" value="5.0.0"/><input type="hidden" name="txnAmt" id="txnAmt" value="20"/><input type="hidden" name="signMethod" id="signMethod" value="01"/><input type="hidden" name="certId" id="certId" value="40220995861346480087409489142384722381"/><input type="hidden" name="encoding" id="encoding" value="UTF-8"/><input type="hidden" name="bizType" id="bizType" value="000201"/><input type="hidden" name="signature" id="signature" value="hHmnS5ay40f1dDVRSmTtD8bj25xwyLULEJqJ19z55hil2Gj2ka/ejz6f/0omMdoSmGF6476qTjWQAq3UXrxkkeTuxqofCs5XKRQPL2RQkKtHS9M7nTdS27Kr8N0bdeuu1YARiV5sfIZJpHjJshvs+9cLp7rQmn2cDh00xnGEeKQ="/><input type="hidden" name="orderId" id="orderId" value="201612142159021490"/><input type="hidden" name="txnTime" id="txnTime" value="20161214220545"/><input type="hidden" name="accessType" id="accessType" value="0"/></form></body><script type="text/javascript">document.all.pay_form.submit();</script></html>');
					   }
				    }else{
				    	orderEle.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
				    }
				}else{
					layerUtils.iAlert("查询订单列表失败:"+resultVo.error_info,-1);
				}
		  })
	};
	
	
	function orderPay(order_id,hjdbm){
		var param = {
			"order_id" : order_id,
		    "pay_type" : 6,
		    "user_id" : user_id,
		    "pay_account" : fund_account,
		    "integral" : hjdbm
		};
		
		service.queryMyInfo(param, function(resultVo){
			if(0 == resultVo.error_no){
				var results = resultVo.results;
				var service_end_time = results[0].service_end_time;
				var product_name = results[0].product_name;
				var param = {
					"service_end_time" : service_end_time,
					"product_name" : product_name,
				    "integral" : hjdbm,
					"order_no" : order_no
				};
				appUtils.pageInit(pageCode, "infoproduct/convertSuccess",param);
			}else{
				layerUtils.iAlert("支付失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	function queryConvertInfo(){
		var param = {
				"productId" : productId
		};
		service.queryCashProductInfo(param,function(resultVo){
			if(0 == resultVo.error_no){
				var results = resultVo.results;
			    dhrs = results.length;
			}
		});
	}
	
	function queryUserDBM(){
		var param = {
			 "user_id" : user_id
		}
		service.queryUserIntergral(param,function(resultVo){
			if(0 == resultVo.error_no){
				userDBM = resultVo.results[0].enable_integral;
			}
		});
	}
	
	function bindEvent(){
		
		//数量加
		appUtils.bindEvent(_pageId + ".plus", function(){
			var isyhzffs = $(_pageId + "#yhkzf").attr("class");
			var isdbmzffs = $(_pageId + "#dbmdh").attr("class");
			var val = $("#nr").attr("value");
			var values = (val-0) + 1;
			$(_pageId + "#nr").attr("value", values);
			$(_pageId + "#duihuanfs").text("兑换份数 x"+values);
			if(isdbmzffs == "on"){
				var sum_price = values * price_dbm; 
				$(_pageId + "#hj").attr("val",sum_price);
				$(_pageId + "#hj").text(""+sum_price+"东北米");
			}
			
			if(isyhzffs == "on"){
//				var money = (values * rules_price_cash).toFixed();
				var money = accMul(values,rules_price_cash)
				$(_pageId + "#hj").attr("val",money);
				$(_pageId + "#hj").text(""+money+"元");
			}
		});		
		//数量减
		appUtils.bindEvent(_pageId + ".minus", function(){
			var isyhzffs = $(_pageId + "#yhkzf").attr("class");
			var isdbmzffs = $(_pageId + "#dbmdh").attr("class");
			var val = $("#nr").attr("value");
			var values = val - 1;
			if(values == 0){
				layerUtils.iAlert("订阅数量不能为0","确定");
				return false;
			}
			$(_pageId + "#nr").attr("value", values);
			$(_pageId + "#duihuanfs").text("兑换份数 x"+values);
			if(isdbmzffs == "on"){
				var sum_price = values * price_dbm; 
				$(_pageId + "#hj").attr("val",sum_price);
				$(_pageId + "#hj").text(""+sum_price+"东北米");
			}
			
			if(isyhzffs == "on"){
//				var money = values.toString() * rules_price_cash.toString();
				var money = accMul(values,rules_price_cash)
				$(_pageId + "#hj").attr("val",money);
				$(_pageId + "#hj").text(""+money+"元");
			}
		});
	}
	
	
	function accMul(arg1,arg2)
	{
		var m=0,s1=arg1.toString(),s2=arg2.toString();
		try{m+=s1.split(".")[1].length}catch(e){}
		try{m+=s2.split(".")[1].length}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
		
		//立即支付
		appUtils.bindEvent(_pageId + "#ljzf", function(){
			var isyhzffs = $(_pageId + "#yhkzf").attr("class");
			var isdbmzffs = $(_pageId + "#dbmdh").attr("class");
			var zffs = null;
			if(isdbmzffs == "on"){
				var sum = $(_pageId + "#nr").attr("value");
				var hjdbm = $(_pageId + "#hj").attr("val");
				if(parseInt(userDBM) >= parseInt(hjdbm)){
					zffs = 6;
					addInfoProduct(sum,zffs,hjdbm);
				}else if(parseInt(userDBM) < parseInt(hjdbm)){
					layerUtils.iAlert("你的东北米不够请使用银行卡支付","确定");
				}
			}
			
			if(isyhzffs == "on"){
				zffs = 7;
				var sum = $(_pageId + "#nr").attr("value");
				addInfoProduct(sum,zffs);
				
			}
			
			
		});
		
//		//支付成功
//		appUtils.bindEvent(_pageId + "#zfcg", function(){
//			appUtils.pageInit(pageCode, "infoproduct/convertSuccess");
//		});
		
//		//支付失败
//		appUtils.bindEvent(_pageId + "#zfsb", function(){
//			$(_pageId + "#zzc").hide();
//			$(_pageId + "#ddzf").hide();
//		});
		
		//选择支付方式
		appUtils.bindEvent(_pageId + ".bankboxs", function(){
			$(_pageId +".bankboxs").find("label").removeClass();
			$(this).find("label").attr("class","on");
			var isyhzffs = $(_pageId + "#yhkzf").attr("class");
			var isdbmzffs = $(_pageId + "#dbmdh").attr("class");
			if(isyhzffs == "on"){
				var num = $(_pageId + "#nr").attr("value");
				var money = num * rules_price_cash;
				$(_pageId + "#hj").attr("val",money);
				$(_pageId + "#hj").text(""+money+"元");
			}
			
			if(isdbmzffs == "on"){
				var num = $(_pageId + "#nr").attr("value");
				var money = num * rules_price_dbm;
				$(_pageId + "#hj").attr("val",money);
				$(_pageId + "#hj").text(""+money+"东北米");
			}
		});
		
		//关闭
		appUtils.bindEvent(_pageId + "#error", function(){
			$(_pageId + "#zzc").hide();
			$(_pageId + "#ddzf").hide();
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