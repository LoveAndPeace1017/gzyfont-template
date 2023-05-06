import React, {Component} from 'react';
import Icon from 'components/widgets/icon';
import {Link} from "react-router-dom";

import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from  'prop-types';

/**
 * 购物车
 *
 * @visibleName ShoppingCart（购物车）
 * @author guozhaodong
 */
class ShoppingCart extends Component {


    render() {
        return (
            <div className={cx("cart-wrap")}>
                <Link to={'/onlineOrder/cartList'}>
                    <Icon type="icon-cart" />
                    <span className={cx('cart-num')}>{this.props.cartAmount}</span>
                </Link>
            </div>
        )
    }
}

export default ShoppingCart