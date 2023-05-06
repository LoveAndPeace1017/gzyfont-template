import React, {Component} from 'react';
import {Layout, message, Modal, Tabs, Tooltip} from 'antd';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import {AttributeBlock} from 'components/business/attributeBlock';
import {ShowBasicBlock,ShowContacterInfo} from 'components/business/showBasicInfo';
import FileView from 'components/business/fileView';
import Icon from 'components/widgets/icon';
import {actions as supplierInfoActions} from 'pages/supplier/add'
import {actions as supplierIndexActions} from 'pages/supplier/index'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {getYmd} from 'utils/format';

import {ExpendRecord} from 'pages/finance/expend/index'
import {InboundRecord} from 'pages/inventory/inbound/index'
import {InvoiceRecord} from 'pages/finance/invoice/index'
import {PurchaseRecord} from 'pages/purchase/index'

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

const cx = classNames.bind(styles);

class supplierInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {addFriendVisible: false}
    }

    componentDidMount() {
        let supplierNo = this.props.match.params.id;
        this.props.asyncShowSupplier(supplierNo)
    }

    showConfirm = (supplier) => {
        let _this = this;
        const ids = [supplier.code];
        if (supplier.inService) {
            confirm({
                title: intl.get('common.confirm.title'),
                content: intl.get("supplier.show.content"),
                onOk() {
                    _this.props.asyncToggleSupplierInfo(ids, false, function (res) {
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
                content: intl.get("supplier.show.content1"),
                onOk() {
                    _this.props.asyncDeleteSupplierInfo(ids, function (res) {
                        if (res.retCode == 0) {
                            message.success(intl.get('common.confirm.success'));
                            _this.props.history.replace('/supplier/');
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

    render() {
        const activeKey = this.props.location.hash.replace('#', '');
        let {supplierInfo} = this.props;
        supplierInfo = supplierInfo ? supplierInfo.toJS() : {};

        //基础信息数据处理
        const objData = supplierInfo.data.data || {};
        const objTag = supplierInfo.data.tags || [];
        const basicInfoColumns = intl.get("supplier.show.title");

        let contacterInfo = objData && objData.supplierContacterList;

        const basicInfoData = objData && [
            {
                name: "供应商编号",
                value: objData.displayCode
            },{
            name: intl.get("supplier.show.name"),
            value: <React.Fragment>
                {objData.name}
                {/*{
                    objData.mallAuth?<Tooltip
                        title={intl.get("supplier.show.allow")}
                    >
                        <Icon type="icon-mall" className={cx("mall-on")}/>
                    </Tooltip>:null
                }*/}

            </React.Fragment>
        },
        {
            name: "供应商分组",
            value: objData.groupName
         },
        /*{
            name: intl.get("supplier.show.contacterName"),
            value: objData.contacterName
        }, {
            name: intl.get("supplier.show.mobile"),
            value: objData.mobile
        }, {
            name: intl.get("supplier.show.email"),
            value: objData.email
        }, */{
            name: intl.get("supplier.show.supplierLoginName"),
            value: objData.supplierLoginName
        },{
            name: intl.get("supplier.show.legalRepresentative"),
            value: objData.legalRepresentative
        }, {
            name: intl.get("supplier.show.registeredAddress"),
            value: objData.registeredAddress
        }, {
            name: intl.get("supplier.show.licenseNo"),
            value: objData.licenseNo
        }];

        //其他信息数据处理
        const otherInfoColumns = intl.get("supplier.show.title1");

        let dataTagList = [];
        objTag && objTag.forEach((item, index) => {
            if (item.propName != "") {
                dataTagList.push({
                    index,
                    id: item.id,
                    mappingName: item.mappingName,
                    propName: item.propName,
                    propValue: objData["propertyValue" + item.mappingName.slice(-1)]
                })
            }
        });

        const otherInfoData = [];
        dataTagList.forEach((item) => {
            otherInfoData.push({
                name: item.propName,
                value: item.propValue,
            })
        });

        const reMarksData = objData && [{
            name: intl.get("supplier.show.remarks"),
            value: objData.remarks
        }];

        //脚注信息处理
        const footInfoClassNames = "footnote";

        const footInfoData = objData && [{
            name: intl.get("supplier.show.addedLoginName"),
            value: objData.addedName || objData.addedLoginName
        }, {
            name: intl.get("supplier.show.addedTime"),
            value: getYmd(objData.addedTime)
        }, {
            name: intl.get("supplier.show.updatedLoginName"),
            value: objData.updatedName || objData.updatedLoginName
        }, {
            name: intl.get("supplier.show.updatedTime"),
            value: getYmd(objData.updatedTime)
        }];

        let listData = [
            {
                name: 'order',
                path: `/purchase/add?supplierNo=${objData.code}`
            },
            {
                name: 'edit',
                module: 'supplier',
                path: `/supplier/modify/${objData.code}`
            },
            {
                name: 'delete',
                module: 'supplier',
                onClick: () => {
                    this.showConfirm(objData);
                }
            },
        ];
        /*if(objData && objData.mallAuth){
            listData.push({
                name: 'shop',
                module: 'supplier',
                path: `/onlineOrder/${objData.code}/customerIndex`
            });
        }*/
        if (objData && objData.supplierLoginName) {
            listData.splice(1, 1);
        }
        // let moreData = [
        //     {
        //         name: 'orderRecord',
        //         path: `/purchase/?key=${objData.name}`
        //     },
        //     {
        //         name: 'store',
        //         path: `/inventory/inbound/?key=${objData.name}`
        //     }
        // ];
        //
        //
        // const purchaseRecordColumns = [{
        //     title: '序号',
        //     dataIndex: 'serial'
        // }, {
        //     title: '采购单号',
        //     dataIndex: 'displayBillNo'
        // }, {
        //     title: '采购日期',
        //     dataIndex: 'purchaseOrderDate'
        // }, {
        //     title: '交付日期',
        //     dataIndex: 'deliveryDeadlineDate'
        // }, {
        //     title: '采购总金额',
        //     dataIndex: 'aggregateAmount'
        // }, {
        //     title: '采购员',
        //     dataIndex: 'purchaseContacterName'
        // }];
        //
        // const purchaseRecordDataSource = [];

        return (
            <Layout>
                {/*面包屑*/}
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/supplier/index',
                            title: intl.get("supplier.show.crumb")
                        },
                        {
                            title: intl.get("supplier.show.crumb1")
                        }

                    ]}/>
                </div>

                <div className="detail-content">
                    {this.operateBar(listData, [])}
                    <div className="detail-content-bd">
                        <Tabs
                        onTabClick={this.handleTabClick}
                        defaultActiveKey={activeKey}
                        className="record-tab"
                    >
                        <TabPane tab={intl.get("supplier.show.title3")} key="companyInfo">
                            <ShowBasicBlock data={basicInfoData} title={basicInfoColumns}/>
                            <ShowContacterInfo data={contacterInfo||[]} title={"联系人信息"}/>
                            <ShowBasicBlock data={otherInfoData} title={otherInfoColumns}/>
                            <ShowBasicBlock data={reMarksData}/>
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    verticalAlign: 'top',
                                    fontSize: '14px',
                                    color: '#333',
                                    marginRight: '10px',
                                    lineHeight: '30px',
                                    marginBottom: '10px'
                                }}>{intl.get("supplier.show.attr")}：
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

                        </TabPane>
                        <TabPane tab={intl.get("supplier.show.purchaseRecord")} key="purchaseRecord">
                            <PurchaseRecord module={"purchase"} option={"show"} type="supplier"
                                            recordFor={this.props.match.params.id}
                                            noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("supplier.show.noAuth")}</span>}/>
                        </TabPane>
                        <TabPane tab={intl.get("supplier.show.inboundRecord")} key="inboundRecord">
                            <InboundRecord module={"inbound"} option={"show"} type="supplier"
                                           recordFor={this.props.match.params.id}
                                           noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("supplier.show.noAuth")}</span>}/>
                        </TabPane>
                        <TabPane tab={intl.get("supplier.show.invoiceRecord")} key="invoiceRecord">
                            {objData.name &&
                            <InvoiceRecord module={"invoice"} option={"show"} type="supplier" recordFor={objData.name}
                                           noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("supplier.show.noAuth")}</span>}/>}
                        </TabPane>
                        <TabPane tab={intl.get("supplier.show.expendRecord")} key="expendRecord">
                            {objData.name &&
                            <ExpendRecord module={"expend"} option={"show"} type="supplier" recordFor={objData.name}
                                          noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("supplier.show.noAuth")}</span>}/>}
                        </TabPane>
                    </Tabs>
                    </div>
                </div>

            </Layout>
        )
    }
}


const mapStateToProps = (state) => ({
    supplierInfo: state.getIn(['supplierEdit', 'supplierInfo']),

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncShowSupplier: supplierInfoActions.asyncShowSupplier,
        asyncDeleteSupplierInfo: supplierIndexActions.asyncDeleteSupplierInfo,
        asyncToggleSupplierInfo: supplierIndexActions.asyncToggleSupplierInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(supplierInfo)

