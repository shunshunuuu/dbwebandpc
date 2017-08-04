package com.thinkive.project.util;

import java.security.Key;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * @����: 
 * @��Ȩ: Copyright (c) 2015 
 * @��˾: Thinkive 
 * @����: ����
 * @��������: 2015��7��25�� ����4:04:01
 */
public final class AesUtil {
	
	/** ��Կ�㷨 */
	public static final String KEY_ALGORITHM = "AES";
	
	/** ��Կλ�� */
	public static final int KEY_LENGTH = 128;
	
	/** �ӽ����㷨 / ����ģʽ / ��䷽ʽ */
	public static final String CIPHER_ALGORITHM = "AES/ECB/PKCS5Padding";
	
	/**
	 * ������Կ
	 */
	public static byte[] initKey() throws Exception {
		KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_ALGORITHM);
		keyGenerator.init(KEY_LENGTH);
		
		SecretKey secretKey = keyGenerator.generateKey();
		return secretKey.getEncoded();
	}
	
	/**
	 * ת����Կ
	 */
	private static Key toKey(byte[] keyArr) throws Exception {
		Key secretKey = new SecretKeySpec(keyArr, KEY_ALGORITHM);
		return secretKey;
	} 
	
	/**
	 * ����
	 */	
	public static byte[] encrypt(byte[] data, byte[] keyArr) throws Exception {
		Key key = toKey(keyArr);
		
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, key);
		
		return cipher.doFinal(data);
	}
	
	/**
	 * ����
	 */
	public static byte[] decrypt(byte[] data, byte[] keyArr) throws Exception {
		Key key = toKey(keyArr);
		
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, key);
		
		return cipher.doFinal(data);
	}

	private AesUtil() {}
	
	public static void main(String[] args) throws Exception
	{
		String result = EncryptService.encryptByAes("12345678", "thinkivethinkive");
        System.out.println("���ܽ����" + result);
	}
}
