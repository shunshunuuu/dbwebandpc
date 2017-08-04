/**
 * 商城业务常量配置
 */
define(function(require, exports, module) {

	var serviceConstant = {
		register : {
			"account_name" : "1"
		},

		BusConstants : {
			"SUCCESS" : "0"
		},
		// 平台类型
		platform : {
			"PLATFORM_PC" : "0", // PC
			"PLATFORM_ANDROID" : "1", //android
			"PLATFORM_IOS" : "2" // ios
		},
		//短信内容类型
		sms_type : {
			"update_mobilephone" : "0", // 更换手机验证码 
			"success_client" : "1", // 委托成功
			"register_mobilePhone" : "2", // 注册手机验证码
			"forget_mobilePhone" : "3", // 忘记手机验证码
			"msg_login" : "7" // 手机短信登录
		},
		
		//默认地址
		is_default : {
			"YES" : "1",
			"NO" : "0"
		},

		// 渠道
		channel_code : {
			"PC" : "0",
			"ANDROID" : "1",
			"IOS" : "2"
		},

		// 上下架
		product_shelf : {
			"SHELF_ON" : "1",
			"SHELF_OFF" : "0"
		},

		product_sub_type : { // 产品子类别
			"FUND" : "0", // 基金
			"FINANCIAL" : "1", // 理财
			"INFO" : "3", // 资讯
			"SERVICE" : "2" // 服务
		},
		service_type : { // 服务类别
			"phone" : "0", // 电话
			"email" : "1", // 邮件
			"sms" : "2", // 短信
			"im" : "3", // im
			"youxianji" : "4",// 优先级
			"iy34" : "3,4",// IM优先级
			"yi43" : "4,3",// 优先级IM
			"mms" : "5",// 彩信
			"app" : "6"// APP
		},
		/**
		 * 用户持久化常量 保存.
		 */
		session : {
			"USER" : "user",
			"ORDER" : "order",
			"ORDER_PAY" : "order_pay",
			"URL_PARAM" : "url_param"
		},
		/**
		 * 是否绑定资金账号
		 */
		is_fundaccount : {
			"YES" : "1",
			"NO" : "0"
		},
		/**
		 * 是否生成订单
		 */
		is_order : {
			"YES" : "1",
			"NO" : "0"
		},
		/**
		 * 是否已做风险测评
		 */
		is_risk : {
			"YES" : "1",
			"NO" : "0",
			"LOW" : "2",
			"Theree" : "3"
		},
		/**
		 * 是否已签署协议
		 */
		is_sign : {
			"YES" : "1",
			"NO" : "0"
		},

		/**
		 * 
		 */
		entrust_state : {
			"NO" : "0",// 未委托
			"SUCCESS" : "1", // 委托成功
			"FAIL" : "2"// 委托失败
		},

		/**
		 * 是否是首次购买
		 */
		first_buy : {
			"YES" : "1",// 追加购买
			"No" : "0" // 首次购买
		},

		/**
		 * 订单状态
		 */
		order_state : {
			"NEW" : "0", // 新建
			"SUBMIT" : "1", // 待提交
			"SUBMIT_SUCCESS" : "2", // 提交成功
			"FAIL" : "3", // 失败
			"SUCCESS" : "4", // 成交
			"CANCEL" : "5", // 取消
			"revoke" : "6", // 撤单
			"REFUND" : "7" // 已退款
		},
		
		/**
		 * 业务类别
		 */
		business_type : {
			"SUBSCRIBE" : "0", // 认购
			"PURCHASE" : "1", // 申购
			"REDEMPTION" : "2", // 赎回
			"BUY" : "3", // 买入
			"SELL" : "4" // 卖出
		},

		/**
		 * 需要加密的参数名
		 */
		rsaParam : {
			TRADE_PWD : "trade_pwd",
			FUND_PWD : "fund_pwd",
			BANK_PWD : "bank_pwd"
		},
		
		gender : {
			"UNKNOWN" : "2", // 未知
			"MAN" : "0", // 男
			"WOMAN" : "1" // 女
		},
		
		thr_pay : {
			"UPOP_PAY_URL" : "/servlet/upop/IndexAction?function=ajaxUpop" // 银联支付
		},
		
		encrypt_key : {
			"DES" : "thinkive_mall",
			"AES" : "thinkive_mall"
		},
		
		/** 首页产品推荐类型 */
		recommendType : {
			"RECOMMEND_TYPE_HOT" : "2", // 热销
			"RECOMMEND_TYPE_NOMAL" : "6", // 首页推荐
			"RECOMMEND_TYPE_SALEAGENT" : "8", // 代销推荐
			"RECOMMEND_TYPE_FINANINDEX" : "9", // 理财首页推荐
			"RECOMMEND_TYPE_BEST" : "10", // 最佳推荐
			"RECOMMEND_TYPE_BANK" : "3", // 银行推荐
			"RECOMMEND_TYPE_MONTHHOT" : "11", // 本月热销
			"RECOMMEND_TYPE_HOTTHEME" : "12", // 热门主题 
			"RECOMMEND_TYPE_INDEX_REC" : "1", // 首页推荐
			"RECOMMEND_TYPE_INDEX_JXCP" : "16", // 首页精选产品推荐
			"RECOMMEND_TYPE_INDEX_TZZT" : "17", // 首页投资主题推荐
		    "RECOMMEND_TYPE_FUND_FIRST" : "18" // 理财_基金页面_基金首发推荐
		},
		
		/** 首页展示广告组ID */
		advertGroupId : {
			"ADVERT_GROUP_ID_PRODUCT" : "1", // 产品广告组ID
			"ADVERT_GROUP_ID_POP" : "2", // 底部弹出层广告组ID
			"ADVERT_GROUP_ID_PRODUCT_DETAIL" : "3", // 产品详情广告
			"ADVERT_GROUP_ID_FINANMARKET" : "4", // 理财超市广告组
			"ADVERT_GROUP_ID_CASHBUTLER" : "5", // 现金管家广告组
			"ADVERT_GROUP_ID_ACTIVE" : "6", // 活动轮换广告组
			"ADVERT_GROUP_ID_PAGE" : "7", // 广告page页
			"ADVERT_GROUP_ID_COMINGSOON" : "9", // 广告page页
			"ADVERT_GROUP_ID_SPREAD_BANNER":"123",   //商城产品推广banner图组
			"ADVERT_GROUP_ID_SPREAD_BANNER_0":"124",   //商城产品推广banner图组_0
			"ADVERT_GROUP_ID_PA_product_0":"125",   //平安商城产品推广图组_0
			"ADVERT_GROUP_ID_PA_product_1":"126" ,  //平安商城产品推广图组_1
			"ADVERT_GROUP_ID_JJ_product_0":"164" ,  //H5金融商城基金产品推广页_banner
			"ADVERT_GROUP_ID_JJ_product_1":"165" ,  //H5金融商城基金产品推广页_图片1
			"ADVERT_GROUP_ID_JJ_producttwo_0":"184" ,  //H5金融商城基金产品推广页_banner
			"ADVERT_GROUP_ID_JJ_producttwo_1":"185" ,  //H5金融商城基金产品推广页_图片1
			"ADVERT_GROUP_ID_NEWCUSTOMER":"163" ,  //新客专享的活动广告组
			"ADVERT_GROUP_ID_TSLC":"166",           //商城首页特色理财栏目
		    "ADVERT_GROUP_ID_OTC":"167",          //商城理财otc页面banner图
		    "ADVERT_GROUP_ID_ZG":"168",          //商城理财资管页面banner图
		    "ADVERT_GROUP_ID_JJ_DTJX":"169",        //商城理财定投精选页面banner图
		    "ADVERT_GROUP_ID_LC_JPTJ":"172",         //商城首页精品推荐banner图
		    "ADVERT_GROUP_ID_RICE_RMHD":"174",         //商城米仓首页热门活动推广图
		    "ADVERT_GROUP_ID_RECOM_IMG":"183"     //商城首页底部推荐图片
		},
		
		/** 电子协议-合同类型 */
		contractType : {
			"ELECTRONIC_AGREEMENT" : "1", // 电子协议
			"CONTRACT" : "2", // 合同
			"RISK_BOOK" : "3", // 风险揭示书
			"PRODUCT_BOOK" : "4", // 产品说明书
			"PRODUCT_AGREEMENT" : "6", // 产品协议书
			"LEGAL_DOCUMENT" : "8", // 法律文件
			"PRODUCT_NOTICE" : "9", // 产品公告
			"NOTICE" : "10", // 公告
			"ACCOUNT_AGREEMENT" : "11", // 开户协议
			"TA_AGREEMENT" : "12", // TA协议
			"REGISTER_AGREEMENT" : "13", // 注册协议
			"FUND_DISTRIBUTION" : "14", // 基金代销权限
			"ARTICLEMORNING" : "15" // 东北证券晨会
		},
		/** 活动类型 */
		activeType : {
			"ACTIVE_TYPE_ONEMBER" : "1", // 一米疯抢
			"ACTIVE_TYPE_BUYLIMIT" : "2", // 限时抢购
			"ACTIVE_TYPE_OVERBALANCE" : "3" // 超值换购
		},
		
		/** 开户地址 */
		regFundAcctAddress : {
			"REG_ADDRESS_NORMAL" : "http://wx.nesc.cn/weixin-fund/pages/download-app.html", // 开户链接地址【正常】 
			"REG_ADDRESS_APP" : "http://action:10048" // 开户链接地址【APP】
		},
		
		/** 研究晨报*/
		docType : {
			"CB" : "508"
		},
		
		/** 投资者教育文章所属分类*/
		article_catalog : {
			"TZZJY" : "6"
		},
		
		/** 综合首页*/
		main_index : {
			"comprehensive" : "http://mobi.nesc.cn/m/index/index.html#!/index/index.html"
		},
		
		/** 光华营业部活动产品*/
		active_product : {
			"product_gh" : "6", // 活动产品
			"branch_no_gh" : "307", // 营业部
			"fundAccount_gh" : "10751950", // 资金帐号段（在此之后的资金账户）
			"time_gh" : "200" // 新用户定义（天）
		},
		
		/** 东方基金活动产品*/
		balance_product : {
			"branch_no" : "280" // 长沙芙蓉中路证券营业部
		},
		
		/** 新客专享的收益凭证类理财产品 */
		product_code : {
			"product_code_balance":"002243", // 余额宝产品代码
			"new_client_product" : "SYPZ01"
		},
		
		/** 基金产品类型 */
		"fundType" : {
			"GP" : "1", // 股票基金
			"HB" : "2", // 货币基金
			"ZQ" : "6", // 债券型基金
			"ZS" : "8", // 指数型基金
			"HH" : "b", //混合基金
		  "QDII" : "a"  //QDII
		},

		
		/** 需要展示的资讯类别ID*/
		docTypeId : [33,503,504,505,508,507,512] 

	};

	// 暴露对外的接口
	module.exports = serviceConstant;
});