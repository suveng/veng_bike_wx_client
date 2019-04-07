// pages/reservation/reservation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  formSubmit: function(e) {
    console.log(e)
    var that = this;
    var latitude = e.detail.value.latitude;
    var longitude = e.detail.value.longitude;
    console.log(latitude+"--"+longitude);
    if(latitude!=''&&longitude!=''){
      that.reservate();
    }else{
      wx.showToast({
        title: '请填写完整的经度和纬度',
        icon: 'none',
        duration: 2000
      })
    }
  },
  getLocation: function(e){
    this.setData({
      longitude: getApp().globalData.log,
      latitude: getApp().globalData.lat,
    })
    // console.log(this.data.longitude)
  },
  reservate: function(e){
    wx.request({
      url: "http://localhost:8888/vehicle/reservate",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        userId: getApp().globalData.openid,
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if(res.data.code!=20000){
          wx.showToast({
            title: '预约失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.navigateTo({
            url: '../index/index'
          })
        }
      }
    })
  }
})