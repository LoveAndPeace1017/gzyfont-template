import React, {Component} from 'react';
import {
    Modal, Menu, Dropdown, message, Spin, Switch, Checkbox, Popover, Button, Layout, Tooltip
} from 'antd';

import {Link} from 'react-router-dom';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import MallGuide from 'components/business/mallGuide';
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import Crumb from 'components/business/crumb';
import {CateFilter} from 'pages/auxiliary/category';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import FooterFixedBar from  'components/layout/footerFixedBar';
import AddSalePrice from "pages/goods/index/views/addSalePrice";
import ListPage from  'components/layout/listPage'
import {
    asyncFetchGoodsList,
    asyncFetchWareByCode,
    asyncSetDistribute,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,

} from  'pages/goods/index/actions';
import {Explore, actions as mallHomeActions, redirectToHome} from 'pages/mall/home'
const cx = classNames.bind(styles);


export class Index extends ListPage {
    constructor(props){
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            selectedRows:[],
            listToolBarVisible: true,
            filterToolBarVisible: false,
            cateVisible: false,
            checkResultVisible: false,
            tableWidth: 1800,
            condition: {
                disableFlag: 0,
                source: 'mall'
            },
            catCode: '',
            goodsGuideVisible: props.location.state && (props.location.state.fromFourStep || props.location.state.fromExplore) && !props.location.state.fromGuideAdd,
            goodsSuccessGuideVisible: props.location.state && (props.location.state.fromFourStep || props.location.state.fromExplore) && props.location.state.fromGuideAdd,
            setMallSuccessVisible: false,
            exploreVisible: false,
            addSalePriceVisible:false,
            noPriceDataSource:[],
            addPriceCallback:null
        };

    }

    fetchListData = (callback) => {
        //初始化列表数据
        this.props.asyncFetchGoodsList(this.state.condition,callback);
    };

    componentDidMount() {
        this.fetchListData();
    }


    batchUpdateConfig = (callback)=>{
        const {goodsList} = this.props;
        let filterConfigList = goodsList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = goodsList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let cannotEditFilterColumnsMap = {};
        let moduleType = {
            search:'mall_product_search_list',
            table:'mall_product_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);

    };

    onSwitchChange = (checked, data) => {
        let _this = this;
        let callback = function(){
            _this.fetchListData(()=>{
                message.success('操作成功!');
            });
        };
        if(checked){
            this.onOpenDistribute([data.code],[data],callback);
        }else{
            this.cancelDistribute([data.code],callback);
        }
    };
    conformDistribute = (params) => {
        let {ids, content, optionFlag,callback} = params;
        ids = ids.map((id)=> {
            return {
                prodNo:id
            }
        });
        let _this = this;
        let prefix = optionFlag?'openDistribute':'cancelDistribute';
        if(callback){
            prefix = 'batch-' + prefix;
        }
        Modal.confirm({
            title: '提示信息',
            content: content,
            okText:'确定',
            cancelText:'取消',
            okButtonProps:{
                'ga-data':prefix + '-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix + '-cancel'
            },
            onOk() {
                _this.props.asyncSetDistribute(ids, optionFlag, function(res) {
                    if (res.retCode === '0') {
                        if(callback){
                            callback()
                        }else{
                            message.success('操作成功!');
                            _this.refresh();
                            _this.checkRemove();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };
    cancelDistribute = (ids, callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: '下架后，该商品不会在商城展示。',
            optionFlag: 0,
        });
    };
    onOpenDistribute = (ids, rows, callback) => {
        let _this = this;
        let func = function(){
            _this.conformDistribute({
                ids,
                callback,
                content: '上架后，该商品会在商城展示。',
                optionFlag: 1
            });
        };
        let noPriceRows = [];
        rows.forEach((item,index)=>{
           if(!item.salePrice){
               item.serial = index+1;
               noPriceRows.push(item);
           }
        });
        if(noPriceRows.length>0){
            this.setState({
                noPriceDataSource:noPriceRows,
                addPriceCallback:function(){
                    _this.refresh();
                    func();
                },
            });
            this.openModal('addSalePriceVisible');
        }else{
            func();
        }
    };

    //类目筛选
    cateFilter = (selectedKeys) => {
        console.log(selectedKeys);
        const catCode = selectedKeys && selectedKeys.length > 0 && selectedKeys[0];
        this.doFilter({catCode});
        this.setState({
            catCode
        })
    };

    cateToggle = () => {
        let tableWidth = this.state.tableWidth;
        if (this.state.cateVisible) {
            tableWidth = tableWidth - 200;
        }
        else {
            tableWidth = tableWidth + 200;
        }
        this.setState(prevState => ({
            cateVisible: !prevState.cateVisible,
            tableWidth
        }))
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

    render() {
        const {goodsList} = this.props;
        let dataSource = goodsList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = goodsList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = goodsList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];

        let paginationInfo = goodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

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
                if(item.align){
                    obj.align = item.align;
                }
                if (item.fieldName === "imageUrl") {
                    obj.title = '';
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
        				    <Link to={`/goods/show/${data.code}?source=mall&current=/mall/goods/`}>{displayCode}</Link>
         			    </span>
                    )
                }else if (item.fieldName === "name") {
                    obj.render = (name, data) => (
                        <span className={cx("txt-clip")} title={name}>
                            {
                                data.distributionFlag == 1?(
                                    <Tooltip
                                        title="商城已上架商品"
                                    >
                                        <Icon type="icon-mall" className={cx("mall-on")}/>
                                    </Tooltip>
                                ):null
                            }
                            <Link to={`/goods/show/${data.code}?source=mall&current=/mall/goods/`}>{name}</Link>
         			    </span>
                    )
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
                                                <div className={cx("tit")}>库存详情</div>
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
                            <span>{currentQuantity}<Icon type="down" className="ml5"/></span>
                        </Dropdown>
                    );
                   /* obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.currentQuantity - next.currentQuantity;

                }
                else if (item.fieldName === "salePrice") {

                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => ((prev.salePrice==undefined)?0:prev.salePrice) - ((next.salePrice==undefined)?0:next.salePrice);

                }
                else if (item.fieldName === "orderPrice") {

                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => ((prev.orderPrice==undefined)?0:prev.orderPrice) - ((next.orderPrice==undefined)?0:next.orderPrice);

                }
                else if (item.fieldName === "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }else{
                    obj.render = (text) => (<span className={cx("txt-clip")} title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            title:'正在销售',
            width: 100,
            render: (operation, data) => <Switch ga-data='list-switch-distribute' checked={data.distributionFlag == 1}
                                                 onChange={(checked) => this.onSwitchChange(checked, data)}/>,
        };


        const filterDataSource = {
            prefixComponents: [
                <div className={cx("toggle-wrap")}>
                    <Checkbox onChange={this.cateToggle} checked={this.state.cateVisible}>显示物品类目</Checkbox>
                </div>
            ],
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: []
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        const guide = this.props.mallPreData.getIn(['data', 'data', 'guide']);



        //引导是否都完成
        const isAllCompleted = guide && guide.get('completed');


        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/mall/',
                            title: '我的商城'
                        },
                        {
                            title: '商品管理'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type="mall_product"
                        />
                    </div>
                </div>

                <div className={cx([{"guide-show": this.state.goodsGuideVisible},{"guide-success-show": this.state.goodsSuccessGuideVisible}]) + " content-index-bd"}>
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            addUrl={{pathname: "/goods/add/?source=mall&current=/mall/goods/", state: this.props.location.state && this.state.goodsGuideVisible?{...this.props.location.state}:{}}}
                            authModule={"goods"}
                            importModule={
                                {
                                    type:"mallGoods",
                                    text:"本地导入",
                                    module: "goods"
                                }
                            }
                            miccnImportType='goods'
                            exportType="goods"
                            onSearch={this.onSearch}
                            searchTipsUrl={`/prods/search/tips?catCode=${this.state.catCode ? this.state.catCode : ''}`}
                            searchPlaceHolder="物品编号/物品名称/商品条码/规格型号"
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"goods"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            onCancelDistribute={this.cancelDistribute}
                            onCancelDistributeText={'下架'}
                            onOpenDistribute={this.onOpenDistribute}
                            onOpenDistributeText={'上架'}
                        />
                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>
                    <div className={cx(["data-goods-wrap",{"cate-hidden": !this.state.cateVisible}]) + " cf"}>
                        <div className={"tb-wrap"}>
                            <div className={cx("tb-wrap-inner") + " cf"}>
                                {
                                    this.state.goodsSuccessGuideVisible && (
                                        <ListTable
                                            columns={tempColumns}
                                            operationColumn={operationColumn}
                                            dataSource={[
                                                {
                                                    "categoryCode":"other",
                                                    "categoryName":"其他",
                                                    "code":"WP00002",
                                                    "currentQuantity":20,
                                                    "diasbleFlag":0,
                                                    "displayCode":"WP00002",
                                                    "failNum":0,
                                                    "mallProd":false,
                                                    "name":"机械加工设备机械加工设备",
                                                    "successNum":0,
                                                    "unit":"个",
                                                    "key":"WP000017",
                                                    "serial":1,
                                                    "prodNo":"WP000017",
                                                    "prodCustomNo":"WP00016",
                                                    "orderPrice": 10.00,
                                                    "salePrice": 20.00,
                                                    "brand":"奥克斯",
                                                    "distributionFlag": 1
                                                }
                                            ]}
                                            rowSelection={rowSelection}
                                            className={cx("guide-goods-highlight")}
                                        />
                                    )
                                }
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
                        <div className={cx("cate")}>
                            <div className={cx("cate-wrap")}>
                                <CateFilter
                                    onSelect={this.cateFilter}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/*新建物品引导*/}
                <div style={{"display": this.state.goodsGuideVisible?"block":"none"}}>
                    <div className={cx("guide-mask")}/>
                    <Button className={cx("guide-skip")} onClick={()=>{
                        this.closeModal('goodsGuideVisible');
                        this.props.asyncFetchMallPreData();
                    }}>跳过</Button>
                    <div className={cx("guide-goods")}>
                        <span className={cx("arrow")} />
                        <p className={cx("loc")}>创建商城共需2步，目前您在第1步：</p>
                        <p className={cx("txt")}>您可以在这里新建商城物品</p>
                    </div>
                </div>

                {/*新建物品成功上架引导*/}
                <div style={{"display": this.state.goodsSuccessGuideVisible?"block":"none"}}>
                    <div className={cx("guide-mask")}/>
                    <Button className={cx("guide-skip")} onClick={()=>this.closeModal('goodsSuccessGuideVisible')}>跳过</Button>
                    <div className={cx(["guide-goods", "guide-goods-success"])}>
                        <span className={cx("arrow")} />
                        <p className={cx("txt")}>新建的物品默认正在销售状态，您可以点击按钮下架商品</p>
                        {
                            this.props.location.state && this.props.location.state.fromExplore?(
                                <Button type="primary" onClick={()=>{
                                    this.closeModal('goodsSuccessGuideVisible');
                                    if(isAllCompleted){
                                        this.openModal('setMallSuccessVisible')
                                    }else{
                                        this.openModal('exploreVisible')
                                    }
                                }}>完成</Button>
                            ):(
                                <Button type="primary"><Link to={{pathname: "/mall/customer/", state: {fromFourStep: true}}}>下一步</Link></Button>
                            )
                        }

                    </div>
                </div>

                {/*商城设置成功*/}
                <MallGuide visible={this.state.setMallSuccessVisible}/>
                <Explore
                    visible={this.state.exploreVisible}
                    onClose={()=>this.closeModal('exploreVisible')}
                />

                <AddSalePrice
                    visible={this.state.addSalePriceVisible}
                    dataSource={this.state.noPriceDataSource}
                    onClose={()=>this.closeModal('addSalePriceVisible')}
                    okCallback={this.state.addPriceCallback}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    goodsList: state.getIn(['goodsIndex', 'goodsList']),
    mallPreData: state.getIn(['mallHome', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsList,
        asyncFetchWareByCode,
        asyncSetDistribute,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchMallPreData: mallHomeActions.asyncFetchPreData
    }, dispatch)
};

export default withRouter(redirectToHome(connect(mapStateToProps, mapDispatchToProps)(Index)))