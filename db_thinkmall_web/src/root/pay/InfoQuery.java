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
 * ��Ҫ����������ʱ����ϸ�Ķ�ע�ͣ�
 * 
 * ��Ʒ����ת����֧����Ʒ<br>
 * ���ף�����״̬��ѯ���ף�ֻ��ͬ��Ӧ�� <br>
 * ���ڣ� 2015-09<br>
 * �汾�� 1.0.0 
 * ��Ȩ�� �й�����<br>
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���Ҫ�����ռ����ĵ���д���ô�������ο������ṩ�������ܼ��淶�Եȷ���ı���<br>
 * �ýӿڲο��ĵ�λ�ã�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ������֧����Ʒ�ӿڹ淶����<br>
 *              ��ƽ̨����ӿڹ淶-��5����-��¼�����ڰ���Ӧ����ӿڹ淶��ȫ����ƽ̨��������-������ձ�<br>
 * ���Թ����е�����������ʻ����������ԣ�1��������openƽ̨�в��Ҵ𰸣�
 * 							        ���Թ����е������������������ https://open.unionpay.com/ajweb/help/faq/list �������� FAQ �����������
 *                             ���Թ����в�����6λӦ����������������https://open.unionpay.com/ajweb/help/respCode/respCodeList ����Ӧ���������������
 *                           2�� ��ѯ�����˹�֧�֣� open.unionpay.comע��һ���û�����½�����Ͻǵ�������߿ͷ�������ѯ�˹�QQ����֧�֡�
 * ����˵���� 1����ǰ̨���׷�����״̬��ѯ��ǰ̨�ཻ�׽�������5�֡�10�֡�30�֡�60�֡�120�֣������ײ�ѯ�������ѯ������ɹ��������ٲ�ѯ����ʧ�ܣ������У���ѯ��������������Ϊ�м�״̬����Ҳ���Խ����̻�ʹ��payTimeout��֧����ʱʱ�䣩���������ʱ����ѯ���õ��Ľ��Ϊ���ս����
 *        2���Ժ�̨���׷�����״̬��ѯ����̨���ʽ��ཻ��ͬ������00���ɹ������к�̨֪ͨ���̻�Ҳ���Է��� ��ѯ���ף��ɲ�ѯN�Σ�������6�Σ���ÿ��ʱ����2N�뷢��,�����1��2��4��8��16��32S��ѯ����ѯ��03��04��05������ѯ��������ֹ��ѯ����
 *        					         ��̨���ʽ���ͬ����03 04 05��Ӧ�뼰δ�õ�������Ӧ������ʱ���跢���ѯ���ף��ɲ�ѯN�Σ�������6�Σ���ÿ��ʱ����2N�뷢��,�����1��2��4��8��16��32S��ѯ����ѯ��03��04��05������ѯ��������ֹ��ѯ����
 */
public class InfoQuery extends BaseAction {

