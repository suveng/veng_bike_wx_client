//app.js
App({
  onLaunch: function() {

    // 登录,然后获取到用户的唯一身份ID，用于以后记log
    wx.login({
      success: res => {
        //根据你的微信小程序的密钥到后台获取ID
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          var appid = "wxe70839e213bc86f3";
          var secret = "0917c30f060fac402f65213ef5aeaa11";
          var code = res.code;
          //发起网络请求
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            success: function(r) {
              //获取到每个用户的对立id
              console.log("openid:  "+r.data.openid);
              var openid=r.data.openid;
              getApp().globalData.openid=openid
              console.log("getapp :: "+getApp().globalData.openid);
              //把openid保存到本地
              wx.setStorageSync('openid', r.data.openid)
              //根据openid拿用户信息
              getInfoByOpenid(openid);
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },

  globalData: {
    bikeNo: 1000000010,
    rentalNo:1000000,
    openid: "",
    status: 0,
    balance: 0, //余额
    userInfo: null,
    log:20,
    lat:20,
    phoneNum:0,
    user: null,
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          console.log("userinfo"+res)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
})

//根据openid获取用户的信息
function getInfoByOpenid(openid) {
  wx.request({
    url: "http://localhost:8888/phoneNum/" + openid,
    success: function(res) {
      var user = res.data;
      console.log("[user]:当前用户的信息为:",user);
      if (user) {
        var phoneNum = user.phoneNum;
        var status = user.status;
        getApp().globalData.phoneNum = phoneNum;
        getApp().globalData.status = status;
        function getInfoByOpenid(openid) {
  wx.request({
    url: "http://localhost:8888/phoneNum/" + openid,
    success: function(res) {
      var user = res.data;
      console.log("[user]:当前用户的信息为:",user);
      if (user) {
        var phoneNum = user.phoneNum;
        var status = user.status;
        getApp().globalData.phoneNum = phoneNum;
        getApp().globalData.status = status;
        getApp().globalData.user = user;
        //把用户的openid保存到本地
        wx.setStorageSync('phoneNum', phoneNum);
        wx.setStorageSync('status', status);
      }
      console.log("getuserinfo over!");
      
    }
  })
}
        //把用户的openid保存到本地
        wx.setStorageSync('phoneNum', phoneNum);
        wx.setStorageSync('status', status);
      }
      console.log("getuserinfo over!");
      
    }
  })
}