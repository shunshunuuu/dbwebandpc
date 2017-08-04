/**
 * 首页
 * @Author: wangwz
 * 
 */
define(function(require, exports, module) {
	var _pageId = "#finan_productRecPAs "; // 页面id
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	//var VIscroll = require("vIscroll");
	//var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象
	require("mall/scripts/common/plugins/swiperEvent");
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}

	/*
	 * 初始化
	 */
	
	function init() {
		
		// 处理ios滚动的问题
		//common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 初始化页面
		initView();
		
		// 产品广告
		productAdvert(); 
		
		// 现金管家
		cashbutlerAdvert();
		
		
		// 是否显示登录成功后的窗口
		var showLoginSuccess = appUtils.getPageParam("showLoginSuccess");
		if (showLoginSuccess && showLoginSuccess == "1") {
			// 显示注册成功窗口
			$(_pageId + ".window_dialog").show();
			$(_pageId + "#userCenter").addClass("highlight");
			
			// 只有注册成功后才加载当前图片，不要直接放到html页面中，影响首页加载速度
			var imgHtml = '<img src="images/sy_win_icon2.png" width="100%" />';
			$(_pageId + ".window_dialog .dialog_icon_box").html(imgHtml);
			
			// 点击页面关闭弹出窗口
			appUtils.bindEvent(_pageId , function(){
				$(_pageId + ".window_dialog").hide();
				$(_pageId + "#userCenter").removeClass("highlight");
			});
		}
		
	}
	
	/*
	 * 首页滑动效果
	 */
	function indexReanimate(){
		/*首页切换*/
		var rewrap = $("article .rotation_box").children(".inner"),
			renum = rewrap.find(".re_box").length;
			rewidth = $(window).width()- 70,
			recurrent = 1;
			
		function reanimate(id) {
			if (id < renum && id >= 0) {
				rewrap.css("transform","translate3d("+(- id * rewidth)+"px, 0px, 0px)");
				
			} else {
				return false;
			}
		}
		
		reanimate(recurrent);
		
		$('article .rotation_box .re_box').swipeEvents().bind("swipeLeft", function(){
			if(recurrent < renum-1 && recurrent >= 0){
				reanimate(recurrent+=1);
			}
		}).bind("swipeRight", function(){
			if(recurrent == 0){
				reanimate(0);
			}else{
				reanimate(recurrent-=1);
			}
		});
	}
	
	function initView(){
		// 初始化页面时定位滚动元素到第一个
		/*if (vIscroll.scroll && vIscroll.scroll.getWrapperObj()) {
			vIscroll.scroll.getWrapperObj().scrollTo(0, -40);
		}*/
		// 设置APP综合首页地址
		$(_pageId + ".home_btn").attr("href", global.appIndexUrl);
		
		// 判断链接来源是否来自APP, 如果来自APP,头部隐藏 首先去cookie里面是否有值，再去页面参数中是否有值
		var isFromApp = appUtils.getSStorageInfo("isFromApp");
		if (isFromApp && isFromApp == "zzapp") { 
			$(_pageId + "header").hide();
		} else {
			var  srcType = appUtils.getPageParam("src_type");
			if (srcType && srcType == "zzapp") {
				appUtils.setSStorageInfo("isFromApp", "zzapp");
				$(_pageId + "header").hide();
			} else {
				$(_pageId + "header").show();
			}
		}
	}

	/*
	 * 产品广告
	 */
	function productAdvert() {
		var productAdverBackFun = function(result){
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + "#inner").empty();
			var dotsBox = $(_pageId + " #dots_box").empty();
			var resultDataLen = result.length;//统计有效广告个数
			var adItems = "";
			for (var i = 0; i < resultDataLen; i++) {
				
				var item = result[i];
				var imgPath = item.picture ? item.picture : item.small_picture; // 图片地址
				var file_state = item.file_state; // 文件状态是否有效
				if (file_state != "1") {
					continue;
					
				}else{
					pageGlobal.isFileState = "1";
				}
				
				imgPath = global.url + '/mall' + imgPath;
				
				var linkUrl = ""; // 链接地址			
				var state = item.state; // 链接是否有效
	
				if (state == "1") {
					linkUrl = item.url;
					
				} else {
					linkUrl = "javascript:void(0)";
				}
				adItems += "<li url='" + linkUrl + "'><img src='"+ imgPath + "' width='100%' /></li>";
				
			};
			
			if(pageGlobal.isFileState == "1"){
				adAreaEle.append(adItems); // 显示位置ul
				//pageScrollInit(resultDataLen);
			}
			
			appUtils.bindEvent(_pageId+" #inner li", function(e){
				e.stopPropagation();
				var Url=$(this).attr("url");
				appUtils.sendDirect(Url);					
			});
			
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_JJ_product_1;
		queryAdvert(groupId, productAdverBackFun);
	};	
	
	/*
	 * 现金管家广告
	 */
	function cashbutlerAdvert() {
		var cashbutlerAdverBackFun = function(result){
			
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + ".index_banner").empty();
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
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_JJ_product_0;
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
	 * 查询数据字典
	 */
	function queryenum(key){
		var enumData = pageGlobal.enumData;
		for (var i = 0; i < enumData.length; i++) {
			var item = enumData[i];
			if (item.itemValue == key) {
				return item.itemName;
			}
		}
	}
	
	/*
	 * 根据推荐类型查询推荐产品
	 * @param recommendType 推荐类型。
	 * @param callBackFun 查询成功后回调函数。
	 * @param 查询失败或结果为空时回调函数。
	 */
	function queryRecomProductByType(recommendType, callBackFun) {
		var param = {
			"recommend_type" : recommendType
		};

		service.queryRecomProduct(param, function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == "0") {
				var result = data.results;
				
				if (result && result.length > 0) {
					// 数据处理函数
					callBackFun(result);
				}
			} else {
				// 错误信息提示
				layerUtils.iMsg(-1, error_info);
			}
		});
	};
	
	/*
	 * 产品详情
	 */
	function productDetail(productId, subType, productCode) {
		if (productCode == global.product_code) {
			// 现金管家
			appUtils.pageInit("finan/index", "account/cashbutler/detail", {});
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit("finan/index", "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit("finan/index", "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 登录
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			appUtils.pageInit("finan/productRecPA", "account/userCenter", {});
			return false;
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	};

	/*
	 * 页面销毁
	 */
	function destroy() {
		
	};

	var productRecPA = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = productRecPA;
});