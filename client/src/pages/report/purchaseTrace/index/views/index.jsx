import React, {Component} from 'react';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchPurchaseTraceDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import {parse} from "url";
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);

        let condition = {
            startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
            endTime: moment(new Date()).format("YYYY-MM-DD")
        };
        const searchQuery = parse(props.location.search, true);
        const prodNo = searchQuery && searchQuery.query.prodNo;
        const prodName = searchQuery && searchQuery.query.prodName;
        if (prodNo) {
            condition.prodNo = prodNo;
            this.defaultProdInfo = {prodNo, prodName, key: prodNo}
        }

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            condition
        };

    }

    componentDidMount() {
        if (this.defaultProdInfo) {
            this.generateReportForm();
        }
    }

    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {}
        }else {
            params = {
                ...params,
                ...condition,
            }
        }
        this.setState( {
            condition: params
        }, ()=>{
            if (performGenerate) {
                this.generateReportForm();
            }
        });
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage},false,true);
    };


    batchUpdateConfig = (callback) => {
        const {reportDetail} = this.props;
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let filterConfigLists = reportDetail.getIn(['data', 'filterConfigList']);
        filterConfigLists = filterConfigLists ? filterConfigLists.toJS() : [];

        let moduleType = {
            table:'purchaseTracing_list',
            search:'purchaseTracing_search_list',
        };

        let cannotEditFilterColumnsMap = {
            'twoWayBindFlag':1,
        };
        this.batchUpdateConfigSuper(filterConfigLists,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () => {
        const param = {...this.state.condition};
        if (param['timeStart']) {
            param['startTime'] = param['timeStart'];
            delete param['timeStart'];
        }
        if (param['timeEnd']) {
            param['endTime'] = param['timeEnd'];
            delete param['timeEnd'];
        }
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
        console.log(param);
        this.props.asyncFetchPurchaseTraceDetailReport(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    }

    generateReportForm = () => {
        this.batchUpdateConfig(() => {
            const param = {...this.state.condition};
            if (param['timeStart']) {
                param['startTime'] = param['timeStart'];
                delete param['timeStart'];
            }
            if (param['timeEnd']) {
                param['endTime'] = param['timeEnd'];
                delete param['timeEnd'];
            }
            for (const key in param) {
                if (!param[key]) {
                    delete param[key];
                }
            }
            this.setState({
                condition:param
            });
            console.log(param);
            this.props.asyncFetchPurchaseTraceDetailReport(param || {}, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail} = this.props;
        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        let filterConfigLists = reportDetail.getIn(['data', 'filterConfigList']);
        filterConfigLists = filterConfigLists ? filterConfigLists.toJS() : [];

        const filterConfigList = filterConfigLists.concat([{
            label: "report.purchaseTrace.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        },{
            label: "report.purchaseTrace.supplierName",
            fieldName: 'supplierName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'supplier'
        },{
            label: "report.purchaseTrace.projName",
            fieldName: 'projName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'project'
        },{
            label: "node.purchase.payState",
            fieldName: 'payState',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            options: [
                {label: "node.purchase.payStateOption1", value: "0"},
                {label: "node.purchase.payStateOption2", value: "1"},
            ],
        },{
            label: "node.purchase.state",
            fieldName: 'state',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            options: [
                {label: "node.purchase.stateOption1", value: "0"},
                {label: "node.purchase.stateOption2", value: "1"}
            ]
        },{
            label:"node.supplier.groupName",
            fieldName: 'supplierGroup',
            width:'200',
            visibleFlag: true,
            cannotEdit: true,
            type:'group',
            typeField: 'supply'
        },{
            label: "node.purchase.invoiceState",
            fieldName: 'invoiceState',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            options: [
                {label: "node.purchase.invoiceStateOption1", value: "0"},
                {label: "node.purchase.invoiceStateOption2", value: "1"},
            ],
        }]);
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['aggregateAmount', 'enterAmount', 'unenterAmount', 'payAmount', 'unpayAmount', 'invoiceAmount', 'uninvoiceAmount'];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag && item.label) {
                const obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width,
                    columnType: item.columnType,
                    render: (content) => (<span className={cx("txt-clip")} title={content}>{content}</span>)
                };

                if (priceColumns.indexOf(item.fieldName) !== -1) {
                    obj.render = (text) => (
                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(text)}>
                                            <strong>{formatCurrency(text)}</strong>
                                        </span>
                                    ) : '0'
                            }
                        </Auth>
                    )
                }
                if(item.fieldName === "purchaseOrderDate"){
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => new Date(prev.purchaseOrderDate.replace(/-/g,'/')).getTime()  - new Date(next.purchaseOrderDate.replace(/-/g,'/')).getTime();
                }
                // if (item.fieldName === "remarks") {
                //     obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                // }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            inputNoBtnComponents:[
                {
                    label: "report.purchaseTrace.billNo",
                    fieldName: 'billNo',
                },
                {
                    label: "node.report.purchase.ourContacterName",
                    fieldName: 'ourContacterName',
                }
            ],
            datePickerComponents: [],
            projectComponents: [],
            supplierComponents: [],
            groupComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.purchaseTrace.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        console.log(tempColumns,'tempColumns');
        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("report.purchaseTrace.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="purchaseTracing"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="purchaseTraceReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.reset()
                            }}
                            exportCondition={this.state.condition}
                            beforeExport={this.batchUpdateConfig}
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
                            <ReportHd
                                sourceLabel={intl.get("report.purchaseTrace.source")}
                                sourceName={intl.get("report.purchaseTrace.sourceName")}
                            />
                            <ListTable
                                className={"report"}
                                columns={tempColumns}
                                dataSource={dataSource}
                                loading={this.props.reportDetail.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['purchaseTraceReportIndex', 'purchaseTraceDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseTraceDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)