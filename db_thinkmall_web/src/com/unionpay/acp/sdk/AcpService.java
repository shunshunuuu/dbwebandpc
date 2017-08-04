package com.unionpay.acp.sdk;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AcpService {

	/**
	 * ������ǩ��(ʹ�������ļ������õ�˽Կ֤�����)<br>
	 * ���ܣ��������Ľ���ǩ��,�����㸳ֵcertid,signature�ֶβ�����<br>
	 * @param reqData ������map<br>
	 * @param encoding ������������encoding�ֶε�ֵ<br>
	 * @return��ǩ�����map����<br>
	 */
	public static Map<String, String> sign(Map<String, String> reqData,String encoding) {
		Map<String, String> submitData = SDKUtil.filterBlank(reqData);
		SDKUtil.sign(submitData, encoding);
		return submitData;
	}
	
	/**
	 * ��֤��ǩ��(ͨ������˽Կ֤��·����������ܣ�<br>
	 * ���ܣ�����ж���̻��Ž�������,ÿ���̻��Ŷ�Ӧ��ͬ��֤�����ʹ�ô˷���:����˽Կ֤�������(������acp_sdk.properties�� ���� acpsdk.singleMode=false)<br>
	 * @param reqData ������map<br>
	 * @param certPath ǩ��˽Կ�ļ�����·����<br>
	 * @param certPwd ǩ��˽Կ����<br>
	 * @param encoding ������������encoding�ֶε�ֵ<br>
	 * @return��ǩ�����map����<br>
	 */
	public static Map<String, String> sign(Map<String, String> reqData,String certPath, 
			String certPwd,String encoding) {
		Map<String, String> submitData = SDKUtil.filterBlank(reqData);
		SDKUtil.signByCertInfo(submitData,certPath,certPwd,encoding);
		return submitData;
	}
	
	/**
	 * ��֤ǩ��(SHA-1ժҪ�㷨)<br>
	 * @param resData ���ر�������<br>
	 * @param encoding ������������encoding�ֶε�ֵ<br>
	 * @return true ͨ�� false δͨ��<br>
	 */
	public static boolean validate(Map<String, String> rspData, String encoding) {
		LogUtil.writeLog("��ǩ����ʼ");
		if (SDKUtil.isEmpty(encoding)) {
			encoding = "UTF-8";
		}
		String stringSign = rspData.get(SDKConstants.param_signature);

		// �ӷ��ر����л�ȡcertId ��Ȼ��ȥ֤�龲̬Map�в�ѯ��Ӧ��ǩ֤�����
		String certId = rspData.get(SDKConstants.param_certId);
		
		LogUtil.writeLog("�Է��ر��Ĵ���ǩʹ�õ���ǩ��Կ���кţ�["+certId+"]");
		
		// ��Map��Ϣת����key1=value1&key2=value2����ʽ
		String stringData = SDKUtil.coverMap2String(rspData);

		LogUtil.writeLog("����ǩ���ر��Ĵ���["+stringData+"]");
		
		try {
			// ��֤ǩ����Ҫ�����������̻��Ĺ�Կ֤��.
			return SecureUtil.validateSignBySoft(CertUtil
					.getValidateKey(certId), SecureUtil.base64Decode(stringSign
					.getBytes(encoding)), SecureUtil.sha1X16(stringData,
					encoding));
		} catch (UnsupportedEncodingException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return false;
	}
	

	/**
	 * �Կؼ�֧���ɹ����صĽ����Ϣ��data�������ǩ���ؼ��˻�ȡ��Ӧ����Ϣ��
	 * @param jsonData json��ʽ���ݣ����磺{"sign" : "J6rPLClQ64szrdXCOtV1ccOMzUmpiOKllp9cseBuRqJ71pBKPPkZ1FallzW18gyP7CvKh1RxfNNJ66AyXNMFJi1OSOsteAAFjF5GZp0Xsfm3LeHaN3j/N7p86k3B1GrSPvSnSw1LqnYuIBmebBkC1OD0Qi7qaYUJosyA1E8Ld8oGRZT5RR2gLGBoiAVraDiz9sci5zwQcLtmfpT5KFk/eTy4+W9SsC0M/2sVj43R9ePENlEvF8UpmZBqakyg5FO8+JMBz3kZ4fwnutI5pWPdYIWdVrloBpOa+N4pzhVRKD4eWJ0CoiD+joMS7+C0aPIEymYFLBNYQCjM0KV7N726LA==",  "data" : "pay_result=success&tn=201602141008032671528&cert_id=68759585097"}
	 * @return �Ƿ�ɹ�
	 */
	public static boolean validateAppResponse(String jsonData, String encoding) {
		LogUtil.writeLog("�ؼ�Ӧ����Ϣ��ǩ����ʼ��[" + jsonData + "]");
		if (SDKUtil.isEmpty(encoding)) {
			encoding = "UTF-8";
		}

        Pattern p = Pattern.compile("\\s*\"sign\"\\s*:\\s*\"([^\"]*)\"\\s*");
		Matcher m = p.matcher(jsonData);
		if(!m.find()) return false;
		String sign = m.group(1);

		p = Pattern.compile("\\s*\"data\"\\s*:\\s*\"([^\"]*)\"\\s*");
		m = p.matcher(jsonData);
		if(!m.find()) return false;
		String data = m.group(1);

		p = Pattern.compile("cert_id=(\\d*)");
		m = p.matcher(jsonData);
		if(!m.find()) return false;
		String certId = m.group(1);

		try {
			// ��֤ǩ����Ҫ�����������̻��Ĺ�Կ֤��.
			return SecureUtil.validateSignBySoft(CertUtil
					.getValidateKey(certId), SecureUtil.base64Decode(sign
					.getBytes(encoding)), SecureUtil.sha1X16(data,
					encoding));
		} catch (UnsupportedEncodingException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return false;
	}
	
	/**
	 * ���ܣ���̨�����ύ�����Ĳ�����ͬ��Ӧ����<br>
	 * @param reqData ������<br>
	 * @param rspData Ӧ����<br>
	 * @param reqUrl  �����ַ<br>
	 * @param encoding<br>
	 * @return Ӧ��http 200����true ,����false<br>
	 */
	public static Map<String,String> post(
			Map<String, String> reqData,String reqUrl,String encoding) {
		Map<String, String> rspData = new HashMap<String,String>();
		LogUtil.writeLog("����������ַ:" + reqUrl);
		//���ͺ�̨��������
		HttpClient hc = new HttpClient(reqUrl, 30000, 30000);
		try {
			int status = hc.send(reqData, encoding);
			if (200 == status) {
				String resultString = hc.getResult();
				if (null != resultString && !"".equals(resultString)) {
					// �����ؽ��ת��Ϊmap
					Map<String,String> tmpRspData  = SDKUtil.convertResultStringToMap(resultString);
					rspData.putAll(tmpRspData);
				}
			}else{
				LogUtil.writeLog("����http״̬��["+status+"]�����������Ļ��������ַ�Ƿ���ȷ");
			}
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return rspData;
	}
	
	/**
	 * ���ܣ�http Get���� ����ɷѲ�Ʒ��ʹ��<br>
	 * @param reqUrl
	 * @param encoding
	 * @return
	 */
	public static String get(String reqUrl,String encoding) {
		
		LogUtil.writeLog("����������ַ:" + reqUrl);
		//���ͺ�̨��������
		HttpClient hc = new HttpClient(reqUrl, 30000, 30000);
		try {
			int status = hc.sendGet(encoding);
			if (200 == status) {
				String resultString = hc.getResult();
				if (null != resultString && !"".equals(resultString)) {
					return resultString;
				}
			}else{
				LogUtil.writeLog("����http״̬��["+status+"]�����������Ļ��������ַ�Ƿ���ȷ");
			}
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return null;
	}
	
	
	/**
	 * ���ܣ�ǰ̨���׹���HTTP POST�Զ��ύ��<br>
	 * @param action ���ύ��ַ<br>
	 * @param hiddens ��MAP��ʽ�洢�ı���ֵ<br>
	 * @param encoding ������������encoding�ֶε�ֵ<br>
	 * @return ����õ�HTTP POST���ױ�<br>
	 */
	public static String createAutoFormHtml(String reqUrl, Map<String, String> hiddens,String encoding) {
		StringBuffer sf = new StringBuffer();
		sf.append("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset="+encoding+"\"/></head><body>");
		sf.append("<form id = \"pay_form\" action=\"" + reqUrl
				+ "\" method=\"post\">");
		if (null != hiddens && 0 != hiddens.size()) {
			Set<Entry<String, String>> set = hiddens.entrySet();
			Iterator<Entry<String, String>> it = set.iterator();
			while (it.hasNext()) {
				Entry<String, String> ey = it.next();
				String key = ey.getKey();
				String value = ey.getValue();
				sf.append("<input type=\"hidden\" name=\"" + key + "\" id=\""
						+ key + "\" value=\"" + value + "\"/>");
			}
		}
		sf.append("</form>");
		sf.append("</body>");
		sf.append("<script type=\"text/javascript\">");
		sf.append("document.all.pay_form.submit();");
		sf.append("</script>");
		sf.append("</html>");
		return sf.toString();
	}

	
	/**
	 * ���ܣ��������ļ�����ʹ��DEFLATEѹ���㷨ѹ����Base64���������ַ���������<br>
	 * ���õ��Ľ��ף������������������գ������˻�<br>
	 * @param filePath �����ļ�-ȫ·���ļ���<br>
	 * @return
	 */
	public static String enCodeFileContent(String filePath,String encoding){
		String baseFileContent = "";
		
		File file = new File(filePath);
		if (!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				LogUtil.writeErrorLog(e.getMessage(), e);
			}
		}
		InputStream in = null;
		try {
			in = new FileInputStream(file);
			int fl = in.available();
			if (null != in) {
				byte[] s = new byte[fl];
				in.read(s, 0, fl);
				// ѹ������.
				baseFileContent = new String(SecureUtil.base64Encode(SecureUtil.deflater(s)),encoding);
			}
		} catch (Exception e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					LogUtil.writeErrorLog(e.getMessage(), e);
				}
			}
		}
		return baseFileContent;
	}
	
	/**
	 * ���ܣ��������׷��ص�fileContent�ַ�������� �� ��base64����DEFLATEѹ������أ�<br>
	 * ���õ��Ľ��ף������ļ����أ���������״̬��ѯ<br>
	 * @param resData ���ر���map<br>
	 * @param fileDirectory ��ص��ļ�Ŀ¼������·����
	 * @param encoding ������������encoding�ֶε�ֵ<br>	
	 */
	public static void deCodeFileContent(Map<String, String> resData,String fileDirectory,String encoding) {
		// ���������ļ�
		String fileContent = resData.get(SDKConstants.param_fileContent);
		if (null != fileContent && !"".equals(fileContent)) {
			try {
				byte[] fileArray = SecureUtil.inflater(SecureUtil
						.base64Decode(fileContent.getBytes(encoding)));
				String filePath = null;
				if (SDKUtil.isEmpty(resData.get("fileName"))) {
					filePath = fileDirectory + File.separator + resData.get("merId")
							+ "_" + resData.get("batchNo") + "_"
							+ resData.get("txnTime") + ".txt";
				} else {
					filePath = fileDirectory + File.separator + resData.get("fileName");
				}
				File file = new File(filePath);
				if (file.exists()) {
					file.delete();
				}
				file.createNewFile();
				FileOutputStream out = new FileOutputStream(file);
				out.write(fileArray, 0, fileArray.length);
				out.flush();
				out.close();

			} catch (UnsupportedEncodingException e) {
				LogUtil.writeErrorLog(e.getMessage(), e);
			} catch (IOException e) {
				LogUtil.writeErrorLog(e.getMessage(), e);
			}
		}
	}

	/**
	 * ������ļ����� ת���������ַ�������base64,��ѹ��<br>
	 * ���õ��Ľ��ף���������״̬��ѯ<br>
	 * @param fileContent ��������״̬��ѯ���ص��ļ�����<br>
	 * @return ��������<br>
	 */
	public static String getFileContent(String fileContent,String encoding){
		String fc = "";
		try {
			fc = new String(SecureUtil.inflater(SecureUtil.base64Decode(fileContent.getBytes())),encoding);
		} catch (UnsupportedEncodingException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} catch (IOException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return fc;
	}
	
	
	/**
	 * �ֿ�����Ϣ��customerInfo����<br>
	 * ˵��������ѡ��������Ϣ����Ȩ��ʹ�þɵĹ���customerInfo��ʽ������������Ϣ���м��ܣ��� phoneNo��cvn2�� expired�����ܣ����������pin�Ļ������<br>
	 * @param customerInfoMap ��Ϣ��������� key������value��ֵ,����<br>
	 *        ���磺customerInfoMap.put("certifTp", "01");					//֤������<br>
				  customerInfoMap.put("certifId", "341126197709218366");	//֤������<br>
				  customerInfoMap.put("customerNm", "������");				//����<br>
				  customerInfoMap.put("phoneNo", "13552535506");			//�ֻ���<br>
				  customerInfoMap.put("smsCode", "123456");					//������֤��<br>
				  customerInfoMap.put("pin", "111111");						//���루���ܣ�<br>
				  customerInfoMap.put("cvn2", "123");           			//�������cvn2��λ���֣������ܣ�<br>
				  customerInfoMap.put("expired", "1711");  				    //��Ч�� ����ǰ���ں󣨲�����)<br>
	 * @param accNo  customerInfoMap����������ô���ű���,���customerInfoMapδ������pin�����ֶο��Բ���<br>
	 * @param encoding ������������encoding�ֶε�ֵ<br>				  
	 * @return base64��ĳֿ�����Ϣ���ֶ�<br>
	 */
	public static String getCustomerInfo(Map<String,String> customerInfoMap,String accNo,String encoding) {
		
		if(customerInfoMap.isEmpty())
			return "{}";
		StringBuffer sf = new StringBuffer("{");
		for(Iterator<String> it = customerInfoMap.keySet().iterator(); it.hasNext();){
			String key = it.next();
			String value = customerInfoMap.get(key);
			if(key.equals("pin")){
				if(null == accNo || "".equals(accNo.trim())){
					LogUtil.writeLog("�������루PIN����������getCustomerInfo�������ϴ�����");
					throw new RuntimeException("����PINû�Ϳ����޷���������");
				}else{
					value = encryptPin(accNo,value,encoding);
				}
			}
			sf.append(key).append(SDKConstants.EQUAL).append(value);
			if(it.hasNext())
				sf.append(SDKConstants.AMPERSAND);
		}
		String customerInfo = sf.append("}").toString();
		LogUtil.writeLog("��װ��customerInfo���ģ�"+customerInfo);
		try {
			return new String(SecureUtil.base64Encode(sf.toString().getBytes(
					encoding)),encoding);
		} catch (UnsupportedEncodingException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} catch (IOException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return customerInfo;
	}
	
	/**
	 * �ֿ�����Ϣ��customerInfo���죬��ѡ��������Ϣ����Ȩ�� �����¼��ܹ淶����pin��phoneNo��cvn2��expired���� <br>
	 * ���õ��Ľ��ף� <br>
	 * @param customerInfoMap ��Ϣ��������� key������value��ֵ,���� <br>
	 *        ���磺customerInfoMap.put("certifTp", "01");					//֤������ <br>
				  customerInfoMap.put("certifId", "341126197709218366");	//֤������ <br>
				  customerInfoMap.put("customerNm", "������");				//���� <br>
				  customerInfoMap.put("smsCode", "123456");					//������֤�� <br>
				  customerInfoMap.put("pin", "111111");						//���루���ܣ� <br>
				  customerInfoMap.put("phoneNo", "13552535506");			//�ֻ��ţ����ܣ� <br>
				  customerInfoMap.put("cvn2", "123");           			//�������cvn2��λ���֣����ܣ� <br>
				  customerInfoMap.put("expired", "1711");  				    //��Ч�� ����ǰ���ں󣨼��ܣ� <br>
	 * @param accNo  customerInfoMap����������ô���ű���,���customerInfoMapδ������PIN�����ֶο��Բ���<br>
	 * @param encoding ������������encoding�ֶε�ֵ
	 * @return base64��ĳֿ�����Ϣ���ֶ� <br>
	 */
	public static String getCustomerInfoWithEncrypt(Map<String,String> customerInfoMap,String accNo,String encoding) {
		if(customerInfoMap.isEmpty())
			return "{}";
		StringBuffer sf = new StringBuffer("{");
		//������Ϣ������
		StringBuffer encryptedInfoSb = new StringBuffer("");
		
		for(Iterator<String> it = customerInfoMap.keySet().iterator(); it.hasNext();){
			String key = it.next();
			String value = customerInfoMap.get(key);
			if(key.equals("phoneNo") || key.equals("cvn2") || key.equals("expired")){
				encryptedInfoSb.append(key).append(SDKConstants.EQUAL).append(value).append(SDKConstants.AMPERSAND);
			}else{
				if(key.equals("pin")){
					if(null == accNo || "".equals(accNo.trim())){
						LogUtil.writeLog("�������루PIN����������getCustomerInfoWithEncrypt�������ϴ�����");
						throw new RuntimeException("����PINû�Ϳ����޷���������");
					}else{
						value = encryptPin(accNo,value,encoding);
					}
				}
				sf.append(key).append(SDKConstants.EQUAL).append(value).append(SDKConstants.AMPERSAND);
			}
		}
		
		if(!encryptedInfoSb.toString().equals("")){
			encryptedInfoSb.setLength(encryptedInfoSb.length()-1);//ȥ�����һ��&����
			LogUtil.writeLog("��װ��customerInfo encryptedInfo���ģ�"+ encryptedInfoSb.toString());
			sf.append("encryptedInfo").append(SDKConstants.EQUAL).append(encryptData(encryptedInfoSb.toString(), encoding));
		}else{
			sf.setLength(sf.length()-1);
		}
		
		String customerInfo = sf.append("}").toString();
		LogUtil.writeLog("��װ��customerInfo���ģ�"+customerInfo);
		try {
			return new String(SecureUtil.base64Encode(sf.toString().getBytes(encoding)),encoding);
		} catch (UnsupportedEncodingException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		} catch (IOException e) {
			LogUtil.writeErrorLog(e.getMessage(), e);
		}
		return customerInfo;
	}
	
	/**
	 * �������ر��ģ���̨֪ͨ���е�customerInfo�򣺽�base64,�����������Ϣ���� encryptedInfo ������ܲ��� encryptedInfo�е���ŵ�customerInfoMap����
	 * @param customerInfo
	 * @param encoding
	 * @return
	 */
	public static Map<String,String> parseCustomerInfo(String customerInfo,String encoding){
		Map<String,String> customerInfoMap = null;
		try {
				byte[] b = SecureUtil.base64Decode(customerInfo.getBytes(encoding));
				String customerInfoNoBase64 = new String(b,encoding);
				LogUtil.writeLog("��base64��===>" +customerInfoNoBase64);
				//ȥ��ǰ���{}
				customerInfoNoBase64 = customerInfoNoBase64.substring(1, customerInfoNoBase64.length()-1);
				customerInfoMap = SDKUtil.parseQString(customerInfoNoBase64);
				if(customerInfoMap.containsKey("encryptedInfo")){
					String encInfoStr = customerInfoMap.get("encryptedInfo");
					customerInfoMap.remove("encryptedInfo");
					String encryptedInfoStr = decryptData(encInfoStr, encoding);
					Map<String,String> encryptedInfoMap = SDKUtil.parseQString(encryptedInfoStr);
					customerInfoMap.putAll(encryptedInfoMap);
				}
			} catch (UnsupportedEncodingException e) {
				LogUtil.writeErrorLog(e.getMessage(), e);
			} catch (IOException e) {
				LogUtil.writeErrorLog(e.getMessage(), e);
			}
		return customerInfoMap;
	}
	
	
	
	/**
	 * ������ܲ���base64<br>
	 * @param accNo ����<br>
	 * @param pwd ����<br>
	 * @param encoding<br>
	 * @return ���ܵ�����<br>
	 */
	public static String encryptPin(String accNo, String pwd, String encoding) {
		return SecureUtil.EncryptPin(pwd, accNo, encoding, CertUtil
				.getEncryptCertPublicKey());
	}
	
	/**
	 * ������Ϣ���ܲ���base64(���ţ��ֻ��ţ�cvn2,��Ч�ڣ�<br>
	 * @param data �� phoneNo,cvn2,��Ч��<br>
	 * @param encoding<br>
	 * @return ���ܵ�����<br>
	 */
	public static String encryptData(String data, String encoding) {
		return SecureUtil.EncryptData(data, encoding, CertUtil
				.getEncryptCertPublicKey());
	}
	
	/**
	 * ������Ϣ����
	 * @param base64EncryptedInfo
	 * @param encoding
	 * @return ���ܺ������
	 */
	public static String decryptData(String base64EncryptedInfo, String encoding) {
		return SecureUtil.DecryptedData(base64EncryptedInfo, encoding, CertUtil
				.getSignCertPrivateKey());
	}
	
	/**
	 * ���ܴŵ���Ϣ��ʹ�ù�Կ�ļ�<br>
	 * @param trackData �����ܴŵ�����<br>
	 * @param encoding �����ʽ<br>
	 * @return ���ܵ�����<br>
	 */
	public static String encryptTrack(String trackData, String encoding) {
		return SecureUtil.EncryptData(trackData, encoding,
				CertUtil.getEncryptTrackPublicKey());
	}
	
	/**
	 * ���ܴŵ���Ϣ��ʹ��ģ��ָ��<br>
	 * @param trackData �����ܴŵ�����<br>
	 * @param encoding �����ʽ<br>
	 * @param modulus ģ<br>
	 * @param exponent ָ��<br>
	 * @return ���ܵ�����<br>
	 */
	public static String encryptTrack(String trackData, String encoding,
			String modulus, String exponent) {
		return SecureUtil.EncryptData(trackData, encoding,
				CertUtil.getEncryptTrackCertPublicKey(modulus, exponent));
	}
	
	/**
	 * ��ȡ������Ϣ����֤����������к�<br>
	 * @return
	 */
	public static String getEncryptCertId(){
		return CertUtil.getEncryptCertId();
	}
	
	/**
	 * ���ַ�����base64
	 * @param rawStr
	 * @param encoding
	 * @return
	 * @throws IOException
	 */
	public static String base64Encode(String rawStr,String encoding) throws IOException{
		byte [] rawByte = rawStr.getBytes(encoding);
		return new String(SecureUtil.base64Encode(rawByte),encoding);
	}
	/**
	 * ��base64���ַ�����base64
	 * @param base64Str
	 * @param encoding
	 * @return
	 * @throws IOException
	 */
	public static String base64Decode(String base64Str,String encoding) throws IOException{
		byte [] rawByte = base64Str.getBytes(encoding);
		return new String(SecureUtil.base64Decode(rawByte),encoding);	
	}

}
