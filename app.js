//app.js
App({
  onLaunch: function () {
    console.log('App onLaunch');
    var that = this;
    //  获取商城名称
    wx.request({
      url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/config/get-value',
      data: {
        key: 'mallName'
      },
      success: function(res) {
        console.log(res)
        wx.setStorageSync('mallName', res.data.data.value);
      }
    })
    this.login();
    this.getUserInfo();
  },
  login : function () {
    var that = this;
    var token = that.globalData.token;
    if (token) {
      wx.request({
        url: 'https://api.it120.cc/' + that.globalData.subDomain + '/user/check-token',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.it120.cc/'+ that.globalData.subDomain +'/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function(res) {
            console.log(res)
            if (res.data.code == 10000) {
              // 去注册
              that.registerUser();
              return;
            }
            if (res.data.code != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel:false
              })
              return;
            }
            that.globalData.token = res.data.data.token;
          }
        })
      }
    })
  },
  registerUser: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://api.it120.cc/' + that.globalData.subDomain +'/user/wxapp/register/complex',
              data: {code:code,encryptedData:encryptedData,iv:iv}, // 设置请求的 参数
              success: (res) =>{
                wx.hideLoading();
                that.login();
              }
            })
          }
        })
      }
    })
  },
  getUserInfo:function() {
    wx.getUserInfo({
      success:(data) =>{
        this.globalData.userInfo = data.userInfo;
        console.log(this.globalData.userInfo);
        return this.globalData.userInfo;
      }
    })
  },
  globalData:{
    userInfo:null,
    subDomain:"2f0e60c8cc196826f1d9871e04cc3a22"
  }
})