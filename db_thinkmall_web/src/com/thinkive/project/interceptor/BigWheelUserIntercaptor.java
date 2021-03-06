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
import com.thinkive.base.util.security.SecurityHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.FuncConstant;
import com.thinkive.server.ResultVo;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

@SuppressWarnings("serial")
public class BigWheelUserIntercaptor  implements Interceptor {
	 Logger logger = Logger.getLogger(BigWheelUserIntercaptor.class);
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception {
		logger.info("");
		
		Map param = invocation.getParamMap();
		Result result = new Result();
		
		if(param != null){
			
			logger.info(param.toString());
			
			String funcNo = RequestHelper.getString(invocation.getRequest(), "funcNo");
			
			logger.info("接入层请求的功能号为："+funcNo);
			
			if(funcNo.equals("1105094")){
				
				String uid = MapHelper.getString(param, "uid");
				logger.info("uid:"+uid);
				if (StringHelper.isEmpty(uid))
				{
					result.setErr_no(-99);
					result.setErr_info("uid不能为空");
					return result;
				}
				
				String access_token = MapHelper.getString(param, "access_token");
				logger.info("access_token:"+access_token);
				if (StringHelper.isEmpty(access_token))
				{
					result.setErr_no(-99);
					result.setErr_info("access_token不能为空");
					return result;
				}
				String st = MapHelper.getString(param, "st");
				logger.info("st:"+st);
				if (StringHelper.isEmpty(st))
				{
					result.setErr_no(-99);
					result.setErr_info("st不能为空");
					return result;
				}
				
				logger.info("uid:"+uid+",app_secr:"+access_token+",st"+st);
				Map<String, String> paramsMap = new  HashMap<String, String>();
				paramsMap.put("bizcode","thk_user_get_access");
				paramsMap.put("uid", uid);
				paramsMap.put("access_token", access_token);
				paramsMap.put("st", st);
				logger.info("Url地址："+FuncConstant.BIGWHEEL_URL);
				result = paramsSend(FuncConstant.BIGWHEEL_URL,paramsMap);
				return result;
			}
			
		}else{
			
			logger.error("接入层请求BigWheelUserIntercaptor的参数为空！");
			return result;
		}
		
		 return invocation.invoke();
	}

	private Result paramsSend(String url, Map<String, String> paramsMap) {
		Result resultVo = new Result();
		String result = "";
		DataRow datarow = null;
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
				 logger.info("请求发送成功，errorNo："+result);
				 resultVo.setErr_info(result);
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
		BigWheelUserIntercaptor it = new BigWheelUserIntercaptor();
		String url = FuncConstant.BIGWHEEL_URL;
		Map<String,String> paramsMap = new HashMap<String, String>();
		paramsMap.put("bizcode","thk_user_get_access");
		paramsMap.put("uid", "13713936441");
		paramsMap.put("access_token", "79333e7a91eac2739d0842e6dc9dddc86e917eba");
		paramsMap.put("st", "phone_number");
		it.paramsSend(url, paramsMap);
	}
}