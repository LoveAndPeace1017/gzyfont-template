import React, { Component } from 'react';
import classNames from "classnames/bind";

import ControlAmount from 'components/business/controlAmount';
import {formatCurrency} from 'utils/format';
import {CheckBoxBtn1, CheckBoxBtn2, CheckBoxBtn3} from './checkBtn';
import { Modal, message } from 'antd';

const confirm = Modal.confirm;


import {actions as onlineOrderCartActions} from '../index'
import {reducer as onlineOrderCartIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import prodImg120 from 'images/prodImg120.png'

class CartTable extends  Component {
    constructor(props) {
        super(props);
    }
    chooseListAll (comIndex) {
        this.props.fetchOnlineOrderCartClickAllList(comIndex);
    }
    clickOneList(comIndex, prodIndex) {
        this.props.fetchOnlineOrderCartClickOneList(comIndex, prodIndex);
    }
    onChange (val,item, prodIndex, comIndex) {
        let params = {
            quantity: val,
            supplierUserIdEnc: item.get('supplierUserIdEnc'),
            supplierProductCode: item.get('supplierProductCode')
        };
        this.props.asyncFetchModifyCartAmount('edit', [params], prodIndex, comIndex);
    }
    deleteConfirm  = (supplierUserIdEnc, supplierProductCode) => {
        let _this = this;
        confirm({
            title: '提示信息',
            content: (
                <React.Fragment>
                    <p>您确定要删除商品信息吗？</p>
                </React.Fragment>
            ),
            onOk() {
                const params = {
                    supplierUserIdEnc: supplierUserIdEnc,
                    supplierProductCode: supplierProductCode
                }
                _this.props.fetchOnlineOrderCartEditCartData('del',[params],(res)=>{
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
    };
    render() {
        let {comIndex, supplierName, supplierUserIdEnc, chooseAllFlag, invalid, dataSource} = this.props;

        let chooseCount = 0;
        dataSource && dataSource.map((item) => item.get('flag') && chooseCount++);

        return (
            <React.Fragment>
                <span className={cx(['ant-table', {'cart-table-disabled': invalid}])} style={{marginBottom: 20,display: 'block',position: 'relative'}}>
                    {invalid && (<span className={cx('mask')} />)}
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
                                    <span onClick={() => this.chooseListAll(comIndex)}>
                                        {
                                            invalid  ?  '' :
                                            (chooseAllFlag ===  1) ?  <CheckBoxBtn1 /> :
                                                (chooseAllFlag === 2) ?  <CheckBoxBtn2/> :
                                                    <CheckBoxBtn3/>
                                        }
                                    </span>
                                </th>
                                <th className="" colSpan={6} style={{textAlign: 'left'}}>{supplierName}</th>
                            </tr>
                        </thead>

                            <tbody className="ant-table-tbody" style={{ background: '#fff'}}>
                            {
                                dataSource.map((item, prodIndex) =>
                                    <tr className="ant-table-row ant-table-row-level-0"  key={prodIndex} >
                                        <td className="" width="8%">
                                                <span onClick={()=>this.clickOneList(comIndex, prodIndex)}>
                                                    {
                                                        invalid  ?  <span className={cx("invalidBtn")}>失效</span> :
                                                        (item.get('flag') === false) ? <CheckBoxBtn1/> : <CheckBoxBtn2/>
                                                    }
                                                </span>
                                        </td>
                                        <td className="" width="10%">
                                            <div className={cx("prod-img") + " sl-vam"}>
                                                <div className="sl-vam-outer">
                                                    <div className="sl-vam-inner">
                                                        <img src={item.get('thumbnailUri') ? item.get('thumbnailUri') : prodImg120}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="" width="22%">
                                            <div className={cx("prod-intro-wrap")}>
                                                <a className={cx("prod-tit")} href="#!">{item.get('prodName')}</a>
                                                <span className={cx("prod-kind")}>{item.get('description')}</span>
                                            </div>
                                        </td>
                                        <td className="" width="15%">
                                            {invalid  ?  item.get('quantity') : <ControlAmount onChange={(val) => this.onChange(val, item, prodIndex, comIndex)} amount={item.get('quantity')} />}
                                            <span className={cx('cart-unit')}>{item.get('unit')}</span>
                                        </td>
                                        <td className="" width="15%">
                                            {formatCurrency(item.get('salePrice'))}
                                        </td>
                                        <td className="" width="15%">
                                            {formatCurrency(item.get('salePrice')*item.get('quantity'))}
                                        </td>
                                        <td className="" width="15%">
                                            <a href="#!" className={cx(['mr5', 'del-btn'])} onClick={this.deleteConfirm.bind(this,supplierUserIdEnc,item.get('supplierProductCode'))}>删除</a>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </span>
            </React.Fragment>
        )
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(CartTable)
