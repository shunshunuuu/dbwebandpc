package root;

import org.apache.log4j.Logger;

import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.tbservice.constant.AccesserConstants;
import com.thinkive.tbservice.result.ResultVo;
import com.thinkive.tbservice.util.JsonHelper;
import com.thinkive.web.base.BaseAction;

/**
 * @author HUANGRONALDO
 * @time 2014-11-13
 * @����  ���ŷ���
 */

public class CheckImage extends BaseAction
{
	private static Logger logger = Logger.getLogger(CheckImage.class);

	/**
	 * @author ���Ľ�
	 * @���� ʵʱ��֤��֤��
	 * @time 2014-12-03 
	 * @return
	 * @throws Exception
	 */
	public ResultVo doCheckI() throws Exception
	{
		Result resultVo = new Result();
		DataRow data = new DataRow();
		String if_code=SessionHelper.getString(AccesserConstants.TICKET, this.getSession());//��ȡsession�е���֤��
		String code=this.getStrParameter("if_code");
		logger.info( "ԭ��"+if_code+"��֤��=" + code);
		if(StringHelper.isNotEmpty(code) && if_code.equalsIgnoreCase(code)){
			logger.info("��֤����ȷ");
			resultVo.setErr_no(0);
			resultVo.setErr_info("��֤����ȷ!");
		}else{
			resultVo.setErr_no(-1);
			logger.info("��֤��");
			resultVo.setErr_info("��֤�����!");
		}
		logger.info( "yanzheng"+resultVo.getErr_no());
		String json = JsonHelper.getJSONString(resultVo);
		logger.info( "json����"+json);
		this.getWriter().print(json);
		return null;
	}
}