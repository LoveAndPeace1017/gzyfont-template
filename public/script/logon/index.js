$(function(){

    var qrCodeInterval = null;

    $('.js-tab').on('click',function(){
        var tab = $(this).data('tab');
        var $node = $('.js-node["data-tab='+tab+'"]');
        $node.show();
        $node.siblings().hide();
    });

    $('.js-to-reg').on('click',function(e){
        e.preventDefault();
        location.href = $(this).attr('href') + '&mobile=' + $('#logonUserName').val();
    });

    $('#showPsw').on('click',function(){
        var type = $('#logonPassword').attr('type');
        if(type === 'password'){
            $('#logonPassword').attr('type','text');
            $(this).addClass('icon-pwd-show').removeClass('icon-pwd-hide');
        }else{
            $('#logonPassword').attr('type','password');
            $(this).addClass('icon-pwd-hide').removeClass('icon-pwd-show');
        }
    });

    $('#loginForm').validate({
        rules:{
            logonUserName:{
                required: true,
            },
            logonPassword:{
                required: true,
            },
        },
        messages:{
            logonUserName:{
                required: "请填写登录名",
            },
            logonPassword:{
                required: "请填写密码",
            },
        },

        onfocusout: function (element) {
            $('.js-err-msg').hide();
            $(element).valid();
        },
        onfocusin: function (element) {
            $(element).removeClass('error');
            $('.js-err-msg').hide();
        },
        onkeyup: false,
        focusInvalid: false,
        ignore:'',
        submitHandler: function (form) {
            $('#loginBtn').attr('disabled',true);
            $('#loginBtn').addClass('btn-disabled');

            form.submit();
        }
    });
    var timeoutHandler = null;
    var loopLogin = function(data){
        $.post('/login/qrcode',{
            qr_code:data.qrCode
        },function(res){
            if(res.retCode=='0'){
                clearTimeout(timeoutHandler);
                // location.href = '/';
            }else{
                timeoutHandler =setTimeout(function(){
                    loopLogin(data)
                },3000);
            }
        },'json');
    };
    var refreshQrCode = function(){
        $.get('/login/getQrcode',function(data){
            if (data && data.retCode == 0) {
                $('#qrcode').empty();
                $('#qrcode').qrcode({width: 145,height: 145,text: data.qrCode});
                $('.js-refresh-area').removeClass('qrcode-ope-show');
                loopLogin(data);
            }else {
                $('.js-refresh-area').addClass('qrcode-ope-show');
                alert(data.retMsg);
            }
        },'json');
    };

    $('.js-login-tab').find('li').each(function(i){
        $(this).on('click',function(){
           $(this).siblings().removeClass('cur');
           $(this).addClass('cur');
           var $item = $('.login-box-bd').eq(i);
            $('.login-box-bd').hide();
            $item.show();
            if(i===0){
                refreshQrCode();
            }else{
                clearInterval(qrCodeInterval);
            }
        });
    });

    $('.js-qrcode-refresh').on('click',function(){
        refreshQrCode();
    });
});

SSOConfig = function() {
    this.loginType = location.protocol==="http:"?0:1;//
    this.customLoginCallBack = function(loginStatus) {
        if (loginStatus.success) {
            if (loginStatus.url) {
                location.replace(loginStatus.url);
            }
            else {
                location.reload(true);
            }
        }
        else {
            $('#loginBtn').attr('disabled',false);
            $('#loginBtn').removeClass('btn-disabled');

            var errMsg = "";
            if (typeof loginStatus.reason == "string") {
                errMsg = loginStatus.reason;
            }
            else {
                errMsg = $(loginStatus.reason).find("#info").text();
            }

            switch (loginStatus.retcode) {
            case 400:
                window.location.href = location.protocol+'//membercenter.cn.made-in-china.com/reset_password_tip/';
                break;
            default:
                $("ul.login-box:visible").find("#showTipStyleError").html(errMsg).show();
                break;
            }
            $("#loadingDiv").hide();
        }

        return true;
    };
    this.customInit = function() {
        $('#loginBtn').attr('disabled',false);
        $('#loginBtn').removeClass('btn-disabled');
    };
};
window.focusSSOConfig = new SSOConfig();
focusSSOController.init();
