/**
 * 
 * @authors sruby
 * @date 2016-09-24
 */
define(function(require, exports, module) {
	var webuploaderutil = {};
	// Web Uploader实例
     var uploader;
     var appUtils = require("appUtils"); // 核心工具类
     var global = require("gconfig").global; // 全局配置对象
     var layerUtils = require("layerUtils"); // 弹出层工具类
	//带回调
	webuploaderutil.uploadPicByResp = function (uploadDiv, imgEle, success, error) {
	  var pageId = "#tucao_goTc ";
	  //先删除
	  $(pageId + ' #uploader-demo').remove();
	  
	  var html = '<div id="uploader-demo" style="display:none;">'
	    + '<div id="fileList" class="uploader-list"></div>'
	    + '<div id="filePicker">选择图片</div>'
	    + '</div>';
	  $(pageId).append(html);
	  
	  require("1.2.3/plugins/webuploder/webuploader.html5only.js");
      appUtils.loadCss("../1.2.3/plugins/webuploder/webuploader.css");
    
    //点击上传头像按钮
	  appUtils.bindEvent($(pageId + " #" + uploadDiv),function(e){
      $(pageId + " .webuploader-element-invisible").parent().click();
      $(pageId + " .webuploader-element-invisible").next().click();
    });

    $list = $(pageId + '#fileList'),
    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,
    thumbnailWidth = 100 * ratio, thumbnailHeight = 100 * ratio,

    // 初始化Web Uploader
    uploader = WebUploader.create({
      // 自动上传。
      auto : true,
      // 文件接收服务端。
      server : global.domain+'/servlet/UploadImage?function=UploadImage',
      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick : pageId + '#filePicker',
      // 只允许选择文件，可选。
      accept : {
        title : 'Images',
        extensions : 'gif,jpg,jpeg,bmp,png',
        mimeTypes : 'image/*'
      }
    });

//    // 当有文件添加进来的时候
//    uploader.on('fileQueued', function(file) {
//      // var $li = $('<div id="' + file.id + '" class="file-item thumbnail">'
//      //    + '<img>' + '<div class="info">' + file.name + '</div>'
//      //    + '</div>'), $img = $li.find('img');
//
//      // $list.append($li);
//
//      // 创建缩略图
//      if (imgEle) {
//        uploader.makeThumb(file, function(error, src) {
//          if (error) {
//            $(pageId + "#" + imgEle).replaceWith('<span>不能预览</span>');
//            return;
//          }
//
//          $(pageId + "#" + imgEle).attr('src', src);
//        }, thumbnailWidth, thumbnailHeight);
//      }
//     
//    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function(file, percentage) {
      layerUtils.iLoading(true);	
      var $li = $(pageId + '#' + file.id), $percent = $li.find('.progress span');

      // 避免重复创建
      if (!$percent.length) {
        $percent = $('<p class="progress"><span></span></p>').appendTo($li)
            .find('span');
      }

      $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function(file, response) {
      $(pageId + '#' + file.id).addClass('upload-state-done');
      //重新初始化
      webuploaderutil.uploadPicByResp(uploadDiv, imgEle, success, error);
      
      success(response);
    });

    // 文件上传失败，现实上传出错。
    uploader.on('uploadError', function(file) {
      var $li = $(pageId + '#' + file.id), $error = $li.find('div.error');

      // 避免重复创建
      if (!$error.length) {
        $error = $('<div class="error"></div>').appendTo($li);
      }

      $error.text('上传失败');
      
      error();
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function(file) {
      $(pageId + '#' + file.id).find('.progress').remove();
    });
  };
	
	function bindGlobalEvent() {
	};

	function destroy() {}

	// 暴露对外的接口
	module.exports = webuploaderutil;
});
