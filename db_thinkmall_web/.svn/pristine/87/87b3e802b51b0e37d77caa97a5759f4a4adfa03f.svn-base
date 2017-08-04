/**
 * 模块名：流量充值
 * 作者： 黄惠娟
 * 时间：2016年04月11日09:32:01
 * 简述：
 */
define(function(require,exports,module){
	/*引用模块*/
	var appUtils = require("appUtils"),
		validatorUtil = require("validatorUtil"), // 校验工具类
		layerUtils = require("layerUtils"),
		service = require("mobileService"),  //业务层接口，请求数据
		common = require("common");//公共类
	
	/*常量*/
	var pageCode = "activity/recharge",
	 	_pageId = "#activity_recharge ";
	
	/*变量*/
	 //var weixinpk = "",openid = "";
	 var user_id = "",win_id = "";
	 var addressCheck = "",addrList = new Array();
	 var isFirst = true;
	/**
	 * 初始化
	 * */
	function init(){
		
		win_id = appUtils.getPageParam("win_id");//获奖记录ID
		user_id = common.getUserId();
		
		$(_pageId + "#phone")[0].value="";
		$(_pageId + ".dialog-overlay").hide();
		$(_pageId + ".dialog_success_box").hide();
	}
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){	
		
		//马上领取
		appUtils.bindEvent($(_pageId+"#goRecharge"),function(){
			if(validatorUtil.isMobile($(_pageId + "#phone").val())){
				goRecharge();
			}else{
				layerUtils.iMsg(-1,"手机号格式错误,请核对后重新输入!");
			}
		});
		//控制文本长度
		appUtils.bindEvent($(_pageId + "#phone"),function(){
			if($(_pageId + "#phone").val().length>11){
				layerUtils.iMsg(-1,"您的手机号码过长，请注意核对!");
				$(_pageId + "#phone")[0].value=$(_pageId + "#phone").val().substring(0, 11);		
			}
		},"keyup");
		//返回
		appUtils.bindEvent($(_pageId+" .back_btn"),function(){
			appUtils.pageInit(pageCode, "activity/winList");
		});
		
		//继续领奖
		appUtils.bindEvent($(_pageId+"#continue"),function(){
			appUtils.pageInit(pageCode, "main");
		});
		
		//继续领奖
		appUtils.bindEvent($(_pageId+".close_btn"),function(){
			$(_pageId + ".dialog-overlay").hide();
			$(_pageId + ".dialog_success_box").hide();
		});
	}
	
	/**
	 * 流量充值
	 */
	function goRecharge(){
		var phone = $(_pageId + "#phone").val();
		var param = {
				"win_id":win_id,
				"phone":phone
			};
		var callBack = function(resultVo){	
			//resultVo.error_no = "0";
			if(resultVo.error_no == "0"){
				//保存成功
				$(_pageId + ".dialog-overlay").show();
				$(_pageId + ".dialog_success_box").show();
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
			}
	    };
		service.recharge(param,callBack);
	}
	
	/**
	 * 清理页面
	 */
	function cleanPage(){
		
	}
	
	/**
	 * 销毁
	 * */
	function destroy(){
		service.destroy();//销毁服务
		cleanPage();
	}

	var recharge = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy		
	};
	
	module.exports = recharge;
});