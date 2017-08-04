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
 * @����  ���ŷ���
 */

public class SmsAction extends BaseAction
{
	
	private static Logger logger = Logger.getLogger(SmsAction.class);
	
	private final static long INTERVAL = 60000;//������ʱ��Ϊ60��
	
	private String isSmsVerify = Configuration.getString("system.is_sms_verify") ;//�Ƿ���ҪУ���ֻ���֤��
	
	/**
	 * @author HUANGRONALDO
	 * @���� �����ֻ���֤��
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
		{//�Ա��ϴ���֤��ʱ�䣬��ֹ����Ƶ��������
			resultVo = BusClientUtil.invoke(1000360, data);
			if (resultVo != null && resultVo.getErr_no() == ErrorEnum.SUCCESS_CODE.getErrorNo())
			{
				DataRow resultData = resultVo.getData(); //��¼�ɹ��󣬽ӿڷ�����Ϣ
				String code = resultData.getString("code");
				SessionHelper.setLong(WebConstants.SESSION_MOBILE_VF_CODE_TIME, System.currentTimeMillis(), this.getRequest().getSession());//��¼����������֤��ʱ��
				logger.info("�ֻ�����:" + mobile + "��֤�룺" + code);
				SessionHelper.setString(WebConstants.SESSION_MOBILE_VF_CODE, code, this.getRequest().getSession());
				resultData.remove("code");
			}
			SessionHelper.setString(WebConstants.SESSION_VF_MOBILE, mobile, this.getRequest().getSession());
		}
		else
		{
			resultVo.setErr_no(-1);
			resultVo.setErr_info("�벻ҪƵ��������");
		}
		
		String json = JsonHelper.getJSONString(resultVo);
		logger.info(json);
		this.getWriter().print(json);
		return null;
	}
	
	/**
	 * @author HUANGRONALDO
	 * @���� �����ֻ���֤��
	 * @time 2014-11-13 
	 * @return
	 * @throws Exception
	 */
	public ActionResult doSmsVerify() throws Exception
	{
		Result resultVo = new Result();
		String mobileVfCode = this.getStrParameter("mobile_vf_code");//�ֻ���֤�����
		String mobile = this.getStrParameter("mobile");//�ֻ���֤�����
		String mobileVCodeSession = SessionHelper.getString(WebConstants.SESSION_MOBILE_VF_CODE, this.getSession()) ; //�õ�session���ֻ���֤��
		String mobileSession = SessionHelper.getString(WebConstants.SESSION_VF_MOBILE, this.getSession()) ; //�õ�session���ֻ���֤��
		//�Ա�����ֻ���֤����session����֤��
		logger.info("�ֻ�����:" + mobile + "�ϴ��ֻ����룺" + mobileSession);
		logger.info("�Ƿ������ֻ�У��:" + isSmsVerify + "У���룺" + mobileVfCode+"�ϴ�У����"+mobileVCodeSession);
		if("0".equals(isSmsVerify) || (StringHelper.isNotEmpty(mobile) && mobile.equals(mobileSession))){
			if("0".equals(isSmsVerify) || (StringHelper.isNotEmpty(mobileVfCode) && mobileVfCode.equals(mobileVCodeSession))){
				resultVo.setErr_no(0);
				resultVo.setErr_info("�ֻ���֤����֤�ɹ���");
			}else{
				resultVo.setErr_no(-1);
				resultVo.setErr_info("�ֻ���֤����֤ʧ�ܣ�");
			}
		}else{
			resultVo.setErr_no(-2);
			resultVo.setErr_info("��֤���ֻ������뷢�Ͷ��ŵ��ֻ����벻һ��!");
		}
		
		
		String json = JsonHelper.getJSONString(resultVo);
		this.getWriter().print(json);
		return null;
	}
}