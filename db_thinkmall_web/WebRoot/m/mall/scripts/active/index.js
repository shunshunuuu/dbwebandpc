 /**
  * 米仓首页
  * @author weirm
  */
define(function(require, exports, module){ 
	var _pageId = "#active_index "; // 当前页面ID
	var pageCode = "active/index";
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
	var phonenumber = "";//手机号码
	
	// 页面全局变量
	var pageGlobal = {
		"isFileState" : "0" // 广告是否有效
	};
	
	var MyMar1s=null;
	/*		
	 * 初始化
	 */
	function init(){
		//查询用户积分流水
		getUserPoint();
		// 处理ios滚动问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".points_mall"));
		common.footerTab(_pageId);
	
		getLoginClientInfo(false);
	}
	
	function yemianff(){
		user_id = common.getUserId();

		loadAdv(); // 广告加载
		//热门广告推广图
		hotActive();
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
		if(servticket_id && !errorcode){
			var param = {
				"servticket_id" : servticket_id
			};
			var callBack=function(data){
				layerUtils.iLoading(true); 
				var error_no = data.error_no;
				var error_info = data.error_info;
				if (error_no == "0"){
					var results = data.results[0];
					common.saveSessionUserInfo(results);
					var user_id = results.user_id;
//					alert("走回调："+user_id);
					appUtils.setSStorageInfo("user_id",user_id);
					yemianff();
				} else {
					layerUtils.iMsg(-1,error_info);
					return false;
				}
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
									   yemianff();
								   }else{
								       layerUtils.iMsg(-1,data.error_info);
								       yemianff();
								   }
								}
								service.getSessionInfo({},userInfoCallback);
							} else {
								layerUtils.iMsg(-1,error_info);
								yemianff();
							} 
					   }
					   
					   service.userInfo(loginParam,userinfo);
					}else{
						layerUtils.iMsg(-1,data.error_info);
						yemianff();
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
	    	   yemianff();
		}
	}
	
	function hotActive(){
		var hotActiveFun = function(result){
			
			// 产品广告区域元素，初始化清空
			var adAreaEle = $(_pageId + ".jp_banner").empty();
			var itemHtml = "";
			if (result.length > 0) {
			  for (var i = 0; i < result.length; i++) {
				    var item = result[i];
					var imgPath = item.picture ? item.picture : item.small_picture; // 图片地址
					var file_state = item.file_state; // 文件状态是否有效
					if (file_state == "1") {
						imgPath = global.url + '/mall' + imgPath;
						var linkUrl = ""; // 链接地址
						var state = item.state; // 链接是否有效
						if (state == "1") {
							linkUrl = item.url;
						} else {
							linkUrl = "javascript:void(0)";
						}
						
						itemHtml += 	'<a href="' + linkUrl + '">' +
										'	<img src="' + imgPath + '"  width="100%"/>' + 
										'</a>';
					}
			  }	
				
				
				adAreaEle.append(itemHtml);
			}
		};
		
		// 获取常量类中广告组ID值
		var groupId = constants.advertGroupId.ADVERT_GROUP_ID_RICE_RMHD;
		queryAdvert(groupId, hotActiveFun);
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
	
	
	

	//查询用户积分流水
	function getUserPoint(){
		var param = {
				"page" : 1, 
				"numPerPage" : 8
			};
		var callBack=function(resultVo){
			if(0==resultVo.error_no){
				var results = resultVo.results[0].data;
				fillyhjf(results);
			}else{
				layerUtils.iAlert("查询用户积分流水失败:"+resultVo.error_info,-1);
			}
		};
		
		
		service.getUserPoint(param,callBack);
	}
	
	function gdxg(){
		 var speeds=50;
		 var ZJDemo=document.getElementById('indexdemo');
		 var ZJDemo1=document.getElementById('indexdemo1');
		 var ZJDemo2=document.getElementById('indexdemo2');
		 ZJDemo2.innerHTML=ZJDemo1.innerHTML;
		 function Marquee1s(){
			 if(ZJDemo2.offsetHeight-ZJDemo.scrollTop<=0)
			     ZJDemo.scrollTop-=ZJDemo1.offsetHeight
			 else{
			     ZJDemo.scrollTop++;
			 }
		 }
		 MyMar1s=setInterval(Marquee1s,speeds);
		 ZJDemo.onmouseover=function() {clearInterval(MyMar1s)};
		 ZJDemo.onmouseout=function() {MyMar1s=setInterval(Marquee1s,speeds)};
	}
	
	function fillyhjf(results){
		var html = "";
		if(results.length>8){
			for(var i = 0; i < 8; i++){
			  var item = results[i];
			  var fund_account = item.external_account; //用户资金账号
		      var qid = fund_account.substr(0,3);
		      var id=fund_account.substr(3,3);
		      var sid=fund_account.substr(6,2);
		      var external_account = qid+id.replace(id,"***")+sid;
		      phonenumber = item.mobile_phone; //用户手机号
		      var sjid = phonenumber.substr(0,3);
		      var sid = phonenumber.substr(3,5);
		      var mobile_phone = sjid+sid.replace(sid,"*****")+phonenumber.substr(8,3);
		      var act_remark =item.act_remark;//奖励类型
		      var points = item.integral_num; //积分
		      var zhnumber = "";
		      if(phonenumber){
		    	  zhnumber = mobile_phone;
		      }else if(fund_account){
		    	  zhnumber = external_account;
		      }
			  html+='<li><a href="javascript:;"><p>客户<span>'+zhnumber+'</span>'+act_remark+'<span>'+points+'</span>积分！</p></a></li>';
			}
			$(_pageId+"#qdxx").html(html);
		}else{
			if(results.length > 0){
		      for(var i = 0; i < results.length; i++){
				  var item = results[i];
				  var fund_account = item.external_account; //用户资金账号
			      var qid = fund_account.substr(0,3);
			      var id=fund_account.substr(3,3);
			      var sid=fund_account.substr(6,2);
			      var external_account = qid+id.replace(id,"***")+sid;
			      phonenumber = item.mobile_phone; //用户手机号
			      var sjid = phonenumber.substr(0,3);
			      var sid = phonenumber.substr(3,5);
			      var mobile_phone = sjid+sid.replace(sid,"*****")+phonenumber.substr(8,3);
			      var act_remark =item.act_remark;//奖励类型
			      var points = item.integral_num; //积分
			      var zhnumber = "";
			      if(phonenumber){
			    	  zhnumber = mobile_phone;
			      }else if(fund_account){
			    	  zhnumber = external_account;
			      }
				  html+='<li><a href="javascript:;"><p>客户<span>'+zhnumber+'</span>'+act_remark+'<span>'+points+'</span>积分！</p></a></li>';
			   }
			}
		  }
		   $(_pageId+"#qdxx").html(html);
		   gdxg();
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
//						if (j++ > 1) {
//							break;
//						};
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
//					$(_pageId + " #dots_box").html(sadItems); //
					HIscroll_init();
				}
				
				appUtils.bindEvent(_pageId+" #banner_ul li", function(e){
					e.stopPropagation();
					var Url=$(this).attr("url");
						appUtils.sendDirect(Url);					
						countEventsj("积分首页点击banner");
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
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		// 签到按钮
		appUtils.bindEvent(_pageId + ".qiand", function(){
			countEventsj("进入签到页面");
			appUtils.pageInit(pageCode, "active/signIn", {});
		});
		
		//东北米
		appUtils.bindEvent(_pageId + "#dbm", function(){
			var pageParam = {
					"active_type" : "3"		
			};
			countEventsj("进入超值换购页面");
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
		});
	    
		//一米疯抢
	    appUtils.bindEvent(_pageId + "#ymfq", function(){
//	    	layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			var pageParam = {
					"active_type" : "1"	
			};
			countEventsj("进入一米疯抢页面");
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
	    	
	    });
	    
		//限时兑换
	    appUtils.bindEvent(_pageId + "#xsdh", function(){
//	    	layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
	    	var pageParam = {
					"active_type" : "2"	
			};
	    	countEventsj("进入限时兑换页面");
			appUtils.pageInit(pageCode, "active/valueList", pageParam);
	    });
	    
	  //大转盘
	    appUtils.bindEvent(_pageId + "#bigWheel",function(){
    		// 校验用户是否登录
    		if (!common.checkUserIsLogin(false, false,pageCode)) {
    			return false;
    		}else{
    			countEventsj("进入大赚盘页面");
    			enterBigWheel();//进入大转盘页面
    		}
    	
       });
		appUtils.bindEvent(_pageId + ".pricebox ul li", function(){
			var index = $(_pageId + ".pricebox ul li").index(this);
			//资讯
			if(index == 0){
				countEventsj("进入资讯产品列表");
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
				appUtils.pageInit(pageCode, "infoproduct/productInfo");
			}else if(index == 1){//猜股指涨跌
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 2){//软件
//				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
				appUtils.pageInit(pageCode, "software/productSoftware");
			}
		});
		
		appUtils.bindEvent(_pageId + ".paice ul li", function(){
			var index = $(_pageId + ".paice ul li").index(this);
			if(index == 0){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 1){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 2){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 3){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 4){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 5){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}else if(index == 6){
				layerUtils.iAlert("攻城狮正在努力建设中，敬请期待!","确定");
			}
		});
		
		
		
		// 禁止头部和底部滑动
		common.stopHeadAndFooterEvent(_pageId); 
	}
	
	//获取应用授权凭证
	function enterBigWheel(){
		var param ={
				"app_id" : "jcm_f7bafa11513",
				"app_secr" : "3e04dc996ee645ceeefa5a28b3973b",
				'bizcode' : 'thk_get_accesstoken'//业务编码
		};
		service.get_accesstoken(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				 var json = data.error_info;
				 var jsonObj = eval('(' + json + ')');//转成json格式
				 var access_token = jsonObj.results[0].access_token;
				 if(access_token){
					 userInsert(access_token);//用户接入接口
				 }
			} else {
				layerUtils.iMsg(-1, data.error_info);
				return false;
			}
		});
		
    }
	
	//用户接入接口
	function userInsert(access_token){
		var param ={
				"uid" : user_id,//用户id
				"access_token" : access_token,
				"st" : "all_account",//手机用户:phone_number 资金账户:zj_account 微信用户:wechat_account 平台用户:all_account
				'bizcode' : 'thk_user_get_access'//业务编码
		};

		service.getAccess(param,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if (error_no == "0"){
				 var json = data.error_info;
				 var jsonObj = eval('(' + json + ')');//转成json格式
				 var amp_uid = jsonObj.results[0].amp_uid;
				 var amp_token = jsonObj.results[0].amp_token;
				 var mallurl = global.url_loginIn_zzapp;
				 if(amp_uid && amp_token){
					 var UrL = "http://jcmi.ren/activity/DBbigwheel/index.html#!/act/draw.html?source_type=all_account&act_no=ACT_2017032200000001&app_id=jcm_f7bafa11513&uid="+user_id+"&mobile_phone="+phonenumber+"&amp_token="+amp_token+"&amp_uid="+amp_uid+"&mallurl="+mallurl;
					 appUtils.sendDirect(UrL);
				 }
			} else {
				layerUtils.iMsg(-1, data.error_info);
				return false;
			}
		});


	}
	
	function cleartimer(){
		var speed = null;
		clearInterval(MyMar1s);
	}
	
	//统计
	function countEvent(id,name){
		TDAPP.onEvent(id,name);
	}
	
	function countEventsj(id){
		TDAPP.onEvent(id);
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId+"#qdxx").empty();
		initView();
		cleartimer();
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
	
	var activeIndex = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = activeIndex;
});