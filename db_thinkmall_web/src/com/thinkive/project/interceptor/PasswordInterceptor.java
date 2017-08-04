package com.thinkive.project.interceptor;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;


public class PasswordInterceptor implements Interceptor
{
	private static final long serialVersionUID = 4591505970115460426L;

	private static Logger logger = Logger.getLogger(LoginInterceptor.class);

	private final static String verifyKey = Configuration.getString("system.verifyKey");
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("进入密码拦截器");
		
		String loginPwd = invocation.getRequest().getParameter("trade_pwd_new");
		
		Result result = invocation.invoke();
		
		if (result != null && result.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
		{
			AES aes = new AES(verifyKey);
			//修改session中的密码
			SessionHelper.setString(WebConstants.SESSION_LOGIN_PWD, aes.encrypt(loginPwd, "UTF-8"), invocation.getRequest().getSession());
		}
		return result;
	}
	
}
