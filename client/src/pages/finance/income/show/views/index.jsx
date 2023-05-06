import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import PageTurnBtn from 'components/business/pageTurnBtn';
import {Layout, Modal, Row, Col, Spin, message, Table, Button} from 'antd';
import {asyncFetchIncomeById} from 'pages/finance/income/add/actions';
import {asyncDeleteIncomeInfo} from 'pages/finance/income/index/actions';
import OpeBar from 'components/business/opeBar';
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import FileView from 'components/business/fileView';
import {AttributeInfo} from 'components/business/attributeBlock';
import OperatorLog from 'components/business/operatorLog';
import {formatCurrency, removeCurrency} from 'utils/format';
import {getYmd} from 'utils/format';
import {getCookie} from 'utils/cookie';
import PrintArea from "../../../../../components/widgets/printArea/views";
import LogModalTable from 'components/business/logModalTable';
import {asyncFetchOperationLog} from '../actions';
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,ApproveProcess,
    SelectApproveItem, withApprove, BACKEND_TYPES} from 'components/business/approve';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {detailPage} from  'components/layout/listPage';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import { ExclamationCircleOutlined } from '@ant-design/icons';
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    incomeInfo: state.getIn(['financeIncomeAdd', 'incomeInfo']),
    fetchLogInfo: state.getIn(['saleAdd', 'fetchLogInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchIncomeById,
        asyncDeleteIncomeInfo,
        asyncFetchOperationLog,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOperateApprove: approveActions.asyncOperateApprove,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withApprove
export default class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {
            selectModalVisible: true,
            operationLogVisible: false,  // 操作日志
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 1,
            approveStatus: 0,
            //控制重复点击按钮
            approveBtnFlag: false,
            approveRevertBtnFlag: false
        }
    }

    componentDidMount() {
        this.loadData()
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            let id = nextProps.match.params.id;
            this.props.asyncFetchIncomeById(id, (res) => {
                let errorMsg = res.get('retCode') != '0' && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("income.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    }

    componentWillUnmount() {
    }

    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;
        Modal.confirm({
            title: intl.get("income.show.index.warningTip"),
            okText: intl.get("income.show.index.okText"),
            cancelText: intl.get("income.show.index.cancelText"),
            content: intl.get("income.show.index.deleteContent"),
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteIncomeInfo([id], (res) => {
                        resolve();

                        if (res.retCode == 0) {
                            message.success(intl.get("income.show.index.deleteSuccessMessage"));
                            self.props.history.replace('/finance/income/')
                        } else {
                            Modal.error({
                                title: intl.get("income.show.index.warningTip"),
                                content: res.retMsg
                            });
                        }
                    });
                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    getInfo() {
        const {incomeInfo} = this.props;
        return {
            info: incomeInfo && incomeInfo.getIn(['data', 'data', 0]),
            approveModuleFlag: incomeInfo && incomeInfo.getIn(['data', 'approveModuleFlag']),
            approveTask: incomeInfo && incomeInfo.getIn(['data', 'approveTask'])
        };
    }

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchIncomeById(id, (res) => {
                let errorMsg = res.get('retCode') != 0 && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("income.show.index.warningTip"),
                        content: errorMsg
                    });
                }
                if(res.get('retCode') == "0"){
                    let data = res.get('data');
                    this.setState({
                        approveModuleFlag:res.get('approveModuleFlag'),
                        approveStatus:  data && (data.size > 0) && data.getIn([0, 'approveStatus'])
                    })
                }
            });
        }
    };

    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
        const data = logInfo ? logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedLoginName'),
                operation: item.get('operation'),
                operateTime: getYmd(item.get('operatedTime'))
            }
        }) : [];

        return (
            <LogModalTable title={intl.get("sale.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    operateBar = () => {
        const {info, approveModuleFlag,approveTask} = this.getInfo();
        if (!info) {
            return null;
        }
        const {match} = this.props;
        const id = match.params.id;
        const updatedTime =info.get('updatedTime'); //审批更新时间
        const billNo = info.get('billNo');
        console.log(billNo,'billNo');
        // ****
        let infoData = info&&info.toJS();
        infoData.approveModuleFlag = approveModuleFlag;
        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled
        } = disabledGroup;
        // ***
        let listData = [{
            name: 'edit',
            module: 'income',
            disabled: !modifyApproveDisabled,
            path: `/finance/income/edit/${id}`
        }, {
            name: 'delete',
            module: 'income',
            disabled: !deleteApproveDisabled,
            onClick: () => {
                this.showConfirm();
            }
        }, {
            name: 'copy',
            module: 'income',
            path: `/finance/income/copy/${id}`
        }, {
            name: 'print',
            module: 'income'
        }, {
            name: 'interchangeLog',
            label: intl.get("sale.show.index.operateLog"),
            icon: 'icon-operation-log',
            module: 'income',
            hidden: !operateLogApproveDisabled,
            onClick: () => {
                this.props.asyncFetchOperationLog(billNo);
                this.openModal('operationLogVisible');
            }
        },{
            name: 'approveSubmit',  //提交审批流
            label: intl.get("components.approve.approveSubmit"),
            icon: 'icon-submit',
            module: 'income',
            hidden: !approveSubmit,
            onClick: () => {
                let {approveModuleFlag, approveStatus} = this.state;
                this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
                    if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                        this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.income, billNo}, this.loadData);
                    } else {
                        this.openModal('selectApprove'); // 否则打开选择审批流弹层
                    }
                });
            }
        },{
            name: 'approveRevert',  //撤回审批流
            label: intl.get("components.approve.approveRevert"),
            icon: 'icon-cancel-copy',
            disabled: this.state.approveRevertBtnFlag,
            module: 'income',
            hidden: !approveRevert,
            onClick: () => {
                let _this = this;
                Modal.confirm({
                    title: '提示',
                    icon: <ExclamationCircleOutlined />,
                    content: '确认撤回审批么？',
                    onOk() {
                        _this.asyncApproveOperate({operate: 3, type:BACKEND_TYPES.income,billNo}, _this.loadData);
                    }
                });

            }
        }];
        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listData,
                    moreData: []
                }}/>
                <div className={cx("status-btn")}>
                    {
                        approvePass && (  // 审批通过按钮
                            <Button className={cx("approve-btn")}
                                    disabled={this.state.approveBtnFlag}
                                    type={"primary"}
                                    onClick={() => this.asyncApproveOperate({approveTask,operate: 4,type:BACKEND_TYPES.income,billNo}, this.loadData)}
                            >{intl.get("components.approve.pass")}</Button>
                        )
                    }
                    {
                        approveReject && (  // 审批驳回按钮
                            <RejectApprove
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.income}
                                okCallback={this.loadData}
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

    render() {
        let currencyVipFlag = getCookie("currencyVipFlag");
        const {incomeInfo} = this.props;
        const data = incomeInfo.getIn(['data', 'data']);
        const totalAmount = incomeInfo.getIn(['data', 'totalAmount']);
        const totalCurrencyAmount = incomeInfo.getIn(['data', 'totalCurrencyAmount']);
        const approveStatus = (data && data.size > 0) ? data.getIn([0, 'approveStatus']) : 0;
        const approveModuleFlag = incomeInfo.getIn(['data', 'approveModuleFlag']);
        const processData =  incomeInfo.getIn(['data', 'flowState']) && incomeInfo.getIn(['data', 'flowState']).toJS();
        const billNo = data && (data.size > 0) && data.getIn([0, 'billNo']);
        let renderContent = null;
        if (incomeInfo.get("isFetching")) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (data) {
            const {match} = this.props;
            const id = match.params.id;
            const colStyle = {paddingTop: 20, paddingBottom: 20};

            let columns = [
                {
                    title: intl.get("income.show.index.serial"),
                    dataIndex: 'serial',
                    className: 'g-id',
                },
                {
                    title: intl.get("income.show.index.displayBillNo"),
                    dataIndex: 'displayBillNo',
                    className: 'g-serial',
                    render: (text, record)=><Link to={`/sale/show/${record.bindBillNo}`}>{text}</Link>
                },
                {
                    title: intl.get("income.show.index.aggregateAmount"),
                    dataIndex: 'aggregateAmount',
                    className: 'g-amount',
                    render: (text) => formatCurrency(text)
                },
                {
                    title: intl.get("income.show.index.amount"),
                    dataIndex: 'damount',
                    className: 'g-amount',
                    render: (text) => formatCurrency(text)
                }
            ];
            if(currencyVipFlag === 'true') {
                columns.push(
                    {
                        title: "本币金额",
                        dataIndex: 'currencyAmount',
                        className: 'g-mount',
                    }
                )
            }
            columns.push(
                {
                    title: intl.get("income.show.index.remarks"),
                    dataIndex: 'dremarks',
                    className: 'g-remarks',
                }
            );

            let dataSource = [];
            if(data && data.size>0  && data.getIn([0 , 'bindBillType']) === 1){
                dataSource = data.map((item, index)=>({
                    key: index,
                    serial: index+1,
                    bindBillNo: item.get('saleBillNo'),
                    displayBillNo: item.get('displayBillNo'),
                    aggregateAmount: item.get('aggregateAmount'),
                    damount: item.get('damount'),
                    dremarks: item.get('dremarks'),
                    currencyAmount: item.get('currencyAmount')
                })).toJS()
            }

            const footer = ()=> (
                <div className={"cf"}>
                    <div className="tb-footer-label">{intl.get("income.show.index.allPrice")}</div>
                    <div className="tb-footer-total">
                        <span>{intl.get("income.show.index.incomeAmount")}: <b>
                            {totalAmount && formatCurrency(totalAmount)}
                        </b>{intl.get("income.show.index.yuan")}</span>
                        {
                            currencyVipFlag === 'true' && (
                                <>
                                    <span className={cx('ml15')}>本币总金额: <b>
                                    {totalCurrencyAmount && formatCurrency(totalCurrencyAmount)}
                                    </b>元</span>
                                </>
                            )
                        }
                    </div>
                </div>
            );

            renderContent = (
                <React.Fragment>
                    {this.operateBar()}
                    {this.operationLog()}
                    <PrintArea>
                    <div style={{position:"relative"}} className="detail-content-bd">
                        {
                            approveModuleFlag === 1 && (
                                <div className={cx("status-img")}>
                                    <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                </div>
                            )
                        }
                        <PageTurnBtn type={"income"}  current={id}/>
                        <Fold title={intl.get("income.show.index.baseInfo")}>
                            <Row>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: intl.get("income.show.index.billNo"), value: data.getIn([0, 'billNo']), highlight: true}}/>
                                </Col>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{
                                        name: intl.get("income.show.index.paymentDate"),
                                        value: moment(data.getIn([0, 'paymentDate'])).format('YYYY-MM-DD')
                                    }}/>
                                </Col>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: intl.get("income.show.index.typeName"), value: data.getIn([0, 'typeName'])}}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: intl.get("income.show.index.accountName"), value: data.getIn([0, 'accountName'])}}/>
                                </Col>
                                {/*<Col span={8} style={colStyle}>*/}
                                    {/*<AttributeInfo data={{name: '上游订单', value: data.get('fkDisplayBillNo')}}/>*/}
                                {/*</Col>*/}
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: intl.get("income.show.index.customerName"), value: data.getIn([0, 'customerName'])}}/>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    data.getIn([0 , 'bindBillType']) === 0 && (
                                        <>
                                            <Col span={8} style={colStyle}>
                                                <AttributeInfo option="show" noAuthRender="**" data={{name: intl.get("income.show.index.amount"), value: data.getIn([0, 'amount']) && (data.getIn([0, 'amount']) + intl.get("income.show.index.yuan"))}}/>
                                            </Col>
                                            {
                                                currencyVipFlag === 'true' && (
                                                    <Col span={8} style={colStyle}>
                                                        <AttributeInfo option="show" noAuthRender="**" data={{name: "本币金额", value: data.getIn([0, 'noBindCurrencyAmount']) && (data.getIn([0, 'noBindCurrencyAmount']) + '元')}}/>
                                                    </Col>
                                                )
                                            }
                                        </>
                                    )
                                }
                            </Row>

                            <Row>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: "币种", value: data.getIn([0, 'currencyName'])}}/>
                                </Col>
                                <Col span={8} style={colStyle}>
                                    <AttributeInfo data={{name: "牌价", value: data.getIn([0, 'quotation'])}}/>
                                </Col>
                            </Row>

                            {
                                dataSource.length>0?(
                                    <div className="up-bill">
                                        <Table columns={columns} dataSource={dataSource} bordered footer={footer}/>
                                    </div>
                                ):null
                            }
                        </Fold>
                        <Fold title={intl.get("income.show.index.otherInfo")}>
                            <Row className="mt20">
                                <Col span={16}>
                                    <AttributeInfo data={{name: "经办人", value: data.getIn([0, 'ourContacterName'])}}/>
                                </Col>
                            </Row>
                            <Row className="mt20">
                                <Col span={16}>
                                    <AttributeInfo data={{name: intl.get("income.show.index.remarks"), value: data.getIn([0, 'remarks'])}}/>
                                    <div style={{clear: 'left'}}>
                                        <div style={{
                                            display: 'inline-block',
                                            verticalAlign: 'top',
                                            fontSize: '14px',
                                            color: '#666',
                                            marginRight: '10px',
                                            lineHeight: '30px'
                                        }}>{intl.get("income.show.index.tempAtt")}：
                                        </div>
                                        <div style={{display: 'inline-block', lineHeight: '30px'}}>
                                            {
                                                data && data.getIn([0, 'fileInfo']) && data.getIn([0, 'fileInfo']).toJS().map((file) => {
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
                                </Col>
                            </Row>
                        </Fold>
                        <OperatorLog logInfo={{
                            creator: data.getIn([0 , 'addedName']) || data.getIn([0, 'addedLoginName']),
                            createDate: getYmd(data.getIn([0 , 'addedTime'])),
                            lastModifier: data.getIn([0 , 'updatedName']) || data.getIn([0, 'updatedLoginName']),
                            lastModifyDate: getYmd(data.getIn([0 , 'updatedTime'])),
                            //判断是否显示审批人和审批时间
                            approveModuleFlag: approveModuleFlag,
                            approvedLoginName: data.getIn([0, 'approvedLoginName']),
                            approvedTime: getYmd(data.getIn([0, 'approvedTime']))
                        }}/>
                        <ApproveProcess data={processData} approveStatus={approveStatus}/>
                    </div>
                    </PrintArea>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/finance/income',
                            title: intl.get("income.show.index.income")
                        },
                        {
                            url: '/finance/income',
                            title: intl.get("income.show.index.incomeRecordList")
                        },
                        {
                            title: intl.get("income.show.index.detail")
                        }
                    ]}/>
                </div>
                <div className="detail-content">
                    {renderContent}
                </div>
                <SelectApproveItem  // 选择审批流 ***
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.income,this.loadData)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.income}
                />
            </React.Fragment>
        )
    }
}
