'use strict';

var _createClass = function () {
        function defineProperties(target, props) { 
           for(var i = 0; i < props.length; i++) {    
              var descriptor = props[i]; 
              //限制其可否进行for-in循环
              descriptor.enumerable = descriptor.enumerable || false;
              //能否更改属性特性 
              descriptor.configurable = true; 
              if ("value" in descriptor) 
              descriptor.writable = true; 
              Object.defineProperty(target, descriptor.key, descriptor); 
            } 
        } 
        return function (Constructor, protoProps, staticProps) { 
            if (protoProps) defineProperties(Constructor.prototype, protoProps); 
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor; 
        };
}();

function _classCallCheck(instance, Constructor){ 
    if (!(instance instanceof Constructor)){ 
        throw new TypeError("Cannot call a class as a function"); 
    } 
}

(function (window) {
  //55,45
  var l = 42,
  // 滑块边长
  r = 9,
  // 滑块半径
  w = 370,
  // canvas宽度
  h = 160,
  // canvas高度
  defaultScaleRage = 1,
  // 缩放比例
  lWidth = 55,
  lHeight = 45;
  // block的原始长宽

  var L = l + r * 2 + 3; // 滑块实际边长

  function createCanvas(width, height) {
    var canvas = createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }


  function createElement(tagName, className) {
    var elment = document.createElement(tagName);
    elment.className = className;
    return elment;
  }
  //不支持element.classList方法的兼容写法（ie10及以下）
    if (!("classList" in document.documentElement)) {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(/\s+/g),
                            index = classes.indexOf(value);

                        fn(classes, index, value);
                        self.className = classes.join(" ");
                    }
                }

                return {
                    add: update(function(classes, index, value) {
                        if (!~index) classes.push(value);
                    }),

                    remove: update(function(classes, index) {
                        if (~index) classes.splice(index, 1);
                    }),

                    toggle: update(function(classes, index, value) {
                        if (~index)
                            classes.splice(index, 1);
                        else
                            classes.push(value);
                    }),

                    contains: function(value) {
                        return !!~self.className.split(/\s+/g).indexOf(value);
                    },

                    item: function(i) {
                        return self.className.split(/\s+/g)[i] || null;
                    }
                };
            }
        });
    }

  function addClass(tag, className) {
    tag.classList.add(className);
  }

  function removeClass(tag, className) {
    tag.classList.remove(className);
  }

  function getRandomImg() {
    var obj = {};
    $.ajax({
        url:'/login/sildingImage/show',
        async:false,
        dataType:"json",
        success:function(data){
          obj = data.svc;
          obj.baseImage = "data:image/png;base64,"+obj.baseImage;
          obj.baseSlidingImage = "data:image/png;base64,"+obj.baseSlidingImage;
        }
    });
    return obj;
  }


  function sum(x, y) {
    return x + y;
  }

  function square(x) {
    return x * x;
  }

  var jigsaw = function () {
    function jigsaw(_ref) {
      var el = _ref.el,
          onSuccess = _ref.onSuccess,
          onFail = _ref.onFail,
          onRefresh = _ref.onRefresh,
          Height = _ref.h || h,
          Width = _ref.w || w

      _classCallCheck(this, jigsaw);

      // el.style.position = el.style.position || 'relative';
      this.el = el;
      this.onSuccess = onSuccess;
      this.onFail = onFail;
      this.onRefresh = onRefresh;
      this.Height = Height;
      this.Width = Width>=w?w:Width; // canvas宽度最大值370
      this.wScaleRage = this.Width/w || defaultScaleRage;
    }

    _createClass(jigsaw, [{
      key: 'init',
      value: function init() {
        this.initDOM();
        this.initImg();
        this.bindEvents();
      }
    }, {
      key: 'initDOM',
      value: function initDOM() {
        var canvas = createCanvas(this.Width, this.Height); // 画布
        // var block = canvas.cloneNode(true); // 滑块
        var block = createCanvas(this.Width,45); // 滑块
        var sliderContainer = createElement('div', 'slider-container');
        var sliderMask = createElement('div', 'slider-mask');
        var slider = createElement('div', 'slider');
        // var sliderIconInner = createElement('i', 'iconfont icon-doubleright');
        // var sliderIcon = createElement('span', 'slider-icon');
        var sliderIcon = createElement('i', 'iconfont icon-doubleright');
        var text = createElement('span', 'slider-text');
        var refreshIcon = createElement('span', 'refresh');
        var refreshIconInner = createElement('i', 'iconfont icon-reload');
        var header = createElement('div', 'pop-hd');
        var title = createElement('h3');
        title.innerHTML = '完成拼图验证码';
        var close = createElement('i', 'iconfont icon-close js-pop-close');
        var body = createElement('div', 'pop-bd');

        block.className = 'block';
        text.innerHTML = '向右滑动填充拼图';
        refreshIcon.innerHTML = '换一换';

        var el = this.el;
        el.className="pop-valid-code";

        refreshIcon.appendChild(refreshIconInner);
        header.appendChild(title);
        header.appendChild(refreshIcon);
        header.appendChild(close);
        el.appendChild(header);
        body.appendChild(canvas);
        body.appendChild(block);
        el.appendChild(body);
        // sliderIcon.appendChild(sliderIconInner);
        slider.appendChild(sliderIcon);
        sliderMask.appendChild(slider);
        sliderContainer.appendChild(sliderMask);
        sliderContainer.appendChild(text);
        el.appendChild(sliderContainer);

        //20181113
        // 不支持assign方法的兼容写法
        if (typeof Object.assign != 'function') {
    		  // Must be writable: true, enumerable: false, configurable: true
    		  Object.defineProperty(Object, "assign", {
    		    value: function assign(target, varArgs) { // .length of function is 2
    		      'use strict';
    		      if (target == null) { // TypeError if undefined or null
    		        throw new TypeError('Cannot convert undefined or null to object');
    		      }

    		      var to = Object(target);

    		      for (var index = 1; index < arguments.length; index++) {
    		        var nextSource = arguments[index];

    		        if (nextSource != null) { // Skip over if undefined or null
    		          for (var nextKey in nextSource) {
    		            // Avoid bugs when hasOwnProperty is shadowed
    		            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
    		              to[nextKey] = nextSource[nextKey];
    		            }
    		          }
    		        }
    		      }
    		      return to;
    		    },
    		    writable: true,
    		    configurable: true
    		  });
    		}

        Object.assign(this, {
          canvas: canvas,
          block: block,
          sliderContainer: sliderContainer,
          refreshIcon: refreshIcon,
          slider: slider,
          sliderMask: sliderMask,
          sliderIcon: sliderIcon,
          text: text,
          canvasCtx: canvas.getContext('2d'),
          blockCtx: block.getContext('2d')
        });
      }
    }, {
      key: 'initImg',
      value: function initImg() {
        var _this = this;
        var imgData = getRandomImg();
        this.baseImage = imgData.baseImage;
        this.baseSlidingImage = imgData.baseSlidingImage;
        this.x = imgData.showSildingImageX;
        this.y = imgData.showSildingImageY;
        this.uID = imgData.uID;
        this.imageUID = imgData.imageUID;
          window.guid = this.uID;


        var img = createElement('img');
        var imgBlock = createElement('img');
        //canvas操作外来图片必须进行开启跨域功能
        img.crossOrigin = "Anonymous";
        imgBlock.crossOrigin = "Anonymous";

        img.onerror = function () {
            // img.src = getRandomImg();
            var data = getRandomImg();
            img.src = data.baseImage;
        };
        img.src = this.baseImage;
        imgBlock.src = this.baseSlidingImage;

          img.onload = function () {
          _this.canvasCtx.drawImage(img, 0, 0, _this.Width, h);
          var rangeW = Math.round(lWidth*_this.wScaleRage);
          _this.blockCtx.drawImage(imgBlock, 0, 0, rangeW, lHeight);
          $('.block').css({
              top:_this.y
          });

        };
        this.img = img;
        this.imgBlock = imgBlock
      }
    },  {
      key: 'clean',
      value: function clean() {
        this.canvasCtx.clearRect(0, 0, this.Width, this.Height);
        this.blockCtx.clearRect(0, 0, this.Width, this.Height);
        this.block.width = this.Width;
      }
    }, {
      key: 'bindEvents',
      value: function bindEvents() {
        var _this2 = this;

        this.el.onselectstart = function () {
          return false;
        };
        this.refreshIcon.onclick = function () {
          _this2.reset();
          typeof _this2.onRefresh === 'function' && _this2.onRefresh();
        };

        var originX = void 0,
            originY = void 0,
            trail = [],
            isMouseDown = false;

        var handleDragStart = function handleDragStart(e) {
          originX = e.clientX || e.touches[0].clientX;
          originY = e.clientY || e.touches[0].clientY;
          isMouseDown = true;
        };

        var handleDragMove = function handleDragMove(e) {
          if (!isMouseDown) return false;
          var eventX = e.clientX || e.touches[0].clientX;
          var eventY = e.clientY || e.touches[0].clientY;
          var moveX = eventX - originX;
          var moveY = eventY - originY;
          if (moveX < 0 || moveX + 38 >= _this2.Width) return false;
          _this2.slider.style.left = moveX + 'px';
          var blockLeft = (_this2.Width - 55*_this2.wScaleRage) / (_this2.Width - 40) * moveX;
          _this2.block.style.left = blockLeft + 'px';

          addClass(_this2.sliderContainer, 'sliderContainer_active');
          _this2.sliderMask.style.width = moveX + 'px';
          trail.push(moveY);
        };

        var handleDragEnd = function handleDragEnd(e) {
          if (!isMouseDown) return false;
          isMouseDown = false;
          var eventX = e.clientX || e.changedTouches[0].clientX;
          if (eventX == originX) return false;
          removeClass(_this2.sliderContainer, 'sliderContainer_active');
          _this2.trail = trail;

          var _verify = _this2.verify(),
              left = Math.round(_verify.left/_this2.wScaleRage),
              verified = _verify.verified;

          if (verified) {
            $.post('/login/sildingImage/validate',{
                uid:_this2.uID,
                imageUID:_this2.imageUID,
                slidingWidth:left,
            },function(data){
                if(data.retCode==="0"){
                    addClass(_this2.sliderContainer, 'sliderContainer_fail');
                    _this2.text.innerHTML = '验证失败，再试一次';
                    _this2.reset();
                }else{
                    window.captcha = data.captcha;
                    addClass(_this2.sliderContainer, 'sliderContainer_success');
                    typeof _this2.onSuccess === 'function' && _this2.onSuccess();
                }
              });

          } else {
            addClass(_this2.sliderContainer, 'sliderContainer_fail');
            // _this2.text.innerHTML = '再试一次';
            _this2.reset();
          }

        };
        this.slider.addEventListener('mousedown', handleDragStart);
        this.slider.addEventListener('touchstart', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
      }
    }, {
      key: 'verify',
      value: function verify() {
        var arr = this.trail; // 拖动时y轴的移动距离
        var average = arr.reduce(sum) / arr.length;
        var deviations = arr.map(function (x) {
          return x - average;
        });
        var stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
        return {
          left: parseInt(this.block.style.left),
          verified: stddev !== 0 // 简单验证下拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
        };
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.sliderContainer.className = 'slider-container';
        this.slider.style.left = 0;
        this.block.style.left = 0;
        this.sliderMask.style.width = 0;
        this.clean();
        var data = getRandomImg()
        this.img.src = data.baseImage;
          this.imgBlock.src = data.baseSlidingImage;
          this.x = data.showSildingImageX;
          this.y = data.showSildingImageY;
          this.uID = data.uID;
          this.imageUID = data.imageUID;
          window.guid = this.uID;
          $('.block').css({
              top:this.y
          });

      }
    }]);

    return jigsaw;
  }();

  window.jigsaw = {
    init: function init(opts) {
      return new jigsaw(opts).init();
    }
  };
})(window);
