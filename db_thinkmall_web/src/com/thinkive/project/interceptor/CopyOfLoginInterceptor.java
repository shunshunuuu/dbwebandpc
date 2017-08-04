package com.thinkive.project.interceptor;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.EncryptService;
import com.thinkive.project.util.IPHelper;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 描述: 
 * 版权: Copyright (c) 2014 
 * 公司: 思迪信息
 * 作者: HUANGRONALDO
 * 版本: 1.0 
 * 创建日期: Jan 27, 2014 
 * 创建时间: 11:48:55 PM
 */
public class CopyOfLoginInterceptor implements Interceptor
{
	private static final long serialVersionUID = -3347134892037460205L;

	private static Logger logger = Logger.getLogger(CopyOfLoginInterceptor.class);

	private final static String verifyKey = Configuration.getString("system.verifyKey");
	
	private final static String FUND_ACCOUNT_LOGIN_Y = "1"; // 资金账号登录
	
	private final static String FUND_ACCOUNT_LOGIN_N = "0"; // 非资金账号登录
	
	private final static String IS_LOGIN_TYPE_Y = "1"; // 手机验证登录
	
	private final static String IS_LOGIN_TYPE_N = "0"; // 非手机验证登录
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("进入登录拦截器");
		
		Map<?,?> paraMap = invocation.getParamMap();
		String func_no = invocation.getRequest().getParameter("funcNo"); //功能号
		String trade_pwd = MapHelper.getString(paraMap, "trade_pwd"); //交易密码
		String malljseid_key = MapHelper.getString(paraMap, "malljseid_key"); //jsessionid加密的key

		Result result = invocation.invoke();
	      
        //会话标识未更新 **************
        HttpServletRequest request = invocation.getRequest();
        HttpSession session = request.getSession();
        System.out.println("login befor---------------------" + session.getId());
        session.invalidate();//清空session
        Cookie[] cookies = invocation.getRequest().getCookies();
        if(null!=cookies){
            for(int i=0;i<cookies.length;i++){
                if("JSESSIONID".equalsIgnoreCase(cookies[i].getName())){
                    cookies[i].setMaxAge(0);
                    cookies[i].setValue("");
                    invocation.getResponse().addCookie(cookies[i]);
                }
            }
        }
        session = request.getSession(true); // 创建新的session
        System.out.println("login end---------------------" + session.getId());
        //会话标识未更新 **************
		
		if (result != null && result.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
		{
			DataRow resultData = result.getData(); //登录成功后，接口返回信息
			/* add by wangwei 小程序需要返回jsessionid,此处加密返回 2017年1月12日 下午9:54:00 ---start */
			resultData.set("malljseid", EncryptService.encryptByAes(session.getId(), malljseid_key));
			resultData.set("JSESSIONID", session.getId());
			/*add by wangwei  小程序需要返回jsessionid,此处加密返回   2017年1月12日 下午9:54:00  ---end   */
			
			String user_id = resultData.getString("user_id");
			String fund_account = resultData.getString("fund_account");
			String branch_no = resultData.getString("branch_no");
			String mobile_phone = resultData.getString("mobile_phone");
			/*if(StringHelper.isEmpty(fund_account))
			{
				fund_account = user_id;
			}*/
			fund_account = StringHelper.isBlank(fund_account)?" ":fund_account;
			if(StringHelper.isEmpty(branch_no))
			{
				branch_no = mobile_phone;
			}

			Map<?,?> param = invocation.getParamMap();
			String loginMac = MapHelper.getString(param, "mac");//MAC地址
			String ip = IPHelper.getIpAddr(invocation.getRequest()); //ip
			
			AES aes = new AES(verifyKey);
			SessionHelper.setString(WebConstants.SESSION_USER_ID, aes.encrypt(user_id, "UTF-8"), invocation.getRequest().getSession());
			SessionHelper.setString(WebConstants.SESSION_FUND_ACCOUNT, aes.encrypt(fund_account, "UTF-8"), invocation.getRequest().getSession());
			SessionHelper.setString(WebConstants.SESSION_MOBILE_PHONE, aes.encrypt(mobile_phone, "UTF-8"),  invocation.getRequest().getSession());

			//解密session得到用户信息 1、user_id 2、 资金账号 3、营业部  4、ip 5、mac地址
			String token = user_id + "|" + fund_account + "|" + branch_no + "|" + ip + "|" + loginMac ; 
			SessionHelper.setString(WebConstants.SESSION_USER_TOKEN, aes.encrypt(token, "UTF-8"), invocation.getRequest().getSession());
			
			// 资金账号登录时 需要把交易密码存到session中，支付的时候直接从session中获取
			if (!StringHelper.isEmpty(func_no) && ("1000007".equals(func_no) || "1001970".equals(func_no)))
            {
//			    SessionHelper.setString(WebConstants.SESSION_FUND_ACCOUNT_LOGIN_PWD, MapHelper.getString(paraMap, "auth_password"), invocation.getRequest().getSession());
                SessionHelper.setString(WebConstants.SESSION_FUND_ACCOUNT_LOGIN_PWD, trade_pwd, invocation.getRequest().getSession());
                resultData.set("is_fund_account_login", FUND_ACCOUNT_LOGIN_Y);
            } else {
                resultData.set("is_fund_account_login", FUND_ACCOUNT_LOGIN_N);
            }
			// 当是短信验证方式登录 则做出标记
			if (!StringHelper.isEmpty(func_no) && "1000024".equals(func_no))
            {
				resultData.set("is_login_type", IS_LOGIN_TYPE_Y);
            }else{
            	resultData.set("is_login_type", IS_LOGIN_TYPE_N);
            }
		}
		return result;
	}
}
