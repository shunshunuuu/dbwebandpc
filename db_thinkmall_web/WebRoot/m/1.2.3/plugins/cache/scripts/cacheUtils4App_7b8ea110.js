/*创建时间hSea 2016-04-07 20:06:24 PM */
define('1.2.3/plugins/cache/scripts/cacheUtils4App_7b8ea110', function(require,exports,module){function a(a,b,c,d){var e={key:a,value:b,time:c};switch(d){case"app_session":f.function50040(e);break;case"app_local":f.function50042(e)}}function b(a,b){switch(b){case"app_session":f.function50040({key:a,value:"",time:.01});break;case"app_local":f.function50042({key:a,value:"",time:.01})}}function c(a,b){var c=null;switch(b){case"app_session":c=f.function50041({key:a});break;case"app_local":c=f.function50043({key:a})}return c&&c.error_no>0?c.results&&c.results[0]&&(c=c.results[0].value):c&&e.iAlert(c.error_info),c}var d=require("external"),e=require("layerUtils"),f=(require("gconfig"),{function50040:function(a){g("50040",a)},function50041:function(a){g("50041",a)},function50042:function(a){g("50042",a)},function50043:function(a){g("50043",a)}}),g=function(a,b){b.funcNo=a,d.callMessage(b)},h={setItem:a,removeItem:b,getItem:c};module.exports=h});
/*创建时间 2016-04-07 20:06:24 PM */