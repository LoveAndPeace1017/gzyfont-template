import React, {Component} from 'react';
import {
    Dropdown, Layout, Menu, message, Modal
} from 'antd';
import intl from 'react-intl-universal';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {actions as customerActions} from 'pages/customer/index'
import {reducer as customerIndex} from 'pages/customer/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import BindCustomer from 'components/business/bindCustomer';
import {Choose} from 'pages/account/index';
import {actions as commonActions} from 'components/business/commonRequest/index';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);

export class Apply extends ListPage {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        listToolBarVisible: true,
        filterToolBarVisible: false,
        checkResultVisible: false,
        customerInfo: '',
        condition: {
        },
        saveCustomerVisible:false,
    };

    fetchListData = (callback) => {
        //初始化列表数据
        this.props.asyncFetchCustomerApplyList(this.state.condition,callback);
    };

    componentDidMount() {
        //初始化列表数据
        this.fetchListData();
    }

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            let key = params.key;
            params = condition;
            if (key && (typeof params.key === "undefined")) {
                params.key = key;
            }
        }
        else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params
        });
        this.props.asyncFetchCustomerApplyList(params);

    };

    updateCustomer = (data)=>{
        this.props.asyncAddToBlackList(data, (res)=> {
            if (res.retCode === '0') {
                this.refresh(()=>{
                    message.success('操作成功');
                });
            }
            else {
                alert(res.retMsg);
            }
        });
    };

    allow = (data) => {
        this.openModal('saveCustomerVisible');
        this.setState({
            customerInfo:data
        });
    };

    disallow = (data) => {
        let _this = this;
        Modal.confirm({
            title: '提示信息',
            content: `您确定禁止 ${data.customerName} 访问商城吗？`,
            okText:'确定',
            cancelText:'取消',
            onOk(){
                _this.updateCustomer(data);
            }
        });
    };
    okCallback = ()=>{
        this.refresh();
        this.closeModal('saveCustomerVisible');
    };

    render() {
        const {customerList} = this.props;
        let dataSource = customerList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = customerList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [
            {title: "mall.customer.customerName",dataIndex: 'customerName',},
            {title: "mall.customer.contacterName",dataIndex: 'contacterName',width:'85'},
            {title: "mall.customer.contacterPhone",dataIndex: 'contacterPhone',width:'100'},
            {title: "mall.customer.bindAbizLoginName",dataIndex: 'bindAbizLoginName',width:'100'},
            {title: "mall.customer.statusText",dataIndex: 'statusText',width:'100'},
            {title: "mall.customer.originTypeText",dataIndex: 'originTypeText',width:'100'},
            {title: "mall.customer.addedTime",dataIndex: 'addedTime',},
        ];
        tempColumns.forEach((obj)=>{
            if (obj.dataIndex == "addedTime") {
                obj.render = (addedTime) => (<span>{moment(addedTime).format('YYYY-MM-DD')}</span>)
            }
            else {
                obj.render = (text) => (<span className={cx("txt-clip")} title={text} style={{width: obj.width}}>{text}</span>)
            }
        });

        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <Menu.Item>
                        <a ga-data='allow-visit-mall' onClick={() => this.allow(data)}>允许访问商城</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a ga-data='disallow-visit-mall' onClick={() => this.disallow(data)}>禁止访问商城</a>
                    </Menu.Item>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [
                {
                    label: '处理状态',
                    fieldName: 'status',
                    showType: 'simple',
                    options: [
                        {label: "待处理", value: "0"},
                        {label: "禁止访问商城", value: "2"}
                    ]
                },
                {
                    label: '来源',
                    fieldName: 'originType',
                    showType: 'simple',
                    options: [
                        {label: "小程序", value: "1"},
                        {label: "邀请注册", value: "2"}
                    ]
                },
            ],
            datePickerComponents: [],
            customComponents: [],
        };

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: '我的商城'
                        },
                        {
                            title: '客户管理'
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <ul className={cx("tab-menu")}>
                        <li><Link to={'/mall/customer/'}>我的客户</Link></li>
                        <li className={cx("current")}><b></b>客户申请</li>
                    </ul>
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            authModule={"customer"}
                            onFilter={this.filterCustomer}
                            onSearch={this.onSearch}
                            searchTipsUrl={`/customers/search/tips`}
                            searchPlaceHolder="客户名称/联系人/联系电话"
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"customer"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onCancelDistribute={this.cancelDistribute}
                            onOpenDistribute={this.onOpenDistribute}
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
                                loading={this.props.customerList.get('isFetching')}
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

                <BindCustomer
                    visible={this.state.saveCustomerVisible}
                    onCancel={()=>this.closeModal('saveCustomerVisible')}
                    customerInfo={this.state.customerInfo}
                    okCallback={this.okCallback}
                />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    customerList: state.getIn(['customerIndex', 'customerList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerApplyList: customerActions.asyncFetchCustomerApplyList,
        asyncToggleCustomerInfo: customerActions.asyncToggleCustomerInfo,
        asyncDeleteCustomerInfo: customerActions.asyncDeleteCustomerInfo,
        asyncFetchStatistic: customerActions.asyncFetchStatistic,
        asyncUpdateConfig: customerActions.asyncUpdateConfig,
        asyncAddToBlackList: customerActions.asyncAddToBlackList,
        asyncAddFriend: commonActions.asyncAddFriend
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Apply)

// class SaveCustomerForm extends Component{
//
// }