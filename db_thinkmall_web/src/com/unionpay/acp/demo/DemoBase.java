package com.unionpay.acp.demo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import com.thinkive.base.config.Configuration;
import com.unionpay.acp.sdk.AcpService;
import com.unionpay.acp.sdk.SDKConfig;
import com.unionpay.acp.sdk.SDKConstants;

/**
 * ���ƣ� demo���õ��ķ���<br>
 * ���ڣ� 2015-09<br>
 * �汾�� 1.0.0 
 * ��Ȩ�� �й�����<br>
 * ˵�������´���ֻ��Ϊ�˷����̻����Զ��ṩ���������룬�̻����Ը����Լ���Ҫ�����ռ����ĵ���д���ô�������ο���<br>
 */
public class DemoBase {

	//Ĭ�����õ���UTF-8
	public static String encoding_UTF8 = "UTF-8";
	
	public static String encoding_GBK = "GBK";
	//ȫ�����̶�ֵ
	public static String version = "5.0.0";
	
	//�̻���
	public static String merId = Configuration.getString("upop.merCode");
	
	//��̨�����Ӧ��д������ FrontRcvResponse.java
	public static String frontUrl = Configuration.getString("upop.merFrontEndUrl");

	//��̨�����Ӧ��д������ BackRcvResponse.java
	public static String backUrl = Configuration.getString("upop.merBackEndUrl");//�����ͷ�������ѡ��д����[O]--��̨֪ͨ��ַ

	// �̻����ͽ���ʱ�� ��ʽ:YYYYMMDDhhmmss
	public static String getCurrentTime() {
		return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
	}
	
	// AN8..40 �̻������ţ����ܺ�"-"��"_"
	public static String getOrderId() {
		return new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
	}
	
   /**
	 * ��װ���󣬷��ر����ַ���������ʾ
	 * @param data
	 * @return
	 */
    public static String genHtmlResult(Map<String, String> data){

    	TreeMap<String, String> tree = new TreeMap<String, String>();
		Iterator<Entry<String, String>> it = data.entrySet().iterator();
		while (it.hasNext()) {
			Entry<String, String> en = it.next();
			tree.put(en.getKey(), en.getValue());
		}
		it = tree.entrySet().iterator();
		StringBuffer sf = new StringBuffer();
		while (it.hasNext()) {
			Entry<String, String> en = it.next();
			String key = en.getKey(); 
			String value =  en.getValue();
			if("respCode".equals(key)){
				sf.append("<b>"+key + SDKConstants.EQUAL + value+"</br></b>");
			}else
				sf.append(key + SDKConstants.EQUAL + value+"</br>");
		}
		return sf.toString();
    }
    /**
	 * ���ܣ�����ȫ�����̻������ļ��е�ZM�ļ�����List<Map>��ʽ����
	 * ���ý��ף������ļ����غ���ļ��Ĳ鿴
	 * @param filePath ZM�ļ�ȫ·��
	 * @return ����ÿһ�ʽ����� ���к� �� ֵ ��map����
	 */
	public static List<Map> parseZMFile(String filePath){
		int lengthArray[] = {3,11,11,6,10,19,12,4,2,21,2,32,2,6,10,13,13,4,15,2,2,6,2,4,32,1,21,15,1,15,32,13,13,8,32,13,13,12,2,1,131};
		return parseFile(filePath,lengthArray);
	}
	
	/**
	 * ���ܣ�����ȫ�����̻������ļ��е�ZME�ļ�����List<Map>��ʽ����
	 * ���ý��ף������ļ����غ���ļ��Ĳ鿴
	 * @param filePath ZME�ļ�ȫ·��
	 * @return ����ÿһ�ʽ����� ���к� �� ֵ ��map����
	 */
	public static List<Map> parseZMEFile(String filePath){
		int lengthArray[] = {3,11,11,6,10,19,12,4,2,21,2,32,2,6,10,13,13,4,15,2,2,6,2,4,32,1,21,15,1,15,32,13,13,8,32,13,13,12,2,1,131};
		return parseFile(filePath,lengthArray);
	}
	
	/**
	 * ���ܣ�����ȫ�����̻� ZM,ZME�����ļ�
	 * @param filePath
	 * @param lengthArray ���ա�ȫ����ƽ̨����ӿڹ淶 ��3���� �ļ��ӿڡ� ȫ�����̻������ļ� 6.1 ZM�ļ���6.2 ZME �ļ� ��ʽ�����ͳ������int������
	 * @return
	 */
	 private static List<Map> parseFile(String filePath,int lengthArray[]){
	 	List<Map> ZmDataList = new ArrayList<Map>();
	 	try {
            String encoding="UTF-8";
            File file=new File(filePath);
            if(file.isFile() && file.exists()){ //�ж��ļ��Ƿ����
                InputStreamReader read = new InputStreamReader(
                new FileInputStream(file),encoding);//���ǵ������ʽ
                BufferedReader bufferedReader = new BufferedReader(read);
                String lineTxt = null;
                while((lineTxt = bufferedReader.readLine()) != null){
                	//�����Ľ��MAP��keyΪ�����ļ�����ţ�valueΪ������ֵ
        		 	Map<Integer,String> ZmDataMap = new LinkedHashMap<Integer,String>();
                    //����α�
                    int leftIndex = 0;
                    //�Ҳ��α�
                    int rightIndex = 0;
                    for(int i=0;i<lengthArray.length;i++){
                    	rightIndex = leftIndex + lengthArray[i];
                    	String filed = lineTxt.substring(leftIndex,rightIndex);
                    	leftIndex = rightIndex+1;
                    	ZmDataMap.put(i, filed);
                    }
                    ZmDataList.add(ZmDataMap);
                }
                read.close();
        }else{
            System.out.println("�Ҳ���ָ�����ļ�");
        }
        } catch (Exception e) {
            System.out.println("��ȡ�ļ����ݳ���");
            e.printStackTrace();
        }
	 	for(int i=0;i<ZmDataList.size();i++){
	 		System.out.println("����: "+ (i+1));
	 		Map<Integer,String> ZmDataMapTmp = ZmDataList.get(i);
	 		
	 		for(Iterator<Integer> it = ZmDataMapTmp.keySet().iterator();it.hasNext();){
	 			Integer key = it.next();
	 			String value = ZmDataMapTmp.get(key);
		 		System.out.println("��ţ�"+ key + " ֵ: '"+ value +"'");
		 	}
	 	}
		return ZmDataList;	
	}

		
	public static void main(String[] args) {
		System.out.println(AcpService.encryptTrack("12", "utf-8"));
		SDKConfig.getConfig().loadPropertiesFromSrc();
		
		Map<String,String> customerInfoMap = new HashMap<String,String>();
		//customerInfoMap.put("certifTp", "01");
		//customerInfoMap.put("certifId", "341126197709218366");
		//customerInfoMap.put("customerNm", "������");
		customerInfoMap.put("phoneNo", "13552535506");
		//customerInfoMap.put("smsCode", "123456");
		//customerInfoMap.put("pin", "626262");						//�������
		//customerInfoMap.put("cvn2", "123");           				//�������cvn2��λ����
		//customerInfoMap.put("expired", "1711");  				    //��Ч�� ����ǰ���ں�
		
		//System.out.println(getCustomerInfoWithEncrypt(customerInfoMap,"6217001210048797565"));
		
		parseZMFile("C:\\Users\\wulh\\Desktop\\802310048993424_20150905\\INN15090588ZM_802310048993424");
	}

}