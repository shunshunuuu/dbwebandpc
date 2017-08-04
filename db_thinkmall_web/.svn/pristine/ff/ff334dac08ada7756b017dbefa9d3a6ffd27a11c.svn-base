package root;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.tbservice.util.JsonHelper;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;
/**
 * @author HUANGRONALDO
 * @功能 统一认证登录系统
 * 
 */
public class TokenAction extends BaseAction
{

	private final static long TOKEN_TIME = Integer.parseInt(Configuration.getString("system.token_time"));

	private final static String verifyKey = Configuration.getString("system.verifyKey");
	/**
	 * @author: HUANGRONALDO
	 * @功能: ajax校验是否登录
	 * @time 2014-08-08 19:56
	 * @return
	 * @throws Exception
	 */
	public ActionResult doAjaxAuthenticated() throws Exception
	{
		Result resultVo = new Result() ;
		String token = SessionHelper.getString(WebConstants.SESSION_USER_TOKEN, this.getSession()) ; //得到session中
		String userId = SessionHelper.getString(WebConstants.SESSION_USER_ID, this.getSession());
		if(StringHelper.isNotEmpty(token) && StringHelper.isNotEmpty(userId)){ //判断session中是否存在token
			AES aes = new AES(verifyKey);
			String tokenStr = aes.decrypt(token, "UTF-8"); 
			String userArr[] = StringHelper.split(tokenStr, "|");//解密session得到用户信息 1、user_id 2、 资金账号 3、营业部  4、ip 5、mac地址
			
			long now = System.currentTimeMillis();
			long time = SessionHelper.getLong(WebConstants.SESSION_TOKEN_TIME, this.getRequest().getSession()) ;

			if(now-time>TOKEN_TIME){//对比上次验证token的时间，防止恶意频繁操作！
				if(userArr!=null && userArr.length==4){
					DataRow data = new DataRow() ;
					String user_id = userArr[0] ;
					data.set("user_id", user_id) ;
					//各站点需要得到的用户信息 ,自行修改或者注释 start 
					resultVo = BusClientUtil.invoke(1000002, data) ;
					//各站点需要得到的用户信息 ,自行修改或者注释 end
					//resultVo.getData().set("token", SessionHelper.getString(WebConstants.SESSION_TOKEN, this.getSession()));
					SessionHelper.setObject(WebConstants.SESSION_USER, resultVo, this.getRequest().getSession()) ;
					SessionHelper.setLong(WebConstants.SESSION_TOKEN_TIME, System.currentTimeMillis(), this.getRequest().getSession()) ;
				}else{
					resultVo.setErr_no(-1) ;
					resultVo.setErr_info("请重新登录!") ;
				}
			}else{
				//各站点需要得到的用户信息 ,自行修改或者注释 start
				resultVo = (Result)SessionHelper.getObject(WebConstants.SESSION_USER, this.getRequest().getSession()) ;
				//各站点需要得到的用户信息 ,自行修改或者注释 end
			}
		}else{
			resultVo.setErr_no(-1) ;
			resultVo.setErr_info("请重新登录!") ;
		}
		String json = JsonHelper.getJSONString(resultVo);
		this.getWriter().print(json);
		return null;
	}

	/**
	 * @author: HUANGRONALDO
	 * @功能: 统一登录,首先获取临时token 再根据临时token验证登录
	 * @param appId 站点id
	 * @param appSecret app密钥
	 * @param toAppId 要跳转到的appid
	 * @time 2014-08-08 19:56
	 * @return
	 * @throws Exception
	 */
	public ActionResult doTokenAuth() throws Exception
	{
		//统一登录
		return null ;
	}
}