	/**
	 * 
	 */
	private static Logger logger = Logger.getLogger(InfoQuery.class);

	
	public ActionResult doDefault() throws Exception{

			HttpServletRequest req = getRequest();
			HttpServletResponse resp = getResponse();
			String order_no = URLDecodeUtil.decode(RequestHelper.getString(req, "order_no")) ; //������ˮ���
			String pay_time = URLDecodeUtil.decode(RequestHelper.getString(req, "pay_time")) ; //����֧��ʱ��
			String fund_account = URLDecodeUtil.decode(RequestHelper.getString(req, "fund_account")) ; //�˺�
			String user_id = URLDecodeUtil.decode(RequestHelper.getString(req, "user_id")) ; //�û�id
			String order_id = URLDecodeUtil.decode(RequestHelper.getString(req, "order_id")) ; //������ˮ���
			Map<String, String> data = new HashMap<String, String>();
			SDKConfig.getConfig().loadPropertiesFromSrc();
			
			/***����ȫ����ϵͳ����Ʒ����������encoding����ѡ�������������޸�***/
			data.put("version", DemoBase.version);                 //�汾��
			data.put("encoding", DemoBase.encoding_UTF8);               //�ַ������� ����ʹ��UTF-8,GBK���ַ�ʽ
			data.put("signMethod", "01");                          //ǩ������ Ŀǰֻ֧��01-RSA��ʽ֤�����
			data.put("txnType", "00");                             //�������� 00-Ĭ��
			data.put("txnSubType", "00");                          //����������  Ĭ��00
			data.put("bizType", "000201");                         //ҵ������ B2C����֧�����ֻ�wap֧��
			
			/***�̻��������***/
			data.put("merId", "777290058136696");                  //�̻����룬��ĳ��Լ�������̻��Ż���open��ע�������777�̻��Ų���
			data.put("accessType", "0");                           //�������ͣ��̻�����̶���0�������޸�
			
			/***Ҫ��ͨ���������ֶα����޸�***/
			data.put("orderId", order_no);                 //****�̻������ţ�ÿ�η����ײ������޸�Ϊ����ѯ�Ľ��׵Ķ�����
			data.put("txnTime", pay_time);                 //****��������ʱ�䣬ÿ�η����ײ������޸�Ϊ����ѯ�Ľ��׵Ķ�������ʱ��
//			data.put("orderId", "201612151409381511");                 //****�̻������ţ�ÿ�η����ײ������޸�Ϊ����ѯ�Ľ��׵Ķ�����
//			data.put("txnTime", "20161215140938");
			/**�������������ϣ����¶������������ǩ��������http post���󣬽���ͬ��Ӧ����------------->**/
			
			Map<String, String> reqData = AcpService.sign(data,DemoBase.encoding_UTF8);//������certId,signature��ֵ����signData�����л�ȡ���Զ���ֵ�ģ�ֻҪ֤��������ȷ���ɡ�
			
			String url = SDKConfig.getConfig().getSingleQueryUrl();// ��������url�������ļ���ȡ��Ӧ�����ļ�acp_sdk.properties�е� acpsdk.singleQueryUrl
			//�������signData֮�󣬵���submitUrl֮ǰ���ܶ�submitFromData�еļ�ֵ�����κ��޸ģ�����޸Ļᵼ����ǩ��ͨ��
			Map<String, String> rspData = AcpService.post(reqData,url,DemoBase.encoding_UTF8);
			
			/**��Ӧ����Ĵ������������ҵ���߼�����д����,����Ӧ���봦���߼������ο�------------->**/
			//Ӧ����淶�ο�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ��ƽ̨����ӿڹ淶-��5����-��¼��
			if(!rspData.isEmpty()){
				if(AcpService.validate(rspData, DemoBase.encoding_UTF8)){
					LogUtil.writeLog("��֤ǩ���ɹ�");
					if("00".equals(rspData.get("respCode"))){//�����ѯ���׳ɹ�
						//������ѯ���׵�Ӧ�����߼�
						String origRespCode = rspData.get("origRespCode");
						if("00".equals(origRespCode)){
							//���׳ɹ��������̻�����״̬
							DataRow dataRow = new DataRow() ;
							dataRow.set("order_id", order_id) ; 
							dataRow.set("pay_account", fund_account) ; 
							dataRow.set("user_id", user_id) ; 
							dataRow.set("integral", 0); 
							dataRow.set("pay_type", 7) ; 
							Result result = BusClientUtil.invoke(1000117, dataRow); //��bus�ӿ�
							logger.info(result);
							logger.info("err_no:"+result.getErr_no());
							logger.info("err_info:"+result.getErr_info());
							logger.info("ȷ�϶����ӿڷ������ݣ�"+result.getData());
							
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
								logger.info("��ַ"+urla);
								logger.info("����ҳ��ص��ӿڣ���ת��ַ��"+pageUrl);
								String jumpHtml = JumpUtil.getJumpHtml(jumpPage);
								logger.info(jumpHtml);
								resp.setContentType("text/html;charset=UTF-8");   
								resp.setCharacterEncoding("UTF-8");
								resp.getWriter().write(jumpHtml);
							}else{
								logger.info("֧��ȷ��ʧ�ܣ�"+result.getErr_info()) ;
								throw new InvokeException("֧��ȷ��ʧ�ܣ�"+result.getErr_info(), 1);
							}
						}else if("03".equals(origRespCode) ||
								 "04".equals(origRespCode) ||
								 "05".equals(origRespCode)){
							//���ٴη�����״̬��ѯ���� 
							//TODO
						}else{
							//����Ӧ����Ϊʧ�����Ų�ԭ��
							//TODO
						}
					}else{//��ѯ���ױ���ʧ�ܣ�����δ�鵽ԭ���ף�����ѯ���ױ���Ҫ��
						//TODO
					}
				}else{
					LogUtil.writeErrorLog("��֤ǩ��ʧ��");
					//TODO �����֤ǩ��ʧ�ܵ�ԭ��
				}
			}else{
				//δ������ȷ��http״̬
				LogUtil.writeErrorLog("δ��ȡ�����ر��Ļ򷵻�http״̬���200");
			}
			return null;
	}

}
