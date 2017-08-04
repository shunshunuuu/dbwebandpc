package root;

import org.apache.log4j.Logger;

import com.thinkive.base.jdbc.DataRow;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.Util;
import com.thinkive.tbservice.util.JsonHelper;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;

public class GetUrlAction extends BaseAction {

	private static Logger logger = Logger.getLogger(GetUrlAction.class);

	public ActionResult doGetUrl() throws Exception {
		Result resultVo = new Result();
		String openId = getRequest().getParameter("openId");
		String retUrl = Util.getUrl(openId);
		DataRow dataRow = new DataRow();
		dataRow.set("retUrl", retUrl);
		resultVo.setResult(dataRow);
		
		String json = JsonHelper.getJSONString(resultVo);
		logger.info(json);
		this.getWriter().print(json);
		return null;
	}
}