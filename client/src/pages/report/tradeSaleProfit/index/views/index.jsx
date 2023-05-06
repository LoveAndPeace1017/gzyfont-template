import React, {Component} from 'react';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchTradeSaleProfitDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
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

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            condition
        };

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
            table:'saleTradeProfit_list',
            search:'saleTradeProfit_search_list',
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
        this.props.asyncFetchTradeSaleProfitDetailReport(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    };

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
            this.props.asyncFetchTradeSaleProfitDetailReport(param || {}, (data) => {
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

        const filterConfigList =filterConfigLists.concat([
        {
            label: "销售订单",
            fieldName: 'billNo',
            visibleFlag: true,
            cannotEdit: true,
            type: 'saleOrder'
        },{
            label: "report.saleTrace.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        },{
            label: "report.saleTrace.projName",
            fieldName: 'projName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'project'
        },{
            label: "node.sale.depEmployee",
            fieldName: 'depEmployee',
            visibleFlag: true,
            cannotEdit: true,
            type: 'depEmployee'
        }]);
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['taxAllAmount', 'discountAmount', 'aggregateAmount', 'currencyAggregateAmount', 'purchaseAmount', 'purchaseTax', 'profit'];
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
                            module="salePrice"
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
                if(item.fieldName === "saleOrderDate"){
                    obj.sorter = (prev, next) => new Date(prev.saleOrderDate.replace(/-/g,'/')).getTime()  - new Date(next.saleOrderDate.replace(/-/g,'/')).getTime();
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            saleOrderComponents: [],
            selectComponents: [],
            inputComponents:[],
            datePickerComponents: [],
            projectComponents: [],
            depEmployeeComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>生成报表</Button>
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
                            title: "外贸销售毛利表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="saleTradeProfit"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="tradeSaleProfitReport"
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
    reportDetail: state.getIn(['tradeSaleProfitReportIndex', 'tradeSaleProfitDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchTradeSaleProfitDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)