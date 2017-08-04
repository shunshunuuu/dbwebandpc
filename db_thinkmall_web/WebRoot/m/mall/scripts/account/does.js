define(function(require, exports, module){ 
	var _pageId = "#account_does "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var service = require("mobileService"); // 业务层接口，请求数据
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");
	
	var replyType = 0;

	/*
	 * 初始化
	 */
	function init(){
		// 校验用户是否登录
		if (!common.checkUserIsLogin(false, false)) {
			return false;
		}
		
		initView(); // 初始化页面
		contentControl();
	}

	function initView(){
		$(_pageId + "#mobile_phone").val("");
		$(_pageId + "#doestext").html("");
		$(_pageId + "#zzcone").hide();
		$(_pageId + "#zzctwo").hide();
	}
	
	function insertTcInfo(mobile_phone,doestext){	
		var param ={
			"estimate_type" : "1",
			"content" : doestext,
			"replyType" : replyType,
			"phone" : mobile_phone
		};
		
		service.myDoes(param,function(resultVo){
			if(resultVo.error_no == 0){
				$(_pageId + "#zzcone").show();
				$(_pageId + "#zzctwo").show();
				//确定
				appUtils.bindEvent(_pageId + "#assign", function(){
					appUtils.pageInit("account/does","account/userCenter");
				});
			}else{
				layerUtils.iAlert("吐槽失败:"+resultVo.error_info,-1);
			}
		});
	
	}
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		//返回
		appUtils.bindEvent(_pageId + ".back_btn", function(){
			appUtils.pageBack();
		});
		
		//发送
		appUtils.bindEvent(_pageId + "#sent", function(){
			var mobile_phone = $(_pageId + "#mobile_phone").val();
			var doestext = $(_pageId + "#doestext").val();
			if(mobile_phone){
				replyType = 1;
				if(validatorUtil.isMobile(mobile_phone)){
					if(doestext){
						insertTcInfo(mobile_phone,doestext);
					}else{
						layerUtils.iMsg(-1,"内容不能为空！");
					}
				}else{
					layerUtils.iMsg(-1,"请输入正确的手机号码！！！");
					$(_pageId+" #mobile_phone").val("");
				}
			}else{
				replyType = 0;
				if(doestext){
					insertTcInfo(mobile_phone,doestext);
				}else{
					layerUtils.iAlert(-1,"内容不能为空！");
				}
			}
			
		});
		
		
		//清除
		appUtils.bindEvent(_pageId + "#clear", function(){
			$(_pageId + "#mobile_phone").val("");
		});
		
	
	}
	
	
	/*内容字数限制*/
	function contentControl(){
		 $(_pageId + "#doestext").keyup(function(){
			   var len = $(this).val().length;
			   if(len > 299){
			      $(this).val($(this).val().substring(0,300));
			      layerUtils.iAlert("字数不能超过300字哦!","确定");
			   }
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		$(_pageId + "#mobile_phone").val("");
		$(_pageId + "#doestext").html("");
		$(_pageId + "#zzcone").hide();
		$(_pageId + "#zzctwo").hide();
	}
	
	var myProfile = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = myProfile;
});