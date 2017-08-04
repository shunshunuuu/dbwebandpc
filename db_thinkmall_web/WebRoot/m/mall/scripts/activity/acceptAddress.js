/**
 * 模块名：收货地址
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
	var pageCode = "activity/acceptAddress",
	 	_pageId = "#activity_acceptAddress ";
	
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
		queryAddressList();//获取地址列表
	}
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){	
		
		//确定
		appUtils.bindEvent($(_pageId+" .rules_btn"),function(){
			if(addressCheck===""){
				layerUtils.iMsg(0,"请选择一个地址！");
		    }else{
		    	addr = addrList[addressCheck].exprs_address;
				phone = addrList[addressCheck].mobile_phone;
				name = addrList[addressCheck].user_name;
				setWinAddr(addr,name,phone);
		    }			
			//alert("姓名："+name+"    电话："+phone+"    地址："+addr);		
		});
		
		//返回
		appUtils.bindEvent($(_pageId+" .back_btn"),function(){
			appUtils.pageBack();
		});
	
		//选择地址
		appUtils.preBindEvent($(_pageId+"#noDefault"),".item_list",function(){
			$(_pageId+" .item_list").removeClass("checked");
		    $(this).addClass("checked");
		    addressCheck = $(this).attr("id");
		},"click");		
		appUtils.preBindEvent($(_pageId+"#default"),".item_list",function(){
			$(_pageId+" .item_list").removeClass("checked");
		    $(this).addClass("checked");
		    addressCheck = $(this).attr("id");
		},"click");
		
		//保存
		appUtils.bindEvent($(_pageId + "#save"),function(){	
			//获取填写信息
			var name = $(_pageId + "#name").val();
			var phone = $(_pageId + "#phone").val();
			var address = $(_pageId + "#address").val();
			//判断字符串是否为空
			if(name==null||name==""){
				layerUtils.iAlert("姓名不能为空!",-1);
				return;
			}else if(phone==null||phone==""){
				layerUtils.iAlert("电话不能为空!",-1);
				return;
			}else if(address==null||address==""){
				layerUtils.iAlert("地址不能为空!",-1);
				return;
			}else{
				//设定为默认
				var isDefault = $(_pageId + " .switch").children("input").attr("checked") == "checked" ? "1":"0";
				//保存地址
				saveAddress(name,phone,address,isDefault);				
			}					
		});
		
		//关闭
		appUtils.bindEvent($(_pageId + "#close"),function(){
			hideDialog();
		});
		
		//添加地址
		appUtils.bindEvent($(_pageId + ".add_address_btn"),function(){
			$(_pageId + ".dialog-overlay").show();
			$(_pageId + ".dialog_address_box").show();
		});
		
		//查看订单
		appUtils.bindEvent($(_pageId+"#checkOrder"),function(){
			hideDialog();
			appUtils.pageInit(pageCode, "main");
		});
		
		//继续逛逛
		appUtils.bindEvent($(_pageId+"#goSee"),function(){
			hideDialog();
			//appUtils.pageInit(pageCode, "activity/winList");
		});
	}
	
	/**
	 * 设置为奖品收货地址
	 */
	function setWinAddr(addr,name,phone){
		var param = {
				"win_id":win_id,
				"addr":addr,
				"name":name,
				"phone":phone
			};
		var callBack = function(resultVo){			
			if(resultVo.error_no == "0"){
				//保存成功
				$(_pageId+".dialog_award_txt .ared").html(win_id);
				$(_pageId + ".dialog-overlay").show();
				$(_pageId + ".dialog_lottery_box").show();
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
			}
	    };
		service.setWinAddr(param,callBack);
	}
	
	/**
	 * 保存收货地址
	 */
	function saveAddress(name,phone,address,isDefault){		
		var param = {
				//"weixinpk":weixinpk,
				//"openid":openid,
				"type":"3",
				"user_id":user_id,
				"user_name":name,
				"mobile_phone":phone,
				"address":address,
				"is_default":isDefault
			};
		var callBack = function(resultVo){			
			if(resultVo.error_no == "0"){
				layerUtils.iMsg(0,"保存成功");
				
				//清空并隐藏弹出层
				$(_pageId + "#name")[0].value="";
				$(_pageId + "#phone")[0].value="";
				$(_pageId + "#address")[0].value="";
				hideDialog();
				//重新获取列表
				queryAddressList();
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
				queryAddressList();
			}
	    };
		service.AddressService(param,callBack);
	}
	
	//获取地址列表
	function queryAddressList(){
		isFirst = true;
		var param = {
				  //"weixinpk": weixinpk,
				  //"openid":openid
				"user_id":user_id,
				"type":"1"
			};
		var callBack = function(resultVo){
			if(resultVo.error_no == "0"){
    			addrList = resultVo.results;
    			fillAddress(resultVo.results);//填充地址信息
    			//没有保存的地址，默认显示弹出层
    			if(resultVo.results.length==0)
    			{
    				$(_pageId + ".dialog-overlay").show();
    				$(_pageId + ".dialog_address_box").show();
    			}
    		}
    		else{
				layerUtils.iMsg(-1,resultVo.error_info);
				return false;
			}
	    };
		service.AddressService(param,callBack);
	}
	
	//地址数据填充（非默认）
	function fillAddress(result){
		$(_pageId + "#noDefault").empty();
		var html = "";
		for(var i=0;i<result.length;i++){
			if(result[i].is_default === '1'){//判断是否默认
				fillAddressDef(i,result[i].user_name,result[i].mobile_phone,result[i].exprs_address);
				//默认选项勾选
			    $(_pageId + "#"+i).addClass("checked");
			    addressCheck = i;
			}else{
				html += '<div class="item_list" id="'+i+'"><h3>'+result[i].user_name;
				html += '<span class="number">'+result[i].mobile_phone;
				html += '</span></h3><p class="address">' + result[i].exprs_address + '</p></div>';
			}	
		}
		if(result.length===0){
			var nohtml = '<div id="noAddr" style="text-align:center;padding-bottom:20px;font-size:15px;">暂无收货地址</div>';
			$(_pageId + ".add_address_list").prepend(nohtml);
		}
		$(_pageId + "#noDefault").html(html);
	}
	
	//地址数据填充（默认）
	function fillAddressDef(id,name,phone,address){
		if(isFirst){
			$(_pageId + "#default").empty();
			isFirst = false;
		}		
		var htmlD = "";
		htmlD += '<div class="item_list" id="'+id+'"><h3>'+name;
		htmlD += '<span class="number">'+phone;
		htmlD += '</span></h3><p class="address"><em>[默认]</em>' + address + '</p></div>';
		$(_pageId + "#default").html(htmlD);
	}
	
	//隐藏弹出层
	function hideDialog(){
		$(_pageId + ".dialog-overlay").hide();
		$(_pageId + ".dialog_address_box").hide();
		$(_pageId + ".dialog_lottery_box").hide();
	}
	
	/**
	 * 清理页面
	 */
	function cleanPage(){
		addressCheck = "";
		$(_pageId+"#noAddr").detach();
	}
	
	/**
	 * 销毁
	 * */
	function destroy(){
		service.destroy();//销毁服务
		cleanPage();
	}

	var address = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy		
	};
	
	module.exports = address;
});