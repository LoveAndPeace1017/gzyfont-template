import React, {Component} from 'react';
import car from 'images/car.png';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {getCookie} from "utils/cookie";
import {bindActionCreators} from "redux";
import {asyncAddToCart} from '../actions'
import {connect} from "react-redux";
import { Toast } from 'antd-mobile';
import {actions as orderListOrder} from "../../../../pages/onlineOrder/newOrderList";

const cx = classNames.bind(styles);

function withAddToCart(WrappedComponent) {
    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncAddToCart,
            asyncFetchCartCount: orderListOrder.asyncFetchCartCount,
        }, dispatch)
    };

    return connect(null, mapDispatchToProps)(
        class AddToCart extends React.Component{

            //加入购物车
            addToCart = (item, supplierUserIdEnc) => {
                if(getCookie('preview')=='1'){
                    Toast.fail('预览模式无法加入购物车。', 1);
                }else{
                    const params = {
                        supplierCode: item.supplierCode,
                        supplierProductCode: item.supplierProductCode||item.code,
                        supplierUserIdEnc: supplierUserIdEnc,
                        quantity: 1
                    };
                    let _this = this;
                    this.props.asyncAddToCart('add', [params], (res) => {
                        if (res.data.retCode === '0') {
                            Toast.success('操作成功', 1);
                            _this.props.asyncFetchCartCount();
                            if(_this.props.callback){
                                _this.props.callback();
                            }
                        }else {
                            Toast.fail(res.data.retMsg, 1);
                        }
                    })
                }

            };

            render(){
                return <WrappedComponent addToCart={this.addToCart} {...this.props}/>
            }
        }
    )

}

class CartImg extends  Component {

    render(){
        const {prod,supplierUserIdEnc} = this.props;
        return (
            <img width={20} height={20} style={{float:'right'}}
                 src={car} onClick={()=>this.props.addToCart(prod, supplierUserIdEnc)}/>
        );
    }
}

class CartButton extends  Component {

    render(){
        const {prod,supplierUserIdEnc,selfClassName} = this.props;
        return (
            <div className={selfClassName?cx(selfClassName):cx('cart-submit-btn')} onClick={() =>this.props.addToCart(prod, supplierUserIdEnc)}>
                加入购物车
            </div>

        );
    }
}

export default {
    AddToCartImg: withAddToCart(CartImg),
    AddToCartBtn: withAddToCart(CartButton)
}
