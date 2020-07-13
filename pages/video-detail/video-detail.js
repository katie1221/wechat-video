// pages/video-detail/video-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_id:'',//当前播放视频id
    videoDetail:{
      id:"1",
      "videoUrl":"http://1256993030.vod2.myqcloud.com/d520582dvodtransgzp1256993030/7732bd367447398157015849771/v.f30.mp4",
      "poster":"//vodplayerinfo-10005041.file.myqcloud.com/3035579109/vod_paster_pause/paster_pause1469013308.jpg"
    },
    //弹幕列表
    danmuList:[
      {
        text: '第1s出现的红色弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第2s出现的绿色弹幕',
        color: '#00ff00',
        time: 2
      },
      
    ],
    isRandomColor: true,// 默认随机
    numberColor:"#ff0000",//默认红色
    inputValue: "",//文本框输入内容
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    if(wx.getStorageSync('color')){
      this.setData({
        numberColor: wx.getStorageSync('color')
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext("videoId")
  },
  //视频列表点击事件
  videoPlay:function(e){
    console.log(e)
    var id= e.currentTarget.dataset.index
    var currentId=e.currentTarget.id
    this.setData({
      current_id: currentId
    })
    var videoContext = wx.createVideoContext(id)
    videoContext.play()
  },
  //文本框失去焦点事件
  bindInputblur: function(e){
    // console.log(e.detail.value)
    this.data.inputValue = e.detail.value
  },
  //发送弹幕内容
  bindSendDanmu : function(e){
    //设置弹幕颜色
    var color=""
    if(this.data.isRandomColor){//随机颜色
      color = this.getRandomColor()
    }else{
      color = this.data.numberColor
    }
    //发送弹幕
    this.videoContext.sendDanmu({
      text: this.data.inputValue,
      color:color
    })
  },
  //设置随机颜色
  getRandomColor(){
    let rgb = []
    for(let i=0;i<3;++i){
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },
  //switch开关切换事件
  switchChange: function(e){
    console.log(e)
    this.data.isRandomColor = e.detail.value

  },
  //选择颜色
  selectColor:function(){
    wx.navigateTo({
      url: '/pages/select-color/select-color'
    })
  }
})