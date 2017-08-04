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
 * 描述: 
 * 版权: Copyright (c) 2012 
 * 公司: 思迪信息
 * 作者: 李炜
 * 版本: 1.0 
 * 创建日期: Mar 10, 2014 
 * 创建时间: 10:15:43 AM
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
		logger.info("进入参数拦截器");
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
			// 订单支付/撤单接口 接口需要根据登录方式判断是否从session中取交易密码
            if ("1000114".equals(funcNo) || "1000115".equals(funcNo) || "1000116".equals(funcNo) || "1000119".equals(funcNo))
            {
                // 判断session中是否存储了交易密码，如果存储了交易密码 说明是资金账号登录，此时交易密码从session中获取
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
								System.out.println("获取到的时间戳："+paramTime);
								if (!pwdTimeIsValid(paramTime)) {
									Result resultVo = new Result();
									resultVo.setErr_no(-9999);
									resultVo.setErr_info("密码已过期！");
									return resultVo;
								}
								encrypt = encrypt.substring(0,encrypt.lastIndexOf("|"));
								
								/* add by wangwei 小程序要在登录后返回加密的jsessionid 此处设置key,在登录拦截器获取   2017年1月12日 下午9:43:25  ---start   */
								// key必须为16位，规则为:登录密码的前3位加上thinkive12345
								param.put("malljseid_key", encrypt.substring(0, 4)+"thinkive1234");
								/*add by wangwei  TODO   2017年1月12日 下午9:43:25  ---end   */
								
							}
/*							try
                            {
							    encrypt = RSA.decrypt(encrypt);
                            }
                            catch (Exception e)
                            {
                                logger.error(e, e);
                                throw new Exception("参数解密异常!");
                            }*/
							
							if("1".equals(Configuration.getString("system.is_secret"))){
								// 采用判断加密后的加密串是否正确再返回
								encrypt = SecurityHelper.encryptDataDouble(encrypt);
								logger.error(encrypt);
							}
							param.put(password, encrypt);
						}
					}
				}
			}
			
			//替换user_id 和 fund_account,预防利用session串号操作
			String verifyKey = Configuration.getString("system.verifyKey");
			AES aes = new AES(verifyKey);
			
			String userId = MapHelper.getString(param, USER_ID);
			 logger.info("106行userId："+userId);
			if(StringHelper.isNotBlank(userId)){
				 logger.info("108行SESSION_USER_ID:"+WebConstants.SESSION_USER_ID);
				String userIdAes = SessionHelper.getString(WebConstants.SESSION_USER_ID, invocation.getRequest().getSession());
				 logger.info("109行userIdAes:"+userIdAes);
				String user_id = aes.decrypt(userIdAes, "UTF-8");
				 logger.info("111行user_id："+user_id);
				if(StringHelper.isNotBlank(user_id)){
					param.put(USER_ID, user_id);
				}
				else
				{
					param.put(USER_ID, "");
				}
			}
			
			//资金账号在绑定时出现session中无资金账号信息
			String fundAccount = MapHelper.getString(param, FUND_ACCOUNT);
			if(StringHelper.isNotBlank(fundAccount)){
				String fundAccountAes = SessionHelper.getString(WebConstants.SESSION_FUND_ACCOUNT, invocation.getRequest().getSession());
				String fund_account = aes.decrypt(fundAccountAes, "UTF-8");
				if(StringHelper.isNotBlank(fund_account)){
					param.put(FUND_ACCOUNT, fund_account);
				}
			}
			
			//查看个人信息时判断手机号是否为已经登录的用户信息
/*			String funcNo = invocation.getRequest().getParameter("funcNo");
			if("1000002".equals(funcNo)){
				String mobilePhone = MapHelper.getString(param, INPUT_VALUE);
				String mobileSessionAes = SessionHelper.getString(WebConstants.SESSION_MOBILE_PHONE, invocation.getRequest().getSession()) ; //得到session中手机
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
	 * 判断密码后面带的时间戳是否有效
	 */
	private boolean pwdTimeIsValid(String timeStr){
	    if (StringUtils.isEmpty(timeStr))
        {
            return false;
        }
	    
	    // 长度是否等于13
	    if (timeStr.length() != 13)
        {
            return false;
        }
	    try{
	        // 是否能够转换成long类型
	        long datatime = Long.parseLong(timeStr); 
	        
	        // 是否能够正常转换成时间格式字符串
	        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	        String date = format.format(datatime); 
	        
	        // 校验密码是否过期
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
