var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 纬度 latitude
    lat: 44,
    // 经度 longitude
    log: 113,
    // 页面控件
    controls: [],
    // 页面图层
    markers: []
  },

  /**
   * 监听页面加载
   */
  onLoad: function(options) {
    // 初始化地图
    this.mapCtx = wx.createMapContext('map');

    // 初始qqmap sdk
    qqmapsdk = new QQMapWX({
      key: 'WUHBZ-UZM6I-O2JGC-5PZI4-WZLPH-JHFW2'
    });
    // 赋值 this(page)给 that 变量
    var that = this;
    //定位函数
    getPosition(that);
    //模拟加载的动画
    wx.showLoading({
      title: '加载中',
    })
    //1.5s关闭动画效果
    setTimeout(function() {
      wx.hideLoading()
    }, 1500)

    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight; //窗口高度
        var width = res.windowWidth; //窗口宽度
        // 设置page 的数据 controls
        that.setData({
          controls: [{
              //中心点位置
              id: 1,
              iconPath: '/image/location.png',
              position: {
                width: 20,
                height: 35,
                left: width / 2 - 10,
                top: height / 2 - 35.
              },
              //是否可点击
              clickable: true
            }, {
              //定位按钮安置
              id: 2,
              iconPath: '/image/定位.png',
              position: {
                width: 30,
                height: 30,
                left: 20,
                top: height - 60.
              },
              //是否可点击
              clickable: true
            }, {
              //扫码按钮
              id: 3,
              iconPath: '/image/qrcode.png',
              position: {
                width: 100,
                height: 40,
                left: width / 2 - 50,
                top: height - 60.
              },
              //是否可点击
              clickable: true
            }, {
              //充值按钮
              id: 4,
              iconPath: '/image/充值.png',
              position: {
                width: 30,
                height: 30,
                left: width - 45,
                top: height - 60
              },
              //是否可点击
              clickable: true
            }, { //手动添加一辆单车
              id: 5,
              iconPath: "/image/bike.png",
              position: {
                width: 35,
                height: 40,
              },
              //是否可点击
              clickable: true
            }, { //查询轨迹
              id: 6,
              iconPath: "/image/轨迹查询.png",
              position: {
                width: 30,
                height: 30,
                left: width - 45,
                top: height - 120.
              },
              //是否可点击
              clickable: true
            }, { //个人中心
              id: 7,
              iconPath: "/image/个人_fill.png",
              position: {
                width: 30,
                height: 30,
                left: width - 45,
                top: height - 180.
              },
              //是否可点击
              clickable: true
            },
            { //个人中心
              id: 8,
              iconPath: "/image/预约.png",
              position: {
                width: 40,
                height: 40,
                left: width / 2 + 70,
                top: height - 60.
              },
              //是否可点击
              clickable: true
            }
          ]
        });


        //要延时执行的代码
        setTimeout(function() {
          // 2s 延迟 定位
          that.mapCtx.moveToLocation()
        }, 2000)
      },
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 	视野发生变化时触发
   */
  regionChange(e) {
    var that = this;
    if (e.type == "end") {
      that.mapCtx.getCenterLocation({
        success: function(res) {
          // console.log(res)
          findRentals(that, res.longitude, res.latitude);
        }
      })
    }

  },
  /**
   * 点击控件时触发，会返回control的id
   */
  controlTap(e) {
    var that = this;
    if (e.controlId == 2) {
      console.log("点击2控件，定位当前位置");
      //点击定位当前位置
      that.mapCtx.moveToLocation();
    }
    if (e.controlId == 3) {
      console.log("点击3控件，扫码开锁")
      if(checkUserStatus()){
        scanCode();
      }
    }

    if (e.controlId == 4) {
      console.log("点击4控件，充值")
      wx.navigateTo({
        url: '../pay/pay',
      })
    }

    if (e.controlId == 5) {
      //添加车辆
      console.log("点击5控件，添加租车点")
      that.mapCtx.getCenterLocation({
        success: function(res) {
          var lat = res.latitude;
          var log = res.longitude;
          var point_id = getApp().globalData.rentalNo;
          wx.request({
            url: "http://localhost:8888/rental/save",
            method: 'POST',
            data: {
              location: [log, lat]
            },
            success: function() {
              findRentals(that, log, lat);
            }
          })
        },
      })
    }
    if (e.controlId == 6) {
      //轨迹路线
      console.log("点击6控件，用户轨迹路线")
      wx.navigateTo({
        url: '../record/record',
      })
    }
    if (e.controlId == 7) {
      //个人中心
      console.log("点击7控件，用户个人中心");
      wx.navigateTo({
        url: '../me/me',
      });

    }
    if (e.controlId == 8) {
      //个人中心
      console.log("点击8控件，预约租车")
      if(checkUserStatus()){
        wx.navigateTo({
          url: '../reservation/reservation'
        });
      }
    }


  }

})

