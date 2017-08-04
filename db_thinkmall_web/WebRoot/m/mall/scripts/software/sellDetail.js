define(function(require, exports, module) {
	var _pageId = "#software_sellDetail "; // 页面id
	var pageCode = "software/sellDetail";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    
    var order_id = null;
    var pay_account = null;
    var gmztname = null;
    var gmzt = null;
	/*
	 * 初始化
	 */
	function init() {
		var userInfo = appUtils.getSStorageInfo("userInfo");
		user_id = JSON.parse(userInfo).user_id;
		mobile = JSON.parse(userInfo).mobile_phone; //登录时的手机号
		pay_account = JSON.parse(userInfo).fund_account;//登录时的资金账号
		
		if(pay_account){
			fund_account = pay_account; 
		}else if(mobile){
			fund_account = mobile;
		}
		order_id = appUtils.getPageParam("order_id");
	    gmzt = appUtils.getPageParam("gmzt");
		if(gmzt == "0"){
			gmztname = "已失效";
		}else if(gmzt == "1"){
			gmztname = "已购买";
		}
		//查询订单详情
		querySoftwareDetail();
		
	}
	
	
	function  DateDiff(sDate1,  sDate2){    //sDate1和sDate2是2002-12-18格式  
	       var  aDate,  oDate1,  oDate2,  iDays  
	       aDate  =  sDate1.split("-")  
	       oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式  
	       aDate  =  sDate2.split("-")  
	       oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
	       iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
	       return  iDays  
	}
	
	
	function querySoftwareDetail(){
		
	    var param = {
			"order_id" : order_id, // 产品编号
			"user_id" : common.getUserId()
		};
		service.queryOrderDetail(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var InfoEle = $(_pageId+"#softproduct").empty();
				var dhhtml = "";
			    if(results.length > 0){
				   for(var i = 0; i < results.length; i++){
					      var order_id = results[i].order_id;
					      var order_no = results[i].order_no;
				    	  var product_id = results[i].product_id;
				    	  var product_name = results[i].product_name;
				    	  var product_description = results[i].product_description;
						  var end_time = results[i].service_end_time;
						  var nb_time = end_time.substr(0,4);
						  var yb_time = end_time.substr(4,2);
						  var rb_time = end_time.substr(6,2);
						  var service_end_time = nb_time+"."+yb_time+"."+rb_time;
						  var js_time = nb_time+"-"+yb_time+"-"+rb_time;
						  var begin_time = results[i].service_begin_time;
						  var knb_time = begin_time.substr(0,4);
						  var kyb_time = begin_time.substr(4,2);
						  var krb_time = begin_time.substr(6,2);
						  var service_begin_time = knb_time+"."+kyb_time+"."+krb_time;
						  var ks_time = knb_time+"-"+kyb_time+"-"+krb_time;
						  var imgPath = results[i].img_url;
						  imgPath = global.url + imgPath;
						  var rules_price_cash = results[i].rules_price_cash;
						  var rules_unit = results[i].rules_unit;
						  var rules_long = results[i].rules_long;
						  var initpwd = results[i].initpwd;
						  var rules_time = null;
						  if(rules_unit == "0"){
							  rules_time = rules_long+"天";
						  }else if(rules_unit == "1"){
							  rules_time = rules_long+"个月";
						  }else if(rules_unit == "2"){
							  rules_long = rules_long*3;
							  rules_time = rules_long+"个月";
						  }else if(rules_unit == "4"){
							  rules_time = rules_long+"年";
						  }
						  var price_time = rules_price_cash+"元/"+rules_time;
						  var pay_type = results[i].pay_way;
						  if(pay_type == "7"){
							  pay_type = "银联支付";
						  }else if(pay_type == "6"){
							  pay_type = "东北米支付";
						  }
						  var ts = DateDiff(ks_time, js_time);
					      var softwarehtml = '<div class="softany">'+
							'<p class="flex-father soft_bt">'+
						'<span class="flex-children">'+product_name+'</span>'+
						'<span class="san01">'+gmztname+'</span>'+
					'</p>'+
					'<div class="mypros">'+
						'<ul>'+
							'<li>'+
								'<div class="sibnews flex-father">'+
									'<div class="sibnews_soft">'+
										'<img src="'+imgPath+'" alt="" />'+
									'</div>'+
									'<div class="sibnews_r flex-children">'+
										'<p class="sp1">'+product_description+'</p>'+
										'<p class="sp2">有效期：'+service_begin_time+'-'+service_end_time+'</p>'+
										'<div class="theprice">购买价格：<span>'+price_time+'</span></div>'+
									'</div>'+
								'</div>'+
							'</li>'+
						'</ul>'+
					'</div>'+
					'<div class="softmore">'+
						'<ul>'+
							'<li class="flex-father">'+
								'<p>订单编号</p>'+
								'<p class="flex-children">'+order_no+'</p>'+
							'</li>'+
							'<li class="flex-father">'+
								'<p>支付方式</p>'+
								'<p class="flex-children">'+pay_type+'</p>'+
							'</li>'+
							'<li class="flex-father">'+
								'<p>剩余天数</p>'+
								'<p class="flex-children">'+ts+'天</p>'+
							'</li>'+
							'<li class="flex-father">'+
								'<p>购买账号</p>'+
								'<p class="flex-children">'+fund_account+'</p>'+
							'</li>'+
							'<li class="flex-father">'+
								'<p>密码</p>'+
								'<p class="flex-children">'+initpwd+'</p>'+
							'</li>'+
						'</ul>'+
					'</div>'+
				'</div>';
					      
					      InfoEle.append(softwarehtml);
					      
				        var bottomEle = $(_pageId +"#bottom").empty();
						if(gmzt == "1"){
							var gmhtml = '<div class="renew">'+
					            '<a href="javascript:;" id = "renewal">续费</a>'+
					            '</div>';
							bottomEle.append(gmhtml);
						}
						
						appUtils.bindEvent(_pageId + "#renewal",function(){
							var param = {
								"productid" : product_id
							}
							appUtils.pageInit(pageCode, "software/orderPay", param)
						});
				   }
			    }
			}else{
				layerUtils.iAlert("查询软件产品信息失败:"+resultVo.error_info,-1);
			}
		})
};
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 返回
		appUtils.bindEvent(_pageId + ".back_btn", function() {
			appUtils.pageBack();
		});
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});