 /**
  * 东北证券H5晨会视频列表
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#article_index "; //当前页面ID
	var appUtils = require("appUtils"); //核心工具类
	var layerUtils = require("layerUtils"); //弹出层工具类
	var service = require("mobileService"); //服务类
	var common = require("common"); //公共类
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); //校验工具类
	var VIscroll = require("vIscroll");
	var vIscroll = {"scroll":null, "_init":false}; // 上下滑动对象

	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"maxPage" : 0, // 总页数
		"categoryId" : "", // 资讯类别
		"categoryName" : "", // 资讯类别名称
		"productData" : [] // 用户缓存所有产品信息 id,productCode,productName
	};
	
	/*
	 * 初始化
	 */
	function init(){
		
		initView();//初始化页面
		
		queryArticleList();
	}
	
	/*
	 * 查询晨会文章列表
	 */
	function queryArticleList(){
		var param = {
				"contract_type" : constants.contractType.ARTICLEMORNING
			}
		service.queryContract(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				var morningMeeting = $(_pageId + ".morning_meeting_list").empty();
				for (var i = 0; i < results.length; i++) {
					var item = results[i];
//					var title = "1." + i;
					
					var articleList = '<li>'+
									  '		<a href="' + item.url + '">' + item.agreement_title + '</a>'+
									  '</li>';
					morningMeeting.append(articleList);
				}
				
			}else{
				layerUtils.iMsg(-1, error_info);
				return false;
			}
		});
	}
	
	function initView(){
	    $(_pageId + "#search_consult").removeAttr("isSearched");
		//$(_pageId + "#search_consult").attr("isSearched","");	
		$(_pageId + "#search_consult").show();
		$(_pageId + "#search_value").val("");
		$(_pageId + "#search_isBox").removeClass().addClass("header_inner_02");
		$(_pageId + ".search_box").hide();
		$(_pageId + "#searchResult").hide();
		$(_pageId + "#consultTitle").show();
	}
	
	/*
	 * 清空查询参数
	 */
	function cleanPageParam()
	{
		pageGlobal.curPage = 1;
		pageGlobal.maxPage = 0;
	}
	
	/**
	 * 上下滑动刷新事件
	 * 
	 */
	function pageScrollInit(resultDataLen){
		var height = $(_pageId + "#v_container_productList").offset().top;
		var height2 = $(window).height() - height;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false, 
				"perRowHeight" : 140, 
				"visibleHeight" : height2, // 这个是中间数据的高度
				"container" : $(_pageId + "#v_container_productList"), 
				"wrapper" : $(_pageId + "#v_wrapper_productList"), 
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					
					getImforDetailList(false);
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
						getImforDetailList(true);
					}	
				}, 
				"wrapperObj": null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(resultDataLen < 20 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			if($(_pageId + "#search_consult").attr("isSearched") == "searched"){
				initView();
				
			}else{
				appUtils.pageBack();
			}
		});
		
		
		/*
		 * 点击搜索按钮
		 */
		appUtils.bindEvent(_pageId + "#search_consult", function(){
			$(this).hide();
			$(_pageId + "#consultTitle").hide();
			$(_pageId + "#search_isBox").removeClass().addClass("header_inner_04");
			$(_pageId + ".search_box").show();
			$(_pageId + "#search_consult").attr("issearched","searched");
		});
		
		/*
		 * 搜索框失去焦点
		 */
		appUtils.bindEvent(_pageId + "#search_value", function(){
			var cur = $(this).val();
			if (validatorUtil.isEmpty(cur)) {
				initView();
				return false;
			}
		},"blur");
		
		/*
		 * 点击搜索按钮（搜索）
		 */
		appUtils.bindEvent(_pageId + ".search_btn3", function(){
			//搜索
			var key = $.trim($(_pageId + "#search_value").val());
			if (validatorUtil.isEmpty(key)) {
				$(_pageId + "#searchResult").hide();
				return false;
			}
			queryconsult(key);
		});
	
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		initView();
	}
	
	var articleIndex = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = articleIndex;
});