import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Table } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';
import {asyncFetchPrice} from '../actions';
import Auxiliary from 'pages/auxiliary';
import {formatCurrency, removeCurrency} from 'utils/format';
import intl from 'react-intl-universal';
import {AuthInput} from 'components/business/authMenu';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

const {Column} = Table;

class Price extends Component {

    state = {
        auxiliaryVisible: false,
        auxiliaryKey: '',
    };


    openManage(type, auxiliaryKey) {
        this.setState({
            [type]: true,
            auxiliaryKey
        })
    }

    closeManage(type) {
        this.setState({
            [type]: false
        })
    }

    handleDiscountChange = (recId, e) => {
        const {form: {setFieldsValue, getFieldValue}} = this.props;
        const salePrice = getFieldValue('salePrice');
        if(salePrice){
            setFieldsValue({
                [`customerLevelPrices[${recId}].salePrice`]: removeCurrency(formatCurrency(salePrice * e.target.value/100, 3, true))
            })
        }
    };

    handleDiscountPriceChange = (recId, e) => {
        const {form: {setFieldsValue, getFieldValue}} = this.props;
        const salePrice = getFieldValue('salePrice');
        let percentage = e.target.value/salePrice * 100;
        if(salePrice){
            setFieldsValue({
                [`customerLevelPrices[${recId}].percentage`]: Math.round(percentage)
            })
        }
    };

    componentDidMount() {
        // const {match: {params}} = this.props;
        // //初始化列表数据
        // if(!params.id){
        //     this.props.asyncFetchCustomerLvList();
        // }
    }

    render() {

        const {form: {getFieldDecorator},match: {params}, customerLvList, initBaseInfo, initCustomerLevel, customerLvListDataSource} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        //新增页面从客户级别那边带的数据
        // const customerLvListData = customerLvList && customerLvList.getIn(['data']);
        // let customerLvListDataSource = [];
        // if(params.id){
        //     customerLvListDataSource = initCustomerLevel && initCustomerLevel.size>0 && initCustomerLevel.map((item, index) => {
        //         return {
        //             key: item.get('recId') || index,
        //             name: item.get('name'),
        //             percentage:item.get('percentage'),
        //             salePrice:item.get('salePrice'),
        //             id: item.get('id'),
        //             recId: item.get('recId') || index
        //         }
        //     }).toJS();
        // } else{
        //     if(customerLvListData && customerLvListData.size>0 && (!customerLvListData.get('retCode'))){
        //         customerLvListDataSource =customerLvListData.map((item) => {
        //             return {
        //                 key: item.get('recId'),
        //                 name: item.get('name'),
        //                 percentage:item.get('percentage'),
        //                 salePrice:item.get('salePrice'),
        //                 id: item.get('id'),
        //                 recId: item.get('recId')
        //             }
        //         }).toJS();
        //     }
        // }

        return (
            <React.Fragment>

                <Table
                    dataSource={customerLvListDataSource?customerLvListDataSource:[]}
                    pagination={false}
                    loading={customerLvList.get('isFetching')}
                    className={cx("tb-account")}
                >
                    <Column
                        title={
                            <React.Fragment>
                                <span>{intl.get("goods.add.customerLv")}</span>
                                <a href="#!" className={cx("clv-mg")} onClick={this.openManage.bind(this, 'auxiliaryVisible', 'customerLv')}>{intl.get('common.confirm.manage')}</a>
                            </React.Fragment>
                        }
                        dataIndex="name"
                        key="name"
                        render={(text, data)=>(
                            <React.Fragment>
                                <span>{text}</span>
                                {
                                    getFieldDecorator(`customerLevelPrices[${data.recId}].name`, {
                                        initialValue: text
                                    })(<Input type="hidden"/>)
                                }
                                {
                                    getFieldDecorator(`customerLevelPrices[${data.recId}].id`, {
                                        initialValue: data.id
                                    })(<Input type="hidden"/>)
                                }
                            </React.Fragment>
                        )}
                    />
                    <Column
                        title={intl.get('goods.add.percentage')}
                        dataIndex="percentage"
                        key="percentage"
                        render={(percentage, record) => (
                            <React.Fragment>
                                <Form.Item
                                    className={cx("input-item-discount")}>
                                    {
                                        getFieldDecorator(`customerLevelPrices[${record.recId}].percentage`, {
                                            initialValue: percentage,
                                            rules: [
                                                {
                                                    validator: (rules, val, callback) => {
                                                        let pattern = new RegExp(/^((?!0)\d{1,2}|100)$/);
                                                        if(!pattern.test(val)){
                                                            callback(intl.get('goods.add.validate12'))
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ],
                                        })(
                                            <Input maxLength={10} onChange={this.handleDiscountChange.bind(this, record.recId)}/>
                                        )
                                    }
                                </Form.Item>
                                <span className={cx("percent")}>%</span>
                            </React.Fragment>
                        )}
                    />
                    <Column
                        title={intl.get('goods.add.salePrice1')}
                        dataIndex="salePrice"
                        key="salePrice"
                        render={(salePrice, record) => (
                            <React.Fragment>
                                {
                                    getFieldDecorator(`customerLevelPrices[${record.recId}].salePrice`, {
                                        initialValue: salePrice
                                    })(
                                        //<Input maxLength={14} disabled={this.state.salePriceDisabled} onChange={this.handleDiscountPriceChange.bind(this, record.recId)}/>
                                        <AuthInput maxLength={14}  onChange={this.handleDiscountPriceChange.bind(this, record.recId)}
                                                   module="salePrice" option="show" noAuthRender="**"
                                        />
                                    )
                                }
                            </React.Fragment>
                        )}
                    />
                </Table>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeManage.bind(this, 'auxiliaryVisible')}
                />
            </React.Fragment>
        );
    }
}

// const mapStateToProps = (state) => ({
//     customerLvList: state.getIn(['auxiliaryCustomerLv', 'customerLvList'])
// });

// const mapDispatchToProps = dispatch => {
//     return bindActionCreators({
//         asyncFetchCustomerLvList: customerLvActions.asyncFetchCustomerLvList
//     }, dispatch)
// };

export default Price; //default connect(null, mapDispatchToProps)(Price)