define(function(require, exports, module) {
	var _pageId = "#main "; // 页面id
	var pageCode = "main";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
    var gconfig = require("gconfig");
    
	require("mall/scripts/common/plugins/swiperEvent");
	
	var MyMar1=null;
	
	var pageGlobal = {
			"isFileState" : "0", // 广告是否有效
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}
	/*
	 * 初始化
	 */
	
	function init() {
		layerUtils.iLoading(true);
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		// 初始化页面
		initView();
		// 设置APP综合首页地址
		$(_pageId + ".home_btn").attr("href", global.appIndexUrl);
		// 底部导航
		common.footerTab(_pageId);
	
		
		getLoginClientInfo(false);
		
	}
	
	function pageFunc(){
		//平台最新购买动态
		zxgmProduct();
		
		addProImg();
		
		// 精选产品
		hotsaleProduct();
		
		//投资主题
		xqlcProduct();
		
		//查询数据字典
		queryMotifType();
		
		
		//投资参考
//		tzckRecommend();
		
		//特色理财
		teselicaiAdvert();
		
		// 即将推出广告位
		comingSoon();
	}

	/**
	 * 获取登录用户的信息
	 */
	function getLoginClientInfo(flag){
		//获取已经登录的mobilecode、user_token
		console.log("进入方法getLoginClientInfo");
		layerUtils.iLoading(true); 
		var servticket_id = appUtils.getSStorageInfo("servticket_id");
		var isFromApp = appUtils.getSStorageInfo("isFromApp");
		var errorcode = appUtils.getSStorageInfo("errorcode");
		var qdly = appUtils.getSStorageInfo("isqdly");
		var temp_token_mall = appUtils.getSStorageInfo("temp_token_mall");
		var client_id = appUtils.getSStorageInfo("client_id");
//		alert("票据-----"+servticket_id);
		if(servticket_id && !errorcode){
			var param = {
				"servticket_id" : servticket_id
			};
//			alert("进入方法"+servticket_id);
			var callBack=function(data){
				layerUtils.iLoading(true); 
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0"){
					var results = data.results[0];
					common.saveSessionUserInfo(results);
					var user_id = results.user_id;
//					alert("走回调："+user_id);
					appUtils.setSStorageInfo("user_id",user_id)
				} else {
					layerUtils.iMsg(-1,error_info);
//					return false;
				}
				layerUtils.iLoading(true);
				pageFunc();
			}
			
			service.unifiedLogin(param,callBack);
		}else if(temp_token_mall){
			
			//业务参数
			var param = {};	
			param['temp_token'] = temp_token_mall;
			//统一登录URL地址
			var callback = function(data){	
				if(data){
					if(data.error_no == 0){
					   var loginParam = {
            				"client_id" : client_id
            		   };
					   var userinfo = function(data){
							var error_no = data.error_no;
							var error_info = data.error_info;
							if (error_no == "0" ){
								var results = data.results[0];
								common.saveSessionUserInfo(results);
								var user_id = results.user_id;
								appUtils.setSStorageInfo("user_id",user_id)
								var userInfoCallback = function(data){
								   if(data.error_no == "0"){
								       pageFunc();
								   }else{
								       layerUtils.iMsg(-1,data.error_info);
									   pageFunc();
								   }
								}
								service.getSessionInfo({},userInfoCallback);
							} else {
								layerUtils.iMsg(-1,error_info);
								pageFunc();
							} 
					   }
					   
					   service.userInfo(loginParam,userinfo);
					}else{
						layerUtils.iMsg(-1,data.error_info);
						pageFunc();
					}
				}
			}
			//调用统一登录
			service.createSession(param,callback);	
		}else{
			 // 需要登录时唤起登录框
	    	   if(flag){
	    		   // 唤起对应登录框
	    		   common.getLoginTrade(flag);
	    	   }
	    	   pageFunc();
		}
	}
	//投资参考
	function tzckRecommend(){
		  var tzckEle = $(_pageId+"#tzck").empty();
		  var itemHtml = "";
		  $.post(global.tzckurl,
			  function(data){
			   if(data.length > 0){
				   for (var i = 0; i < data.length; i++) {
				        itemHtml+='<li><a href="http://221.232.160.228/dbzq/content.html?catid='+data[i].catid+'&id='+data[i].id+'">';
				        if(i==0){
				        	itemHtml+='<span class="sps01">'+data[i].catName+'</span>';
				        }else if(i==1){
				        	itemHtml+='<span class="sps01 sps03">'+data[i].catName+'</span>';
				        }else if(i==2){
				        	itemHtml+='<span class="sps01 sps04">'+data[i].catName+'</span>';
				        }
						
					    itemHtml+='<span class="sps02">'+data[i].title+'</span>'+
					          '</a>'+
				             '</li>';
					}
			   }else{
				   itemHtml+='<li style="text-align:center; color:#c0c2c6; ">暂无数据</li>';
			   }
			    
			   tzckEle.append(itemHtml);
			   
		 },"json");
	}
	
	
	function initView(){
		clearHIscroll();
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
	
	/**
	 * 清除滑动组件
	 */
	function clearHIscroll(){
		if(myHIscroll){
			myHIscroll.destroy();
			myHIscroll = null;
		}
	}
	
	/*
	 * 首页banner图
	 */
	function addProImg() {
		
		var cashbutlerAdverBackFun = function(result){
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + "#inner").empty();
			var dotsBox = $(_pageId + " #dots_box").empty();
			var j = 0;//统计有效广告个数
			var adItems = "";
			var sadItems = "";
			for (var i = 0; i < result.length; i++) {
				
				var item = result[i];
				var imgPath = item.picture ? item.picture : item.small_picture; // 图片地址
				var file_state = item.file_state; // 文件状态是否有效
				if (file_state != "1") {
					continue;
					
				}else{
					pageGlobal.isFileState = "1";
				}
				
				// 广告控制在4个以内
				if (j++ > 3) {
					break;
				};
				
				imgPath = global.url + '/mall' + imgPath;
				
				var linkUrl = ""; // 链接地址			
				var state = item.state; // 链接是否有效
	
				if (state == "1") {
					linkUrl = item.url;
					
				} else {
					linkUrl = "javascript:void(0)";
				}
				
				if (i == 0) {
					adItems += "<li url='" + linkUrl + "'><img data-pro_url='"+ linkUrl +"' src='"+ imgPath + "'  width='100%' style='height:1.44rem;'/></li>";
					sadItems += "<em class='active'></em>";
				} else {
					adItems += "<li url='" + linkUrl + "'><img data-pro_url='"+ linkUrl +"' src='"+ imgPath + "'  width='100%' style='height:1.44rem;'/></li>";
					sadItems += "<em></em>";
				}
			};
			
			if(pageGlobal.isFileState == "1"){
				adAreaEle.append(adItems); // 显示位置ul
//				dotsBox.append(sadItems);
				HIscroll_init();
			}
			// 图片地址跳转
			clickImg();
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_LC_JPTJ;
		queryAdvert(groupId, cashbutlerAdverBackFun);
	};
	
	
	/**
	 * 绑定广告事件
	 */
	function clickImg(){
		
		appUtils.bindEvent($(_pageId + " img"), function(e){
			
			var $this = $(this);
			var cur = $(this).index()+parseInt(1);
			pro_url = $this.attr("data-pro_url");
			var a = $(this).attr("id");
			if(a == "dbtp"){
				countEventsj("金融商城点击底部推广广告");
			}else{
				countEvent("金融商城点击推广广告","Banner 广告位第"+cur+"屏");
			}
			appUtils.sendDirect(pro_url, true, "main");
			if (pro_url){
				appUtils.sendDirect(pro_url, true, "main");
			}
			e.stopPropagation();
		}, "click");
	}
    
	/**
	 * HIscroll左右滑动组件
	 */
	function HIscroll_init(){
		if(!myHIscroll){
	        var config = {
	            wrapper: $(_pageId+' #rotation_box'), //wrapper对象
	            scroller: $(_pageId+' #inner'), //scroller对象
	            perCount: 1,  //每个可视区域显示的子元素，就是每个滑块区域显示几个子元素
	            showTab: true, //是否有导航点
	            tabDiv: $(_pageId+'#dots_box'), //导航点集合对象
	            auto: true //是否自动播放
	        };
	        myHIscroll = new HIscroll(config);
	        $(_pageId+'#inner li').show();
	    }
	}
	
	//平台最新购买动态
	function zxgmProduct(){
		var param = {
	    };
		var callBack=function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
				fillzxgm(results);
			}else{
				layerUtils.iAlert("查询最新购买订单失败:"+resultVo.error_info,-1);
			}
		};

		service.querynewOrder(param,callBack);
		
	}
	
	
	function gdxg(){
		var speed=50;
		 var ZJJDemo=document.getElementById('demo');
		 var ZJJDemo1=document.getElementById('demo1');
		 var ZJJDemo2=document.getElementById('demo2');
		 ZJJDemo2.innerHTML=ZJJDemo1.innerHTML;
		 function Marquee1(){
			 if(ZJJDemo2.offsetHeight-ZJJDemo.scrollTop<=0)
			     ZJJDemo.scrollTop-=ZJJDemo1.offsetHeight
			 else{
			     ZJJDemo.scrollTop++;
			 }
		 }
		 MyMar1=setInterval(Marquee1,speed);
		 ZJJDemo.onmouseover=function() {clearInterval(MyMar1)};
		 ZJJDemo.onmouseout=function() {MyMar1=setInterval(Marquee1,speed)};
		 
	}
	   
	
	function fillzxgm(results){
		var html = "";
		if(results.length>4){
			for(var i = 0; i < 4; i++){
			  var item = results[i];
		      var fund_account=item.fund_account;
		      var qid = fund_account.substr(0,3);
		      var id=fund_account.substr(3,3);
		      var fund_account=qid+id.replace(id,"***")+fund_account.substr(6,2);
		      var product_name=item.product_name;
			  html+='<li><a href="javascript:;"><p>客户<span>'+fund_account+'</span>刚刚购买了<span>'+product_name+'</span>产品</p></a></li>';
			}
		}else{
		   if(results.length > 0){
			   for(var i = 0; i < results.length; i++){
					  var item = results[i];
				      var fund_account=item.fund_account;
				      var qid = fund_account.substr(0,3);
				      var id=fund_account.substr(3,3);
				      var fund_account=qid+id.replace(id,"***")+fund_account.substr(6,2);
				      var product_name=item.product_name;
					  html+='<li><a href="javascript:;"><p>客户<span>'+fund_account+'</span>刚刚购买了<span>'+product_name+'</span>产品</p></a></li>';
			   }  
		   }
			
		}
		$(_pageId+"#gmxx").html(html);
		gdxg();
	}
	
	//特色理财
	function teselicaiAdvert() {
		    var teselicaiAdverBackFun = function(result){
			var itemHtml="";
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + "#tslc").empty();
			if (result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					var imgPath = result[i].picture ? result[i].picture : result[i].small_picture;//图片地址
				    var file_state = result[i].file_state; //文件状态是否有效
				    if(file_state == "1"){
					    imgPath = global.url + '/mall' +imgPath;
					    var liknUrl = ""; //链接地址
					    var state = result[i].state; //链接地址是否有效
					    if(state == "1"){
					    	linkUrl = result[i].url;
					    }else{
					    	linkUrl = "javascript:void(0)";
					    }
					    
					    var strs = new Array();
					    strs = result[i].description.split(",");
					    var ms1 = "";
					    var ms2 = "";
					    for (var j = 0; j < strs.length; j++) {
							ms1 = strs[0];
							ms2 = strs[1];
	 					};
	 					
						itemHtml +='<li url="'+linkUrl+'">' +
						       '	<img data-pro_url="'+linkUrl+'" src="' + imgPath + '"/>' + 
						       '<p class="sp01">' +ms1+ '</p>' +
						       '</li>';
				    }
				}
			}
			adAreaEle.append(itemHtml);
			footerTabs();
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_TSLC;
		queryAdvert(groupId, teselicaiAdverBackFun);
		
		
	};
	
