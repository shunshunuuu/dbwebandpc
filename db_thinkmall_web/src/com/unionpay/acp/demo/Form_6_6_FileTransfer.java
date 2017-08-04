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
 * ���ף��ļ�������ӿڣ���̨��ȡ�����ļ����ף�ֻ��ͬ��Ӧ�� <br>
 * ���ڣ� 2015-09<br>
 * �汾�� 1.0.0 
 * ��Ȩ�� �й�����<br>
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���Ҫ�����ռ����ĵ���д���ô�������ο������ṩ�������ܹ淶�Եȷ���ı���<br>
 * �ýӿڲο��ĵ�λ�ã�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ������֧����Ʒ�ӿڹ淶��<br>
 *              ��ƽ̨����ӿڹ淶-��5����-��¼�����ڰ���Ӧ����ӿڹ淶��ȫ����ƽ̨��������-������ձ�<br>
 *              ��ȫ����ƽ̨����ӿڹ淶 ��3���� �ļ��ӿڡ��������ļ���ʽ˵����<br>
 * ���Թ����е�����������ʻ����������ԣ�1��������openƽ̨�в��Ҵ𰸣�
 * 							        ���Թ����е������������������ https://open.unionpay.com/ajweb/help/faq/list �������� FAQ �����������
 *                             ���Թ����в�����6λӦ����������������https://open.unionpay.com/ajweb/help/respCode/respCodeList ����Ӧ���������������
 *                          2�� ��ѯ�����˹�֧�֣� open.unionpay.comע��һ���û�����½�����Ͻǵ�������߿ͷ�������ѯ�˹�QQ����֧�֡�
 * ����˵���� �����ļ��ĸ�ʽ��ο���ȫ����ƽ̨����ӿڹ淶 ��3���� �ļ��ӿڡ�
 *        �����ļ�ʾ����Ŀ¼file�µ�802310048993424_20150905.zip
 *        ������غ�Ķ����ļ����Բο�BaseDemo.java�е�parseZMFile();parseZMEFile();����
 *        
 */
public class Form_6_6_FileTransfer extends HttpServlet {

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
		
		String merId = req.getParameter("merId");
		String settleDate = req.getParameter("settleDate");
		
		Map<String, String> data = new HashMap<String, String>();
		
		/***����ȫ����ϵͳ����Ʒ����������encoding����ѡ�������������޸�***/
		data.put("version", DemoBase.version);               //�汾�� ȫ����Ĭ��ֵ
		data.put("encoding", DemoBase.encoding_UTF8);             //�ַ������� ����ʹ��UTF-8,GBK���ַ�ʽ
		data.put("signMethod", "01");                        //ǩ������ Ŀǰֻ֧��01-RSA��ʽ֤�����
		data.put("txnType", "76");                           //�������� 76-�����ļ�����
		data.put("txnSubType", "01");                        //���������� 01-�����ļ�����
		data.put("bizType", "000000");                       //ҵ�����ͣ��̶�
		
		/***�̻��������***/
		data.put("accessType", "0");                         //�������ͣ��̻�������0�������޸�
		data.put("merId", merId);                	         //�̻����룬���滻��ʽ�̻��Ų��ԣ���ʹ�õ���������ƽ̨ע���777��ͷ���̻��ţ����̻���û��Ȩ�޲��ļ����ؽӿڵģ���ʹ�ò��Բ�����д���ļ����ص��̻��ź����ڲ⡣����777�̻��ŵ���ʵ���׵Ķ����ļ�����ʹ��������ƽ̨�����ļ���
		data.put("settleDate", settleDate);                  //�������ڣ����ʹ����ʽ�̻��Ų�����Ҫ�޸ĳ��Լ���Ҫ��ȡ�����ļ������ڣ� ���Ի������ʹ��700000000000001�̻�����̶���д0119
		data.put("txnTime",DemoBase.getCurrentTime());       //��������ʱ�䣬ȡϵͳʱ�䣬��ʽΪYYYYMMDDhhmmss������ȡ��ǰʱ�䣬����ᱨtxnTime��Ч
		data.put("fileType", "00");                          //�ļ����ͣ�һ���̻���д00����
		
		/**�������������ϣ����¶������������ǩ��������http post���󣬽���ͬ��Ӧ����------------->**/
		
		Map<String, String> reqData = AcpService.sign(data,DemoBase.encoding_UTF8);//������certId,signature��ֵ����signData�����л�ȡ���Զ���ֵ�ģ�ֻҪ֤��������ȷ���ɡ�
		String url = SDKConfig.getConfig().getFileTransUrl();//��ȡ����������ǰ̨��ַ����Ӧ�����ļ�acp_sdk.properties�ļ��е�acpsdk.fileTransUrl
		Map<String, String> rspData =  AcpService.post(reqData,url,DemoBase.encoding_UTF8);

		/**��Ӧ����Ĵ������������ҵ���߼�����д����,����Ӧ���봦���߼������ο�------------->**/
		//Ӧ����淶�ο�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ��ƽ̨����ӿڹ淶-��5����-��¼��
		if(!rspData.isEmpty()){
			if(AcpService.validate(rspData, DemoBase.encoding_UTF8)){
				LogUtil.writeLog("��֤ǩ���ɹ�");
				String respCode = rspData.get("respCode");
				if("00".equals(respCode)){
					//���׳ɹ����������ر����е�fileContent�����
					AcpService.deCodeFileContent(rspData,"D:\\",DemoBase.encoding_UTF8);
					//TODO
				}else{
					//����Ӧ����Ϊʧ�����Ų�ԭ��
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
