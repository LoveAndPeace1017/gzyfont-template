/*! J2eeFAST 优化兼容IE浏览器*/
function initCssAndJs() {
    document.writeln('<link rel="stylesheet" type="text/css" href="https://captcha.vemic.com/css/fc-verify.css">');
    if (!window.CryptoJS) {
        document.writeln('<script src="/script/lib/crypto-min.js"></script>');
    }
}

initCssAndJs();

;(function ($, window, document, undefined) {

    var FCaptchaVersion = "2.0.0";

    var tip = {
        'zh-CN': '\u5411\u53f3\u6ed1\u52a8\u5b8c\u6210\u9a8c\u8bc1',
        'en-us': 'Swipe right to complete verification',
    };

    var finish_tip = {
        'zh-CN': 's \u9a8c\u8bc1\u6210\u529f',
        'en-us': 's completed',
    }

    var failed_tip = {
        'zh-CN': '\u9a8c\u8bc1\u5931\u8d25',
        'en-us': ' failed, try again',
    }

    var top_tip = {
        'zh-CN': '\u8bf7\u5b8c\u6210\u5b89\u5168\u9a8c\u8bc1',
        'en-us': 'Please complete the security verification',
    }

    var trail = []; // 鼠标移动轨迹数组
    var currentTrail = []; //当前鼠标位置信息
    var job = null; //定时器
    var focusCaptchaVerification = null;
    var riskTrigger = false;
    var needSelfAdaption = true;

    // 初始话 uuid
    uuid()

    function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var slider = 'slider' + '-' + s.join("") + '-' + Date.now();
        var point = 'point' + '-' + s.join("");
        // 判断下是否存在 slider
        //console.log(localStorage.getItem('slider'))
        if (!localStorage.getItem('slider')) {
            localStorage.setItem('slider', slider)
        }
        if (!localStorage.getItem('point')) {
            localStorage.setItem("point", point);
        }
    }

    /**
     * @word 要加密的内容
     * @keyWord String  服务器随机返回的关键字
     *  */
    function aesEncrypt(word,keyWord){
        // var keyWord = keyWord || "XwKsGlMcdPMEhR1B"
        var key = CryptoJS.enc.Utf8.parse(keyWord);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
    }

    var startX, startY;

    document.addEventListener("touchstart", function (e) {

        startX = e.targetTouches[0].pageX;
        startY = e.targetTouches[0].pageY;
    });

    document.addEventListener("touchmove", function (e) {

        var moveX = e.targetTouches[0].pageX;
        var moveY = e.targetTouches[0].pageY;

        if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
            e.preventDefault();
        }
    }, {passive: false});

    //请求图片get事件
    function getPicture(options, data, baseUrl, resolve, reject) {
        $.ajax({
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("captchaId", options.captchaId);
            },
            type: "post",
            contentType: "application/json;charset=UTF-8",
            url: baseUrl + "/captcha/get",
            data: JSON.stringify(data),
            timeout: 30000,
            cache: false,
            crossDomain: true === !(document.all),
            success: function (res) {
                resolve(res)
            },
            error: function (err) {
                reject(err)
            }
        })
    }

    //验证图片check事件
    function checkPicture(options, data, baseUrl, resolve, reject) {
        $.ajax({
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("captchaId", options.captchaId);
            },
            type: "post",
            contentType: "application/json;charset=UTF-8",
            url: baseUrl + "/captcha/check",
            timeout: options.timeout,
            data: JSON.stringify(data),
            cache: false,
            crossDomain: true === !(document.all),
            success: function (res) {
                resolve(res)
            },
            error: function (err) {
                reject(err)
            }
        })
    }

    //验证图片check事件
    function checkRisk(options, data, baseUrl, resolve, reject) {
        $.ajax({
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("captchaId", options.captchaId);
            },
            type: "post",
            contentType: "application/json;charset=UTF-8",
            url: baseUrl + "/captcha/checkRisk",
            timeout: 30000,
            data: JSON.stringify(data),
            cache: false,
            crossDomain: true === !(document.all),
            success: function (res) {
                resolve(res)
            },
            error: function (err) {
                reject(err)
            }
        })
    }

    //定义Slide的构造函数
    var Slide = function (ele, opt, domEle) {
        if (domEle) {
            this.$element = $(domEle);
        } else {
            this.$element = $('<div id="fcaptchaDiv" style="margin-top:20px;"></div>');
            $('body').append(this.$element);
        }
        let _this = this;
            this.backToken = null,
            this.moveLeftDistance = 0,
            this.secretKey = '',
            this.defaults = {
                baseUrl: "https://captcha.vemic.com/captcha",
                containerId: '',
                captchaType: "blockPuzzle",
                product: 'fixed',	//弹出式pop，固定fixed
                vOffset: 5,
                vSpace: 5,
                explain: '向右滑动完成验证',
                lan: 'zh-CN',
                timeout: 30000,
                watermark: '',
                blockSize: {
                    width: '50px',
                    height: '50px',
                },
                circleRadius: '10px',
                barSize: {
                    width: '310px',
                    height: '50px',
                },
                beforeCheck: function () {
                    return true
                },
                beforeInitCheck: function () {
                    return true;
                },
                onReady: function () {
                },
                onSuccess: function () {
                },
                onError: function () {
                },
                onInitError: function (e) {
                },
                onClose: function () {
                },
                onSystemError: function () {
                },
                show: function () {
                    _this.$element.find(".fcaptcha-mask").css("display", "block");
                },
                close: function () {
                    _this.$element.find(".fcaptcha-mask").css("display", "none");
                }
            }
        opt.baseUrl = opt.protocol + opt.apiServer;
        if (opt.imgSize) {
            needSelfAdaption = false;
        }
        this.options = $.extend({}, this.defaults, opt);
    };


    //定义Slide的方法
    Slide.prototype = {
        init: function () {
            var _this = this;
            //加载页面
            this.loadDom();
            _this.refresh(true);

            this.$element[0].onselectstart = document.body.ondrag = function () {
                return false;
            };

            if (this.options.product === 'pop') {

                _this.$element.find('.fcaptcha-verifybox-close').on('click', function () {
                    _this.$element.find(".fcaptcha-mask").css("display", "none");
                    _this.options.onClose();
                });

                var clickBtn = document.getElementById(this.options.containerId);
                clickBtn && (clickBtn.onclick = function () {
                    if (!window.FC_checkRiskTrigger) {
                        if (window.FCaptchaStopCollect) {
                            window.FCaptchaStopCollect();
                        }
                    }
                    if (window.FC_checkRiskTrigger || _this.options.beforeCheck()) {
                        if (!window.FC_checkRiskTrigger && focusCaptchaVerification) {
                            _this.options.onSuccess({'captchaVerification': focusCaptchaVerification});
                            focusCaptchaVerification = null;
                        } else {
                            if (window.FC_checkRiskTrigger) {
                                riskTrigger = true;
                                window.FC_checkRiskTrigger = false;
                            }
                            //_this.refresh();
                            _this.$element.find(".fcaptcha-mask").css("display", "block");
                        }

                    }
                })
            }

            //按下
            this.htmlDoms.move_block.on('touchstart', function (e) {
                _this.start(e);
            });

            this.htmlDoms.move_block.on('mousedown', function (e) {
                _this.start(e);
            });

            this.htmlDoms.sub_block.on('mousedown', function (e) {
                e.stopPropagation()
            });

            //拖动
            window.addEventListener("touchmove", function (e) {
                _this.move(e);
            });

            window.addEventListener("mousemove", function (e) {
                _this.move(e);
            });

            //鼠标松开
            window.addEventListener("touchend", function () {
                _this.end();
            });
            window.addEventListener("mouseup", function () {
                _this.end();
            });

            //刷新
            _this.$element.find('.fcaptcha-verify-refresh').on('click', function () {
                _this.htmlDoms.refresh.css({'pointer-events': 'none'});
                _this.htmlDoms.move_block.css({'pointer-events': 'none'});
                _this.refresh(true);
            });
            this.options.onReady();
        },

        //初始化加载
        loadDom: function () {
            this.status = false;	//鼠标状态
            this.isEnd = false;		//是够验证完成
            this.setSize = this.resetSize(this);	//重新设置宽度高度
            this.plusWidth = 0;
            this.plusHeight = 0;
            this.x = 0;
            this.y = 0;
            var panelHtml = '';
            var wrapHtml = '';
            this.lengthPercent = (parseInt(this.setSize.img_width) - parseInt(this.setSize.block_width) - parseInt(this.setSize.circle_radius) - parseInt(this.setSize.circle_radius) * 0.8) / (parseInt(this.setSize.img_width) - parseInt(this.setSize.bar_height));

            let wrapStartHtml = '<div class="fcaptcha-mask">' +
                '<div class="fcaptcha-verifybox">' +
                '<div class="fcaptcha-verifybox-top">' +
                top_tip[this.options.lan] +
                '<span class="fcaptcha-verifybox-close">' +
                '<i class="fcaptcha-iconfont fcaptcha-icon-close"></i>' +
                '</span>' +
                '</div>' +
                '<div class="fcaptcha-verifybox-bottom" style="padding:15px">' +
                '<div style="position: relative;">';

            if (this.options.product === 'pop') {
                panelHtml = wrapStartHtml;
            }
            panelHtml += '<div class="fcaptcha-verify-img-out">' +
                '<div class="fcaptcha-verify-img-panel">' +
                '<div class="fcaptcha-verify-refresh" style="z-index:3">' +
                '<i class="fcaptcha-iconfont fcaptcha-icon-refresh"></i>' +
                '</div>' +
                '<span class="fcaptcha-verify-tips"  class="fcaptcha-suc-bg"></span>' +
                '<img src="" class="fcaptcha-backImg" style="width:100%;height:100%;display:block" draggable="false">' +
                '</div>' +
                '</div>';

            this.plusWidth = parseInt(this.setSize.block_width) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;
            this.plusHeight = parseInt(this.setSize.block_height) + parseInt(this.setSize.circle_radius) * 2 - parseInt(this.setSize.circle_radius) * 0.2;

            panelHtml += '<div class="fcaptcha-verify-bar-area">' +
                '<span  class="fcaptcha-verify-msg">' + (tip[this.options.lan] || this.options.explain) + '</span>' +
                '<div class="fcaptcha-verify-left-bar">' +
                '<span class="fcaptcha-verify-msg"></span>' +
                '<div  class="fcaptcha-verify-move-block">' +
                '<i  class="fcaptcha-verify-icon fcaptcha-iconfont fcaptcha-icon-right"></i>' +
                '<div class="fcaptcha-verify-sub-block">' +
                '<img src="" class="fcaptcha-bock-backImg" alt=""  style="width:100%;height:100%;display:block" draggable="false">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            let wrapEndHtml = '</div></div></div></div>';
            if (this.options.product === 'pop') {
                panelHtml += wrapEndHtml;
            }

            this.$element.append(panelHtml);
            this.htmlDoms = {
                tips: this.$element.find('.fcaptcha-verify-tips'),
                sub_block: this.$element.find('.fcaptcha-verify-sub-block'),
                out_panel: this.$element.find('.fcaptcha-verify-img-out'),
                img_panel: this.$element.find('.fcaptcha-verify-img-panel'),
                img_canvas: this.$element.find('.fcaptcha-verify-img-canvas'),
                bar_area: this.$element.find('.fcaptcha-verify-bar-area'),
                move_block: this.$element.find('.fcaptcha-verify-move-block'),
                left_bar: this.$element.find('.fcaptcha-verify-left-bar'),
                msg: this.$element.find('.fcaptcha-verify-msg'),
                icon: this.$element.find('.fcaptcha-verify-icon'),
                refresh: this.$element.find('.fcaptcha-verify-refresh'),
                verify_box: this.$element.find('.fcaptcha-verifybox'),
                close: this.$element.find('.fcaptcha-verifybox-close')
            };

            this.$element.css('position', 'relative');

            this.htmlDoms.sub_block.css({
                'height': this.setSize.img_height,
                'width': Math.floor(parseInt(this.setSize.img_width) * 47 / 310) + 'px',
                'top': -(parseInt(this.setSize.img_height) + this.options.vSpace) + 'px'
            })
            this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + this.options.vSpace + 'px');
            this.htmlDoms.img_panel.css({'width': this.setSize.img_width, 'height': this.setSize.img_height});
            this.htmlDoms.bar_area.css({
                'width': this.setSize.img_width,
                'height': this.setSize.bar_height,
                'line-height': this.setSize.bar_height
            });
            this.htmlDoms.move_block.css({'width': this.setSize.bar_height, 'height': this.setSize.bar_height});
            this.htmlDoms.left_bar.css({'width': this.setSize.bar_height, 'height': this.setSize.bar_height});
            this.htmlDoms.verify_box.css({'width': this.setSize.img_width + 30 + 'px'});

            let _this = this;
            if (needSelfAdaption) {
                window.addEventListener("resize", function (e) {
                    _this.setSize = _this.resetSize(_this);
                    _this.htmlDoms.sub_block.css({
                        'height': _this.setSize.img_height,
                        'width': Math.floor(parseInt(_this.setSize.img_width) * 47 / 310) + 'px',
                        'top': -(parseInt(_this.setSize.img_height) + _this.options.vSpace) + 'px'
                    })
                    _this.htmlDoms.out_panel.css('height', parseInt(_this.setSize.img_height) + _this.options.vSpace + 'px');
                    _this.htmlDoms.img_panel.css({'width': _this.setSize.img_width, 'height': _this.setSize.img_height});
                    _this.htmlDoms.bar_area.css({
                        'width': _this.setSize.img_width,
                        'height': _this.setSize.bar_height,
                        'line-height': _this.setSize.bar_height
                    });
                    _this.htmlDoms.move_block.css({'width': _this.setSize.bar_height, 'height': _this.setSize.bar_height});
                    _this.htmlDoms.left_bar.css({'width': _this.setSize.bar_height, 'height': _this.setSize.bar_height});
                    _this.htmlDoms.verify_box.css({'width': _this.setSize.img_width + 30 + 'px'});
                });
            }
        },


        //鼠标按下
        start: function (e) {
            let _this = this;
            if (!e.originalEvent.targetTouches) {    //兼容移动端
                var x = e.clientX;
                var y = e.clientY;
            } else {     //兼容PC端
                var x = e.originalEvent.targetTouches[0].pageX;
                var y = e.originalEvent.targetTouches[0].pageY;
            }
            _this.job = setInterval( function () {
                if (_this.currentTrail && _this.currentTrail.length > 0) {
                    _this.trail.push(_this.currentTrail);
                }
            }, 20);
            this.startLeft = Math.floor(x - this.htmlDoms.bar_area[0].getBoundingClientRect().left);
            this.startMoveTime = new Date().getTime();
            if (this.isEnd === false) {
                this.htmlDoms.msg.text('');
                this.htmlDoms.move_block.css('background-color', '#337ab7');
                //this.htmlDoms.left_bar.css('border-color', '#337AB7');
                this.htmlDoms.icon.css('color', '#fff');
                e.stopPropagation();
                e.preventDefault();
                this.status = true;
            }
        },

        //鼠标移动
        move: function (e) {
            if (this.status && this.isEnd === false) {
                let x, y;
                if (!e.touches) {    //兼容移动端
                    x = e.clientX;
                    y = e.clientY;
                } else {     //兼容PC端
                    x = e.touches[0].pageX;
                    y = e.touches[0].pageY;
                }
                this.logTrail([x, y]);
                var bar_area_left = this.htmlDoms.bar_area[0].getBoundingClientRect().left;
                var move_block_left = x - this.startLeft; //小方块相对于父元素的left值
                if (move_block_left >= (bar_area_left + parseInt(this.setSize.img_width) - parseInt(this.setSize.bar_height))) {
                    move_block_left = bar_area_left + parseInt(this.setSize.img_width) - parseInt(this.setSize.bar_height);
                }
                if (move_block_left <= bar_area_left) {
                    move_block_left = bar_area_left;
                }
                //拖动后小方块的left值
                this.htmlDoms.move_block.css('left', move_block_left - bar_area_left + "px");
                this.htmlDoms.left_bar.css('width', move_block_left - bar_area_left + "px");
                //this.htmlDoms.sub_block.css('left', "0px");
                this.moveLeftDistance = move_block_left - bar_area_left;
            }
        },

        //鼠标松开
        end: function () {
            clearInterval(this.job);
            this.endMovetime = new Date().getTime();
            var _this = this;

            //判断是否重合
            if (this.status && this.isEnd === false) {
                _this.htmlDoms.move_block.css({'pointer-events': 'none'});
                _this.htmlDoms.refresh.css({'pointer-events': 'none'});
                _this.htmlDoms.close.css({'pointer-events': 'none'});
                var vOffset = parseInt(this.options.vOffset);
                this.moveLeftDistance = this.moveLeftDistance * 310 / parseInt(this.setSize.img_width)
                //图片滑动

                var data = {
                    captchaType: this.options.captchaType,
                    pointJson: this.secretKey ? aesEncrypt(JSON.stringify({
                        x: this.moveLeftDistance,
                        y: 5.0
                    }), this.secretKey) : JSON.stringify({x: this.moveLeftDistance, y: 5.0}),
                    encryptedCaptchaTrailInfo: this.secretKey ? aesEncrypt(JSON.stringify(_this.trail), this.secretKey) : '',
                    riskKey: localStorage.getItem('riskKey'),
                    token: this.backToken,
                    version: FCaptchaVersion,
                    browserFinger: window.FCaptchaBrowserFinger ? window.FCaptchaBrowserFinger : null,
                    lastFinger: localStorage.getItem('lastFinger'),
                    visitUrl: window.location.protocol+"//"+window.location.host+window.location.pathname,
                    //robot: this.options.robot,
                    clientUid: localStorage.getItem('slider'),
                    ts: Date.now()
                }
                var captchaVerification = this.secretKey ? aesEncrypt(this.backToken + '---' + JSON.stringify({
                    x: this.moveLeftDistance,
                    y: 5.0
                }), this.secretKey) : this.backToken + '---' + JSON.stringify({x: this.moveLeftDistance, y: 5.0})
                checkPicture(this.options, data, this.options.baseUrl, function (res) {
                    // 请求反正成功的判断
                    if (res.repCode === "0000") {
                        localStorage.removeItem('fcHighCaptcha');
                        _this.htmlDoms.move_block.css('background-color', '#5cb85c');
                        //_this.htmlDoms.left_bar.css({'border-color': '#5cb85c'});
                        _this.htmlDoms.icon.css('color', '#fff');
                        _this.htmlDoms.icon.removeClass('fcaptcha-icon-right');
                        _this.htmlDoms.icon.addClass('fcaptcha-icon-check');
                        //提示框
                        _this.htmlDoms.tips.addClass('fcaptcha-suc-bg').removeClass('fcaptcha-err-bg')
                        // _this.htmlDoms.tips.css({"display":"block",animation:"move 1s cubic-bezier(0, 0, 0.39, 1.01)"});
                        _this.htmlDoms.tips.animate({"bottom": "0px"});
                        _this.htmlDoms.tips.text(((_this.endMovetime - _this.startMoveTime) / 1000).toFixed(2) + finish_tip[_this.options.lan]);
                        _this.isEnd = true;
                        setTimeout(function () {
                            _this.$element.find(".fcaptcha-mask").css("display", "none");
                            // _this.htmlDoms.tips.css({"display":"none",animation:"none"});
                            _this.htmlDoms.tips.animate({"bottom": "-37px"});
                            if (!riskTrigger) {
                                _this.options.onSuccess({'captchaVerification': captchaVerification});
                            } else {
                                focusCaptchaVerification = captchaVerification;
                                riskTrigger = false;
                                setTimeout(function () {
                                    focusCaptchaVerification = null;
                                }, 179000);
                            }
                            _this.refresh(true);
                        }, 1000)
                    } else {
                        _this.htmlDoms.move_block.css('background-color', '#d9534f');
                        //_this.htmlDoms.left_bar.css('border-color', '#d9534f');
                        _this.htmlDoms.icon.css('color', '#fff');
                        _this.htmlDoms.icon.removeClass('fcaptcha-icon-right');
                        _this.htmlDoms.icon.addClass('fcaptcha-icon-close');

                        _this.htmlDoms.tips.addClass('fcaptcha-err-bg').removeClass('fcaptcha-suc-bg')
                        // _this.htmlDoms.tips.css({"display":"block",animation:"move 1.3s cubic-bezier(0, 0, 0.39, 1.01)"});
                        _this.htmlDoms.tips.animate({"bottom": "0px"});
                        _this.htmlDoms.tips.text(failed_tip[_this.options.lan])
                        setTimeout(function () {
                            let needGetNewPicture = false;
                            if (res.repCode === "6110") {
                                needGetNewPicture = true;
                            }
                            _this.refresh(needGetNewPicture);
                            _this.htmlDoms.tips.animate({"bottom": "-37px"});
                            _this.htmlDoms.move_block.css({'pointer-events': 'auto'});
                            _this.htmlDoms.refresh.css({'pointer-events': 'auto'});
                            _this.htmlDoms.close.css({'pointer-events': 'auto'});
                        }, 1000);

                        // setTimeout(function () {
                        // 	// _this.htmlDoms.tips.css({"display":"none",animation:"none"});
                        // },1300)
                        _this.options.onError(new Error('check error'));
                    }
                }, function (e) {
                    _this.options.onSystemError(e);
                })
                this.status = false;
                _this.trail = [];
                _this.currentTrail = [];
            }
        },

        logTrail: function (pointXY) {
            this.currentTrail = pointXY
        },

        resetSize: function (obj) {
            var img_width, img_height, bar_width, bar_height, block_width, block_height, circle_radius;	//图片的宽度、高度，移动条的宽度、高度
            var parentWidth = obj.$element.parent().width() || $(window).width();
            var parentHeight = obj.$element.parent().height() || $(window).height();

            if (!needSelfAdaption) {
                // 自定义图片大小
                img_width = obj.options.imgSize.width;
                img_height = obj.options.imgSize.height;
            } else {
                // 根据屏幕大小自适应
                if (parentWidth < 300) {
                    img_width = 250;
                    img_height = 125;
                } else if (parentWidth >= 300 && parentWidth < 600) {
                    img_width = 280;
                    img_height = 140;
                } else if (parentWidth >= 600 && parentWidth < 960) {
                    img_width = 300;
                    img_height = 150;
                } else if (parentWidth >= 960 && parentWidth < 1200) {
                    img_width = 320;
                    img_height = 160;
                } else if (parentWidth >= 1200 && parentWidth < 1600) {
                    img_width = 340;
                    img_height = 170;
                } else if (parentWidth >= 1600 && parentWidth < 2000) {
                    img_width = 360;
                    img_height = 180;
                } else if (parentWidth >= 2000 && parentWidth < 2400) {
                    img_width = 380;
                    img_height = 190;
                } else {
                    img_width = 400;
                    img_height = 200;
                }
            }
            this.options.imgSize = {
                width: img_width + 'px',
                height: img_height + 'px'
            };
            let height = Math.floor(img_width * 47 / 310) + 'px';
            this.options.barSize.height = height;
            this.options.blockSize.height = height;
            bar_height = height;
            block_height = height;

            return {
                img_width: img_width,
                img_height: img_height,
                bar_width: bar_width,
                bar_height: bar_height,
                block_width: block_width,
                block_height: block_height,
                circle_radius: circle_radius
            };
        },

        //刷新
        refresh: function (needGetNewPicture) {
            var _this = this;
            this.$element.find('.fcaptcha-verify-msg:eq(1)').text('');
            this.$element.find('.fcaptcha-verify-msg:eq(1)').css('color', '#000');
            if (!needGetNewPicture) {
                this.htmlDoms.move_block.animate({'left': '0px'}, 'fast');
                this.htmlDoms.move_block.css('background-color', '#fff');
                this.htmlDoms.left_bar.animate({'width': parseInt(this.setSize.bar_height)}, 'fast');
                this.htmlDoms.left_bar.css({'border-color': '#ddd'});
            }
            this.htmlDoms.icon.css('color', '#000');
            this.htmlDoms.icon.removeClass('fcaptcha-icon-close');
            this.htmlDoms.icon.addClass('fcaptcha-icon-right');
            this.$element.find('.fcaptcha-verify-msg:eq(0)').text(tip[this.options.lan] || this.options.explain);
            this.isEnd = false;
            if (needGetNewPicture) {
                this.htmlDoms.move_block.css({'left': '0px', 'background-color': '#fff'});
                this.htmlDoms.left_bar.css({'width': parseInt(this.setSize.bar_height), 'border-color': '#ddd'});
                getPicture(this.options,{
                    captchaType: "blockPuzzle",
                    clientUid: localStorage.getItem('slider'),
                    highCaptcha: localStorage.getItem('fcHighCaptcha'),
                    version: FCaptchaVersion,
                    ts: Date.now()
                }, this.options.baseUrl, function (res) {
                    if (res.repCode === "0000") {
                        let backImgLoaded = false;
                        let bockBackImgLoaded = false;
                        let backImg = new Image();
                        let bockBackImg = new Image();
                        backImg.style = "width:100%;height:100%;display:block";
                        backImg.draggable = false;
                        backImg.className = "fcaptcha-backImg";
                        bockBackImg.className = "fcaptcha-bock-backImg";
                        bockBackImg.style = "width:100%;height:100%;display:block";
                        bockBackImg.draggable = false;
                        backImg.onload = function () {
                            backImgLoaded = true;
                            if (bockBackImgLoaded) {
                                _this.$element.find(".fcaptcha-bock-backImg")[0].replaceWith(bockBackImg);
                                _this.$element.find(".fcaptcha-backImg")[0].replaceWith(backImg);
                            }
                        }
                        backImg.onerror = function () {
                            _this.options.onSystemError('get pic error');
                        }
                        bockBackImg.onload = function () {
                            bockBackImgLoaded = true;
                            if (backImgLoaded) {
                                _this.$element.find(".fcaptcha-bock-backImg")[0].replaceWith(bockBackImg);
                                _this.$element.find(".fcaptcha-backImg")[0].replaceWith(backImg);
                            }
                        }
                        bockBackImg.onerror = function () {
                            _this.options.onSystemError('get pic error');
                        }
                        backImg.src = _this.options.baseUrl + res.repData.originalImageUrl;
                        bockBackImg.src = _this.options.baseUrl + res.repData.jigsawImageUrl;
                        //_this.$element.find(".fcaptcha-bock-backImg")[0].src = _this.options.baseUrl + res.repData.jigsawImageUrl;
                        //_this.$element.find(".fcaptcha-backImg")[0].src = _this.options.baseUrl + res.repData.originalImageUrl;
                        _this.secretKey = res.repData.secretKey;
                        _this.backToken = res.repData.token;
                        _this.htmlDoms.refresh.css({'pointer-events': 'auto'});
                        _this.htmlDoms.move_block.css({'pointer-events': 'auto'});
                        _this.htmlDoms.close.css({'pointer-events': 'auto'});
                    } else {
                        _this.$element.find(".fcaptcha-backImg")[0].src = 'https://captcha.vemic.com/images/default.jpg';
                        _this.$element.find(".fcaptcha-bock-backImg")[0].src = '';
                        _this.htmlDoms.tips.addClass('fcaptcha-err-bg').removeClass('fcaptcha-suc-bg');
                        _this.htmlDoms.tips.animate({"bottom": "0px"});
                        _this.htmlDoms.tips.text(res.repMsg);
                        setTimeout(function () {
                            _this.htmlDoms.tips.animate({"bottom": "-37px"});
                        }, 1000);
                        _this.options.onSystemError(new Error('get picture error'));
                    }
                    _this.trail = []
                    _this.currentTrail = []
                }, function (e) {
                    _this.options.onSystemError(e);
                });
            }
            //this.htmlDoms.sub_block.css('left', "0px");
        },
    };

    var FCaptchaInitFunc = function (options, domEle) {
        // check options
        if (!(!!options.captchaId && !!options.protocol && !!options.apiServer && !!options.product)) {
            options.onInitError(new Error('参数缺失!'));
            return;
        }
        var slide = new Slide(this, options, domEle);
        checkRisk(slide.options, {
            captchaId: options.captchaId,
            version: FCaptchaVersion
        }, slide.options.baseUrl, function (res) {
            if (res.code) {
                options.onInitError(new Error(res.message));
            }
            if (res.repData && res.repData.safeVisitor) {
                slide.options.onSuccess({'captchaVerification': res.repData.captchaVerification});
            } else {
                try {
                    if (slide.options.product === "pop" && slide.options.beforeInitCheck()) {
                        slide.init();
                    } else if (slide.options.product === "fixed") {
                        slide.init();
                    }
                } catch (e) {
                    options.onInitError(e);
                }
            }
        }, function (error) {
            slide.options.onInitError(error);
        })
        window.focusCaptcha = slide;
        return slide.options;
    };

    //在插件中使用slideVerify对象
    $.fn.slideVerify = FCaptchaInitFunc;
    window.FCaptcha = FCaptchaInitFunc;

})(jQuery, window, document);
