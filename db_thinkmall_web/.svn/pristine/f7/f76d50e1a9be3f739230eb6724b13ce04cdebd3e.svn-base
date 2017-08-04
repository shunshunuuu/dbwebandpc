 /**
  * 理财首页
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_index "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var gconfig = require("gconfig"); // 全局配置对象
	var constants = require("constants");// 常量类
	var global = require("gconfig").global; // 全局配置对象
	var putils = require("putils"); // 

	var pageGlobal = {
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}
	/*
	 * 初始化
	 */
	function init(){
		// 处理ios滑动问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + "#pageContent"));
		
		// 初始化底部导航菜单
		common.footerTab(_pageId);
		
		// 现金管家
//		indexRecomProduct();
		
		// 最佳推荐
		bestRecomProduct();
		
		// 银行推荐
		bankRecomProduct();
		
		// 收益排行
		incomeRank();
		
		// 最多关注
		mostAttention();
		
		// 本月热销
		monthHotProduct();
		
		// 行业动态
//		queryNotice();
		
		//查询数据字典
		queryMotifType();
	}
	
	/*
	 * 获取主题类型所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "motifType" 
		}
		
		service.queryEnum(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						var result = data.results[i];
						var item_id = result.item_id; // 值编号 
						var item_name = result.item_name; // 项目名
						var item_value = result.item_value; // 项目值
						var enumTemp = {
								"itemValue" : item_value,
								"itemName" : item_name,
								"itemId" : item_id
							}
						pageGlobal.enumData.push(enumTemp);
					}
					// 热门主题
					queryHotTheme();
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 查询数据字典
	 */
	function queryenum(key){
		var enumData = pageGlobal.enumData;
		for (var i = 0; i < enumData.length; i++) {
			var item = enumData[i];
			if (item.itemValue == key) {
				return item.itemName;
			}
		}
	}
	
	/*
	 * 查询 现金管家 ，基金代码： AF0008 【配置在configuration.js中】
	 */
	function cashButler() {
		var param = {
			"product_code" : global.product_code 
		}
		
		service.fundInfo(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				
				if (results.length > 0) {
					var result = data.results[0];
					var product_name = result.product_name; // 产品名称
					var product_id = result.product_id; // 产品编号
					
					var annualProfit = result.annual_profit; // 年化收益率
					if (!annualProfit || annualProfit == "0") {
						annualProfit = 10.0;
					}
					annualProfit = parseFloat(annualProfit).toFixed(2); 
					
					$(_pageId + "#cashPrdName").html(product_name);
					$(_pageId + "#cashAnnualProfit").html(annualProfit);
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	};
	
	/*
	 * 首页推荐
	 */
	function indexRecomProduct(){
		// 推荐产品结果集回调函数
		var recomProBackFun = function(result) {
			if (result.length > 0) {
				var recProduct = result[0];
				var productId = recProduct.product_id; // 产品编号
				var productType = recProduct.product_sub_type; // 产品子类型
				var productName = recProduct.product_name; // 产品名称
				var productCode = recProduct.product_code; // 产品代码
				
				productName = putils.delProSpecialStr(productName);
				var annualProfit = ""; // 收益率
				if (productType == "0") { 
					// 基金产品显示一个月收益率
					annualProfit = recProduct.annual_profit ? recProduct.annual_profit : "0.00";
					$(_pageId + "#annualProfitDesc").html("预期年化收益率(%)");
				} else if (productType == "1") {
					// 理财产品显示净值
					annualProfit = recProduct.current_price ? recProduct.current_price : "1.00";
					$(_pageId + "#annualProfitDesc").html("最新净值");
				}
				annualProfit = parseFloat(annualProfit).toFixed(2); 
				
				$(_pageId + "#cashPrdName").html(productName);
				$(_pageId + "#cashAnnualProfit").html(annualProfit);
				
			}
			
			// 点击查看详情
			appUtils.bindEvent(_pageId + "#recommend_ul li", function(){
				productDetail(productId, productType, productCode);
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_FINANINDEX;
		queryRecomProductByType(recommendType, recomProBackFun);
	}
	
	/*
	 * 最佳推荐
	 */
	function bestRecomProduct() {
		// 推荐产品结果集回调函数
		var recomProBackFun = function(result) {
			var bestRecomProductEle = $(_pageId + "#bestRecom").empty();

			for (var i = 0; i < result.length; i++) {
				// 最多显示3个
				if (i > 2) {
					break;
				}
				
				var item = result[i];
				var productId = item.product_id; // 产品编号
				var productCode = item.product_code // 产品code
				var productSubType = item.product_sub_type; // 产品类型
				var productName = item.product_name; // 产品名称
				var productStatus = item.product_status; // 产品状态
				var finaBelongs  = item.fina_belongs;
				var showNameOneStyle = "";
				if (finaBelongs && finaBelongs == '2' || finaBelongs == '5') {
					if (productStatus && productStatus == '2') {
						var showNameOne = "开放状态";
						var showValueOne = "认购期";
						showNameOneStyle = "font-size: 0.30rem;";
					}else{
						var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
						var showNameOne = showFiledOneObj.name;
						var showValueOne = showFiledOneObj.value;
					}
				}else{
					if (productStatus && productStatus == '1') {
						var showNameOne = "开放状态";
						var showValueOne = "认购期";
						showNameOneStyle = "font-size: 0.30rem;";
					}else{
						var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
						var showNameOne = showFiledOneObj.name;
						var showValueOne = showFiledOneObj.value;
					}
				}
				
				var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
				var showNameTwo = showFiledTwoObj.name;
				var showValueTwo = showFiledTwoObj.value;
				
				var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
				var showNameThree = showFiledThreeObj.name;
				var showValueThree = (showFiledThreeObj.value).toString();
//				showValueThree = showValueThree.replaceAll(",","");
				showValueThree = showValueThree.replace("万", "<em>万</em>");
				
				productName = putils.delProSpecialStr(productName);
				var nameLength = productName.replace(/[^\x00-\xff]/g, "01").length; // 字符串长度中文算2个长度
				if (productName.length > 20) {
					productName = productName.substring(0, 17) + "...";
				}
				
				var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' +
								'	<h3>' + productName + '</h3>' + 
								'	<div class="layout_list clearfix">' + 
								'		<div class="row_box row_fl">' + 
								'			<strong style="'+showNameOneStyle+'">' + showValueOne + '</strong>' + 
								'			<p>' + showNameOne + '</p>' + 
								'		</div>' + 
								'		<div class="row_box row_fc">' + 
								'			<h4>' + showValueTwo + '</h4>' + 
								'			<p>' + showNameTwo + '</p>' + 
								'		</div>' + 
								'		<div class="row_box row_fr">' + 
								'			<h4>' + showValueThree + '</h4>' + 
								'			<p>' + showNameThree + '</p>' + 
								'		</div>' + 
								'	</div>' + 
								'</li>';
				
				bestRecomProductEle.append(itemHtml);
			}
			
			// 绑定详情事件
			appUtils.bindEvent(_pageId + "#bestRecom li", function(){
				var curLiEle = $(this);
				productDetail(curLiEle.attr("productId"), curLiEle.attr("productSubType"), curLiEle.attr("productCode"));
			});
			
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_BEST;
		queryRecomProductByType(recommendType, recomProBackFun);
	};
	
	/*
	 * 银行推荐
	 */
	function bankRecomProduct() {
		// 推荐产品结果集回调函数
		var bankProBackFun = function(result) {
			var bestRecomProductEle = $(_pageId + "#bankRecom").empty();
			
			for (var i = 0; i < result.length; i++) {
				// 最多显示3个
				if (i > 2) {
					break;
				}
				
				var item = result[i];
				var productId = item.product_id; // 产品编号
				var productCode = item.product_code // 产品code
				var productSubType = item.product_sub_type; // 产品类型
				var productName = item.product_name; // 产品名称
				var productStatus = item.product_status; // 产品状态
				var finaBelongs  = item.fina_belongs;
				var showNameOneStyle = "";
				
				if (finaBelongs && finaBelongs == '2' || finaBelongs == '5') {
					var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
					var showNameOne = showFiledOneObj.name;
					var showValueOne = showFiledOneObj.value;
				}else{
					var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
					var showNameOne = showFiledOneObj.name;
					var showValueOne = showFiledOneObj.value;
				}
				
				var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
				var showNameTwo = showFiledTwoObj.name;
				var showValueTwo = showFiledTwoObj.value;
				
				var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
				var showNameThree = showFiledThreeObj.name;
				var showValueThree = (showFiledThreeObj.value).toString();
//				showValueThree = showValueThree.replaceAll(",","");
				showValueThree = showValueThree.replace("万", "<em>万</em>");
				
				productName = putils.delProSpecialStr(productName);
				var nameLength = productName.replace(/[^\x00-\xff]/g, "01").length; // 字符串长度中文算2个长度
				if (productName.length > 20) {
					productName = productName.substring(0, 17) + "...";
				}
				
				var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">'+
							   '	<h3>' + productName + '</h3>'+
							   '	<div class="ui layout clearfix">'+
							   '		<div class="row-1 row_fl">'+
							   '			<strong>' + showValueOne + '</strong>'+
							   '			<span>' + showNameOne + '</span>'+
							   '		</div>'+
							   '		<div class="row-1 row_fr">'+
							   '			<p>' + showNameTwo + '：<span>' + showValueTwo + '</span></p>'+
							   '			<p class="mt10">' + showNameThree + '：<span>' + showValueThree + '</span></p>'+
							   '		</div>'+
							   '	</div>'+
							   '</li>';
				
/*				var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' +
				'	<h3>' + productName + '</h3>' + 
				'	<div class="layout_list clearfix">' + 
				'		<div class="row_box row_fl">' + 
				'			<strong style="'+showNameOneStyle+'">' + showValueOne + '</strong>' + 
				'			<p>' + showNameOne + '</p>' + 
				'		</div>' + 
				'		<div class="row_box row_fc">' + 
				'			<h4>' + showValueTwo + '</h4>' + 
				'			<p>' + showNameTwo + '</p>' + 
				'		</div>' + 
				'		<div class="row_box row_fr">' + 
				'			<h4>' + showValueThree + '</h4>' + 
				'			<p>' + showNameThree + '</p>' + 
				'		</div>' + 
				'	</div>' + 
				'</li>';*/
				
				bestRecomProductEle.append(itemHtml);
			}
			
			// 绑定详情事件
			appUtils.bindEvent(_pageId + "#bankRecom li", function(){
				var curLiEle = $(this);
				productDetail(curLiEle.attr("productId"), curLiEle.attr("productSubType"), curLiEle.attr("productCode"));
			});
			
		};
		
		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_BANK;
		queryRecomProductByType(recommendType, bankProBackFun);
	};
	
	
	/*
	 * 根据条件查询所有金融产品 FunNo: 1000070
	 */
	function incomeRank(){
		var queryParam = {
			"is_rate" : 1, // 按收益率排行
			"page" : 1, 
			"numPerPage" : 3
		};
		
		service.queryAllProduct(queryParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var allProductStr = "";
			
			if (error_no == "0") {
				var results = data.results[0].data;
				var incomeRankEle = $(_pageId + "#incomeRank").empty();
				
				for(var i = 0;i < results.length;i++){
					var item = results[i];
					var productName = $.trim(item.product_name); // 产品名称
					productName = putils.delProSpecialStr(productName);
					if (productName && productName.length > 12) {
						productName = productName.substring(0, 11) + "...";
					}
					
					var perBuyLimit = putils.setAmount(item.per_buy_limit); // 起购金额
					perBuyLimit = perBuyLimit.toString();
					perBuyLimit = perBuyLimit.replace("万", "<em>万</em>");
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var productSubType = item.product_sub_type;// 产品类型 0基金 1理财
					
					// 理财产品没有近一个月收益率。。由于按照近一个月收益率排序时，会把理财产品也查出来【放在最后】
					if (productSubType == "1") {
						break;
					}
					
					var yieldrate1m = item.yieldrate1m ? parseFloat(item.yieldrate1m).toFixed(2) : "0.00"; // 收益率
					
					var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '">' + 
									'	<div class="row">' + 
									'		<h4>' + productName + '</h4>' + 
									'	</div>' + 
									'	<div class="row">' + 
									'		<h5>' + yieldrate1m + '<small>%</small></h5>' + 
									'		<span>近一个月收益率</span>' + 
									'	</div>' + 
									'	<div class="row">' + 
									'		<p>' + perBuyLimit + '</p>' + 
									'		<span>起购金额(元)</span>' + 
									'	</div>' + 
									'</li>';
					
					incomeRankEle.append(itemHtml);
				}
				
				// 绑定详情事件
				appUtils.bindEvent(_pageId + "#incomeRank li", function(){
					var curLiEle = $(this);
					productDetail(curLiEle.attr("productId"), 0, curLiEle.attr("productCode"));
				});
				
			}else{
				layerUtils.iMsg(-1, error_info);
			}
		});
		
	}
	
	/*
	 * 查询最多关注产品  FunNo: 1000070
	 */
	function mostAttention() {
		var param = {
				"is_follow" : 1, // 按照关注排序
				"page" : 1,
				"numPerPage" : 2,
				"user_id" : common.getUserId()
			};
			service.queryAllProduct(param,function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0") {
					var results = data.results[0].data;
					if (results.length > 0) {
						var mostAttaionEle = $(_pageId + "#mostAttaion").empty();
						for (var i = 0; i < results.length; i++) {
							var item = results[i];
							var currentPrice = item.current_price || "0"; // 当前净值
							var productId = item.product_id; // 产品编号
							var productCode = item.product_code; // 产品代码
							var productName = item.product_name; // 产品名称
							var followNum = item.follow_num; // 关注数量
							var productSubType = item.product_sub_type; // 产品子类
							
							productName = putils.delProSpecialStr(productName);
							var followId = item.follow_id; // 关注编号
							var iconClass = ""; // 根据是否关注显示关注状态
							if (validatorUtil.isNotEmpty(followId)) {
								iconClass = 'class="act"';
							}
							
							var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' + 
											'	<span class="att_icon"><i ' + iconClass + '></i>' + followNum + '</span>' + 
											'	<h3>' + productName + '</h3>' + 
											'	<strong class="detail">' + parseFloat(currentPrice).toFixed(4) + '</strong>' + 
											'	<p class="detail">最新净值(元)</p>' + 
											'</li>';
							
							mostAttaionEle.append(itemHtml); 
						}
						
						// 点击查看详情
						appUtils.bindEvent(_pageId + "#mostAttaion .detail", function(){
							var curLiEle = $(this).parent();
							productDetail(curLiEle.attr("productId"), curLiEle.attr("productSubType"), curLiEle.attr("productCode"));
						});
						
						// 点击关注/取消关注
						appUtils.bindEvent(_pageId + "#mostAttaion .att_icon", function(){
							var childEle = $(this).find("i");
							var productSubType = $(this).parent().attr("productSubType");
							var productId = $(this).parent().attr("productId");
							if (childEle.hasClass("act")) {
								// 取消关注
								attentionProduct(0, productId, productSubType);
							} else {
								// 关注
								attentionProduct(1, productId, productSubType);
							}
						});
					}
				}else{
					layerUtils.iMsg(-1, error_info);
				}
			});
	}
	
	/**
	 * 关注/取消关注
	 * @param isAttent：0取消产品关注，1关注产品
	 * @param productId 产品编号
	 */
	function attentionProduct(isAttent, productId, productSubType){
		var _loginInPageCode = "finan/index";
		if (!common.checkUserIsLogin(false, false, _loginInPageCode, false)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId(),
			"product_id" : productId,
			"product_sub_type" : productSubType
		}
		
		if (isAttent == 1) {
			// 关注产品
			service.attention(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0") {
					mostAttention(); // 关注成功后刷新
				} else {
					layerUtils.iMsg(-1, error_info);
				}
			});
		} else {
			// 取消产品关注
			service.cancelAttention(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0") {
					mostAttention(); // 关注成功后刷新
				} else {
					layerUtils.iMsg(-1, error_info);
				}
			});
		}
	}
	
	/*
	 * 本月热销 FunNo: 1000065
	 */
	function monthHotProduct() {
		// 推荐产品结果集回调函数
		var recomProBackFun = function(result) {
			var monthHotProductEle = $(_pageId + "#monthHot").empty();

			// 热销产品区域填充数据
			for (var i = 0; i < result.length; i++) {
				// 最多显示3个
				if (i > 2) {
					break;
				}
				
				var item = result[i];
				var productName = item.product_name; // 产品名称
				var productSubType = item.product_sub_type; // 产品类型
				var productId = item.product_id; // 产品编号
				var productCode = item.product_code; // 产品代码
				var productStatus = item.product_status; // 产品状态
				var productStatusDesc = putils.productStatus(productStatus); // 产品状态描述
				
				var showFiledTwoObj = putils.getRecomField(2, item, false); // 第二个要展示的字段名称&值
				var showNameTwo = showFiledTwoObj.name;
				var showValueTwo = showFiledTwoObj.value;
				
				var showFiledThreeObj = putils.getRecomField(3, item, false); // 第三个要展示的字段名称&值
				var showNameThree = showFiledThreeObj.name;
				var showValueThree = showFiledThreeObj.value;
				productName = putils.delProSpecialStr(productName);
				if (productName.length > 14) {
					productName = productName.substring(0, 13) + "...";
				}
				
				var itemHtml = '<div class="row-1" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' + 
								'	<div class="row_up">' + 
								'		<div class="up_con">' + 
								'			<h4>' + productName + '</h4>' + 
								'			<h3>' + showValueTwo + '</h3>' + 
								'			<p>' + showNameTwo + '</p>' + 
								'		</div>' + 
								'	</div>' + 
								'	<div class="row_lower">' + 
								'		<p>' + showValueThree + '</p>' + 
								'		<span>' + showNameThree + '</span>' + 
								'	</div>' + 
								'</div>';
				
				monthHotProductEle.append(itemHtml);
			}
			
			// 绑定详情事件
			appUtils.bindEvent(_pageId + "#monthHot .row-1", function(){
				var curEle = $(this);
				productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_MONTHHOT;
		queryRecomProductByType(recommendType, recomProBackFun);
	};
	
	/*
	 * 热门主题
	 */
	function queryHotTheme(){
		// 推荐产品结果集回调函数
		var hotThemeBackFun = function(result) {
			var hotThemeProductEle = $(_pageId + "#hotTheme").empty();

			// 热销产品区域填充数据
			for (var i = 0; i < result.length; i++) {
				// 最多显示3个
				if (i > 2) {
					break;
				}
				
				var item = result[i];
				var productName = item.product_name; // 产品名称
				var productSubType = item.product_sub_type; // 产品类型
				var productId = item.product_id; // 产品编号
				var productCode = item.product_code; // 产品代码
				var themeName = item.custom_types || "-1"; // 主题名称 工作平台配置
				themeName = queryenum(themeName);
				var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
				var currentPrice = item.current_price || "0"; // 预期收益
				
				var showValue = ""; // 界面显示的值
				var showName = "近一月收益率"; // 显示字段名称
				if (productSubType == "0") {
					showValue = parseFloat(yieldrate1m).toFixed(2) + "<span style='font-size: smaller;'>%</span>";
					showName = "近一月收益率";
				} else {
					showValue = parseFloat(currentPrice).toFixed(4);
					showName = "最新净值";
				}
				productName = putils.delProSpecialStr(productName);
				var itemHtml = '<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' + 
								'	<div class="ui layout">' + 
								'		<div class="tag_box">' + 
								'			<span>' + themeName +'</span>' + 
								'		</div>' + 
								'		<div class="row-1">' + 
								'			<h3>' + productName + '</h3>' + 
								'			<strong>' + showValue + '</strong>' + 
								'			<p>' + showName + '</p>' + 
								'		</div>' + 
								'		<div class="btn_box">' + 
								'			<a href="javascript:void(0)" class="buy_btn"><p>立即<br/>购买</p></a>' + 
								'		</div>' + 
								'	</div>' + 
								'</li>';
				
				hotThemeProductEle.append(itemHtml);
			}
			
			// 绑定详情事件
			appUtils.bindEvent(_pageId + "#hotTheme li", function(){
				var curLiEle = $(this);
				productDetail(curLiEle.attr("productId"), curLiEle.attr("productSubType"), curLiEle.attr("productCode"));
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_HOTTHEME;
		queryRecomProductByType(recommendType, hotThemeBackFun);
	}
	
	/*
	 * 根据推荐类型查询推荐产品
	 * @param recommendType 推荐类型。
	 * @param callBackFun 查询成功后回调函数。
	 * @param 查询失败或结果为空时回调函数。
	 */
	function queryRecomProductByType(recommendType, callBackFun) {
		var param = {
			"recommend_type" : recommendType
		};

		service.queryRecomProduct(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == "0") {
				var result = data.results;
				
				if (result && result.length > 0) {
					// 数据处理函数
					callBackFun(result);
				}
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	};
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		if (productCode == global.product_code) {
			// 现金管家
			appUtils.pageInit("finan/index", "account/cashbutler/detail", {});
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit("finan/index", "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit("finan/index", "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	/*
	 * 公告 
	 */
	function queryNotice(){
		var param = {
			"contract_type" : constants.contractType.NOTICE,
			"page" : 1,
			"numPerPage" : 5 // 首页默认显示5条
		}
		
		service.queryAgreement(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == "0") {
				var result = data.results[0].data;
				var resultLen = result.length;
				var indDetEle = $(_pageId + "#notice").empty();
				
				// 响应结果处理
				if (result && resultLen > 0) {
					for (var i = 0; i < resultLen; i++) {
						var item = result[i];
						var agreementId = item.agreement_id; // 协议编号
						var agreementTitle = item.agreement_title; // 协议标题
						
						var itemHtml = '<li>'+
										'	<a href="javascript:void(0);" agreementId="' + agreementId + '">' + agreementTitle + '</a>'+
										'</li>';
						
						indDetEle.append(itemHtml);
					}
					
					// 点击查看详情
					appUtils.bindEvent(_pageId + "#notice li", function(){
						
					});
				}
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 分类
		appUtils.bindEvent(_pageId + ".rt_icon", function(){
			appUtils.pageInit("finan/index", "finan/category", {});
		});
		
		// 切换到理财超市
		appUtils.bindEvent(_pageId + "#tab_market", function(){
			appUtils.pageInit("finan/index", "finan/market", {});
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var finanIndex = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = finanIndex;
});