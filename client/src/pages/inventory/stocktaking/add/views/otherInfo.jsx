import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Col, Row, Input, Form } from 'antd';
import {SelectProject} from 'pages/auxiliary/project';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import AttachmentUpload from 'components/business/attachmentUpload';
import defaultOptions from 'utils/validateOptions';

const {TextArea} = Input;

export default class OtherInfo extends Component {
    state={
        open: false,
        fileList: [],
        flag: true
    };

    componentDidMount() {
        this.props.getRef(this);
    }

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
                <Row className="ml5">
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="checkOperator"
                            label={intl.get("stocktaking.add" +
                                ".otherInfo.checkOperator")}
                        >
                            <SelectEmployeeFix
                                showSearch={true}
                                showFullSize={true}
                                showVisible={true}
                                width={200}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...otherFormItemLayout}
                            name="remarks"
                            label={intl.get("stocktaking.add.otherInfo.remarks")}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("stocktaking.add.otherInfo.remarks")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="tempAtt"
                            label={intl.get("stocktaking.add.otherInfo.tempAtt")}
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
