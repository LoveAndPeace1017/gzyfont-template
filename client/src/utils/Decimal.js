import {formatCurrency, removeCurrency} from './format';

export const fixedDecimal = function(val, decimal){
    if(val!== 0 && !val) return '';
    if(!decimal) decimal = 3;
    if(typeof val==='string')
        val = Number(val);
    if(typeof decimal==='string')
        decimal = Number(decimal);
    return removeCurrency(formatCurrency(val, decimal,true));
};
