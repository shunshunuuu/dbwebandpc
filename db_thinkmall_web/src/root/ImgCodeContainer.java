package root;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.log4j.Logger;

import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.redis.client.JedisClient;
import com.thinkive.weixin.base.ReidsConstants;

/**
 * 
 * ����: ��֤������
 * ��Ȩ: Copyright (c) 2014 
 * ��˾: ˼�ϿƼ� 
 * ����: ������ 
 * �汾: 1.0 
 * ��������: 2015-3-6 
 * ����ʱ��: ����9:58:57
 */
public class ImgCodeContainer
{
	
	private static Logger logger = Logger.getLogger(ImgCodeContainer.class);
	
	private static DataRow vcodeMap = new DataRow();//��֤��洢������������200������ڵ���֤��
	
	private static final long PERIOD_DAY = 24 * 60 * 60 * 1000;
	
//	static String VCODE_KEY = "vcode_key@";
	
	public static void saveVcode(String key, String vcode)
	{
		JedisClient client = new JedisClient();
		key = ReidsConstants.VCODE_KEY + key;
		client.set(key, vcode, 120);
		//Object ff = client.getString(key);
		//vcodeMap.set(key, vcode);
		logger.info("��֤��" + key + "=" + client.getString(key));
	}
	
	public static String getVcode(String key)
	{
		JedisClient client = new JedisClient();
		key = ReidsConstants.VCODE_KEY + key;
		return client.getString(key);
		//return vcodeMap.getString(key);
	}
	
	public static void removeVcode(String key)
	{
		JedisClient client = new JedisClient();
		key = ReidsConstants.VCODE_KEY + key;
		client.delete(key);
		//vcodeMap.remove(key);
	}
	
	public static DataRow getVcodeMap()
	{
		return vcodeMap;
	}
	
	// ���ӻ��������  
	private static Date addDay(Date date, int num)
	{
		Calendar startDT = Calendar.getInstance();
		startDT.setTime(date);
		startDT.add(Calendar.DAY_OF_MONTH, num);
		return startDT.getTime();
	}
	
	//������ʱ��
	public static void timerTask()
	{
		int hour = Configuration.getInt("ImgCode.hour", 4);//Ĭ���賿4��  
		int minute = Configuration.getInt("ImgCode.minute", 0);
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, hour);
		calendar.set(Calendar.MINUTE, minute);
		calendar.set(Calendar.SECOND, 0);
		Date date = calendar.getTime(); //��һ��ִ�ж�ʱ�����ʱ��  
		//�����һ��ִ�ж�ʱ�����ʱ�� С�ڵ�ǰ��ʱ��  
		//��ʱҪ�� ��һ��ִ�ж�ʱ�����ʱ���һ�죬�Ա���������¸�ʱ���ִ�С��������һ�죬���������ִ�С�  
		if (date.before(new Date()))
		{
			date = addDay(date, 1);
		}
		Timer timer = new Timer();
		timer.schedule(new TimerTask()
		{
			
			public void run()
			{
				logger.info("������֤����������ʼִ�У�");
				logger.info("����ǰ������С��" + vcodeMap.size());
				vcodeMap = new DataRow();
				logger.info("���ú�������С��" + vcodeMap.size());
				logger.info("������֤�������������ִ�У�");
			}
		}, date, PERIOD_DAY);
	}
}
