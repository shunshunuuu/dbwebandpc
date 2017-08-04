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
 * 描述: 验证码容器
 * 版权: Copyright (c) 2014 
 * 公司: 思迪科技 
 * 作者: 邱育武 
 * 版本: 1.0 
 * 创建日期: 2015-3-6 
 * 创建时间: 上午9:58:57
 */
public class ImgCodeContainer
{
	
	private static Logger logger = Logger.getLogger(ImgCodeContainer.class);
	
	private static DataRow vcodeMap = new DataRow();//验证码存储容器可以容纳200万个以内的验证码
	
	private static final long PERIOD_DAY = 24 * 60 * 60 * 1000;
	
//	static String VCODE_KEY = "vcode_key@";
	
	public static void saveVcode(String key, String vcode)
	{
		JedisClient client = new JedisClient();
		key = ReidsConstants.VCODE_KEY + key;
		client.set(key, vcode, 120);
		//Object ff = client.getString(key);
		//vcodeMap.set(key, vcode);
		logger.info("验证码" + key + "=" + client.getString(key));
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
	
	// 增加或减少天数  
	private static Date addDay(Date date, int num)
	{
		Calendar startDT = Calendar.getInstance();
		startDT.setTime(date);
		startDT.add(Calendar.DAY_OF_MONTH, num);
		return startDT.getTime();
	}
	
	//启动定时器
	public static void timerTask()
	{
		int hour = Configuration.getInt("ImgCode.hour", 4);//默认凌晨4点  
		int minute = Configuration.getInt("ImgCode.minute", 0);
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.HOUR_OF_DAY, hour);
		calendar.set(Calendar.MINUTE, minute);
		calendar.set(Calendar.SECOND, 0);
		Date date = calendar.getTime(); //第一次执行定时任务的时间  
		//如果第一次执行定时任务的时间 小于当前的时间  
		//此时要在 第一次执行定时任务的时间加一天，以便此任务在下个时间点执行。如果不加一天，任务会立即执行。  
		if (date.before(new Date()))
		{
			date = addDay(date, 1);
		}
		Timer timer = new Timer();
		timer.schedule(new TimerTask()
		{
			
			public void run()
			{
				logger.info("重置验证码容器任务开始执行！");
				logger.info("重置前容器大小！" + vcodeMap.size());
				vcodeMap = new DataRow();
				logger.info("重置后容器大小！" + vcodeMap.size());
				logger.info("重置验证码容器任务结束执行！");
			}
		}, date, PERIOD_DAY);
	}
}
