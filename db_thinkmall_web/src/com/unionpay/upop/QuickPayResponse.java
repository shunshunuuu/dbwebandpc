package com.unionpay.upop;

import java.io.UnsupportedEncodingException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.thinkive.base.jdbc.DataRow;

/**
 * 描述: 银联支付接口-应答
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 20, 2014 
 * 创建时间: 4:53:36 PM
 */

public class QuickPayResponse
{
	private static Logger logger = Logger.getLogger(QuickPayResponse.class);
	
	/**
	 * 向银联发送支付数据封装
	 * @param transType
	 * @param orderNumber
	 * @param orderTime
	 * @return
	 */
	public DataRow quickPayRes(HttpServletRequest request, HttpServletResponse response)
	{
		try
		{
			request.setCharacterEncoding(QuickPayConf.charset);
		}
		catch (UnsupportedEncodingException e)
		{
			e.printStackTrace();
		}
		
		DataRow dataRow = new DataRow();	
		for (int i = 0; i < QuickPayConf.notifyVo.length; i++)
		{
			dataRow.set(QuickPayConf.notifyVo[i], request.getParameter(QuickPayConf.notifyVo[i]));
		}
		logger.info("后台回调获取参数：" + dataRow);
		String signature = request.getParameter(QuickPayConf.signature);
		String signMethod = request.getParameter(QuickPayConf.signMethod);
		
		response.setContentType("text/html;charset=" + QuickPayConf.charset);
		response.setCharacterEncoding(QuickPayConf.charset);
		
		Boolean signatureCheck = new QuickPayUtils().checkSign(dataRow, signMethod, signature);
		dataRow.set("signatureCheck", signatureCheck);
		
		if (signatureCheck)
		{
			return dataRow;
		}
		else
		{
			dataRow.clear() ;
			return dataRow;
		}
	}
}
