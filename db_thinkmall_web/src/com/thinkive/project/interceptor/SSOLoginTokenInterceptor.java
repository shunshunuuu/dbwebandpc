package com.thinkive.project.interceptor;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

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
import com.thinkive.project.util.IPHelper;
import com.thinkive.project.util.SecurityHelper;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 
 * @����: SSO�û��˻���Ϣ���棨ͳһ��¼�󣬻�ֱ���ø�Ӧ�õĽ���㣬��ʱֻ�ѹ��ĵ��˻������session��
 * @��Ȩ: Copyright (c) 2015 
 * @��˾: Thinkive 
 * @����: ������
 * @��������: 2015��11��27�� ����11:17:24
 */
public class SSOLoginTokenInterceptor implements Interceptor
{
	
	private final static String verifyKey = Configuration.getString("system.verifyKey");
	
	private static final long serialVersionUID = 8434406725781952410L;
	
	private static Logger logger = Logger.getLogger(SSOLoginTokenInterceptor.class);
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("����ͳһ�˺�������");
		logger.info(invocation.getParamMap());
		Map reqMap = invocation.getParamMap();
		Result result = new Result();
		result.setErr_no(0);
		result.setErr_info("���óɹ���");
		
		Merchant mer = MerchantConfig.getMerchant();
		
		//		String merchant_id = (String) invocation.getParamMap().get("merchant_id");
		String merchantId = mer.getMerid();
		String tempToken = (String) invocation.getParamMap().get("temp_token");
		String client_id = (String) invocation.getParamMap().get("client_id");
		String access_token = (String) invocation.getParamMap().get("access_token");
		
		String fundAccountType = "";
		String fundAccount = "";
		String tradePwd = "";
		
		String wechatOpenID = "";
		
		DataRow paraMap = new DataRow();
		paraMap.set("merchant_id", merchantId);
		paraMap.set("temp_token", tempToken);
		
		
		
		//�Ự��ʶδ���� **************
        HttpServletRequest request = invocation.getRequest();
        HttpSession session = request.getSession();
        
        //�����沽��Ҫ���´�session����ͳһ�˻��Ŀͻ���ȡ�����ٱ��档
        
        System.out.println("login befor---------------------" + session.getId());
        session.invalidate();//���session
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
        session = request.getSession(true); // �����µ�session
        System.out.println("login end---------------------" + session.getId());
        //�Ự��ʶδ���� **************

