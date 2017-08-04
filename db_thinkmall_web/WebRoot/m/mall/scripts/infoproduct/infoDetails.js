define(function(require, exports, module) {
	var _pageId = "#infoproduct_infoDetails "; // 页面id
	var pageCode = "infoproduct/infoDetails";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var productId = "";
	var user_id = "";
	var isdh = "";
	var rules_id = "";
	/*
	 * 初始化
	 */
	
	function init() {
		productId = appUtils.getPageParam("productid");
		//根据资讯产品编号查询该产品的详细信息
		queryProductInfo();
	    //查询兑换资讯产品的信息
		queryDHInfo();
		
		$(_pageId + "#dhqk").hide();
	}
	
	
	function queryProductInfo(){
		
		    var param = {
				"productId" : productId, // 产品编号
				"user_id" : common.getUserId()
			};
			service.queryInfoDetail(param,function(resultVo){
				if(0==resultVo.error_no){
					var results = resultVo.results;
					var dhhtml = "";
					var zxProductEle = $(_pageId+"#infoproduct").empty();
					var dhProductEle = $(_pageId +　"#imready").empty();
				    if(results.length > 0){
					   for(var i = 0; i < results.length; i++){
						  var imgPath = results[i].img_info_banner;
						  imgPath = global.url + imgPath;
						  isdh = results[i].isgm;
						  rules_id = results[i].rules_id;
						  var dbm = results[i].rules_price_dbm;
						  var cash = results[i].rules_price_cash;
						  var rules_long = results[i].rules_long;
						  var rules_unit = results[i].rules_unit;
						  var rules_time = null;
						  if(rules_unit == "0"){
							  rules_time = rules_long+"天";
						  }else if(rules_unit == "1"){
							  rules_time = rules_long+"个月";
						  }else if(rules_unit == "2"){
							  rules_long = rules_long*parseInt(3);
							  rules_time = rules_long+"个月";
						  }else if(rules_unit == "4"){
							  rules_time = rules_long+"年";
						  }
						  if(dbm){
							  rules_price_dbm = dbm +"东北米";
						  }else{
							  rules_price_dbm = "";
						  }
						  
						  if(cash){
							  rules_price_cash = ","+cash+"元";
						  }else{
							  rules_price_cash = "";
						  }
						  
						  
						  var itemHtml = '<div class="jp_banner"><img src="'+imgPath+'" alt="" /></div>'+
								'<div class="pro_tits pro_tit_ai">' +
							'<a href="javascript:void(0);">' +
								'<p class="sp04">'+results[i].product_name+'</p>' +
								'<p class="sp03"><s></s>'+"("+rules_price_dbm+""+rules_price_cash+")/"+rules_time+'</p>' +
							'</a>' +
						'</div>' +
						'<div class="mainbox">' +
							'<div class="main_001">' +
								'<div class="main_in001">' +
									'<div class="pro_tits pro_tit_ah">' +
										'<a href="javascript:void(0);">' +
											'<p class="sp01"><i></i>产品详情</p>' +
										'</a>' +
									'</div>' +
									'<div class="prowords">'+results[i].product_info+'</div>'+
								'</div>' +
							'</div>' +
							'<div class="main_001">' +
								'<div class="main_in001">' +
									'<div class="pro_tits pro_tit_aj">' +
										'<a href="javascript:void(0);">' +
											'<p class="sp01"><i></i>兑换说明</p>' +
										'</a>' +
									'</div>'+ 
									'<div class="prowords prowords_aa">' +
										results[i].rules_explanation+
									'</div>' +
								'</div>' +
							'</div>' +
					     '</div>';		
						  if(isdh == "0"){
							  dhhtml = '<a id= "ljexchange" href="javascript:void(0);">立即兑换</a>';
						  }else if(isdh == "1"){
							  dhhtml = '<a class="after" id = "yjexchange" href="javascript:void(0);">已兑换，看看其他产品</a>';
						  }
						  zxProductEle.append(itemHtml);
						  dhProductEle.append(dhhtml);
						}
					   
						//立即兑换
					    appUtils.bindEvent(_pageId + "#ljexchange", function(){
							var param = {
									 "productid" : productId,
									 "rules_id" : rules_id
								};
							appUtils.pageInit(pageCode, "infoproduct/orderPay",param);
						})
						//已兑换
						appUtils.bindEvent(_pageId + "#yjexchange", function(){
							appUtils.pageInit(pageCode,"infoproduct/productInfo");
						})
				    }else{
				    	zxProductELe.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
				    }
				}else{
					layerUtils.iAlert("查询资讯产品列表失败:"+resultVo.error_info,-1);
				}
			})
	};
	
	
	function queryDHInfo(){
		var param = {
			"productId" : productId
		};
		$(_pageId + "#dhqk").show();
		service.queryCashProductInfo(param, function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var rs = results.length;
				var dhEle = $(_pageId + "#dhtx").empty();
				var a = 0;
				var dhhtml = "";
				if(rs <= 0){
					$(_pageId + "#dhqk").hide();
				}else{
					$(_pageId + "#dhqk").show();
					var a = 0;
					if(rs <= 4&&rs >= 0){
						for (var i = 0; i < rs; i++) {
							a = i-0+1;
							var create_time = results[i].create_time;
							var mobile_phone = results[i].mobile_phone;
							var external_account = results[i].external;
							$(_pageId + "#numdh").text("已有"+rs+"人兑换").append("<s></s>");
							dhhtml +='<span><img src="images/user_mr0'+a+'.png"  alt="" /></span>';
							dhEle.html(dhhtml);	
						}
					}else if(rs > 4){
						for (var i = 0; i < 5; i++) {
							a=i-0+1;
							var create_time = results[i].create_time;
							var mobile_phone = results[i].mobile_phone;
							var external_account = results[i].external;
							$(_pageId + "#numdh").text("已有"+rs+"人兑换").append("<s></s>");
							dhhtml +='<span><img src="images/user_mr0'+a+'.png"  alt="" /></span>';
							dhEle.html(dhhtml);	
						}
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
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/riskAssSuccess" && prePageCode != "infoproduct/orderPay" && prePageCode != "infoproduct/myInfo") {
				appUtils.pageBack();
			} else {
                appUtils.pageInit(pageCode,"infoproduct/productInfo");
			}
		});
		

		
		//关闭浮动广告
		appUtils.bindEvent(_pageId + "#close", function(){
			$(_pageId + ".float_bg").attr("style","display:none;");
		});
		
		appUtils.bindEvent(_pageId + "#exchangeDetail", function(){
			appUtils.pageInit(pageCode, "infoproduct/convertList", {"productId":productId});
		});
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId +　"#imready").empty();
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});