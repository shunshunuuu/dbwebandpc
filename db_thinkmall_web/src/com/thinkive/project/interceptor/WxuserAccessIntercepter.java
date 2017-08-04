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
 * ΢���û�����������أ���ֹ�û�����Ƶ��ˢ��
 * @�������ƣ�IPIntercepter
 * @˵����TODO
 * @������: ������  
 * @����ʱ��: 2016��2��20�� ����10:16:40
 * @�޸���: ������  
 * @�޸�ʱ��: 2016��2��20�� ����10:16:40
 */
public class WxuserAccessIntercepter implements Interceptor
{
	Logger logger = Logger.getLogger(WxuserAccessIntercepter.class);
	private static final long serialVersionUID = 1L;
	
	static String ACCESS_KEY = "wx_bus2json_access@";
	
	@Override
	public Result intercept(ActionInvocation invocation) throws Exception
	{
	    logger.info("�����û��������������");
	    
		Result result = new Result();
		String user_id = MapHelper.getString(invocation.getParamMap(), "user_id");
		if (StringHelper.isEmpty(user_id))
		{
			result.setErr_no(-1000);
			result.setErr_info("���ã��û�user_id������Ϊ�գ�");
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
			result.setErr_info("����,���ڹ���Ƶ�����ʣ����Ժ����ԣ�");
			return result;
		}
		int maxAccessNumber = Configuration.getInt("weixin.maxAccessNumber", 10);//ÿ���������ʴ���
		if (wxuserAccessVo.getCount() > maxAccessNumber)
		{
			wxuserAccessVo.setPermitAccess(false);
			client.setObj(key, wxuserAccessVo, 60);//60���ɾ��
			result.setErr_no(-1000);
			result.setErr_info("���ã����ڷ��ʹ���Ƶ�������Ժ����ԣ�");
			return result;
		}
		wxuserAccessVo.setCount(wxuserAccessVo.getCount() + 1);
		client.setObj(key, wxuserAccessVo, 60);
		return invocation.invoke();
	}
}
