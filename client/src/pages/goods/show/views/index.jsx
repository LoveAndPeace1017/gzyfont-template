import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Dropdown, Menu, Table, Row, Col, message, Spin, Tabs, Tooltip} from 'antd';
import {asyncFetchGoodsById,asyncAddQuotationGoods} from '../../add/actions';
import {asyncDeleteGoodsInfo} from '../../index/actions';
import {asyncFetchExpressList} from '../../../auxiliary/rate/actions';
import {asyncFetchSupplierQuotationRecord} from '../actions';
import {actions as supplierAddActions} from 'pages/supplier/add';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {DownOutlined} from '@ant-design/icons';
import Icon from 'components/widgets/icon';
import OpeBar from 'components/business/opeBar';
import FileView from 'components/business/fileView';
import {AttributeInfo, AttributeBlock} from 'components/business/attributeBlock';
import {getYmd} from 'utils/format';
import OperatorLog from "components/business/operatorLog/views";
import Crumb from "components/business/crumb/views";
import {SpecAddModal} from  "components/business/multiGoods";
import SupplierQuotationModal from 'components/business/supplierQuotation';
import {detailPage} from  'components/layout/listPage';
import {Carousel} from 'pages/onlineOrder/cartDetail';
import {Link, withRouter} from "react-router-dom";
import ReactDOM from "react-dom";
import {PurchaseRecord} from 'pages/purchase/index'
import {SaleRecord} from 'pages/sale/index'
import {InboundRecord} from 'pages/inventory/inbound/index'
import {OutboundRecord} from 'pages/inventory/outbound/index'
import {CustomerRecord} from 'pages/customer/index'
import SupplierQuotationRecord from './supplierQuotationRecord'
import {actions as addGoodsActions} from 'pages/goods/add'
import {AddSalePrice, actions as indexGoodsActions} from "pages/goods/index";
import {getUrlParamValue} from 'utils/urlParam';
import intl from 'react-intl-universal';
import filterImgXss from 'utils/filterImgXss';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import MultiSpecList from './multiSpecList'
const cx = classNames.bind(styles);
const {Content} = Layout;
const {TabPane} = Tabs;

class Portal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        if (!!props) {
            this.el.id = props.id || false
            if (props.className) {
                this.el.className = props.className;
            }
            if (props.style) {
                Object.keys(props.style).map((v) => {
                    this.el.style[v] = props.style[v]
                })
            }
            document.getElementById('contentWrap').appendChild(this.el)
        }
    }

    componentDidMount() {
        document.getElementById('contentWrap').appendChild(this.el);
    }

    componentWillUnmount() {
        document.getElementById('contentWrap').removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        )
    }
}

