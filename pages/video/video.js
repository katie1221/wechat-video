// pages/video/video.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl:"",
    poster:"",
    clickFlag:true //防重复点击 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 拍摄或选择视频并上传服务器
   */
  chooseVideo: function () {
    console.log("chooseVideo")
    this.setData({clickFlag: false})
 
    let that = this
    //1.拍摄视频或从手机相册中选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
      // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
      camera: 'back',//默认拉起的是前置或者后置摄像头，默认back
      compressed: true,//是否压缩所选择的视频文件
      success: function(res){
        //console.log(res)
        let tempFilePath = res.tempFilePath//选择定视频的临时文件路径（本地路径）
        let duration = res.duration //选定视频的时间长度
        let size = parseFloat(res.size/1024/1024).toFixed(1) //选定视频的数据量大小
        // let height = res.height //返回选定视频的高度
        // let width = res.width //返回选中视频的宽度
        that.data.duration = duration
        if(parseFloat(size) > 100){
          that.setData({
            clickFlag: true,
            duration: ''
          })
          let beyondSize = parseFloat(size) - 100
          wx.showToast({
            title: '上传的视频大小超限，超出'+beyondSize+'MB,请重新上传',
            //image: '',//自定义图标的本地路径，image的优先级高于icon
            icon:'none'
          })
        }else{
          //2.本地视频资源上传到服务器
          that.uploadFile(tempFilePath)
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 将本地资源上传到服务器
   * 
   */
  uploadFile:function(tempFilePath){
    let that = this
    let third_session = wx.getStorageSync('third_session')
    wx.showLoading({
      title: '上传进度：0%',
      mask: true //是否显示透明蒙层，防止触摸穿透
    })
    const uploadTask = wx.uploadFile({
      url: 'http://192.168.0.77:8088/upload/uploadVideo',//开发者服务器地址
      filePath:tempFilePath,//要上传文件资源的路径（本地路径）
      name:'file',//文件对应key,开发者在服务端可以通过这个 key 获取文件的二进制内容
      // header: {}, // 设置请求的 header
      formData: {
        third_session: third_session
      }, // HTTP 请求中其他额外的 form data
      success: function(res){
        console.log("uploadFile",res)
        // success
        let data = JSON.parse(res.data)
        wx.hideLoading()
        if(data.returnCode == 200){
          that.setData({
            videoUrl: data.videoUrl,
            poster: data.imgUrl,
            duration: that.data.duration,
            clickFlag:true
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
        }else{
          that.setData({
            videoUrl: '',
            poster: '',
            duration: '',
            clickFlag:true
          })
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
        }
       
      },
      fail: function() {
        // fail
        wx.hideLoading()
        this.setData({
          videoUrl: '',
          poster: '',
          duration: '',
          clickFlag:true
        })
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    })
    //监听上传进度变化事件
    uploadTask.onProgressUpdate((res) =>{
      wx.showLoading({
        title: '上传进度：'+res.progress+'%',
        mask: true //是否显示透明蒙层，防止触摸穿透
      })
      console.log("上传进度",res.progress)
      console.log("已经上传的数据长度，单位 Bytes:",res.totalBytesSent)
      console.log("预期需要上传的数据总长度，单位 Bytes:",res.totalBytesExpectedToSend)
    })
  },
  //保存数据库
  saveVideo(){

  }
})