 /**
  * 理财首页
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_myFinancial "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var constants = require("constants"); // 常量类
	var putils = require("putils"); 
	var gconfig = require("gconfig");
	var global = require("gconfig").global; // 全局配置对象
	var VIscroll = require("vIscroll"); // 滑动组件
	var vIscroll = {"scroll" : null, "_init" : false}; // 上下滑动对象
	
	// 全局变量统一管理
	var pageGlobal = {
			"curPage" : 1, 	// 当前页
			"maxPage" : 0,  // 最大页数
			"nextFun" : 1	// 1：查询持仓、2：查询赎回
	}

	/*
	 * 初始化
	 */
	function init(){
		fundShare(false);// 查询持仓
		
		$(_pageId + "#tra_tab_list").find("a:eq(1)").removeClass("act");
		$(_pageId + "#tra_tab_list").find("a:eq(0)").addClass("act");	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("account/myFinancial", "account/userCenter", {});
		});
		
		// 持仓和赎回tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("act")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("act")
			// 设置当前tab act样式
			$(this).find("a").addClass("act");
			// 隐藏所有tab页
			$(_pageId + ".my_pos_list").hide();
			// 显示当前tab页
			$(_pageId + "#tra_tab_" + index).show();
			
			if (index == 0) {
				// 持有
				fundShare(false);
				pageGlobal.nextFun = "1";
			} else if (index == 1) {
				// 赎回
				redeem(false);
				pageGlobal.nextFun = "2";
			}
		});
		
	}
	
	/**
	 * 查询持有(基金份额查询)       1000182
	 */
	function fundShare(isAppendFlag){

		// 校验用户是否登录
		var _loginInPageCode = "account/myFinancial";
		if (!common.checkUserIsLogin(true, true, _loginInPageCode, false)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var fund_account = JSON.parse(userInfo).fund_account;
		var param = {
				"fund_account" : fund_account,
				"curPage" : pageGlobal.curPage,
				"numPerPage" : "6"
		};
		
		service.fundShare(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var allfundShareStr = ""; // 持有html
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages;
				
				if(recordLen != "0"){
					$(_pageId + ".no_data_box").hide();
					for(var i = 0;i < results.length;i++){
						var productAbbr = results[i].product_name; // 产品名称
						
						var product_code = results[i].product_code; // 产品代码
						
						var share_amount = results[i].share_amount; // 当前份额
						var nav = results[i].nav; // 市值
						var fund_avl = results[i].fund_avl; // 可用数量(可用份额)
						var redeemAmount = results[i].redeem_amount; // 可赎回数量
						var productId = results[i].product_id; // 产品ID
						var subType = results[i].product_sub_type; // 产品类型
						var applyNo = results[i].apply_no; // 产品类型
						
						productAbbr = putils.delProSpecialStr(productAbbr);
						
						allfundShareStr += '<li>' +
											'	<div class="ui layout li_up">' +
											'		<div class="row-1">' +
											'			<h3>' + productAbbr + '</h3>' +
											'		</div>' +
											'		<div class="redemption_btn" productCode = "' + product_code + '" productId="' + productId + '" productName="' + productAbbr + '" redeemAmount="' + redeemAmount + '" subType="' + subType + '" applyNo="' + applyNo + '">' +
											'			<a href="javascript:void(0)">赎回</a>' +
											'		</div>' +
											'	</div>' +
											'	<div class="ui layout li_lower">' +
											'		<div class="row-1">' +
											'			<em class="ared">' + parseInt(share_amount) + '</em>' +
											'			<p>当前份额</p>' +
											'		</div>' +	
											'		<div class="row-1">' +
											'			<em>' + parseInt(fund_avl) + '</em>' +
											'			<p>可用份额</p>' +	
											'		</div>' +
											'		<div class="row-1">' +
											'			<em>' + parseFloat(nav).toFixed(2) + '</em>' +
											'			<p>最新市值</p>' +
											'		</div>' +	
											'	</div>' +	
											'</li>' ;
					}
				}else{
					$(_pageId + ".no_data_box").show();
				}
				
				if(isAppendFlag){
					// 追加元素
					$(_pageId + ".my_pos_list ul").append(allfundShareStr);
				}else{
					// 替换元素
					$(_pageId + ".my_pos_list ul").html(allfundShareStr);
				}
				
				appUtils.bindEvent(_pageId + ".redemption_btn", function(){
					var productCode = $(this).attr("productCode");
					if (productCode == global.product_code) {

						// 现金管家详情
						layerUtils.iMsg(-1,"请设置留存金额");
						appUtils.pageInit("finan/market", "account/cashbutler/detail", {});
						return false;

					}else{
						var param = {
								"productId" : $(this).attr("productId"),
								"productName" : $(this).attr("productName"),
								"redeemAmount" : $(this).attr("redeemAmount"),
								"applyNo" : $(this).attr("applyNo"),
								"subType" : $(this).attr("subType")
								
							}
						appUtils.pageInit("account/myFinancial", "account/redemption", param);
					}

				}, "click");
				
				//初始化上线滑动加载
				pageScrollInit(recordLen);
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/**
	 * 查询赎回(金融产品订单查询)（分页）1000122
	 */
	function redeem(isAppendFlag){
		// 校验用户是否登录
		var _loginInPageCode = "account/myFinancial";
		if (!common.checkUserIsLogin(true, true, _loginInPageCode, false)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var user_id = JSON.parse(userInfo).user_id;
		var param = {
				"user_id" : user_id, // 用户ID
				"order_state" : constants.order_state.SUCCESS, // 成功
				"business_type" : constants.business_type.REDEMPTION, // 赎回
				"curPage" : pageGlobal.curPage, 
				"numPerPage" : "8"
		};
		
		service.queryFinancialOrder(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var allfundShareStr = ""; // 持有html
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages;
				
				if(recordLen != "0"){
					$(_pageId + ".no_data_box").hide();
					for(var i = 0;i < results.length;i++){
						var productAbbr = results[i].product_name; // 产品名称
						var productCode = results[i].product_code; // 产品代码
						var orderQuantity = results[i].order_quantity; // 订单数量
						var createTime = results[i].create_time; // 创建时间(赎回时间)
						var totPrice = results[i].tot_price; // 总价值
						createTime = createTime.substring(5,11);
						var business_type = results[i].business_type; // 业务类型
						
						productAbbr = putils.delProSpecialStr(productAbbr);
						
						allfundShareStr += '<li>' +
											'	<div class="ui layout li_up">' +
											'		<div class="row-1">' +
											'			<h3>' + productAbbr + '</h3>' +
											'		</div>' +
											'		<div class="row-1 text-right">' +
											'			<h4>代码：' + productCode + '</h4>' +
											'		</div>' +
											'	</div>' +
											'	<div class="ui layout li_lower">' +
											'		<div class="row-1">' +
											'			<em class="ared">' + orderQuantity + '</em>' +
											'			<p>赎回份数(份)</p>' +
											'		</div>' +	
											'		<div class="row-1">' +
											'			<em>' + createTime + '</em>' +
											'			<p>赎回日期</p>' +	
											'		</div>' +
											'		<div class="row-1">' +
											'			<em>' + totPrice + '</em>' +
											'			<p>总价值</p>' +
											'		</div>' +	
											'	</div>' +	
											'</li>' ;
					}
				}else{
					$(_pageId + ".no_data_box").show();
				}
				
				if(isAppendFlag){
					// 追加元素
					$(_pageId + "#tra_tab_1 ul").append(allfundShareStr);
				}else{
					// 替换元素
					$(_pageId + "#tra_tab_1 ul").html(allfundShareStr);
				}
				
				//初始化上线滑动加载
				pageScrollInit(recordLen);
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/**上下滑动刷新事件**/
	function pageScrollInit(recordLen){
		var containerTop = $(_pageId + "#v_container_orderList").offset().top;
		var containerHeight = $(window).height() - containerTop - 50;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false,
				"perRowHeight" : 82,
				"visibleHeight" : containerHeight, // 这个是中间数据的高度
				"container" : $(_pageId + " #v_container_orderList"),
				"wrapper" : $(_pageId + " #v_wrapper_orderList"),
				"downHandle" : function() {
					pageGlobal.curPage = 1;
					if(pageGlobal.nextFun == "1"){
						fundShare(false);
					}else if(pageGlobal.nextFun == "2"){
						redeem(false);
					}
					
				},
				"upHandle": function() {
					if(pageGlobal.curPage == pageGlobal.maxPage){
						return false;
					}
					if(pageGlobal.curPage < pageGlobal.maxPage){
						$(_pageId + ".visc_pullUp").show();
						
						pageGlobal.curPage += 1;
						if(pageGlobal.nextFun == "1"){
							fundShare(false);
						}else if(pageGlobal.nextFun == "2"){
							redeem(false);
						}
					}	
				},
				"wrapperObj" : null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(recordLen < 8 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var myFinancial = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myFinancial;
});