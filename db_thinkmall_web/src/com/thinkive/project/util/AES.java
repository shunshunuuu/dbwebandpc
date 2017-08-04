package com.thinkive.project.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
/**
 * 
 * ����: AES���ܣ�key��ҪΪ16λ, �˴�ʹ��AES-128-CBCģʽ
 * ��Ȩ: Copyright (c) 2008 
 * ��˾: ˼�ϿƼ� 
 * ����: ����
 * �汾: 1.0 
 * ��������: 2014-3-14 
 * ����ʱ��: ����07:54:27
 */
public class AES
{
    private Cipher encryptCipher = null;
	
	private Cipher decryptCipher = null;
	
	public AES(String password) throws Exception
	{
		byte[] raw = password.getBytes("UTF-8");
		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
		encryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");//"�㷨/ģʽ/���뷽ʽ"  
		decryptCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");//"�㷨/ģʽ/���뷽ʽ" 
		IvParameterSpec iv = new IvParameterSpec(raw);//ʹ��CBCģʽ����Ҫһ������iv�������Ӽ����㷨��ǿ��  
		encryptCipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
		decryptCipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
	}
	
	/**
	 * ������AES����
	 * ���ߣ�����
	 * ʱ�䣺2014-3-14 ����07:45:20
	 */
	public String encrypt(String content) throws Exception
	{
		byte[] encrypted = encryptCipher.doFinal(content.getBytes("UTF-8"));
		return Base64.encodeBase64String(encrypted);//�˴�ʹ��BAES64��ת�빦�ܣ�ͬʱ����2�μ��ܵ����á�  
	}
	
	/**
	 * ������AES����
	 * ���ߣ�����
	 * ʱ�䣺2014-3-14 ����07:50:35
	 */
	public String decrypt(String content) throws Exception
	{
		byte[] encrypted1 = Base64.decodeBase64(content);//����bAES64���� 
		byte[] original = decryptCipher.doFinal(encrypted1);
		String originalString = new String(original, "UTF-8");
		return originalString;
	}
	
	public static void main(String[] args) throws Exception
	{
		try
		{
			AES crypt = new AES("1234567812345678");
			String unencryptedString = "����";
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