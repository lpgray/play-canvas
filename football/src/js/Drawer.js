var Drawer = (function() {
  var $dom = $('#J_drawer');

  var cbs;

  var closed = true;

  $dom.find('.toggle').on('tap', function() {
    if (closed) {
      Drawer.show();
      closed = false;
    } else {
      Drawer.hide();
      closed = true;
    }
  });

  var $btns = $dom.find('.btn');
  $($btns[0]).bind('tap', function() {
    cbs['onStart'] && cbs['onStart'].call();
    return false;
  });
  $($btns[1]).bind('tap', function() {
    cbs['onTeamView'] && cbs['onTeamView'].call();
    return false;
  });
  $($btns[2]).bind('tap', function() {
    cbs['onRuleView'] && cbs['onRuleView'].call();
    return false;
  });
  $($btns[3]).bind('tap', function() {
    cbs['onScoreView'] && cbs['onScoreView'].call();
    return false;
  });

  return {
    show: function() {
      $dom.removeClass('drawer-close');
    },
    config: function(option) {
      cbs = option;
    },
    hide: function() {
      $dom.addClass('drawer-close');
    }
  }
}());