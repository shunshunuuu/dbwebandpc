define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
    var pageCode = "infoproduct/searchInfo";
    var _pageId = "#infoproduct_searchInfo "; // 页面id
    
    var pageGlobal = {
    		"productData" : [] // 用户缓存所有产品信息 id,productCode,productName
    }
    
	
    /*
	 * 初始化
	 */
	
	function init() {
		// 底部导航
		common.footerTab(_pageId);
		
		// 初始化搜索历史
		$(_pageId + "#search_value").val("");
		$(_pageId + "#searchResult").hide();
		$(_pageId + "#searchView").show();
		// 把所有产品信息缓存到本地
		initProduct();
		
		// 初始化搜索历史
		initSearchHistory();
	}
	
	/**
	 * 初始化搜索历史
	 */
	function initSearchHistory(){
		var searchHistory = appUtils.getLStorageInfo("searchHistory");
		var historyEle = $(_pageId + "#searchView ul").empty();
		if (searchHistory) {
			searchHistory = JSON.parse(searchHistory);
			for (var i = searchHistory.length - 1; i >= 0; i--) {
				 var history =new Array();
				 history = searchHistory[i].split(",")
			     for (var j = 0; j < history.length; j++) {
						var product_id = history[1];
						var productCode = history[2];
						var product_name = history[3];
						var imgPath = history[4];
						var recom_level = history[5];
						var rules_price_dbm = history[6];
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
						  
							var itemHtml='<li id="zz" productId="'+product_id+'" productCode="'+productCode+'" productName="'+product_name+'">'+
									'<div class="sibnews">'+
								'<div class="sibnews_l">' +
									'<img src="'+imgPath+'" alt="" />'+
								'</div>'+
								'<div class="sibnews_r">'+
									'<div class="newstits">'+
										'<p>'+product_name+'</p>'+
									'</div>'+
									'<div class="thestarts">推荐指数：'+
//								 从一颗星到5颗星，分别添加onestart,twostart,threestart,fourstart,fivestart;startbox为默认； 
										'<a class="'+classes+'" href="javascript:;">' +
											'<span class="str01"></span>' +
											'<span class="str02"></span>' +
											'<span class="str03"></span>' +
											'<span class="str04"></span>' +
											'<span class="str05"></span>' +
										'</a>' +
									'</div>' +
									'<div class="theprice"><span>'+rules_price_dbm+'东北米</span></div>'+
									'<div class="exchange" id="exchange">' +
										'<a href="javascript:;" id="exchange">立即兑换</a>' +
									'</div>' +
								'</div>' +
						 	'</div>' +
						 '</li>';				
				}
				 historyEle.append(itemHtml); 
			}
			
			appUtils.bindEvent(_pageId + "#searchView li", function(){
				var curEle=$(this);
				var productId = curEle.attr("productId");
				productDetail(productId);
			});
		}
	}
	
	/**
	 * 搜索过的条件存储到历史记录里面
	 */
	function searchHistory(val){
		var searchValue = val;
		var searchHistory = appUtils.getLStorageInfo("searchHistory");
		if (!searchHistory) {
			searchHistory = [];
		} else {
			searchHistory = JSON.parse(searchHistory);
			// 只保存30个最新的记录
			if (searchHistory.length > 30) {
				searchHistory.remove(0);
			}
		}
		
		// 如果数组中没有存当前值 则添加到历史中
		if (validatorUtil.isNotEmpty(searchValue) && searchHistory.indexOf(searchValue) == -1) {
			searchHistory.push(searchValue);
			appUtils.setLStorageInfo("searchHistory", JSON.stringify(searchHistory));
		}
	}
	/*
	 * 把所有产品查询出来缓存到本地
	 */
	function initProduct(){
		// 清空产品数据
		pageGlobal.productData = [];
		var param = {
				"product_shelf" : 1 //上架状态
			};
		service.queryInfo(param, function(data){
			var results = data.results[0].data;
//			var result = common.getResultList(results);
			if (results.length > 0) { 
				for(var i = 0; i < results.length; i++){
					 var item = results[i];
					 var product_name = item.product_name; ///产品名称
					 var product_code = item.product_code;
					 var brond_id = item.brond_id; //
					 var comp_ratio = item.comp_ratio;
					 var product_abbr = item.product_abbr;
					 var product_description = item.product_description;
					 var product_shelf = item.product_shelf;
					 var theme_name = item.theme_name;
	                 var year_total = item.year_total;
	                 var recom_level = item.recom_level;
	          	     var imgPath = item.img_info_url;
				     imgPath = global.url + imgPath;
				     var rules_price_dbm = item.rules_price_dbm;
				     product_name = putils.delProSpecialStr(product_name); 
					 var product_id = item.product_id; // 产品ID
				 	 var productTemp = {
						"product_id" : product_id,
						"product_name" : product_name,
						"imgPath" : imgPath,
						"recom_level" : recom_level,
						"rules_price_dbm" : rules_price_dbm,
						"product_code" : product_code
					}
					pageGlobal.productData.push(productTemp);
				}
			}
		});
	}
	
	/*
	 * 模糊查询金融产品
	 */
	function queryProduct(key){
		if (key) {
			key = $.trim(key).toUpperCase();
		}
		$(_pageId + "#searchResult").hide();
		$(_pageId + "#searchView").show();
		
		var searchResultEle = $(_pageId + ".pronews ul").empty();
		var productData = pageGlobal.productData;
		var index = 0;
		if (productData.length > 0) {
			for(var i = 0; i < productData.length; i++){
				// 最多显示10条
				if (index >= 10) {
					break;
				}
				var item = productData[i];
				var productCode = item.product_code;// 产品代码
				var productName = item.product_name; // 产品名称
				var codeTemp = ""; // 把产品代码转为大写
				if (productCode) {
					codeTemp = productCode.toUpperCase();
				}
				var nameTemp = "";// 把产品名称转为大写
				if (productName) {
					nameTemp = productName.toUpperCase();
				}
				
				// 查询当前对象中产品代码和产品名称是否符合关键字 全部转换成大写后比较
				if (codeTemp.indexOf(key) != -1 || nameTemp.indexOf(key) != -1) {
					  var product_id = item.product_id;  //产品编号
					  var product_name = item.product_name; ///产品名称
                      var recom_level = item.recom_level;
              	     var imgPath = item.imgPath;
              	     var rules_price_dbm = item.rules_price_dbm;
              	     var product_code = item.product_code; 
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
				  
					  var itemHtml='<li id="zz" productId="'+product_id+'" imgPath = "'+imgPath+'" productCode="'+productCode+'" productName="'+product_name+'" recom_level="'+recom_level+'" rules_price_dbm ="'+rules_price_dbm+'" ">'+
							'<div class="sibnews">'+
						'<div class="sibnews_l">' +
							'<img src="'+imgPath+'" alt="" />'+
						'</div>'+
						'<div class="sibnews_r">'+
							'<div class="newstits">'+
								'<p>'+product_name+'</p>'+
							'</div>'+
							'<div class="thestarts">推荐指数：'+
//						 从一颗星到5颗星，分别添加onestart,twostart,threestart,fourstart,fivestart;startbox为默认； 
								'<a class="'+classes+'" href="javascript:;">' +
									'<span class="str01"></span>' +
									'<span class="str02"></span>' +
									'<span class="str03"></span>' +
									'<span class="str04"></span>' +
									'<span class="str05"></span>' +
								'</a>' +
							'</div>' +
							'<div class="theprice"><span>'+rules_price_dbm+'东北米</span></div>'+
							'<div class="exchange" id="exchange">' +
								'<a href="javascript:;" id="exchange">立即兑换</a>' +
							'</div>' +
						'</div>' +
				 	'</div>' +
				 '</li>';				
					searchResultEle.append(itemHtml);
					index ++;
				}
			}
			
			if (index > 0) {
				$(_pageId + "#searchResult").show();
				$(_pageId + "#searchView").hide();
				
				// 点击立即兑换
				appUtils.bindEvent(_pageId + "#searchResult ul li", function(){
					var curEle = $(this);
					var productid = curEle.attr("productId");
					var productCode = curEle.attr("productCode");
					var productName = curEle.attr("productName");
					var imgPath = curEle.attr("imgPath");
					var recom_level = curEle.attr("recom_level");
					var rules_price_dbm = curEle.attr("rules_price_dbm");
					var val =$(this).html()+","+productid+","+productCode+","+productName+","+imgPath+","+recom_level+","+rules_price_dbm;
					searchHistory(val);
					appUtils.pageInit(pageCode, "infoproduct/infoDetails",{"productid":productid});
				});
			}
			
		}
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		/*
		 * 文本框改变时查询
		 */
		appUtils.bindEvent(_pageId + "#search_value", function(){
			searchHistory();
    		
		}, "blur");
		
		/*
		 * 文本框改变时查询
		 */
		appUtils.bindEvent(_pageId + "#search_value", function(){
			var key = $.trim($(this).val());
			if (validatorUtil.isEmpty(key)) {
				$(_pageId + "#searchResult").hide();
				$(_pageId + "#searchView").show();
				return false;
			}
			queryProduct(key);
		}, "keyup");
		
		/*
		 * 清空历史记录
		 */
		appUtils.bindEvent(_pageId + "#cleanHistory", function(){

			layerUtils.iConfirm("您确定要清空历史搜索记录吗？",function(){
				
				appUtils.clearLStorage("searchHistory");
				$(_pageId + ".pronews ul").empty();
				     
				}, function(){}); 
		
		});
		
		appUtils.bindEvent(_pageId + "#away", function(){
			appUtils.pageBack();
		});
		 
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageInit(pageCode, "active/index");
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