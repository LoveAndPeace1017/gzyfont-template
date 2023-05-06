$(function() {
    let areaGroup = [];

    $('#showPsw').on('click',function(){
       var type = $('#password').attr('type');
       if(type === 'password'){
           $('#password').attr('type','text');
           $(this).addClass('icon-pwd-show').removeClass('icon-pwd-hide');
       }else{
           $('#password').attr('type','password');
           $(this).addClass('icon-pwd-hide').removeClass('icon-pwd-show');
       }
    });

    var canSubmitShow = function(){
        var pwd = $('#password').val();
        var code = $('input[name="code"]').val();
        var companyContacts = $('input[name="companyContacts"]').val();
        var province = $('#province').val();
        var city = $('#city').val();
        if(pwd!==""&&pwd.length>=6&&code!==""&&code.length===6&&companyContacts!==""&&province!==''&&city!==''){
            return true;
        }
        return false;
    };

    var setRegisterBtnDisabled = function () {
        if(canSubmitShow()){
            $('.js-register').attr('disabled',false).removeClass('btn-disabled');
        }else{
            $('.js-register').attr('disabled',true).addClass('btn-disabled');
        }
    };

    var getArea = function() {
        $.get('/register/area',function(data){
            if(data && data.retCode === '0'){
                areaGroup = data.list;
                $('#province').html('<option value="">--选择省--</option>');
                for(let i = 0; i < areaGroup.length; i++){
                    $('#province').append('<option value='+ areaGroup[i].label +'>'+areaGroup[i].label+'</option>');
                }
            }
        },'json');
    };

    getArea();

    $('#province').on('change', function () {
        $('#city').html('<option value="">--选择市--</option>');
        if($(this).val() !== ''){
            let cityGroup = areaGroup.filter(item => item.label === $(this).val())[0].children;
            for(let i = 0; i < cityGroup.length; i++){
                $('#city').append('<option value='+ cityGroup[i].label +'>'+cityGroup[i].label+'</option>');
            }
        }
        setRegisterBtnDisabled();
    });

    $('#city').on('change',function(){
        setRegisterBtnDisabled();
    });

    $('#password,input[name="code"],input[name="companyContacts"]').on('input',function(){
        setRegisterBtnDisabled();
    });


    var updateMobile = function(value){
        value = $.trim(value);
        if(/[^\d]/.test(value)){//替换非数字字符
            value = value.replace(/[^\d]/g,'');
        }
        var length = value.length;
        if(length>3){
            if(value[3]!==" "){
                value = value.substring(0,3)+" "+ value.substring(3,length+1);
            }
        }
        if(length>8){
            if(value[8]!==" "){
                value = value.substring(0,8)+" "+ value.substring(8,length+2);
            }
        }
        if(value.length>0){
            $('.js-empty-ico').eq(0).show();
        }else{
            $('.js-empty-ico').eq(0).hide();
        }
        $('#mobilePhone').val(value);
        if(value.length===13){
            $('#mobilePhone').valid();
        }
    };

    $('#mobilePhone').on('input',function(){
        updateMobile($(this).val());
    });

    $('.js-empty-ico').on('click',function(){
        var $input = $(this).closest('li').find('input');
        $input.val('');
        $input.focus();
    });

    $('#mobilePhone,#validCode').on('focus',function(){
        $(this).closest('li').find('.js-empty-ico').show();
    }).on('blur',function(){
        var _this = this;
        setTimeout(function(){
            $(_this).closest('li').find('.js-empty-ico').hide();
        },200);

    });
    $('#validCode').keyup(function(){
        var value = $(this).val();
        if(/[^\d]/.test(value)){//替换非数字字符
            var temp_amount = value.replace(/[^\d]/g,'');
            $(this).val(temp_amount);
        }
    });

    window.captcha = "";
    var mobileValidateCode = new MobileValidateCode({
        mobileInputId:'mobilePhone',
        codeInputId:'validCode',
        btnId:'sendMobileCode',
        url:'/mobilecode/cooperator/sendMobileCode'
    });

     $('#register').validate({
        rules:{
            mobilePhone:{
                required: true,
                'mic.tmmobile.length': true,
                'mic.tmmobile.top': true,
                'mic.tmmobile.format': true,
                remote:{
                    type:"POST",
                    url:"/register/cooperator/checkMobile", //请求地址
                    data:{
                        mobile:function(){
                            var value = $("#mobilePhone").val();
                            return value.replace(new RegExp(" ",'g'),"");
                        }
                    }
                }
            },
            logonPassword:{
                required: true,
                'mic.password':true,
                rangelength:[6,20],
                'mic.strict.pwd':true,
            },
            companyContacts:{
                required: true
            },
            code:{
                required: true,
                rangelength:[6,6],
                digits:true,
                maxlength:6
            },
            province:{
                required: true
            },
            city: {
                required: true
            }
        },
        messages:{
            mobilePhone:{
                required: "手机号为必填",
                'mic.tmmobile.length': "请输入11位数字",
                'mic.tmmobile.top': "请输入1开头的手机号码",
                'mic.tmmobile.format': "手机格式不正确",
                remote:"手机号码已存在"
            },
            logonPassword:{
                required: "密码为必填",
                'mic.password':"请填写6-20位字母或数字",
                rangelength:"请填写6-20位字母或数字",
                'mic.strict.pwd':"密码不能为连续的数字、字母或相同的数字、字母",
            },
            companyContacts:{
                required: "联系人为必填"
            },
            code:{
                required: "验证码为必填",
                digits:"验证码格式不正确",
                rangelength:"验证码长度为六位",
                maxlength:"验证码长度为六位",
            },
            province:{
                required: "省份城市为必填",
            },
            city: {
                required: "省份城市为必填",
            }
        },
        showErrors: function (errorMap, errorList) {
            for (var name in errorList) {
                errorList[name].message = '<i class="iconfont icon-close-circle-fill"></i>'+errorList[name].message;
            }
            this.defaultShowErrors();
        },
         ignore:".ignore",
        errorPlacement: function (error, element) {
            $(element).closest('.field-bd').find('.instant').empty().append(error);
        },
         success: function(error, element) {
             var $el = $(element);
             var elName = $el.attr('name');

             var elValue = $el.val();
             $el.removeClass('error');
             var $instant = $el.closest('.field-bd').find('.instant');
             //除了个别元素因特殊情况外，验证成功后，右侧显示”对号“
             $instant.empty().append('<i class="iconfont icon-check-circle-fill"></i>');

             //密码验证后添加强度
             if ('logonPassword' === elName) {
                 $instant.append('<div class="pwd-lv" id="pwdStrength">' +
                     '<span class="pwd-lv-item on"></span>' +
                     '<span class="pwd-lv-item"></span>' +
                     '<span class="pwd-lv-item"></span>' +
                     '<p>密码安全度：<span>低</span></p>' +
                     '</div>');
                 showPasswordStrength(elValue);
             }
             //验证码验证成功移除提示信息
             if ('validateNumber' === elName) {
                 $instant.empty();
             }
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
            $('.js-register').attr('disabled',true);
            $('.js-register').addClass('btn-disabled');
            form.submit();
        }
    });

    if($('#mobilePhone').val()!==""){
        updateMobile($('#mobilePhone').val());
    }



});

//显示密码强度样式
function showPasswordStrength(password) {
    var $pwdStrength = $('#pwdStrength');
    switch (getPasswordStrength(password)) {
    case 1:
        $pwdStrength.find('span').removeClass('on');
        $pwdStrength.find('span:eq(0)').addClass('on');
        $pwdStrength.find('p span').html('低');
        break;
    case 2:
        $pwdStrength.find('span').removeClass('on');
        $pwdStrength.find('span:eq(0)').addClass('on');
        $pwdStrength.find('span:eq(1)').addClass('on');
        $pwdStrength.find('p span').html('中');
        break;
    case 3:
        $pwdStrength.children('span').addClass('on');
        $pwdStrength.find('p span').html('高');
        break;
    }
}
function getPasswordStrength(password) {
    var combinations = 0;
    for(var i=0;i<MIC_REGEXP.PWDSTRENGTH.length;i++){
        if(MIC_REGEXP.PWDSTRENGTH[i].test(password)){
            combinations++;
        }
    }
    if(combinations===1||password.length<7){
        return 1;
    }else{
        if(combinations===2||(combinations===3 && password.length<13)){
            return 2;
        }else{
            return 3;
        }
    }
}


