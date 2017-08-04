/**
 * 风险测评
 */
define(function(require, exports, module) {
	var appUtils = require("appUtils"); // 核心工具类
	var gconfig = require("gconfig"); 
	var global = gconfig.global; // 全局对象
	var service = require("mobileService");//业务层接口，请求数据
	var common = require("common"); // 公共类
	var layerUtils = require("layerUtils"); // 弹出层工具类
	var _pageId ="#register_riskAssessment "; // 页面ID
	var allQuesArray = []; 
	
	var pageGlobal = {
			"enumData" : [] // 用户缓存数据字典信息item_name,item_value
		}

	/*初始化*/
	function init()
	{
		// 页面初始化时，滚动内容定位到最上面。
		$(_pageId + "article")[0].scrollTop = 1;
		
		getRiskAssessQuestions();  //获取问卷答题
		allQuesArray = [];
		
//		queryMotifType(); // 查询TA公司
	}

	function bindPageEvent() {
		
		/* 绑定返回事件 */
		appUtils.bindEvent($(_pageId+" .back_btn"),function(){
			appUtils.pageBack();
		});
		
		/* 进入测评 */
		appUtils.bindEvent($(_pageId+" .sub_btn_ta"),function(){
			var risk_type_id = $(_pageId + "#bankList").children("ul").children("li").children("div").children("input:radio[name='taBank']:checked").attr("item_value");
			appUtils.pageInit("register/riskAssessment", "finan/bankRiskAssessment", {"risk_type_id" : risk_type_id});
		});
		
		// 个人风险测评和银行理财风险测评tab切换
		appUtils.bindEvent(_pageId + "#tra_tab_list .row-1", function(){
			if ($(this).hasClass("act")) {
				return;
			}
			
			var tabRowEles = $(_pageId + "#tra_tab_list .row-1");
			var index = tabRowEles.index(this);
			// 移除所有tab act样式
			tabRowEles.find("a").removeClass("act")
			// 设置当前tab act样式
			$(this).find("a").addClass("act");
			// 隐藏所有tab页
			$(_pageId + ".my_pos_list").hide();
			// 显示当前tab页
			$(_pageId + "#tra_tab_" + index).show();
			
			if (index == 0) {
				// 个人风险测评
				$(_pageId + " #bank_list").hide();
				$(_pageId + " .sub_box").show();
				$(_pageId + " .reviews_page").show();
			} else if (index == 1) {
				// 银行理财产品
				$(_pageId + " .sub_box").hide();
				$(_pageId + " .reviews_page").hide();
				$(_pageId + " #bank_list").show();
				
			}
		});
		
	}
	
	/*
	 * 获取TA公司所有数据字典
	 */
	function queryMotifType(){
		// 清空数据字典数据
		pageGlobal.enumData = [];
		
		var param = {
			"enum_name" : "ta_company_name" 
		}
		
		service.queryEnum(param, function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			
			if(error_no == "0"){
				var results = data.results;
				if (results.length > 0) {
					var bankList = $(_pageId + "#bankList ul").empty();
					for (var i = 0; i < results.length; i++) {
						var result = data.results[i];
						
						var checked = "";
						var item_id = result.item_id; // 值编号 
						var item_name = result.item_name; // 项目名
						var item_value = result.item_value; // 项目值
						var item_name_en = result.item_name_en; // TA公司编号

						// 默认选中第一个
						if(i == 0){
							var checked = 'checked="checked"';
						}
							
						var myBankCard = '<li>'	+
										 '	<div class="ui radio">' +
										 '		<input type="radio" item_name_en = "' + item_name_en + '" item_value = "' + item_value + '" id="radio_' + i + '" name="taBank" ' + checked + ' />' +
										 '		<label for="radio_' + i + '">' + item_name + '' + item_name_en + '</label>' +
										 '	</div>' +
										 '</li>';
						
						bankList.append(myBankCard);
					}
				}
			}else{
				layerUtils.iMsg(-1,error_info);
				return false;
			}
		});
	}
	
	/*
	 * 查询数据字典
	 */
//	function queryenum(key){
//		var enumData = pageGlobal.enumData;
//		for (var i = 0; i < enumData.length; i++) {
//			var item = enumData[i];
//			if (item.itemValue == key) {
//				return item.itemName;
//			}
//		}
//	}
	
	function getRiskAssessQuestions(){
		var queryTestParam = {
			"risk_type_id":"0"
		};
		//查询风险评测
		service.queryEval(queryTestParam,function(data){
			var errorNo = data.error_no;
			var errorInfo = data.error_info;
			if(errorNo==0 && data.results.length != 0)	//调用成功,跳转到风险测评页面
			{
				var results = data.results;
				for(var i = 0; i < results.length; i++)
				{
					var oneQuestion = {},  // 一个题目
					answerNo = 0;  // 答案编号  
					oneQuestion.question_id = results[i].question_id;  // 题目 id
					oneQuestion.question_title = results[i].question_title;  // 题目
					oneQuestion.answerArray = [];  // 答案数组
					var answers =results[i].answers;
					answers = answers.replaceAll("=",":'");
					answers = answers.replaceAll("}, ","'},");
					answers = answers.replaceAll("}]","'}]");
					answers = answers.replaceAll(", ","',");
					answers = answers.replaceAll("\n","");
					answers = answers.replaceAll("\r","");
					var data = "";
					eval("data="+answers); 
					for(var j = 0; j < data.length; j++)
					{
						oneQuestion.answerArray[answerNo] = {};   // 创建一个答案对象
						oneQuestion.answerArray[answerNo].option_id = data[j].option_id;  // 答案 id
						oneQuestion.answerArray[answerNo].option_no = data[j].option_no;  // 答案 no
						oneQuestion.answerArray[answerNo++].description = data[j].description;  // 答案内容
					}
					allQuesArray.push(oneQuestion);  // 将题目放到题目数组中
					oneQuestion = {};
					answerNo = 0;
					oneQuestion.question_id = results[i].question_id;  // 题目 id
					oneQuestion.question_title = results[i].question_title;  // 题目
					oneQuestion.answerArray = [];  // 答案数组
				}

				fillQuestions();  // 填充风险测评题目

			}
			else
			{
				layerUtils.iMsg("-1",errorInfo);
			}
		},{timeOutFunc:true});
	}


	/*填充题目到页面中*/
	function fillQuestions()
	{
		var allQuesStr="";
		for(var i = 0; i < allQuesArray.length; i++){
			var item = allQuesArray[i];
			var answerArray = item.answerArray;  // 答案数组
			var answerStr = "";
			for(var j = 0; j < answerArray.length; j++){
				var answerItem = answerArray[j];
				answerStr += '<dd>' + 
							'	<div class="ui radio">' + 
							'		<input question_id="'+item.question_id+'" option_id="'+answerItem.option_id+'"  name="buyerType_'+i+'" type="radio" id="radio_'+i+'_'+j+'"/>' + 
							'		<label for="radio_'+i+'_'+j+'">'+answerItem.description+'</label>' + 
							'	</div>' + 
							'</dd>';
			} 
			allQuesStr += '<li>' + 
							'	<dl>' + 
							'		<dt question_id="'+item.question_id+'">'+(i+1)+'.'+item.question_title+'</dt>' + answerStr +
							'	</dl>' + 
							'</li>';
			
		}
		$(_pageId+"#test_list").html(allQuesStr);

		/*确定按钮*/
		appUtils.bindEvent($(_pageId+".sub_btn"), function(){
			if(validateNext())  // 校验下一步条件
			{
				postRiskAnswer();  // 提交风险测评答案
			}
		});

	}

	/*校验下一步条件*/
	function validateNext()
	{
		var bAllChoose = true,  // boolean 类型的变量，题目是否全部答完
		aNoSelQuesNo = [];  // array 类型的变量，没有选择的问题编号数组
		$(_pageId+"#test_list dl").each(function(index, obj){
			if(!$(obj).children("dd").children("div").children("input:radio[name='buyerType_"+index+"']").is(":checked"))
			{
				bAllChoose = false;
				aNoSelQuesNo.push(index+1);
			}
		});
		if(!bAllChoose)  // 当有题未选择答案时
		{
			layerUtils.iAlert("您还有【"+aNoSelQuesNo.join("、")+"】未完成");
		}
		return bAllChoose;
	}

	/**
	 * 获取风险测评答案
	 * 返回的数据格式：34_58|34_57|34_56
	 */
	function getRiskAnswer()
	{
		var riskAnswerStr = "",  // 测评答案字符串
		queId = null,  // 题目 id
		ansId = null;  // 答案 id
		$(_pageId+"#test_list dl").each(function(index){
			queId = $(this).children("dt").attr("question_id");
			ansId = $(this).children("dd").children("div").children("input:radio[name='buyerType_"+index+"']:checked").attr("option_id");
			riskAnswerStr += queId+"_"+ansId+"|";
		});
		var riskAnswerStr1=riskAnswerStr.substring(0,riskAnswerStr.length-1);
		console.log(riskAnswerStr1);
		return riskAnswerStr1;
	}
	
	/*提交风险测评答案*/
	function postRiskAnswer()
	{
		getRiskAnswer();
		var userInfo = appUtils.getSStorageInfo("userInfo");
		var user_id = JSON.parse(userInfo).user_id;
		var riskAnswerParam = {
			"user_id" : user_id,
			"risk_type_id" : "0",
			"content" : getRiskAnswer()  // 获取风险测评答案
		};
		
		service.submitTestAnswer(riskAnswerParam,function(data){
			var error_no = data.error_no;
			var error_info = data.error_info;
			if(error_no == 0){
				item = data.results[0];
				var riskName = item.risk_name; // 名称
				var riskScore = item.risk_fraction; // 分数
				var risk_level = item.risk_level; // 风险等级分数
				var pageParam = appUtils.getPageParam(); // 测评成功后需要返回的页面
				/*把风险承受能力等级存到session*/
				if(item.risk_level){
					appUtils.setSStorageInfo("risk_level",item.risk_level);
				}
				/*把理财风险承受能力存到session*/
				if(item.risk_name){
					appUtils.setSStorageInfo("lc_risk_level_txt",item.risk_name);
				}
				if (!pageParam) {
					pageParam = {};
				}
				pageParam.riskScore = riskScore;
				pageParam.riskName = riskName;
				appUtils.pageInit("register/riskAssessment", "register/riskAssSuccess", pageParam);
			}
			else{
				layerUtils.iAlert(error_info);
			}
		});

	}

	/* 处理请求超时 */
	function handleTimeout()
	{
		layerUtils.iConfirm("请求超时，是否重新加载？",function(){
			getRiskAssessQuestions();  // 再次风险测评题目
		});
	}

	function destroy()
	{
		$(_pageId+"#test_list").empty();
		service.destroy();
	}

	var riskAssessment = 
	{
		"init" : init,
		"bindPageEvent": bindPageEvent,
		"destroy": destroy
	};

	module.exports = riskAssessment;

	});