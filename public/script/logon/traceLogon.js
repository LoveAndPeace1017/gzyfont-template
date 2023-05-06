$(function(){

    $('#loginBtn').attr('disabled',false);
    $('#loginBtn').removeClass('btn-disabled');


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
                required: "请填写身份ID",
            },
            logonPassword:{
                required: "请填写登录口令",
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

            form.submit();

            return false;
        }
    });

});
