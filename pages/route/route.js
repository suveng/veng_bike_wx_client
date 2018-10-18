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
      latitude: 23.147187,  
      longitude: 113.494778
    });
    point.push({
      latitude: 23.149436, 
      longitude: 113.496065
    });
    point.push({
      latitude: 23.152672, 
      longitude: 113.498940
    });
    point.push({
      latitude: 23.153461, 
      longitude: 113.499799
    });
    point.push({
      latitude: 23.154763, 
      longitude: 113.501859
    });
    point.push({
      latitude: 23.154763, 
      longitude: 113.504348
    });
    point.push({
      latitude: 23.154724, 
      longitude: 113.504477
    });
        point.push({
          latitude: 23.153974, 
          longitude: 113.505120
    });
    point.push({
      latitude: 23.153974, 
      longitude: 113.505120
    });
    point.push({
      latitude: 23.153974, 
      longitude: 113.505120
    });
    point.push({
      latitude: 23.150699, 
      longitude: 113.507609
    });
    point.push({
      latitude: 23.149910, 
      longitude: 113.508081
    });
    point.push({
      latitude: 23.149041, 
      longitude: 113.508875
    });
    point.push({
      latitude: 23.148390, 
      longitude: 113.509326
    });
    point.push({
      latitude: 23.148311, 
      longitude: 113.509219
    });
    point.push({
      latitude: 23.148252, 
      longitude: 113.509219
    });
    point.push({
      latitude: 23.148371, 
      longitude: 113.507674
    });
    point.push({
      latitude: 23.148430, 
      longitude: 113.507566
    });
    point.push({
      latitude: 23.148430, 
      longitude: 113.507116
    });
    point.push({
      latitude: 23.148351, 
      longitude: 113.506837
    });
    point.push({
      latitude: 23.148410,
      longitude: 113.506429
    });
    point.push({
      latitude: 23.147384, 
      longitude: 113.506365
    });
    point.push({
      latitude: 23.147305, 
      longitude: 113.506343
    });
    point.push({
      latitude: 23.147364, 
      longitude: 113.505871
    });
    point.push({
      latitude: 23.147404, 
      longitude: 113.505657
    });
    point.push({
      latitude: 23.147700,
      longitude: 113.505528
    });
    point.push({
      latitude: 23.147798, 
      longitude: 113.505528
    });
    point.push({
      latitude: 23.147562,
      longitude: 113.504906
    });
    point.push({
      latitude: 23.147345,
      longitude: 113.504283
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