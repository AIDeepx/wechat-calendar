var plugin = requirePlugin("myPlugin")
Page({
  data: {
    list: [],
  },
  onLoad: function() {
    plugin.getData();
    var data = [];
    for(var i=1; i<=31; i++){
      data.push({ date: '2019-08-'+i, label: i});
    }
    this.setData({
      list: data
    });
  }
})