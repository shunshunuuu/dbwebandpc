define(function(require, exports, module) {
	var _pageId = "#finan_otc_index "; // 页面id
	var pageCode = "finan/otc/index";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
	require("mall/scripts/common/plugins/swiperEvent");
	
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
		
		// 底部导航
		common.footerTab(_pageId);
		
		//查询所有otc产品
		queryotcProduct();
	}
	
	function queryotcProduct(){
		var param = {
				"fina_belongs" : 5, // 产品类型 
				"page" : 1, 
				"numPerPage" : 8,
				"product_shelf" : 1,
				"is_hot_sale" : 1
	   };
		
		service.findFinan(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
				var otcEle = $(_pageId+"#otclist").empty();
				var resultDataLen = results.length; // 记录结果集长度
			    if(resultDataLen > 0){
			    	for (var i = 0; i < resultDataLen; i++) {
			    		var item = results[i];
						var productName = item.product_name; // 产品名称
						var productSubType = item.product_sub_type; // 产品类型
						var productId = item.product_id; // 产品编号
						var productCode = item.product_code; // 产品代码
						var period = item.period || "--"; // 理财周期
						var earnings = item.earnings || "--"; // 预期年化收益率
						productStatus = item.product_status; // 产品状态
						var finaBelongs  = item.fina_belongs;
						var qgje = item.per_buy_limit;//起购金额
						var investment_horizon = item.investment_horizon || "--";//投资期限
						if(productSubType && productSubType == '0'){
							var showName = "基金产品";
						}else{
//							1资管 3银行理财 5收益凭证 6信托 7私募 8保险 9报价回购
							if(finaBelongs && finaBelongs == '1'){
								var showName = "资管理财";
							}else if(finaBelongs == '2'){
								var showName = "银行理财";
							}else if(finaBelongs == '5'){
								var showName = "OTC";
							}
						}
						
						var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
						var showNameThree = showFiledThreeObj.name;
						var showValueThree = (showFiledThreeObj.value).toString();
						showValueThree = showValueThree.replace("万", "<em>万</em>");
						
						productName = putils.delProSpecialStr(productName);
						if (productName.length > 17) {
							productName = productName.substring(0, 16) + "...";
						}
						
						var fund_account = appUtils.getSStorageInfo("fund_account");
						var productname = "";
						if(fund_account){
							productname = productName;
						}else{
							productname = "请登录查看产品名称";
						}
						var itemHtml ='<div class="prolist" productCode="' + productCode + '" productId="' + productId + '" productSubType="1">' +
						   ' <div class="dutc_tit" id="nr">' +
						   '		<p class="sp01">' + productname + '</p>' +
						   '   <p class="sp02">'+
						   '    <span class="san01">' + showValueThree + '元起购</span>' +
						   '    <span class="san02">'+ showName+' </span> '+
						   '   </p>' +
						   ' </div>' +
						   ' <div class="dutc_box flex-father" id="nr"><s></s>' +
						   '		<div class="dutc_bl flex-children">' +
						   '			<p class="sp01">'+earnings+'<span>%</span></p>' +
						   '			<p class="sp02">业绩比较基准</p>' +
						   '		</div>' +
						   '		<div class="dutc_bt flex-children">' +
						   '		    <p class="sp01">'+investment_horizon+'<span>天</span></p>' +
						   '		    <p class="sp02">投资期限</p>' +
						   '		</div>' +
						   ' </div>' +
						   '<div class="shopping_btn_b" id="ljgm">'+
						   '  <a href="javascript:void(0);">立即购买</a>'+
						   '</div>'+
						   ' </div>';
						otcEle.append(itemHtml);
					}
			    	
					// 绑定详情事件
					appUtils.bindEvent(_pageId + "#nr", function(){
						var curEle = $(this).parent();
						productDetail(curEle.attr("productId"));
					});
					
					//立即购买
					appUtils.bindEvent(_pageId + "#ljgm", function(){
						if(checkProductStatus()){
							var gzEle = $(this).parent();
							var productId=gzEle.attr("productId");
							var productSubType=gzEle.attr("productSubType");
							var productCode=gzEle.attr("productCode");
							var param = {
								"product_id" : productId,
								"product_code" : productCode,
								"sub_type" : productSubType
							}
							var _loginInPageCode = "finan/buy";
							if (common.checkUserIsLogin(true, false, _loginInPageCode, param, true)) {
//								appUtils.pageInit(pageCode, "finan/buy", param);
								return false;
							}
						}
					});
			    }
			}else{
			   layerUtils.iAlert("查询otc产品列表失败:"+resultVo.error_info,-1);
			}
		})
	}
	
	/*
	 * 校验产品是否能够购买
	 */
	function checkProductStatus(){
		if (productStatus != "0" && productStatus != "1" && productStatus != "2") {
			layerUtils.iMsg(-1, "该产品非购买时期");
			return false;
		}
		return true;
	}
	
	/*
	 * 产品详情
	 */
	function productDetail(productId) {
		var _loginInPageCode = "finan/finanDetail";
		var param = {
			 "product_id" : productId	
		}
		
		if (common.checkUserIsLogin(true, false, _loginInPageCode, param, true)) {
//			appUtils.pageInit(pageCode, "finan/finanDetail", param);
			return false;
		}
			
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
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_OTC;
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
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 登录
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			appUtils.pageInit(pageCode, "account/userCenter", {});
			return false;
		});
		
		//基金
		appUtils.bindEvent(_pageId+"#finan", function(e){
			appUtils.pageInit(pageCode, "finan/fund/index");
		});
		//资管
		appUtils.bindEvent(_pageId+"#ziguan", function(e){
			var _loginInPageCode = "finan/ziguan/index";
			if (common.checkUserIsLogin(false, false, _loginInPageCode, null, false)) {
				appUtils.pageInit(pageCode, "finan/ziguan/index", null);
				return false;
			}
		});
		//财富
		appUtils.bindEvent(_pageId + "#caifu", function(){
			layerUtils.iAlert("此功能正在开发中,敬请期待哦!","确定");
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