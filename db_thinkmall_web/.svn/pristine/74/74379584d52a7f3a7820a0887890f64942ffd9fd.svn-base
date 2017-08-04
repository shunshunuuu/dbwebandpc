package root.pay.action;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import root.pay.InfoPay;
import root.pay.util.JumpUtil;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;


public class PageJumpAction extends BaseAction{
	private static Logger logger = Logger.getLogger(PageJumpAction.class);
	public ActionResult doJumpFront(){
		try {
			HttpServletRequest request = getRequest();
			HttpServletResponse response = getResponse();
			Map<String, String> reqParam = InfoPay.getAllRequestParam(request);
			logger.info(reqParam);
			String jumpPage = Configuration.getString("upop.0101");
			
			logger.info("进入页面回调接口，跳转地址："+jumpPage);
			String jumpHtml = JumpUtil.getJumpHtml(jumpPage);
			logger.info(jumpHtml);
			response.setContentType("text/html;charset=UTF-8");   
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(jumpHtml);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	public static void main(String[] args) {
//		PageJumpAction pageJumpAction = new PageJumpAction();
//		pageJumpAction.doJumpFront();
		DataRow dataRow = new DataRow();
		logger.info(dataRow.getString("haha"));
	}
}
