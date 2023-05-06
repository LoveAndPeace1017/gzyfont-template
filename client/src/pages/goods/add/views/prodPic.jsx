import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import Tooltip from 'components/widgets/tooltip';
import Upload from 'components/widgets/upload';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

import {uploadPicChange, deletePicChange, emptyUploadPicData} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class ProdPic extends Component {
    // static getDerivedStateFromProps(nextProps, state) {
    //     // Should be a controlled component.
    //     if (nextProps.initImageData && nextProps.initImageData.size>0) {
    //         return {
    //             ...state,
    //             fileList: nextProps.initImageData
    //         };
    //     }
    //     return null;
    // }

    constructor(props){
        super(props);
        // const fileList = [];
        // for(let i =0;i<5;i++){
        //     fileList.push({
        //         pid: i
        //     })
        // }
        this.state = {
            previewVisible: false,
            previewImage: '',
            // fileList: [/*{
            //     pid: '-1',
            //     uid: '-1',
            //     name: 'xxx.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
            // },*/ ...fileList]
        };
    }


    beforeUpload = (file) => {
        const isIMG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
        if (!isIMG) {
            message.error(intl.get("goods.add.errorInfo3"));
        }
        const isLtSize = file.size / 1024 / 1024 <= 1;
        if (!isLtSize) {
            message.error(intl.get("goods.add.errorInfo1"));
        }
        return isIMG && isLtSize;
    };

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    };

    handleChange = (pid, info) => {
        //this.props.fieldChange();
        /*this.setState(prevState => {
            const newFileList =  prevState.fileList.map(file=>{
                if(file.pid === pid){
                    if(info.file.status === 'done'){
                        const tempId = info.file.response && info.file.response.tempId;
                        file.tempId = tempId
                    }
                    return {
                        ...file,
                        ...info.file
                    }
                }
                return file;
            });
            return {
                fileList: newFileList
            }
        });*/

        console.log(info,'info');

       this.props.uploadPicChange(pid, info.file);

    };

    handleRemove= (pid) =>{
        this.props.deletePicChange(pid);
    };

    componentWillUnmount() {
        this.props.emptyUploadPicData();
    }

    render() {
        const {previewVisible, previewImage} = this.state;
        const {picList, preData} = this.props;

        //vip只能上传一个
        // const isVip = preData && preData.getIn(['data', 'isVip']);
        let picListData = picList;
        /*if(!isVip){
            picListData = picList.map(pic=>{
                if(pic.get('pid') !== 0){
                    return pic.set('disabled', true)
                }
                return pic;
            });
        }*/
        return (
            <div className={cx("upload-list")}>
                {picListData && picListData.map(item => {
                    const isDisabled = item.get('disabled');
                    return (
                        <Upload
                            action={`${BASE_URL}/goods/temp_photos`}
                            name="photo"
                            listType= "picture-card"
                            fileList={item.get('status') === 'uploading' || item.get('status') === 'done'|| item.get('status') === 'error'?[item.toJS()]:[]}
                            beforeUpload={this.beforeUpload}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange.bind(this, item.get('pid'))}
                            key={item.get('pid')}
                            onRemove={this.handleRemove.bind(this, item.get('pid'))}
                            disabled={isDisabled}
                            className={cx("upload-item")}
                        >
                            {item.get('status') === 'uploading' || item.get('status') === 'done'|| item.get('status') === 'error' ? null : (
                                <div className={cx({'upload-btn-disabled': isDisabled})}>
                                    {
                                        isDisabled?(
                                            <React.Fragment>
                                                <PlusOutlined />
                                                <div className="ant-upload-text">{intl.get("goods.add.addPic")}</div>
                                            </React.Fragment>
                                        ):(
                                            <Tooltip
                                                type="info"
                                                title={intl.get("goods.add.errorInfo4")}
                                            >
                                                <PlusOutlined />
                                                <div className="ant-upload-text">{intl.get("goods.add.addPic")}</div>
                                            </Tooltip>
                                        )
                                    }
                                </div>
                            )}
                        </Upload>
                    );
                })}

                {/*<div className="ant-upload-list-item ant-upload-list-item-uploading">*/}
                    {/*<div className="ant-upload-list-item-info"><span><div*/}
                        {/*className="ant-upload-list-item-uploading-text">文件上传中</div><span*/}
                        {/*className="ant-upload-list-item-name" title="Desert.jpg">Desert.jpg</span></span></div>*/}
                    {/*<i aria-label="图标: close" title="删除文件" tabIndex="-1" className="anticon anticon-close">*/}
                    {/*</i>*/}
                    {/*<div className="ant-upload-list-item-progress">*/}
                        {/*<div className="ant-progress ant-progress-line ant-progress-status-normal ant-progress-default">*/}
                            {/*<div>*/}
                                {/*<div className="ant-progress-outer">*/}
                                    {/*<div className="ant-progress-inner">*/}
                                        {/*<div className="ant-progress-bg"*/}
                                             {/*style="width: 98.7542%; height: 2px; border-radius: 100px;"></div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    preData: state.getIn(['goodsAdd', 'preData'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        uploadPicChange,
        deletePicChange,
        emptyUploadPicData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ProdPic)
