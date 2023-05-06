import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Select, message, Modal, Row, Col } from 'antd';
import {getCookie} from 'utils/cookie';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {actions as commonActions} from "components/business/commonRequest";
import {actions as vipServiceHomeActions} from "pages/vipService";
const cx = classNames.bind(styles);


/**
 * @visibleName MessageRecommendPop（消息提醒）
 * @author jinb
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGetSmsNotifyNum:  vipServiceHomeActions.asyncFetchGetSmsNotifyNum,
        asyncFetchMessageRecommendLog: commonActions.asyncFetchMessageRecommendLog,
        asyncMessageRecommend:  commonActions.asyncMessageRecommend
    }, dispatch)
};

const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});


@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class MessageRecommend extends Component{
    static SEND_INFO = {
        order: {
            title: '采购订单短信提醒',
            sendType: [
                {name: "采购发货提醒", review: "已临近交货期"},
                {name: "采购开票提醒", review: "未完成开票"},
                {name: "采购已付款提醒", review: "已完成付款"}
            ],
            emptyError: "请先填写供应商的联系人和联系电话",
            mobileError: "联系电话必须是手机号"
        },
        sale: {
            title: '销售订单短信提醒',
            sendType: [
                {name: "销售已发货提醒", review: "已完成发货"},
                {name: "销售已开票提醒", review: "已完成开票"},
                {name: "销售收款提醒", review: "未完成付款"}
            ],
            emptyError: "请先填写客户的联系人和联系电话",
            mobileError: "联系电话必须是手机号"
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            idx: 0,
            logs: []
        }
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    openModal = (type = 'visible') => {
        this.setState({
            [type]: true
        })
    };

    closeModal = (type = 'visible') => {
        this.setState({
            [type]: false
        })
    };

    // 获取发送短信提醒操作日志
    getMessageRecommendLog = () => {
        let { source, billNo } = this.props;
        this.props.asyncFetchMessageRecommendLog({ billNo, source }, (res) => {
            if(res.retCode === '0'){
                this.setState({logs: res.data});
            }
        });
    };

    // 校验短信数量不足
    validateSmsNumber = () =>{
        return new Promise((resolve, reject) => {
            this.props.asyncFetchGetSmsNotifyNum((data)=>{
                if(data.retCode === "0"){
                    if(data.data > 0){
                        resolve();
                    } else {
                        message.error('可用短信数量不足无法发送，请尽快充值');
                        reject();
                    }
                }
            })
        });
    };

    // 校验联系人&联系电话
    validateContacterInfo = ({name, mobile}) => {
        return new Promise((resolve, reject) => {
            let { source } = this.props;
            let { emptyError, mobileError } = MessageRecommend.SEND_INFO[source];
            let reg = /^1[0-9]{10}$/;
            if(!name || !mobile) {
                message.error(emptyError);
                reject();
                return;
            }
            if(!reg.test(mobile)){
                message.error(mobileError);
                reject();
                return;
            }
            resolve();
        });
    };


    handleOnOk = async () => {
        let { idx } = this.state;
        let { source, billNo } = this.props;
        let { sendType } = MessageRecommend.SEND_INFO[source];
        this.props.asyncMessageRecommend({ billNo, source, sendType: sendType[idx].name }, (res) => {
            if(res.retCode === '0'){
                message.success("操作成功!");
            } else {
                message.error(res.retMsg);
            }
        });
        this.handleOnCancel();
    };

    handleOnCancel = () => {
        this.setState({idx: 0});
        this.closeModal();
    };

    render(){
        let { idx, logs, visible } = this.state;
        let { source = 'order', date, currentAccountInfo } = this.props;
        let {title, sendType} = MessageRecommend.SEND_INFO[source];

        const accountInfo = currentAccountInfo.get('data');
        const comName = accountInfo.get('comName');

        return(
            <div>
                <Modal
                    visible={visible}
                    title={title}
                    onOk={this.handleOnOk}
                    onCancel={this.handleOnCancel}
                    cancelText={"取消"}
                    destroyOnClose={true}
                    width={800}
                >
                    <Row style={{margin: '15px 0'}}>
                        <Col span={4}>
                            <span className={cx('remind-title')}>提醒类型:</span>
                        </Col>
                        <Col span={20}>
                            <Select style={{"width": "250px"}}
                                    defaultValue={sendType[idx].name}
                                    onChange={(value, option) => {
                                        this.setState({idx: option.key})
                                    }}
                            >
                                {
                                    sendType && sendType.map((item, index) => (
                                        <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{margin: '15px 0'}}>
                        <Col span={4}>
                            <span className={cx('remind-title')}>短信预览:</span>
                        </Col>
                        <Col span={20}>
                            <span className={cx('remind-content')}>您与{comName}在{date}签约订单{sendType[idx].review}，请及时安排哦</span>
                        </Col>
                    </Row>

                    <Row style={{margin: '15px 0'}}>
                        <Col span={4}>
                            <span className={cx('remind-title')}>操作日志:</span>
                        </Col>
                        <Col span={20}>
                            <span className={cx('remind-content')}>
                                {
                                    logs.map(item => (
                                        <>
                                            <span>{item.message}</span><br />
                                        </>
                                    ))
                                }
                            </span>
                        </Col>
                    </Row>
                </Modal>
            </div>

        )
    }
}


