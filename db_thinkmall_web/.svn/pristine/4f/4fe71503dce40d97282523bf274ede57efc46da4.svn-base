 /**
  * 答题活动
  * @author wanliang
  */
define(function(require, exports, module){ 
	var _pageId = "#active_answerActive "; // 当前页面ID
	var appUtils = require("appUtils"); // 核心工具类
	var service = require("mobileService"); // 服务类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var common = require("common"); // 公共类
	var global = require("gconfig").global; // 全局配置对象
	var constants = require("constants");// 常量类
	var validatorUtil = require("validatorUtil"); // 校验工具类
	var putils = require("putils");
	
	// 页面全局变量，当前js的所有全局变量 定义在该对象中
	var pageGlobal = {
		"score" : 0 // 答题分数
	};

	/*
	 * 初始化
	 */
	function init(){
		var OpenID = $.trim(appUtils.getPageParam("OpenID"));
		if(OpenID == ""){
			location.href = "http://mp.weixin.qq.com/s?__biz=MzI5MDAwNTY0Mg==&mid=401837648&idx=1&sn=d02eec29a79a9fff082368d396e88271&from=singlemessage&isappinstalled=0#wechat_redirect";
		}
	}
	
	function initView(){
		$(_pageId + "#overlay").hide();
		pageGlobal.score = 0; // 清空分数
		$(_pageId + "#resultRight").hide();
		$(_pageId + "#resultWrong").hide();
		$(_pageId + "#question1").show();
	}
	
	
	
	/*
	 * 切换下一题方法
	 */
	function isNext(element){
		var questionNo = element.attr("id"); // 题目编号
		questionNo = parseInt(questionNo.substring(8,10)); // 获取题号
		if(questionNo && questionNo < 10 ){
			questionNo += 1;
			$(_pageId + "#question" + questionNo).show();
		}else{
			// 显示结果页,判断是否大于80
			$(_pageId + "#score").html(pageGlobal.score);
			if(pageGlobal.score && pageGlobal.score >= 80){
				$(_pageId + "#resultRight").show();
			}else{
				$(_pageId + "#resultWrong").show();
			}
		}
		element.hide(); // 隐藏本题
		hiddenResult(); // 隐藏结果页
	}
	
	// 隐藏结果
	function hiddenResult(){
		$(_pageId + "#overlay").hide();
		$(_pageId + "#answerRight").hide();
		$(_pageId + "#answerWrong").hide();
	} 
	
	/*
	 * 绑定事件
	 */
	function bindPageEvent(){
		
		// 答题
		appUtils.bindEvent(_pageId + ".answer_list ul li", function(){
			var cur = $(this);
			var curPage = cur.attr("value");
			var parents = cur.parents().parent(".problem_box");
			$(_pageId + "#overlay").show();
			if(curPage && curPage == "1"){
				$(_pageId + "#answerRight").show();
				// 答对后分数加10
				pageGlobal.score = parseInt(pageGlobal.score) + 10;
			}else{
				$(_pageId + "#answerWrong").show();
			}
			/*1秒后下一题*/ 
			  setTimeout(function(){
				  isNext(parents);
			   },1000);
			
		});
		
		// 参与抽奖
		appUtils.bindEvent(_pageId + "#luckDraw", function(){
//			var cur = $(_pageId + "#mobile").val(); // 手机号
			var OpenID = appUtils.getPageParam("OpenID"); // 可以参加活动的用户OpenID
			var param = {
				"OpenID" : OpenID	
			};
			service.getUrl(param, function(data){
				var retUrl = data.data.retUrl; // 抽奖地址
				location.href = retUrl; // 跳转到抽奖页面
			});
		});
		
		// 重新挑战
		appUtils.bindEvent(_pageId + "#again", function(){
			$(_pageId + "#overlay").hide();
			pageGlobal.score = 0; // 清空分数
			$(_pageId + "#resultRight").hide();
			$(_pageId + "#resultWrong").hide();
			$(_pageId + "#question1").show();
			
		});
	}
	
	/*
	 * 页面销毁
	 */
	function destroy(){
		
	}
	
	var answerActive = {
		"init": init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};
	// 暴露对外的接口
	module.exports = answerActive;
});