		//������ʱTOKEN��ȡ�û���Ϣ��1004��
		Result resultData = BusClientUtil.invoke(1004, paraMap, "oauthBus");
		logger.info("1004���뷵�صĽ����" + resultData);
		if (resultData != null && resultData.getErr_no() == 0)
		{
			DataRow da = resultData.getData("user_info");
			logger.info("1004���뷵�صĽ���� da" + da);
			String ssoClientId = da.getString("client_id");
			SessionHelper.setString("sso_client_id", ssoClientId, invocation.getRequest().getSession());
			List<DataRow> list = (List) resultData.getList("account_info");
			
			List<DataRow> userInfoList = (List) resultData.getList("user_info");
			
			logger.info("userInfoList:" + userInfoList);
			
			//������ȡ���ʽ��˻� 
			for (Iterator<DataRow> it = list.iterator(); it.hasNext();)
			{
				DataRow data = it.next();
				logger.info("data:" + data);
				
				if ("201".equals(data.getString("acct_type"))) //����ֵ�����ͳһ�˻��ֵ�
				{
					fundAccount = data.getString("acct_value");
					fundAccountType = data.getString("acct_type");
					
					//��ȡ�ʽ��ʺ�����
					DataRow parasMap = new DataRow();
					parasMap.set("corp_id", Configuration.getString("uums.corp_id"));
					parasMap.set("app_id", Configuration.getString("uums.app_id"));
					parasMap.set("acct_type", data.getString("acct_type"));
					parasMap.set("acct_value", fundAccount);
					parasMap.set("access_token", access_token);
					parasMap.set("client_id", client_id);
					logger.info("1113��Σ�" + parasMap);
					Result resultsData = BusClientUtil.invoke(1113, parasMap, "oauthBus");
					logger.info("1113��ȡ�ʽ��ʺ�����Ľ����" + resultsData);
					if (resultsData != null && resultsData.getErr_no() == 0){
						DataRow users = resultsData.getData();
						tradePwd = users.getString("password");
						logger.info("1113��ȡ�ʽ��ʺ�����Ľ����users" + users);
					}
				}
				else if ("301".equals(data.getString("acct_type"))) //����ֵ�����ͳһ�˻��ֵ�
				{
					wechatOpenID = data.getString("acct_value");
				}
			}
			
			DataRow paramMap = new DataRow();
			
			try
			{
				//ͳһ�˻�������ʽ��˻� , ��1000007�����̳ǵ�¼
				if (StringUtils.isNotBlank(fundAccount))
				{
					
					String encry_key = Configuration.getString("uums.encry_key");
					AES aes = new AES(encry_key);
					logger.info("����֮ǰ�����룺" + tradePwd);
					String tradePwdEnc = aes.decrypt(tradePwd);
					logger.info("���ܺ�����룺" + tradePwdEnc);
					
					paramMap.clear();
					paramMap.set("fund_account", fundAccount);
					paramMap.set("trade_pwd", SecurityHelper.encryptDataDouble(tradePwdEnc));
					paramMap.set("mobile_phone", userInfoList.get(0).getString("mobile"));
					paramMap.set("wechat_openid", wechatOpenID);
					paramMap.set("register_id", ssoClientId);
					paramMap.set("ip", (String) reqMap.get("ip"));
					imitateLogin(1000007, paramMap, invocation);
				}
				//�ֻ���δ���ʽ��˻�
				else
				{
					//1.��ѯͳһ�˻��Ƿ�ע���
					paramMap.clear();
					paramMap.set("type", "0");
					paramMap.set("register_id", ssoClientId);
					paramMap.set("mobile_phone", userInfoList.get(0).getString("mobile"));
					Result checkExistResult = BusClientUtil.invoke(1000192, paramMap, "thinkive_mall");
					
					DataRow userExist = null;
					if (checkExistResult != null && checkExistResult.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
					{
						userExist = checkExistResult.getData();
					}
					else
					{
						Result resultVo = new Result();
						resultVo.setErr_no(-100019201);
						resultVo.setErr_info("����1000192�쳣");
						return resultVo;
					}
					
					//�û������� ��ע�� 
					if (null == userExist || "0".equals(userExist.getString("is_exist")))
					{
						paramMap.clear();
						paramMap.set("input_type", "9");
						paramMap.set("input_value", ssoClientId);
						paramMap.set("login_pwd", SecurityHelper.encryptDataDouble(ssoClientId));
						paramMap.set("mobile_phone", userInfoList.get(0).getString("mobile"));
						paramMap.set("wechat_openid", wechatOpenID);
						//						imitateLogin(1000011, paramMap, invocation);
						Result registerResult = BusClientUtil.invoke(1000011, paramMap, "thinkive_mall");
						if (registerResult != null && registerResult.getErr_no() != ErrorEnum.SUCCESS_CODE.getErrorNo())
						{
							
							Result resultVo = new Result();
							resultVo.setErr_no(-100001101);
							resultVo.setErr_info("����1000011�쳣");
							return resultVo;
						}
					}
					//�û����ڵ�¼ 
					//					else
					//					{
					paramMap.clear();
					paramMap.set("login_value", ssoClientId);
					paramMap.set("login_type", "9");
					paramMap.set("login_pwd", SecurityHelper.encryptDataDouble(ssoClientId));
					paramMap.set("mobile_phone", userInfoList.get(0).getString("mobile"));
					paramMap.set("register_id", ssoClientId);
					paramMap.set("ip", (String) reqMap.get("ip"));
					paramMap.set("wechat_openid", wechatOpenID);
					imitateLogin(1000010, paramMap, invocation);
					//					}
				}
			}
			catch (Exception e)
			{
				Result resultVo = new Result();
				resultVo.setErr_no(-999991);
				resultVo.setErr_info(e.getMessage());
				return resultVo;
			}
		}
		else
		{
			Result resultVo = new Result();
			resultVo.setErr_no(-999);
			resultVo.setErr_info("����δ��¼");
			return resultVo;
		}
		result.setErr_no(0);
		result.setErr_info("��¼�ɹ���");
		return result;
	}
	
