import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Modal, Menu, Dropdown, message, Spin,Checkbox} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {
    DownOutlined
} from '@ant-design/icons';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {actions as outboundActions} from 'pages/inventory/outbound/add';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {Link, withRouter} from 'react-router-dom';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {
    asyncFetchSubcontractList,
    asyncFetchProdAbstractByBillNo,
    asyncDeleteSubcontractInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    dealFilterConfigList
} from '../actions';

import {
    WareEnterBatchEdit,
    FinanceExpendBatchEdit,
    FinanceInvoiceBatchEdit
} from 'components/business/batchEditPop';

import {actions as commonActions} from "components/business/commonRequest";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import {actions as operActions} from 'components/business/operateOrder';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage';
import {getUrlParamValue} from 'utils/urlParam';

const cx = classNames.bind(styles);
let initParams = {
    condition: {
        startTime: moment(new Date().setDate(1)).format("YYYY-MM-DD"),
        endTime: moment(new Date()).format("YYYY-MM-DD"),
    },
    selectedRowKeys: [],
    selectedRow: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'subcontract';


const mapStateToProps = (state) => ({
    subcontractList: state.getIn(['subcontractIndex', 'subcontractList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSubcontractList,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchProdAbstractByBillNo,
        asyncDeleteSubcontractInfo,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
export default class Index extends ListPage {

    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            listToolBarVisible: true,
            deleteRelatedRecord: false,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchSubcontractList(params, callback);
    };

    componentDidMount() {
        this.fetchListData();
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    batchUpdateConfig = (callback) => {
        const {subcontractList} = this.props;
        let filterConfigList = subcontractList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = subcontractList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            search:'outsource_search_list',
            table:'outsource_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,{},moduleType,callback);
    };

    onDeleteConfirmChange = (e) => {
        this.setState({
            deleteRelatedRecord: e.target.checked
        });
    };

    deleteConfirm = (ids, callback, source) => {
        let _this = this;
        let prefix = source||'list';
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div>
                <p>删除单据后无法恢复，确定删除吗</p>
                <Checkbox onChange={this.onDeleteConfirmChange}>同时删除关联的出入库单</Checkbox>
            </div>,
            okButtonProps:{
                'ga-data':prefix +'-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix +'-delete-cancel'
            },
            onOk() {
                _this.props.asyncDeleteSubcontractInfo({ids,isCascaded: _this.state.deleteRelatedRecord ? 1 : 0}, function(res) {
                    if (res.retCode === '0') {
                        message.success(intl.get("purchase.index.index.deleteSuccessMessage"));
                        _this.fetchListData(_this.state.condition, () => _this.checkRemove());
                        if (callback) {
                            callback();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        this.deleteConfirm(this.state.selectedRowKeys,function() {
            _this.checkRemove();
        },'batch');
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {subcontractList} = this.props;
        const dataSource = subcontractList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };

    render() {
        const {subcontractList} = this.props;
        let dataSource = subcontractList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = subcontractList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = subcontractList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = subcontractList.getIn(['data', 'pageAmount']);
        const totalAmount = subcontractList.getIn(['data', 'totalAmount']);

        let paginationInfo = subcontractList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
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
                if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')  + ' list-prodAbstract'}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("purchase.index.index.prod_abstract")}</div>
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
                                <span className={cx("txt-desc-no") + ' txt-clip'}
                                      title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }else if (item.fieldName === "orderDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    obj.sorter = (prev, next) => prev.saleOrderDate - next.saleOrderDate;

                }else if (item.fieldName === "displayBillNo") {
                    obj.render = (billNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={billNo}>
                                    <Link ga-data="list-billNo" to={`/subcontract/show/${data.billNo}`}>{billNo}</Link>
                                </span>
                            </React.Fragment>
                        )
                    }

                }else if (item.fieldName === "inState") {
                    obj.render = (inState, data) => {
                        return (
                            <React.Fragment>
                                {
                                    inState == 0?<span className={cx("txt-clip")}>未完成入库</span>:<span className={cx("txt-clip")}>已完成入库</span>
                                }

                            </React.Fragment>
                        )
                    }

                }else if (item.fieldName === "outState") {
                    obj.render = (outState, data) => {
                        return (
                            <React.Fragment>
                                {
                                    outState == 0?<span className={cx("txt-clip")}>未完成出库</span>:<span className={cx("txt-clip")}>已完成出库</span>
                                }

                            </React.Fragment>
                        )
                    }

                }else {
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => {
                let menuStr = (
                    <Menu>

                        <DeleteMenu module={"purchase"} clickHandler={() => this.deleteConfirm([data.billNo])}/>
                        {
                            data.canMod?<ModifyMenu module={"customer"} to={`/subcontract/modify/${data.billNo}`}/>:null
                        }

                    </Menu>
                );
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            warehouseComponents: [],
            inputComponents:[]
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });


        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/subcontract/',
                            title: "委外加工"
                        },
                        {
                            title: "委外加工列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'outsource'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addClickHandler={() => {
                                this.props.vipTipPop({source:"subContract",onTryOrOpenCallback:()=>{
                                        this.props.history.push('/subcontract/add');
                                    }})
                            }}
                            authModule={"purchase"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/outsource/search/tips`}
                            searchTipsUrlPrefix = {`/cgi/`}
                            searchPlaceHolder={intl.get("purchase.index.index.searchPlaceHolder1")}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"purchase"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
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
                                loading={this.props.subcontractList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Amount module="purchasePrice" pageAmount={pageAmount} totalAmount={totalAmount}/>
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

