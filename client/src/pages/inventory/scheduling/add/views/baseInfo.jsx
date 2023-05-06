import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Row, Col, Input, DatePicker, Select,Form} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {SelectUnit} from 'pages/auxiliary/goodsUnit'
import {asyncFetchPreData} from '../actions';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class BaseInfo extends Component {

    render() {

        const {preData} = this.props;
        const warehouses = preData.getIn(['data','warehouses']);
        const initWarehouseIn =  preData && preData.getIn(['data','data', 'warehouseNameIn']);
        const initWarehouseOut =  preData && preData.getIn(['data','data', 'warehouseNameOut']);

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
                            label={intl.get("schedule.add.baseInfo.allocDate")}
                            {...formItemLayout}
                            name={"allocDate"}
                            initialValue = {moment()}
                        >
                              <DatePicker/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("schedule.add.baseInfo.warehouseNameIn")}
                            {...formItemLayout}
                            name={"warehouseNameIn"}
                            rules={ [
                                {
                                    required: true,
                                    message: intl.get("schedule.add.baseInfo.warehouseNameInMessage")
                                }
                            ]}
                            initialValue = {initWarehouseIn}
                        >
                            <SelectDeliveryAddress showEdit={true}  isWareHouses={true} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("schedule.add.baseInfo.warehouseNameOut")}
                            {...formItemLayout}
                            name={"warehouseNameOut"}
                            rule={[
                                {
                                    required: true,
                                    message: intl.get("schedule.add.baseInfo.warehouseNameOutMessage")
                                }
                            ]}
                            initialValue = {initWarehouseOut}
                        >
                             <SelectDeliveryAddress showEdit={true} isWareHouses={true}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        )
            ;
    }
}

const mapStateToProps = (state) => ({
    preData: state.getIn(['schedulingAdd', 'preData'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseInfo)