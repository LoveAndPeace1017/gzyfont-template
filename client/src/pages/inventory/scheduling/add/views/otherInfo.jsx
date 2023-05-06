import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Modal, Col, Row, Input, DatePicker,Form} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import defaultOptions from 'utils/validateOptions';
import {SelectProject} from 'pages/auxiliary/project';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import AttachmentUpload from 'components/business/attachmentUpload';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";


const {TextArea} = Input;

class OtherInfo extends Component {

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
            this.setState({fileList: [],
                flag: false});
        }

        return (
            <React.Fragment>
                <Row className="ml5">
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("schedule.add.otherInfo.ourContacterName")}
                            {...formItemLayout}
                            name={"ourContacterName"}
                            initialValue={initBaseInfo && initBaseInfo.get('ourContacterName')}
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
                            label={intl.get("schedule.add.otherInfo.remarks")}
                            {...otherFormItemLayout}
                            name={"remarks"}
                            initialValue = {initBaseInfo && initBaseInfo.get('remarks')}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={intl.get("schedule.add.otherInfo.remarks")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("schedule.add.otherInfo.tempAtt")}
                            {...formItemLayout}
                            name={"tempAtt"}
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)