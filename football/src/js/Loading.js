var Loading = (function(){
  var dom = document.getElementById('J_loading');
  var textCtn = document.getElementById('J_loadingctn');

  var okFn;

  $(dom).find('.btn').on('tap', function(){
    Loading.hide();
    okFn && okFn.call();
    okFn = false;
  });

  return {
    show : function(text, okCallback){
      var v = text || 'loading...';
      textCtn.innerHTML = text;
      dom.style.display = 'block';
      okFn = okCallback;
    },
    hide : function(){
      dom.style.display = 'none';
    }
  }
}());