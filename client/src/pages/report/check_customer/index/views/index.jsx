import React, {Component} from 'react';
import {
    Table, Button, message
} from 'antd';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchSaleOutDetailReport,
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
import ReportHd from 'components/business/reportHd';
import moment from 'moment-timezone';
import intl from 'react-intl-universal';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'
const cx = classNames.bind(styles);
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';

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
            table:'wareSummaryBySaleOut_list'
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

        this.props.asyncFetchSaleOutDetailReport(param, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    };

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
            console.log(param);
            this.props.asyncFetchSaleOutDetailReport(param, (data) => {
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
        const pageAmount = reportDetail.getIn(['data', 'pageAmount']);
        const totalAmount = reportDetail.getIn(['data', 'totalAmount']);
        const filterConfigList = [{
            label: 'report.check_customer.time',
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        },
        {
            label: "report.sale.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            type: 'multProduct',
        }
        , {
            label: 'report.check_customer.customerName',
            fieldName: 'customerName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'customer'
        }, {
            label: 'report.check_customer.projName',
            fieldName: 'projName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'project'
        }, {
                label: 'node.report.check_customer.warehouseStatus',
                fieldName: 'warehouseStatus',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: "node.report.check_customer.warehouseStatusOption1", value: "1"},
                    {label: "node.report.check_customer.warehouseStatusOption0", value: "0"}
                ]
            }];
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['unitPrice','amount'];
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
                if(item.fieldName === "deliveryAddress"){
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = data.deliveryAddress?
                            data.deliveryProvinceText + data.deliveryCityText + deliveryAddress:'';
                        return (
                            <span className="txt-clip" title={fullAddr}>
                                {fullAddr}
                            </span>
                        )
                    };
                } else if(item.fieldName === "saleOrderDate"){
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => new Date(prev.saleOrderDate.replace(/-/g,'/')).getTime()  - new Date(next.saleOrderDate.replace(/-/g,'/')).getTime();
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
            inputNoBtnComponents:[
                {
                    label: "node.report.check_customer.displayBillNo",
                    fieldName: 'billNo',
                },
                {
                    label: "node.report.check_customer.customerOrderNo",
                    fieldName: 'customerOrderNo',
                },
            ],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.check_customer.getReport')}</Button>
            ]
        };
        filterConfigList.forEach(
            function(item) {
                item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
            }
        );

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[{title: intl.get('report.check_customer.title')}]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareSummaryBySaleOut"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="customerReport"
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
                                sourceLabel={intl.get('report.check_customer.source')}
                                sourceName={intl.get('report.check_customer.sourceName')}
                            />
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
        )
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['saleOutReportIndex', 'saleOutDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleOutDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)