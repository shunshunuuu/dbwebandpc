package com.thinkive.project.interceptor;

import java.net.URLDecoder;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.openservice.api.Merchant;
import com.thinkive.openservice.api.MerchantConfig;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.project.util.RSA;
import com.thinkive.project.util.SecurityHelper;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 
 * @����: �޸��ֻ�����
 * @��Ȩ: Copyright (c) 2016 
 * @��˾: Thinkive 
 * @����: ����
 * @��������: 2016��8��24�� 09:38:36
 */
public class UpdateMobilePhoneInterceptor implements Interceptor
{
	
	private final static String verifyKey = Configuration.getString("system.verifyKey");
	
	private static final String ENCRYPT_RSA = "encrypt_rsa:";
	
	private static final long serialVersionUID = 8434406725781952410L;
	
	private static final String LOGIN_PWD = "login_pwd";
	
	private static Logger logger = Logger.getLogger(UpdateMobilePhoneInterceptor.class);
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("�����޸��ֻ�����������");
		logger.info(invocation.getParamMap());
		Map reqMap = invocation.getParamMap();
		Result result = new Result();
		result.setErr_no(0);
		result.setErr_info("���óɹ���");
		
		Merchant mer = MerchantConfig.getMerchant();
		String wechatOpenID = (String) reqMap.get("openid");

		DataRow paraMap = new DataRow();
		paraMap.set("openid", wechatOpenID);
		paraMap.set("app_id", Configuration.getString("uums.app_id")); // Ӧ�ñ��
		paraMap.set("corp_id", Configuration.getString("uums.corp_id")); // ��˾���
		paraMap.set("client_id", SessionHelper.getString("sso_client_id", invocation.getRequest().getSession())); // �ͻ����
		paraMap.set("mobile", invocation.getRequest().getParameter("mobile_phone")); // �ֻ�����
		String encrypt = invocation.getRequest().getParameter("password"); // ��������
		//�ڶԽ���ͳһ�˻�������£�������login_pwdҪô��urlencode���ģ�Ҫô�Ǽ������ؼ��ܹ���
		if (StringHelper.isNotBlank(encrypt))
		{
			//���������url����
			encrypt = URLDecoder.decode(encrypt,"utf-8");
		}
		if (StringHelper.isNotBlank(encrypt) && encrypt.startsWith(ENCRYPT_RSA))
		{
			encrypt = encrypt.substring(ENCRYPT_RSA.length());
			encrypt = RSA.decrypt(encrypt);
			paraMap.set("password", encrypt); // ��������
		}
		else
		{
			paraMap.set("password",encrypt);
		}
//		paraMap.set("password", invocation.getRequest().getParameter("password")); // ��������
		
		
		// �޸��ֻ����루1118��
		logger.info("1118��Σ�" + paraMap);
		Result resultData = BusClientUtil.invoke(1118 , paraMap, "oauthBus");
		logger.info("1118�޸��ֻ�����Ľ����" + resultData);
		DataRow uInfo = new DataRow();
		if (resultData != null && resultData.getErr_no() == 0)
		{
			logger.info("1118�޸��ֻ���");
			result.setErr_no(0);
			result.setErr_info("�޸��ֻ�����ɹ���");
		}
		else
		{
			result.setErr_no(resultData.getErr_no());
			result.setErr_info(resultData.getErr_info());
		}
		return result;
	}
}
