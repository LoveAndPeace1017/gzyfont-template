import React, {Component} from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Button, message } from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import intl from 'react-intl-universal';

import {
    asyncFetchInactiveStockDetailReport,
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
import moment from "moment";
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
        };

    }

    componentDidMount() {
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
            table:'dullStuffForm_list'
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
        this.props.asyncFetchInactiveStockDetailReport(param || {}, (data) => {
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
            this.props.asyncFetchInactiveStockDetailReport(param || {}, (data) => {
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

        const filterConfigList = [{
            label: "report.inactiveStock.catCode",
            fieldName: 'catCode',
            visibleFlag: true,
            cannotEdit: true,
            type: 'category'
        }, {
            label: "report.inactiveStock.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'multProduct'
        }, {
            label: "report.inactiveStock.repertoryQuantityState",
            fieldName: 'repertoryQuantityState',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: ">0", value: '1'},
                {label: "<=0", value: '0'}
            ]
        }, {
            label: "report.inactiveStock.dullDaysState",
            fieldName: 'dullDaysState',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                {label: "report.inactiveStock.dullDaysStateOption1", value: '0'},
                {label: "report.inactiveStock.dullDaysStateOption2", value: '1'},
                {label: "report.inactiveStock.dullDaysStateOption3", value: '2'},
                {label: "report.inactiveStock.dullDaysStateOption4", value: '3'},
                {label: "report.inactiveStock.dullDaysStateOption5", value: '4'},
            ]
        }];
        let tableConfigList = reportDetail.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = reportDetail.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        const priceColumns = ['amount'];
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
                if(item.fieldName === "lastOutDate"){
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => (prev.lastOutDate == undefined ? 0 : new Date(prev.lastOutDate.replace(/-/g,'/')).getTime())  - (next.lastOutDate == undefined ? 0 : new Date(next.lastOutDate.replace(/-/g,'/')).getTime());
                }

                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            categoryComponents: [],
            multProductComponents: [],
            customerComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" loading={reportDetail && reportDetail.get('isFetching')} onClick={(reportDetail && !reportDetail.get('isFetching')) && this.generateReportForm}>{intl.get('report.inactiveStock.getReport')}</Button>
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
                            title: intl.get('report.inactiveStock.title')
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                            //onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="dullStuffForm"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            exportType="inactiveStockReport"
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
                            <div className={cx('report-source')}>
                                <div className={cx("report-source-wrap")}>
                                    <InfoCircleFilled className={"blue"} />
                                    <span className={cx('source-tit')}> {intl.get('report.inactiveStock.source')}</span>
                                    <span className={cx('source-content')}>{intl.get('report.inactiveStock.sourceName')}</span>
                                    <div style={{paddingLeft: '18px'}}>
                                        <span className={cx('source-tit')}> {intl.get('report.inactiveStock.remark')}</span>
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
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    reportDetail: state.getIn(['inactiveStockReportIndex', 'inactiveStockDetail'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInactiveStockDetailReport,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)