// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var openid = getApp().globalData.openid
    console.log("[user]:info,openid=" + openid)
    var that = this;
    console.log(that)
    wx.request({
      url: "http://localhost:8888/phoneNum/" + openid,
      success: function (res) {
        var user = res.data;
        console.log("[user]:当前用户的信息为:", user);
        if (user) {
          var phoneNum = user.phoneNum;
          var status = user.status;
          getApp().globalData.phoneNum = phoneNum;
          getApp().globalData.status = status;
          getApp().globalData.user = user;
          that.setData({
            user: user
          })
          //把用户的openid保存到本地
          wx.setStorageSync('phoneNum', phoneNum);
          wx.setStorageSync('status', status);
        }
      }
    });
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
  gotoIndex: function(e){
    wx.navigateTo({
      url: '../index/index',
    })
  }
})
