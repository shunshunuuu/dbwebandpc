/**
 *
 * Licensed Property to China UnionPay Co., Ltd.
 * 
 * (C) Copyright of China UnionPay Co., Ltd. 2010
 *     All Rights Reserved.
 *
 * 
 * Modification History:
 * =============================================================================
 *   Author         Date          Description
 *   ------------ ---------- ---------------------------------------------------
 *   xshu       2014-05-28       MPI��������������
 * =============================================================================
 */
package com.unionpay.acp.sdk;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;

/**
 * ����������߰� ����
 * 
 * @author xuyaowen
 * 
 */
public class SDKConfig {

	public static final String FILE_NAME = "acp_sdk.properties";

	/** ǰ̨����URL. */
	private String frontRequestUrl;
	/** ��̨����URL. */
	private String backRequestUrl;
	/** ���ʲ�ѯ */
	private String singleQueryUrl;
	/** ������ѯ */
	private String batchQueryUrl;
	/** �������� */
	private String batchTransUrl;
	/** �ļ����� */
	private String fileTransUrl;
	/** ǩ��֤��·��. */
	private String signCertPath;
	/** ǩ��֤������. */
	private String signCertPwd;
	/** ǩ��֤������. */
	private String signCertType;
	/** ���ܹ�Կ֤��·��. */
	private String encryptCertPath;
	/** ��֤ǩ����Կ֤��Ŀ¼. */
	private String validateCertDir;
	/** �����̻������ȡָ��ǩ��֤��Ŀ¼. */
	private String signCertDir;
	/** �ŵ�����֤��·��. */
	private String encryptTrackCertPath;
	/** �ŵ����ܹ�Կģ��. */
	private String encryptTrackKeyModulus;
	/** �ŵ����ܹ�Կָ��. */
	private String encryptTrackKeyExponent;
	/** �п�����. */
	private String cardRequestUrl;
	/** app���� */
	private String appRequestUrl;
	/** ֤��ʹ��ģʽ(��֤��/��֤��) */
	private String singleMode;

	/*�ɷ���ص�ַ*/
	private String jfFrontRequestUrl;
	private String jfBackRequestUrl;
	private String jfSingleQueryUrl;
	private String jfCardRequestUrl;
	private String jfAppRequestUrl;

	
	/** �����ļ��е�ǰ̨URL����. */
	public static final String SDK_FRONT_URL = "acpsdk.frontTransUrl";
	/** �����ļ��еĺ�̨URL����. */
	public static final String SDK_BACK_URL = "acpsdk.backTransUrl";
	/** �����ļ��еĵ��ʽ��ײ�ѯURL����. */
	public static final String SDK_SIGNQ_URL = "acpsdk.singleQueryUrl";
	/** �����ļ��е��������ײ�ѯURL����. */
	public static final String SDK_BATQ_URL = "acpsdk.batchQueryUrl";
	/** �����ļ��е���������URL����. */
	public static final String SDK_BATTRANS_URL = "acpsdk.batchTransUrl";
	/** �����ļ��е��ļ��ཻ��URL����. */
	public static final String SDK_FILETRANS_URL = "acpsdk.fileTransUrl";
	/** �����ļ��е��п�����URL����. */
	public static final String SDK_CARD_URL = "acpsdk.cardTransUrl";
	/** �����ļ��е�app����URL����. */
	public static final String SDK_APP_URL = "acpsdk.appTransUrl";

	
	/** ���½ɷѲ�Ʒʹ�ã������Ʒ�ò��������Ӽ��� */
	// ǰ̨�����ַ
	public static final String JF_SDK_FRONT_TRANS_URL= "acpsdk.jfFrontTransUrl";
	// ��̨�����ַ
	public static final String JF_SDK_BACK_TRANS_URL="acpsdk.jfBackTransUrl";
	// ���ʲ�ѯ�����ַ
	public static final String JF_SDK_SINGLE_QUERY_URL="acpsdk.jfSingleQueryUrl";
	// �п����׵�ַ
	public static final String JF_SDK_CARD_TRANS_URL="acpsdk.jfCardTransUrl";
	// App���׵�ַ
	public static final String JF_SDK_APP_TRANS_URL="acpsdk.jfAppTransUrl";
	
	
	/** �����ļ���ǩ��֤��·������. */
	public static final String SDK_SIGNCERT_PATH = "acpsdk.signCert.path";
	/** �����ļ���ǩ��֤�����볣��. */
	public static final String SDK_SIGNCERT_PWD = "acpsdk.signCert.pwd";
	/** �����ļ���ǩ��֤�����ͳ���. */
	public static final String SDK_SIGNCERT_TYPE = "acpsdk.signCert.type";
	/** �����ļ����������֤��·������. */
	public static final String SDK_ENCRYPTCERT_PATH = "acpsdk.encryptCert.path";
	/** �����ļ��дŵ�����֤��·������. */
	public static final String SDK_ENCRYPTTRACKCERT_PATH = "acpsdk.encryptTrackCert.path";
	/** �����ļ��дŵ����ܹ�Կģ������. */
	public static final String SDK_ENCRYPTTRACKKEY_MODULUS = "acpsdk.encryptTrackKey.modulus";
	/** �����ļ��дŵ����ܹ�Կָ������. */
	public static final String SDK_ENCRYPTTRACKKEY_EXPONENT = "acpsdk.encryptTrackKey.exponent";
	/** �����ļ�����֤ǩ��֤��Ŀ¼����. */
	public static final String SDK_VALIDATECERT_DIR = "acpsdk.validateCert.dir";

