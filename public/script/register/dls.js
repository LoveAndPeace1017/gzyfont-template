$(function() {

    if(!!pageError) {
        tipMsg(pageError);
    }

    //点击获取验证码弹出 拼图验证
    $('.js-sendCode').on('click',function(){
        if($('input[name="mobilePhone"]').valid()){
            $('.js-sendCode').hide();
            $('#sendMobileCode').show();
            $('#sendMobileCode').click();
            // $('.pop-valid-code').fadeIn();
        }
    });
    $('body').on('click','.js-pop-close',function(){
        $('.pop-valid-code').fadeOut();
    });

    window.captcha = "";

    $('#register').validate({
        rules:{
            mobilePhone:{
                required: true,
                'mic.mobile.length': true,
                'mic.tmmobile.top': true
            },
            contacter:{
                required: true
            }

        },
        messages:{
            mobilePhone:{
                required: function(){
                    return tipMsg("手机号为必填");
                },
                'mic.tmmobile.length': function(){
                    return tipMsg("请输入11位数字");
                },
                'mic.tmmobile.top': function(){
                    return tipMsg("请输入1开头的手机号码");
                }
            },
            contacter:{
                required: function(){
                    return tipMsg("联系人为必填");
                }
            }
        },
        showErrors: function (errorMap, errorList) {
            for (var name in errorList) {
                errorList[name].message = '<i class="iconfont icon-close-circle-fill"></i>';
                if(errorList[name].method == 'mic.mobile.length'){
                    tipMsg("请输入11位数字");
                }else if(errorList[name].method == 'mic.tmmobile.top'){
                    tipMsg("请输入1开头的手机号码");
                }
            }
            this.defaultShowErrors();
        },
        errorPlacement: function (error, element) {
            $(element).closest('.field-bd').find('.instant').empty().append(error);
        },
        onfocusout: function (element) {
            $(element).closest('.field-bd').find('.instant').empty();
            $(element).valid();
        },
        onfocusin: function (element) {
            $(element).removeClass('error');
            var $instant = $(element).closest('.field-bd').find('.instant');
            $instant.empty();
        },
        onkeyup: false,
        focusInvalid: false,
        ignore:'',
        submitHandler: function (form) {
            // $('.js-register').attr('disabled',true);
            $('.js-register').addClass('btn-disabled');
            form.submit();
        }
    });

    $('#register1').validate({
        rules:{
            mobilePhone:{
                required: true,
                'mic.mobile.length': true,
                'mic.tmmobile.top': true
            },
            contacter:{
                required: true
            }

        },
        messages:{
            mobilePhone:{
                required: function(){
                    return tipMsg("手机号为必填");
                },
                'mic.tmmobile.length': function(){
                    return tipMsg("请输入11位数字");
                },
                'mic.tmmobile.top': function(){
                    return tipMsg("请输入1开头的手机号码");
                }
            },
            contacter:{
                required: function(){
                    return tipMsg("联系人为必填");
                }
            }
        },
        showErrors: function (errorMap, errorList) {
            for (var name in errorList) {
                errorList[name].message = '<i class="iconfont icon-close-circle-fill"></i>';
                if(errorList[name].method == 'mic.mobile.length'){
                    tipMsg("请输入11位数字");
                }else if(errorList[name].method == 'mic.tmmobile.top'){
                    tipMsg("请输入1开头的手机号码");
                }
            }
            this.defaultShowErrors();
        },
        errorPlacement: function (error, element) {
            $(element).closest('.field-bd').find('.instant').empty().append(error);
        },
        onfocusout: function (element) {
            $(element).closest('.field-bd').find('.instant').empty();
            $(element).valid();
        },
        onfocusin: function (element) {
            $(element).removeClass('error');
            var $instant = $(element).closest('.field-bd').find('.instant');
            $instant.empty();
        },
        onkeyup: false,
        focusInvalid: false,
        ignore:'',
        submitHandler: function (form) {
            // $('.js-register').attr('disabled',true);
            $('.js-register').addClass('btn-disabled');
            form.submit();
        }
    });

});

// 提示信息
function tipMsg(msg){
    $('.field-tip').text(msg).fadeIn();
    setTimeout(function(){
        $('.field-tip').fadeOut();
    },3000);
}




