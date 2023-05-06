import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import {formatCurrency, removeCurrency} from 'utils/format';
import { Row, Col, Input, Layout, Table, Modal, Button, Form} from 'antd';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
class DetailCostShare extends Component {
    constructor(props) {
        super(props);

        const list = props.list|| [];
        this.state = {
            list
        }
    }

    costChange(value,data,type,record) {
        const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
        let preData = this.state.list;
        let changeValue = (value.target.value)/1;
        if (Number.isNaN(changeValue) || !reg.test(changeValue)) {
            return false;
        }else{
            if(type == 'amount'){
                data.allocatedAmount = (data.allocatedAmount/1+(changeValue/1-data.amount/1));
                data.amount = changeValue;
            }else{
                data.allocatedAmount = (data.allocatedAmount/1+(changeValue/1-data.makeCost||0));
            }
            this.setState({
                list:preData
            });
        }

    }

    onOk=(values) => {
        this.props.onOk(values);
    };

    render() {
        const {list} = this.state;
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        //对数据处理
        let allTd1 = 0;
        let allTd2 = 0;
        let allTd3 = 0;

        let dealData = list.filter((item,index)=>{
            let obj = item;
            obj.allocatedAmount = removeCurrency(formatCurrency(obj.allocatedAmount/1,3));
            obj.amount = removeCurrency(formatCurrency(obj.amount/1,3));
            obj.makeCost = removeCurrency(formatCurrency(item.allocatedAmount/1 - item.amount/1,3));
            allTd1 = allTd1 + obj.amount/1;
            allTd2 = allTd2 + obj.makeCost/1;
            allTd3 = allTd3 + obj.allocatedAmount/1;
            return obj;
        });

        console.log(dealData,'dealData');

        const columns = [
            {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial'
            },
            {
                title: '物品编号',
                dataIndex: 'prodCustomNo',
                key: 'prodCustomNo',
            },
            {
                title: '物品名称',
                dataIndex: 'prodName',
                key: 'prodName'
            },
            {
                title: '规格型号',
                dataIndex: 'descItem',
                key: 'descItem',
            },
            {
                title: '入库数量',
                dataIndex: 'quantity',
                key: 'quantity',
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
            {
                title: '原材料成本',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount,data,record) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                label=""
                                name={["cost", record, "amount"]}
                                rules={[
                                    {
                                        required: true,
                                        message: '原材料成本为必填项',
                                    },
                                    {
                                        validator: (rules, value, callback) => {
                                            const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                            if (Number.isNaN(value) || !reg.test(value)) {
                                                callback("输入整数不超过10位小数不超过3位的正数");
                                            }
                                            callback();
                                        }
                                    }
                                ]}>
                                <Input onChange={(value) => this.costChange(value, data, 'amount', record)}/>
                            </Form.Item>

                            <div style={{display: "none"}}>
                                <Form.Item
                                    name={["cost", record, "key"]}
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                                <Form.Item
                                    name={["cost", record, "quantity"]}
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                            </div>
                        </React.Fragment>
                    )
                }
            },
            {
                title: '加工费',
                dataIndex: 'makeCost',
                key: 'makeCost',
                render: (price,data,record) => {
                    return <Form.Item
                        label=""
                        name={["cost",record,"makeCost"]}
                        rules={[
                            {
                                required: true,
                                message: '加工费为必填项',
                            },
                            {
                                validator: (rules, value, callback) => {
                                    const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                    if (Number.isNaN(value) || !reg.test(value)) {
                                        callback("输入整数不超过10位小数不超过3位的正数");
                                    }
                                    callback();
                                }
                            }
                        ]}>
                        <Input onChange={(value)=>this.costChange(value,data,'makeCost')}/>
                    </Form.Item>
                }
            },
            {
                title: '分摊金额',
                dataIndex: 'allocatedAmount',
                key: 'allocatedAmount'
            },
        ];


        return (
            <React.Fragment>
                <Form
                    onFinish={this.onOk}
                    initialValues={{cost:dealData}}
                >
                <div className={cx("all-price")}>消耗原料总成本：{this.props.consumeTotalCost || 0} 元</div>
                <Table dataSource={dealData} columns={columns} pagination={false}/>
                <div className={cx("end-total")}>
                    <span>合计</span>
                    <span className={cx("total-price")}>总分摊金额：<span className={"red"}>{formatCurrency(allTd3,3)}</span> 元</span>
                    <span className={cx("total-price")}>总加工费：<span className={"red"}>{formatCurrency(allTd2,3)}</span> 元</span>
                    <span className={cx("total-price")}>总原材料成本：<span className={"red"}>{formatCurrency(allTd1,3)}</span> 元</span>
                </div>

                    <Form.Item>
                        <div style={{paddingTop: "15px",float: "right"}}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }

}


export default DetailCostShare