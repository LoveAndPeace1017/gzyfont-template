import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

/**
 * 属性条目
 *
 * @visibleName AttrItem（属性条目）
 * @author guozhaodong
 */
export default class AttrItem extends Component {

    static propTypes = {
        /**
         * 属性名称
         **/
        label: PropTypes.node,
        /**
         * 属性值
         **/
        children: PropTypes.node,
        /**
         * 添加class
         **/
        className: PropTypes.string,
        /**
         * 是否隐藏
         * **/
        isHidden: PropTypes.bool
    };

    static defaultProps = {
        isHidden: false
    };

    render() {
        if(!this.props.isHidden){
            return <div className={cx(['attr-item',this.props.className])}>
                <span className={cx("attr-item-label")}>{this.props.label}：</span>
                <span className={cx("attr-item-content")}>{this.props.children}</span>
            </div>
        }else{
            return null;
        }
    }
}