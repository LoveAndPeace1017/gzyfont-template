/**
 * @author qiumingsheng
 * 手机验证码先通过图形验证
 */
$(function(){

    function MobileValidateCode(options){
        options = typeof options === "undefined"?{}:options;
        this.init(options);
    };
    $.extend(MobileValidateCode.prototype,{
        init:function(options){
            this.mobileInputId = options.mobileInputId||"";//手机号码输入框ID
            this.codeInputId = options.codeInputId||""; // 验证码输入框
            this.mobileValue = options.mobileValue||"";// 传入当前手机号码
            this.needImageValidate = options.needImageValidate || false;
            this.btnId = options.btnId || '';
            this.mobileErrorClass = options.mobileErrorClass||"";//显示错误信息div的外层div的class名称
            this.needVaildateMobile = !(this.mobileInputId==""&&this.mobileValue!="");//是否需要验证手机号
            this.codeErrorClass = options.codeErrorClass||"";//显示错误信息div的外层div的class名称
            this.$sendBtn = $('#'+ options.btnId);//获取验证码的按钮
            this.$mpaneBtnId = options.mpaneBtnId?($('#'+ options.mpaneBtnId)):($('#mpanel2'));
            this.offset = options.offset||60;//设置时长
            this.unit = options.unit||'s后重新获取';//定义单位s、S、秒
            this.parameterName = options.parameterName||'mobile';//后台获取手机号码的参数名称
            this.callback = options.callback||this.defaultCallback;//回调函数
            this.counter = options.counter||this.defaultCounter;//计时函数
            this.timer = "";//计时器
            this.btnText = options.btnText||"获取验证码";//按钮默认文案
            this.errorHandler =options.errorHandler|| this.defaultErrorHandler;
            this.mobileError = "";
            this.captchaVerification = "";
            this.bindEvent();	//输入框失焦事件
            this.isSafari();	//判断是否是safari浏览器
            this.initImageValidate();
            this.customeParams = options.customeParams||{};
            this.distoryCounter = this.distoryCounter;
            this.url = options.url;
            this.isMobileValid = options.isMobileValid || this.isMobileValid;
        },
        distoryCounter:function(){
            var _this = this;
            clearInterval(_this.timer);
            _this.$sendBtn.text(_this.btnText).attr("disabled",false);
        },
        isSafari:function(){
            var browserName = navigator.userAgent.toLowerCase();
            return ((/webkit/i).test(browserName) && !(/chrome/i).test(browserName));
        },
        bindEvent:function(){
            var _this = this;
            if(this.codeInputId){
                $('#'+ this.codeInputId).on('focus',$.proxy(this.defaultSuccessHandler,this));
            }
            if(!this.needImageValidate){
                this.$sendBtn.on('click',$.proxy(this.sendRequest,this));
            }
        },
        initImageValidate:function(){
            if(this.needImageValidate){
                var _this = this;
                this.$mpaneBtnId.slideVerify({
                    captchaId: '241ca7b3-824c-4866-8194-dab50055b3a4',
                    protocol: '//',
                    watermark: ' ',
                    apiServer:'captcha.vemic.com',  //服务器请求地址;
                    product:'pop',     //展示模式
                    containerId: _this.btnId,//pop模式 必填 被点击之后出现行为验证码的元素id
                    lan: 'zh-CN',
                    /*imgSize : {       //图片的大小对象,有默认值{ width: '310px',height: '155px'},可省略
                        width: '400px',
                        height: '200px',
                    },*/
                    beforeCheck:function(){  //检验参数合法性的函数  mode ="pop"有效
                           return $('#'+ _this.mobileInputId).valid();
                    },
                    onSuccess : function(params) { //成功的回调
                          _this.captchaVerification = params.captchaVerification||'';
                          _this.sendRequest();
                    },
                    onError : function() {}        //失败的回调
                });
            }

        },
        isMobileValid:function(mobile){
            var flag = true;
            if(!this.needVaildateMobile){
                return flag;
            }
            if(mobile===""){
                this.mobileError = "请输入手机号码";
                flag = false;
            }else if(!/^[0-9]{11}$/.test(mobile)){
                this.mobileError = "手机号码应为11位数字";
                flag = false;
            }else if(!/^1[0-9]{10}$/.test(mobile)){
                this.mobileError = "请输入开头为1的手机号码";
                flag = false;
            }else{
                flag = true;
            }
            if(!flag){
                this.defaultErrorHandler({
                    retMsg:this.mobileError
                });
            }
            return flag;
        },
        valid:function(){
            var isMobileValidFlag;
            isMobileValidFlag  = true;
            if(this.mobileInputId!==""){
                isMobileValidFlag = this.isMobileValid(this.getMobile());
            }
            return isMobileValidFlag;
        },
        sendRequest:function(){
            if(!this.valid()){
                return false;
            }
            var params = $.extend({},this.customeParams);
            params[this.parameterName] = this.getMobile();
            params.captcha = window.captcha;
            params.guid = window.guid;
            this.needImageValidate?params['captchaVerification'] = this.captchaVerification: null;
            this.counter();
            $.post(this.url,params,$.proxy(this.callback,this),"json");
        },
        getMobile: function(){
            if (this.mobileInputId==="") {
                return this.mobileValue;
            }else{
                var mobile = $('#'+ this.mobileInputId).val();
                return mobile.replace(new RegExp(" ",'g'),"");
            }
        },
        defaultCallback: function(data){
            if(!!data){
                if(data.retCode !== '0'){
                    this.distoryCounter();
                    this.errorHandler(data);
                }
            }
            $('.refresh').click();
        },
        defaultCounter:function(){
            this.$sendBtn.attr("disabled",true);
            var  i = this.offset;
            var _this = this;
            this.timer = setInterval(function(){
                if(--i>0){
                    _this.$sendBtn.text(i+_this.unit);
                }else{
                    _this.distoryCounter();
                }
            },1000);
        },
        defaultErrorHandler:function(err){
            this.$sendBtn.closest('.field-bd').find('.form-error').remove();
            this.$sendBtn.closest('.field-bd').append('<div class="form-error"><i class="iconfont iconfont-error"></i>' + err.retMsg +'</div>').show()
        },
        defaultSuccessHandler: function(){
            this.$sendBtn.closest('.field-bd').find('.form-error').remove();
        }

    });

    window.MobileValidateCode = MobileValidateCode;

});
