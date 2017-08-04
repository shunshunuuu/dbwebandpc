package root.pay;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;







import root.pay.util.JumpUtil;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.RequestHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.project.util.URLDecodeUtil;
import com.thinkive.server.InvokeException;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;
import com.unionpay.acp.demo.DemoBase;
import com.unionpay.acp.sdk.AcpService;
import com.unionpay.acp.sdk.LogUtil;
import com.unionpay.acp.sdk.SDKConfig;

/**
 * 重要：联调测试时请仔细阅读注释！
 * 
 * 产品：跳转网关支付产品<br>
 * 交易：交易状态查询交易：只有同步应答 <br>
 * 日期： 2015-09<br>
 * 版本： 1.0.0 
 * 版权： 中国银联<br>
 * 说明：以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己需要，按照技术文档编写。该代码仅供参考，不提供编码性能及规范性等方面的保障<br>
 * 该接口参考文档位置：open.unionpay.com帮助中心 下载  产品接口规范  《网关支付产品接口规范》，<br>
 *              《平台接入接口规范-第5部分-附录》（内包含应答码接口规范，全渠道平台银行名称-简码对照表）<br>
 * 测试过程中的如果遇到疑问或问题您可以：1）优先在open平台中查找答案：
 * 							        调试过程中的问题或其他问题请在 https://open.unionpay.com/ajweb/help/faq/list 帮助中心 FAQ 搜索解决方案
 *                             测试过程中产生的6位应答码问题疑问请在https://open.unionpay.com/ajweb/help/respCode/respCodeList 输入应答码搜索解决方案
 *                           2） 咨询在线人工支持： open.unionpay.com注册一个用户并登陆在右上角点击“在线客服”，咨询人工QQ测试支持。
 * 交易说明： 1）对前台交易发起交易状态查询：前台类交易建议间隔（5分、10分、30分、60分、120分）发起交易查询，如果查询到结果成功，则不用再查询。（失败，处理中，查询不到订单均可能为中间状态）。也可以建议商户使用payTimeout（支付超时时间），过了这个时间点查询，得到的结果为最终结果。
 *        2）对后台交易发起交易状态查询：后台类资金类交易同步返回00，成功银联有后台通知，商户也可以发起 查询交易，可查询N次（不超过6次），每次时间间隔2N秒发起,即间隔1，2，4，8，16，32S查询（查询到03，04，05继续查询，否则终止查询）。
 *        					         后台类资金类同步返03 04 05响应码及未得到银联响应（读超时）需发起查询交易，可查询N次（不超过6次），每次时间间隔2N秒发起,即间隔1，2，4，8，16，32S查询（查询到03，04，05继续查询，否则终止查询）。
 */
public class InfoQuery extends BaseAction {

