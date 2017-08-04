 /**
  * 资讯列表
  * @author shiaf
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_consult "; //当前页面ID
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
		
		getImforList();
		initView();//初始化页面	
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
	
	
	
	//获取左边资讯列表
	function getImforList(){
		var callBack = function(data){
			var result = common.getResultList(data);
			var listEle = $(_pageId + ".news_list .left_nav ul").empty();
			var isFirst = true; // 是否是第一个显示的类别
			if (result.length > 0) {
				//将数据填入左边列表
				for(var i = 0; i < result.length; i++){
					var item = result[i];
					var typeName = item.name;
					var docTypeId = item.doc_type_id;
					// 只显示配置好的类型
					if (docTypeId && constants.docTypeId.indexOf(docTypeId) != -1) {
						typeName = typeName.replace("分析", "").replace("报告", "").replace("快讯", "");
						var classHtml = "";
						if(docTypeId == constants.docType.CB){
							if (isFirst) {
								isFirst = false;
								classHtml = "act"; // 第一个默认获取焦点
								pageGlobal.categoryId = docTypeId; // 保存类型ID到全局变量中		
								$(_pageId + "#consultTitle").html(typeName); // 头部名称默认显示第一个类型名称
								getImforDetailList(false); // 默认第一次查询右边资讯列表
							}
						}
						var s = '<li categoryId="' + docTypeId + '" class="' + classHtml + '">' +
								'	<a href="javascript:void(0);">' + typeName + '</a>' +
								'</li>';
						if(docTypeId == "508"){
							listEle.prepend(s);
						}else if(docTypeId == "507"){
							listEle.prepend(s);
						}else{
							listEle.append(s);
						}
					}
				}
				
				//根据左边点击的新闻标题展示右边列表信息	
				appUtils.bindEvent(_pageId + ".left_nav ul li", function(){
					initView();
					$(_pageId + ".left_nav ul li").removeClass("act");
					$(this).addClass("act");
					var curCategoryId = $(this).attr("categoryId");
					pageGlobal.categoryId = curCategoryId;
					
					// 类型名称
					var typeName = $(this).find("a").text();
					$(_pageId + "#consultTitle").html(typeName);
					pageGlobal.categoryName = typeName;
					getImforDetailList(false); 
				});
				
			}
		};
		
		service.getConsultCategory({}, callBack);
	}
	
	//获取右边列表对应信息
	function getImforDetailList(isAppend){
        var param = {
        	"doc_type" : pageGlobal.categoryId,
        	"page" : pageGlobal.curPage,
			"numPerPage" : 20
        };
        
		service.getConsultList(param, function(data){
			var result = common.getResultList(data);
			var dataList = result.dataList;
			var listEle = $(_pageId+".news_txt ul").empty();
			if (dataList && dataList.length == 0) {
				$(_pageId + "#v_container_productList").hide();
				$(_pageId + ".no_data_box").show();
				return;
			} else {
				$(_pageId + "#v_container_productList").show();
				$(_pageId + ".no_data_box").hide();
			}
			pageGlobal.maxPage = result.totalPages; // 总页数 
			var resultsLen = dataList.length; // 记录结果集长度
			var itemsHtml = "";
			for(var i = 0; i < resultsLen; i++){
				var item = dataList[i];
				var submitTime = item.submit_time; // 报告提交时间
				// 界面显示形如：11-12 11:12 格式的时间
				if(validatorUtil.isEmpty(submitTime)){
					submitTime = ""; //如果没有时间则不显示
				}
				if (submitTime && submitTime.length >= 10) { 
					var indexStart = submitTime.indexOf("-") + 1; // 字符串截取开始位置为 第一个“-”加 1
					var indexEnd = submitTime.lastIndexOf(":"); // 字符串截取结束位置为 最后一个“:”
					if (indexEnd > indexStart) { 
						submitTime = submitTime.substring(indexStart, indexEnd);
					}
				}
				
				itemsHtml += '<li docId=' + item.doc_id + '>'+
							'	<a href="javascript:void(0);">'+
							'		<div class = "li_con">'+
							'			<h3>' + item.title + '</h3>'+
							'			<p>' + item.summary + '</p>'+
							'			<span>' + submitTime + '</span>'+
							'		</div>'+
							'	</a>'+
							'</li>'	;						
			
			}
			
			if (isAppend) {
				listEle.append(itemsHtml);
			} else {
				listEle.html(itemsHtml);
			}
			
			//点击各个右边链接列表，跳转到新闻详情页面	
			appUtils.bindEvent(_pageId + ".news_txt ul li", function(){
				var docId = $(this).attr("docId");
				appUtils.pageInit("finan/consult", "finan/consultDetails", {"doc_id" : docId, "doc_type_name" : pageGlobal.categoryName});
			}, "click");
			
			pageScrollInit(resultsLen);
		});
		
	}
	
	/*
	 * 把所有产品查询出来缓存到本地
	 */
	function queryconsult(key){
		// 清空产品数据
		var param = {
			"stock_code" : key
		};
		
		service.getConsultList(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			var searchResultEle = $(_pageId + "#searchResult ul").empty();
			$(_pageId + "#searchResult").show();
			if(error_no == 0){
				var result = data.results[0].data;
				if (result.length > 0) {
					for(var i = 0; i < result.length; i++){
						var item = result[i];
						var docId = item.doc_id;// 报告编号
						var title = item.title;// 报告标题
						var stkCode = item.stk_code;// 相关代码
						var industryCode = item.industry_code; // 相关行业代码
						var docTypeId = item.doc_type_id; // 资讯类别
						var netIncomet = item.net_incomet; // 预测净利润，第一年（元）
						if(title.length > 20){
							title = title.substring(0,20) + "...";
						}
						var consultTemp = {
							"docId" : docId,
							"title" : title,
							"stkCode" : stkCode,
							"industryCode" : industryCode,
							"netIncomet" : netIncomet,
							"docTypeId" : docTypeId
						}
						var itemHtml = '<li docTypeId="' + docTypeId + '" docId="' + docId + '" stkCode="' + stkCode + '">' + title +  '</li>';
						searchResultEle.append(itemHtml);
					}
				}
					// 点击进入详情
					appUtils.bindEvent(_pageId + "#searchResult ul li", function(){
						var curEle = $(this);
						var docId = curEle.attr("docId");
						$(_pageId + "#searchResult").hide();
						appUtils.pageInit("finan/consult", "finan/consultDetails", {"doc_id" : docId, "doc_type_name" : pageGlobal.categoryName});
				});
			}else{
				layerUtils.iMsg(-1, error_info);
			}
		});
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
	
	var consult = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = consult;
});