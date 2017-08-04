 /**
  * 理财超市
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_market "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var constants = require("constants");// 常量类
	var global = require("gconfig").global; // 全局配置对象
	var putils = require("putils");
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"filterObj" : {}, // 筛选条件
		"param" : {}, // 查询所有金融产品参数对象
		"searchType" : "0", // 查询类型0：查所有产品【1000070】 1：查我的关注【1000012】 2：模糊查询【1000052】
		"searchValue" : "" // 模糊查询金融产品关键字
	};


	/*
	 * 初始化
	 */
	function init(){
		// 进页面初始化查询类型
		pageGlobal.searchType = "0";
		
		// 初始化底部导航菜单
		common.footerTab(_pageId);
		
		// 初始化查询条件
		cleanPageParam();
		
		// 初始化tab选项
		initDefaultTab();
		
	}
	
	/*
	 * 初始化tab选项
	 */
	function initDefaultTab(){
		// 初始化页面时定位滚动元素到第一个
		if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}
		
		$(_pageId + ".sub_nav .row-1").find("a").removeClass("act").removeClass("cur");
		var pageParam = appUtils.getPageParam();
		// 如果是搜索页面
		if (pageParam.pageSrc && pageParam.pageSrc == "finan/search") {
			$(_pageId + "#sxTab").addClass("act");
			if (pageParam.searchType == "0") {
				// 根据基金类型查询产品
				pageGlobal.param.fundType = pageParam.searchValue; 
				pageGlobal.param.isRate = "1";
				queryAllProduct(false);
			} else if (pageParam.searchType == "1") {
				// 模糊查询
				pageGlobal.searchValue = pageParam.searchValue;
				pageGlobal.searchType = "2";
				searchProduct(false);
			}
		} else if (pageParam.pageSrc && pageParam.pageSrc == "login/userLogin") {
			// 关注页面
			var subNavList = $(_pageId + ".sub_nav .row-1");
			subNavList.find("a").removeClass("act");
			$(_pageId + "#wdgzTab").addClass("act");
			var userId = common.getUserId();
			pageGlobal.searchType = "1";
			pageGlobal.param.userId = userId;
			pageGlobal.param.attention = "1";
			myAttention(false);
		} else {
			// 设置收益率为默认选项且箭头向下
			$(_pageId + "#sylTab").addClass("act").addClass("cur");
			
			//查询收益率排行
			pageGlobal.param.isRate = "1";
			queryAllProduct(false);
		}
	}
	
	/*
	 * 根据条件查询所有金融产品 FunNo: 1000070
	 */
	function queryAllProduct(isAppendFlag){
		var queryParam = {
			"order_per_buy_limit" : pageGlobal.param.orderPerBuyLimit, // 根据起购金额排序
			"user_id" : common.getUserId(), // 用户编号
			"is_rate" : pageGlobal.param.isRate, // 按收益率排行
			"min_buy_limit" : pageGlobal.param.minBuyLimit, // 最小起购金额
			"max_buy_limit" : pageGlobal.param.maxBuyLimit, // 最大起购金额
			"min_rate" : pageGlobal.param.minRate, // 最小收益率
			"max_rate" : pageGlobal.param.maxRate, // 最大收益率
			"fund_type" : pageGlobal.param.fundType, // 产品类型
			"risk_level" : pageGlobal.param.riskLevel, // 产品风险等级
			"page" : pageGlobal.curPage, 
			"numPerPage" : 8
		};
		
		service.queryAllProduct(queryParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var allProductStr = "";
			
			if (error_no == "0") {
				var results = data.results[0].data;
				var resultDataLen = results.length; // 记录结果集长度
				if (resultDataLen == 0) {
					// 显示无记录
					$(_pageId + ".no_data_box").show();
					$(_pageId + "#v_container_productList").hide();
				} else {
					// 隐藏无记录
					$(_pageId + ".no_data_box").hide();
					$(_pageId + "#v_container_productList").show();
				}
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				var allProductStr = "";
				for(var i = 0;i < results.length;i++){
					var item = results[i];
					var productSubType = item.product_sub_type;// 产品类型 0基金 1理财
					var productStatus = item.product_status; // 产品状态
					var productCode = item.product_code;// 产品代码
					var fina_belongs = item.fina_belongs;// 理财归属
					// 判断是否是银行理财产品
					if(fina_belongs == "2"){
						var productStatusDesc = putils.bankProductStatus(productStatus);// 产品状态描述
					}else{
						var productStatusDesc = putils.productStatus(productStatus);// 产品状态描述
					}
					var annualProfit = ""; // 收益率
					var annualProfitDesc = "近一个月收益率(%)"; // 基金展示收益率，理财展示最新净值
					if (productSubType == 0) {
						annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 收益率
						annualProfitDesc = "近一个月收益率(%)"; 
					} else if (productSubType == 1) {
						annualProfit = item.current_price ? item.current_price : "--"; // 当前净值
						annualProfitDesc = "最新净值(元)"; 
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
							"productStatus" : productStatus,
							"productSubType" : productSubType,
							"productName" : item.product_name,
							"productTypeDesc" : productTypeDesc,
							"annualProfit" : annualProfit,
							"annualProfitDesc" : annualProfitDesc,
							"perBuyLimit" : item.per_buy_limit,
							"productStatusDesc" : productStatusDesc,
							"attentionHtml" : attentionHtml,
							"productCode" : productCode
					}
					allProductStr += getProductItemHtml(proItem);
				}
				
				if(isAppendFlag){
					$(_pageId+" .market_list").append(allProductStr);
				}else{
					$(_pageId+" .market_list").html(allProductStr);
				}
				pageScrollInit(resultDataLen);
				
				// 绑定产品详情/关注事件
				bindProEvent();
				
			}else{
				layerUtils.iMsg(-1, error_info);
			}
		});
		
	}
	
	/*
	 * 我的关注
	 */
	function myAttention(isAppendFlag){
		var containerTop = $(_pageId + "#v_container_productList").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		var param = {
			"user_id" : common.getUserId(), // 收益率上限
			"page" : pageGlobal.curPage, 
			"numPerPage" : 6
		};
		
		service.userAttention(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var allProductStr = "";
			if (error_no == "0") {
				var results = data.results[0].data;
				var resultDataLen = results.length; // 记录结果集长度
				if (resultDataLen == 0) {
					// 显示无记录
					$(_pageId + ".no_data_box").show();
					$(_pageId + "#v_container_productList").hide();
				} else {
					// 隐藏无记录
					$(_pageId + ".no_data_box").hide();
					$(_pageId + "#v_container_productList").show();
				}
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				var allProductStr = "";
				
				for(var i = 0;i < results.length;i++){
					var item = results[i];
					var productName = item.product_name;// 产品名称
					var productSubType = item.product_type; // 产品类型 0基金 1理财
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品编号
					//var perBuyLimit = putils.setAmount(item.per_buy_limit); // 起购金额
					var fina_belongs = item.fina_belongs; // 理财归属
					
					var productStatus = item.product_status; // 产品状态
					// 判断是否是银行理财产品
					if(fina_belongs == "2"){
						var productStatusDesc = putils.bankProductStatus(productStatus);// 产品状态描述
					}else{
						var productStatusDesc = putils.productStatus(productStatus);// 产品状态描述
					}
					var annualProfit = ""; // 收益率
					var annualProfitDesc = "近一个月收益率(%)"; 
					var productTypeDesc = "--"; // 基金/理财类型
					var perBuyLimit = item.per_buy_limit ? putils.setAmount(item.per_buy_limit) : "0.00"; // 起购金额
					if (productSubType == 0) {
						annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 暂时取一个月收益率【后续有可能会做成配置】
						annualProfitDesc = "近一个月收益率(%)"; 
						var fundType = item.fund_type; // 基金类型
						productTypeDesc = putils.fundType(fundType);
					} else if (productSubType == 1) {
						annualProfit = item.current_price ? item.current_price : "--"; ; // 当前净值
						annualProfitDesc = "最新净值(元)"; 
						var finanType = item.finan_type; // 理财类型
						productTypeDesc = putils.fundType(finanType);
					}
					if (annualProfit != "--") {
						annualProfit = parseFloat(annualProfit).toFixed(2);
					}
					productName = putils.delProSpecialStr(productName);
					
					allProductStr += '<div class="list_table" id="item_' + productId + '">' + 
									'	<table width="100%" border="0" cellspacing="0" cellpadding="0" productId="' + productId + '" productCode="' + productCode + '" productSubType="' + productSubType + '">' + 
									'		<tr>' + 
									'			<th scope="col" width="50%" class="productName">' + 
									'				<h3>' + 
														productName + 
									'				</h3>' +
									'			</th>' + 
									'			<th scope="col" width="25%" class="productName"></th>' + 
									'			<th scope="col" width="25%" productId="' + productId + '" class="attention"><i class="no_att_icon att_icon"></i>已关注</th>' + 
									'		</tr>' + 
									'		<tr class="productName">' + 
									'			<td>' + 
									'				<em class="em_01">' + annualProfit + '</em>' + 
									'				<p>' + annualProfitDesc + '</p>' + 
									'			</td>' + 
									'			<td>' + 
									'				<em class="em_02">' + perBuyLimit + '</em>' + 
									'				<p>起购金额(元)</p>' + 
									'			</td>' + 
									'			<td>' + 
									'				<em class="em_03">' + productStatusDesc + '</em>' + 
									'				<p>交易状态</p>' + 
									'			</td>' + 
									'		</tr>' + 
									'	</table>' + 
									'</div>';
				}
				
				if(isAppendFlag){
					//追加到子节点最后
					$(_pageId+" .market_list").append(allProductStr);
				}else{
					//替换原有html内容
					$(_pageId+" .market_list").html(allProductStr);
				}
				pageScrollInit(resultDataLen);
				
				// 点击 名称进入详情
				appUtils.bindEvent($(_pageId + ".market_list .list_table .productName"), function(){
					var tabEle = getTabEle($(this).parent());
					var productSubType = tabEle.attr("productSubType");
					var productId = tabEle.attr("productId");
					var productCode = tabEle.attr("productCode");
					productDetail(productId, productSubType, productCode);
				}, 'click');
				
				// 取消产品关注
				appUtils.bindEvent(_pageId + ".market_list .list_table .attention", function(){
					attentionProduct(0, $(this).attr("productId"), "", true);
				}, 'click');
				
			}else{
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 模糊查询金融产品
	 */
	function searchProduct(isAppendFlag){
		var queryParam = {
			"search_value" : pageGlobal.searchValue,
			"page" : pageGlobal.curPage,
			"user_id" : common.getUserId(),
			"numPerPage" : 8,
		}
		
		service.productSearch(queryParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0") {
				var results = data.results[0].data;
				var resultDataLen = results.length; // 记录结果集长度
				if (resultDataLen == 0) {
					// 显示无记录
					$(_pageId + ".no_data_box").show();
					$(_pageId + "#v_container_productList").hide();
				} else {
					// 隐藏无记录
					$(_pageId + ".no_data_box").hide();
					$(_pageId + "#v_container_productList").show();
				}
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				var allProductStr = "";
				for(var i = 0;i < results.length;i++){
					var item = results[i];
					var productSubType = item.product_sub_type;// 产品类型 0基金 1理财
					var productStatus = item.product_status; // 产品状态
					var productCode = item.product_code;// 产品代码
					var productStatusDesc = putils.productStatus(productStatus); // 产品状态描述
					var annualProfit = ""; // 收益率
					var annualProfitDesc = "近一个月收益率(%)"; // 基金展示收益率，理财展示最新净值
					if (productSubType == 0) {
						annualProfit = item.yieldrate1m ? item.yieldrate1m : "0.00"; // 收益率
						annualProfitDesc = "近一个月收益率(%)"; 
					} else if (productSubType == 1) {
						annualProfit = item.current_price ? item.current_price : "--"; // 当前净值
						annualProfitDesc = "最新净值(元)"; 
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
							"productStatus" : productStatus,
							"productSubType" : productSubType,
							"productName" : item.product_name,
							"productTypeDesc" : productTypeDesc,
							"annualProfit" : annualProfit,
							"annualProfitDesc" : annualProfitDesc,
							"perBuyLimit" : item.per_buy_limit,
							"productStatusDesc" : productStatusDesc,
							"attentionHtml" : attentionHtml,
							"productCode" : productCode
					}
					allProductStr += getProductItemHtml(proItem);
				}
				
				if(isAppendFlag){
					$(_pageId+" .market_list").append(allProductStr);
				}else{
					$(_pageId+" .market_list").html(allProductStr);
				}
				pageScrollInit(resultDataLen);
				
				// 绑定产品详情/关注事件
				bindProEvent();
				
			}else{
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 组装产品单元html元素
	 */
	function getProductItemHtml(item){
		var productId = item.productId; // 产品ID
		var productStatus = item.productStatus; // 状态
		var productSubType = item.productSubType; // 子类型 0 基金、1 理财
		var productName = item.productName; // 产品名称
		var productTypeDesc = item.productTypeDesc; // 产品类型描述
		var annualProfit = item.annualProfit; // 收益率/最新净值
		var annualProfitDesc = item.annualProfitDesc; // 收益率描述/最新净值描述
		var perBuyLimit = putils.setAmount(item.perBuyLimit); // 起购金额
		var productStatusDesc = item.productStatusDesc; // 产品状态描述
		var attentionHtml = item.attentionHtml; // 是否关注显示不同的图片
		var productCode = item.productCode; // 产品代码
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
						'				<p>起购金额(元)</p>' + 
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
	
	/*
	 * 绑定产品详情/关注事件
	 */
	function bindProEvent(){
		// 点击 名称进入详情
		appUtils.bindEvent(_pageId + ".market_list .productName", function(){
			var tabEle = getTabEle($(this).parent());
			var productSubType = tabEle.attr("productSubType");
			var productId = tabEle.attr("productId");
			var productCode = tabEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
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
	
	function getTabEle(curEle){
		var pEle = curEle.parent();
		if (pEle.get(0).tagName == "table" || pEle.get(0).tagName == "TABLE") {
			return pEle;
		} else {
			return getTabEle(pEle);
		}
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
					pageGlobal.curPage = 1;
					
					if (pageGlobal.searchType == "0") {
						// 查询所有产品
						queryAllProduct(false);
					} else if (pageGlobal.searchType == "1") {
						// 查询我的关注
						myAttention(false);
					} else if (pageGlobal.searchType == "2") {
						// 模糊查询
						searchProduct(false);
					}
					
				}, 
				"upHandle": function() {
					// 当前页等于最大页数时，提示用户
					if(pageGlobal.curPage == pageGlobal.maxPage){
						return false;
					}
					
					// 加载下一页数据
					if(pageGlobal.curPage < pageGlobal.maxPage){
						$(_pageId + ".visc_pullUp").show();
						pageGlobal.curPage += 1;
						
						if (pageGlobal.searchType == "0") {
							// 查询所有产品
							queryAllProduct(true);
						} else if (pageGlobal.searchType == "1") {
							// 查询我的关注
							myAttention(true);
						} else if (pageGlobal.searchType == "2") {
							// 模糊查询
							searchProduct(true);
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
		
		if(resultDataLen < 8 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/**
	 * 关注/取消关注
	 * @param isAttent：0取消产品关注，1关注产品
	 * @param productId 产品编号
	 */
	function attentionProduct(isAttent, productId, subType, isRefresh){
		var _loginInPageCode = "finan/market";
		var param = {"pageSrc": "login/userLogin"}
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
//						$(_pageId + "#item_" + productId).remove();
						pageGlobal.curPage = 1; // 重置当前页
						myAttention(false);
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
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		if (productCode == global.product_code) {
			// 现金管家详情
			var userInfo = appUtils.getSStorageInfo("userInfo");
			if (userInfo) {
				var user_id = JSON.parse(userInfo).user_id;
				if (user_id) {
					appUtils.pageInit("finan/market", "account/cashbutler/detail", {});
					return false;
				}
			}
			
			appUtils.pageInit("finan/market", "login/userLogin", {});
			return false;
		} else {
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit("finan/market", "finan/detail", {"product_id" : productId});
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit("finan/market", "finan/finanDetail", {"product_id" : productId});
			}
		}
		
	}
	
	
	// 初始化筛选条件显示
	function initView(){
		var delBox = $(_pageId + ".del_box");
		var spanItem = delBox.find("span")
		if(spanItem.length == 0){
			$(_pageId + ".del_box").html('<p style="text-align: center;color: #999;;margin:0">请选择筛选条件</p>');
		}
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 点击页面
	    appUtils.bindEvent($(_pageId + " #dropdown_box"),function(e){
			$(_pageId + "#dropdown_box").hide();
			e.stopPropagation();
	    });
	    
		// 筛选页面不做任何操作
	    appUtils.bindEvent($(_pageId + " .cate_dropdown"),function(e){
			e.stopPropagation();
	    });
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	
		// 切换到产品精选
		appUtils.bindEvent(_pageId + "#tab_index", function(){
			appUtils.pageInit("finan/market", "finan/index", {});
		});
		
		// 搜索
		appUtils.bindEvent(_pageId + ".search_btn", function(){
			appUtils.pageInit("finan/market", "finan/search", {});
		})
		
		appUtils.bindEvent(_pageId+"#tj", function(e){
		    customEvent(this);
		});
	
		appUtils.bindEvent(_pageId+"#lc", function(e){
			customEvent(this);
		});
		
		appUtils.bindEvent(_pageId+"#hd", function(e){
			customEvent(this);
		});
		
		appUtils.bindEvent(_pageId+"#wd", function(e){
			customEvent(this);
		});
		
		// 切换子tab页
		appUtils.bindEvent(_pageId + ".sub_nav .row-1", function(){
			vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
			var curTab = $(this);
			var curTabA = curTab.find("a");
			var subNavList = $(_pageId + ".sub_nav .row-1");
			var index = subNavList.index(this);
			var isFirst = false;
			// 如果点击的是当前激活tab页时 不要清空查询条件。否则清空查询条件
			if (!curTabA.hasClass("act")) {
				// 清空查询条件
				cleanPageParam();
				isFirst = true;
			}
			subNavList.find("a").removeClass("act");
			curTabA.addClass("act");
			
			// 隐藏过滤条件
			var dropdownBox = $(_pageId + "#dropdown_box").hide();
			var marketList = $(_pageId + ".market_list").empty();
			pageGlobal.curPage = 1; // 重置当前页
			
			// 切换tab时隐藏滑动插件下拉提示，因为多个tab是同一个滑动插件，上一个tab最终可能显示下拉提示，切换过来时需要隐藏
			$(_pageId + ".visc_pullUp").hide();
			
			switch (index) {
			case 0: // 我的关注
				subNavList.find("a").removeClass("cur");
				pageGlobal.searchType = "1";
				var _loginInPageCode = "finan/market";
				if (common.checkUserIsLogin(false, false, _loginInPageCode, {"pageSrc" : "login/userLogin"})) {
					pageGlobal.param.userId = common.getUserId();
					pageGlobal.param.attention = "1";
					myAttention(false);
				}
				break;
			case 1: // 收益率
				pageGlobal.searchType = "0";
				// 默认降序，
				if (pageGlobal.param.isRate == "1") {
					pageGlobal.param.isRate = "0";
				} else {
					pageGlobal.param.isRate = "1";
				}
				// 默认箭头向下，每点击一次换方向
				if (curTabA.hasClass("cur")) {
					subNavList.find("a").removeClass("cur");
					curTabA.removeClass("cur");
				} else {
					subNavList.find("a").removeClass("cur");
					curTabA.addClass("cur");
				}
				
				queryAllProduct(false);
				break;
			case 2: // 起购金额
				pageGlobal.searchType = "0";
				// 默认升序，
				if (pageGlobal.param.orderPerBuyLimit == "0") {
					pageGlobal.param.orderPerBuyLimit = "1";
				} else {
					pageGlobal.param.orderPerBuyLimit = "0"
				}
				// 默认箭头向上，每点击一次换方向
				if (curTabA.hasClass("cur")) {
					subNavList.find("a").removeClass("cur");
					curTabA.removeClass("cur");
				} else {
					subNavList.find("a").removeClass("cur");
					if (!isFirst) {
						curTabA.addClass("cur");
					}
				}
				queryAllProduct(false);
				break;
			case 3: // 筛选
				subNavList.find("a").removeClass("cur");
				cleanPageParam();
				pageGlobal.searchType = "0";
				// 显示过滤条件
				dropdownBox.show();
				
				// 清空已选择
				$(_pageId + ".del_box").empty();
				
				// 初始化条件状态
				$(_pageId + ".cate_list").find("span").removeClass("act");
				$(_pageId + ".del_box").html('<p style="text-align: center;color: #999;margin:0">请选择筛选条件</p>');
				break;
			default:
				break;
			}
		});
		
		// 筛选确认按钮
		appUtils.bindEvent(_pageId + ".sub_btn", function(){
			$(_pageId + "#dropdown_box").hide(); // 隐藏条件
			var delBox = $(_pageId + ".del_box"); 
			
			// 设置收益率查询条件
			var spanItem = delBox.find(".filter_syl");
			if (spanItem.length != 0) {
				pageGlobal.param.minRate = spanItem.attr("min");
				pageGlobal.param.maxRate = spanItem.attr("max");
				pageGlobal.param.isRate = "1";
			}
			
			// 设置起购金额查询条件
			var spanItem = delBox.find(".filter_qgje");
			if (spanItem.length != 0) {
				pageGlobal.param.minBuyLimit = spanItem.attr("min");
				pageGlobal.param.maxBuyLimit = spanItem.attr("max");
			}
			
			// 设置风险等级
			var spanItem = delBox.find(".filter_fxdj");
			if (spanItem.length != 0) {
				pageGlobal.param.riskLevel = spanItem.attr("val");
			}
			
			// 设置产品类型
			var spanItem = delBox.find(".filter_cplx");
			if (spanItem.length != 0) {
				pageGlobal.param.fundType = spanItem.attr("val");
				pageGlobal.param.isRate = "1";
			}
			
			queryAllProduct(false);
		});
		
		// 筛选条件点击事件
		bindFilterItemEvtByKey("filter_syl");
		bindFilterItemEvtByKey("filter_qgje");
		bindFilterItemEvtByKey("filter_fxdj");
		bindFilterItemEvtByKey("filter_cplx");
	}
	
	/*
	 * 清空查询参数
	 */
	function cleanPageParam()
	{
		pageGlobal.curPage = 1;
		pageGlobal.maxPage = 0;
		pageGlobal.param = {};
	}
	
	/**
	 * 筛选条件点击事件
	 * @param key 对应界面选项div的ID值，同时作为筛选条件对象的key值
	 */
	function bindFilterItemEvtByKey(key){
		$(_pageId + ".del_box").empty();
		appUtils.bindEvent(_pageId + "#" + key + " span", function(e){
			
			var spanList = $(_pageId + "#" + key + " span").removeClass("act");
			var curSpan = $(this);
			var index = spanList.index(this);
			
			if (curSpan.hasClass("act")) {
				return;
			}
			
			curSpan.addClass("act");
			
			// 保存过滤条件
			addFilter(key, curSpan.text(), curSpan.attr("min"), curSpan.attr("max"), curSpan.attr("val"));
			e.stopPropagation();
		});
	}
	
	/**
	 * 添加过滤条件到
	 */
	function addFilter(key, value, min, max, val){
		min = min || "";
		max = max || "";
		val = val || "";
		var delBox = $(_pageId + ".del_box");
		var spanItem = delBox.find("." + key);
		var span = delBox.find("span");
		if (span.length == 0){
			// 清空已选择框
			$(_pageId + ".del_box").empty();
		}
		if (spanItem.length != 0) {
			spanItem.text(value);
			spanItem.attr("min", min).attr("max", max).attr("val", val);
		} else {
			var delBoxItem = '<span min="' + min + '" max="' + max + '" val="' + val + '" class="del_act ' + key + '">' + value + '</span>';
			delBox.append(delBoxItem);
			appUtils.bindEvent(_pageId + "." + key, function(){
				removeFilter(key);
			});
		}
		
		// 保存筛选对象值
		pageGlobal.filterObj[key] = value;
	}
	
	/**
	 * 删除过滤条件
	 */
	function removeFilter(key){
		// 删除对象中的值
		delete pageGlobal.filterObj[key];
		
		// 删除界面元素
		$(_pageId + ".del_box").find("." + key).remove();
		
		// 删除选项样式
		$(_pageId + "#" + key + " span").removeClass("act");
		initView();
	}
	
	
    //事件统计
    var customEvent = function (ob) { 
        Countly.q.push(['customEvent', {
            eventId: ob.id, duration: "1000"
        }]);
    };
    
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = ""; // 总页数
	}
	
	var market = {
		"init": init, 
		"bindPageEvent": bindPageEvent, 
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = market;
});