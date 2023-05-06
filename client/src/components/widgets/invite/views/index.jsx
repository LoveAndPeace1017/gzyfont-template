import {Component} from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Row, Alert } from "antd";
import React from "react";
import QrCode from 'components/widgets/qrcode';
import intl from 'react-intl-universal';
import CompleteComInfo from 'components/business/completeComInfo';
import {getCookie} from 'utils/cookie';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


class InvitePop extends Component{
    constructor(props){
        super(props);
        this.state = {
            userIdEnc: getCookie('uid'),
            comName: decodeURIComponent(getCookie('comName')),
            downloadUrl:'',
            completeComInfoVisible:false,
            visible:false
        };
    }
    copyLink = ()=>{
        var inputFocus = document.getElementById('inviteLink');
        inputFocus.focus();
        inputFocus.select();
        // 当没有值的时候，手机上获取焦点全选，某些情况下可能有问题，目前没有复现
        var valueLen = inputFocus.value.length;
        /*
        * 当type=number时，在谷歌模拟器里面会直接报错误，因为这种类型不支持selectionStart,
        * 但在有些安卓手机浏览器中不行，检测inputFocus.selectionStart会为true，设置的时候会报错，
        * 所以前面的select()方法还是必要的。
        */
        try {
            if (inputFocus.selectionStart && valueLen) {
                inputFocus.selectionStart = 0;
                inputFocus.selectionEnd = valueLen;
            }
        } catch(e) {
            console.info(e)
        }
        document.execCommand('Copy');

        return false;
    };

    copyImg = ()=>{
        let area = document.getElementById('qrcode-container');
        area.setAttribute("contenteditable", 'true');
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(area);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('Copy');
        //Unselect the content
        window.getSelection().removeAllRanges();
        area.setAttribute("contenteditable", 'false');
    };
    downloadImg = ()=>{
        let canvas=document.getElementsByTagName('canvas')[0];
        let dataURL = canvas.toDataURL('image/png');
        this.setState({
            downloadUrl:dataURL
        });
    };
    cancelComInfo = ()=>{
        this.setState({
            completeComInfoVisible:false,
        })
    };
    completeComInfoCallback = ()=>{
        this.setState({
            completeComInfoVisible:false,
            visible:true,
        });
    };
    UNSAFE_componentWillUpdate = (nextProps, nextState)=>{
        console.log('invite:',nextProps, nextState,this.state.comName);
        if(nextProps.inviteVisible != (this.state.visible||this.state.completeComInfoVisible)){
            if(nextProps.inviteVisible && this.state.comName == 'N/A'){
                this.setState({
                    completeComInfoVisible:true,
                    visible:false
                });
            }else{
                this.setState({
                    visible:nextProps.inviteVisible
                });
            }
        }
    };

    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            }
        };

        let url = this.props.url||`https://erp.abiz.com/register/invite?userIdEnc=${this.state.userIdEnc}&comName=${this.state.comName}&type=${this.props.type}&inviteType=${this.props.inviteType}`;
        let pcUrl = this.props.url||`https://erp.abiz.com/register?source=invite&userIdEnc=${this.state.userIdEnc}&comName=${this.state.comName}&type=${this.props.type}&inviteType=${this.props.inviteType}`;
        return(
            <React.Fragment>
                <Modal
                    {...this.props}
                    visible={this.state.visible}
                    width={800}
                    footer = {null}
                    title={intl.get("home.invite.title")}
                    id={'inviteModal'}
                >
                    {
                        this.props.module !== 'hehuo' && (
                            <Form.Item
                                label={<React.Fragment/>}
                                colon={false}
                                {...formItemLayout}
                            >
                                <p className={cx("txt")}>{intl.get("home.invite.content")}</p>
                            </Form.Item>
                        )
                    }
                    <Form.Item
                        label={intl.get("home.invite.title1")}
                        {...formItemLayout}
                    >
                        <Input value={pcUrl} id='inviteLink'/> <a onClick={this.copyLink} className={cx("btn-copy-link")}>{intl.get("home.invite.copy")}</a>
                    </Form.Item>
                    <Form.Item
                        label={intl.get("home.invite.title2")}
                        {...formItemLayout}
                    >
                        <div className={cx("qrcode")}>
                            <QrCode value={url} id={'qrcode-container'}/>
                            <div className={cx("qrcode-ope")}>
                                <a className={cx("download")} onClick={this.downloadImg}  download="invite.png" id="btn-download" href={this.state.downloadUrl}>{intl.get("home.invite.title3")}</a>
                            </div>
                        </div>

                    </Form.Item>

                    {
                        this.props.module === 'hehuo' && (
                            <Alert
                                message={intl.get("home.invite.content2")}
                                type="warning"
                                showIcon
                                style={{margin: '0 50px'}}
                            />
                        )
                    }
                </Modal>
                {
                    /**
                    *   非合伙人系统，
                    *   优采注册时未填写公司名称，需要完善公司信息
                    * */

                    this.props.module !== 'hehuo' && (
                        <CompleteComInfo
                            visible={this.state.completeComInfoVisible}
                            onCancel={this.cancelComInfo}
                            okCallback={this.completeComInfoCallback}
                        />
                    )
                }
            </React.Fragment>
        )
    }
}
export default InvitePop;
