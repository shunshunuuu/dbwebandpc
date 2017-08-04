define(function(require, exports, module) {
	require("{platRoot}/plugins/keyboard/css/sk.css");
	var isIE = /msie/i.test(navigator.userAgent);
	var isFF = /firefox/i.test(navigator.userAgent);
	var c = document.createElement("div");
	c.style.display = "none";
	document.getElementsByTagName("body").item(0).appendChild(c);
	var SK = function(length){
		var This = this;
		This.inputLength = length;
		if(isFF){
			//在FF下添加innerText属性
			 HTMLElement.prototype.__defineGetter__( "innerText",
				 function(){
					 return this.textContent;
				 }
			 );
			 HTMLElement.prototype.__defineSetter__( "innerText",
				 function(sText){
					 this.textContent=sText;
				 }
			);
			Event.prototype.__defineSetter__("returnValue",
				function(b){//  
					if(!b)this.preventDefault(); 
					return b; 
				}
			); 
			
			//设置或者检索当前事件句柄的层次冒泡 
			Event.prototype.__defineSetter__("cancelBubble",
				function(b){
					if(b)this.stopPropagation(); 
					return b; 
				}
			); 
			Event.prototype.__defineGetter__("srcElement",
				function(){ 
					var node = this.target; 
					while(node && node.nodeType != 1)node=node.parentNode;
					return node; 
				}
			); 
		 }
		if(isIE){
			c.className = "sk_div";
		}else{
			c.setAttribute("class", "sk_div");
		}
	    /*
		var c = document.createElement("div");
		c.style.display = "none";
		if(isIE) c.className = "sk_div";
		if(isFF) c.setAttribute("class", "sk_div");
		
		//document.body.appendChild(c);
		//document.appendChild(c);
		*/
		var currentField = null;
		var disableKB = true;
		var inputOnce = false;
		var inputValue = "";
		var sltArray = [];
		var isDisableSelect = false;

		function ad(str,evt){ 
			var e = evt || window.event;
			e.cancelBubble = true;
			if(str == "删"){
				inputValue = inputValue.substring(0,inputValue.length - 1);
				currentField.value = currentField.value.substring(0,currentField.value.length - 1);
			}else if(str == "关"){
				inputOnce = false;
				c.style.display = "none";
				disableSelect(false);
				currentField.blur();
				return false;
			}else if(str == "清"){
				inputValue = "";
				currentField.value = "";
			}else {
				if(This.inputLength){
					if(inputValue.length >= This.inputLength){
						return false;
					}
				}
				inputValue += str;
			    currentField.value += "*"; 
			}
			if(isIE){
				var r = currentField.createTextRange();       
				r.collapse(false);       
				r.select();       
			}else{
				currentField.focus();
			}
	  } ;

		function disableSelect(flag){
			if(!isDisableSelect) return false;
			if(sltArray.length == 0)
				sltArray = document.getElementsByTagName("SELECT");
			for(var i = 0,len = sltArray.length;i < len;i++){
				//sltArray.item(i).disabled = flag;
				sltArray.item(i).style.visibility = flag?"hidden":"visible";
			}
		}

		function create(start,end)
		{
			var arr=new Array();
			var arr2 = new Array();
			var nums="";
			for(var i=start,j=0;i<=end;i++,j++)
			{
				if(start==97)
					arr[j] = String.fromCharCode(i);
				else
					arr[j]=i;
			}

			while(j--)
			{
				var indexN=Math.floor(Math.random()*arr.length);
				arr2[j] = arr.splice(indexN,1);
			}
			return arr2;
		};

		function makeSKB(type){
			var skb = document.createElement("div");  
			var cls = "span_kb"+(disableKB?" span_kb_close":" span_kb_open");
			if(isIE){
				skb.className = cls;
			}else{
				skb.setAttribute("class", cls);
			}
			//var table = document.createElement("<table  border='0' cellpadding='1' cellspacing='2'>");
			var table = document.createElement("table");
			var _cellW;
			if(isIE){
				_cellW = "1";
			}else{
			    _cellW = "1";
			}
			table.setAttribute("cellPadding",_cellW);
			table.setAttribute("cellSpacing",_cellW);
			var n = 0;
			var nums = create(0,9);
			var letters = create(97,122);
			var fun = new Array("删","关","清");
			var arr;
			var row,col;
			switch (type)
			{
				case "NUMONLY":
					row = 3;
					col = 4;
					arr = nums.concat(fun);
					break;
							
				case "LETTERONLY":
					row = 3;
					col = 10;
					arr = letters.concat(fun);
					break;
				case "NUMANDLETTER":
					row = 4;
					col = 10;
					arr = nums.concat(letters).concat(fun);
					break;
				default:break;
			}

			for(var i=0;i<row;i++){
				var tr = table.insertRow(-1);
				for(var j=0;j<col;j++){
					var td = document.createElement("td");
					tr.appendChild(td); 
					$(td).attr("class","num");
					$(td).css("cursor","pointer");
					if(n < arr.length){
						td.innerText = arr[n];
						td.onmousedown = function(evt){
							if(isIE){
								this.setCapture();
							}else{
								window.captureEvents(Event.MOUSEUP);
								window.captureEvents(Event.MOUSEOUT);
							}
							this.style.backgroundImage = "url('/plugins/keyboard/images/login09.jpg')";
							this.style.color = "#ffffff";
						};
						td.onmouseup = function(evt){
							if(isIE){
								this.releaseCapture(); 
							}else{
								window.releaseEvents(Event.MOUSEUP);
								window.releaseEvents(Event.MOUSEOUT);
							}
							this.style.backgroundImage = "url('/plugins/keyboard/images/login09.jpg')";
							this.style.color = "#000000";
						};
						td.onmouseout = function(evt){
							if(isIE){
								this.releaseCapture(); 
							}else{
								window.releaseEvents(Event.MOUSEUP);
								window.releaseEvents(Event.MOUSEOUT);
							}
							this.style.backgroundImage = "url('/plugins/keyboard/images/login09.jpg')";
							this.style.color = "#000000";
						};
						td.onclick = function(evt){
							(window.event || evt).cancelBubble = false;
							ad(this.innerText,evt);
						};
					}else
						td.innerText = " ";
					n++;
				}
			}
			c.innerHTML = "";
			c.appendChild(skb); 
			c.appendChild(table);
			var dkb = document.createElement("div");   
			dkb.innerText = disableKB?"开启键盘输入":"关闭键盘输入";
			skb.innerText = disableKB?"禁止键盘输入":"允许键盘输入";
			$(dkb).css("cursor", "pointer");
			
			if(isIE){
				dkb.className = "span_kb button_kb";
			}else{
				dkb.setAttribute("class","span_kb button_kb");
			}
			dkb.onclick = function(evt){
				(window.event || evt).cancelBubble = true;
				if(disableKB){
					currentField.onkeyup = function(evt){
						(window.event || evt).returnValue = true;
					};
					disableKB = false;
					if(isIE){
						skb.className = "span_kb span_kb_open";
					}else{
						skb.setAttribute("class","span_kb span_kb_open");
					}
					skb.innerText = "允许键盘输入";
					this.innerText = "关闭键盘输入";
					if(isIE){
						var r = currentField.createTextRange();       
						r.collapse(false);       
						r.select();   
					}else{
						currentField.focus();
					}
				}else{
					currentField.onkeyup = function(evt){
						(window.event || evt).returnValue = true;
					};
					disableKB = true;
					skb.setAttribute("class","span_kb span_kb_close");
					skb.innerText = "禁止键盘输入";
					this.innerText = "开启键盘输入";
				}
				//window.status = skb.style.backgroundPosition;
			};
			c.appendChild(dkb);
			inputOnce = true;
		};
		
		return {
			hideKB:function(){
				c.style.display = "none";
				disableSelect(false);
				inputOnce = false;
				//window.status = this.getInput();
			},

			showKB:function(field,type,_isDisableSelect,evt){
				isDisableSelect = _isDisableSelect;
				var self = this;
				
				/*
				document.onclick=function(evt){
					var e = evt || window.event;
					if(e.srcElement.tagName != "INPUT")
						self.hideKB();
				}*/
				var fn = function(evt){
					var e = evt || window.event;
					if(e.srcElement.tagName != "INPUT")
						self.hideKB();
				};

				if (window.addEventListener) {
					document.addEventListener('click', fn, false);
				} else if (window.attachEvent){
					document.attachEvent('onclick', fn);
				}

				var type =  arguments[1] || "NUMONLY";
				if(field != currentField || !inputOnce)
					makeSKB(type);
				
				//(window.event || evt).cancelBubble = true;
				currentField = ((typeof field == 'string')?(document.getElementById(field)):field);
				
				currentField.onclick = function(){
//					if(window.getSelection) {
//				    	window.getSelection().empty();
//			        } else if(document.selection && document.selection.createRange) {
//			        	document.selection.createRange().text = "";
//			        }
					if(isIE){
						r = currentField.createTextRange();       
						r.collapse(false);       
						r.select();  
					}else{
						currentField.focus();
					}
				};
				currentField.focus();
				
				currentField.onkeypress = function(evt){
					(window.event || evt).returnValue = false;
				};
				$(currentField).bind("contextmenu",function(e){  
			         return false;  
			    });  
				currentField.oncopy = function(evt){
					return false;
				};
				currentField.oncut = function(evt){
					return false;
				};
				currentField.onpaste = function(evt){
					return false;
				};
				currentField.onselectstart = function(evt){
					return false;
				};
				currentField.onmousedown = function(evt){
					return false;
				};
				currentField.onmouseup = function(evt){
					return false;
				};
				currentField.onkeydown = function(evt){
					var e = window.event || evt;
					if(e.keyCode == 9){ //tab键
						return true;
					}
					e.returnValue = false;
					if(e.keyCode == 17){ //ctrl键
						return false;
					}
					if(type == "NUMONLY"){
						 if(!$.keyboard.isNumber(evt)){
							 return false;
						 }
					}
					var selection = "";
//				    if(window.getSelection) {
//				    	selection = window.getSelection().toString();
//			        } else if(document.selection && document.selection.createRange) {
//			        	selection = document.selection.createRange().text;
//			        }
					if(e.keyCode == 8){ //回退键
						var leng = this.value.length;
						if(selection.length > 0){
							inputValue = inputValue.substring(0 , leng - selection.length);
						}else{
							inputValue = inputValue.substring(0 , leng - 1);
						}
						this.value = "****************************".substring(0,inputValue.length);
					}else if(e.keyCode == 46){
						if(this.value == "")
							inputValue = "";
					}else{
						if(This.inputLength){
							if(this.value.length >= This.inputLength){
								return false;
							}
						}
						if(disableKB){
							return false;
						}else{
							if(e.keyCode > 95 && e.keyCode < 106){
								inputValue += String.fromCharCode(e.keyCode - 48);
							}else{
								inputValue += String.fromCharCode(e.keyCode);
							}
							this.value = "****************************".substring(0,inputValue.length);
						} 
					}
					return false;
				};

				disableSelect(true);

				var p =  currentField;
				var t = parseInt(p.offsetHeight);
				var l = $(currentField).outerWidth() + 10;
				
				while(p && p.tagName != 'BODY' && p.tagName != 'HTML'){
					t += parseInt(p.offsetTop);
					l += parseInt(p.offsetLeft);
					if (p.offsetParent) {
						p = p.offsetParent;
				    } else {
						p = null;
				    }
				}
				
				c.style.display='';
				c.style.top = (t - currentField.clientHeight * 2)+"px";
				c.style.left = l+"px";
			},
			
			
			getInput:function(){
				return inputValue;
			},
			getInputValue:function (){
				return currentField.value;
			},
			clearValue:function(){
				inputValue = "";
				if(currentField)
					currentField.value = "";
			}
		};
	};
	module.exports = SK;
});
