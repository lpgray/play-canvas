var Loading = (function(){
  var dom = document.getElementById('J_loading');
  var textCtn = dom.getElementsByTagName('p')[0];

  return {
    show : function(text){
      var v = text || 'loading...';
      textCtn.innerHTML = text;
      dom.style.display = 'block';
    },
    hide : function(){
      dom.style.display = 'none';
    }
  }
}());