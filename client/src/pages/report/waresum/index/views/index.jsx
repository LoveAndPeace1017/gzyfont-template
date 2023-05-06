import React, {Component} from 'react';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchWareSummaryReport,
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
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);

export class Index extends ListPage {
    constructor(props) {
        super(props);
        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            catCode: '',
            condition: {
                startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
                endTime: moment(new Date()).format("YYYY-MM-DD"),
                inventoryState: "1"
            }
        };
    }

    componentDidMount() {
        this.props.asyncFetchPreData();
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
            table:'wareSummaryByProd_list'
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
        console.log(param);
        this.props.asyncFetchWareSummaryReport(param, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    }

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
            console.log(param);
            this.props.asyncFetchWareSummaryReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail, preData} = this.props;
        const warehouses = preData && preData.getIn(['data', 'warehouses']);
        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        // let filterConfigList = reportDetail.getIn(['data', 'filterConfigList']);
        // filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        const filterConfigList = [
            {
                label: "report.waresum.time",
                fieldName: 'time',
                fieldStartKey: 'startTime',
                fieldEndKey: 'endTime',
                visibleFlag: true,
                cannotEdit: true,
                type: 'datePicker',
                defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
            },
            {
                label: "report.waresum.catCode",
                fieldName: 'catCode',
                visibleFlag: true,
                cannotEdit: true,
                type: 'category'
            },
            {
                label: "report.waresum.prodNo",
                fieldName: 'prodNo',
                visibleFlag: true,
                cannotEdit: true,
                type: 'multProduct'
            },
            {
                label: "report.inventory.projName",
                fieldName: 'projName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'project'
            },
            {
                label: "report.waresum.warehouseName",
                fieldName: 'warehouseName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'warehouse',
                options: warehouses
            },
            {
                label: "report.waresum.inventoryState",
                fieldName: 'inventoryState',
                cannotEdit: true,
                visibleFlag: true,
                defaultValue: "1",
                type: 'select',
                options: [
                    {label: "report.waresum.inventoryStateOption1", value: "1"},
                    {label: "report.waresum.inventoryStateOption2", value: "0"}
                ]
            },
            {
                label: "report.waresum.originalQuantityState",
                fieldName: 'originalQuantityState',
                cannotEdit: true,
                visibleFlag: true,
                type: 'select',
                options: [
                    {label: "report.waresum.originalQuantityStateOption1", value: "0"},
                    {label: "report.waresum.originalQuantityStateOption2", value: "1"}
                ]
            }
            // ,
            // {
            //     label: "项目",
            //     fieldName: 'projName',
            //     visibleFlag: true,
            //     cannotEdit: true,
            //     type: 'project'
            // }
        ];
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['enterAmount', 'outAmount'];
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
                            module={["purchasePrice", "salePrice"]}
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

                // if (item.fieldName === "remarks" || item.fieldName === "prodName") {
                //     obj.render = (field) => (<span className={cx("txt-clip")} title={field}>{field}</span>)
                // }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            categoryComponents: [],
            projectComponents: [],
            multProductComponents: [],
            customerComponents: [],
            warehouseComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.waresum.getReport")}</Button>
            ]
        };
        filterConfigList.forEach(
            function (item) {
                item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
            }
        );

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("report.waresum.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareSummaryByProd"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="waresumReport"
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
                                    sourceLabel={intl.get("report.waresum.source")}
                                    sourceName={intl.get("report.waresum.sourceName")}
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
    reportDetail: state.getIn(['wareSumReportIndex', 'wareSummary']),
    preData: state.getIn(['outboundOrderAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWareSummaryReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchPreData: outboundActions.asyncFetchPreData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)