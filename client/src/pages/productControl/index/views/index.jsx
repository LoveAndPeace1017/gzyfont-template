import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import intl from 'react-intl-universal';
import {Modal, Menu, Dropdown, message, Popover} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {asyncFetchProductControlList, asyncDeleteProductControlInfo, asyncUpdateConfig, asyncBatchUpdateConfig, dealFilterConfigList} from '../actions';

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
import MobileWork from 'components/business/mobileWork';
import { ProgressGraph } from 'components/business/progress';
import { orderTitleMap } from 'pages/productControl/show/views/data';
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
const DEFAULT_TITLE = 'productControl';

const mapStateToProps = (state) => ({
    productControlList: state.getIn(['productControlIndex', 'productControlList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProductControlList,
        asyncDeleteProductControlInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
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
        // let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...initParams,
            listToolBarVisible: true,
            deleteRelatedRecord: false,
            mobileWorkVisible: false,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchProductControlList(params, (res) => {
            callback && callback(res);
        });
    };

    componentDidMount() {
        //初始化列表数据
        let params = new URLSearchParams(this.props.location.search);
        const saleBillNo = params && params.get('saleBillNo') || "";
        let condition = {...this.state.condition};
        saleBillNo && (condition.saleBillNo = saleBillNo);

        this.fetchListData(condition);
    }

    // componentWillUnmount() {
    //     let params = {};
    //     for(let key in initParams){
    //         params[key] = this.state[key];
    //     }
    //     this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    // }

    batchUpdateConfig = (callback) => {
        const {productControlList} = this.props;
        let filterConfigList = productControlList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = productControlList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            search:'workSheet_search_list',
            table:'workSheet_list'
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
                _this.props.asyncDeleteProductControlInfo({ids}, function(res) {
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
            module: 4,
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

    render() {
        //初始化列表数据
        let params = new URLSearchParams(this.props.location.search);
        const saleBillNo = params && params.get('saleBillNo') || "";
        const displaySaleBillNo = params && params.get('displaySaleBillNo') || "";

        const {productControlList} = this.props;
        let dataSource = productControlList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let tableConfigList = productControlList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = productControlList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        let tempColumns = [];
        let dateGroup = ['expectStartDate', 'expectEndDate', 'actualStartDate', 'actualEndDate'];
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
                } else if (dateGroup.indexOf(item.fieldName) !== -1) {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : null}
         			    </span>
                    );
                } else if (item.fieldName === "sheetStatus") {
                    obj.render = (sheetStatus) => (
                        <span className="txt-clip">
                            { orderTitleMap[sheetStatus] }
         			    </span>
                    );
                } else if (item.fieldName === "billNo") {
                    obj.render = (billNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={billNo}>
                                    <Link ga-data="list-billNo" to={`/productControl/show/${data.billNo}`}>{billNo}</Link>
                                </span>
                            </React.Fragment>
                        )
                    }
                } else if (item.fieldName === "processList") {
                    obj.render = (processList) => {
                        return (
                            <ProgressGraph list={processList}/>
                        )
                    }
                } else {
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => {
                let menuStr = (
                    <Menu>
                        <DeleteMenu module={"productManage"} clickHandler={() => this.deleteConfirm([data.billNo])}/>
                        <CopyMenu module={"productManage"} to={`/productControl/copy/${data.billNo}`} />
                        <ModifyMenu module={"productManage"} to={`/productControl/modify/${data.billNo}`}/>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };

        let filterConfigList = [
            {
                label: 'node.productControl.prodName',
                fieldName: 'productCode',
                visibleFlag: true,
                displayFlag: true,
                type: 'product',
                cannotEdit: true
            }, {
                label: "node.productControl.expectStartDate",
                fieldName: 'expectStartDate',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'datePicker'
            }, {
                label: "node.productControl.expectEndDate",
                fieldName: 'expectEndDate',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'datePicker'
            }, {
                label: "node.productControl.sheetStatus",
                fieldName: 'sheetStatus',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: intl.get("node.productControl.sheetStatus_0"), value: "0"},
                    {label: intl.get("node.productControl.sheetStatus_1"), value: "1"},
                    {label: intl.get("node.productControl.sheetStatus_2"), value: "2"},
                    {label: intl.get("node.productControl.sheetStatus_3"), value: "3"},
                ]
            }, {
                label: "node.productControl.officerName",
                fieldName: 'officerId',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'depEmployeeById'
            }, {
                label: "销售订单",
                fieldName: 'saleBillNo',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'saleOrder',
                checkType: 'radio',
                orderKey: 'billNo',
                defaultValue: displaySaleBillNo ? [
                    {billNo: saleBillNo, displayBillNo: displaySaleBillNo}
                ] : ''
            }
        ];

        const filterDataSource  = {
            selectComponents: [],
            datePickerComponents: [],
            inputComponents:[],
            depEmployeeByIdComponents: [],
            productComponents: [],
            saleOrderComponents: [],
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
                            title: "工单列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'workSheet'}
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
                                    module: 4,
                                    onTryOrOpenCallback:()=>{
                                        this.props.history.push('/productControl/add');
                                    }
                                })
                            }}
                            authModule={"productManage"}
                            onFilter={this.filterListData}
                            onSearch={(value) => this.tableOnSearch(value)}
                            onMobileWork={()=>this.openModal('mobileWorkVisible')}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/worksheet/search/tips`}
                            searchTipsUrlPrefix = {`/cgi/`}
                            searchPlaceHolder={"工单编号/工单名称"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"productManage"}
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
                                loading={this.props.productControlList.get('isFetching')}
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
                <Modal
                    title={"移动报工"}
                    visible={this.state.mobileWorkVisible}
                    onCancel={()=>this.closeModal('mobileWorkVisible')}
                    width={800}
                    destroyOnClose={true}
                    footer={null}
                >
                    <MobileWork/>
                </Modal>

            </React.Fragment>
        )
    }
}

