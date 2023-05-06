import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import intl from 'react-intl-universal';
import {Modal, Menu, Dropdown, message, Spin, Checkbox} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';
import {asyncFetchProduceOrderList, asyncDeleteProduceOrderInfo, asyncUpdateConfig, asyncBatchUpdateConfig, dealFilterConfigList, asyncFetchProdAbstractByBillNo} from '../actions';
import {actions as projectActions} from 'pages/auxiliary/project';
import {actions as commonActions} from "components/business/commonRequest";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import ListPage from  'components/layout/listPage';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {getUrlParamValue} from 'utils/urlParam';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    selectedRow: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'produceOrder';

const mapStateToProps = (state) => ({
    produceOrderList: state.getIn(['produceOrderIndex', 'produceOrderList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition']),
    deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
    projectList: state.getIn(['auxiliaryProject', 'projectList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProduceOrderList,
        asyncDeleteProduceOrderInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchProdAbstractByBillNo,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
        asyncFetchProjectList: projectActions.asyncFetchProjectList,
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
            employerData: [],
            projectData: [],
            produceType: null,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchProduceOrderList(params, (res) => {
            callback && callback(res);
        });
    };

    fetchProjectList = () => {
        this.props.asyncFetchProjectList(null, (res) => {
            let projectData = res.data.map(item => {
                return {
                    label: item.projectName,
                    value: item.id
                }
            });
            this.setState({projectData});
        });
    };

    componentDidMount() {
        let params = new URLSearchParams(this.props.location.search);
        let produceType = params && params.get('produceType') || "";
        let condition = this.state.condition;
        produceType && (condition.produceType = produceType);

        this.props.asyncFetchDeptEmp();
        this.fetchProjectList();
        //初始化列表数据
        this.fetchListData(condition,() => {
            this.setState({ produceType });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        let preParams = new URLSearchParams(prevProps.location.search);
        let params = new URLSearchParams(this.props.location.search);
        let preProduceType = preParams && preParams.get('produceType') || "";
        let produceType = params && params.get('produceType') || "";
        if(produceType!==preProduceType){
            window.location.reload();
        }
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    batchUpdateConfig = (callback) => {
        const {produceOrderList} = this.props;
        let filterConfigList = produceOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = produceOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            search:'workProduce_search_list',
            table:'workProduce_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,{},moduleType,callback);
    };


    deleteConfirm = (ids, callback, source) => {
        let _this = this;
        let prefix = source||'list';
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div>
                <p>删除单据后无法恢复，确定删除吗?</p>
            </div>,
            okButtonProps:{
                'ga-data':prefix +'-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix +'-delete-cancel'
            },
            onOk() {
                _this.props.asyncDeleteProduceOrderInfo({ids}, function(res) {
                    if (res.retCode === '0') {
                        message.success('删除成功!');
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

    modifyConfirm = (flag, billNo) => {
        if(flag){
            message.error('已完成或存在关联单据无法修改');
            return;
        }
        this.props.history.push(`/produceOrder/modify/${billNo}`);
    };

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        this.deleteConfirm(this.state.selectedRowKeys,function() {
            _this.checkRemove();
        },'batch');
    };

    tableOnSearch = (value) => {
        this.props.vipTipPop({
            source:"productManage",
            module: 2,
            onTryOrOpenCallback: ()=>{
                this.onSearch(value);
            }
        });
    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {produceOrderList} = this.props;
        const dataSource = produceOrderList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    selectChange = (value)=>{
        const {deptEmployee} = this.props;
        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        let employeeList = [];
        deptData = deptData && deptData.map(item => {
            if(item.deptId == value){
                employeeList = item.employeeList;
            }
        });
        let employeeData = employeeList.map(item => {
            return {
                label: item.employeeName,
                value: item.id
            }
        });

        this.setState({employerData:employeeData});
    };

    render() {
        const {produceOrderList, deptEmployee} = this.props;
        let dataSource = produceOrderList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let tableConfigList = produceOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = produceOrderList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let customMap = produceOrderList.getIn(['data', 'customMap']);
        customMap =  customMap ? customMap.toJS() : [];

        const {selectedRowKeys, produceType} = this.state;
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
                } else if (item.fieldName === "orderDate" || item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                } else if (item.fieldName === "productAbstract") {
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
                                                <div className={cx("tit")}>成品概述</div>
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
                } else if (item.fieldName === "produceType") {
                    obj.render = (produceType) => (
                        <span className="txt-clip">
                            {produceType===0 ? '内部制造': '委外加工'}
         			    </span>
                    );
                } else if (item.fieldName === "orderStatus") {
                    obj.render = (orderStatus) => (
                        <span className="txt-clip">
                            {orderStatus===0 ? '已完成': '未完成'}
         			    </span>
                    );
                } else if (item.fieldName === "billNo") {
                    obj.render = (billNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={billNo}>
                                    <Link ga-data="list-billNo" to={`/produceOrder/show/${data.billNo}`}>{billNo}</Link>
                                </span>
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
                        <DeleteMenu module={"productOrder"} clickHandler={() => this.deleteConfirm([data.recId])}/>
                        <CopyMenu module={"productOrder"}  to={`/produceOrder/copy/${data.billNo}`} />
                        <ModifyMenu module={"productOrder"} clickHandler={() => this.modifyConfirm(data.flag, data.billNo)} to={`/produceOrder/modify/${data.billNo}`}/>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };

        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptId
            }
        });

        let filterConfigList = [
            {
                label: "node.produceOrder.departmentName",
                fieldName: 'departmentId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                options: deptData,
                onSelectChanges: this.selectChange
            }, {
                label: "node.produceOrder.employeeName",
                fieldName: 'employeeId',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                defaultValue: '',
                options: this.state.employerData
            }, {
                label: "node.produceOrder.produceType",
                fieldName: 'produceType',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                defaultValue: produceType,
                options: [
                    {label: intl.get("node.produceOrder.produceType_0"), value: "0"},
                    {label: intl.get("node.produceOrder.produceType_1"), value: "1"}
                ]
            }, {
                label: "node.produceOrder.orderStatus",
                fieldName: 'orderStatus',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: intl.get("node.produceOrder.orderStatus_0"), value: "0"},
                    {label: intl.get("node.produceOrder.orderStatus_1"), value: "1"}
                ]
            }, {
                label: "node.produceOrder.orderDate",
                fieldName: 'orderDate',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'datePicker'
            }, {
                label: "node.produceOrder.deliveryDeadlineDate1",
                fieldName: 'deliveryDeadlineDate',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'datePicker'
            }, {
                label: "node.produceOrder.projectName",
                fieldName: 'projectCode',
                visibleFlag: true,
                cannotEdit: true,
                type: 'select',
                showType: 'full',
                defaultValue: '',
                options: this.state.projectData
            }, {
                label: "node.purchase.property_value",
                fieldName: 'property_value',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'custom',
                options: Object.values(customMap)
            }
        ];

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: []
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/productControl/',
                            title: "生产管理"
                        },
                        {
                            title: "生产单列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'workProduce'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addClickHandler={() => {
                                this.props.vipTipPop({
                                    source:"productManage",
                                    module: 2,
                                    onTryOrOpenCallback:()=>{
                                        this.props.history.push('/produceOrder/add');
                                    }
                                })
                            }}
                            authModule={"productOrder"}
                            onFilter={this.filterListData}
                            onSearch={(value) => this.tableOnSearch(value)}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/produceorder/search/tips`}
                            searchTipsUrlPrefix = {`/pc/v1/`}
                            searchPlaceHolder={"生产单号/成品物品/供应商"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"productOrder"}
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
                                loading={this.props.produceOrderList.get('isFetching')}
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

