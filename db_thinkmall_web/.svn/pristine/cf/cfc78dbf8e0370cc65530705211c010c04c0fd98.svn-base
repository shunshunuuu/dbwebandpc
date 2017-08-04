define(function(require, exports, module) {
	var _pageId = "#software_softwareDetail "; // 页面id
	var pageCode = "software/softwareDetail";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var user_id = null;
	function init() {
		productId = appUtils.getPageParam("productid");
		//根据资讯产品编号查询该产品的详细信息
		queryProductInfo();
		user_id = common.getUserId();
	}
	
	
	function queryProductInfo(){
		    var param = {
				"productId" : productId, // 产品编号
				"user_id" : user_id,
				"not_final_type" : 4   //软件产品
			};
			service.queryInfoDetail(param,function(resultVo){
				if(0==resultVo.error_no){
					var results = resultVo.results;
					var dhhtml = "";
					var zxProductEle = $(_pageId+"#infoproduct").empty();
				    if(results.length > 0){
					   for(var i = 0; i < results.length; i++){
						  var imgPath = results[i].img_info_banner;
						  imgPath = global.url + imgPath;
						  isdh = results[i].isgm;
						  rules_id = results[i].rules_id;
						  var dbm = results[i].rules_price_dbm;
						  var cash = results[i].rules_price_cash;
						  if(dbm){
							  rules_price_dbm = dbm +"东北米";
						  }else{
							  rules_price_dbm = "";
						  }
						  
						  if(cash){
							  rules_price_cash = "/"+cash+"元";
						  }else{ 
							  rules_price_cash = "";
						  }
						  
						  var itemHtml = '<div class="jp_banner"><img src="'+imgPath+'" alt="" /></div>' +
								'<div class="boxinside02">' +
							'<div class="pro_tits blems">' +
								'<a href="javascript:;">' +
									'<p class="sp01"><i></i>产品介绍</p>' +
								'</a>' +
							'</div>' +
							'<div class="jswords">'+results[i].product_info+'</div>' +
						'</div>' +
						'<div class="boxinside02">' +
							'<div class="pro_tits because">' +
								'<a href="javascript:;">' +
									'<p class="sp01"><i></i>推荐理由</p>' +
								'</a>' +
							'</div>' +
							'<div class="becafor">'+results[i].recomreason+'</div>' +
						'</div>'; 
			
						  zxProductEle.append(itemHtml);
						}
					   
						//立即购买
					    appUtils.bindEvent(_pageId + "#sell", function(){
							var param = {
									 "productid" : productId
								};
							
							var _loginInPageCode = "software/orderPay";
							if (common.checkUserIsLogin(false, false, _loginInPageCode, param, false)) {
								appUtils.pageInit(pageCode, "software/orderPay",param);
								return false;
							}
						})

				    }else{
				    	zxProductELe.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
				    }
				}else{
					layerUtils.iAlert("查询软件产品列表失败:"+resultVo.error_info,-1);
				}
			})
	};
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/riskAssSuccess" && prePageCode != "software/orderPay") {
				appUtils.pageBack();
			} else {
                appUtils.pageInit(pageCode,"software/productSoftware");
			}
		});
		
		appUtils.bindEvent(_pageId + "#exchangeDetail", function(){
			appUtils.pageInit(pageCode, "infoproduct/convertList", {"productId":productId});
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