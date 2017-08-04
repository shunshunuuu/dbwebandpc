/**************************************************************
 @author liaohl
 @date: 2014-01-09
 @description 分页组件
 @param config 配置参数
 	
 @returns {pagingUtils}
 
//使用案例

**************************************************************/
define(function (require, exports, module) {
	//加载依赖模块
	var $ = jQuery = require('jquery'),
		appUtils = require("appUtils"),
		layerUtils = require("layerUtils"),
		HIscroll = require("hIscroll");
	require("/plugins/page/css/paging.css"); //加载所需的css
	
	/**
	 * 设置分页滑动效果 -->> 分页组件js主体代码（一）
	 * @param pageModule 页面模块
	 * @param pagingObj 分页滑动对象
	 * @param idx pageId所在模块全局变量pagingObjArr中的下标
	 */
	function setMsgPageContent(pageModule, pagingObj, idx) 
	{
		var pageId = pageModule.pageId,
			identLable = pagingObj.identLable; //区分的标识
		if(pagingObj.totalPage > 1) //总页数大于1才有点击效果
		{
			if($x(pageId,"msgPageContent"+identLable).is(":visible"))
			{
				$x(pageId,"msgPageContent"+identLable).hide();
			}
			else
			{
				//初始化切分滑动片页数
				if(!pagingObj._init)
				{
					var totalPage = pagingObj.totalPage,
						sliceTotalPage = totalPage%15==0 ? parseInt(totalPage/15) : parseInt(totalPage/15)+1, //需要切分的总页数
						scrollerToTalEleStr = "";
					for(var i=1; i<=sliceTotalPage; i++)
					{
						var scrollerOneEleStr = "<div class=\"page_list_box\">",
							len = (i==sliceTotalPage && totalPage%15!=0)?totalPage%15:15;
						for(var j=1; j<= len; j++)
						{
							var pageNo = (i-1)*15+j;
							scrollerOneEleStr += "<a id=\"pageNo"+(identLable+pageNo)+"\" href=\"javascript:void(0);\" data-idx=\""+pageNo+"\"><span>"+pageNo+"</span></a>";
						}
						scrollerOneEleStr += "</div>";
						scrollerToTalEleStr += scrollerOneEleStr;
					}
					$x(pageId,"msgPageScroller"+identLable).html(scrollerToTalEleStr);
					
					//绑定每个元素的点击事件
					appUtils.bindEvent($x(pageId,"msgPageScroller"+identLable).find("a"),function() {
						var pointPageNo = $(this).attr("data-idx"),
							curPage = pagingObj.curPage,
							delta = pointPageNo - curPage;
						if(pointPageNo != curPage)
						{
							pageModule.handlePreNextPage(delta, idx);
						}
					});
					
					pagingObj._init = true; //尽量只初始化一次，保持性能
				}
				
				//设置选择的那一页选中效果
				var activePageNo = pagingObj.curPage,
					activePageEle = $x(pageId,"msgPageScroller"+identLable).find("a").eq(activePageNo-1);
				activePageEle.addClass("active").siblings().removeClass("active");
				
				//初始化左右滑动
				$x(pageId,"msgPageContent"+identLable).show();
				if(!pagingObj.iscrollPage._init)
				{
					var config = {
						wrapper: $x(pageId,"msgPageWrapper"+identLable), //wrapper对象
						scroller: $x(pageId,"msgPageScroller"+identLable), //scroller对象
						perCount: 1,  //每个可视区域显示的子元素
						showTab: false, //是否有导航点
						tabDiv: "", //导航点集合对象
						auto: false, //是否自动播放
						interval: null, //自动播放定时器
						wrapperObj: null,
						customSomeThing: function() { //分页模块针对左右滑动自定义字段，其他模块无影响
							var totalPage = pagingObj.totalPage,
								sliceTotalPage = totalPage%15==0 ? parseInt(totalPage/15) : parseInt(totalPage/15)+1, //需要切分的总页数
								currentPage = pagingObj.iscrollPage.scroll.getActivePage()+1; //滑动块的当前页，非分页数据的当前页
							if(currentPage == sliceTotalPage) {
								$x(pageId,"msgPagePreNex"+identLable).attr("class", "no_next");
							} else if(currentPage == 1) {
								$x(pageId,"msgPagePreNex"+identLable).attr("class", "no_pre");
							} else {
								$x(pageId,"msgPagePreNex"+identLable).attr("class", "");
							}
						}
					};
					pagingObj.iscrollPage.scroll = new HIscroll(config); //初始化
					pagingObj.iscrollPage._init = true; //尽量只初始化一次，保持性能
				}
				else
				{
					pagingObj.iscrollPage.scroll.setCssHW();
				}
				
				//打开时指定到活动页面的滑块
				var curPage= pagingObj.curPage,
					activePage = curPage%15==0 ? parseInt(curPage/15) : parseInt(curPage/15)+1;
				pagingObj.iscrollPage.scroll.scrollToPage(activePage-1, 0);
			}
		}
	}
	
	/**
	 * 跳转到指定page -->> 分页组件js主体代码（二）
	 * @param pageModule 页面模块
	 * @param pagingObj 分页滑动对象
	 * @param idx pageId所在模块全局变量pagingObjArr中的下标
	 */
	function gotoInputPage(pageModule, pagingObj, idx) 
	{
		var pageId = pageModule.pageId,
			totalPage = pagingObj.totalPage,
			curPage = pagingObj.curPage,
			identLable = pagingObj.identLable, //区分的标识
			inputPageNo = Number($x(pageId,"inputPage"+identLable).val());
		if(inputPageNo>0 && inputPageNo <= totalPage && inputPageNo != curPage) //有效执行跳转页面条件
		{
			pageModule.handlePreNextPage(inputPageNo-curPage, idx);
		}
		else
		{
			layerUtils.iMsg(-1,"请输入有效跳转的页数！");
		}
		$x(pageId,"inputPage"+identLable).val("");
	}
	
	var pagingUtils = {
		"setMsgPageContent": setMsgPageContent,
		"gotoInputPage": gotoInputPage
	};
	//暴露对外的接口
	module.exports = pagingUtils;
});