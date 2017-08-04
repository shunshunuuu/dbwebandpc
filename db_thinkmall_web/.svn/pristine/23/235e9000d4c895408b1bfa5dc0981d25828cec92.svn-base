package com.thinkive.project.util;

import java.net.URLEncoder;

/**
 * 客户端加密工具类
 * 
 * @author liuwei
 * 
 */
public class Util {

	private static final String BASE_URL = "http://card.orientalwisdom.com/udp/dbzq_yaoyiyao_160126/index/";

	private static final String KEY = "dbzq160127_sc123";

	/**
	 * 获取领卡地址
	 * 
	 * @param openId
	 *            微信用户的openId
	 * @return String
	 * @author liuwei
	 * @version 1.0 </pre> Created on :2015年9月16日 下午3:33:02 LastModified:
	 *          History: </pre>
	 */
	public static String getUrl(String openId) {
		if (openId == null || "".equals(openId)) {
			return null;
		}
		try {
			AES aes = new AES(KEY);
			String value = aes.encrypt(openId);
			value = URLEncoder.encode(value, "UTF-8");
			value = URLEncoder.encode(value, "UTF-8");
			return BASE_URL + "/" + openId + "/" + value;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
