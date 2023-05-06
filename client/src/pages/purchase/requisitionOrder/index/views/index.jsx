import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import intl from 'react-intl-universal';
import {Modal, Menu, Dropdown, message, Spin} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';
import {asyncFetchSubAccountList} from "../../../../account/index/actions";
import {asyncFetchRequisitionOrderList, asyncDeleteRequisitionOrderInfo,asyncFetchProdAbstractByBillNo, asyncPreDeleteRequisitionOrderInfo, asyncUpdateConfig, asyncBatchUpdateConfig, dealFilterConfigList} from '../actions';
import {actions as commonActions} from "components/business/commonRequest";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CopyMenu, ModifyMenu, DeleteMenu, PurchaseMenu, OutWareMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import ListPage from  'components/layout/listPage';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {getUrlParamValue} from 'utils/urlParam';
import {actions as approveActions, APPROVE_COLOR_GROUP, backDisabledStatus, BACKEND_TYPES, SelectApproveItem, withApprove} from 'components/business/approve';
import {getCookie} from 'utils/cookie';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    selectedRows: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'requisition';

const mapStateToProps = (state) => ({
    requisitionOrderList: state.getIn(['requisitionOrderIndex', 'requisitionOrderList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition']),
    deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
    subAccountList: state.getIn(['accountIndex', 'subAccountList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchRequisitionOrderList,
        asyncDeleteRequisitionOrderInfo,
        asyncPreDeleteRequisitionOrderInfo,
        asyncFetchProdAbstractByBillNo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchSubAccountList, //获取子账号数据
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        batchSubmitApprove: approveActions.batchSubmitApprove
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
@withVipWrap
export default class Index extends ListPage {

    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            selectApprove: false,  // 选择审批流弹层
            listToolBarVisible: true,
            deleteRelatedRecord: false,
            employerData: []
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchRequisitionOrderList(params, (res) => {
            callback && callback(res);
        });
    };

    componentDidMount() {
        this.props.asyncFetchDeptEmp();
        this.props.asyncFetchSubAccountList();
        let {condition} = this.state;
        this.fetchListData(condition);
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        params.condition = {};
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    batchUpdateConfig = (callback) => {
        const {requisitionOrderList} = this.props;
        let filterConfigList = requisitionOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = requisitionOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        //********
        let moduleType = {
            search:'requisition_search_list',
            table:'requisition_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,{},moduleType,callback);
    };


    deleteConfirm = (ids, flag, callback, source) => {
        let _this = this;
        let prefix = source||'list';
        let content = flag?(
            <div>
                <p>存在与该单据关联的其他记录，是否确定删除？</p>
            </div>
        ):(<div>
            <p>删除单据后无法恢复，确定删除吗?</p>
        </div>);
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: content,
            okButtonProps:{
                'ga-data':prefix +'-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix +'-delete-cancel'
            },
            onOk() {
                _this.props.asyncDeleteRequisitionOrderInfo({ids}, function(res) {
                    if (res.retCode === '0') {
                        message.success('删除成功!');
                        _this.fetchListData(_this.state.condition, () => _this.checkRemove());
                        if (callback) {
                            callback();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };


    //选中项批量删除
    batchDelete = (id) => {
        //优先校验删除信息
        let _this = this;
        let ids = id || this.state.selectedRowKeys;
        this.props.asyncPreDeleteRequisitionOrderInfo({ids},(data)=>{
            //true:提示有相关联单据 false：正常提示
            let flag = data.flag;
            this.deleteConfirm(ids,flag,function() {
                _this.checkRemove();
            },'batch');
        });

    };

    tableOnSearch = (value) => {
        this.onSearch(value);
    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {requisitionOrderList} = this.props;
        const dataSource = requisitionOrderList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        //
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    selectChange = (value)=>{
        const {deptEmployee} = this.props;
        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        let employeeList = [];
        deptData = deptData && deptData.map(item => {
            if(item.deptId == value){
                employeeList = item.employeeList;
            }
        });
        let employeeData = employeeList.map(item => {
            return {
                label: item.employeeName,
                value: item.id
            }
        });

        this.setState({employerData:employeeData});
    };

    onSubmitApprove = (selectedRowKeys) => {
        if(selectedRowKeys && selectedRowKeys.length > 20){
            message.error('所选单据数量超过20，无法批量提交');
        }
        this.props.submitApproveProcess(null, () => {
            this.openModal('selectApprove'); // 进入审批流的过程
        });
    };

    // 批量审批
    batchApproveOnOkModal = (id) => {
        let {selectedRows} = this.state;
        let params = {type: BACKEND_TYPES[DEFAULT_TITLE]};
        params.list = selectedRows.map(item => {
            let {billNo, displayBillNo} = item;
            let out = {process: id, billNo, displayBillNo };
            return out;
        });
        this.props.batchSubmitApprove(params, (res) => {
            this.closeModal('selectApprove'); // 进入审批流的过程
            if(res.data.retCode === '0'){
                let errorBillNoMessage = res.data.data.join('、');
                if(errorBillNoMessage.length > 0){
                    message.error(`${errorBillNoMessage}提交失败`);
                } else {
                    message.success('操作成功');
                }
                this.fetchListData(this.state.condition, () => this.checkRemove());
            }
        })
    };

    render() {
        const {requisitionOrderList, deptEmployee} = this.props;
        let dataSource = requisitionOrderList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let tableConfigList = requisitionOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let filterConfigList = requisitionOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];

        let paginationInfo = requisitionOrderList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let customMap = requisitionOrderList.getIn(['data', 'customMap']);
        customMap =  customMap ? customMap.toJS() : [];

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        let approveFlag = requisitionOrderList.getIn(['data', 'approveFlag']); //当前账号是否具备审批权
        let approveModuleFlag = requisitionOrderList.getIn(['data', 'approveModuleFlag']); //当前账号是否具备审批功能

        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                var obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                } else if (item.fieldName === "requestDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                } else if (item.fieldName === "productAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>成品概述</div>
                                                <ul>
                                                    {
                                                        data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                            <li key={index}>
                                                                <span className={cx('prod-tit')}>{item.prodName}</span>
                                                                <span className={cx('prod-desc')}>{item.descItem}</span>
                                                                <span className={cx('amount')}>x{item.quantity}</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </Spin>
                                    </Menu.Item>

                                </Menu>
                            )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5" />
                            </span>
                        </Dropdown>
                    )
                } else if (item.fieldName === "purchaseStatus") {
                    obj.render = (purchaseStatus) => (
                        <span className="txt-clip">
                            {purchaseStatus=== "0" ? '未采购': (purchaseStatus === "1"?"部分采购":"已采购")}
         			    </span>
                    );
                } else if (item.fieldName === "billNo") {
                    obj.render = (billNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={billNo}>
                                    <Link ga-data="list-billNo" to={`/purchase/requisitionOrder/show/${data.billNo}`}>{data.displayBillNo}</Link>
                                </span>
                            </React.Fragment>
                        )
                    }
                }else if (item.fieldName === "approveStatus") {
                    obj.align = "center";
                    obj.render = (approveStatus) => (
                        <span style={{color: APPROVE_COLOR_GROUP[approveStatus].color}}>{APPROVE_COLOR_GROUP[approveStatus].label}</span>
                    )
                }else {
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => {
                let deleteApproveDisabled = backDisabledStatus('deleteApproveDisabled', approveModuleFlag, data.approveStatus);
                let modifyApproveDisabled = backDisabledStatus('modifyApproveDisabled', approveModuleFlag, data.approveStatus);
                let requisitionPurchaseApproveDisabled = backDisabledStatus('requisitionPurchaseApproveDisabled', approveModuleFlag, data.approveStatus);
                let requisitionOutWareApproveDisabled = backDisabledStatus('requisitionOutWareApproveDisabled', approveModuleFlag, data.approveStatus);

                let menuStr = (
                    <Menu>
                        <DeleteMenu module={"requisition"} disabled={!deleteApproveDisabled} clickHandler={() => this.batchDelete([data.recId])}/>
                        <CopyMenu module={"requisition"}  to={`/purchase/requisitionOrder/copy/${data.billNo}`} />
                        <ModifyMenu module={"requisition"} disabled={!modifyApproveDisabled} to={`/purchase/requisitionOrder/modify/${data.billNo}`}/>
                        <PurchaseMenu disabled={!requisitionPurchaseApproveDisabled} clickHandler={()=>{this.props.history.push(`/purchase/add?requisitionOrderNo=${data.billNo}`);}}/>
                        <OutWareMenu disabled={!requisitionOutWareApproveDisabled}  clickHandler={()=>{this.props.history.push(`/inventory/outbound/add?requisitionOrderNo=${data.billNo}`);}}/>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };

        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptId
            }
        });

        let approveStatus;
        let approvePerson;

        let initListCondition = this.props.initListCondition.toJS();
        console.log(initListCondition,'initListCondition');
        if(initListCondition.data.TITLE === DEFAULT_TITLE){
            approveStatus = initListCondition.data.condition.approveStatus;
            approvePerson = initListCondition.data.condition.assignee;
        }

        filterConfigList.push({
            label: "node.requisition.departmentName",
            fieldName: 'departmentId',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: deptData,
            onSelectChanges: this.selectChange
        }, {
            label: "node.requisition.employeeName",
            fieldName: 'employeeId',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            defaultValue: '',
            options: this.state.employerData
        });

        /*let filterConfigList = [
            {
                label: "node.requisition.departmentName",
                fieldName: 'departmentId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: deptData,
                onSelectChanges: this.selectChange
            }, {
                label: "node.requisition.employeeName",
                fieldName: 'employeeId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                defaultValue: '',
                options: this.state.employerData
            }, {
                label: "node.requisition.purchaseStatus",
                fieldName: 'purchaseStatus',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: "node.requisition.purchaseStatusOption0", value: "0"},
                    {label: "node.requisition.purchaseStatusOption1", value: "1"},
                    {label: "node.requisition.purchaseStatusOption2", value: "2"}
                ]
            }, {
                label: "node.requisition.requestDate",
                fieldName: 'requestDate',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'datePicker'
            },{
                label: "node.requisition.projectName",
                fieldName: 'projectName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'project'
            }, {
                label: "node.purchase.property_value",
                fieldName: 'property_value',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'custom',
                options: Object.values(customMap)
            }
        ];*/

        //如果审批开启，添加审批状态搜索功能
        if(approveModuleFlag){
            filterConfigList.push({
                label: "components.approve.approveStatus",
                fieldName: 'approveStatus',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: "components.approve.approveStatus_0", value: "0"},
                    {label: "components.approve.approveStatus_3", value: "3"},
                    {label: "components.approve.approveStatus_2", value: "2"},
                    {label: "components.approve.approveStatus_1", value: "1"}
                ],
                defaultValue: approveStatus && approveStatus
            },{
                label: "node.purchase.assignee",
                fieldName: 'assignee',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: "node.purchase.assigneeOption", value: "1"}
                ],
                defaultValue: approvePerson && approvePerson
            });
         }

        const filterDataSource = {
            inputComponents: [],
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            projectComponents: [],
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/purchase/',
                            title: "采购"
                        },
                        {
                            title: "请购单列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'requisition'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/purchase/requisitionOrder/add/"
                            authModule={"requisition"}
                            onFilter={this.filterListData}
                            onSearch={(value) => this.tableOnSearch(value)}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/requisition/search/tips`}
                            searchTipsUrlPrefix = {`/pc/v1/`}
                            importModule={
                                {
                                    type:"requisition",
                                    text: "导入",
                                    customStep2Text: "向Excel模板中添加数据"
                                }
                            }
                            searchPlaceHolder={"请购单号/物品编号/物品名称"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"requisition"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            onSubmitApprove={this.onSubmitApprove.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            approveModuleFlag={approveModuleFlag}
                            approveFlag={approveFlag}
                            onDelete={this.batchDelete}
                        />
                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.requisitionOrderList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>

                </div>

                <SelectApproveItem
                    onClose={() => this.closeModal('selectApprove')}
                    onOk={(id)=>{this.batchApproveOnOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES[DEFAULT_TITLE]}
                />
            </React.Fragment>
        )
    }
}

