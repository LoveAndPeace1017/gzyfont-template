import React, {Component} from 'react';
import {
    Button, message, Modal
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {parse} from "url";

import {
    asyncFetchFlowmeterDetailReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions';
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {actions as goodsDetailActions} from 'pages/goods/add';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import intl from 'react-intl-universal';

import {ReportSource} from 'pages/report/flowmeter/index';
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

    componentDidMount() {
        this.props.asyncFetchPreData((data)=>{

            //获取常用仓库
            const warehouses = data.warehouses;
            const defaultWarehouse = warehouses.filter(item=> item.isCommon === 1);
            const defaultWarehouseName = defaultWarehouse.length ===1? defaultWarehouse[0].name:'';
            this.setState({
                condition: { ...this.state.condition, warehouseName: defaultWarehouseName}
            },()=>{
                //有物品信息才会自动生成
                this.defaultProdInfo && this.generateReportForm();
            });
        });

        if (this.defaultProdInfo) {
            this.props.asyncFetchGoodsById(this.defaultProdInfo.prodNo, (res) => {
                let errorMsg = res.getIn(['data', 'retCode']) !== 0 && res.getIn(['data', 'retMsg']);
                if (errorMsg) {
                    Modal.info({
                        title: intl.get('common.confirm.title'),
                        content: errorMsg
                    });
                }
                else {
                    this.setState({
                        prodData: {
                            prodNo: res.getIn(['data', 'displayCode']),
                            description: res.getIn(['data', 'description']),
                            unit: res.getIn(['data', 'unit']),
                            prodName: res.getIn(['data', 'name'])
                        }
                    })
                }

            });
        }
    }



    doFilter = (condition, resetFlag, performGenerate) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = {}
        }else {
            if (condition)
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
            table:'wareFlowByProd_list'
        };
        this.batchUpdateConfigSuper(null,tableConfigList,null, moduleType,callback);
    };


    refresh = () => {
        this.refreshReportForm();
    };

    refreshReportForm = () => {
        if (!this.state.condition.prodNo || !this.state.condition.warehouseName) {
            message.info(intl.get('report.flowmeter.tip1'));
            return ;
        }
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
        this.props.asyncFetchFlowmeterDetailReport(param, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });

    }


    generateReportForm = () => {
        if (!this.state.condition.prodNo || !this.state.condition.warehouseName) {
            message.info(intl.get('report.flowmeter.tip1'));
            return ;
        }

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
            this.props.asyncFetchFlowmeterDetailReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        const {reportDetail, preData} = this.props;
        const {prodData} = this.state;
        let dataSource = reportDetail && reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        const warehouses = preData && preData.getIn(['data','warehouses']);

        const filterConfigList = [{
            label: "report.flowmeter.time",
            fieldName: 'time',
            fieldStartKey: 'startTime',
            fieldEndKey: 'endTime',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker',
            defaultValue: [moment(new Date().setDate(1)), moment(new Date())]
        }, {
            label: "report.flowmeter.prodName",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'product'
        },{
            label: "report.flowmeter.warehouseName",
            fieldName: 'warehouseName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'warehouse',
            options: warehouses,
            defaultValue: this.state.condition.warehouseName
        }];

        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['enterprodAmount', 'outprodAmount'];
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

                if (item.fieldName === "inventoryDate") {
                    obj.render = (inventoryDate, item) => (<span className={cx({'grey': item.key==0})}>{inventoryDate}</span>)
                }
                if (item.fieldName === "inventoryNum") {
                    obj.render = (inventoryNum, item) => (<span className={cx({'grey': item.key==0})}>{inventoryNum}</span>)
                }

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

                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            datePickerComponents: [],
            productComponents: [],
            warehouseComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.flowmeter.getReport')}</Button>
            ]
        };
        filterConfigList.forEach(function (item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        const prodSourceName = intl.get('report.flowmeter.title1');

        const prodInfoClassNames = "report-note";

        const prodInfoData = prodData && [{
            name: intl.get('report.flowmeter.prodName'),
            value: prodData.prodName
        }, {
            name: intl.get('report.flowmeter.prodNo'),
            value: prodData.displayCode
        }, {
            name: intl.get('report.flowmeter.description'),
            value: prodData.description
        }, {
            name: intl.get('report.flowmeter.unit'),
            value: prodData.unit
        }];

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get('report.flowmeter.title')
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="wareFlowByProd"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="flowmeterReport"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.reset()
                            }}                            exportCondition={this.state.condition}
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
                            <ReportSource prodSourceName={prodSourceName}  prodInfoClassNames={prodInfoClassNames}  prodInfoData={prodInfoData}/>
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
    preData:  state.getIn(['outboundOrderAdd', 'preData']),
    reportDetail: state.getIn(['flowmeterReportIndex', 'flowmeterDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchFlowmeterDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchPreData: outboundActions.asyncFetchPreData,
        asyncFetchGoodsById: goodsDetailActions.asyncFetchGoodsById
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)