/**
  @author wangwz
  @date 2015/9/30
  @description 常用校验方法
  
  @用法：待校验的输入框必须在初始化方法的入参中配置即rules的key值【key值均为输入框控件id】
  	1、初始化方法--- validateUtils.validate({
						rules : { 
							userName : {
								required: true,
								limitMax: 11 
							} 
						},
						msg : {
							userName : {
								required: "用户名不能为空",
								limitMax: "用户名不能大于11位"
							} 
						}
					});
						
	2、校验所有输入框，返回true:通过，false：不通过---- validateUtils.validAll();
	3、校验单个输入框，返回true:通过，false：不通过---- validateUtils.valid("id");
 */
define(function (require, exports, module) {
	var $ = jQuery = require('jquery');
	
	var opts = {
			rules : {}, //控件规则
			msg : {}, //规则对应的描述信息
			elements : [],//需要检验的元素ID数组
			isBindEvent : true, //是否需要绑定元素事件
			event : "blur",//事件类型
			defaultMsg : {
				required : "必填项",
				max : "值过大",
				min : "值太小",
				phone : "请输入正确的手机号码",
				number : "非法数字",
				reg : "非法值"
			},
	};
	
	var result = true; //标识校验结果，只要有一个校验未通过即为false.
	
	/**
	 * 初始化options
	 */
	function validate(options){
		if (options) {
			opts.elements = options.elements || [];
			
			//没有设置校验元素集时，取rules中的key值。
			if (opts.elements.length == 0 && options.rules) {
				for (var ele in options.rules) {
					opts.elements.push(ele);
				}
			};
			
			opts.isBindEvent = options.isBindEvent || true;
			opts.event = options.event || "blur";
			opts.rules = options.rules || {};
			opts.msg = options.msg || {};
			opts.isBindEvent = options.isBindEvent || true;
			
			if (opts.isBindEvent) {
				bindEvent();
			}
		}
	};
	
	/**
	 * 事件触发校验器
	 */
	function bindEvent(){
		for (var i = 0; i < opts.elements.length; i++) {
			$("#" + opts.elements[i]).bind(opts.event, function(){
				result = true;
				valid($(this).attr("id"));
			});
		}
	};
	
	/**
	 * 校验单个元素
	 */
	function valid(eleId){
		
		if (!eleId) {
			return true;
		}
		//删除错误提示
		hideErrorTip(eleId);
		
		//根据规则校验输入框值
		for (var ele in opts.rules) {
			if (ele == eleId) {
				var col = opts.rules[ele];
				if (result && col.required) {
					checkRequired(ele);
				}
				if (result && col.limitMax) {
					checkLimitMax(ele, col.max);
				}
			}
		}
		return result;
	}
	
	/**
	 * 添加元素自身校验规则，配置在元素标签中 如： <input id="userName" max="5" min="1"/> 
	 * 
	 */
	function addEleSelfRule(){
		
	}
	
	/**
	 * 校验所有
	 */
	function validAll(){
		result = true;
		for (var i = 0; i < opts.elements.length; i++) {
			valid(opts.elements[i]);
		}
		return result;
	};
	
	/**
	 * 必填项
	 */
	function checkRequired(eleId, required){
		if ($.string.isEmpty($("#" + eleId).val())) {
			showErrorTip(eleId, getErrorMsg(eleId, "required"));
			result = false;
		};
	};
	
	/**
	 * @desc 校验控件值是否超过设置的最大值
	 * @param eleId 元素ID
	 * @param srcVal 对比值
	 */
	function checkLimitMax(eleId, srcVal){
		var eleObj = $("#" + eleId);
		if (eleObj) {
			var eleVal = $.trim(eleObj.val());
			if (eleVal > srcVal) {
				showErrorTip(eleId, getErrorMsg(eleId, "max"));
				result = false;
			}
		}
	}
	
	/**
	 * 添加错误提示信息
	 */
	function showErrorTip(eleId, errorMsg){
		var tipEle = "<span class='error-tip' style='color:red'>" + errorMsg + "</span>";
		$("#" + eleId).after(tipEle);
	}
	
	/**
	 * 删除错误信息
	 */
	function hideErrorTip(eleId){
		var errorTip = $("#" + eleId).next();
		if (errorTip.hasClass("error-tip")) {
			errorTip.remove();
		}
	}
	
	/**
	 * @desc 获取错误信息，如果没有设置错误信息则取默认
	 * @param eleId 元素ID 
	 */
	function getErrorMsg(eleId, ruleName){
		var errorMsg = opts.defaultMsg[ruleName];
		
		if (opts.msg && opts.msg[eleId] && opts.msg[eleId][ruleName]) {
			errorMsg = opts.msg[eleId][ruleName];
		}
		return errorMsg;
	}
	
	var validateUtil = {
		"validate": validate,
		"valid": valid,
		"validAll" : validAll
	};
	
	//暴露对外的接口
	module.exports = validateUtil;
});