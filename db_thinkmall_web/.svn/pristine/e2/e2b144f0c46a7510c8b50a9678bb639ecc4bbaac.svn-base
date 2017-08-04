package root;

import java.awt.Color;
import java.io.OutputStream;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.patchca.color.ColorFactory;
import org.patchca.filter.predefined.CurvesRippleFilterFactory;
import org.patchca.filter.predefined.DiffuseRippleFilterFactory;
import org.patchca.filter.predefined.DoubleRippleFilterFactory;
import org.patchca.filter.predefined.MarbleRippleFilterFactory;
import org.patchca.filter.predefined.WobbleRippleFilterFactory;
import org.patchca.service.Captcha;
import org.patchca.service.ConfigurableCaptchaService;
import org.patchca.word.RandomWordFactory;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.tbservice.constant.AccesserConstants;
import com.thinkive.web.base.Action;
import com.thinkive.web.base.ActionResult;

/**
 * @author HUANGRONALDO
 * @time 2014-10-08
 * @功能  生成扭曲的验证码
 */

public class Image implements Action
{
	private static Logger logger = Logger.getLogger(Image.class);
	
	private static ConfigurableCaptchaService cs = new ConfigurableCaptchaService();
	
	private static int MAX_LENGTH = 4;
	
	private static int MIN_LENGTH = 4;
	
	private static Random random = new Random();
	static
	{
		//	        cs.setColorFactory(new SingleColorFactory(new Color(25, 60, 170)));
		cs.setColorFactory(new ColorFactory()
		{
			
			@Override
			public Color getColor(int x)
			{
				int[] c = new int[3];
				int i = random.nextInt(c.length);
				for (int fi = 0; fi < c.length; fi++)
				{
					if (fi == i)
					{
						c[fi] = random.nextInt(71);
					}
					else
					{
						c[fi] = random.nextInt(256);
					}
				}
				return new Color(c[0], c[1], c[2]);
			}
		});
		RandomWordFactory wf = new RandomWordFactory();
		wf.setCharacters("123456789");
		wf.setMaxLength(MAX_LENGTH);
		wf.setMinLength(MIN_LENGTH);
		cs.setWordFactory(wf);
	}
	
	@Override
	public ActionResult execute(HttpServletRequest request, HttpServletResponse response) throws Exception
	{
		switch (random.nextInt(5))
		{//随机生成不同形式验证码 
			case 0:
				cs.setFilterFactory(new CurvesRippleFilterFactory(cs.getColorFactory()));//取现波纹
				break;
			case 1:
				cs.setFilterFactory(new MarbleRippleFilterFactory());//大理石波纹
				break;
			case 2:
				cs.setFilterFactory(new DoubleRippleFilterFactory());//双波纹
				break;
			case 3:
				cs.setFilterFactory(new WobbleRippleFilterFactory());//摆波纹
				break;
			case 4:
				cs.setFilterFactory(new DiffuseRippleFilterFactory());//双波纹
				break;
		}
		
		setResponseHeader(response); //设置响应头
		
		HttpSession session = request.getSession(true);
		OutputStream os = response.getOutputStream();
		
		String r = request.getParameter("r") ;
		try
		{
			//DateHelper.parseString(r,"yyyy-MM-dd hh:MM:ss");
		}
		catch (Exception e)
		{
			logger.info("验证码生成失败，请勿非法操作！入参：" + r ) ;
			return null;
		}
		
		//String codeStr = EncoderHelper.getChallangeAndWriteImage(cs, "png", os);//生成验证码
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(os);
		Captcha captcha = cs.getCaptcha() ;//得到Captcha对象，生成BufferedImage对象，验证码字符串
		encoder.encode(captcha.getImage());//得到BufferedImage对象
		String codeStr = captcha.getChallenge() ;//验证码字符串
		logger.info("当前的SessionID=" + session.getId() + "，验证码=" + codeStr);
		
		SessionHelper.setString(AccesserConstants.TICKET, codeStr, session);//保存session中
		os.flush();//关闭输出流
		os.close();
		return null;
	}
	
	/**
	 * 设置输出流响应头
	 */
	private void setResponseHeader(HttpServletResponse response)
	{
		response.setContentType("image/jpeg");
		response.setHeader("cache", "no-cache");
		response.setHeader("Cache-Control", "no-cache, no-store");
		response.setHeader("Pragma", "no-cache");
		long time = System.currentTimeMillis();
		response.setDateHeader("Last-Modified", time);
		response.setDateHeader("Date", time);
		response.setDateHeader("Expires", time);
	}
}