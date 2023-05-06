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
import UnitTableForOldForm from './unitForOldFormTable';
import UnitTableForNewForm from './unitForNewFormTable';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
const cx = classNames.bind(styles);

@withRouter
@connect(null, null)
export default class Index extends Base {

    constructor(props) {
        super(props);

        this.state = {
            unitName1: '1',
            unitName2: '',
            unitName3: '',
            unitName4: '',
            unitName5: ''
        }
    }

    // 获取当前specName为空的索引位置
    getEmptyPosition = () => {
        console.log(this.state,'this.state');
        for(let i=1;i<=5;i++){
            if(!this.state['unitName'+i]){
                return i-1;
            }
        }
    };

    initPosition = (length=0)=>{
        if(length>0){
           for(let i =1;i<(length+1);i++){
               this.setState({
                   ['unitName'+i]:i
               })
           }
        }
    }


    // 修改规格属性名称
    handleOnChangeSpecName = (type, idx, specName) => {
        if(type==='add'){
            let idx = this.getEmptyPosition();
            this.setState({['unitName'+(idx+1)]: specName});
        } else {
            for(let i=1;i<=5;i++){
                if(!!this.state['unitName'+i]){
                    idx--;
                }
                if(idx===0){
                    this.setState({['unitName'+i]: specName});
                    break;
                }
            }
        }
    };

    render() {
        const {type} = this.props;
        return (
            <React.Fragment>
                {
                    type == "new"?(
                        <UnitTableForNewForm
                            formRef={this.props.formRef}
                            dataPrefix={'otherUnits'}
                            handleOnChangeSpecName={this.handleOnChangeSpecName}
                            getEmptyPosition={this.getEmptyPosition}
                        />
                    ):(
                        <UnitTableForOldForm
                            {...this.props}
                            dataPrefix={'otherUnits'}
                            handleOnChangeSpecName={this.handleOnChangeSpecName}
                            getEmptyPosition={this.getEmptyPosition}
                            initPosition = {this.initPosition}
                        />
                    )
                }

            </React.Fragment>
        )
    }
}

