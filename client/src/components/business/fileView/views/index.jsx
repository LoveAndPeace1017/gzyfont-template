import React, { Component } from 'react';
import FileViewer from 'react-file-viewer';
import { Page } from 'react-pdf';
import { Document } from 'react-pdf/dist/esm/entry.webpack';
import {withRouter} from "react-router-dom";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import { Modal, Button } from 'antd';

class FileView extends Component {
    state = {
        viewFlag : false,
        pageNumber: 1,
        numPages: 5
    }

    onDocumentLoadSuccess = ({ numPages })=>{
        this.setState({
            numPages
        })
    }


    render() {
        let {fileId,fileName} = this.props;
        let {viewFlag} = this.state;
        let picType = ['jpg','png','gif','docx','pdf','jpeg'];
        let type =  fileName.split('.')[1];
        let canView = picType.indexOf(type) != -1;
        let file = '/api/file/download/?url=/file/download/'+fileId;
        let {pageNumber,numPages} = this.state;

        return (
            <React.Fragment>
                {
                    canView?(
                        <React.Fragment>
                            <Button type={"default"} size={"small"} onClick={()=>{
                                this.setState({
                                    viewFlag: true
                                })
                            }} className={cx('view')}>预览</Button>
                            <Modal destroyOnClose={true} footer={null} width={950} title="文件预览" visible={viewFlag} onCancel={()=>{
                                this.setState({
                                    viewFlag: false
                                })
                            }}>
                                <div id="pg-viewer" style={{width: "900px",height: "920px",overflow:"scroll"}}>
                                    {
                                        type === "pdf"?
                                            <div>
                                                <Document
                                                    file={file}
                                                    onLoadSuccess={this.onDocumentLoadSuccess}
                                                >
                                                    <Page pageNumber={pageNumber} />
                                                </Document>
                                                <p style={{textAlign: "center"}}><span>第{pageNumber}页</span>/<span>共{numPages}页</span></p>
                                                <div>
                                                    {
                                                        pageNumber === 1 ? null : <Button type='primary' onClick={()=>{this.setState({pageNumber:pageNumber-1})}}>上一页</Button>
                                                    }
                                                    {
                                                        pageNumber === numPages ? null : <Button style={{ marginLeft: '10px' }} type='primary' onClick={()=>{this.setState({pageNumber:pageNumber+1})}}>下一页</Button>
                                                    }
                                                </div>
                                            </div>:
                                            <FileViewer
                                                fileType={type}
                                                filePath={file}
                                            />
                                    }
                                </div>
                            </Modal>
                        </React.Fragment>
                    ):null
                }

            </React.Fragment>
        )

    }
}

export default withRouter(FileView)