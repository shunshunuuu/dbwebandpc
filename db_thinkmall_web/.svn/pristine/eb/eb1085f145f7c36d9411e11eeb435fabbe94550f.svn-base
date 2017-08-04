package com.thinkive.project.interceptor;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.vo.WxuserAccessVo;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;
import com.thinkive.weixin.base.service.WeiXinRedisClient;

/**
 * 微信用户请求访问拦截，防止用户恶意频繁刷屏
 * @类型名称：IPIntercepter
 * @说明：TODO
 * @创建者: 胡常建  
 * @创建时间: 2016年2月20日 上午10:16:40
 * @修改者: 胡常建  
 * @修改时间: 2016年2月20日 上午10:16:40
 */
public class WxuserAccessIntercepter implements Interceptor
{
	Logger logger = Logger.getLogger(WxuserAccessIntercepter.class);
	private static final long serialVersionUID = 1L;
	
	static String ACCESS_KEY = "wx_bus2json_access@";
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
	    logger.info("进入用户请求访问拦截器");
	    
		Result result = new Result();
		String user_id = MapHelper.getString(invocation.getParamMap(), "user_id");
		if (StringHelper.isEmpty(user_id))
		{
			result.setErr_no(-1000);
			result.setErr_info("您好！用户user_id不允许为空！");
			return result;
		}
		int funcNo = invocation.getFuncNo();
		WeiXinRedisClient client = new WeiXinRedisClient();
		String key = ACCESS_KEY + "@" + funcNo + "@" + user_id;
		WxuserAccessVo wxuserAccessVo = client.getObj(key, WxuserAccessVo.class);
		if (wxuserAccessVo == null)
		{
			wxuserAccessVo = new WxuserAccessVo();
		}
		if (!wxuserAccessVo.isPermitAccess())
		{
			result.setErr_no(-1000);
			result.setErr_info("您好,由于过于频繁访问，请稍后再试！");
			return result;
		}
		int maxAccessNumber = Configuration.getInt("weixin.maxAccessNumber", 10);//每分钟最大访问次数
		if (wxuserAccessVo.getCount() > maxAccessNumber)
		{
			wxuserAccessVo.setPermitAccess(false);
			client.setObj(key, wxuserAccessVo, 60);//60秒后删除
			result.setErr_no(-1000);
			result.setErr_info("您好！由于访问过于频繁，请稍后再试！");
			return result;
		}
		wxuserAccessVo.setCount(wxuserAccessVo.getCount() + 1);
		client.setObj(key, wxuserAccessVo, 60);
		return invocation.invoke();
	}
}
