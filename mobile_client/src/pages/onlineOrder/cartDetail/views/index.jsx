import React, { Component } from 'react';

import Header from 'components/layout/header';
import Slider from './carousel';

import {actions as onlineOrderCartDetailActions} from '../index'
import {actions as onlineOrderCartListOrderListActions} from 'pages/onlineOrder/orderList';

import custom from 'images/custom.png';
import shop from 'images/shop.png';
import phone from 'images/phone.png';
import {AddToCartBtn} from 'components/widgets/addCartBtn';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {formatCurrency} from 'utils/format';
import {Link} from "react-router-dom";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {Toast} from "antd-mobile/lib/index";
import {withRouter} from "react-router-dom";
import {getCookie,deleteCookie} from 'utils/cookie';

const cx = classNames.bind(styles);

class CartDetail extends Component {


    getCartNum = ()=>{
        this.props.asyncFetchCartCount();
    };
    componentDidMount() {
        const {supplierUserIdEnc, supplierProductCode} = this.props.match.params;
        this.props.asyncFetchCartDetailData({params: {supplierUserIdEnc: supplierUserIdEnc, supplierProductCode: supplierProductCode}});
        this.getCartNum();
    }

    //立即订购
    quickOrder = (code, displayCode)=>{
        if(getCookie('preview')=='1'){
            Toast.fail('预览模式无法订购。', 1);
        }else {
            const submitData = [{supplierUserIdEnc: code, supplierProductCode: displayCode, quantity: 1}];
            let inforData = {};
            inforData.prodList = submitData;
            inforData.immediateFlag = true;
            this.props.asyncFetchProductIsUpdata(inforData, (res) => {
                if (res.data.retCode == "0") {
                    document.cookie = "prodList=" + JSON.stringify(submitData);
                    this.props.history.push(`${PROD_PATH}/onlineOrder/orderConfirm?immediateFlag=true`);
                }
                else {
                    Toast.fail(res.data.retMsg, 1);
                }
            })
        }
    };

    /*leftClick = () =>{
        if(getCookie('preview')=='1'){
            deleteCookie('preview');
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHandler) {
                window.webkit.messageHandlers.nativeHandler.postMessage({"action" : "popBack"});
            }else if(window.nativeHandler) {
                window.nativeHandler.popBack && window.nativeHandler.popBack();
            }

        }else{
            this.props.history.goBack();
        }
    }*/

    render() {
        const {isFetching, prodList, supplier, cartAmount, supplierInfor} = this.props;
        const prod = prodList ? prodList.toJS() : {};
        const supplierDetailList = supplier ? supplier.toJS() : [];
        const supplierInforList = supplierInfor? supplierInfor.toJS():{};
        let userId = this.props.match.params.supplierUserIdEnc;
        if(!userId){
            userId = getCookie('mobileUserId');
        }
        return (
            <div className={cx('container')}>

                <Header  navStatus={'cartDetail'}/>

                <div className={cx('main')}>
                    <Slider images={prod.images}/>

                    <div className={cx('cart-prod-info')}>
                        <p className={cx('cart-prod-name')}>{prod.name}</p>
                        <span className={cx('cart-prod-price')}><span className={cx('red')}>{formatCurrency(prod.salePrice)}元</span>/{prod.unit}</span>
                    </div>

                    <div className={cx('cart-prod-detail')}>
                        <p className={cx('com-name')}>{supplierDetailList.name}</p>
                        <div className={cx('cart-prod-desc')}>
                            <p className={cx('cart-desc-item')}>
                                <span className={cx('cart-title')}>物品编号：</span>
                                <span>{prod.code}</span>
                            </p>
                            <p className={cx('cart-desc-item')}>
                                <span className={cx('cart-title')}>规格型号：</span>
                                <span>{prod.description}</span>
                            </p>
                            <p className={cx('cart-desc-item')}>
                                <span className={cx('cart-title')}>商品条码：</span>
                                <span>{prod.proBarCode}</span>
                            </p>
                            <p className={cx('cart-desc-item')}>
                                <span className={cx('cart-title')}>备注：</span>
                                <span>{prod.remarks}</span>
                            </p>
                        </div>
                    </div>
                    <div className={cx('cart-prod-desc')} dangerouslySetInnerHTML={{
                        __html: prod.text
                    }} />
                </div>
                <div className={cx("cart-menu")}>
                    <AddToCartBtn prod={prod} supplierUserIdEnc={userId}
                                  selfClassName={cx('cart-submit-btn')} callback={this.getCartNum}/>
                    <div className={cx('cart-submit-btn-lst')} onClick={() => {this.quickOrder(userId, prod.code)}}>
                        立即订购
                    </div>
                    <div className={cx('cart-submit-btn-2st')}>
                        <ul>
                            <Link to={`${PROD_PATH}/onlineOrder/companyIntroduce/${userId}`}>
                            <li>
                                <img width={30} height={30} src={custom} />
                                    <p>店铺</p>
                            </li>
                            </Link>
                            <a href={"tel:"+supplierInforList.mallPhone}>
                            <li>
                                <img width={30} height={30} src={phone} />
                                <p>致电商家</p>
                            </li>
                            </a>
                            <Link to={`${PROD_PATH}/onlineOrder/cartList/`}>
                                <li>
                                    <img width={30} height={30} src={shop} />
                                    <span className={cx('circle')}>{cartAmount}</span>
                                    <p>购物车</p>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>

            </div>
        )
    }showTab
}

const mapStateToProps = (state) => ({
    isFetching: state.getIn(['cartDetailReducer', 'onlineOrderCartDetailList', 'isFetching']),
    prodList: state.getIn(['cartDetailReducer', 'onlineOrderCartDetailList', 'prodList']),
    supplier: state.getIn(['cartDetailReducer', 'onlineOrderCartDetailList', 'supplier']),
    cartAmount: state.getIn(['cartDetailReducer', 'onlineOrderCartListOrderList', 'cartAmount']),
    supplierInfor: state.getIn(['cartDetailReducer', 'onlineOrderCartDetailList', 'supplierInfor'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartDetailData:onlineOrderCartDetailActions.asyncFetchCartDetailData,
        asyncFetchProductIsUpdata:onlineOrderCartDetailActions.asyncFetchProductIsUpdata,
        asyncFetchCartCount: onlineOrderCartListOrderListActions.asyncFetchCartCount,
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(CartDetail)
)

