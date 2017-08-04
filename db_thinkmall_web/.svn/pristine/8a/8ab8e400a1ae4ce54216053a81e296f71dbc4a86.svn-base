package com.unionpay.upop;

import com.thinkive.base.config.Configuration;

/**
 * 名称：支付配置类
 * 功能：配置类
 * 类属性：公共类
 * 版本：1.0
 * 日期：2011-03-11
 * 作者：中国银联UPOP团队
 * 版权：中国银联
 * 说明：以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。该代码仅供参考。
 * */

public class QuickPayConf
{
	
	// 版本号
	public final static String version = Configuration.getString("upop.version");
	
	// 编码方式
	public final static String charset = Configuration.getString("upop.charset");
	
	// 基础网址（请按相应环境切换）
	
	/* 前台交易测试环境 */
	private final static String UPOP_BASE_URL = Configuration.getString("upop.upop_base_url");
	
	/* 前台交易PM环境（准生产环境） */
	//private final static String UPOP_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* 前台交易生产环境 */
	//private final static String UPOP_BASE_URL = "https://unionpaysecure.com/api/";
	
	/* 后台交易测试环境 */
	private final static String UPOP_BSPAY_BASE_URL = Configuration.getString("upop.upop_bspay_base_url");
	
	/* 后台交易PM环境（准生产环境） */
	//	private final static String UPOP_BSPAY_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* 后台交易生产环境 */
	//private final static String UPOP_BSPAY_BASE_URL = "https://besvr.unionpaysecure.com/api/";
	
	/* 查询交易测试环境 */
	private final static String UPOP_QUERY_BASE_URL = Configuration.getString("upop.upop_query_base_url");
	
	/* 查询交易PM环境（准生产环境） */
	//	private final static String UPOP_QUERY_BASE_URL = "https://www.epay.lxdns.com/UpopWeb/api/";
	
	/* 查询交易生产环境 */
	//private final static String UPOP_QUERY_BASE_URL = "https://query.unionpaysecure.com/api/";
	
	// 支付网址
	public final static String gateWay = UPOP_BASE_URL + "Pay.action";
	
	// 后续交易网址
	public final static String backStagegateWay = UPOP_BSPAY_BASE_URL + "BSPay.action";
	
	// 查询网址
	public final static String queryUrl = UPOP_QUERY_BASE_URL + "Query.action";
	
	// 认证支付2.0网址
	public final static String authPayUrl = UPOP_BASE_URL + "AuthPay.action";
	
	// 发短信网址
	public final static String smsUrl = UPOP_BASE_URL + "Sms.action";
	
	// 商户代码
	public final static String merCode = Configuration.getString("upop.merCode");
	
	// 商户名称
	public final static String merName = Configuration.getString("upop.merName");
	
	//交易下单前台回调URL
	public final static String merFrontEndUrl = Configuration.getString("upop.merFrontEndUrl"); 
	
	 //交易下单后台回调URL
	public final static String merBackEndUrl = Configuration.getString("upop.merBackEndUrl");
	
	//退款前台回调URL
	public final static String refundFrontEndUrl = Configuration.getString("upop.refundFrontEndUrl");
	
	//退款后台回调URL
	public final static String refundBackEndUrl = Configuration.getString("upop.refundBackEndUrl");
	
	// 加密方式MD5
	public final static String signType = Configuration.getString("upop.signType");
	
	// 加密方式MD5
	public final static String signType_SHA1withRSA = Configuration.getString("upop.signType_SHA1withRSA");
	
	// 商城密匙，需要和银联商户网站上配置的一样
	public final static String securityKey = Configuration.getString("upop.securityKey");
	
	// 签名
	public final static String signature = Configuration.getString("upop.signature");
	
	//交易超时时间
	public final static String timeOut = Configuration.getString("upop.timeOut");
	
	//币种
	public final static String currency = Configuration.getString("upop.currency");
	
	//交易类型：01 支付
	public final static String transTypePay = Configuration.getString("upop.transType_pay");
	
	//交易类型：04 退款退货
	public final static String transTypeRefund = Configuration.getString("upop.transType_refund");
	
	
	public final static String signMethod = Configuration.getString("upop.signMethod");
	
	//组装消费请求包
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