	/**
	 * 
	 */
	private static Logger logger = Logger.getLogger(InfoQuery.class);

	
	public ActionResult doDefault() throws Exception{

			HttpServletRequest req = getRequest();
			HttpServletResponse resp = getResponse();
			String order_no = URLDecodeUtil.decode(RequestHelper.getString(req, "order_no")) ; //订单流水编号
			String pay_time = URLDecodeUtil.decode(RequestHelper.getString(req, "pay_time")) ; //订单支付时间
			String fund_account = URLDecodeUtil.decode(RequestHelper.getString(req, "fund_account")) ; //账号
			String user_id = URLDecodeUtil.decode(RequestHelper.getString(req, "user_id")) ; //用户id
			String order_id = URLDecodeUtil.decode(RequestHelper.getString(req, "order_id")) ; //订单流水编号
			Map<String, String> data = new HashMap<String, String>();
			SDKConfig.getConfig().loadPropertiesFromSrc();
			
			/***银联全渠道系统，产品参数，除了encoding自行选择外其他不需修改***/
			data.put("version", DemoBase.version);                 //版本号
			data.put("encoding", DemoBase.encoding_UTF8);               //字符集编码 可以使用UTF-8,GBK两种方式
			data.put("signMethod", "01");                          //签名方法 目前只支持01-RSA方式证书加密
			data.put("txnType", "00");                             //交易类型 00-默认
			data.put("txnSubType", "00");                          //交易子类型  默认00
			data.put("bizType", "000201");                         //业务类型 B2C网关支付，手机wap支付
			
			/***商户接入参数***/
			data.put("merId", "777290058136696");                  //商户号码，请改成自己申请的商户号或者open上注册得来的777商户号测试
			data.put("accessType", "0");                           //接入类型，商户接入固定填0，不需修改
			
			/***要调通交易以下字段必须修改***/
			data.put("orderId", order_no);                 //****商户订单号，每次发交易测试需修改为被查询的交易的订单号
			data.put("txnTime", pay_time);                 //****订单发送时间，每次发交易测试需修改为被查询的交易的订单发送时间
//			data.put("orderId", "201612151409381511");                 //****商户订单号，每次发交易测试需修改为被查询的交易的订单号
//			data.put("txnTime", "20161215140938");
			/**请求参数设置完毕，以下对请求参数进行签名并发送http post请求，接收同步应答报文------------->**/
			
			Map<String, String> reqData = AcpService.sign(data,DemoBase.encoding_UTF8);//报文中certId,signature的值是在signData方法中获取并自动赋值的，只要证书配置正确即可。
			
			String url = SDKConfig.getConfig().getSingleQueryUrl();// 交易请求url从配置文件读取对应属性文件acp_sdk.properties中的 acpsdk.singleQueryUrl
			//这里调用signData之后，调用submitUrl之前不能对submitFromData中的键值对做任何修改，如果修改会导致验签不通过
			Map<String, String> rspData = AcpService.post(reqData,url,DemoBase.encoding_UTF8);
			
			/**对应答码的处理，请根据您的业务逻辑来编写程序,以下应答码处理逻辑仅供参考------------->**/
			//应答码规范参考open.unionpay.com帮助中心 下载  产品接口规范  《平台接入接口规范-第5部分-附录》
			if(!rspData.isEmpty()){
				if(AcpService.validate(rspData, DemoBase.encoding_UTF8)){
					LogUtil.writeLog("验证签名成功");
					if("00".equals(rspData.get("respCode"))){//如果查询交易成功
						//处理被查询交易的应答码逻辑
						String origRespCode = rspData.get("origRespCode");
						if("00".equals(origRespCode)){
							//交易成功，更新商户订单状态
							DataRow dataRow = new DataRow() ;
							dataRow.set("order_id", order_id) ; 
							dataRow.set("pay_account", fund_account) ; 
							dataRow.set("user_id", user_id) ; 
							dataRow.set("integral", 0); 
							dataRow.set("pay_type", 7) ; 
							Result result = BusClientUtil.invoke(1000117, dataRow); //调bus接口
							logger.info(result);
							logger.info("err_no:"+result.getErr_no());
							logger.info("err_info:"+result.getErr_info());
							logger.info("确认订单接口返回数据："+result.getData());
							
							if(result.getErr_no() == -1){
								logger.info(result.getErr_info());
							}
							else if(result.getErr_no() == 0){
								String order_tot_price = result.getData().getString("order_tot_price");
								String service_end_time = result.getData().getString("service_end_time");
								String product_name = result.getData().getString("product_name");
								String jumpPage = Configuration.getString("upop.0102");
								String urla="&order_tot_price="+order_tot_price+"&service_end_time="+service_end_time+"&product_name="+product_name+"&order_no="+order_no;
								String pageUrl = jumpPage+urla;
								logger.info("地址"+urla);
								logger.info("进入页面回调接口，跳转地址："+pageUrl);
								String jumpHtml = JumpUtil.getJumpHtml(jumpPage);
								logger.info(jumpHtml);
								resp.setContentType("text/html;charset=UTF-8");   
								resp.setCharacterEncoding("UTF-8");
								resp.getWriter().write(jumpHtml);
							}else{
								logger.info("支付确认失败："+result.getErr_info()) ;
								throw new InvokeException("支付确认失败："+result.getErr_info(), 1);
							}
						}else if("03".equals(origRespCode) ||
								 "04".equals(origRespCode) ||
								 "05".equals(origRespCode)){
							//需再次发起交易状态查询交易 
							//TODO
						}else{
							//其他应答码为失败请排查原因
							//TODO
						}
					}else{//查询交易本身失败，或者未查到原交易，检查查询交易报文要素
						//TODO
					}
				}else{
					LogUtil.writeErrorLog("验证签名失败");
					//TODO 检查验证签名失败的原因
				}
			}else{
				//未返回正确的http状态
				LogUtil.writeErrorLog("未获取到返回报文或返回http状态码非200");
			}
			return null;
	}

}
