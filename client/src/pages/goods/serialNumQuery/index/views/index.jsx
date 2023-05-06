import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
    Button, message
} from 'antd';


import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import intl from 'react-intl-universal';
import {asyncFetchSerialNumQueryList} from '../actions';
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import FilterToolBar from 'components/business/filterToolBar';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
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

        let condition = {};
        const searchQuery = parse(props.location.search, true);
        const prodNo = searchQuery && searchQuery.query.prodNo;
        const prodName = searchQuery && searchQuery.query.prodName;
        if (prodNo) {
            condition.prodNo = prodNo;
            this.defaultProdInfo = [{prodNo, prodName, key: prodNo}]
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

    onSearch = (value) => {
        this.doFilter({key: value}, false, true);
        this.filterToolBarHanler.reset();
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage},false,true);
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1},false,true);
    };

    generateReportForm = () => {
        const param = {...this.state.condition};
        console.log(param, 'param');
        for (const key in param) {
            if (!param[key]) {
                delete param[key];
            }
        }
        this.setState({
            condition:param
        });
        this.props.asyncFetchSerialNumQueryList(param || {}, (data) => {
            if (data.retCode != 0) {
                message.error(data.retMsg);
            }
        });
    };


    render() {
        const {serialNumList, preData} = this.props;
        let dataSource = serialNumList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        const warehouses = preData && preData.getIn(['data','warehouses']);

        const filterConfigList = [
         {
            label: "goods.serialNumQuery.prodNo",
            fieldName: 'prodNo',
            visibleFlag: true,
            cannotEdit: true,
            defaultValue: this.defaultProdInfo,
            type: 'multProduct'
        }, {
            label: "goods.serialNumQuery.instoreStatus",
            fieldName: 'instoreStatus',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: [
                // {label: "全部状态", value: '0'},
                {label: "goods.serialNumQuery.instoreStatusOption1", value: '0'},
                {label: "goods.serialNumQuery.instoreStatusOption2", value: '1'},
            ]
        },{
            label: "goods.serialNumQuery.warehouseName",
            fieldName: 'warehouseName',
            visibleFlag: true,
            cannotEdit: true,
            type: 'warehouse',
            options: warehouses,
            defaultValue: this.state.condition.warehouseName
        }];

        let tableConfigList = serialNumList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = serialNumList.getIn(['data', 'pagination']);
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
                if (item.fieldName === "instoreStatus") {
                    obj.render = (instoreStatus, data) => {
                        return <span>{instoreStatus === 0 ? intl.get("goods.serialNumQuery.instoreStatusOption1"): intl.get("goods.serialNumQuery.instoreStatusOption2")}</span>
                    }
                } else if (item.fieldName === "warehouseName") {
                    obj.render = (warehouseName, data) => {
                        return <span>{data.instoreStatus === 0 ? warehouseName: '--'}</span>
                    }
                } else if (item.fieldName === "ope") {
                    obj.render = (ope, data) => {
                        return (
                            <React.Fragment>

                                <Link className={cx("ml10")} to={`/report/inventory/detail?serialNum=${data.serialNumber}`}>
                                    出入库明细
                                </Link>

                                <Link className={cx("ml10")} to={`/report/historicalTrace/detail?serialNumber=${data.serialNumber}&prodNo=${data.productCode}&prodName=${data.productName}`}>
                                    历史追溯
                                </Link>

                            </React.Fragment>
                        )
                    }
                }
                tempColumns.push(obj);
            }
        });

        const filterDataSource = {
            selectComponents: [],
            multProductComponents: [],
            warehouseComponents: [],
            suffixComponents: [
                <Button ga-data={'global-report-generate'} type="primary" onClick={this.generateReportForm}>{intl.get("goods.serialNumQuery.inquiry")}</Button>
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
                            title: intl.get("goods.serialNumQuery.crumb1")
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar visible={this.state.listToolBarVisible}
                                    onSearch={this.onSearch}
                                    onFilter={this.filterListData}
                                    filterToolBarVisible={this.state.filterToolBarVisible}
                                    searchPlaceHolder={'序列号'}
                                    defaultValue={this.state.condition.key}
                                    searchTipsUrl={`/goods/serialNumQuery/search/tips`}
                                    refresh={this.refresh}
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
                                columns={tempColumns}
                                dataSource={dataSource}
                                loading={this.props.serialNumList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
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
    serialNumList: state.getIn(['serialNumQueryIndex', 'serialNumQueryDetail']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSerialNumQueryList,
        asyncFetchPreData: outboundActions.asyncFetchPreData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)