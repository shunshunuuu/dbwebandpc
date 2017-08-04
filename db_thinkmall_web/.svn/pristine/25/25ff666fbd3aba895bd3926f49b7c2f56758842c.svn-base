define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
    var pageCode = "finan/fund/dtjx";
    var _pageId = "#finan_fund_dtjx "; // 页面id
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}
	
	var productStatus = "";
	
	/*
	 * 初始化
	 */
	
	function init() {
		$(_pageId + ".home_btn").attr("href", global.appIndexUrl);
		
		// banner图
		cashbutlerAdvert();
		
		//查询定投精选的内容
		queryDtjx();
		
		// 底部导航
		common.footerTab(_pageId);
	}
	
	/*
	 * 首页banner图
	 */
	function cashbutlerAdvert() {
		var cashbutlerAdverBackFun = function(result){
			
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + ".jp_banner").empty();
			if (result.length > 0) {
				var item = result[0];
				var imgPath = item.picture ? item.picture : item.small_picture; // 图片地址
				var file_state = item.file_state; // 文件状态是否有效
				if (file_state != "1") {
					return;
				}
		
				imgPath = global.url + '/mall' + imgPath;
				var linkUrl = ""; // 链接地址
				var state = item.state; // 链接是否有效
				if (state == "1") {
					linkUrl = item.url;
				} else {
					linkUrl = "javascript:void(0)";
				}
				
				var itemHtml = 	'<a href="' + linkUrl + '">' +
								'	<img src="' + imgPath + '"  width="100%"/>' + 
								'</a>';
				
				adAreaEle.append(itemHtml);
			}
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_JJ_DTJX;
		queryAdvert(groupId, cashbutlerAdverBackFun);
	};
	
	
	/*
	 * 根据广告组ID查询广告信息
	 * @param groupId 广告组ID
	 * @param callBackFun 处理结果集的回调函数
	 */
	function queryAdvert(groupId, callBackFun) {
		var param = {
			"group_id" : groupId, // 广告组编号
			"ad_id" : "" // 广告编号
		};
		
		service.queryAd(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if (error_no == "0") {
				var result = data.results;
				
				// 返回结果集处理
				callBackFun(result);
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	};
	
	function queryDtjx(isAppendFlag){
		var param = {
				"page" : pageGlobal.curPage, 
				"numPerPage" : 10,
			    "is_year_rate" : 1,//近一年收益率  0 升序 1降序
			    "product_shelf" : "1",// 上线产品
			    "fund_investment" : "0"  //定投基金的标志
			};
		var dtProduct = $(_pageId + "#dtjx").empty();
		service.findFund(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
				var resultDataLen = results.length; // 记录结果集长度
				if(resultDataLen > 0){
					for(var i = 0; i < 10; i++){
						var itemHtml="";
					
						var item = results[i];
						var productName = item.product_name; // 产品名称
						productName = putils.delProSpecialStr(productName);
						if (productName.length > 7) {
							productName = productName.substring(0, 6) + "...";
						}
						var productSubType = item.product_sub_type; // 产品类型
						var productId = item.product_id; // 产品编号
						var productCode = item.product_code; // 产品代码
						var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
						var yieldrate3m = item.yieldrate3m || "0"; // 近三个月收益率
						var yieldrate6m = item.yieldrate6m || "0"; // 近六个月收益率
						var yieldrate1y = item.yieldrate1y || "0"; // 近一年收益率
						var yield1m = parseFloat(yieldrate1m).toFixed(2);
						var yield3m = parseFloat(yieldrate3m).toFixed(2);
						var yield6m = parseFloat(yieldrate6m).toFixed(2);
						var yield1y = parseFloat(yieldrate1y).toFixed(2);
						var currentPrice = item.current_price || "0"; // 单位净值
						var dwjz = parseFloat(currentPrice).toFixed(4);
						var productSubType = item.product_sub_type;// 产品类型 0基金 1理财
						var followId = item.follow_id; // 关注编号
						productStatus = item.product_status;//产品状态
						var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
						var showNameThree = showFiledThreeObj.name;
						var showValueThree = (showFiledThreeObj.value).toString();
						showValueThree = showValueThree.replace("万", "<em>万</em>");
						var isyield = yield1y.substr(0,1);
						var classes = "";
						if(isyield == "-"){
							classes = "span02 agreen";
						}else{
							classes = "span02 ared";
						}
						
						itemHtml = '<li productId="'+productId+'" productCode="' + productCode + '" productSubType="'+productSubType+'" productStatus="'+productStatus+'">' +
							'<span class="span01">' +
						      '<em>'+productName+'</em>' +
						      '<i>'+productCode+'</i>' +
					        '</span>' +
					       ' <span class="'+classes+'">'+yield1y+'</span>' +
					       ' <span class="span03">'+currentPrice+'</span>' +
					       ' <span class="span04">' +
						        '<a id="goumai" href="javascript:void(0);">定投</a>' +
					        '</span>' +
				          '</li>';
						dtProduct.append(itemHtml);
					}
				}else{
					$(_pageId + ".no_data_box").show();
				}
				
				
			
				bindProEvent();
				
			}else{
				layerUtils.iAlert("查询基金列表失败:"+resultVo.error_info,-1);
			}
		});
	}
	
	
	/*
	 * 绑定产品详情/关注事件
	 */
	function bindProEvent(){
		// 点击 名称进入详情
		appUtils.bindEvent(_pageId + ".span01", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		appUtils.bindEvent(_pageId + ".span02", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		appUtils.bindEvent(_pageId + ".span03", function(){
			var proEle = $(this).parent();
			var productSubType = proEle.attr("productSubType");
			var productId = proEle.attr("productId");
			var productCode = proEle.attr("productCode");
			productDetail(productId, productSubType, productCode);
		}, 'click');
		
		// 立即定投
		appUtils.bindEvent($(_pageId + "#goumai"), function(){
			var productStatus = $(this).parent().parent().attr("productStatus");
            if(checkProductStatus(productStatus)){
            	var gzEle = $(this).parent().parent();
				var productId=gzEle.attr("productId");
				var productCode=gzEle.attr("productCode");
				var param = {
						"product_id" : productId,
						"product_code" : productCode
				}
				var _loginInPageCode = "finan/fixedInvestment/placeOrder";
				if (common.checkUserIsLogin(true, false, _loginInPageCode, param, true)) {
					appUtils.pageInit("finan/detail", "finan/fixedInvestment/placeOrder", param);
					return false;
				}
			}
		},'click');
	}
	
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		// 非现金管家
		if(subType == constants.product_sub_type.FUND){
			// 基金产品详情
			appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
		}else if(subType == constants.product_sub_type.FINANCIAL){
			// 理财产品详情
			appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
		}
		
	}
	
	
	/*
	 * 校验产品是否能够购买
	 */
	function checkProductStatus(productStatus){
		if (productStatus != "0" && productStatus != "1" && productStatus != "2") {
			layerUtils.iMsg(-1, "该产品非购买时期");
			return false;
		}
		return true;
	}
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 登录
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			appUtils.pageInit(pageCode, "account/userCenter", {});
			return false;
		});
		
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		//搜索
		appUtils.bindEvent(_pageId + ".per_search", function(){
			appUtils.pageInit(pageCode, "finan/fund/search");
		});
		
		//相关基金
		appUtils.bindEvent(_pageId + "#xgjj", function(){
             appUtils.pageInit(pageCode,"product/dtjxgd");			
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
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