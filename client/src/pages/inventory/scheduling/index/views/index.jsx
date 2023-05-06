import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import { Layout, Modal, Checkbox, Menu, Dropdown, Spin } from 'antd';

const {Content} = Layout;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchSchedulingList,
    asyncToggleSchedulingInfo,
    asyncDeleteSchedulingInfo,
    asyncFetchStatistic,
    asyncUpdateConfig,
    asyncFetchProdAbstractByBillNo,
    asyncBatchUpdateConfig,
    dealFilterConfigList
} from '../actions';
import {actions as commonActions} from "components/business/commonRequest";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import PageTurnLink from 'components/business/pageTurnLink';

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
// import StatisticMenu from 'components/business/statisticMenu';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import {DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'scheduling';

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            listToolBarVisible: true,
            statistic: {
                count: 0,
                countMonth: 0,
                countToday: 0
            },
            deleteRelatedRecord: false,
        }
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchSchedulingList(params, callback);
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
        const {schedulingList} = this.props;
        let filterConfigList = schedulingList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = schedulingList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {
            'alloc':1,
        };
        let moduleType = {
            search:'allocWare_search_list',
            table:'allocWare_list'
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


    deleteConfirm = (ids, callback) => {
        let self = this;
        Modal.confirm({
            title: intl.get("schedule.index.index.warningTip"),
            okText: intl.get("schedule.index.index.okText"),
            cancelText: intl.get("schedule.index.index.cancelText"),
            content: <div>
                <p>{intl.get("schedule.index.index.deleteMsg1")}</p>
                <Checkbox onChange={this.onDeleteConfirmChange}>{intl.get("schedule.index.index.deleteMsg2")}</Checkbox>
            </div>,
            onOk() {
                self.props.asyncDeleteSchedulingInfo({
                    ids,
                    isCascaded: self.state.deleteRelatedRecord ? 1 : 0
                }, res => {
                    self.setDeleteRelatedRecordFalse();
                    if (res.retCode == 0) {
                        Modal.success({
                            title: intl.get("schedule.index.index.warningTip"),
                            content: intl.get("schedule.index.index.deleteSuccessMessage")
                        });
                        self.props.asyncFetchSchedulingList(self.state.condition, () => self.checkRemove());
                        if (callback) {
                            callback();
                        }
                    }
                    else {
                        Modal.error({
                            title: intl.get("schedule.index.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                });
            },
            onCancel() {
            },
        });
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {schedulingList} = this.props;
        const dataSource = schedulingList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    render() {
        const {schedulingList} = this.props;
        let dataSource = schedulingList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = schedulingList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = schedulingList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = schedulingList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                var obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName == "displayBillNo") {
                    obj.render = (displayBillNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={displayBillNo}>
                                   {/* <Link to={`/inventory/scheduling/show/${data.billNo}`}>{displayBillNo}</Link>*/}
                                    <PageTurnLink data={dataSource} type={"scheduling"} linkdata={"billNo"} showdata={"displayBillNo"} current={data}/>
                                </span>
                            </React.Fragment>
                        )
                    }
                }
                if (item.fieldName == "allocDate") {
                    obj.render = (allocDate) => (<span>{moment(allocDate).format('YYYY-MM-DD')}</span>);
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.allocDate - next.allocDate;
                }
                if (item.fieldName == "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }
                if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("schedule.index.index.prod_abstract")}</div>
                                                <ul>
                                                    {
                                                        data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                            <li key={index}>
                                                                <span className={cx('prod-tit')}>{item.prodName}</span>
                                                                <span className={cx('prod-desc')}>{item.descItem}</span>
                                                                <span className={cx('amount')}>x{item.quantity}</span>
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

        const operationColumn = {
            width: 70,
            render: (operation, data) =>
                <DeleteMenu module={"scheduling"} clickHandler={() => this.deleteConfirm([data.billNo])}/>
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
                            title: intl.get("schedule.index.index.schedule")
                        },
                        {
                            title: intl.get("schedule.index.index.scheduleList"),
                            url: '/inventory/scheduling/',
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'allocWare'}
                        />
                        {/*<StatisticMenu linkList={linkList} statistic={this.state.statistic} moduleName={"客户"} />*/}
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/inventory/scheduling/add"
                            authModule={"scheduling"}
                            searchTipsUrl={"/allocwares/search/tips"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchPlaceHolder={intl.get("schedule.index.index.searchPlaceHolder")}
                        />
                        <CheckResult
                            module={"scheduling"}
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
                                loading={this.props.schedulingList.get('isFetching')}
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
    schedulingList: state.getIn(['schedulingIndex', 'schedulingList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSchedulingList,
        asyncToggleSchedulingInfo,
        asyncDeleteSchedulingInfo,
        asyncFetchStatistic,
        asyncUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)