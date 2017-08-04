/**
 * 风险测评详情
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var gconfig = require("gconfig");
	var global = gconfig.global; // 全局对象
	var service = require("mobileService");// 业务层接口，请求数据
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var _pageId = "#register_riskAssDetail "; // 页面ID
	var putils = require("putils");
	
	var pageGlobal = {
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}

	/* 初始化 */
	function init() {
		initView();
		initSuccessResult();
		
		queryMotifType();
	}
	/*
	 * 初始化页面
	 */
	function initView(){
		var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
		// 移除所有tab act样式
		tabRowEles.find("a").removeClass("act")
		tabRowEles.find("a").eq(0).addClass("act");
		// 个人风险测评
		$(_pageId + " #bank_list").hide();
		$(_pageId + " .results_box").show();
	}
	
	/*
	 * 获取TA公司所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "ta_company_name" 
		}
		
		service.queryEnum(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var bankList = $(_pageId + "#bankList ul").empty();
					for (var i = 0; i < results.length; i++) {
						var result = data.results[i];
						
						var checked = "";
						var item_id = result.item_id; // 值编号 
						var item_name = result.item_name; // 项目名
						var item_value = result.item_value; // 项目值
						var item_name_en = result.item_name_en; // TA公司编号

						// 默认选中第一个
						if(i == 0){
							var checked = 'checked="checked"';
						}
							
						var myBankCard = '<li>'	+
										 '	<div class="ui radio">' +
										 '		<input type="radio" item_name_en = "' + item_name_en + '" item_value = "' + item_value + '" id="radio_' + i + '" name="taBank" ' + checked + ' />' +
										 '		<label for="radio_' + i + '">' + item_name + '' + item_name_en + '</label>' +
										 '	</div>' +
										 '</li>';
						
						bankList.append(myBankCard);
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}

	function initSuccessResult(){
		var risk_level_txt = ""; // 等级
		var risk_level = appUtils.getSStorageInfo("risk_level"); // 风险等级
		switch (risk_level) {
		case "1":
			risk_level_txt = "保守型";
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det round_det2");
			break;
			
		case "2":
			risk_level_txt = "稳健型";
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det");
			break;
			
		case "3":
			risk_level_txt = "积极型";
			$(_pageId + "#riskLevel_value").removeClass().addClass("round_det round_det3");
			break;

		default:
			break;
		}
		$(_pageId + "#riskLevel").html(risk_level_txt);
		$(_pageId + "#riskDesc").html("您的当前风险等级为" + risk_level_txt);
	}
	
	function bindPageEvent() {
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId + ".back_btn"), function() {
			// 参数中携带返回页面时，需要返回到指定页面 ，否则返回到上一级页面
			var pageParam = appUtils.getPageParam();
			if (pageParam) {
				var backPage = pageParam.backPage;
				if (backPage) {
					appUtils.pageInit("register/riskAssSuccess", backPage, pageParam);
					return false;
				}
			}
			
			appUtils.pageBack();
		});
		
		// 重新测评
		appUtils.bindEvent(_pageId + ".btn_box", function(){
			appUtils.pageInit("register/riskAssDetail", "register/riskAssessment", appUtils.getPageParam());
		});
		
		/* 进入测评 */
		appUtils.bindEvent($(_pageId+" .sub_btn_ta"),function(){
			var risk_type_id = $(_pageId + "#bankList").children("ul").children("li").children("div").children("input:radio[name='taBank']:checked").attr("item_value");
			var item_name_en = $(_pageId + "#bankList").children("ul").children("li").children("div").children("input:radio[name='taBank']:checked").attr("item_name_en");
			appUtils.pageInit("register/riskAssessment", "finan/bankRiskAssessment", {"risk_type_id" : risk_type_id , "item_name_en" : item_name_en});
		});
		
		// 个人风险测评和银行理财风险测评tab切换
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
				// 个人风险测评
				$(_pageId + " #bank_list").hide();
				$(_pageId + " .results_box").show();
			} else if (index == 1) {
				// 银行理财产品
				$(_pageId + " .results_box").hide();
				$(_pageId + " #bank_list").show();
				
			}
		});

	}

	function destroy() {
		service.destroy();
	}

	var riskAssDetail = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};

	module.exports = riskAssDetail;

});