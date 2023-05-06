import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Col, Input, Row } from "antd";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';


const cx = classNames.bind(styles);

let id = 5;
//自定义项
const defaultCustomFiled = {
    index:5,
    mappingName:"property_value1",
    propValue:"",
    propName:""
};
export default class CustomFields extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usedKey: {

            }
        };
    }
    createCustomFiled = ()=>{
        let prefix = "property_value";
        const { form } = this.props;
        const dataTagList = form.getFieldValue('dataTagList')||[];
        let usedKey = {};
        dataTagList.map((item)=>{
            usedKey[item.mappingName] = item.mappingName;
        });
        let i = 1;
        while(usedKey[prefix+i++]){
        }
        this.setState({
            usedKey
        });

        let temp = {
            ...defaultCustomFiled,
            mappingName:prefix+(i-1),
            index:++id
        };
        return dataTagList.concat(temp);
    };

    remove = (k) => {
        const { form } = this.props;
        const dataTagList = form.getFieldValue('dataTagList');
        if (dataTagList.length === 1) {
            return;
        }
        let mappingName = "";
        form.setFieldsValue({
            dataTagList: dataTagList.filter((customFiled) => {
                if(customFiled.index !== k){
                    mappingName = customFiled.mappingName;
                }
                return customFiled.index !== k
            }),
        });
        let usedKey = this.state.usedKey;
        delete usedKey[mappingName];
        this.setState({
            usedKey
        });
    };

    add = () => {
        const { form } = this.props;
        const nextKeys = this.createCustomFiled();
        form.setFieldsValue({
            dataTagList: nextKeys,
        });
    };

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {propNamePlaceholder= intl.get("components.customField.index.purchaseFrequency"),propValuePlaceholder=""} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        getFieldDecorator('dataTagList', { initialValue: [defaultCustomFiled] });
        const dataTagList = getFieldValue('dataTagList');
        const len = dataTagList.length;
        const formItems = dataTagList.map((customFiled, index) => (
            <Row key={customFiled.index} className={cx("field-row")}>
                <Col span={8}>
                    <Form.Item
                        style={{margin: 0}}
                        {...formItemLayout }
                        label={index === 0 ? intl.get("components.customField.index.custom") : (<React.Fragment></React.Fragment>)}
                        required={false}
                        colon={index === 0}
                        key={customFiled.index}
                    >
                        <Row>
                            <Col span={11}>
                                <Form.Item
                                    required={false}
                                >
                                    <div className={cx("field-name")}>
                                        {getFieldDecorator(`propName[${customFiled.index}]`, {
                                            initialValue: customFiled.propName,
                                            /*rules:[{
                                                validator: (rules, val, callback) => {
                                                    if(val&&!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(val)){
                                                        callback(intl.get("components.customField.index.fieldMessage1"));
                                                    }else{
                                                        callback();
                                                    }
                                                }
                                            },]*/
                                        })(
                                            <Input placeholder={propNamePlaceholder} disabled={customFiled.propName!==""}
                                                   maxLength={20}/>
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col span={13}>
                                <Form.Item
                                    required={false}
                                >
                                    <div className={cx("field-val")}>
                                        {getFieldDecorator(`propValue[${customFiled.index}]`, {
                                            initialValue: customFiled.propValue,
                                            rules:[{
                                                validator: (rules, val, callback) => {
                                                    let propName = getFieldValue(`propName[${customFiled.index}]`);
                                                    if(val&&!propName){
                                                        callback(intl.get("components.customField.index.fieldMessage2"));
                                                    }else{
                                                        callback();
                                                    }
                                                }
                                            },]
                                        })(
                                            <Input placeholder={customFiled.label?"":propValuePlaceholder }
                                                   maxLength={1000} />
                                        )}
                                        <div className={cx("field-ope")} >
                                            {len < 5 ?
                                                <PlusCircleOutlined onClick={this.add} /> : ""}
                                            {len > 1 && (typeof customFiled.propName==="undefined"|| customFiled.propName==="")?
                                                <MinusCircleOutlined onClick={() => this.remove(customFiled.index)} /> : ""}

                                        </div>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                </Col>
                <div style={{display:"none"}}>
                    {getFieldDecorator(`mappingName[${customFiled.index}]`, {initialValue:customFiled.mappingName})(<Input />)}
                </div>
            </Row>
        ));

        return (
            <React.Fragment>
                {formItems}
            </React.Fragment>
        )
    }
}
