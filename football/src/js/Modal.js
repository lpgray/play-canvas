var Modal = (function(){
  var $dom = $('#J_modal');

  var $close = $dom.find('.close');
  $close.bind('tap', function(){
    $dom.css('display', 'none');
    return false;
  });

  var funcTeamSel, funcScoreSel;

  $dom.find('.j-score-sel').on('tap', '.item', function(){
    $(this).addClass('active').siblings().removeClass('active');
    funcScoreSel && funcScoreSel.call(this, {
      aid : $(this).data('activeid'),
      credit : $(this).data('purchase')
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
    show : function(option){
      $dom.find('.j-sel').addClass('hide');
      $dom.find('.j-'+option.sel+'-sel').removeClass('hide');
      $dom.find('h1').html(option.title);
      $dom.css('display', 'block');
    },
    setScorePanel : function(tmpl){
      $dom.find('.j-score-sel').html(tmpl);
    },
    hide : function(){
      $dom.css('display', 'none');
    }
  };
}());