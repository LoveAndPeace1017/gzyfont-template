/**
 * validate extend
 * @author qiumingsheng
 * Date: 14-6-19
 * Time: 上午11:36
 */

//正则表达式
MIC_REGEXP = {
    LOGUSERNAME: /^[0-9a-zA-Z\-]{6,20}$/,  //用户名
    PASSWORD: /^([^\u4E00-\u9FA5\s])*$/,  //密码
    EMAIL: /^[a-zA-Z0-9][\w\.\-]*@[a-zA-Z0-9][\w\.\-]*\.[a-zA-Z][a-zA-Z\.]*$/, //邮箱
    COMNAME: /.*[^\u0000-\u00ff]+.*/, //公司名称
    AREACODE:/^[0-9]{1,4}$/, //电话区号
    TELEPHONE: /^[0-9\-]+$/,        //电话
    NUMBER: /^[0-9]{1,4}$/,         //数字
    MOBILE: /^[0-9]{1,11}$/,    //手机
    PWDSTRENGTH: [new RegExp('\\d'), new RegExp('[a-z]'), new RegExp('[A-Z]')],  //密码强度
    YAHOOEMAIL: /(\S+@yahoo\.cn$)|(\S+@yahoo\.com\.cn$)/,
    EQZERO:/^(0)*$/, //价格是否为0，包含0.00
    PURCHASENUMBER:/^\d{0,8}((\.)\d{0,3})?$/, //采购价格。保留小数点后三位
    RATE:/^[0-9]{1,3}((\.)\d{0,2})?$/, //税率 最多输入3位整数2位小数
    PRICE:/^\d{0,8}((\.)\d{0,3})?$/, //价格。保留小数点后3位
    CHINESE:/^.*[^\\x00-\\xFF]+.*$/, //中文字符
    RATENUMBER:/^\d{1,10}((\.)\d{0,6})?$/, // 最多输入10位整数6位小数
    FULLWIDTH:/[\uff00-\uffff]/g, //全角字符
    DIGITANDENGLISH: /^[a-zA-Z0-9]+$/, // 只能输入英文字符和数字
    IDENTITYCARD:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证校验
    BGT: {
        TOTALNUMBER:/^[0-9]{1,8}((\.)\d{0,3})?$/,
        TOTALPRICE:/^[0-9]{1,16}((\.)\d{0,2})?$/
    }
};

//身份证
$.validator.addMethod("mic.identitycard", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.IDENTITYCARD.test(value);
});

//不等于
$.validator.addMethod("mic.notEqualTo", function (value, element, param) {
    return this.optional(element) || value!==param;
});

//检测是否包含全角字符
$.validator.addMethod("mic.fullwidth", function (value, element, param) {
    var arr = value.match(MIC_REGEXP.FULLWIDTH);
    return this.optional(element) || arr===null;
});

//中文字符
$.validator.addMethod("mic.unasciicode", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.CHINESE.test(parseFloat(value));
});

//价格。保留小数点后2位
$.validator.addMethod("mic.price", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.PRICE.test(parseFloat(value));
});

//税率 最多输入3位整数2位小数
$.validator.addMethod("mic.rate", function (value, element, param) {
    return this.optional(element) || (!isNaN(value)&& MIC_REGEXP.RATE.test(parseFloat(value)));
});

//数量 最多输入10位整数6位小数
$.validator.addMethod("mic.ratenumber", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.RATENUMBER.test(value);
});

//采购价格。保留小数点后三位
$.validator.addMethod("mic.purchasenumber", function (value, element, param) {
    return this.optional(element) ||((!isNaN(value)&& MIC_REGEXP.PURCHASENUMBER.test(parseFloat(value)) && (value.indexOf('+')==-1) && (value.indexOf('.')!=0)));
});
//价格是否为0，包含0.00
$.validator.addMethod("mic.pricezero", function (value, element, param) {
    return this.optional(element) || !MIC_REGEXP.EQZERO.test(parseFloat(value));
});
//用户名6-20位数字和字母
$.validator.addMethod("mic.logusername", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.LOGUSERNAME.test(value);
});

//密码6-20位数字和字母
$.validator.addMethod("mic.password", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.PASSWORD.test(value);
});

//邮箱
$.validator.addMethod("mic.email", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.EMAIL.test(value);
});

//公司名称中文
$.validator.addMethod("mic.comname", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.COMNAME.test(value);
});

