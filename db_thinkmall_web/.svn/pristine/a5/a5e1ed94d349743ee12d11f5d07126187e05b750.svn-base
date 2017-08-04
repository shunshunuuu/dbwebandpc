package com.unionpay.upop;

import org.apache.log4j.Logger;

import com.unionpay.upop.domain.QuickPayQueryVo;

/**
 * 描述: 银联支付接口
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 24, 2014 
 * 创建时间: 4:53:36 PM
 */

public class QuickPayQuery
{
	
	private static Logger logger = Logger.getLogger(QuickPayQuery.class);
	
	private QuickPayUtils quickPayUtils = new QuickPayUtils();
	
	/**
	 * 查询交易入口
	 * @param transType 交易类型
	 * @param orderNumber 商户订单号
	 * @param orderTime  商户订单时间
	 */
	public String queryTrans(QuickPayQueryVo quickPayQueryVo)
	{
		String res = query(quickPayQueryVo);
		if (res != null && !"".equals(res))
		{
			String[] arr = QuickPayUtils.getResArr(res);
			
			if (checkSecurity(arr))
			{//验证签名
				return merBusiness(arr);//商户业务逻辑
			}
		}
		else
		{
			logger.info("报文格式为空");
		}
		return "";
	}
	
	/**
	 * 向银联发送查询请求
	 * @param transType
	 * @param orderNumber
	 * @param orderTime
	 * @return
	 */
	public String query(QuickPayQueryVo quickPayQueryVo)
	{
		String[] valueVo = new String[] { QuickPayConf.version,//协议版本
				QuickPayConf.charset,//字符编码
				quickPayQueryVo.getTransType(),//交易类型
				QuickPayConf.merCode,//商户代码
				quickPayQueryVo.getOrderNumber(),//订单号
				quickPayQueryVo.getOrderTime(),//交易时间
				""//保留域  说明：如果是收单机构保留域需传收单代码如：{acqCode=00215800}，商户直接接入upop不传收单代码
		};
		
		return quickPayUtils.doPostQueryCmd(QuickPayConf.queryUrl, new QuickPayUtils().createBackStr(valueVo, QuickPayConf.queryVo));
		
	}
	
	//验证签名 
	public boolean checkSecurity(String[] arr)
	{
		//验证签名
		int checkedRes = quickPayUtils.checkSecurity(arr);
		if (checkedRes == 1)
		{
			return true;
		}
		else if (checkedRes == 0)
		{
			logger.info("验证签名失败");
			return false;
		}
		else if (checkedRes == 2)
		{
			logger.info("报文格式错误");
			return false;
		}
		return false;
	}
	
	//商户的业务逻辑
	public String merBusiness(String[] arr)
	{
		/**
		 * queryResult=0或者2时 respCode为00，其余情况下respCode为非全零的两位错误码
		 * queryResult为空时报文格式错误
		 * queryResult：
		 * 0：成功（响应码respCode为00）
		 * 1：失败（响应码respCode非00）
		 * 2：处理中（响应码respCode为00）
		 * 3：无此交易（响应码respCode非00）
		*/
		
		String queryResult = "";
		for (int i = 0; i < arr.length; i++)
		{
			String[] queryResultArr = arr[i].split("=");
			// 处理商户业务逻辑
			if (queryResultArr.length >= 2 && "queryResult".equals(queryResultArr[0]))
			{
				queryResult = arr[i].substring(queryResultArr[0].length() + 1);
				break;
			}
		}
		if (queryResult != "")
		{
			if ("0".equals(queryResult))
			{
				logger.info("交易成功");
			}
			if ("1".equals(queryResult))
			{
				logger.info("交易失败");
			}
			if ("2".equals(queryResult))
			{
				logger.info("交易处理中");
			}
			if ("3".equals(queryResult))
			{
				logger.info("无此交易");
			}
		}
		else
		{
			logger.info("报文格式错误");
		}
		return queryResult;
	}
}
