import React, {Component} from 'react';
import { Row, Col, Form } from 'antd';
import defaultOptions from 'utils/validateOptions';
import AttachmentUpload from 'components/business/attachmentUpload';
import {NewCustomField as CustomField} from 'components/business/customField';

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
        let { formItemLayout, initBaseInfo } = this.props;
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
            //如果是复制，则去掉复制信息里的附件
            this.setState({fileList: copyId?[]:newFileInfo,
                flag: false});
        }

        return (
            <React.Fragment>
                <CustomField {...this.props} formItemLayout={otherFormItemLayout}/>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            {...formItemLayout}
                            {...defaultOptions}
                            name="tempAtt"
                            label={'附件'}
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