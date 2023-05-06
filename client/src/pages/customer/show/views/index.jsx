import React, {Component} from 'react';
import {Modal, message, Tabs, Table, Layout, Tooltip, Select ,Button} from 'antd';

import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import {AttributeBlock} from 'components/business/attributeBlock';
import {ShowBasicBlock,ShowContacterInfo} from 'components/business/showBasicInfo';
import FileView from 'components/business/fileView';
import ContactRecord from 'pages/contactRecord/index';
import InviteModal from 'components/widgets/invite';
import {actions as customerShowActions} from 'pages/customer/add/index'
import {actions as customerIndexActions} from 'pages/customer/index'
import {actions as commonActions} from 'components/business/commonRequest/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Auth} from 'utils/authComponent';
import intl from 'react-intl-universal';
import {getYmd} from 'utils/format';

import {SaleRecord} from 'pages/sale/index'
import {OutboundRecord} from 'pages/inventory/outbound/index'
import {IncomeRecord} from 'pages/finance/income/index'
import {SaleInvoiceRecord} from 'pages/finance/saleInvoice/index'
import OrderTrack from './orderTrack';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import Fold from 'components/business/fold';
const cx = classNames.bind(styles);
import {getUrlParamValue} from 'utils/urlParam';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class customerShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addFriendVisible: false,
            orderTrackVisible: false,
            follwStatus: false,
            followStatusValue: ''
        }
    }

    getOrderTrackRef = (orderTrackRef)=>{
        this.orderTrackRef = orderTrackRef;
    };

    refresh = ()=>{
        let customerNo = this.props.match.params.id;
        this.props.asyncCustomerShow(customerNo,(data)=>{
            this.setState({
                followStatusValue: data.data.followStatus
            });
        })
    };
    componentDidMount() {
        this.refresh();
    }

    showConfirm = (customer) => {
        let _this = this;
        const ids = [customer.customerNo];
        if (customer.inService || customer.inInterchangeService) {
            confirm({
                title: intl.get('common.confirm.title'),
                content: intl.get('customer.show.content'),
                onOk() {
                    _this.props.asyncToggleCustomerInfo(ids, false, function (res) {
                        if (res.retCode == 0) {
                            message.success(intl.get('common.confirm.success'));
                        } else {
                            alert(res.retMsg);
                        }
                    });
                },
                onCancel() {
                },
            });
        } else {
            confirm({
                title: intl.get('common.confirm.title'),
                content: intl.get('customer.show.content1'),
                onOk() {
                    _this.props.asyncDeleteCustomerInfo(ids, function (res) {
                        if (res.retCode == 0) {
                            message.success(intl.get('common.confirm.success'));
                            _this.props.history.replace('/customer/');
                        } else {
                            alert(res.retMsg);
                        }
                    });
                },
                onCancel() {
                },
            });
        }
    };


    showAddFriendModal = () => {
        this.setState({
            addFriendVisible: true,
        });
    };
    hideAddFriend = () => {
        this.setState({
            addFriendVisible: false,
        });
    };
    addFriendModal = (isAbizAccountFlag) => {
        if (isAbizAccountFlag) {
            let customerNo = this.props.match.params.id;
            this.props.asyncCustomerShow(customerNo);
            message.success(intl.get('common.confirm.success'))
        } else {
            this.showAddFriendModal();
        }
    };


    operateBar = (listData, moreData) => {
        return <OpeBar data={{
            listData,
            moreData
        }}/>;
    };

    handleTabClick = (activeKey) => {
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };
    onSwitchChange = (data) => {
        if (!data.distributionFlag && !data.customerLoginName) {
            this.invite(data.customerNo);
        } else {
            let _this = this;
            let callback = function(){
                message.success(intl.get('common.confirm.success'));
                _this.refresh();
            };
            if(!data.distributionFlag){
                this.onOpenDistribute([data.customerNo],callback);
            }else{
                this.cancelDistribute([data.customerNo],callback);
            }
        }
    };
    conformDistribute = (params) => {
        let {ids, content, optionFlag,callback} = params;
        let _this = this;
        let prefix = optionFlag?'openDistribute':'cancelDistribute';
        if(callback){
            prefix = 'batch-' + prefix;
        }
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            content: content,
            okText:intl.get('common.confirm.okText'),
            cancelText:intl.get('common.confirm.cancelText'),
            okButtonProps:{
                'ga-data':prefix + '-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix + '-cancel'
            },
            onOk() {
                _this.props.asyncSetDistribute(ids, optionFlag, function(res) {
                    if (res.retCode === '0') {
                        if(callback){
                            callback()
                        }else{
                            message.success(intl.get('common.confirm.success'));
                            _this.checkRemove();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };
    cancelDistribute = (ids,callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: intl.get('customer.show.content2'),
            optionFlag: 0,
        });
    };
    onOpenDistribute = (ids,callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: intl.get('customer.show.content3'),
            optionFlag: 1
        });
    };

    invite = (customerNo) => {
        this.setState({
            curCustomerNo: customerNo
        });
        this.showAddFriendModal();
    };

    changeFollowStatus = (e) => {
        this.setState({
            follwStatus: true,
            followStatusValue: e
        });
    }

    saveFollowStatus = () =>{
        let followStatus = this.state.followStatusValue;
        let customerNo = this.props.match.params.id;
        this.props.asyncFetchFollowStatus({customerNo:customerNo,followStatus:followStatus},(data)=>{
               if(data.retCode== "0"){
                   message.success(intl.get('common.confirm.success'));
                   this.refresh();
                   this.setState({follwStatus: false})
               }else{
                   message.error(intl.get('common.confirm.error'));
               }
        })
    }

    closeFollowStatus = ()=>{

        this.setState({
            follwStatus: false,
            followStatusValue: this.objData.followStatus
        });
    }


    render() {
        const activeKey = this.props.location.hash.replace('#', '');
        let {customerInfo,currentAccountInfo} = this.props;
        customerInfo = customerInfo ? customerInfo.toJS() : {};
        let accountInfo = currentAccountInfo.get('data');
        accountInfo = accountInfo ? accountInfo.toJS() : [];

        let customerNo = this.props.match.params.id;
        //基础信息数据处理
        const objData = customerInfo.data && customerInfo.data.data || {};

        let contacterInfo = objData && objData.customerContacterList;

        this.objData = objData;

        const basicInfoColumns = intl.get('customer.show.title');

        const basicInfoData = objData && [{
            name: "客户编号",
            value: objData.displayCode
        },{
            name: intl.get('customer.show.name'),
            value: <React.Fragment>
                {objData.customerName}
                {/*{
                    objData.distributionFlag?<Tooltip
                        title={intl.get('customer.show.allow')}
                    >
                        <Icon type="icon-mall" className={cx("mall-on")}/>
                    </Tooltip>:null
                }*/}
            </React.Fragment>
        }, {
            name: "客户分组",
            value: objData.groupName
        },/*{
            name: intl.get('customer.show.contacterName'),
            value: objData.contacterName
        }, {
            name: intl.get('customer.show.telNo'),
            value: objData.telNo
        }, {
            name: intl.get('customer.show.email'),
            value: objData.email
        },*/ {
            name: intl.get('customer.show.levelName'),
            value: objData.levelName
        }, {
            name: intl.get('customer.show.customerLoginName'),
            value: objData.customerLoginName
        },{
            name: intl.get('customer.show.legalRepresentative'),
            value: objData.legalRepresentative
        }, {
            name: intl.get('customer.show.registeredAddress'),
            value: objData.registeredAddress
        }, {
            name: intl.get('customer.show.licenseNo'),
            value: objData.licenseNo
        }];

        //其他信息数据处理
        const otherInfoColumns = intl.get('customer.show.title1');
        const objTag = customerInfo.data.tags;
        let dataTagList = [];
        objTag && objTag.forEach((item, index) => {
            if (item.propName != "") {
                dataTagList.push({
                    index,
                    id: item.id,
                    mappingName: item.mappingName,
                    propName: item.propName,
                    propValue: objData["propValue" + item.mappingName.slice(-1)]
                })
            }
        });

        const otherInfoData = [];
        objData && objData.customerAddressList && objData.customerAddressList.forEach((item, index) => {
            index = index + 1;
            otherInfoData.push({
                name: intl.get('customer.show.address') + index,
                value: item.provinceText + item.cityText + item.address,
            })
        });

        dataTagList && dataTagList.forEach((item) => {
            if (item.propValue) {
                otherInfoData.push({
                    name: item.propName,
                    value: item.propValue,
                })
            }
        });

        const reMarksData = objData && [{
            name: intl.get('customer.show.remarks'),
            value: objData.remarks
        }];

        //脚注信息处理
        const footInfoClassNames = "footnote";

        const footInfoData = objData && [{
            name: intl.get('customer.show.addedLoginName'),
            value: objData.addedName || objData.addedLoginName
        }, {
            name: intl.get('customer.show.addedTime'),
            value: getYmd(objData.addedTime)
        }, {
            name: intl.get('customer.show.updatedLoginName'),
            value: objData.updatedName || objData.updatedLoginName
        }, {
            name: intl.get('customer.show.updatedTime'),
            value: getYmd(objData.updatedTime)
        }];

        let listData = [
            {
                name: 'sale',
                path: `/sale/add?customerNo=${objData.customerNo}`
            },
            {
                name: 'addFriend',
                onClick: () => {
                    this.props.asyncAddFriend({
                        type: 'customer',
                        id: objData.customerNo
                    }, (data) => {
                        if (data.retCode === '0') { //添加成功
                            this.addFriendModal(true);
                        } else if (data.retCode === '1') { //还没有百卓账号
                            this.addFriendModal(false);
                        } else {
                            alert(data.retMsg)
                        }
                    });

                }
            },
            // {
            //     label: objData.distributionFlag == 1?'禁止访问商城':'允许访问商城',
            //     name:'mall',
            //     icon: 'icon-mall',
            //     onClick: () => {
            //         this.onSwitchChange(objData);
            //     }
            // },
            {
                name: 'edit',
                module: 'customer',
                path: `/customer/modify/${objData.customerNo}?source=${getUrlParamValue('source')}&current=${getUrlParamValue('current')}`
            },
            {
                name: 'delete',
                module: 'customer',
                onClick: () => {
                    this.showConfirm(objData);
                }
            },
            {
                name: 'orderTrack',
                vipSource: 'orderTrack',
                label: '开通订单追踪',
                icon: 'icon-serial',
                onClick: () => {
                    this.setState({orderTrackVisible : true}, () => {
                        this.orderTrackRef.getTrackDetail && this.orderTrackRef.getTrackDetail();
                    });
                }
            }
        ];

        if (objData && objData.customerLoginName) {
            listData.splice(1, 1);
        }
        let moreData = [
            // {
            //     name: 'saleRecord',
            //     path: `/sale/?key=${objData.customerName}`
            // }
        ];

        return (
            <Layout>
                {/*面包屑*/}
                <div className="content-hd">
                    <Crumb data={getUrlParamValue('source') === 'mall'?[
                        {
                            url: '/mall/',
                            title: intl.get('customer.show.crumb')
                        },
                        {
                            url: '/mall/customer/',
                            title: intl.get('customer.show.crumb1')
                        },
                        {
                            title: intl.get('customer.show.crumb2')
                        }
                    ]:[
                        {
                            url: '/customer/',
                            title: intl.get('customer.show.crumb3')
                        },
                        {
                            title: intl.get('customer.show.crumb2')
                        }
                    ]}/>
                </div>

                <div className="detail-content">
                    {this.operateBar(listData, moreData)}
                    <div className="detail-content-bd">
                        <Tabs
                        onTabClick={this.handleTabClick}
                        defaultActiveKey={activeKey}
                        className="record-tab"
                    >
                        <TabPane tab={intl.get('customer.show.title2')} key="customerInfo">
                            <ShowBasicBlock data={basicInfoData} title={basicInfoColumns}/>
                            <ShowContacterInfo type={"custom"} data={contacterInfo||[]} title={"联系人信息"}/>
                            <Auth
                                module="customer"
                                option="modify"
                            >
                                {
                                    (isAuthed) =>
                                        isAuthed ? (
                                            <Fold title={intl.get('customer.show.title3')}>
                                                <div style={{display: "inline-block"}}>
                                                    {intl.get('customer.show.title4')}：<Select value={this.state.followStatusValue} onChange={this.changeFollowStatus} style={{width: 120}}>
                                                        <Select.Option value="初访">{intl.get('customer.show.option1')}</Select.Option>
                                                        <Select.Option value="意向">{intl.get('customer.show.option2')}</Select.Option>
                                                        <Select.Option value="报价">{intl.get('customer.show.option3')}</Select.Option>
                                                        <Select.Option value="成交">{intl.get('customer.show.option4')}</Select.Option>
                                                        <Select.Option value="搁置">{intl.get('customer.show.option5')}</Select.Option>
                                                    </Select>
                                                    <span style={{display: this.state.follwStatus ? 'inline-block' : 'none'}} className={cx("follow-status")}>
                                                        <Button type={"primary"} onClick={()=>this.saveFollowStatus()}>{intl.get('common.confirm.save')}</Button>
                                                        <Button type={"default"} onClick={this.closeFollowStatus}>{intl.get('common.confirm.cancelText')}</Button>
                                                    </span>
                                                </div>

                                                <div style={{display: "inline-block",marginLeft: '25px'}}>
                                                    {intl.get('customer.show.deptEmployeeName')}: {objData.deptEmployeeName}
                                                </div>

                                            </Fold>
                                        ) :
                                            <ShowBasicBlock data={[{name:intl.get('customer.show.followStatus'),value:objData.followStatus}]} title={intl.get('customer.show.title3')}/>
                                }


                            </Auth>
                            <ShowBasicBlock data={otherInfoData} title={otherInfoColumns}/>
                            <ShowBasicBlock data={reMarksData}/>
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    fontSize: '14px',
                                    color: '#222',
                                    marginRight: '10px',
                                    lineHeight: '30px',
                                    marginBottom: '10px'
                                }}>{intl.get('customer.show.attr')}：
                                </div>
                                <div style={{display: 'inline-block', lineHeight: '30px'}}>
                                    {
                                        objData.fileInfo && objData.fileInfo.map((file) => {
                                            return (
                                                <div key={file.fileId}>
                                                    <a style={{color: '#499fff'}}
                                                       href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                                    >
                                                        {file.fileName}
                                                    </a>
                                                    <FileView fileId={file.fileId} fileName={file.fileName}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <AttributeBlock data={footInfoData} customClassName={footInfoClassNames}/>




                            <InviteModal
                                title={intl.get('common.confirm.title')}
                                inviteVisible={this.state.addFriendVisible}
                                onCancel={this.hideAddFriend}
                                width={800}
                                type={"1"}
                                id={objData.customerNo}
                                desc={intl.get('customer.show.content4')}
                            />
                        </TabPane>
                        <TabPane tab={intl.get('customer.show.linkRecord')} key="linkRecord">
                            <ContactRecord customerNo={customerNo} customerName={objData.customerName}/>
                        </TabPane>
                        <TabPane tab={intl.get('customer.show.saleRecord')} key="saleRecord">
                            <SaleRecord module={"sale"} option={"show"}  type="customer" recordFor={objData.customerNo} noAuthRender={<span style={{paddingTop: '30px'}}>暂无权限，请联系管理员开通。</span>}/>
                        </TabPane>
                        <TabPane tab={intl.get('customer.show.outboundRecord')} key="outboundRecord">
                            <OutboundRecord module={"outbound"} option={"show"}  type="customer" recordFor={objData.customerNo} noAuthRender={<span style={{paddingTop: '30px'}}>暂无权限，请联系管理员开通。</span>}/>
                        </TabPane>
                        <TabPane tab={intl.get('customer.show.saleInvoiceRecord')} key="saleInvoiceRecord">
                            <SaleInvoiceRecord module={"saleInvoice"} option={"show"} type='customer' recordFor={objData.customerName} noAuthRender={<span style={{paddingTop: '30px'}}>暂无权限，请联系管理员开通。</span>}/>
                        </TabPane>
                        <TabPane tab={intl.get('customer.show.incomeRecord')} key="incomeRecord">
                            <IncomeRecord  module={"income"} option={"show"}  type='customer' recordFor={objData.customerName} noAuthRender={<span style={{paddingTop: '30px'}}>暂无权限，请联系管理员开通。</span>}/>
                        </TabPane>
                    </Tabs>
                    </div>
                </div>

                <Modal
                    className={"list-pop"}
                    title={'开通订单追踪'}
                    visible={this.state.orderTrackVisible}
                    footer={null}
                    // destroyOnClose={true}
                    onCancel={() => this.setState({orderTrackVisible : false})}
                    width={800}
                >
                    <OrderTrack
                        getRef={this.getOrderTrackRef}
                        customerNo={objData.customerNo}
                    />
                </Modal>

            </Layout>
        )
    }
}


const mapStateToProps = (state) => ({
    customerInfo: state.getIn(['customerEdit', 'customerInfo']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCustomerShow: customerShowActions.asyncShowCustomer,
        asyncDeleteCustomerInfo: customerIndexActions.asyncDeleteCustomerInfo,
        asyncToggleCustomerInfo: customerIndexActions.asyncToggleCustomerInfo,
        asyncFetchFollowStatus: customerShowActions.asyncFetchFollowStatus,
        asyncSetDistribute: customerIndexActions.asyncSetDistribute,
        asyncAddFriend: commonActions.asyncAddFriend
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(customerShow)

