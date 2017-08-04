 /**
  * 投资者教育文章列表
  * @author shiaf
  * 
  */
define(function(require, exports, module){ 
	var _pageId = "#finan_education "; //当前页面ID
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
	};
	
	/*
	 * 初始化
	 */
	function init(){
		
		getInvestorList(true);

	}
	
	//获取右边列表对应信息
	function getInvestorList(isAppend){
        var param = {
        	"page" : pageGlobal.curPage,
        	//"article_catalog" : constants.article_catalog.TZZJY,
			"numPerPage" : 20
        };
        
		service.getEducationList(param, function(data){
			var result = common.getResultList(data);
			var dataList = result.dataList;
			var listEle = $(_pageId+".news_txt ul").empty();
			if (dataList.length == 0) {
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
				var createTime = item.release_time; // 文章创建时间
				// 界面显示形如：11-12 11:12 格式的时间
				if(validatorUtil.isEmpty(createTime)){
					createTime = ""; //如果没有时间则不显示
				}
				if (createTime && createTime.length >= 10) { 
					var indexStart = createTime.indexOf("-") + 1; // 字符串截取开始位置为 第一个“-”加 1
					var indexEnd = createTime.lastIndexOf(":"); // 字符串截取结束位置为 最后一个“:”
					if (indexEnd > indexStart) { 
						createTime = createTime.substring(indexStart, indexEnd);
					}
				}
				
				itemsHtml += '<li docId=' + item.article_id + '>'+
							'	<a href="javascript:void(0);">'+
							'		<div class = "li_con">'+
							'			<h3>' + item.article_title + '</h3>'+
							'			<p>' + item.article_brief + '</p>'+
							'			<span>' + createTime + '</span>'+
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
				appUtils.pageInit("finan/education", "finan/educationDetails", {"article_id" : docId});
			}, "click");
			
			pageScrollInit(resultsLen);
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
					
					getInvestorList(false);
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
						getInvestorList(true);
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
			appUtils.sendDirect(constants.main_index.comprehensive);
		});
	
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var education = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = education;
});