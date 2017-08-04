define(function(require, exports, module) {
	var _pageId = "#finan_fund_wdzx "; // 页面id
	var pageCode = "finan/fund/wdzx";
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
	
    // 全集变量定义
	var pageGlobal = {
			"curPage" : 1, // 当前页码
			"maxPage" : 0 // 总页数
	};
	
	/*
	 * 初始化
	 */
	function init() {
		// 初始化底部导航菜单
		common.footerTab(_pageId);
		// 初始化页面时定位滚动元素到第一个
		if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, 40);
		}
		//查询所有基金
		queryFundProduct();
	}
	
	function queryFundProduct(isAppendFlag){
		var param = {
				"page" : 1, 
				"numPerPage" : 8,
			    "user_id" : common.getUserId() // 用户编号
			};
		service.userAttention(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
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
				pageGlobal.maxPage = resultVo.results[0].totalPages; // 总页数
				var allProduct = "";
				for(var i = 0; i < results.length; i++){
					var item = results[i];
					var productName = item.product_name; // 产品名称
					productName = putils.delProSpecialStr(productName);
					if (productName.length > 7) {
						productName = productName.substring(0, 6) + "...";
					}
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var yieldrate1m = item.yieldrate1m || "0"; // 近一个年收益率
					var yield1 = parseFloat(yieldrate1m).toFixed(2);
					var currentPrice = item.current_price || "0"; // 单位净值
					var dwjz = parseFloat(currentPrice).toFixed(4);
					var productSubType = item.product_type;// 产品类型 0基金 1理财
					var followId = item.follow_id; // 关注编号
					productStatus = item.product_status;//产品状态
					
					var attentionHtml = ""; // 根据是否关注显示关注状态
					if (validatorUtil.isNotEmpty(followId)) {
						attentionHtml = '<li id="item_'+productId+'" class="love" productId="'+productId+'" productCode="' + productCode + '" productSubType="'+productSubType+'" productStatus="'+productStatus+'">';
					} else {
						attentionHtml = '<li id="item_'+productId+'" productId="'+productId+'" productCode="' + productCode + '" productSubType="'+productSubType+'" productStatus="'+productStatus+'">';
					}
					
					var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
					var showNameThree = showFiledThreeObj.name;
					var showValueThree = (showFiledThreeObj.value).toString();
					showValueThree = showValueThree.replace("万", "<em>万</em>");
					var proItem = {
							"productId" : productId,
							"productSubType" : productSubType,
							"productName" : productName,
							"productCode" : productCode,
							"yield1" : yield1,
							"currentPrice" : currentPrice,
							"dwjz" : dwjz,
							"showValueThree" : showValueThree,
							"attentionHtml" : attentionHtml
					}
					allProduct += getProductItemHtml(proItem);
				}
				
				
				if(isAppendFlag){
					$(_pageId+"#fund").append(allProduct);
				}else{
					$(_pageId+"#fund").html(allProduct);
				}
				pageScrollInit(resultDataLen);
				bindProEvent();
				
			}else{
				layerUtils.iAlert("查询基金列表失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	/*
	 * 组装产品单元html元素
	 */
	function getProductItemHtml(item){
		var productName = item.productName; // 产品名称
		var productSubType = item.productSubType; // 产品类型
		var productId = item.productId; // 产品编号
		var productCode = item.productCode; // 产品代码
		var yield1 = item.yield1;
		var currentPrice = item.currentPrice || "0"; // 单位净值
		var dwjz = item.dwjz;
		var qgjg = item.showValueThree;
		var attentionHtml = item.attentionHtml;
		 var itemHtml=''+attentionHtml+''+
	     '<i id="gz"></i>'+
		'<div class="pro_bts">'+
			'<p class="rolft">'+productName + '<span>'+productCode+'</span></p>'+
			'<p class="rorht">'+yield1+'%</p>'+
		'</div>'+
		'<div class="pro_sts">'+
			'<p>'+
				'<span class="ls">'+qgjg+'元起购</span>'+
				'<span class="hs">净值:'+dwjz+'</span>'+
			'</p>'+
			'<a id="goumai" href="javascript:void(0);">购买</a>'+
		'</div>'+
	   ' </li>';
		return itemHtml;
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
						// 查询所有产品
					queryFundProduct(false);
					
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
						
					   // 查询所有产品
						queryFundProduct(true);
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
	
	/*
	 * 绑定产品详情/关注事件
	 */
	function bindProEvent(){
		// 点击 名称进入详情
		appUtils.bindEvent(_pageId + "p", function(){
			var proEle = $(this).parent().parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		// 立即购买
		appUtils.bindEvent($(_pageId + "#goumai"), function(){
			if(checkProductStatus()){
				var gzEle = $(this).parent().parent();
				var productId=gzEle.attr("productId");
				var productSubType=gzEle.attr("productSubType");
				var productCode=gzEle.attr("productCode");
				var recommendPersonId = appUtils.getPageParam("uk"); // 获取请求参数中推荐人用户编号
				var param = {
					"product_id" : productId,
					"product_code" : productCode,
					"sub_type" : productSubType,
					"recommend_person_id" : recommendPersonId
				}
				var _loginInPageCode = "finan/buy";
				if (common.checkUserIsLogin(true, false, _loginInPageCode, param, true)) {
					appUtils.pageInit(pageCode, "finan/buy", param);
					return false;
				}
			}
		},'click');
		
		// 关注/取消关注
		appUtils.bindEvent($(_pageId + "#gz"), function(){
			var gzEle = $(this).parent();
			var productId=gzEle.attr("productId");
			var productSubType=gzEle.attr("productSubType");
			if (gzEle.attr("class")) {
				// 取消关注
				attentionProduct(productId, productSubType, false);
			
			}
		}, 'click');
		
		
	}
	
	/*
	 * 校验产品是否能够购买
	 */
	function checkProductStatus(){
		if (productStatus != "0" && productStatus != "1" && productStatus != "2") {
			layerUtils.iMsg(-1, "该产品非购买时期");
			return false;
		}
		return true;
	}
	
	/**
	 * 取消关注
	 * @param isAttent：0取消产品关注，1关注产品
	 * @param productId 产品编号
	 */
	function attentionProduct(productId, subType, isRefresh){
		var param = {
			"user_id" : common.getUserId(),
			"product_id" : productId,
			"product_sub_type" : subType
		}
		// 取消产品关注
		service.cancelAttention(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0") {
				appUtils.pageInit(pageCode,pageCode);
			} else {
				layerUtils.iMsg(-1, error_info);
			}
		});
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
					appUtils.pageInit(pageCode, "account/cashbutler/detail", {});
					return false;
				}
			}
			
			appUtils.pageInit(pageCode, "login/userLogin", {});
			return false;
			
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
		
		//搜索
		appUtils.bindEvent(_pageId + ".per_search", function(){
			appUtils.pageInit(pageCode,"finan/fund/search");
		});
		
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};
	
	
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = ""; // 总页数
	}

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});