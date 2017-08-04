define(function(require, exports, module) {
	var _pageId = "#infoproduct_convertList "; // 页面id
	var pageCode = "infoproduct/convertList";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var productId = null;
	/*
	 * 初始化
	 */
	function init() {
		product_id = appUtils.getPageParam("productId");
		//查看兑换此资讯产品的用户
		queryConvertInfo();
	}
	
	function queryConvertInfo(){
		var param = {
			 "productId" : product_id	
		};
		service.queryCashProductInfo(param,function(resultVo){
			if(0 == resultVo.error_no){
				var results = resultVo.results;
				if(results.length > 0){
					var convertEle = $(_pageId + "#convert").empty();
					
					for (var i = 0; i < results.length; i++) {
						  var fund_account = results[i].external_account; //用户资金账号
					      var qid = fund_account.substr(0,3);
					      var id=fund_account.substr(3,3);
					      var sid=fund_account.substr(6,2);
					      var external_account = qid+id.replace(id,"***")+sid;
					      var phonenumber = results[i].mobile_phone; //用户手机号
					      var sjid = phonenumber.substr(0,3);
					      var sid = phonenumber.substr(3,5);
					      var mobile_phone = sjid+sid.replace(sid,"*****")+phonenumber.substr(8,3);
					      var zhnumber = "";
					      var create_time = results[i].create_time;
					      if(phonenumber){
					    	  zhnumber = mobile_phone;
					      }else if(fund_account){
					    	  zhnumber = external_account;
					      }
					      var b = "";
					      var Info_img_url = "";
					      if(i < 4){
					    	  b = i+1;
					    	  Info_img_url = "images/user_mr0"+b+".png";
					      }else{
					    	  Info_img_url = "images/user_mr01.png";
					      }
						 var itemHtml = '<li>' +
							           '<div class="martbox">'+
						                  '<img src="'+Info_img_url+'" alt="" />'+
						                  '<p class="qsp01">'+zhnumber+'</p>'+
					                      '<p class="qsp03">参与<span>1</span>人次</p>'+
						                  '<p class="qsp02">'+create_time+'</p>'+
					                   '</div>'+
				                     '</li>';
						 convertEle.append(itemHtml);
					}
				}
			}
		});
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
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