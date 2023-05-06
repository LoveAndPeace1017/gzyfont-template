import React, { Component } from 'react';

import { Checkbox } from 'antd-mobile';
import CartCard from './cartCard';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";


import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as onlineOrderCartActions} from '../index';

const cx = classNames.bind(styles);

class CartCardWrap extends Component {

    chooseListAll (comIndex) {
        this.props.fetchOnlineOrderCartClickAllList(comIndex);
    }

    render() {
        let {comIndex, supplierName, dataSource, supplierCode, chooseAllFlag, status} = this.props;

        let cartCardData = {status, comIndex, supplierCode};

        let chooseCount = 0;

        if(status!== 3 && dataSource){
            dataSource && dataSource.map((item) => item.get('flag') && chooseCount++);
        }

        return (
            <div className={cx([{'cart-wrap1': status === 1}, {'cart-wrap2': status === 2}, {'cart-wrap3': status === 3}])}>
                <div className={cx('cart-company')}>
                    {
                        status === 1 && (
                             <Checkbox onChange={() => this.chooseListAll(comIndex)} checked={chooseAllFlag===2}/>
                        )
                    }
                    <span className={cx('company-name')}>{supplierName}</span>
                </div>
                <div className={cx('cart-prod-lst')}>
                    {
                        dataSource && dataSource.map((item, prodIndex) =>
                            <CartCard key={item} {...cartCardData} item={item} prodIndex={prodIndex}/>
                        )
                    }

                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => ({
    onlineOrderCartList: state.getIn(['onlineOrderCartIndex', 'onlineOrderCartList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartData: onlineOrderCartActions.asyncFetchCartData,
        asyncFetchModifyCartAmount: onlineOrderCartActions.asyncFetchModifyCartAmount,
        fetchOnlineOrderCartClickOneList:onlineOrderCartActions.fetchOnlineOrderCartClickOneList,
        fetchOnlineOrderCartClickAllList:onlineOrderCartActions.fetchOnlineOrderCartClickAllList,
        fetchOnlineOrderCartEditCartData: onlineOrderCartActions.fetchOnlineOrderCartEditCartData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CartCardWrap)