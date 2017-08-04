;(function($,window,document,undefinded){
	//定义toolCollention的构造函数
	var toolCollention = function(ele,opt){
		this.$element = ele,
		this.defaults = {
			scrollLine:1,
			scrollDirection:'up',
			scrollSpeed:500,
			scrollTimer:3000
		},
		this.options = $.extend({},this.defaults,opt);
	}
	toolCollention.prototype={
		//定义dorpList方法
		dorpList:function(){
			return this.$element.each(function(){
				var $self = $(this),
					$ul = $self.find('ul:first');
				$ul.children('li').hover(function(){
					$(this).children('ul').stop().slideToggle('normal');
				})
			})
		},
		//定义simulateFlash方法
		simulateFlash:function(){
			return this.$element.each(function(){
				var $self = $(this),
					$ul = $self.find('ul:first');
				$ul.children('li').each(function(){
					$(this).prepend('<span></span>');
					$(this).hover(function(){
						$(this).children('a').css('backgroundColor','#000').end().css('overflow','hidden');
						$(this).children('span').text($(this).children('a').text());
						$(this).children('span').css({
							'display':'block',
							'color':'#fff',
							'pointer':'cursor'
						}).stop().animate({'marginTop':-$(this).height()});
					},function(){
						$(this).children('a').css('backgroundColor','transparent');
						$(this).children('span').stop().animate({'marginTop':'0'},function(){
							$(this).parent('li').css('overflow','visible');
						});
					})
				})
			})
		},
		//定义dorpBlock方法
		dorpBlock:function(){
			return this.$element.each(function(){
				var $self = $(this),
					$ul = $self.find('ul:first');
				$ul.children('li').mouseenter(function(){
					ele = $self.find('#nav_li_'+($(this).index()+1));
					num = ele.length;
					if(num ==1){
						ele.stop().slideDown('normal').siblings('.nav_li').hide();
					}else{
						$('.nav_li').hide();
					}
				});
				$self.mouseleave(function(){
					$('.nav_li').hide();
				})
			})
		},
		//定义slideFade方法
		slideFade:function(){
			return this.$element.each(function(){
				var index = 0,
					timer = null;
				var	$bannerBox = $(this),
					$banner = $bannerBox.find('.banner'),
					$slideBtnBox = $bannerBox.find('.slide_btn');
				var len = $bannerBox.find('ul:first li').length;
				if(len > 1){
					var dot = "<div class='slide_dot'>";
					for(var i=0; i < len; i++){
						dot +='<span>'+(i+1)+'</span>';
					}
					dot += '</div>';
					$bannerBox.append(dot);
				};
				var $slideDotBox = $bannerBox.find('.slide_dot');
				$slideDotBox.children('span').first().addClass("active");
				$banner.children('li').first().fadeIn('fast');
				$slideDotBox.children('span').on('click',function(){
					index = $slideDotBox.children('span').index(this);
					showimg(index);
				});
				$bannerBox.hover(function(){
					if(timer){
						clearInterval(timer);
					};
				},
				function(){
					timer = setInterval(function (){
						index++;
						if(index==len){
							index=0;
						}
						showimg(index);
					},3000);
				}).triggerHandler("mouseleave");
				$slideBtnBox.find('.prev').click(function(){
					index--;
					if(index==-1){
						index=len-1;
					}
					showimg(index);	
				});
				$slideBtnBox.find('.next').click(function(){
					index++;
					if(index==len){
						index=0;
					}
					showimg(index);	
				});
				function showimg(index){
					$slideDotBox.children('span').eq(index).addClass("active").siblings().removeClass("active");
					$banner.children('li').eq(index).fadeIn("slow").siblings().fadeOut("slow");
				};
			})
		},
		//定义slideAnimate方法
		slideAnimate:function(){
			return this.$element.each(function(){
				var	index = 0,
					timer = null;
				var $bannerBox = $(this),
					$banner = $bannerBox.find('.banner_ul'),
					$slideBtnBox = $bannerBox.find('.slide_btn');
				var len = $bannerBox.find('ul:first li').length,
					sWidth = $bannerBox.width();//显示面积
				if(len > 1){
					var dot = "<div class='slide_dot'>";
					for(var i = 0; i < len; i++){
						dot +='<span>'+(i+1)+'</span>';
					}
					dot += '</div>';
					$bannerBox.append(dot);
				};
				var $slideDotBox = $bannerBox.find('.slide_dot');
				$slideDotBox.children('span').first().addClass("active");
				$bannerBox.find('ul:first li').css('width',sWidth);
				$banner.css('width',sWidth*len);
				$banner.wrap('<div class="banner_wrap"></div>');
				$('.banner_wrap').css({
					'position':'relative',
					'height':$banner.height(),
					'width':sWidth,
					'overflow':'hidden',
					'margin':'0 auto'
				});
				$slideDotBox.children('span').mouseover(function(){
					index = $slideDotBox.children('span').index(this);
					showimg(index);
				});
				$bannerBox.hover(function(){
					if(timer){
						clearInterval(timer);
					};
				},
				function(){
					timer = setInterval(function (){
						index++;
						if(index==len){
							index=0;
						}
						showimg(index);
					},3000);
				}).triggerHandler("mouseleave");
				$slideBtnBox.find('.prev').click(function(){
					index--;
					if(index==-1){
						index=len-1;
					}
					showimg(index);	
				});
				$slideBtnBox.find('.next').click(function(){
					index++;
					if(index==len){
						index=0;
					}
					showimg(index);	
				});
				function showimg(index){
					var nowLeft = -index*sWidth; 
					$slideDotBox.children('span').eq(index).addClass("active").siblings().removeClass("active");
					$banner.stop(true,false).animate({"left":nowLeft},300); 
				};
			})
		},
		//定义scrollVertical方法
		scrollDirection:function(){
				var _btnPrev = this.$element.next('div').find('.prev');//向后按钮
                var _btnNext = this.$element.next('div').find('.next');//向前按钮
				var timerID = null;
				var timer = this.options.scrollTimer,
					speed = this.options.scrollSpeed,
					line = this.options.scrollLine,
					direction = this.options.scrollDirection;
				var _this = this.$element.find("ul:first");
				var lineH = _this.find("li:first").height(),
					lineW = _this.find("li:first").outerWidth(),
					len = _this.find("li").length;
				if(line==0) line=1;
                var prevH = 0 - line*lineH,
					prveW = 0 - line*lineW;
				//滚动函数
				if(direction=='up'){
					var scrollPrev=function(){
						_btnPrev.unbind("click",scrollPrev);
						_this.animate({
								marginTop:prevH
						},speed,function(){
								for(i=1;i<=line;i++){
									_this.find("li:first").appendTo(_this);
								}
								_this.css({marginTop:0});
								_btnPrev.bind("click",scrollPrev); 
						});
					}
					var scrollNext=function(){
						_btnNext.unbind("click",scrollNext);
						for(i=1;i<=line;i++){
							_this.find("li:last").show().prependTo(_this);
						}
						_this.css({marginTop:prevH});
						_this.animate({
							marginTop:0
						},speed,function(){
							_btnNext.bind("click",scrollNext);
						});
					}
				}else if(direction=='left'){
					_this.css('width',lineW*len);
					var scrollPrev=function(){
						_btnPrev.unbind("click",scrollPrev);
						_this.animate({
								marginLeft:prveW
						},speed,function(){
								for(i=1;i<=line;i++){
									_this.find("li:first").appendTo(_this);
								}
								_this.css({marginLeft:0});
								_btnPrev.bind("click",scrollPrev); 
						});
					}
					var scrollNext=function(){
						_btnNext.unbind("click",scrollNext);
						for(i=1;i<=line;i++){
							_this.find("li:last").show().prependTo(_this);
						}
						_this.css({marginLeft:prveW});
						_this.animate({
							marginLeft:0
						},speed,function(){
							_btnNext.bind("click",scrollNext);
						});
					}
				}else{
					alert('no exist this scrollDirection!');
				}
				var autoPlay = function(){
                        if(timer)timerID = window.setInterval(scrollPrev,timer);
                };
                var autoStop = function(){
                        if(timer)window.clearInterval(timerID);
                };
                _this.hover(autoStop,autoPlay).triggerHandler('mouseleave');
                _btnPrev.click(scrollPrev).hover(autoStop,autoPlay);
                _btnNext.click(scrollNext).hover(autoStop,autoPlay);
		},
		//点击展开收缩
		foldMenu:function(){
			return this.$element.each(function(){
				var $self = $(this),
					$ul = $self.find('ul:first');
				$ul.children('li').each(function(){
					$(this).children(':first-child').on('click',function(){
						if($(this).next().is(':hidden')){
							$(this).addClass('on').next().stop().slideDown('normal')
							.end().parent().siblings().children(':first-child').removeClass('on').next().slideUp('normal');
						}else{
							$(this).next().stop().slideUp('normal').end().removeClass('on');
						}
					})
				})
			})
		},
		//模拟select下拉菜单
		simulateSelect:function(){
			return this.$element.each(function(){
				var $self = $(this);
				$self.children('p').on('click',function(event){
					event.stopPropagation();
					if($(this).next('ul').is(':hidden')){
						$(this).next('ul').stop(true).slideDown();
					}else{
						$(this).next('ul').stop(true).slideUp();
					}
				});
				$self.children('ul').find('a').on('click',function(event){
					event.stopPropagation();
					$(this).parents('ul').prev('p').children('strong').text($(this).text());
					$(this).parents('ul').stop(true).slideUp();
				})
				$(document).on('click',function(){
					$self.find('ul').stop(true).slideUp();
				});
				
			})
		},
		//返回顶部
		backTotop:function(){
			return this.$element.each(function(){
				var $self = $(this);
				$(window).scroll(function(){
					if($(window).scrollTop()>500){
						$self.fadeIn(500);
					}else{
						$self.stop().fadeOut(500);
					}
				});
				$self.on('click',function(){
					$('body,html').animate({scrollTop:0},800);
				})
			})
		},
		//Tab切换
		Tab:function(){
			return this.$element.each(function(){
				var $self = $(this),
					$btn = $self.children('.tab_tit').find(' span'),
					$show = $self.children('.tab_body').find('.tab_children');
					$btn.eq(0).addClass('on');
					$show.eq(0).show();
				$btn.each(function(i){
					$(this).click(function(){
						$(this).addClass('on').siblings().removeClass('on');
						$show.eq(i).stop().show().siblings().hide();
					})
				})
				
			})
		}
	}
	//在插件中使用toolCollention对象
	//下拉菜单
	$.fn.dorplist=function(){
		var nav1 = new toolCollention(this);
		return nav1.dorpList();
	};
	//模仿flash菜单
	$.fn.simulateflash=function(){
		var nav2 = new toolCollention(this);
		return nav2.simulateFlash();
	};
	//下拉展示
	$.fn.dorpblock=function(){
		var nav3 = new toolCollention(this);
		return nav3.dorpBlock();
	};
	//淡入淡出焦点图
	$.fn.slidefade=function(){
		var slidebanner = new toolCollention(this);
		return slidebanner.slideFade();
	};
	//向右移动焦点图
	$.fn.slideanimate=function(){
		var slidebanner1 = new toolCollention(this);
		return slidebanner1.slideAnimate();
	};
	//滚动新闻或者产品
	$.fn.scrolldirection=function(options){
		var scrollvertical = new toolCollention(this,options);
		return scrollvertical.scrollDirection();
	};
	//点击展开收缩
	$.fn.foldmenu=function(){
		var fold = new toolCollention(this);
		return fold.foldMenu();
	};
	//模拟select下拉菜单
	$.fn.simulateselect=function(){
		var selectList = new toolCollention(this);
		return selectList.simulateSelect();
	};
	//返回顶部
	$.fn.backtotop=function(){
		var top = new toolCollention(this);
		return top.backTotop();
	};
	//Tab切换
	$.fn.tab=function(){
		var tab1 = new toolCollention(this);
		return tab1.Tab();
	};
	
})(jQuery,window,document);



