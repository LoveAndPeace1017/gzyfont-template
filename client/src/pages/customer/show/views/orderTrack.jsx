import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import { Button, Switch, message } from 'antd';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {asyncFetchOrderTrackDetail, asyncUpdateOrderTrack} from "pages/customer/index/actions";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName OrderTrack（开通订单追踪）
 * @author jinb
 */
const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOrderTrackDetail,
        asyncUpdateOrderTrack
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class OrderTrack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            loading: false,
            tackDetail: {}
        }
    }

    componentDidMount() {
        this.props.getRef(this);
    }

    // 获取开通订单追踪详情信息
    getTrackDetail = () => {
        let {customerNo, asyncFetchOrderTrackDetail} = this.props;
        asyncFetchOrderTrackDetail({customerNo}, (res) => {
            let tackDetail = res.data;
            this.setState({checked: tackDetail.enabled, tackDetail});
        })
    };

    handleOnchange = (checked) => {
        let {loading} = this.state;
        let {customerNo, asyncUpdateOrderTrack} = this.props;
        this.setState({loading: true});
        !loading && asyncUpdateOrderTrack({customerNo, flag: checked}, (res) => {
            if(res.retCode === '0'){
                this.getTrackDetail();
                this.setState({loading: false});
            } else {
                message.error(res.retMsg);
            }
        })
    };

    handleCopy = () => {
        const range = document.createRange();
        range.selectNode(document.getElementById('order-tack'));
        const selection = window.getSelection();
        if (selection.rangeCount > 0) selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        message.success("已复制好，可贴粘。");
    };

    render() {
        const { checked, loading, tackDetail } = this.state;
        const {currentAccountInfo} =this.props;
        const accountInfo = currentAccountInfo.get('data');
        console.log(accountInfo && accountInfo.toJS(), 'accountInfo');

        return (
            <>
                <div className={cx('order-tack-header')}>
                    <span className={cx('order-tack-title')}>开通订单追踪平台</span>
                    <Switch loading={loading} onChange={this.handleOnchange} checked={checked} />
                </div>

                {
                    checked && (
                        <>
                            <div className={cx('order-track-container')} id={'order-tack'}>
                                <p className={cx('order-tack-row')}>{accountInfo.get('comName')}对您分享了销售订单，您可以通过百卓轻云ERP订单追踪平台查看订单状态</p>
                                <p className={cx('order-tack-row')}>访问地址：http://order.abiz.com/login/{accountInfo.get('mainUserIdEnc')}/trace</p>
                                <p className={cx('order-tack-row')}>身份ID：{tackDetail.serialNo}</p>
                                <p className={cx('order-tack-row')}>登录口令：{tackDetail.serialPwd}</p>
                            </div>

                            <Button type="primary" className={cx('copy-btn')} onClick={this.handleCopy}>
                                复制内容
                            </Button>
                        </>
                    )
                }
            </>
        )
    }
}