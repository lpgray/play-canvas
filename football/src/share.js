var _url = encodeURIComponent(window.location.href);
var _t = "#苏宁易购# 红包刮不停，百万红包喜刷刷！";
var _souhut = "#苏宁易购# 红包刮不停，百万红包喜刷刷！";
var _pict = "";
function shareWb()
{
  $(".share_weibo").attr("href",'http://v.t.sina.com.cn/share/share.php?url='+_url+'&appkey=400813291&title='+_t+'&pic='+_pict);
  // $(".share_kaixin").attr("href",'http://www.kaixin001.com/rest/records.php?url=' + _url + '&style=11&content=' + _t + '&pic='+ _pict + '&stime=&sig=');
  // $(".share_douban").attr("href",'http://www.douban.com/recommend/?url='+_url+'&title='+_t+'&comment='+encodeURI(_t));
  //$(".renren").attr("href",'http://widget.renren.com/dialog/share?resourceUrl='+_url+'&title='+encodeURI(_url)+'&description='+encodeURI(_t));
  $(".share_renren").attr("href", 'http://share.renren.com/share/buttonshare.do?link='+_url+'&title='+_t);
  var _appkey = encodeURI('65e3731f449e42a484c25c668160b355');
  var _pic = "";//encodeURI($("#picUrl").val());
  var _site =encodeURI('http://www.suning.com');
  var _u = 'http://v.t.qq.com/share/share.php?title='+_t+'&url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pict;
  // $(".share_qqweibo").attr("href",_u);
  // $(".share_sohu").attr("href",'http://t.sohu.com/third/post.jsp?&url='+_url+'&title='+_souhut+'&content=utf-8&pic='+_pict);
  var p = {
      url:_url,
      desc:'',
      summary:'',
      title:_t,
      site:'苏宁易购',
      pics:_pict
      };
  var s = [];
  for(var i in p){
    s.push(i + '=' + encodeURIComponent(p[i]||''));
  }
  $(".share_qzone").attr("href",'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&'));
};
shareWb();