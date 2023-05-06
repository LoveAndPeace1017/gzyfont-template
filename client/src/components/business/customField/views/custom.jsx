import React, {Component} from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Input, Row, Form, DatePicker, Select } from "antd";
const Option = Select.Option;
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);


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
        let { propertyValues = 'propertyValues' } = this.props;
        let { fields } = this.state;
        return (
            <React.Fragment>
                {
                    (fields && fields.length > 0) && (
                        fields.map((field, index) => (
                            <Row key={index} className={cx("field-row")}>
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
                                                            <Form.Item
                                                                rules={[
                                                                    {
                                                                        required: field.required,
                                                                        message: '该项为必填项'
                                                                    }
                                                                ]}
                                                                name={[propertyValues, field.mappingName]}
                                                            >
                                                                <Input maxLength={1000}/>
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'number' && (
                                                            <Form.Item
                                                                name={[propertyValues, field.mappingName]}
                                                                rules={
                                                                    [
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
                                                                }
                                                            >
                                                                <Input maxLength={20}/>
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'date' && (
                                                            <Form.Item
                                                                name={[propertyValues, field.mappingName]}
                                                                rules={[
                                                                    {
                                                                        type: 'object',
                                                                        required: field.required,
                                                                        message: '该项为必填项'
                                                                    }
                                                                ]}
                                                            >
                                                                <DatePicker />
                                                            </Form.Item>
                                                        )
                                                    }
                                                    {
                                                        field.type === 'select' && (
                                                            <Form.Item
                                                                name={[propertyValues, field.mappingName]}
                                                                rules={[
                                                                    {
                                                                        required: field.required,
                                                                        message: '该项为必填项'
                                                                    }
                                                                ]}
                                                            >
                                                                <Select>
                                                                    {
                                                                        field.extra.options && field.extra.options.map((item) => (
                                                                            <Option key={item.key} value={item.key}>{item.value}</Option>
                                                                        ))
                                                                    }
                                                                </Select>
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
