 /**
  * 理财首页
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_categoryResult "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var gconfig = require("gconfig"); // 全局配置对象
	var constants = require("constants");// 常量类
	var global = require("gconfig").global; // 全局配置对象
	var putils = require("putils"); // 
	var curPage = 1; //当前也页码
	var maxPage = ""; // 总页数
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	var recommendType = "";
	var categoryType = ""; // 类型:0、最佳推荐，1、收益排行，2、最多关注，3、本月热销

	/*
	 * 初始化
	 */
	function init(){
		// 初始化底部导航菜单
		common.footerTab(_pageId);
		
		// 初始化元素
		initView();
		
		var index = appUtils.getPageParam("categoryType");
		categoryType = index;
		switch (index) {
		case 0:
			$(_pageId + "#categoryTitle").html("最佳推荐");
			recommendType = constants.recommendType.RECOMMEND_TYPE_BEST;
			queryRecomProduct();
			break;
		case 1:
			$(_pageId + "#v_container_productList").show();
			$(_pageId + "#categoryTitle").html("收益排行");
			incomeRank(false);
			break;
		case 2:
			$(_pageId + "#v_container_productList").show();
			$(_pageId + "#categoryTitle").html("最多关注");
			mostAttention(false);
			break;
		case 3:
			$(_pageId + "#categoryTitle").html("本月热销");
			recommendType = constants.recommendType.RECOMMEND_TYPE_MONTHHOT;
			queryRecomProduct();
			break;
		case 4:
			$(_pageId + "#categoryTitle").html("热门主题");
			recommendType = constants.recommendType.RECOMMEND_TYPE_HOTTHEME;
			queryRecomProduct();
			break;
		default:
			break;
		}
	}
	
	/*
	 * 热门主题
	 */
	function queryHotTheme(){
		// 推荐产品结果集回调函数
		var hotThemeBackFun = function(result) {
			var hotThemeProductEle = $(_pageId + "#recProductList").empty().show();

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
				themeName = putils.customType(themeName);
				var yieldrate1y = item.yieldrate1y || "0"; // 一年收益率
				var incomeunit = item.incomeunit || "0"; // 预期收益
				
				productName = putils.delProSpecialStr(productName);
				var showValue = ""; // 界面显示的值
				if (productSubType == "0") {
					showValue = parseFloat(yieldrate1y).toFixed(2);
				} else {
					showValue = parseFloat(incomeunit).toFixed(2);
				}
				
				var itemHtml = '<ul id="hotTheme">'+
								'	<li productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' + 
								'		<div class="ui layout">' + 
								'			<div class="tag_box">' + 
								'				<span>' + themeName +'</span>' + 
								'			</div>' + 
								'			<div class="row-1">' + 
								'				<h3>' + productName + '</h3>' + 
								'				<strong>' + showValue + '<span>%</span></strong>' + 
								'				<p>近一年收益率</p>' + 
								'			</div>' + 
								'			<div class="btn_box">' + 
								'				<a href="javascript:void(0)" class="buy_btn"><p>立即<br/>购买</p></a>' + 
								'			</div>' + 
								'		</div>' + 
								'	</li>'+
								'</ul>';
				
				hotThemeProductEle.append(itemHtml);
			}
			
			// 绑定详情事件
			appUtils.bindEvent(_pageId + "#hotTheme .btn_box", function(){
				var curLiEle = $(this).parent().parent();
				productDetail(curLiEle.attr("productId"), curLiEle.attr("productSubType"), curLiEle.attr("productCode"));
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_HOTTHEME;
		queryRecomProductByType(recommendType, hotThemeBackFun);
	}
	
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
	 * 初始化页面元素和变量
	 */
	function initView(){
		curPage = 1; //当前也页码
		maxPage = ""; // 总页数
		$(_pageId + "#recProductList").empty();
		$(_pageId + "#otherProductList").empty();
		$(_pageId + "#hotThemeList").empty();
		$(_pageId + "#v_container_productList").hide();
	}
	
	/*
	 * 根据推荐类型查询推荐产品
	 * @param recommendType 推荐类型。
	 * @param callBackFun 查询成功后回调函数。
	 * @param 查询失败或结果为空时回调函数。
	 */
	function queryRecomProduct() {
		var param = {
			"recommend_type" : recommendType,
			"user_id" : common.getUserId()
		};

		service.queryRecomProduct(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == "0") {
				var datas = data.results;
				var datasLen = datas.length;
				var marketListEle = $(_pageId + "#recProductList").empty().show();
				var allProductStr = "";
				for (var i = 0; i < datasLen; i++) {
					var item = datas[i];
					var productStatus = item.product_status; // 产品状态
					var productStatusDesc = putils.productStatus(productStatus); // 产品状态描述
					var fType = item.fund_type; // 基金类型
					var productTypeDesc = putils.fundType(fType); // 基金/理财类型
					var followId = item.follow_id; // 关注编号
					var attentionHtml = ""; // 根据是否关注显示关注状态
					if (validatorUtil.isNotEmpty(followId)) {
						attentionHtml = '<i class="no_att_icon att_icon"></i>已关注';
					} else {
						attentionHtml = '<i class="no_att_icon"></i>加关注';
					}
					var annualProfit = ""; // 收益率
					var annualProfitDesc = "收益率(%)"; // 基金展示收益率，理财展示最新净值
					var productSubType = item.product_sub_type; // 产品子类型
					if (productSubType == 0) {
						annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 收益率
						annualProfitDesc = "收益率(%)"; 
					} else if (productSubType == 1) {
						annualProfit = item.current_price ? item.current_price : "--"; // 当前净值
						annualProfitDesc = "最新净值"; 
					}
					if (annualProfit != "--") {
						annualProfit = parseFloat(annualProfit).toFixed(2);
					}
					
					var proItem = {
							"productId" : item.product_id,
							"productCode" : item.product_code,
							"productStatus" : productStatus,
							"productSubType" : productSubType,
							"productName" : item.product_name,
							"productTypeDesc" : productTypeDesc,
							"annualProfit" : annualProfit,
							"annualProfitDesc" : annualProfitDesc,
							"perBuyLimit" : item.per_buy_limit,
							"productStatusDesc" : productStatusDesc,
							"attentionHtml" : attentionHtml,
					}
					
					// 追加产品单元项html字符串
					allProductStr += getProductItemHtml(proItem);
				}
				
				marketListEle.html(allProductStr);
				
				// 绑定产品详情/关注事件
				bindProEvent();
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 收益排行
	 */
	function incomeRank(isAppendFlag) {
		
		var queryParam = {
			"is_rate" : 1, // 按收益率排行
			"page" : curPage, 
			"numPerPage" : 8,
			"user_id" : common.getUserId()
		};
		
		service.queryAllProduct(queryParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0") {
				var results = data.results[0].data;
				var resultDataLen = results.length; // 记录结果集长度
				maxPage = data.results[0].totalPages; // 总页数
				var allProductStr = "";
				for(var i = 0; i < resultDataLen; i++){
					var item = results[i];
					var productStatus = item.product_status; // 产品状态
					var productStatusDesc = putils.productStatus(productStatus); // 产品状态描述
					
					var annualProfit = ""; // 收益率
					var annualProfitDesc = "收益率(%)"; // 基金展示收益率，理财展示最新净值
					var productSubType = item.product_sub_type; // 产品子类型
					if (productSubType == 0) {
						annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 收益率
						annualProfitDesc = "收益率(%)"; 
					} else if (productSubType == 1) {
						annualProfit = item.current_price ? item.current_price : "--"; // 当前净值
						annualProfitDesc = "最新净值"; 
					}
					if (annualProfit != "--") {
						annualProfit = parseFloat(annualProfit).toFixed(2);
					}
					
					var followId = item.follow_id; // 关注编号
					var attentionHtml = ""; // 根据是否关注显示关注状态
					if (validatorUtil.isNotEmpty(followId)) {
						attentionHtml = '<i class="no_att_icon att_icon"></i>已关注';
					} else {
						attentionHtml = '<i class="no_att_icon"></i>加关注';
					}
					
					var fType = item.fund_type; // 基金类型
					var productTypeDesc = putils.fundType(fType); // 基金/理财类型
					
					var proItem = {
							"productId" : item.product_id,
							"productCode" : item.product_code,
							"productStatus" : productStatus,
							"productSubType" : productSubType,
							"productName" : item.product_name,
							"productTypeDesc" : productTypeDesc,
							"annualProfit" : annualProfit,
							"annualProfitDesc" : annualProfitDesc,
							"perBuyLimit" : item.per_buy_limit,
							"productStatusDesc" : productStatusDesc,
							"attentionHtml" : attentionHtml,
					}
					allProductStr += getProductItemHtml(proItem);
				}
				
				if(isAppendFlag){
					$(_pageId + "#otherProductList").append(allProductStr);
				}else{
					$(_pageId + "#otherProductList").html(allProductStr);
				}
				pageScrollInit(resultDataLen);
				
				// 绑定产品详情/关注事件
				bindProEvent();
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 查询最多关注产品  FunNo: 1000070
	 */
	function mostAttention(isAppendFlag) {
		var param = {
				"is_follow" : 1, // 按照关注排序
				"page" : curPage,
				"numPerPage" : 8,
				"user_id" : common.getUserId()
			};
			service.queryAllProduct(param,function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0") {
					var results = data.results[0].data;
					var resultDataLen = results.length; // 记录结果集长度
					maxPage = data.results[0].totalPages; // 总页数
					var allProductStr = "";
					for(var i = 0; i < resultDataLen; i++){
						var item = results[i];
						var productStatus = item.product_status; // 产品状态
						var productStatusDesc = putils.productStatus(productStatus); // 产品状态描述
						
						var annualProfit = ""; // 收益率
						var annualProfitDesc = "收益率(%)"; // 基金展示收益率，理财展示最新净值
						var productSubType = item.product_sub_type; // 产品子类型
						if (productSubType == 0) {
							annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 收益率
							annualProfitDesc = "收益率(%)"; 
						} else if (productSubType == 1) {
							annualProfit = item.current_price ? item.current_price : "--"; // 当前净值
							annualProfitDesc = "最新净值"; 
						}
						if (annualProfit != "--") {
							annualProfit = parseFloat(annualProfit).toFixed(2);
						}
						
						var followId = item.follow_id; // 关注编号
						var attentionHtml = ""; // 根据是否关注显示关注状态
						if (validatorUtil.isNotEmpty(followId)) {
							attentionHtml = '<i class="no_att_icon att_icon"></i>已关注';
						} else {
							attentionHtml = '<i class="no_att_icon"></i>加关注';
						}
						
						var fType = item.fund_type; // 基金类型
						var productTypeDesc = putils.fundType(fType); // 基金/理财类型
						
						var proItem = {
								"productId" : item.product_id,
								"productCode" : item.product_code,
								"productStatus" : productStatus,
								"productSubType" : productSubType,
								"productName" : item.product_name,
								"productTypeDesc" : productTypeDesc,
								"annualProfit" : annualProfit,
								"annualProfitDesc" : annualProfitDesc,
								"perBuyLimit" : item.per_buy_limit,
								"productStatusDesc" : productStatusDesc,
								"attentionHtml" : attentionHtml,
						}
						allProductStr += getProductItemHtml(proItem);
					}
					
					if(isAppendFlag){
						$(_pageId + "#otherProductList").append(allProductStr);
					}else{
						$(_pageId + "#otherProductList").html(allProductStr);
					}
					pageScrollInit(resultDataLen);
					
					// 绑定产品详情/关注事件
					bindProEvent();
				}else{
					layerUtils.iMsg(-1,error_info);
				}
			});
	}
	
	/*
	 * 组装产品单元html元素
	 */
	function getProductItemHtml(item){
		var productId = item.productId; // 产品ID
		var productCode = item.productCode; // 产品代码
		var productStatus = item.productStatus; // 状态
		var productSubType = item.productSubType; // 子类型 0 基金、1 理财
		var productName = item.productName; // 产品名称
		var productTypeDesc = item.productTypeDesc; // 产品类型描述
		var annualProfit = item.annualProfit; // 收益率/最新净值
		var annualProfitDesc = item.annualProfitDesc; // 收益率描述/最新净值描述
		var perBuyLimit = putils.setAmount(item.perBuyLimit); // 起购金额
		var productStatusDesc = item.productStatusDesc; // 产品状态描述
		var attentionHtml = item.attentionHtml; // 是否关注显示不同的图片
		productName = putils.delProSpecialStr(productName);
		
		var itemHtml = '<div class="list_table" id="item_'+productId+'">' + 
						'	<table width="100%" border="0" cellspacing="0" cellpadding="0" productId="'+productId+'" productCode="' + productCode + '" productSubType="'+productSubType+'">' + 
						'		<tr>' + 
						'			<th scope="col" style="width: 50%" class="productName">' + 
						'				<h3>' + 
											productName + 
						'				</h3>' +
						'			</th>' + 
						'			<th scope="col" style="width: 25%" class="productName">' + productTypeDesc + '</th>' + 
						'			<th scope="col" style="width: 25%" class="attention" productId="'+productId+'" productSubType="'+productSubType+'">' + attentionHtml + '</th>' + 
						'		</tr>' + 
						'		<tr class="productName">' + 
						'			<td>' + 
						'				<em class="em_01">' + annualProfit + '</em>' + 
						'				<p>' + annualProfitDesc + '</p>' + 
						'			</td>' + 
						'			<td>' + 
						'				<em class="em_02">' + perBuyLimit + '</em>' + 
						'				<p>起购金额</p>' + 
						'			</td>' + 
						'			<td>' + 
						'				<em class="em_03">' + productStatusDesc + '</em>' + 
						'				<p>交易状态</p>' + 
						'			</td>' + 
						'		</tr>' + 
						'	</table>' + 
						'</div>';
		return itemHtml;
	}
	
	function getTabEle(curEle){
		var pEle = curEle.parent();
		if (pEle.get(0).tagName == "table" || pEle.get(0).tagName == "TABLE") {
			return pEle;
		} else {
			return getTabEle(pEle);
		}
	}
	
	/*
	 * 绑定产品详情/关注事件
	 */
	function bindProEvent(){
		// 点击 名称进入详情
		appUtils.bindEvent(_pageId + ".market_list .productName", function(){
			var tabEle = getTabEle($(this).parent());
			var productCode = tabEle.attr("productCode");
			var subType = tabEle.attr("productSubType");
			var curProductId = tabEle.attr("productId");
			
			if (productCode == global.product_code) {
				// 现金管家
				appUtils.pageInit("finan/index", "account/cashbutler/detail", {});
			} else {
				if(subType == constants.product_sub_type.FUND){
					// 基金产品详情
					appUtils.pageInit("finan/market", "finan/detail", {"product_id" : curProductId});
				}else if(subType == constants.product_sub_type.FINANCIAL){
					// 理财产品详情
					appUtils.pageInit("finan/market", "finan/finanDetail", {"product_id" : curProductId});
				}
			}
		}, 'click');
		
		// 关注/取消关注
		appUtils.bindEvent(_pageId + ".market_list .attention", function(){
			var childEle = $(this).children();
			if (childEle.hasClass("att_icon")) {
				// 取消关注
				attentionProduct(0, $(this).attr("productId"), $(this).attr("productSubType"), false);
			} else {
				// 关注
				attentionProduct(1, $(this).attr("productId"), $(this).attr("productSubType"), false);
			}
		}, 'click');
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_productList").offset().top;
		var footerHeight = $(_pageId + ".footer_nav").height();
		var height2 = $(window).height() - height - footerHeight;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_productList"), 
				"wrapper" : $(_pageId + "#v_wrapper_productList"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					curPage = 1;
					if (categoryType == "1") {
						incomeRank(false);
					} else if (categoryType == "2") {
						mostAttention(false);
					}
				}, 
				"upHandle": function() {
					// 当前页等于最大页数时，提示用户
					if(curPage == maxPage){
						return false;
					}
					
					// 加载下一页数据
					if(curPage < maxPage){
						$(_pageId + ".visc_pullUp").show();
						
						curPage += 1;
						if (categoryType == "1") {
							incomeRank(true);
						} else if (categoryType == "2") {
							mostAttention(true);
						}
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 8 || curPage == maxPage){
			$(_pageId+".visc_pullUp").hide();
		}else{
			$(_pageId+".visc_pullUp").show();
		}	
	}
	
	/**
	 * 关注/取消关注
	 * @param isAttent：0取消产品关注，1关注产品
	 * @param productId 产品编号
	 */
	function attentionProduct(isAttent, productId, subType, isRefresh){
		var _loginInPageCode = "finan/categoryResult";
		var param = appUtils.getPageParam();
		if (!common.checkUserIsLogin(false, false, _loginInPageCode, param)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId(),
			"product_id" : productId,
			"product_sub_type" : subType
		}
		
		if (isAttent == 1) {
			// 关注产品
			service.attention(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0") {
					$(_pageId + "#item_" + productId).find(".attention").html('<i class="no_att_icon att_icon"></i>已关注');
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
					if (isRefresh) {
						// 我的关注 列表需要移除该项
						$(_pageId + "#item_" + productId).remove();
					} else {
						// 非我的关注列表 ，改变关注状态
						$(_pageId + "#item_" + productId).find(".attention").html('<i class="no_att_icon"></i>加关注');
					}
					
				} else {
					layerUtils.iMsg(-1, error_info);
				}
			});
		}
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin") {
				appUtils.pageBack();
			} else {
				appUtils.pageInit("finan/finanDetail", "finan/category", {});
			}
		});
		
		// 分类
		appUtils.bindEvent(_pageId + ".rt_icon", function(){
			appUtils.pageInit("finan/index", "finan/category", {});
		});
		
		// 切换到理财超市
		appUtils.bindEvent(_pageId + "#tab_market", function(){
			appUtils.pageInit("finan/index", "finan/market", {});
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
	}
	
	var categoryResult = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = categoryResult;
});