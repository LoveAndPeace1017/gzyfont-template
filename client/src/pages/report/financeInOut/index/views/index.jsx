import React, {Component} from 'react';
import {
     Button, message
} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchFinanceInOutDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions';
import {asyncFetchIncomeList} from "pages/auxiliary/income/actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {InOutAmount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            condition: {
                startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
                endTime: moment(new Date()).format("YYYY-MM-DD")
            }
        };
    }

    componentDidMount() {
        this.props.asyncFetchIncomeList("account");
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
        let moduleType = {
            table:'paymentWithPurchaseAndSale_list'
        };
        this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback);

    };


    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () => {
        const param = {...this.state.condition};
        // if (param['timeStart']) {
        //     param['startTime'] = param['timeStart'];
        //     delete param['timeStart'];
        // }
        // if (param['timeEnd']) {
        //     param['endTime'] = param['timeEnd'];
        //     delete param['timeEnd'];
        // }
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
        this.props.asyncFetchFinanceInOutDetailReport(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    };

    generateReportForm = () => {
        this.batchUpdateConfig(() => {
            const param = {...this.state.condition};
            // if (param['timeStart']) {
            //     param['startTime'] = param['timeStart'];
            //     delete param['timeStart'];
            // }
            // if (param['timeEnd']) {
            //     param['endTime'] = param['timeEnd'];
            //     delete param['timeEnd'];
            // }
            for (const key in param) {
                if (!param[key]) {
                    delete param[key];
                }
            }
            this.setState({
                condition:param
            });
            this.props.asyncFetchFinanceInOutDetailReport(param || {}, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail,incomeList} = this.props;
        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        const pageColAmount = reportDetail.getIn(['data', 'pageColAmount']);
        const totalColAmount = reportDetail.getIn(['data', 'totalColAmount']);
        const pagePayAmount = reportDetail.getIn(['data', 'pagePayAmount']);
        const totalPayAmount = reportDetail.getIn(['data', 'totalPayAmount']);

        const incomeListData = incomeList.getIn(["account", 'data', 'data']);
        const option = incomeListData && incomeListData.map((item, index) => {
            return {
                label:item.get('propName'),
                value:item.get('recId'),
                key: index
            }
        }).toJS();

        const filterConfigList = [
            {
                label: "report.financeInOut.time",
                fieldName: 'time',
                fieldStartKey: 'startTime',
                fieldEndKey: 'endTime',
                visibleFlag: true,
                cannotEdit: true,
                type: 'datePicker',
                defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
            },
            {
                label: "report.financeInOut.type",
                fieldName: 'type',
                visibleFlag: true,
                cannotEdit: true,
                financeType: 'pulldown', //收入支出信息汇总下拉框
                type: 'finance'
            },
            {
                label: "report.financeInOut.customerName",
                fieldName: 'customerName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'customer'
            },
            {
                label: "report.financeInOut.supplierName",
                fieldName: 'supplierName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'supplier'
            },
            {
                label: "node.report.sale.ourContacterName1",
                fieldName: 'ourContacterName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'depEmployee'
            },
            {
                label: "report.purchaseInvoice.accountId",
                fieldName: 'accountId',
                visibleFlag: true,
                cannotEdit: true,
                type:'select',
                options:option
            }
        ];
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag && item.label) {
                const obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width,
                    render: (content) => (<span className={cx("txt-clip")} title={content}>{content}</span>)
                };
                //
                // if (item.fieldName === "remarks") {
                //     obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                // }
                //billDate
                if (item.fieldName === "billDate") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => (prev.billDate == undefined ? 0 : new Date(prev.billDate.replace(/-/g,'/')).getTime())  - (next.billDate == undefined ? 0 : new Date(next.billDate.replace(/-/g,'/')).getTime());
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            categoryComponents: [],
            projectComponents: [],
            productComponents: [],
            customerComponents: [],
            supplierComponents: [],
            financeComponents: [],
            depEmployeeComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.financeInOut.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("report.financeInOut.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="paymentWithPurchaseAndSale"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="financeReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.reset()
                            }}                            exportCondition={this.state.condition}
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
                                sourceLabel={intl.get("report.financeInOut.source")}
                                sourceName={intl.get("report.financeInOut.sourceName")}
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
    reportDetail: state.getIn(['financeInoutReportIndex', 'financeInOutDetail']),
    incomeList: state.getIn(['auxiliaryIncome', 'incomeList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchFinanceInOutDetailReport,
        asyncFetchIncomeList,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)