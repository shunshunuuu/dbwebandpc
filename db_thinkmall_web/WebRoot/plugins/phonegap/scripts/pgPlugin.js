define(function(require, exports, module) {
	
	var layerUtils = require("layerUtils");
	
	/**
	 * 发送短信,
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [phoneNo, content]
	 * 	phoneNo 短信号码 
	 * 	content 短信内容
	 * @returns
	 */
	function sendMessage(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "sendMessagePlugin", "sendMessagePlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}

	/**
	 * 拨打号码,
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [phoneNo, callType] 
	 * 	phoneNo 拨打号码
	 * 	callType 1拨打界面,2直接拨打
	 * @returns
	 */
	function callPhone(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "callPhonePlugin", "callPhonePlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 发送邮件,
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [mailUrl, title, content]
	 * 	mailUrl 邮件URL
	 * 	title 主题
	 * 	content 内容
	 * @returns
	 */
	function sendMail(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "sendMailPlugin", "sendMailPlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 分享,
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [title, content]
	 * 	title 分享主题
	 * 	content 分享内容
	 * @returns
	 */
	function share(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "sharePlugin", "sharePlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 文件上传,
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [uploadUrl, tokens]
	 * 	upload 上传URL
	 * 	tokens token值
	 * @returns
	 */
	function _uploadFile(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "uploadPlugin", "uploadPlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 获取文件上传状态,
	 * @param success
	 * @param fail
	 * @returns
	 */
	function _getUploadState(success, fail)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "getUploadStatePlugin", "getUploadStatePlugin", []);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 上传文件，并能获取上传图片信息
	 * @param pgUpLoadFile 复杂对象
	 	var pgUpLoadFile = {
			"serverUrl": uploadUrl, //phonegap提交文件到后台的地址
			"tokens": appUtils.getSStorageInfo("tokens"), //带的tokens地址，这地方考虑修改
			"interval": null,
			"flag": true,
			"destroy": null,
			"callback": function(data) {
				alert(data); //获取到参数后的自定义处理
			}
		};
		require("pgPlugin").uploadFile(pgUpLoadFile);
		pgUpLoadFile.destroy(); //切换页面时调用销毁
	 */
	function uploadFile(pgUpLoadFile) 
	{
		var serverUrl = pgUpLoadFile.serverUrl,
			tokens = pgUpLoadFile.tokens,
			callback = pgUpLoadFile.callback;
		pgUpLoadFile.destroy = function() {
			if(pgUpLoadFile.interval != null) {
				clearInterval(pgUpLoadFile.interval);
				pgUpLoadFile.interval = null;
				pgUpLoadFile.flag = true;
			}
		};
		
		_uploadFile(function(data) {
			if(data != "error") {
				pgUpLoadFile.interval = setInterval(function() {
					_getUploadState(function(data) {
						if(data && pgUpLoadFile.flag) {
							pgUpLoadFile.flag = false;
							if(data != "error") {
								callback(data); //处理数据
							}
							clearInterval(pgUpLoadFile.interval);
							pgUpLoadFile.interval = null;
						}
					});
				}, 200);
			}
		},null,[serverUrl,tokens]);
	}
	
	/**
	 * 调第三方应用市场
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [appMarketUrl] 
	 * 	appMarketUrl 应用市场地址
	 * @returns
	 */
	function openMarket(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "openMarketPlugin", "openMarketPlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 获取当前版本号
	 * @param success
	 * @param fail
	 * @returns
	 */
	function getVersion(success, fail)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "getVersionPlugin", "getVersionPlugin",[]);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 获取Mac和Ip
	 * @param success
	 * @param fail
	 * @returns
	 */
	function getIpMac(success, fail)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null) {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "getIpMacPlugin", "getIpMacPlugin",[]);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 弹出android系统Toast
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [msg]
	 * @returns
	 */
	function showToast(success, fail, paramArr)
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null)  {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "showToastPlugin", "showToastPlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
	
	/**
	 * 根据最新版本号，判断是否更新客户端
	 * @param success
	 * @param fail
	 * @param 参数数组 paramArr = [lastVersion, url]
	 * @returns
	 */
	function updateClient(success, fail, paramArr) 
	{
		try {
			cordova.exec(function(echoValue) {
				if(success != null)  {
					success(echoValue);
				}
			}, function(echoValue) {
				if(fail != null) {
					fail(echoValue);
				} else {
					layerUtils.iAlert("插件调用失败:" + echoValue);
				}
			}, "updateManagerPlugin", "updateManagerPlugin", paramArr);
		} catch (e) {
			layerUtils.iAlert("不支持phonegap！");
		}
	}
		
	/*****************************************监控的事件处理*************************************************/
	/**
	 * 控制手机键盘输入时，定位input域在手机键盘正上方
	 */
	function controlMobileInput()  
	{
	}

	/**
	 * 手机锁屏处理 
	 */
	function onLockScreen()
	{
	}
	
	/**
	 * 手机断网处理
	 */
	function onOffline()
	{
	}
	
	/**
	 * 手机联网处理
	 */
	function onOnline()
	{
	}
	
	function exitApp()
	{
		var _exitApp = function() { navigator.app.exitApp(); };
		showToast(null,function() {
			layerUtils.iConfirm("确认退出应用程序？",function(){
				navigator.app.exitApp();
			},function(){
				window.clearTimeout(intervalID);
		        document.removeEventListener("backbutton", _exitApp, false); // 注销返回键
		        document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
			}); },"再按一次退出应用程序");
		document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
		document.addEventListener("backbutton", _exitApp, false);// 绑定退出事件
		// 3秒后重新注册
		var intervalID = window.setTimeout(function() {
		        window.clearTimeout(intervalID);
		        document.removeEventListener("backbutton", _exitApp, false); // 注销返回键
		        document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
		}, 3000);
	}

	/**
	 * 手机键盘返回键
	 */
	function onBackKeyDown() 
	{
		//判断是否直接退出
		if(!require("gconfig").isDirectExit) {
			//弹出层消失，弹出层抽象利于处理，返回上一级页面，page增加上一级页面
			var pageLevel = $(".page[data-display=block]").attr("data-pageLevel");
			if(pageLevel == "1") {
				exitApp();
			} else {
				var curPageCode = require("appUtils").getSStorageInfo("_curPageCode");
				curPageCode = (!curPageCode || curPageCode=="null")?"":curPageCode;
				require.async(require("gconfig").scriptsPath+curPageCode, function(page) {
					require("appUtils").clearTempAsync("plugins/phonegap/scripts/pgPlugin");
					if(page.pageBack) {
						page.pageBack();
					} else {
						require("appUtils").pageBack();
					}
				});
			}
		} else {
			exitApp();
		}
	}
	
	/**
	 * deviceready触发事件处理函数
	 * 当PhoneGap加载完毕后会触发"deviceready"事件。此时，可以开始与手机设备进行通讯
	 * 
	 * 添加phonegap监听：document.addEventListener("deviceready", onDeviceReady, false);
	 * 直接退出系统：navigator.app.exitApp();
	 */
	function onDeviceReady()
	{
		document.addEventListener("pause", onLockScreen, false); //锁屏，锁屏可能只是登录之后或者一段时间不操作之后才粗触发，按需要提到相应位置
		document.addEventListener('offline', onOffline, false); //断网
		document.addEventListener('online', onOnline, false); //联网
		document.addEventListener("backbutton", onBackKeyDown, false); //返回键
		
	    //更新客户端处理
		getVersion(function(nowVersion) { //首先获取到当前app版本号
			var version = nowVersion, plat = 1; //平台默认为android
			if(iBrouser.ios) {
				plat = 2; //2表示ios
			}
			var param = {"version": version, "plat": plat},  //app版本检查的入参
				url = require("gconfig").global.serverPath + "login!versionchk.action"; //app版本检查的接口地址
			appUtils.invokeServer(url, param, function(data) {
				var errorcode = data.errorcode, errmsg = data.errmsg;
				if(errorcode == 0) {
					lastVersion = results.lastVersion, url = results.url;
					updateClient(null, null, [data.needupdate, data.url]);
				} else {
					if(errmsg) layerUtils.iAlert(errmsg);
				}
			},true,true,false);
		}, null);
	}
	
	var pgPlugin = {
		"onDeviceReady": onDeviceReady,
		"onLockScreen": onLockScreen,
		"callPhone": callPhone,
		"sendMessage": sendMessage,
		"sendMail": sendMail,
		"share": share,
		"uploadFile": uploadFile,
		"openMarket": openMarket
	};
	module.exports = pgPlugin;
});