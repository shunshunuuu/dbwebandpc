package root.upop;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.ResponseHelper;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.project.util.DES;
import com.thinkive.project.util.URLDecodeUtil;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;
import com.unionpay.upop.QuickPay;
import com.unionpay.upop.QuickPayBack;
import com.unionpay.upop.QuickPayConf;
import com.unionpay.upop.QuickPayQuery;
import com.unionpay.upop.QuickPayResponse;
import com.unionpay.upop.domain.QuickPayBackVo;
import com.unionpay.upop.domain.QuickPayQueryVo;
import com.unionpay.upop.domain.QuickPayVo;

/**
 * 描述: 银联支付
 * 版权: Copyright (c) 2013
 * 公司: 思迪科技 
 * 作者: 黄圣宙
 * 版本: 1.0 
 * 创建日期: Feb 20, 2014 
 * 创建时间: 4:56:53 PM
 */
public class IndexAction extends BaseAction
{
	
	private static Logger logger = Logger.getLogger(IndexAction.class);
	
	private QuickPay quickPay = new QuickPay(); //支付下单
	
	private QuickPayResponse quickPayResponse = new QuickPayResponse(); //应答
	
	private QuickPayQuery quickPayQuery = new QuickPayQuery(); //查询
	
	private QuickPayBack quickPayBack = new QuickPayBack(); //退货
	
	private final static int FUNC_NO_CALL_BACK = Integer.parseInt(Configuration.getString("upop.func_no_call_back")) ; //银联支付回调功能号
	
	private final static int FUNC_NO_REFUND_CALL_BACK = Integer.parseInt(Configuration.getString("upop.func_no_refund_call_back")) ; //银联退款回调功能号
	
	private final static int FUNC_NO_PAY = Integer.parseInt(Configuration.getString("upop.func_no_pay")) ; //银联支付功能号
	
