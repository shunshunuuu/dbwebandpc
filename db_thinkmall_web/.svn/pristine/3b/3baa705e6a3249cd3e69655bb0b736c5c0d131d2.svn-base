package com.thinkive.project.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
/**
 * 
 * 描述: AES加密，key需要为16位, 此处使用AES-128-CBC模式
 * 版权: Copyright (c) 2008 
 * 公司: 思迪科技 
 * 作者: 刘宝
 * 版本: 1.0 
 * 创建日期: 2014-3-14 
 * 创建时间: 下午07:54:27
 */
public class AES
{
    private Cipher encryptCipher = null;
	
	private Cipher decryptCipher = null;
	
	public AES(String password) throws Exception
	{
		byte[] raw = password.getBytes("UTF-8");
		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
		encryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");//"算法/模式/补码方式"  
		decryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");//"算法/模式/补码方式" 
		IvParameterSpec iv = new IvParameterSpec(raw);//使用CBC模式，需要一个向量iv，可增加加密算法的强度  
		encryptCipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
		decryptCipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
	}
	
	/**
	 * 描述：AES加密
	 * 作者：刘宝
	 * 时间：2014-3-14 下午07:45:20
	 */
	public String encrypt(String content) throws Exception
	{
		byte[] encrypted = encryptCipher.doFinal(content.getBytes("UTF-8"));
		return Base64.encodeBase64String(encrypted);//此处使用BAES64做转码功能，同时能起到2次加密的作用。  
	}
	
	/**
	 * 描述：AES解密
	 * 作者：刘宝
	 * 时间：2014-3-14 下午07:50:35
	 */
	public String decrypt(String content) throws Exception
	{
		byte[] encrypted1 = Base64.decodeBase64(content);//先用bAES64解密 
		byte[] original = decryptCipher.doFinal(encrypted1);
		String originalString = new String(original, "UTF-8");
		return originalString;
	}
	
	public static void main(String[] args) throws Exception
	{
		try
		{
			AES crypt = new AES("1234567812345678");
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