/**
 * 手机前端service层调用接口
 **/
define(function(require,exports,module){
	var appUtils = require("appUtils");
	var gconfig = require("gconfig");
	var global = gconfig.global;
	var service = require("service");
	var validata = require("validatorUtil");
	var layerUtils = require("layerUtils");
	var serviceSingleton = new service.Service();
	
	/********************************公共代码部分********************************/
    function commonInvoke(paraMap, callback, ctrlParam, reqParamVo){
    	reqParamVo.setReqParam(paraMap);
    	ctrlParam = ctrlParam?ctrlParam:{};
    	reqParamVo.setIsLastReq(ctrlParam.isLastReq);
    	reqParamVo.setIsAsync(ctrlParam.isAsync);
    	reqParamVo.setIsShowWait(ctrlParam.isShowWait);
    	reqParamVo.setTimeOutFunc(ctrlParam.timeOutFunc);
    	reqParamVo.setErrorFunc(errorFunc);
    	reqParamVo.setIsShowOverLay(ctrlParam.isShowOverLay);
    	reqParamVo.setTipsWords(ctrlParam.tipsWords);
    	reqParamVo.setDataType(ctrlParam.dataType);
    	reqParamVo.setIsGlobal(ctrlParam.isGlobal);
    	reqParamVo.setProtocol(ctrlParam.protocol);
    	reqParamVo.setCacheTime(ctrlParam.cacheTime);
    	reqParamVo.setCacheType(ctrlParam.cacheType);
    	reqParamVo.setReqType(ctrlParam.reqType);
    	serviceSingleton.invoke(reqParamVo, callback);
    }
    
    /**
     * 请求错误处理
     */
    function errorFunc(){
    	console.log("服务器异常... enter errorFunc");
    }
    
	function destroy(){
		serviceSingleton.destroy();
	}
	var mobileService = {
		"getInstance": getInstance, //为了避免以前调用getInstance方法报错
		"destroy": destroy
	};
	function getInstance(){
		return mobileService;
	}
	module.exports = mobileService;
	
	/********************************应用接口开始********************************/
	/**
	 * @Author:黎志勇
	 * @Title 加密(1000000)
	 */
	mobileService.getRSAKey = function (param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000000";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	
	/**
	 * 资金账号登录 (1000007)
	 * @Author:黎志勇
	 * @param fund_account 资金账号
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 * @param login_type 登录渠道
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.fundLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000007";
		paraMap["fund_account"] = param.fund_account;
		paraMap["login_type"] = param.login_type;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["recom_code"] = param.recom_code;
		paraMap["ticket"] = param.code;
		paraMap["login_channel"] = param.login_channel;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 用户登录 (1000010)
	 * @Author:黎志勇
	 * @param login_value 登录值 
	 * @param login_type 登录类型 1账户名 2 手机 3 邮箱 7 身份证
	 * @param login_pwd 登录密码
	 * @param login_channel 登录渠道
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.userLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000010";
		paraMap["login_value"] = param.login_value;
		paraMap["login_type"] = param.login_type;
		paraMap["login_pwd"] = param.login_pwd;
		paraMap["recom_code"] = param.recom_code;
		paraMap["login_channel"] = param.login_channel;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 手机验证码验证编号获取接口(1000026)
	 * @Author:万亮
	 * @param mobile_phone 手机号
	 */
	mobileService.queryMsgCodeId = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000026";
		paraMap["mobile_phone"] = param.mobile_phone;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询推荐产品信息列表(1000065)
	 * @Author:黎志勇
	 * @param recommend_type 推荐类型
	 * @param product_type 产品类型
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.queryRecomProduct = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000065";
		paraMap["recommend_type"] = param.recommend_type;
		paraMap["product_type"] = param.product_type;
		paraMap["user_id"] = param.user_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 检查身份证号，手机号，银行卡号是否已被使用(1000192)
	 * @Author:万亮
	 * @param type //0  手机 1 身份证 2 银行卡
	 * @param id_kind 输入值
	 * @param mobile_phone 手机号码
	 * @param user_name 客户姓名
	 * @param bank_no 银行编号
	 * @param bank_account 银行编号
	 * @param capital_mode 资金方式
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.isBeUsed = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000192";
		paraMap["type"] = param.type;
		paraMap["mobile_phone"] = param.mobile;
		paraMap["user_name"] = param.user_name;
		paraMap["id_kind"] = param.id_kind;
		paraMap["id_no"] = param.id_no;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_account"] = param.bank_account;
		paraMap["capital_mode"] = param.capital_mode;
		
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 协议查询(1000156)
	 * @Author:黎志勇
	 * @param contract_type //协议类型
	 * @param product_id 产品id
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.queryContract = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000156";
		paraMap["contract_type"] = param.contract_type;
		paraMap["product_id"] = param.product_id;
		paraMap["agreement_id"] = param.agreement_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 调用券商接口发送验证码(1000500)
	 * @Author:黎志勇
	 * @param type //短信内容类型(0更换手机验证码，1委托成功，2注册手机验证码，3忘记手机验证码)
	 * @param mobile_phone 手机号码
	 * @param verify_id 验证码编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.sendMsg = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000500";
		paraMap["mobile_phone"] = param.mobile;
		paraMap["verify_id"] = param.verify_id;
		paraMap["type"] = param.type;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 验证手机验证码（本地）(1000012)
	 * @Author:黎志勇
	 * @param code 验证码
	 * @param mobile_phone 手机号码
	 * @param verify_id 验证ID
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.checkMsgCode = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000012";
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["code"] = param.code;
		paraMap["verify_id"] = param.verify_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 用户信息查询(1000002)
	 * @Author:黎志勇
	 * @param input_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * @param input_value 输入值
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.userInfo = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000002";
		paraMap["user_id"] = param.user_id;
		paraMap["client_id"] = param.client_id;
		
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 手机、邮箱、身份证等注册(1000011)
	 * @Author:黎志勇
	 * @param input_type //输入值类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * @param input_value 输入值
	 * @param login_pwd 密码
	 * @param channel_code 操作渠道(0 PC 2 IOS 1 ANDROID)
	 * @param user_type //用户类型 (0 个人 1  机构)
	 * @param verify_id // 验证码编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.register = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000011";
		paraMap["input_type"] = param.input_type;
		paraMap["input_value"] = param.input_value;
		paraMap["login_pwd"] = param.login_pwd;
		paraMap["channel_code"] = param.channel_code;
		paraMap["user_type"] = param.user_type;
		paraMap["verify_id"] = param.verify_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 手机、邮箱、身份证等登录(1000010)
	 * @Author:黎志勇
	 * @param login_type //登录类型(1账户名 2 手机 3 邮箱 7 身份证 )
	 * @param login_value 输入值
	 * @param login_pwd 密码
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 * @param is_check 是否校验验证码
	 */
	mobileService.accoLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000010";
		paraMap["login_type"] = param.login_type;
		paraMap["login_value"] = param.login_value;
		paraMap["login_pwd"] = param.login_pwd;
		paraMap["recom_code"] = param.recom_code;
		paraMap["ticket"] = param.code;
		paraMap["login_channel"] = param.login_channel;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询所支持的银行(1000188)
	 * @Author:黎志勇
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.supportBank = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000188";
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 签名发送(短信：短信验证码、PC：网银地址、移动端页面：银联签名)(1000501)
	 * @Author:黎志勇
	 * @param type 身份认证类别
	 * @param user_id 用户编号
	 * @param mobile_phone 手机号码
	 * @param bank_no 银行编号
	 * @param bank_account 银行卡号
	 * @param return_url 回调地址
	 * @param capital_mode 资金方式
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.signSend = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000501";
		paraMap["type"] = param.type;
		paraMap["user_id"] = param.user_id;
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_account"] = param.bank_account;
		paraMap["return_url"] = param.return_url;
		paraMap["capital_mode"] = param.capital_mode;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 签名验证(1000502)
	 * @Author:黎志勇
	 * @param type 身份认证类别
	 * @param user_id 用户编号
	 * @param mobile_phone 手机号码
	 * @param bank_no 银行编号
	 * @param bank_account 银行卡号
	 * @param req_rerial 银行返回序列
	 * @param req_params 银行返回数据
	 * @param verify_code 验证码
	 * @param capital_mode 资金方式
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.signValidate  = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000502";
		paraMap["type"] = param.type;
		paraMap["user_id"] = param.user_id;
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_account"] = param.bank_account;
		paraMap["req_rerial"] = param.req_rerial;
		paraMap["req_params"] = param.req_params;
		paraMap["capital_mode"] = param.capital_mode;
		paraMap["verify_code"] = param.verify_code;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 开户(1000503)
	 * @Author:万亮
	 * @param user_id 用户编号
	 * @param trade_pwd 交易密码
	 * @param trade_pwd_twice 确认密码
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.openAccount = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000503";
		paraMap["user_id"] = param.user_id;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["trade_pwd_twice"] = param.trade_pwd_twice;
		paraMap["capital_mode"] = param.capital_mode;
		paraMap["yinlian_cd_card"] = param.yinlian_cd_card;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 增绑银行卡(1000504)
	 * @Author:万亮
	 * @param user_id 用户编号
	 * @param trade_pwd 交易密码
	 * @param bank_no 银行编号
	 * @param bank_account 银行卡号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.addBankCard = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000504";
		paraMap["user_id"] = param.user_id;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_account"] = param.bank_account;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 保存用户信息(1000195)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param id_kind 证件类型
	 * @param bank_no 银行编号
	 * @param bank_account 银行卡号
	 * @param id_no 身份证号
	 * @param user_name 用户名
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.saveInfo = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000195";
		paraMap["user_id"] = param.user_id;
		paraMap["id_kind"] = param.id_kind;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_account"] = param.bank_account;
		paraMap["id_no"] = param.id_no;
		paraMap["user_name"] = param.user_name;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询风险评测题目(1000150)
	 * @Author:黎志勇
	 * @param risk_type_id 试题类号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.queryEval = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000150";
		paraMap["risk_type_id"] = param.risk_type_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	 /**
	 * 提交风险测评(1000151)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param risk_type_id 试题类号
	 * @param content 提交数据
	 * @param callback 回调函数
	 */
    mobileService.submitTestAnswer = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000151";
		paraMap["user_id"] = param.user_id;
		paraMap["risk_type_id"] = param.risk_type_id;
		paraMap["prodta_no"] = param.item_name_en;
		paraMap["content"] = param.content;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
	 /**
	 * 查询数据字典(1000160)
	 * @Author:万亮
	 * @param enumTypeId 数据字典编号
	 * @param enum_name 数据字典名称
	 */
    mobileService.queryEnum = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000160";
		paraMap["enumTypeId"] = param.enumTypeId;
		paraMap["enum_name"] = param.enum_name;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 资产查询(1000181)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
    mobileService.queryAsset = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000181";
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 基金份额查询(1000182)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
    mobileService.fundShare = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000182";
		paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 理财份额查询(1000183)
	 * @Author:万亮
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
    mobileService.finanShare = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000183";
		paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 银证转账(1001850)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param fund_account   资金账号
	 * @param trans_type 转账类别
	 * @param bank_no   银行编号
	 * @param bank_card_no 银行卡号
	 * @param fund_amount 转账金额
	 * @param fund_pwd 资金密码
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.bankTrans = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001850";
	    paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trans_type"] = param.trans_type;
		paraMap["bank_no"] = param.bank_no;
		paraMap["bank_card_no"] = param.bank_card_no;
		paraMap["fund_amount"] = param.fund_amount;
		paraMap["fund_pwd"] = param.fund_pwd;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["bank_pwd"] = param.bank_pwd;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 查询银证转账流水(1001851)
	 * @Author:黎志勇
	 * @param user_id 用户编号
	 * @param fund_account   资金账号
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param trans_type 转账类别
	 * @param bank_no   银行编号
	 * @param money_type 币种
	 * @param start_date 开始日期
	 * @param end_date 结束日期
	 * @param min_money 最小金额
	 * @param max_money 最大金额
	 * @param callback 回调函数
	 */
    mobileService.changeQuery = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001851";
	    paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["curPage"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["trans_type"] = param.trans_type;
		paraMap["bank_no"] = param.bank_no;
		paraMap["money_type"] = param.money_type;
		paraMap["start_date"] = param.start_date;
		paraMap["end_date"] = param.end_date;
		paraMap["min_money"] = param.min_money;
		paraMap["max_money"] = param.max_money;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * 转账银行参数 1001852
	 * @Author:黎志勇
	 * @param :user_id 用户编号
	 * @param :product_id 产品编号
	 * @Title 获取是否需要密码
	 * @param callback 回调函数
	 */
    mobileService.queryPwd = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001852";
		paraMap["bank_no"] = param.bank_no;
		paraMap["trans_type"] = param.trans_type;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 用户存管银行查询(1000186)
	 * @Author:万亮
	 * @param user_id  用户编号
	 * @param fund_account   资金账号
	 * @param callback 回调函数
	 */
	mobileService.accountBank = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000186";
		paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 查询理财产品信息(分页列表)(1000050)
	 * @Author:黎志勇
	 * @param product_shelf :上架状态
	 * @param page：当前页数
	 * @param numPerPage ：单页显示记录数
	 * @param recommend_type :推荐属性   1首页推荐 2购买推荐
	 * @param fina_type：理财分类  0低风险  1高风险  2理财类  3混合型  4现金类
	 * @param is_hot_sale 是否按照热销排序  1排序 0或其他不排
	 * @param callback 回调函数
	 */
    mobileService.findFinan = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000050";
		paraMap["product_shelf"]=param.product_shelf;
		paraMap["page"]=param.page;
		paraMap["numPerPage"]=param.numPerPage;
		paraMap["recommend_type"]=param.recommend_type;
		paraMap["fina_type"]=param.fina_type;
		paraMap["is_hot_sale"]=param.is_hot_sale;
		paraMap["is_income"]=param.is_income;
		paraMap["user_id"] = param.user_id;
		paraMap["fina_belongs"] = param.fina_belongs;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 查询基金产品信息(分页列表)(1000051)
	 * @Author:黎志勇
	 * @param product_shelf :上架状态
	 * @param comp_ecommend_type:组合产品推荐  1 进取型组合推荐 2 保守型组合推荐 3 稳定型组合推荐
	 * @param recommend_type :推荐属性   1首页推荐 2购买推荐
	 * @param fund_type：基金类型
	 * @param register_corp_code :基金公司
	 * @param risk_level: 风险等级
	 * @param amount : 基金规模
	 * @param create_time : 成立时间  时间格式yyyy-MM-dd
	 * @param page：当前页数
	 * @param numPerPage ：单页显示记录数
	 * @param is_hot_sale 是否按照热销排序  1排序 0或其他不排
	 * @param callback 回调函数
	 */
    mobileService.findFund = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000051";
		paraMap["comp_ecommend_type"]=param.comp_ecommend_type;
		paraMap["recommend_type"]=param.recommend_type;
		paraMap["fund_type"]=param.fund_type;
		paraMap["register_corp_code"]=param.register_corp_code;
		paraMap["risk_level"]=param.risk_level;
		paraMap["amount"]=param.amount;
		paraMap["create_time"]=param.create_time;
	/*	paraMap["is_nav"]=param.is_nav;
		paraMap["performance_sort"]=param.performance_sort;
		paraMap["product_performance"]=param.product_performance;*/
		paraMap["page"]=param.page;
		paraMap["numPerPage"]=param.numPerPage;
		paraMap["is_hot_sale"]=param.is_hot_sale;
		paraMap["product_shelf"]=param.product_shelf;
		paraMap["min_mouth_rate"]=param.min_mouth_rate;
		paraMap["max_mouth_rate"]=param.max_mouth_rate;
		paraMap["min_season_rate"]=param.min_season_rate;
		paraMap["max_season_rate"]=param.max_season_rate;
		paraMap["min_half_year_rate"]=param.min_half_year_rate;
		paraMap["max_half_year_rate"]=param.max_half_year_rate;
		paraMap["min_year_rate"]=param.min_year_rate;
		paraMap["max_year_rate"]=param.max_year_rate;
		/*新加*/
		paraMap["min_buy_limit"] = param.min_buy_limit; //最小起购金额
		paraMap["max_buy_limit"] = param.max_buy_limit; //最大起购金额
		paraMap["is_date_rate"]=param.is_date_rate;  //日收益
		paraMap["is_week_rate"]=param.is_week_rate;  //周收益
		paraMap["is_mouth_rate"]=param.is_mouth_rate;  //月收益
		paraMap["is_season_rate"]=param.is_season_rate;  //3个月收益
		paraMap["is_half_year_rate"]=param.is_half_year_rate;  //半年收益
		paraMap["is_year_rate"]=param.is_year_rate;  //一年收益
		paraMap["user_id"] = param.user_id;
	   //新入参20161108
        paraMap["min_current_price"] = param.min_current_price;//最小净值
		paraMap["max_current_price"] = param.max_current_price;//最大净值
		paraMap["fund_investment"] = param.fund_investment;  //定投基金的标志
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 产品模糊查询(1000052)
	 * @Author:黎志勇
	 * @param search_value 搜索值
	 * @param product_type 产品类型
	 */
    mobileService.productSearch = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000052";
		paraMap["search_value"] = param.search_value;
		paraMap["product_type"] = param.product_type;
		paraMap["user_id"] = param.user_id;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
     /**
	 * @Title 查询理财产品信息(单个)(1000053)
	 * @Author:黎志勇
	 * @param product_id 产品编号
	 */
    mobileService.finanInfo = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000053";
		paraMap["product_id"]=param.product_id;
		paraMap["product_code"]=param.product_code;
		paraMap["user_id"]=param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
     /**
	 * @Title 查询基金产品信息(单个)(1000054)
	 * @Author:黎志勇
	 * @param product_id 产品编号
	 */
    mobileService.fundInfo = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000054";
		paraMap["product_id"] = param.product_id;
		paraMap["product_code"] = param.product_code;
		paraMap["user_id"]=param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 查询产品净值流水(1000055)
	 * @Author:汪卫中
	 * @param product_id 产品编号
	 */
    mobileService.productPrice = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000055";
		paraMap["product_id"] = param.product_id;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 金融产品是否已购买过(1000100)
	 * @Author:黎志勇
	 * @param user_id  用户编号
	 * @param product_id 产品id
	 * @param product_code 产品代码
	 */
    mobileService.isBuy = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000100";
		paraMap["user_id"]=param.user_id;
		paraMap["product_id"]=param.product_id;
		paraMap["product_code"]=param.product_code;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 基金产品订单生成(1000101)
	 * @Author:黎志勇
	 * @param user_id  用户编号
	 * @param product_id 产品id
	 * @param product_code 产品代码
	 * @param business_type 业务类型 0认购1申购 2赎回
	 * @param order_channel 订单渠道 0PC 1IOS 2Android
	 * @param money_type 币种
	 * @param is_order 是否检测
	 * @param recommend_person_id 推荐人用户编号
	 */
    mobileService.fundBuy = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000101";
		paraMap["product_id"] = param.product_id;
		paraMap["user_id"] = param.user_id;
		paraMap["tot_price"] = param.tot_price;
		paraMap["business_type"] = param.business_type;
		paraMap["order_channel"] = param.order_channel;
		paraMap["money_type"] = param.money_type;
		paraMap["is_order"] = param.is_order;
		paraMap["recommend_person_id"] = param.recommend_person_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title 理财产品订单生成(1000102)
	 * @Author:黎志勇
	 * @param user_id  用户编号
	 * @param product_id 产品id
	 * @param product_code 产品代码
	 * @param business_type 业务类型 0认购1申购 2赎回
	 * @param order_channel 订单渠道 0PC 1IOS 2Android
	 * @param money_type 币种
	 * @param is_order 是否检测
	 * @param recommend_person_id 推荐人用户编号
	 */
    mobileService.finanBuy = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000102";
		paraMap["product_id"] = param.product_id;
		paraMap["user_id"] = param.user_id;
		paraMap["tot_price"] = param.tot_price;
		paraMap["business_type"] = param.business_type;
		paraMap["order_channel"] = param.order_channel;
		paraMap["money_type"] = param.money_type;
		paraMap["is_order"] = param.is_order;
		paraMap["recommend_person_id"] = param.recommend_person_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Title otc产品订单生成(1000103)
	 * @Author:黎志勇
	 * @param user_id  用户编号
	 * @param product_id 产品id
	 * @param product_code 产品代码
	 * @param business_type 业务类型 0认购1申购 2赎回
	 * @param order_channel 订单渠道 0PC 2IOS 1Android
	 * @param money_type 币种
	 * @param is_order 是否检测
	 * @param recommend_person_id 推荐人用户编号
	 */
    mobileService.otcBuy = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"]="1000103";
		paraMap["product_id"] = param.product_id;
		paraMap["user_id"] = param.user_id;
		paraMap["tot_price"] = param.tot_price;
		paraMap["business_type"] = param.business_type;
		paraMap["order_channel"] = param.order_channel;
		paraMap["money_type"] = param.money_type;
		paraMap["is_order"] = param.is_order;
		paraMap["recommend_person_id"] = param.recommend_person_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
     /**
	 * @Author:黎志勇
	 * 取消订单(1000108)
	 * @param user_id  用户编号
	 * @param order_id 原订单编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.cancelOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000108";
		paraMap["order_id"] = param.order_id;
		paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 确认订单有效(银行卡购买)(1000110)
	 * @param user_id  用户编号
	 * @param order_id 原订单编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.confrimOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000110";
		paraMap["order_id"] = param.order_id;
		paraMap["user_id"] = param.user_id;
		paraMap["bank_id"] = param.bank_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 现金理财取现(1000128)
	 * @param fund_account 资金账户
	 * @param product_code 产品代码
	 * @param product_id 产品编号
	 * @param tot_price 取现金额
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.cashTaking = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000128";
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
		paraMap["type"] = param.type;
		paraMap["product_id"] = param.product_id;
		paraMap["tot_price"] = param.tot_price;
		paraMap["trade_pwd"] = param.trade_pwd;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 理财产品取现开通(1000129)
	 * @param type 操作类型 0查询 1开通
	 * @param fund_account 资金帐号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.queryCashTaking = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000129";
		paraMap["type"] = param.type;
		paraMap["fund_account"] = param.fund_account;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 查询用户绑定的银行卡(1000197)
	 * @param user_id  用户编号
	 * @param bank_flag 银行卡状态 0正常 1冻结 2注销
	 * @param fund_account 资金帐号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.userBank = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000197";
		paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 解绑银行卡(1000198)
	 * @param bank_account 银行卡号
	 * @param user_id 用户编号
	 * @param bank_no 银行编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.unbind = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000198";
		paraMap["bank_account"] = param.bank_account;
		paraMap["user_id"] = param.user_id;
		paraMap["bank_no"] = param.bank_no;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 开通理财账户功能(1000190)
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
    mobileService.openClient = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000190";
		paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 基金产品订单支付(1000114)
	 * @Author:黎志勇
	 * @param order_id 订单编号
	 * @param cash_account  交易账号
	 * @param bank_no 银行编号
	 * @param external_account 银行卡号
	 * @param trade_pwd   交易密码
	 */
    mobileService.fundOrderPayment = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000114";
		paraMap["order_id"] = param.order_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["user_id"] = param.user_id;
		paraMap["pay_type"] = param.pay_type;
		paraMap["bank_no"] = param.bank_no;
		paraMap["external_account"] = param.bank_card;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * otc产品订单支付(1000115)
	 * @Author:黎志勇
	 * @param order_id 订单编号
	 * @param fund_account  资金账号
	 * @param bank_no 银行编号
	 * @param external_account 银行卡号
	 * @param trade_pwd   交易密码
	 */
    mobileService.otcOrderPayment = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000115";
		paraMap["order_id"] = param.order_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["user_id"] = param.user_id;
		paraMap["pay_type"] = param.pay_type;
		paraMap["bank_no"] = param.bank_no;
		paraMap["external_account"] = param.bank_card;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * 理财产品订单支付(1000116)
	 * @Author:黎志勇
	 * @param order_id 订单编号
	 * @param fund_account  资金账号
	 * @param bank_no 银行编号
	 * @param external_account 银行卡号
	 * @param trade_pwd   交易密码
	 */
    mobileService.finanOrderPayment = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000116";
		paraMap["order_id"] = param.order_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["user_id"] = param.user_id;
		paraMap["pay_type"] = param.pay_type;
		paraMap["bank_no"] = param.bank_no;
		paraMap["external_account"] = param.bank_card;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 订单撤销(1000119)
	 * @param order_id 订单编号
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.undoOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000119";
		paraMap["order_id"] = param.order_id;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 赎回(1000120)
	 * @param product_id 产品编号
	 * @param user_id 用户编号
	 * @param order_quantity 赎回份额
	 * @param order_channel 订单渠道
	 * @param money_type 币种
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 */
    mobileService.redemption = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000120";
	    paraMap["product_id"] = param.product_id;
		paraMap["user_id"] = param.user_id;
		paraMap["order_quantity"] = param.order_quantity;
		paraMap["apply_no"] = param.apply_no;
		paraMap["order_channel"] = param.order_channel;
		paraMap["money_type"] = param.money_type;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["product_sub_type"] = param.product_sub_type;
		
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 金融产品订单查询（分页）(1000122)
	 * @param user_id 用户编号
	 * @param product_sub_type 产品类别
	 * @param order_state 订单状态
	 * @param start_time 开始时间
	 * @param end_time 结束时间
	 * @param business_type 业务类型
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.queryFinancialOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000122";
		paraMap["user_id"] = param.user_id;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["order_state"] = param.order_state;
		paraMap["start_time"] = param.start_time;
		paraMap["end_time"] = param.end_time;
		paraMap["business_type"] = param.business_type;
		paraMap["curPage"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 金融产品订单详情查询(1000123)
	 * @param user_id 用户编号
	 * @param order_id 订单ID
	 * @param callback 回调函数
	 */
	mobileService.queryFinancialOrderDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000123";
		paraMap["user_id"] = param.user_id;
		paraMap["order_id"] = param.order_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 非金融产品订单查询（分页）(1000124)
	 * @param user_id 用户编号
	 * @param product_sub_type 产品类别
	 * @param order_state 订单状态
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.queryOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000124";
		paraMap["user_id"] = param.user_id;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["order_state"] = param.order_state;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 非金融产品订单详情查询(1000125)
	 * @param user_id 用户编号
	 * @param order_id 订单ID
	 * @param callback 回调函数
	 */
	mobileService.queryOrderDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000125";
		paraMap["user_id"] = param.user_id;
		paraMap["order_id"] = param.order_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 所有金融产品查询(1000070)
	 * @param product_type 产品类型 0 基金 1理财
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.queryAllProduct = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000070";
		paraMap["product_type"] = param.product_type;//产品类型
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["order_per_buy_limit"] = param.order_per_buy_limit;//根据起购金额排序
		paraMap["is_follow"] = param.is_follow; //根据关注排序
		paraMap["user_id"] = param.user_id; //用户编号
		paraMap["min_buy_limit"] = param.min_buy_limit; //最小起购金额
		paraMap["max_buy_limit"] = param.max_buy_limit; //最大起购金额
		paraMap["risk_level"] = param.risk_level; //产品风险等级
		paraMap["min_rate"] = param.min_rate; //最小收益率
		paraMap["max_rate"] = param.max_rate; //最大收益率
		paraMap["is_rate"] = param.is_rate; //是否按照收益率排序 0 升序 1降序
		paraMap["fund_type"] = param.fund_type; //产品类型
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 查询产品收益明细 (1000506)
	 * @param product_type 产品类型 0 基金 1理财
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.earningDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000506";
		paraMap["user_id"] = param.user_id;
		paraMap["product_code"] = param.product_code;
		paraMap["fund_account"] = param.fund_account;
		paraMap["start_time"] = param.start_time;
		paraMap["end_time"] = param.end_time;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:黎志勇
	 * 手机号变更(1000014)
	 * @param type 类型 0 短信 1非短信
	 * @param user_id 用户id
	 * @param mobile_phone_old 旧手机号码
	 * @param mobile_phone_new 新手机号码
	 * @param bank_account 银行卡号
	 * @param cash_account 交易账号
	 * @param trade_pwd 交易密码
	 * @param code 验证码
	 * @param callback 回调函数
	 */
	mobileService.changePhone = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000014";
		paraMap["type"] = param.type;
		paraMap["user_id"] = param.user_id;
		paraMap["mobile_phone_old"] = param.mobile_phone_old;
		paraMap["mobile_phone_new"] = param.mobile_phone_new;
		paraMap["bank_account"] = param.bank_account;
		paraMap["cash_account"] = param.cash_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["code"] = param.code;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 交易时间校准接口(1000161)（原功能号为1000301）
	 * @param callback 回调函数
	 */
	mobileService.getServerTime = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000161";
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询广告(1000162)
	 * @param group_id 广告组ID
	 * @param ad_id 广告ID
	 * @param callback 回调函数
	 */
	mobileService.queryAd = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000162";
		paraMap["group_id"] = param.group_id;
		paraMap["ad_id"] = param.ad_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询电子协议（公告）(1000163)
	 * @param group_id 广告组ID
	 * @param ad_id 广告ID
	 * @param callback 回调函数
	 */
	mobileService.queryAgreement = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000163";
		paraMap["agreement_type"] = param.agreement_type; //协议类型
		paraMap["contract_type"] = param.contract_type;//合同类型
		paraMap["is_every_time"] = param.is_every_time;//是否每次要签署
		paraMap["is_online_sign"] = param.is_online_sign;//是否支持线上签署
		paraMap["page"] = param.page;//当前页数
		paraMap["numPerPage"] = param.numPerPage;//单页显示记录数
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询电子协议详情（公告）(1000163)
	 * @param group_id 广告组ID
	 * @param ad_id 广告ID
	 * @param callback 回调函数
	 */
	mobileService.queryAgreementDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000164";
		paraMap["agreement_id"] = param.agreement_id; //协议编号
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 关注(1000017)
	 * @param user_id 用户编号
	 * @param product_id 产品编号
	 * @param product_sub_type 产品子类型: 0 基金 1理财 2服务 3资讯
	 * @param callback 回调函数
	 */
	mobileService.attention = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000017";
		paraMap["user_id"] = param.user_id;
		paraMap["product_id"] = param.product_id;
		paraMap["product_sub_type"] = param.product_sub_type;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 取消关注(1000018)
	 * @param user_id 用户编号
	 * @param product_id 产品编号
	 * @param callback 回调函数
	 */
	mobileService.cancelAttention = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000018";
		paraMap["user_id"] = param.user_id;
		paraMap["product_id"] = param.product_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询用户关注(1000019)
	 * @param user_id 用户编号
	 * @param product_id 产品编号
	 * @param product_sub_type 产品子类型: 0 基金 1理财 2服务 3资讯
	 * @param callback 回调函数
	 */
	mobileService.userAttention = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000019";
		paraMap["user_id"] = param.user_id;
		paraMap["product_id"] = param.product_id;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["page"] = param.page;
		paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 绑定资金账号(1000006)
	 * @param user_id 用户编号
	 * @param fund_account 资金账号
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 */
	mobileService.bindAccount = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000006";
		paraMap["user_id"] = param.user_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["ticket"] = param.ticket;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 修改商城登录密码(1000004)
	 * @param user_id 用户编号
	 * @param pwd_src 旧密码
	 * @param pwd_new 新密码
	 * @param pwd_twice 确认密码
	 * @param callback 回调函数
	 */
	mobileService.updateLoginPwd = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000004";
		paraMap["user_id"] = param.user_id;
		paraMap["pwd_src"] = param.pwd_src;
		paraMap["pwd_new"] = param.pwd_new;
		paraMap["pwd_twice"] = param.pwd_twice;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 忘记登录密码(1000008)
	 * @param user_id 用户编号
	 * @param pwd_new 新密码
	 * @param pwd_twice 确认密码
	 * @param callback 回调函数
	 */
	mobileService.forgetLoginPwd = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000008";
		paraMap["user_id"] = param.user_id;
		paraMap["pwd_new"] = param.pwd_new;
		paraMap["pwd_twice"] = param.pwd_twice;
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["verify_id"] = param.verify_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 产品登记(1000127)
	 * @param type 操作类型 0登记 1取消 2修改 3查询
	 * @param fund_account 资金账号
	 * @param product_code 产品代码
	 * @param product_id 产品编号
	 * @param tot_price 登记金额
	 * @param money_type 币种
	 * @param order_channel 订单渠道
	 * @param risk_type_id 风险测评类型编号
	 * @param status 触发状态(0-正常，1-停止)，默认为0
	 * @param isRegister 是否进行产品登记 0 不进行 1进行 默认进行
	 * @param callback 回调函数
	 */
	mobileService.productRegister = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000127";
		paraMap["type"] = param.type;
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
		paraMap["product_id"] = param.product_id;
		paraMap["tot_price"] = param.tot_price;
		paraMap["money_type"] = param.money_type;
		paraMap["order_channel"] = param.order_channel;
		paraMap["risk_type_id"] = param.risk_type_id;
		paraMap["status"] = param.status;
		paraMap["isRegister"] = param.isRegister;
		paraMap["recom_code"] = param.recom_code;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 基金户查询与开通(1000509)
	 * @param type 操作类型 0查询 1开通
	 * @param fund_account 资金账号
	 * @param product_code 产品代码
	 * @param product_id 产品编号
	 * @param trade_pwd 交易密码
	 * @param fina_belongs 理财归属
	 * @param product_sub_type 产品子类别
	 * @param callback 回调函数
	 */
	mobileService.openCashButler = function(param, callback, ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000509";
		paraMap["type"] = param.type;
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
		paraMap["product_id"] = param.product_id;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["fina_belongs"] = param.fina_belongs;
		paraMap["trade_pwd"] = param.trade_pwd;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 产品登记(1000187)
	 * @param type 操作类型 0 修改交易密码，1重置交易密码
	 * @param trade_pwd_old 旧密码
	 * @param trade_pwd_new 新密码
	 * @param trade_pwd_twice 确认密码
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
	mobileService.updateTradePwd = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000187";
		paraMap["type"] = param.type;
		paraMap["trade_pwd_old"] = param.trade_pwd_old;
		paraMap["trade_pwd_new"] = param.trade_pwd_new;
		paraMap["trade_pwd_twice"] = param.trade_pwd_twice;
		paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 功能开通(1000023)
	 * @param user_id 用户编号
	 * @param mobile_phone 手机号
	 * @param verify_id 验证编号
	 * @param e_mail 邮箱
	 * @param callback 回调函数
	 */
	mobileService.bindMobilePhone = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000023";
		paraMap["user_id"] = param.user_id;
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["verify_id"] = param.verify_id;
		paraMap["e_mail"] = param.e_mail;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:万亮
	 * 短信登录(1000024)
	 * @param mobile_phone 手机号
	 * @param verify_id 验证编号
	 * @param login_type 验证编号
	 * @param login_channel 登录方式
	 * @param code 验证码
	 * @param callback 回调函数
	 */
	mobileService.codeLogin = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000024";
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["login_type"] = param.login_type;
		paraMap["verify_id"] = param.verify_id;
		paraMap["login_channel"] = param.login_channel;
		paraMap["code"] = param.code;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 退出登录【1000001】
	 * @param mobile_phone 手机号
	 * @param verify_id 验证编号
	 * @param code 验证码
	 * @param callback 回调函数
	 */
	mobileService.loginOut = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000001";
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 生成二维码图片【1001950】
	 * @param qr_code_url url地址
	 * @param size 大小
	 * @param logo logo图片地址
	 * @param uk 用户编号
	 * @param callback 回调函数
	 */
	mobileService.twoDimensionCode = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001950";
	    paraMap["qr_code_url"] = param.qr_code_url;
	    paraMap["size"] = param.size;
	    paraMap["logo"] = param.logo;
	    paraMap["uk"] = param.uk;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 得到用户风险等级【1000152】
	 * @param user_id: 用户编号
	 * @param callback 回调函数
	 */
	mobileService.queryRiskLevel = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000152";
	    paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询活动产品信息【1000650】
	 * @param activity_type: 活动类型
	 * @param callback 回调函数
	 */
	mobileService.activeProduct = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000650";
	    paraMap["activity_type"] = param.activity_type;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询活动产品详情【1000651】
	 * @param activity_type: 活动类型
	 * @param callback 回调函数
	 */
	mobileService.activePdtDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000651";
	    paraMap["product_id"] = param.product_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 积分订单提交【1000652】
	 * @param user_id: 用户编号
	 * @param product_id: 产品编号
	 * @param product_type_id: 产品类型编号
	 * @param product_code: 产品代码
	 * @param order_phone: 订单号码
	 * @param exprs_id: 收件地址编号
	 * @param tot_num: 购买数量
	 * @param callback 回调函数
	 */
	mobileService.submitActOrder = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000652";
	    paraMap["user_id"] = param.user_id;
	    paraMap["product_id"] = param.product_id;
	    paraMap["product_code"] = param.product_code;
	    paraMap["product_type_id"] = param.product_type_id;
	    paraMap["order_phone"] = param.order_phone;
	    paraMap["exprs_id"] = param.exprs_id;
	    paraMap["tot_num"] = param.tot_num;
	    
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询订单流水【1000653】
	 * @param user_id: 用户编号
	 * @param product_id: 产品编号
	 * @param order_id: 订单编号
	 * @param order_status: 订单状态
	 * @param start_time: 开始时间
	 * @param end_time: 结束时间
	 * @param page: 当前页
	 * @param numPerPage: 每页记录数
	 * @param callback 回调函数
	 */
	mobileService.queryOrderList = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000653";
	    paraMap["user_id"] = param.user_id;
	    paraMap["product_id"] = param.product_id;
	    paraMap["order_id"] = param.order_id;
	    paraMap["order_status"] = param.order_status;
	    paraMap["start_time"] = param.start_time;
	    paraMap["end_time"] = param.end_time;
	    paraMap["page"] = param.page;
	    paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 签到【1000654】
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
	mobileService.signIn = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000654";
	    paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 签到查询【1000655】
	 * @param user_id 用户编号
	 * @param callback 回调函数
	 */
	mobileService.querySign = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000655";
	    paraMap["user_id"] = param.user_id;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查询积分流水【1000656】
	 * @param user_id:用户编号
	 * @param page: 当前页
	 * @param numPerPage: 每页记录数
	 * @param callback 回调函数
	 */
	mobileService.queryIntergralList = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000656";
	    paraMap["user_id"] = param.user_id;
	    paraMap["page"] = param.page;
	    paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 查用户积分【1000657】
	 * @param callback 回调函数
	 */
	mobileService.queryUserIntergral = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000657";
	    paraMap["user_id"] = param.user_id;
		paraMap["mobile_phone"] = param.mobile_phone;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 收货地址管理【1000660】
	 * @param user_id 用户编号
	 * @param mobile_phone 手机号码
	 * @param address 地址
	 * @param user_name 收件人
	 * @param exprs_id 地址编号
	 * @param type 1 查询 2 删除 3 增加、
	 * @param is_default 1 默认地址 0 非默认地址
	 * @param callback 回调函数
	 */
	mobileService.addressManage = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000660";
	    paraMap["user_id"] = param.user_id;
	    paraMap["mobile_phone"] = param.mobile_phone;
	    paraMap["address"] = param.address;
	    paraMap["user_name"] = param.user_name;
	    paraMap["exprs_id"] = param.exprs_id;
	    paraMap["type"] = param.type;
	    paraMap["is_default"] = param.is_default;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 用户订单产品购买个人限额【1000660】
	 * @param user_id 用户编号
	 * @param product_id 地址编号
	 * @param callback 回调函数
	 */
	mobileService.userBuyLimit = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1000658";
	    paraMap["user_id"] = param.user_id;
	    paraMap["product_id"] = param.product_id;
	    paraMap["type"] = param.type;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:石爱芳
	 * 左边资讯列表【1001953】
	 * @param callback 回调函数
	 */
	mobileService.getConsultCategory = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001953";		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    /**
	 * @Author:石爱芳
	 * 右边边资讯列表【1001951】
	 * @param doc_type 报告类型
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.getConsultList = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001951";
	    paraMap["doc_type"] = param.doc_type;
	    paraMap["stock_code"] = param.stock_code;
	    paraMap["page"] = param.page;
	    paraMap["numPerPage"] = param.numPerPage;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    /**
	 * @Author:石爱芳
	 * 下一页资讯详情【1001952】
	 * @param doc_id  报告编号
	 * @param callback 回调函数
	 */
	mobileService.getConsultDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001952";
	    paraMap["doc_id"] = param.doc_id;		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:汪卫中
	 * 产品模糊查询【1001954】
	 * @param search_value  关键字
	 * @param product_type 产品类型
	 * @param callback 回调函数
	 */
	mobileService.queryProduct = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001954";
	    paraMap["search_value"] = param.search_value;	
	    paraMap["product_type"] = param.product_type;		
	    
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:石爱芳
	 * 投资者教育文章列表【1001955】
	 * @param article_catalog 文章所属类别
	 * @param product_id 文章所属产品id
	 * @param article_state 文章状态
	 * @param page 当前页数
	 * @param numPerPage 单页显示记录数
	 * @param callback 回调函数
	 */
	mobileService.getEducationList = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001955";
	    paraMap["article_catalog"] = param.article_catalog;
	    paraMap["product_id"] = param.product_id;
	    paraMap["article_state"] = param.article_state;
	    paraMap["page"] = param.page;
	    paraMap["numPerPage"] = param.numPerPage;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    };
    /**
	 * @Author:石爱芳
	 * 下一页教育详情页【1001956】
	 * @param article_id 文章编号
	 * @param callback 回调函数
	 */
	mobileService.getEducationDetail = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001956";
	    paraMap["article_id"] = param.article_id;		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
	 * @Author:万亮
	 * APP唯一码及客户参与活动校验接口【1001958】
	 * @param article_id 文章编号
	 * @param callback 回调函数
	 */
	mobileService.getUniqueId = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["funcNo"] = "1001958";
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 商城查询实时货币基金（单个）【1001961】
	 *       type： 0查询 1购买 2赎回
	 *       product_id：产品id
	 *       fund_account：资金账户
	 *       tot_price：购买金额
	 *       product_code
     * @param callback 回调函数
     */
    mobileService.getRealFinaById = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
		paraMap["funcNo"] = "1001961";
		paraMap["type"] = param.type;
		paraMap["product_id"] = param.product_id;
		paraMap["fund_account"] = param.fund_account;
		paraMap["tot_price"] = param.tot_price;
		paraMap["product_code"] = param.product_code;
		
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * ETF委托撤单【1001962】
     * @param order_id 订单编号
     * @param callback 回调函数
     */
    mobileService.undoRealFundOrder = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001962";
    	paraMap["order_id"] = param.order_id;
    	paraMap["trade_pwd"] = param.trade_pwd;
    	paraMap["user_id"] = param.user_id;
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 订单查询（单个）【1001963】
     *       product_id：产品id
     *       fund_account：资金账户
     *       tot_price：购买金额
     *       product_code
     * @param callback 回调函数
     */
    mobileService.queryRealFundOrder = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001963";
		paraMap["user_id"] = param.user_id;
		paraMap["order_state"] = param.order_state;
		paraMap["product_sub_type"] = param.product_sub_type;
		paraMap["start_time"] = param.start_time;
		paraMap["end_time"] = param.end_time;
		paraMap["curPage"] = param.curPage;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["apply_no"] = param.apply_no;
		paraMap["orderByParam"] = param.orderByParam;
		paraMap["orderByType"] = param.orderByType;
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * ETF份额查询【1001964】
     *       product_id：产品id
     *       fund_account：资金账户
     *       tot_price：购买金额
     *       product_code
     * @param callback 回调函数
     */
    mobileService.queryRealFundAssets = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001964";
		paraMap["fund_account"] = param.fund_account;
		paraMap["product_code"] = param.product_code;
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
	 * @Author:万亮
	 * 东北话答题活动接口
	 * @param article_id 文章编号
	 * @param callback 回调函数
	 */
	mobileService.getUrl = function(param,callback,ctrlParam)
    {
	    var paraMap = {};
	    paraMap["function"] = "GetUrl";
	    paraMap["openId"] = param.OpenID;	
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.getUrl);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 推荐查询
     * @param recomcode 唯一码
     * @param callback 回调函数
     */
    mobileService.queryVote = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1105036";
    	paraMap["recomcode"] = param.recomcode;	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 查询吉视通投票系统选手信息
     * @param user_id 用户唯一码
     * @param callback 回调函数
     */
    mobileService.queryJstEmpInfo = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001965";
    	paraMap["user_no"] = param.user_no;	
    	paraMap["page"] = param.page;	
    	paraMap["numPerPage"] = param.numPerPage;	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 吉视通投票系统客户投票
     * @param user_id 用户唯一码
     * @param player_ids 选手编号投票选手编号，“,”分割
     */
    mobileService.playerIdsVoteJst = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001966";
    	paraMap["user_no"] = param.user_no;	
    	paraMap["player_ids"] = param.player_ids;
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * 吉视通投票系统选手详情
     * @param player_id 选手编号
     */
    mobileService.queryJstEmpDetail = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1001967";
    	paraMap["player_id"] = param.player_id;	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
    /**
     * @Author:万亮
     * W权限开通
     * @param user_id 用户编号
     * @param agreement_id 协议编号
     */
    mobileService.openCashTakingW = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1000155";
    	paraMap["user_id"] = param.user_id;	
    	paraMap["agreement_id"] = param.agreement_id;	
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    
/********************************************************基金定投**********************************************/

    /**
     * @Author:万亮
     * 新增定投申购协议 (1000521)
     * @param user_id 用户编号
     * @param trade_account 资金帐号
     * @param product_code 产品代码
     * @param trade_cycle_unit 交易周期单位
     * @param trade_cycle 交易周期
     * @param trade_date 交易日期
     * @param trade_money 定投金额
     * @param first_trade_y_m_mall 首次交易月份
     * @param expiry_date 终止日期
     */
    mobileService.fundPlaceBuy = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1000521";
    	paraMap["user_id"] = param.user_id;	
    	paraMap["is_order"] = param.is_order;	
    	paraMap["trade_account"] = param.trade_account;	
    	paraMap["product_code"] = param.product_code;	
    	paraMap["trade_cycle_unit"] = param.trade_cycle_unit;	
    	paraMap["trade_cycle"] = param.trade_cycle;	
    	paraMap["trade_date"] = param.trade_date;	
    	paraMap["trade_money"] = param.trade_money;	
    	paraMap["first_trade_y_m_mall"] = param.first_trade_y_m_mall;	
    	paraMap["expiry_date"] = param.expiry_date;	
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    /**
     * @Author:万亮
     * 变更定投申购协议 (1000522)
     * @param user_id 用户编号
     * @param operator_type 操作类型(0:停止 ;1:修改)
     * @param apply_no 交易申请编号(定投协议号)
     * @param trade_account 资金帐号
     * @param product_code 产品代码
     * @param trade_cycle_unit 交易周期单位
     * @param trade_cycle 交易周期
     * @param trade_date 交易日期
     * @param trade_money 定投金额
     * @param first_trade_y_m_mall 首次交易月份
     * @param expiry_date 终止日期
     */
    mobileService.updateFundPlace = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1000522";
    	paraMap["user_id"] = param.user_id;	
    	paraMap["operator_type"] = param.operator_type;	
    	paraMap["apply_no"] = param.apply_no;	
    	paraMap["fixed_id"] = param.fixed_id;	
    	paraMap["trade_account"] = param.trade_account;	
    	paraMap["product_code"] = param.product_code;	
    	paraMap["trade_cycle_unit"] = param.trade_cycle_unit;	
    	paraMap["trade_cycle"] = param.trade_cycle;	
    	paraMap["trade_date"] = param.trade_date;	
    	paraMap["trade_money"] = param.trade_money;	
    	paraMap["first_trade_y_m_mall"] = param.first_trade_y_m_mall;	
    	paraMap["expiry_date"] = param.expiry_date;		
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
    /**
     * @Author:万亮
     * 定投协议列表查询 (1000523)
     * @param user_id 用户编号
     * @param agreement_id 协议编号
     * @param order_num 订单数量，空值表示查询所有，如果是0表示只查询定投成功的订单
     */
    mobileService.queryFundPlaceList = function(param,callback,ctrlParam)
    {
    	var paraMap = {};
    	paraMap["funcNo"] = "1000523";
    	paraMap["user_id"] = param.user_id;	
    	paraMap["page_no"] = param.page;	
    	paraMap["records_num"] = param.numPerPage;	
    	paraMap["order_num"] = param.orderNum;	
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }; 
 
    /**
	 * @Author:刘航
	 * 获取中奖信息(1105028)
	 * @param callback 回调函数
	 */
	mobileService.queryActivityInfo = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105028";
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.localPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
	 * @Author:刘航
	 * 请求中奖结果(1105029)  
	    var recomCode = "";
	 	var app_unique_code = "";
	 * @param callback 回调函数
	 */
	mobileService.queryLuckyResults = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105029";
	    param["recomcode"] = param.recomCode;
	    param["app_unique_code"] = param.app_unique_code;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.localPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
  
    /**
     * @Author:刘航
   	 * 添加地址(1105031)
   	 */
	mobileService.AddressService = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105034";
	    //param["weixinpk"] = param.weixinpk;
	    //param["openid"] = param.openid;
	    param["type"] = param.type;
	    param["exprs_id"] = param.exprs_id;
	    param["user_id"] = param.user_id;
	    param["user_name"] = param.user_name;
	    param["address"] = param.address;
	    param["mobile_phone"] = param.mobile_phone;
	    param["is_default"] = param.is_default;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:刘航
   	 * 获取中奖列表(1105032)
   	 */
	mobileService.queryWinList = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105032";
	    //param["weixinpk"] = param.weixinpk;
	    //param["openid"] = param.openid;
	    param["user_id"] = param.user_id;
	    
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:刘航
   	 * 中奖商品添加地址(1105033)
   	 */
	mobileService.setWinAddr = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105033";
	    //param["weixinpk"] = param.weixinpk;
	    //param["openid"] = param.openid;
	    param["win_id"] = param.win_id;
	    param["addr"] = param.addr;
	    param["name"] = param.name;
	    param["phone"] = param.phone;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:刘航
   	 * 流量充值(1105035)
   	 */
	mobileService.recharge = function(param,callback,ctrlParam)
    {
	    param["funcNo"] = "1105035";
	    //param["weixinpk"] = param.weixinpk;
	    //param["openid"] = param.openid;
	    param["win_id"] = param.win_id;
	    param["phone"] = param.phone;
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:詹新蕾
     * 奥运活动分享(1105088)
     */
    mobileService.deliverParamtoThree = function(param,callback,ctrlParam)
    {
    	param["funcNo"] = "1105088";
    	param["phone"] = param.phone;
    	param["phone_reco"] = param.phone_reco;
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:詹新蕾
     * 嵌入对账单地址(1105089)
     */
    mobileService.goMyAccount = function(param,callback,ctrlParam)
    {
    	param["funcNo"] = "1105089";
    	param["fund_account"] =param.fund_account;
    	
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
    /**
     * @Author:詹新蕾
     * z中焯统一登录(1105090)
     */
    mobileService.getClientInfoFromZZ = function(param,callback,ctrlParam)
    {
    	param["funcNo"] = "1105090";
    	param["user_token"] =param.user_token;
    	param["mobilecode"] =param.mobilecode;
    	var reqParamVo = new service.ReqParamVo();
    	reqParamVo.setUrl(global.serverPath);
    	commonInvoke(param, callback, ctrlParam, reqParamVo);
    };
    
	/**
	 * 与中焯统一登录模拟登录之资金账号登录 (1001970)
	 * @Author:詹新蕾
	 * @param fund_account 资金账号
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 * @param login_type 登录渠道
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.mallLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001970";
		paraMap["fund_account"] = param.fund_account;
		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["login_type"] = param.login_type;
		paraMap["login_channel"] = param.login_channel;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 本地查询是否购买过 (1001971)
	 * @Author:万亮
	 * @param user_id 用户编号
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.localIsBuy = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001971";
		paraMap["user_id"] = param.user_id;
		paraMap["product_id"] = param.product_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 登录前判断是否在统一账户登录 (1001972)
	 * @Author:万亮
	 * @param mobile 用户编号
	 * @param login_pwd 密码
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.isUumsLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001972";
		paraMap["mobile"] = param.mobile;
		paraMap["login_pwd"] = param.login_pwd;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 对中焯交易密码进行处理 (11050091)
	 * @Author:詹新蕾
	 * @param trade_pwd 交易密码
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.decodePwaFromZZ = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1105091";
		paraMap["trade_pwd"] = param.password;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 中秋活动 (11050092)
	 * @Author:詹新蕾
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.midAutumnActivity = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1105092";
		paraMap["phone"] = param.phone;
		paraMap["phone_reco"] = param.phone_reco;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};

	
	/************************统一账户接口**************************/
    /**
	 * 功能号600002
	 * 测试接口访问
	 * @return 接口的响应数据

	 */
	mobileService.createSession = function(param,callback,ctrlParam)
    {
	    var paraMap = param || {};
		paraMap["funcNo"] = "600002";		
		paraMap["temp_token"] = param['temp_token'];
		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }
    
      /**
	 * 功能号600003
	 * 测试接口访问
	 * @return 获取登录信息

	 */
	mobileService.getSessionInfo = function(param,callback,ctrlParam)
    {
	    var paraMap = param || {};
		paraMap["funcNo"] = "600003";		
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
    }  
	
	/**
	 * 新客专享产品限定购买订单数(11050092)
	 * @Author:詹新蕾
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 */
	mobileService.newClientOrderNum = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001973";
		paraMap["product_id"] = param.product_id;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	  * 查询最新的订单状态
	 * @Author:魏如梦
	 */
	mobileService.querynewOrder = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001974";
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	/**
	 * 查询最大收益率
	 * @param callback 回调函数
	 * @param isLastReq 是否最后一次请求
	 * @param isShowWait 是否显示等待层
	 * @Author:万亮
	 */
	mobileService.getFundMaxYie = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001975";
		paraMap["fund_type"] = param.fund_type; 
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	/**
	 * 查询用户积分流水（不需要user_id）
	 */
	mobileService.getUserPoint = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001978";
		paraMap["page"]=param.page;
		paraMap["numPerPage"]=param.numPerPage;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	
	/*******************************资讯产品*****************************/
	
	/**
	 * 查询资讯产品信息
	 */
	mobileService.queryInfo = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000056";
		paraMap["product_shelf"] = param.product_shelf;
		paraMap["page"]= param.page;
		paraMap["numPerPage"] = param.numPerPage;
		paraMap["recommend_type"] = param.recommend_type;
		paraMap["brand_id"] = param.brand_id;
		paraMap["is_hot_sale"] = param.is_hot_sale;
		paraMap["info_type"] = param.info_type;
		paraMap["father_product_id"] = param.father_product_id;
		paraMap["not_final_type"] = param.not_final_type;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 根据资讯产品编号查询资讯产品的详细信息
	 */
	mobileService.queryInfoDetail = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000058"; 
		paraMap["product_id"] = param.productId;
		paraMap["productCode"] = param.productCode;
		paraMap["user_id"] = param.user_id;
		paraMap["not_final_type"] = param.not_final_type;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}

	/**
	 * 查看购买此资讯产品的所有用户
	 */
	mobileService.queryCashProductInfo = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001981";
		paraMap["productId"] = param.productId;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 查询资讯产品的内容
	 */
	mobileService.queryInfoDimension = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001982";
		paraMap["id"] = param.id;
		paraMap["themeid"] = param.themeid;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 资讯产品订单生成
	 */
	
	mobileService.addInfoProduct = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000104";
		paraMap["user_id"] = param.user_id;
		paraMap["product_id"] = param.product_id;
		paraMap["order_quantity"] = param.order_quantity;
		paraMap["rules_id"] = param.rules_id;
		paraMap["mobile_phone"] = param.mobile_phone;
		paraMap["usermall"] = param.user_mail;
		paraMap["pay_account"] = param.pay_account;
		paraMap["not_final_type"] = param.not_final_type;
		paraMap["ip"] = param.ip;
		paraMap["initPwd"] = param.initPwd;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	/**
	 * 查询用户购买的产品
	 */
	mobileService.queryMyInfoOrder = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001984";
		paraMap["userId"] = param.user_id;
		paraMap["product_type"] = param.product_type;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 资讯产品订单支付
	 */
	mobileService.queryMyInfo = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1000117";
		paraMap["order_id"] = param.order_id;
		paraMap["pay_type"] = param.pay_type;
		paraMap["user_id"] = param.user_id;
		paraMap["pay_account"] = param.pay_account;
//		paraMap["trade_pwd"] = param.trade_pwd;
		paraMap["integral"] = param.integral;
		paraMap["ip"] = param.ip;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	}
	
	/**
	 * 大转盘活动获取应用凭证 (1000105)
	 * @Author:马杰
	 * @param callback 回调函数
	 */
	mobileService.get_accesstoken = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1105093";
		paraMap["app_id"] = param.app_id;
		paraMap["app_secr"] = param.app_secr;
		paraMap["bizcode"] = param.bizcode;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 大转盘活动用户接口接入 (1000106)
	 * @Author:马杰
	 * @param callback 回调函数
	 */
	mobileService.getAccess = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1105094";
		paraMap["uid"] = param.uid;
		paraMap["access_token"] = param.access_token;
		paraMap["st"] = param.st;
		paraMap["bizcode"] = param.bizcode;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 使用票据登录
	 */
	mobileService.unifiedLogin = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001980";
		paraMap["servticket_id"] = param.servticket_id;//票据id
		paraMap["ip"] = param.id;  //ip
		var reqParamVo =  new service.ReqParamVo( );
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	} 
	
	mobileService.unionPay = function (queryMap, callback, ctrlParam){
		var paraMap = {};
		paraMap["order_no"] = queryMap.order_no;
		paraMap["tot_price"] = queryMap.tot_price;
		var reqParamVo = new service.ReqParamVo();
		reqParamVo.setUrl(global.unionpay);
//		reqParamVo.setReqParam(paraMap);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 我要吐槽
	 */
	mobileService.myDoes = function(param,callback,ctrlParam){
	    var paraMap = {};
	    paraMap["funcNo"] = "1000027";
	    paraMap["estimate_content"] = param.content;
	    paraMap["estimate_type"] = param.estimate_type;  //1表示吐槽
	    paraMap["user_name"] = param.name;
	    paraMap["mobile_phone"] = param.phone;
	    paraMap["email"] = param.email;
		paraMap["ticket"] = param.code;
	    paraMap["visiter_flag"] = param.replyType;  //回复方式
		var reqParamVo =  new service.ReqParamVo( );
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/**
	 * 查询价格规则和服务方式
	 */
	mobileService.queryPriceRules = function(param,callback,ctrlParam){
	    var paraMap = {};
	    paraMap["funcNo"] = "1000060";
	    paraMap["product_id"] = param.product_id;  //产品id
		var reqParamVo =  new service.ReqParamVo( );
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
	/****
	 * 添加吐槽信息
	 * tucao_content 吐槽内容
	 * ip 吐槽地址
	 * phone_system 手机系统
	 * picture 图片
	 * mobile 手机号码
	 * **/
	mobileService.addTucaoContent = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001986";
		paraMap["tucao_content"] = param.tucao_content;
		paraMap["ip"] = param.ip;
		paraMap["phone_system"] = param.phone_system;
		paraMap["picture"] = param.picture;
		paraMap["mobile"] = param.mobile;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	/**
	 * 查询吐槽信息
	 * mobile:手机号码
	 **/
	mobileService.queryTocaoContent = function(param,callback,ctrlParam)
	{
		var paraMap = {};
		paraMap["funcNo"] = "1001987";
		paraMap["mobile"] = param.mobile;
		var reqParamVo =  new service.ReqParamVo();
		reqParamVo.setUrl(global.serverPath);
		commonInvoke(paraMap, callback, ctrlParam, reqParamVo);
	};
	
    /********************************应用接口结束********************************/
});