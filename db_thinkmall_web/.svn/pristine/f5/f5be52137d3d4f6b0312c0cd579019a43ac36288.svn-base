 /**
  * 银证转账
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_stockBank "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils"); 
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"param" : {}, // 查询对象
		"historyDates" : [], // 记录查询结果中的历史日期
		"userId" : "", // 用户编号
		"fundAccount" : "", // 资金账号
		"transType" : "1", // 转账方向 1：银转证，2：证转银 
		"historyYear" : "" // 保存历史年份
	};

	/*
	 * 初始化
	 */
	function init(){
		// 校验是否登录
		if (common.checkUserIsLogin(true, true)) {
			var userInfo = appUtils.getSStorageInfo("userInfo");
			userInfo = JSON.parse(userInfo);
			pageGlobal.userId = userInfo.user_id; // 记录用户编号到全局变量中
			pageGlobal.fundAccount = userInfo.fund_account; // 记录资金账号到全局变量中
		}
		
		// 初始化
		initBankToStockView();
	}
	
	/*
	 * 用户资产
	 */
	function userAsset(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var param = {
			"fund_account" : pageGlobal.fundAccount
		};
		service.queryAsset(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				for (var i = 0; i < results.length; i++) {
					//0 是人民币，1 是港币，2 是美元
					if (results[i].money_type == "0") {
						var withdrawMoney = results[i].withdraw_money;
						var withdrawMoneyShow = common.fmoney(withdrawMoney, 2);// 可取金额
						$(_pageId + "#maxMoney").html("可转金额：" + withdrawMoneyShow);
						$(_pageId + "#maxMoney").attr("max", withdrawMoney);
						break;
					}
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
		
	}
	
	/*
	 * 加载用户存管银行信息
	 */
	function addBankInfo(){
		var param = {
			"user_id" : pageGlobal.userId,
			"fund_account" : pageGlobal.fundAccount
		}
		
		service.accountBank(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				var traTabUl = $(_pageId + "#tra_tab_1 ul").empty();
				for (var i = 0; i < results.length; i++) {
					var item = results[i];
					var bankName = item.bank_name; // 银行名称
					var mType = item.money_type; // 币种类型
					var moneyDesc = putils.moneyType(mType); // 币种描述
					var bankNo = item.bank_no; // 银行编号
					var bankCardNo = $.trim(item.bank_card_no); // 银行卡号
					var curFundAccount = item.fund_account; // 资金账号
					
					var selected = ""; // 标示是否选中字符串
					if (i == 0) { // 默认选中第一项
						selected = "selected";
						traTabUl.prev("strong").html(bankName + '(' + moneyDesc + ')');
						loadPwdView(bankNo); // 初始化密码是否显示
						
					}
					var itemHtml = '<li selected="' + selected + '" bankNo="' + bankNo + '" bankCardNo="' + bankCardNo + '" fundAccount="' + curFundAccount + '">' + 
									'	<a herf="javascript:void(0);">' + bankName + '(' + moneyDesc + ')</a>' + 
									'</li>';
					traTabUl.append(itemHtml); // 证券转银行下拉选择项
					
				}
				
				// 选择银行事件 - 证券转银行
				appUtils.bindEvent(_pageId + "#tra_tab_1 ul li", function(){
					var curEle = $(this);
					curEle.parent().prev("strong").html(curEle.find("a").html()); // 赋值选中的银行信息
					$(_pageId + "tra_tab_1 ul li").attr("checked", ""); // 取消所有下拉项中的选择标识
					curEle.attr("checked", "checked"); // 标识当前点击项为选中项
					$(_pageId + "#tra_tab_1 ul").hide(); // 隐藏下拉列表
					loadPwdView(curEle.attr("bankNo")); // 密码是否显示
				});
			}else{
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 初始化输入框值
	 */
	function initInput(){
		$(_pageId + "#moneyInput").val("0");// 初始化金额文本框值
		$(_pageId + "#fundPwdInput").val(""); // 资金密码
		$(_pageId + "#bankPwdInput").val(""); // 交易密码
		userAsset(); // 刷新可转金额
	}
	
	/*
	 * 初始化银行转证券界面
	 */
	function initBankToStockView(){
		initInput(); // 初始化文本值
		// 相应tab页签激活样式
		$(_pageId + "#tra_tab_list a").removeClass("act").eq(0).addClass("act");
		
		// 显示银证转账tab页面
		$(_pageId + ".tra_tab_con").hide().eq(0).show();
		
		// 隐藏 可转金额提示
		$(_pageId + ".tips_box").hide();
		
		// 隐藏日期控件
		$(_pageId + "#dateList").hide();
		
		// 隐藏日期按钮 显示转入提交按钮
		$(_pageId + "#dateBtn").hide();
		$(_pageId + "#transBtn").html("转入证券").show();
		
		$(_pageId + "#tra_tab_1 ul").hide(); // 隐藏下拉列表
		
		pageGlobal.transType = "1"; // 转账方向
		
		// 加载用户存管银行
		addBankInfo();
	}
	
	/*
	 * 初始化证券转银行界面
	 */
	function initStockToBankView(){
		initInput(); // 初始化文本值
		// 相应tab页签激活样式
		$(_pageId + "#tra_tab_list a").removeClass("act").eq(1).addClass("act");
		
		// 显示银证转账tab页面
		$(_pageId + ".tra_tab_con").hide().eq(0).show();
		
		// 隐藏 可转金额提示
		$(_pageId + ".tips_box").show();
		
		// 隐藏日期控件
		$(_pageId + "#dateList").hide();
		
		// 隐藏日期按钮 显示转入提交按钮
		$(_pageId + "#dateBtn").hide();
		$(_pageId + "#transBtn").html("转入银行").show();
		
		$(_pageId + "#tra_tab_1 ul").hide(); // 隐藏下拉列表
		
		pageGlobal.transType = "2"; // 转账方向
		
		// 加载用户存管银行
		addBankInfo();
	}
	
	/*
	 * 查询是否需要密码
	 */
	function loadPwdView(bankNo){
		var param = {
			"trans_type" : pageGlobal.transType,
			"bank_no" : bankNo
		}
		
		service.queryPwd(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var result = results[0]; 
					var isFundPwd = result.is_fund_pwd; // 是否需要资金密码
					var isBankPwd = result.is_bank_pwd; // 是否需要银行密码
					
					if (isFundPwd == "1") {
						$(_pageId + "#fundPwdDiv").show();
					} else {
						$(_pageId + "#fundPwdDiv").hide();
					}
					
					if (isBankPwd == "1") {
						$(_pageId + "#bankPwdDiv").show();
					} else {
						$(_pageId + "#bankPwdDiv").hide();
					}
				}
			}else{
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 初始化查询界面
	 */
	function initQueryView(){
		var curDate = new Date();
		
		// 赋值本年年份
		$(_pageId + "#yearValue").val(curDate.getFullYear());
		pageGlobal.historyYear = curDate.getFullYear();
		
		// 先清空所有月份act样式
		$(_pageId + "#dateList ul").find("a").removeClass("act");
		
		// 激活本月样式
		var curMonth = curDate.getMonth();
		$(_pageId + "#dateList ul").children().eq(curMonth).find("a").addClass("act");
		
		// 相应tab页签激活样式
		$(_pageId + "#tra_tab_list a").removeClass("act").eq(2).addClass("act");
		
		// 显示银证转账tab页面
		$(_pageId + ".tra_tab_con").hide().eq(1).show();
		
		// 隐藏日期控件
		$(_pageId + "#dateList").hide();
		
		// 先隐藏底部所有按钮 然后显示 “转入银行” 按钮
		$(_pageId + "#transBtn").hide();
		$(_pageId + "#dateBtn").show();
		
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		/*
		 * 选择银行
		 */
		appUtils.bindEvent(_pageId + "#tra_tab_1 strong", function(){
			if ($(this).next().css("display") == "none") {
				$(_pageId + "#tra_tab_1 ul").show();
			} else {
				$(_pageId + "#tra_tab_1 ul").hide();
			}
		});
		
		// 银证转账tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("act")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("act");
			
			// 设置当前tab act样式
			$(this).find("a").addClass("act");
			
			if (index == 0) {
				initBankToStockView(); // 初始化银行转证券界面
			} else if (index == 1) {
				initStockToBankView(); // 初始化证券转银行界面
			} else if (index == 2) {
				initQueryView(); // 初始化查询界面
				// 查询银证转账流水
				cleanQueryParam();
				nowTime(); // 获取默认查询时间（当前月份）
				//queryStockBank();
			}
		});
		
		// 金额只能是数字
		appUtils.bindEvent(_pageId + "#moneyInput", function(){
			putils.numberLimit(_pageId + "#moneyInput"); 
			if (validatorUtil.isEmpty($(this).val())) {
				$(this).val("0");
			}
		}, "blur");
		
		// 获取焦点时，如果金额为0 则清空
		appUtils.bindEvent(_pageId + "#moneyInput", function(){
			var inputValue = $(this).val();
			if ($.trim(inputValue) == "0") {
				$(this).val("");
			}
		}, "focus");
		
		// 银行转证券提交按钮
		appUtils.bindEvent(_pageId + "#transBtn", function(){
			if (!checkInput()) {
				return;
			}
			
			var pwd1 = "";
			if ($(_pageId + "#fundPwdInput").css("display") != "none") {
				pwd1 = $(_pageId + "#fundPwdInput").val();
			}
			
			var pwd2 = "";
			if ($(_pageId + "#bankPwdInput").css("display") != "none") {
				pwd2 = $(_pageId + "#bankPwdInput").val();
			}
			var param = {
				"pwd1" : pwd1,
				"pwd2" : pwd2
			}
			
			common.rsaEncrypt(param, trans);
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
			pageGlobal.param.startDate = year + "-" + month + "-" + "01";
			pageGlobal.param.endDate = year + "-" + month + "-" + days;
			
			$(_pageId + "#dateList").hide();
			
			// 初始化当前页
			pageGlobal.curPage = 1;
			// 查询数据
			queryStockBank();
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
	}
	
	/*
	 * 银行转证券 校验金额、密码文本框
	 * @param type 转账类型
	 */
	function checkInput(){
		var money = $(_pageId + "#moneyInput").val();
		putils.numberLimit($(_pageId + "#moneyInput")); 
		if (validatorUtil.isEmpty(money)) {
			layerUtils.iMsg(-1, "金额不能为空");
			return false;
		}
		
		if (money <= 0) {
			layerUtils.iMsg(-1, "金额必须大于0");
			$(_pageId + "#moneyInput").val("0");
			return false;
		}
		
		// 最大金额数
		var maxMoney = $(_pageId + "#maxMoney").attr("max");
		
		// 证券转银行时，需要校验金额不能 大于 可转金额
		if (pageGlobal.transType == "2" && Number(money) > Number(maxMoney)) {
			layerUtils.iMsg(-1, "转出金额不能大于可转金额");
			$(_pageId + "#moneyInput").val(""); // 清空转账金额文本框
			$(_pageId + "#fundPwdInput").val(""); // 清空交易密码文本框
			$(_pageId + "#bankPwdInput").val(""); // 清空银行密码文本框
			$(_pageId + "#moneyInput").focus(); // 获取转账金额焦点
			
			return false;
		}
		
		var fundPwdEle = $(_pageId + "#fundPwdInput");
		if ($(_pageId + "#fundPwdDiv").css("display") != "none" && validatorUtil.isEmpty(fundPwdEle.val())) {
			layerUtils.iMsg(-1, "资金密码不能为空");
			return false;
		}
		
		var bankPwdEle = $(_pageId + "#bankPwdInput");
		if ($(_pageId + "#bankPwdDiv").css("display") != "none" && validatorUtil.isEmpty(bankPwdEle.val())) {
			layerUtils.iMsg(-1, "银行密码不能为空");
			return false;
		}
		
		// 取当前选中的银行卡号
		var selectedLiEle = $(_pageId + "#tra_tab_1 ul li[selected='selected']");
		var bankCardNo = "";
		if (selectedLiEle && selectedLiEle.length > 0) {
			bankCardNo = selectedLiEle.attr("bankCardNo");
		}
		
		if(validatorUtil.isEmpty(bankCardNo)){
			layerUtils.iMsg(-1, "银行卡号为空");
			return false;
		}
		
		return true;
	}
	
	
	/*
	 * 银证转账
	 * @param backParam 密码对象
	 */
	function trans(backParam){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var money = $(_pageId + "#moneyInput").val();
		var selectedLiEle = $(_pageId + "#tra_tab_1 ul li[selected='selected']");
		var param = {
			"user_id" : pageGlobal.userId,
			"fund_account" : pageGlobal.fundAccount,
			"trans_type" : pageGlobal.transType, // 转账类型
			"fund_amount" : money,
			"bank_no" : selectedLiEle.attr("bankNo"),
			"bank_card_no" : selectedLiEle.attr("bankCardNo"),
			"fund_pwd" : backParam[0], 
			"bank_pwd" : backParam[1]
		}
		
		service.bankTrans(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				// 初始化查询界面
				initQueryView(); 
				// 查询银证转账流水
				cleanQueryParam();
				nowTime();
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/*
	 * 获取当前年月（默认查询条件）
	 */
	function nowTime(){
		var curDate = new Date();
		var _year = curDate.getFullYear(); // 当前年份
		var _month = curDate.getMonth()+1; // 当前月份
		var _days = common.getDaysByYearAndMonth(_year, _month);
		
		if (_month < 10) {
			_month = "0" + _month;
		}
		// 查询条件赋值
		pageGlobal.param.startDate = _year + "-" + _month + "-" + "01";
		pageGlobal.param.endDate = _year + "-" + _month + "-" + _days;
		queryStockBank();
	}
	
	/*
	 * 查询
	 */
	function queryStockBank(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		
		var userInfo = JSON.parse(appUtils.getSStorageInfo("userInfo"));
		var containerTop = $(_pageId + "#v_container_list").offset().top; // 滚动区域距离页面顶部距离
		var containerHeight = $(window).height() - containerTop; // 滚动区域高度 = 窗口高度 - 距离顶部距离
		var param = {
			"user_id" : userInfo.user_id,
			"start_date" : pageGlobal.param.startDate,
			"end_date" : pageGlobal.param.endDate,
			"fund_account" : userInfo.fund_account,
			"page" : pageGlobal.curPage,
			"numPerPage" : "8"
		}
		
		service.changeQuery(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				pageGlobal.maxPage = results[0].totalPages; // 总页数
				//处理返回结果
				groupQueryResult(results[0].data);
			}else{
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
			var trans_date = item.trans_date;
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
				var trans_date = item.trans_date;
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
		
		var myOrderListEle = $(_pageId + ".my_order_list");
		if (dates && dates.length == 0) {
			$(_pageId + ".no_data_box").show();
			$(_pageId + "#v_container_list").hide();
			return;
		} else {
			$(_pageId + ".no_data_box").hide();
			$(_pageId + "#v_container_list").show();
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
				var dateItemHtml = '<div class="month_list">'+
									'	<h3>' + dateStr + '</h3>'+
									'	<ul id="monthList_' + date.replace("-", "_") + '">'+
									'	</ul>'+
									'</div>';
				myOrderListEle.append(dateItemHtml);
				
				// 把当前日期更新到历史日期数组中
				pageGlobal.historyDates.push(date);
			} 
			
			var monthListEle = $(_pageId + ".my_order_list #monthList_" + date.replace("-", "_"));
			var datasItem = group[date]; // 对应月份的数据集
			
			for (var j = 0; j < datasItem.length; j++) {
				var item = datasItem[j];
				var transTypeTemp = item.trans_type; // 转账类型
				var dateTime = item.trans_date + " " + item.trans_time; // 转账时间
				var fundAmountStr = common.fmoney(item.fund_amount,2); // 转账金额
				var bankName = item.bank_name; // 银行名称
				var transStatusTxt = item.trans_status_txt; // 转账状态说明
				var errorInfo = item.error_info; // 转账状态说明
				
				var transTypeName = "证券转银行"; // 转账类型名称
				if (transTypeTemp == 1) {
					transTypeName = "银行转证券";
					fundAmountStr = "+" + fundAmountStr;
				} else if (transTypeTemp == 2) {
					transTypeName = "证券转银行";
					fundAmountStr = "-" + fundAmountStr;
				} else if (transTypeTemp == 3) {
					transTypeName = "证券余额查询";
				} else if (transTypeTemp == 4) {
					transTypeName = "银行余额查询";
				} else {
					console.log(transTypeTemp);
				}
				
				var itemHtml = '<li>' + 
								'	<div class="ui layout">' + 
								'		<div class="row-2">' + 
								'			<h4>' + transTypeName + '</h4>' + 
								'			<p>' + dateTime + '</p>' + 
								'		</div>' + 
								'		<div class="row-1">' + 
								'			<h4 class="ared">' + fundAmountStr + '</h4>' + 
								'			<p>' + bankName + '</p>' + 
								'		</div>' + 
								'	</div>' + 
								'   <div style="color: #ff6666">' + errorInfo + '</div>' +
								'</li>';;
				
				monthListEle.append(itemHtml);
			}
		}
		
		pageScrollInit(resultDataLen);
		
	}
	
	/**
	 * 如果curPage = 1 则清空列表同时清空日期数组
	 */
	function initParam(){
		if (pageGlobal.curPage == 1) {
			$(_pageId + ".my_order_list").empty(); // 清空页面列表
			pageGlobal.historyDates = []; // 清空历史日期数组
		}
	}
	
	/*
	 * 清空查询条件
	 */
	function cleanQueryParam(){
		$(_pageId + ".my_order_list").empty();
		pageGlobal.curPage = 1; //当前也码
		pageGlobal.maxPage = 0; // 总页数
		pageGlobal.param = {}; // 查询对象
		pageGlobal.historyDates = [];
		
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_list").offset().top;
		var height2 = $(window).height() - height - 60;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_list"), 
				"wrapper" : $(_pageId + "#v_wrapper_list"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					queryStockBank();
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
						queryStockBank();
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
			$(_pageId+".visc_pullUp").hide();
		}else{
			$(_pageId+".visc_pullUp").show();
		}	
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		cleanQueryParam();
		vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	}
	
	var stockBank = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = stockBank;
});