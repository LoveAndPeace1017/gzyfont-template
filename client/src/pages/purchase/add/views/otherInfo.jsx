import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input,Form, Select } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';
import {NewCustomField as CustomField} from 'components/business/customField';
import {SelectProject} from 'pages/auxiliary/project'
import AttachmentUpload from 'components/business/attachmentUpload';
import {SelectSettlement} from 'pages/auxiliary/orderType';
import {AddressAdd} from 'pages/auxiliary/deliveryAddress';
import Auxiliary from 'pages/auxiliary';
import {actions as addressAction} from "pages/auxiliary/deliveryAddress";
const {Option} = Select;

import classNames from "classnames/bind";
import styles from "../styles/index.scss";


const cx = classNames.bind(styles);

const {TextArea} = Input;

class OtherInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            flag: true
        }
    }

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

    render() {

        const {preData, initBaseInfo,addressList} = this.props;
        const addressListData = addressList.getIn(['address','data','data']);

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

        const wareAddresses = addressList && addressList.getIn(['address','data','data']);

        //获取默认仓库地址
        let initDeliveryAddress;
        const defaultSelectValue = wareAddresses && wareAddresses.filter(item=>{
            return item.get('isMain') === 1;
        }).get(0);
        if(initBaseInfo && initBaseInfo.get('deliveryAddress')){
            initDeliveryAddress = initBaseInfo.get('deliveryProvinceCode')+ ' '+
            initBaseInfo.get('deliveryProvinceText')+ ' '+
            initBaseInfo.get('deliveryCityCode')+ ' '+
            initBaseInfo.get('deliveryCityText')+ ' '+
            initBaseInfo.get('deliveryAddress');
        }else if(defaultSelectValue && defaultSelectValue.get('receiverAddress')){
            initDeliveryAddress = defaultSelectValue.get('receiverProvinceCode')+ ' '+
                defaultSelectValue.get('receiverProvinceText')+ ' '+
                defaultSelectValue.get('receiverCityCode')+ ' '+
                defaultSelectValue.get('receiverCityText')+ ' '+
                defaultSelectValue.get('receiverAddress');
        }
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
                            label={intl.get("purchase.add.otherInfo.deliveryAddress")}
                            {...formItemLayout}
                            {...defaultOptions}
                            name={"deliveryAddress"}
                        >
                            <Select
                                allowClear
                                showSearch
                                onSearch={this.handleSearch}
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('addressAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order', 'address')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    </div>
                                )}
                                style={{minWidth: '200px'}}
                                placeholder={'选择交货地址'}
                            >
                                {
                                    addressListData && addressListData.map(item => (
                                        <Option key={item.get('id')}
                                                value={item.get('receiverProvinceCode')
                                                + ' ' + item.get('receiverProvinceText')
                                                + ' ' + item.get('receiverCityCode')
                                                + ' ' + item.get('receiverCityText')
                                                + ' ' + item.get('receiverAddress')}>{item.get('receiverProvinceText') + ' ' + item.get('receiverCityText') + ' ' + item.get('receiverAddress')}</Option>
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
                            label={intl.get("purchase.add.otherInfo.projectName")}
                            name={"projectName"}
                            initialValue = {initBaseInfo && initBaseInfo.get("projectName")}
                            {...formItemLayout}
                            {...defaultOptions}
                        >
                            <SelectProject showEdit={true} showSearch={true} showVisible={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.settlement")}
                            name={"settlement"}
                            {...formItemLayout}
                            {...defaultOptions}
                            initialValue={initBaseInfo && initBaseInfo.get("settlement")}
                        >
                            <SelectSettlement showEdit={true}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.ourName")}
                            name={"ourName"}
                            {...formItemLayout}
                            {...defaultOptions}
                            initialValue = {initBaseInfo && initBaseInfo.get("ourName")}
                        >
                            <Input maxLength={80}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.ourContacterName")}
                            name={"ourContacterName"}
                            {...formItemLayout}
                            {...defaultOptions}
                            initialValue = {initBaseInfo && initBaseInfo.get("ourContacterName")}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.ourTelNo")}
                            name={"ourTelNo"}
                            {...defaultOptions}
                            {...formItemLayout}
                            initialValue = {initBaseInfo && initBaseInfo.get("ourTelNo")}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>

                <CustomField {...this.props} formItemLayout={otherFormItemLayout}/>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.contractTerms")}
                            name ={"contractTerms"}
                            {...otherFormItemLayout}
                            {...defaultOptions}
                            initialValue = {initBaseInfo && initBaseInfo.get('contractTerms')}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("purchase.add.otherInfo.contractTerms")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("purchase.add.otherInfo.tempAtt")}
                            name={"tempAtt"}
                            {...formItemLayout}
                            {...defaultOptions}
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
    preData:  state.getIn(['purchaseAdd', 'preData']),
    addressList: state.getIn(['auxiliaryAddress', 'addressList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchAddressList: addressAction.asyncFetchAddressList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)