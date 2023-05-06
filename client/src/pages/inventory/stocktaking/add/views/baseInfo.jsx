import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, Modal, DatePicker, Form } from 'antd';
import {SelectUnit} from 'pages/auxiliary/goodsUnit'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';

export default class BaseInfo extends Component {


    beforeChangeWarehouseName = (callback)=>{
        Modal.confirm({
            content: intl.get("stocktaking.add.baseInfo.message"),
            onOk: () =>{
                this.props.emptyProdList(callback);
            },
            onCancel(){}
        });
    };

    render() {

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
                            {...formItemLayout}
                            name="checkDate"
                            label={intl.get("stocktaking.add.baseInfo.checkDate")}
                        >
                            <DatePicker disabled/>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="warehouseName"
                            rules={[
                                {
                                    required: true,
                                    message: intl.get("stocktaking.add.baseInfo.warehouseNameMessage")
                                }
                            ]}
                            label={intl.get("stocktaking.add.baseInfo.warehouseName")}
                        >
                            <SelectDeliveryAddress showEdit={true} isWareHouses={true}
                                                   beforeChange={this.beforeChangeWarehouseName}
                                                   onChange={(warehouseName) => this.props.handleWarehouseNameChange(warehouseName)}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        )
            ;
    }
}

