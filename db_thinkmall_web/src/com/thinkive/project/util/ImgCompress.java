package com.thinkive.project.util;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.imageio.ImageIO;

import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGImageEncoder;

/**
 * ͼƬѹ������
 */
public class ImgCompress {
	private Image img;
	private int width;
	private int height;
	//�ļ�����·��
	private String filePath;
	
	/**
	 * �����ļ���
	 * @param fileName
	 * @param filePath
	 * @throws IOException
	 */
	public ImgCompress(String fileName,String filePath) throws IOException {
		File file = new File(fileName);// �����ļ�
		img = ImageIO.read(file);      // ����Image����
		width = img.getWidth(null);    // �õ�Դͼ��
		height = img.getHeight(null);  // �õ�Դͼ��
		this.filePath = filePath;
	}
	
	/**
	 * �������Ĺ��캯��
	 * @param inputStream
	 * @param filePath
	 * @throws IOException
	 */
	public ImgCompress(InputStream inputStream,String filePath) throws IOException {
		img = ImageIO.read(inputStream);      // ����Image����
		width = img.getWidth(null);    // �õ�Դͼ��
		height = img.getHeight(null);  // �õ�Դͼ��
		this.filePath = filePath;
	}
	/**
	 * ���տ�Ȼ��Ǹ߶Ƚ���ѹ��
	 * @param w int �����
	 * @param h int ���߶�
	 */
	public void resizeFix(int w, int h) throws IOException {
		if (width / height > w / h) {
			resizeByWidth(w);
		} else {
			resizeByHeight(h);
		}
	}
	/**
	 * �Կ��Ϊ��׼���ȱ�������ͼƬ
	 * @param w int �¿��
	 */
	public void resizeByWidth(int w) throws IOException {
		int h = (int) (height * w / width);
		resize(w, h);
	}
	/**
	 * �Ը߶�Ϊ��׼���ȱ�������ͼƬ
	 * @param h int �¸߶�
	 */
	public void resizeByHeight(int h) throws IOException {
		int w = (int) (width * h / height);
		resize(w, h);
	}
	/**
	 * ǿ��ѹ��/�Ŵ�ͼƬ���̶��Ĵ�С
	 * @param w int �¿��
	 * @param h int �¸߶�
	 */
	public void resize(int w, int h) throws IOException {
		// SCALE_SMOOTH �������㷨 ��������ͼƬ��ƽ���ȵ� ���ȼ����ٶȸ� ���ɵ�ͼƬ�����ȽϺ� ���ٶ���
		BufferedImage image = new BufferedImage(w, h,BufferedImage.TYPE_INT_RGB ); 
		image.getGraphics().drawImage(img, 0, 0, w, h, null); // ������С���ͼ
		File destFile = new File(this.filePath);
		FileOutputStream out = new FileOutputStream(destFile); // ������ļ���
		// ��������ʵ��bmp��png��gifתjpg
		JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(out);
		encoder.encode(image); // JPEG����
		out.close();
	}
	
	@SuppressWarnings("deprecation")
	public static void main(String[] args) throws Exception {
		System.out.println("��ʼ��" + new Date().toLocaleString());
		ImgCompress imgCom = new ImgCompress("C:\\q.jpg","C:\\a\\2.jpg");
		imgCom.resizeByWidth(120);
		System.out.println("������" + new Date().toLocaleString());
	}
}