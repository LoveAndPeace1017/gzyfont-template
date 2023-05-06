import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Spin, message, Layout, Button } from 'antd';

const {Content} = Layout;

import Crumb from 'components/business/crumb';
import ShoppingCart from 'components/business/shoppingCart';
import Carousel from './carousel';

import ControlAmount from 'components/business/controlAmount';
import {AddToCartBtn} from 'components/widgets/addCartBtn';
import {actions as onlineOrderCartDetailActions} from '../index'
import {reducer as onlineOrderCartDetailIndex} from "../index";
import {actions as onlineOrderHomeActions} from 'pages/onlineOrder/home';
import {companyMenu as CompanyMenu} from 'pages/onlineOrder/customerIntroduce';
import SuggestSearch from  'components/business/suggestSearch';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);

class Portal extends React.Component{
    constructor(props) {
        super(props)
        this.el = document.createElement('div');
        if (!!props) {
            this.el.id = props.id || false
            if (props.className) this.el.className = props.className;
            if (props.style) {
                Object.keys(props.style).map((v) => {
                    this.el.style[v] = props.style[v]
                })
            }
            document.getElementById('contentWrap').appendChild(this.el);
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

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            preview:false
        };
    }
    componentDidMount() {
        const {supplierUserIdEnc, supplierProductCode} = this.props.match.params;
        this.props.asyncFetchCartDetailData({params: {supplierUserIdEnc: supplierUserIdEnc, supplierProductCode: supplierProductCode}});
        this.props.asyncFetchCartCount();
    }
    onChange (val) {
        this.setState({quantity: val});
    }

    submitOrder = (prod,supplierUserIdEnc) => {
        let submitData = [{
            supplierCode: prod.supplierCode,
            quantity:this.state.quantity,
            supplierProductCode: prod.supplierProductCode||prod.code,
            supplierUserIdEnc: supplierUserIdEnc
        }];
        localStorage.setItem('prodList', JSON.stringify(submitData));
        this.props.history.push('/onlineOrder/cartOrder');
    };

    onSearch = (value)=>{
        console.log(value);
        let companyId = this.props.match.params.supplierUserIdEnc;
        this.props.history.push(`/onlineOrder/customer/prodAll/${companyId}?key=${value}`);
    };

