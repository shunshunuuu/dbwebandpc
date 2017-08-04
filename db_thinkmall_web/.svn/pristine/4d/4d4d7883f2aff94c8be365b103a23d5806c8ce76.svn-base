package com.thinkive.project.interceptor;

import java.security.PrivateKey;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.Base64;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.RequestHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.RSA;
import com.thinkive.project.util.RSAUtils;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

/**
 * 
 * @描述:对中焯交易密码进行处理 (1105091)
 * @版权: Copyright (c) 2014 
 * @公司: 思迪科技 
 * @作者: 詹新蕾
 * @版本: 1.0 
 * @创建日期: 2016年2月20日 
 * @创建时间: 下午6:20:45
 */
@SuppressWarnings("serial")
public class Function1105091Intercaptor implements Interceptor
{
    Logger logger = Logger.getLogger(Function1105091Intercaptor.class);

	@Override
	public Result intercept(ActionInvocation invocation) throws Exception {
		
		logger.info("进入Function1105091Intercaptor与中焯对接交易密码拦截器");
		
		Map param = invocation.getParamMap();
		Result result = new Result();
		
		if(param != null){
			
			logger.info(param.toString());
			
			String funcNo = RequestHelper.getString(invocation.getRequest(), "funcNo");
			
			logger.info("接入层请求的功能号为："+funcNo);
			
			if(funcNo.equals("1105091")){
				
				String trade_pwd = MapHelper.getString(param, "trade_pwd");
				if (StringHelper.isEmpty(trade_pwd))
				{
					result.setErr_no(-99);
					result.setErr_info("交易密码不允许为空！");
					return result;
				}
				
				logger.info("trade_pwd:"+trade_pwd);
			
				result = decodeTradePwd(trade_pwd);
				return result;
			}
			
		}else{
			
			logger.error("接入层请求Function1105091Intercaptor的参数为空！");
			return result;
		}
		
		 return invocation.invoke();
	}
	/**
	 * 
	 * @描述: 对交易密码进行base64解码和RSA解密
	 * @作者: 詹新蕾
	 * @创建日期: 2016年8月24日 上午11:01:03
	 * @param paramsMap
	 * @return
	 * @throws Exception 
	 */
	private Result decodeTradePwd(String tradepwd) 
	{
		Result resultVo = new Result();
		//先进行BASE64解密
		byte[] trade_pwd  = Base64.decode(tradepwd);
		logger.info("trade_pwd:"+trade_pwd);
		String result = "";
		//将字符串类型的转化为PrivateKey
		try {
			PrivateKey privatekey = RSAUtils.getPrivateKey(Configuration.getString("system.zz_rsaKey"));
			//再rsa解密
			byte[] raw = RSA.decryptZZ(privatekey,trade_pwd);
			//result = String.valueOf(raw);
			result = new String(raw).substring(0, 6);
			logger.info(result.toString());
			DataRow data = new DataRow();
			data.set("trade_pwd", result);
			resultVo.setErr_no(0);
			resultVo.setErr_info("解密成功！");
			resultVo.setResult("result", data);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			resultVo.setErr_no(-9);
			resultVo.setErr_info("RSA解密交易密码失败！");
		}
		
		return resultVo ;
	}	
	
	public static void main(String[] args) {
		
		Function1105091Intercaptor it = new Function1105091Intercaptor();
		Map<String,String> paramsMap = new HashMap<String, String>();
		String trade_pwd = "RBTMLHwBfB69y3N9MAd1dtT3XsyZ2cJowNYbCWDAcGEhNdQSOholXSVddmeMowMy7ZaRND8vL4+TCGSAmYWWOoAWTuRPXcCH+/LGQ2T8ILJLZc7+43gmGLQXMgXgp94KaK78Me5OI9gWFSmW8yWy40hn5GrFkwTTBz2bH21lOxw=";
		it.decodeTradePwd(trade_pwd);
	}
}
