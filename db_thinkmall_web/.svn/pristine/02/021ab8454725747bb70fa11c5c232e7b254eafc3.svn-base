 /**
  * @author 汪卫中
  * 
  * 我的持仓、我的订单
  */
define('mall/scripts/index/stockShare', function(require, exports, module){ 
	var _pageId = "#index_stockShare ";
	var appUtils = require("appUtils"); // 核心工具类
	var assetService = require("assetService"); // 产品服务接口类
	var orderService = require("orderService"); // 订单服务接口类
	var commonExt = require("commonExt"); // 常用公共方法
	var stringUtils = require("stringUtils"); // 字符串工具类
	var dateUtils = require("dateUtils"); // 日期工具类
	var project = require("project"); // 字符串工具类
	var layer = require("layer"); // 自定义提示信息
	var constants = require("constants"); // 常量类
	var VIscroll = require("cusVIscroll"); // 自定义滑动组件
	var gconfig = require("gconfig"); // 全局配置
	var entrust_state_res={
			0:"买",
			1:"买",
			2:"卖"
	};
	var price_des={
			0:"+",
			1:"+",
			2:"-"
	};
	var pageGlobal = {
		"vIscroll" : {"scroll" : null, "_init" : false}, // 理财列表分页 -> 上下滑动对象
		"curPage" : 1, // 理财列表分页 -> 当前页码
		"maxPage" : 0, // 理财列表分页 -> 总页数
		"queryType" : 0, // 查询类型，0：查持仓，1：查订单
		"orderId" : "", // 订单ID
		"pdtSubType": ""
	}

	/**
	 * 初始化
	 */
	function init(){
		// 初始化页面元素
		initView(); 
		
		pageGlobal.pdtSubType = appUtils.getPageParam("pdtSubType")
		// 理财持仓
		tradeRecord(false, true);
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + "#homeBtn", function(){
			appUtils.pageInit("index/stockShare", "main/unifyMain", {});
		});
		
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
			/*$(_pageId + "#my_finan_box").hide();
			$(_pageId + "#my_finan_box").show();*/
		
		/*$(_pageId + "#my_finan_box").html("");
		$(_pageId + "#my_finan_box").html("");*/
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 begin**********/
	
	/**
	 * 初始化页面元素
	 */
	function initView(){
		
		// 初始化滚动到最上方
		if (pageGlobal.vIscroll.scroll) {
			pageGlobal.vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}
		
		$(_pageId + ".visc_pullUp_new").hide();
	}
	
	//查询理财持仓
	function tradeRecord(isAppend, isSysLoad){
		isSysLoad = isSysLoad ? isSysLoad : false;
		var ctrlParam = {
			"isShowWait" : isSysLoad, // 是否需要框架全局加载控件
			"isCusLoad" : true, // 自定加载样式
			"isCover" : true // 加载图标在右上角显示
		}
		
		var param = {
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"fund_account" : appUtils.getSStorageInfo("fund_account"),
				"page":pageGlobal.curPage,
				"numPerPage":"8"
		};
		
		var orderCallBack = function (data){
			$(_pageId + "#my_finan_box").html("");
			var results = commonExt.getReqResultList(data);
			var dataList = results.dataList;
			pageGlobal.maxPage = results.totalPages;
			var recordLen = dataList ? dataList.length : 0 // 当前结果记录条数
			if (recordLen > 0) {
				var orderListEleObj = $(_pageId + "#my_finan_box"); // 存放结果列表的容器对象
				var listHtml = ""; 
				for (var i = 0; i < dataList.length; i++) {
					var item = dataList[i];
					listHtml += getShareHtml(item);
				}
				
				// 判断是追加元素还是替换元素
				if(isAppend){
					orderListEleObj.append(listHtml);
				}else{
					orderListEleObj.html(listHtml);
				}
				
				// 初始化滚动事件
				pageScrollInit(recordLen); 
				
			/*	appUtils.bindEvent($(_pageId + "#my_finan_box .order_inner"),function(){
					var orderParam={
						"orderId" : $(this).attr("orderId")
					};
					$(_pageId + "#my_finan_box").show();
					appUtils.pageInit("account/myShare", "account/orderDetail", orderParam);
					return false;
				},'click');*/
			}
		}
		
		orderService.queryTradeRecord(param,orderCallBack,ctrlParam);
	}
	
	/**
	 * 根据结果组装html元素
	 */
	function getShareHtml(item){
		var pdtName = item.stock_name; // 产品名称
		var sumIncome = stringUtils.parseFloat(item.summary_income).toFixed(2); // 累计收益
		var shareAmount = stringUtils.parseFloat(item.market_value).toFixed(2); // 持有资产
		shareAmount = stringUtils.moneyFormat(shareAmount,2);
		var enable_amount = stringUtils.parseFloat(item.enable_amount).toFixed(2);
		enable_amount = stringUtils.moneyFormat(enable_amount,2);
		
		var hold_amount = stringUtils.parseFloat(item.hold_amount);
		//hold_amount = stringUtils.moneyFormat(hold_amount,2);
		
		var last_price = stringUtils.parseFloat(item.last_price).toFixed(2);
		last_price = stringUtils.moneyFormat(last_price,2);
		var pdtCode = item.stock_code; // 产品代码
		var pdtSubType = item.product_sub_type;//产品子类型
		var pdtId = item.product_id; // 产品ID
		var nClass = "";
		if (pdtSubType == constants.productSubType.FUND) {
			nClass = '基金';
		} else {
			nClass = '证券';
		}
		var itemHtml = 	'<div class="finance_inner mt10"  id="finance_inner_box"  pdtCode="'+pdtCode+'"  product_sub_type="' + pdtSubType + '">'+
							'<div class="title_box">'+
								'<h3><em>' + nClass + '</em>' + pdtName + '<span  style="font-size: 0.1rem;color: #999999;">(' + pdtCode + ')</span></h3>'+
							'</div>'+
							'<div class="my_earning">'+
								'<ul class="clearfix">'+
									'<li>'+
										'<strong>' + shareAmount + '</strong>'+
										'<p>持有资产(元)</p>'+
									'</li>'+
									'<li>'+
										'<strong>'+hold_amount+'</strong>'+
										'<p>股数(股)</p>'+
									'</li>'+
									'<li>'+
										'<strong class="redcol">'+last_price+'</strong>'+
										'<p>最新价(元)</p>'+
									'</li>'+
								'</ul>'+
							'</div>'+
						'</div>';
		return itemHtml;
	}
	
	/**
	 * 理财列表分页 -> 上下滑动刷新事件
	 */
	function pageScrollInit(recordLen){
		var cTop = $(_pageId + "#v_container_orderList").offset().top;
		var loadingHeight = $(_pageId + "#loadingBox").height();
		var cHeight = $(window).height() - cTop + loadingHeight;
		if(!pageGlobal.vIscroll._init) {
			var config = {
				"isPagingType": false,
				"visibleHeight": cHeight, //这个是中间数据的高度
				"container": $(_pageId + "#v_container_orderList"),
				"wrapper": $(_pageId + "#v_wrapper_orderList"),
				"downHandle": function() {
					pageGlobal.curPage = 1;
					tradeRecord(false,true);
				},
				"upHandle": function() {
					if(pageGlobal.curPage == pageGlobal.maxPage){
						setTimeout(function(){
							pageGlobal.vIscroll.scroll.refresh();
						}, 300);
						return false;
					}
					if(pageGlobal.curPage < pageGlobal.maxPage){
						pageGlobal.curPage += 1;
						tradeRecord(true,true);
					}	
				},
				"wrapperObj": null
			};
			pageGlobal.vIscroll.scroll = new VIscroll(config); //初始化
			pageGlobal.vIscroll._init = true;
		}else{
			pageGlobal.vIscroll.scroll.refresh();
		}
		
		if(recordLen < 8 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp_new").hide();
			if ($(_pageId + "#v_wrapper_orderList .visc_scroller").height() > $(_pageId + "#v_wrapper_orderList").height()) {
				$(_pageId + ".visc_no_data").show();
			} else {
				$(_pageId + ".visc_no_data").hide();
			}
		}else{
			$(_pageId + ".visc_no_data").hide();
			$(_pageId + ".visc_pullUp_new").show();
		}	
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 end**********/
	
	var myShare = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	
	// 暴露对外的接口
	module.exports = myShare;
});