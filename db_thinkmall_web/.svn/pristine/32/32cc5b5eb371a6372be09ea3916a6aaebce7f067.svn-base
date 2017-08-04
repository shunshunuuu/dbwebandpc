package com.thinkive.project.util;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.net.URL;
import java.security.CodeSource;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.ProtectionDomain;
import java.security.Provider;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Properties;

import javax.crypto.Cipher;

import org.apache.log4j.Logger;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;

/**
 * 描述:RSA加解密
 * 版权:	 Copyright (c) 2007
 * 公司:	 思迪科技
 * 作者:	 易庆锋
 * 版本:	 1.0
 * 创建日期: 2009-6-16
 * 创建时间: 16:10:23
 */
public class RSA
{
	private static Logger logger = Logger.getLogger(RSA.class.getName());

	private static Properties  props = new Properties();
    private static String CONFIG_FILE_NAME = "/key.properties";
    
	/** 可以先注册到虚拟机中,再通过名称使用;也可以不注册,直接传入使用 */
	public static final Provider pro = new BouncyCastleProvider();
	/** 种子,改变后,生成的密钥对会发生变化 */
	private static final String seedKey = "random";

	private static final String charSet = "UTF-8";
	
	/**
     * * 生成密钥对 *
     *
     * @return KeyPair *
     */
    public static KeyPair generateKeyPair() throws Exception
    {
        try
        {
        	KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA", pro);
        	keyPairGen.initialize(1024, new SecureRandom(seedKey.getBytes()));
    		KeyPair keyPair = keyPairGen.generateKeyPair();
            saveKeyPair(keyPair);
            return keyPair;
        }
        catch (Exception e)
        {
            throw new Exception(e.getMessage());
        }
    }

    public static void saveKeyPair(KeyPair kp) throws Exception
    {
    	RSAPublicKey publicKey = (RSAPublicKey)kp.getPublic();
    	RSAPrivateKey privateKey = (RSAPrivateKey)kp.getPrivate();
    	String n = publicKey.getModulus().toString(16);
    	String e = publicKey.getPublicExponent().toString(16);
    	String d = privateKey.getPrivateExponent().toString(16);
    	//写入classes/tssg.properties文件中保存
    	setProperties("n",n);
    	setProperties("e",e);
    	setProperties("d",d);
    }

    /**
     * * 生成公钥 *
     *
     * @param modulus        *
     * @param publicExponent *
     * @return RSAPublicKey *
     * @throws Exception
     */
    public static RSAPublicKey generateRSAPublicKey(byte[] modulus, byte[] publicExponent) throws Exception
    {
        KeyFactory keyFac = null;
        try
        {
            keyFac = KeyFactory.getInstance("RSA", pro);
        }
        catch (NoSuchAlgorithmException ex)
        {
            throw new Exception(ex.getMessage());
        }
        RSAPublicKeySpec pubKeySpec = new RSAPublicKeySpec(new BigInteger(modulus), new BigInteger(publicExponent));
        try
        {
            return (RSAPublicKey) keyFac.generatePublic(pubKeySpec);
        }
        catch (InvalidKeySpecException ex)
        {
            throw new Exception(ex.getMessage());
        }
    }

    /**
     * * 生成私钥 *
     *
     * @param modulus         *
     * @param privateExponent *
     * @return RSAPrivateKey *
     * @throws Exception
     */
    public static RSAPrivateKey generateRSAPrivateKey(byte[] modulus, byte[] privateExponent) throws Exception
    {
        KeyFactory keyFac = null;
        try
        {
            keyFac = KeyFactory.getInstance("RSA", pro);
        }
        catch (NoSuchAlgorithmException ex)
        {
            throw new Exception(ex.getMessage());
        }
        RSAPrivateKeySpec priKeySpec = new RSAPrivateKeySpec(new BigInteger(modulus), new BigInteger(privateExponent));
        try
        {
            return (RSAPrivateKey) keyFac.generatePrivate(priKeySpec);
        }
        catch (InvalidKeySpecException ex)
        {
            throw new Exception(ex.getMessage());
        }
    }

