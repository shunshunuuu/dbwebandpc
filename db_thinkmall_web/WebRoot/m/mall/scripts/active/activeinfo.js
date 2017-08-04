 /**
  * 活动首页
  * @author wangwz
  */
define(function(require, exports, module){ 
	var _pageId = "#active_activeinfo "; // 当前页面ID
	var pageCode =　"active/activeinfo";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var global = require("gconfig").global; // 全局配置对象
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");
	var constants = require("constants");// 常量类
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
	
	// 页面全局变量
	var pageGlobal = {
		"times" : [], // 定时器数组
		"types" : [], // 区别当前定时器所代表的是哪个中类型 0：抢购还没开始，1：抢购已经开始
		"isFileState" : "0", // 广告是否有效
		"now_time" : "", // 服务器时间
		"leftSecond" : [] // 服务器时间与活动结束时间差值 【秒】
	};

	/*
	 * 初始化
	 */
	function init(){
		
		// 处理ios滚动问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".points_mall"));
		
		// 初始化视图
		initView();
		
		common.footerTab(_pageId);
		
		// 加载一米疯抢产品
		oneMberserk();
		
		// 加载限时抢购产品
		buyLimit();
		
		// 超值换购
		costEffective();
		
		loadAdv(); // 广告加载
	}
	
	/**
	 * 清除滑动组件
	 */
	function initView(){
		if(myHIscroll){
			myHIscroll.destroy();
			myHIscroll = null;
		}
	}
	
	/**
	 * 获取服务器时间
	 */
	function getServerTime(callBack){
		service.getServerTime({}, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var item = results[0];
					pageGlobal.now_time = item.now_time; // 服务器时间
					callBack(item.now_time);
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 加载广告
	 */
	function loadAdv() {
		var param = {
			"group_id" : constants.advertGroupId.ADVERT_GROUP_ID_ACTIVE
		};
		var callBack = function(data) {
			var error_no = data.error_no;
			var error_info = data.error_info;

			if (error_no == 0) {
				var item = data.results;
				var adItems = "";
				var sadItems = "";
				var j = 0;//统计有效广告个数
				var date_info = new Date().getTime();
				if (item.length == 0) {
//					adItems = "<li><img src='images/pic01.jpg'/></li>";
//					sadItems = "<em class='active'></em>";
				} else {
//					adItems = "<li><img src='images/pic01.jpg'/></li>";
//					sadItems = "<em class='active'></em>";/*
					for (var i = 0; i < item.length; i++) {
						// 广告控制在2个以内
						if (j++ > 1) {
							break;
						};
						var imgPath = item[i].picture ? item[i].picture : item[i].small_picture; // 图片地址
						var state = item[i].state; // 链接是否有效
						var _url = "";
						if (state == "1") {
							_url = item[i].url;
							
						} else {
							_url = "javascript:void(0)";
						}
						var file_state = item[i].file_state; // 文件状态是否有效
						if (file_state != "1") {
							continue;
							
						}else{
							pageGlobal.isFileState = "1";
							if (i == 0) {
								adItems += "<li url='"+_url+"'><img src='"
										+ (global.url +"/mall"+ imgPath) + 
										 "' width='100%'/></li>";
								sadItems += "<em class='active'></em>";
							} else {
								adItems += "<li url='"+_url+"'><img src='"
										+ (global.url +"/mall"+ imgPath) + 
										"' width='100%'/></li>";
								sadItems += "<em></em>";
							}
						}

					}
				};
 
				if(pageGlobal.isFileState == "1"){
					$(_pageId + " #dots_box").html(""); // 显示点
					$(_pageId + " #banner_ul").html(adItems); // 显示位置ul
					$(_pageId + " #dots_box").html(sadItems); //
					HIscroll_init();
				}
				
				appUtils.bindEvent(_pageId+" #banner_ul li", function(e){
					e.stopPropagation();
					var Url=$(this).attr("url");
						appUtils.sendDirect(Url);					
				});
				
			} else {
				layerUtils.iMsg(-1, error_info);

			}
		};
		service.queryAd(param, callBack);
	}
	
	/**
	 * HIscroll左右滑动组件
	 */
	function HIscroll_init(){
		if(!myHIscroll){
	        var config = {
	            wrapper: $(_pageId+' #ad_index'), //wrapper对象
	            scroller: $(_pageId+' #banner_ul'), //scroller对象
	            perCount: 1,  //每个可视区域显示的子元素，就是每个滑块区域显示几个子元素
	            showTab: true, //是否有导航点
	            tabDiv: $(_pageId+'#dots_box'), //导航点集合对象
	            auto: true //是否自动播放
	        };
	        myHIscroll = new HIscroll(config);
	        $(_pageId+'#banner_ul li').show();
	    }
	}
	
	/**
	 * 一米疯抢
	 */
	function oneMberserk(){
		// 根据活动类型查询活动产品 回调函数
		var callBack = function(results){
			var ymfqListEle = $(_pageId + "#ymfq_pre_list ul").empty();
			if (results && results.length > 0) {
				var dataList = results[0].data;
				if (dataList && dataList.length > 0) {
					for (var i = 0; i < dataList.length; i++) {
						if (i > 3) { // 最多展示4个
							$(_pageId + "#ymfq").show();
							break;
						}
						var item = dataList[i];
						var imgUrl = item.img_url; // 图片地址
						imgUrl = global.url + '/mall' + imgUrl;
						var actPdtName = item.product_sub_title; // 产品名称
						
						var beginTime = item.activity_per_begin_time;  //参与活动的产品的活动计时开始时间
						var endTime = item.activity_per_end_time;  //参与活动的产品的活动计时开始时间
						var curTime = (new Date()).getTime(); // 当前时间
						var surplusTime = "";
						var timeShow = ""; // 剩余时间描述
						if (putils.getDateTime(beginTime) > curTime) {
							surplusTime = putils.calSurplusTime(beginTime);
							timeShow = surplusTime.day + "天" + surplusTime.hour + "小时" + surplusTime.min + "分钟后开始";
						} else if (putils.getDateTime(endTime) > curTime) {
							surplusTime = putils.calSurplusTime(endTime);
							timeShow = "剩余" + surplusTime.day + "天" + surplusTime.hour + "小时" + surplusTime.min + "分钟";
						} else {
							timeShow = "活动已结束";
						}
						
						var actIntegral = item.act_integral; // 活动积分【优先用活动积分】
						var productIntegral = item.product_integral; // 活动所需积分
						if (validatorUtil.isEmpty(actIntegral)) {
							actIntegral = productIntegral;
						}
						var productAmount = item.product_amount; // 产品数量
						var perProductTotAmount = item.per_product_tot_amount; // 产品在活动期最多能卖多少个
						if (validatorUtil.isNotEmpty(perProductTotAmount)) {
							// 如果产品活动期限制购买数不为空时，目标份额取该字段值
							productAmount = perProductTotAmount;
						}
						
						var soldAmount = item.sold_amount; //已售数量
						var soldPerTotal = parseFloat(soldAmount/productAmount * 100); // 已售数量占产品总数量的百分比
						soldPerTotal = soldPerTotal >= 100 ? "100" : soldPerTotal.toFixed(2);
						var productId = item.product_id; // 产品编号
						
						var itemHtml = '<li class="ui layout" productId="' + productId + '">' + 
										'	<div class="pro_pic">' + 
										'		<img src="' + imgUrl + '" width="100" />' + 
										'	</div>' + 
										'	<div class="row-1">' + 
										'		<h4>' + actPdtName + '</h4>' + 
										'		<div class="bar_box">' + 
										'			<div class="bar">' + 
										'				<span class="porfit_bar" style="width:' + soldPerTotal + '%"></span>' + 
										'			</div>' +  
										'		</div>' + 
										'		<div class="price_box clearfix">' + 
										'			<span class="time_left">' + timeShow + '</span>' + 
										'			<p><i class="mon_icon"></i>' + actIntegral + '东北米</p>' + 
										'		</div>' + 
										'	</div>' + 
										'</li>';
						ymfqListEle.append(itemHtml);
					}
					
					// 参与活动
					appUtils.bindEvent("#ymfq_pre_list ul li", function(){
						var curEle = $(this);
						var pageParam = {"product_id" : curEle.attr("productId")};
						appUtils.pageInit(pageCode, "active/oneMberserk", pageParam);
					});
				}
			}
		}
		
		var activeType = constants.activeType.ACTIVE_TYPE_ONEMBER; // 活动类型 - 一米疯抢
		queryProductByType(activeType, callBack); // 调用产品公告方法查询
	}
	
	/**
	 * 限时抢购
	 */
	function buyLimit(){
		// 根据活动类型查询活动产品 回调函数
		var callBack = function(results){
			var xsqgListEle = $(_pageId + "#xsqg_pre_list ul").empty();
			if (results && results.length > 0) {
				var dataList = results[0].data;
				if (dataList && dataList.length > 0) {
					for (var i = 0; i < dataList.length; i++) {
						if (i > 1) { // 最多展示2个
							$(_pageId + "#xsqg").show();
							break;
						}
						var item = dataList[i];
						var imgUrl = item.img_url; // 图片地址
						imgUrl = global.url + '/mall' + imgUrl;
						var actPdtName = item.product_sub_title; // 产品名称
						var actBeginTime = item.activity_per_begin_time;  //参与活动的产品的活动计时开始时间
						var actEndTime = item.activity_per_end_time;  //参与活动的产品的活动计时开始时间
						var actIntegral = item.act_integral; // 活动积分【优先用活动积分】
						var productIntegral = item.product_integral; // 活动所需积分
						var productId = item.product_id; // 产品ID
						if (validatorUtil.isEmpty(actIntegral)) {
							actIntegral = productIntegral;
						}
						
						var itemHtml = '<li productId="' + productId + '">' + 
										'	<h4>' + actPdtName + '</h4>' + 
										'	<p class="time_left_box" beginTime="' + actBeginTime + '" endTime="' + actEndTime + '">' + 
										'		<span>00</span>:<span>49</span>:<span>01</span>' + 
										'	</p>' + 
										'	<em class="pro_pic"><img src="' + imgUrl + '" width="100"/></em>' + 
										'	<p class="ared"><i class="mon_icon"></i>' + actIntegral + '东北米</p>' + 
										'	<a href="javascript:void(0)" class="exchange_btn">立即抢购</a>' + 
										'</li>';
						
						xsqgListEle.append(itemHtml);
					}
					
					// 抢购
					appUtils.bindEvent("#xsqg_pre_list ul li", function(){
						var pageParam = {"product_id" : $(this).attr("productId")};
						appUtils.pageInit(pageCode, "active/details", pageParam);
					});
					
					// 获取服务器时间后刷新抢购时间
					getServerTime(function(serverTime){
						serverTime = putils.getDateTime(serverTime); // 计算服务器时间毫秒数
						// 启动每个产品抢购时间定时任务。
						$("#xsqg_pre_list ul li .time_left_box").each(function(index){
							var endTime = putils.getDateTime($(this).attr("endTime")); // 产品活动结束时间
							var beginTime = putils.getDateTime($(this).attr("beginTime")); // 产品活动开始时间
							var timeTemp = endTime;  // 用于计算倒计时的结束时间，
							var type = 1;
							/*
							 * 1、如果活动开始时间大于当前时间 ，产品不能购买，此时倒计时代表开始购买倒计时
							 * 2、如果活动开始时间小于当前时间 ，产品可购买，此时倒计时代表购买截止时间倒计时
							 */
							if (beginTime > serverTime) {
								timeTemp = beginTime;
								type = 0;
								$(this).parent().find(".exchange_btn").css("background", "gray").html("活动还没开始哦");
							}
							var leftSecond = parseInt((timeTemp - serverTime) / 1000); // 差值并转秒
							pageGlobal.leftSecond[index] = leftSecond; // 记录差值到全局变量中。
							pageGlobal.types[index] = type; // 根据活动开始&结束时间判断当前倒计时类型
							var options = {
								"selector" : this,
								"index" : index,
								"rightSecond" : parseInt((endTime - serverTime) / 1000)
							}
							
							// 默认刷新显示时间
							freshTime(options); 
							
							// 设置定时任务刷新抢购时间
							pageGlobal.times[index] = setInterval(intervalFun(options), 1000);   
						});
					});
				}
			}
		}
		
		var activeType = constants.activeType.ACTIVE_TYPE_BUYLIMIT; // 活动类型 - 一米疯抢
		queryProductByType(activeType, callBack); // 调用产品公告方法查询
	}
	
	/*
	 * 返回一个匿名函数，用于定时器方法参数【解决定时任务执行有参数的方法的问题】
	 */
	function intervalFun(options){
		return function(){
			freshTime(options);
		}
	}
	
	/*
	 * 刷新抢购时间函数
	 */
	function freshTime(options) {
		var leftSecond = pageGlobal.leftSecond[options.index]; // 距离活动结束时间还有多少秒
		
		var timeHtml = '<span>00</span>:<span>00</span>:<span>00</span>';
		// 时间差小于0时，抢购结束
		if (leftSecond <= 0) {
			var type = pageGlobal.types[options.index];
			if (type == "0") {
				pageGlobal.types[options.index] = 1; // 开始抢购
				pageGlobal.leftSecond[options.index] = options.rightSecond; // 开始抢购，倒计时重新开始
				// 抢购结束后，解绑点击事件, 并把按钮置灰
				$(_pageId + "#xsqg_pre_list ul li").eq(options.index).find(".exchange_btn").css("background", "#23B3F7").html("立即抢购");
			} else {
				if (pageGlobal.times[options.index]) {
					clearInterval(pageGlobal.times[options.index]);
				}
				// 抢购结束后，解绑点击事件, 并把按钮置灰
				$(_pageId + "#xsqg_pre_list ul li").eq(options.index).find(".exchange_btn").css("background", "gray");
			}
		} else {
			var day = parseInt(leftSecond / 3600 / 24); // 计算活动剩余天数
			var hour = parseInt((leftSecond / 3600) % 24); // 计算活动剩余小时数
			hour = (day * 24) + hour; // 超过一天的按24小时处理
			if (hour < 10) {
				hour = "0" + hour;
			}
			var min = parseInt((leftSecond / 60) % 60); // 计算活动剩余分钟数
			if (min < 10) {
				min = "0" + min;
			}
			var second = parseInt(leftSecond % 60); // 计算活动剩余秒数
			if (second < 10) {
				second = "0" + second;
			}
			
			timeHtml = '<span>' + hour + '</span>:<span>' + min + '</span>:<span>' + second + '</span>';
		}
		
		$(options.selector).html(timeHtml);
		
		// 执行完后时间减一
		pageGlobal.leftSecond[options.index]--;
	}   
	
	/**
	 * 超值换购
	 */
	function costEffective(){
		// 根据活动类型查询活动产品 回调函数
		var callBack = function(results){
			var czqgListEle = $(_pageId + "#czqg_pre_list ul").empty();
			if (results && results.length > 0) {
				var dataList = results[0].data;
				if (dataList && dataList.length > 0) {
					for (var i = 0; i < dataList.length; i++) {
						if (i > 1) { // 最多展示2个
							$(_pageId + "#czhg").show();
							break;
						}
						var item = dataList[i];
						var imgUrl = item.img_url; // 图片地址
						imgUrl = global.url + '/mall' + imgUrl;
						var actPdtName = item.product_sub_title; // 产品名称
						var actIntegral = item.act_integral; // 活动积分【优先用活动积分】
						var productIntegral = item.product_integral; // 活动所需积分
						if (validatorUtil.isEmpty(actIntegral)) {
							actIntegral = productIntegral;
						}
						var productId = item.product_id; //产品编号
						
						var itemHtml = '<li productId="' + productId + '">' + 
										'	<div class="pro_pic">' + 
										'		<div class="ui layout">' + 
										'			<div class="row-1 row_fr">' + 
										'				<div class="fr_con">' + 
										'					<p><img src="' + imgUrl + '" width="100"/></p>' + 
										'				</div>' + 
										'			</div>' + 
										'		</div>' + 
										'	</div>' + 
										'	<h4>' + actPdtName + '</h4>' + 
										'	<p class="ared"><i class="mon_icon"></i>' + actIntegral + '东北米</p>' + 
										'	<a href="javascript:void(0)" class="exchange_btn">立即兑换</a>' + 
										'</li>';
						
						czqgListEle.append(itemHtml);
					}
					
					// 超值兑换  模块
					appUtils.bindEvent(_pageId + "#czqg_pre_list ul li", function(){
						var productId = $(this).attr("productId");
						var pageParam = {"product_id" : $(this).attr("productId")};
						appUtils.pageInit(pageCode, "active/valueExchange", pageParam);
					});
				}
			}
		}
		
		var activeType = constants.activeType.ACTIVE_TYPE_OVERBALANCE; // 活动类型 - 一米疯抢
		queryProductByType(activeType, callBack); // 调用产品公告方法查询
	}
	
	/**
	 * 根据活动类型查询活动产品信息
	 */
	function queryProductByType(activeType, callBack){
		var reqParam = {
			"activity_type" : activeType
		}
		
		service.activeProduct(reqParam, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == "0"){
				var results = data.results;
				callBack(results);
			} else {
				layerUtils.iMsg(-1, error_info);
			}
		});
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		//推荐
		appUtils.bindEvent(_pageId+"#tj", function(e){
		    customEvent(this);
		});
	    //理财
		appUtils.bindEvent(_pageId+"#lc", function(e){
			customEvent(this);
		});
		//活动
		appUtils.bindEvent(_pageId+"#hd", function(e){
			customEvent(this);
		});
		//我的
		appUtils.bindEvent(_pageId+"#wd", function(e){
			customEvent(this);
		});
		// 签到按钮
		appUtils.bindEvent(_pageId + ".qd_icon", function(){
			appUtils.pageInit(pageCode, "active/signIn", {});
		});
		
		// 一米疯抢
		appUtils.bindEvent("#ymfq_pre_list ul li", function(){
			var pageParam = {};
			appUtils.pageInit(pageCode, "active/oneMberserk", pageParam);
		});
		
		// 抢购
		appUtils.bindEvent("#xsqg_pre_list ul li", function(){
			var pageParam = {};
			appUtils.pageInit(pageCode, "active/details", pageParam);
		});
		
		// 抢购
		appUtils.bindEvent("#czqg_pre_list ul li", function(){
			var pageParam = {};
			appUtils.pageInit(pageCode, "active/valueExchange", pageParam);
		});
		
		// 更多超值兑换
		appUtils.bindEvent("#czhg", function(){
			var pageParam = {
				"active_type" : "3"		
			};
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
		});
		
		// 更多一米疯抢
		appUtils.bindEvent("#ymfq", function(){
			var pageParam = {
				"active_type" : "1"	
			};
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
		});
		
		// 更多限时抢购
		appUtils.bindEvent("#xsqg", function(){
			var pageParam = {
				"active_type" : "2"	
			};
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
		});
		
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	}
	
    //事件统计
    var customEvent = function (ob) { 
        Countly.q.push(['customEvent', {
            eventId: ob.id, duration: "1000"
        }]);
    };
    
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		// 离开页面时销毁定时任务
		if (pageGlobal.times.length > 0) {
			for (var i = 0; i < pageGlobal.times.length; i++) {
				var iTime = pageGlobal.times[i];
				if (iTime) {
					clearInterval(iTime);
				}
			}
		}
		pageGlobal.times = []; 
		pageGlobal.types = [];
		
		initView();
	}
	
	var activeIndex = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = activeIndex;
});