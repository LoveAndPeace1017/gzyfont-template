import React, {Component} from 'react';
import {
    Button, message, Modal
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchInventoryInquiryReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions'
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {actions as goodsDetailActions} from 'pages/goods/add';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import {parse} from "url";
import ListPage from  'components/layout/listPage'
import ReportHd from "components/business/reportHd";

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);
        const condition = {};
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
            condition
        };

    }

    componentDidMount() {
        this.props.asyncFetchPreData();
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
        let tableConfigList = reportDetail && reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        //过滤掉仓库字段
        const reg = /^warehouse\d+$/;
        tableConfigList = tableConfigList.filter(item=>{
            return !reg.test(item.fieldName)
        });

        let moduleType = {
            table:'repertory_detail_list'
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
            condition:param
        });

        this.props.asyncFetchInventoryInquiryReport(param, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    }

    generateReportForm = (params) => {
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

            this.props.asyncFetchInventoryInquiryReport(param, (data) => {
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

        const filterConfigList = [
            {
                label: "report.inventoryInquiry.catCode",
                fieldName: 'catCode',
                visibleFlag: true,
                cannotEdit: true,
                type: 'category'
            },
            {
                label: "goods.serialNumQuery.prodNo",
                fieldName: 'prodNo',
                visibleFlag: true,
                cannotEdit: true,
                defaultValue: this.defaultProdInfo,
                maxLength: 10,
                type: 'multProduct'
            },{
                label: "report.inventoryInquiry.repertoryQuantity",
                fieldName: 'repertoryQuantity',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: [
                    {label: ">0", value: '1'},
                    {label: "<=0", value: '0'}
                ]
            }];

        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        console.log(tableConfigList, 'tableConfigList');
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
            customerComponents: [],
            productComponents: [],
            multProductComponents: [],
            categoryComponents: [],
            projectComponents: [],
            supplierComponents: [],
            warehouseComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.inventoryInquiry.getReport")}</Button>
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
                            title: intl.get("report.inventoryInquiry.title")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="repertory_detail"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="inventoryInquiryReport"
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
                                sourceLabel={intl.get("report.inventoryInquiry.source")}
                                sourceName={intl.get("report.inventoryInquiry.sourceName")}
                                listIntroduce = {
                                    [
                                        '销售占用数量=销售订单未出库数量、可用数量=总库存-销售占用量-生产占用量',
                                        '采购在途数量=采购订单未入库数量、预计可用总量=可用数量+采购在途数量+在产数量',
                                    ]
                                }
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
    reportDetail: state.getIn(['inventoryReportInquiry', 'inventoryInquiry'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInventoryInquiryReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchPreData: outboundActions.asyncFetchPreData,
        asyncFetchGoodsById: goodsDetailActions.asyncFetchGoodsById
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)