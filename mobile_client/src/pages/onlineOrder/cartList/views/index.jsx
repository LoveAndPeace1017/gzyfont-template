import React, { Component } from 'react';

import { Checkbox,  Modal, Toast } from 'antd-mobile';
import Header from 'components/layout/header';
import CartCardWrap from './cartCardWrap';

import {formatCurrency} from 'utils/format';

import {actions as onlineOrderCartActions} from '../index';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";


import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
const alert = Modal.alert;

const cx = classNames.bind(styles);

class CartList extends Component {
    state = {
        rightBtnStatus: 1 //0表示没数据 1管理 2完成
    };

    componentDidMount() {
        this.props.asyncFetchCartData();
    }

    rightClick = () => {
        const { rightBtnStatus } = this.state;
        rightBtnStatus === 1 && this.setState({rightBtnStatus: 2});
        rightBtnStatus === 2 && this.setState({rightBtnStatus: 1});
    };

    deleteValidConfirm = () => {
        let _this = this;
        alert('提示信息', '您确定要清空全部失效商品吗？', [
            {text: '取消', onPress: () => {}},
            { text: '确认',
                onPress: () => {
                    _this.props.fetchOnlineOrderCartClearValidData((res)=>{
                        if (res.data.retCode === '0') {
                            Toast.success('清空成功！', 1);
                            _this.props.asyncFetchCartData();
                        }else {
                            Toast.fail(res.data.retMsg, 1);
                        }
                    });
                }
            },
        ])
    };

    //批量删除
    deleteConfirm  = (data) => {
        let _this = this,chooseData = [];
        data && (chooseData = data.map(function (item) {
            return {
                supplierUserIdEnc:item.supplierUserIdEnc,
                supplierCode: item.supplierCode,
                supplierProductCode: item.supplierProductCode
            }
        }));
        alert('提示信息', '您确定要删除商品信息吗？', [
            {text: '取消', onPress: () => {}},
            { text: '确认',
                onPress: () => {
                    _this.props.fetchOnlineOrderCartEditCartData('del',chooseData,(res)=>{
                        if (res.data.retCode === '0') {
                            Toast.success('删除成功！', 1);
                            _this.props.asyncFetchCartData();
                        }else {
                            Toast.fail(res.data.retMsg, 1);
                        }
                    });
                }
            },
        ])
    };

    //全选
    clickTotalList() {
        this.props.validProdList && this.props.fetchOnlineOrderCartClickTotalList();
    }

    //马上订货
    submitOrder = (data) => {
        let _this = this,submitData = [];
        data && (submitData = data.map(function (item) {
            return {
                quantity: item.quantity,
                supplierUserIdEnc:item.supplierUserIdEnc,
                supplierCode: item.supplierCode,
                supplierProductCode: item.supplierProductCode,
            }
        }));
        document.cookie="prodList="+JSON.stringify(submitData);
        this.props.history.push(`${PROD_PATH}/onlineOrder/orderConfirm?source=cart`);
    };

    render() {
        const { rightBtnStatus } = this.state;

        const { validProdList, invalidProdList } = this.props;

        let count = 0, chooseArr = [],totalLength = 0,amountTotal = 0;
        validProdList && validProdList.map((item) => item.get('chooseAllFlag') === 2 && count++);

        validProdList.toJS().forEach(prodList => {
            let list = prodList.items.filter((t)=> {
                return t.flag === true;
            });
            (list && list.length > 0) && (chooseArr = chooseArr.concat(list));
        });

        chooseArr.forEach((item) => {
            totalLength += item.quantity;
            amountTotal += item.quantity * item.salePrice;
        });

        return (
            <div className={cx(['container', 'cart'])}>
                <Header navStatus={'cartList'} rightClick={this.rightClick} rightBtnStatus={rightBtnStatus}/>

                <div className={cx('main')}>
                    {
                        validProdList && validProdList.map((item, index) => (
                            <CartCardWrap  status={1} key={index} comIndex={index} supplierCode={item.get('supplierCode')} supplierName={item.get('supplierName')} chooseAllFlag={item.get('chooseAllFlag')} dataSource={item.get('items')}/>
                        ))
                    }

                    {
                        invalidProdList.count() > 0 && (
                            <div className={cx('cart-invalid')}>
                                <div className={cx('cart-invalid-head')}>
                                    <span className={cx('cart-invalid-title')}>失效商品</span>
                                    <a href="#!" className={cx('cart-invalid-btn')} onClick={this.deleteValidConfirm.bind(this)}>清空失效商品</a>
                                </div>
                                {
                                    invalidProdList.map((item, index) => (
                                        <CartCardWrap status={2} key={index} comIndex={index} supplierName={item.get('supplierName')} dataSource={item.get('items')}/>
                                    ))
                                }
                            </div>
                        )
                    }

                    {
                        (validProdList.count() === 0 && invalidProdList.count() === 0) && (
                            <div className={cx('no-goods')}>
                                <span className={cx('no-goods-logo')}/>
                                <span className={cx('no-goods-words')}>空空如也~</span>
                                <span className={cx('no-goods-tips')}>您可以去商品列表添加商品</span>
                            </div>
                        )
                    }
                </div>


                {
                    (rightBtnStatus !== 0 && validProdList.count() !== 0) && (
                        <div className={cx('cart-bottom')}>
                            <span className={cx('check-btn')}><Checkbox onChange={() => {this.clickTotalList()}} checked={(validProdList && count === validProdList.count() && validProdList.count() > 0)}/></span>
                            <span className={cx('all')}>全选</span>
                            {
                                rightBtnStatus === 1 && (
                                    <span className={cx('total')}>合计： <span className={cx('red')}>{formatCurrency(amountTotal)}</span>元</span>
                                )
                            }
                            {
                                rightBtnStatus === 1 ? (
                                    chooseArr.length === 0 ? <a href="j#!" className={cx('submit-btn')}>马上订货</a> :
                                        <a href="#!" onClick={() => {this.submitOrder(chooseArr)}}  className={cx(['submit-btn', 'active'])}>马上订货</a>
                                ) : (
                                    chooseArr.length === 0 ? <a href="#!" className={cx('del-btn')}>删除</a> :
                                            <a href="#!" className={cx(['del-btn', 'active'])} onClick={this.deleteConfirm.bind(this, chooseArr)}>删除</a>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    invalidProdList: state.getIn(['cartListReducer', 'onlineOrderCartList' ,'invalidProdList']),
    validProdList: state.getIn(['cartListReducer', 'onlineOrderCartList', 'validProdList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        fetchOnlineOrderCartClickTotalList:onlineOrderCartActions.fetchOnlineOrderCartClickTotalList,
        asyncFetchCartData:onlineOrderCartActions.asyncFetchCartData,
        fetchOnlineOrderCartClearValidData: onlineOrderCartActions.fetchOnlineOrderCartClearValidData,
        fetchOnlineOrderCartEditCartData: onlineOrderCartActions.fetchOnlineOrderCartEditCartData
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CartList)
)
