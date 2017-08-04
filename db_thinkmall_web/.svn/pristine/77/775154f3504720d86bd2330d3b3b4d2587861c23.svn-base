 /**
  * 我的银行卡
  * @author wanliang
  * 
  */
define(function(require, exports, module){ 
	require("mall/scripts/common/plugins/slide/slide"); // 左滑动删除
	var _pageId = "#account_myBankCard "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var constants = require("constants"); // 常量类
	var global = require("gconfig").global; // 全局对象
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var toBindPrePage = "";//前置跳转页
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"bankNo" : "", // 银行编号
		"client_no" : "", // 理财账户
		"bankAccount" : "" // 银行卡号
	};

	/*
	 * 初始化
	 */
	function init(){
		// 初始化页面
		initView();
		
		// 查询用户绑定的银行卡
		userBank();
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		pageGlobal.client_no = JSON.parse(userInfo).client_no; // 理财账户
		var bankCardList = $(_pageId + "#bankCardList ul").empty();
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			var prePageCode = appUtils.getSStorageInfo("_prePageCode"); 
			if (prePageCode && prePageCode != "login/userLogin" && prePageCode != "register/bankCardSuccess"&& prePageCode != "register/bankCardError") {
				appUtils.pageBack();
			} else {
				// 用户中心
				appUtils.pageInit("account/myBankCard", "account/userCenter", appUtils.getPageParam());
			}
		});
		
		// 首次添加银行卡
		appUtils.bindEvent(_pageId + "#add_cards_btn", function(){
			if (pageGlobal.client_no && pageGlobal.client_no != "") {
				appUtils.pageInit("account/myBankCard", "register/bindBankCard", {});
			}else{
				appUtils.pageInit("account/myBankCard", "register/setTradePwd", {});
			}
			
		});
		
		// 添加银行卡
		appUtils.bindEvent(_pageId + "#add", function(){
			if (pageGlobal.client_no && pageGlobal.client_no != "") {
				appUtils.pageInit("account/myBankCard", "register/bindBankCard", {});
			}else{
				appUtils.pageInit("account/myBankCard", "register/setTradePwd", {});
			}
		});
	}
	
	/**
	 * 查询用户存管银行
	 */
	function getAccountBank(usableAsset){
		var fundAccount = appUtils.getSStorageInfo("fund_account");
		//判断是否绑定资金帐号
		if (!fundAccount) {
			return false;
		}
		var param = {
			"user_id" : appUtils.getSStorageInfo("user_id"),
			"fund_account" : fundAccount
		}
		service.accountBank(param, function(data){
			var results = common.getResultList(data);
			if(results.length && results.length > 0){
				var bankListEle = $(_pageId + "#bankCardList");
				var addFirst = $("#addFirst").hide(); // 首次添加银行卡
				var add = $("#add").show(); // 添加银行卡
				for (var i = 0; i < results.length; i++) {
					var item = results[i];
					var bankName = item.bank_name; // 银行名称
					var bankNo = item.bank_no; // 银行编号
					var bankCardNo = $.trim(item.bank_card_no); // 银行卡号
					var bankImgs = item.bank_img_s; // 银行小图标
					var bankAccount = bankCardNo.substring(0,4) + "**** ****" + bankCardNo.substring(12,bankCardNo.length); // 隐藏银行卡号
					
					var myBankCard = '<li>' +
					 '   <div class="li_con">' +
					 '		<div class="ui layout li_up">' +
					 '			<div class="bank_icon">' +
					 '				<em><img src="' + bankImgs + '" width="24"/></em>' +
					 '			</div>' +
					 '			<div class="row-1 bank_mes">' +
					 '				<h3>' + bankName + '</h3>' +
					 '				<p>' + bankAccount + '</p>' +
					 '			</div>' +
					 '			<div class="bank_txt">' +
					 '				<p>存管银行</p>' +
					 '			</div>' +
					 '		</div>' +
					 '		<div class="li_lower clearfix">' +
					 '			<span>银证转账</span>' +
					 '			<p>可用余额:<em class="ared">' + usableAsset + '</em>元</p>' +
					 '		</div>' +
					 '	</div>' +
					 '</li>';
					bankListEle.append(myBankCard);
				}
				
			} else {
				addFirst.show(); // 显示首次添加银行卡
				add.hide(); // 添加银行卡
			}
		}); 
	}
	
	/*
	 * 查询用户绑定的银行卡(1000197)
	 */
	function userBank(){
		var param = {
				"user_id" : common.getUserId()
			}
		service.userBank(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				var result = data.results;
				var bankCardList = $(_pageId + "#bankCardList ul");
				var addFirst = $("#addFirst").hide(); // 首次添加银行卡
				var add = $("#add").show(); // 添加银行卡
				if(result.length && result.length > 0){
					for (var i = 0; i < result.length; i++) {
						var item = result[i];
						var bankCardNo = $.trim(item.bank_card_no); // 银行卡号
						var bankImgs = item.bank_img_s || "images/bank_p1.png"; // 银行小图标
						var bankAccount = bankCardNo.substring(0,4) + "**** ****" + bankCardNo.substring(12,bankCardNo.length);
						var bankName = item.bank_name + "招商银行"; // 银行名称
						var bankNo = item.bank_no; // 银行编号
						
						var myBankCard = '<li>' +
										 '   <div class="li_con">' +
										 '		<div class="ui layout li_up">' +
										 '			<div class="bank_icon">' +
										 '				<em><img src="' + bankImgs + '" width="24"/></em>' +
										 '			</div>' +
										 '			<div class="row-1 bank_mes">' +
										 '				<h3>' + bankName + '</h3>' +
										 '				<p>' + bankAccount + '</p>' +
										 '			</div>' +
										 '			<div class="bank_txt">' +
										 '				<p>直连银行</p>' +
										 '			</div>' +
										 '		</div>' +
										 '	</div>' +
										 '	<a href="javascript:void(0);"  bAct="' + bankCardNo + '" bNo="' + bankNo + '" bName="' + bankName + '" class="del_btn"><span>删除</span></a>'+
										 '</li>';
						
						bankCardList.append(myBankCard);
					}
					// 选中银行卡
					appUtils.bindEvent(_pageId + "#bankCardList ul li", function(){
						$(this).addClass("active").siblings().removeClass();
					},"touchstart");
					bankCardBindEvent(); // 银行卡事件
				}else{
					addFirst.show(); // 显示首次添加银行卡
					add.hide(); // 添加银行卡
				}
				
			} else {
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	/**
	 * 银行卡事件
	 */
	function bankCardBindEvent(){
		// 删除银行卡事件
		$(".my_cards_list .li_con").swipeEvents().bind("swipeLeft", function(){
	    	$(this).css("transform","translate3d(-55px, 0px, 0px)");
	    });
	    $(".my_cards_list .li_con").swipeEvents().bind("swipeRight", function(){
	    	$(this).css("transform","translate3d(0px, 0px, 0px)");
	    });
	    
		// 删除银行卡
		appUtils.bindEvent(_pageId + ".del_btn", function(){
			pageGlobal.bankNo = $(this).attr("bno");
			pageGlobal.bankAccount = $(this).attr("bact");
			$(_pageId + ".dialog_box").show(); // 遮罩层
			$(_pageId + ".dialog-overlay").show(); // 确认框
		});
		
		// 确定删除银行卡
		appUtils.bindEvent(_pageId + "#enter", function(){
			unbind(pageGlobal.bankNo,pageGlobal.bankAccount); // 解绑银行卡
			$(_pageId + ".dialog_box").hide(); // 遮罩层
			$(_pageId + ".dialog-overlay").hide(); // 确认框
		});
		
		// 取消删除银行卡
		appUtils.bindEvent(_pageId + "#cancel", function(){
			$(_pageId + ".dialog_box").hide(); // 遮罩层
			$(_pageId + ".dialog-overlay").hide(); // 确认框
		});
	}
	
	/*
	 * 解绑银行卡
	 */
	function unbind(bank_no,bankAccount){
		var reqParam = {
			"user_id" : common.getUserId(),
			"bank_no" : bank_no,
			"bank_account" : bankAccount
		};
		service.unbind(reqParam, function(data){
			var results = common.getResultList(data);
			if (results && results.length > 0) {
				var result = results[0];
					layerUtils.iMsg(-1, "解绑成功");  // 解绑成功
					init(); // 刷新页面
				}
		});
	}
	
	/*
	 * 更新session中的数据
	 */
	function updateUserInfoForSession(result){
		var userInfo = appUtils.getSStorageInfo("userInfo");
		userInfo = JSON.parse(userInfo);
		userInfo.fund_account = result.fund_account;
		appUtils.setSStorageInfo("userInfo", JSON.stringify(userInfo));
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var myBankCard = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myBankCard;
});