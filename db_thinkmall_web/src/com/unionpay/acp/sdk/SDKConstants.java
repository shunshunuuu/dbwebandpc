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
 *   xshu       2014-05-28       MPI�������������
 * =============================================================================
 */
package com.unionpay.acp.sdk;

public class SDKConstants {

	public final static String COLUMN_DEFAULT = "-";

	public final static String KEY_DELIMITER = "#";

	/** memeber variable: blank. */
	public static final String BLANK = "";

	/** member variabel: space. */
	public static final String SPACE = " ";

	/** memeber variable: unline. */
	public static final String UNLINE = "_";

	/** memeber varibale: star. */
	public static final String STAR = "*";

	/** memeber variable: line. */
	public static final String LINE = "-";

	/** memeber variable: add. */
	public static final String ADD = "+";

	/** memeber variable: colon. */
	public final static String COLON = "|";

	/** memeber variable: point. */
	public final static String POINT = ".";

	/** memeber variable: comma. */
	public final static String COMMA = ",";

	/** memeber variable: slash. */
	public final static String SLASH = "/";

	/** memeber variable: div. */
	public final static String DIV = "/";

	/** memeber variable: left . */
	public final static String LB = "(";

	/** memeber variable: right. */
	public final static String RB = ")";

	/** memeber variable: rmb. */
	public final static String CUR_RMB = "RMB";

	/** memeber variable: .page size */
	public static final int PAGE_SIZE = 10;

	/** memeber variable: String ONE. */
	public static final String ONE = "1";

	/** memeber variable: String ZERO. */
	public static final String ZERO = "0";

	/** memeber variable: number six. */
	public static final int NUM_SIX = 6;

	/** memeber variable: equal mark. */
	public static final String EQUAL = "=";

	/** memeber variable: operation ne. */
	public static final String NE = "!=";

	/** memeber variable: operation le. */
	public static final String LE = "<=";

	/** memeber variable: operation ge. */
	public static final String GE = ">=";

	/** memeber variable: operation lt. */
	public static final String LT = "<";

	/** memeber variable: operation gt. */
	public static final String GT = ">";

	/** memeber variable: list separator. */
	public static final String SEP = "./";

	/** memeber variable: Y. */
	public static final String Y = "Y";

	/** memeber variable: AMPERSAND. */
	public static final String AMPERSAND = "&";

	/** memeber variable: SQL_LIKE_TAG. */
	public static final String SQL_LIKE_TAG = "%";

	/** memeber variable: @. */
	public static final String MAIL = "@";

	/** memeber variable: number zero. */
	public static final int NZERO = 0;

	public static final String LEFT_BRACE = "{";

	public static final String RIGHT_BRACE = "}";

	/** memeber variable: string true. */
	public static final String TRUE_STRING = "true";
	/** memeber variable: string false. */
	public static final String FALSE_STRING = "false";

	/** memeber variable: forward success. */
	public static final String SUCCESS = "success";
	/** memeber variable: forward fail. */
	public static final String FAIL = "fail";
	/** memeber variable: global forward success. */
	public static final String GLOBAL_SUCCESS = "$success";
	/** memeber variable: global forward fail. */
	public static final String GLOBAL_FAIL = "$fail";

	public static final String UTF_8_ENCODING = "UTF-8";
	public static final String GBK_ENCODING = "GBK";
	public static final String CONTENT_TYPE = "Content-type";
	public static final String APP_XML_TYPE = "application/xml;charset=utf-8";
	public static final String APP_FORM_TYPE = "application/x-www-form-urlencoded;charset=";

