import React, {Component} from 'react';
import { Modal, Button, message } from 'antd';
import {
    asyncFetchBatchQueryReport,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import PrintArea from 'components/widgets/printArea';
import ReportHd from 'components/business/reportHd';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar';
import ModifyBatchQuery from './modify';
import ModifyRecord from './modifyRecord';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {parse} from "url";
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage'
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Link} from 'react-router-dom';
const cx = classNames.bind(styles);

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let condition = {};
        const searchQuery = parse(props.location.search, true);
        const productCode = searchQuery && searchQuery.query.productCode;
        //const prodName = searchQuery && searchQuery.query.prodName;
        if (productCode) {
            const storage = window.localStorage;
            let prods= storage.getItem("batchqueryprods");
            let prodInfo = [];
            if(prods){
                let prodAry = prods.split('|');
                if(prodAry.length>0){
                    for(let i=0;i<prodAry.length;i++){
                        if(prodAry[i]){
                            let obj = {
                                prodNo:prodAry[i].split(',')[0],
                                key: prodAry[i].split(',')[0],
                                prodName: prodAry[i].split(',')[1],
                            }
                            prodInfo.push(obj);
                        }
                    }
                }
            }
            condition.productCode = productCode;
            this.defaultProdInfo = (prodInfo&&prodInfo)|| [];
        }
        this.state = {
            listToolBarVisible: true,
            filterToolBarVisible: true,
            modifyVisible: false,  // 修改批次
            modifyRecordVisible: false,  // 批次修改记录
            currentIdx: null,  // 当前修改的索引
            mrProductCode: null,  // 批次修改记录对应的物品编号
            mrBatchNo: null,  // 批次修改记录对应的批次号
            condition
        };
    }

    componentDidMount() {
        this.props.asyncFetchPreData();
        if (this.defaultProdInfo) {
            this.generateReportForm();
        }
    }
    componentWillUnmount() {
        const storage = window.localStorage;
        storage.removeItem("batchqueryprods");
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

    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    // 修改保值期
    modifyBatchQuery = (idx) => {
        console.log(idx,'idxs');
        this.setState({
            modifyVisible: true,
            currentIdx: idx
        })
    };

    // 提交修改保存操作
    handleModifyOnOk = () => {
        this.closeModal('modifyVisible');
        this.generateReportForm();
    };

    openModifyRecord = (productCode, batchNo) => {
        this.setState({
            modifyRecordVisible: true,
            mrProductCode: productCode,
            mrBatchNo: batchNo
        })
    };

    batchUpdateConfig = (callback) => {
        const {reportDetail} = this.props;
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            table:'BatchNo_list'
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
        console.log(param);
        this.props.asyncFetchBatchQueryReport(param, (data) => {
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
            this.props.asyncFetchBatchQueryReport(param, (data) => {
                if (data.retCode != 0) {
                    message.error(data.retMsg);
                }
            });
        });
    };


    render() {
        let {modifyVisible, modifyRecordVisible, currentIdx, mrProductCode, mrBatchNo} = this.state;

        const {reportDetail,preData} = this.props;
        const warehouses = preData && preData.getIn(['data','warehouses']);
        let dataSource = reportDetail.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let modifyData = dataSource[currentIdx] || {};

        console.log(modifyData,'modifyData');

        const pageAmount = reportDetail.getIn(['data', 'pageAmount']);
        const totalAmount = reportDetail.getIn(['data', 'totalAmount']);
        const filterConfigList = [{
            label: "goods.serialNumQuery.warehouseName",
            fieldName: 'warehouseName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'warehouse',
            options: warehouses,
            defaultValue: this.state.condition.warehouseName
        },{
            label: "goods.serialNumQuery.prodNo",
            fieldName: 'productCode',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'multProduct'
        },{
            label: "report.batchQuery.time1",
            fieldName: 'expirationDate',
            fieldStartKey: 'expirationDateStart',
            fieldEndKey: 'expirationDateEnd',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker'
        },{
            label: "report.batchQuery.time2",
            fieldName: 'productionDate',
            fieldStartKey: 'productionDateStart',
            fieldEndKey: 'productionDateEnd',
            visibleFlag: true,
            cannotEdit: true,
            type: 'datePicker'
        }, {
            label: "report.batchQuery.currentQuantityFlag",
            fieldName: 'currentQuantityFlag',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: ">0", value: '1'},
                {label: "<=0", value: '2'}
            ]
        }];
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

                if(item.fieldName === "productionDate" || item.fieldName === "expirationDate"){
                    obj.render = (data) => {
                        return (<span>{moment(data).format('YYYY-MM-DD')}</span>)
                    }
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            width: 260,
            fixed: 'right',
            render: (operation, data, index) => {
                return (
                    <React.Fragment>
                        <Auth option='main'>
                            {
                                (isAuthed) => isAuthed ?(
                                    <a href="#!" onClick={() => this.modifyBatchQuery(index)}>修改</a>
                                ): (
                                    <a href="#!" className={cx("ml10")} style={{color:  '#ccc'}} disabled>修改</a>
                                )
                            }
                        </Auth>

                        <a href="#!" className={cx("ml10")} onClick={() => this.openModifyRecord(data.productCode, data.batchNo)}>修改记录</a>

                        <Link className={cx("ml10")} to={`/report/inventory/detail?prodNo=${data.productCode}&prodName=${data.name}&warehouseName=${data.warehouseName}&batchNo=${data.batchNo}`}>
                            出入库明细
                        </Link>

                        <Link className={cx("ml10")} to={`/report/historicalTrace/detail?prodNo=${data.productCode}&prodName=${data.name}&batchNo=${data.batchNo}`}>
                            历史追溯
                        </Link>

                    </React.Fragment>
                )
            }
        };

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            warehouseComponents: [],
            inputNoBtnComponents:[
                {
                    label: "report.batchQuery.title",
                    fieldName: 'batchNo',
                    width: 200
                }
            ],
            multProductComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get("report.purchase.getReport")}</Button>
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
                            url: '/goods/',
                            title: intl.get("goods.serialNumQuery.crumb")
                        },
                        {
                            title: intl.get("goods.serialNumQuery.crumb2")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="BatchNo"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="batchQuery"
                            onReset={()=> {
                                this.filterToolBarHanler && this.filterToolBarHanler.doReset()
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
                            <PrintArea>
                                <ReportHd
                                    sourceLabel={intl.get("report.purchase.source")}
                                    sourceName={intl.get('report.inventory.title1')}
                                />
                                <ListTable
                                    columns={tempColumns}
                                    operationColumn={operationColumn}
                                    dataSource={dataSource}
                                    loading={this.props.reportDetail.get('isFetching')}
                                    getRef={this.getRef}
                                />
                            </PrintArea>
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            /*onShowSizeChange={this.onShowSizeChange}*/
                                />
                            </FooterFixedBar>
                        </div>
                    </div>

                </div>

                <Modal
                    title={'修改保质日期'}
                    visible={modifyVisible}
                    onCancel={() => this.closeModal('modifyVisible')}
                    width={800}
                    destroyOnClose={true}
                    footer={null}
                >
                    <ModifyBatchQuery
                        onOk={this.handleModifyOnOk}
                        onCancel={() => this.closeModal('modifyVisible')}
                        data={modifyData}
                    />
                </Modal>

                <Modal
                    title={'批次修改记录'}
                    visible={modifyRecordVisible}
                    onCancel={() => this.closeModal('modifyRecordVisible')}
                    width={1400}
                    destroyOnClose={true}
                >
                    <ModifyRecord
                        productCode={mrProductCode}
                        batchNo={mrBatchNo}
                    />
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    preData:  state.getIn(['outboundOrderAdd', 'preData']),
    reportDetail: state.getIn(['batchQueryIndex', 'batchQuery'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData: outboundActions.asyncFetchPreData,
        asyncFetchBatchQueryReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)