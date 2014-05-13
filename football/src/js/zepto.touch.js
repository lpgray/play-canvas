;
(function($) {
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        gesture;

    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
    }

    function longTap() {
        longTapTimeout = null;
        if (touch.last) {
            touch.el.trigger('longTap');
            touch = {};
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout);
        longTapTimeout = null;
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout);
        if (tapTimeout) clearTimeout(tapTimeout);
        if (swipeTimeout) clearTimeout(swipeTimeout);
        if (longTapTimeout) clearTimeout(longTapTimeout);
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
        touch = {};
    }

    function isPrimaryTouch(event) {
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
    }

    function isPointerEventType(e, type) {
        return (e.type == 'pointer' + type ||
            e.type.toLowerCase() == 'mspointer' + type);
    }

    $(document).ready(function() {
        var now, delta, deltaX = 0,
            deltaY = 0,
            firstTouch, _isPointerType;

        if ('MSGesture' in window) {
            gesture = new MSGesture();
            gesture.target = document.body;
        }

        $(document)
            .bind('MSGestureEnd', function(e) {
                var swipeDirectionFromVelocity =
                    e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe');
                    touch.el.trigger('swipe' + swipeDirectionFromVelocity);
                }
            })
            .on('touchstart MSPointerDown pointerdown', function(e) {
                if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) return;
                firstTouch = _isPointerType ? e : e.touches[0];
                if (e.touches && e.touches.length === 1 && touch.x2) {
                    // Clear out touch movement data if we have it sticking around
                    // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                    touch.x2 = undefined;
                    touch.y2 = undefined;
                }
                now = Date.now();
                delta = now - (touch.last || now);
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode);
                touchTimeout && clearTimeout(touchTimeout);
                touch.x1 = firstTouch.pageX;
                touch.y1 = firstTouch.pageY;
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
                touch.last = now;
                longTapTimeout = setTimeout(longTap, longTapDelay);
                // adds the current touch contact for IE gesture recognition
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId);;
            })
            .on('touchmove MSPointerMove pointermove', function(e) {
                if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) return;
                firstTouch = _isPointerType ? e : e.touches[0];
                cancelLongTap();
                touch.x2 = firstTouch.pageX;
                touch.y2 = firstTouch.pageY;

                deltaX += Math.abs(touch.x1 - touch.x2);
                deltaY += Math.abs(touch.y1 - touch.y2);
            })
            .on('touchend MSPointerUp pointerup', function(e) {
                if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) return;
                cancelLongTap();

                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

                    swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe');
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                        touch = {};
                    }, 0)

                // normal tap
                else if ('last' in touch)
                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {

                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap');
                            event.cancelTouch = cancelAll;
                            touch.el.trigger(event);

                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger('doubleTap');
                                touch = {};
                            }

                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function() {
                                    touchTimeout = null;
                                    if (touch.el) touch.el.trigger('singleTap');
                                    touch = {};
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {};
                    }
                deltaX = deltaY = 0;

            })
        // when the browser window loses focus,
        // for example when a modal dialog is shown,
        // cancel all ongoing events
        .on('touchcancel MSPointerCancel pointercancel', cancelAll);

        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll);
    })

    ;
    ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'
    ].forEach(function(eventName) {
        $.fn[eventName] = function(callback) {
            return this.on(eventName, callback);
        }
    })
})(Zepto)

//zepto.cookie like jQuery.cookie
;
(function($) {
    $.cookie = function(key, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [key, '=', encodeURIComponent(value), expires, path, domain, secure].join('');

        } else {
            var c = document.cookie;
            if (c.indexOf(key + "=") == -1) {
                return null;
            }
            var start = c.indexOf(key + "=");
            var end = c.indexOf(";", start);
            if (end == -1) {
                end = c.length;
            }
            return decodeURIComponent(c.substring(start + key.length + 1, end));
        }
    }
})(Zepto);

(function() {
    var ua = navigator.userAgent;
    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
        window.tapEvent = "tap";
        console._log = console.log;
        console.logMode = 0;
        console.log = function(f) {
            if (!$("#console").length && console.logMode) {
                $("<div id='console' style='position: absolute; right: 0px; bottom:0px; width:200px; height: 100px; font-size: 12px; background-color: #fff; overflow: scroll'></div>").appendTo("body");
            }
            this._log(f);
            if (this.logMode == 1) {
                $("#console").append("<p>" + JSON.stringify(f) + "</p>");
            }
        }
    } else {
        window.tapEvent = "click";
    }
})();


//$.ajaxSettings.timeout=10000;
$("#circularG").hide();
var loadingTimer = null;
$(document).on("ajaxBeforeSend", function(e, xhr, options) {
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(function() {
        $("#circularG").show();
    }, 300);

});
$(document).on("ajaxSuccess", function(e, xhr, options) {
    clearTimeout(loadingTimer);
    $("#circularG").hide();
    //alert(1);
});
$(document).on("ajaxError", function(e, xhr, options, error) {
    clearTimeout(loadingTimer);
    $("#circularG").hide();
    if (error == "abort") {
        return;
    }
    alert("请求失败，请重试");
    //alert(1);
});
$(document).on(tapEvent, function(e) {
    var tar = e.target;
    if (tar.nodeName == "A" && tar.href.indexOf("###") != -1) {
        e.preventDefault();
    }
});

var ajax = (function(_){
    var BASE_URL = 'http://dev.life.xici.net';
    return function(options){
        if(options.url.indexOf('/') === 0){
            options.url = BASE_URL + options.url;
        }else{
            options.url = BASE_URL + '/' + options.url;
        }
        _.ajax(options);
    }
}($));