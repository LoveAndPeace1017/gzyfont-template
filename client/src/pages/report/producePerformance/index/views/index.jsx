import React, {Component} from 'react';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchProducePerformanceDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';
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
            dateStart: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
            dateEnd: moment(new Date()).format("YYYY-MM-DD")
        };
        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            condition,
            employerData: []
        };
    }

    componentDidMount() {
        this.props.asyncFetchDeptEmp();
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
            table:'workForms_list'
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
            condition:param
        });
        console.log(param);
        this.props.asyncFetchProducePerformanceDetailReport(param || {}, (data) => {
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
            this.props.asyncFetchProducePerformanceDetailReport(param || {}, (data) => {
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
            if(item.deptId == value){
                employeeList = item.employeeList;
            }
        });
        let employeeData = employeeList.map(item => {
            return {
                label: item.employeeName,
                value: item.id
            }
        });

        this.setState({employerData:employeeData});
    };


    render() {
        const {reportDetail,deptEmployee} = this.props;
        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        let filterConfigLists = reportDetail.getIn(['data', 'filterConfigList']);
        filterConfigLists = filterConfigLists ? filterConfigLists.toJS() : [];

        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptId
            }
        });

        const filterConfigList = filterConfigLists.concat([
            {
                label: "node.produceOrder.departmentName1",
                fieldName: 'departmentId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: deptData,
                onSelectChanges: this.selectChange
            }, {
                label: "node.produceOrder.employeeName1",
                fieldName: 'employeeId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                defaultValue: '',
                options: this.state.employerData
            },
            {
                label: "report.purchase.time",
                fieldName: 'time',
                fieldStartKey: 'dateStart',
                fieldEndKey: 'dateEnd',
                visibleFlag: true,
                cannotEdit: true,
                type: 'datePicker',
                defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
            },{
                label: "report.sale.work",
                fieldName: 'caCode',
                visibleFlag: true,
                cannotEdit: true,
                type: 'work'
            }, {
                label: "node.report.producePerformance.prodName",
                fieldName: 'prodNo',
                visibleFlag: true,
                cannotEdit: true,
                type: 'multProduct'
            },{
                label: "node.report.producePerformance.group",
                fieldName: 'group',
                visibleFlag: true,
                cannotEdit: true,
                notNormalOption: true,
                type:'select',
                options: [
                    {label: "按员工合并", value: "0"},
                    {label: "按工序合并", value: "1"},
                    {label: "按工单合并", value: "2"}
                ]
            }
         ]);

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
                    columnType: item.columnType,
                    render: (content) => (<span className={cx("txt-clip")} title={content}>{content}</span>)
                };
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            datePickerComponents: [],
            selectComponents: [],
            workComponents: [],
            multProductComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.purchaseTrace.getReport")}</Button>
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
                            title: "生产绩效统计表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="workForms"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="producePerformanceReport"
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
                                sourceName={"各工单以及关联报工数据"}
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
    reportDetail: state.getIn(['producePerformanceReportIndex', 'producePerformanceDetail']),
    deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProducePerformanceDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)