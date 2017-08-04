define(function(require, exports, module) {
	var _pageId = "#software_ActiveSoftDetail "; // 页面id
	var pageCode = "software/ActiveSoftDetail";
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
		//根据软件产品编号查询该产品的详细信息
		queryProductInfo();
		//查询此产品的活动价格规则
		queryActiveRules();
	    user_id = common.getUserId();
		if(user_id){
			//查询用户是否购买过此活动的产品
			querySellProduct();
		}
	}
	
	var isactive = null;
	
	function queryProductInfo(){
		    var param = {
				"productId" : productId, // 产品编号
				"user_id" : common.getUserId(),
				"not_final_type" : 4   //软件产品
			};
			service.queryInfoDetail(param,function(resultVo){
				if(0==resultVo.error_no){
					var results = resultVo.results;
					var dhhtml = "";
					var cpbannerEle = $(_pageId+"#cpbanner").empty();
					var cpjsEle = $(_pageId +　"#cpjs").empty();
				    if(results.length > 0){
					   for(var i = 0; i < results.length; i++){
						  var imgPath = results[i].img_active_banner;
						  imgPath = global.url + imgPath;
				          var bannerhtml = '<img src="'+imgPath+'" alt="" />';
						  var cpjs = '<p class="tit">产品介绍</p>'+
								'<p class="p2">'+results[i].product_description+'</p>';
						  cpbannerEle.append(bannerhtml);
						  cpjsEle.append(cpjs);
					  }
				    }else{
				    	zxProductELe.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
				    }
				}else{
					layerUtils.iAlert("查询软件产品列表失败:"+resultVo.error_info,-1);
				}
			})
	};
	
	function queryActiveRules(){
		var param = {
			 "product_id" : productId
		};
		
		service.queryPriceRules(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var rulesItem = results[0].KEY_MAP_PDT_RULE;
			var rules = JSON.parse(rulesItem);
				var cpactiveEle = $(_pageId + "#cpactive").empty();
			    if(rules.length > 0){
				   for(var i = 0; i < rules.length; i++){
					   
					   var rules_type = rules[i].rules_type;
					   if(rules_type == "1"){
						  var rules_explanation = rules[i].rules_explanation;
						  var activehtml = rules_explanation + '<a href="javascript:void(0);" id = "zhankai">展开更多<i></i></a>';
						  cpactiveEle.append(activehtml);
					   }
					   
						//展开
						appUtils.bindEvent(_pageId + "#zhankai", function(){
							var aa = $(this).attr("class");
							if(aa == "sq"){
								$(this).removeClass();
								$(".zk").hide();
								$(this).html("展开更多<i></i>");
							}else{
								$(this).addClass("sq");
								$(".zk").show();
								$(this).html("收起<i></i>");
							}
						});
				   }
			    }else{
			    	cpactiveEle.append('<li style="text-align:center; color:#c0c2c6; ">活动说明为空</li>');
			    }
			}else{
				layerUtils.iAlert("查询软件产品价格规则失败:"+resultVo.error_info,-1);
			}
		})
	}
	
	//查询用户是否购买过此活动的产品
	function querySellProduct(){
		var param = {
				  "user_id" : common.getUserId(),
				  "product_type" : 4
			};
			
			service.queryMyInfoOrder(param, function(resultVo){
				if(0==resultVo.error_no){
					var results = resultVo.results;
				    if(results.length > 0){
				      for (var i = 0; i < results.length; i++) {
				         var rules_type = results[i].rules_type;
				         if(rules_type == "1"){
				        	 isactive = 1;
				         }
					  }
				    }
				}else{
					layerUtils.iAlert("查询我的软件产品列表失败:"+resultVo.error_info,-1);
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
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/riskAssSuccess") {
				appUtils.pageBack();
			} else {
                appUtils.pageInit(pageCode,"active/index");
			}
		});
		
		//立即参与
		appUtils.bindEvent(_pageId + "#nowjoin", function(){
			if(user_id){
				if(isactive == 1){
					layerUtils.iAlert("你已经参与过此活动了，不能重复参与","确定");
				}else{
					appUtils.pageInit(pageCode, "software/orderPay", {"productid":productId,"hdDetail":"1"});
				}
			}else{
				var _loginInPageCode = "software/ActiveSoftDetail";
				var param = {
					 "productid":productId,
					 "isactive":"1"
				}
				if (common.checkUserIsLogin(false, false, _loginInPageCode, param, false)) {
					return false;
				}
			}
		});
		
		appUtils.bindEvent(_pageId + "#cpbanner", function(){
			if(user_id){
				if(isactive == 1){
					layerUtils.iAlert("你已经参与过此活动了，不能重复参与","确定");
				}else{
					appUtils.pageInit(pageCode, "software/orderPay", {"productid":productId,"hdDetail":"1"});
				}
			}else{
				var _loginInPageCode = "software/ActiveSoftDetail";
				var param = {
					 "productid":productId,
					 "isactive":"1"
				}
				if (common.checkUserIsLogin(false, false, _loginInPageCode, param, false)) {
					return false;
				}
			}
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