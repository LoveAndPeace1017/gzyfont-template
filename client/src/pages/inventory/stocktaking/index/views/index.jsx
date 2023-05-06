import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, message, Modal, Checkbox, Spin } from 'antd';

const {Content} = Layout;
const confirm = Modal.confirm;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchStocktakingList,
    asyncDeleteStocktakingInfo,
    asyncUpdateConfig,
    asyncFetchProdAbstractByBillNo,
    asyncBatchUpdateConfig,
    dealFilterConfigList
} from '../actions';
import {actions as commonActions} from "components/business/commonRequest";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import {ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'
import PageTurnLink from 'components/business/pageTurnLink';

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'stocktaking';

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            listToolBarVisible: true,
            contactRecordVisible: false,
            statistic: {
                count: 0,
                countMonth: 0,
                countToday: 0
            },
            assignWarehouseToSubAccountVisible: false,
            deleteRelatedRecord: false,
        }
    }
    fetchListData = (params,callback)=>{
        this.props.asyncFetchStocktakingList(params, callback);
    };

    componentDidMount() {
        let condition = this.state.condition;
        //初始化列表数据
        this.fetchListData(condition,(data) => {
            let filterConfigList = this.initFetchListCallback(data.filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
        });
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    // 批量更新字段配置
    batchUpdateConfig = (callback) => {
        const {stocktakingList} = this.props;
        let filterConfigList = stocktakingList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = stocktakingList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {
            'check':1,
        };
        let moduleType = {
            search:'allocCheck_search_list',
            table:'allocCheck_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };
    onDeleteConfirmChange = (e) => {
        this.setState({
            deleteRelatedRecord: e.target.checked
        });
    };

    setDeleteRelatedRecordFalse = () => {
        this.setState({
            deleteRelatedRecord: false
        });
    };

    deleteConfirm = (ids, checkStatus, callback) => {
        if (typeof checkStatus == 'function') {
            callback = checkStatus
        }
        // }else{
        //     if(checkStatus=='盘点中'){
        //         Modal.warning({
        //             title: '提示信息',
        //             content: '此仓库正在盘点，请先结束盘点再操作！',
        //         });
        //         return;
        //     }
        // }
        let _this = this;
        confirm({
            title: intl.get("stocktaking.index.index.warningTip"),
            content: <div>
                <p>{intl.get("stocktaking.index.index.deleteMsg1")}</p>
                {checkStatus != intl.get("stocktaking.index.index.onStocktaking") && <Checkbox onChange={this.onDeleteConfirmChange}>{intl.get("stocktaking.index.index.deleteMsg2")}</Checkbox>}
            </div>,
            onOk() {
                _this.props.asyncDeleteStocktakingInfo({
                    ids,
                    isCascaded: _this.state.deleteRelatedRecord ? 1 : 0
                }, function(res) {
                    _this.setDeleteRelatedRecordFalse();
                    if (res.retCode == '0') {
                        message.success(intl.get("stocktaking.index.index.operateSuccessMessage"));
                        _this.props.asyncFetchStocktakingList(_this.state.condition, () => _this.checkRemove());
                        if (callback) {
                            callback();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {
                _this.setDeleteRelatedRecordFalse();
            },
        });
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {stocktakingList} = this.props;
        const dataSource = stocktakingList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    render() {
        const {stocktakingList} = this.props;
        let dataSource = stocktakingList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = stocktakingList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = stocktakingList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = stocktakingList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                let obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName == "checkNo") {
                    obj.render = (checkNo, data) => {
                        return (
                            <React.Fragment>
                                    <span className={cx("txt-clip")} title={checkNo}>
                                        {/*<Link to={`/inventory/stocktaking/show/${data.checkNo}`}>{checkNo}</Link>*/}
                                        <PageTurnLink data={dataSource} type={"stocktaking"} linkdata={"checkNo"} showdata={"checkNo"} current={data}/>
                                    </span>
                            </React.Fragment>
                        )
                    }
                }
                if (item.fieldName == "checkDate") {
                    obj.render = (checkDate) => (<span>{moment(checkDate).format('YYYY-MM-DD')}</span>);
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.checkDate - next.checkDate;
                }
                if (item.fieldName == "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }
                if(item.fieldName == "checkStatus"){
                    obj.render = (checkStatus) => {
                        return intl.get(checkStatus)
                    }
                }
                if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.checkNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("stocktaking.index.index.prod_abstract")}</div>
                                                <ul>
                                                    {
                                                        data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                            <li key={index}>
                                                                <span className={cx('prod-tit')}>{item.prodName}</span>
                                                                <span className={cx('prod-desc')}>{item.descItem}</span>
                                                                <span className={cx('amount')}>x{item.actualNum}</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </Spin>
                                    </Menu.Item>

                                </Menu>
                            )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5" />
                            </span>
                        </Dropdown>
                    )
                }
                tempColumns.push(obj);
            }
        });
        console.log('tempColumns:', tempColumns);
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={<Menu>
                <DeleteMenu module={"stocktaking"}
                            clickHandler={() => this.deleteConfirm([data.checkNo], intl.get(data.checkStatus))}/>
                <ModifyMenu module={"stocktaking"} to={`/inventory/stocktaking/modify/${data.checkNo}`}
                            style={{display: intl.get(data.checkStatus) == intl.get("stocktaking.index.index.onStocktaking") ? 'block' : 'none'}}/>
                <Menu.Item style={{display: intl.get(data.checkStatus) == intl.get("stocktaking.index.index.onStocktaking") ? 'block' : 'none'}}>
                    <Link to={`/inventory/stocktaking/modify/${data.checkNo}`}>{intl.get("stocktaking.index.index.finishStock")}</Link>
                </Menu.Item>
            </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/inventory/stocktaking/',
                            title: intl.get("stocktaking.index.index.stocktaking")
                        },
                        {
                            title: intl.get("stocktaking.index.index.stocktakingList")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'allocCheck'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/inventory/stocktaking/add"
                            authModule={"stocktaking"}
                            searchTipsUrl={"/checks/search/tips"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchPlaceHolder={intl.get("stocktaking.index.index.searchPlaceHolder")}
                        />
                        <CheckResult
                            module={"stocktaking"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
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
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.stocktakingList.get('isFetching')}
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

            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    stocktakingList: state.getIn(['stocktakingIndex', 'stocktakingList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchStocktakingList,
        asyncDeleteStocktakingInfo,
        asyncUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)