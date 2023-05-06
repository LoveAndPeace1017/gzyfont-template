import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Form, Col, Row, Input, Radio, Button, message, Table, AutoComplete } from 'antd';
import {Icon as LegacyIcon } from '@ant-design/compatible';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';
import {emailReg} from 'utils/reg';
import {SelectSupplier} from 'pages/supplier/index'
import {SelectProject} from 'pages/auxiliary/project'
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import Upload from 'components/widgets/upload';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import Area from 'components/widgets/area';
import _ from 'lodash';

const cx = classNames.bind(styles);

const {TextArea} = Input;

class OtherInfo extends Component {

    state = {
        fileList: [],
        inquiryWay: '0',
        suppliersList: [],
        emailSuggestResult: [],
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} ${intl.get("inquiry.add.otherInfo.uploadMsg1")}`);
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} ${intl.get("inquiry.add.otherInfo.uploadMsg1")}`);
        }
        if(info.file.status){
            this.setState({fileList})
        }
    };

    beforeUpload = (file) => {
        const isValidatedFile = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp'
            || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //doc 、docx
            || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //xsl 、xsls
            || file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/zip' //pdf、txt、zip
            || /\.rar$/.test(file.name);  // rar格式的file.type为空（搞不懂），所以只能用名称判断了
        console.log('file type:', file.type);
        if (!isValidatedFile) {
            message.error(intl.get("inquiry.add.otherInfo.uploadMsg2"));
        }
        const isLtSize = file.size / 1024 / 1024 <= 20;
        if (!isLtSize) {
            message.error(intl.get("inquiry.add.otherInfo.uploadMsg3"));
        }
        return isValidatedFile && isLtSize;
    };

    addrChange = (value, obj) => {
        this.props.formRef.current.setFieldsValue({
            provinceText: obj[0] ? obj[0].label : '',
            cityText: obj[1] ? obj[1].label : '',
        });
    };

    inquiryWayChange = (e) => {
        const value = e.target.value;
        this.setState({
            inquiryWay: value
        });
        let inviteFlag, publicInquiryFlag;
        if(value === '0'){
            inviteFlag = '0';
            publicInquiryFlag = '';
        }else if(value === '1'){
            inviteFlag = '1';
            publicInquiryFlag = '1';
        }else if(value === '2'){
            inviteFlag = '1';
            publicInquiryFlag = '0'
        }
        this.props.formRef.current.setFieldsValue({
            'inviteFlag': inviteFlag,
            'publicInquiryFlag': publicInquiryFlag
        })
    };

    handleSelectSupplier = (value, allInfo) => {
        let newSuppliersList = [];
        this.setState((prevState) => {
            const copySuppliersList = _.cloneDeep(prevState.suppliersList);
            newSuppliersList = [...copySuppliersList, {code: value.key, name: value.label, email: allInfo.email}];
            return {
                suppliersList: newSuppliersList
            }
        }, ()=>{
            this.props.formRef.current.setFieldsValue({
                suppliers: newSuppliersList.length>0?newSuppliersList.length:''
            })
        });

    };

    handleEmailChange = (value, key) => {
        this.setState((prevState) => {
            return {
                suppliersList: prevState.suppliersList.map((item) => {
                    if (item.code === key) {
                        item.email = value;
                    }
                    return item;
                })
            }
        })
    };

    removeSupplier = (key) => {
        let newSuppliersList = [];
        this.setState((prevState) => {
            newSuppliersList = prevState.suppliersList.filter((item) => {
                return item.code !== key
            });
            return {
                suppliersList: newSuppliersList
            }
        }, ()=>{
            this.props.formRef.current.setFieldsValue({
                suppliers: newSuppliersList.length>0?newSuppliersList.length:''
            })
        });

    };

    //输入供应商邮箱匹配
    handleSearch = (value) => {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = ['163.com', 'qq.com', '126.com', 'hotmail.com', 'gmail.com', 'sohu.com', 'sina.com', 'aliyun.com', '139.com', 'wo.com.cn', '189.cn', ].map(domain => `${value}@${domain}`);
        }
        this.setState({ emailSuggestResult: result });
    };

    handleBlur=()=>{
        this.setState({ emailSuggestResult: [] });
    };

    componentDidMount() {
        this.props.getRef(this);
    }

    render() {

        const {mainAddress,inquiryInfoData, currentAccountInfo} = this.props;

        const accountInfo = currentAccountInfo.get('data');

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

        const supplierDataSource = this.state.suppliersList.length > 0 ? this.state.suppliersList.map((item, index) => {
            return {
                key: item.code,
                suppliersName: item.name,
                suppliersEmail: item.email
            }
        }) : [];

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="deliveryAddress"
                            label={intl.get("inquiry.add.otherInfo.deliveryAddress")}
                            initialValue={mainAddress && [mainAddress.get('receiverProvinceCode'), mainAddress.get('receiverCityCode')]}
                            rules={[{
                                required: true,
                                message: intl.get("inquiry.add.otherInfo.deliveryAddressMessage")
                            }]}
                        >
                            <Area onChange={this.addrChange}/>
                        </Form.Item>
                        <div style={{display: "none"}}>
                            <Form.Item name="provinceText">
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item name="cityText">
                                <Input type="hidden"/>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            label={intl.get("inquiry.add.otherInfo.tempAtt")}
                            name="tempAtt"
                        >
                            <Upload
                                action={`${BASE_URL}/file/temp_attachs`}
                                name={"file"}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                                multiple={true}
                                fileList={this.state.fileList}
                            >
                                {
                                    this.state.fileList.length < 3 ? (
                                        <Tooltip
                                            type="info"
                                            title={intl.get("inquiry.add.otherInfo.uploadMsg4")}
                                        >
                                            <Button>
                                                <LegacyIcon type={this.state.loading ? 'loading' : 'upload'}/> {intl.get("inquiry.add.otherInfo.addTempAtt")}
                                            </Button>
                                        </Tooltip>
                                    ) : null
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...otherFormItemLayout}
                            {...defaultOptions}
                            name="inquiryWay"
                            label={intl.get("inquiry.add.otherInfo.inquiryWay")}
                            initialValue={this.state.inquiryWay}
                            rules={[{
                                required: true,
                                message: intl.get("inquiry.add.otherInfo.inquiryWayMessage")
                            }]}
                        >
                            <Radio.Group onChange={this.inquiryWayChange}>
                                <Radio value="0">{intl.get("inquiry.add.otherInfo.inquiryWayStatus_1")}</Radio>
                                <Radio value="1">{intl.get("inquiry.add.otherInfo.inquiryWayStatus_2")}</Radio>
                                <Radio value="2">{intl.get("inquiry.add.otherInfo.inquiryWayStatus_3")}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <div style={{display: 'none'}}>
                            <Form.Item name="inviteFlag"
                                       initialValue="0">
                                <Input type="hidden"/>
                            </Form.Item>
                            <Form.Item name="publicInquiryFlag">
                                <Input type="hidden"/>
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
                {
                    this.state.inquiryWay === '1' || this.state.inquiryWay === '2' ? (
                        <Row>
                            <Col span={24}>
                                <div className={cx("invite-suppliers-select")}>
                                    <Form.Item
                                        {...otherFormItemLayout}
                                        {...defaultOptions}
                                        name="suppliers"
                                        style={{display: 'none'}}
                                        label={intl.get("inquiry.add.otherInfo.appointSupplier")}
                                        rules={[{
                                            required: true,
                                            message: intl.get("inquiry.add.otherInfo.appointSupplierMessage")
                                        }]}
                                    >
                                        <Input type="hidden"/>
                                    </Form.Item>
                                    <SelectSupplier
                                        maxLength={80}
                                        style={{width: '200px'}}
                                        onlySelect
                                        onSelect={(value, allInfo) => this.handleSelectSupplier(value, allInfo)}
                                    />
                                </div>
                                <div className={cx("invite-suppliers-list")}
                                     style={supplierDataSource.length <= 0 ? {display: 'none'} : {display: 'block'}}>
                                    <div className={cx("invite-suppliers-inner")}>
                                        <p>{intl.get("inquiry.add.otherInfo.followSupplierWillReceiveInvitationLetter")}：</p>
                                        <Table
                                            size={"small"}
                                            pagination={false}
                                            bordered={false}
                                            columns={[
                                                {
                                                    title: intl.get("inquiry.add.otherInfo.suppliersName"),
                                                    dataIndex: 'suppliersName',
                                                    width: '50%'
                                                },
                                                {
                                                    title: () => <React.Fragment><span className="required">*</span>{intl.get("inquiry.add.otherInfo.suppliersEmail")}</React.Fragment>,
                                                    dataIndex: 'suppliersEmail',
                                                    width: '50%',
                                                    render: (text, record) => {
                                                        let emailProps = {};

                                                        const reg = emailReg.email;

                                                        if(!text){
                                                            emailProps = {
                                                                validateStatus: "error",
                                                                help: intl.get("inquiry.add.otherInfo.suppliersEmailMessage")
                                                            }
                                                        }else if(!reg.rules.test(text)){
                                                            emailProps = {
                                                                validateStatus: "error",
                                                                help: reg.message
                                                            }
                                                        }
                                                        return (
                                                            <React.Fragment>
                                                                <Form  labelCol={0}
                                                                    wrapperCol={24}
                                                                >
                                                                    <Form.Item
                                                                        {...emailProps}
                                                                    >
                                                                        {/*<Input value={text}
                                                                               onChange={(e) => this.handleEmailChange(e, record.key)}
                                                                               style={{width: 'calc(100% - 25px)'}}/>*/}
                                                                        <AutoComplete
                                                                            value={text}
                                                                            onChange={(value) => this.handleEmailChange(value, record.key)}
                                                                            onSearch={this.handleSearch}
                                                                            onBlur={this.handleBlur}
                                                                            style={{width: 'calc(100% - 25px)'}}
                                                                        >
                                                                            {
                                                                                this.state.emailSuggestResult.map(email=> <AutoComplete.Option key={email}>{email}</AutoComplete.Option>)
                                                                            }
                                                                        </AutoComplete>
                                                                        <a href="#!"
                                                                           className={cx('btn-remove')}
                                                                           onClick={() => this.removeSupplier(record.key)}><Icon
                                                                            type="delete"/></a>
                                                                    </Form.Item>
                                                                </Form>
                                                            </React.Fragment>
                                                        )
                                                    }
                                                },
                                            ]}
                                            dataSource={supplierDataSource}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ) : null
                }
                {
                    this.state.inquiryWay === '2' ? null : (
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    {...otherFormItemLayout}
                                    name="contactInfoFlag"
                                    initialValue="2"
                                    label={intl.get("inquiry.add.otherInfo.contactInfoFlag")}
                                    rules={[{
                                        required: true,
                                        message: intl.get("inquiry.add.otherInfo.contactInfoFlagMessage")
                                    }]}
                                >
                                    <Radio.Group>
                                        <Radio value="0">{intl.get("inquiry.add.otherInfo.contactInfoFlagStatus_1")}</Radio>
                                        <Radio value="2">{intl.get("inquiry.add.otherInfo.contactInfoFlagStatus_2")}</Radio>
                                        <Radio value="1">{intl.get("inquiry.add.otherInfo.contactInfoFlagStatus_3")}</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    )
                }
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            { ...defaultOptions}
                            name="comName"
                            initialValue={inquiryInfoData && inquiryInfoData.get('ourName')}
                            rules={[{
                                required: true,
                                message: intl.get("inquiry.add.otherInfo.purchasePartyMessage")
                            }]}
                            label={intl.get("inquiry.add.otherInfo.purchaseParty")}
                        >
                            <Input maxLength={80}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="userName"
                            initialValue={inquiryInfoData && inquiryInfoData.get('ourContacterName')}
                            label={intl.get("inquiry.add.otherInfo.contactPerson")}
                            rules={[{
                                required: true,
                                message: intl.get("inquiry.add.otherInfo.contactPersonMessage")
                            }]}
                        >
                            <Input maxLength={25}/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="comTel"
                            initialValue={inquiryInfoData && inquiryInfoData.get('ourTelNo')}
                            label={intl.get("inquiry.add.otherInfo.comTel")}
                            rules={[{
                                required: true,
                                message: intl.get("inquiry.add.otherInfo.comTelMessage")
                            }]}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...otherFormItemLayout}
                            {...defaultOptions}
                            name="remarks"
                            label={intl.get("inquiry.add.otherInfo.remark")}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("inquiry.add.otherInfo.remark")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <div style={{display: 'none'}}>
                    <Form.Item name="email"
                               initialValue={accountInfo && accountInfo.get('comEmail')}>
                        <Input type="hidden"/>
                    </Form.Item>
                    <Form.Item name="gender"
                               initialValue={accountInfo && accountInfo.get('gender') === intl.get("inquiry.add.otherInfo.sir")?'1':'0'}>
                        <Input type="hidden"/>
                    </Form.Item>
                    <Form.Item name="taxFlag"
                               initialValue='0'>
                        <Input type="hidden"/>
                    </Form.Item>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)