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

import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.RequestHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.FuncConstant;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 
 * @����:Ƕ����˵���������
 * @��Ȩ: Copyright (c) 2014 
 * @��˾: ˼�ϿƼ� 
 * @����: ղ����
 * @�汾: 1.0 
 * @��������: 2016��2��20�� 
 * @����ʱ��: ����6:20:45
 */
@SuppressWarnings("serial")
public class Function1105089Intercaptor implements Interceptor
{
    Logger logger = Logger.getLogger(Function1105089Intercaptor.class);

	@Override
	public Result intercept(ActionInvocation invocation) throws Exception {
		
		logger.info("����Function1105089IntercaptorǶ����˵�����������");
		
		Map param = invocation.getParamMap();
		Result result = new Result();
		
		if(param != null){
			
			logger.info(param.toString());
			
			String funcNo = RequestHelper.getString(invocation.getRequest(), "funcNo");
			
			logger.info("���������Ĺ��ܺ�Ϊ��"+funcNo);
			
			if(funcNo.equals("1105089")){
				
				String client_id = MapHelper.getString(param, "fund_account");
				if (StringHelper.isEmpty(client_id))
				{
					result.setErr_no(-99);
					result.setErr_info("�ʽ��˺Ų�����Ϊ�գ�");
					return result;
				}
				
				logger.info("client_id:"+client_id);
				Map<String, String> paramsMap = new  HashMap<String, String>();
				paramsMap.put("client_id", client_id);
				paramsMap.put("channel_code", FuncConstant.CHANNEL_CODE);
				
				result = paramsSend(FuncConstant.MY_ACCOUNT_URL,paramsMap);
				
				return result;
				
			}
			
		}else{
			
			logger.error("���������Function1105089Intercaptor�Ĳ���Ϊ�գ�");
			return result;
		}
		
		 return invocation.invoke();
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
				DataRow data = new DataRow();
				data.set("result", result);
				resultVo.setResult("result", data);
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
	
	
	/*public static void main(String[] args) {
		
		Function1105089Intercaptor it = new Function1105089Intercaptor();
		String url = FuncConstant.AOYUN_PRE_URL;
		Map<String,String> paramsMap = new HashMap<String, String>();
		paramsMap.put("phone", "17004964322");
		paramsMap.put("phone_reco", "123456789");
		paramsMap.put("type","5");
		
		it.paramsSend(url, paramsMap);
	}*/
}
