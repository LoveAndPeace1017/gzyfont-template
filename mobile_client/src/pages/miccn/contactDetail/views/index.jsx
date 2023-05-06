import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, NavBar,Toast} from 'antd-mobile';
import {formatCurrency} from 'utils/format';
import editImg from '../img/edit.png';
import meImg from '../img/me.png';
import other from '../img/other.png';
import {LeftOutlined} from '@ant-design/icons';
import moment from "moment";
import {actions as contactInforAction} from '../index'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";


const cx = classNames.bind(styles);
const alert = Modal.alert;


export class contactInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ''
        };
    }


    componentDidMount() {
        let messageId = this.props.match.params.id;
        let type = this.props.match.params.type;
        this.props.asyncFetchContactInfor({messageId:messageId,type:type});
        //处理解决输入底部被软键盘遮挡问题
        //ios是没问题的，屏蔽ios (无效)
        /*let ua = navigator.userAgent;
        let isAndroid = /android/i.test(ua); //android终端
        if(!isAndroid) {
            console.log('zou6');
            window.onresize = function () {
                if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                    setTimeout(function () {
                        var top = document.activeElement.getBoundingClientRect().top;
                        window.scrollTo(0,top);
                    }, 0);
                }
            }
        }*/
    }

    componentWillUnmount() {
        this.props.asyncFetchContactInfor({type:'clear'});
    }

    handleChange = (e)=>{
        let value = e.target.value;
        this.setState({inputValue: value});
    }

    handleEnter = (e)=>{
        let dataSource = this.dataSource;
        let keyNum = (e.keyCode ? e.keyCode : e.which);
        let value = e.target.value;
        let messageId = this.props.match.params.id;
        if(keyNum === 13 && value.trim().length > 0){
            this.props.fetchContactSendInfor({
                sourceId:messageId,
                sourceType:dataSource.sourceType,
                'sendMessage.sourceType':dataSource.sendMessage.sourceType,
                'sendMessage.subject':dataSource.sendMessage.subject,
                'sendMessage.content':value,
                'sendMessage.senderCom':dataSource.sendMessage.senderCom,
                'sendMessage.name':dataSource.sendMessage.name,
                'sendMessage.senderGender':dataSource.sendMessage.senderGender,
                'sendMessage.senderMail': dataSource.sendMessage.senderMail,
                'sendMessage.senderTel': dataSource.sendMessage.senderTel
            },(data)=>{
                console.log(data,'datamm');
                if(data.successFlag == '1'){
                    Toast.success('发送联系信成功！', 1);
                    this.props.history.push(`${PROD_PATH}/miccn/contact/list/1`);
                }else{
                    Toast.fail(`${data.exceptionInfo}`, 1);
                }
            });
        }


    }

    messageInfor = (historyMessage,messageDTO,company) => {
        console.log(historyMessage,'historyMessage');
        console.log(company,'company');

        if (historyMessage.length != 0 || JSON.stringify(messageDTO) != "{}") {
            setTimeout(()=>{
                var div = document.getElementById('chat-content-lst');
                div.scrollTop = div.scrollHeight;
            },50);
            historyMessage.push(messageDTO);
            return historyMessage.map((data, index) => {
                if (data.senderComId != company.comId) {
                    return <div key={index}><div className={cx("msg-box")}>
                        <div className={cx("box-l")}>
                            <img src={other} alt="tp"/>
                        </div>
                        <div className={cx("box-r")}>
                            <p>{data.senderCom}</p>
                            <p>{moment(data.sendTime.time).format('MM-DD HH:mm:ss')}</p>
                            <div className={cx("box-content")}>
                                {data.content}
                            </div>
                        </div>
                    </div>
                        {data.attachment.fileMessageAttachments.length != 0?<p className={cx("attent-file")}>对方上传了一个附件，请去中国制造网内贸站查看</p>:null}
                    </div>

                }else if(data.senderComId == company.comId){
                    return <div key={index}><div className={cx("msg-box")}>
                        <div className={cx("box1-l")}>
                            <img src={meImg} alt="tp"/>
                        </div>
                        <div className={cx("box1-r")}>
                            <p>{data.senderCom}</p>
                            <p>{moment(data.sendTime.time).format('MM-DD HH:mm:ss')}</p>
                            <div className={cx("box-content1")}>
                                {data.content}
                            </div>
                        </div>
                    </div>
                        {data.attachment.fileMessageAttachments.length != 0?<p className={cx("attent-file")}>对方上传了一个附件，请去中国制造网内贸站查看</p>:null}
                    </div>
                }

            });
        }else{
            return null;
        }

    }


    render() {
        const {contactInfor} = this.props;
        const {inputValue} = this.state;
        let dataSource  =  {};
        contactInfor && contactInfor.toJS().data && (dataSource = contactInfor.toJS().data);
        this.dataSource = dataSource;
        let company ={};
        dataSource.company != undefined && (company = dataSource.company);
        let historyMessage = [];
        dataSource.historyMessage != undefined && (historyMessage = dataSource.historyMessage);
        let messageDTO = {};
        dataSource.messageDTO != undefined && (messageDTO = dataSource.messageDTO);

        return(
            <React.Fragment>
                <NavBar
                    mode="dark"
                    style={{'background': '#2DA66A'}}
                    icon={<LeftOutlined />}
                    onLeftClick={() => this.props.history.goBack()}>
                    {company.comName && (company.comName.length<9?company.comName:(company.comName).slice(0,9)+'...')}
                </NavBar>
                <div className={cx('container')}>
                    <div id={"chat-content-lst"} className={cx('chat-content')}>
                        {this.messageInfor(historyMessage,messageDTO,company)}
                    </div>
                    <div className={cx('chat-opt')}>
                        <div className={cx('lt-icon')}>
                            <img style={{maxWidth: '50%'}} src={editImg} alt="tp"/>
                        </div>
                        <input type="text"
                               value={inputValue}
                               placeholder={'写下你要说的话'}
                               className={cx('search-input')}
                               onChange={this.handleChange}
                               onKeyPress={this.handleEnter}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    contactInfor: state.getIn(['contactInforReducer', 'contactInfor']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchContactInfor: contactInforAction.asyncFetchContactInfor,
        fetchContactSendInfor: contactInforAction.fetchContactSendInfor
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(contactInfor)
)

