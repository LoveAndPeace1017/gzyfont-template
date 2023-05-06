import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message, Button} from "antd";
import {actions as onlineOrderCartListHomeActions} from "../../../../pages/onlineOrder/home";


function withAddToCart(WrappedComponent) {
    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncAddToCart: onlineOrderCartListHomeActions.asyncAddToCart,
            asyncFetchCartCount: onlineOrderCartListHomeActions.asyncFetchCartCount,
        }, dispatch)
    };

    return connect(null, mapDispatchToProps)(
        class AddToCart extends React.Component{

            //加入购物车
            addToCart = (item, supplierUserIdEnc, quantity ,preview) => {
                // 预览模式下不能加入购物车
                if(preview){
                    alert('预览模式下不能加入购物车');
                }else {
                    const params = {
                        supplierCode: item.supplierCode,
                        supplierProductCode: item.supplierProductCode||item.code,
                        supplierUserIdEnc: supplierUserIdEnc,
                        quantity: quantity||1
                    };
                    let _this = this;
                    this.props.asyncAddToCart('add', [params], (res) => {
                        if (res.data.retCode === '0') {
                            message.success('操作成功');
                            _this.props.asyncFetchCartCount();
                            if(_this.props.callback){
                                _this.props.callback();
                            }
                        }
                        else {
                            alert(res.data.retMsg);
                        }
                    });
                }
            };

            render(){
                return <WrappedComponent addToCart={this.addToCart} {...this.props}/>
            }
        }
    )

}


class CartButton extends  Component {

    static defaultProps = {
        type: 'primary'
    };

    render(){
        const {prod,supplierUserIdEnc,selfClassName, quantity,preview} = this.props;
        return (
            <div className={selfClassName}>
                <Button type={this.props.type} onClick={() => this.props.addToCart(prod,supplierUserIdEnc,quantity,preview)}>加入购物车</Button>
            </div>
        );
    }
}

export default {
    AddToCartBtn: withAddToCart(CartButton)
}
