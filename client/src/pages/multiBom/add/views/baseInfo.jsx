import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Radio, Form, Checkbox} from 'antd';
import {EllipsisOutlined} from '@ant-design/icons';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

export default class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsPopVisible: false,
            useSystemCode: false
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

    onProductChange = (selectedRows, visibleKey) => {
        const {setFieldsValue} = this.props.formRef.current;
        this.closeModal(visibleKey);
        if (selectedRows.length > 0) {
            const item = selectedRows[0];
            setFieldsValue({
                prodName: item.prodName,
                prodNo: item.code
            });
        }
    };

    setProdNo = (e) => {
        const {setFieldsValue} = this.props.formRef.current;
        if (e.target.checked) {
            const bomCode = this.props.code;
            setFieldsValue({
                bomCode
            })
        }else{
            setFieldsValue({
                bomCode:''
            })
        }
        this.setState({
            useSystemCode: e.target.checked
        });
    };

    prodNoChange = () => {
        this.setState({
            useSystemCode: false
        })
    };

    render() {
        const {match, oldMomFlag} = this.props;
        let { goodsPopVisible } = this.state;
        let { getFieldValue } = this.props.formRef.current;
        // 物品弹层的所选行
        let code = getFieldValue && getFieldValue('prodNo');
        let prodName = getFieldValue && getFieldValue('prodName');
        let selectedRows = code ? [{key: code, code, prodName}] : [];
        let selectedRowKeys = code ? [code] : [];

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
                    <Col span={6}>
                        <Form.Item
                            label="BOM编号"
                            name={"bomCode"}
                            rules={[{required: true, message: "该项为必填项"}]}
                            {...formItemLayout}
                        >
                            {  // 修改时 oldMomFlag为true，可以修改
                                (match.params.id && !oldMomFlag) ? (
                                    <Input maxLength={50} className={cx('readOnly')} disabled />
                                ) : (
                                    <Input maxLength={50} onChange={this.prodNoChange}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        {
                            (match.params.id && !oldMomFlag)?null:
                                (
                                    <div>
                                        <Checkbox className={cx("ck-prodNo")} checked={this.state.useSystemCode}
                                                  onChange={this.setProdNo}>系统编号</Checkbox>
                                    </div>
                                )
                        }
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="版本"
                            name={"bomVersion"}
                            rules={[{required: true, message: "该项为必填项"}]}
                            {...formItemLayout}
                        >
                            <Input maxLength={10}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={'默认BOM'}
                            name={'defaultFlag'}
                            rules={[{required: true, message: "该项为必填项"}]}
                            initialValue={true}
                            {...formItemLayout}
                        >
                            <Radio.Group>
                                <Radio value={true}>是</Radio>
                                <Radio value={false}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={6}>
                        <Form.Item
                            label="成品"
                            name={"prodName"}
                            rules={[
                                { required: true,message: "该项为必填项"}
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
                    <Col span={2}>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="日产量"
                            name={"dayProductivity"}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback("输入整数不超过10位小数不超过3位的正数");
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
                </Row>

                <div style={{display: "none"}}>
                    <Form.Item
                        label=""
                        name={"prodNo"}
                        {...formItemLayout}
                    >
                        <Input type="hidden"/>
                    </Form.Item>
                </div>

                <SelectGoodsOrFitting
                    visible={goodsPopVisible}
                    visibleFlag={'goodsPopVisible'}
                    onOk={(selectedRows, visibleKey) => this.onProductChange(selectedRows, visibleKey)}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    selectType={'radio'}
                    popType={'goods'}
                    condition={{disableFlag: 0}}
                    selectedRows={selectedRows}
                    selectedRowKeys={selectedRowKeys}
                    salePriceEditable={false}
                />
            </React.Fragment>
        );
    }
}
