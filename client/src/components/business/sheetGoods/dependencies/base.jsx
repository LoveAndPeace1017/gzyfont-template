import React, {Component} from 'react';
import _ from "lodash";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

export default class Base extends Component {

    /**
     *  数组转化为对象
     * @param array
     * @param key
     */
    _invertArrayToObjectByKey = (array, key) => {
        let map = {};
        _.forEach(array, a => map[a[key]] = a);
        return map;
    };

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };
    openModal = (tag) => {
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    /**
     *  提供自定义字段
     * @param customKey
     * @param customColumn
     * @param customNum  自定义字段的数量
     * @return {Array}
     */
    getCustomFields = (customKey, customConfigKey, customNum=5) => {
        let customArray = [];
        for(let i=1;i<=customNum;i++){
            customArray.push({
                key: `${customKey}${i}`,
                dataIndex: `${customKey}${i}`,
                columnName: `${customConfigKey}${i}`,
                width: 150,
                readOnly: true,
                isCustomField: true
            })
        }
        return customArray;
    };

    /**
     *  提供需要显示的字段
     * @param configFields
     * @param columns
     * @return {*}
     */
    getVisibleColumns = (configFields, columns) => {
        if(!configFields) return columns;
        /** 数组转化为字符串 */
        let configFieldsMap = this._invertArrayToObjectByKey(configFields, 'columnName');
        columns = _.map(columns, column => {
            let {columnName} = column;
            if(configFieldsMap[columnName]){
                let {label, visibleFlag, className} = configFieldsMap[columnName];
                if(!column.title) column.title = label;
                if(visibleFlag !== 1){
                    column.width = 0;
                    column.className = column.className ? cx('col-hide') + ' ' + column.className : cx('col-hide')
                }
            }
            return column;
        });
        return _.filter(columns, column => !column.isCustomField || (column.isCustomField && configFieldsMap[column.columnName]))  // 过滤掉不存在的自定义字段
    };

    render() {
        return null
    }

}





