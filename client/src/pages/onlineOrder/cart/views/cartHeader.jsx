import React, { Component } from 'react';

import classNames from "classnames/bind";

import {CheckBoxBtn1, CheckBoxBtn2} from './checkBtn';

import {actions as onlineOrderCartActions} from '../index'
import {reducer as onlineOrderCartIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
const cx = classNames.bind(styles);


class CartHeader extends  Component {
    constructor(props) {
        super(props);
    }
    clickTotalList() {
        this.props.validProdList &&  this.props.fetchOnlineOrderCartClickTotalList();
    }
    render() {
        let {validProdList} = this.props;
        let count = 0;
        validProdList && validProdList.map((item) => item.get('chooseAllFlag') === 2 && count++);
        return (
            <React.Fragment>
                <span className="ant-table">
                    <table className="">
                        <colgroup>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                            <col/>
                        </colgroup>
                        <thead className="ant-table-thead">
                            <tr>
                                <th className="" width="8%">
                                    <span onClick={() => {this.clickTotalList()}}>
                                        {
                                            (validProdList && count === validProdList.count() && validProdList.count() > 0) ? <CheckBoxBtn2 /> :
                                                <CheckBoxBtn1 />
                                        }
                                        <span style={{color: '#999'}}>全选</span>
                                    </span>
                                </th>
                                <th className="" width="10%" />
                                <th className="" width="22%">物品</th>
                                <th className="" width="15%">数量</th>
                                <th className="" width="15%">单价</th>
                                <th className="" width="15%">金额</th>
                                <th className="" width="15%">操作</th>
                            </tr>
                        </thead>
                    </table>
                </span>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    validProdList: state.getIn(['onlineOrderCartIndex', 'onlineOrderCartList', 'validProdList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchOnlineOrderCartClickTotalList:onlineOrderCartActions.fetchOnlineOrderCartClickTotalList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CartHeader)
