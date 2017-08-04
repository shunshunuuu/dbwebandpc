package com.thinkive.project.interceptor;

import java.util.Map;
import java.util.Random;

import org.apache.log4j.Logger;

import root.ImgCodeContainer;

import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.redis.connection.RedisConnManager;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;
import com.thinkive.weixin.base.ReidsConstants;
import com.thinkive.weixin.base.service.WeiXinRedisClient;
import com.thinkive.weixin.tbas.marketing.base.service.bean.MarketingActivity;

/**
 * 
 * @描述: 活动参与概率拦截
 * @版权: Copyright (c) 2014 
 * @公司: 思迪科技 
 * @作者: 邱育武 
 * @版本: 1.0 
 * @创建日期: 2016年2月20日 
 * @创建时间: 下午6:20:45
 */
public class ActivityFlowIntercepter implements Interceptor
{
    Logger logger = Logger.getLogger(ActivityFlowIntercepter.class);
	private static final long serialVersionUID = 1L;
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
	    logger.info("进入活动参与概率拦截器");
	    
		Result result = new Result();
		Map param = invocation.getParamMap();
		
		String activity_mark = MapHelper.getString(param, "activity_mark");
		if (StringHelper.isEmpty(activity_mark))
		{
			result.setErr_no(-99);
			result.setErr_info("活动key参数不允许为空！");
			return result;
		}
		
		MarketingActivity activity = findMarketingActivityByKey(activity_mark);
		if (activity != null && activity.size() > 0)
		{
			int mun = activity.getInt("probability");//参与机会概率值
			int random = new Random().nextInt(100);
			if (random > mun)
			{
				result.setErr_no(-110502206);
				result.setErr_info("抱歉，当前参与活动人数过多，请稍后再试！");
				return result;
			}
			
			if ("0".equals(activity.getIsNeedPhone()))
			{
				Result result2 = checkCode(param);
				if (result2.getErr_no() != 0)
				{
					result.setErr_no(result2.getErr_no());
					result.setErr_info(result2.getErr_info());
					return result;
				}
			}
		}
		
		return invocation.invoke();
	}
	
	/**
	 * 
	 * @描述：根据活动key查询活动信息
	 * @作者：邱育武
	 * @时间：2016-2-8 下午1:39:03
	 * @param key
	 * @return
	 */
	public MarketingActivity findMarketingActivityByKey(String activity_marker)
	{
		WeiXinRedisClient client = new WeiXinRedisClient();
		String key = ReidsConstants.WX_MARKETING_ACTIVITY + activity_marker;
		MarketingActivity activity = client.getObj(key, MarketingActivity.class);
		if (activity == null || activity.size() == 0)
		{
			return null;
		}
		else
		{
			return activity;
		}
	}
	
	/**
	 * 验证码校验
	 * @描述：
	 * @作者：陈润湖
	 * @时间：2016年2月21日 下午5:46:33
	 */
	public Result checkCode(Map param)
	{
		Result result = new Result();
		if (param != null)
		{
			String ticket = MapHelper.getString(param, "ticket");
			String signKey = MapHelper.getString(param, "signKey");//前端验证码唯一key值
			if (StringHelper.isEmpty(ticket))
			{
				result.setErr_no(ErrorEnum.TICKET_ERROR.getErrorNo());
				result.setErr_info("请输入验证码！");
				return result;
			}
			if (StringHelper.isEmpty(signKey))
			{
				result.setErr_no(ErrorEnum.TICKET_ERROR.getErrorNo());
				result.setErr_info("验证码key参数不能为空！");
				return result;
			}
			String verifyTicket = ImgCodeContainer.getVcode(signKey);//通过key值取出系统中存的唯一验证码
			ImgCodeContainer.removeVcode(signKey);
			if (!ticket.equalsIgnoreCase(verifyTicket))
			{
				result.setErr_no(ErrorEnum.TICKET_ERROR.getErrorNo());
				result.setErr_info("验证码输入不正确！");
				return result;
			}
			
		}
		else
		{
			result.setErr_no(ErrorEnum.TICKET_ERROR.getErrorNo());
			result.setErr_info("请输入验证码！");
			return result;
		}
		result.setErr_no(ErrorEnum.SUCCESS_CODE.getErrorNo());
		result.setErr_info("验证码校验成功");
		return result;
	}
	
	public static void main(String[] args)
	{
		String ip = "10.158.247.16";
		String i = ip.split("\\.")[3];
		String ips = ip.replace(i, "*");//ip网段
		System.out.println(ips);
	}
}
