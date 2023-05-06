import React, {Component} from 'react';
import {
    Dropdown, Layout, Menu, message, Modal, Tooltip, Input, Row, Col, Button
} from 'antd';

const {Content} = Layout;
const confirm = Modal.confirm;
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {actions as supplierActions} from '../index';
import {actions as commonActions} from "components/business/commonRequest";
import {reducer as supplierIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import {Link} from "react-router-dom";
import {Choose} from 'pages/account/index';
import {ModifyMenu, DeleteMenu, DispatchMenu, ToggleVisibleMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import Icon from 'components/widgets/icon';
import ListPage from  'components/layout/listPage';
import tp1 from '../images/tp1.png';

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false,
};
const DEFAULT_TITLE = 'supplier';

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
            assignSubAccountVisible: false,
            batchAssignSubAccountVisible: false,
            curSupplierNo: '',
            curSupplierId: 0,
            addFriendVisible: false,
            recommendVisible: false,
            recommendValue: {}
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchSupplierList(params, callback);
    };

    componentDidMount() {
        let condition = {
            disableFlag: "0", //展示状态 默认为显示
            ...this.state.condition
        };
        this.setState({condition});
        //初始化列表数据
        this.fetchListData(condition,res=>{
            let filterConfigList = res && res.filterConfigList;
            filterConfigList = this.initFetchListCallback(filterConfigList, condition);
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

    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            checkResultVisible: selectedRowKeys.length > 0,
            inviteType:selectedRowKeys.length > 1?'mult':'',
        });
    };

    assignSubAccount = (supplierId) => {
        this.openModal('assignSubAccountVisible');
        this.setState({
            curSupplierId: supplierId
        })
    };

    openRecommendModal = (data)=>{
        if(data.mobile){
            this.setState({
                recommendValue:{
                    merchantName: data.name || '',
                    merchantContacter: data.contacterName || '',
                    merchantMobile: data.mobile || '',
                }
            },()=>{
                this.openModal('recommendVisible');
            });
        }else{
            message.error("系统检测您的供应商联系电话未填写，建议您补充完成后再推荐。");
        }

    }

    closeRecommendModal = ()=>{
        this.setState({
            recommendValue:{}
        });
        this.closeModal('recommendVisible');
    }

    recommedValue = (e,type)=>{
        let value = e.target.value;
        this.setState({
            recommendValue:{
                ...this.state.recommendValue,
                [type]:value
            }
        });
    }

    submitRInfo = ()=>{
        let obj = this.state.recommendValue;
        this.props.asyncRecommedSupplyInfo(obj,(data)=>{
            if(data && data.retCode === "0"){
                message.success('操作成功！');
                this.closeRecommendModal();
            }else{
                message.error('发送未知错误！');
            }
            console.log(data);
        })
    }

    //批量分配给子账号
    batchAssignToSubAccount = () => {
        this.openModal('batchAssignSubAccountVisible');
    };

    batchUpdateConfig = (callback) => {
        const {supplierList} = this.props;
        let filterConfigList = supplierList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = supplierList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {
            'twoWayBindFlag':1,
        };
        let moduleType = {
            search:'supplier_search_list',
            table:'supplier_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("supplier.index.deleteContent"),
            onOk() {
                _this.props.asyncDeleteSupplierInfo(ids, function(res) {
                    // retCode为1 代表单个删除且发生业务操作
                    if (res.retCode == 0 || res.retCode == 1) {
                        if (res.inServiceNos && res.inServiceNos.length != 0) {
                            confirm({
                                title: intl.get('common.confirm.title'),
                                content: intl.get("supplier.index.deleteContent1"),
                                onOk() {
                                    _this.props.asyncToggleSupplierInfo(res.inServiceNos, false, function(res) {
                                        if (res.retCode == 0) {
                                            message.success(intl.get('common.confirm.success'));
                                            _this.props.asyncFetchSupplierList(_this.state.condition, () => _this.checkRemove());
                                        }
                                        else {
                                            alert(res.retMsg);
                                        }
                                    });
                                },
                                onCancel() {
                                    _this.props.asyncFetchSupplierList(_this.state.condition, () => _this.checkRemove());
                                },
                            });
                        } else {
                            message.success(intl.get('common.confirm.success'));
                            _this.props.asyncFetchSupplierList(_this.state.condition, () => _this.checkRemove());
                        }
                        if (callback) {
                            callback();
                        }
                    }
                });
            },
            onCancel() {
            },
        });
    };



    toggleSupplier = (ids, disableFlag) => {
        let _this = this;
        this.props.asyncToggleSupplierInfo([ids], disableFlag, function(res) {
            if (res.retCode == 0) {
                message.success(intl.get('common.confirm.success'));
                _this.props.asyncFetchSupplierList(_this.state.condition, () => _this.checkRemove());
            }
            else {
                alert(res.retMsg);
            }
        });
    };

    render() {
        const {supplierList} = this.props;
        let dataSource = supplierList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = supplierList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = supplierList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = supplierList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let supplierIds = dataSource.filter(item=> {
            return selectedRowKeys.indexOf(item.key)!==-1
        }).map(item=> item.id);
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
                if (item.fieldName == "name") {
                    obj.render = (supplierName, data) => (
                        <span className={cx("txt-clip")} title={supplierName}>
                            <Tooltip
                                color={"#fff8ec"}
                                overlayInnerStyle={{
                                    color: "#EE9915",
                                }}
                                title={"向您的供应商推荐使用百卓优轻云ERP，领推荐好礼：话费、红包、精美礼品等"}
                            >
                                <img onClick={()=>this.openRecommendModal(data)} src={tp1} alt="tp" className={cx("re-tp1")}/>
                            </Tooltip>
                            <Link to={`/supplier/show/${data.code}`}>{supplierName}</Link>
                        </span>
                    )
                }
                else if(item.fieldName === 'email'){
                    obj.render = (email) => (
                        <span className={cx("txt-clip")} title={email}>
                            {email}
                        </span>
                    )
                }
                else if (item.fieldName == "subAccountCount") {
                    obj.render = (salerCount, data) => (
                        <a onClick={(code) => this.assignSubAccount(data.code)}>{salerCount}</a>)
                }
                else if (item.fieldName == "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }
                else {
                    obj.render = (text) => (
                        <span className={cx("txt-clip")} title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <ModifyMenu module={"supplier"} to={`/supplier/modify/${data.code}`}/>
                    <DeleteMenu module={"supplier"} clickHandler={() => this.deleteConfirm([data.code])}/>
                    {/*{
                        data.mallAuth ?  <Menu.Item>
                            <Link to={`/onlineOrder/${data.supplierUserIdEnc}/customerIndex`}>{intl.get("supplier.index.go")}</Link>
                        </Menu.Item>:null
                    }*/}
                    <DispatchMenu module={"supplier"} clickHandler={() => this.assignSubAccount(data.id)}/>
                    <ToggleVisibleMenu module={"supplier"}
                                       clickHandler={() => this.toggleSupplier(data.code, data.disableFlag)}
                                       label={data.disableFlag ? intl.get("supplier.index.flag") : intl.get("supplier.index.flagF")}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            groupComponents: []
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        // const linkList = [
        //     {url:'',text:'销售汇总表（按供应商）'},
        //     {url:'',text:'销售明细表'},
        //     {url:'',text:'收款和开票汇总表'},
        // ];

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/supplier/',
                            title: intl.get("supplier.index.crumb")
                        },
                        {
                            title: intl.get("supplier.index.crumb1")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'supplier'}
                        />
                        {/*<StatisticMenu linkList={linkList} statistic={this.state.statistic} moduleName={"供应商"} />*/}
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className={cx("list-ope-wrap")}>
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/supplier/add"
                            authModule={"supplier"}
                            searchTipsUrl={`/suppliers/search/tips`}
                            onFilter={this.filterListData}
                            importType="supplier"
                            exportType="supplier"
                            exportDataSource={this.state.selectedRowKeys}
                            onSearch={this.onSearch}
                            searchPlaceHolder={intl.get("supplier.index.placeholder")}
                            defaultValue={this.state.condition.key}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onDelete={this.batchDelete}
                            module={"supplier"}
                            exportModel={{
                                exportType: "supplier",
                                exportDataSource: this.state.selectedRowKeys
                            }}
                            onDispatch={this.batchAssignToSubAccount}
                            // onShare={this.batchShare}
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
                                loading={this.props.supplierList.get('isFetching')}
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
                    {/*分配子账号*/}
                    <Choose
                        visible={this.state.assignSubAccountVisible}
                        getUrl={`/supplier/subAccounts/${this.state.curSupplierId}`}
                        postUrl={`/supplier/allocSubAccounts/${this.state.curSupplierId}`}
                        onClose={this.closeModal.bind(this, 'assignSubAccountVisible')}
                    />
                </div>

                {/*批量分配子账号*/}
                <Choose
                    pageType={'batchChoose'}
                    visible={this.state.batchAssignSubAccountVisible}
                    postUrl={`/supplier/batch/allocSubAccounts`}
                    selectIds={supplierIds}
                    onClose={this.closeModal.bind(this, 'batchAssignSubAccountVisible')}
                    onOk={this.checkRemove}
                />

                <Modal className={cx("re-dom")} visible={this.state.recommendVisible} closable={false} destroyOnClose={true} onCancel={this.submitRInfo} footer={null} width={618} bodyStyle={{
                    padding: "0"
                }}>
                    <div className={cx("re-bd")}>
                         <div className={cx("re-close-bd")} onClick={this.submitRInfo}> </div>
                         <div className={cx("re-info")}>
                             <h2 className={cx("re-info-title")}>感谢您的推荐！</h2>
                             <p>助力供应商用上好软件！请留下您的联系方式，</p>
                             <p>便于客服联系发放推荐好礼</p>
                         </div>
                        <div>
                            <Row style={{marginBottom: "12px"}}>
                                <Col span={8} style={{textAlign: "right"}}>
                                    <span style={{position: "relative",top: "4px"}}>您的姓名：</span>
                                </Col>
                                <Col span={16}>
                                    <Input style={{width: "280px"}} onChange={(e)=>this.recommedValue(e,'recommenderName')} value={this.state.recommendValue["recommenderName"]}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8} style={{textAlign: "right"}}>
                                    <span style={{position: "relative",top: "4px"}}>您的手机号：</span>
                                </Col>
                                <Col span={16}>
                                    <Input style={{width: "280px"}} onChange={(e)=>this.recommedValue(e,'recommenderMobile')} value={this.state.recommendValue["recommenderMobile"]}/>
                                </Col>
                            </Row>

                           <Row  style={{marginTop: "20px"}}>
                               <Col span={8}> </Col>
                               <Col span={16}>
                                   <Button style={{background: "orange",color: "#fff"}} onClick={this.submitRInfo}>确定</Button>
                               </Col>
                           </Row>
                        </div>
                    </div>
                </Modal>

            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    supplierList: state.getIn(['supplierIndex', 'supplierList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSupplierList: supplierActions.asyncFetchSupplierList,
        asyncToggleSupplierInfo: supplierActions.asyncToggleSupplierInfo,
        asyncDeleteSupplierInfo: supplierActions.asyncDeleteSupplierInfo,
        asyncFetchStatistic: supplierActions.asyncFetchStatistic,
        asyncUpdateConfig: supplierActions.asyncUpdateConfig,
        asyncBatchUpdateConfig: supplierActions.asyncBatchUpdateConfig,
        dealFilterConfigList: supplierActions.dealFilterConfigList,
        asyncRecommedSupplyInfo: supplierActions.asyncRecommedSupplyInfo,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)