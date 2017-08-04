package com.unionpay.upop;

import org.apache.log4j.Logger;

import com.unionpay.upop.domain.QuickPayBackVo;

/**
 * 描述: 银联支付接口-退货
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 26, 2014 
 * 创建时间: 4:53:36 PM
 */

public class QuickPayBack
{
	
	private static Logger logger = Logger.getLogger(QuickPayBack.class);
	
	/**
	 * 后续交易入口
	 * @param transType 交易类型
	 * @param orderNumber 商户订单号
	 * @param orderTime  商户订单时间
	 */
	public String refundTrans(QuickPayBackVo quickPayBackVo)
	{
		//商户需要组装如下对象的数据
		String[] valueVo = new String[] { 
				QuickPayConf.version,//协议版本
				QuickPayConf.charset,//字符编码
				quickPayBackVo.getTransType(),//交易类型
				quickPayBackVo.getOrderQid(),//原始交易流水号
				QuickPayConf.merCode,//商户代码
				QuickPayConf.merName,//商户简称
				"",//收单机构代码（仅收单机构接入需要填写）
				"",//商户类别（收单机构接入需要填写）
				quickPayBackVo.getProductUrl(),//商品URL
				quickPayBackVo.getProductName(),//商品名称
				quickPayBackVo.getPrice(),//商品单价 单位：分
				quickPayBackVo.getAmount(),//商品数量
				quickPayBackVo.getDiscount(),//折扣 单位：分
				quickPayBackVo.getFreight(),//运费 单位：分
				quickPayBackVo.getOrderNo(),//订单号（需要商户自己生成）
				quickPayBackVo.getTotalAmount(),//交易金额 单位：分
				QuickPayConf.currency,//交易币种
				quickPayBackVo.getOrderTime(),//交易时间
				quickPayBackVo.getIp(),//用户IP
				quickPayBackVo.getUserName(),//用户真实姓名
				"",//默认支付方式
				"",//默认银行编号
				QuickPayConf.timeOut,//交易超时时间
				QuickPayConf.refundFrontEndUrl,// 前台回调商户URL
				QuickPayConf.refundBackEndUrl,// 后台回调商户URL
				""//商户保留域
		};
		String result = "";
		String res = getUnionPaySyncRes(valueVo);
		if (res != null && !"".equals(res))
		{
			
			String[] arr = QuickPayUtils.getResArr(res);
			
			if (checkSecurity(arr))
			{//验证签名
				result = merBusiness(arr);//商户业务逻辑
			}
		}
		else
		{
			logger.info("报文格式为空");
		}
		return result;
	}
	
	/**
	 * 向银联发送后续交易请求
	 * @param transType
	 * @param orderNumber
	 * @param orderTime
	 * @return
	 */
	public String getUnionPaySyncRes(String[] valueVo)
	{
		QuickPayUtils quickPayUtils = new QuickPayUtils();
		return quickPayUtils.doPostQueryCmd(QuickPayConf.backStagegateWay, new QuickPayUtils().createBackStrForBackTrans(valueVo, QuickPayConf.reqVo));
		
	}
	
	//验证签名 
	public boolean checkSecurity(String[] arr)
	{
		//验证签名
		int checkedRes = new QuickPayUtils().checkSecurity(arr);
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
	
	// 商户的业务逻辑
	public String merBusiness(String[] arr)
	{
		
		// 以下是商户业务处理
		String result = "";
		for (int i = 0; i < arr.length; i++)
		{
			String[] resultArr = arr[i].split("=");
			// 处理商户业务逻辑
			if (resultArr.length >= 2 && "respCode".equals(resultArr[0]))
			{
				result = arr[i].substring(resultArr[0].length() + 1);
				break;
			}
		}
		if ("00".equals(result))
		{
			logger.info("银联开始受理请求，但是并不表示处理成功。交易类型为（01，31，04等）等成功后有后台通知发到报文的后台通知地址。交易类型71，商户自己发查询确定状态");
		}
		else if ("30".equals(result))
		{
			logger.info(result + ":报文格式错误");
		}
		else if ("94".equals(result))
		{
			logger.info(result + ":重复交易");
		}
		else if ("25".equals(result))
		{
			logger.info(result + ":查询原交易失败");
		}
		else if ("36".equals(result))
		{
			logger.info(result + ":交易金额超限");
		}
		else
		{
			logger.info(result + ":其他错误");
		}
		return result;
	}
}
