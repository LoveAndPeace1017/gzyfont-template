import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Col, Input, Row, Form } from "antd";

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
        let {getFieldValue} = this.props.formRef.current;
        const dataTagList = getFieldValue('dataTagList')||[];
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
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;
        const dataTagList = getFieldValue('dataTagList');
        if (dataTagList.length === 1) {
            return;
        }
        let mappingName = "";
        setFieldsValue({
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
        let {setFieldsValue} = this.props.formRef.current;
        const nextKeys = this.createCustomFiled();
        setFieldsValue({
            dataTagList: nextKeys,
        });
    };

    render() {

        let {getFieldValue} = this.props.formRef.current;

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
        const dataTagList = getFieldValue('dataTagList');

        return (
            <React.Fragment>
                <Form.Item name="dataTagList"
                           initialValue={[defaultCustomFiled]}
                           style={{display: 'none'}}
                />
                {
                    dataTagList && dataTagList.length > 0 && (
                        dataTagList.map((customFiled, index) => (
                            <Row key={customFiled.index}>
                                <Col span={8}>
                                    <Form.Item
                                        {...formItemLayout }
                                        label={index === 0 ? intl.get("components.customField.index.custom") : (<React.Fragment></React.Fragment>)}
                                        required={false}
                                        colon={index === 0}
                                        key={customFiled.index}
                                    >
                                        <Row>
                                            <Col span={11}>
                                                <div className={cx("field-name")}>
                                                    <Form.Item
                                                        required={false}
                                                        name={['propName', customFiled.index]}
                                                       /* rules={[{
                                                            validator: (rules, val, callback) => {
                                                                if(val&&!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(val)){
                                                                    callback(intl.get("components.customField.index.fieldMessage1"));
                                                                }else{
                                                                    callback();
                                                                }
                                                            }
                                                        }]}*/
                                                    >
                                                        <Input placeholder={propNamePlaceholder} disabled={customFiled.propName!==""}
                                                               maxLength={20}/>
                                                    </Form.Item>
                                                </div>
                                            </Col>
                                            <Col span={13}>
                                                <div className={cx("field-val")}>
                                                    <Form.Item
                                                        required={false}
                                                        name={['propValue', customFiled.index]}
                                                        initialValue={customFiled.propValue}
                                                        rules={[{
                                                            validator: (rules, val, callback) => {
                                                                let propName = getFieldValue(['propValue', customFiled.index]);
                                                                if(val&&!propName){
                                                                    callback(intl.get("components.customField.index.fieldMessage2"));
                                                                }else{
                                                                    callback();
                                                                }
                                                            }
                                                        }]}
                                                    >
                                                        <Input placeholder={customFiled.label?"":propValuePlaceholder }
                                                               maxLength={1000} />

                                                    </Form.Item>
                                                    <div className={cx("field-ope")} >
                                                        {dataTagList.length < 5 ?
                                                            <PlusCircleOutlined onClick={this.add} /> : ""}
                                                        {dataTagList.length > 1 && (typeof customFiled.propName==="undefined"|| customFiled.propName==="")?
                                                            <MinusCircleOutlined onClick={() => this.remove(customFiled.index)} /> : ""}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                                <div style={{display:"none"}}>
                                    <Form.Item name={['mappingName', customFiled.index]}
                                               initialValue={customFiled.mappingName}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </Row>
                        ))
                    )
                }
            </React.Fragment>
        )
    }
}