/*
	 * 特色理财图片跳转
	 * */
	function footerTabs(){
		appUtils.bindEvent($(_pageId + ".flex-father li"),function(){
//			var amg= $(_pageId + ".flex-father li").addClass("active");
			var lil=$(_pageId + ".flex-father li").length;
			var index = $(_pageId + ".flex-father li").index(this);
			var _curPageCode = appUtils.getSStorageInfo("_curPageCode");// 当前页pageCode
//			var bottomname = $(this).find("p").html();
			var lmname = $(this).find("p").html();
			countEvent("金融商城首页点击特色理财栏目","栏目名称："+lmname);
			var url=$(this).attr("url");
			url = (url.split("#!/")[1]).replace(".html","");
			var _loginInPageCode = "account/cashbutler/detail";
			if(url == "account/cashbutler/detail"){
				if (common.checkUserIsLogin(true, false,_loginInPageCode,null,true)) {
					appUtils.pageInit(_curPageCode,url,{});
				}
			}else{
				appUtils.pageInit(_curPageCode,url,{});
			}
			
		});
	}
	
	
	
	
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
	 * 精选产品推荐
	 */
	function hotsaleProduct(){
		// 推荐产品结果集回调函数
		var recomProBackFun = function(result) {
			var monthHotProductEle = $(_pageId + "#pro_main").empty();
			
			if(result.length >= 2){
				// 精选产品区域填充数据
				for (var i = 0; i < 2; i++) {
					// 显示标题
					var title = "";
					if (i == 0){
						title = '<div class="pro_main"><div class="pro_tits"><a href="javascript:void(0);">' +
							    '	<p class="sp01"><i></i>精选产品</p><p class="sp02" id="rmcpgd">更多产品，请点击进入<s></s></p>' +
							    '</a></div>';
					}
					
					var item = result[i];
					var productName = item.product_name; // 产品名称
					var product_abbr = item.product_abbr;
					var productSubType = item.product_sub_type; // 产品类型
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var period = item.period || "--"; // 理财周期
					var annual_profit = item.annual_profit || "--"; // 七日年化预期收益率
					var earnings = item.earnings || "--"; // 预期年化收益率
					var productStatus = item.product_status; // 产品状态
					var finaBelongs  = item.fina_belongs; 
					var tzqx = item.investment_horizon || "--";
					
				
					if(productSubType && productSubType == '0'){
						var showName = "理财基金";
						var showNameOne = "业绩比较基准";
						var showValueOne = annual_profit;
						
						// 第二个要展示的字段名称&值
						var showNameTwo = "理财周期";
						var showValueTwo = period;
					}else{
						if(finaBelongs && finaBelongs == '1'){
							var showName = "资管理财";
						}else if(finaBelongs == '2'){
							var showName = "银行理财";
						}else if(finaBelongs == '5'){
							var showName = "OTC";
						}
					}
					if (finaBelongs && finaBelongs == '2' || finaBelongs == '5') {
							var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
							var showNameOne = showFiledOneObj.name;
							var showValueOne = showFiledOneObj.value;
							var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
							var showNameTwo = showFiledTwoObj.name;
							var showValueTwo = showFiledTwoObj.value;
					}else if(finaBelongs == '1'){
							var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
							var showNameOne = "业绩比较基准";
							var showValueOne = earnings + '<em style="font-size: smaller;">%</em>';
							var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
							var showNameTwo = showFiledTwoObj.name;
							var showValueTwo = showFiledTwoObj.value;
					}
					
					var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
					var showNameThree = showFiledThreeObj.name;
					var showValueThree = (showFiledThreeObj.value).toString();
//					showValueThree = showValueThree.replaceAll(",","");
					showValueThree = showValueThree.replace("万", "<em>万</em>");
					
					productName = putils.delProSpecialStr(productName);
					if (productName.length > 17) {
						productName = productName.substring(0, 16) + "...";
					}
					
					product_abbr = putils.delProSpecialStr(product_abbr);
					if (product_abbr.length > 17) {
						product_abbr = product_abbr.substring(0, 16) + "...";
					}
					var itemHtml = '' + title + '' +
					   '<div class="prolist" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' +
					   ' <div class="dutc_tit">' +
					   '		<p class="sp01">' + product_abbr + '</p>' +
					   '   <p class="sp02">'+
					   '    <span class="san01">' + showValueThree + '元起购</span>' +
					   '    <span class="san02">' + showName + '</span> '+
					   '   </p>' +
					   ' </div>' +
					   ' <div class="dutc_box flex-father"><s></s>' +
					   '		<div class="dutc_bl flex-children">' +
					   '			<p class="sp01">'+earnings+'<span>%</span></p>' +
					   '			<p class="sp02">业绩比较基准</p>' +
					   '		</div>' +
					   '		<div class="dutc_bt flex-children">' +
					   '		    <p class="sp01">'+tzqx+'<span>天</span></p>' +
					   '		    <p class="sp02">投资期限</p>' +
					   '		</div>' +
					   '	</div>' +
					   ' </div>' +
					   '</div>' ;
					monthHotProductEle.append(itemHtml);
				}
			}else{
			  if(result.length > 0){
				  
				  for (var i = 0; i < result.length; i++) {
					  // 显示标题
					  var title = "";
					  if (i == 0){
						  title = '<div class="pro_main"><div class="pro_tits"><a href="javascript:void(0);">' +
						  '	<p class="sp01"><i></i>精选产品</p><p class="sp02" id="rmcpgd">期限灵活，提前锁定收益<s></s></p>' +
						  '</a></div>';
					  }
					  
					  var item = result[i];
					  var productName = item.product_name; // 产品名称
					  var product_abbr = item.product_abbr;
					  var productSubType = item.product_sub_type; // 产品类型
					  var productId = item.product_id; // 产品编号
					  var productCode = item.product_code; // 产品代码
					  var period = item.period || "--"; // 理财周期
					  var annual_profit = item.annual_profit || "--"; // 七日年化预期收益率
					  var earnings = item.earnings || "--"; // 预期年化收益率
					  var productStatus = item.product_status; // 产品状态
					  var finaBelongs  = item.fina_belongs; 
					  var tzqx = item.investment_horizon || "--";
					  
					  
					  if(productSubType && productSubType == '0'){
						  var showName = "理财基金";
						  var showNameOne = "业绩比较基准";
						  var showValueOne = annual_profit;
						  
						  // 第二个要展示的字段名称&值
						  var showNameTwo = "理财周期";
						  var showValueTwo = period;
					  }else{
						  if(finaBelongs && finaBelongs == '1'){
								var showName = "资管理财";
							}else if(finaBelongs == '2'){
								var showName = "银行理财";
							}else if(finaBelongs == '5'){
								var showName = "OTC";
							}
					  }
					  if (finaBelongs && finaBelongs == '2' || finaBelongs == '5') {
						  var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
						  var showNameOne = showFiledOneObj.name;
						  var showValueOne = showFiledOneObj.value;
						  var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
						  var showNameTwo = showFiledTwoObj.name;
						  var showValueTwo = showFiledTwoObj.value;
					  }else if(finaBelongs == '1'){
						  var showFiledOneObj = putils.getRecomField(1, item, true); // 第一个要展示的字段名称&值
						  var showNameOne = "业绩比较基准";
						  var showValueOne = earnings + '<em style="font-size: smaller;">%</em>';
						  var showFiledTwoObj = putils.getRecomField(2, item, true); // 第二个要展示的字段名称&值
						  var showNameTwo = showFiledTwoObj.name;
						  var showValueTwo = showFiledTwoObj.value;
					  }
					  
					  var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
					  var showNameThree = showFiledThreeObj.name;
					  var showValueThree = (showFiledThreeObj.value).toString();
//					showValueThree = showValueThree.replaceAll(",","");
					  showValueThree = showValueThree.replace("万", "<em>万</em>");
					  
					  productName = putils.delProSpecialStr(productName);
					  if (productName.length > 17) {
						  productName = productName.substring(0, 16) + "...";
					  }
					  
					  product_abbr = putils.delProSpecialStr(product_abbr);
					  if (product_abbr.length > 17) {
						product_abbr = product_abbr.substring(0, 16) + "...";
					  }
					  var itemHtml = '' + title + '' +
					  '<div class="prolist" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">' +
					  ' <div class="dutc_tit">' +
					  '		<p class="sp01">' + product_abbr + '</p>' +
					  '   <p class="sp02">'+
					  '    <span class="san01">' + showValueThree + '元起购</span>' +
					  '    <span class="san02">' + showName + '</span> '+
					  '   </p>' +
					  ' </div>' +
					  ' <div class="dutc_box flex-father"><s></s>' +
					  '		<div class="dutc_bl flex-children">' +
					  '			<p class="sp01">'+earnings+'<span>%</span></p>' +
					  '			<p class="sp02">业绩比较基准</p>' +
					  '		</div>' +
					  '		<div class="dutc_bt flex-children">' +
					  '		    <p class="sp01">'+tzqx+'<span>天</span></p>' +
					  '		    <p class="sp02">投资期限</p>' +
					  '		</div>' +
					  '	</div>' +
					  ' </div>' +
					  '</div>' ;
					  monthHotProductEle.append(itemHtml);
				  }
			  }else if(result.length > 0){
					$(_pageId + "remcp").hide();
			  }	
			}
			// 绑定详情事件
			appUtils.bindEvent(_pageId + ".prolist", function(){
				var curEle = $(this);
				var productname = $(this).children().eq(0).find("p").eq(0).html()
//				countEvent("金融商城首页点击精选产品详情","产品名称："+productname);
				productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
			});
			
			//更多精选产品
			appUtils.bindEvent(_pageId + "#rmcpgd", function() {
				countEventsj("金融商城首页点击进入精选产品");
				appUtils.pageInit(pageCode, "product/jxcp");
			});
		};

		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_INDEX_JXCP;
		queryRecomProductByType(recommendType, recomProBackFun);
	}
	
	/*
	 * 获取产品类型所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "product_catogory" 
		}
		
		service.queryEnum(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						var result = data.results[i];
						var item_id = result.item_id; // 值编号 
						var item_name = result.item_name; // 项目名
						var item_value = result.item_value; // 项目值
						var enumTemp = {
								"itemValue" : item_value,
								"itemName" : item_name,
								"itemId" : item_id
							}
						pageGlobal.enumData.push(enumTemp);
					}
					//投资主题
					xqlcProduct();
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
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
	
	
	function xqlcProduct(){
		var xqlcProductFun = function(result){
			var xqlcEle = $(_pageId+"#tzzt").empty();
			
			if(result.length >= 2){
				for(var i = 0; i < 2; i++){
					// 显示标题
					var title = "";
					if (i == 0){
						 title='<div class="pro_tits pro_tits_ac">'+
					        '<a href="javascript:void(0);">'+
						      '<p class="sp01"><i></i>投资主题</p>'+
						      '<p class="sp02" id="xqlcgd">把握最新的投资机会<s></s></p>'+
					        '</a>'+
				          '</div>';
					}
					
					var item = result[i];
					var productName = item.product_name; // 产品名称
					var productSubType = item.product_sub_type; // 产品类型
					var productId = item.product_id; // 产品编号
					var productCode = item.product_code; // 产品代码
					var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
					var yield1 = parseFloat(yieldrate1m).toFixed(2);
					var currentPrice = item.current_price || "0"; // 单位净值
					var dwjz = parseFloat(currentPrice).toFixed(4);
					productName = putils.delProSpecialStr(productName);
					var qgjg = item.per_buy_limit;
					var cplb = item.fund_type;
					cplb = queryenum(cplb);
					
					
					var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
					var showNameThree = showFiledThreeObj.name;
					var showValueThree = (showFiledThreeObj.value).toString();
//					showValueThree = showValueThree.replaceAll(",","");
					showValueThree = showValueThree.replace("万", "<em>万</em>");
					var reason = item.recommend_reason;
					var str = new Array();
					str = reason.split(" ");
					var zhutione = str[0];
					var zhutitwo = str[1];
					
					var  itemHtml='' + title + '' +
						'<div class="pl_two" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">'+
					   '<div class="plin">'+
				         '<div class="plin_l">'+
					       '<p class="sp01">'+zhutione+'</p>'+
					       '<p class="sp02">'+zhutitwo+'</p>'+
					       '<p class="sp03"><span class="san01">'+cplb+'</span>'+
					       '<span class="san02">'+showValueThree+'元</span></p>'+
				         '</div>'+
				         '<div class="plin_r"><s></s>'+
					         '<p class="sp01">'+yield1+'<span>%</span></p>'+
					         '<p class="sp02">近一个月收益率</p>'+
				         '</div>'+
			          '</div>'+
			        '</div>';
					
					xqlcEle.append(itemHtml);
				}
			}else{
			   if(result.length > 0){
					for(var i = 0; i < result.length; i++){
						// 显示标题
						var title = "";
						if (i == 0){
							 title='<div class="pro_tits pro_tits_ac">'+
						        '<a href="javascript:void(0);">'+
							      '<p class="sp01"><i></i>投资主题</p>'+
							      '<p class="sp02" id="xqlcgd">把握最新的投资机会<s></s></p>'+
						        '</a>'+
					          '</div>';
						}
						
						var item = result[i];
						var productName = item.product_name; // 产品名称
						var productSubType = item.product_sub_type; // 产品类型
						var productId = item.product_id; // 产品编号
						var productCode = item.product_code; // 产品代码
						var yieldrate1m = item.yieldrate1m || "0"; // 近一个月收益率
						var yield1 = parseFloat(yieldrate1m).toFixed(2);
						var currentPrice = item.current_price || "0"; // 单位净值
						var dwjz = parseFloat(currentPrice).toFixed(4);
						productName = putils.delProSpecialStr(productName);
						var qgjg = item.per_buy_limit;
						var cplb = item.fund_type;
						cplb = queryenum(cplb);
						var reason = item.recommend_reason;
						var str = new Array();
						str = reason.split(" ");
						var zhutione = str[0];
						var zhutitwo = str[1];
						
						var showFiledThreeObj = putils.getRecomField(3, item, true); // 第三个要展示的字段名称&值
						var showNameThree = showFiledThreeObj.name;
						var showValueThree = (showFiledThreeObj.value).toString();
//						showValueThree = showValueThree.replaceAll(",","");
						showValueThree = showValueThree.replace("万", "<em>万</em>");
						
						var  itemHtml='' + title + '' +
							'<div class="pl_two" productCode="' + productCode + '" productId="' + productId + '" productSubType="' + productSubType + '">'+
						   '<div class="plin">'+
					         '<div class="plin_l">'+
						       '<p class="sp01">'+zhutione+'</p>'+
						       '<p class="sp02">'+zhutitwo+'</p>'+
						       '<p class="sp03"><span class="san01">'+cplb+'</span>'+
						       '<span class="san02">'+showValueThree+'元</span></p>'+
					         '</div>'+
					         '<div class="plin_r"><s></s>'+
						         '<p class="sp01">'+yield1+'<span>%</span></p>'+
						         '<p class="sp02">近一个月收益率</p>'+
					         '</div>'+
				          '</div>'+
				        '</div>';
						
						xqlcEle.append(itemHtml);
					}
			   }else if(result.length > 0){
					$(_pageId + "xianqlc").hide();
			   }	
	
			}
		
			// 绑定详情事件
			appUtils.bindEvent(_pageId + ".pl_two", function(){
			    var curEle = $(this);
				var theme=$(this).children().children().children("p").html();
				countEvent("金融商城首页点击投资主题栏目产品","产品名称:"+theme);
				productDetail(curEle.attr("productId"), curEle.attr("productSubType"), curEle.attr("productCode"));
			});
			
			//更多投资主题产品
			appUtils.bindEvent(_pageId + "#xqlcgd", function(){
				countEventsj("金融商城首页点击进入更多投资主体");
				appUtils.pageInit(pageCode, "product/tzzt");
			});
		}
		// 调用后台方法查询推荐产品
		var recommendType = constants.recommendType.RECOMMEND_TYPE_INDEX_TZZT;
		queryRecomProductByType(recommendType, xqlcProductFun);
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
			// 现金管家详情
			var userInfo = appUtils.getSStorageInfo("userInfo");
			if (userInfo) {
				var user_id = JSON.parse(userInfo).user_id;
				if (user_id) {
					appUtils.pageInit(pageCode, "account/cashbutler/detail", {});
					return false;
				}
			}
			
			appUtils.pageInit(pageCode, "login/userLogin", {});
			return false;
			
		} else {
			// 非现金管家
			if(subType == constants.product_sub_type.FUND){
				// 基金产品详情
				appUtils.pageInit(pageCode, "finan/detail", {"product_id" : productId});	
			}else if(subType == constants.product_sub_type.FINANCIAL){
				// 理财产品详情
				appUtils.pageInit(pageCode, "finan/finanDetail", {"product_id" : productId});	
			}
		}
		
	}
	
	/*
	 * 即将推出广告位
	 */
	function comingSoon() {
		var comingSoonBackFun = function(result){
			
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + "#coming_soon").empty();
			if (result.length > 0) {
				var item = result[0];
				var imgPath = item.picture ;// 图片地址
				if(imgPath!=""){
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
					
					var itemHtml = 	'<img id = "dbtp" src="' + imgPath + '"  width="100%" data-pro_url="' + linkUrl + '" onclick=""/>';
					
					adAreaEle.append(itemHtml);
					// 点击图片 链接跳转
					clickImg();
				}else{
					$(_pageId + "#coming_soon").hide();
				}
			}
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_RECOM_IMG;
		queryAdvert(groupId, comingSoonBackFun);
	};
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		// 登录
		appUtils.bindEvent(_pageId + ".per_btn", function() {
			countEventsj("金融商城首页点击登陆");
			appUtils.pageInit(pageCode, "account/userCenter", {});
			return false;
			
		});
		
		//投资参考更多
		appUtils.bindEvent(_pageId + "#gd", function(){
//			appUtils.pageInit(pageCode,"http://221.232.160.228/dbzq/list.html?catid=296");
		    appUtils.sendDirect("http://221.232.160.228/dbzq/list.html?catid=296");
		});
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
		
		//特色理财栏目
		appUtils.preBindEvent($(_pageId + " .smallbox ul"),"li a", function(e) {
			var lmname = $(this).find("p").html();
			countEvent("金融商城首页点击特色理财栏目","栏目名称："+lmname);
		});
	};
	

	//统计
	function countEvent(id,name){
		TDAPP.onEvent(id,name);
	}
	
	function countEventsj(id){
		TDAPP.onEvent(id);
	}
	
	
	function cleartimer(){
		var speed = null;
		clearInterval(MyMar1);
	}
	
	

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId+"#gmxx").empty();
		clearHIscroll();
		cleartimer();
	};

	var main = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports = main;
});