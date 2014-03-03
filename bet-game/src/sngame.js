$(function() {
    /**
     * 打印日期
     * @param  {[type]} x [description]
     * @param  {[type]} y [description]
     * @return {[type]}   [description]
     */
    function date2str(x, y) {
        var z = {
            y: x.getFullYear(),
            M: x.getMonth() + 1,
            d: x.getDate(),
            h: x.getHours(),
            m: x.getMinutes(),
            s: x.getSeconds()
        };
        return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
        });
    }

    // 提供一个跨浏览器的动画运行控制函数，来源如下
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
    }
    /*
     * @name: 角度转弧度
     *
     * @param: degree:角度
     */
    function degress_to_radians(degree) {
        return degree * Math.PI / 180;
    }
    /**
     * 检测浏览器是否支持canvas
     * @return {[type]} [description]
     */
    function canvasSupport() {
        return !!document.createElement('canvas').getContext;
    }

    /**
     * 发布订阅模式
     * @return {[type]} [description]
     */
    var pubsub = (function() {
        var topics = {},
            subUid = -1;

        return {
            publish: function(topic, args) {
                if (!topics[topic]) {
                    return false
                }

                var subscribers = topics[topic],
                    len = subscribers ? subscribers.length : 0;
                while (len--) {
                    subscribers[len].func(topic, args);
                }
            },
            subscribe: function(topic, func) {
                if (!topics[topic]) {
                    topics[topic] = [];
                }

                var token = (++subUid).toString();
                topics[topic].push({
                    token: token,
                    func: func
                });
                return token;
            },
            unsubscribe: function(token) {
                for (var i in topics) {
                    if (topic[i]) {
                        for (var j = 0, len = topics[i].length; i < len; i++) {
                            if (topics[i][j].token === token) {
                                topics[i].splice(i, 1);
                                return token;
                            }
                        }
                    }
                }
            }
        };
    })();

    /**
     * ajax后端数据接口层
     * @return {[type]} [description]
     */
    var store = (function() {

        var config = {
            debug: true,
            key: 'abc123'
        };

        /**
         * 缓存 localStorage，主要用来缓存历史开奖结果
         */

        function dataInterface(func){
            var params = []
            for(var i = 1, l = arguments.length; i<l;i++){
                if(arguments[i].call){
                    params.push((function(callback){
                        return function(resp){
                            callback.call(callback, JSON.parse(resp));
                        }
                    }(arguments[i])));
                }else{
                    params.push(arguments[i]);
                }
            }
            func.apply(func, params);
        }

        return {
            login: function(option, callback) {

            },
            loginCheck: function(callback) {
                dataInterface(checkLogon, callback);
                // data.isLogon = Y | N;
                // data.custNum = 312312312312;
                // callback(data);
            },
            getHistory: function() {

            },
            getUsrInfo: function(custNum, callback) {
                dataInterface(getUserInfo, custNum, callback);
                // data.nickName; // 昵称 | ''
                // data.credit; // 积分 | ''
                // callback(data);
            },
            getBetInfo: function(callback) {
                dataInterface(getAllOddInfo, callback);
                /* {"BIG":"10","SMALL":"21","THREE":"205","FOUR":"4","FIVE":"205","SIX":"4","SEVEN":"205","EIGHT":"4","NINE":"205","TEN":"4","ELEVEN":"205","TWELVE":"4","THIRTEEN":"205","FOURTEEN":"4","FIFTEEN":"205","SIXTEEN":"4","SEVENTEEN":"4","EIGHTEEN":"4","SECOND":"502","LEOPARD ":"214","STRAIGHT":"47"} */
                // callback(data);
            },
            saveBet: function(callback) {
                // data 包括 custNum,time,sign time精确到秒
                // sign=custNum=6589908990&time=20140217172345&key=abc123 这是加密
                var data = {};
                data.custNum = model.usrInfo.custNum;
                data.time = date2str(new Date(), 'yyyyMMddhhmmss');
                if (config.debug) {
                    var key = config.key;
                } else {
                    var key = 0; // 线下分配的编号
                }
                data.sign = 'custNum=' + data.custNum + '&time=' + data.time + '&key=' + key;
                for (var i in model.data) {
                    data[i] = model.data[i];
                }
                dataInterface(submitWagerInfo, data, callback);
            }
        }
    }());

    /**
     * 数据模型层
     * @type {Object}
     */
    var model = {
        onceTotal: 10000,
        total: 0,
        current: 10, // default is 10
        data: [],
        usrInfo: {},
        peilv: {},
        peilvRel: {},
        records: [],
        resourceNumber : 10, // 8张图片，2个音频
        loadedNumber : 0,
        animationLevel : 'high', // | 'high'
        isLoadAudios : true
    }

    /**
     * 视图层
     */
    var view = (function(model) {
        var m = model;
        var u = m.usrInfo;
        var loginPanel = $('#loginModal');
        var loginLink = $('#j_loginLink');
        var welcomeInfo = $('#j_welcomeInfo');
        var creditInfo = $('#j_creditInfo');
        var onceTotal = $('#j_onceTotal');
        var resources = {};
        var progressBar = $('.progress');
        var mainFrame = $('.main-wrap');
        var recordCtn = $('#J_recordCtn');
        var confirmModal = $('#J_confirmModal');
        var confirmCallback = function(){};

        confirmModal.find('.j_enter').click(function(){
            confirmModal.modal('hide');
            confirmCallback.call(confirmCallback);
            return false;
        });

        var loading = {
            show : function(){
                progressBar.css('display', 'block');
                mainFrame.css('opacity', '.5');
            },
            hide : function(){
                progressBar.css('display', 'none');
                mainFrame.css('opacity', '1');
            }
        }

        var usrInfo = function() {
            loginLink.hide();
            welcomeInfo.show().children('span').html(u.nickName);
            creditInfo.html(u.credit);
        }

        var peilv = function() {
            var pl = m.peilv;
            for (var i in pl) {
                if (m.peilvRel[i]) {
                    m.peilvRel[i].find('span').html(pl[i]);
                }
            }
        }

        var betInfo = function() {
            onceTotal.html(m.total);
        }

        var clear = function() {
            for (var i in model.data) {
                if (model.peilvRel[i]) {
                    model.peilvRel[i].children('.chouma-0').remove();
                }
            }
            model.data = {};

            usrInfo();
            betInfo();
        }

        var painter = (function() {
            var canvas = document.getElementById('j_canvas'),
                pause = false,
                center = {
                    x : 137,
                    y : 102,
                    radius : 48
                };

            if(!canvasSupport()){
                view.alert('浏览器不支持canvas');
            }
            var context = canvas.getContext('2d');
            var dices = [];
            var bgimg = new Image();           

            /**
             * 骰子对象
             * @return {[type]} [description]
             */
            var dice = function(id) {
                var self = this;
                this.loc = {};
                
                this.setId(id);
                this.setNumber(6); // default is 6
                this.calcLocation();
                this.draw();
            }
            dice.prototype = {
                draw : function(){
                    context.drawImage(resources['c' + this.number], this.loc.px, this.loc.py);
                },
                calcLocation : function(){
                    this.loc.px = center.x + center.radius * Math.sin(degress_to_radians(this.rotate));
                    this.loc.py = center.y - center.radius * Math.cos(degress_to_radians(this.rotate));
                    this.loc.py -= 30;
                    this.loc.px -= 25;
                },
                run: function() {
                    var number = Math.floor(Math.random()*6) + 1;
                    this.setNumber(number); // 随机number
                    var px = this.loc.px;
                    var py = this.loc.py;

                    if(model.animationLevel === 'high'){
                        this.circleRun(); // 圆周运动
                        this.calcLocation(); //运动一次
                        if(number%2 === 0){
                            px -= Math.floor(Math.random()*20 + 1);
                            py += Math.floor(Math.random()*20 + 1);
                        }else{
                            px += Math.floor(Math.random()*20 + 1);
                            py -= Math.floor(Math.random()*20 + 1);
                        }
                    }
                    
                    context.drawImage(resources['c' + this.number], px, py);
                },
                setId : function(id){
                    this.id = id;
                    if (this.id === 0) {
                        this.rotate = 0;
                    } else if (this.id === 1) {
                        this.rotate = 120;
                    } else if (this.id === 2) {
                        this.rotate = 240;
                    }
                },
                setNumber: function(number) {
                    this.number = number;
                },
                circleRun : function(){
                    this.rotate += 10;
                    if(this.rotate >= 360){
                        this.rotate = 0;
                    }
                },
                stop : function(number){
                    this.setId(this.id);
                    this.setNumber(number);
                    this.calcLocation();
                    this.draw();
                }
            }

            function drawPan() {
                var pan = resources['pan'];
                var size = pan.width;
                var px = (canvas.width - size) / 2;
                var py = (canvas.height - size) / 2;
                context.drawImage(resources['pan'], px, py + 2);
            }

            function scaleMainFrame(){
                var mainFrame = $('.main-wrap');
                var body = $('body');
                var mainWrapW = mainFrame.width();
                var mainHeight = mainFrame.height();
                var winW = $(window).width();
                var winH = $(window).height();
                
                var scale0 = winW/mainWrapW;
                var scale1 = winH/mainHeight;

                if(scale0 > scale1){
                    var scale = scale1;
                }else{
                    var scale = scale0;
                }

                body.css('-webkit-transform', 'scale('+scale+')');
                body.css('-moz-transform', 'scale('+scale+')');
                body.css('-ms-transform', 'scale('+scale+')');
                body.css('-o-transform', 'scale('+scale+')');
                body.css('transform', 'scale('+scale+')');
            }

            return {
                init: function() {
                    drawPan();
                    dices.push(new dice(0));
                    dices.push(new dice(1));
                    dices.push(new dice(2));

                    // scaleMainFrame();
                },
                run: function() {
                    console.info('running...', this.pause);
                    if (pause) {
                        return;
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    drawPan();
                    for (var i in dices) {
                        dices[i].run();
                    }

                    this.animationFrame = requestAnimationFrame((function(painter) {
                        return function() {
                            painter.run();
                        }
                    })(this));
                },
                stop: function(data) {
                    pause = true;
                    setTimeout(function(){
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        drawPan();
                        dices[0].stop(data.firstNum);
                        dices[1].stop(data.secondNum);
                        dices[2].stop(data.threeNum);
                    });
                },
                start: function(){
                    pause = false;
                    this.run();
                }
            }
        }());

        return {
            init: function() {
                $('#J_desktop').find('[alias]').each(function() {
                    var self = $(this);
                    m.peilvRel[self.attr('alias')] = self;
                });

                var resCtn = $('#J_resources');
                resCtn.children().each(function(){
                    var self = $(this);
                    resources[self.data('name')] = new Image();
                    resources[self.data('name')].onload = function(){
                        m.loadedNumber++;
                    }
                    resources[self.data('name')].src = self.data('src');
                });

                loading.show();
            },
            usrInfo: usrInfo,
            peilv: peilv,
            betInfo: betInfo,
            clear: clear,
            gogogo: function() {
                painter.start();
            },
            stop: function(data) {
                painter.stop(data);
            },
            showHistory: function() {
                if(!m.records.length){
                    return;
                }
                var tmpl = '';
                m.records = m.records.reverse();
                for(var i in m.records){
                    var he = parseInt(m.records[i].firstNum) + parseInt(m.records[i].secondNum) + parseInt(m.records[i].threeNum);
                    tmpl += '<tr>';
                    tmpl += '<td>'+m.records[i].firstNum+','+m.records[i].secondNum+','+m.records[i].threeNum+'</td>';
                    tmpl += '<td>'+he+'</td>';
                    tmpl += '</tr>';
                    if(i >= 6){
                        break;
                    }
                }
                recordCtn.html(tmpl);
            },
            loading : loading,
            draw : function(){
                painter.init();
            },
            confirm : function(msg, callback){
                confirmModal.modal().find('.j_content').html(msg);
                confirmModal.find('.j_alert').css('display', 'none');
                confirmModal.find('.j_confirm').css('display', 'block');
                confirmCallback = callback;
            },
            alert : function(msg){
                confirmModal.modal().find('.j_content').html(msg);
                confirmModal.find('.j_alert').css('display', 'block');
                confirmModal.find('.j_confirm').css('display', 'none');
            }
        }
    }(model));

    /**
     * 业务层
     * @return {[type]} [description]
     */
    var service = (function(view) {

        function onBet(target, option) {
            if (!model.current) {
                view.view.alert('请选择筹码再投注');
                return false;
            }

            if (model.total + model.current > model.onceTotal) {
                view.alert('每轮总投入不得超过 ' + model.onceTotal + ' 哦');
                return false;
            }

            if (model.current > model.usrInfo.credit) {
                view.alert('您的积分不足 ' + model.current);
                return false;
            }

            var dom = model.peilvRel[option.key];
            var chouma = dom.children('.chouma-0');
            var itemBet = 0;
            if (dom) {
                if (chouma.length) {
                    itemBet = model.current + parseInt(chouma.html());
                    chouma.html(itemBet);

                } else {
                    itemBet = model.current;
                    dom.append('<i class="chouma chouma-0">' + itemBet + '</i>');
                }
                model.data[option.key] = itemBet;
                model.usrInfo.credit -= model.current;
                model.total += model.current;
                view.usrInfo();
                view.betInfo();
                // sound.bet();
            }
        }

        function onPickup(target, obj) {
            model.current = obj.val;
            // sound.pickUp();
        }

        function onClear() {
            model.usrInfo.credit += model.total;
            model.total = 0;

            view.clear();
        }

        function onMain(target) {
            if (!model.total) {
                view.alert('您还没有投注');
                return;
            }

            view.gogogo();
            sound.gogogo();

            store.saveBet(function(resp) {
                if (resp.isPass === 'N') {
                    view.alert(resp.msg);
                    return;
                }                

                model.usrInfo.credit = resp.credit;
                model.total = 0;
                model.records.push(resp);
                setTimeout(function() {
                    view.clear();
                    view.stop(resp);
                    sound.stop();
                    setTimeout(function(){
                        if (resp.isSuccess === 'Y') {
                            view.alert('恭喜中奖 [ 开奖号码:' + resp.firstNum + ',' + resp.secondNum + ',' +resp.threeNum + ' ]');
                            sound.win();                        
                        } else {
                            view.alert('很遗憾，没有中奖 [ 开奖号码:' + resp.firstNum + ',' + resp.secondNum + ',' +resp.threeNum + ' ]');
                        }
                    }, 200);
                }, 4000);
            });
        }

        function checkLogin() {
            store.loginCheck(function(data) {
                var u = model.usrInfo;
                if (data.isLogon === 'Y') {
                    u.custNum = data.custNum;
                    store.getUsrInfo(u.custNum, function(resp) {

                        if (resp.nickName) {
                            u.nickName = resp.nickName;
                        }

                        if (resp.credit >= 0) {
                            u.credit = resp.credit;
                        }

                        view.usrInfo();
                    });
                } else {
                    // loginPanel.modal();
                    view.alert('未登录');
                }
            });
        };

        function fetchPeilv() {
            store.getBetInfo(function(data) {
                model.peilv = data;
                view.peilv();
            });
        };

        function showHistory(){
            view.showHistory();
        }

        pubsub.subscribe('bet', onBet);
        pubsub.subscribe('pickup', onPickup);
        pubsub.subscribe('clear', onClear);
        pubsub.subscribe('gogogo', onMain);
        pubsub.subscribe('load', function() {
            checkLogin();
            fetchPeilv();
        });
        pubsub.subscribe('showHistory', showHistory);
    }(view));

    /**
     * 音效
     */
    var sound = (function() {
        var audioBet = document.getElementById('J_audioBet');
        var audioWin = document.getElementById('J_audioWin');

        return {
            init : function(){
                if(!model.isLoadAudios){
                    return;
                }
                var self = this;
                audioBet.addEventListener("canplaythrough", function () {
                    model.loadedNumber++;
                }, false);
                audioWin.addEventListener("canplaythrough", function () {
                    model.loadedNumber++;
                }, false);
                audioBet.src = $(audioBet).data('src');
                audioWin.src = $(audioWin).data('src');
            },
            pickUp: function() {
                // clearTimeout(this.timeout);
                // audio.currentTime = 0;
                // audio.play();
                // this.timeout = setTimeout(function() {
                //     audio.pause();
                // }, 800);
            },
            bet: function() {
                // clearTimeout(this.timeout);
                // audio.currentTime = 2;
                // audio.play();
                // this.timeout = setTimeout(function() {
                //     audio.pause();
                // }, 800);
            },
            gogogo: function() {
                audioBet.play();
                this.audioInterval = setInterval(function(){
                    audioBet.pause();
                    audioBet.currentTime = 0;
                    audioBet.play();
                }, 1300);
            },
            stop : function(){
                clearInterval(this.audioInterval);
                audioBet.pause();
                audioBet.currentTime = 0;
            },
            win: function(){
                audioWin.pause();
                audioWin.currentTime = 0;
                audioWin.play();
            }
        }
    }());

    /**
     * 程序主入口、事件绑定层
     * @return {[type]} [description]
     */
    var app = (function(view, sound) {
        var m = model;

        var eventBind = function() {

            $('.j_chouma').on('click', '.btn', function() {
                var self = $(this).children('input[type=radio]');
                if (self.val()) {
                    pubsub.publish('pickup', {
                        val: parseInt(self.val())
                    });
                }
            });

            $('#j_clear').bind('click', function() {
                if (!model.total) {
                    view.alert('你还没有投注');
                    return false;
                }
                view.confirm('你确定撤销所有投注？', function(){
                    pubsub.publish('clear');
                });
            });

            $('#j_btnMain').bind('click', function() {
                var self = $(this);
                if (self.is(':disabled')) {
                    return;
                }

                if (!model.total) {
                    view.alert('您还没有投注');
                    return false;
                }

                view.confirm('现在开始？', function(){
                    pubsub.publish('gogogo');
                }); 
            });

            $('#J_desktop').find('[alias]').click(function() {
                pubsub.publish('bet', {
                    key: $(this).attr('alias')
                });
            });

            $('#J_shwModalHelp').click(function(){
                $('#myModal').modal();
                return false;
            });

            $('#J_shwModalRecord').click(function(){
                $('#recordModal').modal();
                pubsub.publish('showHistory');
                return false;
            });

            pubsub.publish('load');
        }

        return {
            init: function() {
                var interval = setInterval(function() {
                    if (m.resourceNumber === m.loadedNumber) {
                        clearInterval(interval);
                        view.draw();
                        eventBind();
                        view.loading.hide();
                    }
                }, 200);
                view.init();
                sound.init();
            }
        }
    }(view, sound));
    app.init();

    // window.store = store;
    // window.view = view;
});