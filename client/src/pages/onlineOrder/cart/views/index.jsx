import React, { Component } from 'react';
import { Spin } from 'antd';

import CartHeader from './cartHeader';
import CartTable from "./cartTable";
import CartBottom from './cartBottom';

import Crumb from 'components/business/crumb';

import {actions as onlineOrderCartActions} from '../index'
import {reducer as onlineOrderCartIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.asyncFetchCartData();
    }
    render() {
        let {onlineOrderCartList} = this.props;
        return (
            <React.Fragment>
                <div className={cx(["content-hd", "cart-order"])}>
                    <div className="content-hd">
                        <Crumb data={[
                            {
                                url: '/onlineOrder/',
                                title: '在线订货'
                            },
                            {
                                title: '购物车'
                            }
                        ]}/>
                    </div>
                    <Spin
                        spinning={onlineOrderCartList.get('isFetching')}
                    >
                        <div className={cx('cart-wrap')}>
                            <div style={{marginBottom: 10}}>
                                <CartHeader />
                            </div>

                            {/*/!*未失效的商品*!/*/}
                            {
                                onlineOrderCartList.get('validProdList') && onlineOrderCartList.get('validProdList').map((item, index) => (
                                    <CartTable key={index} comIndex={index} supplierUserIdEnc={item.get('supplierId')} supplierName={item.get('supplierName')} chooseAllFlag={item.get('chooseAllFlag')}  invalid={false} dataSource={item.get('items')}/>
                                ))
                            }

                            {/*/!*失效的商品*!/*/}
                            {
                                onlineOrderCartList.get('invalidProdList') && onlineOrderCartList.get('invalidProdList').map((item, index) => (
                                    <CartTable key={index} comIndex={index} supplierName={item.get('supplierName')} invalid={true} dataSource={item.get('items')}/>
                                ))
                            }

                            <CartBottom />
                        </div>
                    </Spin>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    onlineOrderCartList: state.getIn(['onlineOrderCartIndex', 'onlineOrderCartList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartData:onlineOrderCartActions.asyncFetchCartData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart)


