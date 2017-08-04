package com.thinkive.project.interceptor;

import org.apache.log4j.Logger;

import com.thinkive.base.util.MapHelper;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.tbservice.constant.AccesserConstants;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.interceptor.ActionInvocation;
import com.thinkive.tbservice.interceptor.Interceptor;

public class TicketInterceptor implements Interceptor
{
	
	private static Logger logger = Logger.getLogger(TicketInterceptor.class);
	
	public Result intercept(ActionInvocation invocation) throws Exception
	{
		logger.info("进入验证码拦截器");
		String ticket = MapHelper.getString(invocation.getParamMap(), "ticket");
		String loginType = MapHelper.getString(invocation.getParamMap(), "login_type");//值为0时不用校验1103和207的图片验证码  为其它则需要验证
		String funcNo = invocation.getRequest().getParameter("funcNo");
		if ("1001103".equals(funcNo) || "1000207".equals(funcNo))
		{
			if ("0".equals(loginType))
			{
				return invocation.invoke();
			}
		}
		
		// is_check值为false时 010接口不用校验验证码
		String isCheck = MapHelper.getString(invocation.getParamMap(), "is_check"); // 是否需要验证
		if ("1000010".equals(funcNo) && "false".equals(isCheck))
        {
            return invocation.invoke();
        }
		
		String sessionTicket = SessionHelper.getString(AccesserConstants.TICKET, invocation.getRequest().getSession());
		
		logger.debug("ticket:" + ticket + "|sessionTicket:" + sessionTicket + "|sessionID:" + invocation.getRequest().getSession().getId());
		
		if ((StringHelper.isEmpty(ticket)) || (!ticket.equalsIgnoreCase(sessionTicket)))
		{
			Result resultVo = new Result();
			resultVo.setErr_no(ErrorEnum.TICKET_ERROR.getErrorNo());
			resultVo.setErr_info("验证码输入错误");
			return resultVo;
		}
		
		return invocation.invoke();
	}
}
