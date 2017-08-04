package root.pay.util;



public class JumpUtil {
	public static String getJumpHtml(String url){
		StringBuilder strBuilder = new StringBuilder();
		strBuilder.append("<!DOCTYPE html><html><head>");
		strBuilder.append("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">");
		strBuilder.append("<script language=\"javascript\">");
		strBuilder.append("window.location.href = \"");
		strBuilder.append(url);
		strBuilder.append("\";");
		strBuilder.append("</script></head><body></body></html>");
		return strBuilder.toString();
	}
	
}
