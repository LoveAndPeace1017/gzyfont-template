import React, {Component} from 'react';
import {
    Table, Button
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchInventoryPriceDetailReport,
    asyncFetchInventoryPriceDetailTaskReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions'

import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import FilterToolBar from 'components/business/filterToolBar';
import AsynExport from 'components/business/asynExport';
import intl from 'react-intl-universal';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {parse} from "url";
import {message} from "antd/lib/index";
import ListPage from  'components/layout/listPage'


const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props){
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
    doBackProductData = (item) => {
        this.setState({prodData: item})
    };


   batchUpdateConfig = (callback)=>{
        const {reportDetail} = this.props;
        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
       let moduleType = {
           table:'wareInventoryPriceByProd_list'
       };
       this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback);

    };

    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () =>{
        const param = {...this.state.condition};
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition: param
        });
        this.props.asyncFetchInventoryPriceDetailReport(param, (data) => {
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
                condition: param
            });
            console.log(param);
            this.props.asyncFetchInventoryPriceDetailReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail} = this.props;

        let dataSource = reportDetail && reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        const pageAmount = reportDetail.getIn(['data', 'pageAmount']);
        const totalAmount = reportDetail.getIn(['data', 'totalAmount']);

        const filterConfigList = [{
            label: "report.inventoryPrice.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        },{
            label: "report.inventoryPrice.catCode",
            fieldName: 'catCode',
            visibleFlag: true,
            cannotEdit: true,
            type: 'category'
        },
        {
            label: "report.inventoryPrice.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'multProduct'
        }, {
            label: "report.inventoryPrice.finalQuantityState",
            fieldName: 'finalQuantityState',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            options:[
                {label:'report.inventoryPrice.finalQuantityStateOption1',value:'0'},
                {label:'report.inventoryPrice.finalQuantityStateOption2',value:'1'}
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

                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            multProductComponents: [],
            categoryComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.inventoryPrice.getReport")}</Button>,
                <AsynExport condition={this.state.condition} clickFn={this.props.asyncFetchInventoryPriceDetailTaskReport}/>
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
                            title: intl.get("report.inventoryPrice.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareInventoryPriceByProd"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="inventoryPriceReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.reset()
                            }}
                            exportCondition={this.state.condition}
                            beforeExport={this.batchUpdateConfig}
                        />

                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       doBackProductData = {this.doBackProductData}
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
    reportDetail: state.getIn(['inventoryPriceReportIndex', 'inventoryPriceDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInventoryPriceDetailReport,
        asyncFetchInventoryPriceDetailTaskReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)