import React, {Component} from 'react';
import {NewCustomField as CustomField} from 'components/business/customField';
import AttachmentUpload from 'components/business/attachmentUpload';
import {SelectProject} from 'pages/auxiliary/project';
import { Col, Row, Input, Form} from 'antd';
const {TextArea} = Input;

class OtherInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList:[]
        }
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    render() {
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


        return (
            <React.Fragment>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="projectName"
                            label={"项目"}
                        >
                            <SelectProject showEdit={true} showSearch={true} showVisible={true}/>
                        </Form.Item>
                    </Col>
                </Row>
                <CustomField {...this.props} formItemLayout={otherFormItemLayout}/>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            {...formItemLayout}
                            {...otherFormItemLayout}
                            name="requestDesc"
                            label={"请购说明"}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder={"请购说明"}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            name="tempAtt"
                            label={"附件"}
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


export default OtherInfo