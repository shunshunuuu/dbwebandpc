package com.thinkive.project.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.thinkive.base.util.SessionHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

public class LogoutInterceptor implements Interceptor
{
	private static final long serialVersionUID = 8318249557521641189L;
	
	private static Logger logger = Logger.getLogger(LogoutInterceptor.class);
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("进入退出登录拦截器");
		
		HttpServletRequest request = invocation.getRequest();
		logger.info("logout sessionid:" + request.getSession().getId());
		request.getSession().invalidate();
		
		SessionHelper.setString(WebConstants.SESSION_USER_TOKEN, "", request.getSession()) ;//清除token
		SessionHelper.setString(WebConstants.SESSION_USER_ID, "", request.getSession()) ;//清除用户id
		SessionHelper.setString(WebConstants.SESSION_FUND_ACCOUNT,"", request.getSession());//清除资金账号
		
		Result resultVo = new Result();
		resultVo.setErr_no(0);
		resultVo.setErr_info("调用成功!");
		return resultVo;
	}
}