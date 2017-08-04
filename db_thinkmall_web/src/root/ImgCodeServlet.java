package root;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * 
 * 描述: 生成验证码工具类
 * 版权: Copyright (c) 2014 
 * 公司: 思迪科技 
 * 作者: 邱育武 
 * 版本: 1.0 
 * 创建日期: 2014-6-20 
 * 创建时间: 下午12:21:42
 */
@SuppressWarnings({ "restriction", "serial" })
public class ImgCodeServlet extends HttpServlet
{
	
	private Random generator = new Random();
	
	private Logger logger = Logger.getLogger(ImgCodeServlet.class);
	
	private Color getRandColor(int fc, int bc)
	{
		//给定范围获得随机颜色
		Random random = new Random();
		if (fc > 255)
		{
			fc = 255;
		}
		if (bc > 255)
		{
			bc = 255;
		}
		int r = fc + random.nextInt(bc - fc);
		int g = fc + random.nextInt(bc - fc);
		int b = fc + random.nextInt(bc - fc);
		return new Color(r, g, b);
	}
	
	public ImgCodeServlet()
	{
	}
	
	//private Font mFont=new Font("宋体", Font.PLAIN,12);//设置字体
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		//doGet(request, response);
	}
	
	@SuppressWarnings("unused")
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		//beginTime,endTime 为测试用
		long beginTime;
		long endTime;
		
		//设置页面不缓存
		response.setHeader("Cache-Control", "no-store");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setContentType("image/jpeg");
		
		//测试图像生成时间
		beginTime = System.currentTimeMillis();
		
		// 在内存中创建图象
		//int width = 60, height = 40;
		int width = 100, height = 40;
		BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		
		// 获取图形上下文
		Graphics g = image.getGraphics();
		
		//生成随机类
		Random random = new Random();
		
		// 设定背景色
		g.setColor(getRandColor(200, 250));
		g.fillRect(0, 0, width, height);
		
		//设定字体
		g.setFont(new Font("宋体", Font.PLAIN, 13));
		
		// 随机产生155条干扰线，使图象中的认证码不易被其它程序探测到
		g.setColor(Color.WHITE);
		
		// 取随机产生的认证码(4位数字)
		String sRand = "";
		for (int i = 0; i < 4; i++)
		{
			String rand = "";
			if (i % 2 == 0)
			{
				rand = getValidRand("N", 10, random);
				g.setFont(new Font(rand, 2, height - 5));
			}
			else
			{
				g.setFont(new Font(rand, 0, height - 5));
				rand = getValidRand("N", 10, random);
			}
			g.setColor(new Color(20 + random.nextInt(110), 20 + random.nextInt(110), 20 + random.nextInt(110)));
			g.drawString(String.valueOf(rand), 18 * i + 2, height - random.nextInt(5));
			sRand = sRand + rand;
		}
		// 随机产生88个干扰点，使图象中的认证码不易被其它程序探测到
		for (int i = 0; i < 88; i++)
		{
			int x = random.nextInt(width);
			int y = random.nextInt(height);
			g.drawOval(x, y, 0, 0);
		}
		//		// 将认证码存入SESSION
		//		HttpSession session = request.getSession();
		logger.info("系统生成验证码：" + sRand);
		//		logger.info("SessionID：" + session.getId());
		//		session.setAttribute(WebConstants.SESSION_TICKET, sRand);
		// 将认证码存入SESSION
		String signKey = request.getParameter("signKey");//前端验证码唯一key值
		ImgCodeContainer.saveVcode(signKey, String.valueOf(sRand));
		// 图象生效
		g.dispose();
		
		endTime = System.currentTimeMillis();
		//System.out.println("图像 " + sRand + " 生成时间：" + (endTime - beginTime));
		
		/**
		 * 将验证码通过ImageIO.write方式输出到页面
		 * 该方法已经停用，原因：耗时太长 2007-01-18 by zhanxb
		 */
		//测试图像输出时间
		beginTime = System.currentTimeMillis();
		// 输出图象到页面
		//ImageIO.write(image, "JPEG", response.getOutputStream());
		endTime = System.currentTimeMillis();
		//System.out.println("图像 " + sRand + " 生成文件时间：" + (endTime - beginTime));
		
		/**
		 * 使用JPEGImageEncoder将验证码输出到页面
		 * added by zhanxb 2007-01-18
		 */
		//测试图像输出-new文件时间
		beginTime = System.currentTimeMillis();
		
		ServletOutputStream out = response.getOutputStream();
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
		encoder.encode(image);
		out.close();
		
		endTime = System.currentTimeMillis();
		//System.out.println("图像 " + sRand + " JPEGImageEncoder 生成文件时间：" + (endTime - beginTime));
	}
	
	@SuppressWarnings("unused")
	private void shear(Graphics g, int w1, int h1, Color color)
	{
		
		shearX(g, w1, h1, color);
		shearY(g, w1, h1, color);
	}
	
	public void shearX(Graphics g, int w1, int h1, Color color)
	{
		
		int period = generator.nextInt(2);
		
		boolean borderGap = true;
		int frames = 1;
		int phase = generator.nextInt(2);
		
		for (int i = 0; i < h1; i++)
		{
			double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
			g.copyArea(0, i, w1, 1, (int) d, 0);
			if (borderGap)
			{
				g.setColor(color);
				g.drawLine((int) d, i, 0, i);
				g.drawLine((int) d + w1, i, w1, i);
			}
		}
		
	}
	
	public void shearY(Graphics g, int w1, int h1, Color color)
	{
		
		int period = generator.nextInt(40) + 10; // 50;
		
		boolean borderGap = true;
		int frames = 20;
		int phase = 7;
		for (int i = 0; i < w1; i++)
		{
			double d = (double) (period >> 1) * Math.sin((double) i / (double) period + (6.2831853071795862D * (double) phase) / (double) frames);
			g.copyArea(i, 0, 1, h1, 0, (int) d);
			if (borderGap)
			{
				g.setColor(color);
				g.drawLine(i, (int) d, i, 0);
				g.drawLine(i, (int) d + h1, i, h1);
			}
			
		}
		
	}
	
	/**
	 * 取得合法字符：不能出现如下易混淆的字符: 0（数字）、1（数字）、o（字母）、O（字母）、i、I、l（L）
	 * @param charType
	 * @param count
	 * @return String
	 * @throws Exception
	 */
	public String getValidRand(String charType, int count, Random random)
	{
		//System.out.println("getValidRand: " + charType);
		String invalidCString = "oOiIl";
		//Random random = new Random();
		String rand = "";
		if ("N".equalsIgnoreCase(charType))
		{
			for (int i = 0; i < count; i++)
			{
				rand = String.valueOf(random.nextInt(10));
				if ((rand != null) && (invalidCString.indexOf(rand) == -1))
				{
					return rand;
				}
			}
			return "9";//默认数字为9
		}
		else
		{
			for (int i = 0; i < count; i++)
			{
				char c = 65;
				c = (char) (c + random.nextInt(26));
				rand = String.valueOf(c);
				if ((rand != null) && (invalidCString.indexOf(rand) == -1))
				{
					return rand;
				}
			}
			return "Q";//默认字母为Q
		}
	}
}
