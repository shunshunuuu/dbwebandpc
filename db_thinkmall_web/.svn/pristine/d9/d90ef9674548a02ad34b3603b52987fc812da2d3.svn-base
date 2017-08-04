/**
 * 证书申请，下载,安装
 */
define(function(require, exports, module) {
	
	/**
	 * 证书控件
	 */
	var cenroll = null,
	    certType = "1";
	var popup = require("popup");
	
	/**
	 * 功能:初始化证书环境
	 * 参数:证书类型,0:新安，1：天威，默认1
	 */
	function init(type){
		certType = type || "1";
		var dllCheck_flag = true;
		var ffCenrollObject = null;
		var ieCenrollObject_32 = null;
		var ieCenrollObject_64 = null;
		if(certType == "0"){
			ieCenrollObject_32 = "<div style='display:none'><object classid='clsid:ECF314B1-4159-46DE-AC9C-EB7B24CCA382' id='cenroll_ie' width='0' height='0' ></object></div>";
			ieCenrollObject_64 = "<div style='display:none'><object classid='clsid:3CF314B1-4159-46DE-AC9C-EB7B24CCA64B' id='cenroll_ie' width='0' height='0' ></object></div>";
			ffCenrollObject = "<embed id='cenroll_firefox' type='application/npicbc_infosec_certenroll' width='0' height='0'>";
		}else{
			ieCenrollObject_32 = "<div style='display:none'><object id='cenroll_ie' codebase='../download/itruscertctl.cab#version=1,1,2013,801' classid='clsid:DD2257CE-4FEE-455A-AD8B-860BEEE25ED6' width='0' height='0'></object></div>";
			ieCenrollObject_64 = "<div style='display:none'><object id='cenroll_ie' codebase='../download/itruscertctl.cab#version=1,1,2013,801' classid='clsid:DD2257CE-4FEE-455A-AD8B-860BEEE25ED6' width='0' height='0'></object></div>"; 
			ffCenrollObject = "<div><object id='cenroll_firefox' type='application/iTrusCertEnroll.CertEnroll.Version.1' width='0' height='0'></object></div>";
		}
		if(navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident")!=-1){
			var cpuv = window.navigator.cpuClass;
			if(cpuv.indexOf("x64")!=-1){
				$("#certContent").html(ieCenrollObject_64);
			}else{
				$("#certContent").html(ieCenrollObject_32);
			}
			cenroll = document.getElementById("cenroll_ie");
			try{
				if(certType == "0"){
					cenroll.getVersion();
				}else if(certType == "1"){
					cenroll.Reset();
				}
			}catch(e){
//				if(-2146827850 == e.number) {
					var cpuv = window.navigator.cpuClass;
					if(cpuv.indexOf("x64")!=-1){
						if(certType == "0"){
							popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
								window.open ( "../../../plugins/cert/download/infosec_certenroll(x64).exe" , "downWindow" ) ;
							});
						}else if(certType == "1"){
							popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
								window.open ( "../../../plugins/cert/download/iTrusPTA.exe" , "downWindow" ) ;
							});
						}
//						dllCheck_flag = false;
					}else{
						if(certType == "0"){
							popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
								window.open ( "../../../plugins/cert/download/infosec_certenroll.exe" , "downWindow" ) ;
							});
						}else if(certType == "1"){
							popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
								window.open ( "../../../plugins/cert/download/iTrusPTA.exe" , "downWindow" ) ;
							});
						}
//						dllCheck_flag = false;
					}
