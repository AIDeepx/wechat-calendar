import dateUtil from "../../utils/dateUtil.js";

Component({

  behaviors: [

  ],

  properties: {
    disableOld: { type: Boolean, value: false },
    disableNull: { type: Boolean, value: false },
    data: Array,
  },
  data: {
    mounthTitle: ['日', '一', '二', '三', '四', '五', '六'],
    curDays: [],
    curDay: '',
    curTitle: '',
    dateAnimate: '',
    dateInit: 1,
    dateAnimate2: '',
    dateWidth: '',
    dateLen_1: '',
    dateLen_2: '',
    dateMoving: false,
    dayAnimate: '',
    monthCtrl: false,
  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () { },

  observers: {
    'data': function (data) {
      this.renderDateDesc();
    }
  },

  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show() {
      let sysinfo = wx.getSystemInfoSync();
      this.setData({
        curTitle: dateUtil.dateFormate(),
        dateWidth: sysinfo.windowWidth,
        dateLen_1: 0,
        dateLen_2: sysinfo.windowWidth * -1,
      });
      this.getCurrentMouth(this.data.curTitle);
    }
  },

  methods: {
    /**
   * 变更月份
   */
    changeCalendar: function (e) {
      if (this.data.dateMoving) {
        return;
      }
      let ds = e.currentTarget.dataset.handle;
      let dateAmnClass = '';
      let curMouthArr = this.data.curTitle.split("-");
      let _duration = 200;
      let _dateLen_1 = this.data.dateLen_1;
      let _dateLen_2 = this.data.dateLen_2;
      // 当前年月日
      let __curYear = dateUtil.getYear();
      let __curMonth = dateUtil.getMonth();

      let _anm = wx.createAnimation({
        duration: _duration,
        timingFunction: 'easing',
        delay: 0,
      });// 定义日历动画
      let _anm2 = wx.createAnimation({
        duration: _duration,
        timingFunction: 'easing',
        delay: 0,
      });// 定义日历动画

      if (ds == "neg") {
        _dateLen_1 -= this.data.dateWidth;
        _dateLen_2 -= this.data.dateWidth;

        if (Number(curMouthArr[1]) == 12) {
          curMouthArr[1] = 1;
          curMouthArr[0] = Number(curMouthArr[0]) + 1;
        } else {
          curMouthArr[1] = Number(curMouthArr[1]) + 1;
        }
      } else {
        _dateLen_1 += this.data.dateWidth;
        _dateLen_2 += this.data.dateWidth;

        if (Number(curMouthArr[1]) == 1) {
          curMouthArr[1] = 12;
          curMouthArr[0] -= 1;
        } else {
          curMouthArr[1] = Number(curMouthArr[1]) - 1;
        }
      }


      // 月字符串格式化
      curMouthArr[1] = curMouthArr[1] <= 9 ? '0' + curMouthArr[1] : curMouthArr[1];
      curMouthArr[2] = '01';

      this.triggerEvent('changeCalendar', { curMouthArr: curMouthArr.join('-') });

      if ((_dateLen_1 > _dateLen_2) && (_dateLen_2 <= this.data.dateWidth * -1)) {
        _dateLen_1 = this.data.dateWidth * -1;
        _dateLen_2 = 0;
        _anm.translateX(0).step({ duration: 1 });
        _anm2.translateX(this.data.dateWidth).step({ duration: 1 });
        this.setData({
          dateAnimate: _anm.export(),
          dateAnimate2: _anm2.export(),
          dateLen_1: 0,
          dateLen_2: this.data.dateWidth,
          dateMoving: true
        });
        setTimeout(() => {
          // 滚动动画
          _anm.translateX(_dateLen_1).step();
          _anm2.translateX(_dateLen_2).step();

          this.setData({
            dateAnimate2: _anm2.export(),
            dateAnimate: _anm.export(),
            curTitle: curMouthArr.join('-'),
          });
          this.getCurrentMouth(curMouthArr.join('-'));
        }, 100);
      } else {
        // 滚动动画
        _anm.translateX(_dateLen_1).step();
        _anm2.translateX(_dateLen_2).step();

        this.setData({
          dateAnimate2: _anm2.export(),
          dateAnimate: _anm.export(),
          curTitle: curMouthArr.join('-'),
        });
        this.getCurrentMouth(curMouthArr.join('-'));
      }

      setTimeout(() => {
        _anm.translateX(0).step({ duration: 1 });
        _anm2.translateX(this.data.dateWidth * -1).step({ duration: 1 });
        this.setData({
          dateLen_1: 0,
          dateLen_2: this.data.dateWidth * -1,
          dateAnimate: _anm.export(),
          dateAnimate2: _anm2.export(),
          dateMoving: false
        });
      }, _duration + 100);
    },
    /**
     * 渲染日期描述
     */
    renderDateDesc() {
      let i = 0;
      let curDays = [];
      let _pdata = this.properties.data;
      if (!_pdata[0]) { return false; }
      let _stat = 0;
      this.data.curDays.forEach((id, ii) => {
        let item = [];
        id.forEach((jd, ji) => {
          i += 1;
          let _curindex = ji + ii * 7;
          if (_stat < _pdata.length &&
            Date.parse(new Date(_pdata[_stat].date)) == Date.parse(new Date(jd.dateStr))) {
            jd.disable = false && this.properties.disableNull;
            jd.desc = _pdata[_stat].label;
            _stat++;
          } else {
            jd.disable = true && this.properties.disableNull;
            jd.desc = "";
          }

          item.push(jd);
        });
        curDays.push(item);
      });
      this.setData({
        curDays: curDays
      });
    },
    /**
     * 选择日期
     */
    setDate(e) {
      let date = e.currentTarget.dataset.date;
      let _amn = wx.createAnimation({
        duration: 200,
      });
      _amn.scale(0.8, 0.8).step({ duration: 100 });
      _amn.scale(1, 1).step({ duration: 100 });
      let curTitle = date.split("-");
      curTitle[2] = Number(curTitle[2]) < 10 ? '0' + curTitle[2] : curTitle[2];
      this.setData({
        curDay: date,
        curTitle: curTitle.join('-'),
        dayAnimate: _amn.export()
      });
      this.triggerEvent('changeTime', { curTime: date });
    },
    /**
     * 获取当月所有日期
     */
    getCurrentMouth: function (dateStr) {
      let that = this;
      let preMouthArr = dateStr.split("-");
      let curDay = preMouthArr[2];
      let __curYear = dateUtil.getYear(dateStr);
      let __curMonth = dateUtil.getMonth(dateStr);
      if (__curYear == preMouthArr[0] && __curMonth == preMouthArr[1]) {
        let __curDay = dateUtil.getCurDate(dateStr);
        curDay = __curDay;
      }
      let preMouth = preMouthArr[1] == 1 ? 12 : preMouthArr[1] - 1;
      let alldays = dateUtil.getDate(dateStr);
      preMouthArr[1] = preMouth;
      let preAllDays = dateUtil.getDate(preMouthArr.join('-'));
      let curMouthArr = dateStr.split("-");
      curMouthArr[2] = 1;
      let fmIndex = dateUtil.getDay(curMouthArr.join("-"));
      let days = [];
      for (let i = 0; i < 5; i++) {
        let item = [];
        for (let j = 0; j < 7; j++) {
          let day = 1;
          let disable = false;
          let readonly = false;
          let timeTemp = dateStr.split("-");
          let month = __curMonth;
          if ((i * 7 + j) < fmIndex) {
            day = preAllDays - (fmIndex - j - 1);
            month = __curMonth <= 1 ? 12 : __curMonth - 1;
            disable = true;
            readonly = true;
            timeTemp[1] = Number(timeTemp[1]) - 1 < 10 ? '0' + (Number(timeTemp[1]) - 1) : Number(timeTemp[1]) - 1;
          } else {
            if ((i * 7 + j - fmIndex + 1) <= alldays) {
              day = i * 7 + j - fmIndex + 1;
            } else {
              day = (i * 7 + j - fmIndex + 1) - alldays;
              disable = true;
              readonly = false;
              timeTemp[1] = Number(timeTemp[1]) + 1 < 10 ? '0' + (Number(timeTemp[1]) + 1) : Number(timeTemp[1]) + 1;
            }
          }
          timeTemp[2] = day
          let ts = dateUtil.getTs(timeTemp.join('-'));
          let curts = dateUtil.getTs() - 60 * 60 * 24 * 1000;
          if (this.properties.disableOld){
            disable = disable || ts < curts;
            readonly= readonly || ts < curts;
          } else {
            disable = disable;
            readonly = readonly;
          }
          item.push({
            disable: disable,
            readonly: readonly,
            date: day,
            dateStr: timeTemp.join("-"),
            isOld: ts < curts,
            desc: "",
          });
        }
        days.push(item);
      }
      console.log(days);
      that.setData({
        curDays: days
      }, function () {
        that.renderDateDesc();
      });
    },
    /**
     * 切换选择日期或月份
     */
    monthCtrl: function () {
      this.setData({
        monthCtrl: true,
        curTitle: this.data.curTitle.split('-')[0],
      });
    },
    /**
     * 跳转选择的月份
     */
    jumpMonth: function (e) {
      let month = e.currentTarget.dataset.month;
      let date = [];
      if (this.data.curTitle.indexOf("-") == -1){
        date[0] = this.data.curTitle;
      }else{
        date = this.data.curTitle.split("-");
      }
      date[1] = month;
      date[2] = '01';
      this.setData({
        curTitle: date.join('-'),
        monthCtrl: false
      });
      this.getCurrentMouth(date.join('-'));
    },
  },
})