/**
 * 加密sso对应的商户ID和签名key
 */
define('mall/scripts/index/getSsokey_source', function(require, exports, module) {
	var appUtils = require("appUtils");
	var gconfig = require("gconfig");    
    var aes = require("aes");
    var _pageId = "#index_getSsokey ";
    var ssoUtils = require("ssoUtils");
    var doEncrypt = function(data){
		try
		{
			var keyHex = aes.enc.Utf8.parse(ssoUtils.test+ssoUtils.func);
			var valueHex = aes.enc.Utf8.parse(data); 
			var iv = aes.enc.Utf8.parse(ssoUtils.test+ssoUtils.func);
			var encrypted = aes.AES.encrypt(valueHex, keyHex, {
				iv: iv,
				mode : aes.mode.CBC
			});
			data = encrypted.toString();
		}
		catch(e)
		{
		}
		return data;
	};
	

	
	function init()
	{ 	

	}
	
	function bindPageEvent()
	{
		
		//'4db7b064f5455b890e1deadc5ef90e6d' 00000001
	   appUtils.bindEvent($(_pageId + " #submit"), function(e){		
              //merchant_id为商户ID，signKey为签名key，找管理员分配
		      var obj = {merchant_id:$(_pageId+"#merchant_id").val(),signKey:$(_pageId+"#signKey").val()};
		      var key = doEncrypt(JSON.stringify(obj));
		      $(_pageId+"#signKeyEncrpt").val(key);	   	
	   	
			
			e.stopPropagation();
		});

	
		
	}
	
	function destroy()
	{
		
	}
	

	var menu = {
		init: init,
		bindPageEvent: bindPageEvent,
		destroy: destroy
	};
	
	module.exports = menu;
});