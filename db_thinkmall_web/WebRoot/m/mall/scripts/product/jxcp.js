define(function(require, exports, module) {
	var _pageId = "#product_jxcp "; // 页面id
	var pageCode = "product/jxcp";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var tool = require("tool");
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
	require("mall/scripts/common/plugins/swiperEvent");
	
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}
	/*
	 * 初始化
	 */
	
	function init() {
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 底部导航
		common.footerTab(_pageId);
		// 精选产品
		hotsaleProduct();
		
		//查询数据字典
		queryMotifType();
		
	}
	
	
	
	
	/*
	 * 精选产品推荐
	 */
	function hotsaleProduct(){
		// 推荐产品结果集回调函数
		var recomProBackFun = function(result) {
			var monthHotProductEle = $(_pageId + "#pro_main").empty();
			
			if(result.length>0){
				// 精选产品区域填充数据
				for (var i = 0; i < result.length; i++) {
					var item = result[i];
					var productName = item.product_name; // 产品名称
					var product_abbr = item.product_abbr;
					var productSubType = item.product_sub_type; // 产品类型
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var period = item.period || "--"; // 理财周期
					var annual_profit = item.annual_profit || "--"; // 七日年化预期收益率
					var earnings = item.earnings || "--"; // 预期年化收益率
					var productStatus = item.product_status; // 产品状态
					var finaBelongs  = item.fina_belongs; 
					var tzqx = item.investment_horizon || "--";
					
				
					if(productSubType && productSubType == '0'){
						var showName = "理财基金";
						var showNameOne = "业绩比较基准";
						var showValueOne = annual_profit;
						
						// 第二个要展示的字段名称&值
						var showNameTwo = "理财周期";
						var showValueTwo = period;
					}else{
						if(finaBelongs && finaBelongs == '1'){
							var showName = "资管理财";
						}else if(finaBelongs == '2'){
							var showName = "银行理财";
						}else if(finaBelongs == '5'){
							var showName = "OTC";
						}
					}
					
					if (finaBelongs && finaBelongs == '2' || finaBelongs == '5') {
							var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
							var showNameOne = showFiledOneObj.name;
							var showValueOne = showFiledOneObj.value;
							var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
							var showNameTwo = showFiledTwoObj.name;
							var showValueTwo = showFiledTwoObj.value;
					}else if(finaBelongs == '1'){
							var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
							var showNameOne = "业绩比较基准";
							var showValueOne = earnings + '<em style="font-size: smaller;">%</em>';
							var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
							var showNameTwo = showFiledTwoObj.name;
							var showValueTwo = showFiledTwoObj.value;
					}
					
					var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
					var showNameThree = showFiledThreeObj.name;
					var showValueThree = (showFiledThreeObj.value).toString();
//					showValueThree = showValueThree.replaceAll(",","");
					showValueThree = showValueThree.replace("万", "<em>万</em>");
					
					productName = putils.delProSpecialStr(productName);
					if (productName.length > 17) {
						productName = productName.substring(0, 16) + "...";
					}
					
					product_abbr = putils.delProSpecialStr(product_abbr);
					if (product_abbr.length > 17) {
						product_abbr = product_abbr.substring(0, 16) + "...";
					}
					
					var itemHtml ='<div class="prolist" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' +
					   ' <div class="dutc_tit">' +
					   '		<p class="sp01">' + product_abbr + '</p>' +
					   '   <p class="sp02">'+
					   '    <span class="san01">' + showValueThree + '起购</span>' +
					   '    <span class="san02">' + showName + '</span> '+
					   '   </p>' +
					   ' </div>' +
					   ' <div class="dutc_box flex-father"><s></s>' +
					   '		<div class="dutc_bl flex-children">' +
					   '			<p class="sp01">'+earnings+'<span>%</span></p>' +
					   '			<p class="sp02">业绩比较基准</p>' +
					   '		</div>' +
					   '		<div class="dutc_bt flex-children">' +
					   '		    <p class="sp01">'+tzqx+'<span>天</span></p>' +
					   '		    <p class="sp02">投资期限</p>' +
					   '		</div>' +
					   '	</div>' +
					   ' </div>' +
					   '</div>' ;
					monthHotProductEle.append(itemHtml);
				}
			}
			// 绑定详情事件
			appUtils.bindEvent(_pageId + ".prolist", function(){
				var curEle = $(this);
				productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_INDEX_JXCP;
		queryRecomProductByType(recommendType, recomProBackFun);
	}
	
	/*
	 * 获取产品类型所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "product_catogory" 
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
					// 热门产品
					hotsaleProduct();
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
			appUtils.pageInit(pageCode, "account/cashbutler/detail", {});
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};
	

	

	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});