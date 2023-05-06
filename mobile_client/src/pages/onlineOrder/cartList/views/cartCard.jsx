import React, { Component } from 'react';

import { Checkbox, Modal, Toast } from 'antd-mobile';
import ControlAmount from 'components/business/controlAmount';
import {formatCurrency} from 'utils/format';

import {actions as onlineOrderCartActions} from '../index'

import {bindActionCreators} from "redux";
import {connect} from "react-redux";


import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
import prodImg120 from 'images/prodImg120.png';
const alert = Modal.alert;

class CartCard extends Component {
    constructor(props) {
        super(props);
        this.state={
            start: {},
            lastXForMobile: 0,
            containerStyle: {},
            delContainerStyle: {},
            clientCardWidth: document.documentElement.clientWidth - 30
        };
    }

    touchStart = (event) =>  {
        var event = event || window.event;
        this.setState({lastXForMobile: event.changedTouches[0].pageX});
        // 记录开始按下时的点
        var touches = event.touches[0];
        this.setState({
            start: {
                x: touches.pageX, // 横坐标
                y: touches.pageY // 纵坐标
            }
        })
    };

    touchMove = (event, status) => {
        var event = event || window.event;
        const {lastXForMobile, start} = this.state;
        // 计算划动过程中x和y的变化量
        let diffX = event.changedTouches[0].pageX - lastXForMobile;

        var touches = event.touches[0];
        var delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
        };

        // 横向位移大于纵向位移，阻止纵向滚动
        if(Math.abs(delta.x) > Math.abs(delta.y)) {
            event.preventDefault();
        }

        if(diffX >= -40 && status === 1) {
            this.setState({
                containerStyle: {
                    'marginLeft':  '0px',
                    'transitionDuration': '300ms'
                },
                delContainerStyle: {
                    'right': '-2.5rem',
                    'transitionDuration': '300ms'
                }
            })
        }
        if(diffX < -40 && status === 1){
            this.setState({
                containerStyle: {
                    'marginLeft': '-65px',
                    'transitionDuration': '300ms'
                },
                delContainerStyle: {
                    'right': 0,
                    'transitionDuration': '300ms'
                }
            })
        }

    };

    touchEnd = (event, status) =>  {
        var event = event || window.event;
        const {lastXForMobile} = this.state;
        let diffX = event.changedTouches[0].pageX - lastXForMobile;
        if(diffX >= -40 && status === 1) {
            this.setState({
                containerStyle: {
                    'marginLeft':  '0px',
                    'transitionDuration': '300ms'
                },
                delContainerStyle: {
                    'right': '-2.5rem',
                    'transitionDuration': '300ms'
                }
            })
        }
    };

    deleteConfirm = (supplierUserIdEnc, supplierProductCode) => {
        let _this = this;
        alert('提示信息', '您确定要删除商品信息吗？', [
            {text: '取消', onPress: () => {}},
            { text: '确认',
                onPress: () => {
                    const params = {
                        supplierUserIdEnc: supplierUserIdEnc,
                        supplierProductCode: supplierProductCode
                    };
                    _this.props.fetchOnlineOrderCartEditCartData('del',[params],(res)=>{
                        if (res.data.retCode === '0') {
                            Toast.success('操作成功', 1);
                            _this.props.asyncFetchCartData();
                        }else {
                            Toast.fail('res.data.retMsg', 1);
                            alert(res.data.retMsg);
                        }
                    });
                }
            },
        ])
    };

    onChange (val,item, prodIndex, comIndex) {
        let params = {
            quantity: val,
            supplierCode: item.get('supplierCode'),
            supplierProductCode: item.get('supplierProductCode'),
            supplierUserIdEnc: item.get('supplierUserIdEnc'),
        };
        this.props.asyncFetchModifyCartAmount('edit', [params], prodIndex, comIndex);
    };

    clickOneList(comIndex, prodIndex) {
        this.props.fetchOnlineOrderCartClickOneList(comIndex, prodIndex);
    };

    render() {
        let {comIndex, prodIndex, item, status, supplierCode} = this.props;

        return (
            <div className={cx('cart-prod-item')} style={this.state.containerStyle} onTouchStart={() => {this.touchStart()}} onTouchMove={(e)=> {this.touchMove(e, status)}} onTouchEnd={(e) => {this.touchEnd(e, status)}}>
                    <div className={cx('cart-prod-left')}>
                        {
                            status === 1 ? <Checkbox onClick={()=>this.clickOneList(comIndex, prodIndex)} checked={item.get('flag')} style={{'float': 'left','marginTop': '30px'}}/> :
                                status === 2 ? <span className={cx('cart-disabled-btn')}>失效</span> : ''
                        }
                        <a href="#!" className={cx('cart-prod-img')}>
                            <img src={item.get('thumbnailUri') ? item.get('thumbnailUri') : prodImg120} alt=""/>
                        </a>
                    </div>

                    <div className={cx('cart-list')}>
                        <a href="#!" className={cx('cart-prod-name')}>{item.get('prodName')}</a>
                        <p className={cx('cart-prod-desc')}>{status === 3 ? item.get('descItem') : item.get('description')}</p>
                        <div className={cx('cart-prod-price')}>
                            <span className={cx('red')}>¥{status === 3 ? formatCurrency(item.get('unitPrice')) : formatCurrency(item.get('salePrice'))}</span>/{item.get('unit')}
                            <span className={cx('cart-control-num')}>
                                    {
                                        status === 1 ? <ControlAmount onChange={(val) => this.onChange(val, item, prodIndex, comIndex)} amount={item.get('quantity')}/> :
                                            <span className={cx('cart-amount')}>x{item.get('quantity')}</span>
                                    }
                            </span>
                        </div>
                    </div>
                    {
                        status === 1 && (
                            <div className={cx('cart-del-btn')} style={this.state.delContainerStyle} onClick={this.deleteConfirm.bind(this,item.get('supplierUserIdEnc'),item.get('supplierProductCode'))}>
                                删除
                            </div>
                        )
                    }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    onlineOrderCartList: state.getIn(['onlineOrderCartIndex', 'onlineOrderCartList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCartData: onlineOrderCartActions.asyncFetchCartData,
        asyncFetchModifyCartAmount: onlineOrderCartActions.asyncFetchModifyCartAmount,
        fetchOnlineOrderCartClickOneList:onlineOrderCartActions.fetchOnlineOrderCartClickOneList,
        fetchOnlineOrderCartClickAllList:onlineOrderCartActions.fetchOnlineOrderCartClickAllList,
        fetchOnlineOrderCartEditCartData: onlineOrderCartActions.fetchOnlineOrderCartEditCartData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(CartCard)

