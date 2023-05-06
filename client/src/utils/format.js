/**
 * Created by zhang-j on 2016/4/18.
 */
export const removeCurrency = (num) => {
    var str = num;
    if (!num) {
        return;
    }
    if (num.indexOf(',') != -1) {
        str = str.replace(/\$|\,/g, '');
    }
    return str;
}

/**
 * 金额格式化
 *
 * @param x 要格式化的金额
 * @param num 保留几位小数。默认为2
 * @param noZero 小数位是否要补0 true：不需要补0  false：需要补0  默认为false
 * @returns {*}
 */
export const formatCurrency = (x, num, noZero) => {
    num = num || 2;
    noZero = noZero || false;
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }

    var powNum = Math.pow(10, num);
    f = Math.round(x * powNum) / powNum;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    if (!noZero) {
        while (s.length <= rs + num) {
            s += '0';
        }
    }

    var ableAmountSplit = s.split(".");
    var ableAmountInteger = ableAmountSplit[0];
    var ableAmountDecimals = ableAmountSplit[1];
    for (var i = 0; i < Math.floor((ableAmountInteger.length - (1 + i)) / 3); i++) {
        ableAmountInteger = ableAmountInteger.substring(0, ableAmountInteger.length - (4 * i + 3)) + ',' + ableAmountInteger.substring(ableAmountInteger.length - (4 * i + 3));
    }
    if (ableAmountInteger.indexOf("-,") > -1) {
        ableAmountInteger = ableAmountInteger.replace("-,", "-");
    }
    if (ableAmountDecimals && ableAmountDecimals.length > 0) {
        return ableAmountInteger + "." + ableAmountDecimals
    }
    else {
        return ableAmountInteger;
    }
}

export const getNowFormatDate = ({seperator = '', format = 'YY-MM-DD'}) => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    if (format === 'YY-MM' || format === 'yyyyMM') {
        return year + seperator + month;
    }
    else if (format === 'YY-MM-DD' || format === 'yyyyMMdd') {
        return year + seperator + month + seperator + strDate;
    }

};

export const getYmd = (fromString) => {
    if (fromString) {
        const date = new Date(fromString);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }
        return `${date.getFullYear()}-${month}-${day}  ${hour}:${minute}`
    }
    return '';
};

/**
 * 补零
 * **/
const toZero = (num)=>{
    if(num>=0 && num<=9){
        num = '0' + num;
    }
    return num;
};

/**
 * 获取系统当前时间，年月日时分
 * **/
export const getTime = (split = '') => {
    const date = new Date(); //创建时间对象
    const year = date.getFullYear(); //获取年
    const month = toZero(date.getMonth() + 1);//获取月
    const day = toZero(date.getDate()); //获取当日
    const hours = toZero(date.getHours()); //获取时间
    const minutes = toZero(date.getMinutes()); //获取分
    return year + split + month + split + day + split + hours + split + minutes; //组合时间
};