	/******************************************** 5.0���Ľӿڶ��� ********************************************/
	/** �汾��. */
	public static final String param_version = "version";
	/** ֤��ID. */
	public static final String param_certId = "certId";
	/** ǩ��. */
	public static final String param_signature = "signature";
	/** ���뷽ʽ. */
	public static final String param_encoding = "encoding";
	/** ��������. */
	public static final String param_txnType = "txnType";
	/** ��������. */
	public static final String param_txnSubType = "txnSubType";
	/** ҵ������. */
	public static final String param_bizType = "bizType";
	/** ǰ̨֪ͨ��ַ . */
	public static final String param_frontUrl = "frontUrl";
	/** ��̨֪ͨ��ַ. */
	public static final String param_backUrl = "backUrl";
	/** ��������. */
	public static final String param_accessType = "accessType";
	/** �յ���������. */
	public static final String param_acqInsCode = "acqInsCode";
	/** �̻����. */
	public static final String param_merCatCode = "merCatCode";
	/** �̻�����. */
	public static final String param_merType = "merType";
	/** �̻�����. */
	public static final String param_merId = "merId";
	/** �̻�����. */
	public static final String param_merName = "merName";
	/** �̻����. */
	public static final String param_merAbbr = "merAbbr";
	/** �����̻�����. */
	public static final String param_subMerId = "subMerId";
	/** �����̻�����. */
	public static final String param_subMerName = "subMerName";
	/** �����̻����. */
	public static final String param_subMerAbbr = "subMerAbbr";
	/** Cupsecure �̻�����. */
	public static final String param_csMerId = "csMerId";
	/** �̻�������. */
	public static final String param_orderId = "orderId";
	/** ����ʱ��. */
	public static final String param_txnTime = "txnTime";
	/** ����ʱ��. */
	public static final String param_txnSendTime = "txnSendTime";
	/** ������ʱʱ����. */
	public static final String param_orderTimeoutInterval = "orderTimeoutInterval";
	/** ֧����ʱʱ��. */
	public static final String param_payTimeoutTime = "payTimeoutTime";
	/** Ĭ��֧����ʽ. */
	public static final String param_defaultPayType = "defaultPayType";
	/** ֧��֧����ʽ. */
	public static final String param_supPayType = "supPayType";
	/** ֧����ʽ. */
	public static final String param_payType = "payType";
	/** �Զ���֧����ʽ. */
	public static final String param_customPayType = "customPayType";
	/** ������ʶ. */
	public static final String param_shippingFlag = "shippingFlag";
	/** �ջ���ַ-����. */
	public static final String param_shippingCountryCode = "shippingCountryCode";
	/** �ջ���ַ-ʡ. */
	public static final String param_shippingProvinceCode = "shippingProvinceCode";
	/** �ջ���ַ-��. */
	public static final String param_shippingCityCode = "shippingCityCode";
	/** �ջ���ַ-����. */
	public static final String param_shippingDistrictCode = "shippingDistrictCode";
	/** �ջ���ַ-��ϸ. */
	public static final String param_shippingStreet = "shippingStreet";
	/** ��Ʒ����. */
	public static final String param_commodityCategory = "commodityCategory";
	/** ��Ʒ����. */
	public static final String param_commodityName = "commodityName";
	/** ��ƷURL. */
	public static final String param_commodityUrl = "commodityUrl";
	/** ��Ʒ����. */
	public static final String param_commodityUnitPrice = "commodityUnitPrice";
	/** ��Ʒ����. */
	public static final String param_commodityQty = "commodityQty";
	/** �Ƿ�Ԥ��Ȩ. */
	public static final String param_isPreAuth = "isPreAuth";
	/** ����. */
	public static final String param_currencyCode = "currencyCode";
	/** �˻�����. */
	public static final String param_accType = "accType";
	/** �˺�. */
	public static final String param_accNo = "accNo";
	/** ֧��������. */
	public static final String param_payCardType = "payCardType";
	/** ������������. */
	public static final String param_issInsCode = "issInsCode";
	/** �ֿ�����Ϣ. */
	public static final String param_customerInfo = "customerInfo";
	/** ���׽��. */
	public static final String param_txnAmt = "txnAmt";
	/** ���. */
	public static final String param_balance = "balance";
	/** ��������. */
	public static final String param_districtCode = "districtCode";
	/** ���ӵ�������. */
	public static final String param_additionalDistrictCode = "additionalDistrictCode";
	/** �˵�����. */
	public static final String param_billType = "billType";
	/** �˵�����. */
	public static final String param_billNo = "billNo";
	/** �˵��·�. */
	public static final String param_billMonth = "billMonth";
	/** �˵���ѯҪ��. */
	public static final String param_billQueryInfo = "billQueryInfo";
	/** �˵�����. */
	public static final String param_billDetailInfo = "billDetailInfo";
	/** �˵����. */
	public static final String param_billAmt = "billAmt";
	/** �˵�������. */
	public static final String param_billAmtSign = "billAmtSign";
	/** �󶨱�ʶ��. */
	public static final String param_bindId = "bindId";
	/** ���ռ���. */
	public static final String param_riskLevel = "riskLevel";
	/** ����Ϣ����. */
	public static final String param_bindInfoQty = "bindInfoQty";
	/** ����Ϣ��. */
	public static final String param_bindInfoList = "bindInfoList";
	/** ���κ�. */
	public static final String param_batchNo = "batchNo";
	/** �ܱ���. */
	public static final String param_totalQty = "totalQty";
	/** �ܽ��. */
	public static final String param_totalAmt = "totalAmt";
	/** �ļ�����. */
	public static final String param_fileType = "fileType";
	/** �ļ�����. */
	public static final String param_fileName = "fileName";
	/** �����ļ�����. */
	public static final String param_fileContent = "fileContent";
	/** �̻�ժҪ. */
	public static final String param_merNote = "merNote";
	/** �̻��Զ�����. */
	// public static final String param_merReserved = "merReserved";//�ӿڱ��ɾ��
	/** ���󷽱�����. */
	public static final String param_reqReserved = "reqReserved";// �����ӿ�
	/** ������. */
	public static final String param_reserved = "reserved";
	/** �ն˺�. */
	public static final String param_termId = "termId";
	/** �ն�����. */
	public static final String param_termType = "termType";
	/** ����ģʽ. */
	public static final String param_interactMode = "interactMode";
	/** ��������ʶ��ģʽ. */
	// public static final String param_recognitionMode = "recognitionMode";
	public static final String param_issuerIdentifyMode = "issuerIdentifyMode";// �ӿ����Ʊ��
	/** �̻����û���. */
	public static final String param_merUserId = "merUserId";
	/** �ֿ���IP. */
	public static final String param_customerIp = "customerIp";
	/** ��ѯ��ˮ��. */
	public static final String param_queryId = "queryId";
	/** ԭ���ײ�ѯ��ˮ��. */
	public static final String param_origQryId = "origQryId";
	/** ϵͳ���ٺ�. */
	public static final String param_traceNo = "traceNo";
	/** ���״���ʱ��. */
	public static final String param_traceTime = "traceTime";
	/** ��������. */
	public static final String param_settleDate = "settleDate";
	/** �������. */
	public static final String param_settleCurrencyCode = "settleCurrencyCode";
	/** ������. */
	public static final String param_settleAmt = "settleAmt";
	/** �������. */
	public static final String param_exchangeRate = "exchangeRate";
	/** �һ�����. */
	public static final String param_exchangeDate = "exchangeDate";
	/** ��Ӧʱ��. */
	public static final String param_respTime = "respTime";
	/** ԭ����Ӧ����. */
	public static final String param_origRespCode = "origRespCode";
	/** ԭ����Ӧ����Ϣ. */
	public static final String param_origRespMsg = "origRespMsg";
	/** Ӧ����. */
	public static final String param_respCode = "respCode";
	/** Ӧ������Ϣ. */
	public static final String param_respMsg = "respMsg";
	// �����ĸ������ֶ�merUserRegDt merUserEmail checkFlag activateStatus
	/** �̻����û�ע��ʱ��. */
	public static final String param_merUserRegDt = "merUserRegDt";
	/** �̻����û�ע������. */
	public static final String param_merUserEmail = "merUserEmail";
	/** ��֤��ʶ. */
	public static final String param_checkFlag = "checkFlag";
	/** ��ͨ״̬. */
	public static final String param_activateStatus = "activateStatus";
	/** ����֤��ID. */
	public static final String param_encryptCertId = "encryptCertId";
	/** �û�MAC��IMEI���š�SSID. */
	public static final String param_userMac = "userMac";
	/** ��������. */
	// public static final String param_relationTxnType = "relationTxnType";
	/** �������� */
	public static final String param_smsType = "smsType";

	/** �����Ϣ�� */
	public static final String param_riskCtrlInfo = "riskCtrlInfo";

	/** IC��������Ϣ�� */
	public static final String param_ICTransData = "ICTransData";

	/** VPC������Ϣ�� */
	public static final String param_VPCTransData = "VPCTransData";

	/** ��ȫ���� */
	public static final String param_securityType = "securityType";

	/** ���������� */
	public static final String param_tn = "tn";

	/** ���ڸ����������� */
	public static final String param_instalRate = "instalRate";

	/** ���ڸ����������� */
	public static final String param_mchntFeeSubsidy = "mchntFeeSubsidy";

	
}
