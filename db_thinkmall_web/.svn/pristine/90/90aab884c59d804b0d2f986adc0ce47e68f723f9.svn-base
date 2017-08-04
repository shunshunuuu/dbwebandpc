package com.thinkive.project.interceptor;

import java.util.Map;

import org.apache.log4j.Logger;

import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;
import com.thinkive.tbservice.util.JsonHelper;

/**
 * 
 * @描述: 返回用户信息给前端（因SSO中没有途径给前端返回用户登录信息，特设此拦截器） 
 * @版权: Copyright (c) 2015 
 * @公司: Thinkive 
 * @作者: 黄忠敏
 * @创建日期: 2015年11月27日 上午10:49:04
 */
public class SSOUserInfoInterceptor implements Interceptor
{
	
	private static final long serialVersionUID = 4074766308658172035L;
	
	private static Logger logger = Logger.getLogger(SSOUserInfoInterceptor.class);
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		Result result = new Result();
		logger.info("SSOUserInfoInterceptor.Session:" + invocation.getRequest().getSession());
		
		Map sessionMap = (Map) SessionHelper.getObject("session_userinfo_map", invocation.getRequest().getSession());
		
		logger.info(JsonHelper.getJSONString("###########SSOUserInfoInterceptor.sessionMap:" + JsonHelper.getJSONString(sessionMap)));
		
		if (sessionMap != null && sessionMap.size() > 0)
		{
			DataRow userInfo = new DataRow();
			
			userInfo.set("user_name", sessionMap.get("user_name"));
			userInfo.set("fund_account", sessionMap.get("fund_account"));
			userInfo.set("risk_level", sessionMap.get("risk_level"));
			userInfo.set("mobile_phone", sessionMap.get("mobile_phone"));
			userInfo.set("user_id", sessionMap.get("user_id"));
			userInfo.set("branch_no", sessionMap.get("branch_no"));
			userInfo.set("client_no", sessionMap.get("client_no"));
			userInfo.set("last_login_time", sessionMap.get("last_login_time"));
			userInfo.set("is_first_login", sessionMap.get("is_first_login"));
			userInfo.set("sso_client_id", SessionHelper.getString("sso_client_id", invocation.getRequest().getSession()));
			logger.info(JsonHelper.getJSONString(userInfo));
			result.setResult(userInfo);
			
		}
		else
		{
			result.setErr_no(-18);
			result.setErr_info("未登入！");
		}
		
		return result;
	}
}
