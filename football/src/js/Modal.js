var Modal = (function(){
  var $dom = $('#J_modal');

  var $white = $('#J_whiteModal');

  var $close = $dom.find('.j_close');
  $close.bind('tap', function(){
    $dom.css('display', 'none');
    closeCallback && closeCallback.call(Modal);
    closeCallback = null;
    return false;
  });

  var funcTeamSel, funcScoreSel, closeCallback;

  $dom.find('.j-score-sel').on('tap', '.item', function(){
    var _ = $(this);
    _.addClass('active').siblings().removeClass('active');
    
    if(_.find('.not').length > 0){
      return false;
    }

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

  $white.find('.j_close').on('tap', function(){
    $white.addClass('hide');
    if(localStorage){
      localStorage.setItem('willNotShowHelpModal', 1);
    }
  });
  return {
    config : function(option){
      funcScoreSel = option.onScoreSelected;
      funcTeamSel = option.onTeamSelected;
    },
    /**
     * 展示面板
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
      $('#J_score').html(tmpl);
    },
    hide : function(){
      $dom.css('display', 'none');
    },
    showWhite : function(){
      $white.removeClass('hide');
    }
  };
}());