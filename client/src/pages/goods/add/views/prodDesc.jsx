/*
import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getCookie} from "utils/cookie";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'js/ckeditor5/ckeditor';
import 'js/ckeditor5/translations/zh-cn';
import filterImgXss from 'utils/filterImgXss';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class ProdDesc extends Component {
    constructor(props){
        super(props);
        this.state = {
            editorData: ''
        }
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    render() {
        return (
            <React.Fragment>
                <CKEditor
                    editor={ ClassicEditor }
                    data={this.props.prodDesc}
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        this.setState({
                            editorData: editor.getData()
                        });
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        let data = editor.getData();
                        data = filterImgXss(data);
                        this.setState({
                            editorData: data
                        });
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ editor => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ editor => {
                        console.log( 'Focus.', editor );
                    } }
                    config={
                        {
                            /!*plugins: [
                                EssentialsPlugin,
                                UploadAdapterPlugin,
                                AutoformatPlugin,
                                BoldPlugin,
                                ItalicPlugin,
                                BlockQuotePlugin,
                                EasyImagePlugin,
                                HeadingPlugin,
                                ImagePlugin,
                                ImageCaptionPlugin,
                                ImageStylePlugin,
                                ImageToolbarPlugin,
                                ImageUploadPlugin,
                                LinkPlugin,
                                ListPlugin,
                                ParagraphPlugin,
                                CKFinder
                            ],*!/
                            toolbar: {
                                items: [
                                    'heading',
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    'imageUpload',
                                    'blockQuote',
                                    'undo',
                                    'redo',
                                ]
                            },
                            ckfinder: {
                                uploadUrl: `${BASE_URL}/goods/temp_photos?type=editor&x-csrf-token=${getCookie('csrfToken')}`,
                                options: {
                                    resourceType: 'Images',
                                },
                            },
                            language: 'zh-cn'
                        }
                    }
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProdDesc)*/
