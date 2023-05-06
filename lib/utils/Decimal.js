/**
 * 金额格式化
 *
 * @param x 要格式化的金额
 * @param num 保留几位小数。默认为2
 * @param noZero 小数位是否要补0 true：不需要补0  false：需要补0  默认为false
 * @returns {*}
 */
const formatCurrency = (x, num, noZero) => {
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
};

const removeCurrency = (num) => {
    var str = num;
    if (!num) {
        return;
    }
    if (num.indexOf(',') != -1) {
        str = str.replace(/\$|\,/g, '');
    }
    return str/1;
}


module.exports = {
    fixedDecimal:function(val, decimal){
        if(val!== 0 && !val) return '';
        if(!decimal) decimal = 3;
        if(typeof val==='string')
            val = Number(val);
        if(typeof decimal==='string')
            decimal = Number(decimal);
        return removeCurrency(formatCurrency(val, decimal,true));
    }
};