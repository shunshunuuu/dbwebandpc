define(function(require, exports, module) {
	var _pageId = "#software_orderPay "; // 页面id
	var pageCode = "software/orderPay";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    
    var user_id = null;
    var productId = null;
    var rulesId = null;
    var mobile_phone = null;
    var user_mail = null;
	var user_name = null; //用户名
	var order_no = null;
	var pay_account = null;
	var fund_account = null;
	var mobile = null;
	var zffs = null;
	var hdDetail = null; //是否是从活动详情来的
	var visitIp = null;
	/*
	 * 初始化
	 */
	function init() {
		productId = appUtils.getPageParam("productid");
		hdDetail = appUtils.getPageParam("hdDetail");
		var userInfo = appUtils.getSStorageInfo("userInfo");
		user_id = JSON.parse(userInfo).user_id;
		mobile = JSON.parse(userInfo).mobile_phone; //登录时的手机号
		pay_account = JSON.parse(userInfo).fund_account;//登录时的资金账号
		mobile_phone = JSON.parse(userInfo).telephone;
		user_mail = JSON.parse(userInfo).user_mail;
		user_name = JSON.parse(userInfo).user_name;
		
		if(pay_account){
			zffs = "资金账号";
			fund_account = pay_account;
		}else if(mobile){
			zffs = "手机号码";
			fund_account = mobile;
			mobile_phone = mobile;
		}
		//初始化页面
		initview();
		//查询资讯产品信息
		queryProductSoft();
        //查询此产品所有的价格规则
		queryProductRules();
	}
	
	
	function initview(){
		var initEle = $(_pageId+"#yhxx").empty();
		var html = '<p>客户姓名：<span>'+user_name+'</span></p>'+
			       '<p>'+zffs+'：<span>'+fund_account+'</span></p>'+
			       '<s></s>';
		initEle.append(html);
		
		if(hdDetail == "1"){
			$(_pageId + "#payboxs").attr("class","payboxs cant_pay");
			$(_pageId + "#payimg").html('<img src="images/bankicon004.png" alt="" />');
		} 	
		var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
    	
		$.getJSON(url, function (data) {
            visitIp = data.Ip;//弹出本地ip
    	});
		
		
	}
	
	//查询资讯产品信息
	function queryProductSoft(){
	    var param = {
    		"productId" : productId, // 产品编号
			"user_id" : common.getUserId(),
			"not_final_type" : 4   //软件产品
		};
		service.queryInfoDetail(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var softEle = $(_pageId+"#productsoft").empty();
			    if(results.length > 0){
				   for(var i = 0; i < results.length; i++){
					   var product_name = results[i].product_name;
					   if(product_name.length>10){
						   product_name = product_name.substring(0,10)+".....";
					   }
					   var imgPath = results[i].img_info_pro_url;
					   imgPath = global.url + imgPath;
		               var itemHtml = '<div class="softpic"><img src="'+imgPath+'" alt="" /></div>'+
							'<div class="softname flex-children">'+
						    '<p class="p1">'+product_name+'</p>'+
						    '<p class="p2">'+results[i].product_description+'</p>'+
					     '</div>';
					   softEle.append(itemHtml);
					}
			    }
			}else{
				layerUtils.iAlert("查询资讯产品信息失败:"+resultVo.error_info,-1);
			}
		})
    };
    //查询此产品所有的价格规则
    function queryProductRules(){
		var param = {
			 "product_id" : productId
		};
		
		service.queryPriceRules(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var rulesItem = results[0].KEY_MAP_PDT_RULE;
			    var rules = JSON.parse(rulesItem);
			    if(rules.length > 0){
			       var rulesEle = $(_pageId + "#rulesinfo").empty();
				   for(var i = 0; i < rules.length; i++){
					   var rules_type = rules[i].rules_type;
					   if(hdDetail){
				           if(rules_type == "1"){
								  var rules_explanation = rules[i].rules_explanation;
								  var rules_long = rules[i].rules_long;
								  var rules_unit = rules[i].rules_unit;
								  var rules_id = rules[i].rules_id;
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
								  var rules_price = rules[i].rules_price;
								  var ruleshtml ='<div rules_id = "'+rules_id+'" class="bankboxs changetime bankboxs_cc" >'+
									    '<input type="radio" name="pay" />'+
										'<label ></label>'+
										'<p class="plp1">'+rules_time+'</p>'+
										'<p class="plp2" id="je">'+rules_price+'元</p></div>';
								  rulesEle.append(ruleshtml);
						   } 
					   }else{
						   if(rules_type == "0"){
								  var rules_explanation = rules[i].rules_explanation;
								  var rules_long = rules[i].rules_long;
								  var rules_unit = rules[i].rules_unit;
								  var rules_id = rules[i].rules_id;
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
								  var rules_price = rules[i].rules_price;
								  var ruleshtml ='<div rules_id = "'+rules_id+'" class="bankboxs changetime bankboxs_cc" >'+
									    '<input type="radio" name="pay" />'+
										'<label for=""></label>'+
										'<p class="plp1">'+rules_time+'</p>'+
										'<p class="plp2" id="je">'+rules_price+'元</p></div>';
								  rulesEle.append(ruleshtml);
							   }
					   }
			
				   }
				   
					//选择套餐
					appUtils.bindEvent(_pageId + "#rulesinfo div", function(){
						$("#rulesinfo div label").removeClass();
						$(this).find("label").attr("class","on");
						var paymoney = $(this).find("p").eq(1).text();
						$(_pageId + "#fkje").text(paymoney);
						rulesId = $(this).attr("rules_id");
					});
			    }else{
			    	cpactiveEle.append('<li style="text-align:center; color:#c0c2c6; ">活动说明为空</li>');
			    }
			}else{
				layerUtils.iAlert("查询软件产品价格规则失败:"+resultVo.error_info,-1);
			}
		})
	}
    
    //初始化密码
	function MathRand(){ 
		var Num=""; 
		for(var i=0;i<6;i++){ 
		   Num+=Math.floor(Math.random()*10); 
		}
		return Num;
	} 
    
	function addInfoProduct(){
	    var Num = MathRand();
	    var param = {
			"user_id" : user_id, //用户id
			"product_id" : productId, //产品id
			"order_quantity" : 1,  //兑换数量
			"rules_id" : rulesId,   //规则编号
			"mobile_phone" : mobile_phone,
			"user_mail" : user_mail,
			"pay_account" : fund_account,
			"ip" : visitIp,
			"not_final_type" : "4",
			"initPwd" : Num
		};
		service.addInfoProduct(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
				var dhhtml = "";
			    if(results.length > 0){
			       var order_id = null;
				   for(var i = 0; i < results.length; i++){
					  var service_begin_time = results[i].service_begin_time;
					  var n_time = service_begin_time.substr(0,4);
					  var y_time = service_begin_time.substr(4,2);
					  var r_time = service_begin_time.substr(6,2);
					  var begin_time = n_time+"年"+y_time+"月"+r_time;
					  var service_end_time = results[i].service_end_time;
					  var nb_time = service_end_time.substr(0,4);
					  var yb_time = service_end_time.substr(4,2);
					  var rb_time = service_end_time.substr(6,2);
					  var end_time = nb_time+"年"+yb_time+"月"+rb_time;
					  var create_time = results[i].create_time;
					  order_no = results[i].order_no;
					  order_id = results[i].order_id;
					}
				   
				    if(hdDetail){
				    	orderPay(order_id);
				    }else{
				    	var tot_price = $(_pageId + "#fkje").text();
				    	var pricelength = tot_price.length;
				    	tot_price = tot_price.substr(0,pricelength-1); 
				    	var param = "order_no=" + order_no + "&tot_price=" + tot_price +"&ip=" +visitIp;
				    	var url = global.unionpay + "?" + param;
				    	appUtils.sendDirect(url);
				    }
			    }else{
			    	orderEle.append('<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>');
			    }
			}else{
				layerUtils.iAlert("查询订单列表失败:"+resultVo.error_info,-1);
			}
	  })
	};
	
	function orderPay(order_id){
		var param = {
			"order_id" : order_id,
		    "pay_type" : 7,
		    "user_id" : user_id,
		    "pay_account" : fund_account,
		    "ip" : visitIp
		};
		
		service.queryMyInfo(param, function(resultVo){
			if(0 == resultVo.error_no){
				querySoftwareDetail(order_id);
			}else{
				layerUtils.iAlert("支付失败:"+resultVo.error_info,-1);
			}
		});
	}
	
