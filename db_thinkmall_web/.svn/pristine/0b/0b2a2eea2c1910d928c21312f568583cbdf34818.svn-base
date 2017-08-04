package com.unionpay.upop;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import com.unionpay.upop.domain.QuickPayVo;

/**
 * 描述: 银联支付接口
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 20, 2014 
 * 创建时间: 4:53:36 PM
 */

public class QuickPay
{
	
	/**
	 * 向银联发送支付数据封装
	 * @param transType
	 * @param orderNumber
	 * @param orderTime
	 * @return
	 */
	public void payToHtml(QuickPayVo quickPayVo,HttpServletResponse response)
	{
		//商户需要组装如下对象的数据
		String[] valueVo = new String[] { QuickPayConf.version,//协议版本
				QuickPayConf.charset,//字符编码
				quickPayVo.getTransType(),//交易类型
				"",//原始交易流水号
				QuickPayConf.merCode,//商户代码
				QuickPayConf.merName,//商户简称
				"",//收单机构代码（仅收单机构接入需要填写）
				"",//商户类别（收单机构接入需要填写）
				quickPayVo.getProductUrl(),//商户产品URL
				quickPayVo.getProductName(),//商品名称
				quickPayVo.getPrice(),//商品单价 单位：分
				quickPayVo.getAmount(),//商品数量
				quickPayVo.getDiscount(),//折扣 单位：分
				quickPayVo.getFreight(),//运费 单位：分
				quickPayVo.getOrderNo(),//订单号（需要商户自己生成）
				quickPayVo.getTotalAmount(),//交易金额 单位：分
				QuickPayConf.currency,//交易币种
				quickPayVo.getOrderTime(),//交易时间
				quickPayVo.getIp(),//用户IP
				quickPayVo.getUserName(),//用户真实姓名
				"",//默认支付方式
				"",//默认银行编号
				QuickPayConf.timeOut,//交易超时时间
				QuickPayConf.merFrontEndUrl,// 前台回调商户URL
				QuickPayConf.merBackEndUrl,// 后台回调商户URL
				""//商户保留域
		};
		
		if (!QuickPayConf.signType_SHA1withRSA.equalsIgnoreCase(quickPayVo.getSignType()))
		{
			quickPayVo.setSignType(QuickPayConf.signType) ;
		}
		
		String html = new QuickPayUtils().createPayHtml(valueVo, quickPayVo.getSignType());//跳转到银联页面支付
		response.setContentType("text/html;charset="+QuickPayConf.charset);   
		response.setCharacterEncoding(QuickPayConf.charset);
		try {
			response.getWriter().write(html);
		} catch (IOException e) {
			
		}
	}
}
