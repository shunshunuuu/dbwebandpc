package com.thinkive.project;


/**
 * @描述：业务bus功能号调用
 * @版权：Copyright (c) 2015
 * @公司：思迪科技
 * @作者： Administrator
 * @版本：3.0
 * @时间：2015-9-6 下午6:11:06
 * 
 */
public class FuncConstant
{
	/** 查询新消息数量信息 */
	public static int QUERY_NEW_MSG_SIZE = 1000165;
	
	/**
	 * 奥运分享活动
	 */
	public static String AOYUN_TYPE = "5";
	public static String AOYUN_PRE_URL = "http://10.124.8.57:8080/h";
	public static String AOYUN_TOKEN_KEY = "12345fd";
	
	/** 我的个人中心里嵌入对账单地址 */
	public static String CHANNEL_CODE ="APP" ; //渠道代码
	public static String MY_ACCOUNT_URL = "http://122.141.224.5:1001/CRH-BILL0002.json";
	
	/** 访问中焯接口地址 */
	public static String SD_ZZ_LOGIN_URL = "http://192.18.69.113:8008/reqxml";
	public static String CLIENT_INFO_ACTION = "46150";//统一登录以后获取用户信息接口
	public static String APPID = "id01";//设备标识
	
	/**
     * 中秋分享活动
     */
    public static String MIDAUTUMN_TYPE = "5";
   // public static String MIDAUTUMN_URL = "http://wxtest.sogood360.com:81/h";//测试环境
    public static String MIDAUTUMN_URL = "http://10.124.12.57:8080/h";//生产环境
    public static String MIDAUTUMN_TOKEN_KEY = "zxcvbnm";
    /**
     * 大转盘活动
     */
    public static String BIGWHEEL_URL = "http://jcmi.ren/servlet/json?";//测试环境
//    public static String BIGWHEEL_URL = "http://10.124.12.57:8080/h";//生产环境
    /**
     * 云纪注册
     */
    public static String YJREGISTER_URL = "https://matchdev.yjifs.com/ifsunion/func_register_and_login_outer";
}
