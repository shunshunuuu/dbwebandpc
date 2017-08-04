 /**
  * @author 杜海丽
  * 
  * 交易明细
  */
define('mall/scripts/index/tradeDetail', function(require, exports, module){ 
	var _pageId = "#index_tradeDetail ";
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
			0:"-",
			1:"-",
			2:"+"
	};
	var money_des={
			1:"-",
			2:"+"
	};
	
	var pageGlobal = {
		"vIscroll" : {"scroll" : null, "_init" : false}, // 理财列表分页 -> 上下滑动对象
		"curPage" : 1, // 理财列表分页 -> 当前页码
		"maxPage" : 0, // 理财列表分页 -> 总页数
		"queryType" : 0, // 查询类型，0：查持仓，1：查订单
		"orderId" : "", // 订单ID
		"pdtSubType": "",
		"startDate":"",
		"endDate":""
	}

	/**
	 * 初始化
	 */
	function init(){
		// 初始化页面元素
		initView(); 
		//查询交易记录
		//tradeRecord();
		
		queryStockOrder(false);
		
	}
	
	/**
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		//返回首页
		appUtils.bindEvent($(_pageId + ".btn_home"), function(){
			appUtils.pageInit("index/tradeDetail", "main/unifyMain");
		});
		
		appUtils.bindEvent(_pageId, function(){
			$(_pageId + "#filterBox").children("a").removeClass("active");
			$(_pageId + ".dialog-overlay").hide();
			$(_pageId + "#filterBox .downlist").hide();
		});
		
		// 点击过滤条件 选择对应的过滤条件--收益优先、人气优先
		appUtils.bindEvent($(_pageId + "#filterBox").children("a"), function(e){
			e.stopPropagation();
			var index = $(_pageId + "#filterBox").children("a").index(this);
			$(this).addClass("active").siblings("a").removeClass();
			$(_pageId + "#filterBox .downlist").show().find("ul").eq(index).show().siblings("ul").hide();
			$(_pageId + ".dialog-overlay").show();
		});

		// 点击过滤条件 选择对应的过滤条件
		appUtils.bindEvent(_pageId + ".downlist ul li", function(e){
			e.stopPropagation();
			if ($(this).find("a").hasClass("active")) {
				return;
			}
			$(this).find("a").addClass("active");
			$(this).siblings("li").find("a").removeClass("active");
			var ulIndex = $(_pageId + ".downlist ul").index($(this).parent());
			
			// 把当前选中的过滤条件赋值到对应类别中
			$(_pageId + "#filterBox").children("a").eq(ulIndex).attr("data-val", $(this).find("a").attr("data-val"))
											 .html($(this).find("a").html() + "<em></em>");
			$(_pageId + "#filterBox").children("a").removeClass("active");
			$(_pageId + ".dialog-overlay").hide();
			$(_pageId + "#filterBox .downlist").hide();
			if($(this).find("a").hasClass("active")){
				$(_pageId + ".visc_pullUp_new").hide();
				var active_val = $(this).find("a").html();
				switch(active_val){
				case "证券":
					queryStockOrder(false);
					break;
				case "理财":
					queryFinanOrder(false);
					break;
				case "转账流水":
					queryBankTransOrder(false);
					break;
				case "全部分类":
					$(_pageId + ".assets_box").html("");
					layer.iMsg("请选择一种类型");
					break;
				case "全部产品":
					layer.iMsg("请选择类型");
					break;
				case "1-3月":
					pageGlobal.startDate = "20160101";
					pageGlobal.endDate = "20160331";
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
						return false;
					}
					break;
				case "4-6月":
					pageGlobal.startDate = "20160401";
					pageGlobal.endDate = "20160630";
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
						return false;
					}
					
					break;
				case "7-9月":
					pageGlobal.startDate = "20160701";
					pageGlobal.endDate = "20160930";
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
						return false;
					}
					break;
				case "10-12月":
					pageGlobal.startDate = "20161001";
					pageGlobal.endDate = "20161231";
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
						return false;
					}
					break;
				case "所有月份":
					pageGlobal.startDate = "";
					pageGlobal.endDate = "";
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
						return false;
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
						return false;
					}
					break;
				};
			}
			//
		});
	}
	
	/**
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + ".assets_box").html("");
		$(_pageId + "a").removeClass("active");
		$(_pageId + "#filterBox a:eq(0)").html("请选择查询类别<em></em>");
		$(_pageId + "#filterBox a:eq(1)").html("所有月份<em></em>");
		$(_pageId + ".dialog-overlay").hide();
		$(_pageId + "#filterBox .downlist").hide();
		pageGlobal.startDate = "";
		pageGlobal.endDate = "";
	}
	
	/**********提示：所有自定义方法全部写到框架公共方法后面 begin**********/
	
	/**
	 * 初始化页面元素
	 */
	function initView(){
		// 页面参数中指定是订单时，初始化查订单列表，否则查持仓
		var isOrder = appUtils.getPageParam("isOrder");
		if (isOrder) {
			pageGlobal.queryType = 1;
			$(_pageId + ".tab_inner a").eq(1).addClass("active").siblings("a").removeClass("active");
			$(_pageId + "#finan_order_box").show();
			$(_pageId + "#my_finan_box").hide();
		} else {
			pageGlobal.queryType = 0;
			$(_pageId + ".tab_inner a").eq(0).addClass("active").siblings("a").removeClass("active");
		}
		
		
		// 初始化滚动到最上方
		if (pageGlobal.vIscroll.scroll) {
			pageGlobal.vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}
		
		$(_pageId + ".visc_pullUp_new").hide();
	}
	
	
	
	/**
	 * 根据结果组装html元素
	 */
	function getOrderHtml(item){
		var pdtName = item.product_name; // 产品名称
		var orderId = item.order_id; // 产品名称
		var pdtCode = item.product_code; // 产品代码
		var pdtId = item.product_id; // 产品代码
		var totPrice = item.tot_price; // 总价格
		var updateTime = dateUtils.dateFormat(item.update_time, "yyyy-MM-dd hh:mm:ss"); // 更新时间
		var pdtStatusDesc = project.orderState(item.order_state); // 订单状态
		var operatingType = item.operating_type; // 操作类型
		var entrustState = item.business_type;//委托方式-买-卖
		var orderState = item.order_state;
		
		// 订单状态为待支付、失败、委托失败时字体颜色变红
		var redArr = ["1", "2", "8", "9"]; 
		var stateClass = "";
		if (redArr.indexOf(orderState) != -1) {
			stateClass = "orangecol";
		} else if (orderState == "2" || orderState == "8") {
			stateClass = "blackcol";
		}
		
		var busType = item.business_type;
		var priceLabel = "购买金额(元)";
		if (busType == constants.orderBusinessType.redemption) {
			priceLabel = "赎回份额(份)";
		}
		
		var itemHtml = '<div class="transaction_box"  orderId ='+orderId+'  >'+
						'<dl>';
						if(entrustState=="2"){
							itemHtml+='<dt class="type_01">'+entrust_state_res[entrustState] +'</dt>';
						}
						else{
							itemHtml+='<dt class="type_02">'+entrust_state_res[entrustState] +'</dt>';
						}
						itemHtml+='<dd>'+
					'<strong>'+pdtName+'<span>('+pdtCode+')</span></strong>'+
							'<p>'+updateTime+'</p>';
						if(entrustState=="2"){
							itemHtml+='<em class="redcol">'+price_des[entrustState] + stringUtils.moneyFormat(totPrice,2) +'</em>';
						}	
						else{
							itemHtml+='<em class="greencol">'+price_des[entrustState] + stringUtils.moneyFormat(totPrice,2) +'</em>';
						}
						itemHtml+='</dd>'+
								'</dl>'+
								'<li>'+
							'</div>';
		
		return itemHtml;
	}
	
	/**
	 * 根据结果组装html元素
	 */
	function getStockHtml(item){
		var pdtName = item.stock_name; // 产品名称
		var pdtCode = item.stock_code; // 产品代码
		var entrustState = item.entrust_bs;//委托方式-买-卖
		var totPrice = item.entrust_price; // 总价格
		var entrustAmount = item.entrust_amount; // 总价格
		entrustAmount= Number(entrustAmount).toFixed(2);
		totPrice = Number(totPrice).toFixed(2);
		var entrust_date = item.entrust_date;
		var y = entrust_date.substring(0,4);
		var mon = entrust_date.substring(4,6);
		var d = entrust_date.substring(6,8);
		var entrust_time = item.entrust_time;
		var h = entrust_time.substring(0,2);
		var m = entrust_time.substring(2,4);
		var s = entrust_time.substring(4,6);
		var time = y+'-'+mon+'-'+d+'&nbsp;'+h+':'+m+':'+s;
		
		var busType = item.business_type;
		var priceLabel = "购买金额(元)";
		if (busType == constants.orderBusinessType.redemption) {
			priceLabel = "赎回份额(份)";
		}
		var itemHtml = '<div class="transaction_box"  >'+
						'<dl>';
						if(entrustState=="1"){
							itemHtml+='<dt class="type_02">'+entrust_state_res[entrustState] +'</dt>';
						}
						else{
							itemHtml+='<dt  class="type_01">'+entrust_state_res[entrustState] +'</dt>';
						}
						itemHtml+='<dd>'+
					'<strong>'+pdtName+'<span>('+pdtCode+')</span></strong>'+
							'<p>'+time+'</p>';
						if(entrustState=="1"){
							itemHtml+='<em class="greencol">'+money_des[entrustState] + stringUtils.moneyFormat(totPrice*entrustAmount,2) +'</em>';
						}	
						else{
							itemHtml+='<em class="redcol">'+money_des[entrustState] + stringUtils.moneyFormat(totPrice*entrustAmount,2) +'</em>';
						}
						itemHtml+='</dd>'+
								'</dl>'+
								'<li>'+
							'</div>';
		
		return itemHtml;
	}
	
	/**
	 * 根据结果组装html元素
	 */
	function getBankHtml(item){
		var trans_type = item.trans_type; // 转账方向
		var fund_amount = item.fund_amount; // 转账金额
		fund_amount = stringUtils.moneyFormat(fund_amount,2);
		var trans_date = item.trans_date;
		var trans_time = item.trans_time;
		var stateClass = "";
		var tranName = "";
		var flag = "";
		if (trans_type == constants.transType.BANKTOSTOCK) {
			tranName = "转入";
			stateClass = "redcol";
			flag = "+";
			
		} else if (trans_type == constants.transType.STOCKTOBANK) {
				tranName = "转出";
				stateClass = "greencol";
				flag = "-";
		}
		
		var itemHtml = '<div class="transaction_box"  >'+
								'<dl>'+
								'<dt class="type_03">转</dt>'+
								'<dd>'+
								'<strong>'+tranName+'</strong>'+
								'<p>'+trans_date+"&nbsp;&nbsp;"+trans_time+'</p>'+
								'<em class='+stateClass+'>'+flag+fund_amount+'</em>'+
								'</dd>'+
								'</dl>'+
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
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
						queryStockOrder(false);
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
						queryFinanOrder(false);
					}
					if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
						queryBankTransOrder(false);
					}
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
						if($(_pageId + "#filterBox a:eq(0)").html().indexOf("证券") != -1){
							queryStockOrder(true);
						}
						if($(_pageId + "#filterBox a:eq(0)").html().indexOf("理财") != -1){
							queryFinanOrder(true);
						}
						if($(_pageId + "#filterBox a:eq(0)").html().indexOf("转账流水") != -1){
							queryBankTransOrder(true);
						}
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
	
	//理财订单
	function queryFinanOrder(isAppend){
		var param = {
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"curPage" : pageGlobal.curPage,
				"start_time":pageGlobal.startDate,
				"end_time": pageGlobal.endDate,
				"product_sub_type" :'',//constants.productSubType.FINAN,
//				"order_type" : orderType,
				"numPerPage" : 8
		};
		orderService.queryFinancialOrder(param,function (data){
			$(_pageId + ".assets_box").html("");
			var results = commonExt.getReqResultList(data);
			var dataList = results.dataList;
			pageGlobal.maxPage = results.totalPages;
			var recordLen = dataList ? dataList.length : 0 // 当前结果记录条数
			if (recordLen > 0) {
				var orderListEleObj = $(_pageId + ".assets_box"); // 存放结果列表的容器对象
				var listHtml = ""; 
				for (var i = 0; i < dataList.length; i++) {
					var item = dataList[i];
					listHtml += getOrderHtml(item);
				}
				
				// 判断是追加元素还是替换元素
				if(isAppend){
					orderListEleObj.append(listHtml);
				}else{
					orderListEleObj.html(listHtml);
				}
				$(_pageId + ".assets_box").show();
				// 初始化滚动事件
				pageScrollInit(recordLen); 
				
				appUtils.bindEvent($(_pageId + ".assets_box .transaction_box"),function(){
					var this_val = $(_pageId + "#filterBox").children("a").html();
					if(this_val.indexOf("理财") != -1){
						var orderParam={
							"orderId" : $(this).attr("orderId")
						};
						appUtils.pageInit("index/tradeDetail", "account/orderDetail", orderParam);
						return false;
					}
				},'click');
			}
			else{
				layer.iMsg("暂无交易记录");
			}
		});
	}
	
	//证券委托
	function queryStockOrder(isAppend){
		var param = {
				"user_id" : appUtils.getSStorageInfo("user_id"),
				"fund_account" : appUtils.getSStorageInfo("fund_account"),
				"start_date" :pageGlobal.startDate,
				"end_date" : pageGlobal.endDate,
				"page":pageGlobal.curPage,
				"numPerPage" : 8
		};
		orderService.queryStockRecord(param,function (data){
			$(_pageId + ".assets_box").html("");
			var results = commonExt.getReqResultList(data);
			var dataList = results.dataList;
			pageGlobal.maxPage = results.totalPages;
			var recordLen = dataList ? dataList.length : 0 // 当前结果记录条数
			if (recordLen > 0) {
				var orderListEleObj = $(_pageId + ".assets_box"); // 存放结果列表的容器对象
				var listHtml = ""; 
				for (var i = 0; i < dataList.length; i++) {
					var item = dataList[i];
					listHtml += getStockHtml(item);
				}
				
				// 判断是追加元素还是替换元素
				if(isAppend){
					orderListEleObj.append(listHtml);
				}else{
					orderListEleObj.html(listHtml);
				}
				$(_pageId + ".assets_box").show();
				// 初始化滚动事件
				pageScrollInit(recordLen); 
				
				/*appUtils.bindEvent($(_pageId + ".assets_box .transaction_box"),function(){
					var this_val = $(_pageId + "#filterBox").children("a").html();
					if(this_val.indexOf("理财") != -1){
						var orderParam={
							"orderId" : $(this).attr("orderId")
						};
						appUtils.pageInit("index/tradeDetail", "account/orderDetail", orderParam);
						return false;
					}
				},'click');*/
			}
			else{
				layer.iMsg("暂无交易记录");
			}
		});
	}
	
	//银证转账流水
		function queryBankTransOrder(isAppend){
			var param = {
					"user_id" : appUtils.getSStorageInfo("user_id"),
					"fund_account" : appUtils.getSStorageInfo("fund_account"),
					"start_date" :pageGlobal.startDate,
					"end_date" : pageGlobal.endDate,
					"entrust_status" : constants.entrustStatus.SUCCESS,
					"page":pageGlobal.curPage,
					"numPerPage" : 20
			};
			 assetService.queryTransRecords(param,function (data){
				$(_pageId + ".assets_box").html("");
				var results = commonExt.getReqResultList(data);
				var dataList = results.dataList;
				pageGlobal.maxPage = results.totalPages;
				var recordLen = dataList ? dataList.length : 0 // 当前结果记录条数
				if (recordLen > 0) {
					var orderListEleObj = $(_pageId + ".assets_box"); // 存放结果列表的容器对象
					var listHtml = ""; 
					for (var i = 0; i < dataList.length; i++) {
						var item = dataList[i];
						listHtml += getBankHtml(item);
					}
					
					// 判断是追加元素还是替换元素
					if(isAppend){
						orderListEleObj.append(listHtml);
					}else{
						orderListEleObj.html(listHtml);
					}
					$(_pageId + ".assets_box").show();
					// 初始化滚动事件
					pageScrollInit(recordLen); 
					
				}
				else{
					layer.iMsg("暂无交易记录");
				}
			});
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