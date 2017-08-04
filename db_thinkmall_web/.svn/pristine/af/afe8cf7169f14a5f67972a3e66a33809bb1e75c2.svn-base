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
 * @描述:与中焯对接统一登录
 * @版权: Copyright (c) 2014 
 * @公司: 思迪科技 
 * @作者: 詹新蕾
 * @版本: 1.0 
 * @创建日期: 2016年2月20日 
 * @创建时间: 下午6:20:45
 */
@SuppressWarnings("serial")
public class Function1105090Intercaptor implements Interceptor
{
    Logger logger = Logger.getLogger(Function1105090Intercaptor.class);

	@Override
	public Result intercept(ActionInvocation invocation) throws Exception {
		
		logger.info("进入Function1105090Intercaptor与中焯对接统一登录拦截器");
		
		Map param = invocation.getParamMap();
		Result result = new Result();
		
		if(param != null){
			
			logger.info(param.toString());
			
			String funcNo = RequestHelper.getString(invocation.getRequest(), "funcNo");
			
			logger.info("接入层请求的功能号为："+funcNo);
			
			if(funcNo.equals("1105090")){
				
				String user_token = MapHelper.getString(param, "user_token");
				if (StringHelper.isEmpty(user_token))
				{
					result.setErr_no(-99);
					result.setErr_info("user_token不允许为空！");
					return result;
				}
				
				String mobilecode = MapHelper.getString(param, "mobilecode");
				if (StringHelper.isEmpty(mobilecode))
				{
					result.setErr_no(-99);
					result.setErr_info("手机号码不允许为空！");
					return result;
				}
				
				logger.info("user_token:"+user_token);
				logger.info("mobilecode:"+mobilecode);
				Map<String, String> paramsMap = new  HashMap<String, String>();
				paramsMap.put("action", FuncConstant.CLIENT_INFO_ACTION);
				paramsMap.put("user_token", user_token);
				paramsMap.put("mobilecode", mobilecode);
				paramsMap.put("APPID", FuncConstant.APPID);
				
				result = paramsSend(FuncConstant.SD_ZZ_LOGIN_URL,paramsMap);
				
				return result;
				
			}
			
		}else{
			
			logger.error("接入层请求Function1105090Intercaptor的参数为空！");
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
				logger.info("index:"+index+"key:"+key+"值："+paramsMap.get(key));
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
			logger.info("01-访问url: "+url+" postMethod:"+postMethod.toString());
			int statusCode = httpClient.executeMethod(postMethod);
			logger.info("返回的http请求状态 statusCode ：" +statusCode+ " HttpStatus: "+HttpStatus.SC_OK);
			if (statusCode == HttpStatus.SC_OK)
			{
				result = postMethod.getResponseBodyAsString();
				DataRow data = new DataRow();
				data.set("result", result);
				resultVo.setResult("result", data);
				logger.info("请求发送成功，errorNo："+result);
			}
			else
			{
				logger.error("请求发送失败，状态码为："+statusCode);
				resultVo.setErr_no(-1);
				resultVo.setErr_info("请求发送失败，errorNo："+result);
			}
		}
		catch (Exception e)
		{
			logger.error("HttpException:error url=" + url, e);
			resultVo.setErr_no(-9);
			resultVo.setErr_info("请求发送失败，系统错误哦！");
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
		
		Function1105090Intercaptor it = new Function1105090Intercaptor();
		String url = FuncConstant.SD_ZZ_LOGIN_URL;
		Map<String,String> paramsMap = new HashMap<String, String>();
		paramsMap.put("action", "46150");
		paramsMap.put("user_token", "MTczMjEzMDI1NDYzMDcwMDAzMTE5ODM2Mzg1OTE%3D");
		paramsMap.put("mobilecode","17321302546");
		paramsMap.put("APPID","id01");
		
		it.paramsSend(url, paramsMap);
	}
}
