package root;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.tbservice.constant.ErrorEnum;
import com.thinkive.tbservice.util.JsonHelper;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;

/**
 * @author HUANGRONALDO
 * @time 2014-11-13
 * @功能  短信发送
 */

public class SmsAction extends BaseAction
{
	
	private static Logger logger = Logger.getLogger(SmsAction.class);
	
	private final static long INTERVAL = 60000;//定义间隔时间为60秒
	
	private String isSmsVerify = Configuration.getString("system.is_sms_verify") ;//是否需要校验手机验证码
	
	/**
	 * @author HUANGRONALDO
	 * @功能 发送手机验证码
	 * @time 2014-11-13 
	 * @return
	 * @throws Exception
	 */
	public ActionResult doSmsSend() throws Exception
	{
		Result resultVo = new Result();
		String mobile = this.getStrParameter("mobile");
		String type = this.getStrParameter("type");
		DataRow data = new DataRow();
		data.set("mobile", mobile);
		data.set("type", type);
		long now = System.currentTimeMillis();
		long time = SessionHelper.getLong(WebConstants.SESSION_MOBILE_VF_CODE_TIME, this.getRequest().getSession());
		
		if (now - time > INTERVAL)
		{//对比上次验证码时间，防止恶意频繁操作！
			resultVo = BusClientUtil.invoke(1000360, data);
			if (resultVo != null && resultVo.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
			{
				DataRow resultData = resultVo.getData(); //登录成功后，接口返回信息
				String code = resultData.getString("code");
				SessionHelper.setLong(WebConstants.SESSION_MOBILE_VF_CODE_TIME, System.currentTimeMillis(), this.getRequest().getSession());//记录本次生成验证码时间
				logger.info("手机号码:" + mobile + "验证码：" + code);
				SessionHelper.setString(WebConstants.SESSION_MOBILE_VF_CODE, code, this.getRequest().getSession());
				resultData.remove("code");
			}
			SessionHelper.setString(WebConstants.SESSION_VF_MOBILE, mobile, this.getRequest().getSession());
		}
		else
		{
			resultVo.setErr_no(-1);
			resultVo.setErr_info("请不要频繁操作！");
		}
		
		String json = JsonHelper.getJSONString(resultVo);
		logger.info(json);
		this.getWriter().print(json);
		return null;
	}
	
	/**
	 * @author HUANGRONALDO
	 * @功能 发送手机验证码
	 * @time 2014-11-13 
	 * @return
	 * @throws Exception
	 */
	public ActionResult doSmsVerify() throws Exception
	{
		Result resultVo = new Result();
		String mobileVfCode = this.getStrParameter("mobile_vf_code");//手机验证码入参
		String mobile = this.getStrParameter("mobile");//手机验证码入参
		String mobileVCodeSession = SessionHelper.getString(WebConstants.SESSION_MOBILE_VF_CODE, this.getSession()) ; //得到session中手机验证码
		String mobileSession = SessionHelper.getString(WebConstants.SESSION_VF_MOBILE, this.getSession()) ; //得到session中手机验证码
		//对比入参手机验证码与session中验证码
		logger.info("手机号码:" + mobile + "上次手机号码：" + mobileSession);
		logger.info("是否启用手机校验:" + isSmsVerify + "校验码：" + mobileVfCode+"上次校验码"+mobileVCodeSession);
		if("0".equals(isSmsVerify) || (StringHelper.isNotEmpty(mobile) && mobile.equals(mobileSession))){
			if("0".equals(isSmsVerify) || (StringHelper.isNotEmpty(mobileVfCode) && mobileVfCode.equals(mobileVCodeSession))){
				resultVo.setErr_no(0);
				resultVo.setErr_info("手机验证码验证成功！");
			}else{
				resultVo.setErr_no(-1);
				resultVo.setErr_info("手机验证码验证失败！");
			}
		}else{
			resultVo.setErr_no(-2);
			resultVo.setErr_info("验证的手机号码与发送短信的手机号码不一致!");
		}
		
		
		String json = JsonHelper.getJSONString(resultVo);
		this.getWriter().print(json);
		return null;
	}
}