var point = [];
var that2;

function drawline() {
  that2.setData({
    polyline: [{
      points: point,
      color: '#000000',
      width: 4,
      dottedLine: false
    }]
  });
}

//获取经纬度
function getlocation() {
  var lat, lng;
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      lat = res.latitude;
      lng = res.longitude;
      point.push({
        latitude: lat,
        longitude: lng
      });
      console.log(point);
    }
  });
}

Page({
  data: {
    polyline: [],
  },

  onLoad: function() {
    that2 = this;

    point.push({
      latitude: 23.176167,
      longitude: 113.480819
    });
    point.push({
      latitude: 23.175753,
      longitude: 113.481688
    });


    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that2.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
      }
    });
    drawline();
  },

  start: function() {
    this.timer = setInterval(repeat, 1000);

    function repeat() {
      console.log('re');
      getlocation();
      drawline();
    }
  },
  end: function() {
    console.log('end');
    clearInterval(this.timer);
  }
});