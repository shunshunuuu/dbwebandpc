package com.thinkive.project.interceptor;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;

import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.RequestHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.SecurityHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.FuncConstant;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 
 * @����: ���˻���ݲ�������
 * @��Ȩ: Copyright (c) 2014 
 * @��˾: ˼�ϿƼ� 
 * @����: ղ����
 * @�汾: 1.0 
 * @��������: 2016��2��20�� 
 * @����ʱ��: ����6:20:45
 */
@SuppressWarnings("serial")
public class Function1105088Intercaptor implements Interceptor
{
    Logger logger = Logger.getLogger(Function1105088Intercaptor.class);

	@Override
	public Result intercept(ActionInvocation invocation) throws Exception {
		
		logger.info("����Function1105088Intercaptor���˻����������");
		
		Map param = invocation.getParamMap();
		Result result = new Result();
		
		if(param != null){
			
			logger.info(param.toString());
			
			String funcNo = RequestHelper.getString(invocation.getRequest(), "funcNo");
			
			logger.info("���������Ĺ��ܺ�Ϊ��"+funcNo);
			
			if(funcNo.equals("1105088")){
				
				String phone = MapHelper.getString(param, "phone");
				if (StringHelper.isEmpty(phone))
				{
					result.setErr_no(-99);
					result.setErr_info("�Ƽ��˵��ֻ����벻����Ϊ�գ�");
					return result;
				}
				
				String phone_reco = MapHelper.getString(param, "phone_reco");
				if (StringHelper.isEmpty(phone_reco))
				{
					result.setErr_no(-99);
					result.setErr_info("���Ƽ��˵��ֻ����벻����Ϊ�գ�");
					return result;
				}
				
				logger.info("phone:"+phone+",phone_reco:"+phone_reco);
				Map<String, String> paramsMap = new  HashMap<String, String>();
				paramsMap.put("phone", phone);
				paramsMap.put("phone_reco", phone_reco);
				paramsMap.put("type","5");
				//paramsMap.put("token_key", FuncConstant.AOYUN_TOKEN_KEY);
				String token = md5Url(paramsMap);
				logger.info("����token������"+paramsMap.toString()+" type:"+paramsMap.get("type"));
				paramsMap.put("token", token);
				logger.info("Url��ַ��"+FuncConstant.AOYUN_PRE_URL);
				result = paramsSend(FuncConstant.AOYUN_PRE_URL,paramsMap);
				return result;
			}
			
		}else{
			
			logger.error("���������Function1105088Intercaptor�Ĳ���Ϊ�գ�");
			return result;
		}
		
		 return invocation.invoke();
	}
		
	private String md5Url(Map<String, String> paramsMap)
	{
		String phone = paramsMap.get("phone");
		String phone_reco = paramsMap.get("phone_reco");
		String type = paramsMap.get("type");
		String token_key = FuncConstant.AOYUN_TOKEN_KEY;
		String params = type +  phone + phone_reco + token_key;
		logger.info("**params:"+params);
		String token  = SecurityHelper.getMD5of32Str(params);
		System.out.println("paramMD5 ͨ�� MD5 ���ܺ���ַ����� "+token );
		logger.info("**token:"+token);
		return token ;
		
	}
	
	public Result paramsSend(String url, Map<String, String> paramsMap)
	{
		Result resultVo = new Result();
		String result = "";
		PostMethod postMethod = null;
		
		
		HttpClient httpClient = new HttpClient();
		
		httpClient.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
		
		url = url+"?";
		if (paramsMap != null && paramsMap.size() > 0)
		{
			NameValuePair[] datas = new NameValuePair[paramsMap.size()];
			int index = 0;
			for (String key : paramsMap.keySet())
			{
				logger.info("index:"+index+"key:"+key+"ֵ��"+paramsMap.get(key));
				datas[index++] = new NameValuePair(key, paramsMap.get(key));
				url = url+"&"+key+"="+paramsMap.get(key);
			}
			//postMethod.setRequestBody(datas);
		}
		postMethod = new PostMethod(url);
		url = url.replaceFirst("&", "");
        logger.info("**URL:"+url);
		
		
		HttpClientParams httparams = new HttpClientParams();
		httparams.setSoTimeout(60000);
		postMethod.setParams(httparams);
		try
		{
			logger.info("01-����url: "+url+" postMethod:"+postMethod.toString());
			int statusCode = httpClient.executeMethod(postMethod);
			logger.info("���ص�http����״̬ statusCode ��" +statusCode+ " HttpStatus: "+HttpStatus.SC_OK);
			if (statusCode == HttpStatus.SC_OK)
			{
				result = postMethod.getResponseBodyAsString();
				 logger.info("�����ͳɹ���errorNo��"+result);
			}
			else
			{
				logger.error("������ʧ�ܣ�״̬��Ϊ��"+statusCode);
				resultVo.setErr_no(-1);
				resultVo.setErr_info("������ʧ�ܣ�errorNo��"+result);
			}
		}
		catch (Exception e)
		{
			logger.error("HttpException:error url=" + url, e);
			resultVo.setErr_no(-9);
			resultVo.setErr_info("������ʧ�ܣ�ϵͳ����Ŷ��");
		}
		finally
		{
			if (postMethod != null)
			{
				postMethod.releaseConnection();
			}
		}
		return resultVo;
	}
	
	
	public static void main(String[] args) {
		
		Function1105088Intercaptor it = new Function1105088Intercaptor();
		String url = FuncConstant.AOYUN_PRE_URL;
		Map<String,String> paramsMap = new HashMap<String, String>();
		paramsMap.put("phone", "17004964322");
		paramsMap.put("phone_reco", "13222222222");
		paramsMap.put("type","5");
		//paramsMap.put("token_key", FuncConstant.AOYUN_TOKEN_KEY);
		String token = it.md5Url(paramsMap);
		System.out.println("����token������"+paramsMap.toString()+" type:"+paramsMap.get("type"));
		paramsMap.put("token", token);
		it.paramsSend(url, paramsMap);
	}
}
