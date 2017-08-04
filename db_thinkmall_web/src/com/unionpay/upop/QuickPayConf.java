package com.unionpay.upop;

import com.thinkive.base.config.Configuration;

/**
 * ���ƣ�֧��������
 * ���ܣ�������
 * �����ԣ�������
 * �汾��1.0
 * ���ڣ�2011-03-11
 * ���ߣ��й�����UPOP�Ŷ�
 * ��Ȩ���й�����
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���վ����Ҫ�����ռ����ĵ���д,����һ��Ҫʹ�øô��롣�ô�������ο���
 * */

public class QuickPayConf
{
	
	// �汾��
	public final static String version = Configuration.getString("upop.version");
	
	// ���뷽ʽ
	public final static String charset = Configuration.getString("upop.charset");
	
	// ������ַ���밴��Ӧ�����л���
	
	/* ǰ̨���ײ��Ի��� */
	private final static String UPOP_BASE_URL = Configuration.getString("upop.upop_base_url");
	
	/* ǰ̨����PM������׼���������� */
	//private final static String UPOP_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* ǰ̨������������ */
	//private final static String UPOP_BASE_URL = "https://unionpaysecure.com/api/";
	
	/* ��̨���ײ��Ի��� */
	private final static String UPOP_BSPAY_BASE_URL = Configuration.getString("upop.upop_bspay_base_url");
	
	/* ��̨����PM������׼���������� */
	//	private final static String UPOP_BSPAY_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* ��̨������������ */
	//private final static String UPOP_BSPAY_BASE_URL = "https://besvr.unionpaysecure.com/api/";
	
	/* ��ѯ���ײ��Ի��� */
	private final static String UPOP_QUERY_BASE_URL = Configuration.getString("upop.upop_query_base_url");
	
	/* ��ѯ����PM������׼���������� */
	//	private final static String UPOP_QUERY_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* ��ѯ������������ */
	//private final static String UPOP_QUERY_BASE_URL = "https://query.unionpaysecure.com/api/";
	
	// ֧����ַ
	public final static String gateWay = UPOP_BASE_URL + "Pay.action";
	
	// ����������ַ
	public final static String backStagegateWay = UPOP_BSPAY_BASE_URL + "BSPay.action";
	
	// ��ѯ��ַ
	public final static String queryUrl = UPOP_QUERY_BASE_URL + "Query.action";
	
	// ��֤֧��2.0��ַ
	public final static String authPayUrl = UPOP_BASE_URL + "AuthPay.action";
	
	// ��������ַ
	public final static String smsUrl = UPOP_BASE_URL + "Sms.action";
	
	// �̻�����
	public final static String merCode = Configuration.getString("upop.merCode");
	
	// �̻�����
	public final static String merName = Configuration.getString("upop.merName");
	
	//�����µ�ǰ̨�ص�URL
	public final static String merFrontEndUrl = Configuration.getString("upop.merFrontEndUrl"); 
	
	 //�����µ���̨�ص�URL
	public final static String merBackEndUrl = Configuration.getString("upop.merBackEndUrl");
	
	//�˿�ǰ̨�ص�URL
	public final static String refundFrontEndUrl = Configuration.getString("upop.refundFrontEndUrl");
	
	//�˿��̨�ص�URL
	public final static String refundBackEndUrl = Configuration.getString("upop.refundBackEndUrl");
	
	// ���ܷ�ʽMD5
	public final static String signType = Configuration.getString("upop.signType");
	
	// ���ܷ�ʽMD5
	public final static String signType_SHA1withRSA = Configuration.getString("upop.signType_SHA1withRSA");
	
	// �̳��ܳף���Ҫ�������̻���վ�����õ�һ��
	public final static String securityKey = Configuration.getString("upop.securityKey");
	
	// ǩ��
	public final static String signature = Configuration.getString("upop.signature");
	
	//���׳�ʱʱ��
	public final static String timeOut = Configuration.getString("upop.timeOut");
	
	//����
	public final static String currency = Configuration.getString("upop.currency");
	
	//�������ͣ�01 ֧��
	public final static String transTypePay = Configuration.getString("upop.transType_pay");
	
	//�������ͣ�04 �˿��˻�
	public final static String transTypeRefund = Configuration.getString("upop.transType_refund");
	
	
	public final static String signMethod = Configuration.getString("upop.signMethod");
	
	//��װ���������
	public final static String[] reqVo = new String[] { 
		"version", 
		"charset", 
		"transType", 
		"origQid", 
		"merId", 
		"merAbbr", 
		"acqCode", 
		"merCode", 
		"commodityUrl", 
		"commodityName", 
		"commodityUnitPrice",
		"commodityQuantity", 
		"commodityDiscount", 
		"transferFee", 
		"orderNumber", 
		"orderAmount", 
		"orderCurrency", 
		"orderTime", 
		"customerIp", 
		"customerName", 
		"defaultPayType", 
		"defaultBankNumber",
		"transTimeout", 
		"frontEndUrl", 
		"backEndUrl", 
		"merReserved"};
	
	public final static String[] notifyVo = new String[] { 
		"charset", 
		"cupReserved", 
		"exchangeDate",
		"exchangeRate", 
		"merAbbr",
		"merId", 
		"orderAmount",
		"orderCurrency", 
		"orderNumber", 
		"qid",
		"respCode", 
		"respMsg",
		"respTime", 
		"settleAmount", 
		"settleCurrency", 
		"settleDate",
		"traceNumber", 
		"traceTime",
		"transType",
		"version" };
	
	public final static String[] queryVo = new String[] { 
		"version",
		"charset", 
		"transType", 
		"merId", 
		"orderNumber", 
		"orderTime", 
		"merReserved" };
	
	public final static String[] smsVo = new String[] { 
		"version", 
		"charset", 
		"acqCode", 
		"merId", 
		"merAbbr", 
		"orderNumber",
		"orderAmount", 
		"orderCurrency",
		"merReserved" };
}