	/**
	 * @功能：银联订单支付
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：May 9, 2014 2:09:50 PM
	 * @return
	 * @throws Exception
	 */
	public ActionResult doAjaxUpop() throws Exception
	{
		DES crypt = new DES(Configuration.getString("system.desKey")) ;
		try
		{ 
			String totalAmount = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("tot_price"))) ;
			String productName = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("product_name"))) ;
			String price = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("order_price"))) ;
			String amount = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("order_quantity"))) ;
			String orderId = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("order_id"))) ;
			String userName = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("user_name"))) ;
			
			//更新订单的手机和邮箱
			String mobile = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("mobile"))) ;
			String email = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("email"))) ;
			//String orderTime = crypt.decrypt(URLDecodeUtil.decode(this.getStrParameter("order_time"))) ; 
			
			int priceInt = (int)(Float.parseFloat(price) * 100) ;
			int totalAmountInt =  (int)(Float.parseFloat(totalAmount) * 100) ;

			//String order_no = orderId + System.currentTimeMillis() ; //订单号 + 时间戳 = 支付订单流水
			///logger.info("订单号 +时间戳 = 订单流水:" + order_no) ;
			
			QuickPayVo quickVo = new QuickPayVo();
			quickVo.setTransType(QuickPayConf.transTypePay);//交易类型 01支付 04 退货
			quickVo.setSignType(QuickPayConf.signType); //加密方式
			quickVo.setProductUrl(""); //返回Url
			quickVo.setProductName(productName); //产品名称
			quickVo.setPrice(ObjectUtils.toString(priceInt));//产品单价（分）
			quickVo.setAmount(amount); //交易数量
			quickVo.setTotalAmount(ObjectUtils.toString(totalAmountInt)); //交易金额（分）
			quickVo.setUserName(userName); // 用户名字
			quickVo.setIp(""); //ip
			quickVo.setDiscount("0"); //折扣 （分）
			quickVo.setFreight("0"); //运费 （分）
			
			DataRow dataRow = new DataRow() ;
			dataRow.set("order_id", orderId) ; 
			dataRow.set("mobile_phone", mobile) ; 
			dataRow.set("user_mail", email) ; 
			//保存支付流水 支付时间 - 以便查单
			logger.info("生成支付时间和支付流水：" + dataRow) ;
			Result result = BusClientUtil.invoke(FUNC_NO_PAY, dataRow); //调bus接口
			logger.info(result);
			if(result.getErr_no()==0 && result.getData() !=null && result.getData().getString("pay_time")!=null ){
				HttpServletResponse response = this.getResponse();
				String orderTime = result.getData().getString("pay_time") ;//订单时间
				String order_no = result.getData().getString("mall_sno") ;//订单时间
				quickVo.setOrderNo(order_no); //支付订单流水
				quickVo.setOrderTime(orderTime) ;
				quickPay.payToHtml(quickVo, response);
			}else{
				logger.info("生成第三方支付时间和和支付流水失败！") ;
			}
		}
		
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.info(ex);
		}
		return null;
	}
	/**
	 * @功能：银联订单支付-后台回调
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：May 9, 2014 2:09:50 PM
	 * @return
	 * @throws Exception
	 */
	public ActionResult doBackUpop()
	{
		try
		{
			logger.info("银联支付订单回调");
			DataRow dataRow = quickPayResponse.quickPayRes(this.getRequest(), this.getResponse());
			logger.info("银联交易回调返回数据：" + dataRow);
			boolean signatureCheck = dataRow.getBoolean("signatureCheck") ;
			DataRow data = new DataRow() ;
			String check_str = "0" ;
			if(signatureCheck){
				check_str = "1" ;
				logger.info("银联支付订单回调-----签名成功！") ;
			}else{
				data.set("respMsg","银联支付订单回调-----签名失败！") ;
				logger.info("银联支付订单回调-----签名失败！") ;
			}
			if(dataRow.getString("orderNumber") != null && dataRow.getString("orderNumber").length()>13){
				String orderNumber = dataRow.getString("orderNumber") ;
				data.set("order_id", orderNumber.substring(13, orderNumber.length())) ; //订单的支付流水获取订单id System.currentTimeMillis() + order_id
			}
			data.set("mall_sno", dataRow.getString("orderNumber")) ;
			data.set("order_tot_price", dataRow.getString("orderAmount")) ; 
			data.set("pay_status", dataRow.getString("respCode")) ;
			data.set("pay_info", dataRow.getString("respMsg")) ;
			data.set("pay_sno", dataRow.getString("qid")) ;
			data.set("check_str", check_str) ;
			logger.info("支付完成，确认订单入参：" + data) ;
			Result result = BusClientUtil.invoke(FUNC_NO_CALL_BACK, data);
			logger.info(result);
		}
		
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.info(ex);
		}
		return null;
	}
	/**
	 * @功能：银联订单后台退款
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：May 9, 2014 2:09:50 PM
	 * @return
	 * @throws Exception
	 */
	public ActionResult doQuickPayBack()
	{
		String result = "-1" ;
		String msg = "" ;
		try
		{
			String qid = this.getStrParameter("qid") ;
			String orderTime = this.getStrParameter("orderTime") ; 
			String orderNumber = this.getStrParameter("orderNumber") ; 
			String totalAmount = this.getStrParameter("totalAmount") ; 
			String ip = this.getStrParameter("ip") ; 
			if(StringUtils.isEmpty(qid)){
				logger.error("银联退款失败，qid不能为空，请检查参数");
				return null ;
			}
			if(StringUtils.isEmpty(orderTime)){
				logger.error("银联退款失败，订单支付时间[orderTime]不能为空，请检查参数");
				return null ;
			}
			if(StringUtils.isEmpty(orderNumber)){
				logger.error("银联退款失败，订单支付流水[orderNumber]不能为空，请检查参数");
				return null ;
			}
			QuickPayBackVo quickBackVo = new QuickPayBackVo();
			quickBackVo.setTransType(QuickPayConf.transTypeRefund);//交易类型
			quickBackVo.setSignType(QuickPayConf.signType); //加密方式
			quickBackVo.setOrderQid(qid); //原订单流水号-银联返回
			quickBackVo.setOrderNo(orderNumber); //订单号 
			quickBackVo.setOrderTime(orderTime); //订单时间
			quickBackVo.setTotalAmount(totalAmount); //交易金额（分）
			quickBackVo.setIp(ip) ;
			String payResult = quickPayBack.refundTrans(quickBackVo);
			if ("00".equals(payResult))
			{
				result = "0" ;
				msg = "银联开始受理请求，但是并不表示处理成功。交易类型为（01，31，04等）等成功后有后台通知发到报文的后台通知地址。交易类型71，商户自己发查询确定状态";
				logger.info("银联开始受理请求，但是并不表示处理成功。交易类型为（01，31，04等）等成功后有后台通知发到报文的后台通知地址。交易类型71，商户自己发查询确定状态");
			}
			else if ("30".equals(payResult))
			{
				result = "30" ;
				msg = result + ":报文格式错误";
				logger.info(result + ":报文格式错误");
			}
			else if ("94".equals(payResult))
			{
				result = "94" ;
				msg = result + ":重复交易";
				logger.info(result + ":重复交易");
			}
			else if ("25".equals(payResult))
			{
				result = "25" ;
				msg = result + ":查询原交易失败";
				logger.info(result + ":查询原交易失败");
			}
			else if ("36".equals(payResult))
			{
				result = "36" ;
				msg = result + ":交易金额超限";
				logger.info(result + ":交易金额超限");
			}
			else
			{
				result = "-1" ;
				msg = result + ":其他错误";
				logger.info(payResult + ":其他错误");
			}
		}
		
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.info(ex);
		}
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("errorno", result);
		jsonObj.put("errormsg", msg);
		ResponseHelper.print(getResponse(), jsonObj.toString());
		return null;
	}
	/**
	 * @功能：银联订单支付查询
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：May 9, 2014 2:09:50 PM
	 * @return
	 * @throws Exception
	 */
	public ActionResult doQueryUpop()
	{
		String result = "-1";
		try
		{
			String orderTime = this.getStrParameter("orderTime") ;//t_mall_sno - create_time
			String orderNumber = this.getStrParameter("orderNumber") ;//t_mall_sno - mall_sn
			QuickPayQueryVo quickPayQueryVo = new QuickPayQueryVo();
			quickPayQueryVo.setTransType(QuickPayConf.transTypePay);
			quickPayQueryVo.setOrderTime(orderTime); 
			quickPayQueryVo.setOrderNumber(orderNumber);
			String queryResult = quickPayQuery.queryTrans(quickPayQueryVo);
			if (queryResult != "")
			{
				if ("0".equals(queryResult))
				{
					result = "0" ;
					logger.info("交易成功");
				}
				if ("1".equals(queryResult))
				{
					result = "-1" ;
					logger.info("交易失败");
				}
				if ("2".equals(queryResult))
				{
					result = "-1" ;
					logger.info("交易处理中");
				}
				if ("3".equals(queryResult))
				{
					result = "-1" ;
					logger.info("无此交易");
				}
			}
			else
			{
				result = "-1" ;
				logger.info("报文格式错误");
			}
		}
		
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.info(ex);
		}
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("errorno", result);
		ResponseHelper.print(getResponse(), jsonObj.toString());
		return null;
	}
	/**
	 * @功能：银联订单后台退款-后台回调
	 * @author：黄圣宙(HUANGRONALDO)
	 * @time：May 9, 2014 2:09:50 PM
	 * @return
	 * @throws Exception
	 */
	public ActionResult doRefundBackUpop()
	{
		try
		{
			logger.info("银联后台退款回调");
			DataRow dataRow = quickPayResponse.quickPayRes(this.getRequest(), this.getResponse());
			logger.info("银联后台退款回调返回数据：" + dataRow);
			boolean signatureCheck = dataRow.getBoolean("signatureCheck") ;
			DataRow data = new DataRow() ;
			String check_str = "0" ;
			if(signatureCheck){
				check_str = "1" ;
				logger.info("银联后台退款回调-----签名成功！") ;
			}else{
				data.set("respMsg","银联后台退款回调-----签名失败！") ;
				logger.info("银联后台退款回调-----签名失败！") ;
			}
			if(dataRow.getString("orderNumber") != null && dataRow.getString("orderNumber").length()>13){
				String orderNumber = dataRow.getString("orderNumber") ;
				data.set("order_id", orderNumber.substring(13, orderNumber.length())) ; //订单的支付流水获取订单id System.currentTimeMillis() + order_id
			}
			data.set("mall_sno", dataRow.getString("orderNumber")) ;
			data.set("order_tot_price", dataRow.getString("orderAmount")) ; 
			data.set("pay_status", dataRow.getString("respCode")) ;
			data.set("pay_info", dataRow.getString("respMsg")) ;
			data.set("pay_sno", dataRow.getString("qid")) ;
			data.set("check_str", check_str) ;
			logger.info("后台退款完成，确认订单入参：" + data) ;
			Result result = BusClientUtil.invoke(FUNC_NO_REFUND_CALL_BACK, data);
			logger.info(result);
		}
		
		catch (Exception ex)
		{
			ex.printStackTrace();
			logger.info(ex);
		}
		return null;
	}
}
