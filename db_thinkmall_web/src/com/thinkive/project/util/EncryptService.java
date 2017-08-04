package com.thinkive.project.util;

import java.security.MessageDigest;

import com.thinkive.project.util.Base64Helper;
import com.thinkive.base.util.security.DES;

/**
 * @描述: 
 * @版权: Copyright (c) 2015 
 * @公司: Thinkive 
 * @作者: 汪博
 * @创建日期: 2015年7月25日 下午4:05:05
 */
public class EncryptService
{
    
    private static final String DEFAULT_ENCODE = "utf-8";
    
    private EncryptService()
    {
        
    }
    
    /*
     * 使用AES加密
     */
    public static String encryptByAes(String plainText, String key) throws Exception
    {
        byte[] b = AesUtil.encrypt(plainText.getBytes(DEFAULT_ENCODE), key.getBytes(DEFAULT_ENCODE));
        if ( b != null )
        {
            return Base64Helper.encode(b);
        }
        else
        {
            return "";
        }
    }
    
    /*
     * 使用DES加密
     */
    public static String encryptByDes(String plainText, String key) throws Exception
    {
        DES des = new DES(key);
        return des.encrypt(plainText, DEFAULT_ENCODE);
    }
    
    /*
     * 使用AES解密
     */
    public static String decryptByAes(String cipherText, String key) throws Exception
    {
        byte[] b = Base64Helper.decode(cipherText);
        String result = "";
        if ( b != null )
        {
            result = new String(AesUtil.decrypt(b, key.getBytes(DEFAULT_ENCODE)), DEFAULT_ENCODE);
        }
        return result;
    }
    
    /**
     * 使用DES解密
     */
    public static String decryptByDes(String cipherText, String key) throws Exception
    {
        DES des = new DES(key);
        return des.decrypt(cipherText, DEFAULT_ENCODE);
        
    }
    
    /*
     * 做BASE64编码
     */
    public static String base64(String text) throws Exception
    {
        return Base64Helper.encode(text);
    }
    
    /*
     * BASE64解码
     */
    public static String debase64(String base64) throws Exception
    {
        return Base64Helper.decodeToString(base64);
    }
    
    /*
     * MD5 摘要
     */
    public static String md5(String plainText) throws Exception
    {
        String resultString = "";
        
        MessageDigest md = MessageDigest.getInstance("MD5");
        resultString = byteArrayToHex(md.digest(plainText.getBytes(DEFAULT_ENCODE)));
        
        return resultString;
    }
    
    /**
     * 描述：返回十六进制字符串
     */
    public static String byteArrayToHex(byte[] arr)
    {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < arr.length; ++i)
        {
            sb.append(Integer.toHexString((arr[i] & 0xFF) | 0x100).substring(1, 3));
        }
        return sb.toString().toUpperCase();
    }
    
    /*
     * 将16进制值的字符串转换为byte数组
     */
    public static byte[] hexToByteArray(String hex)
    {
        try
        {
            byte[] arrB = hex.getBytes(DEFAULT_ENCODE);
            int iLen = arrB.length;
            
            byte[] arrOut = new byte[iLen / 2];
            for (int i = 0; i < iLen; i = i + 2)
            {
                String strTmp = new String(arrB, i, 2);
                arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
            }
            return arrOut;
        }
        catch (Exception ex)
        {
            return new byte[0];
        }
    }
}
