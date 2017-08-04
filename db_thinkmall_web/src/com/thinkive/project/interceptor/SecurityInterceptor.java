package com.thinkive.project.interceptor;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.project.util.IPHelper;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * ����: Ȩ��������
 * ��Ȩ: Copyright (c) 2012 
 * ��˾: ˼����Ϣ
 * ����: ���
 * �汾: 1.0 
 * ��������: Oct 9, 2013 
 * ����ʱ��: 2:02:46 PM
 */
public class SecurityInterceptor implements Interceptor
{
	private static final long serialVersionUID = 4840866570444047069L;

	private static Logger logger = Logger.getLogger(SecurityInterceptor.class);
	
	private final static String verifyKey = Configuration.getString("system.verifyKey");
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("����Ȩ��������");
		if (!isLogin(invocation.getRequest()))
		{
			Result resultVo = new Result();
			resultVo.setErr_no(-999);
			resultVo.setErr_info("����δ��¼");
			return resultVo;
		}
		return invocation.invoke();
	}
	
	/**
	 * �ж��û��Ƿ��Ѿ���¼
	 *
	 * @param actionInvocation
	 * @return
	 */
	private boolean isLogin(HttpServletRequest request)
	{
		String userId = SessionHelper.getString(WebConstants.SESSION_USER_ID, request.getSession());
		String ip = IPHelper.getIpAddr(request);
		String token = SessionHelper.getString(WebConstants.SESSION_USER_TOKEN, request.getSession()) ; //�õ�session��
		if(StringHelper.isNotEmpty(token) && StringHelper.isNotEmpty(userId)){ //�ж�session���Ƿ����token
			AES aes = new AES(verifyKey);
			String tokenStr = aes.decrypt(token, "UTF-8"); 
			String userArr[] = StringHelper.split(tokenStr, "|");//����session�õ��û���Ϣ 1��user_id 2�� �ʽ��˺� 3��Ӫҵ��  4��ip 5��mac��ַ
			if(userArr!=null && userArr.length==4){
				if(StringHelper.isNotEmpty(userArr[3]) && userArr[3].equalsIgnoreCase(ip)){
					return true ;
				}
			}
			else if (userArr != null && userArr.length == 5)
			{
				if (StringHelper.isNotEmpty(userArr[1]) && userArr[3].equalsIgnoreCase(ip))
				{
					return true;
				}
			}
		}
		return false;
	}
	
	/*
	 * �ж���token�Ƿ�ʧЧ
	 */
	private boolean isToken(ActionInvocation invocation,HttpServletRequest request){
		DataRow paraMap = new DataRow();
		String sso_client_id = SessionHelper.getString("sso_client_id", request.getSession());
		
		paraMap.set("merchant_id", sso_client_id);
        logger.info("1008�������Σ�" + paraMap);
		Result resultData = BusClientUtil.invoke(1008, paraMap, "oauthBus");
		
		if (resultData != null && resultData.getErr_no() == 0){
			DataRow da = resultData.getData("user_info");
			String ssoClientId = da.getString("client_id");
			List<DataRow> list = (List) resultData.getList("account_info");
			
			List<DataRow> userInfoList = (List) resultData.getList("user_info");
		}
		
		return false;
	}
}