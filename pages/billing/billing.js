Page({
  data: {
    hours: 0,
    minuters: 0,
    seconds: 0,
    billing: "正在计费",
    isStop: false

  },
  // 页面加载
  onLoad: function(options) {
    // 创建历史位置信息缓存
    var historyLocations = [];
    var longtitude = getApp().globalData.log;
    var latitude = getApp().globalData.lat;
    var location = [longtitude, latitude];
    wx.setStorageSync("historyLocations", historyLocations)

    // 定时执行获取位置信息，添加到数组里面,并将数组放到缓存里
    this.time2 = setInterval(() => {
      wx.getLocation({
        success: function(res) {
          longtitude = res.longitude;
          latitude = res.latitude;
          getApp().globalData.log=longtitude;
          getApp().globalData.lat=latitude;
          location = [longtitude, latitude];
          //保存位置信息到本机
          var history = wx.getStorageSync("historyLocations");
          history.push(location);
          wx.setStorageSync("historyLocations", history);
          console.log(wx.getStorageSync("historyLocations"))
        },
      })
    }, 5000)

    // 设置计时器
    this.timer = setInterval(() => {
      this.setData({
        seconds: s++
      })
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minuters: m
          });
        }, 1000)
        if (m == 60) {
          m = 0;
          h++
          setTimeout(() => {
            this.setData({
              hours: h
            });
          }, 1000)
        }
      };
    }, 1000)
    wx.setStorageSync('time', true);
    // 获取车牌号，设置定时器
    this.setData({
      number: options.bikeNo,
      timer: this.timer,
      time2: this.time2
    })
    console.log(this.timer);

    // 初始化计时器
    let s = 0;
    let m = 0;
    let h = 0;

    //获取开始的时间

    var tmp = Date.parse(new Date()).toString();
    tmp = tmp.substr(0, 10);
    wx.setStorageSync('start_time', tmp);
    // 计时开始

  },
  // 结束骑行，清除定时器
  endRide: function() {
    endRiderecord(this);
  },
  moveToIndex: function() {
    var flag = this.data.isStop
    console.log(flag)
    if (flag) {
      wx.navigateTo({
        url: '../index/index',
      })
    } else {
      var that=this;
      wx.showModal({
        title: '提示',
        content: '你确定结束骑行，返回主界面？',
        success: function(res) {
          endRiderecord(that);          
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../index/index',
            })
          }
        }
      })
    }
  }
})

function endRiderecord(that) {
  that.data.isStop = true;
  //设置停止标志为true，用于回到地图的标志检查
  that.data.isStop = true;
  //停止定时任务
  clearInterval(that.data.time2)
  //结束时间
  var tmp = Date.parse(new Date()).toString();
  tmp = tmp.substr(0, 10);
  wx.setStorageSync('end_time', tmp);
  //结束位置
  // 2.获取并设置当前位置经纬度
  wx.getLocation({
    type: "gcj02",
    success: (res) => {
      // console.log(res);
      wx.setStorageSync('end_long', res.longitude);
      wx.setStorageSync('end_lati', res.latitude);
    }
  });
  var times = (that.data.minuters * 60 + that.data.hours * 3600 + that.data.seconds);
  wx.setStorageSync('time', false)
  clearInterval(that.data.timer);
  that.timer = "";
  that.setData({
    billing: "本次用车耗时",
    disabled: true
  });


  var openid = wx.getStorageSync('openid');
  wx.request({
    url: 'http://localhost:8888/vehicle/lock',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      userId: openid,
      longitude: getApp().globalData.log,
      latitude: getApp().globalData.lat
    },
    success: function (res) {
      console.log(res);
      var data = res.data.data;
      if(res.data.code!=20000){
        wx.showToast({
          title: '还车失败，请联系客服！',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.showModal({
        title: '还车成功',
        content: '本次费用为' + data.cost + '，账号余额为' + data.balence,
        success: function(res){
          if(res.confirm){
            console.log(data)
            if (data.toPay == "true") {
              wx.showModal({
                title: '微信支付',
                content: '你需要微信支付费用',
                success: function(r){
                  // console.log(r)
                  if(r.confirm){
                    wx.navigateTo({
                      url: '../index/index',
                    })
                  }
                }
              })
            }else{
              wx.navigateTo({
                url: '../index/index',
              })
            }
          }
        }
      })

    }
  })
}