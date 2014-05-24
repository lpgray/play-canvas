var Loading = (function(){
  var dom = document.getElementById('J_loading');
  var textCtn = document.getElementById('J_loadingctn');
  var okBtn = document.getElementById('J_loadingBtn');

  var okFn, hideFn;

  $(dom).find('.btn').on('tap', function(){
    Loading.hide();
    okFn && okFn.call();
    okFn = false;
  });

  return {
    show : function(text, okCallback){
      var v = text || 'loading...';
      dom.style.display = 'block';
      okBtn.style.display = 'inline-block';

      if(typeof okCallback =='function'){
        okFn = okCallback;
      }else if(okCallback === true){
        okBtn.style.display = 'none';
        v = '<img src="img/loading.gif" alt="" /> ' + v;
      }
      textCtn.innerHTML = v;
    },
    hide : function(){
      dom.style.display = 'none';
      clearTimeout(hideFn);
    },
    hideAfter : function(pause, fn){
      hideFn = setTimeout(function(){
        Loading.hide();
        fn.call(Loading);
      }, pause);
    }
  }
}());