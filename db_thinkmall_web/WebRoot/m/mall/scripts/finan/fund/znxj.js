define(function(require, exports, module) {
	var _pageId = "#finan_fund_znxj "; // 页面id
	var pageCode = "finan/fund/znxj";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"yield" :"0" , // 收益率， 即 滚动条 的位置
			"maxyie":"", //数据库中取的最大收益率
			"yieType": "1", //收益率类型
			"yieldData" : "", // 缓存最高收益率
			"enumData" : [], // 用户缓存数据字典信息item_name,item_value
			"fund_type" : ""
		}
	var min_mouth_rate = "" ,max_mouth_rate = "" ,min_season_rate = "" ,max_season_rate = "" ,min_half_year_rate = "" ,max_half_year_rate = "" ,min_year_rate = "" ,max_year_rate = "";
	
	/*
	 * 初始化
	 */
	function init() {
		// 底部导航
		common.footerTab(_pageId);
		
		// 获取最高收益缓存到本地
		getFundMaxYie();
		
		//查询收益率最高的产品
		queryRoehignProduct();
		
	}
	
	/*
	 * 初始化页面
	 */
	function initView(){
		
	}
	
	/*
	 * 获取最高收益率
	 */
	function getMaxYield(yieldMonth){
		var item = pageGlobal.yieldData;
		switch (yieldMonth) {
		case "1":
			pageGlobal.maxyie = item.maxyieldrate1m; // 最高近一月收益率
			break;
		case "3":
			pageGlobal.maxyie = item.maxyieldrate3m; // 最高近三月收益率
			break;
		case "6":
			pageGlobal.maxyie = item.maxyieldrate6m; // 最高近六月收益率
			break;
		case "12":
			pageGlobal.maxyie = item.maxyieldrate1y; // 最高近一年收益率
			break;
		}
		var x = $(_pageId+" #myrange").attr("value");
		$(_pageId+" #maxyield").html(Math.ceil(pageGlobal.maxyie)+"%");
		pageGlobal.yield=(pageGlobal.maxyie / 100) * x;
		$(_pageId+" #profit").html(toFixed(pageGlobal.yield,1,'0')+"%");
		findFund(pageGlobal.yield);
		var yields = pageGlobal.yield;
		var text = '';
		if(yields<1 && yields>=0){
			text = '低';
		}
		if(yields<3 && yields>=1){
			text = '适中';
		}
		if(yields<5 && yields>=3){
			text = '中高';
		}
		if(yields>=5){
			text = '高'
		}
		text = '目前收益中,产品风险'+text+'哦';
		$(_pageId+" .thempt").html(text);
	}
	
	/**
	 * 作者：万亮
	 * @param strValue：处理数据
	 * @param 默认数据
	 */
	function toFixed(strValue,length,defaultValue){
		if(!strValue && strValue!='0'){
			return defaultValue?defaultValue:"--";
		}
		if(isNaN(strValue)){
			return defaultValue?defaultValue:strValue;
		}
		var value = parseFloat(strValue,"10");
//		return Math.round(strValue*Math.pow(10, length))/Math.pow(10, length);   
		var returnValue = Math.round(value*Math.pow(10, length))/Math.pow(10, length);
		var returnStr = returnValue.toString();
		var returnPoint = returnStr.indexOf(".");
		if(returnPoint < 0){
			returnPoint = returnStr.length;
			returnStr += ".";
		}
		var lengthValue = returnPoint + length;
		while(returnStr.length <= lengthValue ){
			returnStr += "0";
		}
		return returnStr;
	}
	
	/*
	 * 缓存最高收益率
	 */
	function getFundMaxYie(yieldMonth){ 
		var param = {
				"fund_type" : pageGlobal.fund_type
			};
		
		var callback =  function (resultVo){
			if(resultVo.error_no == 0){
				var item = resultVo.results[0];
				var maxyieldrate1m = item.maxyieldrate1m;
				var maxyieldrate3m = item.maxyieldrate3m;
				var maxyieldrate6m = item.maxyieldrate6m;
				var maxyieldrate1y = item.maxyieldrate1y;
				
				pageGlobal.yieldData = {
						"maxyieldrate1m" : maxyieldrate1m,
						"maxyieldrate3m" : maxyieldrate3m,
						"maxyieldrate6m" : maxyieldrate6m,
						"maxyieldrate1y" : maxyieldrate1y
					}
				getMaxYield(pageGlobal.yieType); 
				
			}else{
				layerUtils.iAlert("查询最大收益失败:"+resultVo.error_info,-1);
			}
		}
		service.getFundMaxYie(param,callback);
	}
	
	/*
	 * 查询基金列表
	 */
	function findFund(yield){
		// 判断现在的收益类型
		cleaninfo();
		switch(pageGlobal.yieType){
		case "1":
			min_mouth_rate = yield;
			max_mouth_rate = Number(yield) + Number(0.5);
			break;
		case "3":
			min_season_rate = yield;
			max_season_rate = Number(yield) + Number(0.5);
			break;
		case "6":
			min_half_year_rate = yield;
			max_half_year_rate = Number(yield) + Number(0.5);
			break;
		case "12":
			min_year_rate = yield;
			max_year_rate = Number(yield) + Number(0.5);
			break;
		}
		var param = {
			"min_mouth_rate" : min_mouth_rate,	
			"max_mouth_rate" : max_mouth_rate,	
			"min_season_rate" : min_season_rate,	
			"max_season_rate" : max_season_rate,	
			"min_half_year_rate" : min_half_year_rate,	
			"max_half_year_rate" : max_half_year_rate,	
			"min_year_rate" : min_year_rate,
			"max_year_rate" : max_year_rate,
			"fund_type" : pageGlobal.fund_type,
			"product_shelf" : "1"// 上线产品
		};
		
		service.findFund(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var result = data.results[0];
				var totalRows = result.totalRows; // 查询出来的行数
				$(_pageId + ".thereport span").html(totalRows);
			}
		});
	}
	
	function queryRoehignProduct(){
		var param = {
				"is_rate" : 1, // 按收益率排行
				"page" : 1, 
				"numPerPage" : 8
			};
		service.queryAllProduct(param,function(resultVo){
			if(0==resultVo.error_no){
				var itemHtml = "";
				var results = resultVo.results[0].data;
				var sylgEle = $(_pageId+"#sylg").empty();
			    if(results.length > 0){
					for(var i = 0; i < 2; i++){
						var item = results[i];
						var productName = item.product_name; // 产品名称
						var productSubType = item.product_sub_type; // 产品类型
						var productId = item.product_id; // 产品编号
						var productCode = item.product_code; // 产品代码
						var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
						var yield1 = parseFloat(yieldrate1m).toFixed(2);
						var currentPrice = item.current_price || "0"; // 单位净值
						var dwjz = parseFloat(currentPrice).toFixed(4);
						productName = putils.delProSpecialStr(productName);
						var qgjg = item.per_buy_limit;
						var riskLevel = item.risk_level;// 风险等级
						
						var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
						var showNameThree = showFiledThreeObj.name;
						var showValueThree = (showFiledThreeObj.value).toString();
						showValueThree = showValueThree.replace("万", "<em>万</em>");
						fund_type=item.fund_type;
						switch (riskLevel) {
						
						case "1":
							riskLevel=putils.riskLevel(riskLevel);
							break;
							
						case "2":
							riskLevel=putils.riskLevel(riskLevel);
							break;
							
						case "3":
							riskLevel=putils.riskLevel(riskLevel);
							break;
							
						case "4":
							riskLevel=putils.riskLevel(riskLevel);
							break;
							
						case "5":
							riskLevel=putils.riskLevel(riskLevel);
							break;
							
						case "6":
							riskLevel=putils.riskLevel(riskLevel);
							break;

						default:
							break;
						}
						
					   itemHtml+='<div class="plin jxjj" fundType='+fund_type+' productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">'+
							'<div class="plin_r">'+
								'<p class="sp01">'+yield1+'<span>%</span></p>'+
								'<p class="sp02">近一个月收益率</p>'+
							'</div>'+
							'<div class="plin_l">'+
								'<p class="sp01">'+productName+'</p>'+
								'<p class="sp02">单位净值：'+dwjz+'元</p>'+
								'<p class="sp03"><span class="san01">'+showValueThree+'元起购</span><span class="san02">'+riskLevel+'风险</span></p>'+
							'</div>'+
					   '</div>';
					
					}
					sylgEle.append(itemHtml);
					// 绑定详情事件
					appUtils.bindEvent(_pageId + ".plin", function(){
						var curEle = $(this);
						productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
					});
			    }
			}else{
				layerUtils.iAlert("查询优选基金列表失败:"+resultVo.error_info,-1);
			}
		})
	}
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		if (productCode == global.product_code) {
			// 现金管家详情
			var userInfo = appUtils.getSStorageInfo("userInfo");
			if (userInfo) {
				var user_id = JSON.parse(userInfo).user_id;
				if (user_id) {
					appUtils.pageInit(pageCode, "account/cashbutler/detail", {});
					return false;
				}
			}
			
			appUtils.pageInit(pageCode, "login/userLogin", {});
			return false;
			
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	function cleaninfo(){
		min_mouth_rate = "" ,
		max_mouth_rate = "" ,
		min_season_rate = "" ,
		max_season_rate = "" ,
		min_half_year_rate = "" ,
		max_half_year_rate = "" ,
		min_year_rate = "" ,
		max_year_rate = "";
	}
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			appUtils.pageInit(pageCode, "account/userCenter", {});
			return false;
		});
		
		//更多筛选
		appUtils.bindEvent(_pageId + ".moreduo", function(){
			appUtils.pageInit(pageCode, "finan/fund/gdsx");
		})
		
		appUtils.bindEvent(_pageId + ".zfbtn", function(){
			var iszk = $(_pageId + ".zaflist").attr("iszk");
			if(iszk == "false"){
				$(".zaflist").attr("style","display:block");
				$(".blockbg").attr("style","display:block");
				$(_pageId + ".zaflist").attr("iszk","true");
			}
			if(iszk == "true"){
				$(".zaflist").attr("style","display:none");
				$(".blockbg").attr("style","display:none");
				$(_pageId + ".zaflist").attr("iszk","false");
			}
		});
		
		//选择年化收益率
		appUtils.bindEvent(_pageId + ".zaflist ul li", function() {
			$(".zaflist li").removeClass();
			var cur = $(this).index();
			$(_pageId + ".zflist").hide();
			$(_pageId + ".blockbg").attr("style","display:none;");
			var value = $(this).text();
			$(_pageId + ".zaflist").attr("style","display:none;");
			$(_pageId + ".zaflist").attr("iszk","false");
			$(_pageId + ".zfbtn span").html(value);
			$(this).attr("class","on");
			switch (cur) {
			case 0:
				pageGlobal.yieType = "1";
				getMaxYield("1");
				break;
			case 1:
				pageGlobal.yieType = "3";
				getMaxYield("3");
				break;
			case 2:
				pageGlobal.yieType = "6";
				getMaxYield("6");
				break;
			case 3:
				pageGlobal.yieType = "12";
				getMaxYield("12");
				break;
			}
		});
		
		//滑动点变化
		$(_pageId+" #myrange").change(function(){
			var x = $(this).attr("value");
			pageGlobal.yield=(pageGlobal.maxyie / 100) * x;
			var yields = pageGlobal.yield;
			$(_pageId+" #profit").html(toFixed(pageGlobal.yield,1,'0')+"%");
			findFund(pageGlobal.yield);
			

			var text = '';
			if(yields<1 && yields>=0){
				text = '低';
			}
			if(yields<3 && yields>=1){
				text = '适中';
			}
			if(yields<5 && yields>=3){
				text = '中高';
			}
			if(yields>=5){
				text = '高'
			}
			text = '目前收益中,产品风险'+text+'哦';
			$(_pageId+" .thempt").html(text);
		});
		
		
		// tab栏切换
		appUtils.bindEvent(_pageId + ".flex-father a", function(){
			if ($(this).hasClass("curent")) {
				return;
			} 
			$(this).addClass("curent").siblings("a").removeClass("curent");
			
			var index = $(_pageId + " .flex-father a").index(this);
			pageGlobal.fund_type = "";
			
			if (index == 0) {
				// 全部
				pageGlobal.fund_type = "";
			} else if (index == 1) {
				// 混合型
				pageGlobal.fund_type = constants.fundType.HH;
			} else if (index == 2){
				// 债券型
				pageGlobal.fund_type = constants.fundType.ZQ;
			} else if (index == 3){
				// 股票型
				pageGlobal.fund_type = constants.fundType.GP;
			}else if(index == 4){
				//货币型
				pageGlobal.fund_type = constants.fundType.HB;
			}else if(index == 5){
				// 指数型
				pageGlobal.fund_type = constants.fundType.ZS;
			}else{
				//QDII基金
				pageGlobal.fund_type = constants.fundType.QDII;
			}
			getFundMaxYie();
		});
		
		appUtils.bindEvent(_pageId + "#search",function(){
			appUtils.pageInit(pageCode, "finan/fund/sxjg", 
					{"min_mouth_rate" : min_mouth_rate,"max_mouth_rate" : max_mouth_rate,"min_season_rate" : min_season_rate,
				"max_season_rate" : max_season_rate,"min_half_year_rate" : min_half_year_rate,"max_half_year_rate" : max_half_year_rate,
				"min_year_rate" : min_year_rate,"max_year_rate" : max_year_rate,"fund_type" : pageGlobal.fund_type,"yieType" : pageGlobal.yieType});
		});
		
		//搜索
		appUtils.bindEvent(_pageId + ".per_search", function(){
			appUtils.pageInit(pageCode,"finan/fund/search");
		});
		
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			$(_pageId + ".blockbg").attr("style","display:none");
			$(_pageId + ".zaflist").attr("style","display:none;");
			appUtils.pageBack();
		});
		
		//点击遮罩层
		appUtils.bindEvent(_pageId + ".blockbg", function(){
			$(this).attr("style","display:none");
			$(_pageId + ".zaflist").attr("style","display:none;");
			$(_pageId + ".zaflist").attr("iszk","false");
		});
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});