function querySoftwareDetail(order_id){
		
	    var param = {
			"order_id" : order_id, // 产品编号
			"user_id" : common.getUserId()
		};
		service.queryOrderDetail(param,function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results;
			    if(results.length > 0){
				   for(var i = 0; i < results.length; i++){
					      var order_no = results[i].order_no;
				    	  var product_name = results[i].product_name;
						  var rules_price_cash = results[i].rules_price_cash;
						  var rules_unit = results[i].rules_unit;
						  var rules_long = results[i].rules_long;
						  var pay_type = results[i].pay_way;
						  var initpwd = results[i].initpwd;
						  var param = {
								"rules_price_cash" : rules_price_cash,
								"product_name" : product_name,
								"order_no" : order_no,
								"rules_unit" : rules_unit,
								"rules_long" : rules_long,
								"pay_way" : 7,
								"initpwd" : initpwd
						  };
						  appUtils.pageInit(pageCode,"software/convertSuccess",param)
					 }
			   }
			}else{
				layerUtils.iAlert("查询资讯产品信息失败:"+resultVo.error_info,-1);
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
		
		
		//立即支付
		appUtils.bindEvent(_pageId + "#payment", function(){
			var tc = $(_pageId + ".setabottom").find("label").eq(0).attr("class");
			var ts = $(_pageId + ".setabottom").find("label").eq(1).attr("class");
			var zffs = $(_pageId + ".payboxs label").attr("class");
			if(hdDetail == "1"){
				if(tc){
					$(_pageId + "#zzcone").show();
					$(_pageId + "#zzctwo").show();
				}else{
					layerUtils.iAlert("请选择你要购买的套餐!","确定");
				}
			}else{
				if(tc){
					if(zffs){
						$(_pageId + "#zzcone").show();
						$(_pageId + "#zzctwo").show();
					}else{
						layerUtils.iAlert("请选择支付方式!","确定");
					}
				}else if(ts){
					if(zffs){
						$(_pageId + "#zzcone").show();
						$(_pageId + "#zzctwo").show();
					}else{
						layerUtils.iAlert("请选择支付方式!","确定");
					}
				}else{
					layerUtils.iAlert("请选择你要购买的套餐!","确定");
				}
			}
			
			
		});
		
		//继续支付
		appUtils.bindEvent(_pageId + "#continue", function(){
			$(_pageId + "#zzcone").hide();
			$(_pageId + "#zzctwo").hide();
			addInfoProduct();
		});
		
		//取消
		appUtils.bindEvent(_pageId + "#away", function(){
			$(_pageId + "#zzcone").hide();
			$(_pageId + "#zzctwo").hide();
		});
		
		//选择支付方式
		appUtils.bindEvent(_pageId + ".payboxs div", function(){
			$(".payboxs label").removeClass();
			$(this).find("label").attr("class" ,"on");
		});
		
		//关闭
		appUtils.bindEvent(_pageId + "#error", function(){
			$(_pageId + "#zzc").hide();
			$(_pageId + "#ddzf").hide();
		});
		
	};
	

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId + "#payradio").removeClass();
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});