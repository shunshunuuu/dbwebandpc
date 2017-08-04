define(function(require, exports, module) {
	var _pageId = "#tucao_goTc "; // 页面id
	var pageCode = "tucao/goTc";
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
    var visitIp = null;
    var webuploaderutil = require("mall/scripts/common/businessComm/webuploaderutil.js");
	var pageGlobal = {
						
	};
    

    
    
	
	/*
	 * 初始化
	 */
	
	function init() {
		
		// 处理ios滚动的问题
		common.dealIOSScrollBug($(_pageId + "article"), $(_pageId + ".index_page"));
		
		// 初始化页面
		var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
    	
		$.getJSON(url, function (data) {
            visitIp = data.Ip;//弹出本地ip
    	});
		
		  //初始化图片上传
        webuploaderutil.uploadPicByResp('img', 'personPic', function(data) {
            if (data[0] && data[0].result == 'true') {
              img = data[0].picurl;
              var strs= new Array(); //定义一数组 
              strs=img.split("/"); //字符分割 
              $(_pageId + ".my_page_con").attr("imgsrc",img);
              $(_pageId + "#path").text(strs[4]);
              $(_pageId + ".my_page_con").attr("status","0");
              layerUtils.iLoading(false);
            }
          }, function() {
            $.toast('图片上传失败！');
       });
		
		
	};
	
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent() {
		
		//返回上一页
		appUtils.bindEvent(_pageId + " a.back_btn",  function() {
			appUtils.pageInit(pageCode, "tucao/myTc");
		});
		//提交

		appUtils.bindEvent(_pageId + " .sendmas a",  function() {	
			  
			 addTucaoContent();
		});
		
		
	};
	
	 
function addTucaoContent(){
	var querySyComplate = function(resultVo){
			var error_no = resultVo.error_no;
			var error_info = resultVo.error_info;
			if (error_no == "0"){
				layerUtils.iAlert("陛下 , 您的批示 臣已收到!",-1,function(){
					appUtils.pageInit(pageCode, "tucao/myTc");
				},"确定");

				
			} else {
				layerUtils.iMsg(-1,error_info);
				
				return false;
			}
		
	}
	var paraMap = {};
	//吐槽内容
	//手机号码
	var mobile= $(_pageId + "#phoneNo").val();
	appUtils.setSStorageInfo("mobile",mobile);
	var tucao_content=$(_pageId + "#rrrrr").val();
	if (validatorUtil.isEmpty(tucao_content)){
		layerUtils.iMsg(-1,"吐槽内容不能为空");
		return;			
	}
	
	//手机系统
	var phone_system=mobileSystem();
	
	//ip地址
	var ip = visitIp
	//图片名称
	var picture = $(_pageId + "#path").text();
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
	var date = date.getDate();
	var str=year+""+month+""+date;
	picture = "http://222.168.95.182:8089/mall/tucaoImage/"+str+"/"+picture;
		
	var status = $(" .my_page_con").attr("status");
	if(status == 0){
		paraMap["picture"] =picture;
		paraMap["mobile"] =mobile;
		paraMap["tucao_content"] =tucao_content;
		paraMap["ip"] = ip;
		paraMap["phone_system"] =phone_system;
		service.addTucaoContent(paraMap,querySyComplate,{});
	}else if(status == 2){
		paraMap["mobile"] =mobile;
		paraMap["tucao_content"] =tucao_content;
		paraMap["ip"] = ip;
		paraMap["phone_system"] =phone_system;
		service.addTucaoContent(paraMap,querySyComplate,{});
		
	}else {
		if (validatorUtil.isEmpty(picture)){
			layerUtils.iMsg(-1,"图片上传中");
			return;	
		}
		
	}
}

		
		//判断手机系统
	 function mobileSystem() {
		
		 var u = navigator.userAgent;
		 if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
		 return 1;
		 // window.location.href = "mobile/index.html";
		 } else if (u.indexOf('iPhone') > -1) {//苹果手机
		
		 return 0;
		 } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
		  return -1;
		 
		 }
	}

		
		

		
	/*
	 * 页面销毁
	 */
	function destroy() {
		$(_pageId + "#rrrrr").val("");
		$(_pageId + "#path").text("请选择小于20m文件进行上传");
		$(_pageId + "#phoneNo").val("");
		$(_pageId + ".my_page_con").attr("status","2");
	};

	var tucaoGoTc = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
	};
	
	// 暴露对外的接口
	module.exports =  tucaoGoTc;
});