package root;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.oreilly.servlet.MultipartRequest;
import com.thinkive.base.config.Configuration;
import com.thinkive.base.jdbc.DataRow;
import com.thinkive.base.util.FileHelper;
import com.thinkive.base.util.SessionHelper;
import com.thinkive.base.util.StringHelper;
import com.thinkive.base.util.security.AES;
import com.thinkive.gateway.v2.result.Result;
import com.thinkive.project.WebConstants;
import com.thinkive.project.util.BusClientUtil;
import com.thinkive.tbservice.util.JsonHelper;
import com.thinkive.web.base.ActionResult;
import com.thinkive.web.base.BaseAction;
import com.thinkive.web.system.Application;

/**
 * @description:图片上传,接入服务器不作权限控制.
 * @author:SIMON
 * @create_time:2014年4月29日 下午12:32:56
 */
public class FileUpload extends BaseAction
{
	
	private static Logger logger = Logger.getLogger(FileUpload.class);
	
	private static String FILE_URL = Configuration.getString("file.fileUrl"); //保存数据库的路径
	
	private static String FILE_PATH = Application.getRootPath() + FILE_URL;; //文件路径
	
	private static String FUNC_NO_HEADER = Configuration.getString("file.funcNo"); //上传文件功能号--头像上传
	
	private static int MAX_UPLOAD_SIZE = 1000000; //定义上传的最大限制
	 
	private static String  verifyKey = Configuration.getString("system.verifyKey") ;
	
	/**
	 * @description:图片上传实现类
	 * @author:SIMON
	 * @create_time:2014年4月29日 下午12:34:45
	 * @return
	 */
	public ActionResult doUploadImg()
	{
		upload();
		return null;
	}
	
	private void upload()
	{
		JSONObject json = new JSONObject();
		int contentLength = getRequest().getContentLength();
		if (contentLength > MAX_UPLOAD_SIZE)
		{
			String errmsg = JsonHelper.getJSONString("你上传文件太大了,上传失败");
			json.put("errorno", "-1");
			json.put("errmsg", errmsg);
			this.getWriter().print(json);
			return;
		}
		//设置上传文件保存地址.未发现创建地址.
		String basePath = FileHelper.normalize(FILE_PATH);
		logger.info("文件上传路径" + basePath);
		if (!FileHelper.isDirectory(basePath))
		{
			FileHelper.createDirectory(basePath);
		}
		MultipartRequest multi = null;
		try
		{
			multi = new MultipartRequest(getRequest(), basePath, MAX_UPLOAD_SIZE, "UTF-8");
			// 得到所有的文件,在此只处理一个文件
			File file = multi.getFile("headerImg");
			
			boolean flag = isImage(file);
			if(!flag){
				
				json.put("errorno", "-1");
				json.put("errmsg", "上传图片不是图片文件");
				this.getWriter().print(json);
				return;
			}
			if (file != null)
			{
				String fileName = file.getName();
				String extName = FileHelper.getExtension(fileName);
				/** YQF 2008-10-21 修改上传文件扩展名限制 * */
				if ("jsp|jspx".indexOf(extName.toLowerCase()) != -1)
				{
					/** xl 2011-12-20 删除上传的非法扩展名文件 * */
					String tempPath = basePath + fileName;
					if (StringHelper.isNotEmpty(tempPath))
					{
						FileHelper.deleteFile(tempPath);
					}
					json.put("errorno", "-1");
					json.put("errmsg", "非法文件,上传失败");
					this.getWriter().print(json);
					return;
				}
				String newFileName = getSysFileName();
				newFileName = newFileName + "." + extName;
				String destFile = FILE_PATH +File.separator + newFileName;
				destFile = FileHelper.normalize(destFile);
				FileHelper.renameTo(file.getPath(), destFile);
				
				logger.info("上传文件地址" + file.getPath());
				
				
				logger.info("文件上传成功");
				
				json.put("errorno", "0");
				json.put("errmsg", "上传成功");
				
				String fileUrl = FILE_URL + "/" + newFileName;
				logger.info("fileUrl:" + fileUrl);
				json.put("filepath", fileUrl);
				Result result = saveImg2Server(fileUrl);
				if (StringHelper.isNotEmpty(result.getErr_no() + ""))
				{
					this.getWriter().print(json);
					return;
				}
				else
				{
					json.put("errorno", result.getErr_no());
					json.put("errmsg", result.getErr_info());
					FileHelper.deleteFile(destFile);
					this.getWriter().print(json);
					return;
				}
			}
			
		}
		catch (IOException e)
		{
			e.printStackTrace();
			json.put("errorno", "-1");
			json.put("errmsg", "文件流系统异常,上传失败");
			this.getWriter().print(json);
			return;
		}
		
	}
	
	/**
	 * @description:
	 * @author:SIMON
	 * @create_time:2014年4月29日 下午4:53:56
	 * @param fileUrl
	 * @return
	 */
	private Result saveImg2Server(String fileUrl)
	{
		Result result = new Result();
		String user = SessionHelper.getString(WebConstants.SESSION_USER_ID, getSession());
		AES aes = new AES(verifyKey);
		user = aes.decrypt(user, "UTF-8") ;
		if (StringHelper.isEmpty(user))
		{
			logger.info("当前用户没有登陆或登陆过期,非法操作!");
			result.setErr_no(-999);
			result.setErr_info("当前用户没有登陆或登陆过期,非法操作!");
			return result;
		}
		DataRow map = new DataRow();
		map.put("user_id", user);
		map.put("img_url", fileUrl);
		result = BusClientUtil.invoke(Integer.parseInt(FUNC_NO_HEADER), map);
		return result;
	}
	/**
	 * @description:文件重命名
	 * @author:SIMON
	 * @create_time:2014年5月5日 上午11:25:06
	 * @return
	 */
	private static String getSysFileName()
	{
		String name = String.valueOf(System.currentTimeMillis());
		return name;
	}
	/**
	 * @description:判断上传图片是否是图片
	 * @author:SIMON
	 * @create_time:2014年5月5日 上午11:25:22
	 * @param file
	 * @return
	 */
	public static boolean isImage(File file){
		ImageInputStream iis = null;
		try {
			iis = ImageIO.createImageInputStream(file);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			logger.error("上传文件错误");
			return false;
		}
		Iterator iter = ImageIO.getImageReaders(iis);
		if (!iter.hasNext()) {
			//文件不是图片 
			logger.error("上传文件："+file.getName()+" 不是图片文件");
			return false;
		}
		ImageReader reader = (ImageReader) iter.next();
		try {
			logger.info("上传图片格式为:"+reader.getFormatName());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			logger.info("获取图片后缀失败");
			return false;
		}finally{
			try {
				iis.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return true;
		
	}
	
	public static void main(String[] args) {
		File file = new File("C:\\Users\\simom\\Desktop\\t_catalog.gif");
		isImage(file);
	}
	
}
