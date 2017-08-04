 /**
  * 我的订单
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_myOrder "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var KeyPanel = require("keyPanel"); // 键盘插件 
	var myKeyPanel = new KeyPanel(); 
	var VIscroll = require("vIscroll"); // 滑动组件
	var vIscroll = {"scroll" : null, "_init" : false}; // 上下滑动对象
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"pay_mode" : "", // 支付方式
		"maxPage" : 0, // 最大页数
		"param" : {}, // 查询对象
		"historyDates" : [], // 记录查询结果中的历史日期 
		"orderType" : "", // 订单类型
		"historyYear" : "", //记录前一个查询的年份
		"orderNum" : "", //默认不传，表示查询所有订单，否则只查询成功订单 
		"orderSuc" : false  //记录定投查询的是所有订单还是成功订单，false表示查询成功
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		initParam();
		initMyorderView();
		cleanQueryParam(); // 清空查询条件
		initView();
		
		// 初始化页面时定位滚动元素到第一个
		if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, 0);
		}
	}
	
	/*
	 * 初始化选择页面
	 */
	function initView(){
		pageGlobal.orderType = "1";
		var _pageCode = appUtils.getPageParam("_pageCode");
		var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
		// 移除所有tab act样式
		tabRowEles.find("a").removeClass("active");
		if(_pageCode == "place"){
			pageGlobal.orderType = "2";
			tabRowEles.find("a").eq(1).addClass("active");
			$(_pageId + " .month_list").hide();
			$(_pageId + " #dateBtn").hide();
			$(_pageId + " #fund_place").show();
			$(_pageId + " #footerBtn").show();
			$(_pageId + " #allOrders").show();
			pageGlobal=false;
			queryFundPlaceManage();
		}else{
			// 设置当前tab act样式
			tabRowEles.find("a").eq(0).addClass("active");
			$(_pageId + " .month_list").show();
			$(_pageId + " #dateBtn").show();
			$(_pageId + " #fund_place").hide();
			$(_pageId + " #footerBtn").hide();
			$(_pageId + " #allOrders").hide();
			queryFinancialOrder();
		}
	}
	
	/*
	 * 初始化我的订单界面
	 */
	function initMyorderView(){

		var curDate = new Date();
		
		// 赋值本年年份
		$(_pageId + "#yearValue").val(curDate.getFullYear());
		pageGlobal.historyYear = curDate.getFullYear();
		
		// 先清空所有月份act样式
		$(_pageId + "#dateList ul").find("a").removeClass("act");
		
		// 激活本月样式
		var curMonth = curDate.getMonth();
		$(_pageId + "#dateList ul").children().eq(curMonth).find("a").addClass("act");
		
		
		// 隐藏日期控件
		$(_pageId + "#dateList").hide();
		
	}
	
	/*
	 * 金融产品订单查询 1000122
	 */
	function queryFinancialOrder(){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		//var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var containerTop = $(_pageId + "#v_container_orderList").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		var param = {
				"user_id" : common.getUserId(),
				"start_time" : pageGlobal.param.start_date,
				"end_time" : pageGlobal.param.end_date,
				"page" : pageGlobal.curPage,
				"numPerPage" : "8"
		};
		
		service.queryFinancialOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				//处理返回结果
				groupQueryResult(results);
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 定投管理
	 */
	function queryFundPlaceManage(){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		// 第一页时清空列表
		initParam();
		
		var containerTop = $(_pageId + "#v_container_orderList").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		
		//var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var param = {
				"user_id" : common.getUserId(),
				"page" : pageGlobal.curPage,
				"numPerPage" : "8"
				
		};
		
		service.queryFundPlaceList(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				var placeManage = $(_pageId + "#fund_place");
				if(recordLen && recordLen > 0){
					$(_pageId + "#v_container_orderList").show();
					$(_pageId + ".no_data_box").hide();
					for (var i = 0; i < results.length; i++) {
						var item = results[i];
						var productName = item.product_name + '（' + item.product_code + '）';
						var agreement_status = item.agreement_status; // 定投协议状态（0：终止，1：启用，2：暂停）
						var first_trade_y_m_mall = item.first_trade_y_m_mall.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
						var expiry_date = item.expiry_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
						var btn = ""; // 无操作
						if(agreement_status && agreement_status == '1'){
							var btn = '<a href="javascript:void(0)" class="cancel">取消定投</a><a href="javascript:void(0)" class="exchanges">修改定投</a>';
							
							var fundPlace = '<div class="invest_order_info mt10">' +
							'	<div class="invest_info_tit">' +
							'		<h3 style="float: left;">'+ productName +'</h3>' +
							'		<p style="text-align: right;">'+ putils.agreementStatus(agreement_status) +'</p>' +
							'	</div>' +
							'	<div class="invest_info_con">' +
							'		<ul class="info_list clearfix">' +
							'			<li>定投周期:<span class="ablue" style=" color: #0081E2 !important;">每月/'+ item.trade_date +'号</span></li>' +
							'			<li>开始日期:<span>'+ first_trade_y_m_mall +'</span></li>' +
							'			<li>每期定期金额：<span>'+ item.trade_money +'元</span></li>' +
							'			<li>截止日期: <span>'+ expiry_date +'</span></li>' +
							'		</ul>' +
							'		<div class="ui layout info_btn">' +
							'			<p class="row-1">'+ item.update_time +'</p>' +
							'			<div class="info_btn_con" error_msg="'+ item.error_msg +'" agreement_status="'+ agreement_status +'" create_time="'+ item.create_time +'" trade_date="'+ item.trade_date +'" expiry_date="'+ expiry_date +'" first_trade_y_m_mall="'+ first_trade_y_m_mall +'" trade_money="' + item.trade_money + '" productCode="'+ item.product_code +'" fixed_id="'+ item.fixed_id +'" apply_no="' + item.apply_no + '">' +
							'				'+ btn +'' +
							'			</div>' +
							'		</div>' +
							'	</div>' +
							'</div>' ;
							placeManage.append(fundPlace);
						}
					}
					pageScrollInit(recordLen);
					
					// 取消定投
					appUtils.bindEvent(_pageId + ".cancel", function(e){
						e.stopPropagation();
						var cur = $(this);
						layerUtils.iConfirm("确定要取消定投吗？",function(){
							// 确定取消定投
							var productCode = cur.parent("div.info_btn_con").attr("productCode");
							var apply_no = cur.parent("div.info_btn_con").attr("apply_no");
							var fixed_id = cur.parent("div.info_btn_con").attr("fixed_id");
							cancelFundPlace(apply_no,fixed_id,productCode);
						}, function(){});
					},"click");
					
					// 订单详情
					appUtils.bindEvent(_pageId + ".invest_order_info", function(e){
						e.stopPropagation();
						var productCode = $(this).find("div.info_btn_con").attr("productCode");
						var apply_no = $(this).find("div.info_btn_con").attr("apply_no");
						var fixed_id = $(this).find("div.info_btn_con").attr("fixed_id");
						var trade_money = $(this).find("div.info_btn_con").attr("trade_money");
						var first_trade_y_m_mall = $(this).find("div.info_btn_con").attr("first_trade_y_m_mall");
						var expiry_date = $(this).find("div.info_btn_con").attr("expiry_date");
						var trade_date = $(this).find("div.info_btn_con").attr("trade_date");
						var agreement_status = $(this).find("div.info_btn_con").attr("agreement_status");
						var create_time = $(this).find("div.info_btn_con").attr("create_time");
						var error_msg = $(this).find("div.info_btn_con").attr("error_msg");
						
						$(_pageId + "#orderId").html(fixed_id);
						$(_pageId + "#price").html(trade_money);
						$(_pageId + "#time").html(create_time);
						$(_pageId + "#productCode").html(productCode);
						if(agreement_status && agreement_status  == "4"){
							$(_pageId + "#orderState").html(error_msg);
						}else{
							$(_pageId + "#orderState").html(putils.agreementStatus(agreement_status));
						}
						$(_pageId + "#window_two").show();
					},"click");
					
					// 修改定投
					appUtils.bindEvent(_pageId + ".exchanges", function(e){
						e.stopPropagation();
						var productCode = $(this).parent("div.info_btn_con").attr("productCode");
						var apply_no = $(this).parent("div.info_btn_con").attr("apply_no");
						var fixed_id = $(this).parent("div.info_btn_con").attr("fixed_id");
						var trade_money = $(this).parent("div.info_btn_con").attr("trade_money");
						var first_trade_y_m_mall = $(this).parent("div.info_btn_con").attr("first_trade_y_m_mall");
						var expiry_date = $(this).parent("div.info_btn_con").attr("expiry_date");
						var trade_date = $(this).parent("div.info_btn_con").attr("trade_date");
						var param = {
							"productCode" : productCode,
							"fixed_id" : fixed_id,
							"apply_no" : apply_no,
							"trade_money" : trade_money,
							"first_trade_y_m_mall" : first_trade_y_m_mall,
							"trade_date" : trade_date,
							"expiry_date" : expiry_date
						}
						appUtils.pageInit("account/myOrder", "finan/fixedInvestment/updatePlaceOrder", param);
					},"click");
				}else{
						$(_pageId + "#v_container_orderList").hide();
						$(_pageId + ".no_data_box").show();
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
		/**
		 * 取消定投
		 */
		function cancelFundPlace(apply_no,fixed_id,productCode){
			var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
			var external_account = JSON.parse(userInfo).fund_account; // 获取资金账号
			var param = {
					"user_id" : common.getUserId(),
					"apply_no" : apply_no,
					"fixed_id" : fixed_id,
					"operator_type" : "0",
					"product_code" : productCode,
					"trade_account" : external_account,
			};
			service.updateFundPlace(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if(error_no == "0"){
					var result = data.results[0];
					queryFundPlaceManage();
					layerUtils.iMsg(-1,"取消定投成功！");
					
				}else{
					layerUtils.iMsg(-1,error_info);
					return false;
				}
			});
		}
	
	/**
	 * 金融产品订单撤销（撤单）   1000119   
	 */
	function undoOrder(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var trade_pwd = "";
		if (backParam) {
			trade_pwd = backParam.pwd1;
		}
		var param = {
				"user_id" : common.getUserId(),
				"order_id" : order_id,
				"trade_pwd" : trade_pwd
		};
		
		service.undoOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				cleanQueryParam(); // 清空日期数组 
				queryFinancialOrder(); // 查询订单
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/**
	 * 金融产品订单取消   1000108   
	 */
	function cancelOrder(order_id){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var param = {
				"user_id" : common.getUserId(),
				"order_id" : order_id
		};
		
		service.cancelOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				layerUtils.iMsg(-1,"取消成功！");
				cleanQueryParam(); // 清空日期数组  
				queryFinancialOrder(); // 查询订单
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/*
	 * 理财支付
	 */
	function finanOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.finanOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 基金支付
	 */
	function fundOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.fundOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id; // 订单ID
				var productName = item.product_name; // 产品名称
				var productCode = item.product_code; // 产品编号
				var totPrice = item.tot_price; // 订单价格
				productName = putils.delProSpecialStr(productName);
				var param = {
					"order_id" : order_id,
					"product_name" : productName + "(" + productCode + ")",
					"tot_price" : totPrice
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * OTC 支付
	 */
	function otcOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.otcOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 把结果按照日期分组
	 */
	function groupQueryResult(result){
		// 保存最终分组后的对象，key为时间段，value为记录对象 
		// 最终数据形式如：{"2015-01" :[obj,obj,...], "2015-02" : [obj,obj,...]}
		var group = {}; 
		
		 // 时间段数组: ["2015-01","2015-02","2015-03",...]
		var dates = [];
		
		// 把记录中同一月份的时间保存到数组中。
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			var trans_date = item.update_time;
			if (trans_date.length > 7) {
				trans_date = trans_date.substring(0, trans_date.lastIndexOf("-"));
			} else {
				trans_date = "-";
			}
			if ($.inArray(trans_date, dates) == -1) {
				dates.push(trans_date);
			}
		}
		
		// 按照时间段分组
		for (var i = 0; i < dates.length; i++) {
			group[dates[i]] = [];
			for (var j = 0; j < result.length; j++) {
				var item = result[j];
				var trans_date = item.update_time;
				if (trans_date.length > 7) {
					trans_date = trans_date.substring(0, trans_date.lastIndexOf("-"));
				} else {
					trans_date = "-";
				}
				if (trans_date == dates[i]) {
					group[dates[i]].push(item);
				}
			}
		}
		
		// 填充数据到页面
		fillQueryResult(group, dates, result.length);
	}
	
	/**
	 * 按照日期段填充流水列表
	 * @group {"2015-01" :[obj,obj,...], "2015-02" : [obj,obj,...]}
	 * @dates ["2015-01","2015-02","2015-03",...]
	 */
	function fillQueryResult(group, dates, resultDataLen){
		// 第一页时清空列表
		initParam();
		
		var myOrderListEle = $(_pageId + ".month_list");
		if (dates && dates.length == 0) {
			$(_pageId + "#v_container_orderList").hide();
			$(_pageId + ".no_data_box").show();
			return;
		} else {
			$(_pageId + "#v_container_orderList").show();
			$(_pageId + ".no_data_box").hide();
		}
		for (var i = 0; i < dates.length; i++) {
			var date = dates[i]; // 时间段
			var datasItem = group[date]; // 对应月份的数据集
			
			if (pageGlobal.historyDates.indexOf(date) == -1) {
				// 如果历史时间数组中没有当前日期，需要在页面上追加对应月份的头部html
				var dateYear = date.substring(0, 4); // 年份
				var dateMonth = parseInt(date.substring(5, 7)); // 月份
				
				// 用于显示的日期，如果与今年年份相等，只显示月份，否则显示年月
				var dateStr = dateYear + "年" + dateMonth + "月"; 
				if (dateYear == new Date().getFullYear()) {
					dateStr = dateMonth + "月";
				}
				var dateItemHtml =  '	<h3>' + dateStr + '</h3>'+
									'	<ul id="monthList_' + date.replace("-", "_") + '">'+
									'	</ul>';
				myOrderListEle.append(dateItemHtml);
				
				// 把当前日期更新到历史日期数组中
				pageGlobal.historyDates.push(date);
			} 
			
			var monthListEle = $(_pageId + ".month_list #monthList_" + date.replace("-", "_"));
			var datasItem = group[date]; // 对应月份的数据集
			
			for (var j = 0; j < datasItem.length; j++) {
				var item = datasItem[j];
				var productAbbr = item.product_name; // 产品名称
				productAbbr = putils.delProSpecialStr(productAbbr);
				if (productAbbr.length > 8) {
					productAbbr = productAbbr.substring(0, 8) + "...";
				}

				var productTypes = item.product_type; // 产品类型 0基金 1理财
				var fina_belongs = item.fina_belongs; // OTC
				if (productTypes == 0) {
					productType = "基金";
				} else if (productTypes == 1) {
					if (fina_belongs == "5"){
						productType = "OTC";
					}else{
						productType = "理财";
					}
				}
				
				var orderId = item.order_id; // 订单号
				var productId = item.product_id; // 产品ID
				var orderState = item.order_state; // 订单状态
				var updateTime = item.update_time; // 更新时间
				var totPrice = common.fmoney(item.tot_price,2); // 订单价格
				var businessType = item.business_type; // 业务类型，0认购;1申购;2赎回;3买入;4卖出;5产品登记
				switch (businessType) {
				case "0":
					var businessType_style = "subscription";
					break;
					
				case "1":
					var businessType_style = "prchase";
					break;
					
				case "2":
					var businessType_style = "redemption";
					break;

				default:
					var businessType_style = "subscription";
					break;
				}
				var businessTypeName = putils.tradeBusinessType(businessType); // 根据业务类型枚举值获取描述信息
				var operating_type = item.operating_type; // 操作类型，0无操作;3可撤销;12支付/取消
				switch (operating_type) {
				case "0":
					operating_no = "display:none;";
					break;
					
				case "3":
					operating_no = "";
					break;

				default:
					operating_no = "display:none;";
					break;
				}
				var operating_typeName = putils.tradeOperating_type(operating_type); // 根据操作类型枚举值获取描述信息
				/*订单操作类型有两个按钮    支付     取消  */
				if(operating_type == "12"){
					var buy = operating_typeName.substring(0,2);
					var cancel = operating_typeName.substring(3,5);
					var allOrderStr = '<li order_id="' + orderId + '">' + 
					'	<div class="clearfix">' + 
					'		<div class="row_fl">' + 
					'			<h4>' + productAbbr + '<span class="label_icon ' + businessType_style + '">' + businessTypeName + '</span></h4>' + 
					'			<p>' + updateTime  +' '+ common.getOrderStateName(orderState) + '</p>' + 
					'		</div>' + 
					'		<div class="row_fr">' + 
					'			<h4 class="text-right ared">' + totPrice + '</h4>' + 
					'           <div class="row_fr_btn">'+
					'			    <a href="javascript:void(0);" class="withdrawals cancelOrder" order_id="' + orderId + '">' + cancel + '</a>' + 
					'               <a href="javascript:void(0);" fina_belongs = "' + fina_belongs + '" productType = "' + productTypes + '" operating_type = "' + operating_type + '" tot_price_order= "' + totPrice + '" order_id="' + orderId + '" class="pay_btn buyOrder">' + buy + '</a>'+
					'		    </div>' + 
					'		</div>' + 
					'	</div>' + 
					'	<i class="tag_icon"><span>' + productType + '</span></i>' + 
					'</li>';
				}else{
					var allOrderStr = '<li order_id="' + orderId + '">' + 
					'	<div class="clearfix">' + 
					'		<div class="row_fl">' + 
					'			<h4>' + productAbbr + '<span class="label_icon ' + businessType_style + '">' + businessTypeName + '</span></h4>' + 
					'			<p>' + updateTime  +' '+ common.getOrderStateName(orderState) + '</p>' + 
					'		</div>' + 
					'		<div class="row_fr">' + 
					'			<h4 class="text-right ared">' + totPrice + '</h4>' + 
					'           <div class="row_fr_btn">'+
					'			    <a href="javascript:void(0);" style="' + operating_no + '" fina_belongs = "' + fina_belongs + '" productType = "' + productTypes + '" operating_type = "' + operating_type + '" tot_price_order= "' + totPrice + '" order_id="' + orderId + '" class="withdrawals operating_btn">' + operating_typeName + '</a>' + 
					'		    </div>' + 
					'		</div>' + 
					'	</div>' + 
					'	<i class="tag_icon"><span>' + productType + '</span></i>' + 
					'</li>';
				}

				monthListEle.append(allOrderStr);
				
				//点击撤单/不可操作按钮
				appUtils.bindEvent($(_pageId+" .month_list .operating_btn"),  function(e) {
					e.stopPropagation();
					order_id = $(this).attr("order_id");
					var tot_price_order = $(this).attr("tot_price_order");
					var operating_type = $(this).attr("operating_type");
					var productType = $(this).attr("productType");
					var fina_belongs = $(this).attr("fina_belongs");
					switch (operating_type) {
					case "0":
						layerUtils.iMsg(-1, "订单不可操作");
						break;
						
					case "3":
						$(_pageId + "#isBuy").html("确定撤单！");
						$(_pageId + "#top_price_value").html("¥"+tot_price_order);
						$(_pageId + "#trade_pwd").attr("order_id",order_id);
						$(_pageId + "#trade_pwd").attr("operating_type",operating_type); // 操作类型，0无操作;3可撤销;12可支付可取消
						$(_pageId + "#trade_pwd").attr("productType",productType); // 0-基金   1-理财
						$(_pageId + "#trade_pwd").attr("fina_belongs",fina_belongs); // OTC 
						
						// 资金账号登录时 无需输入密码
						if (isFundAccountLogin()) {
							layerUtils.iConfirm("您确定要撤单吗？",function(){	
								undoOrder(false);
							},function(){
								return;
							});
						} else {
							$(_pageId + "#order_buy").show(); // 显示输入交易密码弹框
						}
						break;

					default:
						break;
					}
				}, 'click');
				
				
				//取消订单
				appUtils.bindEvent($(_pageId+" .month_list .cancelOrder"), function(e) {
					e.stopPropagation();
					var order_id = $(this).attr("order_id");
					layerUtils.iConfirm("您确定要取消订单吗？",function(){	
						cancelOrder(order_id);
					},function(){
						return;
					});
					
				}, 'click');
				
				//支付订单
				appUtils.bindEvent($(_pageId+" .month_list .buyOrder"), function(e) {
					e.stopPropagation();
					var order_id = $(this).attr("order_id");
					var tot_price_order = $(this).attr("tot_price_order");
					var operating_type = $(this).attr("operating_type");
					var productType = $(this).attr("productType");
					var fina_belongs = $(this).attr("fina_belongs");
					$(_pageId + "#isBuy").html("确定支付");
					$(_pageId + "#top_price_value").html("¥"+tot_price_order);
					$(_pageId + "#trade_pwd").attr("order_id",order_id);
					$(_pageId + "#trade_pwd").attr("operating_type",operating_type); // 操作类型，0无操作;3可撤销;12可支付可取消
					$(_pageId + "#trade_pwd").attr("productType",productType); // 0-基金   1-理财
					$(_pageId + "#trade_pwd").attr("fina_belongs",fina_belongs); // OTC 
					
					
					// 资金账号登录时 无需输入密码
					if (isFundAccountLogin()) {
						if(operating_type == "12"){
							if (productType == 0) {
								// 基金支付
								fundOrderPayment(false);
							} else if (productType == 1) {
								if(fina_belongs == "5"){//OTC订单
									// OTC 购买
									otcOrderPayment(false);
								}else{
									// 理财支付
									finanOrderPayment(false);
								}

							}
			        	}
					} else {
						$(_pageId + "#order_buy").show(); // 显示输入交易密码弹框
					}
					
				}, 'click');
				
			}
		}
		
		pageScrollInit(resultDataLen);
		// 点击 订单进入详情
		appUtils.bindEvent($(_pageId + ".month_list li"), function(){
			var orderId = $(this).attr("order_id");
			appUtils.pageInit("account/myOrder", "account/orderDetail", {"order_id" : orderId});
		}, 'click');
		
	}
	
	// 判断是否是资金账号登录
	function isFundAccountLogin(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		if (userInfo) {
			var isFundAccountLogin = JSON.parse(userInfo).is_fund_account_login;
			if (isFundAccountLogin == "1") {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 如果curPage = 1 则清空列表同时清空日期数组
	 */
	function initParam(){
		if (pageGlobal.curPage == 1) {
			$(_pageId + ".month_list").empty(); // 清空页面列表
			$(_pageId + "#fund_place").empty(); // 清空页面列表
			pageGlobal.historyDates = []; // 清空历史日期数组
		}
	}
	
	/*
	 * 清空查询条件
	 */
	function cleanQueryParam(){
		$(_pageId + ".month_list").empty();
		$(_pageId + "#fund_place").empty();
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = 0; // 总页数
		pageGlobal.param = {}; // 查询对象
		pageGlobal.historyDates = [];
//		queryFinancialOrder(); // 查询订单
		
		
	}
	
	/**上下滑动刷新事件**/
	function pageScrollInit(recordLen){
		var containerTop = $(_pageId + "#v_container_orderList").offset().top;
		var containerHeight = $(window).height() - containerTop - 60;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false,
				"perRowHeight" : 140,
				"visibleHeight" : containerHeight, // 这个是中间数据的高度
				"container" : $(_pageId + " #v_container_orderList"),
				"wrapper" : $(_pageId + " #v_wrapper_orderList"),
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					if(pageGlobal.orderType && pageGlobal.orderType == "1"){
						queryFinancialOrder();
					}else{
						queryFundPlaceManage();
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
						if(pageGlobal.orderType && pageGlobal.orderType == "1"){
							queryFinancialOrder();
						}else{
							queryFundPlaceManage();
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
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		//查询所有定投订单
		appUtils.bindEvent(_pageId + " #allOrders ", function(e){
			$(_pageId + "#fund_place").empty();
			$(_pageId + "#allOrders").hide();
			pageGlobal.orderSuc=true;
			queryFundPlaceManage();
		
		});
		
		// 点击关闭
	    appUtils.bindEvent($(_pageId + " #cancelFund"),function(){
			$(_pageId + "#window_two").hide();
	    });
		
		// 点击页面
	    appUtils.bindEvent($(_pageId + " #dateList"),function(e){
			$(_pageId + "#dateList").hide();
			e.stopPropagation();
	    });
	    
		// 筛选页面不做任何操作
	    appUtils.bindEvent($(_pageId + " .cate_dropdown"),function(e){
			e.stopPropagation();
	    });
	    
		/**
		 * 点击输入框
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var keyPanelConfig = {skinName: "white"};
		    var isPwd = $(_pageId + " #trade_pwd").index(this) == 4 ? false : true; // 除股票键盘外其余都是密码输入
		    myKeyPanel.init(this, $(_pageId + " #trade_pwd").index($(this)) + 1, isPwd, keyPanelConfig); // 执行初始化
		    e.stopPropagation();
		});
		
		/**
		 * 键盘输入事件
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var $input = $(_pageId+" #trade_pwd_box");
			//$(_pageId+" #trade_pwd_box em").html("");
			var value = e.originalEvent.detail["optType"];
	    	var text = $(_pageId+" #trade_pwd").attr("value");
	    	if(value == "del"){
	    		var len = text.length;
	    		$(_pageId+"#trade_pwd_box em:eq("+(len)+")").html("");
	    		$input.val(text.slice(0, -1));
	    	}else{
	    		if(text.length <= 6){
		    		$input.val(text);
		    		var len = text.length;
		    		$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    		if(text.length == 6){
		    			//$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    			//$(_pageId+" .pop_pay").hide();
		    			var trade_pwd = $(_pageId+" #trade_pwd").val();
		    			myKeyPanel.close();//隐藏h5键盘
						var _trade_pwd=$(_pageId+" #trade_pwd").val();
			        	if(_trade_pwd.length!=6){
			        		$(_pageId + " #trade_pwd_box em").html("");
			        		layerUtils.iMsg(-1,"请输入6位数交易密码！");
			        		return;
			        	}
			        	var param = {
			        			
			        			"pwd1" :_trade_pwd
			        		};
			        	var operating_type = $(this).attr("operating_type");// 操作类型，3可撤销;12支付
			        	var productType = $(this).attr("productType"); // 0-基金，1-理财
			        	var fina_belongs = $(this).attr("fina_belongs"); // OTC
			        	if(operating_type == "12"){
							if (productType == 0) {
								// 基金支付
								common.rsaEncrypt(param,fundOrderPayment);
							} else if (productType == 1) {
								if(fina_belongs == "5"){//OTC订单
									// OTC 购买
									common.rsaEncrypt(param,otcOrderPayment);
								}else{
									// 理财支付
									common.rsaEncrypt(param,finanOrderPayment);
								}

							}
			        	}else{
			        		//撤单
			        		common.rsaEncrypt(param,undoOrder);
			        	}

		    		}
	    		}else{
	    			layerUtils.iMsg(-1, "支付密码最多6位!");
	    		}
	    	}
			e.stopPropagation();
		}, "input");
		
		/*点击页面*/
        appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
			myKeyPanel.close();
   			e.stopPropagation();
        });
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("account/myOrder", "account/userCenter", {});
		});
		
		// 日期选择按钮
		appUtils.bindEvent(_pageId + "#dateBtn", function(){
			var dateListEle = $(_pageId + "#dateList");
			if (dateListEle.css("display") == "none") {
				$(_pageId + "#dateList").show();
			} else {
				$(_pageId + "#dateList").hide();
			}
			
		});
		
		// 订单和赎回tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("active")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("active");
			// 设置当前tab act样式
			$(this).find("a").addClass("active");
			// 隐藏所有tab页
			$(_pageId + ".my_pos_list").hide();
			// 显示当前tab页
			$(_pageId + "#tra_tab_" + index).show();
			
			cleanQueryParam();
			if (index == 0) {
				pageGlobal.orderType = 1;
				$(_pageId + " .month_list").show();
				$(_pageId + " #fund_place").hide();
				$(_pageId + " #dateBtn").show();
				$(_pageId + " #footerBtn").hide();
				$(_pageId + " #allOrders").hide();
				queryFinancialOrder();
			} else if (index == 1) {
				pageGlobal.orderType = 2;
				$(_pageId + " #dateBtn").hide();
				$(_pageId + " .month_list").hide();
				$(_pageId + " #fund_place").show();
				$(_pageId + " #footerBtn").show();
				$(_pageId + " #allOrders").show();
				pageGlobal.orderSuc=false;
				queryFundPlaceManage();
			}
		});
		
		// 选择日期
		appUtils.bindEvent(_pageId + "#dateList li", function(){
			var year = $(_pageId + "#yearValue").val();
			
			if (year > new Date().getFullYear() || year < 1970) {
				layerUtils.iMsg(-1, "年份必须在1970-" + new Date().getFullYear() + "之间");
				return;
			}
			pageGlobal.historyYear = year;
			
			var lisEle = $(_pageId + "#dateList li");
			var month = lisEle.index(this) + 1;
			
			// 移除所有li上 act样式
			lisEle.find("a").removeClass("act");
			
			// 当前点击对象添加act样式
			$(this).find("a").addClass("act");
			
			// 根据年份+月份 获取有多少天
			var days = common.getDaysByYearAndMonth(year, month);
			if (month < 10) {
				month = "0" + month;
			}
			
			// 查询条件赋值
			pageGlobal.param.start_date = year + "-" + month + "-" + "01";
			pageGlobal.param.end_date = year + "-" + month + "-" + days;
			
			$(_pageId + "#dateList").hide();
			
			// 初始化当前页
			pageGlobal.curPage = 1;
			// 查询数据
			queryFinancialOrder();
		});
		
		// 日期控件 调大年份
		appUtils.bindEvent(_pageId + "#dateList .next_btn", function(){
			var curDate = new Date();
			var yearValueEle = $(_pageId + "#yearValue");
			
			// 最大年份不能超过今年
			if (curDate.getFullYear() == yearValueEle.val()) {
				return;
			}
			yearValueEle.val(parseInt(yearValueEle.val()) + 1);
		});
		
		// 日期控件 减小年份
		appUtils.bindEvent(_pageId + "#dateList .prev_btn", function(){
			var yearValueEle = $(_pageId + "#yearValue");
			
			// 最小不能小于1970 年
			if (yearValueEle.val() == "1970") {
				return;
			}
			
			yearValueEle.val(yearValueEle.val() - 1)
		});
		
		// 输入年份时只能是数字
		appUtils.bindEvent(_pageId + "#dateList #yearValue", function(){
			// 只允许数字
			putils.numberLimit($(this)); 
		}, "keyup");
		
		// 年份必须大于1970 小于本年
		appUtils.bindEvent(_pageId + "#dateList #yearValue", function(){
			if ($(this).val() > new Date().getFullYear()) {
				layerUtils.iMsg(-1, "年份不能大于" + new Date().getFullYear());
				$(this).val(pageGlobal.historyYear);
			}
			if ($(this).val() < 1970) {
				layerUtils.iMsg(-1, "年份不能小于1970");
				$(this).val(pageGlobal.historyYear);
			}
		}, "blur");
		
		// 关闭输入交易密码弹框
		appUtils.bindEvent(_pageId + "#close_btn_buy", function(){
			$(_pageId + "#order_buy").hide();
			$(_pageId + " #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#order_buy").hide();
		$(_pageId + " #trade_pwd_box em").html("");
		$(_pageId+" #trade_pwd").val("");
	}
	
	var myOrder = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myOrder;
}); /**
 * 我的订单
 * @author wanliang
 * 
 */
define(function(require, exports, module){ 
	var _pageId = "#account_myOrder "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var KeyPanel = require("keyPanel"); // 键盘插件 
	var myKeyPanel = new KeyPanel(); 
	var VIscroll = require("vIscroll"); // 滑动组件
	var vIscroll = {"scroll" : null, "_init" : false}; // 上下滑动对象
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"pay_mode" : "", // 支付方式
		"maxPage" : 0, // 最大页数
		"param" : {}, // 查询对象
		"historyDates" : [], // 记录查询结果中的历史日期 
		"orderType" : "", // 订单类型
		"historyYear" : "" //记录前一个查询的年份
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		initParam();
		initMyorderView();
		cleanQueryParam(); // 清空查询条件
		initView();
		
		// 初始化页面时定位滚动元素到第一个
		if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, 0);
		}
	}
	
	/*
	 * 初始化选择页面
	 */
	function initView(){
		pageGlobal.orderType = "1";
		var _pageCode = appUtils.getPageParam("_pageCode");
		var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
		// 移除所有tab act样式
		tabRowEles.find("a").removeClass("active");
		if(_pageCode == "place"){
			pageGlobal.orderType = "2";
			tabRowEles.find("a").eq(1).addClass("active");
			$(_pageId + " .month_list").hide();
			$(_pageId + " #dateBtn").hide();
			$(_pageId + " #fund_place").show();
			$(_pageId + " #footerBtn").hide();
			$(_pageId + " #allOrders").show();
			pageGlobal.orderSuc=false;
			queryFundPlaceManage();
		}else{
			// 设置当前tab act样式
			tabRowEles.find("a").eq(0).addClass("active");
			$(_pageId + " .month_list").show();
			$(_pageId + " #dateBtn").show();
			$(_pageId + " #fund_place").hide();
			$(_pageId + " #footerBtn").hide();
			$(_pageId + " #allOrders").hide();
			queryFinancialOrder();
		}
	}
	
	/*
	 * 初始化我的订单界面
	 */
	function initMyorderView(){

		var curDate = new Date();
		
		// 赋值本年年份
		$(_pageId + "#yearValue").val(curDate.getFullYear());
		pageGlobal.historyYear = curDate.getFullYear();
		
		// 先清空所有月份act样式
		$(_pageId + "#dateList ul").find("a").removeClass("act");
		
		// 激活本月样式
		var curMonth = curDate.getMonth();
		$(_pageId + "#dateList ul").children().eq(curMonth).find("a").addClass("act");
		
		
		// 隐藏日期控件
		$(_pageId + "#dateList").hide();
		
	}
	
	/*
	 * 金融产品订单查询 1000122
	 */
	function queryFinancialOrder(){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		//var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var containerTop = $(_pageId + "#v_container_orderList").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		var param = {
				"user_id" : common.getUserId(),
				"start_time" : pageGlobal.param.start_date,
				"end_time" : pageGlobal.param.end_date,
				"page" : pageGlobal.curPage,
				"numPerPage" : "8"
		};
		
		service.queryFinancialOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				//处理返回结果
				groupQueryResult(results);
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 定投管理
	 */
	function queryFundPlaceManage(){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		// 第一页时清空列表
		initParam();
		
		var containerTop = $(_pageId + "#v_container_orderList").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		
		//var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var param = {
				"user_id" : common.getUserId(),
				"page" : pageGlobal.curPage,
				"numPerPage" : "8"
		};
		if(!pageGlobal.orderSuc){  //orderSuc=false查询成功的
			param.orderNum='1';//只查询成功的
		}
		service.queryFundPlaceList(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				var recordLen  = results.length;
				pageGlobal.maxPage = data.results[0].totalPages; // 总页数
				var placeManage = $(_pageId + "#fund_place");
				if(recordLen && recordLen > 0){
					$(_pageId + "#v_container_orderList").show();
					//$(_pageId + "#v_container_orderList").hide();
					$(_pageId + ".no_data_box").hide();
					for (var i = 0; i < results.length; i++) {
						var item = results[i];
						var productName = item.product_name + '（' + item.product_code + '）';
						var agreement_status = item.agreement_status; // 定投协议状态（0：终止，1：启用，2：暂停）
						var first_trade_y_m_mall = item.first_trade_y_m_mall.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
						var expiry_date = item.expiry_date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
						var btn = ""; // 无操作
						if(agreement_status && agreement_status == '1'){
							var btn = '<a href="javascript:void(0)" class="cancel">取消定投</a><a href="javascript:void(0)" class="exchanges">修改定投</a>';
						}
						var fundPlace = '<div class="invest_order_info mt10">' +
						'	<div class="invest_info_tit">' +
						'		<h3 style="float: left;">'+ productName +'</h3>' +
						'		<p style="text-align: right;">'+ putils.agreementStatus(agreement_status) +'</p>' +
						'	</div>' +
						'	<div class="invest_info_con">' +
						'		<ul class="info_list clearfix">' +
						'			<li>定投周期:<span class="ablue" style=" color: #0081E2 !important;">每月/'+ item.trade_date +'号</span></li>' +
						'			<li>开始日期:<span>'+ first_trade_y_m_mall +'</span></li>' +
						'			<li>每期定期金额：<span>'+ item.trade_money +'元</span></li>' +
						'			<li>截止日期: <span>'+ expiry_date +'</span></li>' +
						'		</ul>' +
						'		<div class="ui layout info_btn">' +
						'			<p class="row-1">'+ item.update_time +'</p>' +
						'			<div class="info_btn_con" error_msg="'+ item.error_msg +'" agreement_status="'+ agreement_status +'" create_time="'+ item.create_time +'" trade_date="'+ item.trade_date +'" expiry_date="'+ expiry_date +'" first_trade_y_m_mall="'+ first_trade_y_m_mall +'" trade_money="' + item.trade_money + '" productCode="'+ item.product_code +'" fixed_id="'+ item.fixed_id +'" apply_no="' + item.apply_no + '">' +
						'				'+ btn +'' +
						'			</div>' +
						'		</div>' +
						'	</div>' +
						'</div>' ;
						placeManage.append(fundPlace);
					}
					pageScrollInit(recordLen);
					
					// 取消定投
					appUtils.bindEvent(_pageId + ".cancel", function(e){
						e.stopPropagation();
						var cur = $(this);
						layerUtils.iConfirm("确定要取消定投吗？",function(){
							// 确定取消定投
							var productCode = cur.parent("div.info_btn_con").attr("productCode");
							var apply_no = cur.parent("div.info_btn_con").attr("apply_no");
							var fixed_id = cur.parent("div.info_btn_con").attr("fixed_id");
							cancelFundPlace(apply_no,fixed_id,productCode);
						}, function(){});
					},"click");
					
					// 订单详情
					appUtils.bindEvent(_pageId + ".invest_order_info", function(e){
						e.stopPropagation();
						var productCode = $(this).find("div.info_btn_con").attr("productCode");
						var apply_no = $(this).find("div.info_btn_con").attr("apply_no");
						var fixed_id = $(this).find("div.info_btn_con").attr("fixed_id");
						var trade_money = $(this).find("div.info_btn_con").attr("trade_money");
						var first_trade_y_m_mall = $(this).find("div.info_btn_con").attr("first_trade_y_m_mall");
						var expiry_date = $(this).find("div.info_btn_con").attr("expiry_date");
						var trade_date = $(this).find("div.info_btn_con").attr("trade_date");
						var agreement_status = $(this).find("div.info_btn_con").attr("agreement_status");
						var create_time = $(this).find("div.info_btn_con").attr("create_time");
						var error_msg = $(this).find("div.info_btn_con").attr("error_msg");
						
						$(_pageId + "#orderId").html(fixed_id);
						$(_pageId + "#price").html(trade_money);
						$(_pageId + "#time").html(create_time);
						$(_pageId + "#productCode").html(productCode);
						if(agreement_status && agreement_status  == "4"){
							$(_pageId + "#orderState").html(error_msg);
						}else{
							$(_pageId + "#orderState").html(putils.agreementStatus(agreement_status));
						}
						$(_pageId + "#window_two").show();
					},"click");
					
					// 修改定投
					appUtils.bindEvent(_pageId + ".exchanges", function(e){
						e.stopPropagation();
						var productCode = $(this).parent("div.info_btn_con").attr("productCode");
						var apply_no = $(this).parent("div.info_btn_con").attr("apply_no");
						var fixed_id = $(this).parent("div.info_btn_con").attr("fixed_id");
						var trade_money = $(this).parent("div.info_btn_con").attr("trade_money");
						var first_trade_y_m_mall = $(this).parent("div.info_btn_con").attr("first_trade_y_m_mall");
						var expiry_date = $(this).parent("div.info_btn_con").attr("expiry_date");
						var trade_date = $(this).parent("div.info_btn_con").attr("trade_date");
						var param = {
							"productCode" : productCode,
							"fixed_id" : fixed_id,
							"apply_no" : apply_no,
							"trade_money" : trade_money,
							"first_trade_y_m_mall" : first_trade_y_m_mall,
							"trade_date" : trade_date,
							"expiry_date" : expiry_date
						}
						appUtils.pageInit("account/myOrder", "finan/fixedInvestment/updatePlaceOrder", param);
					},"click");
				}else{
						$(_pageId + "#v_container_orderList").hide();
						$(_pageId + ".no_data_box").show();
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	/*
		 * 取消定投
		 */
		function cancelFundPlace(apply_no,fixed_id,productCode){
			var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
			var external_account = JSON.parse(userInfo).fund_account; // 获取资金账号
			var param = {
					"user_id" : common.getUserId(),
					"apply_no" : apply_no,
					"fixed_id" : fixed_id,
					"operator_type" : "0",
					"product_code" : productCode,
					"trade_account" : external_account,
			};
			service.updateFundPlace(param, function(data){
				var error_no = data.error_no;
				var error_info = data.error_info;
				if(error_no == "0"){
					var result = data.results[0];
					pageGlobal.orderSuc=false;
					queryFundPlaceManage();
					layerUtils.iMsg(-1,"取消定投成功！");
					
				}else{
					layerUtils.iMsg(-1,error_info);
					return false;
				}
			});
		}
	
	/**//**
	 * 金融产品订单撤销（撤单）   1000119   
	 *//*
*/	function undoOrder(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var trade_pwd = "";
		if (backParam) {
			trade_pwd = backParam.pwd1;
		}
		var param = {
				"user_id" : common.getUserId(),
				"order_id" : order_id,
				"trade_pwd" : trade_pwd
		};
		
		service.undoOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				cleanQueryParam(); // 清空日期数组 
				queryFinancialOrder(); // 查询订单
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/*
	 * 金融产品订单取消   1000108   
	 */
	function cancelOrder(order_id){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var param = {
				"user_id" : common.getUserId(),
				"order_id" : order_id
		};
		
		service.cancelOrder(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				layerUtils.iMsg(-1,"取消成功！");
				cleanQueryParam(); // 清空日期数组  
				queryFinancialOrder(); // 查询订单
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	
	}
	
	/*
	 * 理财支付
	 */
	function finanOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.finanOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 基金支付
	 */
	function fundOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.fundOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id; // 订单ID
				var productName = item.product_name; // 产品名称
				var productCode = item.product_code; // 产品编号
				var totPrice = item.tot_price; // 订单价格
				productName = putils.delProSpecialStr(productName);
				var param = {
					"order_id" : order_id,
					"product_name" : productName + "(" + productCode + ")",
					"tot_price" : totPrice
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * OTC 支付
	 */
	function otcOrderPayment(backParam){
		// 校验用户是否登录
		var _loginInPageCode = "account/myOrder";
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var external_account = JSON.parse(userInfo).fund_account; // 资金账号
		var order_id = $(_pageId + "#trade_pwd").attr("order_id");
		var param = {
			"order_id" : order_id,
			"user_id" : common.getUserId(),
			"fund_account" : external_account,
			"trade_pwd" : backParam.pwd1,
			"pay_type" : pageGlobal.pay_mode
		}; 
		service.otcOrderPayment(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var order_id = item.order_id;
				var product_name = item.product_name;
				var product_code = item.product_code;
				var tot_price = item.tot_price;
				var param = {
					"order_id" : order_id,
					"product_name" : product_name+"("+product_code+")",
					"tot_price" : tot_price
				}
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				$(_pageId + " #trade_pwd_box em").html("");
				$(_pageId+" #trade_pwd").val("");
				appUtils.pageInit("finan/buy", "finan/buySuccess", param);
			}else{
				$(_pageId+" #trade_pwd").val("");
				$(_pageId+" #trade_pwd_box em").html("");
				$(_pageId + "#order_buy").hide(); // 隐藏支付密码弹框
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 把结果按照日期分组
	 */
	function groupQueryResult(result){
		// 保存最终分组后的对象，key为时间段，value为记录对象 
		// 最终数据形式如：{"2015-01" :[obj,obj,...], "2015-02" : [obj,obj,...]}
		var group = {}; 
		
		 // 时间段数组: ["2015-01","2015-02","2015-03",...]
		var dates = [];
		
		// 把记录中同一月份的时间保存到数组中。
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			var trans_date = item.update_time;
			if (trans_date.length > 7) {
				trans_date = trans_date.substring(0, trans_date.lastIndexOf("-"));
			} else {
				trans_date = "-";
			}
			if ($.inArray(trans_date, dates) == -1) {
				dates.push(trans_date);
			}
		}
		
		// 按照时间段分组
		for (var i = 0; i < dates.length; i++) {
			group[dates[i]] = [];
			for (var j = 0; j < result.length; j++) {
				var item = result[j];
				var trans_date = item.update_time;
				if (trans_date.length > 7) {
					trans_date = trans_date.substring(0, trans_date.lastIndexOf("-"));
				} else {
					trans_date = "-";
				}
				if (trans_date == dates[i]) {
					group[dates[i]].push(item);
				}
			}
		}
		
		// 填充数据到页面
		fillQueryResult(group, dates, result.length);
	}
	
	/*
	 * 按照日期段填充流水列表
	 * @group {"2015-01" :[obj,obj,...], "2015-02" : [obj,obj,...]}
	 * @dates ["2015-01","2015-02","2015-03",...]
	 */
	function fillQueryResult(group, dates, resultDataLen){
		// 第一页时清空列表
		initParam();
		
		var myOrderListEle = $(_pageId + ".month_list");
		if (dates && dates.length == 0) {
			$(_pageId + "#v_container_orderList").hide();
			$(_pageId + ".no_data_box").show();
			return;
		} else {
			$(_pageId + "#v_container_orderList").show();
			$(_pageId + ".no_data_box").hide();
		}
		for (var i = 0; i < dates.length; i++) {
			var date = dates[i]; // 时间段
			var datasItem = group[date]; // 对应月份的数据集
			
			if (pageGlobal.historyDates.indexOf(date) == -1) {
				// 如果历史时间数组中没有当前日期，需要在页面上追加对应月份的头部html
				var dateYear = date.substring(0, 4); // 年份
				var dateMonth = parseInt(date.substring(5, 7)); // 月份
				
				// 用于显示的日期，如果与今年年份相等，只显示月份，否则显示年月
				var dateStr = dateYear + "年" + dateMonth + "月"; 
				if (dateYear == new Date().getFullYear()) {
					dateStr = dateMonth + "月";
				}
				var dateItemHtml =  '	<h3>' + dateStr + '</h3>'+
									'	<ul id="monthList_' + date.replace("-", "_") + '">'+
									'	</ul>';
				myOrderListEle.append(dateItemHtml);
				
				// 把当前日期更新到历史日期数组中
				pageGlobal.historyDates.push(date);
			} 
			
			var monthListEle = $(_pageId + ".month_list #monthList_" + date.replace("-", "_"));
			var datasItem = group[date]; // 对应月份的数据集
			
			for (var j = 0; j < datasItem.length; j++) {
				var item = datasItem[j];
				var productAbbr = item.product_name; // 产品名称
				productAbbr = putils.delProSpecialStr(productAbbr);
				if (productAbbr.length > 8) {
					productAbbr = productAbbr.substring(0, 8) + "...";
				}

				var productTypes = item.product_type; // 产品类型 0基金 1理财
				var fina_belongs = item.fina_belongs; // OTC
				if (productTypes == 0) {
					productType = "基金";
				} else if (productTypes == 1) {
					if (fina_belongs == "5"){
						productType = "OTC";
					}else{
						productType = "理财";
					}
				}
				
				var orderId = item.order_id; // 订单号
				var productId = item.product_id; // 产品ID
				var orderState = item.order_state; // 订单状态
				var updateTime = item.update_time; // 更新时间
				var totPrice = common.fmoney(item.tot_price,2); // 订单价格
				var businessType = item.business_type; // 业务类型，0认购;1申购;2赎回;3买入;4卖出;5产品登记
				switch (businessType) {
				case "0":
					var businessType_style = "subscription";
					break;
					
				case "1":
					var businessType_style = "prchase";
					break;
					
				case "2":
					var businessType_style = "redemption";
					break;

				default:
					var businessType_style = "subscription";
					break;
				}
				var businessTypeName = putils.tradeBusinessType(businessType); // 根据业务类型枚举值获取描述信息
				var operating_type = item.operating_type; // 操作类型，0无操作;3可撤销;12支付/取消
				switch (operating_type) {
				case "0":
					operating_no = "display:none;";
					break;
					
				case "3":
					operating_no = "";
					break;

				default:
					operating_no = "display:none;";
					break;
				}
				var operating_typeName = putils.tradeOperating_type(operating_type); // 根据操作类型枚举值获取描述信息
//				订单操作类型有两个按钮    支付     取消  
				if(operating_type == "12"){
					var buy = operating_typeName.substring(0,2);
					var cancel = operating_typeName.substring(3,5);
					var allOrderStr = '<li order_id="' + orderId + '">' + 
					'	<div class="clearfix">' + 
					'		<div class="row_fl">' + 
					'			<h4>' + productAbbr + '<span class="label_icon ' + businessType_style + '">' + businessTypeName + '</span></h4>' + 
					'			<p>' + updateTime  +' '+ common.getOrderStateName(orderState) + '</p>' + 
					'		</div>' + 
					'		<div class="row_fr">' + 
					'			<h4 class="text-right ared">' + totPrice + '</h4>' + 
					'           <div class="row_fr_btn">'+
					'			    <a href="javascript:void(0);" class="withdrawals cancelOrder" order_id="' + orderId + '">' + cancel + '</a>' + 
					'               <a href="javascript:void(0);" fina_belongs = "' + fina_belongs + '" productType = "' + productTypes + '" operating_type = "' + operating_type + '" tot_price_order= "' + totPrice + '" order_id="' + orderId + '" class="pay_btn buyOrder">' + buy + '</a>'+
					'		    </div>' + 
					'		</div>' + 
					'	</div>' + 
					'	<i class="tag_icon"><span>' + productType + '</span></i>' + 
					'</li>';
				}else{
					var allOrderStr = '<li order_id="' + orderId + '">' + 
					'	<div class="clearfix">' + 
					'		<div class="row_fl">' + 
					'			<h4>' + productAbbr + '<span class="label_icon ' + businessType_style + '">' + businessTypeName + '</span></h4>' + 
					'			<p>' + updateTime  +' '+ common.getOrderStateName(orderState) + '</p>' + 
					'		</div>' + 
					'		<div class="row_fr">' + 
					'			<h4 class="text-right ared">' + totPrice + '</h4>' + 
					'           <div class="row_fr_btn">'+
					'			    <a href="javascript:void(0);" style="' + operating_no + '" fina_belongs = "' + fina_belongs + '" productType = "' + productTypes + '" operating_type = "' + operating_type + '" tot_price_order= "' + totPrice + '" order_id="' + orderId + '" class="withdrawals operating_btn">' + operating_typeName + '</a>' + 
					'		    </div>' + 
					'		</div>' + 
					'	</div>' + 
					'	<i class="tag_icon"><span>' + productType + '</span></i>' + 
					'</li>';
				}

				monthListEle.append(allOrderStr);
				
				//点击撤单/不可操作按钮
				appUtils.bindEvent($(_pageId+" .month_list .operating_btn"),  function(e) {
					e.stopPropagation();
					order_id = $(this).attr("order_id");
					var tot_price_order = $(this).attr("tot_price_order");
					var operating_type = $(this).attr("operating_type");
					var productType = $(this).attr("productType");
					var fina_belongs = $(this).attr("fina_belongs");
					switch (operating_type) {
					case "0":
						layerUtils.iMsg(-1, "订单不可操作");
						break;
						
					case "3":
						$(_pageId + "#isBuy").html("确定撤单！");
						$(_pageId + "#top_price_value").html("¥"+tot_price_order);
						$(_pageId + "#trade_pwd").attr("order_id",order_id);
						$(_pageId + "#trade_pwd").attr("operating_type",operating_type); // 操作类型，0无操作;3可撤销;12可支付可取消
						$(_pageId + "#trade_pwd").attr("productType",productType); // 0-基金   1-理财
						$(_pageId + "#trade_pwd").attr("fina_belongs",fina_belongs); // OTC 
						
						// 资金账号登录时 无需输入密码
						if (isFundAccountLogin()) {
							layerUtils.iConfirm("您确定要撤单吗？",function(){	
								undoOrder(false);
							},function(){
								return;
							});
						} else {
							$(_pageId + "#order_buy").show(); // 显示输入交易密码弹框
						}
						break;

					default:
						break;
					}
				}, 'click');
				
				
				//取消订单
				appUtils.bindEvent($(_pageId+" .month_list .cancelOrder"), function(e) {
					e.stopPropagation();
					var order_id = $(this).attr("order_id");
					layerUtils.iConfirm("您确定要取消订单吗？",function(){	
						cancelOrder(order_id);
					},function(){
						return;
					});
					
				}, 'click');
				
				//支付订单
				appUtils.bindEvent($(_pageId+" .month_list .buyOrder"), function(e) {
					e.stopPropagation();
					var order_id = $(this).attr("order_id");
					var tot_price_order = $(this).attr("tot_price_order");
					var operating_type = $(this).attr("operating_type");
					var productType = $(this).attr("productType");
					var fina_belongs = $(this).attr("fina_belongs");
					$(_pageId + "#isBuy").html("确定支付");
					$(_pageId + "#top_price_value").html("¥"+tot_price_order);
					$(_pageId + "#trade_pwd").attr("order_id",order_id);
					$(_pageId + "#trade_pwd").attr("operating_type",operating_type); // 操作类型，0无操作;3可撤销;12可支付可取消
					$(_pageId + "#trade_pwd").attr("productType",productType); // 0-基金   1-理财
					$(_pageId + "#trade_pwd").attr("fina_belongs",fina_belongs); // OTC 
					
					
					// 资金账号登录时 无需输入密码
					if (isFundAccountLogin()) {
						if(operating_type == "12"){
							if (productType == 0) {
								// 基金支付
								fundOrderPayment(false);
							} else if (productType == 1) {
								if(fina_belongs == "5"){//OTC订单
									// OTC 购买
									otcOrderPayment(false);
								}else{
									// 理财支付
									finanOrderPayment(false);
								}

							}
			        	}
					} else {
						$(_pageId + "#order_buy").show(); // 显示输入交易密码弹框
					}
					
				}, 'click');
				
			}
		}
		
		pageScrollInit(resultDataLen);
		// 点击 订单进入详情
		appUtils.bindEvent($(_pageId + ".month_list li"), function(){
			var orderId = $(this).attr("order_id");
			appUtils.pageInit("account/myOrder", "account/orderDetail", {"order_id" : orderId});
		}, 'click');
		
	}
	
	// 判断是否是资金账号登录
	function isFundAccountLogin(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		if (userInfo) {
			var isFundAccountLogin = JSON.parse(userInfo).is_fund_account_login;
			if (isFundAccountLogin == "1") {
				return true;
			}
		}
		return false;
	}
	
	/*
	 * 如果curPage = 1 则清空列表同时清空日期数组
	 */
	function initParam(){
		if (pageGlobal.curPage == 1) {
			$(_pageId + ".month_list").empty(); // 清空页面列表
			$(_pageId + "#fund_place").empty(); // 清空页面列表
			pageGlobal.historyDates = []; // 清空历史日期数组
		}
	}
	
	/*
	 * 清空查询条件
	 */
	function cleanQueryParam(){
		$(_pageId + ".month_list").empty();
		$(_pageId + "#fund_place").empty();
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = 0; // 总页数
		pageGlobal.param = {}; // 查询对象
		pageGlobal.historyDates = [];
//		queryFinancialOrder(); // 查询订单
		
		
	}
	
	/**上下滑动刷新事件**/
	function pageScrollInit(recordLen){
		var containerTop = $(_pageId + "#v_container_orderList").offset().top;
		var containerHeight = $(window).height() - containerTop - 60;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false,
				"perRowHeight" : 140,
				"visibleHeight" : containerHeight, // 这个是中间数据的高度
				"container" : $(_pageId + " #v_container_orderList"),
				"wrapper" : $(_pageId + " #v_wrapper_orderList"),
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					if(pageGlobal.orderType && pageGlobal.orderType == "1"){
						queryFinancialOrder();
					}else{
						queryFundPlaceManage();
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
						if(pageGlobal.orderType && pageGlobal.orderType == "1"){
							queryFinancialOrder();
						}else{
							queryFundPlaceManage();
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
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		//查询所有定投订单
		appUtils.bindEvent(_pageId + "#allOrders", function(e){
			$(_pageId + "#fund_place").empty();
			$(_pageId + "#allOrders").hide();
			$(_pageId + "#footerBtn").show();
			pageGlobal.orderSuc=true;
			queryFundPlaceManage();
		
		});
		
		// 点击关闭
	    appUtils.bindEvent($(_pageId + " #cancelFund"),function(){
			$(_pageId + "#window_two").hide();
	    });
		
		// 点击页面
	    appUtils.bindEvent($(_pageId + " #dateList"),function(e){
			$(_pageId + "#dateList").hide();
			e.stopPropagation();
	    });
	    
		// 筛选页面不做任何操作
	    appUtils.bindEvent($(_pageId + " .cate_dropdown"),function(e){
			e.stopPropagation();
	    });
	    
		/*
		 * 点击输入框
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var keyPanelConfig = {skinName: "white"};
		    var isPwd = $(_pageId + " #trade_pwd").index(this) == 4 ? false : true; // 除股票键盘外其余都是密码输入
		    myKeyPanel.init(this, $(_pageId + " #trade_pwd").index($(this)) + 1, isPwd, keyPanelConfig); // 执行初始化
		    e.stopPropagation();
		});
		
		/*
		 * 键盘输入事件
		 */
		appUtils.bindEvent($(_pageId + " #trade_pwd"), function(e){
			var $input = $(_pageId+" #trade_pwd_box");
			//$(_pageId+" #trade_pwd_box em").html("");
			var value = e.originalEvent.detail["optType"];
	    	var text = $(_pageId+" #trade_pwd").attr("value");
	    	if(value == "del"){
	    		var len = text.length;
	    		$(_pageId+"#trade_pwd_box em:eq("+(len)+")").html("");
	    		$input.val(text.slice(0, -1));
	    	}else{
	    		if(text.length <= 6){
		    		$input.val(text);
		    		var len = text.length;
		    		$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    		if(text.length == 6){
		    			//$(_pageId+" #trade_pwd_box em:eq("+(len-1)+")").html("●");
		    			//$(_pageId+" .pop_pay").hide();
		    			var trade_pwd = $(_pageId+" #trade_pwd").val();
		    			myKeyPanel.close();//隐藏h5键盘
						var _trade_pwd=$(_pageId+" #trade_pwd").val();
			        	if(_trade_pwd.length!=6){
			        		$(_pageId + " #trade_pwd_box em").html("");
			        		layerUtils.iMsg(-1,"请输入6位数交易密码！");
			        		return;
			        	}
			        	var param = {
			        			
			        			"pwd1" :_trade_pwd
			        		};
			        	var operating_type = $(this).attr("operating_type");// 操作类型，3可撤销;12支付
			        	var productType = $(this).attr("productType"); // 0-基金，1-理财
			        	var fina_belongs = $(this).attr("fina_belongs"); // OTC
			        	if(operating_type == "12"){
							if (productType == 0) {
								// 基金支付
								common.rsaEncrypt(param,fundOrderPayment);
							} else if (productType == 1) {
								if(fina_belongs == "5"){//OTC订单
									// OTC 购买
									common.rsaEncrypt(param,otcOrderPayment);
								}else{
									// 理财支付
									common.rsaEncrypt(param,finanOrderPayment);
								}

							}
			        	}else{
			        		//撤单
			        		common.rsaEncrypt(param,undoOrder);
			        	}

		    		}
	    		}else{
	    			layerUtils.iMsg(-1, "支付密码最多6位!");
	    		}
	    	}
			e.stopPropagation();
		}, "input");
		
//		点击页面
       appUtils.bindEvent($(_pageId),function(e){
			$(_pageId+" #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
			myKeyPanel.close();
  			e.stopPropagation();
       });
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("account/myOrder", "account/userCenter", {});
		});
		
		// 日期选择按钮
		appUtils.bindEvent(_pageId + "#dateBtn", function(){
			var dateListEle = $(_pageId + "#dateList");
			if (dateListEle.css("display") == "none") {
				$(_pageId + "#dateList").show();
			} else {
				$(_pageId + "#dateList").hide();
			}
			
		});
		
		// 订单和赎回tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("active")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("active");
			// 设置当前tab act样式
			$(this).find("a").addClass("active");
			// 隐藏所有tab页
			$(_pageId + ".my_pos_list").hide();
			// 显示当前tab页
			$(_pageId + "#tra_tab_" + index).show();
			
			cleanQueryParam();
			if (index == 0) {
				pageGlobal.orderType = 1;
				$(_pageId + " .month_list").show();
				$(_pageId + " #fund_place").hide();
				$(_pageId + " #dateBtn").show();
				$(_pageId + " #footerBtn").hide();
				$(_pageId + " #allOrders").hide();
				queryFinancialOrder();
			} else if (index == 1) {
				pageGlobal.orderType = 2;
				$(_pageId + " #dateBtn").hide();
				$(_pageId + " .month_list").hide();
				$(_pageId + " #fund_place").show();
				$(_pageId + " #footerBtn").hide();
				$(_pageId + " #allOrders").show();
				pageGlobal.orderSuc=false;
				queryFundPlaceManage();
			}
		});
		
		// 选择日期
		appUtils.bindEvent(_pageId + "#dateList li", function(){
			var year = $(_pageId + "#yearValue").val();
			
			if (year > new Date().getFullYear() || year < 1970) {
				layerUtils.iMsg(-1, "年份必须在1970-" + new Date().getFullYear() + "之间");
				return;
			}
			pageGlobal.historyYear = year;
			
			var lisEle = $(_pageId + "#dateList li");
			var month = lisEle.index(this) + 1;
			
			// 移除所有li上 act样式
			lisEle.find("a").removeClass("act");
			
			// 当前点击对象添加act样式
			$(this).find("a").addClass("act");
			
			// 根据年份+月份 获取有多少天
			var days = common.getDaysByYearAndMonth(year, month);
			if (month < 10) {
				month = "0" + month;
			}
			
			// 查询条件赋值
			pageGlobal.param.start_date = year + "-" + month + "-" + "01";
			pageGlobal.param.end_date = year + "-" + month + "-" + days;
			
			$(_pageId + "#dateList").hide();
			
			// 初始化当前页
			pageGlobal.curPage = 1;
			// 查询数据
			queryFinancialOrder();
		});
		
		// 日期控件 调大年份
		appUtils.bindEvent(_pageId + "#dateList .next_btn", function(){
			var curDate = new Date();
			var yearValueEle = $(_pageId + "#yearValue");
			
			// 最大年份不能超过今年
			if (curDate.getFullYear() == yearValueEle.val()) {
				return;
			}
			yearValueEle.val(parseInt(yearValueEle.val()) + 1);
		});
		
		// 日期控件 减小年份
		appUtils.bindEvent(_pageId + "#dateList .prev_btn", function(){
			var yearValueEle = $(_pageId + "#yearValue");
			
			// 最小不能小于1970 年
			if (yearValueEle.val() == "1970") {
				return;
			}
			
			yearValueEle.val(yearValueEle.val() - 1)
		});
		
		// 输入年份时只能是数字
		appUtils.bindEvent(_pageId + "#dateList #yearValue", function(){
			// 只允许数字
			putils.numberLimit($(this)); 
		}, "keyup");
		
		// 年份必须大于1970 小于本年
		appUtils.bindEvent(_pageId + "#dateList #yearValue", function(){
			if ($(this).val() > new Date().getFullYear()) {
				layerUtils.iMsg(-1, "年份不能大于" + new Date().getFullYear());
				$(this).val(pageGlobal.historyYear);
			}
			if ($(this).val() < 1970) {
				layerUtils.iMsg(-1, "年份不能小于1970");
				$(this).val(pageGlobal.historyYear);
			}
		}, "blur");
		
		// 关闭输入交易密码弹框
		appUtils.bindEvent(_pageId + "#close_btn_buy", function(){
			$(_pageId + "#order_buy").hide();
			$(_pageId + " #trade_pwd_box em").html("");
			$(_pageId+" #trade_pwd").val("");
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#order_buy").hide();
		$(_pageId + " #trade_pwd_box em").html("");
		$(_pageId+" #trade_pwd").val("");
	}
	
	var myOrder = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myOrder;
});