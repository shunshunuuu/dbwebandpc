package com.unionpay.acp.demo;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
public class Form_6_5_Query extends HttpServlet {

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
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		String orderId = req.getParameter("orderId");
		String txnTime = req.getParameter("txnTime");
		
		Map<String, String> data = new HashMap<String, String>();
		
		/***����ȫ����ϵͳ����Ʒ����������encoding����ѡ�������������޸�***/
		data.put("version", DemoBase.version);                 //�汾��
		data.put("encoding", DemoBase.encoding_UTF8);               //�ַ������� ����ʹ��UTF-8,GBK���ַ�ʽ
		data.put("signMethod", "01");                          //ǩ������ Ŀǰֻ֧��01-RSA��ʽ֤�����
		data.put("txnType", "00");                             //�������� 00-Ĭ��
		data.put("txnSubType", "00");                          //����������  Ĭ��00
		data.put("bizType", "000201");                         //ҵ������ B2C����֧�����ֻ�wap֧��
		
		/***�̻��������***/
		data.put("merId", "777290058110048");                  //�̻����룬��ĳ��Լ�������̻��Ż���open��ע�������777�̻��Ų���
		data.put("accessType", "0");                           //�������ͣ��̻�����̶���0�������޸�
		
		/***Ҫ��ͨ���������ֶα����޸�***/
		data.put("orderId", orderId);                 //****�̻������ţ�ÿ�η����ײ������޸�Ϊ����ѯ�Ľ��׵Ķ�����
		data.put("txnTime", txnTime);                 //****��������ʱ�䣬ÿ�η����ײ������޸�Ϊ����ѯ�Ľ��׵Ķ�������ʱ��

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
						//TODO
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
		String reqMessage = DemoBase.genHtmlResult(reqData);
		String rspMessage = DemoBase.genHtmlResult(rspData);
		resp.getWriter().write("</br>������:<br/>"+reqMessage+"<br/>" + "Ӧ����:</br>"+rspMessage+"");
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}
}
