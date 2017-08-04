/**
 * 模块名：兑奖成功
 * 作者： 黄惠娟
 * 时间：2016年04月05日15:59:01
 * 简述：
 */
define(function(require,exports,module){
	/*引用模块*/
	var appUtils = require("appUtils"),
		layerUtils = require("layerUtils"),
		service = require("mobileService"), //业务层接口，请求数据
		common = require("common"); //公共类
	/*常量*/
	var pageCode = "activity/winList",
	 	_pageId = "#activity_winList ";
	
	/*变量*/
	 var weixinpk = "",openid = "";
	 var winList = new Array();
	/**
	 * 初始化
	 * */
	function init(){
		
		user_id = common.getUserId();
		
		queryAddressList();
	}
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){					
		//立即领取
		appUtils.preBindEvent($(_pageId+"#winList"),".receive_btn",function(){			
			var win_id = winList[$(this).parent().parent().attr("id")].id;
			var type = winList[$(this).parent().parent().attr("id")].award_type;
			//type = "2";
			if(type=="1"){
				appUtils.pageInit(pageCode, "activity/acceptAddress",{'win_id':win_id});
			}
			if(type=="2"){
				appUtils.pageInit(pageCode, "activity/recharge",{'win_id':win_id});
			}
		},"click");
		
		//返回
		appUtils.bindEvent($(_pageId+" .back_btn"),function(){
			appUtils.pageBack();
		});
		
	}
	
	//获取地址列表
	function queryAddressList(){
		isFirst = true;
		var param = {
				  //"weixinpk": weixinpk,
				  //"openid":openid
				"user_id":user_id
			};
		var callBack = function(resultVo){
	    	if(resultVo.error_no == "0"){
	    		winList = resultVo.results;
	    		fillWinList(resultVo.results);//填充地址信息
	    	}
	    	else{
				layerUtils.iMsg(-1,resultVo.error_info);
				return false;
			}
	    };
		service.queryWinList(param,callBack);
	}
				
	//中奖纪录填充
	function fillWinList(result){
		$(_pageId + "#winList").empty();
		var html = "";
		for(var i=0;i<result.length;i++){
			html += '<li id="'+i+'">';
			html += '<div class="ui layout record_tit"><p class="row-1">中奖编号：<span>'+result[i].id;
			if(result[i].process_status=="0"){
				html += '</span></p><a href="javascript:void(0);" class="receive_btn">立即领取</a></div>';
			}else if(result[i].process_status=="1"){
				html += '</span></p><a href="javascript:void(0);" class="receive_no_btn">已领取</a></div>';
			}else if(result[i].process_status=="2"){
				html += '</span></p><a href="javascript:void(0);" class="receive_no_btn">处理中</a></div>';
			}		
			html += '<div class="record_txt">';
			if(result[i].pic_url != null&&result[i].pic_url !="" ) 
			{
				html += '<div class="prize_pic"><em><img src="/mall/'+result[i].pic_url+'" /></em></div>';
			}
			html += '<div class="prize_det"><h3>'+result[i].name+'</h3>';
			html += '<p>中奖时间：' + result[i].create_time + '</p>';
			html += '<p>活动名称：' + result[i].activity_name + '</p>';
			html += '<p>截止时间：' + result[i].end_time +'</p>';
			html += '<p class="tips">(请在活动截止前领取奖品)</p></div></div></li>';
		}
		if(result.length===0){
			html += '<li style="margin-bottom:0rem;text-align:center;padding-top:20px;">暂无中奖记录</li>'; 
		}
		$(_pageId + "#winList").html(html);
	}
	
	/**
	 * 隐藏弹出层
	 */
	function hideDialog(){
		$(_pageId + ".dialog-overlay").hide();
		$(_pageId + ".dialog_lottery_box").hide();
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

	var winList = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy		
	};
	
	module.exports = winList;
});