import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Dropdown, Layout, Menu, message, Modal,
} from 'antd';

const {Content} = Layout;
const confirm = Modal.confirm;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {actions as saleInvoiceActions} from '../index';
import {actions as commonActions} from "components/business/commonRequest";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link, withRouter} from 'react-router-dom';
import PageTurnLink from 'components/business/pageTurnLink';

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import {Choose} from 'pages/account/index';
import {getUrlParamValue} from 'utils/urlParam';
import {actions as approveActions, APPROVE_COLOR_GROUP, backDisabledStatus, BACKEND_TYPES, SelectApproveItem, withApprove} from 'components/business/approve';

const cx = classNames.bind(styles);
import {ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage';
let initParams = {
    condition: {},
    selectedRows: [],
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'saleInvoice';

const mapStateToProps = (state) => ({
    saleInvoiceList: state.getIn(['saleInvoiceIndex', 'saleInvoiceList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleInvoiceList: saleInvoiceActions.asyncFetchSaleInvoiceList,
        asyncDeleteSaleInvoiceInfo: saleInvoiceActions.asyncDeleteSaleInvoiceInfo,
        // asyncFetchStatistic: saleInvoiceActions.asyncFetchStatistic,
        asyncUpdateConfig: saleInvoiceActions.asyncUpdateConfig,
        asyncBatchUpdateConfig: saleInvoiceActions.asyncBatchUpdateConfig,
        dealFilterConfigList: saleInvoiceActions.dealFilterConfigList,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        batchSubmitApprove: approveActions.batchSubmitApprove
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
export default class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            selectApprove: false,  // 选择审批流弹层
            listToolBarVisible: true,
            statistic: {
                count: 0,
                countMonth: 0,
                countToday: 0
            }
        }
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchSaleInvoiceList(params, callback);
    };

    componentDidMount() {
        //初始化列表数据
        let condition = this.state.condition;

        // 首页审批模块点击进入 ***
        let approveStatus = getUrlParamValue("approveStatus");
        let approvePerson = getUrlParamValue("approvePerson");
        if(approveStatus) condition.approveStatus = approveStatus;
        if(approvePerson) condition.approvePerson = approvePerson;

        this.fetchListData(condition,(data) => {
            let filterConfigList = this.initFetchListCallback(data.filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
        });
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    // 批量更新字段配置
   batchUpdateConfig = (callback)=>{
        const {saleInvoiceList} = this.props;
        let filterConfigList = saleInvoiceList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleInvoiceList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

       let cannotEditFilterColumnsMap = {
           'enterType':1,
           'warehouseName':1,
           'enterDate':1
       };
       let moduleType = {
           search:'saleInvoice_search_list',
           table:'saleInvoice_list'
       };
       this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: intl.get("saleInvoice.index.index.warningTip"),
            content: intl.get("saleInvoice.index.index.deleteContent"),
            onOk() {
                _this.props.asyncDeleteSaleInvoiceInfo(ids, function (res) {
                    if (res.retCode == 0) {
                        message.success(intl.get("saleInvoice.index.index.deleteSuccessMessage"));
                        _this.props.asyncFetchSaleInvoiceList(_this.state.condition, () => _this.checkRemove());
                        if (callback) {
                            callback();
                        }
                    } else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {
            },
        });
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

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        //在线订单为未接受或已接收状态都不能删除
        const cannotFlag = this.state.selectedRows.some(item => {
            return item.interchangeStatus === 1 || item.interchangeStatus === 2
        });
        this.deleteConfirm(this.state.selectedRowKeys, cannotFlag, function() {
            _this.checkRemove();
        },'batch');
    };

    render() {
        const {saleInvoiceList} = this.props;
        let dataSource = saleInvoiceList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = saleInvoiceList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleInvoiceList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = saleInvoiceList.getIn(['data', 'pageAmount']);
        const totalAmount = saleInvoiceList.getIn(['data', 'totalAmount']);
        let paginationInfo = saleInvoiceList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let approveModuleFlag = saleInvoiceList.getIn(['data', 'approveModuleFlag']);

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                const obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width*1.0
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }

                switch (item.fieldName) {
                    case 'fkBillNo':
                        obj.render = (fkBillNo, data) => (<Link to={`/sale/show/${data.fkBillNo}`}>{data.fkDisplayBillNo}</Link>);
                        break;
                    case 'billNo':
                        obj.render = (billNo, data) => (
                            <PageTurnLink data={dataSource} type={"saleInvoice"} linkdata={"id"} showdata={"billNo"} current={data}/>
                            /*<Link to={`/finance/saleInvoice/show/${data.id}`}>{billNo}</Link>*/
                        );
                        break;
                    case 'approveStatus':
                        obj.render =(approveStatus) => (
                            <span style={{color: APPROVE_COLOR_GROUP[approveStatus].color}}>{APPROVE_COLOR_GROUP[approveStatus].label}</span>
                        )
                        break;
                    case 'remarks':
                        obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>);
                        break;
                    case 'invoiceDate':
                        /*obj.defaultSortOrder = 'descend';*/
                        obj.sorter = (prev, next) => prev.invoiceDate - next.invoiceDate;
                        obj.render = (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>);
                        break;
                    //开票金额排序
                    case 'amount':
                       /* obj.defaultSortOrder = 'descend';*/
                        obj.sorter = (prev, next) => prev.amount - next.amount;
                        break;
                }

                tempColumns.push(obj);
            }
        });
        const operationColumn = {
            render: (operation, data) => {
                let deleteApproveDisabled = backDisabledStatus('deleteApproveDisabled', approveModuleFlag, data.approveStatus); // ***
                let modifyApproveDisabled = backDisabledStatus('modifyApproveDisabled', approveModuleFlag, data.approveStatus); // ***
                let tipTitle = intl.get("sale.index.index.orderUnableExecute");
                return (
                    <Dropdown overlay={
                        <Menu>
                            <ModifyMenu module={"saleInvoice"}
                                        disabled={!modifyApproveDisabled}
                                        tipFlag={!modifyApproveDisabled}
                                        tipTitle={tipTitle}
                                        to={`/finance/saleInvoice/edit/${data.id}`} />
                            <DeleteMenu module={"saleInvoice"}
                                        disabled={!deleteApproveDisabled}
                                        tipFlag={!deleteApproveDisabled}
                                        tipTitle={tipTitle}
                                        clickHandler={() => this.deleteConfirm([data.id])} />
                        </Menu>
                    }>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            },
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            depEmployeeComponents: [],
            invoiceTypeComponents: []
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && item.type && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {title: intl.get("saleInvoice.index.index.saleInvoice")},
                        {title: intl.get("saleInvoice.index.index.saleInvoiceRecordList")}
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              refresh={this.refresh}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              type="saleInvoice"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/finance/saleInvoice/add"
                            authModule={"saleInvoice"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/saleinvoices/search/tips`}
                            searchPlaceHolder={intl.get("saleInvoice.index.index.searchPlaceHolder")}
                        />
                        <CheckResult
                            module={"saleInvoice"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            onSubmitApprove={this.onSubmitApprove.bind(this)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                            selectedRows={this.state.selectedRows}
                            approveModuleFlag={approveModuleFlag}
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
                                loading={saleInvoiceList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                {/*module="salePrice"*/}
                                <Amount pageAmount={pageAmount} totalAmount={totalAmount}/>
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
            </Layout>
        )
    }
}

