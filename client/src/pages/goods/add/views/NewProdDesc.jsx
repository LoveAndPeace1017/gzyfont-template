import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import axios from 'utils/axios';
import { Editor } from '@tinymce/tinymce-react'
import {getCookie} from "utils/cookie";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);


class ProdDesc extends Component {
    constructor(props){
        super(props);
        this.state = {
            content:'',
            hasMoved: false
        }
    }


    componentDidMount() {
        this.props.getRef(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps){

    }

    handleEditorChange = (content, editor) => {
        this.setState({content:content});
    }

    onInit = (content, editor)=>{
        const {prodDesc} = this.props;
        this.setState({content:prodDesc});
        this.tinyMceEditor = editor;
    }

    render() {
        const {prodDesc} = this.props;
        return (
            <React.Fragment>
                <div className={cx("editor-hd")}>
                    <Editor
                        value={prodDesc}
                        id={"tincyEditor"}
                        apiKey="dz7inj0opak6uzuun6txozvu83ecik5lk75x8vgdvnfgymx9"
                        init={{
                            language: 'zh_CN',
                            min_height: 416,
                            plugins: 'preview searchreplace autolink directionality visualblocks visualchars fullscreen image link template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize',
                            toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
                            fontsize_formats: '8px 9px 10px 11px 12px 14px 16px 18px 24px 36px 48px 56px 72px',
                            images_upload_handler: (blobInfo, success, failure)=>{
                                if (blobInfo.blob()) {
                                    const formData = new window.FormData();
                                    formData.append('myFile', blobInfo.blob(), blobInfo.filename())
                                    axios.post(`${BASE_URL}/goods/temp_photos?type=templateEditor&x-csrf-token=${getCookie('csrfToken')}`,formData).then((res) => {
                                        console.log(res,'res');
                                        if(res.data){
                                            // 将图片插入到编辑器中
                                            success(res.data.data[0])
                                        }
                                    }).catch((error) => {
                                        alert(error);
                                    })
                                } else {
                                    alert('error');
                                }

                            }
                        }}
                        onEditorChange={this.handleEditorChange}
                        onInit = {this.onInit}
                    />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProdDesc)