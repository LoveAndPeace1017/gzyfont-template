import React, {Component} from 'react';
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default class Base extends Component {

    /**
     * 获取【二维数组】的【排列组合】
     */
    getArrayByArrays = (arrays) => {
        var arr = ["+-*/"];        // 初始化第一个内层数组   +-*/作为特殊标识 没有具体意思
        /**
         * 遍历外层数组
         */
        for (var index = 0; index < arrays.length; index++) {
            // console.log('外层数组索引 = ' + index);
            arr = this.getValuesByArray(arr, arrays[index]);
        }

        return arr;
    };

    getValuesByArray = (arr1, arr2) => {
        var arr = [];

        if(!arr2 || arr2.length === 0) // 防止arr2为空
            arr2 = [''];
        /**
         * 遍历外层数组
         */
        for (var index = 0; index < arr1.length; index++) {
            var value1 = arr1[index];
            /**
             * 遍历内层数组
             */
            for(var cursor = 0; cursor < arr2.length; cursor++) {
                var value2 = arr2[cursor];
                var value;
                if("+-*/" !== value1){
                    value = value1+'@@@'+value2;
                } else {
                    value = value2;
                }
                arr.push(value);
            }
        }

        return arr;
    };


    /**
     *   重置SpecGoodsTable中的 dataSource的数据
     */
    resetSpecGoodsTableToDataSource = (arrays) => {
        let out = [];
        for(let i=0;i<arrays.length;i++){
            let obj = {key: i};
            let temp = arrays[i].split('@@@');
            for(let j=0;j<temp.length;j++){
                let idx = j+1;
                obj['spec'+idx] = temp[j];
            }
            out.push(obj);
        }
        return out;
    };


    render() {
        return null
    }

}





