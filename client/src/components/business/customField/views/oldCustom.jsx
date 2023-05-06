import React, {Component} from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Input, Row, DatePicker, Select } from "antd";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
const Option = Select.Option;
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);


// 给老的form组件啊，没办法啊，谁要当初改版的时候没有把物品处理掉啊,
// 真不想写这种烂代码，时间又紧
export default class CustomFields extends Component {
    static formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 }
        }
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    constructor(props) {
        super(props);
        this.state = {
            fields: []
        };
    }

    createCustomFields = (fields) => {
        this.setState({
            fields
        })
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let { propertyValues = 'propertyValues', info } = this.props;
        let { fields } = this.state;
        return (
            <React.Fragment>
                {
                    (fields && fields.length > 0) && (
                        fields.map((field, index) => (
                            <Row key={index} className={cx("field-old-row")}>
                                <Col span={8}>
                                    <Form.Item
                                        {...CustomFields.formItemLayout }
                                        label={index === 0 ? "自定义" : (<React.Fragment />)}
                                        required={false}
                                        colon={index === 0}
                                        className={'field-out'}
                                    >
                                        <Row>
                                            <Col span={11}>
                                                <div className={cx("field-name")}>
                                                    <Form.Item
                                                        required={false}
                                                    >
                                                        <div className={cx('field-label')}>
                                                            {field.required && <span className={'red'}>*</span>}{field.propName}
                                                        </div>
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={13}>
                                                <div className={cx("field-val")}>
                                                    {
                                                        field.type === 'text' && (
                                                            <Form.Item>
                                                                {getFieldDecorator(`${propertyValues}[${field.mappingName}]`, {
                                                                    initialValue: info && info[field.mappingName],
                                                                    rules: [
                                                                        {
                                                                            required: field.required,
                                                                            message: '该项为必填项'
                                                                        }
                                                                    ]
                                                                })(
                                                                    <Input maxLength={1000}/>
                                                                )}
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'number' && (
                                                            <Form.Item>
                                                                {getFieldDecorator(`${propertyValues}[${field.mappingName}]`, {
                                                                    initialValue: info && info[field.mappingName],
                                                                    rules: [
                                                                        {
                                                                            validator: (rules, value, callback) => {
                                                                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ field.extra.precision +'})?$/');
                                                                                if(!value && field.required){
                                                                                    callback('该项为必填项');
                                                                                } else if (value && !reg.test(value)) {
                                                                                    callback(`整数部分不能超过10位，小数点后不能超过${field.extra.precision}位`);
                                                                                }
                                                                                callback();
                                                                            }
                                                                        }
                                                                    ]
                                                                })(
                                                                    <Input maxLength={20}/>
                                                                )}
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'date' && (
                                                            <Form.Item>
                                                                {getFieldDecorator(`${propertyValues}[${field.mappingName}]`, {
                                                                    initialValue: info && info[field.mappingName],
                                                                    rules: [
                                                                        {
                                                                            required: field.required,
                                                                            message: '该项为必填项'
                                                                        }
                                                                    ]
                                                                })(
                                                                    <DatePicker />
                                                                )}
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'select' && (
                                                            <Form.Item>
                                                                {getFieldDecorator(`${propertyValues}[${field.mappingName}]`, {
                                                                    initialValue: info && info[field.mappingName],
                                                                    rules: [
                                                                        {
                                                                            required: field.required,
                                                                            message: '该项为必填项'
                                                                        }
                                                                    ]
                                                                })(
                                                                    <Select>
                                                                        {
                                                                            field.extra.options && field.extra.options.map((item) => (
                                                                                <Option key={item.key} value={item.key}>{item.value}</Option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                                )}
                                                            </Form.Item>
                                                        )
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                        ))
                    )
                }
            </React.Fragment>
        )
    }
}
