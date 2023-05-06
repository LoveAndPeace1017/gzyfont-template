import React, {Component} from 'react';
import {Modal, Tabs} from 'antd';
import Icon from 'components/widgets/icon';
import {Auth} from 'utils/authComponent';
import intl from 'react-intl-universal';
import Tip from 'components/widgets/tip';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);

import Project from '../project';
import Dept from '../dept';
import Employee from '../employee';
import CustomerLv from '../customerLv';
import GoodsUnit from '../goodsUnit';
import Category from '../category';
import Serial from '../serial';
import OtherSerial from '../serial/views/otherSerial';
import CustomField from '../customField';
import NewCustomField from '../newCustomField';
import Income from '../income';
import Group from '../group';
import Order from '../orderType';
import Express from '../express';
import Bill from '../bill';
import Rate from '../rate';
import Address from '../deliveryAddress';
import Approve from '../approve';
import WareLimit from '../wareLimit';
import PriceLimt from '../priceLimit';
import LevelApproved from  '../levelApproval';
import DataProgress from '../dataProgress';
import WorkCenter from '../workCenter';
import WorkProcedure from '../workProcedure';
import WorkTime from '../workTime';
import DeviceManage from '../device';
import Menu from '../menu';
import MultiCurrency from '../multiCurrency';
import Notification from '../notification';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const {TabPane} = Tabs;

class ModalContent extends Component {
    state = {
        tabKey: this.props.defaultKey
    };

    handleTabClick = (tabKey) => {
        this.setState({
            tabKey
        })
    };