	/** �����ļ����Ƿ����cvn2����. */
	public static final String SDK_CVN_ENC = "acpsdk.cvn2.enc";
	/** �����ļ����Ƿ����cvn2��Ч�ڳ���. */
	public static final String SDK_DATE_ENC = "acpsdk.date.enc";
	/** �����ļ����Ƿ���ܿ��ų���. */
	public static final String SDK_PAN_ENC = "acpsdk.pan.enc";
	/** �����ļ���֤��ʹ��ģʽ */
	public static final String SDK_SINGLEMODE = "acpsdk.singleMode";
	/** ��������. */
	private static SDKConfig config;
	/** �����ļ�����. */
	private Properties properties;


	/**
	 * ��ȡconfig����.
	 * 
	 * @return
	 */
	public static SDKConfig getConfig() {
		if (null == config) {
			config = new SDKConfig();
		}
		return config;
	}

	/**
	 * ��properties�ļ�����
	 * 
	 * @param rootPath
	 *            �������ļ�����Ŀ¼.
	 */
	public void loadPropertiesFromPath(String rootPath) {
		if (StringUtils.isNotBlank(rootPath)) {
			File file = new File(rootPath + File.separator + FILE_NAME);
			InputStream in = null;
			if (file.exists()) {
				try {
					in = new FileInputStream(file);
					BufferedReader bf = new BufferedReader(
							new InputStreamReader(in, "utf-8"));
					properties = new Properties();
					properties.load(bf);
					loadProperties(properties);
				} catch (FileNotFoundException e) {
					LogUtil.writeErrorLog(e.getMessage(), e);
				} catch (IOException e) {
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
			} else {
				// ���ڴ�ʱ���ܻ�û�����LOG�ļ��أ���˲��ñ�׼�������ӡ��־��Ϣ
				System.out.println(rootPath + FILE_NAME + "������,���ز���ʧ��");
			}
		} else {
			loadPropertiesFromSrc();
		}

	}

	/**
	 * ��classpath·���¼������ò���
	 */
	public void loadPropertiesFromSrc() {
		InputStream in = null;
		try {
			// Properties pro = null;
			LogUtil.writeLog("��classpath: " +SDKConfig.class.getClassLoader().getResource("").getPath()+" ��ȡ�����ļ�"+FILE_NAME);
			in = SDKConfig.class.getClassLoader()
					.getResourceAsStream(FILE_NAME);
			if (null != in) {
				BufferedReader bf = new BufferedReader(new InputStreamReader(
						in, "utf-8"));
				properties = new Properties();
				try {
					properties.load(bf);
				} catch (IOException e) {
					throw e;
				}
			} else {
				LogUtil.writeErrorLog(FILE_NAME + "�����ļ�δ����classpathָ����Ŀ¼�� "+SDKConfig.class.getClassLoader().getResource("").getPath()+" �ҵ�!");
				return;
			}
			loadProperties(properties);
		} catch (IOException e) {
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
	}

	/**
	 * ���ݴ���� {@link #load(java.util.Properties)}�����������ò���
	 * 
	 * @param pro
	 */
	public void loadProperties(Properties pro) {
		LogUtil.writeLog("��ʼ�������ļ��м���������");
		String value = null;
		value = pro.getProperty(SDK_SINGLEMODE);
		if (SDKUtil.isEmpty(value) || SDKConstants.TRUE_STRING.equals(value)) {
			this.singleMode = SDKConstants.TRUE_STRING;
			LogUtil.writeLog("��֤��ģʽ��ʹ�������ļ����õ�˽Կǩ��֤�飬SingleCertMode:[" + this.singleMode + "]");
			// ��֤��ģʽ
			value = pro.getProperty(SDK_SIGNCERT_PATH);
			
			if (!SDKUtil.isEmpty(value)) {
				this.signCertPath = value.trim();
				LogUtil.writeLog("�����˽Կǩ��֤��·��==>"+SDK_SIGNCERT_PATH +"==>"+ value+" �Ѽ���");
			}
			value = pro.getProperty(SDK_SIGNCERT_PWD);
			if (!SDKUtil.isEmpty(value)) {
				this.signCertPwd = value.trim();
				LogUtil.writeLog("�����˽Կǩ��֤������==>"+SDK_SIGNCERT_PWD +" �Ѽ���");
			}
			value = pro.getProperty(SDK_SIGNCERT_TYPE);
			if (!SDKUtil.isEmpty(value)) {
				this.signCertType = value.trim();
				LogUtil.writeLog("�����˽Կǩ��֤������==>"+SDK_SIGNCERT_TYPE +"==>"+ value+" �Ѽ���");
			}
		} else {
			// ��֤��ģʽ
			this.singleMode = SDKConstants.FALSE_STRING;
			LogUtil.writeLog("��֤��ģʽ������Ҫ���������ļ������õ�˽Կǩ��֤�飬SingleMode:[" + this.singleMode + "]");
		}
		value = pro.getProperty(SDK_ENCRYPTCERT_PATH);
		if (!SDKUtil.isEmpty(value)) {
			this.encryptCertPath = value.trim();
			LogUtil.writeLog("�����������Ϣ����֤��==>"+SDK_ENCRYPTCERT_PATH +"==>"+ value+" �Ѽ���");
		}
		value = pro.getProperty(SDK_VALIDATECERT_DIR);
		if (!SDKUtil.isEmpty(value)) {
			this.validateCertDir = value.trim();
			LogUtil.writeLog("�������֤ǩ��֤��·��(�������õ���Ŀ¼����Ҫָ������Կ�ļ�)==>"+SDK_VALIDATECERT_DIR +"==>"+ value+" �Ѽ���");
		}
		value = pro.getProperty(SDK_FRONT_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.frontRequestUrl = value.trim();
		}
		value = pro.getProperty(SDK_BACK_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.backRequestUrl = value.trim();
		}
		value = pro.getProperty(SDK_BATQ_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.batchQueryUrl = value.trim();
		}
		value = pro.getProperty(SDK_BATTRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.batchTransUrl = value.trim();
		}
		value = pro.getProperty(SDK_FILETRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.fileTransUrl = value.trim();
		}
		value = pro.getProperty(SDK_SIGNQ_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.singleQueryUrl = value.trim();
		}
		value = pro.getProperty(SDK_CARD_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.cardRequestUrl = value.trim();
		}
		value = pro.getProperty(SDK_APP_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.appRequestUrl = value.trim();
		}
		value = pro.getProperty(SDK_ENCRYPTTRACKCERT_PATH);
		if (!SDKUtil.isEmpty(value)) {
			this.encryptTrackCertPath = value.trim();
		}
		
		/**�ɷѲ���**/
		value = pro.getProperty(JF_SDK_FRONT_TRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.jfFrontRequestUrl = value.trim();
		}

		value = pro.getProperty(JF_SDK_BACK_TRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.jfBackRequestUrl = value.trim();
		}
		
		value = pro.getProperty(JF_SDK_SINGLE_QUERY_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.jfSingleQueryUrl = value.trim();
		}
		
		value = pro.getProperty(JF_SDK_CARD_TRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.jfCardRequestUrl = value.trim();
		}
		
		value = pro.getProperty(JF_SDK_APP_TRANS_URL);
		if (!SDKUtil.isEmpty(value)) {
			this.jfAppRequestUrl = value.trim();
		}
		
		value = pro.getProperty(SDK_ENCRYPTTRACKKEY_EXPONENT);
		if (!SDKUtil.isEmpty(value)) {
			this.encryptTrackKeyExponent = value.trim();
		}

		value = pro.getProperty(SDK_ENCRYPTTRACKKEY_MODULUS);
		if (!SDKUtil.isEmpty(value)) {
			this.encryptTrackKeyModulus = value.trim();
		}
	}


	public String getFrontRequestUrl() {
		return frontRequestUrl;
	}

	public void setFrontRequestUrl(String frontRequestUrl) {
		this.frontRequestUrl = frontRequestUrl;
	}

	public String getBackRequestUrl() {
		return backRequestUrl;
	}

	public void setBackRequestUrl(String backRequestUrl) {
		this.backRequestUrl = backRequestUrl;
	}

	public String getSignCertPath() {
		return signCertPath;
	}

	public void setSignCertPath(String signCertPath) {
		this.signCertPath = signCertPath;
	}

	public String getSignCertPwd() {
		return signCertPwd;
	}

	public void setSignCertPwd(String signCertPwd) {
		this.signCertPwd = signCertPwd;
	}

	public String getSignCertType() {
		return signCertType;
	}

	public void setSignCertType(String signCertType) {
		this.signCertType = signCertType;
	}

	public String getEncryptCertPath() {
		return encryptCertPath;
	}

	public void setEncryptCertPath(String encryptCertPath) {
		this.encryptCertPath = encryptCertPath;
	}
	
	public String getValidateCertDir() {
		return validateCertDir;
	}

	public void setValidateCertDir(String validateCertDir) {
		this.validateCertDir = validateCertDir;
	}

	public String getSingleQueryUrl() {
		return singleQueryUrl;
	}

	public void setSingleQueryUrl(String singleQueryUrl) {
		this.singleQueryUrl = singleQueryUrl;
	}

	public String getBatchQueryUrl() {
		return batchQueryUrl;
	}

	public void setBatchQueryUrl(String batchQueryUrl) {
		this.batchQueryUrl = batchQueryUrl;
	}

	public String getBatchTransUrl() {
		return batchTransUrl;
	}

	public void setBatchTransUrl(String batchTransUrl) {
		this.batchTransUrl = batchTransUrl;
	}

	public String getFileTransUrl() {
		return fileTransUrl;
	}

	public void setFileTransUrl(String fileTransUrl) {
		this.fileTransUrl = fileTransUrl;
	}

	public String getSignCertDir() {
		return signCertDir;
	}

	public void setSignCertDir(String signCertDir) {
		this.signCertDir = signCertDir;
	}

	public Properties getProperties() {
		return properties;
	}

	public void setProperties(Properties properties) {
		this.properties = properties;
	}

	public String getCardRequestUrl() {
		return cardRequestUrl;
	}

	public void setCardRequestUrl(String cardRequestUrl) {
		this.cardRequestUrl = cardRequestUrl;
	}

	public String getAppRequestUrl() {
		return appRequestUrl;
	}

	public void setAppRequestUrl(String appRequestUrl) {
		this.appRequestUrl = appRequestUrl;
	}
	
	public String getEncryptTrackCertPath() {
		return encryptTrackCertPath;
	}

	public void setEncryptTrackCertPath(String encryptTrackCertPath) {
		this.encryptTrackCertPath = encryptTrackCertPath;
	}
	
	public String getJfFrontRequestUrl() {
		return jfFrontRequestUrl;
	}

	public void setJfFrontRequestUrl(String jfFrontRequestUrl) {
		this.jfFrontRequestUrl = jfFrontRequestUrl;
	}

	public String getJfBackRequestUrl() {
		return jfBackRequestUrl;
	}

	public void setJfBackRequestUrl(String jfBackRequestUrl) {
		this.jfBackRequestUrl = jfBackRequestUrl;
	}

	public String getJfSingleQueryUrl() {
		return jfSingleQueryUrl;
	}

	public void setJfSingleQueryUrl(String jfSingleQueryUrl) {
		this.jfSingleQueryUrl = jfSingleQueryUrl;
	}

	public String getJfCardRequestUrl() {
		return jfCardRequestUrl;
	}

	public void setJfCardRequestUrl(String jfCardRequestUrl) {
		this.jfCardRequestUrl = jfCardRequestUrl;
	}

	public String getJfAppRequestUrl() {
		return jfAppRequestUrl;
	}

	public void setJfAppRequestUrl(String jfAppRequestUrl) {
		this.jfAppRequestUrl = jfAppRequestUrl;
	}

	public String getSingleMode() {
		return singleMode;
	}

	public void setSingleMode(String singleMode) {
		this.singleMode = singleMode;
	}

	public SDKConfig() {
		super();
	}

	public String getEncryptTrackKeyExponent() {
		return encryptTrackKeyExponent;
	}

	public void setEncryptTrackKeyExponent(String encryptTrackKeyExponent) {
		this.encryptTrackKeyExponent = encryptTrackKeyExponent;
	}

	public String getEncryptTrackKeyModulus() {
		return encryptTrackKeyModulus;
	}

	public void setEncryptTrackKeyModulus(String encryptTrackKeyModulus) {
		this.encryptTrackKeyModulus = encryptTrackKeyModulus;
	}



}
