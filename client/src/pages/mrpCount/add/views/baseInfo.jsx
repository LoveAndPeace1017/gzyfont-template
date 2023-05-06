import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, Modal, DatePicker, Form, Select} from 'antd';
import {connect} from "react-redux";
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {QuestionCircleOutlined} from '@ant-design/icons';
import Tooltip from 'components/widgets/tooltip';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);
const { Option } = Select;

class BaseInfo extends Component {

    getChange = ()=>{
        this.props.getChange();
    }


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
                            name="netFlag"
                            initialValue={"0"}
                            label={"建议量取值"}
                            rules={[
                                {
                                    required: true,
                                    message: "建议量取值为必填项"
                                }
                            ]}
                        >
                            <Select onChange={this.getChange}>
                                <Option value="0">毛需求</Option>
                                <Option value="1">净需求</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="stockRule"
                            label={"可用库存规则"}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="可用库存规则"
                                onChange={this.getChange}
                            >
                                <Option value="PURCHASE">在途数量</Option>
                                <Option value="PRODUCE">在产数量</Option>
                                <Option value="OUTSOURCE">委外待入库数量</Option>
                                <Option value="POCC">生产占用量</Option>
                            </Select>
                        </Form.Item>
                        <Tooltip
                            type="info"
                            title={<div>
                                <p>在途数量：采购未入库数量</p>
                                <p>在产数量：生产未入库数量</p>
                                <p>委外待入库数量：委外未入库数量</p>
                                <p>生产占用量：生产计划消耗量减去累计领用量</p>
                                <p>可用库存=库存数量+在途数量+在产数量+委外待入库数量-生产占用量</p>
                                <p>选中后则添加选择的值进行计算，不选择则取库存数量</p>
                            </div>}
                        >
                            <QuestionCircleOutlined  className={cx("scan-tip")}/>
                        </Tooltip>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="warehouseName"
                            label={"仓库"}
                        >
                            <SelectDeliveryAddress onChange={this.getChange} isWareHouses={true} showEdit={false} multiple={true}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

/*const mapStateToProps = (state) => ({
    preData: state.getIn(['stocktakingAdd', 'preData'])
});*/

export default connect(null, null)(BaseInfo)