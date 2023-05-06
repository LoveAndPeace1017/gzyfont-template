$(function() {
    if($('input[name="channel"]').val() === '080'){
        getSignature({
            title: '百卓轻云ERP免费试用',
            imgUrl: 'https://erp.abiz.com/images/server/common/s_logo.png',
            desc: '全业务流程数字化管理'
        });
    }

    if(!!pageError) {
        tipMsg(pageError);
    }

    if(!$('#agreement').is(':checked')){
        $('.js-register').hide();
        $('.js-register-default').show();
    } else {
        $('.js-register').show();
        $('.js-register-default').hide();
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
    var mobileValidateCode = new MobileValidateCode({
        mobileInputId:'mobilePhone',
        btnId:'sendMobileCode',
        url:'/mobilecode/sendMobileCodeV2',
        needImageValidate: true,
		errorHandler: function(err) {
			tipMsg(err.retMsg);
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
                this.mobileError = "请输入11位数字";
                flag = false;
            }else if(!/^1[0-9]{10}$/.test(mobile)){
                this.mobileError = "请输入开头为1的手机号码";
                flag = false;
            }else{
                flag = true;
            }
            if(!flag){
                // alert(this.mobileError);
            }
            return flag;
        }
    });

    // 初始化图形验证码
    jigsaw.init({
        el: document.getElementById('captcha'),
        onSuccess: function() {
            $('.js-sendCode').hide();
            $('.pop-valid-code').fadeOut();
            $('#sendMobileCode').show();
            $('#sendMobileCode').click();
        },
        // onFail: function(){
        //     if($('#captcha').is(':visible')){
        //         cleanMsg();
        //         tipMsg("验证失败，请重新校验！")
        //     }
        // },
        // onRefresh: function(){
        //     if($('#captcha').is(':visible')){
        //         cleanMsg();
        //         tipMsg("刷新成功")
        //     }
        // },
        w: document.documentElement.clientWidth-40
    });
    function cleanMsg() {
		$('.field-tip').fadeOut();
    }

     $('#register').validate({
        rules:{
            mobilePhone:{
                required: true,
                'mic.mobile.length': true,
                'mic.tmmobile.top': true
            },
            logonPassword:{
                required: true,
                'mic.password':true,
                rangelength:[6,20],
                'mic.strict.pwd':true,
            },
            companyName:{
                required: true
            },
            code:{
                required: true,
                digits:true
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
            logonPassword:{
                required: function(){
					return tipMsg("密码为必填");
				},
                'mic.password': function(){
					return tipMsg("请填写6-20位字母或数字");
				},
                rangelength: function(){
					return tipMsg("请填写6-20位字母或数字");
				},
                'mic.strict.pwd': function(){
					return tipMsg("密码不能为连续的数字、字母或相同的数字、字母");
				},
            },
            companyName:{
                required: function(){
					return tipMsg("公司名称为必填");
				}
            },
            code:{
                required: function(){
					return tipMsg("验证码为必填");
				},
                digits: function(){
					return tipMsg("验证码格式不正确");
				}
            }
        },
        showErrors: function (errorMap, errorList) {
            for (var name in errorList) {
                errorList[name].message = '<i class="iconfont icon-close-circle-fill"></i>';
            }
            this.defaultShowErrors();
        },
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
                //  showPasswordStrength(elValue);
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
            // $('.js-register').attr('disabled',true);
            $('.js-register').addClass('btn-disabled');
            $(form).ajaxSubmit({
                type: 'post',
                url: "/register",
                success: function(data){
                    if(data.retCode ==='0'){
                        if(data.channel === '080' || data.channel === '081'){
                            var actName = 'submit';
                            var actProp ={act:'submit', name:'表单组件'} ;
                            VAD_EVENT.sendAction(actName, actProp);
                            // 表单提交成功后，上报给vivo的表单回传代码
                        } else if(data.channel === '002'){
                            meteor.track("form", {convert_id: "1701988252761092"});
                            // channel为009 时，执行转化代码
                        } else if(data.channel === '009'){
                            _baq.track("form", {assets_id: "1709676264162312"});
                            // channel为011 时，执行转化代码
                        } else if(data.channel === '011'){
                            meteor.track("form", {convert_id: "1694385101174788"});
                            // channel为011 时，执行转化代码
                        } else if(data.channel === '070'){
                            _ks_trace.push({event: 'form', convertId: 261374, cb: function(){    console.log('Your callback function here!')}})
                            // 快手070渠道
                        } else if(data.channel === '071'){
                            _ks_trace.push({event: 'form', convertId: 261376, cb: function(){    console.log('Your callback function here!')}})
                            // 快手071渠道
                        }
                        window.location.href = data.toSuccessUrl+'?channel='+data.channel;
                    } else {
                        tipMsg(data.retMsg);
                    }
                },
                error: function(XmlHttpRequest, textStatus, errorThrown){
                    // layer.msg('ERROR!',{icon:2,time:1000});
                }
            });
        }
    });

	// 密码显示切换
	$('body').on('click', '.icon-pwd-hide', function(){
		$(this).removeClass('icon-pwd-hide').addClass('icon-pwd-show');
		$(this).closest('.field-bd').find('#password').attr('type','text');
	}).on('click', '.icon-pwd-show', function(){
		$(this).removeClass('icon-pwd-show').addClass('icon-pwd-hide');
		$(this).closest('.field-bd').find('#password').attr('type','password');
	});

    $('#labelAgree').click(function () {
        if(!$('#agreement').is(':checked')){
            $('.js-register').hide();
            $('.js-register-default').show();
        } else {
            $('.js-register').show();
            $('.js-register-default').hide();
        }
    });

    //点击下面立即注册页面滚动到注册表单处
    $('.js-go-register').on('click',function(){
        $('body,html').animate({
                scrollTop: 520
            },500);
    })

    const backTop = document.getElementById("register-back");
    const TOP = document.getElementById("register");
    backTop.addEventListener("click", function (e) {
        TOP.scrollIntoView({ behavior: "smooth" });
    })
});

// 提示信息
function tipMsg(msg){
	$('.field-tip').text(msg).fadeIn();
	setTimeout(function(){
		$('.field-tip').fadeOut();
	},3000);
}

//显示密码强度样式
function showPasswordStrength(password) {
    var $pwdStrength = $('#pwdStrength');
    switch (getPasswordStrength(password)) {
    case 1:
		tipMsg("密码安全度：低");
        break;
    case 2:
		tipMsg("密码安全度：中");
        break;
    case 3:
		tipMsg("密码安全度：高");
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