    render() {
        const {currentAccountInfo} =this.props;
        const accountInfo = currentAccountInfo.get('data');

        return (
            <div className={cx("auxiliary-modal-content")}>
                <div className={cx("aux-tab-content")}>
                    {
                        this.state.tabKey === 'company' ? (
                            <React.Fragment>
                                <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'dept'}>
                                    <TabPane
                                        tab={intl.get("home.tab.dept")}
                                        key="dept"
                                    >
                                        <Dept/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.employee")}
                                        key="employee"
                                    >
                                        <Employee/>
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        this.state.tabKey === 'order' ? (
                            <React.Fragment>
                                <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'goodsUnit'}>
                                    <TabPane
                                        tab={"单位"}
                                        key="goodsUnit"
                                    >
                                        <GoodsUnit/>
                                    </TabPane>
                                    <TabPane
                                        tab={"项目"}
                                        key="project"
                                    >
                                        <Project/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.orderType")}
                                        key="orderType"
                                    >
                                       <Order type="orderType"/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.express")}
                                        key="express"
                                    >
                                       <Express type="express"/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.wareLimit")}
                                        key="wareLimit"
                                    >
                                        <WareLimit type="wareLimit"/>
                                    </TabPane>
                                    <TabPane
                                        tab={"价格规则"}
                                        key="priceLimit"
                                    >
                                        <PriceLimt type="priceLimit"/>
                                    </TabPane>
                                    <TabPane
                                        tab={"数据精度"}
                                        disabled={accountInfo.get('comName')&&!accountInfo.get('mainUserFlag')}
                                        key="dataProgress"
                                    >
                                        <DataProgress type="dataProgress"/>
                                    </TabPane>
                                    <TabPane
                                        tab={"币种设置"}
                                        key="currency"
                                    >
                                        <MultiCurrency/>
                                    </TabPane>
                                    <TabPane
                                        tab={"交付地址"}
                                        key="address"
                                    >
                                        <Address type="address"/>
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        this.state.tabKey === 'tax' ? (
                            <React.Fragment>
                                <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'tax'}>
                                    <TabPane
                                        tab={intl.get("home.tab.tax")}
                                        key="tax"
                                    >
                                        <Bill type="bill"/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.rate")}
                                        key="rate"
                                    >
                                        <Rate type="rate"/>
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        ) : null
                    }
                    {
                        this.state.tabKey === 'production' ? (
                            <React.Fragment>
                                <Tabs destroyInactiveTabPane={true} defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'workCenter'}>
                                    <TabPane
                                        tab={"工作中心"}
                                        key="workCenter"
                                    >
                                        <WorkCenter/>
                                    </TabPane>
                                    <TabPane
                                        tab={"工序"}
                                        key="workProcedure"
                                    >
                                        <WorkProcedure/>
                                    </TabPane>
                                    <TabPane
                                        tab={"工作时间"}
                                        key="workTime"
                                    >
                                        <WorkTime/>
                                    </TabPane>
                                    <TabPane
                                        tab={"设备管理"}
                                        key="deviceManage"
                                    >
                                        <DeviceManage/>
                                    </TabPane>

                                </Tabs>
                            </React.Fragment>
                        ) : null
                    }
                    {this.state.tabKey === 'customerLv'?<CustomerLv/>:null}
                    {this.state.tabKey === 'goodsUnit'?<GoodsUnit/>:null}
                    {this.state.tabKey === 'notification'?<Notification/>:null}
                    {this.state.tabKey === 'category'?(<>
                        <Tabs destroyInactiveTabPane={true} defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'category'}>
                            <TabPane
                                tab={"物品类目"}
                                key="category"
                            >
                                <Category/>
                            </TabPane>
                            <TabPane
                                tab={"供应商分组"}
                                key="supplyField"
                            >
                                <Group type="supply"/>
                            </TabPane>
                            <TabPane
                                tab={"客户分组"}
                                key="customField"
                            >
                                <Group type="custom"/>
                            </TabPane>
                        </Tabs>
                    </>):null}
                    {this.state.tabKey === 'serial'?(
                        <React.Fragment>
                            <Tabs destroyInactiveTabPane={true} defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'orderSerial'}>
                                <TabPane
                                    tab={"单据编号"}
                                    key="orderSerial"
                                >
                                    <Serial onClose={this.props.onClose}/>
                                </TabPane>
                                <TabPane
                                    tab={"其他编号"}
                                    key="otherSerial"
                                >
                                    <OtherSerial onClose={this.props.onClose}/>
                                </TabPane>
                            </Tabs>

                        </React.Fragment>
                       ):null}
                    {
                        this.state.tabKey === 'customField' ? (
                            <div className={cx("custom-field")}>
                                <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'goods'}>
                                    <TabPane
                                        tab={'物品'}
                                        key="goods"
                                        size={'small'}
                                    >
                                        <NewCustomField
                                            type="prod"
                                            customFieldAmount={20}
                                        />
                                    </TabPane>
                                    <TabPane
                                        tab={'供应商'}
                                        key="supplier"
                                    >
                                        <CustomField type="supplier"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'客户'}
                                        key="customer"
                                    >
                                        <CustomField type="customer"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'请购单'}
                                        key="requisition"
                                    >
                                        <CustomField type="requisition"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'采购'}
                                        key="order"
                                    >
                                        <CustomField type="order"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'销售'}
                                        key="sale"
                                    >
                                        <NewCustomField  type="sale"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'报价单'}
                                        key="quotation"
                                    >
                                        <NewCustomField  type="quotation"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'入库'}
                                        key="storeIn"
                                    >
                                        <CustomField type="enter"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'出库'}
                                        key="storeOut"
                                    >
                                        <CustomField type="out"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'生产工单'}
                                        key="worksheet"
                                    >
                                        <CustomField type="worksheet"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'生产记录'}
                                        key="produce_record"
                                    >
                                        <NewCustomField type="produce_record"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'生产单'}
                                        key="produce_order"
                                    >
                                        <CustomField type="produce_order"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'BOM'}
                                        key="BOM"
                                    >
                                        <CustomField type="BOM"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'采购物品'}
                                        key="order_prod"
                                    >
                                        <CustomField type="order_prod"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'销售物品'}
                                        key="sale_prod"
                                    >
                                        <NewCustomField type="sale_prod"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'入库物品'}
                                        key="enter_prod"
                                    >
                                        <CustomField type="enter_prod"/>
                                    </TabPane>
                                    <TabPane
                                        tab={'出库物品'}
                                        key="out_prod"
                                    >
                                        <CustomField type="out_prod"/>
                                    </TabPane>
                                </Tabs>
                            </div>
                        ) : null
                    }
                    {
                        this.state.tabKey === 'income' ? (
                            <React.Fragment>
                                <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'account'}>
                                    <TabPane
                                        tab={intl.get("home.tab.account")}
                                        key="account"
                                    >
                                        <Income type="account"/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.inType")}
                                        key="inType"
                                    >
                                        <Income type="inType"/>
                                    </TabPane>
                                    <TabPane
                                        tab={intl.get("home.tab.outType")}
                                        key="outType"
                                    >
                                        <Income type="outType"/>
                                    </TabPane>
                                </Tabs>
                            </React.Fragment>
                        ) : null
                    }
                    {this.state.tabKey === 'approve'?(
                        <React.Fragment>
                            <div className={cx("top-tip")}>
                                <Tip>开启审批功能后，你需要新增审批人的账号，新建子账号并设置权限。多级审批为特色增值服务，1888元/年，<a target={"_blank"} style={{color: "blue"}} href="https://www.abiz.com/info/assistant-sfaq/60828.htm">查看详情</a> 。</Tip>
                            </div>
                            <Tabs defaultActiveKey={this.props.defaultTabKey?this.props.defaultTabKey:'approveSet'}>
                                <TabPane
                                    tab={intl.get("home.approved.title1")}
                                    key="approveSet"
                                >
                                    <Approve/>
                                </TabPane>
                                <TabPane
                                    tab={intl.get("home.approved.title2")}
                                    key="approveList"
                                >
                                    <LevelApproved close={this.props.onClose}/>
                                </TabPane>
                            </Tabs>
                        </React.Fragment>
                    ):null}
                    {this.state.tabKey === 'menu'?<Menu/>:null}
                </div>
                <div className={cx("aux-sider")}>
                    <div className={cx("aux-tit")}>
                        <Icon type="icon-setting"/>{intl.get("home.top_menu.business")}
                    </div>
                    <div className={cx("aux-tab")}>
                        <ul>
                            <li className={cx({'cur': this.state.tabKey === 'company'})}
                                onClick={this.handleTabClick.bind(this, 'company')}>
                                <Icon type="icon-dept-employee"/>{intl.get("home.top_menu.company")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'customerLv'})}
                                onClick={this.handleTabClick.bind(this, 'customerLv')}>
                                <Icon type="icon-customer-lvl"/>{intl.get("home.top_menu.customerLv")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'category'})}
                                onClick={this.handleTabClick.bind(this, 'category')}>
                                <Icon type="icon-goods-category"/>{"分类管理"}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'serial'})}
                                onClick={this.handleTabClick.bind(this, 'serial')}>
                                <Icon type="icon-receipt-code"/>{intl.get("home.top_menu.serial")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'customField'})}
                                onClick={this.handleTabClick.bind(this, 'customField')}>
                                <Icon type="icon-custom"/>{intl.get("home.top_menu.customField")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'income'})}
                                onClick={this.handleTabClick.bind(this, 'income')}>
                                <Icon type="icon-finance-choose"/>{intl.get("home.top_menu.income")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'order'})}
                                onClick={this.handleTabClick.bind(this, 'order')}>
                                <Icon type="icon-order-option"/>{intl.get("home.top_menu.order")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'tax'})}
                                onClick={this.handleTabClick.bind(this, 'tax')}>
                                <Icon type="icon-tax-option"/>{intl.get("home.top_menu.tax")}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'production'})}
                                onClick={this.handleTabClick.bind(this, 'production')}>
                                <Icon type="icon-subcontract"/>{"生产模块"}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'notification'})}
                                onClick={this.handleTabClick.bind(this, 'notification')}>
                                <Icon type="icon-message"/>{"通知设置"}
                            </li>
                            <li className={cx({'cur': this.state.tabKey === 'menu'})}
                                onClick={this.handleTabClick.bind(this, 'menu')}>
                                <Icon type="icon-app-menu"/>{"导航设置"}
                            </li>

                            <Auth option='main'>
                                {
                                    (isAuthed) => isAuthed ?(
                                        <li className={cx({'cur': this.state.tabKey === 'approve'})}
                                            onClick={this.handleTabClick.bind(this, 'approve')}>
                                            <Icon type="icon-approve"/>{intl.get("home.top_menu.approve")}
                                        </li>
                                    ):null
                                }
                            </Auth>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}


class Index extends Component {
    render() {
        return (
            <Modal
                title={null}
                visible={this.props.visible}
                onCancel={this.props.onClose}
                width={1100}
                destroyOnClose={true}
                footer={null}
                className={cx("auxiliary-modal")}
                centered
            >
                <ModalContent {...this.props} />
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});
export default withRouter(connect(mapStateToProps,null)(Index))
