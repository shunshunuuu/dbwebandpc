package com.thinkive.project.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;


/**
 * 描述: 参数URLDecoder(特殊字符串替换,主要用于url解密)
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Apr 21, 2014 
 * 创建时间: 3:07:25 PM
 */
public class URLDecodeUtil
{
	public static String decode(String paramStr) {
		try
		{
			paramStr = URLDecoder.decode(paramStr,"UTF-8") ;
		}
		catch (UnsupportedEncodingException e)
		{
			e.printStackTrace();
		}
		//替换+ % / ? # & =
		paramStr = paramStr.replaceAll("%2B", "+").replaceAll("%25", "%").replaceAll("%2F", "/").replaceAll("%3F", "?").replaceAll("%23", "#").replaceAll("%26", "&").replaceAll("%3D", "=")   ;
		return paramStr ;
	}
}
