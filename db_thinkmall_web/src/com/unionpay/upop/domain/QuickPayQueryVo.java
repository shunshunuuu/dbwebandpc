package com.unionpay.upop.domain;


public class QuickPayQueryVo
{
	private String transType ;
	private String orderNumber ;
	private String orderTime ;
	
	public String getTransType()
	{
		return transType;
	}
	
	public void setTransType(String transType)
	{
		this.transType = transType;
	}
	
	public String getOrderNumber()
	{
		return orderNumber;
	}
	
	public void setOrderNumber(String orderNumber)
	{
		this.orderNumber = orderNumber;
	}
	
	public String getOrderTime()
	{
		return orderTime;
	}
	
	public void setOrderTime(String orderTime)
	{
		this.orderTime = orderTime;
	}
	
}
