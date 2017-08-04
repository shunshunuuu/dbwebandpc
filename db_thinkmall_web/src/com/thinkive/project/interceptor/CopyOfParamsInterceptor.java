package com.thinkive.project.interceptor;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import java.text.SimpleDateFormat;
import com.thinkive.base.config.Configuration;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.IPHelper;
import com.thinkive.project.util.RSA;
import com.thinkive.project.util.SecurityHelper;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * ����: 
 * ��Ȩ: Copyright (c) 2012 
 * ��˾: ˼����Ϣ
 * ����: ���
 * �汾: 1.0 
 * ��������: Mar 10, 2014 
 * ����ʱ��: 10:15:43 AM
 */
public class CopyOfParamsInterceptor implements Interceptor
{
	private static Logger logger = Logger.getLogger(CopyOfParamsInterceptor.class);
	
	private static final String ENCRYPT_RSA = "encrypt_rsa:";
	
	private static final String USER_ID = "user_id" ;
	
	private static final String FUND_ACCOUNT = "fund_account" ;
	
	private static final String TRADE_PWD = "trade_pwd" ;
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("�������������");
		Map param = invocation.getParamMap();
		String url = invocation.getRequest().getRequestURI();
		if (param != null)
		{
			String ip = MapHelper.getString(param, "ip");
			if (StringHelper.isEmpty(ip))
			{
				ip = IPHelper.getIpAddr(invocation.getRequest());
				param.put("ip", ip);
			}
			
			String funcNo = invocation.getRequest().getParameter("funcNo");
			// ����֧��/�����ӿ� �ӿ���Ҫ���ݵ�¼��ʽ�ж��Ƿ��session��ȡ��������
            if ("1000114".equals(funcNo) || "1000115".equals(funcNo) || "1000116".equals(funcNo) || "1000119".equals(funcNo))
            {
                // �ж�session���Ƿ�洢�˽������룬����洢�˽������� ˵�����ʽ��˺ŵ�¼����ʱ���������session�л�ȡ
                String trade_pwd = SessionHelper.getString(WebConstants.SESSION_FUND_ACCOUNT_LOGIN_PWD, invocation.getRequest().getSession());
                logger.info(trade_pwd);
                if (StringHelper.isNotBlank(trade_pwd))
                {
                    param.put(TRADE_PWD, trade_pwd);
                }
            }
			
			String passwordFields = Configuration.getString("system.passwordFields");
			if(StringHelper.isNotBlank(passwordFields))
			{
				String[] passwords = StringHelper.split(passwordFields, "|");
				if(passwords != null && passwords.length > 0)
				{
					for(int i = 0; i < passwords.length; i ++)
					{
						String password = passwords[i];
						String encrypt = MapHelper.getString(param, password);
						if(StringHelper.isNotBlank(encrypt) && encrypt.startsWith(ENCRYPT_RSA))
						{
							encrypt = encrypt.substring(ENCRYPT_RSA.length());
							encrypt = RSA.decrypt(encrypt);
							if (encrypt.lastIndexOf("|") != -1) {
								String paramTime = encrypt.substring(encrypt.lastIndexOf("|") + 1);
								System.out.println("��ȡ����ʱ�����"+paramTime);
								if (!pwdTimeIsValid(paramTime)) {
									Result resultVo = new Result();
									resultVo.setErr_no(-9999);
									resultVo.setErr_info("�����ѹ��ڣ�");
									return resultVo;
								}
								encrypt = encrypt.substring(0,encrypt.lastIndexOf("|"));
								
								/* add by wangwei С����Ҫ�ڵ�¼�󷵻ؼ��ܵ�jsessionid �˴�����key,�ڵ�¼��������ȡ   2017��1��12�� ����9:43:25  ---start   */
								// key����Ϊ16λ������Ϊ:��¼�����ǰ3λ����thinkive12345
								param.put("malljseid_key", encrypt.substring(0, 4)+"thinkive1234");
								/*add by wangwei  TODO   2017��1��12�� ����9:43:25  ---end   */
								
							}
/*							try
                            {
							    encrypt = RSA.decrypt(encrypt);
                            }
                            catch (Exception e)
                            {
                                logger.error(e, e);
                                throw new Exception("���������쳣!");
                            }*/
							
							if("1".equals(Configuration.getString("system.is_secret"))){
								// �����жϼ��ܺ�ļ��ܴ��Ƿ���ȷ�ٷ���
								encrypt = SecurityHelper.encryptDataDouble(encrypt);
								logger.error(encrypt);
							}
							param.put(password, encrypt);
						}
					}
				}
			}
			
			//�滻user_id �� fund_account,Ԥ������session���Ų���
			String verifyKey = Configuration.getString("system.verifyKey");
			AES aes = new AES(verifyKey);
			
			String userId = MapHelper.getString(param, USER_ID);
			 logger.info("106��userId��"+userId);
			if(StringHelper.isNotBlank(userId)){
				 logger.info("108��SESSION_USER_ID:"+WebConstants.SESSION_USER_ID);
				String userIdAes = SessionHelper.getString(WebConstants.SESSION_USER_ID, invocation.getRequest().getSession());
				 logger.info("109��userIdAes:"+userIdAes);
				String user_id = aes.decrypt(userIdAes, "UTF-8");
				 logger.info("111��user_id��"+user_id);
				if(StringHelper.isNotBlank(user_id)){
					param.put(USER_ID, user_id);
				}
				else
				{
					param.put(USER_ID, "");
				}
			}
			
			//�ʽ��˺��ڰ�ʱ����session�����ʽ��˺���Ϣ
			String fundAccount = MapHelper.getString(param, FUND_ACCOUNT);
			if(StringHelper.isNotBlank(fundAccount)){
				String fundAccountAes = SessionHelper.getString(WebConstants.SESSION_FUND_ACCOUNT, invocation.getRequest().getSession());
				String fund_account = aes.decrypt(fundAccountAes, "UTF-8");
				if(StringHelper.isNotBlank(fund_account)){
					param.put(FUND_ACCOUNT, fund_account);
				}
			}
			
			//�鿴������Ϣʱ�ж��ֻ����Ƿ�Ϊ�Ѿ���¼���û���Ϣ
/*			String funcNo = invocation.getRequest().getParameter("funcNo");
			if("1000002".equals(funcNo)){
				String mobilePhone = MapHelper.getString(param, INPUT_VALUE);
				String mobileSessionAes = SessionHelper.getString(WebConstants.SESSION_MOBILE_PHONE, invocation.getRequest().getSession()) ; //�õ�session���ֻ�
				String mobile_phone = aes.decrypt(mobileSessionAes, "UTF-8");
				if( StringHelper.isNotBlank(mobile_phone))
				{
					param.put(INPUT_VALUE, mobile_phone);
				}
				else
				{
					param.put(INPUT_VALUE, "");
				}
			}*/
		}
		return invocation.invoke();
	}
	
	/**
	 * �ж�����������ʱ����Ƿ���Ч
	 */
	private boolean pwdTimeIsValid(String timeStr){
	    if (StringUtils.isEmpty(timeStr))
        {
            return false;
        }
	    
	    // �����Ƿ����13
	    if (timeStr.length() != 13)
        {
            return false;
        }
	    try{
	        // �Ƿ��ܹ�ת����long����
	        long datatime = Long.parseLong(timeStr); 
	        
	        // �Ƿ��ܹ�����ת����ʱ���ʽ�ַ���
	        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	        String date = format.format(datatime); 
	        
	        // У�������Ƿ����
	        String secretTimeoutVal = Configuration.getString("system.secret_timeout");
	        int timeoutInt = Integer.parseInt(secretTimeoutVal);
	        if ((datatime + timeoutInt * 60 * 1000) < System.currentTimeMillis())
            {
                return false;
            }
	        return true;
	    } catch (Exception e){
	        return false;
	    }
	}
	
public static void main(String[] args) {
		
	CopyOfParamsInterceptor it = new CopyOfParamsInterceptor();
		Map<String,String> paramsMap = new HashMap<String, String>();
		String user_id = "";
		String ip = "180.173.198.202";
	//	it.decodeTradePwd(trade_pwd);
	}
}
