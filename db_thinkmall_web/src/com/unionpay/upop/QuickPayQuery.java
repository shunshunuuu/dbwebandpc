package com.unionpay.upop;

import org.apache.log4j.Logger;

import com.unionpay.upop.domain.QuickPayQueryVo;

/**
 * ����: ����֧���ӿ�
 * ��Ȩ: Copyright (c) 2013
 * ��˾: ˼�ϿƼ� 
 * ����: ��ʥ��
 * �汾: 1.0 
 * ��������: Feb 24, 2014 
 * ����ʱ��: 4:53:36 PM
 */

public class QuickPayQuery
{
	
	private static Logger logger = Logger.getLogger(QuickPayQuery.class);
	
	private QuickPayUtils quickPayUtils = new QuickPayUtils();
	
	/**
	 * ��ѯ�������
	 * @param transType ��������
	 * @param orderNumber �̻�������
	 * @param orderTime  �̻�����ʱ��
	 */
	public String queryTrans(QuickPayQueryVo quickPayQueryVo)
	{
		String res = query(quickPayQueryVo);
		if (res != null && !"".equals(res))
		{
			String[] arr = QuickPayUtils.getResArr(res);
			
			if (checkSecurity(arr))
			{//��֤ǩ��
				return merBusiness(arr);//�̻�ҵ���߼�
			}
		}
		else
		{
			logger.info("���ĸ�ʽΪ��");
		}
		return "";
	}
	
	/**
	 * ���������Ͳ�ѯ����
	 * @param transType
	 * @param orderNumber
	 * @param orderTime
	 * @return
	 */
	public String query(QuickPayQueryVo quickPayQueryVo)
	{
		String[] valueVo = new String[] { QuickPayConf.version,//Э��汾
				QuickPayConf.charset,//�ַ�����
				quickPayQueryVo.getTransType(),//��������
				QuickPayConf.merCode,//�̻�����
				quickPayQueryVo.getOrderNumber(),//������
				quickPayQueryVo.getOrderTime(),//����ʱ��
				""//������  ˵����������յ������������贫�յ������磺{acqCode=00215800}���̻�ֱ�ӽ���upop�����յ�����
		};
		
		return quickPayUtils.doPostQueryCmd(QuickPayConf.queryUrl, new QuickPayUtils().createBackStr(valueVo, QuickPayConf.queryVo));
		
	}
	
	//��֤ǩ�� 
	public boolean checkSecurity(String[] arr)
	{
		//��֤ǩ��
		int checkedRes = quickPayUtils.checkSecurity(arr);
		if (checkedRes == 1)
		{
			return true;
		}
		else if (checkedRes == 0)
		{
			logger.info("��֤ǩ��ʧ��");
			return false;
		}
		else if (checkedRes == 2)
		{
			logger.info("���ĸ�ʽ����");
			return false;
		}
		return false;
	}
	
	//�̻���ҵ���߼�
	public String merBusiness(String[] arr)
	{
		/**
		 * queryResult=0����2ʱ respCodeΪ00�����������respCodeΪ��ȫ�����λ������
		 * queryResultΪ��ʱ���ĸ�ʽ����
		 * queryResult��
		 * 0���ɹ�����Ӧ��respCodeΪ00��
		 * 1��ʧ�ܣ���Ӧ��respCode��00��
		 * 2�������У���Ӧ��respCodeΪ00��
		 * 3���޴˽��ף���Ӧ��respCode��00��
		*/
		
		String queryResult = "";
		for (int i = 0; i < arr.length; i++)
		{
			String[] queryResultArr = arr[i].split("=");
			// �����̻�ҵ���߼�
			if (queryResultArr.length >= 2 && "queryResult".equals(queryResultArr[0]))
			{
				queryResult = arr[i].substring(queryResultArr[0].length() + 1);
				break;
			}
		}
		if (queryResult != "")
		{
			if ("0".equals(queryResult))
			{
				logger.info("���׳ɹ�");
			}
			if ("1".equals(queryResult))
			{
				logger.info("����ʧ��");
			}
			if ("2".equals(queryResult))
			{
				logger.info("���״�����");
			}
			if ("3".equals(queryResult))
			{
				logger.info("�޴˽���");
			}
		}
		else
		{
			logger.info("���ĸ�ʽ����");
		}
		return queryResult;
	}
}
