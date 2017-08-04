package root.pay;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ObjectUtils;
import org.apache.log4j.Logger;

import root.pay.util.JumpUtil;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.RequestHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.project.util.IPHelper;
import com.thinkive.project.util.URLDecodeUtil;
import com.thinkive.server.InvokeException;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;
import com.unionpay.acp.demo.DemoBase;
import com.unionpay.acp.sdk.AcpService;
import com.unionpay.acp.sdk.SDKConfig;
import com.unionpay.acp.sdk.SDKConstants;


public class InfoPay extends BaseAction{
	private static Logger logger = Logger.getLogger(InfoPay.class);
	private static String ip = null;
	public ActionResult doDefault() throws Exception{
		logger.info("调用银联网关支付开始》》》》");
		try {
			HttpServletRequest request = getRequest();
			ip = URLDecodeUtil.decode(RequestHelper.getString(request, "ip"));
			System.out.println("获取到的ip为------------------"+ip);
			HttpServletResponse response = getResponse();
			String totalAmount = URLDecodeUtil.decode(RequestHelper.getString(request, "tot_price")) ; //支付金额
			System.out.println("支付金额为-------------------------------"+totalAmount);
			String orderId = URLDecodeUtil.decode(RequestHelper.getString(request, "order_no")) ; //订单ID
			
			
			int totalAmountInt =  (int)(Float.parseFloat(totalAmount) * 100) ;
			System.out.println("-------------------支付金额------------"+totalAmountInt);
			SDKConfig.getConfig().loadPropertiesFromSrc(); //从classpath加载acp_sdk.properties文件
			
			Map<String, String> requestData = new HashMap<String, String>();
			
			/***银联全渠道系统，产品参数，除了encoding自行选择外其他不需修改***/
			requestData.put("version", DemoBase.version);   			  //版本号，全渠道默认值
			requestData.put("encoding", DemoBase.encoding_UTF8); 			  //字符集编码，可以使用UTF-8,GBK两种方式
			requestData.put("signMethod", "01");            			  //签名方法，只支持 01：RSA方式证书加密
			requestData.put("txnType", "01");               			  //交易类型 ，01：消费
			requestData.put("txnSubType", "01");            			  //交易子类型， 01：自助消费
			requestData.put("bizType", "000201");           			  //业务类型，B2C网关支付，手机wap支付
			requestData.put("channelType", "07");           			  //渠道类型，这个字段区分B2C网关支付和手机wap支付；07：PC,平板  08：手机
			
			/***商户接入参数***/
			requestData.put("merId", DemoBase.merId);    	          			  //商户号码，请改成自己申请的正式商户号或者open上注册得来的777测试商户号
			requestData.put("accessType", "0");             			  //接入类型，0：直连商户 
			//requestData.put("orderId",DemoBase.getOrderId());             //商户订单号，8-40位数字字母，不能含“-”或“_”，可以自行定制规则		
			requestData.put("txnTime", DemoBase.getCurrentTime());        //订单发送时间，取系统时间，格式为YYYYMMDDhhmmss，必须取当前时间，否则会报txnTime无效
			requestData.put("currencyCode", "156");         			  //交易币种（境内商户一般是156 人民币）		
			requestData.put("txnAmt", ObjectUtils.toString(totalAmountInt));             			      //交易金额，单位分，不要带小数点
			//requestData.put("reqReserved", "透传字段");        		      //请求方保留域，如需使用请启用即可；透传字段（可以实现商户自定义参数的追踪）本交易的后台通知,对本交易的交易状态查询交易、对账文件中均会原样返回，商户可以按需上传，长度为1-1024个字节		
			
	
			requestData.put("orderId",orderId);    //支付订单流水
			//requestData.put("orderTime",orderTime);    //支付订单时间
			
			//前台通知地址 （需设置为外网能访问 http https均可），支付成功后的页面 点击“返回商户”按钮的时候将异步通知报文post到该地址
			//如果想要实现过几秒中自动跳转回商户页面权限，需联系银联业务申请开通自动返回商户权限
			//异步通知参数详见open.unionpay.com帮助中心 下载  产品接口规范  网关支付产品接口规范 消费交易 商户通知
			requestData.put("frontUrl", DemoBase.frontUrl);
			
			//后台通知地址（需设置为【外网】能访问 http https均可），支付成功后银联会自动将异步通知报文post到商户上送的该地址，失败的交易银联不会发送后台通知
			//后台通知参数详见open.unionpay.com帮助中心 下载  产品接口规范  网关支付产品接口规范 消费交易 商户通知
			//注意:1.需设置为外网能访问，否则收不到通知    2.http https均可  3.收单后台通知后需要10秒内返回http200或302状态码 
			//    4.如果银联通知服务器发送通知后10秒内未收到返回状态码或者应答码非http200，那么银联会间隔一段时间再次发送。总共发送5次，每次的间隔时间为0,1,2,4分钟。
			//    5.后台通知地址如果上送了带有？的参数，例如：http://abc/web?a=b&c=d 在后台通知处理程序验证签名之前需要编写逻辑将这些字段去掉再验签，否则将会验签失败
			requestData.put("backUrl", DemoBase.backUrl);
			
			
			//////////////////////////////////////////////////
			//
			//       报文中特殊用法请查看 PCwap网关跳转支付特殊用法.txt
			//
			//////////////////////////////////////////////////
			
			/**请求参数设置完毕，以下对请求参数进行签名并生成html表单，将表单写入浏览器跳转打开银联页面**/
			Map<String, String> submitFromData = AcpService.sign(requestData,DemoBase.encoding_UTF8);  //报文中certId,signature的值是在signData方法中获取并自动赋值的，只要证书配置正确即可。
			
			String requestFrontUrl = SDKConfig.getConfig().getFrontRequestUrl();  //获取请求银联的前台地址：对应属性文件acp_sdk.properties文件中的acpsdk.frontTransUrl
			String html = AcpService.createAutoFormHtml(requestFrontUrl, submitFromData,DemoBase.encoding_UTF8);   //生成自动跳转的Html表单
			
			logger.info("打印请求HTML，此为请求报文，为联调排查问题的依据："+html);
			//将生成的html写到浏览器中完成自动跳转打开银联支付页面；这里调用signData之后，将html写到浏览器跳转到银联页面之前均不能对html中的表单项的名称和值进行修改，如果修改会导致验签不通过
			response.setContentType("text/html;charset=UTF-8");   
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(html);
		
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		return null;
	}
	
	
	/**
	 * @功能：银联订单支付-后台回调
	 * @author：吴龙宝
	 * @time：
	 * @return
	 * @throws IOException 
	 * @throws ServletException 
	 * @throws Exception
	 */
	public ActionResult doBackUpop() throws ServletException, IOException{
		logger.info("银联支付后台回调开始》》》》---------------------------");
		HttpServletRequest req = getRequest();
		HttpServletResponse resp = getResponse();
		try {

			SDKConfig.getConfig().loadPropertiesFromSrc(); //从classpath加载acp_sdk.properties文件
			
			String encoding = req.getParameter(SDKConstants.param_encoding);
			// 获取银联通知服务器发送的后台通知参数
			logger.info("开始获取银联返回报文》》》");
			Map<String, String> reqParam = getAllRequestParam(req);
			logger.info(reqParam);
			reqParam.remove("function");   //web框架服务器增加了一个function参数导致验签失败
			logger.info("去掉function后的返回报文："+reqParam);

			//LogUtil.printRequestLog(reqParam);

			Map<String, String> valideData = null;
			if (null != reqParam && !reqParam.isEmpty()) {
				Iterator<Entry<String, String>> it = reqParam.entrySet().iterator();
				valideData = new HashMap<String, String>(reqParam.size());
				while (it.hasNext()) {
					Entry<String, String> e = it.next();
					String key = (String) e.getKey();
					String value = (String) e.getValue();
					value = new String(value.getBytes(encoding), encoding);
					valideData.put(key, value);
				}
			}
			

			//重要！验证签名前不要修改reqParam中的键值对的内容，否则会验签不过
			if (!AcpService.validate(valideData, encoding)) {
				logger.info("验证签名结果[失败].");
				//验签失败，需解决验签问题
				
			} else {
				logger.info("验证签名结果[成功].");
				//【注：为了安全验签成功才应该写商户的成功处理逻辑】交易成功，更新商户订单状态
				
				
			}
			String orderId = "";   //orderId = cn + orderType + System.currentTimeMillis() + order_id
			String orderNumber = valideData.get("orderId");
			logger.info("回调方法订单流水号order_no: "+orderNumber);
			orderId = orderNumber.substring(14, orderNumber.length());
			DataRow datarow= new DataRow();
			if(orderId !=null){
				datarow.set("order_id", orderId);
				Result result = BusClientUtil.invoke(1000125, datarow); //调用订单查询的bus
				logger.info(result);
				logger.info("err_no:"+result.getErr_no());
				logger.info("err_info:"+result.getErr_info());
				
				if(result.getErr_no() == 0){
					logger.info("订单接口返回数据："+result.getData());
				    String user_id = result.getData().getString("user_id");
				    String pay_account = result.getData().getString("pay_account");
				    logger.info("用户编号-----------------"+user_id);
				    logger.info("账号------------------------------"+pay_account);
					DataRow dataRow = new DataRow() ;
					dataRow.set("ip", ip);
					dataRow.set("order_id", orderId) ; 
					dataRow.set("pay_account", pay_account) ; 
					dataRow.set("user_id", user_id) ; 
					dataRow.set("integral", 0); 
					dataRow.set("pay_type", 7) ; 
					logger.info("进入修改订单的bus-------------------------------------1000117");
					Result resultVo = BusClientUtil.invoke(1000117, dataRow); //调用订单支付的bus
					logger.info(resultVo);
					logger.info("err_no:"+result.getErr_no());
					logger.info("err_info:"+result.getErr_info());
					logger.info("确认订单接口返回数据："+result.getData());
                    if(resultVo.getErr_no() == 0){
                    	logger.info("修改成功-------------------------------------------------");
					}else{
						logger.info("支付确认失败："+result.getErr_info()) ;
						throw new InvokeException("支付确认失败："+result.getErr_info(), 1);
					}
				}
			}
			
			

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		
		logger.info("BackRcvResponse接收后台通知结束");
		//返回给银联服务器http 200  状态码
		resp.getWriter().print("ok");
		
		return null;
	}
	
	
	public ActionResult doMallBack() throws ServletException, IOException{
		logger.info("返回商户");
		HttpServletRequest req = getRequest();
		HttpServletResponse resp = getResponse();
		try {

			SDKConfig.getConfig().loadPropertiesFromSrc(); //从classpath加载acp_sdk.properties文件
			
			String encoding = req.getParameter(SDKConstants.param_encoding);
			// 获取银联通知服务器发送的后台通知参数
			logger.info("开始获取银联返回报文》》》");
			Map<String, String> reqParam = getAllRequestParam(req);
			logger.info(reqParam);
			reqParam.remove("function");   //web框架服务器增加了一个function参数导致验签失败
			logger.info("去掉function后的返回报文："+reqParam);

			//LogUtil.printRequestLog(reqParam);

			Map<String, String> valideData = null;
			if (null != reqParam && !reqParam.isEmpty()) {
				Iterator<Entry<String, String>> it = reqParam.entrySet().iterator();
				valideData = new HashMap<String, String>(reqParam.size());
				while (it.hasNext()) {
					Entry<String, String> e = it.next();
					String key = (String) e.getKey();
					String value = (String) e.getValue();
					value = new String(value.getBytes(encoding), encoding);
					valideData.put(key, value);
				}
			}
			

			//重要！验证签名前不要修改reqParam中的键值对的内容，否则会验签不过
			if (!AcpService.validate(valideData, encoding)) {
				logger.info("验证签名结果[失败].");
				//验签失败，需解决验签问题
				
			} else {
				logger.info("验证签名结果[成功].");
				//【注：为了安全验签成功才应该写商户的成功处理逻辑】交易成功，更新商户订单状态
				
				
			}
			String orderId = "";   //orderId = cn + orderType + System.currentTimeMillis() + order_id
			String orderNumber = valideData.get("orderId");
			logger.info("订单流水号order_no: "+orderNumber);
			orderId = orderNumber.substring(14, orderNumber.length());
			DataRow datarow= new DataRow();
			if(orderId !=null){
				datarow.set("order_id", orderId);
				Result result = BusClientUtil.invoke(1000125, datarow); //调用订单查询的bus
				logger.info(result);
				logger.info("err_no:"+result.getErr_no());
				logger.info("err_info:"+result.getErr_info());
				
				if(result.getErr_no() == 0){
					logger.info("订单接口返回数据："+result.getData());
					String order_tot_price = result.getData().getString("order_tot_price");
					String service_end_time = result.getData().getString("service_end_time");
					String product_name = result.getData().getString("product_name");
					String product_type = result.getData().getString("product_type");
					String rules_price_cash = result.getData().getString("rules_price_cash");
					String rules_unit = result.getData().getString("rules_unit");
					String rules_long = result.getData().getString("rules_long");
					String pay_way = result.getData().getString("pay_way");
					String initpwd = result.getData().getString("initpwd");
					String jumpPage = "";
					String urla = "";
					if(product_type.equals("3")){
						jumpPage = Configuration.getString("upop.0102");
						urla="&integral="+order_tot_price+"&service_end_time="+service_end_time+"&product_name="+product_name+"&order_no="+orderNumber;
					}else if(product_type.equals("4")){
						jumpPage = Configuration.getString("upop.0103");
						urla="&rules_price_cash="+rules_price_cash+"&product_name="+product_name+"&order_no="+
						orderNumber+"&rules_unit="+rules_unit+"&rules_long="+rules_long+"&pay_way=7&initpwd="+initpwd;
					}
					String pageUrl = jumpPage+urla;
					logger.info("地址"+urla);
					logger.info("进入页面回调接口，跳转地址："+pageUrl);
					String jumpHtml = JumpUtil.getJumpHtml(pageUrl);
					logger.info(jumpHtml);
					resp.setContentType("text/html;charset=UTF-8");   
					resp.setCharacterEncoding("UTF-8");
					resp.getWriter().write(jumpHtml);
					}else{
						logger.info("支付确认失败："+result.getErr_info()) ;
						throw new InvokeException("支付确认失败："+result.getErr_info(), 1);
					}
		   }
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		
		logger.info("BackRcvResponse接收后台通知结束");
		//返回给银联服务器http 200  状态码
		resp.getWriter().print("ok");
		return null;
	}
	
	/**
	 * 获取请求参数中所有的信息
	 * 
	 */
	public static Map<String, String> getAllRequestParam(final HttpServletRequest request) {
		Map<String, String> res = new HashMap<String, String>();
		Enumeration<?> temp = request.getParameterNames();
		if (null != temp) {
			while (temp.hasMoreElements()) {
				String en = (String) temp.nextElement();
				String value = request.getParameter(en);
				res.put(en, value);
				//在报文上送时，如果字段的值为空，则不上送<下面的处理为在获取所有参数数据时，判断若值为空，则删除这个字段>
				//System.out.println("ServletUtil类247行  temp数据的键=="+en+"     值==="+value);
				if (null == res.get(en) || "".equals(res.get(en))) {
					res.remove(en);
				}
			}
		}
		return res;
	}
	
	
	public static void main(String[] args) {
//		try {
//			String orderNumber = "01011477727932360554";
//			String cn = orderNumber.substring(0, 2);
//			String orderType = orderNumber.substring(2, 4);
//			String orderId = orderNumber.substring(17, orderNumber.length());
//			logger.info(cn);
//			logger.info(orderType);
//			logger.info(orderId);
//			
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
		
	}
	
	
}
