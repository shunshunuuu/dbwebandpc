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
 * @功能  短信发送
 */

public class CheckImage extends BaseAction
{
	private static Logger logger = Logger.getLogger(CheckImage.class);

	/**
	 * @author 杨文杰
	 * @功能 实时验证验证码
	 * @time 2014-12-03 
	 * @return
	 * @throws Exception
	 */
	public ResultVo doCheckI() throws Exception
	{
		Result resultVo = new Result();
		DataRow data = new DataRow();
		String if_code=SessionHelper.getString(AccesserConstants.TICKET, this.getSession());//获取session中的验证码
		String code=this.getStrParameter("if_code");
		logger.info( "原来"+if_code+"验证码=" + code);
		if(StringHelper.isNotEmpty(code) && if_code.equalsIgnoreCase(code)){
			logger.info("验证码正确");
			resultVo.setErr_no(0);
			resultVo.setErr_info("验证码正确!");
		}else{
			resultVo.setErr_no(-1);
			logger.info("验证码");
			resultVo.setErr_info("验证码错误!");
		}
		logger.info( "yanzheng"+resultVo.getErr_no());
		String json = JsonHelper.getJSONString(resultVo);
		logger.info( "json数据"+json);
		this.getWriter().print(json);
		return null;
	}
}