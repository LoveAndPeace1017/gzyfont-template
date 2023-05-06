import React, { Component } from 'react';
import { Spin, Button, message} from 'antd';

import defaultOptions from 'utils/validateOptions';
import {formatCurrency} from 'utils/format';
import {withRouter} from "react-router-dom";

import Crumb from 'components/business/crumb';
import AddForm, {actions as addFormActions}  from 'components/layout/addForm';

import BaseInfo from './baseInfo';
import CartHeader from './cartHeader';
import CartTable from './cartTable';

import {actions as onlineOrderCartOrderActions} from '../index'
import {reducer as onlineOrderCartOrderIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {getUrlParamValue} from 'utils/urlParam';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnStyle: {
                marginTop: -12,
                marginBottom: -12,
                borderRadius: 0,
                float: 'right',
                height: 58,
                width: 180,
                background: '#339866',
                fontWeight: 700,
                fontSize: 18,
            }
        };
    }
    componentDidMount() {
        let prodList = JSON.parse(localStorage.getItem("prodList"));
        let _this = this;
        this.props.asyncFetchCartDetailData(prodList, (res)=>{
            if (res.retCode == '0') {
                this.props.setInitFinished();
            }
            else {
                alert(res.retMsg);
                _this.props.history.push('/onlineOrder/cartList/')
            }

        });
        this.setState({
            source:getUrlParamValue('source')
        });
    }

    handleSubmit = (e) =>  {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let _this = this;
            if (!err) {
                //处理交货地址
                let deliveryProvinceCode = '';
                let deliveryProvinceText = '';
                let deliveryCityCode = '';
                let deliveryCityText = '';
                let deliveryAddress = '';
                if (values.deliveryAddress) {
                    const deliveryAddressArr = values.deliveryAddress.split(' ');
                    deliveryProvinceCode = deliveryAddressArr[0];
                    deliveryProvinceText = deliveryAddressArr[1];
                    deliveryCityCode = deliveryAddressArr[2];
                    deliveryCityText = deliveryAddressArr[3];
                    deliveryAddress = deliveryAddressArr[4];
                }
                let formData = {
                    ...values,
                    deliveryAddress,
                    deliveryCityText,
                    deliveryCityCode,
                    deliveryProvinceText,
                    deliveryProvinceCode,
                };
                if(this.state.source=='cart'){
                    formData.cart = 1;
                }
                formData.prodList = JSON.parse(localStorage.getItem("prodList"));
                formData.deliveryDeadlineDate = formData.deliveryDeadlineDate && moment(formData.deliveryDeadlineDate).format('YYYY-MM-DD');
                formData.projectName = formData.project;

                delete formData.project;
                _this.props.form.resetFields();
                _this.props.asyncFetchSubmitCartData(formData, (res) => {
                    if (res.data.retCode == '0') {
                        message.success('操作成功！');
                        this.props.emptyFieldChange();
                        localStorage.setItem("prodList", JSON.stringify([]));
                        _this.props.history.push('/onlineOrder/purchase')
                    }
                    else {
                        message.error(res.data.retValidationMsg.rowMsg[0].msgs[0].msg);
                    }
                })
            }
        });
    };
    render() {
        const {isFetching, data} = this.props;
        const listData = data ? data.toJS() : [];
        const orders = listData.orders ? listData.orders[0]: {};
        const warehouses = data && data.get('warehouses');
        const {btnStyle} = this.state;
        return (
            <React.Fragment>
                <div className={cx(['content-hd', 'cart-order'])}>
                    <Crumb data={[
                        {
                            url: '/onlineOrder/',
                            title: '在线订货'
                        },
                        {
                            title: '购物车'
                        },
                        {
                            title: '新建订货单'
                        }
                    ]}/>
                </div>
                <Spin
                    spinning={false}
                >

                    <AddForm onSubmit={this.handleSubmit}
                        footerBar={
                            <div>
                                <Button type="primary" style={btnStyle} htmlType="submit">
                                    提交订单
                                </Button>
                                <p className={cx('prod-bottom')}>总金额： <span className={cx('cart-weight-bold')}>{listData && formatCurrency(listData.totalAmount)}</span>元</p>
                                <p className={cx('prod-bottom')}>总数量： <span className={cx('cart-weight-bold')}>{listData && listData.total}</span>项</p>
                            </div>
                        }
                    >
                        {
                            listData && <BaseInfo  {...this.props} listData={listData} orders={orders} warehouses={warehouses}/>
                        }

                    </AddForm>

                    <CartHeader />
                    <div style={{ marginBottom: 100}}>
                        {
                            listData  && listData.orders && listData.orders.map((item, index) => (
                                <CartTable key={index}  supplierName={item.supplierName}  dataSource={item.prodList}/>
                            ))
                        }
                    </div>


                </Spin>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    isFetching: state.getIn(['onlineOrderCartOrderIndex', 'onlineOrderCartOrderList', 'isFetching']),
    data: state.getIn(['onlineOrderCartOrderIndex', 'onlineOrderCartOrderList', 'data']),
    addressList: state.getIn(['auxiliaryAddress', 'addressList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartDetailData: onlineOrderCartOrderActions.asyncFetchCartDetailData,
        asyncFetchSubmitCartData: onlineOrderCartOrderActions.asyncFetchSubmitCartData,
        setInitFinished: addFormActions.setInitFinished
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        AddForm.create(OrderDetail)
    )
)

