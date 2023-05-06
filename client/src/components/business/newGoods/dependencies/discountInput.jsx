import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Input, Form, Modal } from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {formatCurrency, removeCurrency} from 'utils/format';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {AddPkgOpen} from "components/business/vipOpe";

import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";

import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
/**
 *  优惠金额输入框功能
 *
 * @visibleName DiscountInput(优惠金额)
 * @author jinb
 *
 */

class DiscountInput extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // 获取VIP相关信息
        this.getVipInfo();
    }

    // 获取Vip信息
    getVipInfo = () => {
        this.props.asyncFetchVipService();
    };

    onChange = (e) => {
        let value = e.target.value;
        this.props.onChange(value);
    };

    openModal = (tag)=>{
        this.setState({
            [tag]:true
        })
    };

    closeModal = (tag)=>{
        this.setState({
            [tag]:false
        })
    };


    render() {
        const {vipService, title, discountAmount} = this.props;

        let dataSource = vipService.getIn(['vipData','data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let valueAdd = dataSource.VALUE_ADDED || {};  //增值包数据
        let vipFlag = false;
        vipFlag = valueAdd.vipState === 'TRY' || valueAdd.vipState === 'OPENED';

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            }
        };

        return (
            <React.Fragment>
                <AddPkgOpen
                    onTryOrOpenCallback={() => this.openModal('serialModalVisible')}
                    openVipSuccess={() => this.getVipInfo()}
                    vipInfo={valueAdd}
                    source={'discount'}
                    render={() => (
                        <Form.Item
                            label={title}
                            {...formItemLayout}
                            name="discountAmount"
                            initialValue={discountAmount || 0}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        let {getFieldInstance} =  this.props.formRef.current;
                                        let totalAmount = getFieldInstance('totalAmount').state.value;

                                        if(totalAmount) totalAmount = Number(removeCurrency(totalAmount));
                                        console.log(value, totalAmount);
                                        // if(value) value = Number(removeCurrency(totalAmount));
                                        const reg = /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/;
                                        if(!value){
                                            callback();
                                        } else if (!reg.test(value)) {
                                            callback(intl.get("components.goods.discountInput.message1"));
                                        } else if(value > totalAmount) {
                                            callback(intl.get("components.goods.discountInput.message2"));
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input
                                disabled={!vipFlag}
                                onBlur={this.onChange}
                                style={{width:'100%', ...this.props.style}}
                                maxLength={this.props.maxLength}
                            />
                        </Form.Item>
                    )}
                />
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService'])
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};


export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(DiscountInput)
)
