/**
 * 模块名：九宫格抽奖页面
 * 作者： 刘航
 * 时间：2015年12月23日13:59:01
 * 简述：
 */
define(function(require,exports,module){
	/*引用模块*/
	var appUtils = require("appUtils"),
		gconfig = require("gconfig"),
		layerUtils = require("layerUtils"),
		service = require("mobileService"), //服务类 //业务层接口，请求数据service_wxactivity
		common = require("common"); //公共类
	/*常量*/
	var pageCode = "activity/activity",
	 	_pageId = "#activity_activity ";
	 var recomCode = "";
	 var app_unique_code = "";
	/*变量*/
	var  is_status , weixinpk = "",openid = "",activity_mark ="";
	var wardId = null;
	var isWin = true; //true:中奖
	var integral_way="";// integral_way 是否需要积分: 0 需要 1不限制
	var integral_num = "";// integral_num 参加活动的需要的积分,判断用户当前的积分,少于则不调用接口 
	var enable_integral = ""; // 用户的积分
	var outResult = {}; //抽奖成功返回人结果集
	var lotteryNum = "";
	var is_status = null;  // 活动的状态 
	/**
	 * 初始化
	 * */
	function init(){
		if(lottery){
			clearInterval(lottery.getResultTimer);
			clearTimeout(lottery.downTimer);
			clearTimeout(lottery.rollerTimer);
			$(_pageId + "#award").unbind('click');
		}
		app_unique_code = appUtils.getPageParam("app_unique_code");  // 取页面参数
		appUtils.setSStorageInfo("app_unique_code",app_unique_code); // 存页面参数 
		
		activity_mark = "dzp";
	    // var userInfo  = appUtils.getSStorageInfo("userInfo");
	   
		queryActivityInfo(); // 查询中奖信息
		// 转盘查询成功后
	    startLottery();
	    
	    
	}
	
	function startLottery(){
		// 初始化大转盘
		lottery.lottery({
			selector:     '#lottery',
			width:        3,
			height:       3,
			index:        0,    // 初始位置
			initSpeed:    300,  // 初始转动速度
			upStep:       50,   // 加速滚动步长
			upMax:        50,   // 速度上限
		    downStep:     30,   // 减速滚动步长
		    downMax:      200,  // 减速上限
		    waiting:     2000, // 匀速转动时长
			beforeRoll: function () { // 重写滚动前事件：beforeRoll
				// 获取活动结果
				//活动有效期 0未开启 1进行中 2已过期
				if(is_status == "0"){
					havingLottery("未开始");
				}else if(is_status == "2"){
					havingLottery("已过期");
				}else{
					if(isLogin()){//校验用户是否登录
						queryLuckyResults(); 
					}
				}
			},

			aim: function () { 
				// 1表示最终停止的位置和开始的位置
				// 获取用户积分  1105029
				this.options.target = wardId;  // 请求的数据是多少,转盘就停止在哪里
			},
			_stop:function(){
				//alert("转盘停止");
			}
		});
	}
	
	/** 校验用户是否登录 */
	function isLogin(){
		var _loginInPageCode = "activity/activity";
		if (!common.checkUserIsLogin(false, true, _loginInPageCode, appUtils.getPageParam(), false)) {
			lottery._destroy(); 
			return false;   // 未登录则进行页面跳转
		}
		recomCode  = appUtils.getSStorageInfo("recomCode"); // 获取活动推荐   推荐码你要判断是否为空
		app_unique_code = appUtils.getSStorageInfo("app_unique_code"); // 获取活动唯一码
		return true;
	}
	
	/**
	 * 事件绑定
	 * */
	function bindPageEvent(){
		// 点击规则
    	$(".rules_btn").click(function(){
    		show(); // 显示抽签信息
    	});
    	// 隐藏规则
    	$("#box").click(function(){
    		hide(); // 隐藏抽奖信息
    	});
    	
    	// 继续抽奖
    	$("#jxcj").click(function(){
    		hideD();
    	});
    	
    	// 领取奖品
    	$("#lqjp").click(function(){
    		hideD();
    		appUtils.pageInit(pageCode, "activity/winList");
    	});
    	
    	// 未中奖继续抽奖
    	$("#Njxcj").click(function(){
    		hideN();
    	});
    	
    	// 未中奖领取奖品
    	$("#Nlqjp").click(function(){
    		hideN();
    		appUtils.pageInit(pageCode, "activity/winList");
    	});
    	
    	//返回
    	appUtils.bindEvent($(_pageId+" .back_btn"),function(){
    		appUtils.pageBack();
    	});
	}
	
	/**
	 * 查询活动信息
	 * @returns
	 */
	function queryActivityInfo(){
		/*入参*/
		var param = {
				"activity_mark": activity_mark,
		};
		
		/*回调函数*/
		var callBack = function(resultVo){
			if(resultVo.error_no == 0){
				var results = resultVo["results"];
				var _ActivityAwardList = results[0]['ActivityAwardList'];
				is_status = results[0]['is_status'];//活动有效期 0未开启 1进行中 2已过期
				var warming = ['活动即将开启，敬请期待！', "", "十分抱歉，活动已过期！"];
				var is_user_num = results[0]['is_user_num'];//抽奖次数
				var probability = results[0]['probability'];//概率
				var role = results[0]['role'];//规则
				integral_way = results[0]['integral_way'];// integral_way 是否需要积分: 0 需要 1不限制
				integral_num = results[0]['integral_num'];// integral_num 参加活动的需要的积分,判断用户当前的积分,少于则不调用接口
				
				$(".rules_txt_con").append(role);
				var obj = eval('(' + _ActivityAwardList + ')');   // 字符串转json对象
				var length = obj.length;
				var li ="";
				// 填充结果
			    for(var i=0;i<length;i++){
			    	li = $("#lotterys").find("li[lottery-unit-index="+i+"]");
			    	li.attr("jp_id",obj[i].id);
			    	//li.find("p").text(obj[i].name);      // 设置奖项名称
			    	li.find("img").attr("src",obj[i].id=="-1"?"images/3.png":"/mall/"+obj[i].pic_url);  // 设置背景图片
			    }	
			}else{
				layerUtils.iMsg(-1,resultVo.error_info);
				return false;
			}
		};
		
		service.queryActivityInfo(param,callBack);
		
	}
	
	
	/**
	 * 请求中奖结果
	 */
	 function queryLuckyResults(){
			 var param = {
					  "funcNo": 1105029,
					  'activity_mark': activity_mark,
					   "user_id" : common.getUserId(),
					   "recomCode" :　recomCode, 
					   "app_unique_code" : 	app_unique_code  
				};
			var callBack = function(resultVo){
				outResult["error_no"] = resultVo.error_no;
		    	outResult["error_info"] = resultVo.error_info;
		    	if(resultVo.error_no == "0"){
		    		var results = resultVo["results"];
		    		// 判断活动是否处于有效期
				    if(is_status == "0"){
						layerUtils.iMsg(-1,warming[is_status]);
						havingLottery("未开始");
						return false;
					}
				    else if(is_status == "1"){
				    	if(!results || results.length == 0){
							layerUtils.iMsg(-1,"当前参与活动人数过多，请稍后再试！");
							return;
						}
			    		
			    		//enable_integral = results[0]['enable_integral'];//  // 用户的积分
			    		// 判断用户的积分是否够
			    		/*if(integral_way=="0" && enable_integral<integral_num){
							layerUtils.iMsg(-1,"抱歉,您参与活动的积分不够!");
							return false;
			    		}*/
				    	
			    		
						//lotteryNum = parseInt(enable_integral / integral_num);  // 剩余的抽奖次数
			    		//enable_integral = enable_integral-integral_num; //抽奖成功后,减掉相应积分.
			    		
			    		// console.log("中奖信息 "+results);
			    		var _is_user_num = results[0]['is_user_num']; //
			    		var _name = results[0]['name'];  // "50元红包"
			    		var _id = results[0]['id']; // "50元红包"
			    		$("#hongbao").html(_name);
			    		if(!_id){
			    			isWin = false;
			    			_id = -1;
			    			$("#hongbao").html("很遗憾,您未中奖!剩余"+lotteryNum+"次抽奖机会");
			    		}
			    		//设置奖品图片
			    		$(".dialog_lottery_det img").attr("src","/mall/"+results[0]['pic_url']); 
			    		
			    		//查询该奖品的转盘人位置
			    		var li = $("#lotterys").find("li[jp_id="+_id+"]");
			    		wardId = li.attr("lottery-unit-index");
						
					}
				    else if(is_status == "2"){
						layerUtils.iMsg(-1,warming[is_status]);
						havingLottery("已过期");
						return false;
					}
				
		        }else if(resultVo.error_no == "-110502901"){
		        	layerUtils.iMsg(-1,"抱歉,当前活动还未开始!");
		        	return false;
		        }else if(resultVo.error_no == "-110502902"){
		        	layerUtils.iMsg(-1,"抱歉,当前活动已结束!");
		        	return false;
		        }else if(resultVo.error_no == "-110502906"){
		        	layerUtils.iMsg(-1,"抱歉，您已参与过该活动!");
		        	return false;
		        }else if(resultVo.error_no == "-110502908"){
		        	layerUtils.iMsg(-1,"抱歉,您参与活动的积分不够!");
		        	return false;
		        }
		    	else{
		    		layerUtils.iMsg(-1,resultVo.error_info);
					return false;
				}
		    };
		    service.queryLuckyResults(param,callBack);
	 }
	   
	

	/*!
	 * lottery v1.0.3
	 * by blacksnail2015 2015-03-30
	 */
	/*
	 * 这里对速度做一下说明：
	 *     这里的速度其实就是切换样式的间隔时间，也就是setTimeout(functionName, time)中的time值；
	 *     因此，速度值越小，间隔越短，转的越快。
	 */
		var defaults = {
				selector:     '#lottery',
				width:        4,    // 转盘宽度
				height:       4,    // 转盘高度
				initSpeed:    300,	// 初始转动速度
				speed:        0,	// 当前转动速度
				upStep:       50,   // 加速滚动步长
				upMax:        50,   // 速度上限
				downStep:     30,   // 减速滚动步长
				downMax:      400,  // 减速上限
				waiting:      2000, // 匀速转动时长
				index:        0,    // 初始位置
				target:       7,    // 中奖位置，可通过后台算法来获得，默认值：最便宜的一个奖项或者"谢谢参与"
				isRunning:    false // 当前是否正在抽奖
		}

	var lottery = {

		// 初始化用户配置
		lottery: function (options) {
			this.options = $.extend(true, defaults, options);
			this.options.speed = this.options.initSpeed;
			this.container = $(this.options.selector);
			this._setup();
		},

		// 开始装配转盘
		_setup: function () {

			// 这里为每一个奖项设置一个有序的下标，方便lottery._roll的处理
			// 初始化第一行lottery-group的序列
			for (var i = 0; i < this.options.width; ++i) {
				this.container.find('.lottery_box_list:first .lottery-unit:eq(' + i + ')').attr('lottery-unit-index', i);
			}

			// 初始化最后一行lottery-group的序列
			for (var i = lottery._count() - this.options.height + 1, j = 0, len = this.options.width + this.options.height - 2; i >= len; --i, ++j) {
				this.container.find('.lottery_box_list:last .lottery-unit:eq(' + j + ')').attr('lottery-unit-index', i);
			}

			// 初始化两侧lottery-group的序列
			for (var i = 1, len = this.options.height - 2; i <= len; ++i) {
				this.container.find('.lottery_box_list:eq(' + i + ') .lottery-unit:first').attr('lottery-unit-index', lottery._count() - i);
				this.container.find('.lottery_box_list:eq(' + i + ') .lottery-unit:last').attr('lottery-unit-index', this.options.width + i - 1);
			}
			this._enable();
		},

		// 立即抽奖
		_enable: function () {
			this.container.find('a').bind('click', this.beforeRoll);
		},

		// 禁用抽奖
		_disable: function () {
			this.container.find('a').unbind('click', this.beforeRoll);
		},

		// 转盘加速
		_up: function () {
			var _this = this;
			if (_this.options.speed <= _this.options.upMax) {
				_this._constant();
			} else {
				_this.options.speed -= _this.options.upStep;
				_this.upTimer = setTimeout(function () { _this._up(); }, _this.options.speed);
			}
		},

		// 转盘匀速
		_constant: function () {
			var _this = this;
			clearTimeout(_this.upTimer);
			setTimeout(function () { _this.beforeDown(); }, _this.options.waiting);
		},

		// 减速之前的操作，支持用户追加操作（例如：从后台获取中奖号）
		beforeDown: function () {
			var _this = this;
			_this.aim();
			if (_this.options.beforeDown) {
				_this.options.beforeDown.call(_this);
			}
			_this._down();
			
		},

		// 转盘减速
		_down: function () {
			var _this = this;
			if (_this.options.speed > _this.options.downMax && _this.options.target == _this._index()) {
				_this._stop();
			} else {
				_this.options.speed += _this.options.downStep;
				_this.downTimer = setTimeout(function () { _this._down(); }, _this.options.speed);
			}
		},

		// 转盘停止，还原设置
		_stop: function () {
			var _this = this;
			clearTimeout(_this.downTimer);
			clearTimeout(_this.rollerTimer);
			_this.options.speed = _this.options.initSpeed;
			_this.options.isRunning = false;
			_this._enable();
			if (_this.options._stop) {
				_this.options._stop.call(_this);
			}
			/*if(integral_way=="0" && enable_integral<integral_num){
				 havingLottery("以抽过"); // 已经抽过
			}*/
			// 显示中奖信息
			if(isWin){
				outResult = {};
				var t = setTimeout(showD,1000);
			}else{
				outResult = {};
				isWin = true;//重新初始化中奖状态,等待下一次抽奖.
				// 很遗憾,您未中奖
				var t1 = setTimeout(showN,1000);
			}
		},
		
		// 抽奖之前的操作，支持用户追加操作
		beforeRoll: function () {
			//活动有效期 0未开启 1进行中 2已结束
			if(is_status == "0"){
				havingLottery("未开始");
			}else if(is_status == "1"){
				/*if(integral_way=="0" && parseInt(enable_integral) < parseInt(integral_num)){
					layerUtils.iMsg(-1,"抱歉,您参与活动的积分不够!");
					return false;
				}*/
				var _this = lottery;
				_this._disable();  // 执行禁止调用
				if (_this.options.beforeRoll) {
					// 控制转盘加载后再转
					_this.getResultTimer = setInterval(function(){
						if(outResult && outResult.error_no){
							if(outResult.error_no=="0"){
								_this._roll();  // 执行 转盘滚动
							}
							else{
								//重新初始化抽奖
								clearTimeout(_this.downTimer);
								clearTimeout(_this.rollerTimer);
								_this.options.speed = _this.options.initSpeed;
								_this.options.isRunning = false;
								_this._enable();
								
							}
							clearInterval(_this.getResultTimer);
			   			}
					},600);
					_this.options.beforeRoll.call(_this);
				}
			}else if(is_status == "2"){
				havingLottery("已结束");
			}
		},
		_destroy: function () {
			var _this = this;
			clearTimeout(_this.downTimer);
			clearTimeout(_this.rollerTimer);
			_this.options.speed = _this.options.initSpeed;
			_this.options.isRunning = false;
			clearInterval(_this.getResultTimer);
			_this._disable();
		},
		// 转盘滚动
		_roll: function () {
			var _this = this;
			_this.container.find('[lottery-unit-index=' + _this._index() + ']').css("background","#FFFFFF");
			++_this.options.index;
			_this.container.find('[lottery-unit-index=' + _this._index() + '].lottery-unit').css("background","#FFA199");
			_this.rollerTimer = setTimeout(function () { _this._roll(); }, _this.options.speed);
			if (!_this.options.isRunning) {
				_this._up();
				_this.options.isRunning = true;
			}
		},

		// 转盘当前格子下标
		_index: function () {
			return this.options.index % this._count();
		},

		// 转盘总格子数
		_count: function () {
			return this.options.width * this.options.height - (this.options.width - 2) * (this.options.height - 2);
		},

		// 获取中奖号，用户可重写该事件，默认随机数字
		aim: function () {
			if (this.options.aim) {
				this.options.aim.call(this);
			} else {
				this.options.target = parseInt(parseInt(Math.random() * 10) * this._count() / 10);
			}
		}
		
	};
	
	
		// 显示页面和隐藏页面
	    function show(){
	    	$(_pageId +" #dialog").show();
	    	$(_pageId +" #box").show();
		}
		// 隐藏介绍页面
		function hide(){
			$(_pageId +" #dialog").hide();
			$(_pageId +" #box").hide();
		}
		
		// 隐藏和显示中奖页面
		function showD(){
			$(_pageId +" #dialog").show();
			$(_pageId +" #wining").show();
			$(_pageId +" #lotteryNum").text(lotteryNum);
		}
		function hideD(){
			$(_pageId +" #dialog").hide();
			$(_pageId +" #wining").hide();
		}
		
		// 未中奖  隐藏和显示中奖页面
		function showN(){
			$(_pageId + " #dialog").show();
			$(_pageId +" #NoWining").show();
			$(_pageId +" #NlotteryNum").text(lotteryNum);
		}
		
		function hideN(){
			$(_pageId +" #dialog").hide();
			$(_pageId +" #NoWining").hide();
		}
		
		// 已经抽过
		function havingLottery(name){
			$(_pageId +" #lotterys").addClass("already_draw_list");  // 追加样式
			$(_pageId +" #award").find('span').html(name);
		}
	
	/**
	 * 清理页面
	 */
	function cleanPage(){
		lottery._destroy(); 
	}
	/**
	 * 销毁
	 * */
	function destroy(){
		service.destroy();//销毁服务
		cleanPage();
	}

	var activity = {
		"init" : init,
		"bindPageEvent" : bindPageEvent,
		"destroy" : destroy
		
	};
	
	module.exports = activity;
});