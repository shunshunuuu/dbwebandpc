
/**
  * 我的订单（活动）
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_myOrder "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var VIscroll = require("vIscroll"); // 滑动组件
	var vIscroll = {"scroll" : null, "_init" : false}; // 上下滑动对象
	var gconfig = require("gconfig"); // 全局配置对象
	var global = gconfig.global;
	var URL = global.url;
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中，便于代码中一目了然
	var pageGlobal = {
		"curPage" : 1, // 当前页码
		"pay_mode" : "", // 支付方式
		"maxPage" : 0, // 最大页数
		"param" : {} // 查询对象
	};

	/*
	 * 初始化
	 */
	function init(){
		// 底部导航
		common.footerTab(_pageId);
		
		queryMyOrder(); // 查询活动订单
	}
	
	/*
	 * 查询订单（活动）
	 */
	function queryMyOrder(){
		var userInfo = appUtils.getSStorageInfo("userInfo"); // 用户信息
		var user_id = JSON.parse(userInfo).user_id;
		var param={
				"user_id": user_id,
				"page": pageGlobal.curPage,
				"numPerPage": 5
		}
		var callBack=function(data){
			var error_info=data.error_info;
			var error_no=data.error_no;
			var results=null;
			var str="";
			if(error_no=="0"){
				pageGlobal.maxPage=data.results[0].totalPages;
				var results=data.results[0].data;
				if(results&&results.length>0){
					for(var i=0;i<results.length;i++){
						$(_pageId+" .no_data_box").hide();
						var item = results[i];
						var create_time=item.create_time;
						var product_desc=item.product_desc;
						var product_name=item.product_name;
						var order_integral=item.order_integral;
						var order_status=item.order_status;
						var order_type=item.order_type;
						var order_sn=item.order_id;
						var img_url=item.img_url;
						if(order_integral==""){
							order_integral="0";
						}
						var order_amount = item.order_amount;
						var unit_integral = parseInt(order_integral/order_amount);
						var integralHtml = unit_integral + ' × ' + order_amount;
						str+='<li>'+
									'<div class="order_num">'+
											'<h3>订单号：'+order_sn+'</h3>'+
								    '</div>'+
									'<div class="order_det">'+
										'<div class="ui layout">'+
											'<div class="pro_pic">'+
												'<img src="'+URL+'/mall'+img_url+'" />'+
											'</div>'+
											'<div class="row-1">'+
												'<h4>'+product_name+'</h4>'+
												'<p><i class="mon_icon"></i>'+integralHtml+ '<span style="float:right;line-height: 0.2rem;color: #fa727f;">合计' + order_integral +'东北米</span>' + '</p>'+
												'<span>成交时间：'+create_time.substring(0,19)+'</span>'+
											'</div>'+
										'</div>'+
									'</div>'+
							     '</li>';
					}
					$(_pageId+"#order_list").append(str);
					 pageScrollInit(results.length);
				}else{
					$(_pageId+" .no_data_box").show();
				}
			}else{
				layerUtils.iMsg(-1,error_info);
			}		
		}		
		service.queryOrderList(param,callBack);
	}

	/**上下滑动刷新事件**/
	function pageScrollInit(recordLen){
		var containerTop = $(_pageId + "#v_container_orderList").offset().top;
		var containerHeight = $(window).height() - containerTop;
		if(!vIscroll._init) {
			var config = {
				"isPagingType" : false,
				"perRowHeight" : 140,
				"visibleHeight" : containerHeight, // 这个是中间数据的高度
				"container" : $(_pageId + " #v_container_orderList"),
				"wrapper" : $(_pageId + " #v_wrapper_orderList"),
				"downHandle" : function() {
					// 上滑到顶端后，重新加载第一页
					pageGlobal.curPage = 1;
					$(_pageId+"#order_list").html("");
					queryMyOrder();
				},
				"upHandle": function() {
					// 当前页等于最大页数时，提示用户
					if(pageGlobal.curPage == pageGlobal.maxPage){
					//	layerUtils.iMsg(-1,"亲，暂无更多！");
						$(_pageId + ".visc_pullUp").hide();
						return false;
					}
					// 加载下一页数据
					if(pageGlobal.curPage < pageGlobal.maxPage){
						$(_pageId + ".visc_pullUp").show();
						
						pageGlobal.curPage += 1;
						queryMyOrder();
					}	
				},
				"wrapperObj" : null
			};
			vIscroll.scroll = new VIscroll(config); // 初始化
			vIscroll._init = true;
		}else{
			vIscroll.scroll.refresh();
		}
		
		if(recordLen < 5 || pageGlobal.curPage == pageGlobal.maxPage){
			$(_pageId + ".visc_pullUp").hide();
		}else{
			$(_pageId + ".visc_pullUp").show();
		}	
	}	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 订单左右滑动事件
		appUtils.preBindEvent($(_pageId + "#order_list"), "li", function(e) {
			var index = $(this).index();
			var startX = e.originalEvent.changedTouches[0].clientX;
			var startY = e.originalEvent.changedTouches[0].clientY;
			var cL = $(this)[0].offsetLeft;
			var startT = new Date().getTime();
			appUtils.bindEvent($(this), function(e) {
				e.preventDefault(); // 阻止产生整个页面的水平滚动导致页面乱
				var cX = e.originalEvent.changedTouches[0].clientX - startX;
				var cY = e.originalEvent.changedTouches[0].clientY - startY;
				if(Math.abs(cY) < Math.abs(cX)) { // 抽象的判断用户意向
					if((cL + cX) < 0) { // 用户左滑指数时return出去
						return;
					}
					$(this).css("left", cL + cX);
				}
			}, "touchmove");
			appUtils.bindEvent($(this), function(e) {
				var cX = e.originalEvent.changedTouches[0].clientX - startX;
				var cY = e.originalEvent.changedTouches[0].clientY - startY;
				var cTime = new Date().getTime() - startT;
				if(cTime < 200 && (cX == 0) && (cY == 0)) { // 点击事件
					return;
				}
				if((cX + cL) < -44) { // 左滑 去掉指数情况
					$(this).css("display", "none");
				} else if((cX + cL) > 44) { // 右滑
					$(this).css("left", "88px");
				} else {
					$(this).css("left", "0px");
				}
			}, "touchend");
		}, "touchstart");
		
		// 返回按钮
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageInit("active/myOrder", "account/userCenter", {});
		});
		
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		pageGlobal = {
				"curPage" : 1, // 当前页码
				"pay_mode" : "", // 支付方式
				"maxPage" : 0, // 最大页数
				"param" : {} // 查询对象
			};
		$(_pageId+"#order_list").html("");
		$(_pageId+" .no_data_box").hide();
	}
	
	var activeMyOrder = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = activeMyOrder;
});