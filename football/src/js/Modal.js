var Modal = (function(){
  var $dom = $('#J_modal');

  var $close = $dom.find('.close');
  $close.bind('tap', function(){
    $dom.css('display', 'none');
    return false;
  });

  var funcTeamSel, funcScoreSel;

  $dom.find('.j-score-sel .item').on('tap', function(){
    $(this).addClass('active').siblings().removeClass('active');
    funcScoreSel && funcScoreSel.call(this, $(this).index());
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
    show : function(option){
      $dom.find('.j-team-sel').addClass('hide');
      $dom.find('.j-score-sel').addClass('hide');
      $dom.find('.j-words').addClass('hide');

      if(option.sel){
        if(option.sel === 'score'){
          $dom.find('.j-score-sel').removeClass('hide');
        }else if(option.sel === 'team'){
          $dom.find('.j-team-sel').removeClass('hide');
        }
      }else{
        $dom.find('h1').html(option.title);
        $dom.find('.j-words').removeClass('hide');
      }

      $dom.find('h1').html(option.title);
      $dom.css('display', 'block');
    }
  };
}());