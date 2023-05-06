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
import {asyncFetchProcessList, asyncUpdateConfig, asyncBatchUpdateConfig, dealFilterConfigList} from '../actions';
import {actions as workCenterActions} from "pages/auxiliary/workCenter";

import {actions as commonActions} from "components/business/commonRequest";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import Crumb from 'components/business/crumb';
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import ListPage from  'components/layout/listPage';
import MobileWork from 'components/business/mobileWork';
import { processTitleMap } from 'pages/productControl/show/views/data';
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
    checkResultVisible: false,
};
const DEFAULT_TITLE = 'processList';

const mapStateToProps = (state) => ({
    processList: state.getIn(['productControlProcessList', 'processList']),
    workCenterList: state.getIn(['auxiliaryWorkCenter', 'workCenterList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProcessList,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        dealFilterConfigList,
        asyncFetchWorkCenterList: workCenterActions.asyncFetchWorkCenterList,
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
            mobileWorkVisible: false,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchProcessList(params, (res) => {
            // if(res.data && res.data.retCode != '0'){
            //     Modal.error({
            //         title: intl.get("purchase.add.index.warningTip"),
            //         content: res.data.retMsg
            //     })
            // }
            callback && callback(res);
        });
    };

    componentDidMount() {
        this.fetchListData();
        // 获取工作中心列表
        this.props.asyncFetchWorkCenterList();
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    batchUpdateConfig = (callback) => {
        const {processList} = this.props;
        let filterConfigList = processList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = processList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let moduleType = {
            search:'workSheetProcess_search_list',
            table:'workSheetProcess_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,{},moduleType,callback);
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
        const {processList, workCenterList} = this.props;

        let dataSource = processList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];

        const workCenterListData = workCenterList.getIn(['data','data']);
        let workCenterOptions = workCenterListData ? workCenterListData.toJS().map(item => ({label: item.caName, value: item.caCode})) : [];

        let tableConfigList = processList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = processList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let tempColumns = [];
        let dateGroup = ['expectStartDate', 'expectEndDate', 'actualStartDate', 'actualEndDate'];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                var obj = {
                    title: item.label,
                    columnType: item.columnType,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                } else if (dateGroup.indexOf(item.fieldName) !== -1) {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                } else if (item.fieldName === "processStatus") {
                    obj.render = (processStatus) => (
                        <span className="txt-clip">
                            { processTitleMap[processStatus] }
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
                }else {
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        let filterConfigList = [
            {
                label: 'node.productControl.caName',
                fieldName: 'caCode',
                visibleFlag: true,
                displayFlag: true,
                type: 'select',
                cannotEdit: true,
                options: workCenterOptions
            }, {
                label: "node.productControl.officerName",
                fieldName: 'officerId',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'depEmployeeById'
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
                label: "node.productControl.processStatus",
                fieldName: 'processStatus',
                width: '200',
                visibleFlag: true,
                displayFlag: true,
                cannotEdit: true,
                type: 'select',
                options: [
                    {label: intl.get("node.productControl.processStatus_0"), value: "0"},
                    {label: intl.get("node.productControl.processStatus_1"), value: "1"},
                    {label: intl.get("node.productControl.processStatus_2"), value: "2"},
                    {label: intl.get("node.productControl.processStatus_3"), value: "3"},
                ]
            }
        ];

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            depEmployeeByIdComponents: [],
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
                            url: '/productControl/',
                            title: "生产管理"
                        },
                        {
                            title: "工序任务列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'workSheetProcess'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            onSearch={(value) => this.tableOnSearch(value)}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/worksheet/process/search/tips`}
                            onMobileWork={()=>this.openModal('mobileWorkVisible')}
                            searchTipsUrlPrefix = {`/cgi/`}
                            searchPlaceHolder={"工序编号/工序名称"}
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
                                // rowSelection={rowSelection}
                                loading={this.props.processList.get('isFetching')}
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

