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
import {asyncFetchRequisitionApplyOrderList,asyncUpdateConfig, asyncBatchUpdateConfig, dealFilterConfigList} from '../actions';
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
const DEFAULT_TITLE = 'requisitionApplyOrder';

const mapStateToProps = (state) => ({
    requisitionApplyOrderList: state.getIn(['requisitionApplyOrderIndex', 'requisitionApplyOrderList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition']),
    deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchRequisitionApplyOrderList,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp,
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
            employerData: []
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchRequisitionApplyOrderList(params, (res) => {
            callback && callback(res);
        });
    };

    componentDidMount() {
        this.props.asyncFetchDeptEmp();
        this.fetchListData();
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        params.condition = {};
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    batchUpdateConfig = (callback) => {
        const {requisitionApplyOrderList} = this.props;
        let filterConfigList = requisitionApplyOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = requisitionApplyOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        //********
        let moduleType = {
            search:'purchase_requisition_search_list',
            table:'purchase_requisition_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,{},moduleType,callback);
    };



    tableOnSearch = (value) => {
        //this.props.vipTipPop({source:"productManage",onTryOrOpenCallback:()=>{
            this.onSearch(value);
        //}});
    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };
    //跳转采购
    onPurchase = (selectedRowKeys,selectedRows)=>{
        console.log(selectedRows,'selectedRows');
        const storage = window.localStorage;
        //跳转到采购新增页
        let toPurchaseData = selectedRows.map((item)=>{
            let out = {
                //物品 数量 含税单价 交付日期 上游订单 项目
                prodNo: item.prodNo,
                billNo: item.billNo,
                quantity: item.toPurchaseQuantity,
                unitPrice: item.unitPrice,
                deliveryDeadlineDate: item.deliveryDeadlineDate,
                projectName: item.projectName,
                displayBillNo: item.displayBillNo,
            };
            return out;
        });
        this.checkRemove();
        storage.setItem("requisitionOrderApplyInfo", JSON.stringify(toPurchaseData));
        setTimeout(()=>{
            this.props.history.push(`/purchase/add?type=requisitionOrderApplyInfo`);
        },100);

    }

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
        const {requisitionApplyOrderList, deptEmployee} = this.props;
        let dataSource = requisitionApplyOrderList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let tableConfigList = requisitionApplyOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let filterConfigList = requisitionApplyOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];

        let paginationInfo = requisitionApplyOrderList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let customMap = requisitionApplyOrderList.getIn(['data', 'customMap']);
        customMap =  customMap ? customMap.toJS() : [];

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
                }else if (item.fieldName === "requestDate" || item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                }else if (item.fieldName === "billNo") {
                    obj.render = (billNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={billNo}>
                                    <Link ga-data="list-billNo" to={`/purchase/requisitionOrder/show/${data.billNo}`}>{data.displayBillNo}</Link>
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


        let deptData = deptEmployee && deptEmployee.getIn(['data', 'data']) && deptEmployee.getIn(['data', 'data']).toJS();
        deptData = deptData && deptData.map(item => {
            return {
                label: item.deptName,
                value: item.deptId
            }
        });

        filterConfigList.push({
            label: "node.requisition.departmentName",
            fieldName: 'departmentId',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            options: deptData,
            onSelectChanges: this.selectChange
        }, {
            label: "node.requisition.employeeName",
            fieldName: 'employeeId',
            visibleFlag: true,
            cannotEdit: true,
            type: 'select',
            showType: 'full',
            defaultValue: '',
            options: this.state.employerData
        });

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            projectComponents: [],
            categoryComponents: [],
            inputComponents:[],
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/purchase/',
                            title: "采购"
                        },
                        {
                            title: "采购申请明细列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'purchase_requisition'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            authModule={"requisitionOrder"}
                            onFilter={this.filterListData}
                            onSearch={(value) => this.tableOnSearch(value)}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/produceorder/search/tips`}
                            searchTipsUrlPrefix = {`/pc/v1/`}
                            searchPlaceHolder={"请购单号/物品编号/物品名称"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"requisitionOrder"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            onPurchase = {this.onPurchase}
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
                                rowSelection={rowSelection}
                                loading={this.props.requisitionApplyOrderList.get('isFetching')}
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

