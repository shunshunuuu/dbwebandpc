package com.thinkive.project.util;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.tbservice.constant.ErrorEnum;


/**
 * @author HUANGRONALDO
 * 重新组装加密工具类
 * RSA加密  encryptData(String content)
 * RSA解密  decryptData(String content)
 * 
 * DES加密  DESEncryptData(String content)
 * DES解密  DESDecryptData(String content)
 * 
 */
public class SecurityHelper
{
	
	private static Logger logger = Logger.getLogger(SecurityHelper.class);
	
	private static String secretBusKey = Configuration.getString("system.secretBusKey") ;
	
	/**
	 * RSA加密
	 */
	private static final String RSA_ENCRYPT_FUNCNO = "10000";
	
	/**
	 * RSA解密
	 */
	private static final String RSA_DECRYPT_FUNCNO = "10001";
	
	/**
	 * DES加密
	 */
	private static final String DES_ENCRYPT_FUNCNO = "10003";
	
	/**
	 * DES解密
	 */
	private static final String DES_DECRYPT_FUNCNO = "10004";
	
	/**
	 * 描述：RSA加密 作者：李建 lijian@thinkive.com 时间：Apr 16, 2010 2:41:08 PM
	 * 
	 * @param content
	 *            需要加密的内容
	 * @return
	 */
	public static String encryptData(String content)
	{
		return getSecurityContent(RSA_ENCRYPT_FUNCNO, content);
	}
	
	/**
	 * 描述：RSA加密 作者：李建 lijian@thinkive.com 时间：Apr 16, 2010 2:41:08 PM
	 * 
	 * @param content
	 *            需要加密的内容
	 * @return
	 */
	public static String encryptDataDouble(String content)
	{
		String encrypt = getSecurityContent(RSA_ENCRYPT_FUNCNO, content);
		String data = decryptData(encrypt) ;
		//判断加密之后，解密出来的结果是否正确再确认返回该加密串，防止有时候加密错误，出现乱码 Add by huangsz
		if(data.equalsIgnoreCase(content)){
			return encrypt;
		}else{
			return encryptDataDouble(content);
		}
	}
	
	/**
	 * 描述：RSA解密 作者：李建 lijian@thinkive.com 时间：Apr 16, 2010 2:41:20 PM
	 * 
	 * @param content
	 *            需要解密的内容
	 * @return
	 */
	public static String decryptData(String content)
	{
		return getSecurityContent(RSA_DECRYPT_FUNCNO, content);
	}
	
	/**
	 * 描述：DES加密 作者：李建 lijian@thinkive.com 时间：Apr 16, 2010 2:41:20 PM
	 * 
	 * @param content
	 *            需要加密的内容
	 * @return
	 */
	public static String DESEncryptData(String content)
	{
		return getSecurityContent(DES_ENCRYPT_FUNCNO, content);
	}
	
	/**
	 * 描述：DES解密 作者：李建 lijian@thinkive.com 时间：Apr 16, 2010 2:41:20 PM
	 * 
	 * @param content
	 *            需要解密的内容
	 * @return
	 */
	public static String DESDecryptData(String content)
	{
		return getSecurityContent(DES_DECRYPT_FUNCNO, content);
	}
	
	private static String getSecurityContent(String funcno, String content)
	{
		if (StringHelper.isEmpty(funcno) || StringHelper.isEmpty(content))
		{
			logger.error("funcno 和 content 的值不能为空！");
			return content;
		}
		DataRow data = new DataRow() ;
		data.put("data", content);
		data.put("funcno", funcno);
		int funcNo = Integer.parseInt(funcno) ;
		Result result = BusClientUtil.invoke(funcNo, data, secretBusKey) ;
		if (result != null && result.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
		{
			DataRow dataR = result.getData();
			content = dataR.getString("result") ;
		}
		return content;
	}
	
	/**
	 * 描述：SSO测试
	 * 作者:xulin xulin@thinkive.com 
	 * 时间：Aus 21, 2010 11:04:20 PM
	 * @param keyType 加密方式:des或rsa
	 * @param operate 加密操作:encry加密,decry解密,""加解密同时进行
	 * @param content 待处理的字符串
	 * @return
	 */
	public static String testSSO(String keyType, String operate, String content)
	{
		long start = 0;
		long end = 0;
		String result = "";
		
		//RSA方式处理
		if ("RSA".equals(keyType.toUpperCase()))
		{
			if ("ENCRY".equals(operate.toUpperCase()))
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					SecurityHelper.encryptData(content);
				}
				
				end = System.currentTimeMillis();
				
				result = "RSA方式加密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
			else if ("DECRY".equals(operate.toUpperCase()))
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					SecurityHelper.decryptData(content);
				}
				
				end = System.currentTimeMillis();
				
				result = "RSA方式解密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
			else
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					String temp = SecurityHelper.encryptData(content);
					SecurityHelper.decryptData(temp);
				}
				
				end = System.currentTimeMillis();
				
				result = "RSA方式加解密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
			
		}
		//DES方式处理
		else if ("DES".equals(keyType.toUpperCase()))
		{
			if ("ENCRY".equals(operate.toUpperCase()))
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					SecurityHelper.DESEncryptData(content);
				}
				
				end = System.currentTimeMillis();
				
				result = "DES方式加密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
			else if ("DECRY".equals(operate.toUpperCase()))
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					SecurityHelper.DESDecryptData(content);
				}
				
				end = System.currentTimeMillis();
				
				result = "DES方式解密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
			else
			{
				start = System.currentTimeMillis();
				
				for (int i = 0; i <= 10000; i++)
				{
					String temp = SecurityHelper.DESEncryptData(content);
					SecurityHelper.DESDecryptData(temp);
				}
				
				end = System.currentTimeMillis();
				
				result = "DES方式加解密1万次长度为" + content.length() + "执行时间共计: " + (end - start) + "毫秒";
			}
		}
		else
		{
			result = "第一个参数keyType只能为rsa或des,请检查参数值的正确性";
		}
		
		return result;
	}
	
	public static void main(String[] args)
	{
		String content = "wrrt354588$%%&*!!~~$";
		String entryContent = SecurityHelper.encryptData(content);
		String desEntryContent = SecurityHelper.DESEncryptData(content);
		System.out.println("测试结果1: "+SecurityHelper.testSSO("rsa", "encry", content));
		System.out.println("测试结果2: "+SecurityHelper.testSSO("rsa", "decry", entryContent));
		System.out.println("测试结果3: "+SecurityHelper.testSSO("des", "encry", content));
		System.out.println("测试结果4: "+SecurityHelper.testSSO("des", "decry", desEntryContent));
	}
}
