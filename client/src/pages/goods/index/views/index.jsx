import React, {Component} from 'react';
import {
    Modal, Popover, Input, Menu, Dropdown, message, Spin, Tooltip, Checkbox
} from 'antd';

import {Link} from 'react-router-dom';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import ScrollContainer from 'components/widgets/scrollContainer';

import {
    asyncFetchGoodsList,
    asyncToggleGoodsInfo,
    asyncDeleteGoodsInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchWareByCode,
    asyncSetDistribute,
    dealFilterConfigList
} from '../actions';
import {actions as commonActions} from "components/business/commonRequest";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    DownOutlined
} from '@ant-design/icons';
import {getCookie} from 'utils/cookie';
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import {CopyMenu, ModifyMenu, DeleteMenu, ToggleVisibleMenu, DispatchMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar'
import AddSalePrice from "./addSalePrice";
import ListPage from  'components/layout/listPage';
import {Choose} from 'pages/account/index';
import intl from 'react-intl-universal';
import moment from "moment/moment";
import {asyncFetchSubAccountList} from "../../../account/index/actions";

const cx = classNames.bind(styles);

let initParams = {
    condition: {},
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false,
    catCode: '',
    expandedKeys: [],
    cateVisible: true
};
const DEFAULT_TITLE = 'goods';

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            listToolBarVisible: true,
            importGoodsPopVisible: false,
            addSalePriceVisible: false,
            curGoodsId: 0,
            batchAssignSubAccountVisible: false, // 批量选择物品分配子账号
            noPriceDataSource:[]
        };
    }

    fetchListData = (params,callback)=>{
        const {goodsList} = this.props;
        let tags = goodsList.getIn(['data', 'tags']);
        params = this.dealCustomField(params,tags && tags.toJS());
        this.props.asyncFetchGoodsList(params, callback);
    };
    componentDidMount() {
        this.props.asyncFetchSubAccountList();
        let condition = {
            disableFlag: "0", //展示状态 默认为显示
            ...this.state.condition
        };
        // this.setState({condition});
        //初始化列表数据
        this.fetchListData(condition,res=>{
            let filterConfigList = res && res.filterConfigList;
            filterConfigList = this.initFetchListCallback(filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
            this.setState({condition});
        });
        //更新样式
        this.updateStyle();
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }
    //处理样式问题
    updateStyle = ()=>{
        setTimeout(()=>{
            //tb-wrap-tabs cate-info
            let tbDom = document.getElementById('tb-wrap-tabs');
            let cateDomWidth = document.getElementById('cate-info').offsetWidth;
            tbDom.style.paddingLeft = cateDomWidth+"px";
        },800);
    }

    batchUpdateConfig = (callback)=>{
        const {goodsList} = this.props;
        let filterConfigList = goodsList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = goodsList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {
            'enterType':1,
            'warehouseName':1,
            'enterDate':1,
        };
        let moduleType = {
            search:'product_search_list',
            table:'product_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);

    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("goods.index.content1"),
            onOk() {
                _this.props.asyncDeleteGoodsInfo(ids, function(res) {
                    // retCode为1 代表单个删除且发生业务操作
                    if (res.retCode == '0' || res.retCode == '1') {
                        if (res.inServiceNos && res.inServiceNos.length != 0) {
                            Modal.confirm({
                                title: intl.get('common.confirm.title'),
                                content: intl.get("goods.index.content2"),
                                onOk() {
                                    _this.props.asyncToggleGoodsInfo(res.inServiceNos, false, function(res) {
                                        if (res.retCode === '0') {
                                            message.success(intl.get('common.confirm.success'));
                                            _this.props.asyncFetchGoodsList(_this.state.condition, () => _this.checkRemove());
                                        }
                                        else {
                                            alert(res.retMsg);
                                        }
                                    });
                                },
                                onCancel() {
                                    _this.props.asyncFetchGoodsList(_this.state.condition, () => _this.checkRemove());
                                },
                            })
                        } else {
                            message.success(intl.get('common.confirm.deleteSuccess'));
                            _this.props.asyncFetchGoodsList(_this.state.condition, () => _this.checkRemove());
                        }
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

    toggleGoodsVisible = (id, disableFlag)=>{
        let _this = this;
        this.props.asyncToggleGoodsInfo(id, disableFlag, function(res) {
            if (res.retCode === '0') {
                let msg = disableFlag ? intl.get("goods.index.flag") : intl.get("goods.index.flagF");
                message.success(msg);
                _this.props.asyncFetchGoodsList(_this.state.condition,  () => _this.checkRemove());
            }
            else {
                alert(res.retMsg);
            }
        });
    };

    toggleGoods = (id, disableFlag, isPutaway) => {
        let _this = this;
        let msg = isPutaway?intl.get("goods.index.content3"):intl.get("goods.index.content8");
        if(!disableFlag){
            Modal.confirm({
                title: intl.get('common.confirm.title'),
                content: msg,
                onOk(){
                    _this.toggleGoodsVisible(id, disableFlag)
                }
            })
        }else{
            this.toggleGoodsVisible(id, disableFlag)
        }
    };

    //类目筛选
    cateFilter = (selectedKeys) => {
        const catCode = selectedKeys && selectedKeys.length > 0 && selectedKeys[0];
        this.doFilter({catCode});
        this.setState({
            catCode
        })
    };

    expand = (expandedKeys) => {
        this.setState({
            expandedKeys
        },()=>{
            //更新样式
            this.updateStyle();
        });
    };

    cateToggle = (e) => {
        const checked = e.target.checked;
        this.setState({
            cateVisible: checked
        })
    };

    //加载当前库存数据
    loadWare = (visible, code) => {
        const {goodsList} = this.props;
        const dataSource = goodsList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('code') === code && item.get('wareList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchWareByCode(code)
        }
    };

    /**
     * 上下架操作
     **/
    putOrOutConfirm=(prodCode, type)=>{
        const _this = this;
        const text = type==1?intl.get("goods.index.up"):intl.get("goods.index.down");
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("goods.index.content4")+`${text}？`,
            onOk() {
                _this.props.asyncSetDistribute([{prodNo: prodCode}], type, function(res) {
                    if (res.retCode === '0') {
                        message.success(`${text}`+intl.get("goods.index.success"));
                        _this.props.asyncFetchGoodsList(_this.state.condition, () => _this.checkRemove());
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        })
    };

    /**
     * 上架
     */
    putaway = (record)=>{
        if(record.salePrice){
            this.putOrOutConfirm(record.prodNo, 1);
        }else{
            this.currentProdCode = record.prodNo;
            record.serial = 1;
            this.setState({
                noPriceDataSource:[record]
            });
            this.openModal('addSalePriceVisible')
        }
    };

    /**
     *下架
     */
    soldOut = (prodCode)=> {
        this.putOrOutConfirm(prodCode, 0);
    };

    // 批量查询
    onBatchShelfLeft = (selectedRowKeys,selectedRows) => {
        //[{prodNo:productCode, key: productCode,prodName:'woao'}]
        console.log(selectedRowKeys, 'selectedRowKeys');
        console.log(selectedRows, 'selectedRows');
        const storage = window.localStorage;
        let ary = '';
        selectedRows.map((item,index)=>{
            let prod = item.code+','+item.name;
            ary = ary + '|'+ prod;
        });
        storage.setItem('batchqueryprods',ary);
        console.log(ary,'ary');
        let url = `/report/batchQuery/detail?productCode=${selectedRowKeys.join(',')}`;
        this.props.history.push(url);
    };

    assignSubAccount = (goodsId) => {
        this.openModal('assignSubAccountVisible');
        this.setState({
            curGoodsId: goodsId
        })
    };

    //批量分配给子账号
    batchAssignToSubAccount = () => {
        this.openModal('batchAssignSubAccountVisible');
    };

    render() {
        const {goodsList, subAccountList} = this.props;
        const subAccountListData = subAccountList.getIn(['data', 'data']);
        let dataSource = goodsList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = goodsList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = goodsList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = goodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys, condition} = this.state;
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
                if(item.align){
                    obj.align = item.align;
                }
                if (item.fieldName === "imageUrl") {
                    obj.title = '图片';
                    obj.render = (thumbnail, data) => {
                        return thumbnail?(
                            <Popover content={
                                <div className={cx("prod-img")+ " sl-vam"}>
                                    <div className="sl-vam-outer">
                                        <div className="sl-vam-inner">
                                            <img src={thumbnail} alt={data.name} />
                                        </div>
                                    </div>
                                </div>}
                            >
                                <Icon type="icon-pic" className={cx("prod-icon")}/>
                            </Popover>
                        ): null
                    }
                }else if (item.fieldName === "displayCode") {
                    obj.render = (displayCode, data) => (
                        <span className={cx("txt-clip")} title={displayCode}>
        				    <Link to={`/goods/show/${data.code}`}>{displayCode}</Link>
         			    </span>
                    );
                    obj.sorter = (a, b) => a.displayCode.localeCompare(b.displayCode);
                }else if (item.fieldName === "addedTime") {
                        obj.render = (addedTime) => (<span>{moment(addedTime).format('YYYY-MM-DD')}</span>);
                        obj.sorter = (prev, next) => prev.addedTime - next.addedTime;

                }else if (item.fieldName === "name") {
                    obj.render = (name, data) => (
                        <span className={cx("txt-clip")} title={name}>
                            {
                                data.imageUrl?(
                                    <Popover content={
                                        <div className={cx("prod-img")+ " sl-vam"}>
                                            <div className="sl-vam-outer">
                                                <div className="sl-vam-inner">
                                                    <img src={data.imageUrl} alt={name} />
                                                </div>
                                            </div>
                                        </div>}
                                    >
                                        <Icon type="icon-pic" className={cx("prod-icon")}/>
                                    </Popover>
                                ):null
                            }
                            <Link to={`/goods/show/${data.code}`}>{name}</Link>
         			    </span>
                    );
                    obj.sorter = (a, b) => a.name.localeCompare(b.name);
                }else if (item.fieldName === "currentQuantity") {
                    obj.render = (currentQuantity, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.code)}
                            overlay={() => (
                                <Menu className={cx('ware-drop-menu')}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.wareIsFetching}
                                        >
                                            <div className={cx("ware-drop")}>
                                                <div className={cx("tit")}>{intl.get("goods.index.detail")}</div>
                                                <ul>
                                                    {
                                                        data.wareList && data.wareList.map((item, index) =>
                                                            <li key={index}>
                                                                {item.warehouseName}：{item.currentQuantity}
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </Spin>
                                    </Menu.Item>

                                </Menu>
                            )}>

                            <Tooltip title={
                                (currentQuantity?currentQuantity:0)<0?intl.get("goods.index.content6"):((data.minQuantity&&(currentQuantity?currentQuantity:0)<data.minQuantity)||(data.maxQuantity&&(currentQuantity?currentQuantity:0)>data.maxQuantity))?intl.get("goods.index.content7"):''
                            }>
                                <span className={((data.minQuantity&&(currentQuantity?currentQuantity:0)<data.minQuantity)||(data.maxQuantity&&(currentQuantity?currentQuantity:0)>data.maxQuantity)||((currentQuantity?currentQuantity:0)<0))?'red':''}>{currentQuantity?currentQuantity:0}<DownOutlined style={{marginLeft: "5px",position: "relative",top:"2px"}} className={"m15"}/> </span>
                            </Tooltip>
                        </Dropdown>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.currentQuantity - next.currentQuantity;

                } else if (item.fieldName === "salePrice") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => ((prev.salePrice==undefined)?0:prev.salePrice) - ((next.salePrice==undefined)?0:next.salePrice);

                } else if (item.fieldName === "orderPrice") {
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => ((prev.orderPrice==undefined)?0:prev.orderPrice) - ((next.orderPrice==undefined)?0:next.orderPrice);

                } else if (item.fieldName === "maxQuantity") {
                    obj.sorter = (prev, next) => ((prev.maxQuantity==undefined)?0:prev.maxQuantity) - ((next.maxQuantity==undefined)?0:next.maxQuantity);
                } else if (item.fieldName === "minQuantity") {
                    obj.sorter = (prev, next) => ((prev.minQuantity==undefined)?0:prev.minQuantity) - ((next.minQuantity==undefined)?0:next.minQuantity);
                } else if(item.fieldName === "expirationFlag"){
                    obj.render = (expirationFlag) => {
                        let expirationStatus = !expirationFlag?'关闭':'开启';
                        return (<span className={cx("txt-clip")} title={expirationStatus}>{expirationStatus}</span>)
                    }
                } else if (item.fieldName === "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }else{
                    obj.render = (text) => (<span className={cx("txt-clip")} title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <ModifyMenu module={"goods"} to={`/goods/modify/${data.code}`} />
                    <CopyMenu module={"goods"} to={`/goods/copy/${data.code}`}/>
                    <DeleteMenu module={"goods"} clickHandler={() => this.deleteConfirm([data.code])} />
                    {/*{
                        data.distributionFlag == 1?(
                            <Menu.Item><a href="#!" onClick={()=>this.soldOut(data.code)}>{intl.get("goods.index.down")}</a></Menu.Item>
                        ):(
                            <Menu.Item><a href="#!" onClick={()=>this.putaway(data)}>{intl.get("goods.index.up")}</a></Menu.Item>
                        )
                    }*/}
                    <ToggleVisibleMenu module={"goods"} clickHandler={()=>this.toggleGoods([data.code],data.diasbleFlag, data.distributionFlag)} label={data.diasbleFlag?intl.get("goods.index.flag1"):intl.get("goods.index.flagF1")} />
                    <DispatchMenu module={"goods"} clickHandler={() => this.assignSubAccount(data.id)}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx("toggle-wrap")}>
                    <Checkbox onChange={this.cateToggle} checked={this.state.cateVisible}>{intl.get("goods.index.categoryMenu")}</Checkbox>
                </div>
            ],
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            inputComponents: []
        };

        filterConfigList.forEach(function(item) {
            if(item.fieldName === 'addedUserId'){
                item.options = subAccountListData && subAccountListData.map(account => {
                    return {label: account.get('loginName')+'-'+account.get('userName'), value: account.get('userIdEnc')}
                }).unshift({
                    label: '主账号', value: getCookie('uid')
                });
                console.log(item.options, subAccountListData && subAccountListData.toJS(), 'ASD');
            }
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        let prodIds = dataSource.filter(item=> {
            return selectedRowKeys.indexOf(item.key)!==-1
        }).map(item=> item.id);
        /*const importTips = ()=>{
            return (
                <div className={cx("tip-wrap")}>
                    <Alert message={<span>您可以从中国制造网内贸站导入产品来进行管理哦！<a href="#!" onClick={()=>this.openModal('importGoodsPopVisible')}>马上导入</a></span>} type="info" showIcon />
                </div>
            )
        };

        const AuthImportTips = authComponent(importTips);*/


        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/goods/',
                            title: intl.get("goods.index.crumb")
                        },
                        {
                            title: intl.get("goods.index.crumb1")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="product"
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    {/*<AuthImportTips module="goods" option="add" />*/}
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/goods/add"
                            authModule={"goods"}
                            onFilter={this.filterListData}
                            importModule={
                                {
                                    type:"goods",
                                    text:intl.get("goods.index.export"),
                                    module: "goods"
                                }
                            }
                            exportCondition ={{wareName: condition.wareName}}
                            onFitting={'true'}
                            miccnImportType='goods'
                            multiGoodsType = 'goods'
                            exportType="goods"
                            exportDataSource={this.state.selectedRowKeys}
                            onSearch={this.onSearch}
                            searchTipsUrl={`/prods/search/tips?catCode=${this.state.catCode ? this.state.catCode : ''}`}
                            searchPlaceHolder={intl.get("goods.index.placeHolder")}
                            refresh={this.refresh}
                            defaultValue={this.state.condition.key}
                            addMenu = {
                                (<Menu>
                                    <Menu.Item>
                                        <Link to={`/goods/add`}>
                                            普通物品
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Link to={`/multiGoods/add`}>
                                            多规格物品
                                        </Link>
                                    </Menu.Item>
                                </Menu>)
                            }
                        />
                        <CheckResult
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            onDelete={this.batchDelete}
                            onBatchShelfLeft={this.onBatchShelfLeft}
                            onDispatch={this.batchAssignToSubAccount}
                            module={"goods"}
                            exportModel={{
                                exportType: "goods",
                                exportDataSource: this.state.selectedRowKeys
                            }}
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
                    <div className={cx(["data-goods-wrap", {"cate-hidden": !this.state.cateVisible}]) + " data-wrap cf"}>
                        <div id={"tb-wrap-tabs"} className={"tb-wrap"}>
                            <div className={cx("tb-wrap-inner") + " cf"}>
                                <ListTable
                                    columns={tempColumns}
                                    operationColumn={operationColumn}
                                    dataSource={dataSource}
                                    rowSelection={rowSelection}
                                    loading={this.props.goodsList.get('isFetching')}
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
                        <div id={"cate-info"} className={cx("cate")}>
                            <ScrollContainer className={cx("cate-wrap")}>
                                <CateFilter
                                    catCode={this.state.catCode}
                                    expandedKeys={this.state.expandedKeys}
                                    onSelect={this.cateFilter}
                                    onExpand={this.expand}
                                />
                            </ScrollContainer>

                        </div>
                    </div>

                </div>
                {/*<ImportGoodsPop
                    visible={this.state.importGoodsPopVisible}
                    onClose={()=>this.closeModal('importGoodsPopVisible')}
                />*/}
                <AddSalePrice
                    visible={this.state.addSalePriceVisible}
                    dataSource={this.state.noPriceDataSource}
                    onClose={()=>this.closeModal('addSalePriceVisible')}
                    okCallback={()=>this.putOrOutConfirm(this.currentProdCode, 1)}
                />

                {/*分配子账号*/}
                <Choose
                    visible={this.state.assignSubAccountVisible}
                    getUrl={`/goods/subAccounts/${this.state.curGoodsId}`}
                    postUrl={`/goods/allocSubAccounts/${this.state.curGoodsId}`}
                    onClose={this.closeModal.bind(this, 'assignSubAccountVisible')}
                />

                {/*批量分配子账号*/}
                <Choose
                    pageType={'batchChoose'}
                    visible={this.state.batchAssignSubAccountVisible}
                    postUrl={`/goods/batch/allocSubAccounts`}
                    selectIds={prodIds}
                    onClose={this.closeModal.bind(this, 'batchAssignSubAccountVisible')}
                    onOk={this.checkRemove}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    subAccountList: state.getIn(['accountIndex', 'subAccountList']),
    goodsList: state.getIn(['goodsIndex', 'goodsList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsList,
        asyncToggleGoodsInfo,
        asyncDeleteGoodsInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchWareByCode,
        asyncSetDistribute,
        dealFilterConfigList,
        asyncFetchSubAccountList,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)