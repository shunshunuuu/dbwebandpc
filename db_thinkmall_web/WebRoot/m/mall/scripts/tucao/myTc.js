define(function(require, exports, module) {
	var _pageId = "#tucao_myTc "; // 页面id
	var pageCode = "tucao/myTc";
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 业务层接口，请求数据
	var tool = require("tool");
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var common = require("common"); // 公共类
	var putils = require("putils"); //
	var validatorUtil = require("validatorUtil"); //校验工具类
    var HIscroll = require("hIscroll"); //hIscroll别名已经配置到hSea中
    var myHIscroll = null;
    
    
	var pageGlobal = {
						
	};
    

    
	
	/*
	 * 初始化
	 */
	
	function init() {
		// 初始化页面
		var mobile = appUtils.getSStorageInfo("mobile");
		$(_pageId + " .yournb input").val(mobile);
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
	
	}


	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		//点击左边按钮，进入我要吐槽界面
		appUtils.bindEvent(_pageId + " .btnleft",  function() {
			appUtils.pageInit(pageCode, "tucao/goTc");
		});
			//点击右边按钮，弹出输入手机号的弹出层
		appUtils.bindEvent(_pageId + " .btnright",  function() {
			$(_pageId+" .tcfox").css("display","block");
			
		
	});
		//点击关闭按钮弹出层消失
		
		appUtils.bindEvent(_pageId + " .closebtm",  function() {
			$(_pageId+" .tcfox").css("display","none");
			
		
	});
		
		//点击右边按钮，进入我的吐槽界面
		appUtils.bindEvent($(_pageId + " .thisbtn a"), function(e) {
			var mobile=$(_pageId + " .yournb input").val();
			if (validatorUtil.isMobile(mobile)){
				queryTocaoContent();
			}
			else {
				layerUtils.iMsg(-1,"请输入正确的电话号码！！！");
				
			}
		    
			
			
		});

	};
	
	
function queryTocaoContent()
	
	{
	

		/***解析数据根据，根据公司框架进行接口调用，然后解析数据**/
		var querySyComplate = function(resultVo){
			var result = resultVo.results
			var error_no =  resultVo.error_no
			if(error_no== 0){
				
				if(result.length == 0){
					layerUtils.iConfirm("您还没有吐槽，是否进入吐槽页面",function(){
						appUtils.pageInit(pageCode, "tucao/goTc");
					},null,"是","否");

				}else{
					appUtils.pageInit(pageCode, "tucao/queryTc", {"mobile":mobile});
				}
			}	
			else{
				layerUtils.iAlert(resultVo.error_info,-1);
			}
			
			
			}
			
		
			//获取
			
			
			
			
			
	
		var paraMap = {};
		var mobile=$(_pageId + " .yournb input").val();
		paraMap["mobile"] =mobile;
		service.queryTocaoContent(paraMap,querySyComplate,{});
	
	
	}

	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId + " .yournb input").val("");
		$(_pageId+" .tcfox").css("display","none");
		
	};

	var tucaoMyTc = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports =  tucaoMyTc;
});