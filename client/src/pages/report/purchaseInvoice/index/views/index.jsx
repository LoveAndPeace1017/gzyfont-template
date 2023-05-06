import React, {Component} from 'react';
import {
    Table, Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchPurchaseInvoiceDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions';
import {asyncFetchExpressList} from "pages/auxiliary/bill/actions";
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
        //获取数据
        this.props.asyncFetchExpressList("bill");
        if (this.defaultProdInfo) {
            this.generateReportForm();
        }
    }

    // 是否显示筛选条件
    toggleFilter = (callback) => {
        this.setState({
            filterToolBarVisible: !this.state.filterToolBarVisible
        }, ()=>{
            callback && callback();
        });
    };

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
            table:'dataPurchaseInvoice_list'
        };
        this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback);
    };


    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () => {
        const param = {...this.state.condition};
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
        this.props.asyncFetchPurchaseInvoiceDetailReport(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    }

    generateReportForm = () => {
        this.batchUpdateConfig(() => {
            const param = {...this.state.condition};
            for (const key in param) {
                if (!param[key]) {
                    delete param[key];
                }
            }
            this.setState({
                condition:param
            });
            this.props.asyncFetchPurchaseInvoiceDetailReport(param || {}, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail,billList} = this.props;
        let dataSource = reportDetail.getIn(['data', 'list']);
        const incomeListData = billList.getIn(['bill','data','data']);
        let option = incomeListData && incomeListData.map((item, index) => {
            return {
                label:item.get('paramName'),
                value:item.get('paramName'),
                key: index
            }
        }).toJS();

        dataSource = dataSource ? dataSource.toJS() : [];
        const pageColAmount = reportDetail.getIn(['data', 'pageColAmount']);
        const totalColAmount = reportDetail.getIn(['data', 'totalColAmount']);
        const pagePayAmount = reportDetail.getIn(['data', 'pagePayAmount']);
        const totalPayAmount = reportDetail.getIn(['data', 'totalPayAmount']);
        const filterConfigList = [
            {
                label: "report.purchaseInvoice.time",
                fieldName: 'time',
                fieldStartKey: 'startTime',
                fieldEndKey: 'endTime',
                visibleFlag: true,
                cannotEdit: true,
                type: 'datePicker',
                defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
            },
            // {
            //     label: "收入类型",
            //     fieldName: 'inType',
            //     visibleFlag: true,
            //     cannotEdit: true,
            //     financeType: 'inType',
            //     type: 'finance'
            // },
            // {
            //     label: "支出类型",
            //     fieldName: 'outType',
            //     visibleFlag: true,
            //     cannotEdit: true,
            //     financeType: 'outType',
            //     type: 'finance'
            // },
            {
                label: "report.purchaseInvoice.supplierName",
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
                label: "node.report.purchaseInvoice.invoiceType",
                fieldName: 'invoiceType',
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
                if (item.fieldName === "invoiceDate") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => new Date(prev.invoiceDate.replace(/-/g,'/')).getTime()  - new Date(next.invoiceDate.replace(/-/g,'/')).getTime();
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            inputNoBtnComponents:[
                {
                    label: "report.purchaseInvoice.displayBillNo",
                    fieldName: 'displayBillNo',
                },
            ],
            datePickerComponents: [],
            depEmployeeComponents: [],
            customComponents: [],
            intervalComponents: [],
            categoryComponents: [],
            projectComponents: [],
            productComponents: [],
            customerComponents: [],
            supplierComponents: [],
            financeComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.purchaseInvoice.getReport")}</Button>
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
                            title: intl.get("report.purchaseInvoice.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="dataPurchaseInvoice"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="purchaseInvoiceReport"
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
                                sourceLabel={intl.get("report.purchaseInvoice.source")}
                                sourceName={intl.get("report.purchaseInvoice.sourceName")}
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
    reportDetail: state.getIn(['purchaseInvoiceReportIndex', 'purchaseInvoiceDetail']),
    billList: state.getIn(['auxiliaryBill', 'billList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseInvoiceDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchExpressList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)