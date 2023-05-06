import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import Base from '../dependencies/base';
import SpecTable from './specTable';
import SpecGoodsTable from './specGoodsTable';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

/**
 * 多规格表格
 *
 * @visibleName Index（多规格table）
 * @author jinb
 */
@withRouter
@connect(null, null)
export default class Index extends Base {
    static propTypes = {
        /**
         *   是否展示额外的自定义字段
         **/
        // showExtraCustomField: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            specName1: '规格1',
            specName2: '',
            specName3: ''
        }
    }

    // 获取当前specName为空的索引位置
    getEmptyPosition = () => {
        for(let i=1;i<=3;i++){
            if(!this.state['specName'+i]){
                return i-1;
            }
        }
    };


    // 修改规格属性名称
    handleOnChangeSpecName = (type, idx, specName) => {
        if(type==='add'){
            let idx = this.getEmptyPosition();
            this.setState({['specName'+(idx+1)]: specName});
        } else {
            for(let i=1;i<=3;i++){
                if(!!this.state['specName'+i]){
                    idx--;
                }
                if(idx===0){
                    this.setState({['specName'+i]: specName});
                    break;
                }
            }
        }
    };

    // 新增一种规格
    addOneSpec = (idx, specName) => {
        this.handleOnChangeSpecName(idx, specName);
    };

    // 删除一种规格
    deleteOneSpec = (dataSpecList) => {
        let {setFieldsValue} = this.props.formRef.current;
        let arrays = [];
        for(let key in dataSpecList){
            let array = dataSpecList[key].specValues || [];
            arrays.push(array);
        }
        arrays = this.getArrayByArrays(arrays);
        // 返回SpecGoodsTable的state中dataSource的新值
        let newDataSource = this.resetSpecGoodsTableToDataSource(arrays);
        this.specGoodsTableRef.setState({dataSource: newDataSource});
        // 重置SpecGoodsTable表单中的数据
        setFieldsValue({mulSpecList: newDataSource});
    };


    // 新增一种规格值时，重置SpecGoodsTable表单中的数据
    resetSpecGoodsTableToForm = (dataSource) => {
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        let mulSpecList = getFieldValue('mulSpecList');
        let newMulSpecList = dataSource.map(data => {
            let obj = data;

            for(let key in mulSpecList){
                let good = mulSpecList[key];
                if((good.spec1 === data.spec1) && (good.spec2 === data.spec2) && (good.spec3 === data.spec3)){
                    obj = {...good, key: data.key};
                    break;
                }
            }
            return obj;
        });
        setFieldsValue({mulSpecList: newMulSpecList});
    };

    // 新增或删除一种规格值
    handleOnChangeOneSpecValue = () => {
        let {getFieldValue} = this.props.formRef.current;
        let arrays = [];
        let dataSpecList = getFieldValue('dataSpecList');
        for(let key in dataSpecList){
            let array = dataSpecList[key].specValues || [];
            arrays.push(array);
        }
        arrays = this.getArrayByArrays(arrays);
        // 返回SpecGoodsTable的state中dataSource的新值
        let newDataSource = this.resetSpecGoodsTableToDataSource(arrays);
        this.specGoodsTableRef.setState({dataSource: newDataSource});
        // 重置SpecGoodsTable表单中的数据
        this.resetSpecGoodsTableToForm(newDataSource);
    };

    getSpecGoodsTableRef = (specGoodsTableRef) => {
        this.specGoodsTableRef = specGoodsTableRef;
    };

    render() {
        let {specName1, specName2, specName3} = this.state;

        return (
            <React.Fragment>
                <SpecTable
                    formRef={this.props.formRef}
                    dataPrefix={'dataSpecList'}
                    addOneSpec={this.addOneSpec}
                    deleteOneSpec={this.deleteOneSpec}
                    handleOnChangeOneSpecValue={this.handleOnChangeOneSpecValue}
                    handleOnChangeSpecName={this.handleOnChangeSpecName}
                    getEmptyPosition={this.getEmptyPosition}
                />

                <SpecGoodsTable
                    formRef={this.props.formRef}
                    dataPrefix={'mulSpecList'}
                    specName1={specName1}
                    specName2={specName2}
                    specName3={specName3}
                    source={'add'}
                    getRef={this.getSpecGoodsTableRef}
                />
            </React.Fragment>
        )
    }
}

