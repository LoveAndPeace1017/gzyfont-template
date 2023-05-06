import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Form, Select} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';

import {Custom as CustomField} from 'components/business/customField';
import {SelectProject} from 'pages/auxiliary/project';
import {SelectSettlement} from 'pages/auxiliary/orderType';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import AttachmentUpload from 'components/business/attachmentUpload';
import {AddressAdd} from 'pages/auxiliary/deliveryAddress';
import Auxiliary from 'pages/auxiliary';
import {actions as addressAction} from "pages/auxiliary/deliveryAddress";

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);
const {Option} = Select;
const {TextArea} = Input;

class OtherInfo extends Component {
    state={
        open: false,
        deliveryAddrData:[],
        fileList: [],
        flag: true
    };

    getCustomRef = (customRef) => {
        this.customRef = customRef
    };

    componentDidMount() {
        this.props.getRef(this);
        this.props.asyncFetchAddressList('address');
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    handleSearch = (value) => {
        if(value) {
            this.props.formRef.current.setFieldsValue({deliveryAddress: value});
        }
    };

    // 创建自定义组件
    createCustomFields = (tags) => {
        this.customRef.createCustomFields(tags);
    };

    render() {

        const {initBaseInfo} = this.props;

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

        const otherFormItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: '2d66'},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: '21d33'},
            }
        };

        let copyId = this.props.match.params.copyId;
        //处理下载附件
        if(initBaseInfo && initBaseInfo.get("fileInfo") && this.state.flag){
            let newFileInfo = initBaseInfo.toJS().fileInfo.map((file, index) => {
                file.uid = -(index+1);
                file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
                file.name = file.fileName;
                file.status = 'done';
                file.response = {
                    fileId: file.fileId
                };
                return file;
            });

            this.setState({fileList: copyId?[]:newFileInfo,
                flag: false});
        }

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.deliveryAddress")}
                            name="deliveryAddress"
                        >
                            <Select
                                allowClear
                                showSearch
                                onSearch={this.handleSearch}
                                style={{minWidth: '200px'}}
                                placeholder={'选择交货地址'}
                            >
                                {
                                    this.props.deliveryAddrData && this.props.deliveryAddrData.map(item => (
                                        <Option key={item.get('recId')}
                                                value={item.get('provinceCode')
                                                + ' ' + item.get('provinceText')
                                                + ' ' + item.get('cityCode')
                                                + ' ' + item.get('cityText')
                                                + ' ' + item.get('address')}
                                        >{item.get('provinceText') + ' ' + item.get('cityText') + ' ' + item.get('address')}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <AddressAdd onClose={this.closeModal.bind(this, 'addressAddVisible')} visible={this.state.addressAddVisible} callback={(address) => {
                            this.props.asyncFetchAddressList('address', () => {
                                this.handleChange(address);
                            });
                        }}/>

                        {/*辅助资料弹层*/}
                        <Auxiliary
                            defaultKey={this.state.auxiliaryKey}
                            defaultTabKey={this.state.auxiliaryTabKey}
                            visible={this.state.auxiliaryVisible}
                            onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.projectName")}
                            name="projectName"
                        >
                            <SelectProject showEdit={true} showSearch={true} showVisible={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.settlement")}
                            name="settlement"
                        >
                            <SelectSettlement showEdit={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.customerOrderNo")}
                            name="customerOrderNo"
                        >
                            <Input maxLength={50} placeholder={intl.get("sale.add.otherInfo.customerOrderNoPlaceholder")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.ourName")}
                            name="ourName"
                        >
                            <Input maxLength={80}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...defaultOptions}
                            {...formItemLayout}
                            label={intl.get("sale.add.otherInfo.ourContacterName")}
                            name="ourContacterName"
                        >
                            <SelectEmployeeFix
                                showSearch={true}
                                showFullSize={true}
                                showVisible={true}
                                width={200}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("sale.add.otherInfo.ourTelNo")}
                            name="ourTelNo"
                            {...defaultOptions}
                            {...formItemLayout}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>

                <CustomField {...this.props}
                             getRef={this.getCustomRef}
                             dataPrefix={'propertyValues'}/>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={intl.get("sale.add.otherInfo.remarks")}
                            name="remarks"
                            {...defaultOptions}
                            {...otherFormItemLayout}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("sale.add.otherInfo.remarks")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("sale.add.otherInfo.tempAtt")}
                            name="tempAtt"
                            {...defaultOptions}
                            {...formItemLayout}
                        >
                            <AttachmentUpload
                                maxLength={'5'}
                                fileList={this.state.fileList}
                                handleChange={(fileList) => this.setState({fileList})}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    addressList: state.getIn(['auxiliaryAddress', 'addressList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAddressList: addressAction.asyncFetchAddressList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)