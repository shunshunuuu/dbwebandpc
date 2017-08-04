/**
 * 证书签名
 */
define(function(require, exports, module) {
	//for SignMessage method
	var INPUT_BASE64		= 0x01;
	var INPUT_HEX			= 0x02;
	var OUTPUT_BASE64		= 0x04;
	var OUTPUT_HEX			= 0x08;

	var INNER_CONTENT 	    = 0x10;
	var PLAINTEXT_UTF8      = 0x20;
	var MIN_CERTSTORE    	= 0x40;

	//for VerifySignature method
	var MSG_BASE64 	        =  0x4;
	var MSG_HEX 	        =  0x8;

	//for ExportPKCS12 method
	var EXPORT_CHAIN	    = 0x01; //未实现
	var EXPORT_DISABLE	    = 0x02;
	var EXPORT_DELETE	    = 0x04;
	//在IE浏览器中导出或删除时需要用户确认

	//密钥用法
	var KEY_USAGE_UNDEFINED			= 0x00;
	var KEY_USAGE_CRL_SIGN			= 0x02;
	var KEY_USAGE_CERT_SIGN			= 0x04;
	var KEY_USAGE_KEY_AGREEMENT		= 0x08;
	var KEY_USAGE_DATA_ENCIPHERMENT	= 0x10;
	var KEY_USAGE_KEY_ENCIPHERMENT	= 0x20;
	var KEY_USAGE_NON_REPUDIATION	= 0x40;
	var KEY_USAGE_DIGITAL_SIGNATURE	= 0x80;

	var iTrusPTA = null,
        certType = "1";
	var popup = require("popup");
	
	/**
	 * 功能：初始化检测证书是否安装,需要对外暴露
	 * 参数:证书类型,0:中登，1：天威，默认1
	 */
	function init(type){
		certType = type || "1";
		var PtaObject_32 = null;
		var PtaObject_64 = null;
		if(certType == "1"){
			PtaObject_32 = "<object width='0' height='0' id='iTrusPTA_ie' type='application/iTrusPTA.iTrusPTA' classid='clsid:F1F0506B-E2DC-4910-9CFC-4D7B18FEA5F9'></object><embed id='iTrusPTA_firefox' type='application/iTrusPTA.iTrusPTA.Version.1' width='0' height='0' />";
			PtaObject_64 = "<object width='0' height='0' id='iTrusPTA_ie' type='application/iTrusPTA.iTrusPTA' classid='clsid:F1F0506B-E2DC-4910-9CFC-4D7B18FEA5F9'></object><embed id='iTrusPTA_firefox' type='application/iTrusPTA.iTrusPTA.Version.1' width='0' height='0' />";
		}else{
			PtaObject_32 = "<div style='display:none'><object classid='clsid:B3B938C4-4190-4F37-8CF0-A92B0A91CC77' id='iTrusPTA_ie' width='0' height='0' VIEWASTEXT></object></div><embed id='iTrusPTA_firefox' type='application/infosec-netsign-plugin' width='0' height='0' />";
			PtaObject_64 = "<div style='display:none'><object data='data:application/x-oleobject;base64,xDi5s5BBN0+M8KkrCpHMdwADAACyHgAA/wIAAA==' classid='clsid:AA6BA3FC-3428-4443-B7AB-D2A85AF20250' id='iTrusPTA_ie' width='0' height='0' VIEWASTEXT></object></div><embed id='iTrusPTA_firefox' type='application/infosec-netsign-plugin' width='0' height='0' />";
		}
		if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident")!=-1) {
			var cpuv = window.navigator.cpuClass;
			if(cpuv.indexOf("x64")!=-1){
				$("#signContent").html(PtaObject_64);
			}else{
				$("#signContent").html(PtaObject_32);
			}
			iTrusPTA = document.getElementById("iTrusPTA_ie");
		} else {
			$("#signContent").html(PtaObject_32);
			var length = navigator.plugins.length;
			var check_install = 0;
		    for (var i = 0; i < length; i++) {
		    	var index = (navigator.plugins[i].name).indexOf("iTrusPTA");
		    	if (index > -1) {
		    		check_install ++;
		            break;
		        }
		    }
		    if (check_install > 0) {
		        iTrusPTA = document.getElementById("iTrusPTA_firefox");
		    } else {
		        //window.location.href = "./showDownPTA.html";
		    }
	    }
	}
	
	/**
	 * class Names
	 * @method getItem(name) return names' first value
	 * @method getItems(name) return names' value sting array object
	 */
	function Names(distinguishName) {
		this.names = this.init(distinguishName);
	}
	Names.prototype.getItems = function(name){
		return this.names.get(name);
	};
	Names.prototype.getItem = function(name){
		var values = this.getItems(name);
		if (null == values) {
			return null;
		} else {
			return values[0];
		}
	};
	Names.prototype.init = function(dn){
		var _names = new Hashtable();
		var partition = ", ";
		var Items = dn.split(partition);
		var itemString = "";
		for (var i = Items.length - 1; i >= 0; i--) {
			if (itemString != "") {
				itemString = Items[i] + itemString;
			} else {
				itemString = Items[i];
			}
			var pos = itemString.indexOf("=");
			if (-1 == pos) {
				itemString = partition + itemString;
				continue;
			} else {
				var name = itemString.substring(0, pos);
				var value = itemString.substring(pos + 1, itemString.length);
				// wipe off the limitrophe quotation marks
				if (value.indexOf("\"") == 0 && (value.length - 1) == value.lastIndexOf("\"")) {
					value = value.substring(1, value.length);
					value = value.substring(0, value.length - 1);
				}
				if (_names.containsKey(name)) {
					var array = _names.get(name);
					array.push(value);
					_names.remove(name);
					_names.put(name, array);
				} else {
					var array = new Array();
					array.push(value);
					_names.put(name, array);
				}
				itemString = "";
			}
		}
		return _names;
	};
	
	/**
	 * 功能：返回与Windows平台下Crypto Shell Extensions证书查看证书兼容的16进制证书序列号
	 *      注：序列号实际是一个大的整数，在Windows平台下为了避免出现负数，当二进制数的首位为1时（16进制首位大于等于8），
	 *      Crypto Shell Extensions自动给16进制数前加了“00”。
	 * 参数： serialNumber: ICA系统（java API）的16进制证书序列号
	 * 返回:  String 16进制的Windows平台证书序列号
	 */
	function getIEValidSerialNumber(serialNumber) {
		if (serialNumber == null)
			return null;
		if (serialNumber.length == 0) {
			return serialNumber;
		} else {
			serialNumber = serialNumber.toLowerCase();
			if (serialNumber.length % 2 == 1){
				serialNumber = "0" + serialNumber;
			}
			var firstWord = serialNumber.substring(0, 1);
			var firstNumber = 0;
			try {
				firstNumber = parseInt(firstWord, 16);
			} catch (e) {
				return serialNumber;
			}
			if (firstNumber >= 8) {
				return "00" + serialNumber;
			} else {
				return serialNumber;
			}
		}
	}
	
	/**
	 * 功能:Windows平台下Crypto Shell Extensions证书查看证书兼容的16进制证书序列号转换为ICA系统（java API）兼容的16进制证书序列号
	 * 参数： serialNumber: 16进制的Windows平台证书序列号
	 * 返回:  16进制的ICA系统（java API）兼容的16进制证书序列号
	 */
	function getICAValidSerialNumber(serialNumber) {
		if (serialNumber == null)
			return null;
		if (serialNumber.length % 2 == 1)
			serialNumber = "0" + serialNumber;
		if (serialNumber.substring(0,2) == "00"){
			serialNumber = serialNumber.substring(2).toUpperCase();
			return serialNumber;
		} else {
			serialNumber = serialNumber.toUpperCase();
			return serialNumber;
		}
	}
	
	/**
	 * 功能: 导出软证书,对外暴露
	 * 参数： cert Certificate对象
	 *       password 导出证书文件的备份密码
	 *       opt 导出参数
	 * 					opt = opt | EXPORT_DISABLE; //是否允许再导出？
	 * 					opt = opt | EXPORT_DELETE; //导出成功后是否从系统删除原证书？
	 * 返回 fileName 导出文件名，""或忽略，则会自动弹出文件选择对话框
	 */
	function exportPKCS12(cert, password, opt, fileName) {
		try {
			opt = typeof(opt) == "number" ? opt : 0; //缺省允许再导出，也不删除
			if (typeof(fileName) == "undefined")
				fileName = "";
			cert.ExportPKCS12(password, opt, fileName);
			return true;
		} catch(e) {
			if ((e.number == -2147483135)) { // cancel
				// User canceled
			} else if(e.number == -2146893813) {
				alert("证书“" + cert.CommonName + "”的安全策略限制导出私钥。");
			} else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return false;
		}
	}
	
	/**
	 * 功能： 根据所设置条件过滤证书(天威)
	 * 参数： arrayIssuerDN(optional)
	 *            Array() or string，缺省为""，证书的颁发者字符串和字符串数组，支持多个CA时使用字符串数组
	 *        dateFlag(optional)
	 *            缺省为0，0表示所有证书，1表示处于有效期内的证书，2表示待更新证书，3表示未生效或已过期证书
	 *        serialNumber(optional)
	 *            缺省为""，证书序列号（微软格式）
	 * 返回: Array(), PTALib.Certificate
	 */
	function filterCerts(arrayIssuerDN, dateFlag, serialNumber) {
	    var m_certs = new Array();
	    var i = 0;
	    if (arrayIssuerDN == null) {
	        arrayIssuerDN = new Array("");
	    } else if (typeof(arrayIssuerDN) == "string") {
	        arrayIssuerDN = new Array(arrayIssuerDN);
	    }
	    if (typeof(serialNumber) == "undefined")
	        serialNumber = "";
	    for (i = 0; i < arrayIssuerDN.length; i++) {
	        var CertFilter = iTrusPTA.Filter;
	        CertFilter.Clear();
	        CertFilter.Issuer = arrayIssuerDN[i];
	        CertFilter.SerialNumber = serialNumber;
	        var t_Certs = iTrusPTA.MyCertificates; //临时变量
	        var now = new Date();
	        if (parseInt(t_Certs.Count) > 0) { //找到了证书
	            for (var j = 1; j <= parseInt(t_Certs.Count); j++) {
	                var validFrom = new Date(eval(t_Certs(j).ValidFrom));
	                var validTo = new Date(eval(t_Certs(j).ValidTo));
	                var keyUsage = t_Certs(j).KeyUsage;
	                switch (dateFlag) {
	                    case 0://所有证书
	                        m_certs.push(t_Certs(j));
	                        break;
	                    case 1://处于有效期内的证书
	                        if (validFrom < now && now < validTo)
	                            m_certs.push(t_Certs(j));
	                        break;
	                    case 2://待更新证书
	                        if ($.date.getDateDiffDate(validTo, _pta_OverlapPeriod) < now && now < validTo) {
	                            keyUsage = keyUsage & ~0x08;
	                            keyUsage = keyUsage & ~0x10;
	                            keyUsage = keyUsage & ~0x20;
	                            if (keyUsage != 0) {
	                                m_certs.push(t_Certs(j));
	                            }
	                        }
	                        break;
	                    case 3://未生效或已过期证书
	                        if (now < validFrom || validTo < now)
	                            m_certs.push(t_Certs(j));
	                        break;
	                    default://缺省当作所有证书处理
	                        m_certs.push(t_Certs(j));
	                        break;
	                }
	            }
	        }
	    }
	    return m_certs;
	}
	
	/**
	 * 功能：登陆签名
	 * 参数 certList  证书列表<select>对象
	 *      inputToSign: 用于签名登陆的被签名<input>对象
	 * 返回 成功返回签名值，失败返回""
	 */
	function signLogonData(signer, inputToSign) {
		try {
			var signedData;
			var ptaVersion = iTrusPTA.Version;
			if (ptaVersion == null) {
				// PTA Version = 1.0.0.3
				signedData = signer.SignMessage(inputToSign.value, OUTPUT_BASE64);
			} else {
				// PTA Version > 2
				if (inputToSign.value.indexOf("LOGONDATA:") == -1)
					inputToSign.value = "LOGONDATA:" + inputToSign.value;
				signedData = signer.SignLogonData(inputToSign.value, OUTPUT_BASE64);
			}
			return signedData;
		} catch (e) {
			if (-2147483135 == e.number) {
				// 用户取消签名
			} else if (e.number == -2146885621) {
				alert("您不拥有证书“" + CurCert.CommonName + "”的私钥，签名失败。");
				return "";
			} else {
				alert("PTA签名时发生错误\n错误号: " + e.number + "\n错误描述: " + e.description);
				return "";
			}
		}
	}
	
	/**
	 * 功能: 验证签名,对外暴露
	 *      strToSign: 原文
	 *      base64StrSignature:签名值
	 * 返回： 成功: 返回签名证书对象，失败: 返回null
	 */
	function verifySignature(strToSign, base64StrSignature, opt) {
		if (strToSign == "" || base64StrSignature == "")
			return;
		try {
			opt = typeof(opt) == "number" ? opt | INPUT_BASE64 : INPUT_BASE64; //签名值强制采用Base64编码
			var signCert = iTrusPTA.VerifySignature(strToSign, base64StrSignature, opt);
			//alert("签名验证成功。签名者为“" + signCert.CommonName + "”。");
			return true;
		} catch (e) {
			if (e.number == -2146893818)
				alert("签名验证失败。\r\n签名值与原文不匹配，内容已遭篡改。");
			else
				alert("签名验证失败。\r\n错误描述： " + e.description);
			return false;
		}
	}
	
	/**
	 * 功能: 对原文进行天威数字签名,对外暴露(包含天威、信安签名方法)
	 *       可以对原文进行的签名方式进行设置
	 * 参数: plainText：内容串
	 *       sn:证书SN值
	 *       dn:证书DN值
	 *       issur_dn:证书颁发者DN值
	 */
	function doCertSign(plainText,sn,dn,issur_dn){
		if(certType == "1"){
			var opt = 0; //默认
			opt = INNER_CONTENT;//签名包含原文
			sn = getIEValidSerialNumber(sn);
			var arrayCerts = filterCerts("", 0, sn);
			if(arrayCerts && arrayCerts.length > 0){
				var curCert = arrayCerts[0];
				var singValue = signMessage(plainText,curCert,opt);
				return singValue;
			}else{
//				alert("检测到您本地电脑尚未安装证书，请您补办证书!");
				popup.alert("温馨提示","检测到您本地电脑尚未安装证书，请您补办证书!");
				return null;
			}
		}else{
			var isCertExist="0";//初始化为0
			isCertExist=iTrusPTA.IsCertExists(dn);
			if(isCertExist+""!="1"){
//				alert("检测到您本地电脑尚未安装证书，请您补办证书!");
				popup.alert("温馨提示","检测到您本地电脑尚未安装证书，请您补办证书!");
				return null;
			}
			var singValue = iTrusPTA.NSDetachedSignByIssuerSN(plainText, sn, issur_dn);//证书颁发者DN值，证书SN值
			if(iTrusPTA.errorNum != 0){
//				alert("签名错误!错误码:"+iTrusPTA.errorNum);
				return null;
			}
			return singValue;
		}
	}
	
	/**
	 * 功能：检测证书签名环境是否初始化完成
	 * 参数：sn:证书SN值
	 *      dn:证书DN值
	 */
	function checkSignCertInit(sn,dn){
		var flag = true;
		sn = getIEValidSerialNumber(sn);
		if(certType == "1"){
			var arrayCerts = filterCerts("", 0, sn);
			if(!(arrayCerts && arrayCerts.length > 0)){
				if(navigator.userAgent.indexOf("Trident") == -1){
					//证书出问题，在ie11（32位）下
					flag = false;
				}else{
//					popup.alert("温馨提示","检测到您本地电脑尚未安装证书，请您补办证书!");
					flag = false;
				}
			}
		}else{
			var isCertExist="0";//初始化为0
			isCertExist=iTrusPTA.IsCertExists(dn);
			if(isCertExist+""!="1"){
//				alert("检测到您本地电脑尚未安装证书，请您补办证书!");
//				popup.alert("温馨提示","检测到您本地电脑尚未安装证书，请您补办证书!");
				flag = false;
			}
		}
		
		return flag;
	}
	
	/**
	 * 功能: 数字签名，签名文本
	 * 参数： plainText: 原文
	 *        signCert 用于签名的证书对象，可以使用GetSingleCertificate函数获得证书对象
	 *                ，或者使用SelectSingleCertificate函数选择<select>中列出的证书
	 *        opt:   签名参数
	 * 返回： 成功: 返回签名值，失败: 返回""
	 */
	function signMessage(plainText, signCert, opt) {
		var signedStr;
		try {
			opt = typeof(opt) == "number" ? opt | OUTPUT_BASE64 : OUTPUT_BASE64;
			signedStr = signCert.SignMessageEx(plainText, opt,false);
		} catch (e) {
			if ((e.number == -2147483135) || e.number == -2146881278 || e.number == -2146434962){ // FT2001 PIN Login canceled
				return "";// User canceled
			} else if (e.number == -2146885621){}
//				alert("您不拥有证书“" + signCert.CommonName + "”的私钥，签名失败。");
			else
//				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: "	+ e.description);
			return "";
		}
		return signedStr;
	}
	
	/**
	 * 功能： 数字签名，签名文件
	 * 参数： fileName: 待签名文件路径
	 *        signCert 用于签名的证书对象，可以使用GetSingleCertificate函数获得证书对象
	 *                ，或者使用SelectSingleCertificate函数选择<select>中列出的证书
	 *        opt: 签名参数
	 * 返回 成功: 返回签名值，失败: 返回""
	 */
	function signFile(fileName, signCert, opt) {
		if (fileName == "")
			return;
		var signedStr;
		try {
			opt = typeof(opt) == "number" ? opt | OUTPUT_BASE64 : OUTPUT_BASE64;
			alert(signCert.SerialNumber);
			signedStr = signCert.SignFile(fileName, opt);
		} catch (e) {
			if ((e.number == -2147483135) || e.number == -2146881278 || e.number == -2146434962) { // FT2001 PIN Login canceled
				return "";// User canceled
			} else if (e.number == -2147483134)
				alert("文件[" + srcFileName + "]不存在。");
			else if (e.number == -2146885621)
				alert("您不拥有证书“" + signCert.CommonName + "”的私钥，签名失败。");
			else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return "";
		}
		return signedStr;
	}
	
	/**
	 * 功能: 文件签名Ex
	 * 参数 srcfileName: 待签名文件路径
	 *      destFileName: 签名值文件路径
	 *      signCert :用于签名的证书对象，可以使用GetSingleCertificate函数获得证书对象
	 *               ，或者使用SelectSingleCertificate函数选择<select>中列出的证书
	 *      opt: 签名参数
	 * 返回： 成功: true，失败: false
	 */
	function signFileEx(srcFileName, destFileName, signCert, opt) {
		if (srcFileName == "" || destFileName == "")
			return;
		var bRet;
		try {
			 opt = typeof(opt) == "number"?opt|OUTPUT_BASE64:OUTPUT_BASE64;
			 bRet = signCert.SignFileEx(srcFileName, destFileName, opt);
		} catch (e) {
			if ((e.number == -2147483135) || e.number == -2146881278 || e.number == -2146434962) { // FT2001 PIN Login canceled
				return false;// User canceled
			} else if (e.number == -2147483134)
				alert("文件[" + srcFileName + "]不存在。");
			else if (e.number == -2146885621)
				alert("您不拥有证书“" + signCert.CommonName + "”的私钥，签名失败。");
			else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return false;
		}
		return bRet;
	}
	
	/**
	 * 功能: 更新证书时需要调用，更新证书的CSR
	 * 参数： objOldCert(mandatory) 要更新的证书对象（PTALib.Certificate）
	 *       csr(mandatory) 证书签名请求
	 * 返回: 成功: 返回签名值，失败: 返回""
	 */
	function signCSR(objOldCert, csr) {
		try {
			var signedData = "";
			var ptaVersion = iTrusPTA.Version;
			if (ptaVersion == null) {
				// PTA Version = 1.0.0.3
				signedData = objOldCert.SignMessage("LOGONDATA:" + csr,	OUTPUT_BASE64);
			} else {
				// PTA Version >= 2
				signedData = objOldCert.SignLogonData("LOGONDATA:" + csr, OUTPUT_BASE64);
			}
			return signedData;
		} catch (e) {
			if (-2147483135 == e.number) {
				// 用户取消签名
				return "";
			} else if (e.number == -2146885621) {
				alert("您不拥有证书“" + objOldCert.CommonName + "”的私钥，签名失败。");
				return "";
			} else {
				alert("PTA签名时发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
				return "";
			}
		}
	}
	
	/**
	 * 功能： 加密消息
	 * 参数： message  待加密消息原文
	 *       certificates PTA.Certificates集合对象
	 * 返回: 成功: 返回Base64编码加密值
	 */
	function encryptMessage(message, certificates) {
		if (message == "")
			return "";
		var encryptStr;
		try {
			encryptStr = certificates.EncryptMessage(message, 4);
		} catch (e) {
			alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return "";
		}
		return encryptStr;
	}
	
	/**
	 * 功能： 解密消息
	 * 参数: message: 待解密消息原文
	 * 返回: 成功: 返回解密后的消息原文
	 */
	function decryptMessage(encryptedStr) {
		if (encryptedStr == "")
			return "";
		var base64Str;
		try {
			base64Str = iTrusPTA.DecryptMessage(encryptedStr, 1);
		} catch (e) {
			if (e.number == -2146885620)
				alert("找不到解密证书或解密证书没有私钥。");
			else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return "";
		}
		return base64Str;
	}
	
	/**
	 * 功能: 加密文件
	 * 参数: srcFileName  待加密文件路径
	 *       destFileName 已加密文件路径
	 *       certificates  PTA.Certificates集合对象
	 * 返回: 成功: 返回true，失败：返回false
	 */
	function encryptFileEx(srcFileName, destFileName, certificates) {
		if (srcFileName == "" || destFileName == "")
			return "";
		var bRet;
		try {
			bRet = certificates.EncryptFileEx(srcFileName, destFileName, 0);
		} catch (e) {
			if (e.number == -2147483134)
				alert("文件[" + srcFileName + "]不存在。");
			else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: " + e.description);
			return false;
		}
		return bRet;
	}
	
	/**
	 * 功能: 解密文件
	 * 参数: srcFileName 已加密文件路径
	 *       destFileName 解密后文件路径
	 * 返回: 成功: 返回true，失败：返回false
	 */
	function decryptFileEx(srcFileName, destFileName) {
		if (srcFileName == "" || destFileName == "")
			return "";
		var bRet;
		try {
			bRet = iTrusPTA.DecryptFileEx(srcFileName, destFileName, 0);
		} catch (e) {
			if (e.number == -2147483134)
				alert("文件[" + srcFileName + "]不存在。");
			else if (e.number == -2146881269)
				alert("文件[" + srcFileName + "]格式不正确，ASN解码失败。");
			else if (e.number == -2146881276)
				alert("文件太大，解密失败，请尝试在服务端解密。");
			else if (e.number == -2146885620)
				alert("找不到解密证书或解密证书没有私钥。");
			else
				alert("PTA模块发生错误\r\n错误号: " + e.number + "\r\n错误描述: "	+ e.description);
			return false;
		}
		return bRet;
	}
	
	/*******************************************************************************
	 * Object: Hashtable Description: Implementation of hashtable Author: Uzi
	 * Refaeli
	 ******************************************************************************/
	Hashtable.prototype.hash = null;
	Hashtable.prototype.keys = null;
	Hashtable.prototype.location = null;
	/**
	 * Hashtable - Constructor Create a new Hashtable object.
	 */
	function Hashtable() {
		this.hash = new Array();
		this.keys = new Array();
		this.location = 0;
	}
	Hashtable.prototype.containsKey = function(key) {
		if (this.hash[key] == null)
			return false;
		else
			return true;
	};
	/**
	 * put Add new key param: key - String, key name param: value - Object, the
	 * object to insert
	 */
	Hashtable.prototype.put = function(key, value) {
		if (value == null)
			return;
		if (this.hash[key] == null)
			this.keys[this.keys.length] = key;
		this.hash[key] = value;
	};
	/**
	 * get Return an element param: key - String, key name Return: object - The
	 * requested object
	 */
	Hashtable.prototype.get = function(key) {
		return this.hash[key];
	};
	/**
	 * remove Remove an element param: key - String, key name
	 */
	Hashtable.prototype.remove = function(key) {
		for (var i = 0; i < this.keys.length; i++) {
			// did we found our key?
			if (key == this.keys[i]) {
				// remove it from the hash
				this.hash[this.keys[i]] = null;
				// and throw away the key...
				this.keys.splice(i, 1);
				return;
			}
		}
	};
	/**
	 * size Return: Number of elements in the hashtable
	 */
	Hashtable.prototype.size = function() {
		return this.keys.length;
	};
	/**
	 * populateItems Deprecated
	 */
	Hashtable.prototype.populateItems = function() {
	};
	/**
	 * next Return: true if theres more items
	 */
	Hashtable.prototype.next = function() {
		if (++this.location < this.keys.length)
			return true;
		else
			return false;
	};
	/**
	 * moveFirst Move to the first item.
	 */
	Hashtable.prototype.moveFirst = function() {
		try {
			this.location = -1;
		} catch (e) {/* //do nothing here :-) */
		}
	};
	/**
	 * moveLast Move to the last item.
	 */
	Hashtable.prototype.moveLast = function() {
		try {
			this.location = this.keys.length - 1;
		} catch (e) {/* //do nothing here :-) */
		}
	};
	/**
	 * getKey Return: The value of item in the hash
	 */
	Hashtable.prototype.getKey = function() {
		try {
			return this.keys[this.location];
		} catch (e) {
			return null;
		}
	};
	/**
	 * getValue Return: The value of item in the hash
	 */
	Hashtable.prototype.getValue = function() {
		try {
			return this.hash[this.keys[this.location]];
		} catch (e) {
			return null;
		}
	};
	/**
	 * getKey Return: The first key contains the given value, or null if not found
	 */
	Hashtable.prototype.getKeyOfValue = function(value) {
		for (var i = 0; i < this.keys.length; i++)
			if (this.hash[this.keys[i]] == value)
				return this.keys[i];
		return null;
	};
	/**
	 * toString Returns a string representation of this Hashtable object in the form
	 * of a set of entries, enclosed in braces and separated by the ASCII characters ", "
	 * (comma and space). Each entry is rendered as the key, an equals sign =, and
	 * the associated element, where the toString method is used to convert the key
	 * and element to strings. Return: a string representation of this hashtable.
	 */

	Hashtable.prototype.toString = function() {
		try {
			var s = new Array(this.keys.length);
			s[s.length] = "{";
			for (var i = 0; i < this.keys.length; i++) {
				s[s.length] = this.keys[i];
				s[s.length] = "=";
				var v = this.hash[this.keys[i]];
				if (v)
					s[s.length] = v.toString();
				else
					s[s.length] = "null";
				if (i != this.keys.length - 1)
					s[s.length] = ", ";
			}
		} catch (e) {
			// do nothing here :-)
		} finally {
			s[s.length] = "}";
		}
		return s.join("");
	};
	/**
	 * add Concatanates hashtable to another hashtable.
	 */
	Hashtable.prototype.add = function(ht) {
		try {
			ht.moveFirst();
			while (ht.next()) {
				var key = ht.getKey();
				// put the new value in both cases (exists or not).
				this.hash[key] = ht.getValue();
				// but if it is a new key also increase the key set
				if (this.get(key) != null) {
					this.keys[this.keys.length] = key;
				}
			}
		} catch (e) {
			// do nothing here :-)
		} finally {
			return this;
		}
	};
	
	//对外暴露
	var sign = {
		"init" : init, //初始化环境
		"exportPKCS12" : exportPKCS12 , //导出证书
		"verifySignature" : verifySignature, //前端验签
		"checkSignCertInit" : checkSignCertInit, //检测证书签名环境是否初始化完成
		"doCertSign" : doCertSign //证书签名
	};
	module.exports = sign;
});