/*创建时间hSea 2015-10-30 13:54:14 PM */
define(function(require,exports,module){function a(a){var b;try{if(a=a||{},window.iBrowser.android)b=window.external.callMessage(JSON.stringify(a)),"string"==typeof b&&(b=JSON.parse(b));else if(window.iBrowser.ios)try{var c=new XMLHttpRequest;c.open("GET",window.location.protocol+"//"+window.location.host+"//js-invoke://external:callMessage:"+encodeURIComponent(JSON.stringify(a)),!1),c.send(""),b=JSON.parse(c.responseText)}catch(e){}}catch(e){d.iAlert("H5调用原生external.callMessage方法出错："+e.message)}return b?b:{}}function b(a,b){var c;try{b=b||{};var e=$.extend({},b);if("undefined"==typeof b.error_no&&(b.error_no="0",b.error_info=""),"undefined"==typeof b.results&&(b.results=[e]),b.flowNo=a,window.iBrowser.android)c=window.external.callback(JSON.stringify(b)),"string"==typeof c&&(c=JSON.parse(c));else if(window.iBrowser.ios)try{var f=new XMLHttpRequest;f.open("GET",window.location.protocol+"//"+window.location.host+"//js-invoke://external:callback:"+encodeURIComponent(JSON.stringify(b)),!1),f.send(""),c=JSON.parse(f.responseText)}catch(g){}}catch(g){d.iAlert("H5调用原生external.callback方法出错："+g.message)}return c?c:{}}var c=require("gconfig"),d=(c.global,require("appUtils"),require("layerUtils"));window.callMessage=function(a){var b=null,d=null;a=a||{};try{b="function"+a.funcNo,require.async(c.projPath+"shellFunction/msgFunction",function(module){d=module,d[b]&&d[b](a)})}catch(e){}},module.exports={callMessage:a,callNativeByFlowNo:b}});
/*创建时间 2015-10-30 13:54:14 PM */