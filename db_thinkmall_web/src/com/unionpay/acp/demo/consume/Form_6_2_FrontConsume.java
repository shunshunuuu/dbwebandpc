package com.unionpay.acp.demo.consume;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;


import com.unionpay.acp.demo.DemoBase;
import com.unionpay.acp.sdk.AcpService;
import com.unionpay.acp.sdk.LogUtil;
import com.unionpay.acp.sdk.SDKConfig;

/**
 * ��Ҫ����������ʱ����ϸ�Ķ�ע�ͣ�
 * 
 * ��Ʒ����ת����֧����Ʒ<br>
 * ���ף����ѣ�ǰ̨��ת����ǰ̨֪ͨӦ��ͺ�̨֪ͨӦ��<br>
 * ���ڣ� 2015-09<br>
 * �汾�� 1.0.0
 * ��Ȩ�� �й�����<br>
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���Ҫ�����ռ����ĵ���д���ô�������ο������ṩ�������ܹ淶�Եȷ���ı���<br>
 * ��ʾ���ýӿڲο��ĵ�λ�ã�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ������֧����Ʒ�ӿڹ淶����<br>
 *              ��ƽ̨����ӿڹ淶-��5����-��¼�����ڰ���Ӧ����ӿڹ淶��ȫ����ƽ̨��������-������ձ�)<br>
 *              ��ȫ����ƽ̨����ӿڹ淶 ��3���� �ļ��ӿڡ��������ļ���ʽ˵����<br>
 * ���Թ����е�����������ʻ����������ԣ�1��������openƽ̨�в��Ҵ𰸣�
 * 							        ���Թ����е������������������ https://open.unionpay.com/ajweb/help/faq/list �������� FAQ �����������
 *                             ���Թ����в�����6λӦ����������������https://open.unionpay.com/ajweb/help/respCode/respCodeList ����Ӧ���������������
 *                          2�� ��ѯ�����˹�֧�֣� open.unionpay.comע��һ���û�����½�����Ͻǵ�������߿ͷ�������ѯ�˹�QQ����֧�֡�
 * ����˵��:1���Ժ�̨֪ͨ����״̬��ѯ����ȷ�����׳ɹ�,ǰ̨֪ͨ������Ϊ�жϳɹ��ı�׼.
 *       2������״̬��ѯ���ף�Form_6_5_Query��������û��ƣ�ǰ̨�ཻ�׽�������5�֡�10�֡�30�֡�60�֡�120�֣������ײ�ѯ�������ѯ������ɹ��������ٲ�ѯ����ʧ�ܣ������У���ѯ��������������Ϊ�м�״̬����Ҳ���Խ����̻�ʹ��payTimeout��֧����ʱʱ�䣩���������ʱ����ѯ���õ��Ľ��Ϊ���ս����
 */
public class Form_6_2_FrontConsume extends HttpServlet {
	private static Logger logger = Logger.getLogger(Form_6_2_FrontConsume.class);

	@Override
	public void init(ServletConfig config) throws ServletException {
		/**
		 * �������������ַ����ȡ֤���ļ���֤��·������ز�����ʼ����SDKConfig����
		 * ��java main ��ʽ����ʱ����ÿ�ζ�ִ�м���
		 * �������webӦ�ÿ�����,���������ʹ�ü����ķ�ʽд�뻺��,�����������
		 */
		//�����Ѿ������������ļ��ķ���Ų����web/AutoLoadServlet.java��
		//SDKConfig.getConfig().loadPropertiesFromSrc(); //��classpath����acp_sdk.properties�ļ�
		super.init();
		logger.info("Form_6_2_ForntConsume��ʼ����ʼ��������");
	}
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)   //protected
			throws ServletException, IOException {
		
		logger.info("doPost���ÿ�ʼ��������");
		//ǰ̨ҳ�洫������
//		String merId = req.getParameter("merId");
//		String txnAmt = req.getParameter("txnAmt");
		String merId = "777290058136696";
		String txnAmt = "100";
		logger.info("merId:"+merId+".........txnAmt:"+txnAmt);
		
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
		requestData.put("merId", merId);    	          			  //�̻����룬��ĳ��Լ��������ʽ�̻��Ż���open��ע�������777�����̻���
		requestData.put("accessType", "0");             			  //�������ͣ�0��ֱ���̻� 
		requestData.put("orderId",DemoBase.getOrderId());             //�̻������ţ�8-40λ������ĸ�����ܺ���-����_�����������ж��ƹ���		
		requestData.put("txnTime", DemoBase.getCurrentTime());        //��������ʱ�䣬ȡϵͳʱ�䣬��ʽΪYYYYMMDDhhmmss������ȡ��ǰʱ�䣬����ᱨtxnTime��Ч
		requestData.put("currencyCode", "156");         			  //���ױ��֣������̻�һ����156 ����ң�		
		requestData.put("txnAmt", txnAmt);             			      //���׽���λ�֣���Ҫ��С����
		//requestData.put("reqReserved", "͸���ֶ�");        		      //���󷽱���������ʹ�������ü��ɣ�͸���ֶΣ�����ʵ���̻��Զ��������׷�٣������׵ĺ�̨֪ͨ,�Ա����׵Ľ���״̬��ѯ���ס������ļ��о���ԭ�����أ��̻����԰����ϴ�������Ϊ1-1024���ֽ�		
		
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
		
		LogUtil.writeLog("��ӡ����HTML����Ϊ�����ģ�Ϊ�����Ų���������ݣ�"+html);
		//�����ɵ�htmlд�������������Զ���ת������֧��ҳ�棻�������signData֮�󣬽�htmlд���������ת������ҳ��֮ǰ�����ܶ�html�еı�������ƺ�ֵ�����޸ģ�����޸Ļᵼ����ǩ��ͨ��
		resp.getWriter().write(html);
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}	
}
