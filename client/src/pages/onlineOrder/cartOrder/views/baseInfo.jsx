import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Select, Divider, DatePicker } from 'antd';
import defaultOptions from 'utils/validateOptions';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import {withRouter} from "react-router-dom";

import Panel from 'components/business/panel';
import WidgetsIcon from 'components/widgets/icon';
import {SelectProject} from 'pages/auxiliary/project';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectAddress} from 'pages/auxiliary/deliveryAddress'

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const {TextArea} = Input;
const Option = Select.Option;


class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: null,
            open: false,
            // deliveryAddrData:[]
        };
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.currentTime;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };
    handleEndOpenChange = (open) => {
        let me = this;
        if(open){
            me.currentTime = moment();
        }
        this.setState({currentTime:moment() });
    };

    /*deliveryAddrDropdown=(open)=>{
        if(open){
            const customer = this.props.form.getFieldValue('customer');
            if((this.state.deliveryAddrData.length===0 ||this.state.deliveryAddrData.size===0) && (!customer || customer.key === '')){
                Modal.warning({
                    title: '提示信息',
                    content: '请先选择客户!'
                })
            }else{
                this.setState({
                    open: true
                })
            }
        }else{
            this.setState({
                open: false
            })
        }
    };*/

    render() {
        const {form: {getFieldDecorator}, listData, orders, addressList } = this.props;
        //获取默认仓库地址
        let initDeliveryAddress = '';
        const wareAddresses = addressList && addressList.getIn(['address','data','data']);
        const defaultSelectValue = wareAddresses && wareAddresses.filter(item=>{
            return item.get('isMain') === 1;
        }).get(0);
        if( orders && orders.deliveryAddress){
            initDeliveryAddress = orders.deliveryProvinceCode + ' '+
                orders.deliveryProvinceText+ ' '+
                orders.deliveryCityCode+ ' '+
                orders.deliveryCityText+ ' '+
                orders.deliveryAddress;
        }else if(defaultSelectValue && defaultSelectValue.get('receiverAddress')){
            initDeliveryAddress = defaultSelectValue.get('receiverProvinceCode')+ ' '+
                defaultSelectValue.get('receiverProvinceText')+ ' '+
                defaultSelectValue.get('receiverCityCode')+ ' '+
                defaultSelectValue.get('receiverCityText')+ ' '+
                defaultSelectValue.get('receiverAddress');
        }

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

        const otherFormItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20},
            }
        };
        return (
            <React.Fragment>
                <Panel title="收货信息"
                       extra={<WidgetsIcon type="right" className={cx("trigger-more")}/>}
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label="收货方"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("ourName", {
                                        ...defaultOptions,
                                        initialValue: orders && orders.ourName,
                                        rules: [
                                            {
                                                required: true,
                                                message: '收货方为必填项！'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={80}/>
                                    )

                                }
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="收货人"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("ourContacterName", {
                                        ...defaultOptions,
                                        initialValue: orders && orders.ourContacterName,
                                        rules: [
                                            {
                                                required: true,
                                                message: '收货人为必填项！'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={25}/>
                                    )

                                }
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="联系电话"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("ourTelNo", {
                                        ...defaultOptions,
                                        initialValue: orders && orders.ourTelNo,
                                        rules: [
                                            {
                                                required: true,
                                                message: '联系电话为必填项！'
                                            }
                                        ]
                                    })(
                                        <Input maxLength={50}/>
                                    )

                                }
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="交付地址"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("deliveryAddress", {
                                        ...defaultOptions,
                                        initialValue: initDeliveryAddress
                                    })(
                                        <SelectAddress showEdit={true}/>
                                    )

                                }
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="交付日期"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("deliveryDeadlineDate", {
                                        // initialValue: orders.deliveryDeadlineDate && moment(orders.deliveryDeadlineDate),
                                    })(
                                        <DatePicker
                                            disabledDate={this.disabledEndDate}
                                            onOpenChange={this.handleEndOpenChange}
                                            locale={locale}
                                            onChange={this.onChange}/>
                                    )
                                }
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                label="项目"
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator("project", {
                                        ...defaultOptions
                                    })(
                                        <SelectProject/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="mt20">
                        <Col span={16}>
                            <Form.Item
                                label={"备注"}
                                {...otherFormItemLayout}
                            >
                                {
                                    getFieldDecorator("contractTerms", {
                                        ...defaultOptions
                                    })(
                                    <TextArea rows={4} maxLength={2000} placeholder="备注"/>
                                    )
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                </Panel>
            </React.Fragment>
        )
    }
}

export default BaseInfo