	/*
	 * ģ���½
	 */
	private Result imitateLogin(int funcNo, DataRow paraMap, ActionInvocation invocation) throws Exception
	{
		logger.info("���ýӿڵ���Σ�" + paraMap);
		// ����ģ���½
		Result result = null;
		String ip = IPHelper.getIpAddr(invocation.getRequest());
		String loginMac = MapHelper.getString(invocation.getParamMap(), "mac");//MAC��ַ
		result = BusClientUtil.invoke(funcNo, paraMap, "thinkive_mall");
		
		if (result != null && result.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
		{
			DataRow datarow = result.getData();
			String branch_no = datarow.getString("branch_no");
			if (StringHelper.isEmpty(branch_no))
			{
				branch_no = " ";
			}
			String user_id = datarow.getString("user_id");
			if (StringHelper.isEmpty(user_id))
			{
				user_id = " ";
			}
			
			String fund_account_ = datarow.getString("fund_account");
			if (StringHelper.isEmpty(fund_account_))
			{
				fund_account_ = " ";
			}
			String clientNo = datarow.getString("client_no");
			if (StringHelper.isEmpty(clientNo))
			{
				clientNo = " ";
			}
			if (StringHelper.isEmpty(ip))
			{
				ip = " ";
			}
			String userName = datarow.getString("user_name");
			if (StringHelper.isEmpty(ip))
			{
				userName = " ";
			}
			
			String lastLoginTime = datarow.getString("last_login_time");
			String firstLoginFlag = datarow.getString("is_first_login");
			
			//			Map userInfoMap = (Map) SessionHelper.getObject(loginAccount, invocation.getRequest().getSession());
			Map userInfoMap = new HashMap();
			userInfoMap.put("branch_no", branch_no.trim());
			userInfoMap.put("password", (String) paraMap.get("password"));
			userInfoMap.put("fund_account", fund_account_.trim());
			userInfoMap.put("ip", ip);
			userInfoMap.put("account", clientNo);
			userInfoMap.put("user_id", user_id.trim());
			userInfoMap.put("client_no", clientNo.trim());
			userInfoMap.put("user_name", userName.trim());
			userInfoMap.put("last_login_time", lastLoginTime);
			userInfoMap.put("is_first_login", firstLoginFlag);
			
			String token = user_id + "|" + fund_account_ + "|" + branch_no + "|" + ip + "|" + loginMac;
			AES aes = new AES(verifyKey);
			
			logger.info("LoginInterceptor.token-----:" + token);
			SessionHelper.setString(WebConstants.SESSION_USER_ID, aes.encrypt(user_id, "UTF-8"), invocation.getRequest().getSession());
			SessionHelper.setString(WebConstants.SESSION_USER_TOKEN, aes.encrypt(token, "UTF-8"), invocation.getRequest().getSession());
			logger.info("LoginInterceptor.token-----:" + invocation.getRequest().getSession());
			
			//�����뱣�浽session��,�󶨳ɹ���ע��ĵ�¼���뽫��Ч
			
			// �������ؼ��ܹ���
			String tradePwd = paraMap.getString("trade_pwd");
			
			//aes����
			tradePwd = aes.encrypt(tradePwd, "UTF-8");
			
			SessionHelper.setString(WebConstants.SESSION_LOGIN_PWD, tradePwd, invocation.getRequest().getSession());
			
			SessionHelper.setObject("session_userinfo_map", userInfoMap, invocation.getRequest().getSession());
			logger.info("**********ģ���½�ɹ�");
		}
		else
		{
			throw new Exception(result.getErr_info());
		}
		return result;
	}
	
}