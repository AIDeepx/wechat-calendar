const dn = new Date(); 
const dateUtil = {
  dn(ts){
    if (ts){
      return new Date(ts.replace(/\-/g, "/"));
    }else{
      return new Date();
    }
  },
  dateFormate(ts, dl){
    let dn = this.dn(ts);
    let dateArr = [
      dn.getFullYear(),
      this.getMonth() < 10 ? '0' + this.getMonth() : this.getMonth(),
      dn.getDate() < 10 ? '0' + dn.getDate() : dn.getDate()
    ];
    if (!Boolean(dl)){
      dl = "-";
    }
    return dateArr.join(dl);
  },
  getYear(ts){
    return this.dn(ts).getFullYear();
  },
  getMonth(ts){
    return this.dn(ts).getMonth() + 1;
  },
  getCurDate(ts) {
    let dn = this.dn(ts);
    return dn.getDate();
  },
  // 获取当月所有天数
  getDate(ts){
    let dn = this.dn(ts);
    let m = this.getMonth(ts);
    dn.setMonth(m);
    dn.setDate(0);
    return dn.getDate();
  },
  // 根据日期获取星期
  getDay(d) {
    let dn = this.dn(d);
    dn.setDate(d.split('-')[2]);
    return dn.getDay(); 
  },
  // 获取时间戳
  getTs(d){
    return Date.parse(this.dn(d));
  },
}

module.exports = dateUtil;