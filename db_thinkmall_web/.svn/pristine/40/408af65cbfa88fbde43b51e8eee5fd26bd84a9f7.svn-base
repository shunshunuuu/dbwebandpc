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
    var pageCode = "product/dtjxgd";
    var _pageId = "#product_dtjxgd "; // 页面id
	
	var pageGlobal = {
			"curPage" : 1, // 当前页码
			"maxPage" : 0, // 总页数
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}

	
	/*
	 * 初始化
	 */
	
	function init() {
		$(_pageId + ".home_btn").attr("href", global.appIndexUrl);
		
		// 初始化页面时定位滚动元素到第一个
		if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}
		
		//查询定投精选的内容
		queryDtjx();
	}
	
	
	function queryDtjx(isAppendFlag){
		var param = {
				"page" : pageGlobal.curPage, 
				"numPerPage" : 12,
			    "is_year_rate" : 1,//近一年收益率  0 升序 1降序
			    "product_shelf" : "1",// 上线产品
			    "fund_investment" : "0"  //定投基金的标志
			};
		service.findFund(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
//				var dtProduct = $(_pageId + "#dtjx").empty();
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
				var itemHtml="";
				pageGlobal.maxPage = resultVo.results[0].totalPages; // 总页数
				if(resultDataLen > 0){
					for(var i = 0; i < resultDataLen; i++){
						var item = results[i];
						var productName = item.product_name; // 产品名称
						productName = putils.delProSpecialStr(productName);
						if (productName.length > 7) {
							productName = productName.substring(0, 6) + "...";
						}
						var productSubType = item.product_sub_type; // 产品类型
						var productId = item.product_id; // 产品编号
						var productCode = item.product_code; // 产品代码
						var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
						var yieldrate3m = item.yieldrate3m || "0"; // 近三个月收益率
						var yieldrate6m = item.yieldrate6m || "0"; // 近六个月收益率
						var yieldrate1y = item.yieldrate1y || "0"; // 近一年收益率
						var yield1m = parseFloat(yieldrate1m).toFixed(2);
						var yield3m = parseFloat(yieldrate3m).toFixed(2);
						var yield6m = parseFloat(yieldrate6m).toFixed(2);
						var yield1y = parseFloat(yieldrate1y).toFixed(2);
						var currentPrice = item.current_price || "0"; // 单位净值
						var dwjz = parseFloat(currentPrice).toFixed(4);
						var productSubType = item.product_sub_type;// 产品类型 0基金 1理财
						var followId = item.follow_id; // 关注编号
						productStatus = item.product_status;//产品状态
						var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
						var showNameThree = showFiledThreeObj.name;
						var showValueThree = (showFiledThreeObj.value).toString();
						showValueThree = showValueThree.replace("万", "<em>万</em>");
						var isyield = yield1y.substr(0,1);
						var classes = "";
						if(isyield == "-"){
							classes = "span02 agreen";
						}else{
							classes = "span02 ared";
						}
						
						itemHtml += '<li productId="'+productId+'" productCode="' + productCode + '" productSubType="'+productSubType+'" productStatus="'+productStatus+'">' +
							'<span class="span01 zs">' +
						      '<em>'+productName+'</em>' +
						      '<i>'+productCode+'</i>' +
					        '</span>' +
					       ' <span class="'+classes+'">'+yield1y+'</span>' +
					       ' <span class="span03 zs">'+currentPrice+'</span>' +
					       ' <span class="span04">' +
						        '<a id="goumai" href="javascript:void(0);">定投</a>' +
					        '</span>' +
				          '</li>';
						
					}
					
					$(_pageId + "#dtjx").append(itemHtml);
				}
				
				pageScrollInit(resultDataLen);
				bindProEvent();
				
			}else{
				layerUtils.iAlert("查询基金列表失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_productList").offset().top;
		var height2 = $(window).height() - height;
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
						// 查询所有定投产品
					queryDtjx(false);
					
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
						
					   // 查询所有定投产品
						queryDtjx(true);
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 12 || pageGlobal.curPage == pageGlobal.maxPage){
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
		appUtils.bindEvent(_pageId + ".span01", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		appUtils.bindEvent(_pageId + ".span02", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		appUtils.bindEvent(_pageId + ".span03", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		// 立即定投
		appUtils.bindEvent($(_pageId + "#goumai"), function(){
			var productStatus = $(this).parent().parent().attr("productStatus");
            if(checkProductStatus(productStatus)){
            	var gzEle = $(this).parent().parent();
				var productId=gzEle.attr("productId");
				var productCode=gzEle.attr("productCode");
				var param = {
						"product_id" : productId,
						"product_code" : productCode
				}
				var _loginInPageCode = "finan/fixedInvestment/placeOrder";
				if (common.checkUserIsLogin(true, false, _loginInPageCode, param, true)) {
					appUtils.pageInit("finan/detail", "finan/fixedInvestment/placeOrder", param);
					return false;
				}
			}
		},'click');
	}
	
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		// 非现金管家
		if(subType == constants.product_sub_type.FUND){
			// 基金产品详情
			appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
		}else if(subType == constants.product_sub_type.FINANCIAL){
			// 理财产品详情
			appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
		}
		
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
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 登录
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			appUtils.pageInit(pageCode, "account/userCenter", {});
			return false;
		});
		
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		//搜索
		appUtils.bindEvent(_pageId + ".per_search", function(){
			appUtils.pageInit(pageCode, "finan/fund/search");
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};

	/*
	 * 页面销毁
	 */
	function destroy() {
		//销毁滑动插件
		if (vIscroll._init == true) {
			vIscroll.scroll.destroy(); //销毁
			vIscroll.scroll = null;
			vIscroll._init = false;
		}
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = ""; // 总页数
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});