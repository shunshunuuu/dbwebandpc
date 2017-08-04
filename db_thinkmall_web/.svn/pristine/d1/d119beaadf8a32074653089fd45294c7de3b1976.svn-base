package com.thinkive.project.util;

import javax.crypto.*;
import javax.crypto.spec.*;
import org.apache.commons.codec.binary.Base64;

/**
 * 
 * 描述: DES加密
 * 版权: Copyright (c) 2008 
 * 公司: 思迪科技 
 * 作者: 刘宝
 * 版本: 1.0 
 * 创建日期: 2014-3-14 
 * 创建时间: 下午07:36:58
 */

public class DES
{
	
	private Cipher encryptCipher = null;
	
	private Cipher decryptCipher = null;
	
	public DES(String password) throws Exception
	{
		DESKeySpec key = new DESKeySpec(password.getBytes("UTF-8"));
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
		encryptCipher = Cipher.getInstance("DES");
		decryptCipher = Cipher.getInstance("DES");
		encryptCipher.init(Cipher.ENCRYPT_MODE, keyFactory.generateSecret(key));
		decryptCipher.init(Cipher.DECRYPT_MODE, keyFactory.generateSecret(key));
	}
	
	/**
	 * 
	 * 描述：DES加密
	 * 作者：刘宝
	 * 时间：2014-3-14 下午07:37:20
	 * @param unencryptedString
	 * @return
	 * @throws Exception
	 */
	public String encrypt(String unencryptedString) throws Exception
	{
		// Encode the string into bytes using utf-8
		byte[] unencryptedByteArray = unencryptedString.getBytes("UTF8");
		// Encrypt
		byte[] encryptedBytes = encryptCipher.doFinal(unencryptedByteArray);
		// Encode bytes to base64 to get a string
		byte[] encodedBytes = Base64.encodeBase64(encryptedBytes);
		return new String(encodedBytes);
	}
	
	/**
	 * 
	 * 描述：DES解密
	 * 作者：刘宝
	 * 时间：2014-3-14 下午07:37:47
	 * @param encryptedString
	 * @return
	 * @throws Exception
	 */
	public String decrypt(String encryptedString) throws Exception
	{
		// Encode bytes to base64 to get a string
		byte[] decodedBytes = Base64.decodeBase64(encryptedString.getBytes());
		// Decrypt
		byte[] unencryptedByteArray = decryptCipher.doFinal(decodedBytes);
		// Decode using utf-8
		return new String(unencryptedByteArray, "UTF8");
	}
	
	/**
	 * Main unit test method.
	 * @param args Command line arguments.
	 *
	 */
	public static void main(String args[])
	{
		try
		{
			DES crypt = new DES("thinkive_mall");
			String unencryptedString = "刘宝";
			String encryptedString = crypt.encrypt(unencryptedString);
			System.out.println("Encrypted String:" + encryptedString);
			unencryptedString = crypt.decrypt(encryptedString);
			System.out.println("UnEncrypted String:" + unencryptedString);
		}
		catch (Exception e)
		{
			System.err.println("Error:" + e.toString());
		}
	}
}