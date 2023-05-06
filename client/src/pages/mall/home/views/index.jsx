import React, {Component} from 'react';
import {Button, Col, Row, Modal, Spin} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {offset} from 'utils/dom';
import Crumb from 'components/business/crumb';
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
const cx = classNames.bind(styles);
import {asyncFetchPreData, asyncRecordGuideShow} from '../actions';
import Explore from './explore';
import WeChatShare from './weChatShare';
import OpenAppletsPre from './openAppletsPre';
import {withMallExpired, MallOpen} from 'components/business/vipOpe';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import phone from "../images/phone.png";

const AVAILABLE = {
    OPENED: true
};

const MALL_STATUS = {
    CLOSED: 0,
    OPENED: 1
};

const APPLY_STATUS = {
    NOT_APPLY: 0,
    APPLYING: 1,
    OPENED: 2
};

const mapStateToProps = (state) => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    preData: state.getIn(['mallHome', 'preData']),
    openMall: state.getIn(['vipOpe', 'openMall'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncRecordGuideShow
    }, dispatch)
};

@withMallExpired
@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends Component {

    constructor(props){
        super(props);
        this.state = {
            exploreVisible: false,
            webChatShareVisible: false,
            completeComInfoVisible: false,
            openAppletsPreVisible: false,
            renewVisible: false,
            guideStep: 1
        }
    }


    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    guideNext=(guideStep)=>{
        this.setState({
            guideStep
        })
    };


    /**
     * 获取四个步骤元素距离顶部和左边的距离
     **/
    getStepSize=()=>{

        if(!(this.step1Ref && this.step2Ref && this.step3Ref && this.step4Ref)) return;
        const topDelta = 32;
        const leftDelta = 32 + 44;
        this.step1Top = offset(this.step1Ref).top + this.step1Ref.offsetHeight + topDelta;
        this.step1Left = offset(this.step1Ref).left + this.step1Ref.offsetWidth/2 + leftDelta;
        this.step2Top = offset(this.step2Ref).top + this.step2Ref.offsetHeight + topDelta;
        this.step2Left = offset(this.step2Ref).left + this.step2Ref.offsetWidth/2 + leftDelta;
        this.step3Top = offset(this.step3Ref).top + this.step3Ref.offsetHeight + topDelta;
        this.step3Left = offset(this.step3Ref).left + this.step3Ref.offsetWidth/2 + leftDelta;
        this.step4Top = offset(this.step4Ref).top + this.step4Ref.offsetHeight + topDelta;
        this.step4Left = offset(this.step4Ref).left - 306; //306为第四个引导元素自身宽度
        // console.log('offsetHeight:'+this.step1Ref.offsetHeight, 'offsetWidth:'+this.step1Ref.offsetWidth)
        console.log('step4Left:'+offset(this.step4Ref).left)
    };

    handleMallOpen=()=>{
        const {currentAccountInfo} =this.props;
        const accountInfo = currentAccountInfo.get('data');
        //如果没有公司名称则打开完善公司信息弹层，否则直接执行开通商城操作
        // if(!accountInfo.get('comName') || accountInfo.get('comName') === 'N/A'){
            this.openModal('completeComInfoVisible')
        /*}else{
            this.openMall();
        }*/
    };

    refresh=()=>{
        this.props.asyncFetchPreData((data)=>{
            if(data.data.available === AVAILABLE.OPENED && data.data.firstVisit){
                //商城开通成功获取数据则记录引导出现
                console.log('第一次进入');
                this.props.asyncRecordGuideShow();
            }
        });
    };

    componentDidMount() {
        this.refresh();
        this.getStepSize();
        document.addEventListener('resize', ()=>{
            this.getStepSize();
        }, false)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('did update')
        this.getStepSize();
    }

    render(){

        const {preData, openMall, onlineMallInfo, currentAccountInfo} = this.props;

        //商城开通状态 + 过期状态
        const accountInfoData = onlineMallInfo.getIn(['data', 'data']);

        //是否子账号
        const accountInfo = currentAccountInfo.get('data');

        const dataMallConfig = preData.getIn(['data', 'data', 'dataMallConfig']);

        //第一次访问
        const firstVisit = preData.getIn(['data', 'data', 'firstVisit']);

        //商城开通状态
        const available = preData.getIn(['data', 'data', 'available']);

        //小程序二维码
        const wxAppletImgUrl = preData.getIn(['data', 'data', 'wxAppletImgUrl']);


        //商城开启状态（设置中设置）
        const mallStatus = dataMallConfig && dataMallConfig.get('mallStatus');

        //小程序商城申请状态
        const applyStatus = dataMallConfig && dataMallConfig.get('applyStatus');

        //出现过一次 && 商城开通
        const showGuide = firstVisit && available === AVAILABLE.OPENED;

        let mallOpenStr = null;
        let mallTit = null;
        let mallSubTit = null;
        if(available === AVAILABLE.OPENED){
            mallTit = (
                <h3>商城已开通</h3>
            )
            mallSubTit = (
                <p>您的客户可以通过商城在线订货啦</p>
            )
            if(mallStatus === MALL_STATUS.OPENED){
                mallOpenStr = (
                    <Button className={cx(["btn"])}>
                        <Link to={'/mall/preview'}>预览我的商城</Link>
                    </Button>
                )
            }else{
                mallOpenStr = (
                    <div className={cx("mall-close-txt")}>商城已关闭，您可以去<Link to="/mall/setting/">设置</Link>里重新开启</div>
                )
            }

        }else{
            mallTit = (
                <h3>您还没有开通商城</h3>
            )
            mallSubTit = (
                <p>商城开通后，您的客户即可通过商城在线订货啦</p>
            )
            mallOpenStr = (
                <Button type="primary"
                        className={cx(["btn"])}
                        onClick={this.handleMallOpen}
                        loading={openMall.get('isFetching')}
                >
                    开通商城
                </Button>
            )
        }

        //小程序未开通、已开通、已过期标题和副标题设置
        let applyTit = null;
        let applySubTit = null;
        let applyBtnStr = null;
        if(applyStatus === APPLY_STATUS.OPENED){
            applyTit = (
                <h3>商城小程序已开通</h3>
            )
            applySubTit = (
                <p>您的客户可以在小程序上浏览商品、移动订货啦</p>
            )
            applyBtnStr = (
                <Button className={cx(["btn"])} onClick={()=>this.openModal('webChatShareVisible')}>分享商城小程序</Button>
            )
        }else{
            applyTit = (
                <h3>您还没有开通商城小程序</h3>
            )
            applySubTit = (
                <p>商城的小程序端开通后，您的客户即可在小程序上浏览商品、移动订货啦</p>
            )
            if(applyStatus === APPLY_STATUS.APPLYING){
                applyBtnStr = (
                    <Button className={cx(["btn"])} type="primary" disabled>开通中</Button>
                )
            }else{
                if(available === AVAILABLE.OPENED){
                    applyBtnStr = (
                        <Button className={cx(["btn"])} type="primary" onClick={()=>this.openModal('openAppletsPreVisible')}>开通商城小程序</Button>
                    )
                }else{
                    applyBtnStr = (
                        <Tooltip
                            type="info"
                            placement="right"
                            title="开通商城小程序前，需先开通商城哦"
                        >
                            <Button className={cx(["btn"])} type="primary" disabled>开通商城小程序</Button>
                        </Tooltip>)
                }
            }
        }

        //服务日期为，未开通、已开通、已过期
        let serviceDateStr = null;
        let mallOpenText = (
            <div className={cx("service-date-in")}>
                <span>服务期：{moment(accountInfoData && accountInfoData.get('startTime')).format('YYYY-MM-DD')} 至 {moment(accountInfoData && accountInfoData.get('endTime')).format('YYYY-MM-DD')}</span> 商城续约，详询客服：400-6979-890（转1）和18402578025（微信同号）<a href="http://www.abiz.com/info/assistant-sfaq/63399.htm" target="_blank">查看详情</a>
            </div>
        );
        let mallSubRenewBtn = (
            <Button onClick={() => this.openModal('renewVisible')} type="primary">续约</Button>
        );
        if(accountInfoData && accountInfoData.get('vipState') === 'EXPIRED'){
            serviceDateStr = (
                <div className={cx("service-date")}>
                    <div className={cx("service-date-in")}>
                        <span className={cx("gray")}>服务期：已过期</span> 商城续约，详询客服：400-6979-890（转1）和18402578025（微信同号）
                        <a href="http://www.abiz.com/info/assistant-sfaq/63399.htm" target="_blank">查看详情</a>
                    </div>
                    {accountInfo && accountInfo.get('mainUserFlag')?
                        <a href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true" target="_blank" className="ant-btn ant-btn-primary">续约</a>:
                        {mallSubRenewBtn}
                    }
                </div>
            )
            mallTit = (
                <h3>商城已过期</h3>
            )
            applyTit = (
                <h3>商城小程序已过期</h3>
            )
            applySubTit = null
            mallSubTit = null
            applyBtnStr = null
            mallOpenStr= null
        }else if(accountInfoData && accountInfoData.get('vipState') === 'OPENED'){
            serviceDateStr = (
                <div className={cx("service-date")}>
                    {mallOpenText}
                    {accountInfo && accountInfo.get('mainUserFlag')?
                        <a href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true" target="_blank" className="ant-btn ant-btn-primary">续约</a>:
                        {mallSubRenewBtn}
                    }
                </div>
            )
        }else if(accountInfoData && accountInfoData.get('vipState') === 'TRY'){
            serviceDateStr = (
                <div className={cx("service-date")}>
                    {mallOpenText}
                    {accountInfo && accountInfo.get('mainUserFlag')?
                        <a href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true" target="_blank" className="ant-btn ant-btn-primary">续约</a>:
                        {mallSubRenewBtn}
                    }
                </div>
            )
        }else{
            serviceDateStr = null
        }


        return(
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: '我的商城'
                        }
                    ]}/>
                    {
                        available === AVAILABLE.OPENED?(
                            <div className={cx("explore")} onClick={()=>this.openModal('exploreVisible')}>
                                <Icon type="icon-mall" />
                                <a href="#!">探索我的商城</a>
                            </div>
                        ):null
                    }
                </div>

                <Spin
                    spinning={preData.get("isFetching")}
                >
                    <div className={cx("mall-open") + " clearfix"}>
                        {serviceDateStr}
                        <div className={cx("mall-open-mall")}>
                            <div className={cx("mall-item-wrap")}>
                                <span className={cx("step-tit")}>STEP 01</span>
                                <span className={cx(["icon", "icon-mall", {"icon-mall-open": available === AVAILABLE.OPENED}])} />
                                {mallTit}
                                {mallSubTit}
                                <div className={cx("ope-wrap")}>
                                    {mallOpenStr}
                                </div>
                            </div>
                        </div>
                        <div className={cx("mall-open-applet")}>
                            <div className={cx("mall-item-wrap")}>
                                <span className={cx("step-tit")}>STEP 02</span>
                                <span className={cx(["icon", "icon-applet", {"icon-mall-open": applyStatus === APPLY_STATUS.OPENED}])} />
                                {applyTit}
                                {applySubTit}
                                <div className={cx("ope-wrap")}>
                                    {applyBtnStr}
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        available === AVAILABLE.OPENED?(
                            <div className={cx("mall-box")}>
                                <div className={cx("mall-box-hd")}>
                                    <h2>商城管理</h2>
                                </div>
                                <div className={cx("mall-box-bd")}>
                                    <div className={cx(["mall-manage",{"guide-step-hidden": !showGuide}, `guide-step-${this.state.guideStep}`])}>
                                        <Row gutter={{xl: 50, xxl: 100}}>
                                            <Col span={6}>
                                                <div className={cx(["lst-item", "lst-goods"])} ref={ref=>this.step1Ref = ref}>
                                                    <Link to={"/mall/goods/"} onClick={this.props.mallExpiredJudge}>
                                                        <h3>商品管理</h3>
                                                        <Icon type="icon-goods-manage" className={cx("icon")}/>
                                                    </Link>
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className={cx(["lst-item", "lst-customer"])} ref={ref=>this.step2Ref = ref}>
                                                    <Link to={"/mall/customer/"} onClick={this.props.mallExpiredJudge}>
                                                        <h3>客户管理</h3>
                                                        <Icon type="icon-customer-manage" className={cx("icon")}/>
                                                    </Link>
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className={cx(["lst-item", "lst-order"])} ref={ref=>this.step3Ref = ref}>
                                                    <Link to={"/mall/sale/"} onClick={this.props.mallExpiredJudge}>
                                                        <h3>在线销售单</h3>
                                                        <Icon type="icon-order-manage" className={cx("icon")}/>
                                                    </Link>
                                                </div>
                                            </Col>
                                            <Col span={6}>
                                                <div className={cx(["lst-item", "lst-setting"])} ref={ref=>this.step4Ref = ref}>
                                                    <Link to={"/mall/setting/"} onClick={this.props.mallExpiredJudge}>
                                                        <h3>设置</h3>
                                                        <Icon type="icon-setting" className={cx("icon")}/>
                                                    </Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        ):null
                    }

                    {
                        applyStatus === APPLY_STATUS.OPENED?null:(
                            <div className={cx("mall-box")}>
                                <div className={cx("mall-box-hd")}>
                                    <h2>商城服务</h2>
                                </div>
                                <div className={cx("mall-box-bd")}>
                                    <div className={cx("mall-service")}>
                                        <Row gutter={{xl: 70, xxl: 140}}>
                                            <Col span={8}>
                                                <div className={cx(["lst-item", "lst-order"])}>
                                                    <span className={cx(["icon", "icon-online-order"])} />
                                                    <h3>在线订货</h3>
                                                    <p>业务流程线上化，效率提升100%</p>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div className={cx(["lst-item", "lst-promotion"])}>
                                                    <span className={cx(["icon", "icon-prod-promotion"])} />
                                                    <h3>产品推广</h3>
                                                    <p>微信小程序引流，新品推广不犯愁</p>
                                                </div>
                                            </Col>
                                            <Col span={8}>
                                                <div className={cx(["lst-item", "lst-tracking"])}>
                                                    <span className={cx(["icon", "icon-order-tracking"])} />
                                                    <h3>多端共享</h3>
                                                    <p>web/app/小程序数据共享，随时随地收发订单</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </Spin>

                {/*引导*/}
                {
                    showGuide?(
                        <React.Fragment>
                            <div className={cx("guide-home-mask")} style={{"display": this.state.guideStep !== 0?"block":"none"}}/>
                            <div className={cx("guide-home-transparent")}/>
                            <div className={cx(["guide-home-step", "guide-home-step1"])} style={{
                                display: this.state.guideStep === 1?"block":"none",
                                top: this.step1Top + 'px',
                                left: this.step1Left + 'px'
                            }}>
                                <span className={cx("arrow")} />
                                <p>您可以在这里上下架商城商品</p>
                                <Button onClick={()=>this.guideNext(2)}>下一步</Button>
                            </div>

                            <div className={cx(["guide-home-step", "guide-home-step2"])} style={{
                                display: this.state.guideStep === 2?"block":"none",
                                top: this.step2Top + 'px',
                                left: this.step2Left + 'px'
                            }}>
                                <span className={cx("arrow")} />
                                <p>您可以在这里添加商城客户、管理<br/>商城对客户的开启状态</p>
                                <Button onClick={()=>this.guideNext(3)}>下一步</Button>
                            </div>

                            <div className={cx(["guide-home-step", "guide-home-step3"])} style={{
                                display: this.state.guideStep === 3?"block":"none",
                                top: this.step3Top + 'px',
                                left: this.step3Left + 'px'
                            }}>
                                <span className={cx("arrow")} />
                                <p>您可以在这里接收/取消客户订货单</p>
                                <Button onClick={()=>this.guideNext(4)}>下一步</Button>
                            </div>

                            <div className={cx(["guide-home-step", "guide-home-step4"])}
                                 ref={ref=>this.guide4Ref = ref}
                                 style={{
                                     display: this.state.guideStep === 4?"block":"none",
                                     top: this.step4Top + 'px',
                                     left: this.step4Left + 'px'
                                 }}>
                                <span className={cx("arrow")} />
                                <p>您可以在这里添加商城描述及管理商城</p>
                                <Button type="primary"><Link to={{pathname: "/mall/goods/", state: {fromFourStep: true}}}>立即使用</Link></Button>
                            </div>
                        </React.Fragment>
                    ):null
                }

                {/*子账号点击续约提示*/}
                <Modal
                    title={"续约提示"}
                    visible={this.state.renewVisible}
                    onOk={()=>this.closeModal('renewVisible')}
                    onCancel={()=>this.closeModal('renewVisible')}
                    width={500}
                    destroyOnClose={true}
                >
                    <div>
                        仅主账号可操作
                    </div>
                </Modal>

                <WeChatShare
                    imgUrl={wxAppletImgUrl}
                    visible={this.state.webChatShareVisible}
                    onClose={()=>this.closeModal('webChatShareVisible')}
                />
                <Explore
                    visible={this.state.exploreVisible}
                    onClose={()=>this.closeModal('exploreVisible')}
                />
                <MallOpen
                    visible={this.state.completeComInfoVisible}
                    onClose={()=>this.closeModal('completeComInfoVisible')}
                    openSuccCallback={()=>{
                        const _this = this;
                        Modal.confirm({
                            title: '恭喜您，您的商城已经开通成功！',
                            content: '您还可以继续开通商城小程序，马上申请开通吧。',
                            icon: <Icon type="check-circle-fill" />,
                            okText: '开通商城小程序',
                            cancelText: '稍后开通',
                            onOk(){
                                _this.openModal('openAppletsPreVisible');
                            },
                            onCancel(){
                                //点击稍后开通后关闭弹出，同时需要重新刷新页面数据
                                _this.refresh();
                            }
                        })
                    }}
                />
                <OpenAppletsPre
                    visible={this.state.openAppletsPreVisible}
                    onClose={()=>this.closeModal('openAppletsPreVisible') }
                    refresh={this.refresh}
                />
            </React.Fragment>
        )
    }
}


