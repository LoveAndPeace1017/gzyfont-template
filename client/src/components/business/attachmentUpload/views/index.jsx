import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, message } from 'antd';
import Tooltip from 'components/widgets/tooltip';
import Upload from 'components/widgets/upload';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName AttachmentUpload（上传附件）
 * @author jinb
 */
export default class AttachmentUpload extends Component {

    beforeUpload = (file) => {
        const isValidatedFile = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp'
            || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' //doc 、docx
            || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' //xsl 、xsls
            || file.type === 'application/pdf' || file.type === 'text/plain' || file.type === 'application/x-zip-compressed' //pdf、txt、zip
            || /\.rar$/.test(file.name);  // rar格式的file.type为空（搞不懂），所以只能用名称判断了
        if (!isValidatedFile) {
            message.error(intl.get("components.attachmentUpload.index.message1"));
        }
        const isLtSize = file.size / 1024 / 1024 <= 20;
        if (!isLtSize) {
            message.error(intl.get("components.attachmentUpload.index.message2"));
        }
        return isValidatedFile && isLtSize;
    };

    handleChange = (info) => {
        let fileList = [...info.fileList];

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} ${intl.get("components.attachmentUpload.index.message3")}`);
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} ${intl.get("components.attachmentUpload.index.message4")}`);
        }
        if(info.file.status){
            let successFileList = fileList.filter((item)=>{
                return item.status;
            });
            this.props.handleChange(successFileList)
        }
    };


    render() {
        let {uploadUrl, name, fileList, maxLength, title, loading} = this.props;

        return (
            <React.Fragment>
                <Upload
                    action={uploadUrl || `${BASE_URL}/file/new_temp_attachs`}
                    name={name || "file"}
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                    multiple={true}
                    fileList={fileList}
                >
                    {
                        fileList.length < maxLength? (
                            <Tooltip
                                type="info"
                                title={`${intl.get("components.attachmentUpload.index.message5")} ${maxLength} ${intl.get("components.attachmentUpload.index.message6")}`}
                            >
                                <Button>
                                    <LegacyIcon type={loading ? 'loading' : 'upload'}/> {title || intl.get("components.attachmentUpload.index.message7")}
                                </Button>
                            </Tooltip>
                        ) : null
                    }
                </Upload>
            </React.Fragment>
        );
    }
}


