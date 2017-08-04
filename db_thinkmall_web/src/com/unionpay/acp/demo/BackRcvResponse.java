package com.unionpay.acp.demo;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.unionpay.acp.sdk.AcpService;
import com.unionpay.acp.sdk.LogUtil;
import com.unionpay.acp.sdk.SDKConstants;


/**
 * ��Ҫ����������ʱ����ϸ�Ķ�ע�ͣ�
 * 
 * ��Ʒ����ת����֧����Ʒ<br>
 * ���ܣ���̨֪ͨ���մ���ʾ�� <br>
 * ���ڣ� 2015-09<br>
 * �汾�� 1.0.0 
 * ��Ȩ�� �й�����<br>
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���Ҫ�����ռ����ĵ���д���ô�������ο���<br>
 * �ýӿڲο��ĵ�λ�ã�open.unionpay.com�������� ����  ��Ʒ�ӿڹ淶  ������֧����Ʒ�ӿڹ淶����<br>
 *              ��ƽ̨����ӿڹ淶-��5����-��¼�����ڰ���Ӧ����ӿڹ淶��ȫ����ƽ̨��������-������ձ���
 * ���Թ����е�����������ʻ����������ԣ�1��������openƽ̨�в��Ҵ𰸣�
 * 							        ���Թ����е������������������ https://open.unionpay.com/ajweb/help/faq/list �������� FAQ �����������
 *                             ���Թ����в�����6λӦ����������������https://open.unionpay.com/ajweb/help/respCode/respCodeList ����Ӧ���������������
 *                           2�� ��ѯ�����˹�֧�֣� open.unionpay.comע��һ���û�����½�����Ͻǵ�������߿ͷ�������ѯ�˹�QQ����֧�֡�
 * ����˵�����ɹ��Ľ��ײŻᷢ�ͺ�̨֪ͨ������˽����뽻��״̬��ѯ���׽��ʹ��ȷ�������Ƿ�ɹ�
 */

public class BackRcvResponse extends HttpServlet{

	@Override
	public void init() throws ServletException {
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

		LogUtil.writeLog("BackRcvResponse���պ�̨֪ͨ��ʼ");
		
		String encoding = req.getParameter(SDKConstants.param_encoding);
		// ��ȡ����֪ͨ���������͵ĺ�̨֪ͨ����
		Map<String, String> reqParam = getAllRequestParam(req);

		LogUtil.printRequestLog(reqParam);

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
			LogUtil.writeLog("��֤ǩ�����[ʧ��].");
			//��ǩʧ�ܣ�������ǩ����
			
		} else {
			LogUtil.writeLog("��֤ǩ�����[�ɹ�].");
			//��ע��Ϊ�˰�ȫ��ǩ�ɹ���Ӧ��д�̻��ĳɹ������߼������׳ɹ��������̻�����״̬
			
			String orderId =valideData.get("orderId"); //��ȡ��̨֪ͨ�����ݣ������ֶ�Ҳ�������Ʒ�ʽ��ȡ
			String respCode =valideData.get("respCode"); //��ȡӦ���룬�յ���̨֪ͨ��respCode��ֵһ����00�����Բ���Ҫ�������Ӧ�����жϡ�
			
		}
		LogUtil.writeLog("BackRcvResponse���պ�̨֪ͨ����");
		//���ظ�����������http 200  ״̬��
		resp.getWriter().print("ok");
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException,
			IOException {
		this.doPost(req, resp);
	}

	/**
	 * ��ȡ������������е���Ϣ
	 * 
	 * @param request
	 * @return
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
}