function findRentals(that, log, lat) {
  //请求后端数据
  wx.request({
    url: "http://localhost:8888/rental/findNearRentals",
    method: 'GET',
    data: {
      longitude: log,
      latitude: lat,
    },
    success: function(res) {
      console.log("findRentals--" + res);
      const rentals = res.data.content.map((item) => {
        var rental = item.content;
        return {
          id: item.id,
          iconPath: "/image/bike.png",
          width: 35,
          height: 40,
          longitude: rental.location[0],
          latitude: rental.location[1],
          callout: {
            content: "剩余车辆：" + rental.left_bike,
            color: "#ff0000",
            fontSize: "16",
            borderRadius: "10",
            bgColor: "#ffffff",
            padding: "10",
            display: "ALWAYS"
          }
        };
      });
      // 修改当前页面变量data里面的markers
      that.setData({
        markers: rentals
      });
    }
  })
}
function checkUserStatus(){
  //获取全局变量中的status属性值
  var status = getApp().globalData.status;
  if (status == 0) {
    console.log("用户状态为0，需要注册")
    //跳转到注册页面
    wx.navigateTo({
      url: '../register/register',
    });
  } else if (status == 1) {
    console.log("用户状态为1，需要充值")
    wx.navigateTo({
      url: '../deposit/deposit',
    });
  } else if (status == 2) {
    console.log("用户状态为2，需要实名认证")
    wx.navigateTo({
      url: '../identify/identify',
    });
  } else if (status == 3) {
    console.log("用户状态为3，已通过校验")
    return true;
  }
}
function findBikes(that, log, lat) {
  //请求后端数据
  wx.request({
    url: "http://localhost:8888/bikes/near",
    method: 'GET',
    data: {
      longitude: log,
      latitude: lat,
    },
    success: function(res) {
      console.log(res);
      const bikes = res.data.content.map((item) => {
        var bike = item.content;
        return {
          id: item.id,
          iconPath: "/image/bike.png",
          width: 35,
          height: 40,
          longitude: bike.location[0],
          latitude: bike.location[1],
          callout: {
            content: "剩余车辆：12345",
             color: "#ff0000",
             fontSize: "16",
            borderRadius: "10",
             bgColor: "#ffffff",
             padding: "10",
             display: "ALWAYS"
          }
        };
      });
      // 修改当前页面变量data里面的markers
      that.setData({
        markers: bikes
      });
    }
  })
}
// 定位功能
function getPosition(that) {
  wx.getLocation({
    success: function(res) {

      //接受res的经纬度
      var lat = res.latitude;
      var log = res.longitude;
      // 更新页面变量
      that.setData({
        log: log,
        lat: lat
      });
      console.log("getposition--" + log + "---------" + lat);
      // 更新全局变量
      getApp().globalData.log = log;
      getApp().globalData.lat = lat;
      console.log("调用getyPositon 成功 ，返回的location为经度为" + log + " 纬度为：" + lat);
      // 刷新页面，并查找附近车辆
      findRentals(that, log, lat);
    },
  })
}
// 扫描二维码进入骑行
function scanCode() {
  wx.scanCode({
    success: function(res) {
      var vehicleNo = res.result;
      console.log(vehicleNo);
      var openid = wx.getStorageSync('openid');
      wx.request({
        url: 'http://localhost:8888/vehicle/unlock',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          id: openid,
          vehicleNo: vehicleNo
        },
        success: function(res) {
          console.log(res);
          if (res.data == "fail") {
            wx.showModal({
              title: '提示',
              content: '这辆车您暂时不能使用'
            })
          } else {
            wx.navigateTo({
              url: '../billing/billing?bikeNo=' + vehicleNo
            });
          }
        }

      })
    }
  })
}

function moveCenter(that) {
  that.mapCtx.moveToLocation();
}
