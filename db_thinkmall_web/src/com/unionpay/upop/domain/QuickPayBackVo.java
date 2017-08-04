package com.unionpay.upop.domain;

/**
 * 描述: 退货VO
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 26, 2014 
 * 创建时间: 3:10:04 PM
 */
public class QuickPayBackVo
{
	
	private String transType;//交易类型
	
	private String orderQid;//原始交易流水号-银联返回
	
	private String signType; //加密方式
	
	
	public String getTransType()
	{
		return transType;
	}

	
	public void setTransType(String transType)
	{
		this.transType = transType;
	}

	
	public String getOrderQid()
	{
		return orderQid;
	}

	
	public void setOrderQid(String orderQid)
	{
		this.orderQid = orderQid;
	}

	
	public String getSignType()
	{
		return signType;
	}

	
	public void setSignType(String signType)
	{
		this.signType = signType;
	}

	
	public String getProductUrl()
	{
		return productUrl;
	}

	
	public void setProductUrl(String productUrl)
	{
		this.productUrl = productUrl;
	}

	
	public String getProductName()
	{
		return productName;
	}

	
	public void setProductName(String productName)
	{
		this.productName = productName;
	}

	
	public String getPrice()
	{
		return price;
	}

	
	public void setPrice(String price)
	{
		this.price = price;
	}

	
	public String getAmount()
	{
		return amount;
	}

	
	public void setAmount(String amount)
	{
		this.amount = amount;
	}

	
	public String getTotalAmount()
	{
		return totalAmount;
	}

	
	public void setTotalAmount(String totalAmount)
	{
		this.totalAmount = totalAmount;
	}

	
	public String getOrderNo()
	{
		return orderNo;
	}

	
	public void setOrderNo(String orderNo)
	{
		this.orderNo = orderNo;
	}

	
	public String getOrderTime()
	{
		return orderTime;
	}

	
	public void setOrderTime(String orderTime)
	{
		this.orderTime = orderTime;
	}

	
	public String getUserName()
	{
		return userName;
	}

	
	public void setUserName(String userName)
	{
		this.userName = userName;
	}

	
	public String getIp()
	{
		return ip;
	}

	
	public void setIp(String ip)
	{
		this.ip = ip;
	}

	
	public String getDiscount()
	{
		return discount;
	}

	
	public void setDiscount(String discount)
	{
		this.discount = discount;
	}

	
	public String getFreight()
	{
		return freight;
	}

	
	public void setFreight(String freight)
	{
		this.freight = freight;
	}

	private String productUrl; //商品Url
	
	private String productName; //产品名称
	
	private String price;//产品单价（分）
	
	private String amount; //交易数量
	
	private String totalAmount; //交易金额（分）
	
	private String orderNo;//交易单号
	
	private String orderTime; //订单时间
	
	private String userName; // 用户真实姓名
	
	private String ip; //ip
	
	private String discount; //折扣 （分）
	
	private String freight; //运费 （分）
	
	
}