//电话区号
$.validator.addMethod("mic.comTelephoneAreaCode", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.AREACODE.test(value);
});

//电话号码
$.validator.addMethod("mic.telephone", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.TELEPHONE.test(value);
});

//手机号码
$.validator.addMethod("mic.mobile", function (value, element, param) {
    return this.optional(element) || MIC_REGEXP.MOBILE.test(value);
});

//字母和数字
$.validator.addMethod("digitAndEnglish", function(value, element, param) {
    return this.optional(element) || MIC_REGEXP.DIGITANDENGLISH.test(value);
});

//雅虎邮箱验证
$.validator.addMethod("mic.yahooemail", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        if (MIC_REGEXP.YAHOOEMAIL.test(value)) {
            return false;
        } else {
            return true;
        }
    }
});

//密码，不能为连续的数字、字母或相同的数字、字母
$.validator.addMethod("mic.strict.pwd", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        //检查连续的数字、字母
        var isContinue = true;
        if (/^[a-zA-Z\d]+$/.test(value)) {
            var charDisArr = [];
            for (var i = value.length - 1; i > 0; i--) {
                var charCode = value.charCodeAt(i);
                var prevCharCode = value.charCodeAt(i - 1);
                charDisArr.push(charCode - prevCharCode);
            }
            charDisArr = $.unique(charDisArr);
            if (charDisArr.length > 1 || (charDisArr[0] != 1 && charDisArr[0] != -1)) {
                isContinue = false;
            }
        } else {
            isContinue = false;
        }
        return !(isContinue || /^([a-zA-Z\d])\1+$/.test(value));
    }
});

//当选择中国时，必须输入11位手机号码
$.validator.addMethod("mic.mobile.length", function(value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        if( 11 !== value.length){
            return false;
        }else{
            return true;
        }
    }
});

//当选择中国时，必须输入13/14/15/17/18开头的手机号码
$.validator.addMethod("mic.mobile.top", function(value, element, param) {
    if (this.optional(element)) {
        return true;
    }
    else {
        var countCode = $('[name=comTelephoneCountryCode]').val();
        if ('86' === countCode) {
            if ('13' === value.substring(0, 2)) {
                return true;
            }
            else if ('14' === value.substring(0, 2)) {
                return true;
            }
            else if ('15' === value.substring(0, 2)) {
                return true;
            }
            else if ('17' === value.substring(0, 2)) {
                return true;
            }
            else if ('18' === value.substring(0, 2)) {
                return true;
            }
            else if ('166' === value.substring(0,3)){
                return true;
            }
            else if ('198' === value.substring(0,3)){
                return true;
            }
            else if ('199' === value.substring(0,3)){
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    }
});

//当选择香港、澳门、台湾时，进行手机号码判断
$.validator.addMethod("mic.mobile.other", function(value, element, param) {
    if (this.optional(element)) {
        return true;
    }
    else {
        var countCode = $('[name=comTelephoneCountryCode]').val();
        if ('886' === countCode && 10 !== value.length) {
            return false;
        }
        else if (('852' === countCode || '853' === countCode) && 8 !== value.length) {
            return false;
        }
        else {
            return true;
        }
    }
});

$.validator.addMethod("mic.tmmobile.length", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        if( 13 !== value.length){
            return false;
        }else{
            return true;
        }
    }
});

$.validator.addMethod("mic.tmmobile.top", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        return '1' === value.substring(0,1)
    }
});
$.validator.addMethod("mic.tmmobile.format", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        return /^\d{3} \d{4} \d{4}$/.test(value)
    }
});


$.validator.addMethod("mic.tmmobile.other", function (value, element, param) {
    if (this.optional(element)) {
        return true;
    } else {
        var countCode = $('#tmComTelephoneCountryCode').val();
        if('886' === countCode && 10 !== value.length){
            return false;
        } else if(('852' === countCode || '853' === countCode) && 8 !== value.length) {
            return false;
        } else {
            return true;
        }
    }
});

// 百购通数量通用校验 8位整数 3位小数
$.validator.addMethod("mic.bgt.totalnumber", function (value, element, param) {
    return this.optional(element) ||(!isNaN(value) && MIC_REGEXP.BGT.TOTALNUMBER.test(value));
});

// 百购通金额通用校验 16位整数 2位小数
$.validator.addMethod("mic.bgt.totalprice", function (value, element, param) {
    return this.optional(element) ||(!isNaN(value) && MIC_REGEXP.BGT.TOTALPRICE.test(value));
});