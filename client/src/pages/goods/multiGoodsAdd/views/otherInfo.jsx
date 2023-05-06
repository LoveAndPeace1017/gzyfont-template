import React, {Component} from 'react';
import {Icon as LegacyIcon } from '@ant-design/compatible';
import { Col, Row, Input, Button, message,Form} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Custom as CustomField} from 'components/business/customField';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import Tooltip from "components/widgets/tooltip";
import Upload from 'components/widgets/upload';
const cx = classNames.bind(styles);

const {TextArea} = Input;

class OtherInfo extends Component {
    state={
        fileList: []
    };

    getCustomRef = (customRef) => {
        this.customRef = customRef
    };

    initFileList=(fileInfo)=>{
        let newFileInfo = fileInfo.map((file, index) => {
            file.uid = -(index+1);
            file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
            file.name = file.fileName;
            file.status = 'done';
            file.response = {
                fileId: file.fileId
            };
            return file;
        });
        let copyId = this.props.match.params.copyId;
        this.setState({fileList: copyId?[]:newFileInfo});
    };

    beforeUpload = (file) => {
        const isValidatedFile = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp'
            || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //doc 、docx
            || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //xsl 、xsls
            || file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/x-zip-compressed' //pdf、txt、zip
            || /\.rar$/.test(file.name);  // rar格式的file.type为空（搞不懂），所以只能用名称判断了
        if (!isValidatedFile) {
            message.error(intl.get("goods.add.errorInfo"));
            return false;
        }
        const isLtSize = file.size / 1024 / 1024 <= 20;
        if (!isLtSize) {
            message.error(intl.get("goods.add.errorInfo2"));
            return false;
        }
        return isValidatedFile && isLtSize;
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name}`+ intl.get("goods.add.upSuccess"));
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name}`+ intl.get("goods.add.upError"));
        }
        if(info.file.status){
            let successFileList = fileList.filter((item)=>{
                return item.status;
            });
            this.setState({fileList:successFileList});
        }
    };

    // 创建自定义组件
    createCustomFields = (tags) => {
        this.customRef.createCustomFields(tags);
    };

    componentDidMount() {
        this.props.getRef(this);
    }


    render() {

        const {initBaseInfo} = this.props;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: '2d66'},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: '21d33'},
            }
        };

        const otherFormItemLayout = {
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
                <div>
                    <CustomField {...this.props}
                                 getRef={this.getCustomRef}
                                 dataPrefix={'propertyValues'}/>
                </div>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            label={intl.get("goods.add.remarks")}
                            {...formItemLayout}
                            name={"remarks"}
                            initialValue={initBaseInfo && initBaseInfo.get('remarks')}
                        >

                             <TextArea rows={4} placeholder={intl.get("goods.add.remarks")}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("goods.add.tempAtt")}
                            {...otherFormItemLayout}
                            name={"tempAtt"}
                        >
                            <Upload
                                action={`${BASE_URL}/file/new_temp_attachs`}
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
                                            title={intl.get("goods.add.errorInfo2")}
                                        >
                                            <Button>
                                                <LegacyIcon type={this.state.loading ? 'loading' : 'upload'}/> {intl.get("goods.add.addAtt")}
                                            </Button>
                                        </Tooltip>
                                    ) : null
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo)