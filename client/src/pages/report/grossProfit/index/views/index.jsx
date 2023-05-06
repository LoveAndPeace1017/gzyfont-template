import React, {Component} from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchGrossProfitDetailReport,
    asyncUpdateConfig
} from '../actions'

import {actions as commonActions} from 'components/business/commonRequest/index';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from 'components/layout/footerFixedBar'
import ReportHd from 'components/business/reportHd';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {parse} from "url";
import {message} from "antd/lib/index";
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
            prodData: {},
            condition
        };
    }


    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {}
        } else {
            params = {
                ...params,
                ...condition,
            }
        }
        this.setState({
            condition: params
        }, () => {
            if (performGenerate) {
                this.generateReportForm();
            }
        });
    };
    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage}, false, true);
    };

    doBackProductData = (item) => {
        this.setState({prodData: item})
    };


    batchUpdateConfig = (callback) => {
        const {reportDetail} = this.props;
        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            table:'wareProdProfit_list'
        };
        this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback);

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
            condition: param
        });
        console.log(param);
        this.props.asyncFetchGrossProfitDetailReport(param, (data) => {
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
                condition: param
            });
            console.log(param);
            this.props.asyncFetchGrossProfitDetailReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        })
    };


    render() {
        const {reportDetail} = this.props;

        let dataSource = reportDetail && reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        // const pageAmount = reportDetail.getIn(['data', 'pageAmount']);
        // const totalAmount = reportDetail.getIn(['data', 'totalAmount']);

        const filterConfigList = [{
            label: "report.grossProfit.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        }, {
            label: "report.grossProfit.catCode",
            fieldName: 'catCode',
            visibleFlag: true,
            cannotEdit: true,
            type: 'category'
        }, {
            label: "report.grossProfit.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'product'
        }, {
            label: "report.grossProfit.inventoryState",
            fieldName: 'inventoryState',
            cannotEdit: true,
            visibleFlag: true,
            defaultValue: '',
            type: 'select',
            options: [
                {label: "report.grossProfit.inventoryStateOption1", value: "1"},
                {label: "report.grossProfit.inventoryStateOption2", value: "0"}
            ]
        }];

        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail && reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
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

                // if (item.fieldName === "remarks" || item.fieldName === "prodName") {
                //     obj.render = (field) => (<span className={cx("txt-clip")} title={field}>{field}</span>)
                // }
                //profit
                if (item.fieldName === "profit") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.profit - next.profit;
                }
                //毛利润率
                if (item.fieldName === "profitRate") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => (prev.profitRate.substr(0, prev.profitRate.length - 1))/1 - (next.profitRate.substr(0, next.profitRate.length - 1))/1;
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            productComponents: [],
            categoryComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.grossProfit.getReport')}</Button>
            ]
        };
        filterConfigList.forEach(function (item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get('report.grossProfit.title')
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareProdProfit"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="grossProfitReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.reset()
                            }}
                            exportCondition={this.state.condition}
                            beforeExport={this.batchUpdateConfig}
                        />

                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       doBackProductData={this.doBackProductData}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>

                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            {/*<ReportHd*/}
                            {/*    sourceLabel={"数据来源"}*/}
                            {/*    sourceName={"入库单、出库单"}*/}
                            {/*/>*/}
                            <div className={cx('report-source')}>
                                <div className={cx("report-source-wrap")}>
                                    <InfoCircleFilled className={"blue"} />
                                    <span className={cx('source-tit')}> {intl.get('report.grossProfit.source')}</span>
                                    <span className={cx('source-content')}>{intl.get('report.grossProfit.sourceName')}</span>
                                    <div style={{paddingLeft: '18px'}}>
                                        <span className={cx('source-tit')}>{intl.get('report.grossProfit.remark')}</span>
                                    </div>
                                </div>

                            </div>
                            <ListTable
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
        );
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['grossProfitReportIndex', 'grossProfitDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGrossProfitDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig: commonActions.asyncBatchUpdateConfig
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)