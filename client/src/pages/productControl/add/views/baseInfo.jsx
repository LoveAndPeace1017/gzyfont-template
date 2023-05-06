import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, DatePicker, Form, Modal} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {EllipsisOutlined} from '@ant-design/icons';
import GoodsPop from './goodsPop';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import {getCookie} from 'utils/cookie';


import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsPopVisible: false
        };
    }

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    showGoodsList = () => {
        this.openModal('goodsPopVisible');
    };

    handleGoodsPopOnOK = (list, bomList) => {
        const {setFieldsValue} = this.props.formRef.current;
        console.log(list,'list');
        if (list.length > 0) {
            const item = list[0];
            setFieldsValue({
                prodName: item.prodName,
                productCode: item.code,
                expectCount: item.quantity,
                prodBillNos:item.displayCode
            });
            let {bomCode, level, quantity} = list[0];
            if(bomCode){
                this.props.fetchProcessList({bomCode, level, quantity});
            }
        }
    };

    render() {
        let { goodsPopVisible } = this.state;
        const { initBaseInfo } = this.props;
        let { getFieldValue } = this.props.formRef.current;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);

        console.log(initBaseInfo && initBaseInfo.toJS(),'initBaseInfo');

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


        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="工单名称"
                            name={"sheetName"}
                            initialValue = {initBaseInfo && initBaseInfo.get("sheetName")}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: "工单名称为必填项！"
                            //     }
                            // ]}
                            {...formItemLayout}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="计划开始时间"
                            name={"expectStartDate"}
                            {...formItemLayout}
                            // rules={[{ type: 'object',required: true,message: "该项为必填项"}]}
                        >
                             <DatePicker className={"gb-datepicker"} format="YYYY-MM-DD HH:mm" showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="计划结束时间"
                            name={"expectEndDate"}
                            {...formItemLayout}
                            rules={[
                                // { type: 'object',required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, val, callback) => {
                                        let expectStartDate = getFieldValue('expectStartDate');
                                        if(val && expectStartDate && expectStartDate.isAfter(val)){
                                            callback('计划结束时间应大于计划开始时间');
                                        }
                                        callback();
                                    },
                                }
                            ]}
                        >
                            <DatePicker className={"gb-datepicker"} format="YYYY-MM-DD HH:mm" showTime={{ defaultValue: moment('00:00:00', 'HH:mm') }}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="计划生产物品"
                            name={"prodName"}
                            initialValue = {initBaseInfo && initBaseInfo.get("prodName")}
                            rules={[
                                { required: true,message: "计划生产物品为必填项"}
                            ]}
                            {...formItemLayout}
                        >
                            <Input
                                allowClear={true}
                                readOnly={true}
                                onClick={this.showGoodsList}
                                suffix={<EllipsisOutlined style={{fontSize: "16px"}} onClick={this.showGoodsList}/>}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="计划产量"
                            name={"expectCount"}
                            rules={[
                                {
                                    required: true,
                                    message: '计划产量为必填项',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                            {...formItemLayout}
                        >
                            <Input maxLength={14} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="负责人"
                            name={"officerId"}
                            initialValue = {initBaseInfo && initBaseInfo.get("officerId")}
                            {...formItemLayout}
                        >
                            <SelectEmployeeIdFix showFullSize={true}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="物品编号"
                            name={"prodBillNos"}
                            initialValue = {initBaseInfo && initBaseInfo.get("prodDisplayCode")}
                            {...formItemLayout}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="销售单号"
                            name={"displaySaleBillNo"}
                            initialValue = {initBaseInfo && initBaseInfo.get("displaySaleBillNo")}
                            {...formItemLayout}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="客户订单号"
                            name={"saleCustomerOrderNo"}
                            initialValue = {initBaseInfo && initBaseInfo.get("saleCustomerOrderNo")}
                            {...formItemLayout}
                        >
                            <Input disabled={true}/>
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{display: "none"}}>
                    <Form.Item
                        name={"saleBillNo"}
                        initialValue = {initBaseInfo && initBaseInfo.get("saleBillNo")}
                        {...formItemLayout}
                    >
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label=""
                        name={"productCode"}
                        initialValue = {initBaseInfo && initBaseInfo.get("productCode")}
                        {...formItemLayout}
                    >
                        <Input type="hidden"/>
                    </Form.Item>
                </div>


                <Modal
                    visible={goodsPopVisible}
                    title={'选择物品'}
                    width={'1400px'}
                    footer={null}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    destroyOnClose={true}
                    okText={'确定'}
                    cancelText={'取消'}
                >
                    <GoodsPop
                        onCancel={() => this.closeModal('goodsPopVisible')}
                        onOk={(list, bomList) => this.handleGoodsPopOnOK(list, bomList)}
                    />
                </Modal>


                {/*<SelectGoodsOrFitting*/}
                    {/*visible={goodsPopVisible}*/}
                    {/*visibleFlag={'goodsPopVisible'}*/}
                    {/*onOk={(selectedRows, visibleKey) => this.onProductChange(selectedRows, visibleKey)}*/}
                    {/*onCancel={() => this.closeModal('goodsPopVisible')}*/}
                    {/*selectType={'radio'}*/}
                    {/*popType={'goods'}*/}
                    {/*condition={{disableFlag: 0}}*/}
                    {/*selectedRows={selectedRows}*/}
                    {/*selectedRowKeys={selectedRowKeys}*/}
                    {/*salePriceEditable={false}*/}
                {/*/>*/}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)