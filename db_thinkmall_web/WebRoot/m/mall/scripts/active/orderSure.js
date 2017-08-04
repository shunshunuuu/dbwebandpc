 /**
  * 兑换页面
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_orderSure "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var gconfig = require("gconfig"); // 全局配置对象
	var global = gconfig.global; // 全局配置对象
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"productId" : "", // 产品编号
		"productTypeId" : "", // 产品类型ID, 1:实物，2虚拟
		"maxExchangeValue" : 1, // 最大换购数
		"surplusNum" : 0, // 剩余可购买数 
		"enableIntegral" : 0, // 用户可用积分
		"activeType" : "", // 活动类型
		"totalMoney" : "", // 总资产
		"surplusAmount" : "" // 剩余库存
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 处理ios滚动问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + "#pageContent"));
		
		pageGlobal.productId = appUtils.getPageParam("product_id"); // 活动编号
		pageGlobal.activeType = appUtils.getPageParam("activeType"); // 活动类型
		pageGlobal.surplusAmount = appUtils.getPageParam("surplusAmount"); // 剩余库存
		pageGlobal.totalMoney = appUtils.getPageParam("totalMoney"); // 总资产
		if(pageGlobal.activeType == constants.activeType.ACTIVE_TYPE_ONEMBER){
			$(_pageId + "#is_activeType").show();
		}else{
			$(_pageId + "#is_activeType").hide();
		}
		
		if (!pageGlobal.productId) {
			appUtils.pageInit("active/orderSure", "active/index", {});
			return false;
		}
		
		// 初始化页面
		initView();
		
		// 查询产品详情信息
		queryProductDetails();
		
		// 查询收货人地址
		queryConsignee();
		
		// 查询用户积分
		queryUserIntegral();
		
	}
	
	//用户订单产品购买个人限额
	function userBuyLimit(perLimit){
		var reqParam = {
			"user_id" : common.getUserId(),
			"product_id" : pageGlobal.productId
		}
		
		service.userBuyLimit(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					var product_purchase_amount = item.product_purchase_amount; // 当前产品的用户已购总数
					var surplusNum = parseInt(perLimit) - parseInt(product_purchase_amount); // 可购次数
					if (parseInt(surplusNum) > parseInt(pageGlobal.surplusAmount)){
						surplusNum = pageGlobal.surplusAmount;
					}
					pageGlobal.surplusNum = surplusNum;
//					$(_pageId + "#surplusNum").html();
					if(pageGlobal.activeType == constants.activeType.ACTIVE_TYPE_ONEMBER){
						$(_pageId + "#joinMaxNum").css("margin-left", "-0.58rem").html("每人最多参与" + perLimit + "份，您还可购买" + surplusNum + "份");
					}else if(pageGlobal.activeType == constants.activeType.ACTIVE_TYPE_BUYLIMIT){
						$(_pageId + "#joinMaxNum").css("margin-left", "-0.58rem").html("每人最多兑换" + perLimit + "份，您还可兑换" + surplusNum + "份");
					}
					if (surplusNum == 0) {
						$(_pageId + "#exchange_value").val("0");
						$(_pageId + "#totalIntegral").html("0");
					} else {
						$(_pageId + "#exchange_value").val("1");
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/* @time 2016年4月29日 15:22:47
	 * 获取话费金额
	 */
	function queryBill(totalMoney){
		var bill = "";
		if(totalMoney){
			if(parseFloat(totalMoney) > 10000 && parseFloat(totalMoney) < 100000){
				bill = "10";
				return bill;
			}else if(parseFloat(totalMoney) > 100000 && parseFloat(totalMoney) < 200000){
				bill = "20";
				return bill;
			}else if(parseFloat(totalMoney) > 200000 && parseFloat(totalMoney) < 500000){
				bill = "50";
				return bill;
			}else if(parseFloat(totalMoney) > 500000){
				bill = "100";
				return bill;
			}
		}else{
			bill = "0";
			return bill;
		}
	}
	
	/*
	 * 查询东北米
	 */
	function queryUserIntegral(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		var param = {
			"user_id" : common.getUserId()
		};
		
		service.queryUserIntergral(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var item = data.results[0];
				var enableIntegral = item.enable_integral || "0"; // 可用积分
				pageGlobal.enableIntegral = enableIntegral;
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		$(_pageId + "#windowSubmit").hide(); // 隐藏提交成功框
		$(_pageId + "#windowAddress").hide(); // 隐藏地址框
		$(_pageId + "#addressList").find("li .layout").remove();
	}
	
	/*
	 * 查询活动产品详情
	 */
	function queryProductDetails(productId){
		var reqParam = {
			"product_id" : pageGlobal.productId
		};
		service.activePdtDetail(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					var productId = item.product_id; // 产品编号
					var imgUrl = item.img_url_s; // 图片地址
					imgUrl = global.url + '/mall' + imgUrl;
					var actPdtName = item.product_name; // 产品名称
					var actIntegral = item.act_integral; // 活动积分【优先用活动积分】
					var productIntegral = item.product_integral; // 活动所需积分
					if (validatorUtil.isEmpty(actIntegral)) {
						actIntegral = productIntegral;
					}
					var perLimit = item.per_limit; // 每人限购次数
					pageGlobal.maxExchangeValue = perLimit;
					pageGlobal.productTypeId = item.product_type_id; //产品类型表主键
					
					$(_pageId + "#actPdtName").html(actPdtName);
					var bill = queryBill(pageGlobal.totalMoney); // 获取话费信息
					if(productId && productId == constants.active_product.product_gh){
						$(_pageId + "#productIntegral").html("恭喜获得"+ bill +"元话费");
					}else{
						$(_pageId + "#productIntegral").html('<i class="mon_icon"></i>' + actIntegral + '东北米');
					}
					$(_pageId + "#totalIntegral").html(actIntegral); 
					$(_pageId + "#productImg").attr("src", imgUrl);
					$(_pageId + "#unitIntegral").val(actIntegral); 
					
					// 个人可购买份数
					userBuyLimit(perLimit);
				}
				
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 查询收货人信息
	 */
	function queryConsignee(){
		var reqParam = {
			"user_id" : common.getUserId(),
			"type" : 1 //1 查询 2 删除 3 增加
		}
		
		service.addressManage(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results && results.length > 0) {
					var resultsLen = results.length; // 记录结果集长度
					var priceListEle = $(_pageId + "#addressList").empty();
					for (var i = 0; i < resultsLen; i++) {
						var item = results[i];
						var userName = item.user_name; // 用户名
						var mobilePhone = item.mobile_phone; // 手机号码
						var address = item.exprs_address; // 地址
						var exprsId = item.exprs_id; // 地址编号
						var isChecked = item.is_default; // 是否为默认地址  1-默认地址
						if (isChecked == constants.is_default.YES) {
							isChecked = "checked";
						}else{
							isChecked = "";
						}
						var itemHtml = '<li class="ui layout address" id="item_' + exprsId + '">' + 
										'	<div class="check_box chooseAddress" exprsId="' + exprsId + '" mobilePhone="' + mobilePhone + '">' + 
										'		<a href="javascript:void(0);" class="check ' + isChecked + '"></a>' + 
										'	</div>' + 
										'	<div class="row-1 chooseAddress">' + 
										'		<p>' + userName + '  ' + mobilePhone + '</p>' + 
										'		<p>' + address + '</p>' + 
										'	</div>' + 
										'	<div class="list_btn" exprsId="' + exprsId + '">' + 
										'		<a href="javascript:void(0);" class="del_btn">删除</a>' + 
										'	</div>' + 
										'</li>';
						
						priceListEle.append(itemHtml);
					}
					
					// 绑定删除按钮
					appUtils.bindEvent(_pageId + "#addressList li .list_btn", function(){
						var curEle = $(this);
						exprsId = curEle.attr("exprsId");
						delConsignee(exprsId);
					});
					
					// 绑定选中
					appUtils.bindEvent(_pageId + "#addressList .chooseAddress", function(){
						chooseAddress(this);
					});
				}
			}
		});
	}
	
	/*
	 * 选中地址
	 */
	function chooseAddress(selector){
		// 移除其他选中的项
		$(_pageId + "#addressList li .check_box a").removeClass("checked");
		
		// 选中当前点击的选项
		var curEle = $(selector);
		curEle.parent().find(".check_box a").addClass("checked");
	}
	
	/*
	 * 检查输入框的值
	 */
	function checkInput(){
		var mobilePhone = $(_pageId + "#editPhone").val();
		
		if (validatorUtil.isEmpty(mobilePhone)) {
			layerUtils.iMsg(-1, "请您输入手机号码");
			return false;
		}
		
		if (!validatorUtil.isMobile(mobilePhone)) {
			layerUtils.iMsg(-1, "您输入的手机号码格式不正确");
			return false;
		}
		
		return true;
	}
	
	/*
	 * 添加收货人信息
	 */
	function addConsignee(){
		var mobilePhone = $(_pageId + "#editPhone").val();
		var userName = $(_pageId + "#editName").val();
		var address = $(_pageId + "#editAddress").val();
		var isChecked = $(_pageId + "#defaultAddress").attr("checked");
		var is_default = "";
		if(isChecked){
			is_default = constants.is_default.YES;
			console.log("默认地址");
		}else{
			is_default = constants.is_default.NO;
			console.log("非默认地址");
		}
		if (!checkInput()) {
			return false;
		}
		var reqParam = {
			"user_id" : common.getUserId(),
			"type" : 3, // 1 查询 2 删除 3 增加
			"mobile_phone" : mobilePhone, 
			"address" : address, 
			"user_name" : userName,
			"is_default" : is_default
		}
		
		service.addressManage(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				queryConsignee(); // 刷新页面地址信息
				$(_pageId + "#windowAddress").hide();
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 删除收货人信息
	 */
	function delConsignee(exprsId){
		var reqParam = {
			"user_id" : common.getUserId(),
			"exprs_id" : exprsId,
			"type" : 2
		}
		
		service.addressManage(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				$(_pageId + "#item_" + exprsId).remove();
				// 如果删除的是选中状态的地址，选中第一个
				var checkedAddressEle = $(_pageId + "#addressList").find("li .check_box .checked");
				if (checkedAddressEle.length == 0) {
					$(_pageId + "#addressList").find("li .check_box a").eq(0).addClass("checked");
					return false;
				}
			} else {
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 判断用户是否可以兑换
	 */
	function isExchange(){
		
	}
	
	/*
	 *	添加兑换份数 
	 */
	function addExchange(){
		// 份额
		var exchangeValue = $(_pageId +"#exchange_value").val();
		if(!validatorUtil.isEmpty(exchangeValue)){
			if(parseFloat(exchangeValue) < pageGlobal.surplusNum){
				exchangeValue++;
				
				// 产品积分
				var unitIntegral = parseInt($(_pageId + "#unitIntegral").val());
				var totalIntegral = unitIntegral * exchangeValue;
				if (parseFloat(pageGlobal.enableIntegral) < parseFloat(totalIntegral)) {
					layerUtils.iMsg(-1, "您的东北米不足哟~多攒点儿再来吧");
					return false;
				}
				
				$(_pageId + "#exchange_value").val(exchangeValue);
				$(_pageId + "#totalIntegral").html(totalIntegral);
			}
		}else{
			exchangeValue = 1 ;
			$(_pageId+" #exchange_value").val(exchangeValue);
		}
	}
	
	/*
	 *	减少兑换份数 
	 */
	function lessExchange(){
		var exchangeValue = $(_pageId + "#exchange_value").val();
		if(!validatorUtil.isEmpty(exchangeValue)){
			if(parseFloat(exchangeValue) >= 1){
				exchangeValue--;
				$(_pageId+" #exchange_value").val(exchangeValue);
			}else{
				exchangeValue = 0 ;
				$(_pageId+" #exchange_value").val(exchangeValue);
			}
		}else{
			exchangeValue = 0 ;
			$(_pageId+" #exchange_value").val(exchangeValue);
		}
		
		var unitIntegral = parseInt($(_pageId + "#unitIntegral").val());
		$(_pageId + "#totalIntegral").html(unitIntegral * exchangeValue);
	}
	
	/*
	 * 立即兑换
	 */
	function confirmExchange(){
		var checkedAddressEle = $(_pageId + "#addressList").find("li .check_box .checked");
/*		if (checkedAddressEle.length == 0) { // 实物产品需要
			layerUtils.iMsg(-1, "请选择收货地址");
			return false;
		}*/
		checkedAddressEle = checkedAddressEle.eq(0);
		var parentEle = checkedAddressEle.parent();
		var exprsId = parentEle.attr("exprsId");
		var orderPhone = parentEle.attr("mobilePhone");
		var totNum = $(_pageId + "#exchange_value").val();
		if (parseFloat(totNum) <= 0) {
			if (pageGlobal.surplusNum > 0) {
				layerUtils.iMsg(-1, "购买数量必须大于0");
			} else {
				layerUtils.iMsg(-1, "您已兑换过了哟，留些给别人吧～");
			}
			return false;
		}
		var reqParam = {
			"user_id" : common.getUserId(),
			"product_id" : pageGlobal.productId,
			"product_type_id" : pageGlobal.productTypeId,
			"order_phone" : orderPhone,
			"exprs_id" : exprsId,
			"tot_num" : totNum
		}
		
		service.submitActOrder(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					$(_pageId + "#orderId").html(item.order_id);
					$(_pageId + "#windowSubmit").show();
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				$(_pageId + "#windowSubmit").hide();
				return false;
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			var pageParam = appUtils.getPageParam();
			if (pageParam.pageSrc) {
				appUtils.pageInit("active/orderSure", pageParam.pageSrc, pageParam);
				return false;
			}
			appUtils.pageBack();
		});
		
		// 绑定新增按钮
		appUtils.bindEvent(_pageId + "#addMes .add_mes", function(){
			$(_pageId + "#editPhone").val("");
			$(_pageId + "#editName").val("");
			$(_pageId + "#editAddress").val("");
			$(_pageId + "#editRemark").val("");
			$(_pageId + "#windowAddress").show();
		});
		
		// 兑换分数 -
		appUtils.bindEvent(_pageId + ".add_btn", function(){
			lessExchange(); // 减少兑换份数
		});
		
		// 兑换分数+
		appUtils.bindEvent(_pageId + ".less_btn", function(){
			addExchange(); // 添加兑换份数
		});
		
		// 选择收货人信息
		appUtils.bindEvent(_pageId + ".mes_list .check_box", function(){
			var curTab = $(this);
			var subNavList = $(_pageId + ".mes_list .check_box");
			var index = subNavList.index(this);
			subNavList.find("a").removeClass("checked_box");
			curTab.find("a").addClass("checked_box");
			//$(this).find("a").removeClass("checked_box");
		});
		
		// 保存收货人地址saveAddressBtn
		appUtils.bindEvent(_pageId + "#saveAddressBtn", function(){
			addConsignee(); // 添加收货人
		});
		
		// 关闭收货人
		appUtils.bindEvent(_pageId + "#close_btn", function(){
			$(_pageId + "#windowAddress").hide();
		});
		
		// 确认
		appUtils.bindEvent(_pageId + ".sub_btn", function(){
			var totalIntegral = $(_pageId + "#totalIntegral").html() || "0";
			var value = $(_pageId + "#exchange_value").val();
			if (parseInt(value) > parseInt(pageGlobal.surplusNum)) {
				$(_pageId + "#exchange_value").focus();
				return false;
			}
			if (parseFloat(totalIntegral) > parseFloat(pageGlobal.enableIntegral)) {
				layerUtils.iMsg(-1, "您的东北米不足哟~多攒点儿再来吧");
				return false;
			}
			confirmExchange(); // 订单确认
		});
		
		// 查看订单
		appUtils.bindEvent(_pageId + "#viewOrder", function(){
			appUtils.pageInit("active/orderSure", "active/myOrder", {});
		});
		
		// 继续逛逛
		appUtils.bindEvent(_pageId + "#continue", function(){
			appUtils.pageInit("active/orderSure", "active/index", {});
		});
		
		
		// 份数输入框失去焦点校验
		appUtils.bindEvent(_pageId + "#exchange_value", function(){
			var curEle = $(this);
			var value = curEle.val();
			if (parseInt(value) > parseInt(pageGlobal.surplusNum)) {
				setTimeout(function(){
					$(_pageId + "#joinMaxNum").css("color", "#fa727f");
				}, 500);
				setTimeout(function(){
					$(_pageId + "#joinMaxNum").css("color", "#BCB7B1");
				}, 2000);
				curEle.focus();
			} else {
				
			}
		}, "blur");
		
	}
	
	/*清空页面显示值*/
	function clearPage(){
		$(_pageId + "#joinMaxNum").css("margin-left", "-0.58rem").html("");
		$(_pageId + "#exchange_value").val("");
		$(_pageId + "#totalIntegral").html("");
		
		$(_pageId + "#actPdtName").html("");
		$(_pageId + "#productIntegral").html("");
		$(_pageId + "#totalIntegral").html(""); 
		$(_pageId + "#productImg").attr("src", "");
		$(_pageId + "#unitIntegral").val(""); 
		$(_pageId + "#addressList").html("");
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		clearPage();
	}
	
	var orderSure = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = orderSure;
});