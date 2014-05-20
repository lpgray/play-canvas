var Modal = (function(){
  var $dom = $('#J_modal');

  var $close = $dom.find('.close');
  $close.bind('tap', function(){
    $dom.css('display', 'none');
    closeCallback && closeCallback.call(Modal);
    closeCallback = null;
    return false;
  });

  var funcTeamSel, funcScoreSel, closeCallback;

  $dom.find('.j-score-sel').on('tap', '.item', function(){
    $(this).addClass('active').siblings().removeClass('active');
    funcScoreSel && funcScoreSel.call(this, {
      aid : $(this).data('activeid'),
      credit : $(this).data('purchase'),
      value : $(this).data('value')
    });
    return false;
  });
  $dom.find('.j-team-sel .item').on('tap', function(){
    $(this).addClass('active').siblings().removeClass('active');
    funcTeamSel && funcTeamSel.call(this, $(this).index());
    return false;
  });



  return {
    // onTeamSelected : function(cb){
    //   funcTeamSel = cb;
    // },
    // onScoreSelected : function(cb){
    //   funcScoreSel = cb;
    // },
    config : function(option){
      funcScoreSel = option.onScoreSelected;
      funcTeamSel = option.onTeamSelected;
    },
    /**
     * 展示面板
     * option : { title, html, sel : 'score' | 'team' }
     */
    show : function(option, closeFn){
      if(option.sel === 'score'){
        $dom.children('.modal-scale').addClass('full-screen-modal');
      }else{
        $dom.children('.modal-scale').removeClass('full-screen-modal');
      }

      $dom.find('.j-sel').addClass('hide');
      $dom.find('.j-'+option.sel+'-sel').removeClass('hide');
      $dom.find('h1').html(option.title);
      $dom.css('display', 'block');

      closeCallback = closeFn;
    },
    setScorePanel : function(tmpl){
      $dom.find('.j-score-sel').html(tmpl);
    },
    hide : function(){
      $dom.css('display', 'none');
    }
  };
}());