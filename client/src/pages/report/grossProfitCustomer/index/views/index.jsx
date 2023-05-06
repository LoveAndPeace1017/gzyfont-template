import React, {Component} from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {
    asyncFetchGrossProfitCustomerDetailReport,
    asyncFetchGrossProfitCustomerTaskReport,
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
import ListPage from  'components/layout/listPage';
import AsynExport from 'components/business/asynExport';
import {SelectMultiCustomer} from "pages/customer/index";

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
        const param = {...this.state.condition};
        /*if(!param.customerName){
            message.error('至少选择一个客户,再进行导出操作！');
            return false;
        }*/
        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            table:'wareCustomerProdProfit_list'
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
        this.props.asyncFetchGrossProfitCustomerDetailReport(param, (data) => {
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
            /*if(!param.customerName){
                message.error('至少选择一个客户！');
                return false;
            }*/

            this.setState({
                condition: param
            });

            this.props.asyncFetchGrossProfitCustomerDetailReport(param, (data) => {
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
        },{
            label:"node.supplier.groupName1",
            fieldName: 'customerGroup',
            width:'200',
            visibleFlag: true,
            cannotEdit: true,
            type:'group',
            typeField: 'custom'
        },{
            label: "report.saleSummaryByCustomer.customerName",
            fieldName: 'customerName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'multiCustomer',
            maxLength: 10,
            /*require: true*/
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
                    render: (content) => (<span className={cx("txt-clip")} title={content}>{content}</span>)
                };
                tempColumns.push(obj);
            }
        });

        //处理customerName数据后端解析不了
        let condition = this.state.condition||{};
        let newCondition = JSON.parse(JSON.stringify(condition));
        let joinCustomerName = newCondition.customerName||[];
        newCondition["customerName"] = joinCustomerName.join(',');

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            productComponents: [],
            categoryComponents: [],
            multiCustomerComponents: [],
            groupComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.grossProfit.getReport')}</Button>,
                <AsynExport  condition={newCondition} clickFn={this.props.asyncFetchGrossProfitCustomerTaskReport}/>
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
                            title: "毛利润统计表（按客户）"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareCustomerProdProfit"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="grossProfitCustomerReport"
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
                                className={"report"}
                                columns={tempColumns}
                                dataSource={dataSource}
                                loading={this.props.reportDetail.get('isFetching')}
                                getRef={this.getRef}
                            />
                           {/* <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                />
                            </FooterFixedBar>*/}
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['grossProfitCustomerReportIndex', 'grossProfitCustomerDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGrossProfitCustomerDetailReport,
        asyncFetchGrossProfitCustomerTaskReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig: commonActions.asyncBatchUpdateConfig
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)