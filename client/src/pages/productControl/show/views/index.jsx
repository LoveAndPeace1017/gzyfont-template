import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Spin, Button, message, Tabs, Checkbox, Form, Input, Radio} from 'antd';
const {TabPane} = Tabs;
import {getYmd} from "utils/format";
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import {detailPage} from  'components/layout/listPage';
import Fold from 'components/business/fold';
import OperatorLog from 'components/business/operatorLog';
import {ConvertButton} from 'components/business/authMenu';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import LogModalTable from 'components/business/logModalTable';
import WorkSheetOperateTable from 'components/business/workSheetOperateTable';
import {asyncFetchProductControlById, asyncOperateWorksheet, asyncOperateWorksheetProcess,
    asyncFetchWorkSheetReport, asyncAddWorkSheetReport, asyncDeleteWorkSheetReport, asyncFetchOperationLog,asyncFetchQualityAction} from '../actions';
import {actions as productControlIndexActions} from 'pages/productControl/index'
import {actions as auxiliaryWorkCenterActions} from 'pages/auxiliary/workCenter';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import ProductList from './productList';
import ProcessList from './processList';
import WorkSheetReport from './workSheetReport';
import MessageRecommend from './messageRecommend';
// import WorkSheetOperateTable from './workSheetOperateTable';
import { backOrderBtnStatus, orderTitleMap } from './data';
import PrintArea from 'components/widgets/printArea';
import {InboundRecord} from 'pages/inventory/inbound/index';
import {ExpendRecord} from 'pages/finance/expend/index';
import {InvoiceRecord} from 'pages/finance/invoice/index';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Link, withRouter} from "react-router-dom";
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    }
};


