import React, {Component} from 'react';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchInventoryDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchBusinessType
} from '../actions'
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';
import {actions as goodsDetailActions} from 'pages/goods/add';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {ReportSource} from 'pages/report/flowmeter/index';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {parse} from "url";
import {Modal} from "antd/lib/index";
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
        const serialNumber = searchQuery && searchQuery.query.serialNum;
        const purchaseBillNo = searchQuery && searchQuery.query.purchaseBillNo;  // 展示编号
        const saleBillNo = searchQuery && searchQuery.query.saleBillNo;

        const batchNo = searchQuery && searchQuery.query.batchNo; //批次号
        const warehouseName = searchQuery && searchQuery.query.warehouseName; //仓库
        const prodNo = searchQuery && searchQuery.query.prodNo; //物品编号
        const prodName = searchQuery && searchQuery.query.prodName; //物品名称


        if(purchaseBillNo){
            condition.purchaseBillNo = purchaseBillNo;
            this.purchaseBillNo = purchaseBillNo;
        }
        if(saleBillNo){
            condition.saleBillNo = saleBillNo;
            this.saleBillNo = saleBillNo;
        }
        if(serialNumber){
            condition.serialNumber = serialNumber;
            this.serialNumber = serialNumber
        }
        if(batchNo){
            condition.batchNo = batchNo;
            this.batchNo = batchNo
        }
        if(warehouseName){
            condition.warehouseName = warehouseName;
            this.warehouseName = warehouseName
        }
        if (prodNo) {
            condition.prodNo = prodNo;
            this.defaultProdInfo = [{prodNo, prodName, key: prodNo}];
        }

        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            employerData: [],
            condition,
            typeOptions: []
        };

    }

    componentDidMount() {
        this.getBusinessTypeInfo();
        this.props.asyncFetchPreData();
        this.props.asyncFetchDeptEmp();
        if (this.serialNumber || this.purchaseBillNo || this.saleBillNo || this.batchNo || this.warehouseName) {
            this.generateReportForm();
        }
    }

    getBusinessTypeInfo = () => {
        this.props.asyncFetchBusinessType(null, (res) => {
            let { enter, out } = res || {};
            let typeOptions = [];
            if(enter){
                _.forIn(enter, (value, key) => {
                    typeOptions.push({ value: `enter,${key}`, label: value});
                })
            }
           if(out){
               _.forIn(out, (value, key) => {
                   typeOptions.push({ value: `out,${key}`, label: value});
               })
           }
           this.setState({ typeOptions });
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
        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            table:'wareSummaryByDetail_list'
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

        this.props.asyncFetchInventoryDetailReport(param, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    };

    generateReportForm = (params) => {
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

            this.props.asyncFetchInventoryDetailReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });

        });
    };

    selectChange = (value)=>{
        const {deptEmployee} = this.props;
        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        let employeeList = [];
        deptData = deptData && deptData.map(item => {
             if(item.deptName == value){
                 employeeList = item.employeeList;
             }
        });
        let employeeData = employeeList.map(item => {
            return {
                label: item.employeeName,
                value: item.employeeName
            }
        });
        this.setState({employerData:employeeData});
    };


    render() {
        const {reportDetail, preData, deptEmployee} = this.props;

        const {typeOptions} = this.state;

        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        const warehouses = preData && preData.getIn(['data', 'warehouses']);
        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptName
            }
        });

        const filterConfigList = [{
            label: "report.inventory.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        }, {
            label: "report.inventory.catCode",
            fieldName: 'catCode',
            visibleFlag: true,
            cannotEdit: true,
            type: 'category'
        },
            {
                label: "report.inventory.prodNo",
                fieldName: 'prodNo',
                visibleFlag: true,
                cannotEdit: true,
                defaultValue: this.defaultProdInfo,
                type: 'multProduct'
            }, {
                label: "report.inventory.supplierName",
                fieldName: 'supplierName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'supplier'
            }, {
                label: "report.inventory.customerName",
                fieldName: 'customerName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'customer'
            }, {
                label: "report.inventory.type",
                fieldName: 'type',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: typeOptions
            }, {
                label: "report.inventory.warehouseName",
                fieldName: 'warehouseName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'warehouse',
                options: warehouses,
                defaultValue: this.warehouseName
            }, {
                label: "report.inventory.projName",
                fieldName: 'projName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'project'
            }, {
                label: "report.inventory.departmentName",
                fieldName: 'departmentName',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: deptData,
                onSelectChanges: this.selectChange
            }, {
                label: "report.inventory.usePerson",
                fieldName: 'usePerson',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                defaultValue: '',
                options: this.state.employerData
            }, {
                label: "report.inventory.serialNumber",
                fieldName: 'serialNumber',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full',
                defaultValue: this.serialNumber
            }, {
                label: "report.inventory.purchaseBillNo",
                fieldName: 'purchaseBillNo',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full',
                defaultValue: this.purchaseBillNo
            }, {
                label: "report.inventory.bacthNo",
                fieldName: 'batchNo',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full',
                defaultValue: this.batchNo
            }, {
                label: "report.inventory.saleBillNo",
                fieldName: 'saleBillNo',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full',
                defaultValue: this.saleBillNo
            }, {
                label: "report.inventory.enterOperator",
                fieldName: 'enterOperator',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full'
            }, {
                label: "report.inventory.outOperator",
                fieldName: 'outOperator',
                visibleFlag: true,
                cannotEdit: true,
                type: 'inputNoBtn',
                showType: 'full'
            }];

        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        let tempColumns = [];
        const priceColumns = ['enterProdTax', 'enterProdUntaxedAmount', 'enterAmount', 'outProdTax', 'outProdUntaxedAmount', 'outAmount'];
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

                if (item.fieldName === "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }

                if(item.fieldName === "productionDate" || item.fieldName === "expirationDate"){
                    obj.render = (date) => (<span>{date && moment(date).format('YYYY-MM-DD')}</span>);
                }

                if (item.fieldName === "billDate") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => (prev.billDate == undefined ? 0 : new Date(prev.billDate.replace(/-/g,'/')).getTime())  - (next.billDate == undefined ? 0 : new Date(next.billDate.replace(/-/g,'/')).getTime());
                }

                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            inputComponents: [],
            inputNoBtnComponents: [],
            selectComponents: [],
            datePickerComponents: [],
            customerComponents: [],
            multProductComponents: [],
            categoryComponents: [],
            projectComponents: [],
            supplierComponents: [],
            warehouseComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.inventory.getReport')}</Button>
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
                            title: intl.get('report.inventory.title')
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareSummaryByDetail"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="inventoryReport"
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
    preData: state.getIn(['outboundOrderAdd', 'preData']),
    deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
    reportDetail: state.getIn(['inventoryReportIndex', 'inventoryDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInventoryDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchBusinessType,
        asyncFetchPreData: outboundActions.asyncFetchPreData,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        asyncFetchGoodsById: goodsDetailActions.asyncFetchGoodsById
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)