//				}
				dllCheck_flag = false;
			}
		}else{
			var length = navigator.plugins.length;
			var check_install_cenroll = 0;
			for(var i = 0; i < length ;i ++){
				var index;
				if(certType=="1"){
					index = (navigator.plugins[i].name).indexOf("iTrusPTA");
				}else{
					index = (navigator.plugins[i].name).indexOf("npInfosecNetsign");
				}
				if(index > -1){
					check_install_cenroll ++;
					break;
				}
			}
			if(check_install_cenroll > 0){
				$("#certContent").html(ffCenrollObject);
				cenroll = document.getElementById("cenroll_firefox");
			}else{
				if(certType == "0"){
					popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
						window.open ( "../../../plugins/cert/download/infosec_certenroll.exe" , "downWindow" ) ;
					});
				}else if(certType == "1"){
					popup.alert("温馨提示","检测到您未正确安装证书控件，请点击确定下载",function(){
						window.open ( "../../../plugins/cert/download/infosec_certenroll.exe" , "downWindow" ) ;
					});
				}
				dllCheck_flag = false;
			}
		}
		return dllCheck_flag;
	}
	
	/**
	 * 功能:安装CA颁发下来的证书,需要对外公布(包含天威和信安)
	 * 参数: certChain(mandatory):包含用户证书及证书链的Base64格式P7字符串
	 */
	function installCert(certChain) {
		if(certType == "1"){
			try {
				cenroll.DeleteRequestCert = false;
				cenroll.WriteCertToCSP = true;
				cenroll.acceptPKCS7(certChain);
				return true;
			} catch(e) {
				if(-2147023673 == e.number) {
//					alert("您取消了我们为您颁发的数字证书安装，证书安装失败！\n在您还未离开本页面前，您还可以点击“安装数字证书”按钮安装。");
					popup.alert("温馨提示","您取消了我们为您颁发的数字证书安装，证书安装失败！\n在您还未离开本页面前，您还可以点击“手动安装”按钮安装。");
					return false;
				} else if(-2146885628 == e.number) {
//					alert("您的证书已经成功安装过了！");
					popup.alert("温馨提示","您的证书已经成功安装过了！");
					return false;
				} else {
//					alert("安装证书发生错误！\n错误号: " + e.number + "\n错误描述: " + e.description);
//					popup.alert("温馨提示","安装证书发生错误！\n错误号: " + e.number + "\n错误描述: " + e.description);
					popup.alert("温馨提示","安装证书发生错误！请刷新页面重新尝试！");
					return false;
				}
			}
		}else{
			try{
				if($.net.getBrowser().firefox){
					cenroll.setCSP("Microsoft Base Cryptographic Provider v1.0");
				}else{
					cenroll.setCSP("Microsoft Enhanced Cryptographic Provider v1.0");
				}
				var err = cenroll.writeClientCert(certChain);
				if(err==0){
					return true;
				}else{
					return false;
				}
			}catch(e) {
				if(-2147023673 == e.number) {
//					alert("您取消了我们为您颁发的数字证书安装，证书安装失败！\n在您还未离开本页面前，您还可以点击“手动安装”按钮安装。");
					popup.alert("温馨提示","您取消了我们为您颁发的数字证书安装，证书安装失败！\n在您还未离开本页面前，您还可以点击“手动安装”按钮安装。");
					return false;
				} else if(-2146885628 == e.number) {
//					alert("您的证书已经成功安装过了！");
					popup.alert("温馨提示","您的证书已经成功安装过了！");
					return false;
				} else {
//					alert("安装证书发生错误！\n错误号: " + e.number + "\n错误描述: " + e.description);
//					popup.alert("温馨提示","安装证书发生错误！\n错误号: " + e.number + "\n错误描述: " + e.description);
					popup.alert("温馨提示","安装证书发生错误！请刷新页面重新尝试！");
					return false;
				}
			}
		}
	}
	
	/**
	 * 功能:安装CA证书链
	 * 参数： cACertSignBufP7(mandatory)： PKCS7格式证书链
	 */
	function installCAChain(cACertSignBufP7) {
	    try{
	    	cenroll.acceptPKCS7(cACertSignBufP7);
	    } catch(e) {
	        if(-2147023673 == e.number) {
	            return false;
	        } else {
//	        	alert("安装证书链时发生错误！\n错误原因：" + e.description + "\n错误代码：" + toHex(e.number));
//	        	popup.alert("温馨提示","安装证书链时发生错误！\n错误原因：" + e.description + "\n错误代码：" + toHex(e.number));
	        	popup.alert("温馨提示","安装证书链时发生错误！请刷新页面重新尝试！");
	        }
	    }
	}
	
	/**
	 * 功能： 查询本地计算机的密钥服务提供者，并显示在指定的<select>中  ,需要对外公布
	 * 参数: objProviderList(mandatory) 密钥服务提供者列表<select>对象
	 *       defaultProvider(optional) 缺省密钥服务提供者名称
	 *       allowedProviders(optional) 允许的密钥服务提供者Array
	 */
	function findProviders(objProviderList, defaultProvider, allowedProviders) {
		$(objProviderList).html("");
		if(typeof(defaultProvider) == "undefined" || defaultProvider == "")
			defaultProvider = "Microsoft Enhanced Cryptographic Provider v1.0";
		var i = 0; nIndex = 0;
		var providerType = 1;//The default value for this property is 1
		var maxProviderType = 1; //max is 24
		var providerName;
		while(providerType <= maxProviderType) {
			i = 0; //从0开始枚举
			cenroll.ProviderType = providerType;
			while(true) {
				try {
					providerName = cenroll.enumProviders(i, 0);
					if(providerName == "" || providerName == null) {
						break;
					}
				} catch(e) {
					break;
				}
				if(providerName.length == 0) {
					break;
				} else {				
					if(typeof(allowedProviders) == "string") {
						if(providerName == allowedProviders) {
							$(objProviderList).append("<option value = " +providerType+ ">" +providerName );
							nIndex++; //总索引
						}
					} else if(typeof(allowedProviders) == "object" && allowedProviders.length > 0) {
						for(var j = 0; j < allowedProviders.length; j++){
							if(providerName == allowedProviders[j]) {
								$(objProviderList).append("<option value = " +providerType+ ">" +providerName );
								nIndex ++; //总索引
							}
						}
					} else { //typeof(allowedProviders)=="undefined" || allowedProviders == ""
						$(objProviderList).append("<option value = " +providerType+ ">" +providerName );
						nIndex ++; //总索引
					}
					
					if(providerName == defaultProvider)
						objProviderList.selectedIndex = nIndex - 1;
					i ++;
				}
			}
			providerType++;
		}
		if(objProviderList.length == 0){
			$(objProviderList).append("<option value = ''>您的电脑上未安装指定USB KEY的驱动程序！");
		}
	}
	
	/**
	 * 功能： 申请证书，创建密钥对并生成证书签名请求，需要对外公布(前置方法，分别调用信安和天威的证书申请)
	 * 参数：  objProviderList(mandatory) 加密服务提供者列表的<select>对象
	 *        cryptFlag(optional)
	 *		            0x0表示私钥既不可以导出，又不要求强私钥保护
	 *		            0x1表示私钥可导出，默认值
	 *		            0x2表示强私钥保护
	 *					0x3(0x1|0x2)表示私钥既可以导出，又要求强私钥保护
	 *					0x00008000    // 强私钥保护,用户必须设置密码
	 *					(0x00008000 | 0x2)	表示既需要强私钥保护，又表示密钥可导出
	 *       isNeedPriPwd:申请证书时候是否需要客户设置私钥密码,默认不需要
	 */
	function genEnrollCSR(objProviderList, cryptFlag,isNeedPriPwd) {
		if(certType == "1"){
			if(isNeedPriPwd){
				cryptFlag = cryptFlag | 0x00008000;
			}
			var objProvider = objProviderList.item(objProviderList.selectedIndex);
			return genKeyAndCSR(objProvider.text, objProvider.value, cryptFlag,"",isNeedPriPwd);
		}else{
			return getPk10str();
		}
	}
	
	/**
	 * 得到中登证书的pk10请求串(信安)
	 */
	function getPk10str(){
		var pkcs10 = "";
		if($.net.getBrowser().firefox){
			cenroll.setCSP("Microsoft Base Cryptographic Provider v1.0");
			pkcs10 = cenroll.genP10(2048);
		}else{
			cenroll.setCSP("Microsoft Enhanced Cryptographic Provider v1.0");
			pkcs10 = cenroll.genP10(2048);
		}
		return pkcs10;
	}
	
	/**
	 * 功能: 更新证书，生成更新证书的证书签名请求，需要对外公布(天威)
	 * 参数 objProviderList(mandatory) 加密服务提供者列表的<select>对象
	 *      cryptFlag(mandatory)
	 *		        0x0表示私钥既不可以导出，又不要求强私钥保护
	 *		        0x1表示私钥可导出，默认值
	 *		        0x2表示强私钥保护
	 *		        0x3(0x1|0x2)表示私钥既可以导出，又要求强私钥保护
	 *      objOldCert(mandatory) 要更新的证书对象（PTALib.Certificate）
	 *      useOldKey ,是否沿用旧的密钥
	 */
	function genRenewCSR(objProviderList, cryptFlag, objOldCert,useOldKey) {
		var oldCertCSP = objOldCert.CSP; //旧证书CSP
		var providerName, providerType;
		if(typeof(objProviderList) == "string") {
			providerName = objProviderList;
			providerType = 1;
		} else if(typeof(objProviderList) == "object") {
			var objProvider = objProviderList.item(objProviderList.selectedIndex);
			providerName = objProvider.text;
			providerType = objProvider.value;
		} else {
			alert("Paramter [objProvider] is not correct.");
			return "";
		}
		if($.string.isEmtpy(useOldKey)){
			useOldKey = true;
		}
		if(oldCertCSP != providerName) {
			var info = "您选择的密钥服务提供者与您正在更新的证书不匹配！\n如果您点击“确定”，将会生成新的密钥对进行更新，点击“取消”重新选择密钥服务提供者。";
			if(!window.confirm(info)) {
				return "";
			} else
				useOldKey = false;
		}
		if(useOldKey) {
			//使用旧的密钥对，更新后的证书只是更新了证书有效期
			return genKeyAndCSR(providerName, providerType, cryptFlag, objOldCert.KeyContainer);
		} else {
			//生成新的密钥对，更新后的证书不仅更新了证书有效期，而且换了密钥对
			return genKeyAndCSR(providerName, providerType, cryptFlag);
		}	
	}
	
	/**
	 * 功能: 产生密钥对，并返回证书签名请求CSR,私有方法，不暴露(天威)
	 * 参数： providerName(mandatory) 密钥服务提供者名称
	 *        providerType(mandatory) 密钥服务提供者类型
	 *        cryptFlag(optional)
	 *					0x0表示私钥既不可以导出，又不要求强私钥保护
	 *					0x1表示私钥可导出，默认值
	 *					0x2表示强私钥保护
	 *					0x3(0x1|0x2)表示私钥既可以导出，又要求强私钥保护
	 *       keyContainer(optional)
	 *		            可使用PTALib.Certificate对象的.KeyContainer方法获取原证书的密钥容器
	 *		            密钥容器名称，更新证书时需要设置，会使用原来的密钥对发出签名请求。
	 *		            如果在原证书存储在USB KEY中，更新的证书会自动覆盖老证书
	 * @return 证书申请请求CSR
	 */
	function genKeyAndCSR(providerName, providerType, cryptFlag, keyContainer,isNeedPriPwd) {
		try {
			cenroll.Reset(); //首先Reset
			cenroll.ProviderName = providerName;
			cenroll.ProviderType = providerType;
			
			var keyflags = 0;
			if(typeof(cryptFlag) != "number") {
				cryptFlag = 0x00000001; //表示私钥可导出，默认值
			}
			keyflags = keyflags | cryptFlag;
			if(typeof(keyContainer) == "string" && keyContainer != "") {//适用于更新证书
				cenroll.UseExistingKeySet = true;
				cenroll.ContainerName = keyContainer;
			}
			
			cenroll.HashAlgorithm = "MD5"; //SHA1
			cenroll.KeySpec = 1;
			var csr = "";
			var bits = "2048";
			if($.net.getBrowser().ie){
				bits = "1024";
			}
			if(bits == "1024"){
				if(isNeedPriPwd){
					cenroll.GenKeyFlags = 0x08000000 | keyflags | 0x00008000; //1024bits
				}else{
					cenroll.GenKeyFlags = 0x08000000 | keyflags ; //1024bits
				}
			}else{
				cenroll.GenKeyFlags = 0x08000000 | keyflags; //2048bits
			}
			//objCEnroll.GenKeyFlags = 0x02000000 | keyflags; //512bits，一旦出错，不再尝试512bits的密钥对
			csr = cenroll.createPKCS10("CN=itrus_enroll", "1.3.6.1.5.5.7.3.2");
			return csr.replace(/\r*\n/g, "");
		} catch(e) {
			var keyNotPresent = "指定的密钥服务提供者不能提供服务！可能出现的原因："
					+ "\n1、您没有插入USB KEY，或者插入的USB KEY不能识别。"
					+ "\n2、您的USB KEY还没有初始化。";
			var keyContainerNotPresent = "指定的KeyContainer不能提供服务！\n如果您正在更新证书，请选择原证书的密钥服务提供者(CSP)。";
			if(-2147023673 == e.number //800704C7 User Canceled
			 || -2147418113 == e.number || -2146893795 == e.number //Zhong chao USB key User Canceled when input PIN
			 || -2146434962 == e.number //FT ePass2001 USB key User Canceld
			 ) {
				return "";
			} else if(-2146893802 == e.number) { //80090016
				if(providerName.indexOf("SafeSign") != -1)
					alert(keyNotPresent); //捷德的KEY没插KEY会报这个错误	
				else
					alert(keyContainerNotPresent); //当KeyContainer无法提供服务时，其他KEY会报这个错误
				return "";
			} else if(-2146435060 == e.number //8010000C FTSafe ePass2000没插KEY会报
				|| -2146893792 == e.number //80090020 FEITIAN ePassNG没插KEY会报
				) {
				alert(keyNotPresent); //捷德的KEY没插KEY会报这个错误			
				return "";
			} else if(-2146955245 == e.number) {
//				alert("创建新密钥容器错误:0x80081013(00000005)\n提示：请将当前站点加入可信站点！");
				popup.alert("温馨提示","创建新密钥容器错误:0x80081013(00000005)\n提示：请将当前站点加入可信站点！\n若浏览器存在保护模式，请将浏览器保护模式去掉重新尝试！");
				return "";
			}
			else {//创建1024位密钥对或产生CSR时发生其他未知错误，将错误报告给用户
//				alert("在证书请求过程中发生错误！\n错误原因：" + e.description + "\n错误代码：" + e.number);
//				popup.alert("温馨提示","在证书请求过程中发生错误！\n错误原因：" + e.description + "\n错误代码：" + e.number);
				popup.alert("温馨提示","在证书请求过程中发生错误！请刷新页面重新尝试！");
				return "";
			}
		}
	}
	
	//对外暴露的方法
	var cert = {
		"init" : init , //初始化
		"installCert" : installCert , //安装CA证书
		"findProviders" : findProviders ,//查询本地计算机的密钥服务提供者
		"genEnrollCSR" : genEnrollCSR, //创建密钥对并生成证书签名请求
		"genRenewCSR"  : genRenewCSR //更新证书
	};
	module.exports = cert;
});