export class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {
            bigPicIndex: 0,
            addSalePriceVisible: false,
            addMultiSpecVisible: false,  // 添加规格弹层
            supplyQuotationVisible: false, //供应商报价弹层
        }
    }

    refresh=(nextId)=>{
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchGoodsById(id, (res) => {
                let errorMsg = res.getIn(['data', 'retCode']) !== 0 && res.getIn(['data', 'retMsg']);
                if (errorMsg) {
                    Modal.info({
                        title: intl.get('common.confirm.title'),
                        content: errorMsg
                    });
                }
            })
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.refresh(nextProps.match.params.id);
        }
    }

    componentDidMount() {
        this.props.asyncFetchExpressList('rate');
        this.refresh();
    }

    componentWillUnmount() {
        this.props.emptyUploadPicData();
        this.clearBigImageTimer();
        // this.props.resetGoodsInfo();
    }

    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            okText: intl.get('common.confirm.okText'),
            cancelText: intl.get('common.confirm.cancelText'),
            content: intl.get('common.confirm.content1'),
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteGoodsInfo([id], function (res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success(intl.get('common.confirm.deleteSuccess'));
                            self.props.history.push('/goods/')
                        } else {
                            message.error(res.retMsg);
                        }
                    });
                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    setUpdateBigImageTimer = () => {
        this.clearBigImageTimer();
        this.timer = setInterval(() => {
            const imageCnt = this.getImageCount()
            if (imageCnt > 1) {
                this.setState({
                    bigPicIndex: (this.state.bigPicIndex + 1) % imageCnt
                })
            }
        }, 5000);
    };

    clearBigImageTimer = () => {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    };

    getInfo(flag) {
        const {goodsInfo} = this.props;
        return flag?(goodsInfo && goodsInfo.getIn(['data'])):(goodsInfo && goodsInfo.getIn(['data', 'data']));
    }

    productAttrInfo = () => {
        const info = this.getInfo();
        const {goodsInfo} = this.props;
        const categoryList = goodsInfo && goodsInfo.getIn(['data', 'categoryList']);
        const classNames = 'goods-note';
        const data = [{
            name: intl.get("goods.show.displayCode"),
            value: info.get('displayCode')
        }, {
            name: intl.get("goods.show.unit"),
            value: this.getUnit()
        }, {
            name: intl.get("goods.show.description"),
            value: info.get('description')
        }, {
            name: intl.get("goods.show.categoryList"),
            value: categoryList && categoryList.join('>')
        }];
        return <AttributeBlock data={data} customClassName={classNames}/>
    };

    productOtherInfo = () => {
        const info = this.getInfo();
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        const classNames = 'goods-note';
        const data = [{
            name: intl.get("goods.show.proBarCode"),
            value: info.get('proBarCode')
        }, {
            name: intl.get("goods.show.brand"),
            value: info.get('brand')
        }, {
            name: intl.get("goods.show.produceModel"),
            value: info.get('produceModel')
        }, {
            name: intl.get("goods.show.quantity"),
            value: fixedDecimal(info.get('minQuantity'), quantityDecimalNum) + " - " + fixedDecimal(info.get('maxQuantity'), quantityDecimalNum)
        }];

        const {goodsInfo} = this.props;
        const tags = goodsInfo && goodsInfo.getIn(['data', 'tags']) && goodsInfo.getIn(['data', 'tags']).toJS();
        const data1 = goodsInfo.getIn(['data', 'data']);

        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            let propertyValues = (data1.get('propertyValues') && data1.get('propertyValues').toJS()) || {};
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: this.preProcessDataTagValue(value, propertyValues[mappingName])
                })
            }
        });

        Array.prototype.push.apply(data, [
            {
                name: '保质期管理',
                value: !info.get('expirationFlag') ? '关闭': '开启'
            },
            {
                name: '保质期（天）',
                value: info.get('expirationFlag') ? info.get('expirationDay') : '-'
            },
            {
                name: '报警天数',
                value: info.get('expirationFlag') ? info.get('alarmDay') : '-'
            },
            {
                name: '采购提前期（天）',
                value: info.get('purchaseLead')
            }
        ]);

        return <AttributeBlock data={data} customClassName={classNames}/>
    };

    prodPriceInfo = () => {
        let priceDecimalNum = getCookie("priceDecimalNum");
        const columns = [{
            align: 'left',
            title: intl.get("goods.show.level"),
            dataIndex: 'level',
            key: 'level',
            width: 150
        }, {
            align: 'right',
            title: intl.get("goods.show.discount"),
            dataIndex: 'discount',
            key: 'discount',
            width: 150
        }, {
            align: 'right',
            title: intl.get("goods.show.sale_price"),
            dataIndex: 'sale_price',
            key: 'sale_price',
            width: 150
        }];

        const column1 = [{
            align: 'left',
            title: "单位名称",
            dataIndex: 'unitName',
            key: 'unitName',
            width: 150
        }, {
            align: 'right',
            title: "单位关系",
            dataIndex: 'unitConverter',
            key: 'unitConverter',
            width: 150
        }, {
            align: 'right',
            title: "单位条码",
            dataIndex: 'proBarCode',
            key: 'proBarCode',
            width: 150
        }];

        const {goodsInfo} = this.props;
        let levelList = goodsInfo && goodsInfo.getIn(['data', 'priceList']);
        let unitFlag = goodsInfo && goodsInfo.getIn(['data','data','unitFlag']);
        let otherUnits = []
        if(unitFlag){
            otherUnits = goodsInfo && goodsInfo.getIn(['data','data','otherUnits']).toJS();
        }
        // const salePrice = this.getInfo() && this.getInfo().get('salePrice');

        const data = levelList.map((item) => {
            return {
                key: item.get('id'),
                level: item.get('name'),
                discount: item.get('percentage') + '%',
                sale_price: item.get('salePrice') && fixedDecimal(item.get('salePrice'), priceDecimalNum)
            }
        });
        const menu = (
            <Menu>
                <Menu.Item>
                    <Table columns={columns} dataSource={Array.from(data)} pagination={false}/>
                </Menu.Item>
            </Menu>
        );

        const menu1 = (
            <Menu>
                <Menu.Item>
                    <Table columns={column1} dataSource={otherUnits} pagination={false}/>
                </Menu.Item>
            </Menu>
        );

        const info = this.getInfo();
        return (
            <div style={{paddingLeft: 10, paddingTop: 20, paddingBottom: 20}}>
                <div className={cx("price-item")}><span className={cx("price-attr-key")}>{intl.get("goods.show.orderPrice")}：</span><span
                    className={cx("quantity")}>{info.get('orderPrice') && fixedDecimal(info.get('orderPrice'), priceDecimalNum)}</span>
                    <span className={cx("price-attr-key")}>{"元/" + this.getUnit()}</span>
                </div>
                <div className={cx("price-item")}>
                    <span className={cx("price-attr-key")}>{intl.get("goods.show.salePrice")}：</span><span
                    className={cx("quantity")}>{info.get('salePrice') && fixedDecimal(info.get('salePrice'), priceDecimalNum)}</span>
                    <span className={cx("price-attr-key")}>{"元/" + this.getUnit()}</span>
                </div>
                <div className={cx("price-item")}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                            {intl.get("goods.show.priceDetail")} <DownOutlined />
                        </a>
                    </Dropdown>
                </div>
                {
                    unitFlag?(
                        <div className={cx("price-item")}>
                            <Dropdown overlay={menu1} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#">
                                    多单位详情 <DownOutlined />
                                </a>
                            </Dropdown>
                        </div>
                    ):null
                }
            </div>
        )
    };

    inventoryInfo = () => {
        const {goodsInfo} = this.props;
        const wareList = goodsInfo && goodsInfo.getIn(['data', 'stockList']);
        const currStock = goodsInfo && goodsInfo.getIn(['data', 'data', 'currentQuantity']);
        const menu = (
            <Menu>
                <Menu.Item>
                    <div className={cx("vertical-margin")}>
                        {intl.get("goods.show.warehouseDetail")}
                    </div>
                    {
                        wareList && wareList.map((item, index) => {
                            return (
                                <div key={index} className={cx("vertical-margin")}>
                                    {item.get('wareName') + " : " + item.get('stockCount')}
                                </div>
                            );
                        })
                    }
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={cx("float-right")}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">
                        {intl.get("goods.show.all")}：<span
                        className={cx("quantity")}>{currStock}</span> {this.getUnit()} <DownOutlined />
                    </a>
                </Dropdown>
            </div>
        )
    };

    getImageCount() {
        const {goodsInfo} = this.props;
        const imageList = goodsInfo && goodsInfo.getIn(['data', 'data', 'images']);
        if (imageList) {
            return imageList.size;
        }
        return 0;
    }

    getUnit() {
        const goodsInfo = this.getInfo();
        return goodsInfo && goodsInfo.get('unit');
    }

    renderProdInfo() {
        const {match} = this.props;
        const id = match.params.id;
        const goodsInfo = this.getInfo();
        const allInfo = this.getInfo(true);
        const prodName = goodsInfo && goodsInfo.get('name');
        return (
            <div className={cx('content-gt')}>
                {this.inventoryInfo()}
                <div>
                    <div>
                        <p className={cx("prod-name")}>{prodName} {goodsInfo && goodsInfo.get('distributionFlag') == 1 && <Tooltip
                            title={intl.get("goods.show.tip1")}
                        >
                            <Icon type="icon-mall" className={cx("mall-on")}/>
                        </Tooltip>} </p>
                    </div>
                    {this.productAttrInfo()}
                </div>
                <div className={cx(["price-info", "info-block-margin-top"])}>
                    {this.prodPriceInfo()}
                </div>
                <div>
                    <MultiSpecList id={id} specDefine={allInfo && allInfo.get("specDefine") && allInfo.get("specDefine").toJS()} specProds={allInfo && allInfo.get("specProds") && allInfo.get("specProds").toJS()}/>
                </div>
                <div className={cx("info-block-margin-top")}>
                    {this.productOtherInfo()}
                    <div className={cx("goods-remarks")}>
                        <AttributeBlock data={[{name: intl.get("goods.show.remark"), value: this.getInfo().get('remarks')}]}
                                        customClassName="goods-note"/>
                    </div>
                </div>
                <div className={cx(["info-block-margin-top", "attach-info"])}>
                    <AttributeInfo data={{name:intl.get("goods.show.attr"), value:goodsInfo.get('fileInfo') && goodsInfo.get('fileInfo').map((file) => {
                            return (
                                <div key={file.get('fileId')}>
                                    <a style={{color: '#499fff'}}
                                       href={`${BASE_URL}/file/download/?url=/file/download/${file.get('fileId')}`}
                                    >
                                        {file.get('fileName')}
                                    </a>
                                    <FileView fileId={file.get('fileId')} fileName={file.get('fileName')}/>
                                </div>
                            )
                        })}} />
                </div>
                <div>
                    <OperatorLog logInfo={{
                        creator: goodsInfo.get('addedName') || goodsInfo.get('addedLoginName'),
                        createDate: getYmd(goodsInfo.get('addedTime')),
                        lastModifier: goodsInfo.get('updatedName') || goodsInfo.get('updatedLoginName'),
                        lastModifyDate: getYmd(goodsInfo.get('updatedTime'))
                    }}/>
                </div>

            </div>
        );
    }

    handleTabClick = (activeKey) => {
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };

    /**
     * 上下架操作
     **/
    putOrOutConfirm=(prodCode, type)=>{
        const _this = this;
        const text = type==1?intl.get("goods.show.up"):intl.get("goods.show.down");
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("goods.show.tip2")+`${text}？`,
            onOk() {
                _this.props.asyncSetDistribute([{prodNo: prodCode}], type, function(res) {
                    if (res.retCode === '0') {
                        message.success(`${text}`+intl.get("goods.show.success"));
                        _this.refresh();
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
    putaway = (salePrice, prodCode)=>{
        if(salePrice){
            this.putOrOutConfirm(prodCode, 1);
        }else{
            this.currentProdCode = prodCode;
            this.openModal('addSalePriceVisible')
        }
    };

    /**
     *下架
     */
    soldOut = (prodCode)=> {
        this.putOrOutConfirm(prodCode, 0);
    };

    openModal=(visibleType)=>{
        this.setState({
            [visibleType]: true
        })
    };

    closeModal=(visibleType)=>{
        this.setState({
            [visibleType]: false
        })
    };

    render() {
        const {goodsInfo,rateList} = this.props;

        const data = goodsInfo.getIn(['data', 'data']);
        const specDefine = goodsInfo.getIn(['data', 'specDefine']) && goodsInfo.getIn(['data', 'specDefine']).toJS();
        const specProds = goodsInfo.getIn(['data', 'specProds']) && goodsInfo.getIn(['data', 'specProds']).toJS();
        const dataProductSyncBo = goodsInfo.getIn(['data', 'retCode']) === '0' && goodsInfo.getIn(['data', 'dataProductSyncBo']);
        const micPid = dataProductSyncBo && dataProductSyncBo.get('micPid');
        const detailData = goodsInfo && data !== '' && data;
        let taxRate = rateList && rateList.getIn(['rate', 'defaultValue']);
        let unitFlag = goodsInfo && goodsInfo.getIn(['data','data','unitFlag']);
        const {match} = this.props;
        const id = match.params.id;

        const activeKey = this.props.location.hash.replace('#', '');

        let renderContent = null;
        if (goodsInfo && goodsInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (detailData) {
            const imageList = detailData.get('images');
            const prodDesc =  detailData.get('prodDesc') || (micPid && dataProductSyncBo && dataProductSyncBo.get('prodDesc')) ;
            renderContent = (
                <React.Fragment>
                    <div className="cf">
                        {/*<Portal>*/}
                        <Carousel imgInfoWrap={imageList && imageList.toJS()} isGoods={true}/>
                        {/*</Portal>*/}
                        {
                            this.renderProdInfo()
                        }
                    </div>
                    {
                        prodDesc ? (
                            <div className={cx("prod-desc")}>
                                <div className={cx("prod-desc-tit")}>
                                    “{this.getInfo().get('name')}”{intl.get("goods.show.detailIntroduce")}
                                </div>
                                <div className={cx("prod-desc-content")} dangerouslySetInnerHTML={{
                                    __html: filterImgXss(prodDesc)
                                }}/>
                            </div>
                        ) : null
                    }
                </React.Fragment>

            )
        }

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={getUrlParamValue('source') === 'mall'?[
                        {
                            url: '/mall/',
                            title: intl.get("goods.show.crumb1")
                        },
                        {
                            url: '/mall/goods/',
                            title: intl.get("goods.show.crumb2")
                        },
                        {
                            title: intl.get("goods.show.crumb3")
                        }
                    ]:[
                        {title: intl.get("goods.show.crumb4")},
                        {url: '/goods', title: intl.get("goods.show.goodsList")},
                        {title: intl.get("goods.show.detail")}
                    ]}/>
                </div>
                <div className="detail-content">
                    <OpeBar data={{
                        listData: [
                            {
                                name: 'order',
                                path: '/purchase/add?productCode=' + id
                            },
                            {
                                name: 'sale',
                                path: '/sale/add?productCode=' + id
                            },
                            {
                                name: 'storeIn',
                                path: '/inventory/inbound/add?productCode=' + id
                            },
                            {
                                name: 'storeOut',
                                path: '/inventory/outbound/add?productCode=' + id +'&outType=2'
                            },
                            /*{
                                label: detailData && detailData.get('distributionFlag') == 1? intl.get("goods.show.down"): intl.get("goods.show.up"),
                                name: 'distribution',
                                icon: 'icon-mall',
                                onClick: () => {
                                    if(detailData && detailData.get('distributionFlag') == 1){
                                        this.soldOut(detailData.get('code'));
                                    }else{
                                        this.putaway(detailData.get('salePrice'), detailData.get('code'))
                                    }
                                }
                            },*/
                            {
                                name: 'edit',
                                module: 'goods',
                                path: `/goods/modify/${id}?source=${getUrlParamValue('source')}&current=${getUrlParamValue('current')}`
                            },
                            {
                                name: 'delete',
                                module: 'goods',
                                onClick: () => {
                                    this.showConfirm();
                                }
                            },
                            {
                                name: 'copy',
                                module: 'goods',
                                path: `/goods/copy/${id}?source=${getUrlParamValue('source')}&current=${getUrlParamValue('current')}`
                            },
                            {
                                name: 'inquiry'
                            },
                            {
                                name: 'store',
                                path: `/report/flowmeter/detail?prodNo=${id}&prodName=${this.getInfo() ? this.getInfo().get('name') : ''}`
                            },
                            {
                                label: intl.get("goods.show.serialNum"),
                                name: 'serialNum',
                                icon: 'icon-serial',
                                vipSource: 'serial',
                                onClick: () => {
                                    this.props.history.push(`/goods/serialNumQuery?prodNo=${id}&prodName=${this.getInfo() ? this.getInfo().get('name') : ''}`);
                                }
                            },
                            {
                                name: 'batchShelfLeft',
                                module: 'goods',
                                onClick: () => {
                                    const storage = window.localStorage;
                                    let prodName = this.getInfo().get('name');
                                    storage.setItem('batchqueryprods',`${id},${prodName}`);
                                    this.props.history.push('/report/batchQuery/detail?productCode='+id);
                                }
                            },
                            {
                                name: 'multiSpec',
                                module: 'goods',
                                disabled: !specDefine,
                                option: 'add',
                                onClick: () => {
                                    this.openModal('addMultiSpecVisible');
                                }
                            },
                            {
                                name: 'supplierQuotation',
                                onClick: () => {
                                    this.openModal('supplyQuotationVisible');
                                }
                            }
                        ],
                        // moreData: [
                        //     // {
                        //     //     name: 'orderRecord',
                        //     //     path: `/report/purchase/detail?prodNo=${id}&prodName=${this.getInfo() ? this.getInfo().get('name') : ''}`
                        //     // },
                        //     // {
                        //     //     name: 'saleRecord',
                        //     //     path: `/report/sale/detail?prodNo=${id}&prodName=${this.getInfo() ? this.getInfo().get('name') : ''}`
                        //     // },
                        //     {
                        //         name: 'store',
                        //         path: `/report/flowmeter/detail?prodNo=${id}&prodName=${this.getInfo() ? this.getInfo().get('name') : ''}`
                        //     }
                        // ]
                    }}/>
                    <div className="detail-content-bd">
                        <Tabs
                            onTabClick={this.handleTabClick}
                            defaultActiveKey={activeKey}
                            className="record-tab"
                        >
                            <TabPane tab={intl.get("goods.show.title1")} key="goodsInfo">
                                {renderContent}
                            </TabPane>
                            <TabPane tab={"供应商报价"} key="supplierQuotationRecord">
                                <SupplierQuotationRecord recordFor={id}
                                                         goodsName={detailData && detailData.get('name')}
                                                         unitFlag={unitFlag}
                                                         noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                            <TabPane tab={intl.get("goods.show.title2")} key="purchaseRecord">
                                <PurchaseRecord module={"purchase"} option={"show"} type="prods" recordFor={id}
                                                noAuthRender={<span
                                                    style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                            <TabPane tab={intl.get("goods.show.title3")} key="saleRecord">
                                <SaleRecord module={"sale"} option={"show"} type="prods" recordFor={id}
                                            noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                            <TabPane tab={intl.get("goods.show.title4")} key="inboundRecord">
                                <InboundRecord module={"inbound"} option={"show"} type="prods" recordFor={id}
                                               noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                            <TabPane tab={intl.get("goods.show.title5")} key="outboundRecord">
                                <OutboundRecord module={"outbound"} option={"show"} type="prods" recordFor={id}
                                                noAuthRender={<span
                                                    style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                            <TabPane tab={"客户价格表"} key="customerRecord">
                                <CustomerRecord  module={"goods"} option={"show"} type="prods"
                                                 recordFor={id}
                                                 noAuthRender={<span
                                                     style={{paddingTop: '30px'}}>{intl.get("goods.show.noAuth")}</span>}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
                <AddSalePrice
                    visible={this.state.addSalePriceVisible}
                    dataSource={detailData && [{serial:1,displayCode: detailData.get('code'), prodName: detailData.get('name')}]}
                    onClose={()=>this.closeModal('addSalePriceVisible')}
                    okCallback={()=>this.putOrOutConfirm(id, 1)}
                />
                <SupplierQuotationModal
                    visible={this.state.supplyQuotationVisible}
                    onClose={()=>this.closeModal('supplyQuotationVisible')}
                    onOk={() => {
                        this.closeModal('supplyQuotationVisible');
                        this.props.asyncFetchSupplierQuotationRecord({
                            recordFor: id,
                            perPage: 20,
                            page: 1,
                        });
                    }}
                    maxLength={200}
                    goodsName={detailData && detailData.get('name')}
                    unit={this.getUnit()}
                    unitFlag={unitFlag}
                    asyncShowSupplier = {this.props.asyncShowSupplier} //根据供应商获取联系人等字段
                    asyncAddQuotationGoods={this.props.asyncAddQuotationGoods} //新增报价记录
                    taxRate={taxRate}
                    productCode={id}
                />
                {
                    specDefine && (
                        <SpecAddModal
                            visible={this.state.addMultiSpecVisible}
                            onClose={()=>this.closeModal('addMultiSpecVisible')}
                            onOk={() => {
                                this.closeModal('addMultiSpecVisible');
                                location.reload();
                            }}
                            specDefine={specDefine}
                            specProds={specProds}
                            maxLength={200}
                            billNo={id}
                        />
                    )
                }

            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    goodsInfo: state.getIn(['goodsAdd', 'goodsInfo']),
    rateList: state.getIn(['auxiliaryRate', 'rateList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsById,
        asyncDeleteGoodsInfo,
        asyncFetchExpressList,
        asyncAddQuotationGoods,
        asyncFetchSupplierQuotationRecord,
        asyncShowSupplier: supplierAddActions.asyncShowSupplierForSelect,
        emptyUploadPicData: addGoodsActions.emptyUploadPicData,
        asyncSetDistribute: indexGoodsActions.asyncSetDistribute
    }, dispatch)
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Index));