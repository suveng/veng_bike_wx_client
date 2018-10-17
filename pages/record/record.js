// pages/test/list.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    onBindTo: function() {
        console.log('点击了！需要怎么跳转在这里写！！！')
        wx.navigateTo({
          url: '../route/route',
        })
    }
})