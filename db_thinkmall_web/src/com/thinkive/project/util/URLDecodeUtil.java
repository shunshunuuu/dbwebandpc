package com.thinkive.project.util;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;


/**
 * ����: ����URLDecoder(�����ַ����滻,��Ҫ����url����)
 * ��Ȩ: Copyright (c) 2013
 * ��˾: ˼�ϿƼ� 
 * ����: ��ʥ��
 * �汾: 1.0 
 * ��������: Apr 21, 2014 
 * ����ʱ��: 3:07:25 PM
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
		//�滻+ % / ? # & =
		paramStr = paramStr.replaceAll("%2B", "+").replaceAll("%25", "%").replaceAll("%2F", "/").replaceAll("%3F", "?").replaceAll("%23", "#").replaceAll("%26", "&").replaceAll("%3D", "=")   ;
		return paramStr ;
	}
}
