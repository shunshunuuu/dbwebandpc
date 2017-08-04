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
 * @����  ����Ť������֤��
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
		{//������ɲ�ͬ��ʽ��֤�� 
			case 0:
				cs.setFilterFactory(new CurvesRippleFilterFactory(cs.getColorFactory()));//ȡ�ֲ���
				break;
			case 1:
				cs.setFilterFactory(new MarbleRippleFilterFactory());//����ʯ����
				break;
			case 2:
				cs.setFilterFactory(new DoubleRippleFilterFactory());//˫����
				break;
			case 3:
				cs.setFilterFactory(new WobbleRippleFilterFactory());//�ڲ���
				break;
			case 4:
				cs.setFilterFactory(new DiffuseRippleFilterFactory());//˫����
				break;
		}
		
		setResponseHeader(response); //������Ӧͷ
		
		HttpSession session = request.getSession(true);
		OutputStream os = response.getOutputStream();
		
		String r = request.getParameter("r") ;
		try
		{
			//DateHelper.parseString(r,"yyyy-MM-dd hh:MM:ss");
		}
		catch (Exception e)
		{
			logger.info("��֤������ʧ�ܣ�����Ƿ���������Σ�" + r ) ;
			return null;
		}
		
		//String codeStr = EncoderHelper.getChallangeAndWriteImage(cs, "png", os);//������֤��
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(os);
		Captcha captcha = cs.getCaptcha() ;//�õ�Captcha��������BufferedImage������֤���ַ���
		encoder.encode(captcha.getImage());//�õ�BufferedImage����
		String codeStr = captcha.getChallenge() ;//��֤���ַ���
		logger.info("��ǰ��SessionID=" + session.getId() + "����֤��=" + codeStr);
		
		SessionHelper.setString(AccesserConstants.TICKET, codeStr, session);//����session��
		os.flush();//�ر������
		os.close();
		return null;
	}
	
	/**
	 * �����������Ӧͷ
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