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

import {actions as incomeActions} from '../index';
import {actions as commonActions} from "components/business/commonRequest";
import {actions as auxiliaryIncomeActions} from 'pages/auxiliary/income';
import {reducer as auxiliaryIncome} from 'pages/auxiliary/income/index';
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
import {ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage';
import {getUrlParamValue} from 'utils/urlParam';
import {formatCurrency} from 'utils/format';
import {actions as approveActions, APPROVE_COLOR_GROUP, backDisabledStatus, BACKEND_TYPES, SelectApproveItem, withApprove} from 'components/business/approve';

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRows: [],
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'income';

const mapStateToProps = (state) => ({
    incomeList: state.getIn(['financeIncomeIndex', 'incomeList']),
    filterIncomeList: state.getIn(['auxiliaryIncome', 'incomeList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchIncomeList: incomeActions.asyncFetchIncomeList,
        asyncDeleteIncomeInfo: incomeActions.asyncDeleteIncomeInfo,
        asyncFetchStatistic: incomeActions.asyncFetchStatistic,
        asyncUpdateConfig: incomeActions.asyncUpdateConfig,
        asyncBatchUpdateConfig: incomeActions.asyncBatchUpdateConfig,
        dealFilterConfigList: incomeActions.dealFilterConfigList,
        asyncFetchFilterOptionList: auxiliaryIncomeActions.asyncFetchIncomeList,
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
        this.props.asyncFetchIncomeList(params, callback);
    };
    componentDidMount() {
        this.props.asyncFetchFilterOptionList('inType');
        this.props.asyncFetchFilterOptionList('account');
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
    batchUpdateConfig = (callback) => {
        const {incomeList} = this.props;
        let filterConfigList = incomeList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = incomeList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {};
        let moduleType = {
            search:'salePayment_search_list',
            table:'salePayment_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: intl.get("income.index.index.warningTip"),
            content: intl.get("income.index.index.deleteContent"),
            onOk() {
                _this.props.asyncDeleteIncomeInfo(ids, function (res) {
                    if (res.retCode == 0) {
                        message.success(intl.get("income.index.index.deleteSuccessMessage"));
                        _this.props.asyncFetchIncomeList(_this.state.condition, () => _this.checkRemove());
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
        const {incomeList} = this.props;
        let dataSource = incomeList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = incomeList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = incomeList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = incomeList.getIn(['data', 'pageAmount']);
        const totalAmount = incomeList.getIn(['data', 'totalAmount']);
        let paginationInfo = incomeList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let approveModuleFlag = incomeList.getIn(['data', 'approveModuleFlag']);

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
                    width: item.width
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
                            <PageTurnLink data={dataSource} type={"income"} linkdata={"id"} showdata={"billNo"} current={data}/>
                           /* <Link to={`/finance/income/show/${data.id}`}>{billNo}</Link>*/
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
                    case 'paymentDate':
                       /* obj.defaultSortOrder = 'descend';*/
                        obj.sorter = (prev, next) => prev.paymentDate - next.paymentDate;
                        obj.render = (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>);
                        break;
                    //收入金额排序
                    case 'amount':
                       /* obj.defaultSortOrder = 'descend';*/
                        obj.sorter = (prev, next) => prev.amount - next.amount;
                        break;
                    case 'currencyAmount':
                        obj.render = (text) => (
                            <span className="txt-clip" title={formatCurrency(text)}>
                                <strong>{formatCurrency(text)}</strong>
                            </span>);
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
                            <ModifyMenu module={"income"}
                                        disabled={!modifyApproveDisabled}
                                        tipFlag={!modifyApproveDisabled}
                                        tipTitle={tipTitle}
                                        to={`/finance/income/edit/${data.id}`} />
                            <DeleteMenu module={"income"}
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
            currencyComponents: [],
            depEmployeeComponents: [],
        };
        filterConfigList.forEach((item) => {
            if (item.fieldName === "typeName") {
                const inType = this.props.filterIncomeList.getIn(['inType', 'data', 'data']);
                if (!item.options && inType) {
                    item.options = inType.map((type) => {
                        return {
                            value: type.get('propName'),
                            label: type.get('propName')
                        }
                    });
                }
            } else if (item.fieldName === "accountName") {
                const accountList = this.props.filterIncomeList.getIn(['account', 'data', 'data']);
                console.log(accountList, 'accountList');
                if (!item.options && accountList) {
                    item.options = accountList.map((accountItem) => {
                        return {
                            value: accountItem.get('propName'),
                            label: accountItem.get('propName')
                        }
                    });
                }
            }
            item.visibleFlag && item.type && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {title: intl.get("income.index.index.income")},
                        {title: intl.get("income.index.index.incomeRecordList")}
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              refresh={this.refresh}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              type="salePayment"
                        />
                        {/*<StatisticMenu linkList={linkList} statistic={this.state.statistic} moduleName={"客户"} />*/}
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/finance/income/add"
                            authModule={"income"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/salepayments/search/tips`}
                            searchPlaceHolder={intl.get("income.index.index.searchPlaceHolder")}
                        />
                        <CheckResult
                            module={"income"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                            onSubmitApprove={this.onSubmitApprove.bind(this)}
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
                                loading={this.props.incomeList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                {/*module={["purchasePrice", "salePrice"]}*/}
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