    render() {
        const {isFetching, prodList, supplier, cartAmount,companyInfor,count} = this.props;
        const {quantity} = this.state;
        const prod = prodList ? prodList.toJS() : [];
        const supplierDetailList = supplier ? supplier.toJS() : [];
        const companyId = this.props.match.params.supplierUserIdEnc;
        const companyInfors = companyInfor? companyInfor.toJS() : {};

        return (
            <Layout>
                <div className={cx(['content-hd', 'cart-order'])}>
                    <Crumb data={[
                        {
                            url: '/onlineOrder/',
                            title: '在线订货'
                        },
                        {
                            title: '详情页'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <ShoppingCart cartAmount={cartAmount}/>
                    </div>
                </div>
                <div className="detail-content">
                    <Spin
                        spinning={isFetching}
                    >
                        <Content style={{background: '#fff', padding: 24, margin: 0, flex: 1, overflow: 'hidden', minWidth: '1190px'}}>
                            <div className={cx("wild-hd")+" clearfix"}>
                                <div className={cx("customer-title")}>
                                    {companyInfors.mallName}
                                </div>
                                <div className={cx("customer-information")}>
                                    <span className={cx("gray")}>联系人：</span>{companyInfors.mallContacter} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span className={cx("gray")}>联系电话：</span>{companyInfors.mallPhone} <br/>
                                    共计<span className={cx("red")}>{count}</span>种在售商品
                                </div>
                                <div style={{marginTop:"20px"}} className={cx("float-right")}>
                                    <div className={cx("list-search")}>
                                        <SuggestSearch
                                            placeholder={'物品编号/物品名称/商品条码/规格型号'}
                                            onSearch={this.onSearch}
                                            maxLength={50}
                                            url={`/online/order/search/tips`}
                                            params={{mallUserId: companyId}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <CompanyMenu data={[
                                {
                                    title: '首页',
                                    url: '/onlineOrder/'+companyId+'/customerIndex',
                                    isCurrent: false
                                },
                                {
                                    title: '所有商品',
                                    url: '/onlineOrder/customer/prodAll/'+companyId,
                                    isCurrent: false
                                },
                                {
                                    title: '公司介绍',
                                    url: '/onlineOrder/customer/introduce/'+companyId,
                                    isCurrent: false
                                },
                                {
                                    title: '商城小程序',
                                    url: '#',
                                    isCurrent: false,
                                    imgUrl: `${companyInfors.wxAppletImgUrl}`
                                },
                            ]}/>

                            {/*<Portal>*/}
                                <Carousel imgInfoWrap={prod.images}/>
                            {/*</Portal>*/}

                            <div className={cx('content-gt')}>
                                <h2 className={cx('goods-tit')}>{prod.name}</h2>
                                <div className={cx('goods-desc')}>
                                    <span className={cx('goods-desc-tit')}>物品编号:</span>
                                    <span className={cx('goods-desc-con')}>{prod.displayCode}</span>
                                    <span className={cx('goods-desc-tit')}>单位：</span>
                                    <span className={cx('goods-desc-con')}>{prod.unit}</span>
                                    <span className={cx('goods-desc-tit')}>规格型号：</span>
                                    <span className={cx('goods-desc-con')}>{prod.description}</span>
                                </div>
                                <div className={cx('goods-price')}>
                                    <p>销售价：<span className={cx('red')}>{prod.salePrice}元</span>/{prod.unit}</p>
                                </div>
                                <div className={cx('goods-desc')}>
                                    <span className={cx('goods-desc-tit')}>商品条码：</span>
                                    <span className={cx('goods-desc-con')}>{prod.proBarCode || '-'}</span>
                                    <span className={cx('goods-desc-tit')}>供应商名称：</span>
                                    <span className={cx('goods-desc-con')}>{supplierDetailList.name  || '-'}</span>
                                    <span className={cx('goods-desc-tit')}>品牌：</span>
                                    <span className={cx('goods-desc-con')}>{prod.brand  || '-'}</span>
                                    <span className={cx('goods-desc-tit')}>备注：</span>
                                    <span className={cx('goods-desc-con')}>{prod.remarks  || '-'}</span>
                                </div>
                                <div className={cx('goods-amount')}>
                                    <ControlAmount onChange={(val) => this.onChange(val)} amount={quantity}/>
                                </div>


                                <div className={cx("goods-submit")}>
                                    <Button className={cx("goods-sub-btn")} onClick={() => this.submitOrder(prod,companyId)}>立即订购</Button>
                                    <AddToCartBtn prod={prod} supplierUserIdEnc={companyId} preview={this.state.preview}
                                                  selfClassName={cx("goods-sub-btn")} quantity={this.state.quantity}
                                    />
                                </div>
                            </div>

                        </Content>
                    </Spin>
                    <div className={cx("prod-desc")}>
                        <div className={cx("prod-desc-tit")}>
                            详细介绍
                        </div>
                        <div className={cx("prod-desc-content")} dangerouslySetInnerHTML={{
                            __html: prod.text
                        }}/>
                    </div>
                </div>
            </Layout>
        )
    }
}


const mapStateToProps = (state) => ({
    isFetching: state.getIn(['onlineOrderCartDetailIndex', 'onlineOrderCartDetailList', 'isFetching']),
    prodList: state.getIn(['onlineOrderCartDetailIndex', 'onlineOrderCartDetailList', 'prodList']),
    companyInfor: state.getIn(['onlineOrderCartDetailIndex', 'onlineOrderCartDetailList', 'companyInfor']),
    count: state.getIn(['onlineOrderCartDetailIndex', 'onlineOrderCartDetailList', 'count']),
    supplier: state.getIn(['onlineOrderCartDetailIndex', 'onlineOrderCartDetailList', 'supplier']),
    cartAmount: state.getIn(['onlineOrderCartListHomeIndex', 'onlineOrderHomeListOrderList','cartAmount'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartDetailData:onlineOrderCartDetailActions.asyncFetchCartDetailData,
        asyncFetchCartCount: onlineOrderHomeActions.asyncFetchCartCount
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)
