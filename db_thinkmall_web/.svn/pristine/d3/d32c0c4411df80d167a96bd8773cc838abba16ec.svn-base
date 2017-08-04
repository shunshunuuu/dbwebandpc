 /**
  * 赎回页面
  * @author wangwz
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#account_redemption "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var gconfig = require("gconfig");
	var validatorUtil = require("validatorUtil"); //校验工具类
	var	platform = gconfig.platform; // 渠道
	var putils = require("putils"); 
	var productId = ""; // 产品ID
	var productType = "0"; // 产品类型
	var applyNo = ""; // 委托编号

	/*
	 * 初始化
	 */
	function init(){
		// 初始化界面
		initView();
		
		// 初始化产品信息
		initProduct();
	}
	
	/*
	 * 初始化界面
	 */
	function initView(){
		$(_pageId + "#numberInput").val("");
		$(_pageId + "#tradePwd").val("");
	}
	
	
	/*
	 * 初始化产品信息
	 */
	function initProduct(){
		var param = appUtils.getPageParam();
		productId = param.productId; // 产品ID
		var productName = param.productName; // 产品名称
		var redeemAmount = param.redeemAmount; // 可赎回份额
		productType = param.subType; // 可赎回份额
		applyNo = param.applyNo; // 委托编号
		productName = putils.delProSpecialStr(productName);
		$(_pageId + "#redeemAmount").html(parseFloat(redeemAmount).toFixed(2)); 
		$(_pageId + "#productName").html(productName);
		
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		/*
		 * 确认赎回
		 */
		appUtils.bindEvent(_pageId + ".sub_btn", function(){
			if (checkInput()) {
				var param = {
					"pwd1" : $(_pageId + "#tradePwd").val()
				}
				redemptionPro(); // 确认赎回
				//common.rsaEncrypt(param, redemptionPro);
			}
		});
		
		// 金额只能是数字
		appUtils.bindEvent(_pageId + "#numberInput", function(){
			putils.numberLimit(_pageId + "#numberInput"); 
		}, "blur");
		
	}
	
	/*
	 * 检测份额是否合法
	 */
	function checkInput(){
		var orderQuantity = $(_pageId + "#numberInput").val();
/*		if (parseInt(orderQuantity) == 0) {
			layerUtils.iMsg(-1, "赎回份额不能为0");
			return false;
		}*/
		if (validatorUtil.isEmpty(orderQuantity)) {
			layerUtils.iMsg(-1, "赎回份额不能为空");
			return false;
		}
		
		var maxQuantity = $(_pageId + "#redeemAmount").val();
		
		if (parseFloat(orderQuantity) > parseFloat(maxQuantity)) {
			layerUtils.iMsg(-1, "赎回份额不能大于可赎回份额数");
			return false;
		}
		
		return true;
	}
	
	/*
	 * 赎回
	 */
	function redemptionPro(backParam){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(true, true)) {
			return false;
		}
		var orderQuantity = $(_pageId + "#numberInput").val();
		var param = {
			"product_id" : productId,
			"user_id" : common.getUserId(),
			"order_quantity" : orderQuantity,
			"order_channel" : platform, 
			"product_sub_type" : productType,
			"apply_no" : applyNo,
			"money_type" : "0"
		}
		
		service.redemption(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results[0].data;
				// 赎回成功后跳转到 订单页面
				appUtils.pageInit("account/redemption", "account/myOrder", {});
			}else{
				layerUtils.iMsg(-1,error_info);
			}
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var redemption = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = redemption;
});