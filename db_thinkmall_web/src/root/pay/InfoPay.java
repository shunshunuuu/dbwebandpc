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
		logger.info("������������֧����ʼ��������");
		try {
			HttpServletRequest request = getRequest();
			ip = URLDecodeUtil.decode(RequestHelper.getString(request, "ip"));
			System.out.println("��ȡ����ipΪ------------------"+ip);
			HttpServletResponse response = getResponse();
			String totalAmount = URLDecodeUtil.decode(RequestHelper.getString(request, "tot_price")) ; //֧�����
			System.out.println("֧�����Ϊ-------------------------------"+totalAmount);
			String orderId = URLDecodeUtil.decode(RequestHelper.getString(request, "order_no")) ; //����ID
			
			
			int totalAmountInt =  (int)(Float.parseFloat(totalAmount) * 100) ;
			System.out.println("-------------------֧�����------------"+totalAmountInt);
			SDKConfig.getConfig().loadPropertiesFromSrc(); //��classpath����acp_sdk.properties�ļ�
			
			Map<String, String> requestData = new HashMap<String, String>();
			
			/***����ȫ����ϵͳ����Ʒ����������encoding����ѡ�������������޸�***/
			requestData.put("version", DemoBase.version);   			  //�汾�ţ�ȫ����Ĭ��ֵ
			requestData.put("encoding", DemoBase.encoding_UTF8); 			  //�ַ������룬����ʹ��UTF-8,GBK���ַ�ʽ
			requestData.put("signMethod", "01");            			  //ǩ��������ֻ֧�� 01��RSA��ʽ֤�����
			requestData.put("txnType", "01");               			  //�������� ��01������
			requestData.put("txnSubType", "01");            			  //���������ͣ� 01����������
			requestData.put("bizType", "000201");           			  //ҵ�����ͣ�B2C����֧�����ֻ�wap֧��
			requestData.put("channelType", "07");           			  //�������ͣ�����ֶ�����B2C����֧�����ֻ�wap֧����07��PC,ƽ��  08���ֻ�
			
			/***�̻��������***/
			requestData.put("merId", DemoBase.merId);    	          			  //�̻����룬��ĳ��Լ��������ʽ�̻��Ż���open��ע�������777�����̻���
			requestData.put("accessType", "0");             			  //�������ͣ�0��ֱ���̻� 
			//requestData.put("orderId",DemoBase.getOrderId());             //�̻������ţ�8-40λ������ĸ�����ܺ���-����_�����������ж��ƹ���		
			requestData.put("txnTime", DemoBase.getCurrentTime());        //��������ʱ�䣬ȡϵͳʱ�䣬��ʽΪYYYYMMDDhhmmss������ȡ��ǰʱ�䣬����ᱨtxnTime��Ч
			requestData.put("currencyCode", "156");         			  //���ױ��֣������̻�һ����156 ����ң�		
			requestData.put("txnAmt", ObjectUtils.toString(totalAmountInt));             			      //���׽���λ�֣���Ҫ��С����
			//requestData.put("reqReserved", "͸���ֶ�");        		      //���󷽱���������ʹ�������ü��ɣ�͸���ֶΣ�����ʵ���̻��Զ��������׷�٣������׵ĺ�̨֪ͨ,�Ա����׵Ľ���״̬��ѯ���ס������ļ��о���ԭ�����أ��̻����԰����ϴ�������Ϊ1-1024���ֽ�		
			
	
			requestData.put("orderId",orderId);    //֧��������ˮ
			//requestData.put("orderTime",orderTime);    //֧������ʱ��
			
			//ǰ̨֪ͨ��ַ ��������Ϊ�����ܷ��� http https���ɣ���֧���ɹ����ҳ�� ����������̻�����ť��ʱ���첽֪ͨ����post���õ�ַ
			//�����Ҫʵ�ֹ��������Զ���ת���̻�ҳ��Ȩ�ޣ�����ϵ����ҵ�����뿪ͨ�Զ������̻�Ȩ��
			//�첽֪ͨ�������open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ����֧����Ʒ�ӿڹ淶 ���ѽ��� �̻�֪ͨ
			requestData.put("frontUrl", DemoBase.frontUrl);
			
			//��̨֪ͨ��ַ��������Ϊ���������ܷ��� http https���ɣ���֧���ɹ����������Զ����첽֪ͨ����post���̻����͵ĸõ�ַ��ʧ�ܵĽ����������ᷢ�ͺ�̨֪ͨ
			//��̨֪ͨ�������open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ����֧����Ʒ�ӿڹ淶 ���ѽ��� �̻�֪ͨ
			//ע��:1.������Ϊ�����ܷ��ʣ������ղ���֪ͨ    2.http https����  3.�յ���̨֪ͨ����Ҫ10���ڷ���http200��302״̬�� 
			//    4.�������֪ͨ����������֪ͨ��10����δ�յ�����״̬�����Ӧ�����http200����ô��������һ��ʱ���ٴη��͡��ܹ�����5�Σ�ÿ�εļ��ʱ��Ϊ0,1,2,4���ӡ�
			//    5.��̨֪ͨ��ַ��������˴��У��Ĳ��������磺http://abc/web?a=b&c=d �ں�̨֪ͨ���������֤ǩ��֮ǰ��Ҫ��д�߼�����Щ�ֶ�ȥ������ǩ�����򽫻���ǩʧ��
			requestData.put("backUrl", DemoBase.backUrl);
			
			
			//////////////////////////////////////////////////
			//
			//       �����������÷���鿴 PCwap������ת֧�������÷�.txt
			//
			//////////////////////////////////////////////////
			
			/**�������������ϣ����¶������������ǩ��������html��������д���������ת������ҳ��**/
			Map<String, String> submitFromData = AcpService.sign(requestData,DemoBase.encoding_UTF8);  //������certId,signature��ֵ����signData�����л�ȡ���Զ���ֵ�ģ�ֻҪ֤��������ȷ���ɡ�
			
			String requestFrontUrl = SDKConfig.getConfig().getFrontRequestUrl();  //��ȡ����������ǰ̨��ַ����Ӧ�����ļ�acp_sdk.properties�ļ��е�acpsdk.frontTransUrl
			String html = AcpService.createAutoFormHtml(requestFrontUrl, submitFromData,DemoBase.encoding_UTF8);   //�����Զ���ת��Html��
			
			logger.info("��ӡ����HTML����Ϊ�����ģ�Ϊ�����Ų���������ݣ�"+html);
			//�����ɵ�htmlд�������������Զ���ת������֧��ҳ�棻�������signData֮�󣬽�htmlд���������ת������ҳ��֮ǰ�����ܶ�html�еı�������ƺ�ֵ�����޸ģ�����޸Ļᵼ����ǩ��ͨ��
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
	 * @���ܣ���������֧��-��̨�ص�
	 * @author��������
	 * @time��
	 * @return
	 * @throws IOException 
	 * @throws ServletException 
	 * @throws Exception
	 */
	public ActionResult doBackUpop() throws ServletException, IOException{
		logger.info("����֧����̨�ص���ʼ��������---------------------------");
		HttpServletRequest req = getRequest();
		HttpServletResponse resp = getResponse();
		try {

			SDKConfig.getConfig().loadPropertiesFromSrc(); //��classpath����acp_sdk.properties�ļ�
			
			String encoding = req.getParameter(SDKConstants.param_encoding);
			// ��ȡ����֪ͨ���������͵ĺ�̨֪ͨ����
			logger.info("��ʼ��ȡ�������ر��ġ�����");
			Map<String, String> reqParam = getAllRequestParam(req);
			logger.info(reqParam);
			reqParam.remove("function");   //web��ܷ�����������һ��function����������ǩʧ��
			logger.info("ȥ��function��ķ��ر��ģ�"+reqParam);

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
			

			//��Ҫ����֤ǩ��ǰ��Ҫ�޸�reqParam�еļ�ֵ�Ե����ݣ��������ǩ����
			if (!AcpService.validate(valideData, encoding)) {
				logger.info("��֤ǩ�����[ʧ��].");
				//��ǩʧ�ܣ�������ǩ����
				
			} else {
				logger.info("��֤ǩ�����[�ɹ�].");
				//��ע��Ϊ�˰�ȫ��ǩ�ɹ���Ӧ��д�̻��ĳɹ������߼������׳ɹ��������̻�����״̬
				
				
			}
			String orderId = "";   //orderId = cn + orderType + System.currentTimeMillis() + order_id
			String orderNumber = valideData.get("orderId");
			logger.info("�ص�����������ˮ��order_no: "+orderNumber);
			orderId = orderNumber.substring(14, orderNumber.length());
			DataRow datarow= new DataRow();
			if(orderId !=null){
				datarow.set("order_id", orderId);
				Result result = BusClientUtil.invoke(1000125, datarow); //���ö�����ѯ��bus
				logger.info(result);
				logger.info("err_no:"+result.getErr_no());
				logger.info("err_info:"+result.getErr_info());
				
				if(result.getErr_no() == 0){
					logger.info("�����ӿڷ������ݣ�"+result.getData());
				    String user_id = result.getData().getString("user_id");
				    String pay_account = result.getData().getString("pay_account");
				    logger.info("�û����-----------------"+user_id);
				    logger.info("�˺�------------------------------"+pay_account);
					DataRow dataRow = new DataRow() ;
					dataRow.set("ip", ip);
					dataRow.set("order_id", orderId) ; 
					dataRow.set("pay_account", pay_account) ; 
					dataRow.set("user_id", user_id) ; 
					dataRow.set("integral", 0); 
					dataRow.set("pay_type", 7) ; 
					logger.info("�����޸Ķ�����bus-------------------------------------1000117");
					Result resultVo = BusClientUtil.invoke(1000117, dataRow); //���ö���֧����bus
					logger.info(resultVo);
					logger.info("err_no:"+result.getErr_no());
					logger.info("err_info:"+result.getErr_info());
					logger.info("ȷ�϶����ӿڷ������ݣ�"+result.getData());
                    if(resultVo.getErr_no() == 0){
                    	logger.info("�޸ĳɹ�-------------------------------------------------");
					}else{
						logger.info("֧��ȷ��ʧ�ܣ�"+result.getErr_info()) ;
						throw new InvokeException("֧��ȷ��ʧ�ܣ�"+result.getErr_info(), 1);
					}
				}
			}
			
			

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		
		logger.info("BackRcvResponse���պ�̨֪ͨ����");
		//���ظ�����������http 200  ״̬��
		resp.getWriter().print("ok");
		
		return null;
	}
	
	
	public ActionResult doMallBack() throws ServletException, IOException{
		logger.info("�����̻�");
		HttpServletRequest req = getRequest();
		HttpServletResponse resp = getResponse();
		try {

			SDKConfig.getConfig().loadPropertiesFromSrc(); //��classpath����acp_sdk.properties�ļ�
			
			String encoding = req.getParameter(SDKConstants.param_encoding);
			// ��ȡ����֪ͨ���������͵ĺ�̨֪ͨ����
			logger.info("��ʼ��ȡ�������ر��ġ�����");
			Map<String, String> reqParam = getAllRequestParam(req);
			logger.info(reqParam);
			reqParam.remove("function");   //web��ܷ�����������һ��function����������ǩʧ��
			logger.info("ȥ��function��ķ��ر��ģ�"+reqParam);

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
			

			//��Ҫ����֤ǩ��ǰ��Ҫ�޸�reqParam�еļ�ֵ�Ե����ݣ��������ǩ����
			if (!AcpService.validate(valideData, encoding)) {
				logger.info("��֤ǩ�����[ʧ��].");
				//��ǩʧ�ܣ�������ǩ����
				
			} else {
				logger.info("��֤ǩ�����[�ɹ�].");
				//��ע��Ϊ�˰�ȫ��ǩ�ɹ���Ӧ��д�̻��ĳɹ������߼������׳ɹ��������̻�����״̬
				
				
			}
			String orderId = "";   //orderId = cn + orderType + System.currentTimeMillis() + order_id
			String orderNumber = valideData.get("orderId");
			logger.info("������ˮ��order_no: "+orderNumber);
			orderId = orderNumber.substring(14, orderNumber.length());
			DataRow datarow= new DataRow();
			if(orderId !=null){
				datarow.set("order_id", orderId);
				Result result = BusClientUtil.invoke(1000125, datarow); //���ö�����ѯ��bus
				logger.info(result);
				logger.info("err_no:"+result.getErr_no());
				logger.info("err_info:"+result.getErr_info());
				
				if(result.getErr_no() == 0){
					logger.info("�����ӿڷ������ݣ�"+result.getData());
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
					logger.info("��ַ"+urla);
					logger.info("����ҳ��ص��ӿڣ���ת��ַ��"+pageUrl);
					String jumpHtml = JumpUtil.getJumpHtml(pageUrl);
					logger.info(jumpHtml);
					resp.setContentType("text/html;charset=UTF-8");   
					resp.setCharacterEncoding("UTF-8");
					resp.getWriter().write(jumpHtml);
					}else{
						logger.info("֧��ȷ��ʧ�ܣ�"+result.getErr_info()) ;
						throw new InvokeException("֧��ȷ��ʧ�ܣ�"+result.getErr_info(), 1);
					}
		   }
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e);
		}
		
		logger.info("BackRcvResponse���պ�̨֪ͨ����");
		//���ظ�����������http 200  ״̬��
		resp.getWriter().print("ok");
		return null;
	}
	
	/**
	 * ��ȡ������������е���Ϣ
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
				//�ڱ�������ʱ������ֶε�ֵΪ�գ�������<����Ĵ���Ϊ�ڻ�ȡ���в�������ʱ���ж���ֵΪ�գ���ɾ������ֶ�>
				//System.out.println("ServletUtil��247��  temp���ݵļ�=="+en+"     ֵ==="+value);
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