const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    productControlInfo: state.getIn(['productControlShow', 'productControlInfo']),
    workSheetReport: state.getIn(['productControlShow', 'workSheetReport']),
    fetchLogInfo: state.getIn(['productControlShow', 'fetchLogInfo']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProductControlById,
        asyncOperateWorksheet,
        asyncOperateWorksheetProcess,
        asyncFetchWorkSheetReport,
        asyncAddWorkSheetReport,
        asyncDeleteWorkSheetReport,
        asyncFetchOperationLog,
        asyncFetchQualityAction,
        asyncDeleteProductControlInfo: productControlIndexActions.asyncDeleteProductControlInfo,
        asyncFetchWorkCenterDetail: auxiliaryWorkCenterActions.asyncFetchWorkCenterDetail,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
export default class Index extends detailPage {
    formRef = React.createRef();
    getReportRef = (reportRef) => {
        this.reportRef = reportRef
    };
    getMessageRecommendRef = (messageRecommendRef) => {
        this.messageRecommendRef = messageRecommendRef
    };
    constructor(props) {
        super(props);
        this.state = {
            operationLogVisible: false,  // 操作日志
            tags: [],
            finishWorkSheetVisible: false,
            addWorkSheetReportVisible: false,
            messageRecommendVisible: false, // 短信提醒
            currentProcessRow: {}
        }
    }

    componentDidMount() {
        this.props.asyncFetchVipService(); // 获取Vip信息
        const activeKey = this.props.location.hash.replace('#', '') || 'workSheetInfo';
        if(activeKey === 'bookWorkRecordInfo') {
            this.loadBookRecordData();
        } else {
            this.loadData();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!==this.props.match.params.id){
            this.loadData(nextProps.match.params.id);
        }
    }

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchProductControlById(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("提示信息"),
                        content: errorMsg
                    });
                }
            })
        }
    };

    loadBookRecordData = (params) => {
        console.log(params, 'params');
        const {match} = this.props;
        let id = match.params.id;
        params = params || {};
        params.billNo = id;
        if (id) {
            this.props.asyncFetchWorkSheetReport(params, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("提示信息"),
                        content: errorMsg
                    });
                }
            })
        }
    };

    // 删除操作
    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;
        let self = this;
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div><p>删除单据后无法恢复，确定删除吗？</p></div>,
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteProductControlInfo({ids:[id]}, function(res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success(intl.get("purchase.show.index.deleteSuccessMessage"));
                            self.props.history.replace('/productControl/')
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                })
            }
        });
    };

    getInfo() {
        const {productControlInfo} = this.props;
        return productControlInfo && productControlInfo.getIn(['data', 'data']);
    }

    processBillInfo = () => {
        const info = this.getInfo();
        return (
            <React.Fragment>
                <div style={{marginBottom: "0",overflow: "hidden"}}>
                    <AttributeInfo data={{
                        name: "工单编号",
                        value: info.get('billNo'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "工单名称",
                        value: info.get('sheetName')
                    }}/>
                    <AttributeInfo data={{
                        name: "销售单号",
                        isLink: true,
                        href: '/sale/show/'+info.get('saleBillNo'),
                        value: info.get('displaySaleBillNo')
                    }}/>
                    <AttributeInfo data={{
                        name: "客户订单号",
                        value: info.get('saleCustomerOrderNo')
                    }}/>
                    <AttributeInfo data={{
                        name: "负责人",
                        value: info.get('officerName')
                    }}/>
                    <AttributeInfo data={{
                        name: "状态",
                        value: orderTitleMap[info.get('sheetStatus')]
                    }}/>
                    <AttributeInfo data={{
                        name: "计划开始时间",
                        value: info.get('expectStartDate') && moment(info.get('expectStartDate')).format('YYYY-MM-DD HH:mm')
                    }}/>
                    <AttributeInfo data={{
                        name: "计划结束时间",
                        value: info.get('expectEndDate') && moment(info.get('expectEndDate')).format('YYYY-MM-DD HH:mm')
                    }}/>
                    <AttributeInfo data={{
                        name: "实际开始时间",
                        value: info.get('actualStartDate') && moment(info.get('actualStartDate')).format('YYYY-MM-DD HH:mm')
                    }}/>
                    <AttributeInfo data={{
                        name: "实际结束时间",
                        value: info.get('actualEndDate') && moment(info.get('actualEndDate')).format('YYYY-MM-DD HH:mm')
                    }}/>
                    <AttributeInfo data={{
                        name: "上游单号",
                        isLink: true,
                        href: '/produceOrder/show/'+info.get('fkProduceNo'),
                        value: info.get('fkProduceNo')
                    }}/>
                </div>
            </React.Fragment>
        );
    };

    productListInfo = () => {
        const info = this.getInfo();
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        const { productControlInfo } = this.props;
        const processList = productControlInfo && productControlInfo.getIn(['data', 'data', 'processList']);

        let prodData = [{
            key: 0,
            prodDisplayCode: info.get('prodDisplayCode'),  // 物品编号
            prodName: info.get('prodName'),  // 物品名称
            descItem: info.get('descItem'),  // 规格型号
            prodBrand: info.get('prodBrand'),  // 品牌
            produceModel: info.get('produceModel'),  // 制造商型号
            expectCount: info.get('expectCount'),  // 计划产量
            finishCount: info.get('finishCount'),  // 良品数量
            scrapCount: info.get('scrapCount'),  // 不良数量
            yieldRate: info.get('yieldRate'),  // 良品率
         }];

        let processData = processList.map((item, index) => {
            return {
                key: item.get('id'),
                serial: index + 1,
                id: item.get('id'),
                billNo: item.get('billNo'),
                orderNo: item.get('orderNo'), // 顺序号
                processCode: item.get('processCode'), // 工序编号
                processName: item.get('processName'), // 工序名称
                processStatus: item.get('processStatus'), // 状态
                expectStartDate: item.get('expectStartDate') && moment(item.get('expectStartDate')).format('YYYY-MM-DD HH:mm'), // 计划开始时间
                expectEndDate: item.get('expectEndDate') && moment(item.get('expectEndDate')).format('YYYY-MM-DD HH:mm'), // 计划结束时间
                actualStartDate: item.get('actualStartDate') && moment(item.get('actualStartDate')).format('YYYY-MM-DD HH:mm'), // 实际开始时间
                actualEndDate: item.get('actualEndDate') && moment(item.get('actualEndDate')).format('YYYY-MM-DD HH:mm'), // 实际结束时间
                expectCount: fixedDecimal(item.get('expectCount'), quantityDecimalNum),  // 计划产量
                finishCount: fixedDecimal(item.get('finishCount'), quantityDecimalNum),  // 良品数量
                scrapCount: fixedDecimal(item.get('scrapCount'), quantityDecimalNum),    // 不良数量
                yieldRate: item.get('yieldRate'), // 良品率
                caName: item.get('caName'), // 工作中心
                caCode: item.get('caCode'),
                officerName: item.get('officerName'), // 负责人
                fileInfo: item.get('fileInfo'), //附件信息
                pmsWorkCenterV2: item.get('pmsWorkCenterV2') && item.get('pmsWorkCenterV2').toJS(), //工作中心的员工id
                reports: item.get('reports') && item.get('reports').toJS(),
                reportCount: item.get('reportCount')||0, //完工数量
                remarks: item.get('remarks')
            }
        }).toArray();

        return (
            <React.Fragment>
                <Fold title={"生产物品"}>
                    <ProductList
                        productList={prodData}
                    />
                </Fold>
                <Fold title={"工序"}>
                    <ProcessList
                        startWorkOperateForProcess={this.startWorkOperateForProcess}
                        bookWorkOperateProcess={this.bookWorkOperateProcess}
                        closeOperateForProcess={this.closeOperateForProcess}
                        restartOperateForProcess={this.restartOperateForProcess}
                        produceRecord={this.produceRecord}
                        messageRecommend={this.messageRecommend}
                        productList={processData}
                        fieldConfigType={'workSheet_process'}
                    />
                </Fold>
            </React.Fragment>
        )

    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.getIn(['data', 'data']);
        const data = logInfo ? logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedName'),
                operation: item.get('operation'),
                operateTime:  item.get('operatedTime') && moment(item.get('operatedTime')).format('YYYY-MM-DD HH:mm:ss')
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
        const info = this.getInfo();
        if (!info) {
            return null;
        }
        let billNo = info.get('billNo');
        let listAction = [];
        listAction = listAction.concat([
            {
                name: 'edit',
                module: 'productManage',
                onClick: () => {
                    this.props.history.push('/productControl/modify/' + billNo);
                },
            },
            {
                name: 'delete',
                module: 'productManage',
                onClick: () => {
                    this.showConfirm();
                }
            },
            {
                name: 'copy',
                module: 'productManage',
                onClick: () => {
                    this.props.history.push('/productControl/copy/' + billNo);
                }
            },
            {
                name: 'interchangeLog',
                label: intl.get("sale.show.index.operateLog"),
                icon: 'icon-operation-log',
                onClick: () => {
                    this.props.asyncFetchOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            },
            {
                name: 'export',
                label: "导出",
                module: 'produceWork',
                href: `${BASE_URL}/file/download?url=/worksheet/excel/export/${billNo}`,
                displayBillNo: billNo,
                templateType: 'ProduceWork'
            },
            {
                name: 'print',
                displayBillNo: billNo,
                templateType: 'ProduceWork'
            },

        ]);

        let {onlineFlag, finishFlag, closeFlag, restartFlag} = backOrderBtnStatus(info.get('sheetStatus'), null);

        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listAction,
                    moreData: []
                }}/>
                <div className={cx("status-img")}>
                    {onlineFlag && (<Button className={cx(["btn", "orange"])} onClick={() => this.onlineOperate(billNo)}>上线</Button>)}
                    {finishFlag && (<Button className={cx(["btn", "green", "ml10"])} onClick={() => this.finishOperate(billNo)}>完成</Button>)}
                    {closeFlag && (<Button className={cx(["btn", "grey", "ml10"])} onClick={() => this.closeOperate(billNo)}>关闭</Button>)}
                    {restartFlag && (<Button className={cx(["btn", "white", "ml10"])} onClick={() => this.restartOperate(billNo)}>重启</Button>)}
                </div>
            </React.Fragment>
        )
    };

    footerBaseInfo = () => {
        const {productControlInfo} = this.props;
        const info = this.getInfo() || {};
        let data = [];
        const tags = productControlInfo && productControlInfo.getIn(['data', 'tags']) && productControlInfo.getIn(['data', 'tags']).toJS();
        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: info.getIn(['propertyValues', `property_value${propertyIndex}`]) || ""
                })
            }
        });

        data.push({
            name: '备注',
            value: info.get('remarks')
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
            </div>
        );
    };

    // 删除报工记录
    deleteWorkSheetReportRecord = (id, processId) => {
        let array = [{id, processId}];
        let self = this;
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div><p>删除单据后无法恢复，确定删除吗？</p></div>,
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteWorkSheetReport({array}, (res) => {
                        resolve();
                        if(res && res.retCode==="0"){
                            message.success('操作成功');
                            self.loadBookRecordData();
                        } else {
                            Modal.error({
                                title: "提示信息",
                                content: res.retMsg || '操作失败'
                            })
                        }
                    })
                })
            }
        });
    };

    renderBookWorkRecord = () => {
        const { workSheetReport } = this.props;
        const recordData = workSheetReport && workSheetReport.getIn(['data', 'list']);
        let paginationInfo = workSheetReport && workSheetReport.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        let record = recordData && recordData.map((item, index) => {
            return {
                serial: index + 1,
                id: item.get('id'),
                orderNo: item.get('orderNo'), // 工序顺序号
                processId: item.get('processId'),
                processCode: item.get('processCode'), // 工序编号
                processName: item.get('processName'), // 工序名称
                caName: item.get('caName'), // 工作中心
                employeeName: item.get('employeeName'), // 部门员工
                finishCount: item.get('finishCount'), // 良品数量
                scrapCount: item.get('scrapCount'), // 不良数量
                yieldRate: item.get('yieldRate'), // 良品率
                addedTime: item.get('addedTime') && moment(item.get('addedTime')).format('YYYY-MM-DD HH:mm'), // 新建时间
                qualityStatus: item.get('qualityStatus') === 1?'已质检':'未质检', //0未质检，1已质检
                qualityStatusNum: item.get('qualityStatus'), //0未质检，1已质检
                reportCount: item.get('reportCount'), // 完工数量
                qualityTime: item.get('qualityTime') && moment(item.get('qualityTime')).format('YYYY-MM-DD HH:mm'), // 质检时间
            }
        }).toArray();

        return (
            <React.Fragment>
                <WorkSheetReport
                    deleteWorkSheetReportRecord={this.deleteWorkSheetReportRecord}
                    productList={record}
                    paginationInfo={paginationInfo}
                    fetchData={this.loadBookRecordData}
                    asyncFetchQualityAction = {this.props.asyncFetchQualityAction}
                />
            </React.Fragment>
        )
    };

    handleTabClick = (activeKey) => {
        if(activeKey === 'workSheetInfo') this.loadData();
        if(activeKey === 'bookWorkRecordInfo') this.loadBookRecordData();
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };

    /**弹框类型*/
    _popModal = ({title, content, icon, theme, modalType, okCallback, cancelCallback}) => {
        const _this = this;
        modalType = modalType || 'confirm';
        Modal[modalType]({
            icon: icon ,
            title: title,
            content: content,
            closable: true,
            onOk() {
                okCallback && okCallback.call(null, _this);
            },
            onCancel() {
                cancelCallback && cancelCallback.call(null, _this);
            }
        })
    };

    // 工单 上线操作
    onlineOperate = (billNo) => {
        let params = { billNo, sheetStatus: 1};
        this._popModal({
            content: '确定上线吗？',
            okCallback: () => {
                this.props.asyncOperateWorksheet(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 工单 关闭操作
    closeOperate = (billNo) => {
        let params = { billNo, sheetStatus: 3};
        this._popModal({
            content: '确定关闭么？',
            okCallback: () => {
                this.props.asyncOperateWorksheet(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 工单 重启操作
    restartOperate = (billNo) => {
        let params = { billNo, sheetStatus: 0};
        this._popModal({
            content: '确定重启么？',
            okCallback: () => {
                this.props.asyncOperateWorksheet(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 工单 完成操作
    finishOperate = () => {
        let existProcessUnFinishFlag = this.checkHasProcessUnFinishInfo();
        if(existProcessUnFinishFlag){
            this._popModal({
                content: '存在工序未完成，确定继续？',
                okCallback: () => {
                    this.setState({ finishWorkSheetVisible: true });
                }
            })
        } else {
            this.setState({ finishWorkSheetVisible: true });
        }
    };

    // 提交 完成工单
    confirmWorkSheet = (values) => {
        console.log(values, 'values');
        const info = this.getInfo();
        values.billNo = info.get('billNo');
        values.sheetStatus = 2;
        this.props.asyncOperateWorksheet(values, (res) => {
            if(res && res.retCode==="0"){
                message.success('操作成功');
                this.setState({ finishWorkSheetVisible: false });
                this.loadData();
            } else {
                Modal.error({
                    title: "提示信息",
                    content: res.retMsg || '操作失败'
                })
            }
        });
    };

    // 完成 工单弹层
    finishWorkSheetModal = () => {
        const tailLayout = {
            wrapperCol: { offset: 13, span: 16 },
        };
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        return (
            <Modal
              title={"完成工单"}
              onCancel={() => this.closeModal('finishWorkSheetVisible')}
              okText={"确定"}
              cancelText={'取消'}
              className={"list-pop"}
              visible={this.state.finishWorkSheetVisible}
              footer={null}
              destroyOnClose={true}
              width={800}
          >
              <div className={cx("complete-wrap")}>
                  <Form onFinish={(values) => {
                      this.confirmWorkSheet(values);
                  }}>
                      <Form.Item
                          label={'良品数量'}
                          name={'finishCount'}
                          rules={[
                              {
                                  required: true,
                                  message: "良品数量为必填项！"
                              },
                              {
                                  validator: (rules, value, callback) => {
                                      let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                      if (value && (Number.isNaN(value) || !reg.test(value))) {
                                          callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                      }
                                      callback();
                                  }
                              }
                          ]}
                          {...formItemLayout}
                      >
                          <Input maxLength={25}/>
                      </Form.Item>
                      <Form.Item
                          label={'不良数量'}
                          name={'scrapCount'}
                          rules={[
                              {
                                  required: true,
                                  message: "不良数量为必填项！"
                              },
                              {
                                  validator: (rules, value, callback) => {
                                      let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                      if (value && (Number.isNaN(value) || !reg.test(value))) {
                                          callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                      }
                                      callback();
                                  }
                              }
                          ]}
                          {...formItemLayout}
                      >
                          <Input maxLength={25}/>
                      </Form.Item>

                      <Form.Item  {...tailLayout} style={{"marginTop": '15px'}}>
                          <Button type="primary" htmlType="submit">
                              确定
                          </Button>
                          <Button onClick={() => this.closeModal('finishWorkSheetVisible')} style={{marginLeft: 10}}>
                              取消
                          </Button>
                      </Form.Item>
                  </Form>
              </div>
          </Modal>
          )
    };

    cancelWorkSheetReportVisible = async() => {
        await this.reportRef.emptyInfo();
        await this.closeModal('addWorkSheetReportVisible');
    };

    // 新建报工记录弹层
    addWorkSheetReportModal = () => {
        return (
            <Modal
                title={"报工"}
                okText={"确定"}
                cancelText={'取消'}
                className={"list-pop"}
                onCancel={this.cancelWorkSheetReportVisible}
                visible={this.state.addWorkSheetReportVisible}
                footer={null}
                forceRender={true}
                width={1200}
            >
                <div className={cx("complete-wrap")}>
                    <WorkSheetOperateTable
                        getRef={this.getReportRef}
                        onOk={() => {
                            this.loadData();
                            this.closeModal('addWorkSheetReportVisible');
                        }}
                        onCancel={this.cancelWorkSheetReportVisible}
                        info={this.state.currentProcessRow}
                    />
                </div>
            </Modal>
        )
    };

    // 校验是否存在工序未完成
    checkHasProcessUnFinishInfo = () => {
        const {productControlInfo} = this.props;
        const processList = productControlInfo && productControlInfo.getIn(['data', 'data', 'processList']);
        let processUnFinishInfo = processList && processList.filter(item => {
            return item.get('processStatus') == 0 || item.get('processStatus') == 1;   // 0: '下达',  1: '上线',
        });
        return processUnFinishInfo.size > 0;
    };

    // 工序 开工操作
    startWorkOperateForProcess = (id, billNo) => {
        let params = { id, billNo, processStatus: 1};
        this._popModal({
            content: '确定开工吗？',
            okCallback: () => {
                this.props.asyncOperateWorksheetProcess(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 工序 报工操作
    bookWorkOperateProcess =  (id, billNo, caCode) => {
        // 初始化新增工单操作
        this.reportRef && this.reportRef.initOperate();
        this.setState({
            addWorkSheetReportVisible: true,
            currentProcessRow: {
                id, billNo, caCode
            }
        });
    };

    // 工序 关闭操作
    closeOperateForProcess = (id, billNo) => {
        let params = { id, billNo, processStatus: 3};
        this._popModal({
            content: '确定关闭么？',
            okCallback: () => {
                this.props.asyncOperateWorksheetProcess(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 工序 重启操作
    restartOperateForProcess = (id, billNo) => {
        let params = { id, billNo, processStatus: 0};
        this._popModal({
            content: '确定重启么？',
            okCallback: () => {
                this.props.asyncOperateWorksheetProcess(params, (res) => {
                    if(res && res.retCode==="0"){
                        message.success('操作成功');
                        this.loadData();
                    } else {
                        Modal.error({
                            title: "提示信息",
                            content: res.retMsg || '操作失败'
                        })
                    }
                });
            }
        })
    };

    // 前往生产记录
    produceRecord = (processCode) => {
        let info = this.getInfo();
        let produceBillNo = info.get('fkProduceNo');
        let workBillNo = info.get('billNo'); // 工单编号
        let productCode = info.get('productCode');
        let prodName = info.get('prodName');
        let uri = `/produceOrder/addRecord?workBillNo=${workBillNo}&productCode=${productCode}&processCode=${processCode}&prodName=${prodName}`;
        if(produceBillNo) uri += `&produceBillNo=${produceBillNo}`;
        this.props.history.push(uri);
    };

    // 点击消息提醒
    messageRecommend = ({billNo, caCode, id}) => {
        this.setState({
            messageRecommendVisible: true,
            currentProcessRow: {
                billNo, caCode, id
            }
        }, () => {
            // 初始化新增工单操作
            this.messageRecommendRef && this.messageRecommendRef.initOperate();
        })
    };

    cancelMessageRecommendVisible = async () => {
        await this.closeModal('messageRecommendVisible');
    };

    // 消息提醒弹层
    messageRecommendModal = () => {
        return (
            <Modal
                title={"短信提醒"}
                okText={"确定"}
                cancelText={'取消'}
                className={"list-pop"}
                onCancel={this.cancelMessageRecommendVisible}
                visible={this.state.messageRecommendVisible}
                footer={null}
                forceRender={true}
                destroyOnClose={true}
                width={1200}
            >
                <MessageRecommend getRef={this.getMessageRecommendRef}
                                  onOk={() => {this.closeModal('messageRecommendVisible')}}
                                  onCancel={this.cancelMessageRecommendVisible}
                                  info={this.state.currentProcessRow}
                />
            </Modal>
        )
    };

    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchProductControlById(billNo)
    };

    render() {
        const {productControlInfo} = this.props;
        const data = productControlInfo.getIn(['data', 'data']);
        const listFields = productControlInfo && productControlInfo.getIn(['data', 'listFields']);
        const billNo = data && data.get('billNo');
        const detailData = productControlInfo && data !== '' && data;
        const {match} = this.props;
        const id = match.params.id;
        const activeKey = this.props.location.hash.replace('#', '') || 'workSheetInfo';

        let renderContent = null;
        if (productControlInfo && productControlInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        }
        else if (detailData) {
            renderContent = (
                <React.Fragment>
                    <PrintArea>
                        {this.processBillInfo()}
                        {this.productListInfo()}
                        {this.footerBaseInfo()}
                        {this.operationLog()}
                        <OperatorLog logInfo={{
                            creator: data.get('addedName')||data.get('addedLoginName'),
                            createDate: getYmd(data.get('addedTime')),
                            lastModifier: data.get('updatedName')||data.get('updatedLoginName'),
                            lastModifyDate: getYmd(data.get('updatedTime')),
                        }}/>
                    </PrintArea>
                </React.Fragment>
            )
        }

        return (
            <Layout>
                <div>
                    <Crumb data={[
                        {
                            url: '/productControl/',
                            title: "生产管理"
                        },
                        {
                            url: '/productControl/',
                            title: "工单列表"
                        },
                        {
                            title: "详情页"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            fieldConfigTitle={'工序列表字段'}
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={['workSheet_process']}
                        />
                    </div>
                </div>
                <div className="detail-content" style={{position:"relative"}}>
                    {this.operateBar()}
                    {this.finishWorkSheetModal()}
                    {this.addWorkSheetReportModal()}
                    {this.messageRecommendModal()}
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        <Tabs
                            onTabClick={this.handleTabClick}
                            defaultActiveKey={activeKey}
                            className="record-tab"
                        >
                            <TabPane tab={<span className={cx("tab-tit")}>工单信息</span>} key="workSheetInfo">
                                {renderContent}
                            </TabPane>
                            <TabPane tab={<span className={cx("tab-tit")}>报工记录</span>} key="bookWorkRecordInfo">
                                {this.renderBookWorkRecord()}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Layout>
        )
    }
}

