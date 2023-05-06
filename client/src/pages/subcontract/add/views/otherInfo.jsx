import React, {Component} from 'react';
import { Col, Row, Input,Form, DatePicker } from 'antd';
import defaultOptions from 'utils/validateOptions';
import {SelectProject} from 'pages/auxiliary/project'
import AttachmentUpload from 'components/business/attachmentUpload';
import {SelectSettlement} from 'pages/auxiliary/orderType';
import {AddressAdd} from 'pages/auxiliary/deliveryAddress';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from "moment-timezone/index";


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
                            label="项目"
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
                            label="经办人"
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
                            label="提醒日期"
                            name={"remindDate"}
                            {...formItemLayout}
                            initialValue = {initBaseInfo? moment(initBaseInfo.get("提醒日期")):""}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item
                            label="备注"
                            name ={"remark"}
                            {...otherFormItemLayout}
                            {...defaultOptions}
                            initialValue = {initBaseInfo && initBaseInfo.get('remark')}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder="备注"/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="上传附件"
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

export default OtherInfo;