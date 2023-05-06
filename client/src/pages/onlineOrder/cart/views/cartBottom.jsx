import React, { Component } from 'react';

import classNames from "classnames/bind";

import {CheckBoxBtn1, CheckBoxBtn2} from './checkBtn';
import {formatCurrency} from 'utils/format';

import { Modal, message } from 'antd';

const confirm = Modal.confirm;

import {actions as onlineOrderCartActions} from '../index'
import {reducer as onlineOrderCartIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import {withRouter} from "react-router-dom";
const cx = classNames.bind(styles);
import FooterFixedBar from  'components/layout/footerFixedBar'


class CartBottom extends  Component {
    constructor(props) {
        super(props);
    }
    clickTotalList() {
        this.props.validProdList && this.props.fetchOnlineOrderCartClickTotalList();
    }
    deleteConfirm = (data) => {
        let _this = this,chooseData = [];
        data && (chooseData = data.map(function (item) {
            return {
                supplierUserIdEnc: item.supplierUserIdEnc,
                supplierProductCode: item.supplierProductCode
            }
        }));
        confirm({
            title: '提示信息',
            content: (
                <React.Fragment>
                    <p>您确定要删除商品信息吗？</p>
                </React.Fragment>
            ),
            onOk() {
                _this.props.fetchOnlineOrderCartEditCartData('del',chooseData,(res)=>{
                    if (res.data.retCode === '0') {
                        message.success('操作成功');
                        _this.props.asyncFetchCartData();
                    }else {
                        alert(res.data.retMsg);
                    }
                });
            },
            onCancel() {}
        });
    }
    deleteValidConfirm = () => {
        let _this = this;
        confirm({
            title: '提示信息',
            content: (
                <React.Fragment>
                    <p>您确定要清空全部失效商品吗？</p>
                </React.Fragment>
            ),
            onOk() {
                _this.props.fetchOnlineOrderCartClearValidData((res)=>{
                    if (res.data.retCode === '0') {
                        message.success(res.data.retMsg);
                        _this.props.asyncFetchCartData();
                    }else {
                        alert(res.data.retMsg);
                    }
                });
            },
            onCancel() {}
        });
    };
    submitOrder = (data) => {
         let _this = this,submitData = [];
         data && (submitData = data.map(function (item) {
             return {
                 supplierCode: item.supplierCode,
                 quantity:item.quantity,
                 supplierProductCode: item.supplierProductCode,
                 supplierUserIdEnc: item.supplierUserIdEnc
             }
         }));
        localStorage.setItem('prodList', JSON.stringify(submitData));
        this.props.history.push('/onlineOrder/cartOrder?source=cart');
    };
    render() {
        let {validProdList} = this.props;
        let count = 0;
        validProdList && validProdList.map((item) => item.get('chooseAllFlag') === 2 && count++);

        let chooseArr = [],totalLength = 0,amountTotal = 0;
        validProdList.toJS().forEach(prodList => {
            let list = prodList.items.filter((t)=> {
                return t.flag === true;
            });
            (list && list.length > 0) && (chooseArr = chooseArr.concat(list));
        });

        chooseArr.forEach((item) => {
            totalLength += item.quantity;
            amountTotal += item.quantity * item.salePrice;
        })
        return (
            <React.Fragment>
                <FooterFixedBar>
                    <span className="ant-table">
                        <table>
                            <colgroup>
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
                                    <th className="" width="10%">
                                        <a href="#!" className="mr5" onClick={this.deleteConfirm.bind(this, chooseArr)}>批量删除</a>
                                    </th>
                                    <th className="" width="30%">
                                        <a href="#!" className="mr5" onClick={this.deleteValidConfirm.bind(this)}>清空失效商品</a>
                                    </th>
                                    <th className="" width="20%">已选物品总数： <span className={cx("cart-weight-bold")}>{totalLength}</span> 项</th>
                                    <th className="" width="20%">总金额： <span className={cx("cart-weight-bold")}>{formatCurrency(amountTotal)}</span>元</th>
                                    <th className="" width="12%" style={{position: 'relative'}}>
                                        {
                                            chooseArr.length === 0 ? <a href="#!" className={cx("cart-submit-btn")} style={{color: '#fff', background: '#ccc'}}>马上订货</a> :
                                                <a href="#!" className={cx("cart-submit-btn")} onClick={this.submitOrder.bind(this, chooseArr)} style={{color: '#fff'}}>马上订货</a>
                                        }

                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </span>
                </FooterFixedBar>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    validProdList: state.getIn(['onlineOrderCartIndex', 'onlineOrderCartList', 'validProdList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchOnlineOrderCartClickTotalList:onlineOrderCartActions.fetchOnlineOrderCartClickTotalList,
        fetchOnlineOrderCartEditCartData: onlineOrderCartActions.fetchOnlineOrderCartEditCartData,
        fetchOnlineOrderCartClearValidData: onlineOrderCartActions.fetchOnlineOrderCartClearValidData,
        asyncFetchCartData: onlineOrderCartActions.asyncFetchCartData
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CartBottom)
)