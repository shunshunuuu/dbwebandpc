/*创建时间hSea 2016-04-07 20:06:24 PM */
define('1.2.3/plugins/keypanel/scripts/keyPanel_85bb235b', function(require,exports,module){function a(){return t=Object.create({init:b,close:j,get version(){return"1.0.2"},get updateDate(){return"2015-10-13 15:46:40"}})}function b(a,b,f,g){l();var h=function(){t.keyPanelType=b,t.config=g||{},t.$input=$(a),t.$inputEM=t.$input.find("em"),t.inputPlaceholder=t.$input.attr("data-placeholder")||t.$input.attr("placeholder")||"",t.$input.maxlength=t.$input.attr("maxlength")||1e5,t.isPassword="undefined"==typeof f?!1:f,d(),"function"==typeof t.config.beforeInitFunc&&t.config.beforeInitFunc(),e(),"function"==typeof t.config.afterInitFunc&&t.config.afterInitFunc()};c(g.skinName,h)}function c(a,b){var c=seajs.resolve("keyPanel");switch(c=c.substring(0,c.lastIndexOf("/")),c=c.substring(0,c.lastIndexOf("/")),a=a||"default"){case"default":c+="/css/keypanel_keyword_default.css";break;case"white":c+="/css/keypanel_keyword_white.css";break;case"black":c+="/css/keypanel_keyword_black.css"}$("head>link[href*='plugins/keypanel/css/keypanel_keyword']").each(function(){-1===$(this).attr("href").indexOf(c)&&$(this).remove()}),0===$("head>link[href*='plugins/keypanel/css/keypanel_keyword']").length?m.loadCss(c,b):b&&b()}function d(){switch(t.keyPanelType=t.keyPanelType||"1",Number(t.keyPanelType)){case 1:t.keyPanelHtml=n.createKeyPanelHtml(),t.keyPanelId=n.keyPanelId;break;case 2:t.keyPanelHtml=o.createKeyPanelHtml(),t.keyPanelId=o.keyPanelId;break;case 3:t.keyPanelHtml=p.createKeyPanelHtml(),t.keyPanelId=p.keyPanelId;break;case 4:t.keyPanelHtml=q.createKeyPanelHtml(),t.keyPanelId=q.keyPanelId;break;case 5:t.keyPanelHtml=r.createKeyPanelHtml(),t.keyPanelId=r.keyPanelId}}function e(){t.$keyPanel=$("#"+t.keyPanelId),"DIV"==t.$input[0].tagName&&0==t.$inputEM.length?(t.$input.html("<em></em>"),t.$inputEM=t.$input.find("em")):"DIV"==t.$input[0].tagName&&1==t.$inputEM.length&&t.$inputEM.html()==t.inputPlaceholder&&(t.$inputEM.html(""),t.$input.attr("value","")),t.$keyPanel.length<=0&&(t.$keyPanel=$(t.keyPanelHtml),$("body").append(t.$keyPanel)),t.$keyPanel.css("display","block"),setTimeout(k,20),t.$input.removeAttr("data-placeholder").attr("placeholder",t.inputPlaceholder),t.$input.addClass("active"),t.$keyPanel.siblings(".keyword_table").css("display","none"),f()}function f(){var a=iBrowser.pc?"mousedown":"touchstart",b=iBrowser.pc?"mouseup":"touchend";m.bindEvent(t.$keyPanel,function(a){a.preventDefault(),a.stopPropagation()},"touchmove"),m.bindEvent(t.$keyPanel.find("a"),function(a){$(this).hasClass("capital")||$(this).addClass("active"),a.stopPropagation(),a.preventDefault()},a),m.bindEvent(t.$keyPanel.find("a"),function(a){$(this).removeClass("active"),a.stopPropagation()},"touchcancel"),m.bindEvent(t.$keyPanel.find("a"),function(a){$(this).hasClass("capital")||$(this).removeClass("active"),g($(this)),a.stopPropagation()},b)}function g(a){var b=a.html(),c=null,d=null;if(t.$inputEM.length<1&&(t.$inputEM=$("<em></em>"),t.$input.attr("value","")),d=t.$inputEM.html(),c=null===t.$input.attr("value")||"undefined"==typeof t.$input.attr("value")?"":t.$input.attr("value"),a.hasClass("hide"))j();else if(a.hasClass("space"))d+=b,c+=" ",t.$inputEM.html(d),t.$input.attr("value",c),t.isPassword&&t.$inputEM.html(d.replace(/(&nbsp;)$/,"*")),c.length>t.$input.maxlength&&i(d,c),s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"space",curValue:" "},t.$input[0].dispatchEvent(s);else if(a.hasClass("del"))i(d,c),s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"del"},t.$input[0].dispatchEvent(s);else if(a.hasClass("max")||a.hasClass("half")){var e=t.$input.attr("max-value");for(e=null===e||"undefined"==typeof e?100:+e,b=a.hasClass("max")?e:e/2,t.$inputEM.html(b),t.$input.attr("value",b),t.isPassword&&t.$inputEM.html(t.$inputEM.html().replace(/[a-zA-Z0-9\.]/g,"*"));c.length>t.$input.maxlength;)i(d,c),c=t.$input.attr("value"),d=t.$inputEM.html();s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"normal",curValue:b},t.$input[0].dispatchEvent(s)}else if(a.hasClass("n123"))"true"===t.$input.attr("is-stock-input")?t.init(t.$input[0],5,t.isPassword,t.config):t.init(t.$input[0],2,t.isPassword,t.config);else if(a.hasClass("abc"))t.init(t.$input[0],4,t.isPassword,t.config);else if(a.hasClass("ok"))j(),"function"==typeof t.config.okFunc&&t.config.okFunc();else if(a.hasClass("clear"))t.$inputEM.html(""),t.$input.attr("value",""),s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"clear",curValue:""},t.$input[0].dispatchEvent(s);else if(a.hasClass("capital"))a.toggleClass("active"),h(a);else if(/^\d{3}$/g.test(b)&&3===b.length){for(d+=b,c+=b,t.$inputEM.html(d),t.$input.attr("value",c),t.isPassword&&t.$inputEM.html(d.replace(/\d$/,"*"));c.length>t.$input.maxlength;)i(d,c),c=t.$input.attr("value"),d=t.$inputEM.html();s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"stock",curValue:b},t.$input[0].dispatchEvent(s)}else b="·"===b?".":b,d+=b,c+=b,t.$inputEM.html(d),t.$input.attr("value",c),t.isPassword&&t.$inputEM.html(d.replace(/[a-zA-Z0-9\.]/,"*")),(c.length>t.$input.maxlength||"."===c||c.indexOf(".")!=c.lastIndexOf("."))&&i(d,c),s&&(s=null),s=document.createEvent("Event"),s.initEvent("input",!0,!0),s.detail={optType:"normal",curValue:b},t.$input[0].dispatchEvent(s)}function h(a){var b=t.$keyPanel.find("a");b.each(function(){var b=$(this).html();1===b.length&&/[a-zA-Z]/.test(b)&&(b=a.hasClass("active")?b.toUpperCase():b.toLowerCase(),$(this).html(b).attr("key",b))})}function i(a,b){a.length>0&&(a=/.*&nbsp;+$/.test(a)?a.slice(0,-6):a.slice(0,-1),b=b.slice(0,-1),t.$inputEM.html(a),t.$input.attr("value",b))}function j(){t.$keyPanel&&t.$keyPanel.length>0&&(l(),"function"==typeof t.config.beforeCloseFunc&&t.config.beforeCloseFunc(),t.config.isSaveDom||"undefined"==typeof t.config.isSaveDom?t.$keyPanel.css("display","none"):t.$keyPanel.remove(),t.$keyPanel=null,"function"==typeof t.config.afterCloseFunc&&t.config.afterCloseFunc())}function k(){var a=t.$input.parents('[key-panel-main="true"]');if(a&&a.length>0){var b=t.$input.offset().top,c=t.$input.height(),d=t.$keyPanel.offset().top,e=b+c+20-d,f=a.css("margin-top").slice(0,-2);t.inputMainExtraOffset=e,t.$inputMain=a,e>0&&t.$inputMain.animate({marginTop:+f-t.inputMainExtraOffset+"px"},200,"linear")}}function l(){if(t&&t.$input&&t.$input.length>0){var a=t.$input.attr("value");if("DIV"!==t.$input[0].tagName||""!==a&&null!==a&&"undefined"!=typeof a||(t.$input.attr("data-placeholder",t.$input.attr("placeholder")),t.$inputEM.html(t.$input.attr("placeholder"))),t.$input.removeClass("active"),t.$inputMain&&t.$inputMain.length>0&&t.inputMainExtraOffset>0){var b=t.$inputMain.css("margin-top").slice(0,-2);t.$inputMain.css("margin-top",+b+t.inputMainExtraOffset+"px"),t.$inputMain=null,t.inputMainExtraOffset=0}}}var m=require("appUtils"),n=(require("gconfig"),require("keyType1")),o=require("keyType2"),p=require("keyType3"),q=require("keyType4"),r=require("keyType5"),s=null,t=null;module.exports=a});
/*创建时间 2016-04-07 20:06:24 PM */