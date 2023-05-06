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
            $(element).valid();
        },
        onfocusin: function (element) {
            $(element).removeClass('error');
        },
        onkeyup: false,
        focusInvalid: false,
        ignore:'',
        submitHandler: function (form) {
            $('#loginBtn').attr('disabled',true);
            $('#loginBtn').addClass('btn-disabled');

            // 以#zzzabiz结尾的用户名不走cd
            if($("#logonUserName").val().length > 8 && $("#logonUserName").val().slice(-8) === '#zzzabiz') {
                form.submit();
            } else {
                var tab = 'miccn';
                $.getJSON(location.protocol+'//membercenter.cn.made-in-china.com/ajax/check/name/?jsoncallback=?', {
                    'logonUserName': $("#logonUserName").val(),
                    'abizTabFlag': "0",
                    't': new Date().getTime()
                }, function(data) {
                    if (data && data.rtnMsg == "abiz") {
                        tab = 'abiz';
                    }

                    focusSSOController.loginExtraQuery = {
                        sucurl: $("#baseNextPage").val(),
                    };
                    var $validateNumber =$('input[name="validateCode"]:visible');
                    if($validateNumber.length>0){
                        focusSSOController.loginExtraQuery.validateNumber = $validateNumber.val();
                    }
                    focusSSOController.login($("#logonUserName").val(), $("#logonPassword").val(), 'jxc',tab);
                });
            }
            return false;
        }
    });
    var timeoutHandler = null;
    var loopLogin = function(data){
        $.post('/login/qrcode',{
            qr_code:data.qrCode
        },function(res){
            if(res.retCode=='0'){
                clearTimeout(timeoutHandler);
                location.href = '/';
                // focusSSOController.loginExtraQuery = {
                //     sucurl: $("#baseNextPage").val()
                // };
                // focusSSOController.login("", "", 'jxc', 'abiz', $ticket);

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
            if(loginStatus.valid){
                $('#validateLi').show();
                getValidateImage();
            }

            switch (loginStatus.retcode) {
            case 400:
                window.location.href = location.protocol+'//membercenter.cn.made-in-china.com/reset_password_tip/';
                break;
            default:
                $(".js-err-msg").find("span").html(errMsg);
                $(".js-err-msg").show();
                break;
            }
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

function getValidateImage(){
    var url = location.protocol + '//cd.abiz.com/validcode?t='+Math.random()*1000;
    $('#validImage').html('<img src="'+url+'" id="validate" width="112" height="28">');
}