    /**
     * * 加密 *
     *
     * @param key  加密的密钥 *
     * @param data 待加密的明文数据 *
     * @return 加密后的数据 *
     * @throws Exception
     */
    public static byte[] encrypt(PublicKey pk, byte[] data) throws Exception
    {
        try
        {
        	Cipher cipher = Cipher.getInstance("RSA",pro);
            cipher.init(Cipher.ENCRYPT_MODE, pk);
    		byte[] raw = cipher.doFinal(data);
            return raw;
        }
        catch (Exception e)
        {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * * 加密 *
     *
     * @param key  加密的密钥 *
     * @param data 待加密的明文数据 *
     * @return 加密后的数据 *
     * @throws Exception
     */
    public static String encrypt(PublicKey pk, String dataStr) throws Exception
    {
    	byte[] data = dataStr.getBytes(charSet);
    	byte[] raw = encrypt(pk, data);
    	return new String(raw,charSet);
    }

    /**
     * * 解密 *
     *
     * @param key 解密的密钥 *
     * @param raw 已经加密的数据 *
     * @return 解密后的明文 *
     * @throws Exception
     */
    public static byte[] decrypt(PrivateKey pk, byte[] raw) throws Exception
    {
    	Cipher cipher = Cipher.getInstance("RSA", pro);
		cipher.init(Cipher.DECRYPT_MODE, pk);
		byte[] re = cipher.doFinal(raw);
		return re;
    }
    /**
     * * 解密 *
     *
     * @param key 解密的密钥 *
     * @param raw 已经加密的数据 *
     * @return 解密后的明文 *
     * @throws Exception
     */
    public static byte[] decryptZZ(PrivateKey pk, byte[] raw) throws Exception
    {
    	Cipher cipher = Cipher.getInstance("RSA/ECB/NoPadding", pro);
    	cipher.init(Cipher.DECRYPT_MODE, pk);
    	byte[] re = cipher.doFinal(raw);
    	return re;
    }

    /**
     * * 解密 *
     *
     * @param key 解密的密钥 *
     * @param raw 已经加密的数据 *
     * @return 解密后的明文 *
     * @throws Exception
     */
    public static String decrypt(String raw) throws Exception
    {
    	String modulusStr = RSA.getProperties("n");
    	String priExponentStr = RSA.getProperties("d");
    	byte[] modulusArray = new BigInteger(modulusStr, 16).toByteArray();
    	byte[] priExponentArray = new BigInteger(priExponentStr, 16).toByteArray();
    	RSAPrivateKey privateKey = RSA.generateRSAPrivateKey(modulusArray, priExponentArray);
		byte[] input = Hex.decode(raw);
		byte[] byRaw = decrypt(privateKey,input);
		// 标志位为0之后的是输入的有效字节
		int i = byRaw.length - 1;
		while (i > 0 && byRaw[i] != 0) {
			i--;
		}
		i++;
		byte[] data = new byte[byRaw.length - i];
		for (int j = i; j < byRaw.length; j++) {
			data[j - i] = byRaw[j];
		}
		return new String(data, charSet);
    }

    private static void setProperties(String propsName,String value)
    {
    	try
		{
			props.setProperty(propsName, value);
			FileOutputStream fileOut = new FileOutputStream(getProperitesPath());
			props.store(fileOut, null);
			if (fileOut != null)
			{
				fileOut.close();
				fileOut = null;
			}
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.error("出现异常：" + ex.getCause());
		}

    }

	public static String getProperties(String propsName)
	{
		String value = "";
		InputStream in = null;
		try
		{
			in = RSA.class.getResourceAsStream(CONFIG_FILE_NAME);
			props.load(in);
			value = props.getProperty(propsName);
			if (in != null)
			{
				in.close();
				in = null;
			}
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.error("可能是配置文件未发现！");
		}
		return value;
	}

	public static String getProperitesPath()
	{
		String classPath="";
		try
        {
			  final ProtectionDomain pd = RSA.class.getProtectionDomain();


			  if (pd != null)
			  {
				  URL result = null;
				  final CodeSource cs = pd.getCodeSource();
				   if (cs != null)
					    result = cs.getLocation();
				   if (result != null)
				   {
					   classPath=result.getFile();
				   }
			  }
        }
        catch (Exception e)
        {
	        e.printStackTrace();
        }
        int pos= classPath.indexOf("WEB-INF");
        String fixPath = classPath.substring(0, pos+7);
		String path =fixPath+"/classes"+CONFIG_FILE_NAME;
		return path;
	}

	public static void main(String[] args) throws Exception
	{
		
		String s = "2476e0151c07987e1b8f790885ada8b93f3415645d15260e34fbd89b8cd2c984c089a2fe6f6566e60e57183c8612fe83b7753a166d67bfc7fb050866ef8a7bb175a3afd7eb379b2e7019a6e1960b98b4da46f8ec449be27a9fbceec5a95d3727a00266797c95648a99ee2900f5f811512a56f50448bc5b521953c0d3762ccee1";
		System.out.println(decrypt(s));

	}
}
