define(function(require, exports, module) {
	var _pageId = "#software_productSoftware "; // 页面id
	var pageCode = "software/productSoftware";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	
	/*
	 * 初始化
	 */
	function init() {
		//查询软件产品
		queryInfo();	
	}
	
	function queryInfo(){
		var param = {
			"page" : 1, 
			"numPerPage" : 8,
			"product_shelf" : 1, //上架状态
			"not_final_type" : 4   //软件产品
		};

		service.queryInfo(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
				var zxProductEle = $(_pageId+"#software").empty();
			    if(results.length > 0){
				   for(var i = 0; i < results.length; i++){
					  var product_id = results[i].product_id;  //产品编号
					  var product_name = results[i].product_name; ///产品名称
					  if(product_name.length>5){
						  product_name = product_name.substring(0,5)+"....";
					  }
					  var brond_id = results[i].brond_id; //
					  var comp_ratio = results[i].comp_ratio;
					  var product_abbr = results[i].product_abbr;
					  var product_code = results[i].product_code;
					  var product_description = results[i].product_description;
					  var product_shelf = results[i].product_shelf;
					  var theme_name = results[i].theme_name;
                      var year_total = results[i].year_total;
                      var recom_level = results[i].recom_level;
                	  var imgPath = results[i].img_info_url;
					  imgPath = global.url + imgPath;
					  var dhrs = results[i].dhrs;
					  var dbm = results[i].rules_price_dbm;
					  var cash = results[i].rules_price_cash;
                      var classes = "";
                      if(recom_level == "1"){
                    	  classes = "startbox onestart";
                      }else if(recom_level == "2"){
                    	  classes = "startbox twostart";
                      }else if(recom_level == "3"){
                    	  classes = "startbox threestart";
                      }else if(recom_level == "4"){
                    	  classes = "startbox fourstart";
                      }else if(recom_level == "5"){
                    	  classes = "startbox fivestart";
                      }
				  
					  var itemHtml='<li id="zz" productid="'+product_id+'">'+
							'<div class="sibnews flex-father">'+
						'<div class="sibnews_soft">' +
							'<img src="'+imgPath+'" alt="" />'+
						'</div>'+
						'<div class="sibnews_r flex-children">'+
							'<div class="softtits">'+
								'<p>'+product_name+'</p>'+
								'<span>已有'+dhrs+'人兑换</span>'+
							'</div>'+
							'<p class="sp1">满足你个性化的投资需求</p>' +
							'<div class="thestarts thestarts_a">推荐指数：'+
//						 从一颗星到5颗星，分别添加onestart,twostart,threestart,fourstart,fivestart;startbox为默认； 
								'<a class="'+classes+'" href="javascript:;">' +
									'<span class="str01"></span>' +
									'<span class="str02"></span>' +
									'<span class="str03"></span>' +
									'<span class="str04"></span>' +
									'<span class="str05"></span>' +
								'</a>' +
							'</div>' +
//							'<div class="theprice"><span>'+rules_price_dbm+""+rules_price_cash+'</span></div>'+
							'<div class="exchange" id="exchange">' +
								'<a href="javascript:;" id="exchange">立即兑换</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</li>';				

					  zxProductEle.append(itemHtml);
					}
					
					//立即兑换
				    appUtils.bindEvent(_pageId + "#software li", function(){
						var _loginInPageCode = "software/softwareDetail";
						var productid = $(this).attr("productid"); 
						var param = {
								"productid":productid
							};
//						if (common.checkUserIsLogin(false, false, _loginInPageCode, param, false)) {
							appUtils.pageInit(pageCode, "software/softwareDetail",param);
//							return false;
//						}
					})
					
			    }else{
			    	zxProductEle.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
			    }
			}else{
				layerUtils.iAlert("查询软件产品列表失败:"+resultVo.error_info,-1);
			}
		})
		
	}
	

	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "software/softwareDetail" && prePageCode != "login/userLogin") {
				appUtils.pageBack();
			} else {
				appUtils.pageInit(pageCode, "active/index");
			}
		});
		
		//到我的订单
		appUtils.bindEvent(_pageId + ".soft_btn", function(){
			if (common.checkUserIsLogin(false, false)) {
				appUtils.pageInit(pageCode, "software/myOrder");
			}
		});
		
		//立即购买
		appUtils.bindEvent(_pageId + ".pronews ul li", function(){
			appUtils.pageInit(pageCode,"software/softwareDetail");
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