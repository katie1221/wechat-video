// pages/video-function/video-function.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //视频上传
  toVideoUpload(){
    wx.navigateTo({
			url: '/pages/video/video'
		})
  },
  //视频列表
  toVideoList(){
		wx.navigateTo({
			url: '/pages/video-list/video-list'
		})
	 },
   //视频详情
   toVideoDetail(){
     wx.navigateTo({
       url: '/pages/video-detail/video-detail'
     })
    },
})