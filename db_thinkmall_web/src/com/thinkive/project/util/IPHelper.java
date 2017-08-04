package com.thinkive.project.util;

import javax.servlet.http.HttpServletRequest;

import com.thinkive.base.util.ConvertHelper;

/**
 * �ж�ip����ز���
 * @author EX-LIUBAO001
 *
 */
public class IPHelper
{
	
	/**
	 * �ж��ǲ�������ip��ַ
	 * 
	 * @param ipAddress
	 * @return
	 */
	public static boolean isInnerIP(String ipAddress)
	{
		boolean isInnerIp = false;
		long ipNum = getIpNum(ipAddress);
		/**
		 * ˽��IP��A�� 10.0.0.0-10.255.255.255 B�� 172.16.0.0-172.31.255.255 C��
		 * 192.168.0.0-192.168.255.255 ��Ȼ������127��������ǻ��ص�ַ
		 **/
		long aBegin = getIpNum("10.0.0.0");
		long aEnd = getIpNum("10.255.255.255");
		long bBegin = getIpNum("172.16.0.0");
		long bEnd = getIpNum("172.31.255.255");
		long cBegin = getIpNum("192.168.0.0");
		long cEnd = getIpNum("192.168.255.255");
		isInnerIp = isInner(ipNum, aBegin, aEnd) || isInner(ipNum, bBegin, bEnd) || isInner(ipNum, cBegin, cEnd) || ipAddress.equals("127.0.0.1");
		return isInnerIp;
	}
	
	private static long getIpNum(String ipAddress)
	{
		String[] ip = ipAddress.split("\\.");
		long a = ConvertHelper.strToInt(ip[0]);
		long b = ConvertHelper.strToInt(ip[1]);
		long c = ConvertHelper.strToInt(ip[2]);
		long d = ConvertHelper.strToInt(ip[3]);
		
		long ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
		return ipNum;
	}
	
	private static boolean isInner(long userIp, long begin, long end)
	{
		return (userIp >= begin) && (userIp <= end);
	}
	
	/**
	* ��ÿͻ�����ʵIP��ַ
	*
	* @return
	*/
	public static String getIpAddr(HttpServletRequest request)
	{
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
		{
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
		{
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip))
		{
			ip = request.getRemoteAddr();
		}
		//����ͨ�����������������һ��IPΪ�ͻ�����ʵIP,���IP����','�ָ�    
		//"***.***.***.***".length() = 15    
		if (ip != null && ip.length() > 15)
		{
			int index = ip.indexOf(",");
			if (index > 0)
			{
				ip = ip.substring(0, index);
			}
		}
		if ("0:0:0:0:0:0:0:1".equals(ip))
		{
			ip = "127.0.0.1";
		}
		return ip;
	}
	
}