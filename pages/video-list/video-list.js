// pages/video-list/video-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_id:'',//当前播放视频id
    videoList:[
      {id:"1","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"2","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"3","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"4","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"5","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"6","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"7","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"8","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"},
      {id:"9","videoUrl":"https://www.runoob.com/try/demo_source/movie.mp4","poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"}
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //视频列表点击事件
  videoPlay:function(e){
    console.log(e)
    var id= e.currentTarget.dataset.index
    var currentId=e.currentTarget.id
    //没有播放时播放视频
    if(!this.data.current_id){
      this.setData({
        current_id: currentId
      })
      var videoContext = wx.createVideoContext(id)
      videoContext.play()
      
    }else{//有播放时先将prev暂停，再播放当前点击的current
      if(this.data.current_id != currentId){
        var preVideoID='videoId'+this.data.current_id
        var videoContextPrev = wx.createVideoContext(preVideoID)
        videoContextPrev.pause()
      }
      this.setData({
        current_id: currentId
      })
      var videoContext = wx.createVideoContext(id)
      videoContext.play()
    }
  },
  //点击下载视频并保存到
  toUploadVideo(e){
    console.log(wx.env)
    //wx.env.USER_DATA_PATH:微信小程序提供的本地用户文件目录
    wx.showLoading({
      title: '正在下载，请稍后',
      mask: true
    })
    var url = e.currentTarget.dataset.url
    let fileName = new Date().valueOf()
     //1.下载文件资源到本地
    wx.downloadFile({
      url: url,//下载资源的url
      filePath:wx.env.USER_DATA_PATH+'/'+fileName+'.mp4',//指定文件下载后存储的路径（本地路径）(filePath放开手机没问题，开发者工具报超限错误)
      name:'file',
      // header: {}, // 设置请求的 header
      // formData: {}, // HTTP 请求中其他额外的 form data
      success: function(res){
        console.log('downloadFile',res)
        wx.hideLoading()
        // success
        //2.保存视频到系统相册。支持mp4视频格式
        wx.saveVideoToPhotosAlbum({
          filePath: res.filePath,//视频文件路径，可以是临时文件路径也可以是永久文件路径（本地路径）
          success :function(ress) {
            wx.showToast({
              title: '下载成功',
              icon: 'success'
            })
            //删除临时文件
            var fileManager = wx.getFileSystemManager();//全局唯一的文件管理器
            fileManager.unlink({//删除
              filePath: wx.env.USER_DATA_PATH+'/'+fileName+'.mp4',
              success: function(resf) {
                console.log('unlink',resf)
              }
            })
          },
          fail (ress) {
            console.log('保存视频失败',ress)
            //未授权
            if(ress.errMsg == 'saveVideoToPhotosAlbum:fail auth deny'){
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: function(c) {
                  //调起客户端小程序设置界面，返回用户设置的操作结果。
                  wx.openSetting({
                    success: function(settingdata) {
                      if(settingdata.authSetting['scope.writePhotosAlbum']){
                        wx.showModal({
                          title: "提示",
                          content: "获取权限成功，再次点击下载即可保存",
                          showCancel: false
                        })
                      }else{
                        wx.showModal({
                          title: "提示",
                          content: "获取权限失败，将无法保存到相册哦",
                          showCancel: false
                        })
                      }
                    }
                  })
                }
              })
            }
          },
        })
      },
      fail: function(res) {
        // fail
        wx.hideLoading()
        console.log('下载失败',res)
        if(res.errMsg.indexOf("the maximum size of the file storage limit is exceeded") >= 0){
          // 本地文件存储的大小限制为 10M
          wx.showModal({
            title: "提示",
            content: "下载失败,失败原因:超出文件存储限制的最大大小",
            showCancel: false
          })
        }
      }
    })
  },
  //获取该小程序下已保存的本地缓存文件列表  并 删除
  handleSavedFileList(){
    //1.获取该小程序下已保存的本地缓存文件列表(小程序本地存储的文件列表)
    wx.getSavedFileList({
      success: function(res){
        console.log("getSavedFileList",res)
        //遍历小程序本地存储的文件列表
        res.fileList.forEach((val,key) =>{
          //2.删除存储的垃圾数据
          wx.removeSavedFile({
            filePath: val.filePath
          })
        })
      }
    })
  }
})
