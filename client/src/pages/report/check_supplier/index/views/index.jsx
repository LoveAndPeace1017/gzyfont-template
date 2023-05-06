import React, {Component} from 'react';
import {
    Table, Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchOrderInDetailReport,
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
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
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
            table:'wareSummaryByPurchaseEnter_list'
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
        this.props.asyncFetchOrderInDetailReport(param || {}, (data) => {
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
            console.log(param);
            this.props.asyncFetchOrderInDetailReport(param || {}, (data) => {
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
        // let filterConfigList = reportDetail.getIn(['data', 'filterConfigList']);
        // filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let customMap = reportDetail.getIn(['data', 'customMap']);
        customMap =  customMap ? customMap.toJS() : [];
        const filterConfigList = [{
            label: "report.check_supplier.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        }
            // , {
            //     label: "物品类目",
            //     fieldName: 'catCode',
            //     visibleFlag: true,
            //     cannotEdit: true,
            //     type: 'category'
            // }
            // , {
            //     label: "物品名称",
            //     fieldName: 'prodNo',
            //     visibleFlag: true,
            //     cannotEdit: true,
            //     type: 'product'
            // }
            , {
                label: "report.check_supplier.supplierName",
                fieldName: 'supplierName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'supplier'
            }, {
                label: "report.check_supplier.projName",
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
        const priceColumns = ['unitPrice', 'amount'];
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
                } else if(item.fieldName === "purchaseOrderDate"){
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => new Date(prev.purchaseOrderDate.replace(/-/g,'/')).getTime()  - new Date(next.purchaseOrderDate.replace(/-/g,'/')).getTime();
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            categoryComponents: [],
            projectComponents: [],
            productComponents: [],
            supplierComponents: [],
            inputNoBtnComponents:[
                {
                    label: "node.report.check_supplier.displayBillNo",
                    fieldName: 'billNo',
                },
            ],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.check_supplier.getReport')}</Button>
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
                    <Crumb data={[
                        {
                            title: intl.get('report.check_supplier.title')
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareSummaryByPurchaseEnter"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="supplierReport"
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
                                sourceLabel={intl.get('report.check_supplier.source')}
                                sourceName={intl.get('report.check_supplier.sourceName')}
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
    reportDetail: state.getIn(['orderInReportIndex', 'orderInDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOrderInDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)