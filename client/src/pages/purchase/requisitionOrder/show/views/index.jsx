import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {Modal, message, Alert, Layout,Button} from 'antd';
import LogModalTable from 'components/business/logModalTable';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import FileView from 'components/business/fileView';
import PrintStatus from 'components/business/printStatus';
import {AttributeBlock} from 'components/business/attributeBlock';
import {ShowBasicBlock} from 'components/business/showBasicInfo';
import OperatorLog from 'components/business/operatorLog';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import ProductList from './productList';
import {asyncRequisitionOrderShow,asyncOperationLog} from '../actions';
import {asyncDeleteRequisitionOrderInfo,asyncPreDeleteRequisitionOrderInfo} from '../../index/actions'
import {actions as vipOpeActions,withVipWrap} from "components/business/vipOpe";
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,ApproveProcess,
    SelectApproveItem, withApprove, BACKEND_TYPES} from 'components/business/approve';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import IsVipJudge from 'components/business/isVipJudge';
import {asyncFetchSerialNumQueryList} from "pages/goods/serialNumQuery/index/actions";
import {detailPage} from  'components/layout/listPage';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getYmd} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {formatCurrency} from 'utils/format';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import { ExclamationCircleOutlined } from '@ant-design/icons';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import PrintArea from "../../../../../components/widgets/printArea/views";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    requisitionOrderDetail: state.getIn(['requisitionOrderShow', 'requisitionOrderDetail']),
    fetchLogInfo: state.getIn(['requisitionOrderShow', 'fetchLogInfo']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncRequisitionOrderShow,
        asyncOperationLog,
        asyncDeleteRequisitionOrderInfo, //删除请购信息
        asyncPreDeleteRequisitionOrderInfo, //删除前的判断
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOperateApprove: approveActions.asyncOperateApprove,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
@withApprove
export default class supplierShow extends detailPage{
    constructor(props) {
        super(props);
        this.state = {
            operationLogVisible: false,  // 操作日志
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 1,
            approveStatus: 0,
            approveBtnFlag: false,
            approveRevertBtnFlag: false
        }
    }

    componentDidMount () {
        //获取Vip信息
        this.props.asyncFetchVipService();
        this.loadData();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id !== this.props.match.params.id){
            this.props.asyncRequisitionOrderShow(nextProps.match.params.id);
        }
    }

    loadData=(nextId)=>{
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncRequisitionOrderShow(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if(res.retCode == "0"){
                    this.setState({
                        approveModuleFlag:res.approveModuleFlag,
                        approveStatus: res.data.approveStatus
                    })
                }
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("sale.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            });
        }
    };

    showConfirm = (ids) => {
        let self = this;
        this.props.asyncPreDeleteRequisitionOrderInfo({ids:[ids]},(data)=>{
            let flag = data.flag;
            let content = flag?(
                <div>
                    <p>存在与该单据关联的其他记录，是否确定删除？</p>
                </div>
            ):(<div>
                <p>删除单据后无法恢复，确定删除吗?</p>
            </div>);
            Modal.confirm({
                title: intl.get("inbound.show.index.warningTip"),
                okText: intl.get("inbound.show.index.okText"),
                cancelText: intl.get("inbound.show.index.cancelText"),
                content: content,
                onOk() {
                    return new Promise((resolve, reject) => {
                        self.props.asyncDeleteRequisitionOrderInfo({ids:[ids]}, function (res) {
                            resolve();
                            if (res.retCode == 0) {
                                message.success(intl.get("inbound.show.index.operateSuccessMessage"));
                                self.props.history.replace('/purchase/requisitionOrder/');
                            } else {
                                message.error(res.retMsg);
                            }
                        })
                    }).catch(() => {
                        //alert("操作失败")
                    })
                },
                onCancel() {
                },
            });
        });

    };

    operateBar = () => {
        const {match} = this.props;
        const id = match.params.id;
        //判断删除和修改按钮是否可以点击
        //逻辑：已审批：修改、删除按钮不可用
        let { requisitionOrderDetail } = this.props;
        requisitionOrderDetail = requisitionOrderDetail?requisitionOrderDetail.toJS():{};

        console.log(requisitionOrderDetail,'requisitionOrderDetail');
        //基础信息数据处理
        if(!requisitionOrderDetail.data || requisitionOrderDetail.data.length===0) {
            return null;
        } // ***
        const objData = requisitionOrderDetail && requisitionOrderDetail.data;
        let approveModuleFlag = objData && objData.approveModuleFlag;
        let billNo = objData.data && objData.data.billNo;
        //recId用于删除数据
        let recId = objData.data && objData.data.recId;
        let infoData = (objData && objData.data) || {};
        infoData.approveModuleFlag = approveModuleFlag;
        let approveTask = objData && objData.approveTask;

        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled,
            requisitionPurchaseApproveDisabled,
            requisitionOutWareApproveDisabled
        } = disabledGroup;

        let listData =  [
            {
                name: 'edit',
                module: 'requisition',
                disabled: !modifyApproveDisabled,
                path:`/purchase/requisitionOrder/modify/${id}`
            },
            {
                name: 'delete',
                module: 'requisition',
                disabled: !deleteApproveDisabled,
                onClick: () => {
                    this.showConfirm(recId);
                }
            },
            {
                name: 'copy',
                module: 'requisition',
                path:`/purchase/requisitionOrder/copy/${id}`
            },
            {
                name: 'interchangeLog',
                label: intl.get("inbound.show.index.operateLog"),
                hidden: !operateLogApproveDisabled,
                icon: 'icon-operation-log',
                onClick: () => {
                    this.props.asyncOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            },
            {
                name: 'requisitionPurchase',
                module: 'requisition',
                hidden: !requisitionPurchaseApproveDisabled,
                onClick: () => {
                    //跳转到采购新增页
                    this.props.history.push(`/purchase/add?requisitionOrderNo=${billNo}`);
                }
            },
            {
                name: 'print',
                displayBillNo: billNo,
                templateType: 'RequisitionOrder'
            },
            {
                name: 'export',
                module: 'purchase',
                label: intl.get("purchase.show.index.export"),
                href: `${BASE_URL}/file/download?url=/requisition/excel/export/${billNo}`,
                displayBillNo: billNo,
                templateType: 'RequisitionOrder'
            },
            {
                name: 'requisitionOutbound',
                module: 'requisition',
                hidden: !requisitionOutWareApproveDisabled,
                onClick: () => {
                    //跳转到出库-内部领用新增页
                    this.props.history.push(`/inventory/outbound/add?outType=0&requisitionOrderNo=${billNo}`);
                }
            },
            {
                name: 'approveSubmit',  //提交审批流
                label: intl.get("components.approve.approveSubmit"),
                icon: 'icon-submit',
                module: 'requisition',
                hidden: !approveSubmit,
                onClick: () => {
                    this.submitApprove(billNo);
                }
            },{
                name: 'approveRevert',  //撤回审批流
                label: intl.get("components.approve.approveRevert"),
                icon: 'icon-cancel-copy',
                module: 'requisition',
                disabled: this.state.approveRevertBtnFlag,
                hidden: !approveRevert,
                onClick: async() => {
                    let _this = this;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        content: '确认撤回审批么？',
                        onOk() {
                            _this.asyncApproveOperate({operate: 3, type: BACKEND_TYPES.requisition,billNo}, _this.loadData);
                        }
                    });

                }
            }
        ];

        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listData,
                    moreData: []
                }}/>
                <div className={cx("status-img")}>
                    {
                        approvePass && (  // 审批通过按钮
                            <Button className={cx("approve-btn")} disabled={this.state.approveBtnFlag}  type={"primary"} onClick={()=>{
                                this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.requisition,billNo}, this.loadData);
                            }}>
                                 {intl.get("components.approve.pass")}
                            </Button>
                        )
                    }

                    {
                        approveReject && (  // 审批驳回按钮
                            <RejectApprove
                                okCallback={this.loadData}
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.requisition}
                                render={() => (
                                    <Button className={cx("approve-btn")} style={{'marginLeft': '10px'}}
                                            type={"primary"}
                                            okCallback={this.loadData}
                                    >{intl.get("components.approve.reject")}</Button>
                                )}
                            />
                        )
                    }
                </div>
            </React.Fragment>
        )
    };

    submitApprove = (billNo)=>{
        let {approveModuleFlag, approveStatus} = this.state;
        this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
            if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.requisition, billNo}, this.loadData);
            } else {
                this.openModal('selectApprove'); // 否则打开选择审批流弹层
            }
        });
    }

    requisitionOrderProductList = () => {
        const {requisitionOrderDetail} = this.props;
        const prodList = requisitionOrderDetail && requisitionOrderDetail.getIn(['data', 'data', 'prodList']);
        const prodDataTags = requisitionOrderDetail && requisitionOrderDetail.getIn(['data', 'prodDataTags']) && requisitionOrderDetail.getIn(['data', 'prodDataTags']).toJS();

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        let data = [];
        prodList && prodList.map((item, index) => {
            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值

            let items = {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                requisitionQuantity: fixedDecimal(prodItem.requisitionQuantity, quantityDecimalNum),
                purchaseQuantity: fixedDecimal(prodItem.purchaseQuantity, quantityDecimalNum),
                toPurchaseQuantity: fixedDecimal(prodItem.toPurchaseQuantity, quantityDecimalNum),
                enterQuantity: fixedDecimal(prodItem.enterQuantity, quantityDecimalNum),
                deliveryDeadlineDate: prodItem.deliveryDeadlineDate && moment(prodItem.deliveryDeadlineDate).format('YYYY-MM-DD'),
            };
            data.push(items);
        });
        return (
            <ProductList productList={data}
                         prodDataTags={prodDataTags}/>
        )
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };
    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
        const data = logInfo && logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedLoginName'),
                operation: item.get('operation'),
                operateTime: getYmd(item.get('operatedTime'))
            }
        });

        return (
            <LogModalTable title={intl.get("inbound.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    resetDefaultFields = ()=>{
        let billNo = this.props.match.params.id;
        this.props.asyncRequisitionOrderShow(billNo);
    };

    render(){
        let { requisitionOrderDetail } = this.props;
        const listFields = requisitionOrderDetail && requisitionOrderDetail.getIn(['data', 'listFields']);
        requisitionOrderDetail = requisitionOrderDetail?requisitionOrderDetail.toJS():{};
        //基础信息数据处理
        const objData = requisitionOrderDetail && requisitionOrderDetail.data.data;
        const objData1 = requisitionOrderDetail && requisitionOrderDetail.data;
        let billNo =  objData && objData.billNo;
        let printStatus = objData && objData.printState;
        let approveStatus = objData1.data && objData1.data.approveStatus; //***
        const processData =  objData1 && objData1.flowState;
        //approveFlag 1是开启，0是关闭
        let approveModuleFlag = objData1.approveModuleFlag;
        const tags = requisitionOrderDetail && requisitionOrderDetail.data.dataTags;

        const basicInfoData = objData && [{
            name: "请购单号",
            value: objData.displayBillNo,
            highlight: true
        },{
            name: "请购日期",
            value: moment(objData.requestDate).format("YYYY-MM-DD")
        },{
            name: "请购部门",
            value: objData.departmentName
        },{
            name: "请购人",
            value: objData.employeeName
        },{
            name: "采购状态",
            value: objData.purchaseStatus === "0" ? '未采购': (objData.purchaseStatus === "1"?"部分采购":"已采购")
        }];

        let otherInfoData = objData && [{
            name: "项目",
            value: objData.projectName
        }];

        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                otherInfoData.push({
                    name: propName,
                    value: objData.propertyValues && objData.propertyValues[`property_value${propertyIndex}`] || ""
                })
            }
        });

        otherInfoData = otherInfoData && otherInfoData.concat([ {
            name: "请购说明",
            value: objData.requestDesc
        }]);

        return(
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: "采购"
                        },
                        {
                            url: '/purchase/requisitionOrder/',
                            title: "请购单列表"
                        },
                        {
                            title: "详情页"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'requisition'}
                        />
                    </div>
                    <div className={cx("float-right")}>
                        <IsVipJudge templateType={"RequisitionOrder"}/>
                    </div>
                </div>

                <div className={"detail-content"} style={{position:"relative"}}>
                    {this.operateBar()}
                    <PrintArea>
                        <div className={cx("detail-content-bd")} style={{position:"relative"}}>
                            <div className={"detail-main-attr cf"} style={{padding:"24px 5px"}}>
                                {
                                    (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                                }
                                <AttributeBlock data={basicInfoData}/>
                            </div>
                            {
                                approveModuleFlag == 1 && (
                                    <div className={cx("status-img-lst")}>
                                        <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                    </div>
                                )
                            }
                            {this.requisitionOrderProductList()}
                            <div className="detail-sub-attr">
                                <AttributeBlock data={otherInfoData}/>
                                <div>
                                    <div className={cx("file-list")}>附件：</div>
                                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                                        {
                                            objData && objData.fileInfo && objData.fileInfo.map((file) => {
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
                            </div>

                            <OperatorLog logInfo={{
                                creator: objData && (objData.addedName || objData.addedLoginName),
                                createDate: objData && getYmd(objData.addedTime),
                                lastModifier: objData && (objData.updatedName || objData.updatedLoginName),
                                lastModifyDate: objData && getYmd(objData.updatedTime),
                                approveModuleFlag: approveModuleFlag,
                                approvedLoginName: objData && objData.approvedLoginName,
                                approvedTime: objData && getYmd(objData.approvedTime),
                            }}/>
                            <ApproveProcess data={processData} approveStatus={approveStatus}/>
                        </div>
                    </PrintArea>
                    {this.operationLog()}
                    <SelectApproveItem
                        onClose={this.extendApproveCancelModal}
                        onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.requisition,this.loadData)}}
                        show={this.state.selectApprove}
                        type={BACKEND_TYPES.requisition}
                    />
                </div>
            </Layout>
        )
    }
}


