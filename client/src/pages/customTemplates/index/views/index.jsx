import React, {Component} from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
Modal, Popover, Input, Menu, Dropdown, message, Spin, Tooltip, Checkbox
} from 'antd';

import {Link} from 'react-router-dom';
import intl from 'react-intl-universal';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actions as customerTemplateListAction} from "../index";
import {pageType,template} from '../../add/views/templateDictionaries';
import ListOpeBar from 'components/business/listOpeBar';
import FilterToolBar from 'components/business/filterToolBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import {CopyMenu, ModifyMenu, DeleteMenu, ToggleVisibleMenu,CommonItemMenu} from "components/business/authMenu";
import ListTable from 'components/business/listTable';
import ListPage from  'components/layout/listPage'
import moment from "moment/moment";
import {asyncFetchVipService,asyncFetchVipValueAdded} from "../../../../pages/vipService/actions";
import Record from './recommendedTemplateRecord';

const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows:[],
            checkResultVisibles: false,
            condition:{},
            filterToolBarVisible: false,
            listToolBarVisible: true,
            recommendVisible: false
        }
    }
    componentDidMount() {
        //初始化列表数据
        this.props.asyncCustomerTemplatesList();
    }

    fetchListData = (params,callback)=>{
        this.props.asyncCustomerTemplatesList(params, callback);
    };

    batchUpdateConfig = (callback) => {

    }


    batchDelete = (ids)=>{
        this.props.asyncCustomerTemplatesDelete(ids, (res)=> {
            if (res.data.retCode == '0') {
                message.success('删除成功!');
                this.setState({
                    selectedRowKeys: [],
                    selectedRows:[],
                    checkResultVisibles: false
                });
                this.props.asyncCustomerTemplatesList();
            }
            else {
                alert(res.retMsg);
            }
        });
    }


    deleteConfirm = (ids, callback) => {
        let _this = this;
        Modal.confirm({
            title: '提示信息',
            content: '删除模板后将无法恢复，确定删除吗？',
            onOk() {
                _this.props.asyncCustomerTemplatesDelete(ids, function(res) {
                    if (res.data.retCode == '0') {
                            message.success('删除成功!');
                           _this.props.asyncCustomerTemplatesList();
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };

    onSelectChange = (selectedRowKeys, selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows,
            checkResultVisibles: selectedRowKeys.length > 0
        });
    }
    //设置默认
    setDefault = (ids)=>{
        console.log(ids,'id');
        this.props.asyncCustomerTemplatesSetDefault({id:ids[0]},(data)=>{
            if(data.data.retCode == '0'){
                message.success('操作成功!');
                this.props.asyncCustomerTemplatesList();
            }else{
                message.error('发生未知错误!');
            }
        });
    }

    onSearch = (value) => {
        this.doFilter({key: value}, true);
    };

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            let key = params.key;
            params = condition;
            if (key && (typeof params.key === "undefined")) {
                params.key = key;
            }
        } else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params,
        });

        this.fetchListData(params);
    };

    // 清除选中项
    checkRemove = () => {
        this.setState({
            selectedRowKeys: [],
            checkResultVisibles: false,
            listToolBarVisible: true
        })
    };

    isVipJudge = () =>{
        this.props.asyncFetchVipService((data)=>{
            let dataSource = data.data;
            if(dataSource.VALUE_ADDED.vipState == 'TRY'||dataSource.VALUE_ADDED.vipState == 'OPENED'){
                this.props.history.push(`/template/new`)
            }else if(dataSource.VALUE_ADDED.vipState == 'NOT_OPEN'){
                let _this = this;
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: '提示信息',
                    content:  (
                        <div>
                            该服务属于增值包VIP功能，开通增值包VIP功能后可免费试用多仓库管理、简易BOM等功能7天，是否开启
                        </div>
                    ),
                    okText: '开通',
                    onOk() {
                        _this.props.asyncFetchVipValueAdded((datas)=> {
                            if (datas.retCode == "0") {
                                _this.props.history.push(`/template/new`)
                            }
                        });
                    }
                });
            }else{
                Modal.confirm({
                    icon: <ExclamationCircleOutlined />,
                    title: '提示信息',
                    content:  (
                        <div>
                            <p>增值包服务已到期，欢迎续费继续使用。详询客服400
                                -6979-890（转1） 或 18402578025（微信同号）</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">立即续约</a>
                        </div>
                    )
                });
            }
        })
    }

    //推荐模板fn
    recommendTemplate = () =>{
        this.openModal('recommendVisible');
    }


    render() {
        const {templateList} = this.props;
        let dataSource = templateList && templateList.toJS();
        console.log(dataSource,'dataSource');
        let listData = (dataSource.data.data!=undefined) ? dataSource.data.data : [];

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        let tempColumns = [
            {
                dataIndex: "templateName",
                key: "templateName",
                title: "template.templateName"
            },
            {
                dataIndex: "billType",
                key: "billType",
                title: "template.billType",
                render: (type)=>{
                    return template[type].name
                }
            },
            {
                dataIndex: "paperSize",
                key: "paperSize",
                title: "template.paperSize",
                render: (type)=>{
                    return pageType[type].name
                }
            },
            {
                dataIndex: "addedLoginName",
                key: "addedLoginName",
                title: "template.addedLoginName",
            },
            {
                dataIndex: "addedTime",
                key: "addedTime",
                title: "template.addedTime",
                render: (time)=>{
                    return moment(time).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            {
                dataIndex: "isDefault",
                key: "isDefault",
                title: "template.isDefault",
                render: (key)=>{
                    return key==1?'是':'否'
                }
            },
        ];
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <li className={"ant-dropdown-menu-item"} role="menuitem">
                        <Link to={`/template/edit/${data.recId}`}>修改</Link>
                    </li>
                    <li className={"ant-dropdown-menu-item"} role="menuitem">
                        <Link to={`/template/copy/${data.recId}`}>复制</Link>
                    </li>
                    <li className={"ant-dropdown-menu-item"} role="menuitem">
                        <a onClick={() => this.deleteConfirm([data.recId])}>删除</a>
                    </li>
                    <li className={"ant-dropdown-menu-item"} role="menuitem">
                        {(data.isDefault!=1)?<a  onClick={()=>this.setDefault([data.recId])}>设置为默认</a>:null}
                    </li>
                    {/*<ModifyMenu to={`/template/edit/${data.recId}`}/>
                    <CopyMenu  to={`/template/copy/${data.recId}`}/>
                    <DeleteMenu clickHandler={() => this.deleteConfirm([data.recId])} />
                    {(data.isDefault!=1)?<CommonItemMenu label={"设置为默认"} clickHandler={()=>this.setDefault([data.recId])}/>:null}*/}
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };

        const filterDataSource = {
            selectComponents: [
                {
                    label: 'template.billType',
                    fieldName: 'billType',
                    showType: 'full',
                    options: [
                        {label: "采购入库", value: "EnterWarehouse_0"},
                        {label: "销售退货", value: "EnterWarehouse_3"},
                        {label: "其他入库", value: "EnterWarehouse_1"},
                        {label: "盘点入库", value: "EnterWarehouse_2"},
                        {label: "调拨入库", value: "EnterWarehouse_4"},
                        {label: "生产入库", value: "EnterWarehouse_5"},
                        {label: "委外成品入库", value: "EnterWarehouse_6"},
                        {label: "生产退料", value: "EnterWarehouse_7"},
                        {label: "委外退料", value: "EnterWarehouse_8"},
                        {label: "内部领用", value: "OutWarehouse_0"},
                        {label: "盘点出库", value: "OutWarehouse_1"},
                        {label: "销售出库", value: "OutWarehouse_2"},
                        {label: "采购退货", value: "OutWarehouse_3"},
                        {label: "其他出库", value: "OutWarehouse_4"},
                        {label: "调拨出库", value: "OutWarehouse_5"},
                        {label: "委外领料", value: "OutWarehouse_6"},
                        {label: "生产领料", value: "OutWarehouse_7"},
                        {label: "采购订单", value: "PurchaseOrder"},
                        {label: "销售订单", value: "SaleOrder"},
                        {label: "报价单", value: "QuotationOrder"},
                        {label: "生产单", value: "ProduceOrder"},
                        {label: "生产工单", value: "ProduceWork"},
                        {label: "委外加工单", value: "Subcontract"},
                        {label: "请购单", value: "RequisitionOrder"},
                        ]
                }
            ]
        };

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: '自定义模板列表'
                        }
                    ]}/>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onSearch={this.onSearch}
                            addLabel="新建模板"
                            onFilter={this.filterListData}
                            addClickHandler = {this.isVipJudge}
                            searchPlaceHolder="模板名称"
                            refresh={this.refresh}
                            recommendTemplateHandler={this.recommendTemplate}
                        />
                        <CheckResult
                            module={""}
                            visible={this.state.checkResultVisibles}
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
                                dataSource={listData}
                                authModule={""}
                                rowSelection={rowSelection}
                                loading={this.props.templateList.get('isFetching')}
                                getRef={this.getRef}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    title={"请选择推荐模板"}
                    visible={this.state.recommendVisible}
                    onCancel={()=>this.closeModal('recommendVisible')}
                    width={1200}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Record onClose={()=>this.closeModal('recommendVisible')}/>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    templateList: state.getIn(['customerTemplatesList', 'customTemplateList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCustomerTemplatesList:customerTemplateListAction.asyncCustomerTemplatesList,
        asyncCustomerTemplatesDelete:customerTemplateListAction.asyncCustomerTemplatesDelete,
        asyncCustomerTemplatesSetDefault:customerTemplateListAction.asyncCustomerTemplatesSetDefault,
        asyncFetchVipService,
        asyncFetchVipValueAdded

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)