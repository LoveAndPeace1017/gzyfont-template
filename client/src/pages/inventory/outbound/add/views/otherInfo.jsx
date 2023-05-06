import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Form } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';

import {NewCustomField as CustomField} from 'components/business/customField';
import {SelectProject} from 'pages/auxiliary/project'
import {SelectExpress} from 'pages/auxiliary/express'
import {SelectCustomer} from 'pages/customer/index';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import AttachmentUpload from 'components/business/attachmentUpload';
import SaleLink from './saleLink';

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
    }


    render() {

        const {initBaseInfo, outType} = this.props;
        console.log(outType, 'outType');

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
            console.log(newFileInfo, 'newFileInfo');
            this.setState({fileList: copyId?[]:newFileInfo,
                flag: false});
        }

        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                    <Form.Item
                        {...formItemLayout}
                        {...defaultOptions}
                        name="logistics"
                        label={intl.get("outbound.add.otherInfo.logistics")}

                    >
                        <SelectExpress showEdit={true}/>
                    </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="waybillNo"
                            label={intl.get("outbound.add.otherInfo.waybillNo")}
                        >
                            <Input maxLength={50}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="projectName"
                            initialValue={initBaseInfo && initBaseInfo.get("projectName")}
                            label={intl.get("outbound.add.otherInfo.projectName")}
                        >
                            <SelectProject showEdit={true} showSearch={true} showVisible={true}/>
                        </Form.Item>
                    </Col>
                    {
                        outType !== 2 && (
                            <Col span={8}>
                                <Form.Item
                                    {...formItemLayout}
                                    {...defaultOptions}
                                    name="ourContacterName"
                                    initialValue={initBaseInfo && initBaseInfo.get("ourContacterName")}
                                    label={intl.get("outbound.add.otherInfo.ourContacterName")}
                                >
                                    <SelectEmployeeFix
                                        showSearch={true}
                                        showFullSize={true}
                                        showVisible={true}
                                        width={200}
                                    />
                                </Form.Item>
                            </Col>
                        )
                    }
                </Row>

                {
                    outType === 2 && (
                        <SaleLink />
                    )
                }

                <CustomField {...this.props} />

                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...otherFormItemLayout}
                            {...defaultOptions}
                            name="remarks"
                            initialValue={initBaseInfo && initBaseInfo.get("remarks")}
                            label={intl.get("outbound.add.otherInfo.remarks")}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("outbound.add.otherInfo.remarks")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="tempAtt"
                            label={intl.get("outbound.add.otherInfo.tempAtt")}
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
    suggestCustomer: state.getIn(['saleAdd', 'suggestCustomer'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)